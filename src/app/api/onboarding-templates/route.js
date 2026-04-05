import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import {
  normalizeOnboardingStepsForPersistence,
  sanitizeOnboardingTemplates,
} from "@/lib/onboarding-template-utils";

// GET /api/onboarding-templates — list all templates
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const active = searchParams.get("active");
  const slug = searchParams.get("slug");

  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (active !== null && active !== undefined) where.active = active === "true";
  if (slug) where.slug = slug;

  const templates = await prisma.onboardingTemplate.findMany({
    where,
    include: {
      steps: { orderBy: { order: "asc" } },
      category: true,
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sanitizeOnboardingTemplates(templates));
}

// POST /api/onboarding-templates — create a new template (admin only)
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, categoryId, productId, styling, steps } = body;
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
      description: true,
      categoryId: true,
      regularPrice: true,
      salePrice: true,
      subscriptionTiers: true,
    },
  });
  let sanitizedSteps;

  try {
    sanitizedSteps = normalizeOnboardingStepsForPersistence(steps, products, {
      defaultProductId: productId || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Invalid step configuration." },
      { status: 400 },
    );
  }

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check unique slug
  const existing = await prisma.onboardingTemplate.findUnique({
    where: { slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A template with this name already exists" },
      { status: 409 },
    );
  }

  const template = await prisma.onboardingTemplate.create({
    data: {
      name,
      slug,
      description: description || null,
      categoryId: categoryId || null,
      productId: productId || null,
      styling: styling || null,
      steps: sanitizedSteps.length
        ? {
            create: sanitizedSteps.map((s, i) => ({
              title: s.title,
              subtitle: s.subtitle || null,
              type: s.type,
              order: s.order ?? i + 1,
              config: s.config || {},
              required: s.required ?? true,
            })),
          }
        : undefined,
    },
    include: {
      steps: { orderBy: { order: "asc" } },
      category: true,
    },
  });

  return NextResponse.json(sanitizeOnboardingTemplates([template])[0], {
    status: 201,
  });
}
