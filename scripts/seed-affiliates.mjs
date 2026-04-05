/**
 * Seeds dummy affiliate data for local development and testing.
 *
 * Creates:
 *  - 3 affiliate users  (affiliate1..3@healsend.dev)
 *  - 3 AffiliateApplications: one APPROVED, one PENDING, one REJECTED
 *  - 2 AffiliateLinks attached to the approved partner
 *  - 4 Referrals (mix of PENDING / CONVERTED / REWARDED)
 *  - 2 RewardLedger entries
 *
 * Run:  npm run seed:affiliates
 *       — or —
 *       node scripts/seed-affiliates.mjs
 *
 * Idempotent: uses upsert on unique keys so re-running is safe.
 */

import { createHash, randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(salt + password)
    .digest("hex");
  return `${salt}:${hash}`;
}

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function daysFromNow(n) {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000);
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function main() {
  const passwordHash = hashPassword("Affiliate123!");

  // ── 1. Users ──────────────────────────────
  const [approvedUser, pendingUser, rejectedUser] = await Promise.all([
    prisma.user.upsert({
      where: { email: "affiliate1@healsend.dev" },
      update: { name: "Alice Affiliate", passwordHash },
      create: {
        email: "affiliate1@healsend.dev",
        name: "Alice Affiliate",
        role: "CUSTOMER",
        passwordHash,
      },
    }),
    prisma.user.upsert({
      where: { email: "affiliate2@healsend.dev" },
      update: { name: "Bob Affiliate", passwordHash },
      create: {
        email: "affiliate2@healsend.dev",
        name: "Bob Affiliate",
        role: "CUSTOMER",
        passwordHash,
      },
    }),
    prisma.user.upsert({
      where: { email: "affiliate3@healsend.dev" },
      update: { name: "Carol Affiliate", passwordHash },
      create: {
        email: "affiliate3@healsend.dev",
        name: "Carol Affiliate",
        role: "CUSTOMER",
        passwordHash,
      },
    }),
  ]);
  console.log("✓ Users");

  // ── 2. Sessions (30-day dev tokens) ───────
  await prisma.session.deleteMany({
    where: {
      userId: { in: [approvedUser.id, pendingUser.id, rejectedUser.id] },
    },
  });
  await prisma.session.createMany({
    data: [
      {
        userId: approvedUser.id,
        token: "dev-affiliate1-session-token",
        expiresAt: daysFromNow(30),
      },
      {
        userId: pendingUser.id,
        token: "dev-affiliate2-session-token",
        expiresAt: daysFromNow(30),
      },
      {
        userId: rejectedUser.id,
        token: "dev-affiliate3-session-token",
        expiresAt: daysFromNow(30),
      },
    ],
  });
  console.log("✓ Sessions");

  // ── 3. AffiliateApplications ──────────────

  // APPROVED
  const approvedApp = await prisma.affiliateApplication.upsert({
    where: { userId: approvedUser.id },
    update: {
      status: "APPROVED",
      referralCode: "alice2026",
      totalEarnings: 260,
      pendingPayout: 70,
      approvedAt: daysAgo(14),
    },
    create: {
      userId: approvedUser.id,
      firstName: "Alice",
      lastName: "Affiliate",
      phone: "+15550000001",
      motivation:
        "I run a health & wellness newsletter with 12k subscribers and want to share HealSend with my audience.",
      website: "https://alicewellness.example.com",
      status: "APPROVED",
      referralCode: "alice2026",
      totalEarnings: 260,
      pendingPayout: 70,
      approvedAt: daysAgo(14),
    },
  });

  // PENDING
  await prisma.affiliateApplication.upsert({
    where: { userId: pendingUser.id },
    update: {
      status: "PENDING",
      referralCode: null,
    },
    create: {
      userId: pendingUser.id,
      firstName: "Bob",
      lastName: "Affiliate",
      phone: "+15550000002",
      motivation:
        "I have a YouTube channel focused on biohacking and longevity with 8k subscribers.",
      website: "https://youtube.com/example",
      status: "PENDING",
    },
  });

  // REJECTED
  await prisma.affiliateApplication.upsert({
    where: { userId: rejectedUser.id },
    update: {
      status: "REJECTED",
      rejectionReason: "Content does not align with our brand guidelines.",
    },
    create: {
      userId: rejectedUser.id,
      firstName: "Carol",
      lastName: "Affiliate",
      phone: "+15550000003",
      motivation: "I want to share links on social media.",
      status: "REJECTED",
      rejectionReason: "Content does not align with our brand guidelines.",
    },
  });

  console.log("✓ AffiliateApplications (APPROVED / PENDING / REJECTED)");

  // ── 4. AffiliateLinks ─────────────────────
  const mainLink = await prisma.affiliateLink.upsert({
    where: { code: "alice2026" },
    update: {
      name: "Alice – Homepage",
      destinationPath: "/",
      payoutType: "FIXED",
      payoutAmount: 50,
      isActive: true,
      campaignName: "Newsletter Q2 2026",
      clickCount: 47,
      applicationId: approvedApp.id,
    },
    create: {
      code: "alice2026",
      name: "Alice – Homepage",
      destinationPath: "/",
      payoutType: "FIXED",
      payoutAmount: 50,
      isActive: true,
      campaignName: "Newsletter Q2 2026",
      clickCount: 47,
      applicationId: approvedApp.id,
    },
  });

  const tirzLink = await prisma.affiliateLink.upsert({
    where: { code: "alice-tirz" },
    update: {
      name: "Alice – Tirzepatide Page",
      destinationPath: "/products/tirzepatide-injections",
      payoutType: "FIXED",
      payoutAmount: 50,
      isActive: true,
      campaignName: "Tirzepatide Promo",
      clickCount: 23,
      applicationId: approvedApp.id,
    },
    create: {
      code: "alice-tirz",
      name: "Alice – Tirzepatide Page",
      destinationPath: "/products/tirzepatide-injections",
      payoutType: "FIXED",
      payoutAmount: 50,
      isActive: true,
      campaignName: "Tirzepatide Promo",
      clickCount: 23,
      applicationId: approvedApp.id,
    },
  });

  console.log("✓ AffiliateLinks");

  // ── 5. Referrals ──────────────────────────

  // Need a couple of referred users; reuse existing dev accounts or create them
  const referredUser1 = await prisma.user.upsert({
    where: { email: "referred1@healsend.dev" },
    update: { name: "Referred One" },
    create: {
      email: "referred1@healsend.dev",
      name: "Referred One",
      role: "CUSTOMER",
      passwordHash: hashPassword("Referred123!"),
    },
  });

  const referredUser2 = await prisma.user.upsert({
    where: { email: "referred2@healsend.dev" },
    update: { name: "Referred Two" },
    create: {
      email: "referred2@healsend.dev",
      name: "Referred Two",
      role: "CUSTOMER",
      passwordHash: hashPassword("Referred123!"),
    },
  });

  // Delete and recreate referrals for idempotency (no unique key to upsert on)
  await prisma.referral.deleteMany({
    where: {
      referrerId: approvedUser.id,
      linkId: { in: [mainLink.id, tirzLink.id] },
    },
  });

  const [ref1, ref2, ref3, ref4] = await prisma.$transaction([
    // REWARDED – fully converted + reward issued
    prisma.referral.create({
      data: {
        linkId: mainLink.id,
        referrerId: approvedUser.id,
        referredUserId: referredUser1.id,
        status: "REWARDED",
        ipHash:
          "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        userAgent: "Mozilla/5.0 (seed)",
        convertedAt: daysAgo(10),
        expiresAt: daysFromNow(20),
        createdAt: daysAgo(25),
      },
    }),
    // CONVERTED – converted, reward pending admin approval
    prisma.referral.create({
      data: {
        linkId: mainLink.id,
        referrerId: approvedUser.id,
        referredUserId: referredUser2.id,
        status: "CONVERTED",
        ipHash:
          "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
        userAgent: "Mozilla/5.0 (seed)",
        convertedAt: daysAgo(3),
        expiresAt: daysFromNow(27),
        createdAt: daysAgo(5),
      },
    }),
    // PENDING – clicked tirzepatide link, not yet converted
    prisma.referral.create({
      data: {
        linkId: tirzLink.id,
        referrerId: approvedUser.id,
        referredUserId: null,
        status: "PENDING",
        ipHash:
          "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
        userAgent: "Mozilla/5.0 (seed)",
        convertedAt: null,
        expiresAt: daysFromNow(15),
        createdAt: daysAgo(15),
      },
    }),
    // EXPIRED – never converted within the window
    prisma.referral.create({
      data: {
        linkId: tirzLink.id,
        referrerId: approvedUser.id,
        referredUserId: null,
        status: "EXPIRED",
        ipHash:
          "d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5",
        userAgent: "Mozilla/5.0 (seed)",
        convertedAt: null,
        expiresAt: daysAgo(5),
        createdAt: daysAgo(35),
      },
    }),
  ]);

  console.log("✓ Referrals (REWARDED, CONVERTED, PENDING, EXPIRED)");

  // ── 6. RewardLedger ───────────────────────
  // ref1 → PAID reward
  await prisma.rewardLedger.upsert({
    where: { referralId: ref1.id },
    update: {
      userId: approvedUser.id,
      rewardAmount: 50,
      status: "PAID",
      notes: "Tirzepatide 1-Month Plan referral",
      paidAt: daysAgo(8),
    },
    create: {
      userId: approvedUser.id,
      referralId: ref1.id,
      rewardAmount: 50,
      status: "PAID",
      notes: "Tirzepatide 1-Month Plan referral",
      paidAt: daysAgo(8),
    },
  });

  // ref2 → PENDING reward (awaiting approval)
  await prisma.rewardLedger.upsert({
    where: { referralId: ref2.id },
    update: {
      userId: approvedUser.id,
      rewardAmount: 50,
      status: "PENDING",
      notes: "Semaglutide 1-Month Plan referral",
    },
    create: {
      userId: approvedUser.id,
      referralId: ref2.id,
      rewardAmount: 50,
      status: "PENDING",
      notes: "Semaglutide 1-Month Plan referral",
    },
  });

  console.log("✓ RewardLedger (PAID + PENDING)");

  console.log("\n─────────────────────────────────────────");
  console.log("Affiliate test accounts:");
  console.log("  APPROVED  affiliate1@healsend.dev  / Affiliate123!");
  console.log("  PENDING   affiliate2@healsend.dev  / Affiliate123!");
  console.log("  REJECTED  affiliate3@healsend.dev  / Affiliate123!");
  console.log("\nDev session tokens (set cookie manually or login):");
  console.log("  affiliate1  →  dev-affiliate1-session-token");
  console.log("  affiliate2  →  dev-affiliate2-session-token");
  console.log("  affiliate3  →  dev-affiliate3-session-token");
  console.log("\nShare links:");
  console.log("  http://localhost:3000/?ref=alice2026");
  console.log(
    "  http://localhost:3000/products/tirzepatide-injections?ref=alice-tirz",
  );
  console.log("─────────────────────────────────────────\n");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
