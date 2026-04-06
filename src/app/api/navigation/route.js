import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/navigation?location=header — public endpoint: returns the menu
// assigned to a location as a nested item tree.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  if (!location) {
    return NextResponse.json(
      { error: "location is required" },
      { status: 400 },
    );
  }

  const menu = await prisma.navigationMenu.findFirst({
    where: { location },
    orderBy: { updatedAt: "desc" },
    include: {
      items: {
        orderBy: [{ parentId: "asc" }, { order: "asc" }],
      },
    },
  });

  if (!menu) {
    return NextResponse.json({ menu: null, items: [] });
  }

  // Build a tree: top-level items with children nested inside
  const topLevel = menu.items
    .filter((i) => !i.parentId)
    .map((item) => ({
      ...item,
      children: menu.items
        .filter((c) => c.parentId === item.id)
        .sort((a, b) => a.order - b.order),
    }));

  return NextResponse.json({
    menu: { id: menu.id, name: menu.name, location: menu.location },
    items: topLevel,
  });
}
