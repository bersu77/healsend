import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const BASE_URL = String(
  process.env.CATALOG_AUDIT_BASE_URL ||
    process.env.BASE_URL ||
    "http://127.0.0.1:3000",
).replace(/\/+$/, "");
const MAX_REDIRECTS = 5;

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
  const normalized = String(slug || "")
    .trim()
    .toLowerCase();

  return (
    normalized === "404-error" ||
    normalized === "payment-complete" ||
    normalized === "sample-page" ||
    normalized === "test" ||
    normalized.startsWith("test-") ||
    normalized.endsWith("-test")
  );
}

function isSuspiciousImageUrl(url) {
  return /(imageuploadtest|placeholder|dummy|sample)/i.test(String(url || ""));
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

function isPublicCatalogProductReady(product) {
  return (
    !isExcludedPublicCatalogSlug(product.slug) &&
    getProductPriceSummary(product) !== null
  );
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSlugListedInShopHtml(shopHtml, slug) {
  const pattern = new RegExp(
    `(href=["']/shop/${escapeRegex(slug)}["'])|("slug":"${escapeRegex(slug)}")`,
    "i",
  );

  return pattern.test(shopHtml);
}

function isRuntimeNotFoundResponse(response) {
  const body = String(response?.body || "");

  return (
    response?.finalStatus === 404 ||
    body.includes('name="next-error" content="not-found"') ||
    body.includes("NEXT_HTTP_ERROR_FALLBACK;404") ||
    body.includes("<title>Product Not Found | HealSend</title>")
  );
}

async function fetchWithRedirects(urlPath, headers = {}) {
  const chain = [];
  let currentUrl = new URL(urlPath, `${BASE_URL}/`).toString();

  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers,
    });

    const location = response.headers.get("location");
    const nextUrl = location ? new URL(location, currentUrl).toString() : null;

    chain.push({
      url: currentUrl,
      status: response.status,
      location: nextUrl,
    });

    if (response.status >= 300 && response.status < 400 && nextUrl) {
      currentUrl = nextUrl;
      continue;
    }

    return {
      finalStatus: response.status,
      finalUrl: currentUrl,
      chain,
      body: await response.text(),
      contentType: response.headers.get("content-type") || "",
    };
  }

  return {
    finalStatus: 310,
    finalUrl: currentUrl,
    chain,
    body: "",
    contentType: "",
  };
}

