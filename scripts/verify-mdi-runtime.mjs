import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const BASE_URL = String(
  process.env.MDI_AUDIT_BASE_URL ||
    process.env.BASE_URL ||
    "http://127.0.0.1:3000",
).replace(/\/+$/, "");
const DEMO_EMAIL = process.env.DEMO_CUSTOMER_EMAIL || "demo@healsend.com";
const DEMO_PASSWORD = process.env.DEMO_CUSTOMER_PASSWORD || "Demo123!";

function buildMachineAuthHeaders() {
  if (process.env.MD_WEBHOOK_SECRET) {
    return {
      "X-Webhook-Secret": process.env.MD_WEBHOOK_SECRET,
    };
  }

  if (process.env.MD_CLIENT_ID && process.env.MD_CLIENT_SECRET) {
    return {
      "X-Client-Id": process.env.MD_CLIENT_ID,
      "X-Client-Secret": process.env.MD_CLIENT_SECRET,
    };
  }

  throw new Error(
    "Missing MDI machine auth env. Set MD_WEBHOOK_SECRET or MD_CLIENT_ID + MD_CLIENT_SECRET.",
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

function buildMarkdownReport({ generatedAt, results, caseId, orderId }) {
  const failures = results.filter((result) => !result.ok);
  const lines = [
    "# MDI Runtime Verification",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Base URL: \`${BASE_URL}\``,
    `- Demo user: \`${DEMO_EMAIL}\``,
    `- Order ID: \`${orderId}\``,
    `- Case ID: \`${caseId}\``,
    `- Checks: \`${results.length}\``,
    `- Passing: \`${results.length - failures.length}\``,
    `- Failing: \`${failures.length}\``,
    "",
  ];

  if (failures.length === 0) {
    lines.push(
      "The local MDI contract is resolving cleanly: partner-auth completion, webhook projection, case snapshots, patient message sync, visit history, and account-facing MDI state all updated as expected.",
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
  const machineAuthHeaders = buildMachineAuthHeaders();

  const login = await fetchJson("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  });

  const rawSetCookie = login.response.headers.get("set-cookie") || "";
  const sessionCookie = rawSetCookie.split(";")[0];
  const loginOk = login.response.ok && sessionCookie.startsWith("session_token=");
  results.push({
    name: "login",
    ok: loginOk,
    failure: loginOk
      ? ""
      : `expected successful login with session cookie, got ${login.response.status}`,
    summary: `status ${login.response.status}`,
  });

  if (!loginOk) {
    throw new Error("Unable to authenticate seeded demo user for MDI verification.");
  }

  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
      },
      messages: true,
    },
  });

  if (!user?.orders?.[0]) {
    throw new Error("No seeded demo order found for MDI verification.");
  }

  const order = user.orders[0];
  const timestampToken = Date.now();
  const caseId = `mdi-case-${timestampToken}`;
  const patientId = `mdi-patient-${timestampToken}`;
  const encounterId = `mdi-encounter-${timestampToken}`;
  const mdiOrderId = `mdi-order-${timestampToken}`;
  const consultationUrl = `${BASE_URL}/consultation/local-dev?orderId=${encodeURIComponent(order.id)}&mdi_case=${encodeURIComponent(caseId)}`;
  const baselineMessageCount = user.messages.length;

  const partnerAuth = await fetchJson(
    "/api/mdi/partner-auth/complete",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        order_internal_id: order.id,
        order_id: order.orderNumber,
        patient_id: patientId,
        case_id: caseId,
        mdi_order_id: mdiOrderId,
        consultation_url: consultationUrl,
        consultation_status: "ready",
        redirectTo: "/account",
      }),
    },
    sessionCookie,
  );
  const partnerAuthOk =
    partnerAuth.response.ok &&
    partnerAuth.json?.ok === true &&
    partnerAuth.json?.orderId === order.id;
  results.push({
    name: "partner auth completion",
    ok: partnerAuthOk,
    failure: partnerAuthOk
      ? ""
      : `expected successful partner auth completion, got ${partnerAuth.response.status}`,
    summary: `status ${partnerAuth.response.status}`,
  });

  const webhookEvents = [
    {
      name: "case_assigned webhook",
      payload: {
        event_type: "case_assigned",
        order_internal_id: order.id,
        order_id: order.orderNumber,
        patient_id: patientId,
        case_id: caseId,
        mdi_order_id: mdiOrderId,
        provider_name: "Dr. Jane Patel",
        consultation_url: consultationUrl,
        consultation_status: "active",
      },
    },
    {
      name: "offering_submitted webhook",
      payload: {
        event_type: "offering_submitted",
        order_internal_id: order.id,
        patient_id: patientId,
        case_id: caseId,
        mdi_order_id: mdiOrderId,
        offerings: [
          { name: "Enclomiphene program", dosage: "25 mg" },
          { name: "Follow-up labs", cadence: "8 weeks" },
        ],
        workflow_phase: "offering_submitted",
      },
    },
    {
      name: "prescription_submitted webhook",
      payload: {
        event_type: "prescription_submitted",
        order_internal_id: order.id,
        patient_id: patientId,
        case_id: caseId,
        mdi_order_id: mdiOrderId,
        encounter_id: encounterId,
        prescriptions: [
          { medication: "Enclomiphene", quantity: 30, refill: 2 },
        ],
        consultation_status: "completed",
        workflow_phase: "prescription_submitted",
      },
    },
  ];

  for (const event of webhookEvents) {
    const result = await fetchJson("/api/webhooks/mdi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...machineAuthHeaders,
      },
      body: JSON.stringify(event.payload),
    });
    const ok = result.response.ok && result.json?.ok === true;
    results.push({
      name: event.name,
      ok,
      failure: ok
        ? ""
        : `expected webhook success, got ${result.response.status}`,
      summary: `status ${result.response.status}`,
    });
  }

  const visits = await fetchJson("/api/user/visits", {}, sessionCookie);
  const visitsOk =
    visits.response.ok &&
    Array.isArray(visits.json) &&
    visits.json.some((visit) => visit.mdiCaseId === caseId);
  results.push({
    name: "user visits api",
    ok: visitsOk,
    failure: visitsOk
      ? ""
      : `expected normalized visit for case ${caseId}, got ${visits.response.status}`,
    summary: `${Array.isArray(visits.json) ? visits.json.length : 0} visits`,
  });

  const messages = await fetchJson("/api/user/messages", {}, sessionCookie);
  const messagesOk =
    messages.response.ok &&
    Array.isArray(messages.json) &&
    messages.json.length > baselineMessageCount;
  results.push({
    name: "user messages api",
    ok: messagesOk,
    failure: messagesOk
      ? ""
      : `expected new MDI-derived messages, got ${messages.response.status}`,
    summary: `${Array.isArray(messages.json) ? messages.json.length : 0} messages`,
  });

  const refreshedUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  const refreshedOrder = await prisma.order.findUnique({
    where: { id: order.id },
  });
  const caseSnapshot = await prisma.mdiCaseSnapshot.findUnique({
    where: { mdiCaseId: caseId },
  });
  const messageSync = await prisma.mdiPatientMessageSync.findUnique({
    where: { userId: user.id },
  });
  const webhookCount = await prisma.mdiWebhookEvent.count({
    where: { orderId: order.id, mdiCaseId: caseId },
  });
  const messageCount = await prisma.message.count({
    where: {
      userId: user.id,
      fromAdmin: true,
      body: {
        contains: caseId,
      },
    },
  });

  results.push({
    name: "user projection",
    ok: refreshedUser?.mdiPatientId === patientId,
    failure:
      refreshedUser?.mdiPatientId === patientId
        ? ""
        : `expected user mdiPatientId ${patientId}, got ${refreshedUser?.mdiPatientId || "null"}`,
    summary: refreshedUser?.mdiPatientId || "no patient id",
  });
  results.push({
    name: "order projection",
    ok:
      refreshedOrder?.mdiCaseId === caseId &&
      refreshedOrder?.mdiEncounterId === encounterId,
    failure:
      refreshedOrder?.mdiCaseId === caseId &&
      refreshedOrder?.mdiEncounterId === encounterId
        ? ""
        : `expected order case ${caseId} and encounter ${encounterId}`,
    summary: `case ${refreshedOrder?.mdiCaseId || "none"} / encounter ${refreshedOrder?.mdiEncounterId || "none"}`,
  });
  results.push({
    name: "case snapshot projection",
    ok:
      caseSnapshot?.providerName === "Dr. Jane Patel" &&
      Array.isArray(caseSnapshot?.offerings) &&
      Array.isArray(caseSnapshot?.prescriptions),
    failure:
      caseSnapshot?.providerName === "Dr. Jane Patel" &&
      Array.isArray(caseSnapshot?.offerings) &&
      Array.isArray(caseSnapshot?.prescriptions)
        ? ""
        : "expected provider, offerings, and prescriptions on case snapshot",
    summary: caseSnapshot
      ? `status ${caseSnapshot.status || caseSnapshot.phase || "unknown"}`
      : "missing case snapshot",
  });
  results.push({
    name: "message sync projection",
    ok: messageSync?.mdiPatientId === patientId,
    failure:
      messageSync?.mdiPatientId === patientId
        ? ""
        : "expected message sync row to store mdi patient id",
    summary: messageSync?.mdiPatientId || "missing sync row",
  });
  results.push({
    name: "webhook event log",
    ok: webhookCount >= webhookEvents.length,
    failure:
      webhookCount >= webhookEvents.length
        ? ""
        : `expected at least ${webhookEvents.length} logged webhook events, got ${webhookCount}`,
    summary: `${webhookCount} logged events`,
  });
  results.push({
    name: "mdi care-team messages",
    ok: messageCount >= 1,
    failure:
      messageCount >= 1
        ? ""
        : "expected at least one persisted MDI-derived care-team message",
    summary: `${messageCount} case-specific messages`,
  });

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const report = buildMarkdownReport({
    generatedAt,
    results,
    caseId,
    orderId: order.id,
  });
  const jsonPath = path.join(OUTPUT_DIR, `mdi-runtime-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `mdi-runtime-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "mdi-runtime-latest.md");

  await fs.writeFile(
    jsonPath,
    `${JSON.stringify({ generatedAt, baseUrl: BASE_URL, caseId, orderId: order.id, results }, null, 2)}\n`,
  );
  await fs.writeFile(markdownPath, report);
  await fs.writeFile(latestPath, report);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: BASE_URL,
        caseId,
        orderId: order.id,
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

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
