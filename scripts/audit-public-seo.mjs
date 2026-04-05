import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const BASE_URL = String(
  process.env.SEO_AUDIT_BASE_URL ||
    process.env.BASE_URL ||
    "http://127.0.0.1:3000",
).replace(/\/+$/, "");
const MAX_REDIRECTS = 5;
const CONCURRENCY = Number.parseInt(process.env.SEO_AUDIT_CONCURRENCY || "8", 10);
const STRICT_CANONICAL_HOST =
  String(process.env.SEO_STRICT_CANONICAL_HOST || "").toLowerCase() === "true";

function normalizePathname(value) {
  if (!value) return "/";
  const pathname = String(value).trim();
  if (!pathname) return "/";
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1) || "/";
  }
  return pathname;
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
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "user-agent": "HealSendPublicSeoAudit/1.0",
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
      chain,
    };
  }

  return {
    finalStatus: 310,
    finalUrl: currentUrl,
    body: "",
    chain,
    error: `Too many redirects after ${MAX_REDIRECTS} hops`,
  };
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

function extractTitle(html) {
  const match = String(html).match(/<title[^>]*>(.*?)<\/title>/i);
  if (!match?.[1]) return "";
  return match[1].replace(/\s+/g, " ").trim();
}

function extractMetaContent(html, nameOrProperty) {
  const pattern = new RegExp(
    `<meta[^>]+(?:name|property)=["']${nameOrProperty}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  const match = String(html).match(pattern);
  return match?.[1]?.trim() || "";
}

function extractCanonical(html, pageUrl) {
  const match = String(html).match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
  );

  if (!match?.[1]) {
    return null;
  }

  try {
    return new URL(match[1], pageUrl).toString();
  } catch {
    return null;
  }
}

function isLocalHostName(hostname) {
  return /^(localhost|127\.0\.0\.1)$/i.test(String(hostname || ""));
}

function hasLocalhostHost(url) {
  try {
    const parsed = new URL(url);
    return isLocalHostName(parsed.hostname);
  } catch {
    return false;
  }
}

function buildMarkdownReport({
  generatedAt,
  results,
  failingResults,
  weakDescriptionResults,
}) {
  const lines = [
    "# Public SEO Audit",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Base URL: \`${BASE_URL}\``,
    `- Public routes checked: \`${results.length}\``,
    `- Routes with blocking SEO issues: \`${failingResults.length}\``,
    `- Routes with weak descriptions: \`${weakDescriptionResults.length}\``,
    "",
  ];

  if (failingResults.length === 0) {
    lines.push(
      "All checked public routes emitted a title, description, and canonical URL without blocking metadata gaps or canonical-path mismatches.",
    );
  } else {
    lines.push("## Blocking Issues", "");
    for (const result of failingResults.slice(0, 50)) {
      lines.push(`- \`${result.path}\` — ${result.issues.join("; ")}`);
    }
  }

  lines.push("", "## Weak Descriptions", "");

  if (weakDescriptionResults.length === 0) {
    lines.push("- None");
  } else {
    for (const result of weakDescriptionResults.slice(0, 50)) {
      lines.push(
        `- \`${result.path}\` — description length \`${result.description.length}\``,
      );
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
      `- \`${result.path}\` — ${result.ok ? "PASS" : "FAIL"} — title: \`${result.title || "none"}\` — canonical: \`${result.canonical || "none"}\` — ${chain}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const baseHost = new URL(BASE_URL).hostname;

  const sitemapResponse = await fetchWithRedirects("/sitemap.xml");
  if (sitemapResponse.finalStatus !== 200) {
    throw new Error(`Failed to fetch sitemap.xml: ${sitemapResponse.finalStatus}`);
  }

  const paths = [...new Set(
    extractLocs(sitemapResponse.body)
      .map((loc) => {
        try {
          return normalizePathname(new URL(loc).pathname);
        } catch {
          return null;
        }
      })
      .filter(Boolean),
  )];

  const results = await mapWithConcurrency(paths, CONCURRENCY, async (pathname) => {
    const response = await fetchWithRedirects(pathname);
    const title = extractTitle(response.body);
    const description = extractMetaContent(response.body, "description");
    const canonical = extractCanonical(response.body, response.finalUrl);
    const issues = [];

    if (response.finalStatus !== 200) {
      issues.push(`expected final status 200, got ${response.finalStatus}`);
    }
    if (!title) {
      issues.push("missing title");
    }
    if (!description) {
      issues.push("missing description");
    }
    if (!canonical) {
      issues.push("missing canonical");
    }

    const finalPath = normalizePathname(new URL(response.finalUrl).pathname);

    if (canonical) {
      const canonicalHost = new URL(canonical).hostname;
      const bothLocalHosts =
        isLocalHostName(baseHost) && isLocalHostName(canonicalHost);

      if (hasLocalhostHost(canonical) && !bothLocalHosts && STRICT_CANONICAL_HOST) {
        issues.push("canonical points at localhost");
      }

      const canonicalPath = normalizePathname(new URL(canonical).pathname);
      if (canonicalPath !== finalPath) {
        issues.push(`canonical path mismatch (${canonicalPath} !== ${finalPath})`);
      }
    }

    if (pathname !== "/" && title === "HealSend") {
      issues.push("title is too generic");
    }

    return {
      path: pathname,
      ok: issues.length === 0,
      issues,
      title,
      description,
      canonical,
      chain: response.chain,
      finalStatus: response.finalStatus,
      finalUrl: response.finalUrl,
    };
  });

  const failingResults = results.filter((result) => !result.ok);
  const weakDescriptionResults = results.filter(
    (result) => result.description && result.description.length < 70,
  );

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const report = buildMarkdownReport({
    generatedAt,
    results,
    failingResults,
    weakDescriptionResults,
  });
  const jsonPath = path.join(OUTPUT_DIR, `public-seo-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `public-seo-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "public-seo-latest.md");

  await fs.writeFile(
    jsonPath,
    `${JSON.stringify({ generatedAt, results }, null, 2)}\n`,
  );
  await fs.writeFile(markdownPath, report);
  await fs.writeFile(latestPath, report);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: BASE_URL,
        totalRoutes: results.length,
        failingRoutes: failingResults.length,
        weakDescriptions: weakDescriptionResults.length,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );

  if (failingResults.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
