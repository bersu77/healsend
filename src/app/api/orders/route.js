import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { stripUnusableConsultationState } from "@/lib/mdi-shared";
import { NextResponse } from "next/server";

// GET /api/orders — list orders (admin) or user orders
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const where = {};
  if (user.role === "ADMIN") {
    if (userId) where.userId = userId;
  } else {
    where.userId = user.id;
  }
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    orders: orders.map((order) => stripUnusableConsultationState(order)),
    total,
    page,
    limit,
  });
}
