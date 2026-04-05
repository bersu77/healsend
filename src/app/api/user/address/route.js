import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

async function resolveDefaultAddress(userId) {
  return prisma.address.findFirst({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const address = await resolveDefaultAddress(user.id);
  return NextResponse.json(address);
}

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const line1 = String(body?.line1 || "").trim();
  const city = String(body?.city || "").trim();
  const state = String(body?.state || "").trim();
  const zip = String(body?.zip || "").trim();
  const country = String(body?.country || "US").trim() || "US";

  if (!line1 || !city || !state || !zip) {
    return NextResponse.json(
      { error: "line1, city, state, and zip are required" },
      { status: 400 },
    );
  }

  const existingAddress = await resolveDefaultAddress(user.id);

  if (existingAddress) {
    const updated = await prisma.address.update({
      where: { id: existingAddress.id },
      data: {
        line1,
        line2: body?.line2 ? String(body.line2).trim() : null,
        city,
        state,
        zip,
        country,
        isDefault: true,
      },
    });

    return NextResponse.json(updated);
  }

  const created = await prisma.address.create({
    data: {
      userId: user.id,
      line1,
      line2: body?.line2 ? String(body.line2).trim() : null,
      city,
      state,
      zip,
      country,
      isDefault: true,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
