import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/admin/navigation/[id] — get a menu with its full item tree
export async function GET(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const menu = await prisma.navigationMenu.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: [{ parentId: "asc" }, { order: "asc" }],
      },
    },
  });

  if (!menu) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(menu);
}

// PUT /api/admin/navigation/[id] — update menu name / location
export async function PUT(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, location } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const VALID_LOCATIONS = ["header", "footer", "mobile", "custom"];
  const loc = VALID_LOCATIONS.includes(location) ? location : "custom";

  const menu = await prisma.navigationMenu.update({
    where: { id },
    data: { name: name.trim(), location: loc },
  });

  return NextResponse.json(menu);
}

// DELETE /api/admin/navigation/[id] — delete a menu and all its items
export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.navigationMenu.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
