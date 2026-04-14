/**
 * OLA Portal Telehealth integration client.
 *
 * API base: OLA_API_BASE_URL (default https://dev-api.ola-digital-int.com)
 * Auth:     POST /auth/tennant/login → JWT in X-Access-Token header
 */

let _cachedToken = null;
let _tokenExpiresAt = 0;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export function getOlaConfig() {
  return {
    baseUrl: (
      process.env.OLA_API_BASE_URL || "https://dev-api.ola-digital-int.com"
    ).replace(/\/+$/, ""),
    authToken: process.env.OLA_AUTH_TOKEN || "",
    secretToken: process.env.OLA_SECRET_TOKEN || "",
    serviceKey:
      process.env.OLA_SERVICE_KEY ||
      "healsend-inc-semaglutide-injection-subscription",
    sessionType: process.env.OLA_SESSION_TYPE || "Initial",
  };
}

/**
 * Async variant that merges DB-stored settings on top of the env-var defaults.
 * Use this in server-side API routes so admins can change OLA config without
 * a redeploy.
 */
export async function resolveOlaConfig() {
  const base = getOlaConfig();
  try {
    const { getAllSiteSettings } = await import("@/lib/site-settings");
    const db = await getAllSiteSettings();
    return {
      ...base,
      baseUrl: db["ola.baseUrl"]
        ? String(db["ola.baseUrl"]).replace(/\/+$/, "")
        : base.baseUrl,
      serviceKey: db["ola.serviceKey"]
        ? String(db["ola.serviceKey"])
        : base.serviceKey,
      sessionType: db["ola.sessionType"]
        ? String(db["ola.sessionType"])
        : base.sessionType,
    };
  } catch {
    return base;
  }
}

// ---------------------------------------------------------------------------
// Auth – Tenant Login
// ---------------------------------------------------------------------------

