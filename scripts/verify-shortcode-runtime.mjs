import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const BASE_URL = String(
  process.env.SHORTCODE_AUDIT_BASE_URL ||
    process.env.BASE_URL ||
    "http://127.0.0.1:3000",
).replace(/\/+$/, "");
const MAX_REDIRECTS = 5;

function extractShortcodes(value) {
  const shortcodes = [];
  const regex = /\[(?!\/)([a-z0-9_-]+)([^\]]*)\]/gi;
  let match;

  while ((match = regex.exec(String(value || "")))) {
    shortcodes.push(String(match[1] || "").toLowerCase());
  }

  return [...new Set(shortcodes)];
}

function toDisplayPath(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

async function fetchWithRedirects(slugPath) {
  const chain = [];
  let currentUrl = new URL(slugPath, `${BASE_URL}/`).toString();

  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers: {
        accept: "text/html",
      },
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
      ok: response.status === 200,
      finalStatus: response.status,
      finalUrl: currentUrl,
      body: response.status === 200 ? await response.text() : "",
      chain,
      contentType: response.headers.get("content-type") || "",
    };
  }

  return {
    ok: false,
    finalStatus: 310,
    finalUrl: currentUrl,
    body: "",
    chain,
    contentType: "",
    error: `Too many redirects after ${MAX_REDIRECTS} hops`,
  };
}

function buildMarkdownReport({
  generatedAt,
  baseUrl,
  totalPages,
  passedPages,
  failedPages,
  results,
}) {
  const lines = [
    "# Shortcode Runtime Verification",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Base URL: \`${baseUrl}\``,
    `- Shortcode-backed routes checked: \`${totalPages}\``,
    `- Routes passing at runtime: \`${passedPages.length}\``,
    `- Routes failing at runtime: \`${failedPages.length}\``,
    "",
  ];

  if (failedPages.length === 0) {
    lines.push(
      "All shortcode-backed routes returned a working custom app response at runtime, and none leaked raw shortcode markup into the rendered HTML.",
    );
  } else {
    lines.push("## Runtime Failures", "");

    for (const page of failedPages) {
      lines.push(
        `- \`${page.slug}\` — final status \`${page.finalStatus}\`${page.error ? `, ${page.error}` : ""}${page.shortcodeLeaks.length ? `, leaked shortcodes: ${page.shortcodeLeaks.join(", ")}` : ""}`,
      );
    }
  }

  lines.push("", "## Route Results", "");

  for (const page of results) {
    const redirectChain = page.chain
      .map((entry) => {
        const base = `${toDisplayPath(entry.url)} [${entry.status}]`;
        return entry.location
          ? `${base} -> ${toDisplayPath(entry.location)}`
          : base;
      })
      .join(" | ");

    lines.push(
      `- \`${page.slug}\` — ${page.ok ? "PASS" : "FAIL"} — final \`${page.finalStatus}\` at \`${toDisplayPath(page.finalUrl)}\` — ${redirectChain}`,
    );
  }

  return lines.join("\n");
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const pages = await prisma.marketingPage.findMany({
    where: { pageType: "CUSTOM" },
    select: {
      slug: true,
      contentHtml: true,
    },
    orderBy: { slug: "asc" },
  });

  const shortcodePages = pages
    .map((page) => ({
      slug: page.slug,
      shortcodes: extractShortcodes(page.contentHtml),
    }))
    .filter((page) => page.shortcodes.length > 0);

  const results = [];

  for (const page of shortcodePages) {
    const response = await fetchWithRedirects(`/${page.slug}`);
    const shortcodeLeaks = page.shortcodes.filter(
      (name) =>
        response.body.includes(`[${name}`) || response.body.includes(`[/${name}]`),
    );

    results.push({
      slug: page.slug,
      shortcodes: page.shortcodes,
      ok: response.ok && shortcodeLeaks.length === 0,
      finalStatus: response.finalStatus,
      finalUrl: response.finalUrl,
      chain: response.chain,
      shortcodeLeaks,
      error:
        response.error ||
        (response.ok ? null : "Route did not resolve to a 200 response"),
    });
  }

  const passedPages = results.filter((page) => page.ok);
  const failedPages = results.filter((page) => !page.ok);
  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const jsonPath = path.join(OUTPUT_DIR, `shortcode-runtime-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `shortcode-runtime-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "shortcode-runtime-latest.md");

  const payload = {
    generatedAt,
    baseUrl: BASE_URL,
    totalPages: shortcodePages.length,
    passedPages,
    failedPages,
    results,
  };

  const markdown = buildMarkdownReport({
    generatedAt,
    baseUrl: BASE_URL,
    totalPages: shortcodePages.length,
    passedPages,
    failedPages,
    results,
  });

  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(markdownPath, `${markdown}\n`, "utf8");
  await fs.writeFile(latestPath, `${markdown}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: BASE_URL,
        totalPages: shortcodePages.length,
        passedCount: passedPages.length,
        failedCount: failedPages.length,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );

  if (failedPages.length > 0) {
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
