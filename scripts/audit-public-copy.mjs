import fs from "node:fs/promises";
import path from "node:path";

const SOURCE_SITE_URL =
  process.env.WORDPRESS_SITE_URL || "https://healsend.com";
const TARGET_SITE_URL =
  process.env.PUBLIC_COPY_AUDIT_BASE_URL ||
  process.env.BASE_URL ||
  "http://127.0.0.1:3000";
const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const MAX_REDIRECTS = 5;
const CONCURRENCY = Number.parseInt(
  process.env.PUBLIC_COPY_AUDIT_CONCURRENCY || "8",
  10,
);

const BANNED_TOKENS = [
  {
    label: "internal-copy",
    token: "DB-backed",
  },
  {
    label: "internal-copy",
    token: "stored treatment page content",
  },
  {
    label: "internal-copy",
    token: "custom flow",
  },
  {
    label: "internal-copy",
    token: "custom shell",
  },
  {
    label: "internal-copy",
    token: "custom app",
  },
  {
    label: "internal-copy",
    token: "preview database",
  },
  {
    label: "internal-copy",
    token: "legacy page",
  },
  {
    label: "internal-copy",
    token: "legacy route",
  },
  {
    label: "internal-copy",
    token: "copied WordPress",
  },
  {
    label: "internal-copy",
    token: "imported WordPress",
  },
  {
    label: "internal-copy",
    token: "WordPress page",
  },
  {
    label: "internal-copy",
    token: "These sections come from",
  },
  {
    label: "internal-copy",
    token: "Why this page now feels different",
  },
  {
    label: "internal-copy",
    token: "Better organized than",
  },
  {
    label: "internal-copy",
    token: "rebuilt into the custom flow",
  },
  {
    label: "import-junk",
    token: "[trustindex",
  },
  {
    label: "import-junk",
    token: "Benefits Pricing Description",
  },
];

