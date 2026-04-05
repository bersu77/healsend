import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request, { params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const template = await prisma.formTemplate.findUnique({
    where: { id },
    include: { submissions: { orderBy: { createdAt: "desc" }, take: 50 } },
  });
  if (!template)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!template.active && currentUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(template);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const template = await prisma.formTemplate.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      ...(Array.isArray(body.fields) ? { fields: body.fields } : {}),
      ...(body.active !== undefined ? { active: !!body.active } : {}),
      ...(body.styling !== undefined ? { styling: body.styling } : {}),
    },
    include: { submissions: { orderBy: { createdAt: "desc" }, take: 50 } },
  });
  return NextResponse.json(template);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.formTemplate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
