import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * POST /api/affiliate/apply
 *
 * Authenticated endpoint. Creates or updates an AffiliateApplication for the
 * current user. If already APPROVED or PENDING, returns status without changes.
 */
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { motivation, website, notes } = body;

  if (!motivation || !motivation.trim()) {
    return NextResponse.json(
      { error: "Please tell us why you want to join the affiliate program" },
      { status: 400 },
    );
  }

  // Fetch existing application
  const existing = await prisma.affiliateApplication.findUnique({
    where: { userId: user.id },
  });

  if (existing && existing.status === "APPROVED") {
    return NextResponse.json({ application: existing });
  }

  if (existing && existing.status === "PENDING") {
    return NextResponse.json({ application: existing });
  }

  // Parse name from user record
  const nameParts = (user.name || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Create or update (re-apply after rejection)
  const application = await prisma.affiliateApplication.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      status: "PENDING",
      firstName,
      lastName,
      phone: user.phone || "",
      motivation: motivation.trim(),
      website: website ? website.trim() : null,
      notes: notes ? notes.trim() : null,
    },
    update: {
      status: "PENDING",
      firstName,
      lastName,
      phone: user.phone || "",
      motivation: motivation.trim(),
      website: website ? website.trim() : null,
      notes: notes ? notes.trim() : null,
      rejectionReason: null,
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}
