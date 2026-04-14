import { prisma } from "@/lib/prisma";
import { isUuidLike } from "@/lib/mdi-shared";
import { buildFulfillmentProjection } from "@/lib/order-workflow";

const DEFAULT_MDI_BASE_URL = "https://api.mdintegrations.com";

function asTrimmedString(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function firstNonEmpty(...values) {
  for (const value of values) {
    const normalized = asTrimmedString(value);
    if (normalized) return normalized;
  }
  return null;
}

function asPositiveInteger(value) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    const parsed = Number.parseInt(value.trim(), 10);
    if (Number.isSafeInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
}

function firstPositiveInteger(...values) {
  for (const value of values) {
    const normalized = asPositiveInteger(value);
    if (normalized) return normalized;
  }
  return null;
}

function safeJsonParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function asDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function asNonEmptyJson(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value : null;
  }

  if (value && typeof value === "object") {
    return Object.keys(value).length > 0 ? value : null;
  }

  return null;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function flattenVoucherEntries(value) {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => flattenVoucherEntries(entry));
  }

  if (value && typeof value === "object") {
    const looksLikeVoucher = Boolean(
      value.onboarding_url ||
      value.onboardingUrl ||
      value.voucher_id ||
      value.voucherId ||
      value.patient_id ||
      value.patientId ||
      value.case_id ||
      value.caseId ||
      value.encounter_id ||
      value.encounterId ||
      value.status ||
      value.tag,
    );

    if (looksLikeVoucher) {
      return [value];
    }

    return Object.values(value).flatMap((entry) =>
      flattenVoucherEntries(entry),
    );
  }

  return [];
}

function getFirstVoucherEntry(payload = {}) {
  const candidates = [
    payload?.vouchers,
    payload?.voucher_data,
    payload?.voucherData,
    payload?.data,
    payload?.raw?.vouchers,
    payload?.raw?.voucher_data,
    payload?.raw?.voucherData,
    payload?.raw?.data,
  ];

  for (const candidate of candidates) {
    const entries = flattenVoucherEntries(candidate);
    if (entries.length > 0) {
      return entries[0];
    }
  }

  return null;
}

function shouldForceFullscreen(url) {
  const normalized = asTrimmedString(url);
  if (!normalized) return false;

  return !/onboarding|intake/i.test(normalized);
}

