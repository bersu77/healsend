import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_request, { params }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({
    where: { id },
    include: { products: true },
  });
  if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(brand);
}

export async function PUT(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const brand = await prisma.brand.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.slug && { slug: body.slug }),
      ...(body.logo !== undefined && { logo: body.logo }),
      ...(body.description !== undefined && { description: body.description }),
    },
  });
  return NextResponse.json(brand);
}

export async function DELETE(_request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.brand.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
