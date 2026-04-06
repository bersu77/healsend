import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const BASE_URL = String(
  process.env.NON_MDI_AUDIT_BASE_URL ||
    process.env.BASE_URL ||
    "http://127.0.0.1:3000",
).replace(/\/+$/, "");
const MAX_REDIRECTS = 5;

const CHECKS = [
  {
    path: "/",
    expectStatus: 200,
    contains: ["<title>HealSend"],
  },
  {
    path: "/home",
    expectStatus: 308,
    expectFinalPath: "/",
  },
  {
    path: "/Quiz",
    expectStatus: 308,
    expectFinalPath: "/funnels/glp-1-eligibility",
  },
  {
    path: "/quiz",
    expectStatus: 308,
    expectFinalPath: "/funnels/glp-1-eligibility",
  },
  {
    path: "/privacy-policy-3",
    expectStatus: 200,
  },
  {
    path: "/understanding-zoloft-uses-and-side-effects",
    expectStatus: 200,
  },
  {
    path: "/login",
    expectStatus: 200,
    contains: [
      'id="__next-page-redirect"',
      "url=/?auth=login",
      "NEXT_REDIRECT",
    ],
  },
  {
    path: "/admin-login",
    expectStatus: 308,
    expectFinalPath: "/login",
  },
  {
    path: "/signup",
    expectStatus: 200,
    contains: [
      'id="__next-page-redirect"',
      "url=/?auth=signup",
      "NEXT_REDIRECT",
    ],
  },
  {
    path: "/shop",
    expectStatus: 200,
    contains: ["<title>Browse Treatments | HealSend"],
    excludes: ['href="/home"'],
  },
  {
    path: "/anti-aging",
    expectStatus: 200,
    contains: [
      "<title>Support energy, recovery, and vitality with precision care. | HealSend",
    ],
  },
  {
    path: "/nad",
    expectStatus: 200,
    contains: ["<title>NAD+ Injections | HealSend"],
  },
  {
    path: "/consultation/local-dev?orderId=demo-123",
    expectStatus: 200,
    contains: ["Development Consultation", "demo-123"],
  },
  {
    path: "/account",
    expectStatus: 200,
    contains: [
      'id="__next-page-redirect"',
      "url=/?auth=login",
      "redirect=%2Faccount",
      "NEXT_REDIRECT",
    ],
  },
];

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
        accept: "text/html,application/json",
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

function buildMarkdownReport({ generatedAt, results }) {
  const failed = results.filter((result) => !result.ok);
  const lines = [
    "# Non-MDI Runtime Verification",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Base URL: \`${BASE_URL}\``,
    `- Checks: \`${results.length}\``,
    `- Passing: \`${results.length - failed.length}\``,
    `- Failing: \`${failed.length}\``,
    "",
  ];

  if (failed.length === 0) {
    lines.push(
      "The core non-MDI public surface is resolving cleanly, including canonical alias redirects, legal/editorial templates, auth pages, shop shell consistency, and the local consultation fallback.",
    );
  } else {
    lines.push("## Failures", "");
    for (const result of failed) {
      lines.push(`- \`${result.path}\` — ${result.failureReason}`);
    }
  }

  lines.push("", "## Route Results", "");

  for (const result of results) {
    const chain = result.chain
      .map((entry) => {
        const current = `${toDisplayPath(entry.url)} [${entry.status}]`;
        return entry.location
          ? `${current} -> ${toDisplayPath(entry.location)}`
          : current;
      })
      .join(" | ");

    lines.push(
      `- \`${result.path}\` — ${result.ok ? "PASS" : "FAIL"} — final \`${result.finalStatus}\` at \`${toDisplayPath(result.finalUrl)}\` — ${chain}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const results = [];

  for (const check of CHECKS) {
    const response = await fetchWithRedirects(check.path);
    const containsFailures = (check.contains || []).filter(
      (token) => !response.body.includes(token),
    );
    const excludeFailures = (check.excludes || []).filter((token) =>
      response.body.includes(token),
    );
    const finalPath = toDisplayPath(response.finalUrl).split("?")[0];
    const initialStatus = response.chain[0]?.status ?? response.finalStatus;

    const failures = [];
    if (check.expectFinalPath) {
      if (initialStatus !== check.expectStatus) {
        failures.push(
          `expected redirect status ${check.expectStatus}, got ${initialStatus}`,
        );
      }
    } else if (response.finalStatus !== check.expectStatus) {
      failures.push(
        `expected status ${check.expectStatus}, got ${response.finalStatus}`,
      );
    }
    if (check.expectFinalPath && finalPath !== check.expectFinalPath) {
      failures.push(
        `expected final path ${check.expectFinalPath}, got ${finalPath}`,
      );
    }
    if (containsFailures.length > 0) {
      failures.push(`missing markers: ${containsFailures.join(", ")}`);
    }
    if (excludeFailures.length > 0) {
      failures.push(`unexpected markers: ${excludeFailures.join(", ")}`);
    }
    if (response.error) {
      failures.push(response.error);
    }

    results.push({
      path: check.path,
      ok: failures.length === 0,
      failureReason: failures.join("; "),
      initialStatus,
      finalStatus: response.finalStatus,
      finalUrl: response.finalUrl,
      chain: response.chain,
    });
  }

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const markdown = buildMarkdownReport({ generatedAt, results });
  const jsonPath = path.join(OUTPUT_DIR, `non-mdi-runtime-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `non-mdi-runtime-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "non-mdi-runtime-latest.md");

  await fs.writeFile(
    jsonPath,
    `${JSON.stringify({ generatedAt, results }, null, 2)}\n`,
  );
  await fs.writeFile(markdownPath, markdown);
  await fs.writeFile(latestPath, markdown);

  const failedCount = results.filter((result) => !result.ok).length;
  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: BASE_URL,
        totalChecks: results.length,
        failedCount,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
