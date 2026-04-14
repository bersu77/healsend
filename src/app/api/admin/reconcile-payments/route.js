import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { captureOrRetryOrderPayment } from "@/lib/stripe-payment-workflow";
import { getOrderFulfillmentAssessment } from "@/lib/order-workflow";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/reconcile-payments
 *
 * Scans for orders where:
 *   - Payment is authorized (stripePaymentStatus = "requires_capture") OR
 *     the auth has expired but a retry hasn't been exhausted (paymentRetryCount < 3)
 *   - Medical review is complete (fulfillment assessment says medicallyReady)
 *   - Payment has NOT been captured yet (paymentCapturedAt is null)
 *
 * For each matching order, attempts captureOrRetryOrderPayment().
 *
 * Query params:
 *   dryRun=true  — scan and report without actually capturing
 *   limit=N      — max orders to process in one run (default 50)
 */
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get("dryRun") === "true";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);

  // Find orders that are awaiting capture
  const candidates = await prisma.order.findMany({
    where: {
      paymentCapturedAt: null,
      stripePaymentId: { not: null },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
      paymentRetryCount: { lt: 3 },
      OR: [
        { stripePaymentStatus: "requires_capture" },
        { stripePaymentStatus: "payment_failed" },
      ],
    },
    include: {
      mdiCaseSnapshots: {
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  const results = [];

  for (const order of candidates) {
    const caseSnapshot = order.mdiCaseSnapshots?.[0] ?? null;
    const assessment = getOrderFulfillmentAssessment(order, caseSnapshot);

    const entry = {
      orderId: order.id,
      stripePaymentStatus: order.stripePaymentStatus,
      paymentRetryCount: order.paymentRetryCount,
      medicallyReady: assessment.medicallyReady ?? false,
      paymentAuthorized: assessment.paymentAuthorized ?? false,
      action: null,
      result: null,
    };

    if (!assessment.medicallyReady) {
      entry.action = "skipped_not_medically_ready";
      results.push(entry);
      continue;
    }

    entry.action = dryRun ? "dry_run_would_capture" : "capture_attempted";

    if (!dryRun) {
      try {
        const captureResult = await captureOrRetryOrderPayment(order, {
          reason: "reconciliation",
        });
        entry.result = captureResult.status;
      } catch (err) {
        entry.result = "error";
        entry.error = err instanceof Error ? err.message : String(err);
      }
    }

    results.push(entry);
  }

  const summary = {
    total: candidates.length,
    medicallyReady: results.filter((r) => r.medicallyReady).length,
    skipped: results.filter((r) => r.action?.startsWith("skipped")).length,
    attempted: results.filter((r) => r.action === "capture_attempted").length,
    captured: results.filter((r) => r.result === "captured").length,
    alreadyCaptured: results.filter((r) => r.result === "already_captured")
      .length,
    retriesExhausted: results.filter((r) => r.result === "retries_exhausted")
      .length,
    errors: results.filter((r) => r.result === "error").length,
  };

  return NextResponse.json({ dryRun, summary, results });
}
