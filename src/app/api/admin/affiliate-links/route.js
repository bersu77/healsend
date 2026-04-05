import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createAffiliateLink,
  deleteAffiliateLink,
  listAffiliateLinks,
  updateAffiliateLink,
} from "@/lib/affiliate-service";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

async function listProgramUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
    take: 200,
  });
}

/** Attach a full masked share URL to each affiliate link object.
 *  Format: /go/<code>  — the destination path and attribution mechanism
 *  are hidden from the visitor. Clicks are counted server-side on arrival.
 */
function withShareLink(affiliate, request) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const maskedUrl = new URL(
    `/go/${encodeURIComponent(affiliate.code)}`,
    origin,
  );
  return { ...affiliate, link: maskedUrl.toString() };
}

export async function GET(request) {
  const adminUser = await requireAdmin();
  if (!adminUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [affiliates, users] = await Promise.all([
    listAffiliateLinks({ includeInactive: true }),
    listProgramUsers(),
  ]);

  return NextResponse.json({
    affiliates: affiliates.map((a) => withShareLink(a, request)),
    users,
  });
}

export async function POST(request) {
  const adminUser = await requireAdmin();
  if (!adminUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const created = await createAffiliateLink(body);
    return NextResponse.json({ affiliate: withShareLink(created, request) });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to create affiliate" },
      { status: 400 },
    );
  }
}

export async function PATCH(request) {
  const adminUser = await requireAdmin();
  if (!adminUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !body.id) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const updated = await updateAffiliateLink({
      id: String(body.id),
      patch: body.patch || {},
    });
    return NextResponse.json({ affiliate: withShareLink(updated, request) });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to update affiliate" },
      { status: 400 },
    );
  }
}

export async function DELETE(request) {
  const adminUser = await requireAdmin();
  if (!adminUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !body.id) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    await deleteAffiliateLink(String(body.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete affiliate" },
      { status: 400 },
    );
  }
}
