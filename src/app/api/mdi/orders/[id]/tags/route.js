import {
  buildMdiMessageSeed,
  isAuthorizedMdiRequest,
  normalizeMdiPayload,
  resolveOrderFromRouteId,
  upsertMdiCaseSnapshot,
  upsertMdiPatientMessageSync,
} from "@/lib/mdi-client";
import { buildFulfillmentProjection } from "@/lib/order-workflow";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function serializeTags(order) {
  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    mdiOrderTag: order.mdiOrderTag,
    mdiOrderStatus: order.mdiOrderStatus,
    mdiVoucherCode: order.mdiVoucherCode,
    mdiWorkflowPhase: order.mdiWorkflowPhase,
    mdiLastWebhookAt: order.mdiLastWebhookAt,
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

  return NextResponse.json({ ok: true, tags: serializeTags(order) });
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

  const normalized = normalizeMdiPayload({
    ...body,
    event_type: body.event_type || body.eventType || "order_tag_updated",
    case_id: body.case_id || body.caseId || order.mdiCaseId,
    patient_id: body.patient_id || body.patientId,
  });
  const update = {};
  if (body.order_tag || body.orderTag || body.tag) {
    update.mdiOrderTag = String(body.order_tag || body.orderTag || body.tag);
  }
  if (body.order_status || body.orderStatus || body.status) {
    update.mdiOrderStatus = String(
      body.order_status || body.orderStatus || body.status,
    );
  }
  if (body.voucher_code || body.voucherCode || body.voucher) {
    update.mdiVoucherCode = String(
      body.voucher_code || body.voucherCode || body.voucher,
    );
  }
  if (body.workflow_phase || body.workflowPhase || body.phase) {
    update.mdiWorkflowPhase = String(
      body.workflow_phase || body.workflowPhase || body.phase,
    );
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No tag fields provided" },
      { status: 400 },
    );
  }

  update.mdiLastWebhookAt = new Date();

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

  return NextResponse.json({ ok: true, tags: serializeTags(updatedOrder) });
}
