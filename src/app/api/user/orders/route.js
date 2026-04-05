import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { stripUnusableConsultationState } from "@/lib/mdi-shared";
import { NextResponse } from "next/server";

// GET /api/user/orders — get current user's orders
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, images: true, subscriptionTiers: true },
          },
          variant: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    orders.map((order) => stripUnusableConsultationState(order)),
  );
}
