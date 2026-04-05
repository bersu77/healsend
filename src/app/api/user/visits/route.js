import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/user/visits — get current user's normalized MDI case/visit history
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const visits = await prisma.mdiCaseSnapshot.findMany({
    where: { userId: user.id },
    orderBy: [{ updatedAt: "desc" }, { latestEventAt: "desc" }],
  });

  return NextResponse.json(visits);
}
