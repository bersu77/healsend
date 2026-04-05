import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const TARGET = String(
  process.env.MDI_ENV_AUDIT_TARGET || "production",
).toLowerCase();

function readEnv(name) {
  return String(process.env[name] || "").trim();
}

function isPlaceholder(value) {
  if (!value) return true;
  const normalized = String(value).trim();
  return (
    !normalized ||
    normalized === "REPLACE_ME" ||
    normalized.includes("REPLACE_ME") ||
    normalized === "changeme" ||
    normalized === "placeholder"
  );
}

function isLocalUrl(value) {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname);
  } catch {
    return true;
  }
}

function hasDirectWebhookPath(value) {
  try {
    const url = new URL(value);
    return !!url.pathname && url.pathname !== "/";
  } catch {
    return false;
  }
}

function createCheck(name, status, detail, action = "") {
  return { name, status, detail, action };
}

function buildMarkdownReport({ generatedAt, checks, summary }) {
  const lines = [
    "# MDI Deployment Environment Audit",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Target: \`${TARGET}\``,
    `- Pass: \`${summary.pass}\``,
    `- Warn: \`${summary.warn}\``,
    `- Fail: \`${summary.fail}\``,
    "",
  ];

  if (summary.fail === 0) {
    lines.push(
      "The configured environment is ready for staging/provider-side MDI validation. Remaining work is the live external flow itself, not missing MDI configuration.",
    );
  } else {
    lines.push(
      "The configured environment is not ready for MDI cutover validation yet. Fix the failing items below before treating the environment as provider-ready.",
    );
  }

  lines.push("", "## Checks", "");

  for (const check of checks) {
    lines.push(`- [${check.status.toUpperCase()}] \`${check.name}\` — ${check.detail}`);
    if (check.action) {
      lines.push(`  Action: ${check.action}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const checks = [];
  const appUrl = readEnv("NEXT_PUBLIC_APP_URL");
  const mdiBaseUrl = readEnv("MD_API_BASE_URL");
  const mdiWebhookUrl = readEnv("MD_WEBHOOK_URL");
  const mdiClientId = readEnv("MD_CLIENT_ID");
  const mdiClientSecret = readEnv("MD_CLIENT_SECRET");
  const mdiWebhookSecret = readEnv("MD_WEBHOOK_SECRET");
  const mdiLocalFallback = readEnv("MD_LOCAL_DEV_FALLBACK");
  const mdiIframeUrl = readEnv("MD_IFRAME_URL");
  const mdiPinnedPatientId = readEnv("MD_PATIENT_ID") || readEnv("MD_DEFAULT_PATIENT_ID");

  if (isPlaceholder(appUrl)) {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_APP_URL",
        "fail",
        "App URL is missing or placeholder.",
        "Set NEXT_PUBLIC_APP_URL to the real deployed HTTPS origin.",
      ),
    );
  } else if (TARGET === "production" && isLocalUrl(appUrl)) {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_APP_URL",
        "fail",
        `App URL still points at a local host (${appUrl}).`,
        "Use the real deployed origin so callback URLs and public links are correct.",
      ),
    );
  } else if (TARGET === "production" && !appUrl.startsWith("https://")) {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_APP_URL",
        "fail",
        `App URL is not HTTPS (${appUrl}).`,
        "Use an HTTPS origin before any real MDI flow validation.",
      ),
    );
  } else {
    checks.push(createCheck("NEXT_PUBLIC_APP_URL", "pass", `Using ${appUrl}.`));
  }

  if (isPlaceholder(mdiBaseUrl)) {
    checks.push(
      createCheck(
        "MD_API_BASE_URL",
        "fail",
        "MDI API base URL is missing or placeholder.",
        "Set the real provider API base URL explicitly for the target environment.",
      ),
    );
  } else if (TARGET === "production" && isLocalUrl(mdiBaseUrl)) {
    checks.push(
      createCheck(
        "MD_API_BASE_URL",
        "fail",
        `MDI API base URL points at a local host (${mdiBaseUrl}).`,
        "Use the real provider API base URL for staging/production validation.",
      ),
    );
  } else {
    checks.push(createCheck("MD_API_BASE_URL", "pass", `Using ${mdiBaseUrl}.`));
  }

  if (isPlaceholder(mdiWebhookUrl)) {
    checks.push(
      createCheck(
        "MD_WEBHOOK_URL",
        "fail",
        "MDI webhook/order-sync URL is missing or placeholder.",
        "Set the real provider order-submission endpoint.",
      ),
    );
  } else if (TARGET === "production" && isLocalUrl(mdiWebhookUrl)) {
    checks.push(
      createCheck(
        "MD_WEBHOOK_URL",
        "fail",
        `MDI webhook URL points at a local host (${mdiWebhookUrl}).`,
        "Use the real provider order-submission endpoint.",
      ),
    );
  } else if (!hasDirectWebhookPath(mdiWebhookUrl)) {
    checks.push(
      createCheck(
        "MD_WEBHOOK_URL",
        "fail",
        `MDI webhook URL does not include a concrete endpoint path (${mdiWebhookUrl}). Outbound order sync will currently skip.`,
        "Set MD_WEBHOOK_URL to the provider's direct order-submission endpoint path, not just the domain root.",
      ),
    );
  } else {
    checks.push(createCheck("MD_WEBHOOK_URL", "pass", `Using ${mdiWebhookUrl}.`));
  }

  checks.push(
    isPlaceholder(mdiClientId)
      ? createCheck(
          "MD_CLIENT_ID",
          "fail",
          "MDI client id is missing or placeholder.",
          "Set the real partner client id for outbound auth and machine requests.",
        )
      : createCheck("MD_CLIENT_ID", "pass", "MDI client id is set."),
  );

  checks.push(
    isPlaceholder(mdiClientSecret)
      ? createCheck(
          "MD_CLIENT_SECRET",
          "fail",
          "MDI client secret is missing or placeholder.",
          "Set the real partner client secret for outbound auth and machine requests.",
        )
      : createCheck("MD_CLIENT_SECRET", "pass", "MDI client secret is set."),
  );

  checks.push(
    isPlaceholder(mdiWebhookSecret)
      ? createCheck(
          "MD_WEBHOOK_SECRET",
          "fail",
          "MDI webhook secret is missing or placeholder.",
          "Set the real inbound webhook secret so provider callbacks can be authenticated safely.",
        )
      : createCheck("MD_WEBHOOK_SECRET", "pass", "MDI webhook secret is set."),
  );

  if (String(mdiLocalFallback).toLowerCase() === "true") {
    checks.push(
      createCheck(
        "MD_LOCAL_DEV_FALLBACK",
        "fail",
        "MDI local fallback is still enabled.",
        "Set MD_LOCAL_DEV_FALLBACK=false before any real staging or production validation.",
      ),
    );
  } else {
    checks.push(
      createCheck(
        "MD_LOCAL_DEV_FALLBACK",
        "pass",
        "MDI local fallback is disabled.",
      ),
    );
  }

  if (!mdiIframeUrl) {
    checks.push(
      createCheck(
        "MD_IFRAME_URL",
        "warn",
        "No explicit iframe URL override is set.",
        "This is fine if the provider returns auth links directly. Set MD_IFRAME_URL only if your provider requires a fixed embed URL.",
      ),
    );
  } else if (TARGET === "production" && isLocalUrl(mdiIframeUrl)) {
    checks.push(
      createCheck(
        "MD_IFRAME_URL",
        "fail",
        `MDI iframe URL points at a local host (${mdiIframeUrl}).`,
        "Use a provider-hosted embed URL or remove the override.",
      ),
    );
  } else {
    checks.push(createCheck("MD_IFRAME_URL", "pass", `Using ${mdiIframeUrl}.`));
  }

  if (mdiPinnedPatientId) {
    checks.push(
      createCheck(
        "MD_PATIENT_ID / MD_DEFAULT_PATIENT_ID",
        "warn",
        `A fixed patient id override is set (${mdiPinnedPatientId}).`,
        "Only keep this if the provider explicitly requires a pinned patient id in the target environment.",
      ),
    );
  } else {
    checks.push(
      createCheck(
        "MD_PATIENT_ID / MD_DEFAULT_PATIENT_ID",
        "pass",
        "No fixed patient id override is set.",
      ),
    );
  }

  const summary = checks.reduce(
    (acc, check) => {
      acc[check.status] += 1;
      return acc;
    },
    { pass: 0, warn: 0, fail: 0 },
  );

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const markdown = buildMarkdownReport({ generatedAt, checks, summary });
  const jsonPath = path.join(
    OUTPUT_DIR,
    `mdi-deployment-env-${timestamp}.json`,
  );
  const markdownPath = path.join(
    OUTPUT_DIR,
    `mdi-deployment-env-${timestamp}.md`,
  );
  const latestPath = path.join(OUTPUT_DIR, "mdi-deployment-env-latest.md");

  await fs.writeFile(
    jsonPath,
    `${JSON.stringify({ generatedAt, target: TARGET, checks, summary }, null, 2)}\n`,
  );
  await fs.writeFile(markdownPath, markdown);
  await fs.writeFile(latestPath, markdown);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        target: TARGET,
        failCount: summary.fail,
        warnCount: summary.warn,
        passCount: summary.pass,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );

  if (summary.fail > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
