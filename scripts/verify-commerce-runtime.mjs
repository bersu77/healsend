import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const BASE_URL = String(
  process.env.COMMERCE_AUDIT_BASE_URL ||
    process.env.BASE_URL ||
    "http://127.0.0.1:3000",
).replace(/\/+$/, "");
const DEMO_EMAIL = process.env.DEMO_CUSTOMER_EMAIL || "demo@healsend.com";
const DEMO_PASSWORD = process.env.DEMO_CUSTOMER_PASSWORD || "Demo123!";

function toDisplayPath(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

async function fetchJson(pathname, init = {}, cookieHeader = "") {
  const response = await fetch(new URL(pathname, `${BASE_URL}/`), {
    ...init,
    headers: {
      accept: "application/json,text/html",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return { response, text, json };
}

function buildMarkdownReport({ generatedAt, results }) {
  const failures = results.filter((result) => !result.ok);
  const lines = [
    "# Commerce Runtime Verification",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Base URL: \`${BASE_URL}\``,
    `- Demo user: \`${DEMO_EMAIL}\``,
    `- Checks: \`${results.length}\``,
    `- Passing: \`${results.length - failures.length}\``,
    `- Failing: \`${failures.length}\``,
    "",
  ];

  if (failures.length === 0) {
    lines.push(
      "The seeded authenticated commerce path is resolving cleanly for login, account, orders, subscriptions, payment methods, address, cart, and order confirmation.",
    );
  } else {
    lines.push("## Failures", "");
    for (const result of failures) {
      lines.push(`- \`${result.name}\` — ${result.failure}`);
    }
  }

  lines.push("", "## Check Results", "");

  for (const result of results) {
    lines.push(
      `- \`${result.name}\` — ${result.ok ? "PASS" : "FAIL"} — ${result.summary}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const results = [];

  const login = await fetchJson("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  });

  const rawSetCookie = login.response.headers.get("set-cookie") || "";
  const sessionCookie = rawSetCookie.split(";")[0];
  const loginOk =
    login.response.ok && sessionCookie.startsWith("session_token=");
  results.push({
    name: "login",
    ok: loginOk,
    failure: loginOk
      ? ""
      : `expected successful login with session cookie, got ${login.response.status}`,
    summary: `status ${login.response.status}`,
  });

  if (!loginOk) {
    throw new Error(
      "Unable to authenticate seeded demo user for commerce verification.",
    );
  }

  const accountPage = await fetchJson("/account", {}, sessionCookie);
  const accountMarkers = [
    "Action Items",
    "Order History",
    "Patient Account",
    "Consultation",
  ];
  const accountOk =
    accountPage.response.status === 200 &&
    accountMarkers.some((marker) => accountPage.text.includes(marker));
  results.push({
    name: "account page",
    ok: accountOk,
    failure: accountOk
      ? ""
      : `expected account shell markers, got ${accountPage.response.status}`,
    summary: `status ${accountPage.response.status} at ${toDisplayPath(accountPage.response.url)}`,
  });

  const orders = await fetchJson("/api/user/orders", {}, sessionCookie);
  const orderList = Array.isArray(orders.json) ? orders.json : [];
  const ordersOk = orders.response.status === 200 && orderList.length > 0;
  results.push({
    name: "user orders api",
    ok: ordersOk,
    failure: ordersOk
      ? ""
      : `expected seeded orders, got ${orders.response.status}`,
    summary: `${orderList.length} orders`,
  });

  const paymentMethods = await fetchJson(
    "/api/user/payment-methods",
    {},
    sessionCookie,
  );
  const paymentMethodList = Array.isArray(paymentMethods.json)
    ? paymentMethods.json
    : [];
  const paymentMethodsOk =
    paymentMethods.response.status === 200 && paymentMethodList.length > 0;
  results.push({
    name: "user payment methods api",
    ok: paymentMethodsOk,
    failure: paymentMethodsOk
      ? ""
      : `expected seeded payment methods, got ${paymentMethods.response.status}`,
    summary: `${paymentMethodList.length} payment methods`,
  });

  const subscriptions = await fetchJson(
    "/api/user/subscriptions",
    {},
    sessionCookie,
  );
  const subscriptionList = Array.isArray(subscriptions.json)
    ? subscriptions.json
    : [];
  const hasVisibleSubscriptions = subscriptionList.length > 0;
  const subscriptionsOk =
    subscriptions.response.status === 200 && Array.isArray(subscriptions.json);
  results.push({
    name: "user subscriptions api",
    ok: subscriptionsOk,
    failure: subscriptionsOk
      ? ""
      : `expected subscriptions array response, got ${subscriptions.response.status}`,
    summary: `${subscriptionList.length} subscriptions${
      hasVisibleSubscriptions ? "" : " (no public subscriptions visible)"
    }`,
  });

  const address = await fetchJson("/api/user/address", {}, sessionCookie);
  const addressOk =
    address.response.status === 200 && Boolean(address.json?.line1);
  results.push({
    name: "user address api",
    ok: addressOk,
    failure: addressOk
      ? ""
      : `expected saved address, got ${address.response.status}`,
    summary: address.json?.line1 || `status ${address.response.status}`,
  });

  const cart = await fetchJson("/api/cart", {}, sessionCookie);
  const cartOk =
    cart.response.status === 200 &&
    Array.isArray(cart.json?.items) &&
    cart.json.items.length > 0;
  results.push({
    name: "cart api",
    ok: cartOk,
    failure: cartOk
      ? ""
      : `expected seeded cart items, got ${cart.response.status}`,
    summary: `${Array.isArray(cart.json?.items) ? cart.json.items.length : 0} cart items`,
  });

  const firstOrderId = orderList[0]?.id;
  const orderConfirmation = firstOrderId
    ? await fetchJson(
        `/order-confirmation?orderId=${encodeURIComponent(firstOrderId)}`,
        {},
        sessionCookie,
      )
    : null;
  const orderConfirmationOk =
    Boolean(orderConfirmation) &&
    orderConfirmation.response.status === 200 &&
    orderConfirmation.text.includes("Order Summary");
  results.push({
    name: "order confirmation page",
    ok: orderConfirmationOk,
    failure: orderConfirmationOk
      ? ""
      : `expected order confirmation summary for seeded order`,
    summary: orderConfirmation
      ? `status ${orderConfirmation.response.status} at ${toDisplayPath(orderConfirmation.response.url)}`
      : "no seeded order available",
  });

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const report = buildMarkdownReport({ generatedAt, results });
  const jsonPath = path.join(OUTPUT_DIR, `commerce-runtime-${timestamp}.json`);
  const markdownPath = path.join(
    OUTPUT_DIR,
    `commerce-runtime-${timestamp}.md`,
  );
  const latestPath = path.join(OUTPUT_DIR, "commerce-runtime-latest.md");

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
        totalChecks: results.length,
        failedCount: results.filter((result) => !result.ok).length,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );

  if (results.some((result) => !result.ok)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
