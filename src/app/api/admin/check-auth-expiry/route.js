import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

const AUTH_WARNING_DAYS = 4; // Warn when auth is older than this many days
const AUTH_EXPIRY_DAYS = 7; // Stripe authorizations expire after 7 days

/**
 * GET /api/admin/check-auth-expiry
 *
 * Reports orders with active Stripe authorization holds that are approaching
 * or have passed the 7-day expiry window.
 *
 * Warning threshold: 4 days (so action can be taken within the remaining 3)
 * Critical threshold: 6 days (< 24h left to capture)
 *
 * This route is designed to be polled daily (e.g. via cron or Vercel Cron Jobs).
 *
 * Returns a JSON report — does NOT automatically capture or cancel.
 */
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();

  const warningThreshold = new Date(
    now.getTime() - AUTH_WARNING_DAYS * 24 * 60 * 60 * 1000,
  );
  const criticalThreshold = new Date(
    now.getTime() - (AUTH_EXPIRY_DAYS - 1) * 24 * 60 * 60 * 1000,
  );

  // Orders with an auth hold that has been open for >= 4 days
  const atRiskOrders = await prisma.order.findMany({
    where: {
      paymentCapturedAt: null,
      stripePaymentId: { not: null },
      stripePaymentStatus: "requires_capture",
      status: { notIn: ["CANCELLED", "REFUNDED"] },
      // Use authCreatedAt if populated, otherwise fall back to order.createdAt
      OR: [
        { authCreatedAt: { lte: warningThreshold } },
        {
          authCreatedAt: null,
          createdAt: { lte: warningThreshold },
        },
      ],
    },
    select: {
      id: true,
      orderNumber: true,
      userId: true,
      total: true,
      stripePaymentId: true,
      stripePaymentStatus: true,
      authCreatedAt: true,
      createdAt: true,
      status: true,
      telehealthProvider: true,
      olaStatus: true,
      consultationStatus: true,
      mdiWorkflowPhase: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const annotated = atRiskOrders.map((order) => {
    const authAt = order.authCreatedAt || order.createdAt;
    const ageMs = now.getTime() - authAt.getTime();
    const ageDays = ageMs / (24 * 60 * 60 * 1000);
    const isCritical = authAt <= criticalThreshold;

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      total: order.total,
      stripePaymentId: order.stripePaymentId,
      authCreatedAt: authAt.toISOString(),
      authAgeDays: Math.round(ageDays * 10) / 10,
      expiresInDays: Math.round((AUTH_EXPIRY_DAYS - ageDays) * 10) / 10,
      severity: isCritical ? "critical" : "warning",
      status: order.status,
      telehealthProvider: order.telehealthProvider,
      consultationStatus:
        order.olaStatus ||
        order.consultationStatus ||
        order.mdiWorkflowPhase ||
        null,
    };
  });

  const critical = annotated.filter((o) => o.severity === "critical");
  const warnings = annotated.filter((o) => o.severity === "warning");

  return NextResponse.json({
    checkedAt: now.toISOString(),
    summary: {
      total: annotated.length,
      critical: critical.length,
      warning: warnings.length,
    },
    critical,
    warnings,
  });
}
