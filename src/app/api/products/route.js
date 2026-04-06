import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  buildPublicCatalogProductWhere,
  filterReadyPublicCatalogProducts,
  isExcludedPublicCatalogSlug,
  isPublicCatalogProductReady,
  normalizePublicCatalogProduct,
  normalizePublicCatalogProducts,
} from "@/lib/public-catalog";
import {
  getProductStripeSyncSummary,
  syncStripeProductForProduct,
} from "@/lib/stripe-product-sync";
import { NextResponse } from "next/server";

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function buildUniqueProductSlug(input) {
  const base = slugify(input) || "product";
  let candidate = base;
  let suffix = 2;

  // Keep this tiny and explicit so admin product creation stays collision-safe.
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix++}`;
  }

  return candidate;
}

function normalizeFloat(value) {
  return value ? parseFloat(value) : null;
}

function normalizeInt(value) {
  return value ? parseInt(value, 10) : null;
}

// GET /api/products — list all products
export async function GET(request) {
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const search = searchParams.get("search");
  const slug = searchParams.get("slug");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  // Direct slug lookup — returns single product
  if (slug) {
    if (isExcludedPublicCatalogSlug(slug)) {
      return NextResponse.json({ products: [], total: 0, page: 1, limit: 1 });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, brand: true, variants: true },
    });
    if (!product || (!isAdmin && !isPublicCatalogProductReady(product)))
      return NextResponse.json({ products: [], total: 0, page: 1, limit: 1 });
    return NextResponse.json({
      products: [isAdmin ? product : normalizePublicCatalogProduct(product)],
      total: 1,
      page: 1,
      limit: 1,
    });
  }

  /** @type {Record<string, any>} */
  const where = isAdmin
    ? {}
    : buildPublicCatalogProductWhere({ published: true });
  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (isAdmin) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true, variants: true },
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit });
  }

  const products = filterReadyPublicCatalogProducts(
    await prisma.product.findMany({
      where,
      include: { category: true, brand: true, variants: true },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    }),
  );

  const total = products.length;
  const pagedProducts = normalizePublicCatalogProducts(
    products.slice((page - 1) * limit, page * limit),
  );

  return NextResponse.json({ products: pagedProducts, total, page, limit });
}

// POST /api/products — create a product
export async function POST(request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  if (!String(body.name || "").trim()) {
    return NextResponse.json(
      { error: "Product name is required." },
      { status: 400 },
    );
  }

  const slug = await buildUniqueProductSlug(body.slug || body.name);

  let product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      type: body.type || "SIMPLE",
      sku: body.sku || null,
      published: body.published ?? true,
      featured: body.featured ?? false,
      shortDescription: body.shortDescription || null,
      description: body.description || null,
      regularPrice: normalizeFloat(body.regularPrice),
      salePrice: normalizeFloat(body.salePrice),
      inStock: body.inStock ?? true,
      stock: normalizeInt(body.stock),
      images: Array.isArray(body.images) ? body.images : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      categoryId: body.categoryId || null,
      brandId: body.brandId || null,
      subscriptionTiers: body.subscriptionTiers || null,
      attributes: body.attributes || null,
      priority: normalizeInt(body.priority) || 0,
      telehealthProvider: body.telehealthProvider || "MDI",
      olaServiceKey: body.olaServiceKey || null,
    },
    include: { category: true, brand: true },
  });

  const stripeSync = await syncStripeProductForProduct(product, {
    baseUrl: new URL(request.url).origin,
  });

  product = await prisma.product.update({
    where: { id: product.id },
    data: {
      stripeProductId: stripeSync.stripeProductId,
      attributes: stripeSync.attributes,
    },
    include: { category: true, brand: true, variants: true },
  });

  return NextResponse.json(
    {
      ...product,
      stripeSync: stripeSync.summary || getProductStripeSyncSummary(product),
    },
    { status: 201 },
  );
}
