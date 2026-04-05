import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function buildUniqueFormSlug(input) {
  const base = slugify(input) || "form";
  let candidate = base;
  let suffix = 2;

  while (await prisma.formTemplate.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix++}`;
  }

  return candidate;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const templates = await prisma.formTemplate.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } } },
  });
  return NextResponse.json(templates);
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  if (!String(body.name || "").trim()) {
    return NextResponse.json(
      { error: "Form name is required" },
      { status: 400 },
    );
  }

  const template = await prisma.formTemplate.create({
    data: {
      name: body.name,
      slug: await buildUniqueFormSlug(body.slug || body.name),
      description: body.description || null,
      fields: Array.isArray(body.fields) ? body.fields : [],
      active: body.active ?? false,
      styling:
        body.styling && typeof body.styling === "object" ? body.styling : null,
    },
    include: { _count: { select: { submissions: true } } },
  });
  return NextResponse.json(template, { status: 201 });
}
