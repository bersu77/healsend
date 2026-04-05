function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORY_MAP = {
  Medication: "weight-loss",
  treatments: "sexual-health",
  Oxytocin: "sexual-health",
  "ED-meds": "sexual-health",
  pt_141: "sexual-health",
  Glutathione: "anti-aging",
  "NAD+Glutathione": "anti-aging",
  "nad-therapy": "anti-aging",
  "Glutathione & LDN": "glutathione-ldn",
  "HRT-lite": "strength-recovery",
  Enclomiphene: "strength-recovery",
  "sermorelin-therapy": "strength-recovery",
  Sleep: "sleep",
  249: "weight-loss",
  250: "weight-loss",
};

const PRODUCT_IMPORT_OVERRIDES = {
  sildenafil: {
    categorySlug: "sexual-health",
    imageOverride: [
      "https://healsend.com/wp-content/uploads/2026/03/Generic-Viagra-sildenafil.png",
    ],
    shortDescription:
      "Fast-acting prescription support designed for confidence, circulation, and more reliable performance.",
    tags: ["Rx"],
  },
  sildefanil: {
    categorySlug: "sexual-health",
    imageOverride: [
      "https://healsend.com/wp-content/uploads/2026/03/Generic-Viagra-sildenafil.png",
    ],
    shortDescription:
      "Fast-acting prescription support designed for confidence, circulation, and more reliable performance.",
    tags: ["Rx"],
  },
  "tirzepatide-tablets": {
    categorySlug: "weight-loss",
    imageOverride: [
      "https://healsend.com/wp-content/uploads/2026/02/Tirzepatide.png",
    ],
    tags: ["Needle-Free", "Rx"],
  },
};

export function isSuspiciousCatalogImage(url) {
  return /(imageuploadtest|placeholder|dummy|sample)/i.test(String(url || ""));
}

export function getNormalizedCategorySlug(rawCategory) {
  const firstCategory = String(rawCategory || "")
    .split(",")[0]
    .trim();

  return CATEGORY_MAP[firstCategory] || slugify(firstCategory) || null;
}

export function normalizeImportedCatalogProduct({
  name,
  slug,
  category,
  images = [],
  shortDescription,
  description,
  tags = [],
}) {
  const normalizedSlug = slug || slugify(name);
  const override =
    PRODUCT_IMPORT_OVERRIDES[normalizedSlug] ||
    PRODUCT_IMPORT_OVERRIDES[slugify(name)] ||
    null;
  const cleanImages = Array.isArray(images)
    ? images
        .map((image) => String(image || "").trim())
        .filter(Boolean)
        .filter((image) => !isSuspiciousCatalogImage(image))
    : [];

  return {
    slug: normalizedSlug,
    categorySlug: override?.categorySlug || getNormalizedCategorySlug(category),
    images:
      override?.imageOverride?.length
        ? override.imageOverride
        : cleanImages,
    shortDescription:
      shortDescription ||
      override?.shortDescription ||
      null,
    description:
      description ||
      override?.description ||
      null,
    tags: [...new Set([...(tags || []), ...(override?.tags || [])])],
  };
}