function htmlToVisibleText(html) {
  return String(html || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

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

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/xml,text/xml,text/html;q=0.9,*/*;q=0.8",
      "User-Agent": "HealSendPublicCopyAudit/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }

  return response.text();
}

async function fetchSitemapIndex() {
  const sitemapUrl = new URL("/wp-sitemap.xml", SOURCE_SITE_URL).toString();
  const xml = await fetchText(sitemapUrl);
  const sitemapUrls = extractLocs(xml);

  return sitemapUrls
    .map((url) => {
      const pathname = new URL(url).pathname;
      const filename = pathname.split("/").filter(Boolean).pop() || pathname;
      let type = "other";

      if (/^post-sitemap/i.test(filename)) type = "post";
      else if (/^page-sitemap/i.test(filename)) type = "page";
      else if (/^product-sitemap/i.test(filename)) type = "product";
      else if (/^category-sitemap/i.test(filename)) type = "category";
      else if (/^product_cat-sitemap/i.test(filename)) type = "product_cat";

      return { url, type, filename };
    })
    .filter((entry) =>
      ["post", "page", "product", "category", "product_cat"].includes(
        entry.type,
      ),
    );
}

async function fetchPathsFromSitemap(entry) {
  const xml = await fetchText(entry.url);
  const locs = extractLocs(xml);
  const records = [];

  for (const loc of locs) {
    try {
      const parsed = new URL(loc);
      records.push({
        sourceSitemap: entry.filename,
        sourceType: entry.type,
        sourceUrl: loc,
        path: normalizePathname(parsed.pathname),
      });
    } catch {
      // Ignore malformed sitemap rows.
    }
  }

  return records;
}

async function fetchHtmlWithRedirects(routePath) {
  const chain = [];
  let currentUrl = new URL(routePath, TARGET_SITE_URL).toString();
  let body = "";
  let finalStatus = 0;

  for (let step = 0; step <= MAX_REDIRECTS; step += 1) {
    const response = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "HealSendPublicCopyAudit/1.0",
      },
    });

    const location = response.headers.get("location");
    const nextUrl = location ? new URL(location, currentUrl).toString() : null;

    chain.push({
      url: currentUrl,
      status: response.status,
      location: nextUrl,
    });

    finalStatus = response.status;

    if (response.status >= 300 && response.status < 400 && nextUrl) {
      currentUrl = nextUrl;
      continue;
    }

    if (response.status >= 200 && response.status < 300) {
      body = await response.text();
    }

    break;
  }

  return {
    finalStatus,
    finalUrl: currentUrl,
    finalPath: normalizePathname(new URL(currentUrl).pathname),
    body,
    chain,
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

function toDisplayPath(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

function buildMarkdownReport({
  generatedAt,
  sourceSiteUrl,
  targetSiteUrl,
  totals,
  results,
}) {
  const failing = results.filter((result) => result.matches.length > 0);
  const lines = [
    "# Public Copy Audit",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Source site: \`${sourceSiteUrl}\``,
    `- Target site: \`${targetSiteUrl}\``,
    `- Routes checked: \`${totals.total}\``,
    `- Clean routes: \`${totals.clean}\``,
    `- Flagged routes: \`${totals.flagged}\``,
    "",
  ];

  if (failing.length === 0) {
    lines.push(
      "No public routes in the WordPress sitemap are leaking internal migration copy or obvious imported-page junk markers in the rendered HTML.",
    );
  } else {
    lines.push("## Flagged Routes", "");
    for (const result of failing.slice(0, 100)) {
      lines.push(
        `- \`${result.path}\` — ${result.matches
          .map((match) => `${match.label}: ${match.token}`)
          .join(", ")}`,
      );
    }
  }

  lines.push("", "## Sample Route Results", "");

  for (const result of results.slice(0, 80)) {
    const chain = result.chain
      .map((entry) => {
        const current = `${toDisplayPath(entry.url)} [${entry.status}]`;
        return entry.location
          ? `${current} -> ${toDisplayPath(entry.location)}`
          : current;
      })
      .join(" | ");

    lines.push(
      `- \`${result.path}\` — ${result.matches.length === 0 ? "PASS" : "FAIL"} — final \`${result.finalStatus}\` at \`${result.finalPath}\` — ${chain}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const sitemapEntries = await fetchSitemapIndex();
  const sitemapRecords = await Promise.all(
    sitemapEntries.map((entry) => fetchPathsFromSitemap(entry)),
  );

  const routeRecords = sitemapRecords
    .flat()
    .reduce((accumulator, record) => {
      if (!accumulator.some((item) => item.path === record.path)) {
        accumulator.push(record);
      }
      return accumulator;
    }, []);

  const results = await mapWithConcurrency(
    routeRecords,
    CONCURRENCY,
    async (record) => {
      const response = await fetchHtmlWithRedirects(record.path);
      const haystack = htmlToVisibleText(response.body);
      const matches = BANNED_TOKENS.filter((entry) =>
        haystack.includes(entry.token),
      );

      return {
        ...record,
        finalStatus: response.finalStatus,
        finalUrl: response.finalUrl,
        finalPath: response.finalPath,
        chain: response.chain,
        matches,
      };
    },
  );

  const generatedAt = new Date().toISOString();
  const totals = {
    total: results.length,
    clean: results.filter((result) => result.matches.length === 0).length,
    flagged: results.filter((result) => result.matches.length > 0).length,
  };

  const markdown = buildMarkdownReport({
    generatedAt,
    sourceSiteUrl: SOURCE_SITE_URL,
    targetSiteUrl: TARGET_SITE_URL,
    totals,
    results,
  });
  const json = JSON.stringify(
    {
      generatedAt,
      sourceSiteUrl: SOURCE_SITE_URL,
      targetSiteUrl: TARGET_SITE_URL,
      totals,
      bannedTokens: BANNED_TOKENS,
      results,
    },
    null,
    2,
  );

  const stamp = generatedAt.replace(/[:.]/g, "-");
  const markdownFile = path.join(OUTPUT_DIR, `public-copy-${stamp}.md`);
  const jsonFile = path.join(OUTPUT_DIR, `public-copy-${stamp}.json`);
  const latestMarkdown = path.join(OUTPUT_DIR, "public-copy-latest.md");
  const latestJson = path.join(OUTPUT_DIR, "public-copy-latest.json");

  await Promise.all([
    fs.writeFile(markdownFile, markdown, "utf8"),
    fs.writeFile(jsonFile, json, "utf8"),
    fs.writeFile(latestMarkdown, markdown, "utf8"),
    fs.writeFile(latestJson, json, "utf8"),
  ]);

  console.log(
    `Public copy audit complete: ${totals.clean}/${totals.total} clean, ${totals.flagged} flagged.`,
  );
  console.log(`Report: ${path.relative(process.cwd(), latestMarkdown)}`);

  if (totals.flagged > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