export async function getOlaAccessToken(config) {
  const cfg = config || getOlaConfig();

  // Reuse cached token if still valid (with 60s buffer)
  if (_cachedToken && Date.now() < _tokenExpiresAt - 60_000) {
    return _cachedToken;
  }

  const res = await fetch(`${cfg.baseUrl}/auth/tennant/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: cfg.authToken,
      secret_token: cfg.secretToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OLA tenant login failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const token = data.access_token || data.token || data.data?.access_token;
  if (!token) {
    throw new Error("OLA tenant login returned no access token");
  }

  _cachedToken = token;
  // Default to 55-minute cache if expiry not provided
  const expiresIn = data.expires_in || 3300;
  _tokenExpiresAt = Date.now() + expiresIn * 1000;

  return token;
}

export async function validateOlaToken(accessToken, config) {
  const cfg = config || getOlaConfig();
  const res = await fetch(`${cfg.baseUrl}/api-v2/validate-token`, {
    headers: { "X-Access-Token": accessToken },
  });
  return res.ok;
}

// ---------------------------------------------------------------------------
// Provider Schedules
// ---------------------------------------------------------------------------

export async function getOlaProviderSchedules(
  state,
  serviceId,
  { accessToken, config } = {},
) {
  const cfg = config || getOlaConfig();
  const token = accessToken || (await getOlaAccessToken(cfg));

  const res = await fetch(
    `${cfg.baseUrl}/api-v2/telehealth/schedules/get-provider-schedules/${encodeURIComponent(state)}/service/${encodeURIComponent(serviceId)}`,
    { headers: { "X-Access-Token": token } },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `OLA get-provider-schedules failed (${res.status}): ${text}`,
    );
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Create Appointment (new-schedule-request)
// ---------------------------------------------------------------------------

export async function createOlaAppointment(
  payload,
  { accessToken, config } = {},
) {
  const cfg = config || getOlaConfig();
  const token = accessToken || (await getOlaAccessToken(cfg));

  // Build multipart/form-data exactly as the OLA API expects
  const form = new FormData();

  const fields = {
    service_key: payload.serviceKey || cfg.serviceKey,
    session_type: payload.sessionType || cfg.sessionType,
    first_name: payload.firstName || "",
    last_name: payload.lastName || "",
    email: payload.email || "",
    phone: payload.phone || "",
    date_of_birth: payload.dateOfBirth || "",
    gender: payload.gender || "",
    state: payload.state || "",
    address: payload.address || "",
    city: payload.city || "",
    zip_code: payload.zipCode || "",
    provider_guid: payload.providerGuid || "",
    schedule_id: payload.scheduleId || "",
    ...(payload.allergies && { allergies: payload.allergies }),
    ...(payload.medications && { medications: payload.medications }),
    ...(payload.conditions && { conditions: payload.conditions }),
  };

  for (const [key, value] of Object.entries(fields)) {
    form.append(key, String(value));
  }

  // If photo IDs are provided as file paths or blobs
  if (payload.photoIdFront) form.append("photo_id_front", payload.photoIdFront);
  if (payload.photoIdBack) form.append("photo_id_back", payload.photoIdBack);
  if (payload.selfiePhoto) form.append("selfie_photo", payload.selfiePhoto);

  const res = await fetch(
    `${cfg.baseUrl}/api-v2/telehealth/service/new-schedule-request`,
    {
      method: "POST",
      headers: { "X-Access-Token": token },
      body: form,
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OLA new-schedule-request failed (${res.status}): ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Order Details
// ---------------------------------------------------------------------------

export async function getOlaOrderDetails(
  orderGuid,
  { accessToken, config } = {},
) {
  const cfg = config || getOlaConfig();
  const token = accessToken || (await getOlaAccessToken(cfg));

  const res = await fetch(
    `${cfg.baseUrl}/api-v2/telehealth/service/orders/${encodeURIComponent(orderGuid)}`,
    { headers: { "X-Access-Token": token } },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OLA get order details failed (${res.status}): ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Service Details
// ---------------------------------------------------------------------------

export async function getOlaServiceDetails(
  orderGuid,
  { accessToken, config } = {},
) {
  const cfg = config || getOlaConfig();
  const token = accessToken || (await getOlaAccessToken(cfg));

  const res = await fetch(
    `${cfg.baseUrl}/api-v2/telehealth/service/get-service-details/${encodeURIComponent(orderGuid)}`,
    { headers: { "X-Access-Token": token } },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OLA get-service-details failed (${res.status}): ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Patient Profile Update
// ---------------------------------------------------------------------------

export async function updateOlaPatientProfile(
  userUuid,
  profileData,
  { accessToken, config } = {},
) {
  const cfg = config || getOlaConfig();
  const token = accessToken || (await getOlaAccessToken(cfg));

  const res = await fetch(
    `${cfg.baseUrl}/api-v2/telehealth/user/update-profile/${encodeURIComponent(userUuid)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token,
      },
      body: JSON.stringify(profileData),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OLA update-profile failed (${res.status}): ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Pharmacy Search (DoseSpot)
// ---------------------------------------------------------------------------

export async function searchOlaPharmacy(query, { accessToken, config } = {}) {
  const cfg = config || getOlaConfig();
  const token = accessToken || (await getOlaAccessToken(cfg));

  const params = new URLSearchParams();
  if (query.name) params.set("name", query.name);
  if (query.city) params.set("city", query.city);
  if (query.state) params.set("state", query.state);
  if (query.zipCode) params.set("zip_code", query.zipCode);

  const res = await fetch(
    `${cfg.baseUrl}/api-v2/telehealth/search-pharmacy-dosepot?${params}`,
    { headers: { "X-Access-Token": token } },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OLA pharmacy search failed (${res.status}): ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Save Transaction
// ---------------------------------------------------------------------------

export async function saveOlaTransaction(
  orderGuid,
  transactionData,
  { accessToken, config } = {},
) {
  const cfg = config || getOlaConfig();
  const token = accessToken || (await getOlaAccessToken(cfg));

  const res = await fetch(
    `${cfg.baseUrl}/api-v2/telehealth/service/save-transaction/${encodeURIComponent(orderGuid)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token,
      },
      body: JSON.stringify(transactionData),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OLA save-transaction failed (${res.status}): ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// High-level: Submit order to OLA
// ---------------------------------------------------------------------------

export async function submitOrderToOla(order, user) {
  const cfg = getOlaConfig();
  const token = await getOlaAccessToken(cfg);

  const formattedDob = (() => {
    const value = user.dateOfBirth;
    if (!value) return "";
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value === "string") {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
      }
      return value;
    }
    return String(value);
  })();

  // Determine service key from product or default
  const product = order.items?.[0]?.product || order.orderItems?.[0]?.product;
  const serviceKey = product?.olaServiceKey || cfg.serviceKey;

  const result = await createOlaAppointment(
    {
      serviceKey,
      sessionType: cfg.sessionType,
      firstName: user.firstName || user.name?.split(" ")[0] || "",
      lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      email: user.email,
      phone: user.phone || "",
      dateOfBirth: formattedDob,
      gender: user.gender || "",
      state: order.address?.state || "",
      address: order.address?.line1 || "",
      city: order.address?.city || "",
      zipCode: order.address?.zip || "",
    },
    { accessToken: token, config: cfg },
  );

  const orderGuid = result.data?.order_guid || result.order_guid || null;
  const userGuid = result.data?.user_uuid || result.user_uuid || null;
  const redirectUrl = result.data?.redirect_url || result.redirect_url || null;
  const status = result.data?.status || result.status || "submitted";

  return {
    olaOrderGuid: orderGuid,
    olaUserGuid: userGuid,
    olaStatus: status,
    olaRedirectUrl: redirectUrl,
    olaLastSyncAt: new Date(),
    raw: result,
  };
}
