import fs from "node:fs/promises";
import path from "node:path";

const SOURCE_SITE_URL =
  process.env.WORDPRESS_SITE_URL || "https://healsend.com";
const TARGET_SITE_URL =
  process.env.PARITY_TARGET_URL || "http://127.0.0.1:3000";
const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const MAX_REDIRECTS = 5;
const CONCURRENCY = Number.parseInt(process.env.PARITY_CONCURRENCY || "8", 10);

function normalizePathname(value) {
  if (!value) return "/";
  let pathname = value;
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  return pathname || "/";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
      "User-Agent": "HealSendParityAudit/1.0",
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
      // Ignore malformed sitemap rows
    }
  }

  return records;
}

async function probeTargetPath(routePath) {
  const chain = [];
  let currentUrl = new URL(routePath, TARGET_SITE_URL).toString();
  let final = null;

  for (let step = 0; step <= MAX_REDIRECTS; step += 1) {
    const response = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "HealSendParityAudit/1.0",
      },
    });

    const location = response.headers.get("location");
    const entry = {
      url: currentUrl,
      status: response.status,
      location,
    };
    chain.push(entry);
    final = entry;

    if (
      response.status >= 300 &&
      response.status < 400 &&
      location &&
      step < MAX_REDIRECTS
    ) {
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    break;
  }

  const finalUrl = final?.url || currentUrl;
  const finalStatus = final?.status || 0;
  const finalPath = normalizePathname(new URL(finalUrl).pathname);
  const redirected = chain.length > 1 || (chain[0] && chain[0].location);

  let coverage = "missing";
  if (finalStatus >= 200 && finalStatus < 300) {
    coverage = redirected ? "redirected" : "direct";
  } else if (finalStatus >= 300 && finalStatus < 400) {
    coverage = "redirect-loop";
  } else if (finalStatus >= 500) {
    coverage = "error";
  }

  return {
    coverage,
    finalStatus,
    finalUrl,
    finalPath,
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

function summarizeResults(results) {
  const summary = {
    total: results.length,
    direct: 0,
    redirected: 0,
    missing: 0,
    error: 0,
    "redirect-loop": 0,
    bySourceType: {},
  };

  for (const result of results) {
    summary[result.coverage] += 1;

    if (!summary.bySourceType[result.sourceType]) {
      summary.bySourceType[result.sourceType] = {
        total: 0,
        direct: 0,
        redirected: 0,
        missing: 0,
        error: 0,
        "redirect-loop": 0,
      };
    }

    const bucket = summary.bySourceType[result.sourceType];
    bucket.total += 1;
    bucket[result.coverage] += 1;
  }

  return summary;
}

function buildMarkdownReport({ generatedAt, sourceSiteUrl, targetSiteUrl, summary, results }) {
  const missing = results.filter((result) => result.coverage === "missing");
  const errors = results.filter((result) => result.coverage === "error");
  const redirected = results.filter((result) => result.coverage === "redirected");

  const lines = [
    "# WordPress Parity Audit",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Source site: \`${sourceSiteUrl}\``,
    `- Target site: \`${targetSiteUrl}\``,
    `- Total sitemap URLs audited: \`${summary.total}\``,
    `- Direct coverage: \`${summary.direct}\``,
    `- Redirected coverage: \`${summary.redirected}\``,
    `- Missing: \`${summary.missing}\``,
    `- Errors: \`${summary.error}\``,
    `- Redirect loops: \`${summary["redirect-loop"]}\``,
    "",
    "## Coverage By Source Type",
    "",
    "| Source Type | Total | Direct | Redirected | Missing | Errors | Redirect Loops |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const [sourceType, bucket] of Object.entries(summary.bySourceType)) {
    lines.push(
      `| ${sourceType} | ${bucket.total} | ${bucket.direct} | ${bucket.redirected} | ${bucket.missing} | ${bucket.error} | ${bucket["redirect-loop"]} |`,
    );
  }

  lines.push("", "## Top Missing URLs", "");
  if (missing.length === 0) {
    lines.push("- None");
  } else {
    for (const result of missing.slice(0, 50)) {
      lines.push(
        `- \`${result.path}\` from \`${result.sourceType}\` returned \`${result.finalStatus}\``,
      );
    }
  }

  lines.push("", "## Top Error URLs", "");
  if (errors.length === 0) {
    lines.push("- None");
  } else {
    for (const result of errors.slice(0, 20)) {
      lines.push(
        `- \`${result.path}\` from \`${result.sourceType}\` returned \`${result.finalStatus}\``,
      );
    }
  }

  lines.push("", "## Sample Redirected URLs", "");
  if (redirected.length === 0) {
    lines.push("- None");
  } else {
    for (const result of redirected.slice(0, 30)) {
      lines.push(
        `- \`${result.path}\` -> \`${result.finalPath}\` (\`${result.finalStatus}\`)`,
      );
    }
  }

  return lines.join("\n");
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const sitemapEntries = await fetchSitemapIndex();
  const sitemapRows = (
    await Promise.all(sitemapEntries.map((entry) => fetchPathsFromSitemap(entry)))
  ).flat();

  const uniqueByPath = new Map();
  for (const row of sitemapRows) {
    if (!uniqueByPath.has(row.path)) {
      uniqueByPath.set(row.path, row);
    }
  }

  const uniqueRows = [...uniqueByPath.values()].sort((a, b) =>
    a.path.localeCompare(b.path),
  );

  const results = await mapWithConcurrency(uniqueRows, CONCURRENCY, async (row) => {
    const probe = await probeTargetPath(row.path);
    return {
      ...row,
      ...probe,
    };
  });

  const summary = summarizeResults(results);
  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const jsonPath = path.join(OUTPUT_DIR, `wordpress-parity-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `wordpress-parity-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "wordpress-parity-latest.md");

  const payload = {
    generatedAt,
    sourceSiteUrl: SOURCE_SITE_URL,
    targetSiteUrl: TARGET_SITE_URL,
    summary,
    results,
  };

  const markdown = buildMarkdownReport({
    generatedAt,
    sourceSiteUrl: SOURCE_SITE_URL,
    targetSiteUrl: TARGET_SITE_URL,
    summary,
    results,
  });

  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(markdownPath, `${markdown}\n`, "utf8");
  await fs.writeFile(latestPath, `${markdown}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        generatedAt,
        sourceSiteUrl: SOURCE_SITE_URL,
        targetSiteUrl: TARGET_SITE_URL,
        summary,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
