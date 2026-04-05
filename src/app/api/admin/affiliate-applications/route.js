import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  approveAffiliateApplication,
  rejectAffiliateApplication,
} from "@/lib/affiliate-service";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

/**
 * GET /api/admin/affiliate-applications
 *
 * Returns all affiliate applications with applicant user info.
 * Supports ?status=PENDING|APPROVED|REJECTED filter.
 */
export async function GET(request) {
  const adminUser = await requireAdmin();
  if (!adminUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  const where = statusFilter ? { status: statusFilter } : {};

  const applications = await prisma.affiliateApplication.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          createdAt: true,
        },
      },
      affiliateLinks: {
        select: {
          id: true,
          code: true,
          name: true,
          isActive: true,
          clickCount: true,
          _count: { select: { referrals: true } },
        },
      },
    },
  });

  return NextResponse.json({ applications });
}

/**
 * PATCH /api/admin/affiliate-applications
 *
 * Body:
 *   { id, action: "approve" }                — approves the application
 *   { id, action: "reject", reason?: string } — rejects with optional reason
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
    if (body.action === "approve") {
      const app = await approveAffiliateApplication(String(body.id));
      return NextResponse.json({ application: app });
    }

    if (body.action === "reject") {
      const app = await rejectAffiliateApplication(
        String(body.id),
        body.reason || "",
      );
      return NextResponse.json({ application: app });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Action failed" },
      { status: 400 },
    );
  }
}
