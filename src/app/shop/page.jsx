import ShopPageClient from "./shop-page-client";
import { prisma } from "@/lib/prisma";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildPublicCatalogProductWhere,
  filterReadyPublicCatalogProducts,
  normalizePublicCatalogProducts,
} from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Browse Treatments | HealSend",
  description:
    "Explore clinician-guided treatments, pricing, and care plans across the HealSend catalog.",
  path: "/shop",
});

const PAGE_SIZE = 12;

function normalizePage(value) {
  const parsed = Number.parseInt(String(value || "1"), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default async function ShopPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const page = normalizePage(resolvedSearchParams.page);
  const search = String(resolvedSearchParams.search || "").trim();
  const categorySlug = String(resolvedSearchParams.category || "").trim();

  const allProducts = filterReadyPublicCatalogProducts(
    await prisma.product.findMany({
      where: buildPublicCatalogProductWhere({ published: true }),
      include: { category: true, brand: true, variants: true },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    }),
  );

  const categories = [...new Map(
    allProducts
      .filter((product) => product.category)
      .map((product) => [
        product.category.id,
        {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
          priority: product.category.priority ?? 0,
        },
      ]),
  ).values()].sort((left, right) => {
    if (left.priority !== right.priority) {
      return right.priority - left.priority;
    }

    return left.name.localeCompare(right.name);
  });

  const matchedCategory =
    categories.find((category) => category.slug === categorySlug) || null;

  const filteredProducts = allProducts.filter((product) => {
    if (matchedCategory && product.categoryId !== matchedCategory.id) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = `${product.name || ""} ${product.shortDescription || ""}`
      .toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const total = filteredProducts.length;
  const products = normalizePublicCatalogProducts(
    filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  );

  const initialData = {
    categories,
    products: JSON.parse(JSON.stringify(products)),
    meta: {
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    },
    params: {
      page,
      search,
      categoryId: matchedCategory?.id || "",
    },
  };

  return <ShopPageClient initialData={initialData} />;
}
