import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const BASE_URL = String(
  process.env.MEDIA_AUDIT_BASE_URL ||
    process.env.BASE_URL ||
    "http://127.0.0.1:3000",
).replace(/\/+$/, "");
const MAX_REDIRECTS = 5;
const CONCURRENCY = Number.parseInt(
  process.env.MEDIA_AUDIT_CONCURRENCY || "8",
  10,
);

const SUSPICIOUS_ASSET_PATTERN =
  /(imageuploadtest|placeholder|dummy|sample|wmremove|befv|product-image\.webp|via\.placeholder|unsplash)/i;

function normalizePathname(value) {
  if (!value) return "/";
  let pathname = value;
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  return pathname || "/";
}

function extractLocs(xml) {
  return [...String(xml).matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1].trim(),
  );
}

function toDisplayPath(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

async function fetchWithRedirects(urlPath) {
  const chain = [];
  let currentUrl = new URL(urlPath, `${BASE_URL}/`).toString();

  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "user-agent": "HealSendPublicMediaAudit/1.0",
      },
    });

    const location = response.headers.get("location");
    const nextUrl = location ? new URL(location, currentUrl).toString() : null;
    const body =
      response.status >= 300 && response.status < 400
        ? ""
        : await response.text();

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
      body,
      contentType: response.headers.get("content-type") || "",
      chain,
    };
  }

  return {
    finalStatus: 310,
    finalUrl: currentUrl,
    body: "",
    contentType: "",
    chain,
    error: `Too many redirects after ${MAX_REDIRECTS} hops`,
  };
}

function collectImageCandidates(html) {
  const candidates = new Set();
  const push = (value) => {
    if (!value) return;
    const trimmed = String(value).trim();
    if (!trimmed) return;
    candidates.add(trimmed);
  };

  for (const match of html.matchAll(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
  )) {
    push(match[1]);
  }

  for (const match of html.matchAll(
    /\b(?:src|content)=["']([^"']+\.(?:png|jpe?g|webp|avif|gif|svg)(?:\?[^"']*)?)["']/gi,
  )) {
    push(match[1]);
  }

  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    const srcset = match[1].split(",");
    for (const entry of srcset) {
      const url = entry.trim().split(/\s+/)[0];
      push(url);
    }
  }

  return [...candidates];
}

function normalizeAssetUrl(rawUrl, pageUrl) {
  if (!rawUrl) return null;

  try {
    const absolute = new URL(rawUrl, pageUrl);
    if (absolute.pathname === "/_next/image") {
      const nested = absolute.searchParams.get("url");
      if (nested) {
        return new URL(nested, pageUrl).toString();
      }
    }
    return absolute.toString();
  } catch {
    return null;
  }
}

function extractOgImageUrl(html, pageUrl) {
  const match = String(html).match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  );

  return normalizeAssetUrl(match?.[1], pageUrl);
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;

  async function runWorker() {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from(
    { length: Math.max(1, Math.min(limit, items.length)) },
    () => runWorker(),
  );
  await Promise.all(workers);
  return results;
}

