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
  if (!value) return "ACTIVE";
  const upper = String(value).toUpperCase();
  return ALLOWED_STATUSES.has(upper) ? upper : "ACTIVE";
}

// GET /api/admin/subscriptions
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20),
  );

  const where = {};

  if (status && ALLOWED_STATUSES.has(status)) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { planName: { contains: search, mode: "insensitive" } },
      { stripeSubscriptionId: { contains: search, mode: "insensitive" } },
      {
        user: {
          email: { contains: search, mode: "insensitive" },
        },
      },
      {
        user: {
          name: { contains: search, mode: "insensitive" },
        },
      },
    ];
  }

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.subscription.count({ where }),
  ]);

  return NextResponse.json({ subscriptions, total, page, limit });
}

// POST /api/admin/subscriptions
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  const userId = body.userId?.trim();
  const planName = body.planName?.trim();
  const amount = Number(body.amount);
  const currency = (body.currency || "USD").trim().toUpperCase();
  const interval = (body.interval || "month").trim().toLowerCase();
  const intervalCount = Math.max(1, parseInt(body.intervalCount || "1", 10));
  const status = normalizeStatus(body.status);

  if (!userId || !planName || Number.isNaN(amount)) {
    return NextResponse.json(
      { error: "userId, planName, and amount are required" },
      { status: 400 },
    );
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const created = await prisma.subscription.create({
      data: {
        userId,
        planName,
        status,
        amount,
        currency: currency || "USD",
        interval: interval || "month",
        intervalCount,
        stripeSubscriptionId: body.stripeSubscriptionId?.trim() || null,
        startDate: asIsoOrNull(body.startDate) || new Date(),
        nextBillingDate: asIsoOrNull(body.nextBillingDate),
        endDate: asIsoOrNull(body.endDate),
        cancelAtPeriodEnd: !!body.cancelAtPeriodEnd,
        notes: body.notes?.trim() || null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (String(err?.code) === "P2002") {
      return NextResponse.json(
        { error: "stripeSubscriptionId already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}
