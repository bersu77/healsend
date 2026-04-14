import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  getProductStripeSyncSummary,
  syncStripeProductForProduct,
} from "@/lib/stripe-product-sync";
import { NextResponse } from "next/server";

function normalizeFloat(value) {
  return value ? parseFloat(value) : null;
}

function normalizeInt(value) {
  return value ? parseInt(value, 10) : null;
}

// GET /api/products/[id]
export async function GET(_request, { params }) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, brand: true, variants: true },
  });
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const linkedTemplate = await prisma.onboardingTemplate.findFirst({
    where: { productId: id },
    select: { id: true, name: true, slug: true },
  });

  return NextResponse.json({
    ...product,
    questionnaireTemplateId: linkedTemplate?.id ?? null,
    questionnaireTemplateName: linkedTemplate?.name ?? null,
    stripeSync: getProductStripeSyncSummary(product),
  });
}

// PUT /api/products/[id]
export async function PUT(request, { params }) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  let product = await prisma.product.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.slug && { slug: body.slug }),
      ...(body.type && { type: body.type }),
      ...(body.sku !== undefined && { sku: body.sku || null }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.featured !== undefined && { featured: body.featured }),
      ...(body.shortDescription !== undefined && {
        shortDescription: body.shortDescription,
      }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.regularPrice !== undefined && {
        regularPrice: normalizeFloat(body.regularPrice),
      }),
      ...(body.salePrice !== undefined && {
        salePrice: normalizeFloat(body.salePrice),
      }),
      ...(body.inStock !== undefined && { inStock: body.inStock }),
      ...(body.stock !== undefined && { stock: normalizeInt(body.stock) }),
      ...(body.images !== undefined && {
        images: Array.isArray(body.images) ? body.images : [],
      }),
      ...(body.tags !== undefined && {
        tags: Array.isArray(body.tags) ? body.tags : [],
      }),
      ...(body.categoryId !== undefined && {
        categoryId: body.categoryId || null,
      }),
      ...(body.brandId !== undefined && { brandId: body.brandId || null }),
      ...(body.subscriptionTiers !== undefined && {
        subscriptionTiers: body.subscriptionTiers,
      }),
      ...(body.attributes !== undefined && { attributes: body.attributes }),
      ...(body.priority !== undefined && {
        priority: normalizeInt(body.priority) || 0,
      }),
      ...(body.telehealthProvider !== undefined && {
        telehealthProvider: body.telehealthProvider,
      }),
      ...(body.olaServiceKey !== undefined && {
        olaServiceKey: body.olaServiceKey || null,
      }),
    },
    include: { category: true, brand: true, variants: true },
  });

  const stripeSync = await syncStripeProductForProduct(product, {
    baseUrl: new URL(request.url).origin,
  });

  product = await prisma.product.update({
    where: { id },
    data: {
      stripeProductId: stripeSync.stripeProductId,
      attributes: stripeSync.attributes,
    },
    include: { category: true, brand: true, variants: true },
  });

  return NextResponse.json({
    ...product,
    stripeSync: stripeSync.summary || getProductStripeSyncSummary(product),
  });
}

// DELETE /api/products/[id]
export async function DELETE(_request, { params }) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
