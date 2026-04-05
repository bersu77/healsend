import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/affiliate/stats
 *
 * Authenticated endpoint. Returns the current user's affiliate application
 * status, referral code, and earnings summary.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await prisma.affiliateApplication.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      status: true,
      referralCode: true,
      firstName: true,
      lastName: true,
      phone: true,
      motivation: true,
      website: true,
      rejectionReason: true,
      approvedAt: true,
      totalEarnings: true,
      pendingPayout: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ application: application || null });
}
