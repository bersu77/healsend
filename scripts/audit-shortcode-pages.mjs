import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const RENDERABLE_SHORTCODE_NAMES = new Set(["trustindex", "caption", "your"]);
const SUPPORTED_SHORTCODE_NAMES = new Set([
  ...RENDERABLE_SHORTCODE_NAMES,
  "woocommerce_checkout",
  "healsend_form",
  "hld_glp_prefunnel",
  "hld_custom_login_form",
  "hld_custom_signup_form",
  "dashboard",
  "patient_dashboard",
  "fluentform",
  "fluentform-resume",
  "get_started",
]);
const CANONICAL_DYNAMIC_SHORTCODE_SLUGS = new Set(["nad"]);
const DIRECT_SHORTCODE_RESOLUTION_SLUGS = new Set([
  "checkout",
  "ed-meds",
  "enclomiphene-2",
  "enclomiphene-3",
  "erectile-dysfunction-prefunnel",
  "get-started",
  "glp-1-2",
  "glp-1-agreement-form",
  "glp-1-weight-loss-intake",
  "hrtlite",
  "log-in-to-your-account",
  "metabolic-enhancers-initial-intake-form",
  "my-account",
  "nad-form",
  "nad-form-2",
  "nadglutathione",
  "oxytocin-prefunnel",
  "patient-login",
  "patient-order-history",
  "patient-signup",
  "pt-141-form",
  "pt-141-intake-form",
  "pt-141-oxytocin-questionnaire",
  "pt-141-prefunnel",
  "resume-fluent-form-where-you-left",
  "sleep-2",
  "test",
  "test-funnels",
  "trt-prefunnel",
  "vitality-core",
]);

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeMarketingHtml(value) {
  return String(value || "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<!--\s*\/?wp:[\s\S]*?-->/gi, "")
    .replace(/\[\/?[a-z0-9_-]+[^\]]*\]/gi, "")
    .replace(/<p>(?:\s|&nbsp;|&#160;)*<\/p>/gi, "")
    .replace(/<div>(?:\s|&nbsp;|&#160;)*<\/div>/gi, "")
    .trim();
}

function extractShortcodes(value) {
  const shortcodes = [];
  const regex = /\[(?!\/)([a-z0-9_-]+)([^\]]*)\]/gi;
  let match;

  while ((match = regex.exec(String(value || "")))) {
    const attrs = {};
    const attrsRegex =
      /([a-z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s\]]+))/gi;
    let attrsMatch;

    while ((attrsMatch = attrsRegex.exec(match[2] || ""))) {
      attrs[String(attrsMatch[1] || "").toLowerCase()] =
        attrsMatch[2] || attrsMatch[3] || attrsMatch[4] || "";
    }

    shortcodes.push({
      name: String(match[1] || "").toLowerCase(),
      raw: match[0],
      attrs,
    });
  }

  return shortcodes;
}

function resolveShortcodeCategoryHref(category, slug) {
  const normalized = String(category || "")
    .trim()
    .toLowerCase();

  const directMap = {
    medication: "/onboarding/glp-1-eligibility",
    "249": "/onboarding/glp-1-eligibility",
    "250": "/onboarding/glp-1-eligibility",
    "weight-loss": "/onboarding/glp-1-eligibility",
    "glp-1": "/onboarding/glp-1-eligibility",
    "pt_141": "/onboarding/low-intimacy-drive",
    "pt-141": "/onboarding/low-intimacy-drive",
    oxytocin: "/onboarding/low-intimacy-drive",
    "ed-meds": "/onboarding/performance-issues",
    "nad-therapy": "/onboarding/nad-injection-therapy",
    "nad+glutathione": "/onboarding/nad-injection-therapy",
    nadglutathione: "/onboarding/nad-injection-therapy",
    glutathione: "/onboarding/nad-injection-therapy",
    "glutathione-ldn": "/onboarding/nad-injection-therapy",
    "sermorelin-therapy": "/onboarding/growth-hormone-support",
    "hrt-lite": "/onboarding/growth-hormone-support",
    enclomiphene: "/onboarding/growth-hormone-support",
    sleep: "/onboarding/sleep-support",
    treatments: "/shop",
  };

  if (directMap[normalized]) {
    return directMap[normalized];
  }

  if (normalized.replace(/\s+/g, "") === "nad+glutathione") {
    return "/onboarding/nad-injection-therapy";
  }

  if (slug && /(erectile|performance|viagra|cialis|sildenafil|ed-meds)/i.test(slug)) {
    return "/onboarding/performance-issues";
  }

  if (slug && /(pt-141|oxytocin|sexual|intimacy)/i.test(slug)) {
    return "/onboarding/low-intimacy-drive";
  }

  if (slug && /(nad|glutathione|longevity|anti-aging|energy)/i.test(slug)) {
    return "/onboarding/nad-injection-therapy";
  }

  if (slug && /(sermorelin|enclomiphene|strength|recovery|hrt)/i.test(slug)) {
    return "/onboarding/growth-hormone-support";
  }

  if (slug && /(glp|weight|semaglutide|tirzepatide)/i.test(slug)) {
    return "/onboarding/glp-1-eligibility";
  }

  if (slug && /(sleep|insomnia|trazodone|mirtazapine|ramalteon)/i.test(slug)) {
    return "/onboarding/sleep-support";
  }

  return null;
}

function inferShortcodeResolution(page) {
  if (CANONICAL_DYNAMIC_SHORTCODE_SLUGS.has(page.slug)) {
    return { type: "canonical-route" };
  }

  if (DIRECT_SHORTCODE_RESOLUTION_SLUGS.has(page.slug)) {
    return { type: "explicit-slug" };
  }

  if (page.shortcodes.every((name) => RENDERABLE_SHORTCODE_NAMES.has(name))) {
    return { type: "renderable-widget-strip" };
  }

  for (const shortcode of page.shortcodeEntries) {
    if (shortcode.name === "woocommerce_checkout") {
      return { type: "checkout" };
    }

    if (
      shortcode.name === "hld_custom_login_form" ||
      (shortcode.name === "fluentform" && shortcode.attrs.id === "12")
    ) {
      return { type: "login" };
    }

    if (shortcode.name === "hld_custom_signup_form") {
      return { type: "signup" };
    }

    if (["patient_dashboard", "dashboard", "fluentform-resume"].includes(shortcode.name)) {
      return { type: "account" };
    }

    if (shortcode.name === "get_started") {
      return { type: "start" };
    }

    if (["healsend_form", "hld_glp_prefunnel"].includes(shortcode.name)) {
      const href = resolveShortcodeCategoryHref(shortcode.attrs.category, page.slug);
      if (href) {
        return { type: "intake", href };
      }
    }
  }

  if (page.kind === "renderable") {
    const unsupported = page.shortcodes.filter(
      (name) => !SUPPORTED_SHORTCODE_NAMES.has(name),
    );
    if (unsupported.length === 0) {
      return { type: "renderable-supported" };
    }
  }

  return null;
}

function buildMarkdownReport({
  generatedAt,
  totalCustomPages,
  shortcodePages,
  emptyPages,
  tinyPages,
  shortcodeCounts,
  resolvedPages,
  unresolvedPages,
}) {
  const lines = [
    "# Shortcode Page Audit",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Total custom pages scanned: \`${totalCustomPages}\``,
    `- Pages containing raw shortcode markup in imported source: \`${shortcodePages.length}\``,
    `- Pages empty after shortcode stripping: \`${emptyPages.length}\``,
    `- Pages with tiny remaining body (< 40 chars): \`${tinyPages.length}\``,
    `- Pages fully resolved by the custom app: \`${resolvedPages.length}\``,
    `- Pages still unresolved after native replacement logic: \`${unresolvedPages.length}\``,
    "",
    "## Top Shortcodes",
    "",
    "| Shortcode | Count |",
    "| --- | ---: |",
  ];

  for (const entry of shortcodeCounts.slice(0, 20)) {
    lines.push(`| ${entry.name} | ${entry.count} |`);
  }

  lines.push("", "## Empty Or Tiny Source Pages Now Routed Natively", "");

  for (const page of [...emptyPages, ...tinyPages].slice(0, 60)) {
    lines.push(
      `- \`${page.slug}\` (${page.kind}) — ${page.shortcodes.join(", ") || "no shortcode name detected"}`,
    );
  }

  lines.push("", "## Unresolved Shortcode Pages", "");

  if (unresolvedPages.length === 0) {
    lines.push(
      "All shortcode pages are now resolved in the custom app through native rendering, widget stripping, canonical dynamic routes, or explicit redirects.",
    );
  } else {
    for (const page of unresolvedPages) {
      lines.push(
        `- \`${page.slug}\` (${page.kind}) — ${page.shortcodes.join(", ") || "no shortcode name detected"}`,
      );
    }
  }

  return lines.join("\n");
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const pages = await prisma.marketingPage.findMany({
    where: { pageType: "CUSTOM" },
    select: {
      slug: true,
      title: true,
      contentHtml: true,
    },
    orderBy: { slug: "asc" },
  });

  const shortcodePages = [];
  const shortcodeCountMap = new Map();

  for (const page of pages) {
    const shortcodes = extractShortcodes(page.contentHtml);
    if (shortcodes.length === 0) {
      continue;
    }

    const html = sanitizeMarketingHtml(page.contentHtml);
    const text = stripHtml(html);
    const shortcodeNames = [...new Set(shortcodes.map((entry) => entry.name))];

    for (const name of shortcodeNames) {
      shortcodeCountMap.set(name, (shortcodeCountMap.get(name) || 0) + 1);
    }

    shortcodePages.push({
      slug: page.slug,
      title: page.title,
      shortcodes: shortcodeNames,
      shortcodeEntries: shortcodes,
      textLength: text.length,
      htmlLength: html.length,
      kind:
        text.length === 0 ? "empty" : text.length < 40 ? "tiny" : "renderable",
    });
  }

  const emptyPages = shortcodePages.filter((page) => page.kind === "empty");
  const tinyPages = shortcodePages.filter((page) => page.kind === "tiny");
  const resolvedPages = shortcodePages.filter((page) => Boolean(inferShortcodeResolution(page)));
  const unresolvedPages = shortcodePages.filter((page) => !inferShortcodeResolution(page));
  const shortcodeCounts = [...shortcodeCountMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const jsonPath = path.join(OUTPUT_DIR, `shortcode-pages-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `shortcode-pages-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "shortcode-pages-latest.md");

  const payload = {
    generatedAt,
    totalCustomPages: pages.length,
    shortcodePages,
    emptyPages,
    tinyPages,
    shortcodeCounts,
    resolvedPages,
    unresolvedPages,
  };

  const markdown = buildMarkdownReport({
    generatedAt,
    totalCustomPages: pages.length,
    shortcodePages,
    emptyPages,
    tinyPages,
    shortcodeCounts,
    resolvedPages,
    unresolvedPages,
  });

  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(markdownPath, `${markdown}\n`, "utf8");
  await fs.writeFile(latestPath, `${markdown}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        generatedAt,
        totalCustomPages: pages.length,
        shortcodePageCount: shortcodePages.length,
        emptyAfterSanitize: emptyPages.length,
        tinyAfterSanitize: tinyPages.length,
        resolvedPageCount: resolvedPages.length,
        unresolvedPageCount: unresolvedPages.length,
        jsonPath,
        markdownPath,
        latestPath,
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
