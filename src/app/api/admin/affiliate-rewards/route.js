import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  approveReward,
  markRewardPaid,
  rejectReward,
} from "@/lib/affiliate-service";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

/**
 * GET /api/admin/affiliate-rewards
 *
 * Lists all reward ledger entries.
 * Supports ?status=PENDING|APPROVED|PAID|REJECTED filter.
 */
export async function GET(request) {
  const adminUser = await requireAdmin();
  if (!adminUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  const rewards = await prisma.rewardLedger.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: { select: { id: true, email: true, name: true } },
      referral: {
        select: {
          id: true,
          status: true,
          convertedAt: true,
          referredUser: { select: { id: true, email: true, name: true } },
          link: { select: { id: true, code: true, name: true } },
        },
      },
    },
  });

  return NextResponse.json({ rewards });
}

/**
 * PATCH /api/admin/affiliate-rewards
 *
 * Body:
 *   { id, action: "approve" }                — sets status to APPROVED
 *   { id, action: "pay" }                    — sets status to PAID
 *   { id, action: "reject", reason?: string } — sets status to REJECTED
 */
export async function PATCH(request) {
  const adminUser = await requireAdmin();
  if (!adminUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.id || !body?.action) {
    return NextResponse.json(
      { error: "id and action are required" },
      { status: 400 },
    );
  }

  try {
    let reward;
    if (body.action === "approve") {
      reward = await approveReward(String(body.id));
    } else if (body.action === "pay") {
      reward = await markRewardPaid(String(body.id));
    } else if (body.action === "reject") {
      reward = await rejectReward(String(body.id), body.reason || "");
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ reward });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Action failed" },
      { status: 400 },
    );
  }
}
