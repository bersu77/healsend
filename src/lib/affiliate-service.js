/**
 * affiliate-service.js
 *
 * Core service layer for the affiliate referral + reward system.
 * All database interactions for AffiliateLink, Referral, and RewardLedger
 * are encapsulated here. Route handlers call these functions — never prisma directly.
 *
 * Reward calculation is intentionally kept pluggable:
 *   - Override REWARD_POLICIES at runtime via env vars or DB config.
 *   - calculateReward() can be replaced without touching route handlers.
 */

// Uses globalThis.crypto (Web Crypto API) — compatible with Node 18+, Edge Runtime, and browsers.

function randomHex(bytes) {
  const arr = globalThis.crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

import { prisma } from "@/lib/prisma";
import {
  REFERRAL_COOKIE_NAME,
  REFERRAL_COOKIE_TTL,
} from "@/lib/affiliate-constants";

// Re-export so callers only need one import
export { REFERRAL_COOKIE_NAME, REFERRAL_COOKIE_TTL };

/** Minimum seconds between a click and conversion before we allow reward. */
const MIN_CONVERSION_DELAY_MS = 5_000;

// ── Reward policy (pluggable) ──────────────────────────────────────────────────

/**
 * Built-in reward policies keyed by product/plan slug.
 * Admin can override per-link with payoutType + payoutAmount on AffiliateLink.
 * For percentage payouts the order total is passed as `orderTotal`.
 *
 * Override via: AFFILIATE_REWARD_POLICIES env var (JSON string).
 */
function getDefaultRewardPolicies() {
  const envPolicies = process.env.AFFILIATE_REWARD_POLICIES;
  if (envPolicies) {
    try {
      return JSON.parse(envPolicies);
    } catch {
      // fall through to built-in defaults
    }
  }
  return {
    default: { type: "FIXED", amount: 35 },
  };
}

/**
 * Calculate the reward amount for a given conversion.
 *
 * @param {object} params
 * @param {import("@prisma/client").AffiliateLink} params.link - the affiliate link used
 * @param {number} [params.orderTotal] - order total (needed for PERCENTAGE payouts)
 * @returns {number} reward amount in dollars (rounded to 2 decimal places)
 */
export function calculateReward({ link, orderTotal = 0 }) {
  if (!link) return 0;

  if (link.payoutType === "PERCENTAGE") {
    const pct = Math.max(0, Math.min(100, link.payoutAmount));
    return Math.round(((orderTotal * pct) / 100) * 100) / 100;
  }

  // FIXED (default)
  const policies = getDefaultRewardPolicies();
  const base = policies.default?.amount ?? 35;
  return link.payoutAmount > 0 ? link.payoutAmount : base;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Hash an IP address with SHA-256 so we never store raw IPs. */
async function hashIp(ip) {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "hs_ip_salt_v1";
  const encoded = new TextEncoder().encode(salt + ip);
  const buf = await globalThis.crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Generate a secure random affiliate code (URL-safe, 10 chars). */
export function generateAffiliateCode() {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(8));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
    .slice(0, 10);
}

/** Normalise a code: lowercase, strip non-alphanumeric except - and _. */
export function normaliseCode(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

// ── AffiliateLink CRUD ─────────────────────────────────────────────────────────

/**
 * Create a new affiliate link in the database.
 *
 * @param {object} data
 * @param {string} data.name
 * @param {string} [data.code]           auto-generated if omitted
 * @param {string} [data.destinationPath]
 * @param {"FIXED"|"PERCENTAGE"} [data.payoutType]
 * @param {number} [data.payoutAmount]
 * @param {string} [data.applicationId]  link to an AffiliateApplication
 * @param {string} [data.campaignName]
 * @param {string} [data.notes]
 */
export async function createAffiliateLink({
  name,
  code,
  destinationPath = "/",
  payoutType = "FIXED",
  payoutAmount = 35,
  applicationId = null,
  campaignName = null,
  notes = "",
}) {
  const finalCode = normaliseCode(code || generateAffiliateCode());

  if (!finalCode) throw new Error("Affiliate code is required.");
  if (!name?.trim()) throw new Error("Affiliate name is required.");

  // Guard duplicate codes
  const existing = await prisma.affiliateLink.findUnique({
    where: { code: finalCode },
  });
  if (existing) throw new Error(`Code "${finalCode}" is already in use.`);

  return prisma.affiliateLink.create({
    data: {
      code: finalCode,
      name: name.trim(),
      destinationPath: String(destinationPath || "/").trim() || "/",
      payoutType,
      payoutAmount: Number(payoutAmount) > 0 ? Number(payoutAmount) : 35,
      applicationId: applicationId || null,
      campaignName: campaignName ? String(campaignName).trim() : null,
      notes: notes ? String(notes).trim() : null,
      isActive: true,
    },
    include: {
      application: {
        select: {
          id: true,
          referralCode: true,
          userId: true,
          user: { select: { id: true, email: true, name: true } },
        },
      },
    },
  });
}

/** List all affiliate links (admin view). */
export async function listAffiliateLinks({ includeInactive = false } = {}) {
  return prisma.affiliateLink.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      application: {
        select: {
          id: true,
          userId: true,
          referralCode: true,
          user: { select: { id: true, email: true, name: true } },
        },
      },
      _count: { select: { referrals: true } },
    },
  });
}

