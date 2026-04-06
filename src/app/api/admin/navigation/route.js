import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/admin/navigation — list all menus with item counts
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const menus = await prisma.navigationMenu.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { items: true } },
    },
  });

  return NextResponse.json({ menus });
}

// POST /api/admin/navigation — create a new menu
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, location } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const VALID_LOCATIONS = ["header", "footer", "mobile", "custom"];
  const loc = VALID_LOCATIONS.includes(location) ? location : "custom";

  const menu = await prisma.navigationMenu.create({
    data: { name: name.trim(), location: loc },
    include: { _count: { select: { items: true } } },
  });

  return NextResponse.json(menu, { status: 201 });
}