function buildMarkdownReport({
  generatedAt,
  results,
  suspiciousRoutes,
  routesMissingOgImage,
  domainCounts,
}) {
  const lines = [
    "# Public Media Audit",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Base URL: \`${BASE_URL}\``,
    `- Public routes checked: \`${results.length}\``,
    `- Routes with suspicious asset URLs: \`${suspiciousRoutes.length}\``,
    `- Routes missing og:image: \`${routesMissingOgImage.length}\``,
    "",
  ];

  if (suspiciousRoutes.length === 0 && routesMissingOgImage.length === 0) {
    lines.push(
      "The public sitemap routes are currently clean for the tracked placeholder/test image patterns, and every checked route emitted an Open Graph image.",
    );
  }

  lines.push("", "## Top Asset Domains", "");

  const topDomains = [...domainCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10);

  if (topDomains.length === 0) {
    lines.push("- None");
  } else {
    for (const [domain, count] of topDomains) {
      lines.push(`- \`${domain}\` — \`${count}\` references`);
    }
  }

  lines.push("", "## Suspicious Asset Routes", "");

  if (suspiciousRoutes.length === 0) {
    lines.push("- None");
  } else {
    for (const result of suspiciousRoutes.slice(0, 50)) {
      lines.push(
        `- \`${result.path}\` — ${result.suspiciousAssets
          .slice(0, 3)
          .map((asset) => `\`${asset}\``)
          .join(", ")}`,
      );
    }
  }

  lines.push("", "## Routes Missing og:image", "");

  if (routesMissingOgImage.length === 0) {
    lines.push("- None");
  } else {
    for (const result of routesMissingOgImage.slice(0, 50)) {
      lines.push(`- \`${result.path}\``);
    }
  }

  lines.push("", "## Sample Route Results", "");

  for (const result of results.slice(0, 25)) {
    const chain = result.chain
      .map((entry) => {
        const current = `${toDisplayPath(entry.url)} [${entry.status}]`;
        return entry.location
          ? `${current} -> ${toDisplayPath(entry.location)}`
          : current;
      })
      .join(" | ");

    lines.push(
      `- \`${result.path}\` — final \`${result.finalStatus}\` — og:image: \`${result.ogImage || "none"}\` — ${chain}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const sitemapResponse = await fetchWithRedirects("/sitemap.xml");
  if (sitemapResponse.finalStatus !== 200) {
    throw new Error(
      `Failed to fetch sitemap.xml: ${sitemapResponse.finalStatus}`,
    );
  }

  const paths = extractLocs(sitemapResponse.body)
    .map((loc) => {
      try {
        return normalizePathname(new URL(loc).pathname);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const uniquePaths = [...new Set(paths)];
  const domainCounts = new Map();

  const results = await mapWithConcurrency(
    uniquePaths,
    CONCURRENCY,
    async (routePath) => {
      const response = await fetchWithRedirects(routePath);
      const rawAssets = collectImageCandidates(response.body);
      const normalizedAssets = rawAssets
        .map((asset) => normalizeAssetUrl(asset, response.finalUrl))
        .filter(Boolean);
      const ogImage = extractOgImageUrl(response.body, response.finalUrl);
      const suspiciousAssets = normalizedAssets.filter((asset) =>
        SUSPICIOUS_ASSET_PATTERN.test(asset),
      );

      for (const asset of normalizedAssets) {
        try {
          const { host } = new URL(asset);
          domainCounts.set(host, (domainCounts.get(host) || 0) + 1);
        } catch {
          // Ignore malformed assets
        }
      }

      return {
        path: routePath,
        finalStatus: response.finalStatus,
        finalUrl: response.finalUrl,
        contentType: response.contentType,
        ogImage,
        suspiciousAssets,
        chain: response.chain,
        error: response.error || null,
      };
    },
  );

  const suspiciousRoutes = results.filter(
    (result) =>
      result.finalStatus === 200 && result.suspiciousAssets.length > 0,
  );
  const routesMissingOgImage = results.filter(
    (result) =>
      result.finalStatus === 200 &&
      !result.error &&
      String(result.contentType || "").includes("text/html") &&
      !result.ogImage,
  );

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const markdown = buildMarkdownReport({
    generatedAt,
    results,
    suspiciousRoutes,
    routesMissingOgImage,
    domainCounts,
  });
  const payload = {
    generatedAt,
    baseUrl: BASE_URL,
    totalRoutes: results.length,
    suspiciousRouteCount: suspiciousRoutes.length,
    missingOgImageCount: routesMissingOgImage.length,
    results,
  };

  const jsonPath = path.join(OUTPUT_DIR, `public-media-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `public-media-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "public-media-latest.md");

  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.writeFile(markdownPath, markdown);
  await fs.writeFile(latestPath, markdown);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: BASE_URL,
        totalRoutes: results.length,
        suspiciousRouteCount: suspiciousRoutes.length,
        missingOgImageCount: routesMissingOgImage.length,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );

  if (suspiciousRoutes.length > 0 || routesMissingOgImage.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
