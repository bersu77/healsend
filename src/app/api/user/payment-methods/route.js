import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/user/payment-methods — list user's payment methods
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const methods = await prisma.paymentMethod.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(methods);
}

// POST /api/user/payment-methods — add a payment method
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { stripePaymentMethodId, brand, last4, expMonth, expYear, isDefault } =
    body;

  const existingCount = await prisma.paymentMethod.count({
    where: { userId: user.id },
  });
  const shouldBeDefault = isDefault ?? existingCount === 0;

  if (shouldBeDefault) {
    await prisma.paymentMethod.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const method = await prisma.paymentMethod.create({
    data: {
      userId: user.id,
      stripePaymentMethodId,
      brand: brand || null,
      last4: last4 || null,
      expMonth: expMonth || null,
      expYear: expYear || null,
      isDefault: shouldBeDefault,
    },
  });

  return NextResponse.json(method, { status: 201 });
}

// DELETE /api/user/payment-methods — delete a payment method
export async function DELETE(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const method = await prisma.paymentMethod.findFirst({
    where: { id, userId: user.id },
  });
  if (!method) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Block deletion if the user has any active subscriptions — they must
  // replace their card first (so billing continuity is maintained).
  const activeSubscriptionCount = await prisma.subscription.count({
    where: {
      userId: user.id,
      status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
    },
  });

  if (activeSubscriptionCount > 0) {
    return NextResponse.json(
      {
        error:
          "You have an active subscription. Please add a new card to replace this one before removing it.",
        hasActiveSubscription: true,
      },
      { status: 409 },
    );
  }

  await prisma.paymentMethod.delete({ where: { id } });

  if (method.isDefault) {
    const fallbackMethod = await prisma.paymentMethod.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (fallbackMethod) {
      await prisma.paymentMethod.update({
        where: { id: fallbackMethod.id },
        data: { isDefault: true },
      });
    }
  }

  return NextResponse.json({ success: true });
}

// PUT /api/user/payment-methods — set as default
export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const method = await prisma.paymentMethod.findFirst({
    where: { id, userId: user.id },
  });

  if (!method) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.paymentMethod.updateMany({
    where: { userId: user.id, isDefault: true },
    data: { isDefault: false },
  });

  await prisma.paymentMethod.update({
    where: { id },
    data: { isDefault: true },
  });

  return NextResponse.json({ success: true });
}
