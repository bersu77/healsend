import { getProductPriceSummary } from "@/lib/pricing";
import {
  getDefaultMarketingImageForPath,
  isSuspiciousMarketingImage,
  normalizeMarketingImage,
  WORDPRESS_MARKETING_IMAGES,
} from "@/lib/marketing-images";

const EXACT_EXCLUDED_PUBLIC_CATALOG_SLUGS = new Set([
  "404-error",
  "payment-complete",
  "sample-page",
  "test",
]);
const SUSPICIOUS_PUBLIC_CATALOG_IMAGE_PATTERN =
  /(imageuploadtest|placeholder|dummy|sample)/i;
const CATEGORY_FALLBACK_ROUTE_BY_SLUG = Object.freeze({
  "weight-loss": "/weight-loss",
  "sexual-health": "/sexual-health",
  "anti-aging": "/anti-aging",
  "strength-recovery": "/strength-recovery",
  sleep: "/sleep",
  "glutathione-ldn": "/glutathione-ldn",
  psychiatry: "/psychiatry",
  adhd: "/psychiatry",
  anxiety: "/psychiatry",
  depression: "/psychiatry",
  "mental-health": "/psychiatry",
  "birth-control": "/sexual-health",
});

function normalizeNotFilters(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function isExcludedPublicCatalogSlug(slug) {
  const normalized = String(slug || "").trim().toLowerCase();

  return (
    EXACT_EXCLUDED_PUBLIC_CATALOG_SLUGS.has(normalized) ||
    normalized.startsWith("test-") ||
    normalized.endsWith("-test")
  );
}

export function isSuspiciousPublicCatalogImage(url) {
  return (
    SUSPICIOUS_PUBLIC_CATALOG_IMAGE_PATTERN.test(String(url || "")) ||
    isSuspiciousMarketingImage(url)
  );
}

function getPublicCatalogFallbackImage(product, fallbackImage = null) {
  if (fallbackImage) {
    return fallbackImage;
  }

  const categorySlug = String(product?.category?.slug || "")
    .trim()
    .toLowerCase();
  const categoryRoute = CATEGORY_FALLBACK_ROUTE_BY_SLUG[categorySlug] || null;

  return (
    getDefaultMarketingImageForPath(categoryRoute || `/${product?.slug || ""}`) ||
    WORDPRESS_MARKETING_IMAGES.nadInjection
  );
}

function normalizeProductImages(product, fallbackImage = null) {
  const resolvedFallbackImage = getPublicCatalogFallbackImage(
    product,
    fallbackImage,
  );

  return Array.isArray(product?.images)
    ? product.images
        .map((image) => normalizeMarketingImage(image, resolvedFallbackImage))
        .filter(Boolean)
    : [];
}

export function getPublicCatalogImageList(product, fallbackImage = null) {
  const resolvedFallbackImage = getPublicCatalogFallbackImage(
    product,
    fallbackImage,
  );
  const images = normalizeProductImages(product, resolvedFallbackImage).filter(
    (image) => !isSuspiciousPublicCatalogImage(image),
  );

  if (images.length > 0) {
    return images;
  }

  return resolvedFallbackImage ? [resolvedFallbackImage] : [];
}

export function getPublicCatalogPrimaryImage(
  product,
  fallbackImage = null,
) {
  const resolvedFallbackImage = getPublicCatalogFallbackImage(
    product,
    fallbackImage,
  );
  const primaryImage =
    getPublicCatalogImageList(product, resolvedFallbackImage)[0] || null;

  return primaryImage || resolvedFallbackImage;
}

export function getPublicCatalogReadinessIssues(product) {
  const issues = [];

  if (isExcludedPublicCatalogSlug(product?.slug)) {
    issues.push("excluded-slug");
  }

  if (!getProductPriceSummary(product)) {
    issues.push("missing-pricing");
  }

  return issues;
}

export function isPublicCatalogProductReady(product) {
  return getPublicCatalogReadinessIssues(product).length === 0;
}

export function buildPublicCatalogProductWhere(where = {}) {
  return {
    ...where,
    NOT: [
      ...normalizeNotFilters(where.NOT),
      { slug: "test" },
      { slug: { startsWith: "test-" } },
      { slug: { endsWith: "-test" } },
    ],
  };
}

export function filterPublicCatalogProducts(products) {
  return Array.isArray(products)
    ? products.filter((product) => !isExcludedPublicCatalogSlug(product?.slug))
    : [];
}

export function filterReadyPublicCatalogProducts(products) {
  return filterPublicCatalogProducts(products).filter((product) =>
    isPublicCatalogProductReady(product),
  );
}

export function normalizePublicCatalogProduct(product, options = {}) {
  if (!product || typeof product !== "object") {
    return product;
  }

  return {
    ...product,
    images: getPublicCatalogImageList(product, options.fallbackImage || null),
  };
}

export function normalizePublicCatalogProducts(products, options = {}) {
  return Array.isArray(products)
    ? products.map((product) => normalizePublicCatalogProduct(product, options))
    : [];
}
