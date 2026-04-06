import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// PUT /api/admin/navigation/[id]/items/[itemId] — update a nav item
export async function PUT(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: menuId, itemId } = await params;
  const body = await request.json();
  const { label, url, target, parentId, order } = body;

  if (!label || !label.trim()) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }
  if (!url || !url.trim()) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const item = await prisma.navigationItem.update({
    where: { id: itemId, menuId },
    data: {
      label: label.trim(),
      url: url.trim(),
      target: target === "_blank" ? "_blank" : null,
      parentId: parentId || null,
      order: typeof order === "number" ? order : undefined,
    },
  });

  return NextResponse.json(item);
}

// DELETE /api/admin/navigation/[id]/items/[itemId] — delete a nav item
export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: menuId, itemId } = await params;

  // First delete children, then the item itself
  await prisma.navigationItem.deleteMany({
    where: { parentId: itemId, menuId },
  });
  await prisma.navigationItem.delete({ where: { id: itemId, menuId } });

  return new NextResponse(null, { status: 204 });
}
