import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * PATCH /api/products/[id]/questionnaire
 *
 * Links or unlinks a questionnaire (OnboardingTemplate) to a product.
 * Body: { templateId: string | null }
 *
 * - Unlinks any existing template that currently points to this product.
 * - Links the new template by setting its productId.
 * - Passing templateId: null clears the assignment.
 */
export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: productId } = await params;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { templateId } = body;

  await prisma.$transaction(async (tx) => {
    // Unlink any template currently associated with this product
    await tx.onboardingTemplate.updateMany({
      where: { productId },
      data: { productId: null },
    });

    // Link the new template if provided
    if (templateId) {
      const template = await tx.onboardingTemplate.findUnique({
        where: { id: templateId },
      });
      if (!template) {
        throw new Error("Template not found");
      }
      await tx.onboardingTemplate.update({
        where: { id: templateId },
        data: { productId },
      });
    }
  });

  const linked = templateId
    ? await prisma.onboardingTemplate.findUnique({ where: { id: templateId } })
    : null;

  return NextResponse.json({
    ok: true,
    templateId: linked?.id ?? null,
    templateName: linked?.name ?? null,
  });
}
