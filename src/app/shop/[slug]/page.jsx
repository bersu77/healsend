import { notFound } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import { prisma } from "@/lib/prisma";
import { buildPageMetadata } from "@/lib/seo";
import { getMarketingProductDetailPath } from "@/lib/product-routing";
import {
  getPublicCatalogPrimaryImage,
  isExcludedPublicCatalogSlug,
  isPublicCatalogProductReady,
  normalizePublicCatalogProduct,
} from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getProductBySlug(slug) {
  if (isExcludedPublicCatalogSlug(slug)) {
    return null;
  }

  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      variants: true,
    },
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !isPublicCatalogProductReady(product)) {
    return buildPageMetadata({
      title: "Product Not Found | HealSend",
      description: "This HealSend product could not be found.",
      path: `/shop/${slug}`,
      noIndex: true,
    });
  }

  const description =
    stripHtml(product.shortDescription) ||
    stripHtml(product.description)?.slice(0, 280) ||
    "Explore clinician-guided treatment options from HealSend.";

  return buildPageMetadata({
    title: `${product.name} | HealSend`,
    description,
    path: getMarketingProductDetailPath(product.slug),
    image: getPublicCatalogPrimaryImage(product, null),
  });
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !isPublicCatalogProductReady(product)) {
    notFound();
  }

  const serializableProduct = JSON.parse(
    JSON.stringify(normalizePublicCatalogProduct(product)),
  );
  return <ProductDetailClient product={serializableProduct} />;
}
