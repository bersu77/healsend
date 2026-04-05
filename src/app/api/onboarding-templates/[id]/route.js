import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import {
  normalizeOnboardingStepsForPersistence,
  sanitizeOnboardingTemplate,
} from "@/lib/onboarding-template-utils";

// GET /api/onboarding-templates/[id] — get single template
export async function GET(request, { params }) {
  const { id } = await params;

  const template = await prisma.onboardingTemplate.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      steps: { orderBy: { order: "asc" } },
      category: true,
      _count: { select: { submissions: true } },
    },
  });

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json(sanitizeOnboardingTemplate(template));
}

// PUT /api/onboarding-templates/[id] — update template (admin only)
export async function PUT(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, description, categoryId, productId, active, styling, steps } =
    body;
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
  let sanitizedSteps = null;

  try {
    sanitizedSteps =
      steps && Array.isArray(steps)
        ? normalizeOnboardingStepsForPersistence(steps, products, {
            defaultProductId: productId || null,
          })
        : null;
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Invalid step configuration." },
      { status: 400 },
    );
  }

  // Update the template metadata
  const updateData = {};
  if (name !== undefined) {
    updateData.name = name;
    updateData.slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await prisma.onboardingTemplate.findFirst({
      where: {
        slug: updateData.slug,
        id: { not: id },
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Another template already uses this name." },
        { status: 409 },
      );
    }
  }
  if (description !== undefined) updateData.description = description;
  if (categoryId !== undefined) updateData.categoryId = categoryId || null;
  if (productId !== undefined) updateData.productId = productId || null;
  if (active !== undefined) updateData.active = active;
  if (styling !== undefined) updateData.styling = styling;

  await prisma.$transaction(async (tx) => {
    await tx.onboardingTemplate.update({
      where: { id },
      data: updateData,
    });

    if (sanitizedSteps) {
      await tx.onboardingStep.deleteMany({ where: { templateId: id } });

      if (sanitizedSteps.length > 0) {
        await tx.onboardingStep.createMany({
          data: sanitizedSteps.map((step, index) => ({
            templateId: id,
            title: step.title,
            subtitle: step.subtitle || null,
            type: step.type,
            order: step.order ?? index + 1,
            config: step.config || {},
            required: step.required ?? true,
          })),
        });
      }
    }
  });

  // Return the full updated template
  const result = await prisma.onboardingTemplate.findUnique({
    where: { id },
    include: {
      steps: { orderBy: { order: "asc" } },
      category: true,
    },
  });

  return NextResponse.json(sanitizeOnboardingTemplate(result));
}

// DELETE /api/onboarding-templates/[id] — delete template (admin only)
export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.onboardingTemplate.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
