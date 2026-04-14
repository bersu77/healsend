import {
  buildMdiMessageSeed,
  buildOrderMdiUpdate,
  buildUserMdiUpdate,
  getMdiWebhookDeliveryId,
  isAuthorizedMdiRequest,
  normalizeMdiPayload,
  resolveOrderFromMdiPayload,
  upsertMdiCaseSnapshot,
  upsertMdiPatientMessageSync,
} from "@/lib/mdi-client";
import {
  buildFulfillmentProjection,
  getOrderFulfillmentAssessment,
} from "@/lib/order-workflow";
import { prisma } from "@/lib/prisma";
import {
  cancelAuthorizedOrderPayment,
  captureOrRetryOrderPayment,
} from "@/lib/stripe-payment-workflow";
import { recordAffiliateServerEvent } from "@/lib/affiliate-tracking";
import { NextResponse } from "next/server";

async function getOrCreateWebhookEvent({
  deliveryId,
  eventType,
  headers,
  payload,
}) {
  if (deliveryId) {
    const existing = await prisma.mdiWebhookEvent.findUnique({
      where: { deliveryId },
    });

    if (existing) {
      return { event: existing, duplicate: existing.processed };
    }
  }

  const event = await prisma.mdiWebhookEvent.create({
    data: {
      deliveryId: deliveryId || undefined,
      eventType,
      headers,
      payload,
    },
  });

  return { event, duplicate: false };
}

/**
 * POST /api/webhooks/mdi
 *
 * Receives MDI webhook events and projects them onto local order/user state.
 * Raw events are stored first in MdiWebhookEvent for traceability.
 */
export async function POST(request) {
  const headers = Object.fromEntries(request.headers.entries());
  if (!isAuthorizedMdiRequest(headers)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const normalized = normalizeMdiPayload(body);
  const deliveryId = getMdiWebhookDeliveryId(headers, body);
  const { event, duplicate } = await getOrCreateWebhookEvent({
    deliveryId,
    eventType: normalized.eventType,
    headers,
    payload: body,
  });

  if (duplicate) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      eventId: event.id,
      orderId: event.orderId,
    });
  }

  try {
    const { order } = await resolveOrderFromMdiPayload(normalized);

    if (!order) {
      await prisma.mdiWebhookEvent.update({
        where: { id: event.id },
        data: {
          error: "Order not found",
        },
      });

      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = buildOrderMdiUpdate(normalized, {
      fromWebhook: true,
      fallbackConsultationId: true,
    });
    orderData.mdiWorkflowPhase =
      orderData.mdiWorkflowPhase || normalized.eventType;

    const userData = buildUserMdiUpdate(normalized);

    let finalOrder = order;
    let finalCaseSnapshot = null;

    await prisma.$transaction(async (tx) => {
      if (Object.keys(userData).length > 0) {
        await tx.user.update({
          where: { id: order.userId },
          data: userData,
        });
      }

      let projectedOrder = order;
      if (Object.keys(orderData).length > 0) {
        projectedOrder = await tx.order.update({
          where: { id: order.id },
          data: orderData,
        });
      }

      const caseSnapshot = await upsertMdiCaseSnapshot(tx, normalized, {
        order: projectedOrder,
      });
      finalCaseSnapshot = caseSnapshot;
      const { update: fulfillmentUpdate } = buildFulfillmentProjection(
        projectedOrder,
        caseSnapshot,
      );
      if (Object.keys(fulfillmentUpdate).length > 0) {
        projectedOrder = await tx.order.update({
          where: { id: order.id },
          data: fulfillmentUpdate,
        });
      }

      finalOrder = projectedOrder;

      await upsertMdiPatientMessageSync(tx, normalized, order.userId);
      const messageSeed = buildMdiMessageSeed(
        normalized,
        projectedOrder,
        caseSnapshot,
      );
      if (messageSeed) {
        await tx.message.create({
          data: messageSeed,
        });
      }

      await tx.mdiWebhookEvent.update({
        where: { id: event.id },
        data: {
          processed: true,
          processedAt: new Date(),
          orderId: order.id,
          userId: order.userId,
          mdiOrderId: normalized.mdiOrderId,
          mdiPatientId: normalized.patientId,
          mdiCaseId: normalized.caseId,
          error: null,
        },
      });
    });

    const fulfillmentAssessment = getOrderFulfillmentAssessment(
      finalOrder,
      finalCaseSnapshot,
    );
    const cancellationSignals = [
      normalized.eventType,
      finalOrder?.mdiWorkflowPhase,
      finalOrder?.mdiOrderStatus,
      finalOrder?.consultationStatus,
      finalCaseSnapshot?.status,
      finalCaseSnapshot?.phase,
      finalCaseSnapshot?.latestEventType,
    ]
      .map((value) => String(value || "").toLowerCase())
      .join(" ");

    if (
      fulfillmentAssessment.medicallyReady &&
      !fulfillmentAssessment.paymentCaptured &&
      finalOrder?.stripePaymentId
    ) {
      await captureOrRetryOrderPayment(finalOrder, {
        reason: "medical_approval",
        caseSnapshot: finalCaseSnapshot,
      });
    } else if (
      !fulfillmentAssessment.paymentCaptured &&
      finalOrder?.stripePaymentId &&
      /(cancel|reject|deny|declin)/i.test(cancellationSignals)
    ) {
      await cancelAuthorizedOrderPayment(finalOrder, {
        reason: "Authorization hold released after medical review.",
      });
    }

    await recordAffiliateServerEvent({
      userId: order.userId,
      orderId: order.id,
      eventType: "PATIENT",
      eventName: "mdi_status_updated",
      consultationStatus: finalOrder?.consultationStatus || null,
      mdiWorkflowPhase: finalOrder?.mdiWorkflowPhase || normalized.eventType,
      metadata: {
        mdiEventType: normalized.eventType,
        mdiCaseId: normalized.caseId || finalCaseSnapshot?.mdiCaseId || null,
        providerName: finalCaseSnapshot?.providerName || null,
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      eventId: event.id,
    });
  } catch (err) {
    console.error("Failed to process MDI webhook:", err);

    await prisma.mdiWebhookEvent.update({
      where: { id: event.id },
      data: {
        error: err instanceof Error ? err.message : "Failed to process event",
      },
    });

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
