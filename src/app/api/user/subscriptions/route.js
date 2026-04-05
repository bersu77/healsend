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

function normalizeStatus(value) {
  if (!value) {
    return null;
  }

  const upper = String(value).trim().toUpperCase();
  return ALLOWED_STATUSES.has(upper) ? upper : null;
}

function containsInternalMarker(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return (
    normalized.includes("mdi-payload") ||
    normalized.includes("payload variant") ||
    normalized.includes("local-dev") ||
    normalized.includes("development seed") ||
    /^dev-\d+$/i.test(String(value || "").trim())
  );
}

function isInternalSubscription(subscription) {
  if (!subscription) {
    return false;
  }

  const rawValues = [subscription.stripeSubscriptionId, subscription.notes];
  if (rawValues.some(containsInternalMarker)) {
    return true;
  }

  return /^sub_dev_/i.test(String(subscription.stripeSubscriptionId || "").trim());
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(
    subscriptions.filter((subscription) => !isInternalSubscription(subscription)),
  );
}

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body?.id || "").trim();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const subscription = await prisma.subscription.findFirst({
    where: { id, userId: user.id },
  });

  if (!subscription) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = {};

  if (body.cancelAtPeriodEnd !== undefined) {
    data.cancelAtPeriodEnd = !!body.cancelAtPeriodEnd;
  }

  if (body.status !== undefined) {
    const status = normalizeStatus(body.status);
    if (!status) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status;
  }

  if (body.nextBillingDate !== undefined) {
    data.nextBillingDate = body.nextBillingDate
      ? new Date(body.nextBillingDate)
      : null;
  }

  if (body.endDate !== undefined) {
    data.endDate = body.endDate ? new Date(body.endDate) : null;
  }

  const updated = await prisma.subscription.update({
    where: { id: subscription.id },
    data,
  });

  return NextResponse.json(updated);
}
