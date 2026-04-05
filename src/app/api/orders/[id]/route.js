import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { stripUnusableConsultationState } from "@/lib/mdi-shared";
import {
  assertOrderStatusTransition,
  buildFulfillmentProjection,
} from "@/lib/order-workflow";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [order, mdiCaseSnapshot] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, variant: true } },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            mdiPatientId: true,
            mdiPatientStatus: true,
          },
        },
        address: true,
      },
    }),
    prisma.mdiCaseSnapshot.findFirst({
      where: { orderId: id },
      orderBy: [{ updatedAt: "desc" }, { latestEventAt: "desc" }],
    }),
  ]);

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "ADMIN" && order.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...stripUnusableConsultationState(order),
    mdiCaseSnapshot,
  });
}

export async function PUT(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const [existingOrder, mdiCaseSnapshot] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    }),
    prisma.order.findUnique({ where: { id }, select: { mdiCaseId: true } }).then(
      async (orderMeta) =>
        prisma.mdiCaseSnapshot.findFirst({
          where: {
            OR: [
              { orderId: id },
              ...(orderMeta?.mdiCaseId
                ? [{ mdiCaseId: orderMeta.mdiCaseId }]
                : []),
            ],
          },
          orderBy: [{ updatedAt: "desc" }, { latestEventAt: "desc" }],
        }),
    ),
  ]);

  if (!existingOrder) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.status) {
    const transition = assertOrderStatusTransition(
      existingOrder,
      body.status,
      mdiCaseSnapshot,
    );

    if (!transition.ok) {
      return NextResponse.json(
        { error: transition.reason },
        { status: transition.status || 409 },
      );
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    let nextOrder = await tx.order.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      include: { items: { include: { product: true } } },
    });

    const { update: fulfillmentUpdate } = buildFulfillmentProjection(
      nextOrder,
      mdiCaseSnapshot,
    );
    if (Object.keys(fulfillmentUpdate).length > 0) {
      nextOrder = await tx.order.update({
        where: { id },
        data: fulfillmentUpdate,
        include: { items: { include: { product: true } } },
      });
    }

    return nextOrder;
  });
  return NextResponse.json(order);
}
