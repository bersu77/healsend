import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAffiliateDashboardStats } from "@/lib/affiliate-service";

/**
 * GET /api/affiliate/dashboard
 *
 * Returns the current user's affiliate partner stats.
 * Only works for users with an APPROVED AffiliateApplication.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getAffiliateDashboardStats(user.id);
  return NextResponse.json(data);
}