function buildMarkdownReport({
  generatedAt,
  baseUrl,
  hiddenSlugResults,
  suspiciousImageResults,
  shopPageClean,
  apiCatalogClean,
}) {
  const hiddenFailures = hiddenSlugResults.filter((result) => !result.ok);
  const suspiciousFailures = suspiciousImageResults.filter(
    (result) => !result.ok,
  );
  const totalFailures =
    hiddenFailures.length +
    suspiciousFailures.length +
    (shopPageClean ? 0 : 1) +
    (apiCatalogClean ? 0 : 1);
  const lines = [
    "# Public Catalog Runtime Verification",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Base URL: \`${baseUrl}\``,
    `- Hidden product slugs checked: \`${hiddenSlugResults.length}\``,
    `- Suspicious-image product routes checked: \`${suspiciousImageResults.length}\``,
    `- Shop listing clean: \`${shopPageClean ? "yes" : "no"}\``,
    `- Public products API clean: \`${apiCatalogClean ? "yes" : "no"}\``,
    `- Runtime failures: \`${totalFailures}\``,
    "",
  ];

  if (totalFailures === 0) {
    lines.push(
      "All blocked public-catalog products stayed hidden at runtime, and no suspicious test/placeholder asset URLs leaked back into the public shop or product detail surfaces.",
    );
  }

  lines.push("", "## Hidden Slug Results", "");

  for (const result of hiddenSlugResults) {
    lines.push(
      `- \`${result.slug}\` — ${result.ok ? "PASS" : "FAIL"} — status \`${result.finalStatus}\`, runtime not-found: \`${result.runtimeNotFound}\`, listed in shop: \`${result.foundInShop}\`, listed in API: \`${result.foundInApi}\``,
    );
  }

  lines.push("", "## Suspicious Image Results", "");

  if (suspiciousImageResults.length === 0) {
    lines.push("- None");
  } else {
    for (const result of suspiciousImageResults) {
      lines.push(
        `- \`${result.slug}\` — ${result.ok ? "PASS" : "FAIL"} — suspicious URL leaked: \`${result.leakedSuspiciousUrl}\``,
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const products = await prisma.product.findMany({
    where: { published: true },
    select: {
      slug: true,
      name: true,
      images: true,
      regularPrice: true,
      salePrice: true,
      subscriptionTiers: true,
      variants: {
        select: {
          price: true,
        },
      },
    },
    orderBy: { slug: "asc" },
  });

  const hiddenProducts = products.filter(
    (product) => !isPublicCatalogProductReady(product),
  );
  const suspiciousImageProducts = products.filter(
    (product) =>
      isPublicCatalogProductReady(product) &&
      Array.isArray(product.images) &&
      product.images.some((image) => isSuspiciousImageUrl(image)),
  );

  const shopResponse = await fetchWithRedirects("/shop", {
    accept: "text/html",
  });
  const shopHtml = shopResponse.body;
  const apiResponse = await fetchWithRedirects("/api/products?limit=200", {
    accept: "application/json",
  });
  const apiPayload = JSON.parse(apiResponse.body || "{}");
  const apiSlugs = new Set(
    Array.isArray(apiPayload.products)
      ? apiPayload.products.map((product) => product.slug)
      : [],
  );

  const hiddenSlugResults = [];
  for (const product of hiddenProducts) {
    const response = await fetchWithRedirects(`/shop/${product.slug}`, {
      accept: "text/html",
    });
    const foundInShop = isSlugListedInShopHtml(shopHtml, product.slug);
    const foundInApi = apiSlugs.has(product.slug);
    const runtimeNotFound = isRuntimeNotFoundResponse(response);

    hiddenSlugResults.push({
      slug: product.slug,
      finalStatus: response.finalStatus,
      runtimeNotFound,
      foundInShop,
      foundInApi,
      ok: runtimeNotFound && !foundInShop && !foundInApi,
    });
  }

  const suspiciousImageResults = [];
  for (const product of suspiciousImageProducts) {
    const suspiciousUrl = product.images.find((image) =>
      isSuspiciousImageUrl(image),
    );
    const response = await fetchWithRedirects(`/shop/${product.slug}`, {
      accept: "text/html",
    });
    const leakedSuspiciousUrl =
      response.finalStatus === 200 && suspiciousUrl
        ? response.body.includes(suspiciousUrl)
        : false;

    suspiciousImageResults.push({
      slug: product.slug,
      suspiciousUrl,
      leakedSuspiciousUrl,
      ok: response.finalStatus === 200 && !leakedSuspiciousUrl,
    });
  }

  const shopPageClean =
    !hiddenProducts.some((product) =>
      isSlugListedInShopHtml(shopHtml, product.slug),
    ) && !/imageuploadtest/i.test(shopHtml);
  const apiCatalogClean =
    hiddenProducts.every((product) => !apiSlugs.has(product.slug)) &&
    !JSON.stringify(apiPayload).match(/imageuploadtest/i);

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const jsonPath = path.join(
    OUTPUT_DIR,
    `public-catalog-runtime-${timestamp}.json`,
  );
  const markdownPath = path.join(
    OUTPUT_DIR,
    `public-catalog-runtime-${timestamp}.md`,
  );
  const latestPath = path.join(OUTPUT_DIR, "public-catalog-runtime-latest.md");

  const payload = {
    generatedAt,
    baseUrl: BASE_URL,
    hiddenProducts: hiddenSlugResults,
    suspiciousImageProducts: suspiciousImageResults,
    shopPageClean,
    apiCatalogClean,
  };

  const markdown = buildMarkdownReport({
    generatedAt,
    baseUrl: BASE_URL,
    hiddenSlugResults,
    suspiciousImageResults,
    shopPageClean,
    apiCatalogClean,
  });

  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(markdownPath, markdown, "utf8");
  await fs.writeFile(latestPath, markdown, "utf8");

  const failureCount =
    hiddenSlugResults.filter((result) => !result.ok).length +
    suspiciousImageResults.filter((result) => !result.ok).length +
    (shopPageClean ? 0 : 1) +
    (apiCatalogClean ? 0 : 1);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: BASE_URL,
        hiddenProductsChecked: hiddenSlugResults.length,
        suspiciousImageProductsChecked: suspiciousImageResults.length,
        shopPageClean,
        apiCatalogClean,
        failureCount,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );

  if (failureCount > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
