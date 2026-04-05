import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET /api/categories/[id]
export async function GET(_request, { params }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { children: true, products: true },
  });
  if (!category)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

// PUT /api/categories/[id]
export async function PUT(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.slug && { slug: body.slug }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.parentId !== undefined && { parentId: body.parentId }),
      ...(body.priority !== undefined && { priority: body.priority }),
    },
  });
  return NextResponse.json(category);
}

// DELETE /api/categories/[id]
export async function DELETE(_request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
