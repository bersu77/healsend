import fs from "node:fs/promises";
import path from "node:path";
import Stripe from "stripe";

const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);
const FALSE_VALUES = new Set(["0", "false", "no", "off"]);

function isPlaceholderEnvValue(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return (
    !normalized ||
    normalized === "replace_me" ||
    normalized.includes("replace_me") ||
    normalized.includes("placeholder") ||
    normalized.includes("your_") ||
    normalized.includes("changeme")
  );
}

function readBooleanEnv(...names) {
  for (const name of names) {
    const raw = String(process.env[name] || "")
      .trim()
      .toLowerCase();
    if (!raw) continue;
    if (TRUE_VALUES.has(raw)) return true;
    if (FALSE_VALUES.has(raw)) return false;
  }
  return null;
}

function hasConfiguredEnv(name, { requirePrivateKey = false } = {}) {
  const value = String(process.env[name] || "").trim();
  if (isPlaceholderEnvValue(value)) return false;
  if (requirePrivateKey && !value.includes("BEGIN PRIVATE KEY")) return false;
  return true;
}

function isGoogleOAuthEnabled() {
  const explicit = readBooleanEnv(
    "GOOGLE_OAUTH_ENABLED",
    "NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED",
  );
  if (explicit === false) return false;

  return (
    hasConfiguredEnv("GOOGLE_CLIENT_ID") &&
    hasConfiguredEnv("GOOGLE_CLIENT_SECRET")
  );
}

function isAppleOAuthEnabled() {
  const explicit = readBooleanEnv(
    "APPLE_OAUTH_ENABLED",
    "NEXT_PUBLIC_APPLE_OAUTH_ENABLED",
  );
  if (explicit === false) return false;

  return (
    hasConfiguredEnv("APPLE_CLIENT_ID") &&
    hasConfiguredEnv("APPLE_TEAM_ID") &&
    hasConfiguredEnv("APPLE_KEY_ID") &&
    hasConfiguredEnv("APPLE_PRIVATE_KEY", { requirePrivateKey: true })
  );
}

function isGhlApiEnabled() {
  const explicit = readBooleanEnv("GHL_SYNC_ENABLED", "GHL_API_ENABLED");
  if (explicit === false) return false;

  return hasConfiguredEnv("GHL_API_KEY");
}

function isGhlOAuthEnabled() {
  const explicit = readBooleanEnv("GHL_OAUTH_ENABLED");
  if (explicit === false) return false;

  return (
    hasConfiguredEnv("GHL_CLIENT_ID") && hasConfiguredEnv("GHL_CLIENT_SECRET")
  );
}

const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const TARGET = String(
  process.env.CUTOVER_ENV_AUDIT_TARGET || "production",
).toLowerCase();
const CHECK_EXTERNAL =
  String(process.env.CUTOVER_ENV_CHECK_EXTERNAL || "").toLowerCase() === "true";

function readEnv(name) {
  return String(process.env[name] || "").trim();
}

const isPlaceholder = isPlaceholderEnvValue;

function isLocalUrl(value) {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname);
  } catch {
    return true;
  }
}

function getStripeMode(value) {
  if (value.startsWith("sk_live_") || value.startsWith("pk_live_")) {
    return "live";
  }
  if (value.startsWith("sk_test_") || value.startsWith("pk_test_")) {
    return "test";
  }
  return "unknown";
}

function createCheck(name, status, detail, action = "") {
  return { name, status, detail, action };
}

async function verifyStripeConnectivity(secretKey) {
  const stripe = new Stripe(secretKey, { apiVersion: "2024-04-10" });
  await stripe.balance.retrieve();
}

async function verifyGhlConnectivity(apiKey) {
  const response = await fetch(
    "https://rest.gohighlevel.com/v1/contacts/?limit=1",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `GHL responded with ${response.status}${body ? `: ${body.slice(0, 160)}` : ""}`,
    );
  }
}

