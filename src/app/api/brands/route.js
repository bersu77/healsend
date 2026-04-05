import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET /api/brands
export async function GET() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(brands);
}

// POST /api/brands
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const brand = await prisma.brand.create({
    data: {
      name: body.name,
      slug,
      logo: body.logo || null,
      description: body.description || null,
    },
  });
  return NextResponse.json(brand, { status: 201 });
}
