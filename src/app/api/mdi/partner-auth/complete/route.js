import { getCurrentUser } from "@/lib/auth";
import {
  buildMdiMessageSeed,
  buildOrderMdiUpdate,
  buildUserMdiUpdate,
  isAuthorizedMdiRequest,
  normalizeMdiPayload,
  resolveOrderFromMdiPayload,
  resolveUserFromRouteId,
  upsertMdiCaseSnapshot,
  upsertMdiPatientMessageSync,
} from "@/lib/mdi-client";
import { buildFulfillmentProjection } from "@/lib/order-workflow";
import { prisma } from "@/lib/prisma";
import { recordAffiliateServerEvent } from "@/lib/affiliate-tracking";
import { NextResponse } from "next/server";

async function parseCompletionPayload(request) {
  if (request.method === "GET") {
    const searchParams = request.nextUrl.searchParams;
    return Object.fromEntries(searchParams.entries());
  }

  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function handleCompletion(request) {
  const headers = Object.fromEntries(request.headers.entries());
  const currentUser = await getCurrentUser();
  const isMachineRequest = isAuthorizedMdiRequest(headers);

  if (!currentUser && !isMachineRequest) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawPayload = await parseCompletionPayload(request);
  if (!rawPayload) {
    return NextResponse.json(
      { error: "Invalid partner auth completion payload" },
      { status: 400 },
    );
  }

  const normalized = normalizeMdiPayload({
    ...rawPayload,
    event_type:
      rawPayload.event_type ||
      rawPayload.eventType ||
      "partner_auth_completed",
  });

  let resolvedUser = currentUser;
  if (!resolvedUser) {
    resolvedUser =
      (await resolveUserFromRouteId(
        rawPayload.userId ||
          rawPayload.user_id ||
          rawPayload.customerId ||
          rawPayload.customer_id ||
          rawPayload.email ||
          normalized.patientId,
      )) || null;
  }

  const { order: resolvedOrder } = await resolveOrderFromMdiPayload({
    ...rawPayload,
    order_internal_id:
      rawPayload.order_internal_id ||
      rawPayload.orderInternalId ||
      rawPayload.orderId ||
      rawPayload.order_id,
  });

  if (!resolvedUser && !resolvedOrder) {
    return NextResponse.json(
      { error: "No matching user or order found" },
      { status: 404 },
    );
  }

  if (
    currentUser &&
    resolvedOrder &&
    currentUser.role !== "ADMIN" &&
    resolvedOrder.userId !== currentUser.id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = resolvedUser?.id || resolvedOrder?.userId || null;
  const orderUpdate = buildOrderMdiUpdate(normalized, {
    fallbackConsultationId: true,
    touchConsultationRefresh: true,
  });
  if (!orderUpdate.mdiWorkflowPhase) {
    orderUpdate.mdiWorkflowPhase = "partner_auth_completed";
  }
  if (!orderUpdate.consultationStatus) {
    orderUpdate.consultationStatus = "ready";
  }

  const userUpdate = buildUserMdiUpdate(normalized);

  let nextOrder = resolvedOrder;
  await prisma.$transaction(async (tx) => {
    if (userId && Object.keys(userUpdate).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: userUpdate,
      });
    }

    if (resolvedOrder && Object.keys(orderUpdate).length > 0) {
      nextOrder = await tx.order.update({
        where: { id: resolvedOrder.id },
        data: orderUpdate,
      });
    }

    if (userId) {
      await upsertMdiPatientMessageSync(tx, normalized, userId);
    }

    const caseSnapshot = await upsertMdiCaseSnapshot(tx, normalized, {
      order: nextOrder,
      userId,
    });
    if (nextOrder) {
      const { update: fulfillmentUpdate } = buildFulfillmentProjection(
        nextOrder,
        caseSnapshot,
      );
      if (Object.keys(fulfillmentUpdate).length > 0) {
        nextOrder = await tx.order.update({
          where: { id: nextOrder.id },
          data: fulfillmentUpdate,
        });
      }
    }

    const messageSeed = buildMdiMessageSeed(
      { ...normalized, eventType: "partner_auth_completed" },
      nextOrder,
      caseSnapshot,
    );
    if (messageSeed) {
      await tx.message.create({ data: messageSeed });
    }
  });

  const destination =
    rawPayload.redirectTo ||
    rawPayload.redirect_to ||
    (nextOrder ? `/consultation/${nextOrder.id}` : "/account");

  await recordAffiliateServerEvent({
    userId,
    orderId: nextOrder?.id || null,
    eventType: "PATIENT",
    eventName: "partner_auth_completed",
    consultationStatus: nextOrder?.consultationStatus || "ready",
    mdiWorkflowPhase: nextOrder?.mdiWorkflowPhase || "partner_auth_completed",
    metadata: {
      redirectTo: destination,
    },
  });

  if (request.method === "GET") {
    return NextResponse.redirect(new URL(destination, request.nextUrl.origin));
  }

  return NextResponse.json({
    ok: true,
    redirectTo: destination,
    orderId: nextOrder?.id || null,
    userId,
  });
}

export async function GET(request) {
  return handleCompletion(request);
}

export async function POST(request) {
  return handleCompletion(request);
}