/** Update an affiliate link by id. */
export async function updateAffiliateLink({ id, patch }) {
  const link = await prisma.affiliateLink.findUnique({ where: { id } });
  if (!link) throw new Error("Affiliate link not found.");

  if (patch.code !== undefined) {
    const nextCode = normaliseCode(patch.code);
    if (!nextCode) throw new Error("Affiliate code cannot be blank.");
    const conflict = await prisma.affiliateLink.findFirst({
      where: { code: nextCode, NOT: { id } },
    });
    if (conflict) throw new Error(`Code "${nextCode}" is already in use.`);
    patch = { ...patch, code: nextCode };
  }

  return prisma.affiliateLink.update({
    where: { id },
    data: {
      name: patch.name !== undefined ? String(patch.name).trim() : undefined,
      code: patch.code !== undefined ? patch.code : undefined,
      destinationPath:
        patch.destinationPath !== undefined
          ? String(patch.destinationPath).trim()
          : undefined,
      payoutType: patch.payoutType !== undefined ? patch.payoutType : undefined,
      payoutAmount:
        patch.payoutAmount !== undefined
          ? Number(patch.payoutAmount)
          : undefined,
      isActive:
        patch.isActive !== undefined ? Boolean(patch.isActive) : undefined,
      campaignName:
        patch.campaignName !== undefined
          ? String(patch.campaignName || "").trim() || null
          : undefined,
      notes:
        patch.notes !== undefined
          ? String(patch.notes || "").trim() || null
          : undefined,
      applicationId:
        patch.applicationId !== undefined
          ? patch.applicationId || null
          : undefined,
    },
    include: {
      application: {
        select: {
          id: true,
          userId: true,
          referralCode: true,
          user: { select: { id: true, email: true, name: true } },
        },
      },
      _count: { select: { referrals: true } },
    },
  });
}

/** Delete an affiliate link by id. */
export async function deleteAffiliateLink(id) {
  const link = await prisma.affiliateLink.findUnique({ where: { id } });
  if (!link) throw new Error("Affiliate link not found.");
  await prisma.affiliateLink.delete({ where: { id } });
}

/** Resolve an affiliate link by its ?ref= code. Returns null if not found or inactive. */
export async function resolveAffiliateLinkByCode(code) {
  const normalised = normaliseCode(code);
  if (!normalised) return null;
  return prisma.affiliateLink.findFirst({
    where: { code: normalised, isActive: true },
    include: {
      application: { select: { id: true, userId: true } },
    },
  });
}

// ── Referral CRUD ──────────────────────────────────────────────────────────────

