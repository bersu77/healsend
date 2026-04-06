import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const BASE_URL = String(
  process.env.MDI_VARIANT_AUDIT_BASE_URL ||
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

async function fetchJson(pathname, init = {}, cookieHeader = "") {
  const response = await fetch(new URL(pathname, `${BASE_URL}/`), {
    redirect: init.redirect || "follow",
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

function buildMarkdownReport({ generatedAt, results, orderId, caseId }) {
  const failures = results.filter((result) => !result.ok);
  const lines = [
    "# MDI Payload Variant Verification",
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
      "The machine-route contract is handling the expected payload variants cleanly: customer linkage, nested order payloads, tag/voucher updates, GET partner-auth completion, and voucher-based webhook resolution all projected correctly.",
    );
  } else {
    lines.push("## Failures", "");
    for (const failure of failures) {
      lines.push(`- \`${failure.name}\` — ${failure.failure}`);
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

  const machineHeaders = buildMachineAuthHeaders();
  const results = [];

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
    throw new Error("No seeded demo order found for MDI payload verification.");
  }

  const order = user.orders[0];
  const token = Date.now();
  const patientId = `mdi-payload-patient-${token}`;
  const caseId = `mdi-payload-case-${token}`;
  const encounterId = `mdi-payload-encounter-${token}`;
  const mdiOrderId = `mdi-payload-order-${token}`;
  const consultationId = `mdi-payload-consult-${token}`;
  const voucherCode = `mdi-voucher-${token}`;
  const consultationUrl = `${BASE_URL}/consultation/local-dev?orderId=${encodeURIComponent(order.id)}&mdi_case=${encodeURIComponent(caseId)}`;
  const baselineMessageCount = user.messages.length;

  const login = await fetchJson("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  });
  const sessionCookie = (login.response.headers.get("set-cookie") || "").split(
    ";",
  )[0];
  const loginOk =
    login.response.ok && sessionCookie.startsWith("session_token=");
  results.push({
    name: "login",
    ok: loginOk,
    failure: loginOk
      ? ""
      : `expected login success, got ${login.response.status}`,
    summary: `status ${login.response.status}`,
  });

  if (!loginOk) {
    throw new Error("Unable to authenticate seeded demo user.");
  }

  const customerPatch = await fetchJson(`/api/mdi/customers/${user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...machineHeaders,
    },
    body: JSON.stringify({
      patientId,
      patientStatus: "linked",
    }),
  });
  const customerPatchOk =
    customerPatch.response.ok &&
    customerPatch.json?.customer?.mdiPatientId === patientId;
  results.push({
    name: "customer patch camelCase payload",
    ok: customerPatchOk,
    failure: customerPatchOk
      ? ""
      : `expected patient id ${patientId}, got ${customerPatch.response.status}`,
    summary: `status ${customerPatch.response.status}`,
  });

  const customerGet = await fetchJson(`/api/mdi/customers/${user.id}`, {
    headers: machineHeaders,
  });
  const customerGetOk =
    customerGet.response.ok &&
    customerGet.json?.customer?.mdiPatientId === patientId;
  results.push({
    name: "customer get route",
    ok: customerGetOk,
    failure: customerGetOk
      ? ""
      : `expected linked customer projection, got ${customerGet.response.status}`,
    summary: `status ${customerGet.response.status}`,
  });

  const orderPatch = await fetchJson(`/api/mdi/orders/${order.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...machineHeaders,
    },
    body: JSON.stringify({
      data: {
        eventType: "consultation_ready",
        patient: {
          id: patientId,
          status: "linked",
        },
        order: {
          id: mdiOrderId,
          external_id: mdiOrderId,
          internalId: order.id,
          status: "consultation_ready",
        },
        case: {
          id: caseId,
          phase: "consultation_ready",
          provider: {
            name: "Dr. Payload Variant",
          },
          offerings: [{ name: "Enclomiphene tablets", dosage: "25 mg" }],
        },
        consultation: {
          id: consultationId,
          url: consultationUrl,
          status: "ready",
        },
      },
    }),
  });
  const orderPatchOk =
    orderPatch.response.ok &&
    orderPatch.json?.order?.mdiCaseId === caseId &&
    orderPatch.json?.order?.mdiCaseSnapshot?.providerName ===
      "Dr. Payload Variant";
  results.push({
    name: "order patch nested payload",
    ok: orderPatchOk,
    failure: orderPatchOk
      ? ""
      : `expected nested order projection, got ${orderPatch.response.status}`,
    summary: `status ${orderPatch.response.status}`,
  });

  const orderGet = await fetchJson(`/api/mdi/orders/${order.id}`, {
    headers: machineHeaders,
  });
  const orderGetCaseId =
    orderGet.json?.order?.mdiCaseSnapshot?.mdiCaseId ||
    orderGet.json?.order?.mdiCaseId ||
    null;
  const orderGetOk =
    orderGet.response.ok &&
    orderGet.json?.order?.mdiOrderId === mdiOrderId &&
    orderGetCaseId === caseId;
  results.push({
    name: "order get route",
    ok: orderGetOk,
    failure: orderGetOk
      ? ""
      : `expected order projection with case snapshot, got ${orderGet.response.status}`,
    summary: `status ${orderGet.response.status}`,
  });

  const tagsPatch = await fetchJson(`/api/mdi/orders/${order.id}/tags`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...machineHeaders,
    },
    body: JSON.stringify({
      tag: "priority-review",
      voucher: voucherCode,
      phase: "offering_review",
      patientId,
      caseId,
    }),
  });
  const tagsPatchOk =
    tagsPatch.response.ok &&
    tagsPatch.json?.tags?.mdiOrderTag === "priority-review" &&
    tagsPatch.json?.tags?.mdiVoucherCode === voucherCode;
  results.push({
    name: "order tags patch alias payload",
    ok: tagsPatchOk,
    failure: tagsPatchOk
      ? ""
      : `expected updated tags/voucher, got ${tagsPatch.response.status}`,
    summary: `status ${tagsPatch.response.status}`,
  });

  const tagsGet = await fetchJson(`/api/mdi/orders/${order.id}/tags`, {
    headers: machineHeaders,
  });
  const tagsGetOk =
    tagsGet.response.ok && tagsGet.json?.tags?.mdiVoucherCode === voucherCode;
  results.push({
    name: "order tags get route",
    ok: tagsGetOk,
    failure: tagsGetOk
      ? ""
      : `expected voucher/tag projection, got ${tagsGet.response.status}`,
    summary: `status ${tagsGet.response.status}`,
  });

  const partnerGet = await fetchJson(
    `/api/mdi/partner-auth/complete?orderId=${encodeURIComponent(order.id)}&patient_id=${encodeURIComponent(patientId)}&case_id=${encodeURIComponent(caseId)}&mdi_order_id=${encodeURIComponent(mdiOrderId)}&consultation_url=${encodeURIComponent(consultationUrl)}&consultation_status=ready&redirectTo=${encodeURIComponent("/account")}`,
    {
      headers: machineHeaders,
      redirect: "manual",
    },
  );
  const location = partnerGet.response.headers.get("location") || "";
  const partnerGetOk =
    [307, 308].includes(partnerGet.response.status) &&
    location.endsWith("/account");
  results.push({
    name: "partner auth GET redirect",
    ok: partnerGetOk,
    failure: partnerGetOk
      ? ""
      : `expected redirect to /account, got ${partnerGet.response.status}`,
    summary: `status ${partnerGet.response.status}`,
  });

  const webhookOne = await fetchJson("/api/webhooks/mdi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...machineHeaders,
    },
    body: JSON.stringify({
      data: {
        eventType: "case_assigned",
        voucherCode,
        patient: { id: patientId },
        case: {
          id: caseId,
          phase: "case_assigned",
          provider: { name: "Dr. Payload Variant" },
        },
        consultation: {
          status: "active",
        },
      },
    }),
  });
  const webhookOneOk = webhookOne.response.ok && webhookOne.json?.ok === true;
  results.push({
    name: "webhook voucher fallback nested payload",
    ok: webhookOneOk,
    failure: webhookOneOk
      ? ""
      : `expected voucher fallback webhook success, got ${webhookOne.response.status}`,
    summary: `status ${webhookOne.response.status}`,
  });

  const webhookTwo = await fetchJson("/api/webhooks/mdi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...machineHeaders,
    },
    body: JSON.stringify({
      data: {
        type: "prescription_submitted",
        voucher_code: voucherCode,
        patient_id: patientId,
        case: {
          id: caseId,
        },
        encounterId,
        prescriptions: [
          { medication: "Enclomiphene", quantity: 30, refill: 1 },
        ],
      },
    }),
  });
  const webhookTwoOk = webhookTwo.response.ok && webhookTwo.json?.ok === true;
  results.push({
    name: "webhook mixed snake/camel payload",
    ok: webhookTwoOk,
    failure: webhookTwoOk
      ? ""
      : `expected mixed payload webhook success, got ${webhookTwo.response.status}`,
    summary: `status ${webhookTwo.response.status}`,
  });

  const visits = await fetchJson("/api/user/visits", {}, sessionCookie);
  const visitsOk =
    visits.response.ok &&
    Array.isArray(visits.json) &&
    visits.json.some((visit) => visit.mdiCaseId === caseId);
  results.push({
    name: "user visits reflect variant payloads",
    ok: visitsOk,
    failure: visitsOk
      ? ""
      : `expected visit history for case ${caseId}, got ${visits.response.status}`,
    summary: `${Array.isArray(visits.json) ? visits.json.length : 0} visits`,
  });

  const messages = await fetchJson("/api/user/messages", {}, sessionCookie);
  const messagesOk =
    messages.response.ok &&
    Array.isArray(messages.json) &&
    messages.json.length > baselineMessageCount &&
    messages.json.some((message) => message.body?.includes(caseId));
  results.push({
    name: "user messages reflect variant payloads",
    ok: messagesOk,
    failure: messagesOk
      ? ""
      : `expected case-specific patient messages, got ${messages.response.status}`,
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
  const webhookCount = await prisma.mdiWebhookEvent.count({
    where: { orderId: order.id, mdiCaseId: caseId },
  });

  const dbProjectionOk =
    refreshedUser?.mdiPatientId === patientId &&
    refreshedOrder?.mdiVoucherCode === voucherCode &&
    refreshedOrder?.mdiEncounterId === encounterId &&
    caseSnapshot?.providerName === "Dr. Payload Variant" &&
    Array.isArray(caseSnapshot?.prescriptions);
  results.push({
    name: "database projection after variant flow",
    ok: dbProjectionOk,
    failure: dbProjectionOk
      ? ""
      : "expected user/order/case snapshot projection from variant payloads",
    summary: `events ${webhookCount} / tag ${refreshedOrder?.mdiOrderTag || "none"}`,
  });

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const report = buildMarkdownReport({
    generatedAt,
    results,
    orderId: order.id,
    caseId,
  });
  const jsonPath = path.join(
    OUTPUT_DIR,
    `mdi-payload-runtime-${timestamp}.json`,
  );
  const markdownPath = path.join(
    OUTPUT_DIR,
    `mdi-payload-runtime-${timestamp}.md`,
  );
  const latestPath = path.join(OUTPUT_DIR, "mdi-payload-runtime-latest.md");

  await fs.writeFile(
    jsonPath,
    `${JSON.stringify({ generatedAt, baseUrl: BASE_URL, orderId: order.id, caseId, results }, null, 2)}\n`,
  );
  await fs.writeFile(markdownPath, report);
  await fs.writeFile(latestPath, report);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: BASE_URL,
        orderId: order.id,
        caseId,
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
