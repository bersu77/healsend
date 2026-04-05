import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const CATEGORY_FALLBACK_SLUGS = new Set([
  "anti-aging",
  "glutathione-ldn",
  "sexual-health",
  "sleep",
  "strength-recovery",
  "weight-loss",
]);

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function isExcludedPublicCatalogSlug(slug) {
  const normalized = String(slug || "").trim().toLowerCase();

  return (
    normalized === "404-error" ||
    normalized === "payment-complete" ||
    normalized === "sample-page" ||
    normalized === "test" ||
    normalized.startsWith("test-") ||
    normalized.endsWith("-test")
  );
}

function getProductPriceSummary(product) {
  const variantPrices = Array.isArray(product?.variants)
    ? product.variants
        .map((variant) => toFiniteNumber(variant?.price))
        .filter((price) => price !== null)
    : [];

  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  const subscriptionTierPrices = Array.isArray(product?.subscriptionTiers)
    ? product.subscriptionTiers
        .map(
          (tier) =>
            toFiniteNumber(tier?.first_price) ??
            toFiniteNumber(tier?.firstMonthPrice) ??
            toFiniteNumber(tier?.price),
        )
        .filter((price) => price !== null)
    : [];

  if (subscriptionTierPrices.length > 0) {
    return Math.min(...subscriptionTierPrices);
  }

  return (
    toFiniteNumber(product?.salePrice) ??
    toFiniteNumber(product?.regularPrice) ??
    null
  );
}

function getPublicCatalogReadinessIssues(product) {
  const issues = [];

  if (isExcludedPublicCatalogSlug(product.slug)) {
    issues.push("excluded-slug");
  }

  if (getProductPriceSummary(product) === null) {
    issues.push("missing-pricing");
  }

  return issues;
}

function isPublicCatalogProductReady(product) {
  return getPublicCatalogReadinessIssues(product).length === 0;
}

function isSuspiciousImageUrl(url) {
  return /(imageuploadtest|placeholder|dummy|sample)/i.test(String(url || ""));
}

