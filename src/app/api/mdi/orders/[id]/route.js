import {
  buildMdiMessageSeed,
  buildOrderMdiUpdate,
  isAuthorizedMdiRequest,
  normalizeMdiPayload,
  resolveOrderFromRouteId,
  upsertMdiCaseSnapshot,
  upsertMdiPatientMessageSync,
} from "@/lib/mdi-client";
import { buildFulfillmentProjection } from "@/lib/order-workflow";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function serializeOrder(order) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    mdiOrderId: order.mdiOrderId,
    mdiCaseId: order.mdiCaseId,
    mdiEncounterId: order.mdiEncounterId,
    mdiOrderTag: order.mdiOrderTag,
    mdiOrderStatus: order.mdiOrderStatus,
    mdiVoucherCode: order.mdiVoucherCode,
    mdiWorkflowPhase: order.mdiWorkflowPhase,
    mdiLastWebhookAt: order.mdiLastWebhookAt,
    mdiConsultationRefreshedAt: order.mdiConsultationRefreshedAt,
    consultationId: order.consultationId,
    consultationUrl: order.consultationUrl,
    consultationStatus: order.consultationStatus,
  };
}

async function serializeOrderWithCaseSnapshot(order) {
  const mdiCaseSnapshot = await prisma.mdiCaseSnapshot.findFirst({
    where: {
      OR: [
        { orderId: order.id },
        ...(order.mdiCaseId ? [{ mdiCaseId: order.mdiCaseId }] : []),
      ],
    },
    orderBy: [{ updatedAt: "desc" }, { latestEventAt: "desc" }],
  });

  return {
    ...serializeOrder(order),
    mdiCaseSnapshot,
  };
}

export async function GET(request, { params }) {
  if (!isAuthorizedMdiRequest(Object.fromEntries(request.headers.entries()))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await resolveOrderFromRouteId(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order: await serializeOrderWithCaseSnapshot(order) });
}

export async function PATCH(request, { params }) {
  if (!isAuthorizedMdiRequest(Object.fromEntries(request.headers.entries()))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await resolveOrderFromRouteId(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const normalized = normalizeMdiPayload(body);
  const update = buildOrderMdiUpdate(normalized, {
    fromWebhook: true,
    fallbackConsultationId: true,
  });

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No order projection fields provided" },
      { status: 400 },
    );
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    let nextOrder = await tx.order.update({
      where: { id: order.id },
      data: update,
    });

    await upsertMdiPatientMessageSync(tx, normalized, order.userId);
    const caseSnapshot = await upsertMdiCaseSnapshot(tx, normalized, {
      order: nextOrder,
    });
    const { update: fulfillmentUpdate } = buildFulfillmentProjection(
      nextOrder,
      caseSnapshot,
    );
    if (Object.keys(fulfillmentUpdate).length > 0) {
      nextOrder = await tx.order.update({
        where: { id: order.id },
        data: fulfillmentUpdate,
      });
    }
    const messageSeed = buildMdiMessageSeed(normalized, nextOrder, caseSnapshot);
    if (messageSeed) {
      await tx.message.create({ data: messageSeed });
    }

    return nextOrder;
  });

  return NextResponse.json({
    ok: true,
    order: await serializeOrderWithCaseSnapshot(updatedOrder),
  });
}
