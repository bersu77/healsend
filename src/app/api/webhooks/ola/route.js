import { prisma } from "@/lib/prisma";
import {
  buildFulfillmentProjection,
  getOrderFulfillmentAssessment,
} from "@/lib/order-workflow";
import {
  cancelAuthorizedOrderPayment,
  captureOrRetryOrderPayment,
} from "@/lib/stripe-payment-workflow";
import { recordAffiliateServerEvent } from "@/lib/affiliate-tracking";
import { NextResponse } from "next/server";

/**
 * Verifies the OLA webhook request using the shared secret token.
 * OLA sends the secret in the X-Secret-Token header.
 */
function isAuthorizedOlaRequest(headers) {
  const secret = process.env.OLA_SECRET_TOKEN;
  if (!secret) return true; // allow through if secret not configured
  const provided = headers["x-secret-token"] || headers["x-ola-secret"] || "";
  return provided === secret;
}

/**
 * Normalize OLA status strings to a canonical approval signal.
 * Returns "approved", "rejected", or "other".
 */
function classifyOlaStatus(status) {
  const s = String(status || "")
    .toLowerCase()
    .trim();
  if (
    /approved|accept|rx_sent|prescription|dispens|fulfilled|completed|closed/i.test(
      s,
    )
  ) {
    return "approved";
  }
  if (/reject|denied|cancel|declined|not_approv|ineligib/i.test(s)) {
    return "rejected";
  }
  return "other";
}

async function getOrCreateWebhookEvent({
  deliveryId,
  eventType,
  headers,
  payload,
}) {
  if (deliveryId) {
    const existing = await prisma.olaWebhookEvent.findUnique({
      where: { deliveryId },
    });
    if (existing) {
      return { event: existing, duplicate: existing.processed };
    }
  }

  const event = await prisma.olaWebhookEvent.create({
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
 * POST /api/webhooks/ola
 *
 * Receives OLA Portal status updates and triggers payment capture or
 * cancellation according to the medical approval outcome.
 *
 * Supported event types (from OLA status field):
 *   - "approved" / approval-family → captureOrRetryOrderPayment()
 *   - "rejected" / denial-family   → cancelAuthorizedOrderPayment()
 */
export async function POST(request) {
  const headers = Object.fromEntries(request.headers.entries());

  if (!isAuthorizedOlaRequest(headers)) {
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

  // OLA may send status updates under various shapes — normalize
  const data = body?.data || body;
  const olaOrderGuid =
    data?.order_guid || data?.orderGuid || body?.order_guid || null;
  const rawStatus =
    data?.status ||
    data?.order_status ||
    body?.status ||
    body?.event_type ||
    "";
  const eventType = rawStatus || "status_update";

  const deliveryId =
    headers["x-webhook-id"] ||
    headers["x-delivery-id"] ||
    body?.webhook_id ||
    null;

  const { event, duplicate } = await getOrCreateWebhookEvent({
    deliveryId,
    eventType,
    headers,
    payload: body,
  });

  if (duplicate) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      eventId: event.id,
    });
  }

  try {
    // Resolve the order by olaOrderGuid
    let order = null;
    if (olaOrderGuid) {
      order = await prisma.order.findFirst({
        where: { olaOrderGuid },
      });
    }

    if (!order) {
      await prisma.olaWebhookEvent.update({
        where: { id: event.id },
        data: {
          error:
            "Order not found for olaOrderGuid: " + (olaOrderGuid || "none"),
        },
      });
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order OLA status fields
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        olaStatus: rawStatus || order.olaStatus,
        consultationStatus: rawStatus || order.consultationStatus,
        olaLastSyncAt: new Date(),
      },
    });

    const statusClass = classifyOlaStatus(rawStatus);

    if (statusClass === "approved") {
      await captureOrRetryOrderPayment(updatedOrder, {
        reason: "ola_medical_approval",
      });
    } else if (statusClass === "rejected") {
      await cancelAuthorizedOrderPayment(updatedOrder, {
        reason: "OLA provider did not approve the consultation.",
      });
    } else {
      // Non-terminal status — just update fulfillment projection
      const { update: fulfillmentUpdate } =
        buildFulfillmentProjection(updatedOrder);
      if (Object.keys(fulfillmentUpdate).length > 0) {
        await prisma.order.update({
          where: { id: order.id },
          data: fulfillmentUpdate,
        });
      }
    }

    await prisma.olaWebhookEvent.update({
      where: { id: event.id },
      data: {
        processed: true,
        processedAt: new Date(),
        orderId: order.id,
        userId: order.userId,
        olaOrderGuid: olaOrderGuid || null,
        error: null,
      },
    });

    await recordAffiliateServerEvent({
      userId: order.userId,
      orderId: order.id,
      eventType: "PATIENT",
      eventName: "ola_status_updated",
      consultationStatus: rawStatus || null,
      metadata: {
        olaEventType: eventType,
        olaOrderGuid: olaOrderGuid || null,
        statusClass,
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      eventId: event.id,
    });
  } catch (err) {
    console.error("Failed to process OLA webhook:", err);

    await prisma.olaWebhookEvent.update({
      where: { id: event.id },
      data: {
        error: err instanceof Error ? err.message : "Failed to process event",
      },
    });

    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 },
    );
  }
}