function buildMarkdownReport({ generatedAt, checks, summary }) {
  const lines = [
    "# Deployment Environment Audit",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Target: \`${TARGET}\``,
    `- External connectivity checks: \`${CHECK_EXTERNAL ? "enabled" : "disabled"}\``,
    `- Pass: \`${summary.pass}\``,
    `- Warn: \`${summary.warn}\``,
    `- Fail: \`${summary.fail}\``,
    "",
  ];

  if (summary.fail === 0) {
    lines.push(
      "The configured environment passed the current deployment-readiness audit. Remaining cutover work is manual rollout, monitoring, and rollback execution.",
    );
  } else {
    lines.push(
      "The configured environment is not cutover-ready yet. Fix the failing items below before treating the target environment as production-ready.",
    );
  }

  lines.push("", "## Checks", "");

  for (const check of checks) {
    lines.push(
      `- [${check.status.toUpperCase()}] \`${check.name}\` — ${check.detail}`,
    );
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
  if (isPlaceholder(appUrl)) {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_APP_URL",
        "fail",
        "App URL is missing or still placeholder.",
        "Set NEXT_PUBLIC_APP_URL to the real deployed origin before cutover.",
      ),
    );
  } else if (TARGET === "production" && isLocalUrl(appUrl)) {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_APP_URL",
        "fail",
        `App URL still points at a local host (${appUrl}).`,
        "Use the real production HTTPS origin so canonicals, OAuth callbacks, robots, and sitemap output are correct.",
      ),
    );
  } else if (TARGET === "production" && !appUrl.startsWith("https://")) {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_APP_URL",
        "fail",
        `App URL is not HTTPS (${appUrl}).`,
        "Use an HTTPS production origin before public traffic cutover.",
      ),
    );
  } else {
    checks.push(createCheck("NEXT_PUBLIC_APP_URL", "pass", `Using ${appUrl}.`));
  }

  const stripeSecret = readEnv("STRIPE_SECRET_KEY");
  const stripePublishable = readEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  const stripeWebhook = readEnv("STRIPE_WEBHOOK_SECRET");
  const stripeSecretMode = getStripeMode(stripeSecret);
  const stripePublishableMode = getStripeMode(stripePublishable);

  if (isPlaceholder(stripeSecret)) {
    checks.push(
      createCheck(
        "STRIPE_SECRET_KEY",
        "fail",
        "Stripe secret key is missing or placeholder.",
        "Set a real Stripe secret key for the target environment.",
      ),
    );
  } else if (TARGET === "production" && stripeSecretMode !== "live") {
    checks.push(
      createCheck(
        "STRIPE_SECRET_KEY",
        "fail",
        `Stripe secret key is not live-mode (${stripeSecretMode}).`,
        "Use a live Stripe secret key before production cutover.",
      ),
    );
  } else {
    checks.push(
      createCheck(
        "STRIPE_SECRET_KEY",
        "pass",
        `Stripe secret key looks configured (${stripeSecretMode}).`,
      ),
    );
  }

  if (isPlaceholder(stripePublishable)) {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        "fail",
        "Stripe publishable key is missing or placeholder.",
        "Set the matching Stripe publishable key for the target environment.",
      ),
    );
  } else if (
    stripeSecretMode !== "unknown" &&
    stripePublishableMode !== "unknown" &&
    stripeSecretMode !== stripePublishableMode
  ) {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        "fail",
        `Stripe key modes do not match (${stripeSecretMode} vs ${stripePublishableMode}).`,
        "Use secret and publishable keys from the same Stripe environment.",
      ),
    );
  } else if (TARGET === "production" && stripePublishableMode !== "live") {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        "fail",
        `Stripe publishable key is not live-mode (${stripePublishableMode}).`,
        "Use a live publishable key before production cutover.",
      ),
    );
  } else {
    checks.push(
      createCheck(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        "pass",
        `Stripe publishable key looks configured (${stripePublishableMode}).`,
      ),
    );
  }

  if (isPlaceholder(stripeWebhook)) {
    checks.push(
      createCheck(
        "STRIPE_WEBHOOK_SECRET",
        "fail",
        "Stripe webhook secret is missing or placeholder.",
        "Set the real Stripe webhook signing secret for the deployed endpoint.",
      ),
    );
  } else {
    checks.push(
      createCheck(
        "STRIPE_WEBHOOK_SECRET",
        "pass",
        "Stripe webhook secret is set.",
      ),
    );
  }

  const googleClientId = readEnv("GOOGLE_CLIENT_ID");
  const googleClientSecret = readEnv("GOOGLE_CLIENT_SECRET");
  if (!isGoogleOAuthEnabled()) {
    checks.push(
      createCheck(
        "Google OAuth",
        "warn",
        "Google OAuth is disabled in this environment.",
        "If you want Google sign-in at cutover, set real credentials and re-enable the provider.",
      ),
    );
  } else {
    checks.push(
      isPlaceholder(googleClientId) || isPlaceholder(googleClientSecret)
        ? createCheck(
            "Google OAuth",
            "fail",
            "Google OAuth is enabled but credentials are missing or placeholder.",
            "Set real Google OAuth credentials or disable Google OAuth for this environment.",
          )
        : createCheck(
            "Google OAuth",
            "pass",
            "Google OAuth credentials are configured.",
          ),
    );
  }

  const appleClientId = readEnv("APPLE_CLIENT_ID");
  const appleTeamId = readEnv("APPLE_TEAM_ID");
  const appleKeyId = readEnv("APPLE_KEY_ID");
  const applePrivateKey = readEnv("APPLE_PRIVATE_KEY");
  if (!isAppleOAuthEnabled()) {
    checks.push(
      createCheck(
        "Apple OAuth",
        "warn",
        "Apple OAuth is disabled in this environment.",
        "If you want Apple sign-in at cutover, set the full Apple OAuth config and re-enable the provider.",
      ),
    );
  } else {
    checks.push(
      isPlaceholder(appleClientId) ||
        isPlaceholder(appleTeamId) ||
        isPlaceholder(appleKeyId) ||
        isPlaceholder(applePrivateKey) ||
        !applePrivateKey.includes("BEGIN PRIVATE KEY")
        ? createCheck(
            "Apple OAuth",
            "fail",
            "Apple OAuth is enabled but credentials are incomplete or placeholder.",
            "Set the full Apple OAuth config or disable Apple OAuth for this environment.",
          )
        : createCheck(
            "Apple OAuth",
            "pass",
            "Apple OAuth credentials are configured.",
          ),
    );
  }

  const ghlApiKey = readEnv("GHL_API_KEY");
  const ghlClientId = readEnv("GHL_CLIENT_ID");
  const ghlClientSecret = readEnv("GHL_CLIENT_SECRET");

  if (!isGhlApiEnabled()) {
    checks.push(
      createCheck(
        "GHL_API_KEY",
        "warn",
        "GoHighLevel sync/API is disabled in this environment.",
        "If CRM contact sync is required at cutover, set a real GHL_API_KEY and re-enable GHL sync.",
      ),
    );
  } else if (isPlaceholder(ghlApiKey)) {
    checks.push(
      createCheck(
        "GHL_API_KEY",
        "fail",
        "GoHighLevel sync/API is enabled but the API key is missing or placeholder.",
        "Set a real GHL API key or disable GHL sync for this environment.",
      ),
    );
  } else {
    checks.push(
      createCheck("GHL_API_KEY", "pass", "GoHighLevel API key is configured."),
    );
  }

  if (!isGhlOAuthEnabled()) {
    checks.push(
      createCheck(
        "GHL OAuth",
        "warn",
        "GHL OAuth is disabled in this environment.",
        "If you depend on the OAuth flow, set real GHL_CLIENT_ID and GHL_CLIENT_SECRET and re-enable it.",
      ),
    );
  } else {
    checks.push(
      isPlaceholder(ghlClientId) || isPlaceholder(ghlClientSecret)
        ? createCheck(
            "GHL OAuth",
            "fail",
            "GHL OAuth is enabled but credentials are missing or placeholder.",
            "Set real GHL OAuth credentials or disable the flow for this environment.",
          )
        : createCheck(
            "GHL OAuth",
            "pass",
            "GHL OAuth credentials are configured.",
          ),
    );
  }

  checks.push(
    createCheck(
      "Uploads",
      "pass",
      "The app uses local filesystem uploads under public/uploads and does not require extra upload env vars.",
      "Still verify runtime upload/write permissions in the deployed environment.",
    ),
  );

  if (CHECK_EXTERNAL && !isPlaceholder(stripeSecret)) {
    try {
      await verifyStripeConnectivity(stripeSecret);
      checks.push(
        createCheck(
          "Stripe connectivity",
          "pass",
          "Stripe API call succeeded.",
        ),
      );
    } catch (error) {
      checks.push(
        createCheck(
          "Stripe connectivity",
          "fail",
          error?.message || "Stripe API check failed.",
          "Verify the Stripe secret key and outbound network access from the target environment.",
        ),
      );
    }
  }

  if (CHECK_EXTERNAL && isGhlApiEnabled() && !isPlaceholder(ghlApiKey)) {
    try {
      await verifyGhlConnectivity(ghlApiKey);
      checks.push(
        createCheck("GHL connectivity", "pass", "GHL API call succeeded."),
      );
    } catch (error) {
      checks.push(
        createCheck(
          "GHL connectivity",
          "fail",
          error?.message || "GHL API check failed.",
          "Verify the GHL API key and outbound connectivity from the target environment.",
        ),
      );
    }
  }

  const summary = checks.reduce(
    (accumulator, check) => {
      accumulator[check.status] += 1;
      return accumulator;
    },
    { pass: 0, warn: 0, fail: 0 },
  );

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const report = buildMarkdownReport({ generatedAt, checks, summary });
  const payload = {
    generatedAt,
    target: TARGET,
    checkExternal: CHECK_EXTERNAL,
    summary,
    checks,
  };
  const jsonPath = path.join(OUTPUT_DIR, `deployment-env-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `deployment-env-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "deployment-env-latest.md");

  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.writeFile(markdownPath, report);
  await fs.writeFile(latestPath, report);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        target: TARGET,
        checkExternal: CHECK_EXTERNAL,
        summary,
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