function buildMarkdownReport({
  generatedAt,
  summary,
  excludedProducts,
  blockedProducts,
  missingPriceProducts,
  genericCategoryProducts,
  missingImageProducts,
  suspiciousImageProducts,
  thinCopyProducts,
  categoriesWithoutMarketingPages,
}) {
  const lines = [
    "# Public Catalog Audit",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Published products scanned: \`${summary.totalPublishedProducts}\``,
    `- Public product candidates after test/staging exclusion: \`${summary.publicProductCandidates}\``,
    `- Runtime-ready public products: \`${summary.readyPublicProducts}\``,
    `- Blocked product candidates hidden from runtime: \`${blockedProducts.length}\``,
    `- Excluded test/staging products still in DB: \`${excludedProducts.length}\``,
    `- Blocked candidates missing usable pricing: \`${missingPriceProducts.length}\``,
    `- Runtime-ready products in generic or uncategorized buckets: \`${genericCategoryProducts.length}\``,
    `- Runtime-ready products missing images: \`${missingImageProducts.length}\``,
    `- Runtime-ready products with suspicious placeholder/test images: \`${suspiciousImageProducts.length}\``,
    `- Runtime-ready products with thin copy (< 40 chars): \`${thinCopyProducts.length}\``,
    `- Runtime-ready categories without a dedicated marketing CATEGORY page: \`${categoriesWithoutMarketingPages.length}\``,
    "",
    "## Excluded Test/Staging Products Still In Database",
    "",
  ];

  if (excludedProducts.length === 0) {
    lines.push("- None");
  } else {
    for (const product of excludedProducts) {
      lines.push(
        `- \`${product.slug}\` — ${product.name}${product.category ? ` (${product.category.slug})` : ""}`,
      );
    }
  }

  lines.push("", "## Blocked Product Candidates Hidden From Runtime", "");

  if (blockedProducts.length === 0) {
    lines.push("- None");
  } else {
    for (const product of blockedProducts) {
      lines.push(
        `- \`${product.slug}\` — ${product.name} (${getPublicCatalogReadinessIssues(product).join(", ")})`,
      );
    }
  }

  lines.push("", "## Blocked Product Candidates Missing Pricing", "");

  if (missingPriceProducts.length === 0) {
    lines.push("- None");
  } else {
    for (const product of missingPriceProducts) {
      lines.push(`- \`${product.slug}\` — ${product.name}`);
    }
  }

  lines.push("", "## Runtime-Ready Products In Generic Categories", "");

  if (genericCategoryProducts.length === 0) {
    lines.push("- None");
  } else {
    for (const product of genericCategoryProducts) {
      lines.push(
        `- \`${product.slug}\` — ${product.name}${product.category ? ` (${product.category.slug})` : " (no category)"}`,
      );
    }
  }

  lines.push("", "## Runtime-Ready Products Missing Or Using Suspicious Images", "");

  if (missingImageProducts.length === 0 && suspiciousImageProducts.length === 0) {
    lines.push("- None");
  } else {
    for (const product of missingImageProducts) {
      lines.push(`- Missing image: \`${product.slug}\` — ${product.name}`);
    }
    for (const product of suspiciousImageProducts) {
      lines.push(
        `- Suspicious image: \`${product.slug}\` — ${product.name} -> ${product.images?.[0] || "none"}`,
      );
    }
  }

  lines.push("", "## Runtime-Ready Products With Thin Copy", "");

  if (thinCopyProducts.length === 0) {
    lines.push("- None");
  } else {
    for (const product of thinCopyProducts.slice(0, 40)) {
      lines.push(`- \`${product.slug}\` — ${product.name}`);
    }
  }

  lines.push("", "## Runtime-Ready Categories Without Dedicated CATEGORY Pages", "");

  if (categoriesWithoutMarketingPages.length === 0) {
    lines.push("- None");
  } else {
    for (const category of categoriesWithoutMarketingPages) {
      lines.push(
        `- \`${category.slug}\` — ${category.name} (${category.productCount} public products)`,
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const generatedAt = new Date().toISOString();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { published: true },
      select: {
        slug: true,
        name: true,
        images: true,
        regularPrice: true,
        salePrice: true,
        shortDescription: true,
        description: true,
        subscriptionTiers: true,
        variants: {
          select: {
            price: true,
          },
        },
        category: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
      orderBy: { slug: "asc" },
    }),
    prisma.category.findMany({
      select: {
        slug: true,
        name: true,
        products: {
          where: { published: true },
          select: {
            slug: true,
            regularPrice: true,
            salePrice: true,
            subscriptionTiers: true,
            variants: {
              select: {
                price: true,
              },
            },
          },
        },
        marketingPages: {
          where: { pageType: "CATEGORY" },
          select: {
            slug: true,
          },
        },
      },
      orderBy: { slug: "asc" },
    }),
  ]);

  const excludedProducts = products.filter((product) =>
    isExcludedPublicCatalogSlug(product.slug),
  );
  const publicProductCandidates = products.filter(
    (product) => !isExcludedPublicCatalogSlug(product.slug),
  );
  const blockedProducts = publicProductCandidates.filter(
    (product) => !isPublicCatalogProductReady(product),
  );
  const readyPublicProducts = publicProductCandidates.filter((product) =>
    isPublicCatalogProductReady(product),
  );
  const missingPriceProducts = blockedProducts.filter(
    (product) => getProductPriceSummary(product) === null,
  );
  const genericCategoryProducts = readyPublicProducts.filter(
    (product) => !product.category || product.category.slug === "treatments",
  );
  const missingImageProducts = readyPublicProducts.filter(
    (product) => !Array.isArray(product.images) || product.images.length === 0,
  );
  const suspiciousImageProducts = readyPublicProducts.filter(
    (product) => product.images?.[0] && isSuspiciousImageUrl(product.images[0]),
  );
  const thinCopyProducts = readyPublicProducts.filter((product) => {
    const text = stripHtml(product.shortDescription || product.description || "");
    return text.length < 40;
  });
  const categoriesWithoutMarketingPages = categories
    .map((category) => {
      const publicProductCount = category.products.filter(
        (product) =>
          !isExcludedPublicCatalogSlug(product.slug) &&
          isPublicCatalogProductReady(product),
      ).length;

      return {
        slug: category.slug,
        name: category.name,
        productCount: publicProductCount,
        hasMarketingPage: category.marketingPages.length > 0,
      };
    })
    .filter(
      (category) =>
        category.productCount > 0 &&
        !category.hasMarketingPage &&
        !CATEGORY_FALLBACK_SLUGS.has(category.slug),
    );

  const summary = {
    totalPublishedProducts: products.length,
    publicProductCandidates: publicProductCandidates.length,
    readyPublicProducts: readyPublicProducts.length,
    excludedProducts: excludedProducts.length,
    blockedProducts: blockedProducts.length,
    missingPriceProducts: missingPriceProducts.length,
    genericCategoryProducts: genericCategoryProducts.length,
    missingImageProducts: missingImageProducts.length,
    suspiciousImageProducts: suspiciousImageProducts.length,
    thinCopyProducts: thinCopyProducts.length,
    categoriesWithoutMarketingPages: categoriesWithoutMarketingPages.length,
  };

  const report = {
    generatedAt,
    summary,
    excludedProducts,
    blockedProducts,
    missingPriceProducts,
    genericCategoryProducts,
    missingImageProducts,
    suspiciousImageProducts,
    thinCopyProducts,
    categoriesWithoutMarketingPages,
  };

  const markdown = buildMarkdownReport({
    generatedAt,
    summary,
    excludedProducts,
    blockedProducts,
    missingPriceProducts,
    genericCategoryProducts,
    missingImageProducts,
    suspiciousImageProducts,
    thinCopyProducts,
    categoriesWithoutMarketingPages,
  });

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const jsonPath = path.join(
    OUTPUT_DIR,
    `public-catalog-${timestamp}.json`,
  );
  const mdPath = path.join(
    OUTPUT_DIR,
    `public-catalog-${timestamp}.md`,
  );
  const latestPath = path.join(OUTPUT_DIR, "public-catalog-latest.md");

  await Promise.all([
    fs.writeFile(jsonPath, JSON.stringify(report, null, 2)),
    fs.writeFile(mdPath, markdown),
    fs.writeFile(latestPath, markdown),
  ]);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        summary,
        jsonPath: path.relative(process.cwd(), jsonPath),
        markdownPath: path.relative(process.cwd(), mdPath),
        latestPath: path.relative(process.cwd(), latestPath),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