function splitName(name) {
  const trimmed = asTrimmedString(name) || "";
  if (!trimmed) {
    return { firstName: "Patient", lastName: "User" };
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "User" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function normalizeEventName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

export function normalizeEnvUrl(value) {
  if (!value) return "";
  return String(value)
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

export function hasDirectWebhookPath(url) {
  try {
    const parsed = new URL(url);
    return !!parsed.pathname && parsed.pathname !== "/";
  } catch {
    return false;
  }
}

export function ensureMdiFullscreenUrl(url) {
  if (!shouldForceFullscreen(url)) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("fullscreen")) {
      parsed.searchParams.set("fullscreen", "true");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export async function searchMdiPatients({
  search,
  accessToken,
  baseUrl = getMdiConfig().baseUrl,
  isSandbox = false,
}) {
  const normalizedSearch = asTrimmedString(search);
  if (!normalizedSearch || !accessToken) {
    return [];
  }

  const response = await fetch(`${baseUrl}/v1/partner/patients/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      search: normalizedSearch,
      ...(isSandbox ? { is_sandbox: true } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to search MD patients (${response.status}): ${errorText}`,
    );
  }

  const data = await response.json().catch(() => null);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.patients)) return data.patients;
  return [];
}

export async function findMdiPatientByEmail({
  email,
  accessToken,
  baseUrl = getMdiConfig().baseUrl,
  isSandbox = false,
}) {
  const results = await searchMdiPatients({
    search: email,
    accessToken,
    baseUrl,
    isSandbox,
  });

  const ranked = results
    .map((entry) => ({
      patientId: firstNonEmpty(entry?.patient_id, entry?.patientId, entry?.id),
      updatedAt: asDate(
        entry?.updated_at ||
          entry?.updatedAt ||
          entry?.created_at ||
          entry?.createdAt,
      ),
    }))
    .filter((entry) => isUuidLike(entry.patientId))
    .sort((left, right) => {
      const leftTime = left.updatedAt?.getTime?.() || 0;
      const rightTime = right.updatedAt?.getTime?.() || 0;
      return rightTime - leftTime;
    });

  return ranked[0]?.patientId || null;
}

function formatMdiDateOfBirth(value, { isSandbox = false } = {}) {
  const parsed = asDate(value);
  if (parsed) {
    return parsed.toISOString().slice(0, 10);
  }

  return isSandbox ? "1990-01-01" : null;
}

function formatMdiPhoneNumber(value, { isSandbox = false } = {}) {
  const digits = String(value || "").replace(/\D+/g, "");
  const normalized =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (normalized.length === 10) {
    return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
  }

  return isSandbox ? "(555) 555-5555" : null;
}

function deriveMdiGenderCode(order) {
  const haystack = [
    order.user?.name,
    ...order.items.flatMap((item) => [
      item.name,
      item.product?.name,
      item.product?.slug,
      item.variant?.name,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    /sildenafil|tadalafil|viagra|cialis|enclomiphene|anastrozole/.test(haystack)
  ) {
    return 1;
  }

  return 0;
}

function deriveMdiPatientPayload(order, { isSandbox = false } = {}) {
  const derivedName =
    order.user?.name ||
    (order.user?.email
      ? order.user.email.split("@")[0].replace(/[._-]+/g, " ")
      : "");
  const { firstName, lastName } = splitName(derivedName);
  const address = order.address || {};
  const phoneNumber = formatMdiPhoneNumber(order.user?.phone, { isSandbox });
  const dateOfBirth = formatMdiDateOfBirth(order.user?.dateOfBirth, {
    isSandbox,
  });

  if (!phoneNumber || !dateOfBirth) {
    return null;
  }

  const streetAddress =
    asTrimmedString(address.line1) || (isSandbox ? "123 Main St" : null);
  const cityName =
    asTrimmedString(address.city) || (isSandbox ? "New York" : null);
  const stateName = asTrimmedString(address.state) || (isSandbox ? "NY" : null);
  const zipCode = asTrimmedString(address.zip) || (isSandbox ? "10001" : null);

  if (!streetAddress || !cityName || !stateName || !zipCode) {
    return null;
  }

  return {
    prefix: "Mx",
    first_name: firstName,
    last_name: lastName,
    gender: deriveMdiGenderCode(order),
    date_of_birth: dateOfBirth,
    phone_number: phoneNumber,
    phone_type: 2,
    metadata: `healsend-user:${order.userId}`,
    email: order.user?.email || "",
    address: {
      address: streetAddress,
      address2: asTrimmedString(address.line2),
      zip_code: zipCode,
      city_name: cityName,
      state_name: stateName,
    },
    is_sms_enabled: true,
    is_email_enabled: true,
    woocommerce_customer_id: firstPositiveInteger(
      order.user?.mdiPartnerCustomerId,
    )
      ? String(order.user.mdiPartnerCustomerId)
      : null,
    metafields: [
      {
        key: "healsend_user_id",
        title: "HealSend User ID",
        value: String(order.userId),
        type: "string",
      },
      {
        key: "healsend_order_id",
        title: "HealSend Order ID",
        value: String(order.id),
        type: "string",
      },
    ],
  };
}

function extractMdiPatientId(payload) {
  return firstNonEmpty(
    payload?.patient_id,
    payload?.patientId,
    payload?.id,
    payload?.data?.patient_id,
    payload?.data?.patientId,
    payload?.data?.id,
    payload?.patient?.id,
  );
}

export async function createMdiPatient({
  order,
  accessToken,
  baseUrl = getMdiConfig().baseUrl,
  isSandbox = false,
}) {
  const payload = deriveMdiPatientPayload(order, { isSandbox });
  if (!payload) {
    throw new Error("Missing required patient fields for MD patient creation");
  }

  const response = await fetch(`${baseUrl}/v1/partner/patients`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  const responsePayload = safeJsonParse(responseText) || { raw: responseText };

  if (!response.ok) {
    throw new Error(
      `Failed to create MD patient (${response.status}): ${responseText}`,
    );
  }

  const patientId = extractMdiPatientId(responsePayload);
  if (!isUuidLike(patientId)) {
    throw new Error("MD patient creation response missing patient id");
  }

  return {
    patientId,
    payload: responsePayload,
  };
}

export async function listMdiPartnerOfferings({
  accessToken,
  baseUrl = getMdiConfig().baseUrl,
}) {
  const response = await fetch(`${baseUrl}/v1/partner/offerings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const responseText = await response.text();
  const payload = safeJsonParse(responseText) || [];

  if (!response.ok) {
    throw new Error(
      `Failed to list MD offerings (${response.status}): ${responseText}`,
    );
  }

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export async function listMdiPartnerQuestionnaires({
  accessToken,
  baseUrl = getMdiConfig().baseUrl,
}) {
  const response = await fetch(`${baseUrl}/v1/partner/questionnaires`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const responseText = await response.text();
  const payload = safeJsonParse(responseText) || [];

  if (!response.ok) {
    throw new Error(
      `Failed to list MD questionnaires (${response.status}): ${responseText}`,
    );
  }

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function detectDeliveryForm(haystack) {
  if (/\bpatch(?:es)?\b/.test(haystack)) return "patch";
  if (/\bnasal\b/.test(haystack) && !/\binjection\b/.test(haystack))
    return "nasal";
  if (/\bnasal\b/.test(haystack) && /\binjection\b/.test(haystack))
    return "nasal_injection";
  if (/\bdrop[s]?\b/.test(haystack)) return "drops";
  if (/\btablet[s]?\b|\bcapsule[s]?\b/.test(haystack)) return "oral";
  if (/\binjection[s]?\b/.test(haystack)) return "injection";
  return null;
}

function getPrimaryOrderCatalogProfile(order) {
  const items = order.items.map((item) => {
    const meta = resolveHealsendMetaForItem(item);
    return {
      item,
      meta,
      haystack: [
        item.name,
        item.product?.name,
        item.product?.slug,
        item.variant?.name,
        meta.medication,
        meta.planSlug,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
      desiredDays: meta.durationMonths ? meta.durationMonths * 30 : null,
    };
  });

  const primary = items.find(
    (entry) => entry.meta.medication || entry.meta.planSlug,
  ) ||
    items[0] || {
      haystack: "",
      meta: {},
      desiredDays: null,
    };

  const haystack = items.map((entry) => entry.haystack).join(" ");
  const desiredDays =
    primary.desiredDays ||
    items.find((entry) => entry.desiredDays)?.desiredDays ||
    null;

  const isGlp1 = /semaglutide|tirzepatide|\bglp.?1\b|weight.?loss/.test(
    haystack,
  );

  // GLP-1 medications can only be prescribed a maximum of 90 days at a time
  // regardless of the subscription duration.
  const glp1MaxDays = 90;
  const effectiveDesiredDays =
    isGlp1 && desiredDays !== null && desiredDays > glp1MaxDays
      ? glp1MaxDays
      : desiredDays;

  const deliveryForm = detectDeliveryForm(haystack);

  const profile = {
    haystack,
    desiredDays: effectiveDesiredDays,
    deliveryForm,
    isInitial: !/refill/.test(haystack),
    keywords: [],
    preferredQuestionnaireTerms: [],
    avoidedTerms: [],
  };

  if (/nad/.test(haystack)) {
    profile.keywords.push("nad");
    profile.preferredQuestionnaireTerms.push("nad");
    if (/patch/.test(haystack)) {
      // NAD patches: neither nasal nor injection delivery — no sub-type preference
    } else if (/nasal/.test(haystack) && !/injection/.test(haystack)) {
      profile.keywords.push("nasal");
      profile.preferredQuestionnaireTerms.push("nasal");
      profile.avoidedTerms.push("injection");
    } else {
      profile.keywords.push("injection");
      profile.preferredQuestionnaireTerms.push("injection");
      // Only avoid nasal if there is truly no nasal component
      if (!/nasal/.test(haystack)) profile.avoidedTerms.push("nasal");
    }
    // NAD combo products may include glutathione
    if (/glutathione/.test(haystack)) {
      profile.keywords.push("glutathione");
    }
  } else if (/glutathione/.test(haystack)) {
    profile.keywords.push("glutathione");
    profile.preferredQuestionnaireTerms.push("glutathione", "injection");
  } else if (/sermorelin/.test(haystack)) {
    profile.keywords.push("sermorelin");
    profile.preferredQuestionnaireTerms.push("sermorelin");
    // Combo: Sermorelin + Enclomiphene
    if (/enclomiphene/.test(haystack)) {
      profile.keywords.push("enclomiphene");
      profile.preferredQuestionnaireTerms.push("enclomiphene");
    }
  } else if (/enclomiphene/.test(haystack)) {
    profile.keywords.push("enclomiphene");
    profile.preferredQuestionnaireTerms.push("enclomiphene");
  } else if (/pt-141|bremelanotide/.test(haystack)) {
    profile.keywords.push("pt-141", "bremelanotide");
    profile.preferredQuestionnaireTerms.push("pt-141");
    // Combo: PT-141 + Oxytocin
    if (/oxytocin/.test(haystack)) {
      profile.keywords.push("oxytocin");
    }
  } else if (/oxytocin/.test(haystack)) {
    profile.keywords.push("oxytocin");
    profile.preferredQuestionnaireTerms.push("oxytocin");
  } else if (
    /sildenafil|viagra|tadalafil|cialis|erectile|performance/.test(haystack)
  ) {
    profile.keywords.push("sildenafil", "erectile", "performance");
    profile.preferredQuestionnaireTerms.push(
      "erectile dysfunction",
      "performance anxiety",
    );
  } else if (/tirzepatide/.test(haystack)) {
    profile.keywords.push("tirzepatide");
    profile.preferredQuestionnaireTerms.push("tirzepatide");
    // Delivery-form variants for tirzepatide
    if (/\bdrop[s]?\b/.test(haystack)) {
      profile.keywords.push("drop", "sublingual");
    } else if (/\btablet[s]?\b/.test(haystack)) {
      profile.keywords.push("tablet", "oral");
    }
  } else if (/semaglutide/.test(haystack)) {
    profile.keywords.push("semaglutide");
    profile.preferredQuestionnaireTerms.push("semaglutide");
    // Delivery-form variants for semaglutide
    if (/\bdrop[s]?\b/.test(haystack)) {
      profile.keywords.push("drop", "sublingual");
    } else if (/\btablet[s]?\b/.test(haystack)) {
      profile.keywords.push("tablet", "oral");
    }
  } else if (/mic|lipotropic|b12/.test(haystack)) {
    profile.keywords.push("mic", "b12");
    profile.preferredQuestionnaireTerms.push("mic", "b-12");
  } else if (/\bglp.?1\b|weight.?loss/.test(haystack)) {
    // Generic GLP-1 / weight-loss product — no specific drug name detected yet.
    // Score towards any weight-loss or GLP-1 questionnaire so selection succeeds.
    profile.keywords.push("glp-1", "weight");
    profile.preferredQuestionnaireTerms.push(
      "weight loss",
      "glp-1",
      "semaglutide",
      "tirzepatide",
    );
  }

  return profile;
}

function scoreMdiQuestionnaire(questionnaire, profile) {
  const title =
    asTrimmedString(
      questionnaire?.name || questionnaire?.title || questionnaire?.intro_title,
    )?.toLowerCase() || "";
  let score = 0;

  for (const keyword of profile.keywords) {
    if (title.includes(keyword)) score += 25;
  }

  for (const term of profile.preferredQuestionnaireTerms) {
    if (title.includes(term)) score += 35;
  }

  for (const term of profile.avoidedTerms) {
    if (title.includes(term)) score -= 20;
  }

  // Delivery-form alignment
  if (profile.deliveryForm) {
    if (
      (profile.deliveryForm === "injection" ||
        profile.deliveryForm === "nasal_injection") &&
      /injection/.test(title) &&
      !profile.avoidedTerms.includes("injection")
    ) {
      score += 10;
    }
    if (
      (profile.deliveryForm === "nasal" ||
        profile.deliveryForm === "nasal_injection") &&
      /nasal/.test(title) &&
      !profile.avoidedTerms.includes("nasal")
    ) {
      score += 10;
    }
    if (profile.deliveryForm === "drops" && /drop|sublingual/.test(title)) {
      score += 10;
    }
    if (profile.deliveryForm === "oral" && /tablet|capsule|oral/.test(title)) {
      score += 10;
    }
    if (profile.deliveryForm === "patch" && /patch/.test(title)) {
      score += 10;
    }
    // Penalise strongly mismatched delivery form
    if (
      profile.deliveryForm === "injection" &&
      /nasal/.test(title) &&
      !profile.keywords.includes("nasal")
    ) {
      score -= 12;
    }
    if (
      profile.deliveryForm === "nasal" &&
      /injection/.test(title) &&
      !profile.keywords.includes("injection")
    ) {
      score -= 12;
    }
  }

  if (profile.isInitial) {
    if (/initial|new[\s/]initial|new patient/.test(title)) score += 15;
    if (/refill/.test(title)) score -= 10;
  } else if (/refill/.test(title)) {
    score += 15;
  }

  // Duration matching — reward exact tier match, penalise wrong duration
  if (profile.desiredDays >= 180) {
    if (/180[\s-]?d|6[\s-]*m(onth)?s?\b|6mo\b/.test(title)) score += 14;
    if (/90[\s-]?d|3[\s-]*m(onth)?s?\b|3mo\b/.test(title)) score -= 6;
    if (/\bmonthly\b|30[\s-]?d|1[\s-]*m(onth)?\b|1mo\b/.test(title)) score -= 8;
  } else if (profile.desiredDays >= 90) {
    if (/90[\s-]?d|3[\s-]*m(onth)?s?\b|3mo\b/.test(title)) score += 14;
    if (/\bmonthly\b/.test(title)) score -= 4;
    if (/180[\s-]?d|6[\s-]*m(onth)?s?\b/.test(title)) score -= 6;
  } else if (profile.desiredDays) {
    if (
      /\bmonthly\b|month[\s-]*1\b|30[\s-]?d|1[\s-]*m(onth)?\b|1mo\b/.test(title)
    )
      score += 8;
    if (/90[\s-]?d|3[\s-]*m(onth)?s?\b|3mo\b/.test(title)) score -= 6;
    if (/180[\s-]?d|6[\s-]*m(onth)?s?\b/.test(title)) score -= 8;
  }

  return score;
}

function scoreMdiOffering(offering, profile) {
  const title = [
    offering?.title,
    offering?.product?.name,
    offering?.product?.title,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  let score = 0;

  for (const keyword of profile.keywords) {
    if (title.includes(keyword)) score += 20;
  }

  for (const term of profile.avoidedTerms) {
    if (title.includes(term)) score -= 15;
  }

  // Delivery-form alignment for offerings
  if (profile.deliveryForm) {
    if (
      (profile.deliveryForm === "injection" ||
        profile.deliveryForm === "nasal_injection") &&
      /injection/.test(title) &&
      !profile.avoidedTerms.includes("injection")
    ) {
      score += 8;
    }
    if (
      (profile.deliveryForm === "nasal" ||
        profile.deliveryForm === "nasal_injection") &&
      /nasal/.test(title) &&
      !profile.avoidedTerms.includes("nasal")
    ) {
      score += 8;
    }
    if (profile.deliveryForm === "drops" && /drop|sublingual/.test(title)) {
      score += 8;
    }
    if (profile.deliveryForm === "oral" && /tablet|capsule|oral/.test(title)) {
      score += 8;
    }
  }

  const daysSupply = Number(
    offering?.product?.days_supply || offering?.days_supply || 0,
  );
  if (profile.desiredDays && daysSupply) {
    if (daysSupply === profile.desiredDays) {
      score += 20;
    } else if (Math.abs(daysSupply - profile.desiredDays) <= 5) {
      score += 15;
    } else if (profile.desiredDays >= 90 && daysSupply >= 90) {
      score += 6;
    }
  }

  return score;
}

export function resolveMdiCatalogSelection(
  order,
  { offerings = [], questionnaires = [] },
) {
  const profile = getPrimaryOrderCatalogProfile(order);
  const rankedQuestionnaire = questionnaires
    .map((entry) => ({
      entry,
      score: scoreMdiQuestionnaire(entry, profile),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)[0]?.entry;

  const rankedOffering = offerings
    .map((entry) => ({
      entry,
      score: scoreMdiOffering(entry, profile),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)[0]?.entry;

  return {
    questionnaire: rankedQuestionnaire || null,
    offering: rankedOffering || null,
  };
}

/**
 * Check if any order item has an explicit MDI questionnaire ID override stored
 * on its product attributes or subscription tier. Tier-level override takes
 * precedence over product-level override, enabling per-duration questionnaire
 * routing (e.g. a 3-month semaglutide tier can point at a 90-day questionnaire).
 */
function extractProductQuestionnaireOverride(order) {
  for (const item of asArray(order?.items)) {
    const durationMonths = extractDurationMonths(item);
    const tiers = Array.isArray(item.product?.subscriptionTiers)
      ? item.product.subscriptionTiers
      : [];
    const matchedTier = durationMonths
      ? tiers.find((t) => Number(t?.duration_months) === durationMonths)
      : null;

    // Tier-level override (priority)
    const tierQid = firstNonEmpty(
      matchedTier?.mdi_questionnaire_id,
      matchedTier?.mdiQuestionnaireId,
    );
    if (isUuidLike(tierQid)) return tierQid;

    // Product-level override (fallback)
    const attrs = asObject(item.product?.attributes);
    const productQid = firstNonEmpty(
      attrs.mdiQuestionnaireId,
      attrs.mdi_questionnaire_id,
    );
    if (isUuidLike(productQid)) return productQid;
  }
  return null;
}

function formatMdiExpiryDate(days = 30) {
  const target = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const yyyy = target.getUTCFullYear();
  const mm = String(target.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(target.getUTCDate()).padStart(2, "0");
  const hh = String(target.getUTCHours()).padStart(2, "0");
  const mi = String(target.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

export async function createMdiVoucher({
  patientId,
  questionnaireId,
  offering,
  order,
  accessToken,
  baseUrl = getMdiConfig().baseUrl,
}) {
  if (!isUuidLike(patientId)) {
    throw new Error("MD voucher creation requires a valid patient id");
  }
  if (!isUuidLike(questionnaireId)) {
    throw new Error("MD voucher creation requires a valid questionnaire id");
  }

  const body = {
    demo: false,
    hold_status: false,
    expires_at: formatMdiExpiryDate(),
    patient_id: patientId,
    questionnaire_id: questionnaireId,
    metadata: `healsend-order:${order.id}`,
    ...(offering?.id
      ? {
          offerings: [
            {
              id: offering.id,
              product:
                offering?.product?.pharmacy_id ||
                offering?.product?.force_pharmacy !== undefined
                  ? {
                      pharmacy_id: offering?.product?.pharmacy_id || null,
                      force_pharmacy: Boolean(
                        offering?.product?.force_pharmacy,
                      ),
                    }
                  : undefined,
            },
          ],
        }
      : {}),
  };

  const response = await fetch(`${baseUrl}/v1/partner/vouchers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Version: "2",
    },
    body: JSON.stringify(body),
  });

  const responseText = await response.text();
  const responsePayload = safeJsonParse(responseText) || { raw: responseText };

  if (!response.ok) {
    throw new Error(
      `Failed to create MD voucher (${response.status}): ${responseText}`,
    );
  }

  return responsePayload;
}

export async function getMdiPatientVouchers({
  patientId,
  accessToken,
  baseUrl = getMdiConfig().baseUrl,
}) {
  if (!isUuidLike(patientId)) {
    return [];
  }

  const response = await fetch(
    `${baseUrl}/v1/partner/patients/${encodeURIComponent(patientId)}/vouchers`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  const responseText = await response.text();
  const payload = safeJsonParse(responseText) || [];

  if (!response.ok) {
    throw new Error(
      `Failed to fetch MD patient vouchers (${response.status}): ${responseText}`,
    );
  }

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.vouchers)) return payload.vouchers;
  return [];
}

export async function createDirectMdiIntakeForOrder(
  orderInput,
  { accessToken, baseUrl = getMdiConfig().baseUrl, isSandbox = false } = {},
) {
  const order =
    typeof orderInput === "string"
      ? await loadOrderForMdi(orderInput)
      : orderInput;

  if (!order || !accessToken) {
    return null;
  }

  let patientId = isUuidLike(order.user?.mdiPatientId)
    ? order.user.mdiPatientId
    : null;

  if (!patientId && order.user?.email) {
    patientId = await findMdiPatientByEmail({
      email: order.user.email,
      accessToken,
      baseUrl,
      isSandbox,
    });
  }

  let patientPayload = null;
  if (!patientId) {
    const createdPatient = await createMdiPatient({
      order,
      accessToken,
      baseUrl,
      isSandbox,
    });
    patientId = createdPatient.patientId;
    patientPayload = createdPatient.payload;
  }

  if (!isUuidLike(patientId)) {
    return null;
  }

  // Check for explicit questionnaire ID stored on the product or subscription tier
  const overrideQuestionnaireId = extractProductQuestionnaireOverride(order);

  const [offerings, questionnaires] = await Promise.all([
    listMdiPartnerOfferings({ accessToken, baseUrl }),
    listMdiPartnerQuestionnaires({ accessToken, baseUrl }),
  ]);
  const selection = resolveMdiCatalogSelection(order, {
    offerings,
    questionnaires,
  });
  const questionnaireId = isUuidLike(overrideQuestionnaireId)
    ? overrideQuestionnaireId
    : firstNonEmpty(
        selection.questionnaire?.partner_questionnaire_id,
        selection.questionnaire?.id,
      );

  if (!isUuidLike(questionnaireId)) {
    return {
      patientId,
      patientPayload,
      questionnaire: selection.questionnaire || null,
      offering: selection.offering || null,
      payload: null,
      normalized: normalizeMdiPayload({
        patient_id: patientId,
        consultation_status: "pending",
      }),
    };
  }

  const voucherPayload = await createMdiVoucher({
    patientId,
    questionnaireId,
    offering: selection.offering,
    order,
    accessToken,
    baseUrl,
  });

  let normalized = normalizeMdiPayload(voucherPayload);
  if (!normalized.consultationUrl) {
    const vouchers = await getMdiPatientVouchers({
      patientId,
      accessToken,
      baseUrl,
    });
    if (vouchers.length > 0) {
      normalized = normalizeMdiPayload({ vouchers });
    }
  }

  normalized = normalizeMdiPayload({
    ...(voucherPayload && typeof voucherPayload === "object"
      ? voucherPayload
      : {}),
    patient_id: normalized.patientId || patientId,
    consultation_url: normalized.consultationUrl,
    consultation_status:
      normalized.consultationStatus ||
      (normalized.consultationUrl ? "pending" : "pending"),
    workflow_phase:
      normalized.workflowPhase ||
      (normalized.consultationUrl ? "intake_pending" : "submitted"),
  });

  return {
    patientId,
    questionnaire: selection.questionnaire || null,
    offering: selection.offering || null,
    patientPayload,
    payload: voucherPayload,
    normalized,
  };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function hydrateMdiPatientForOrder(
  orderInput,
  { accessToken, baseUrl = getMdiConfig().baseUrl, isSandbox = false } = {},
) {
  const order =
    typeof orderInput === "string"
      ? await loadOrderForMdi(orderInput)
      : orderInput;

  if (!order || !accessToken) {
    return order;
  }

  if (isUuidLike(order.user?.mdiPatientId) || !order.user?.email) {
    return order;
  }

  let patientId = null;
  try {
    patientId = await findMdiPatientByEmail({
      email: order.user.email,
      accessToken,
      baseUrl,
      isSandbox,
    });
  } catch (error) {
    console.warn(
      "Unable to hydrate MD patient by email before order submit:",
      error,
    );
    return order;
  }

  if (!isUuidLike(patientId)) {
    return order;
  }

  await prisma.user.update({
    where: { id: order.userId },
    data: {
      mdiPatientId: patientId,
      mdiLastSyncedAt: new Date(),
    },
  });

  return {
    ...order,
    user: {
      ...order.user,
      mdiPatientId: patientId,
      mdiLastSyncedAt: new Date(),
    },
  };
}

export function isLocalDevFallbackEnabled() {
  const explicit = process.env.MD_LOCAL_DEV_FALLBACK;
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export function getLocalFallbackConsultationUrl(requestOrigin, orderId) {
  const configuredIframeUrl = normalizeEnvUrl(
    process.env.MD_LOCAL_IFRAME_URL || process.env.MD_IFRAME_URL,
  );
  if (configuredIframeUrl) {
    return ensureMdiFullscreenUrl(configuredIframeUrl);
  }
  return `${requestOrigin}/consultation/local-dev?orderId=${encodeURIComponent(orderId)}`;
}

export function getMdiConfig() {
  const webhookUrl = normalizeEnvUrl(process.env.MD_WEBHOOK_URL);

  return {
    baseUrl:
      normalizeEnvUrl(process.env.MD_API_BASE_URL) || DEFAULT_MDI_BASE_URL,
    webhookUrl,
    webhookIsDirectEndpoint: !!webhookUrl && hasDirectWebhookPath(webhookUrl),
    clientId: asTrimmedString(process.env.MD_CLIENT_ID),
    clientSecret: asTrimmedString(process.env.MD_CLIENT_SECRET),
    webhookSecret: asTrimmedString(process.env.MD_WEBHOOK_SECRET),
    defaultPatientId: firstNonEmpty(
      process.env.MD_PATIENT_ID,
      process.env.MD_DEFAULT_PATIENT_ID,
    ),
    localDevFallback: isLocalDevFallbackEnabled(),
  };
}

export function isAuthorizedMdiRequest(requestHeaders = {}) {
  const headers = Object.fromEntries(
    Object.entries(requestHeaders).map(([key, value]) => [
      String(key).toLowerCase(),
      value,
    ]),
  );
  const config = getMdiConfig();
  const clientIdHdr = headers["x-client-id"];
  const clientSecretHdr = headers["x-client-secret"];
  const webhookSecretHdr = headers["x-webhook-secret"];

  return (
    (clientIdHdr &&
      clientSecretHdr &&
      clientIdHdr === config.clientId &&
      clientSecretHdr === config.clientSecret) ||
    (webhookSecretHdr &&
      config.webhookSecret &&
      webhookSecretHdr === config.webhookSecret)
  );
}

export async function getMdiAccessToken({
  baseUrl = getMdiConfig().baseUrl,
  clientId,
  clientSecret,
}) {
  if (!clientId || !clientSecret) {
    throw new Error("Missing MD client credentials");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  let tokenResponse;
  try {
    tokenResponse = await fetch(`${baseUrl}/v1/partner/auth/token`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "*",
      }),
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(
      `Failed to issue MD access token (${tokenResponse.status}): ${errorText}`,
    );
  }

  const tokenData = await tokenResponse.json();
  if (!tokenData?.access_token) {
    throw new Error("MD access token response missing access_token");
  }

  return tokenData.access_token;
}

export async function getMdiMessagingAuth({
  accessToken,
  patientId,
  caseId,
  baseUrl = getMdiConfig().baseUrl,
}) {
  if (!isUuidLike(patientId)) {
    throw new Error("MD patient auth requires a valid UUID patient id");
  }

  const params = new URLSearchParams({ full: "true", fullscreen: "true" });
  if (caseId) params.set("case_id", caseId);

  const authResponse = await fetch(
    `${baseUrl}/v1/partner/patients/${encodeURIComponent(patientId)}/auth?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  if (!authResponse.ok) {
    const errorText = await authResponse.text();
    throw new Error(
      `Failed to get MD messaging URL (${authResponse.status}): ${errorText}`,
    );
  }

  const authData = await authResponse.json();
  const consultationUrl =
    authData.auth_link || authData.url || authData.messaging_url || null;

  if (!consultationUrl) {
    throw new Error("MD messaging response missing auth link URL");
  }

  return {
    consultationUrl: ensureMdiFullscreenUrl(consultationUrl),
    verificationCode: authData.verification_code || null,
    caseId: authData.case_id || caseId || null,
    payload: authData,
  };
}

export async function getMdiCustomerAuth({
  accessToken,
  customerId,
  baseUrl = getMdiConfig().baseUrl,
}) {
  if (!customerId) {
    throw new Error("MD customer auth requires a customer id");
  }

  const authResponse = await fetch(
    `${baseUrl}/woocommerce/customers/${encodeURIComponent(customerId)}/auth`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  if (!authResponse.ok) {
    const errorText = await authResponse.text();
    throw new Error(
      `Failed to get MD customer auth (${authResponse.status}): ${errorText}`,
    );
  }

  const authData = await authResponse.json();
  const consultationUrl =
    authData.app_auth_link ||
    authData.auth_link ||
    authData.url ||
    authData.messaging_url ||
    null;

  if (!consultationUrl) {
    throw new Error("MD customer auth response missing auth link URL");
  }

  return {
    consultationUrl: ensureMdiFullscreenUrl(consultationUrl),
    verificationCode: authData.verification_code || null,
    caseId: authData.case_id || null,
    payload: authData,
  };
}

export function normalizeMdiPayload(payload = {}) {
  const root =
    payload?.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
      ? payload.data
      : payload;
  const patient = root?.patient || root?.customer || {};
  const casePayload = root?.case || {};
  const orderPayload = root?.order || {};
  const consultation = root?.consultation || {};
  const baseData = root?.base_data || root?.baseData || {};
  const voucher = getFirstVoucherEntry(payload);

  return {
    eventType: firstNonEmpty(
      payload?.event_type,
      payload?.eventType,
      payload?.type,
      root?.event_type,
      root?.eventType,
      root?.type,
      "mdi.event",
    ),
    responseId: firstNonEmpty(root?.id),
    internalOrderId: firstNonEmpty(
      root?.order_internal_id,
      root?.order_internalId,
      root?.internal_order_id,
      root?.internalOrderId,
      orderPayload?.internal_id,
      orderPayload?.internalId,
    ),
    partnerOrderId: firstPositiveInteger(
      root?.order_id,
      root?.orderId,
      orderPayload?.id,
      orderPayload?.order_id,
      orderPayload?.orderId,
      baseData?.id,
      voucher?.order_id,
      voucher?.orderId,
    ),
    orderNumber: firstNonEmpty(
      root?.order_number,
      root?.orderNumber,
      orderPayload?.number,
      orderPayload?.order_number,
      orderPayload?.orderNumber,
      baseData?.number,
      baseData?.order_number,
      baseData?.orderNumber,
    ),
    mdiOrderId: firstNonEmpty(
      root?.mdi_order_id,
      root?.mdiOrderId,
      root?.external_order_id,
      root?.externalOrderId,
      root?.order_external_id,
      root?.orderExternalId,
      orderPayload?.external_id,
      orderPayload?.externalId,
    ),
    partnerCustomerId: firstPositiveInteger(
      root?.customer_id,
      root?.customerId,
      patient?.customer_id,
      patient?.customerId,
      orderPayload?.customer_id,
      orderPayload?.customerId,
      baseData?.customer_id,
      baseData?.customerId,
      voucher?.customer_id,
      voucher?.customerId,
    ),
    patientId: firstNonEmpty(
      root?.patient_id,
      root?.patientId,
      root?.mdi_patient_id,
      root?.mdiPatientId,
      patient?.id,
      voucher?.patient_id,
      voucher?.patientId,
      voucher?.patient?.id,
    ),
    patientStatus: firstNonEmpty(
      root?.patient_status,
      root?.patientStatus,
      patient?.status,
    ),
    caseId: firstNonEmpty(
      root?.case_id,
      root?.caseId,
      casePayload?.id,
      voucher?.case_id,
      voucher?.caseId,
    ),
    encounterId: firstNonEmpty(
      root?.encounter_id,
      root?.encounterId,
      root?.visit_id,
      root?.visitId,
      casePayload?.encounter_id,
      casePayload?.encounterId,
      voucher?.encounter_id,
      voucher?.encounterId,
    ),
    consultationId: firstNonEmpty(
      root?.consultation_id,
      root?.consultationId,
      consultation?.id,
    ),
    consultationUrl: firstNonEmpty(
      root?.consultation_url,
      root?.consultationUrl,
      root?.auth_link,
      root?.messaging_url,
      root?.url,
      consultation?.url,
      consultation?.auth_link,
      consultation?.messaging_url,
      voucher?.onboarding_url,
      voucher?.onboardingUrl,
    ),
    consultationStatus: firstNonEmpty(
      root?.consultation_status,
      root?.consultationStatus,
      consultation?.status,
      voucher?.status,
      voucher?.used ? "completed" : null,
      voucher?.onboarding_url || voucher?.onboardingUrl ? "pending" : null,
    ),
    orderStatus: firstNonEmpty(
      root?.order_status,
      root?.orderStatus,
      orderPayload?.status,
    ),
    orderTag: firstNonEmpty(
      root?.order_tag,
      root?.orderTag,
      root?.tag,
      voucher?.tag,
      voucher?.status,
    ),
    voucherCode: firstNonEmpty(
      root?.voucher_code,
      root?.voucherCode,
      root?.voucher,
      voucher?.voucher_code,
      voucher?.voucherCode,
      voucher?.voucher_id,
      voucher?.voucherId,
      voucher?.id,
    ),
    workflowPhase: firstNonEmpty(
      root?.workflow_phase,
      root?.workflowPhase,
      root?.phase,
      casePayload?.phase,
      voucher?.phase,
      voucher?.onboarding_url || voucher?.onboardingUrl
        ? "intake_pending"
        : null,
    ),
    verificationCode: firstNonEmpty(
      root?.verification_code,
      root?.verificationCode,
    ),
    raw: root,
  };
}

export function getMdiWebhookDeliveryId(headers = {}, payload = {}) {
  return firstNonEmpty(
    headers["x-webhook-id"],
    headers["x-event-id"],
    headers["x-delivery-id"],
    payload?.delivery_id,
    payload?.deliveryId,
    payload?.event_id,
    payload?.eventId,
  );
}

export function buildOrderMdiUpdate(
  payload,
  {
    fromWebhook = false,
    touchConsultationRefresh = false,
    fallbackConsultationId = false,
  } = {},
) {
  const normalized = payload?.raw ? payload : normalizeMdiPayload(payload);
  const data = {};

  if (normalized.partnerOrderId)
    data.mdiPartnerOrderId = normalized.partnerOrderId;
  if (normalized.mdiOrderId) data.mdiOrderId = normalized.mdiOrderId;
  if (normalized.caseId) data.mdiCaseId = normalized.caseId;
  if (normalized.encounterId) data.mdiEncounterId = normalized.encounterId;
  if (normalized.orderTag) data.mdiOrderTag = normalized.orderTag;
  if (normalized.orderStatus) data.mdiOrderStatus = normalized.orderStatus;
  if (normalized.voucherCode) data.mdiVoucherCode = normalized.voucherCode;
  if (normalized.workflowPhase)
    data.mdiWorkflowPhase = normalized.workflowPhase;
  if (fromWebhook) data.mdiLastWebhookAt = new Date();
  if (touchConsultationRefresh) {
    data.mdiConsultationRefreshedAt = new Date();
  }

  const consultationId = fallbackConsultationId
    ? firstNonEmpty(
        normalized.consultationId,
        normalized.patientId,
        normalized.caseId,
        normalized.responseId,
      )
    : firstNonEmpty(normalized.consultationId);

  if (consultationId) data.consultationId = consultationId;
  if (normalized.consultationUrl) {
    data.consultationUrl = shouldForceFullscreen(normalized.consultationUrl)
      ? ensureMdiFullscreenUrl(normalized.consultationUrl)
      : normalized.consultationUrl;
  }

  const consultationStatus = firstNonEmpty(
    normalized.consultationStatus,
    normalized.orderStatus,
    normalized.workflowPhase,
  );
  if (consultationStatus) {
    data.consultationStatus = consultationStatus;
  }

  return data;
}

export function buildUserMdiUpdate(payload, { touch = true } = {}) {
  const normalized = payload?.raw ? payload : normalizeMdiPayload(payload);
  const data = {};

  if (normalized.partnerCustomerId) {
    data.mdiPartnerCustomerId = normalized.partnerCustomerId;
  }
  if (normalized.patientId) data.mdiPatientId = normalized.patientId;
  if (normalized.patientStatus)
    data.mdiPatientStatus = normalized.patientStatus;
  if ((normalized.patientId || normalized.patientStatus) && touch) {
    data.mdiLastSyncedAt = new Date();
  }

  return data;
}

export function buildMdiCaseSnapshotUpsert(
  payload,
  { order = null, userId = null } = {},
) {
  const normalized = payload?.raw ? payload : normalizeMdiPayload(payload);
  const root = normalized.raw || {};
  const casePayload = root.case || {};
  const consultation = root.consultation || {};
  const provider =
    root.provider ||
    casePayload.provider ||
    root.clinician ||
    root.doctor ||
    {};
  const caseId = firstNonEmpty(
    normalized.caseId,
    root.case_reference,
    root.caseReference,
  );

  if (!caseId) {
    return null;
  }

  const snapshot = {
    orderId: order?.id || null,
    userId: userId || order?.userId || null,
    mdiOrderId: normalized.mdiOrderId,
    mdiPatientId: normalized.patientId,
    encounterId: normalized.encounterId,
    consultationId: firstNonEmpty(normalized.consultationId, consultation?.id),
    consultationUrl: firstNonEmpty(
      normalized.consultationUrl,
      consultation?.url,
      consultation?.auth_link,
    ),
    status: firstNonEmpty(
      casePayload?.status,
      root.case_status,
      root.caseStatus,
      normalized.consultationStatus,
      normalized.orderStatus,
    ),
    phase: firstNonEmpty(
      normalized.workflowPhase,
      casePayload?.phase,
      root.phase,
    ),
    providerId: firstNonEmpty(provider?.id, root.provider_id, root.providerId),
    providerName: firstNonEmpty(
      provider?.name,
      provider?.full_name,
      provider?.fullName,
      provider?.display_name,
      provider?.displayName,
      root.provider_name,
      root.providerName,
    ),
    offerings: asNonEmptyJson(
      root.offerings || casePayload.offerings || root.offering,
    ),
    prescriptions: asNonEmptyJson(
      root.prescriptions || casePayload.prescriptions || root.prescription,
    ),
    latestEventType: normalized.eventType,
    latestEventAt:
      asDate(
        root.occurred_at ||
          root.occurredAt ||
          root.timestamp ||
          root.created_at ||
          root.createdAt ||
          root.updated_at ||
          root.updatedAt,
      ) || new Date(),
    notes: firstNonEmpty(
      root.notes,
      root.note,
      root.summary,
      casePayload.notes,
      casePayload.summary,
    ),
    rawSnapshot: root,
  };

  return {
    where: { mdiCaseId: caseId },
    update: snapshot,
    create: {
      mdiCaseId: caseId,
      ...snapshot,
    },
  };
}

export async function upsertMdiCaseSnapshot(
  tx,
  payload,
  { order = null, userId = null } = {},
) {
  const upsert = buildMdiCaseSnapshotUpsert(payload, { order, userId });
  if (!upsert) {
    return null;
  }

  const existing = await tx.mdiCaseSnapshot.findUnique({
    where: { mdiCaseId: upsert.where.mdiCaseId },
  });

  if (existing) {
    const mergedUpdate = {
      ...upsert.update,
      orderId: upsert.update.orderId || existing.orderId,
      userId: upsert.update.userId || existing.userId,
      mdiOrderId: upsert.update.mdiOrderId || existing.mdiOrderId,
      mdiPatientId: upsert.update.mdiPatientId || existing.mdiPatientId,
      encounterId: upsert.update.encounterId || existing.encounterId,
      consultationId: upsert.update.consultationId || existing.consultationId,
      consultationUrl:
        upsert.update.consultationUrl || existing.consultationUrl,
      status: upsert.update.status || existing.status,
      phase: upsert.update.phase || existing.phase,
      providerId: upsert.update.providerId || existing.providerId,
      providerName: upsert.update.providerName || existing.providerName,
      offerings: upsert.update.offerings ?? existing.offerings,
      prescriptions: upsert.update.prescriptions ?? existing.prescriptions,
      notes: upsert.update.notes || existing.notes,
    };

    return tx.mdiCaseSnapshot.update({
      where: upsert.where,
      data: mergedUpdate,
    });
  }

  return tx.mdiCaseSnapshot.create({
    data: upsert.create,
  });
}

export async function upsertMdiPatientMessageSync(tx, payload, userId) {
  if (!userId) {
    return null;
  }

  const normalized = payload?.raw ? payload : normalizeMdiPayload(payload);

  return tx.mdiPatientMessageSync.upsert({
    where: { userId },
    update: {
      mdiPatientId: normalized.patientId,
      lastSyncedAt: new Date(),
      rawState: normalized.raw,
    },
    create: {
      userId,
      mdiPatientId: normalized.patientId,
      lastSyncedAt: new Date(),
      rawState: normalized.raw,
    },
  });
}

export async function loadOrderForMdi(orderId) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      address: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          dateOfBirth: true,
          mdiPartnerCustomerId: true,
          mdiPatientId: true,
          mdiPatientStatus: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              wcId: true,
              name: true,
              slug: true,
              sku: true,
              regularPrice: true,
              salePrice: true,
              subscriptionTiers: true,
              attributes: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              salePrice: true,
              attributes: true,
            },
          },
        },
      },
    },
  });
}

export async function ensureMdiPartnerIdentifiers(orderInput) {
  const orderId =
    typeof orderInput === "string"
      ? asTrimmedString(orderInput)
      : asTrimmedString(orderInput?.id);

  if (!orderId) return null;

  let order =
    typeof orderInput === "object" && orderInput?.id
      ? orderInput
      : await loadOrderForMdi(orderId);

  if (!order) {
    return null;
  }

  if (order.mdiPartnerOrderId && order.user?.mdiPartnerCustomerId) {
    return order;
  }

  await prisma.$transaction(async (tx) => {
    if (!order.user?.mdiPartnerCustomerId) {
      await tx.$executeRaw`
        UPDATE "User"
        SET "mdiPartnerCustomerId" = DEFAULT
        WHERE "id" = ${order.userId}
          AND "mdiPartnerCustomerId" IS NULL
      `;
    }

    if (!order.mdiPartnerOrderId) {
      await tx.$executeRaw`
        UPDATE "Order"
        SET "mdiPartnerOrderId" = DEFAULT
        WHERE "id" = ${order.id}
          AND "mdiPartnerOrderId" IS NULL
      `;
    }
  });

  return loadOrderForMdi(order.id);
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function extractDurationMonths(item) {
  const variantAttributes = asObject(item.variant?.attributes);
  const candidates = [
    variantAttributes.duration_months,
    variantAttributes.durationMonths,
    variantAttributes.plan_duration_months,
    variantAttributes.planDurationMonths,
    variantAttributes.duration,
    variantAttributes.months,
  ];

  for (const candidate of candidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
  }

  const name = `${item.variant?.name || ""} ${item.name || ""}`;
  const match = name.match(/(\d+)\s*month/i);
  if (match) {
    const numeric = Number(match[1]);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
  }

  // Extract duration from plan ID stored in order item metadata (e.g. "glp1-3mo", "sema-6mo")
  const planId = asTrimmedString(
    item.metadata?.selectedPlanId || item.metadata?.planId,
  );
  if (planId) {
    const planMatch = planId.match(/(\d+)mo\b/i);
    if (planMatch) {
      const numeric = Number(planMatch[1]);
      if (Number.isFinite(numeric) && numeric > 0) {
        return numeric;
      }
    }
  }

  return null;
}

function getLegacyProductId(product) {
  const attributes = asObject(product?.attributes);
  return firstNonEmpty(
    product?.wcId,
    attributes.legacyWcId,
    attributes.wcId,
    attributes.sourceId,
  );
}

function normalizeWooStatus(value, fallback = "processing") {
  const normalized = asTrimmedString(value);
  return normalized ? normalized.toLowerCase() : fallback;
}

function resolveTierForItem(item) {
  const durationMonths = extractDurationMonths(item);
  const tiers = Array.isArray(item.product?.subscriptionTiers)
    ? item.product.subscriptionTiers
    : [];
  const matchedTier = durationMonths
    ? tiers.find((tier) => Number(tier?.duration_months) === durationMonths)
    : null;

  return {
    durationMonths,
    tier: matchedTier || null,
  };
}

function normalizePlanSlugCandidate(value) {
  const normalized = asTrimmedString(value);
  if (!normalized) return null;

  return normalized
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function stripPlanSuffix(value) {
  const normalized = asTrimmedString(value);
  if (!normalized) return null;

  return normalized
    .replace(/\s*[–-]\s*\d+\s*-\s*month(?:\s*plan|\s*\(refill\))?$/i, "")
    .replace(/\s*[–-]\s*monthly(?:\s*plan|\s*\(refill\))?$/i, "")
    .replace(/\s+[–-]\s+monthly$/i, "")
    .trim();
}

function getProductTaxonomySlugs(productAttributes) {
  const taxonomies = Array.isArray(productAttributes?.taxonomies)
    ? productAttributes.taxonomies
    : [];

  return taxonomies
    .map((entry) => normalizePlanSlugCandidate(entry?.slug || entry?.name))
    .filter(Boolean);
}

function deriveHealsendPlanSlug({
  itemName,
  productName,
  productSlug,
  taxonomySlugs,
}) {
  const identity = `${itemName || ""} ${productName || ""} ${productSlug || ""}`
    .toLowerCase()
    .trim();

  if (
    identity.includes("semaglutide") ||
    identity.includes("tirzepatide") ||
    taxonomySlugs.includes("weight_loss") ||
    taxonomySlugs.includes("glp_1")
  ) {
    return "glp_1_prefunnel";
  }

  if (identity.includes("pt-141") || identity.includes("pt_141")) {
    return "pt_141";
  }

  if (identity.includes("oxytocin")) {
    return "oxytocin";
  }

  if (
    identity.includes("nad") ||
    identity.includes("sermorelin") ||
    taxonomySlugs.includes("nad_therapy") ||
    taxonomySlugs.includes("nadglutathione")
  ) {
    return "metabolic";
  }

  return null;
}

function resolveHealsendMetaForItem(item) {
  const productAttributes = asObject(item.product?.attributes);
  const variantAttributes = asObject(item.variant?.attributes);
  const { durationMonths, tier } = resolveTierForItem(item);
  const taxonomySlugs = getProductTaxonomySlugs(productAttributes);

  const medication = firstNonEmpty(
    tier?.healsend_medication,
    tier?.medication,
    tier?.medication_name,
    variantAttributes.healsend_medication,
    variantAttributes.medication,
    variantAttributes.medication_name,
    productAttributes.healsend_medication,
    productAttributes.medication,
    productAttributes.medication_name,
    stripPlanSuffix(item.product?.name),
    stripPlanSuffix(item.name),
  );

  const planSlug = normalizePlanSlugCandidate(
    firstNonEmpty(
      tier?.healsend_plan_slug,
      tier?.plan_slug,
      tier?.planSlug,
      variantAttributes.healsend_plan_slug,
      variantAttributes.plan_slug,
      variantAttributes.planSlug,
      productAttributes.healsend_plan_slug,
      productAttributes.plan_slug,
      productAttributes.planSlug,
      deriveHealsendPlanSlug({
        itemName: item.name,
        productName: item.product?.name,
        productSlug: item.product?.slug,
        taxonomySlugs,
      }),
    ),
  );

  const planDurationLabel = durationMonths ? `${durationMonths} Month` : null;
  const supplyQty = durationMonths ? durationMonths * 24 : null;

  return {
    durationMonths,
    medication,
    planSlug,
    planDurationLabel,
    supplyQty,
    tier,
  };
}

export function buildMdiOrderPayload(order) {
  const { firstName, lastName } = splitName(order.user?.name);
  const patientId = isUuidLike(order.user?.mdiPatientId)
    ? order.user.mdiPatientId
    : null;
  const partnerCustomerId = firstPositiveInteger(
    order.user?.mdiPartnerCustomerId,
  );
  const partnerOrderId = firstPositiveInteger(order.mdiPartnerOrderId);
  const orderNumber = firstNonEmpty(order.orderNumber, String(partnerOrderId));
  const orderStatus = normalizeWooStatus(order.status);

  if (!partnerCustomerId || !partnerOrderId) {
    throw new Error(
      "MDI payload requires numeric partner customer and order ids",
    );
  }

  const itemPayload = order.items.map((item) => {
    const variantAttributes = asObject(item.variant?.attributes);
    const productAttributes = asObject(item.product?.attributes);
    const legacyProductId = getLegacyProductId(item.product);
    const {
      durationMonths,
      medication,
      planSlug,
      planDurationLabel,
      supplyQty,
      tier,
    } = resolveHealsendMetaForItem(item);
    const legacyVariationId = firstNonEmpty(
      variantAttributes.variation_id,
      variantAttributes.variationId,
      variantAttributes.wcVariationId,
      variantAttributes.legacyVariationId,
      tier?.variation_id,
      tier?.variationId,
    );
    const legacyItemId = firstNonEmpty(
      legacyVariationId,
      legacyProductId,
      item.variantId,
      item.productId,
      item.id,
    );
    const normalizedItemId = firstPositiveInteger(legacyItemId) || legacyItemId;
    const normalizedProductId =
      firstPositiveInteger(legacyProductId, item.product?.wcId) ||
      legacyProductId ||
      item.productId;
    const normalizedVariationId =
      firstPositiveInteger(legacyVariationId) || legacyVariationId;
    const unitPrice = Number(
      item.price ||
        item.variant?.price ||
        item.product?.salePrice ||
        item.product?.regularPrice ||
        0,
    );

    return {
      id: normalizedItemId,
      product_id: normalizedProductId,
      variation_id: normalizedVariationId,
      parent_id: normalizedProductId || null,
      sku: firstNonEmpty(item.variant?.sku, item.product?.sku),
      slug: item.product?.slug || null,
      type: item.variant ? "variation" : "simple",
      name: item.name,
      quantity: item.quantity,
      price: unitPrice,
      unit_price: unitPrice,
      regular_price: Number(
        tier?.then_price ??
          item.variant?.salePrice ??
          item.product?.regularPrice ??
          unitPrice,
      ),
      sale_price: Number(
        tier?.first_price ??
          item.variant?.price ??
          item.product?.salePrice ??
          unitPrice,
      ),
      duration_months: durationMonths,
      supply_qty: supplyQty,
      plan_duration: planDurationLabel,
      healsend_medication: medication,
      healsend_plan_slug: planSlug,
      subscription_tier: tier || null,
      metadata:
        asNonEmptyJson({
          ...(asObject(item.metadata) || {}),
          ...(planDurationLabel ? { plan_duration: planDurationLabel } : {}),
          ...(medication ? { _healsend_medication: medication } : {}),
          ...(planSlug ? { _healsend_plan_slug: planSlug } : {}),
          ...(durationMonths ? { _healsend_duration: durationMonths } : {}),
          ...(supplyQty ? { _hld_supply_qty: supplyQty } : {}),
        }) || null,
      product_attributes: Object.keys(productAttributes).length
        ? productAttributes
        : null,
      variant_attributes: Object.keys(variantAttributes).length
        ? variantAttributes
        : null,
    };
  });
  const primaryHealsendItem = itemPayload.find(
    (item) => item.healsend_plan_slug || item.healsend_medication,
  );
  const orderItemsByLegacyId = Object.fromEntries(
    itemPayload.map((item) => [String(item.id), item]),
  );
  const addressMeta = order.address
    ? {
        _billing_address_1: [order.address.line1 || ""],
        _billing_address_2: [order.address.line2 || ""],
        _billing_city: [order.address.city || ""],
        _billing_state: [order.address.state || ""],
        _billing_postcode: [order.address.zip || ""],
        _billing_country: [order.address.country || "US"],
        _shipping_address_1: [order.address.line1 || ""],
        _shipping_address_2: [order.address.line2 || ""],
        _shipping_city: [order.address.city || ""],
        _shipping_state: [order.address.state || ""],
        _shipping_postcode: [order.address.zip || ""],
        _shipping_country: [order.address.country || "US"],
      }
    : {};

  return {
    order_id: partnerOrderId,
    order_number: orderNumber,
    order_internal_id: order.id,
    order_status: orderStatus,
    customer_id: partnerCustomerId,
    patient_id: patientId,
    first_name: firstName,
    last_name: lastName,
    email: order.user?.email || "",
    phone: order.user?.phone || "",
    totals: {
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
    },
    shipping_address: order.address
      ? {
          line1: order.address.line1,
          line2: order.address.line2,
          city: order.address.city,
          state: order.address.state,
          zip: order.address.zip,
          country: order.address.country,
        }
      : null,
    base_data: {
      id: partnerOrderId,
      number: orderNumber,
      status: orderStatus,
      total: order.total,
      subtotal: order.subtotal,
      shipping_total: order.shipping,
      total_tax: order.tax,
      discount_total: order.discount,
      customer_id: partnerCustomerId,
      date_created: order.createdAt,
      date_modified: order.updatedAt,
    },
    data: {
      id: partnerOrderId,
      number: orderNumber,
      status: orderStatus,
      customer_id: partnerCustomerId,
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: order.user?.email || "",
        phone: order.user?.phone || "",
      },
      shipping: order.address
        ? {
            first_name: firstName,
            last_name: lastName,
            address_1: order.address.line1,
            address_2: order.address.line2,
            city: order.address.city,
            state: order.address.state,
            postcode: order.address.zip,
            country: order.address.country,
          }
        : null,
      line_items: itemPayload,
      items: orderItemsByLegacyId,
    },
    products: itemPayload,
    items: orderItemsByLegacyId,
    order_meta: {
      user_id: order.userId,
      order_number: order.orderNumber,
      partner_customer_id: partnerCustomerId,
      partner_order_id: partnerOrderId,
      _customer_user: [String(partnerCustomerId)],
      _billing_first_name: [firstName],
      _billing_last_name: [lastName],
      _billing_email: [order.user?.email || ""],
      _billing_phone: [order.user?.phone || ""],
      _payment_method: [asTrimmedString(order.stripePaymentMethod) || "stripe"],
      _payment_method_title: ["Stripe"],
      ...(primaryHealsendItem?.duration_months
        ? { _healsend_duration: [String(primaryHealsendItem.duration_months)] }
        : {}),
      ...(primaryHealsendItem?.healsend_medication
        ? { _healsend_medication: [primaryHealsendItem.healsend_medication] }
        : {}),
      ...(primaryHealsendItem?.healsend_plan_slug
        ? { _healsend_plan_slug: [primaryHealsendItem.healsend_plan_slug] }
        : {}),
      ...(primaryHealsendItem?.supply_qty
        ? { _hld_supply_qty: [String(primaryHealsendItem.supply_qty)] }
        : {}),
      ...addressMeta,
      existing_mdi_order_id: order.mdiOrderId,
      existing_mdi_case_id: order.mdiCaseId,
      existing_mdi_patient_id: patientId,
    },
    metadata: {
      user_id: order.userId,
      stripe_payment_id: order.stripePaymentId,
      stripe_session_id: order.stripeSessionId,
      healsend_duration: primaryHealsendItem?.duration_months || null,
      healsend_medication: primaryHealsendItem?.healsend_medication || null,
      healsend_plan_slug: primaryHealsendItem?.healsend_plan_slug || null,
      hld_supply_qty: primaryHealsendItem?.supply_qty || null,
      existing_mdi_order_id: order.mdiOrderId,
      existing_mdi_case_id: order.mdiCaseId,
    },
  };
}

export async function submitOrderToMdi(orderId) {
  const config = getMdiConfig();

  if (!config.webhookIsDirectEndpoint) {
    return { ok: false, skipped: "not_configured" };
  }

  const order = await ensureMdiPartnerIdentifiers(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  if (order.telehealthProvider && order.telehealthProvider !== "MDI") {
    return {
      ok: false,
      skipped: "non_mdi_provider",
      telehealthProvider: order.telehealthProvider,
    };
  }

  if (
    order.mdiOrderId ||
    order.mdiCaseId ||
    order.consultationUrl ||
    (order.mdiSubmittedAt &&
      firstNonEmpty(order.consultationStatus)?.toLowerCase() === "completed")
  ) {
    return {
      ok: true,
      skipped: "already_submitted",
      orderId: order.id,
    };
  }

  const accessToken = await getMdiAccessToken({
    baseUrl: config.baseUrl,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  });
  const hydratedOrder =
    (await hydrateMdiPatientForOrder(order, {
      accessToken,
      baseUrl: config.baseUrl,
      isSandbox: process.env.MD_IS_SANDBOX === "true",
    })) || order;
  const payload = buildMdiOrderPayload(hydratedOrder);
  const response = await fetch(config.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Idempotency-Key": order.id,
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  const responsePayload = safeJsonParse(responseText) || { raw: responseText };

  if (!response.ok) {
    throw new Error(
      `MD order sync failed (${response.status}): ${responseText || "Unknown error"}`,
    );
  }

  let normalized = normalizeMdiPayload(responsePayload);
  let voucherLookup = null;
  if (
    !normalized.consultationUrl ||
    !normalized.patientId ||
    (!normalized.caseId && !normalized.encounterId)
  ) {
    voucherLookup = await waitForMdiOrderVouchers({
      accessToken,
      orderIdentifiers: [
        hydratedOrder.mdiPartnerOrderId,
        normalized.partnerOrderId,
        normalized.orderNumber,
        normalized.internalOrderId,
        normalized.mdiOrderId,
        hydratedOrder.orderNumber,
        hydratedOrder.id,
        hydratedOrder.mdiOrderId,
      ],
      baseUrl: config.baseUrl,
      attempts: 3,
      delayMs: 1200,
    });

    if (voucherLookup?.payload) {
      normalized = normalizeMdiPayload({
        ...(responsePayload && typeof responsePayload === "object"
          ? responsePayload
          : {}),
        vouchers: voucherLookup.payload,
      });
    }
  }

  if (
    !normalized.consultationUrl &&
    !normalized.patientId &&
    !normalized.caseId &&
    !normalized.encounterId &&
    !normalized.mdiOrderId
  ) {
    console.warn("MD order submit returned no actionable state", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      responseKeys:
        responsePayload && typeof responsePayload === "object"
          ? Object.keys(responsePayload)
          : [],
      dataLength: Array.isArray(responsePayload?.data)
        ? responsePayload.data.length
        : null,
      voucherLookupHit: Boolean(voucherLookup?.payload),
    });
  }

  // If the webhook path produced no consultation URL, create the MDI patient +
  // questionnaire voucher directly so the intake is ready before the user opens
  // the account dashboard (covers cases where the webhook response is empty).
  if (!normalized.consultationUrl) {
    try {
      const directIntake = await createDirectMdiIntakeForOrder(hydratedOrder, {
        accessToken,
        baseUrl: config.baseUrl,
        isSandbox: process.env.MD_IS_SANDBOX === "true",
      });
      if (directIntake?.normalized) {
        normalized = normalizeMdiPayload({
          ...(responsePayload && typeof responsePayload === "object"
            ? responsePayload
            : {}),
          patient_id: directIntake.normalized.patientId || normalized.patientId,
          consultation_url:
            directIntake.normalized.consultationUrl ||
            normalized.consultationUrl,
          consultation_status:
            directIntake.normalized.consultationStatus ||
            normalized.consultationStatus,
          workflow_phase:
            directIntake.normalized.workflowPhase || normalized.workflowPhase,
          voucher_code:
            directIntake.normalized.voucherCode || normalized.voucherCode,
          case_id: directIntake.normalized.caseId || normalized.caseId,
        });
      }
    } catch (directIntakeErr) {
      console.warn(
        "MD direct intake creation failed in submitOrderToMdi:",
        directIntakeErr,
      );
    }
  }

  const orderUpdate = buildOrderMdiUpdate(normalized);

  if (!orderUpdate.mdiOrderStatus) {
    orderUpdate.mdiOrderStatus = "submitted";
  }
  if (!orderUpdate.mdiWorkflowPhase) {
    orderUpdate.mdiWorkflowPhase = normalized.consultationUrl
      ? "intake_pending"
      : "submitted";
  }
  if (!orderUpdate.consultationStatus && normalized.consultationUrl) {
    orderUpdate.consultationStatus = "pending";
  }
  if (!orderUpdate.mdiOrderTag && normalized.consultationUrl) {
    orderUpdate.mdiOrderTag = "Pending";
  }
  orderUpdate.mdiSubmittedAt = order.mdiSubmittedAt || new Date();

  await prisma.$transaction(async (tx) => {
    const userUpdate = buildUserMdiUpdate(normalized);
    if (Object.keys(userUpdate).length > 0) {
      await tx.user.update({
        where: { id: order.userId },
        data: userUpdate,
      });
    }

    if (Object.keys(orderUpdate).length > 0) {
      const projectedOrder = await tx.order.update({
        where: { id: order.id },
        data: orderUpdate,
      });

      const { update: fulfillmentUpdate } =
        buildFulfillmentProjection(projectedOrder);
      if (Object.keys(fulfillmentUpdate).length > 0) {
        await tx.order.update({
          where: { id: order.id },
          data: fulfillmentUpdate,
        });
      }
    }

    await upsertMdiPatientMessageSync(tx, normalized, order.userId);
    await upsertMdiCaseSnapshot(tx, normalized, { order });
  });

  return {
    ok: true,
    payload,
    responsePayload,
    normalized,
  };
}

export async function getMdiOrderVouchers({
  accessToken,
  orderIdentifiers = [],
  baseUrl = getMdiConfig().baseUrl,
}) {
  const candidates = [
    ...new Set(
      orderIdentifiers.map((value) => asTrimmedString(value)).filter(Boolean),
    ),
  ];

  for (const candidate of candidates) {
    const response = await fetch(
      `${baseUrl}/woocommerce/orders/${encodeURIComponent(candidate)}/vouchers`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      continue;
    }

    const text = await response.text();
    const payload = safeJsonParse(text);
    if (!payload) {
      continue;
    }

    const normalized = normalizeMdiPayload({ vouchers: payload });
    const hasUsefulVoucherState = Boolean(
      normalized.consultationUrl ||
      normalized.patientId ||
      normalized.caseId ||
      normalized.encounterId ||
      normalized.voucherCode,
    );

    if (hasUsefulVoucherState) {
      return {
        orderIdentifier: candidate,
        payload,
        normalized,
      };
    }
  }

  return null;
}

export async function waitForMdiOrderVouchers({
  accessToken,
  orderIdentifiers = [],
  baseUrl = getMdiConfig().baseUrl,
  attempts = 1,
  delayMs = 0,
}) {
  const totalAttempts = Math.max(1, Number(attempts) || 1);

  for (let attempt = 0; attempt < totalAttempts; attempt += 1) {
    const result = await getMdiOrderVouchers({
      accessToken,
      orderIdentifiers,
      baseUrl,
    });

    if (result) {
      return result;
    }

    if (attempt < totalAttempts - 1 && delayMs > 0) {
      await wait(delayMs);
    }
  }

  return null;
}

export async function resolveOrderFromMdiPayload(payload) {
  const normalized = payload?.raw ? payload : normalizeMdiPayload(payload);
  let order = null;

  if (normalized.internalOrderId) {
    order = await prisma.order.findUnique({
      where: { id: normalized.internalOrderId },
    });
  }

  if (!order && normalized.orderNumber) {
    order = await prisma.order.findFirst({
      where: { orderNumber: normalized.orderNumber },
    });
  }

  if (!order && normalized.partnerOrderId) {
    order = await prisma.order.findFirst({
      where: { mdiPartnerOrderId: normalized.partnerOrderId },
    });
  }

  if (!order && normalized.mdiOrderId) {
    order = await prisma.order.findFirst({
      where: { mdiOrderId: normalized.mdiOrderId },
    });
  }

  if (!order && normalized.caseId) {
    order = await prisma.order.findFirst({
      where: { mdiCaseId: normalized.caseId },
    });
  }

  if (!order && normalized.voucherCode) {
    order = await prisma.order.findFirst({
      where: { mdiVoucherCode: normalized.voucherCode },
    });
  }

  if (!order && normalized.orderTag) {
    order = await prisma.order.findFirst({
      where: { mdiOrderTag: normalized.orderTag },
    });
  }

  if (!order && normalized.consultationId) {
    order = await prisma.order.findFirst({
      where: { consultationId: normalized.consultationId },
    });
  }

  if (!order && normalized.partnerCustomerId) {
    const user = await prisma.user.findFirst({
      where: { mdiPartnerCustomerId: normalized.partnerCustomerId },
      select: { id: true },
    });

    if (user) {
      order = await prisma.order.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  if (!order && normalized.patientId) {
    const user = await prisma.user.findFirst({
      where: { mdiPatientId: normalized.patientId },
      select: { id: true },
    });

    if (user) {
      order = await prisma.order.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  return { order, normalized };
}

export function buildMdiMessageSeed(
  normalizedPayload,
  order,
  caseSnapshot = null,
) {
  const normalized = normalizedPayload?.raw
    ? normalizedPayload
    : normalizeMdiPayload(normalizedPayload);
  const eventName = normalizeEventName(normalized.eventType);
  const caseId =
    caseSnapshot?.mdiCaseId || normalized.caseId || order?.mdiCaseId;
  const providerName = caseSnapshot?.providerName || null;

  const eventMap = {
    partner_auth_completed: {
      subject: "Medical access verified",
      body: "Your secure medical access has been verified and your consultation is ready to continue.",
    },
    patient_created: {
      subject: "Medical profile linked",
      body: "Your medical profile has been linked and your care team can now continue processing your order.",
    },
    patient_linked: {
      subject: "Medical profile linked",
      body: "Your medical profile has been linked and your care team can now continue processing your order.",
    },
    customer_linked: {
      subject: "Medical profile linked",
      body: "Your medical profile has been linked and your care team can now continue processing your order.",
    },
    case_created: {
      subject: "Case opened",
      body: `Your care case${caseId ? ` (${caseId})` : ""} has been opened and is waiting for provider review.`,
    },
    case_assigned: {
      subject: "Provider assigned",
      body: providerName
        ? `${providerName} has been assigned to your case.`
        : "A provider has been assigned to your case.",
    },
    case_updated: {
      subject: "Case updated",
      body: "Your care team updated your case details.",
    },
    consultation_created: {
      subject: "Consultation created",
      body: "Your consultation session is ready to continue in your account.",
    },
    consultation_ready: {
      subject: "Consultation ready",
      body: "Your consultation is ready. Open your account to continue your medical review.",
    },
    consultation_completed: {
      subject: "Consultation completed",
      body: "Your consultation was completed and your care team will continue the next step.",
    },
    encounter_created: {
      subject: "Visit recorded",
      body: "A visit record was created for your case.",
    },
    offering_added: {
      subject: "Treatment plan updated",
      body: "Your care team added a treatment offering to your case.",
    },
    offering_submitted: {
      subject: "Treatment plan submitted",
      body: "Your treatment plan was submitted for the next review step.",
    },
    prescription_added: {
      subject: "Prescription update",
      body: "A prescription was added to your case.",
    },
    prescription_submitted: {
      subject: "Prescription update",
      body: "A prescription update is available in your care history.",
    },
    case_cancelled: {
      subject: "Case updated",
      body: "Your case was cancelled. Contact support if you need help with next steps.",
    },
    case_closed: {
      subject: "Case closed",
      body: "Your case has been closed. You can still review your order and consultation history in your account.",
    },
  };

  const message = eventMap[eventName];
  if (!message || !order?.userId) {
    return null;
  }

  const body =
    caseId && !message.body.includes(caseId)
      ? `${message.body} Case: ${caseId}.`
      : message.body;

  return {
    userId: order.userId,
    subject: message.subject,
    body,
    fromAdmin: true,
    read: false,
  };
}

export async function resolveOrderFromRouteId(id) {
  const normalizedId = asTrimmedString(id);
  const numericId = asPositiveInteger(id);
  if (!normalizedId) return null;

  let order = await prisma.order.findUnique({
    where: { id: normalizedId },
  });

  if (!order) {
    order = await prisma.order.findFirst({
      where: { orderNumber: normalizedId },
    });
  }

  if (!order) {
    order = await prisma.order.findFirst({
      where: { mdiOrderId: normalizedId },
    });
  }

  if (!order) {
    order = await prisma.order.findFirst({
      where: { mdiCaseId: normalizedId },
    });
  }

  if (!order && numericId) {
    order = await prisma.order.findFirst({
      where: { mdiPartnerOrderId: numericId },
    });
  }

  return order;
}

export async function resolveUserFromRouteId(id) {
  const normalizedId = asTrimmedString(id);
  const numericId = asPositiveInteger(id);
  if (!normalizedId) return null;

  let user = await prisma.user.findUnique({
    where: { id: normalizedId },
  });

  if (!user) {
    user = await prisma.user.findFirst({
      where: { mdiPatientId: normalizedId },
    });
  }

  if (!user && numericId) {
    user = await prisma.user.findFirst({
      where: { mdiPartnerCustomerId: numericId },
    });
  }

  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: normalizedId },
    });
  }

  return user;
}

/**
 * Non-blocking: look up an MDI patient by email at signup time and persist the
 * patient ID if one already exists. Full patient creation happens later when an
 * order is placed (createDirectMdiIntakeForOrder). Any error is silently
 * discarded so it never blocks the signup response.
 */
export async function linkMdiPatientOnSignup(userId, email) {
  const { clientId, clientSecret } = getMdiConfig();
  if (!clientId || !clientSecret || !userId || !email) {
    return;
  }

  try {
    const accessToken = await getMdiAccessToken({ clientId, clientSecret });
    const patientId = await findMdiPatientByEmail({ email, accessToken });

    if (!isUuidLike(patientId)) {
      return;
    }

    await prisma.user.updateMany({
      where: { id: userId, mdiPatientId: null },
      data: { mdiPatientId: patientId, mdiLastSyncedAt: new Date() },
    });
  } catch {
    // Intentionally swallowed — never block signup.
  }
}
