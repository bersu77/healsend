import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// GET /api/marketing-pages/product/[productId]
export async function GET(_request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, slug: true, name: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const marketingPage = await prisma.marketingPage.findFirst({
    where: { pageType: "PRODUCT", slug: product.slug },
    select: {
      id: true,
      slug: true,
      title: true,
      seoTitle: true,
      seoDescription: true,
      heroImage: true,
      content: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    product,
    marketingPage: marketingPage || null,
    content: marketingPage?.content || {},
  });
}

// PUT /api/marketing-pages/product/[productId]
export async function PUT(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, slug: true, name: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await request.json();
  const content =
    body.content &&
    typeof body.content === "object" &&
    !Array.isArray(body.content)
      ? body.content
      : {};

  const selectFields = {
    id: true,
    slug: true,
    title: true,
    seoTitle: true,
    seoDescription: true,
    heroImage: true,
    content: true,
    updatedAt: true,
  };

  // Only operate on PRODUCT-type pages to avoid overwriting CUSTOM marketing pages
  const existing = await prisma.marketingPage.findFirst({
    where: { pageType: "PRODUCT", slug: product.slug },
    select: { id: true },
  });

  let marketingPage;
  if (existing) {
    marketingPage = await prisma.marketingPage.update({
      where: { id: existing.id },
      data: { content },
      select: selectFields,
    });
  } else {
    // Ensure no conflicting page exists under a different type
    const conflicting = await prisma.marketingPage.findUnique({
      where: { slug: product.slug },
      select: { id: true },
    });
    if (conflicting) {
      return NextResponse.json(
        {
          error:
            "A marketing page already exists for this slug under a different page type.",
        },
        { status: 409 },
      );
    }
    marketingPage = await prisma.marketingPage.create({
      data: {
        slug: product.slug,
        title: product.name,
        pageType: "PRODUCT",
        source: "custom",
        productId: product.id,
        content,
      },
      select: selectFields,
    });
  }

  return NextResponse.json({ marketingPage, content: marketingPage.content });
}
