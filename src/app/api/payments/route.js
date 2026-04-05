import { prisma } from "@/lib/prisma";
import { getSettledRevenueStatuses } from "@/lib/order-workflow";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET /api/payments — aggregated payment stats + transaction list
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const status = searchParams.get("status"); // filter by order status

  const where = {};
  if (status) where.status = status;
  const settledStatuses = getSettledRevenueStatuses();

  // Parallel queries for stats + paginated list
  const [
    totalRevenue,
    paidCount,
    pendingCount,
    refundedCount,
    cancelledCount,
    orders,
    total,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: settledStatuses } },
    }),
    prisma.order.count({ where: { status: { in: settledStatuses } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "REFUNDED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  // Monthly revenue for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const recentPaid = await prisma.order.findMany({
    where: { status: { in: settledStatuses }, createdAt: { gte: sixMonthsAgo } },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const monthlyRevenue = {};
  for (const o of recentPaid) {
    const key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, "0")}`;
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + o.total;
  }

  return NextResponse.json({
    stats: {
      totalRevenue: totalRevenue._sum.total || 0,
      paidCount,
      pendingCount,
      refundedCount,
      cancelledCount,
    },
    monthlyRevenue,
    transactions: orders,
    total,
    page,
    limit,
  });
}