/**
 * Create a pending Referral when a visitor lands via an affiliate link.
 * Safe to call multiple times — returns the existing referral if one already
 * exists for this link + IP hash (deduplication within the TTL window).
 *
 * @param {object} params
 * @param {string} params.linkId
 * @param {string} params.referrerId - affiliate user id
 * @param {string} [params.ip]
 * @param {string} [params.userAgent]
 * @returns {Promise<import("@prisma/client").Referral>}
 */
export async function createOrRefreshReferral({
  linkId,
  referrerId,
  ip,
  userAgent,
}) {
  const ipHash = await hashIp(ip);
  const expiresAt = new Date(Date.now() + REFERRAL_COOKIE_TTL * 1000);

  // Increment click count on the link
  await prisma.affiliateLink
    .update({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } },
    })
    .catch(() => {}); // non-critical

  // Check for an existing PENDING referral from the same visitor / link within TTL
  if (ipHash) {
    const existing = await prisma.referral.findFirst({
      where: {
        linkId,
        ipHash,
        status: "PENDING",
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
    if (existing) {
      // Extend expiry on repeat visit
      return prisma.referral.update({
        where: { id: existing.id },
        data: { expiresAt, updatedAt: new Date() },
      });
    }
  }

  return prisma.referral.create({
    data: {
      linkId,
      referrerId,
      status: "PENDING",
      ipHash,
      userAgent: userAgent ? String(userAgent).slice(0, 500) : null,
      expiresAt,
    },
  });
}

/**
 * Mark a referral as CONVERTED when the referred user signs up / purchases.
 * Anti-fraud:
 *  - Prevents self-referral (referrer === referred user)
 *  - Prevents duplicate conversions on the same referred user
 *  - Respects cookie TTL expiry
 *  - Requires minimum delay between creation and conversion
 *
 * @param {object} params
 * @param {string} params.referralId - from the referral cookie value
 * @param {string} params.referredUserId - the newly created user
 * @param {number} [params.orderTotal]   - for PERCENTAGE payouts
 * @returns {Promise<{ referral: object, reward: object|null }>}
 */
export async function convertReferral({
  referralId,
  referredUserId,
  orderTotal = 0,
}) {
  const referral = await prisma.referral.findUnique({
    where: { id: referralId },
    include: { link: true },
  });

  if (!referral) return { referral: null, reward: null };

  // Already converted/rewarded — idempotent
  if (referral.status === "CONVERTED" || referral.status === "REWARDED") {
    return { referral, reward: null };
  }

  // Expired
  if (referral.expiresAt < new Date()) {
    await prisma.referral.update({
      where: { id: referralId },
      data: { status: "EXPIRED" },
    });
    return { referral: null, reward: null };
  }

  // Self-referral guard
  if (referral.referrerId === referredUserId) {
    await prisma.referral.update({
      where: { id: referralId },
      data: { status: "INVALID" },
    });
    return { referral: null, reward: null };
  }

  // Duplicate referred-user guard (one referral reward per new user)
  const alreadyConverted = await prisma.referral.findFirst({
    where: {
      referredUserId,
      status: { in: ["CONVERTED", "REWARDED"] },
    },
  });
  if (alreadyConverted) return { referral: null, reward: null };

  // Minimum delay check (prevent bot-speed signups)
  const elapsedMs = Date.now() - referral.createdAt.getTime();
  if (elapsedMs < MIN_CONVERSION_DELAY_MS) {
    return { referral: null, reward: null };
  }

  // Mark converted
  const converted = await prisma.referral.update({
    where: { id: referralId },
    data: {
      referredUserId,
      status: "CONVERTED",
      convertedAt: new Date(),
    },
    include: { link: true },
  });

  // Issue reward
  const rewardAmount = calculateReward({ link: converted.link, orderTotal });
  let reward = null;

  if (rewardAmount > 0) {
    reward = await prisma.rewardLedger.create({
      data: {
        userId: referral.referrerId,
        referralId: converted.id,
        rewardAmount,
        status: "PENDING",
      },
    });

    // Update aggregate totals on the application (if linked)
    if (converted.link.applicationId) {
      await prisma.affiliateApplication
        .update({
          where: { id: converted.link.applicationId },
          data: { pendingPayout: { increment: rewardAmount } },
        })
        .catch(() => {});
    }
  }

  return { referral: converted, reward };
}

// ── Reward management (admin) ──────────────────────────────────────────────────

/** Approve a reward (admin action). */
export async function approveReward(rewardId) {
  return prisma.rewardLedger.update({
    where: { id: rewardId },
    data: { status: "APPROVED" },
  });
}

/** Mark a reward as paid (admin action). */
export async function markRewardPaid(rewardId) {
  const reward = await prisma.rewardLedger.findUnique({
    where: { id: rewardId },
  });
  if (!reward) throw new Error("Reward not found.");

  const updated = await prisma.rewardLedger.update({
    where: { id: rewardId },
    data: { status: "PAID", paidAt: new Date() },
  });

  // Move from pendingPayout to totalEarnings on the application
  const referral = await prisma.referral.findUnique({
    where: { id: reward.referralId },
    include: { link: { select: { applicationId: true } } },
  });
  if (referral?.link?.applicationId) {
    await prisma.affiliateApplication
      .update({
        where: { id: referral.link.applicationId },
        data: {
          pendingPayout: { decrement: reward.rewardAmount },
          totalEarnings: { increment: reward.rewardAmount },
        },
      })
      .catch(() => {});
  }

  return updated;
}

/** Reject a reward (admin action). */
export async function rejectReward(rewardId, reason = "") {
  return prisma.rewardLedger.update({
    where: { id: rewardId },
    data: { status: "REJECTED", notes: reason || null },
  });
}

// ── Affiliate Application management ──────────────────────────────────────────

/**
 * Approve an affiliate application.
 * Auto-generates a referralCode if not already set, and creates the canonical
 * AffiliateLink tied to this application.
 */
export async function approveAffiliateApplication(applicationId) {
  const app = await prisma.affiliateApplication.findUnique({
    where: { id: applicationId },
    include: { user: { select: { id: true, email: true, name: true } } },
  });
  if (!app) throw new Error("Application not found.");
  if (app.status === "APPROVED") return app;

  // Generate unique referral code from name/email
  const base = normaliseCode(
    app.user.name || app.user.email.split("@")[0],
  ).slice(0, 15);
  let code = base || generateAffiliateCode();

  // Ensure uniqueness
  const conflict = await prisma.affiliateLink.findUnique({ where: { code } });
  if (conflict) code = `${code}-${randomHex(3)}`;

  // Check AffiliateApplication referralCode uniqueness
  const appConflict = await prisma.affiliateApplication.findUnique({
    where: { referralCode: code },
  });
  if (appConflict && appConflict.id !== applicationId) {
    code = `${code}-${randomHex(3)}`;
  }

  const [updatedApp] = await prisma.$transaction([
    prisma.affiliateApplication.update({
      where: { id: applicationId },
      data: {
        status: "APPROVED",
        referralCode: app.referralCode || code,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    }),
    // Create the default AffiliateLink for this affiliate
    prisma.affiliateLink.upsert({
      where: { code: app.referralCode || code },
      create: {
        code: app.referralCode || code,
        name: app.user.name || app.user.email,
        applicationId,
        destinationPath: "/",
        payoutType: "FIXED",
        payoutAmount: 35,
        isActive: true,
        notes: "Auto-generated on approval",
      },
      update: { applicationId, isActive: true },
    }),
  ]);

  return updatedApp;
}

/** Reject an affiliate application. */
export async function rejectAffiliateApplication(applicationId, reason = "") {
  const app = await prisma.affiliateApplication.findUnique({
    where: { id: applicationId },
  });
  if (!app) throw new Error("Application not found.");
  return prisma.affiliateApplication.update({
    where: { id: applicationId },
    data: {
      status: "REJECTED",
      rejectionReason: reason || null,
      approvedAt: null,
    },
  });
}

// ── Dashboard stats ────────────────────────────────────────────────────────────

/**
 * Returns summary stats for an approved affiliate's partner dashboard.
 *
 * @param {string} userId - the affiliate's user id
 */
export async function getAffiliateDashboardStats(userId) {
  const application = await prisma.affiliateApplication.findUnique({
    where: { userId },
    select: {
      id: true,
      status: true,
      referralCode: true,
      totalEarnings: true,
      pendingPayout: true,
      approvedAt: true,
      affiliateLinks: {
        where: { isActive: true },
        select: {
          id: true,
          code: true,
          name: true,
          destinationPath: true,
          clickCount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!application || application.status !== "APPROVED") {
    return { application: application || null, links: [], stats: null };
  }

  const [referrals, rewards] = await Promise.all([
    prisma.referral.findMany({
      where: { referrerId: userId },
      select: {
        id: true,
        status: true,
        convertedAt: true,
        createdAt: true,
        referredUser: {
          select: { id: true, email: true, name: true, createdAt: true },
        },
        link: { select: { id: true, code: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.rewardLedger.findMany({
      where: { userId },
      select: {
        id: true,
        rewardAmount: true,
        status: true,
        createdAt: true,
        paidAt: true,
      },
    }),
  ]);

  const totalClicks = application.affiliateLinks.reduce(
    (sum, l) => sum + l.clickCount,
    0,
  );
  const totalReferrals = referrals.length;
  const conversions = referrals.filter(
    (r) => r.status === "CONVERTED" || r.status === "REWARDED",
  );
  const conversionRate =
    totalReferrals > 0
      ? Math.round((conversions.length / totalReferrals) * 100)
      : 0;

  return {
    application,
    links: application.affiliateLinks,
    stats: {
      totalClicks,
      totalReferrals,
      conversions: conversions.length,
      conversionRate,
      totalEarnings: application.totalEarnings,
      pendingPayout: application.pendingPayout,
    },
    referrals,
    rewards,
  };
}

/**
 * Build the full affiliate marketing + referral summary for the admin dashboard.
 * Extends the existing buildAffiliateDashboardSummary from affiliate-tracking.js.
 */
export async function buildAdminAffiliateSummary() {
  const [applications, links, referrals, rewards] = await Promise.all([
    prisma.affiliateApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, email: true, name: true } } },
    }),
    prisma.affiliateLink.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { referrals: true } },
        application: {
          select: {
            id: true,
            userId: true,
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
    }),
    prisma.referral.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        referredUser: { select: { id: true, email: true, name: true } },
        link: { select: { id: true, code: true, name: true } },
      },
    }),
    prisma.rewardLedger.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        user: { select: { id: true, email: true, name: true } },
        referral: { select: { id: true, status: true, convertedAt: true } },
      },
    }),
  ]);

  const pendingApps = applications.filter((a) => a.status === "PENDING").length;
  const approvedAffiliates = applications.filter(
    (a) => a.status === "APPROVED",
  ).length;
  const totalConversions = referrals.filter(
    (r) => r.status === "CONVERTED" || r.status === "REWARDED",
  ).length;
  const totalPendingRewards = rewards
    .filter((r) => r.status === "PENDING" || r.status === "APPROVED")
    .reduce((sum, r) => sum + r.rewardAmount, 0);
  const totalPaidRewards = rewards
    .filter((r) => r.status === "PAID")
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  return {
    applications,
    links,
    referrals,
    rewards,
    summary: {
      pendingApps,
      approvedAffiliates,
      totalLinks: links.length,
      totalConversions,
      totalPendingRewards: Math.round(totalPendingRewards * 100) / 100,
      totalPaidRewards: Math.round(totalPaidRewards * 100) / 100,
    },
  };
}
