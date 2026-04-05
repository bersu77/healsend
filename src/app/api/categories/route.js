import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET /api/categories
export async function GET() {
  const categories = await prisma.category.findMany({
    include: { children: true, _count: { select: { products: true } } },
    orderBy: { priority: "desc" },
  });
  return NextResponse.json(categories);
}

// POST /api/categories
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

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug,
      description: body.description || null,
      image: body.image || null,
      parentId: body.parentId || null,
      priority: body.priority || 0,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
