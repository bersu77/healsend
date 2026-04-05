import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildFulfillmentProjection } from "@/lib/order-workflow";
import { submitOrderToMdi } from "@/lib/mdi-client";

const ALLOWED_TEST_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "healsend.barikhan.studio",
]);

function getHostname(request) {
  const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  return hostHeader.split(",")[0].trim().split(":")[0].toLowerCase();
}

function isAllowedPreviewHost(request) {
  const hostname = getHostname(request);
  return ALLOWED_TEST_HOSTS.has(hostname);
}

function isSyntheticMdiValue(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return false;
  return (
    normalized.startsWith("mdi-patient-") ||
    normalized.startsWith("mdi-case-") ||
    normalized.startsWith("mdi-order-") ||
    normalized.startsWith("mdi-encounter-") ||
    normalized.includes("/consultation/local-dev")
  );
}

async function clearSyntheticMdiState(tx, order) {
  const syntheticCaseIds = [order.mdiCaseId].filter(isSyntheticMdiValue);
  const syntheticPatientIds = [order.user?.mdiPatientId].filter(isSyntheticMdiValue);

  await tx.order.update({
    where: { id: order.id },
    data: {
      status: order.status === "CANCELLED" ? "PENDING" : order.status,
      stripePaymentStatus: null,
      paymentCapturedAt: null,
      consultationId: null,
      consultationUrl: null,
      consultationStatus: null,
      mdiOrderId: isSyntheticMdiValue(order.mdiOrderId) ? null : order.mdiOrderId,
      mdiCaseId: isSyntheticMdiValue(order.mdiCaseId) ? null : order.mdiCaseId,
      mdiEncounterId: isSyntheticMdiValue(order.mdiEncounterId)
        ? null
        : order.mdiEncounterId,
      mdiOrderTag: isSyntheticMdiValue(order.mdiOrderTag) ? null : order.mdiOrderTag,
      mdiOrderStatus: null,
      mdiVoucherCode: null,
      mdiWorkflowPhase: null,
      mdiLastWebhookAt: null,
      mdiConsultationRefreshedAt: null,
      mdiSubmittedAt: null,
      fulfillmentReadyAt: null,
      fulfillmentBlockedReason: null,
    },
  });

  if (syntheticCaseIds.length > 0) {
    await tx.mdiCaseSnapshot.deleteMany({
      where: { mdiCaseId: { in: syntheticCaseIds } },
    });
  }

  if (syntheticCaseIds.length > 0 || syntheticPatientIds.length > 0) {
    await tx.mdiWebhookEvent.deleteMany({
      where: {
        OR: [
          { orderId: order.id },
          ...(syntheticCaseIds.length > 0
            ? [{ mdiCaseId: { in: syntheticCaseIds } }]
            : []),
          ...(syntheticPatientIds.length > 0
            ? [{ mdiPatientId: { in: syntheticPatientIds } }]
            : []),
        ],
      },
    });
  }

  if (order.userId && syntheticPatientIds.length > 0) {
    await tx.mdiPatientMessageSync.deleteMany({
      where: { userId: order.userId },
    });

    await tx.user.update({
      where: { id: order.userId },
      data: {
        mdiPatientId: null,
        mdiPatientStatus: null,
        mdiLastSyncedAt: null,
      },
    });
  }
}

export async function POST(request) {
  if (!isAllowedPreviewHost(request)) {
    return NextResponse.json({ error: "Not available on this host." }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { orderId, resetSyntheticMdi = true } = body || {};
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          mdiPatientId: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && order.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.$transaction(async (tx) => {
    if (resetSyntheticMdi) {
      await clearSyntheticMdiState(tx, order);
    }

    const settledOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status:
          order.status === "PENDING" || order.status === "CANCELLED"
            ? "PAID"
            : order.status,
        stripePaymentStatus: "paid",
        stripePaymentMethod: order.stripePaymentMethod || "preview_test_mode",
        stripeSessionId: order.stripeSessionId || `preview_session_${order.id}`,
        stripePaymentId: order.stripePaymentId || `preview_payment_${order.id}`,
        paymentCapturedAt: order.paymentCapturedAt || new Date(),
      },
    });

    const { update } = buildFulfillmentProjection(settledOrder);
    if (Object.keys(update).length > 0) {
      await tx.order.update({
        where: { id: order.id },
        data: update,
      });
    }
  });

  let mdiResult = null;
  try {
    mdiResult = await submitOrderToMdi(order.id);
  } catch (error) {
    mdiResult = {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown MDI error",
    };
  }

  const updatedOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          mdiPatientId: true,
          mdiPatientStatus: true,
        },
      },
    },
  });

  return NextResponse.json({
    ok: true,
    simulated: true,
    mdiResult,
    order: updatedOrder,
  });
}
