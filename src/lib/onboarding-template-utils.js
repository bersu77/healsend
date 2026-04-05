import {
  formatUsdCompact,
  getProductPriceSummary,
  getProductSubscriptionPlans,
} from "@/lib/pricing";

const LEGACY_HEALTH_STEP_TITLE = "tell us about your health";

export function isLegacyHealthHistoryStep(step) {
  const title = String(step?.title || "")
    .trim()
    .toLowerCase();

  return title === LEGACY_HEALTH_STEP_TITLE;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatJsonForEditor(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return "";
  }

  return JSON.stringify(value, null, 2);
}

function parseJsonArrayInput(rawValue, label, { strict = true } = {}) {
  if (typeof rawValue !== "string" || !rawValue.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      throw new Error();
    }
    return parsed;
  } catch {
    if (!strict) {
      return null;
    }
    throw new Error(`${label} must be valid JSON array data.`);
  }
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeProductDescription(product) {
  const description = normalizeText(
    product?.shortDescription || product?.description || "",
  );

  if (!description) {
    return "";
  }

  if (description.length <= 120) {
    return description;
  }

  return `${description.slice(0, 117).trimEnd()}...`;
}

function findMatchingProductForMedication(medication, products) {
  if (!medication || !Array.isArray(products)) {
    return null;
  }

  const candidates = [
    medication.productId,
    medication.id,
    slugify(medication.id),
    slugify(medication.name),
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return (
    products.find(
      (product) =>
        candidates.includes(String(product.id || "").trim()) ||
        candidates.includes(String(product.slug || "").trim()) ||
        normalizeText(product.name).toLowerCase() ===
          normalizeText(medication.name).toLowerCase(),
    ) || null
  );
}

function buildMedicationOptionFromProduct(product, existingMedication = null) {
  const priceSummary = getProductPriceSummary(product);
  const derivedPrice = priceSummary
    ? formatUsdCompact(priceSummary.firstMonthPrice)
    : null;

  return {
    id:
      String(existingMedication?.id || "").trim() ||
      String(product.slug || "").trim() ||
      String(product.id || "").trim(),
    productId: product.id,
    icon: existingMedication?.icon || "medication",
    name: normalizeText(existingMedication?.name || product.name),
    badge: normalizeText(existingMedication?.badge || ""),
    price: normalizeText(existingMedication?.price || derivedPrice || ""),
    badgeClass: normalizeText(existingMedication?.badgeClass || ""),
    description:
      normalizeText(existingMedication?.description || "") ||
      summarizeProductDescription(product),
  };
}

function normalizeMedicationConfig(config, products = [], context = {}) {
  const existingMedications = Array.isArray(config?.medications)
    ? config.medications.filter(Boolean)
    : [];
  const existingProductIds = Array.isArray(config?.productIds)
    ? config.productIds.map((id) => String(id || "").trim()).filter(Boolean)
    : [];
  const derivedProductIds = existingMedications
    .map((medication) => findMatchingProductForMedication(medication, products)?.id)
    .filter(Boolean);
  const productIds = [...new Set([...existingProductIds, ...derivedProductIds])];
  const filterCategoryId = String(config?.filterCategoryId || "").trim();

  const selectedProducts =
    productIds.length > 0
      ? products.filter((product) => productIds.includes(product.id))
      : filterCategoryId
        ? products.filter((product) => product.categoryId === filterCategoryId)
        : context.defaultProductId
          ? products.filter((product) => product.id === context.defaultProductId)
        : [];

  let medications = selectedProducts.map((product) => {
    const existingMedication =
      existingMedications.find(
        (medication) =>
          String(medication?.productId || "").trim() === product.id ||
          String(medication?.id || "").trim() === String(product.slug || "").trim() ||
          normalizeText(medication?.name).toLowerCase() ===
            normalizeText(product.name).toLowerCase(),
      ) || null;

    return buildMedicationOptionFromProduct(product, existingMedication);
  });

  if (medications.length === 0) {
    medications = existingMedications.map((medication) => ({
      ...medication,
      id: normalizeText(medication?.id),
      productId: normalizeText(medication?.productId),
      icon: normalizeText(medication?.icon) || "medication",
      name: normalizeText(medication?.name),
      badge: normalizeText(medication?.badge),
      price: normalizeText(medication?.price),
      badgeClass: normalizeText(medication?.badgeClass),
      description: normalizeText(medication?.description),
    }));
  }

  return {
    ...config,
    filterCategoryId,
    productIds,
    medications: medications.filter(
      (medication) => medication.id && medication.name,
    ),
  };
}

function buildPlansFromProduct(product) {
  return getProductSubscriptionPlans(product).map((plan) => ({
    id: plan.pricingKey,
    name: plan.name,
    firstMonth: formatUsdCompact(plan.firstMonthPrice),
    thenPrice: formatUsdCompact(plan.thenPrice),
    featured: plan.isRecommended || plan.isDefault,
    badge: plan.badges?.[0]?.text || "",
    features: plan.bulletPoints || [],
  }));
}

function normalizePlanConfig(
  config,
  products = [],
  context = {},
  { strict = true } = {},
) {
  const parsedPlans = parseJsonArrayInput(config?.plansJson, "Plans", {
    strict,
  });
  let plans = Array.isArray(parsedPlans)
    ? parsedPlans
    : Array.isArray(config?.plans)
      ? config.plans
      : [];

  if (plans.length === 0 && context.defaultProductId) {
    const product =
      products.find((entry) => entry.id === context.defaultProductId) || null;
    if (product) {
      plans = buildPlansFromProduct(product);
    }
  }

  return {
    ...config,
    plans,
    plansJson: formatJsonForEditor(plans),
  };
}

function normalizeCustomFormConfig(config, { strict = true } = {}) {
  const parsedFields = parseJsonArrayInput(
    config?.fieldsJson,
    "Custom form fields",
    { strict },
  );
  const fields = Array.isArray(parsedFields)
    ? parsedFields
    : Array.isArray(config?.fields)
      ? config.fields
      : [];

  return {
    ...config,
    fields,
    fieldsJson: formatJsonForEditor(fields),
  };
}

function normalizeStepConfig(
  step,
  products = [],
  context = {},
  { strict = true } = {},
) {
  const config = step?.config && typeof step.config === "object" ? step.config : {};

  switch (step?.type) {
    case "PLAN_SELECTION":
      return normalizePlanConfig(config, products, context, { strict });
    case "MEDICATION_SELECT":
      return normalizeMedicationConfig(config, products, context);
    case "CUSTOM_FORM":
      return normalizeCustomFormConfig(config, { strict });
    default:
      return config;
  }
}

export function sanitizeOnboardingSteps(steps) {
  if (!Array.isArray(steps)) return [];

  return [...steps]
    .filter((step) => !isLegacyHealthHistoryStep(step))
    .sort((a, b) => (a?.order || 0) - (b?.order || 0))
    .map((step, index) => ({
      ...step,
      order: index + 1,
    }));
}

export function normalizeOnboardingStepsForPersistence(
  steps,
  products = [],
  context = {},
) {
  return sanitizeOnboardingSteps(steps).map((step) => ({
    ...step,
    config: normalizeStepConfig(step, products, context, { strict: true }),
  }));
}

export function normalizeOnboardingStepsForEditor(
  steps,
  products = [],
  context = {},
) {
  return sanitizeOnboardingSteps(steps).map((step) => ({
    ...step,
    config: normalizeStepConfig(step, products, context, { strict: false }),
  }));
}

export function sanitizeOnboardingTemplate(template) {
  if (!template) return template;

  return {
    ...template,
    steps: sanitizeOnboardingSteps(template.steps),
  };
}

export function sanitizeOnboardingTemplates(templates) {
  if (!Array.isArray(templates)) return [];
  return templates.map((template) => sanitizeOnboardingTemplate(template));
}
