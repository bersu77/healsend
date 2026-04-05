import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

const ALLOWED_STATUSES = new Set([
  "ACTIVE",
  "TRIALING",
  "PAST_DUE",
  "CANCELED",
  "EXPIRED",
]);

function asIsoOrNull(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeStatus(value) {
  if (!value) return null;
  const upper = String(value).toUpperCase();
  return ALLOWED_STATUSES.has(upper) ? upper : null;
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

// GET /api/admin/subscriptions/:id
export async function GET(_request, { params }) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!subscription) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(subscription);
}

// PUT /api/admin/subscriptions/:id
export async function PUT(request, { params }) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const data = {};

  if (body.userId !== undefined) {
    const targetUser = await prisma.user.findUnique({
      where: { id: String(body.userId) },
      select: { id: true },
    });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    data.userId = targetUser.id;
  }

  if (body.planName !== undefined) data.planName = String(body.planName).trim();
  if (body.amount !== undefined) {
    const amount = Number(body.amount);
    if (Number.isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    data.amount = amount;
  }
  if (body.currency !== undefined) {
    data.currency = String(body.currency || "USD").trim().toUpperCase();
  }
  if (body.interval !== undefined) {
    data.interval = String(body.interval || "month").trim().toLowerCase();
  }
  if (body.intervalCount !== undefined) {
    const intervalCount = Math.max(1, parseInt(body.intervalCount || "1", 10));
    data.intervalCount = intervalCount;
  }

  const status = normalizeStatus(body.status);
  if (body.status !== undefined) {
    if (!status) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status;
  }

  if (body.stripeSubscriptionId !== undefined) {
    data.stripeSubscriptionId = body.stripeSubscriptionId
      ? String(body.stripeSubscriptionId).trim()
      : null;
  }
  if (body.startDate !== undefined) data.startDate = asIsoOrNull(body.startDate);
  if (body.nextBillingDate !== undefined) {
    data.nextBillingDate = asIsoOrNull(body.nextBillingDate);
  }
  if (body.endDate !== undefined) data.endDate = asIsoOrNull(body.endDate);
  if (body.cancelAtPeriodEnd !== undefined) {
    data.cancelAtPeriodEnd = !!body.cancelAtPeriodEnd;
  }
  if (body.notes !== undefined) data.notes = body.notes ? String(body.notes) : null;

  try {
    const updated = await prisma.subscription.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    if (String(err?.code) === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (String(err?.code) === "P2002") {
      return NextResponse.json(
        { error: "stripeSubscriptionId already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/subscriptions/:id
export async function DELETE(_request, { params }) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  try {
    await prisma.subscription.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (String(err?.code) === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 },
    );
  }
}
