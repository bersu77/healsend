import { getCurrentUser } from "@/lib/auth";
import {
  buildMdiMessageSeed,
  findMdiPatientByEmail,
  getMdiAccessToken,
  getMdiConfig,
  getMdiMessagingAuth,
  getMdiPatientVouchers,
  normalizeMdiPayload,
  upsertMdiCaseSnapshot,
} from "@/lib/mdi-client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "").trim(),
  );
}

/**
 * POST /api/account/mdi/sync
 *
 * Authenticated endpoint (session cookie). Pulls live data from MD Integrations
 * for the current user and persists it to the local DB:
 *   - Ensures mdiPatientId is stored on the user
 *   - Syncs patient vouchers → MdiCaseSnapshot rows
 *   - Seeds Message rows from case-level events
 *   - Returns fresh caseSnapshots, messages, and optionally a messagingAuthUrl
 */
export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, clientSecret } = getMdiConfig();
  const isPlaceholder = (v) => !v || v.toUpperCase().includes("REPLACE_ME");
  if (isPlaceholder(clientId) || isPlaceholder(clientSecret)) {
    return NextResponse.json(
      { error: "MDI credentials not configured" },
      { status: 503 },
    );
  }

  let accessToken;
  try {
    accessToken = await getMdiAccessToken({ clientId, clientSecret });
  } catch {
    return NextResponse.json(
      { error: "Failed to obtain MDI access token" },
      { status: 502 },
    );
  }

  // ── 1. Ensure we have the patient ID ────────────────────────────────────────
  let patientId = isValidUuid(user.mdiPatientId) ? user.mdiPatientId : null;

  if (!patientId && user.email) {
    try {
      patientId = await findMdiPatientByEmail({
        email: user.email,
        accessToken,
      });
    } catch {
      // Non-fatal — continue without patient ID
    }
  }

  if (patientId && patientId !== user.mdiPatientId) {
    await prisma.user.updateMany({
      where: { id: user.id, mdiPatientId: null },
      data: { mdiPatientId: patientId, mdiLastSyncedAt: new Date() },
    });
  }

  // ── 2. Fetch vouchers → sync case snapshots ──────────────────────────────────
  let syncedSnapshotCount = 0;
  let messagingAuthUrl = null;
  let messagingVerificationCode = null;

  if (patientId) {
    // Get messaging portal URL
    try {
      const auth = await getMdiMessagingAuth({
        accessToken,
        patientId,
      });
      messagingAuthUrl = auth.consultationUrl || null;
      messagingVerificationCode = auth.verificationCode || null;
    } catch {
      // Non-fatal
    }

    // Get vouchers / cases
    let vouchers = [];
    try {
      vouchers = await getMdiPatientVouchers({ patientId, accessToken });
    } catch {
      // Non-fatal
    }

    // Resolve user's orders so we can link case snapshots
    const userOrders = await prisma.order.findMany({
      where: { userId: user.id },
      select: { id: true, userId: true, mdiCaseId: true, mdiOrderId: true },
    });

    for (const voucher of vouchers) {
      if (!voucher || typeof voucher !== "object") continue;

      const normalized = normalizeMdiPayload({
        ...voucher,
        patient_id: patientId,
        event_type: voucher.event_type || voucher.eventType || "voucher_sync",
      });

      if (!normalized.caseId) continue;

      // Try to match an existing order
      const matchedOrder =
        userOrders.find(
          (o) =>
            (normalized.mdiOrderId && o.mdiOrderId === normalized.mdiOrderId) ||
            (normalized.caseId && o.mdiCaseId === normalized.caseId),
        ) || null;

      try {
        await prisma.$transaction(async (tx) => {
          const snapshot = await upsertMdiCaseSnapshot(tx, normalized, {
            order: matchedOrder,
            userId: user.id,
          });

          if (!snapshot) return;

          // Seed a message for significant events
          const messageSeed = buildMdiMessageSeed(
            normalized,
            matchedOrder,
            snapshot,
          );
          if (messageSeed) {
            const alreadyExists = await tx.message.findFirst({
              where: {
                userId: user.id,
                subject: messageSeed.subject,
                // Deduplicate within a 1-minute window
                createdAt: {
                  gte: new Date(Date.now() - 60 * 1000),
                },
              },
            });
            if (!alreadyExists) {
              await tx.message.create({
                data: {
                  userId: user.id,
                  subject: messageSeed.subject,
                  body: messageSeed.body,
                  fromAdmin: true,
                },
              });
            }
          }
        });
        syncedSnapshotCount++;
      } catch {
        // Skip bad vouchers
      }
    }
  }

  // ── 3. Return fresh data ─────────────────────────────────────────────────────
  const [freshSnapshots, freshMessages, freshOrders] = await Promise.all([
    prisma.mdiCaseSnapshot.findMany({
      where: { userId: user.id },
      orderBy: [{ updatedAt: "desc" }, { latestEventAt: "desc" }],
    }),
    prisma.message.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true, subscriptionTiers: true },
            },
            variant: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    patientId: patientId || null,
    syncedSnapshotCount,
    messagingAuthUrl,
    messagingVerificationCode,
    caseSnapshots: JSON.parse(JSON.stringify(freshSnapshots)),
    messages: JSON.parse(JSON.stringify(freshMessages)),
    orders: JSON.parse(JSON.stringify(freshOrders)),
  });
}
