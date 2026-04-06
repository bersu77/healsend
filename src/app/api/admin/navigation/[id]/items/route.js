import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// POST /api/admin/navigation/[id]/items — add a new item to a menu
export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: menuId } = await params;
  const body = await request.json();
  const { label, url, target, parentId } = body;

  if (!label || !label.trim()) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }
  if (!url || !url.trim()) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Determine the next order value at this level
  const siblings = await prisma.navigationItem.findMany({
    where: { menuId, parentId: parentId || null },
    select: { order: true },
    orderBy: { order: "desc" },
    take: 1,
  });
  const nextOrder = siblings.length > 0 ? siblings[0].order + 1 : 0;

  const item = await prisma.navigationItem.create({
    data: {
      menuId,
      label: label.trim(),
      url: url.trim(),
      target: target === "_blank" ? "_blank" : null,
      parentId: parentId || null,
      order: nextOrder,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

// PUT /api/admin/navigation/[id]/items — batch reorder items
// Body: { items: [{ id, order, parentId }] }
export async function PUT(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: menuId } = await params;
  const body = await request.json();
  const { items } = body;

  if (!Array.isArray(items)) {
    return NextResponse.json(
      { error: "items must be an array" },
      { status: 400 },
    );
  }

  await prisma.$transaction(
    items.map(({ id, order, parentId }) =>
      prisma.navigationItem.update({
        where: { id, menuId },
        data: {
          order: typeof order === "number" ? order : 0,
          parentId: parentId || null,
        },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
