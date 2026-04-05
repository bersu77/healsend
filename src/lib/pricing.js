function toFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function toPositiveInteger(value) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
}

function toBooleanLike(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return ["yes", "true", "1"].includes(value.trim().toLowerCase());
  }

  return false;
}

function buildPlanName({ name, durationMonths, index }) {
  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }

  if (durationMonths) {
    return `${durationMonths}-Month Plan`;
  }

  return `Plan ${index + 1}`;
}

function normalizePlanBadges(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry === "string" && entry.trim()) {
        return { text: entry.trim() };
      }

      if (
        entry &&
        typeof entry === "object" &&
        typeof entry.text === "string" &&
        entry.text.trim()
      ) {
        return {
          ...entry,
          text: entry.text.trim(),
        };
      }

      return null;
    })
    .filter(Boolean);
}

function normalizePlanBulletPoints(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry || "").trim())
      .filter(Boolean);
  }

  return String(value || "")
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\brn\b/g, "\n")
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function formatUsd(
  value,
  { minimumFractionDigits = 2, maximumFractionDigits = 2 } = {},
) {
  const amount = toFiniteNumber(value);
  if (amount === null) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

export function formatUsdCompact(value) {
  const amount = toFiniteNumber(value);
  if (amount === null) {
    return null;
  }

  return formatUsd(amount, {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function getProductSubscriptionPlans(product) {
  const tiers = Array.isArray(product?.subscriptionTiers)
    ? product.subscriptionTiers
    : [];

  return tiers
    .map((tier, index) => {
      const firstMonthPrice =
        toFiniteNumber(tier?.first_price) ??
        toFiniteNumber(tier?.firstMonthPrice) ??
        toFiniteNumber(tier?.price);
      const thenPrice =
        toFiniteNumber(tier?.then_price) ??
        toFiniteNumber(tier?.regularPrice) ??
        firstMonthPrice;

      if (firstMonthPrice === null && thenPrice === null) {
        return null;
      }

      const durationMonths =
        toPositiveInteger(tier?.duration_months) ??
        toPositiveInteger(tier?.durationMonths);
      const planPriority =
        toPositiveInteger(tier?.plan_priority) ??
        toPositiveInteger(tier?.planPriority) ??
        index + 1;
      const name = buildPlanName({
        name: tier?.name || tier?.label,
        durationMonths,
        index,
      });

      return {
        id:
          tier?.stripe_price_id ||
          tier?.id ||
          `${durationMonths || "plan"}-${planPriority}-${index}`,
        pricingKey:
          tier?.stripe_price_id ||
          tier?.id ||
          `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
        name,
        durationMonths,
        planPriority,
        firstMonthPrice: firstMonthPrice ?? thenPrice ?? 0,
        thenPrice: thenPrice ?? firstMonthPrice ?? 0,
        isRecommended:
          toBooleanLike(tier?.is_recommended) ||
          toBooleanLike(tier?.enable_highlight),
        isDefault: toBooleanLike(tier?.is_default_plan),
        badges: normalizePlanBadges(tier?.plan_badges),
        bulletPoints: normalizePlanBulletPoints(tier?.plan_bullet_points),
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (left.isDefault !== right.isDefault) {
        return left.isDefault ? -1 : 1;
      }

      if (left.isRecommended !== right.isRecommended) {
        return left.isRecommended ? -1 : 1;
      }

      if (left.planPriority !== right.planPriority) {
        return left.planPriority - right.planPriority;
      }

      if (
        left.durationMonths !== null &&
        right.durationMonths !== null &&
        left.durationMonths !== right.durationMonths
      ) {
        return left.durationMonths - right.durationMonths;
      }

      return left.firstMonthPrice - right.firstMonthPrice;
    });
}

export function getDefaultProductSubscriptionPlan(product) {
  const plans = getProductSubscriptionPlans(product);
  return plans[0] || null;
}

export function getProductFirstMonthPrice(product) {
  const variantPrices = Array.isArray(product?.variants)
    ? product.variants
        .map((variant) => toFiniteNumber(variant?.price))
        .filter((price) => price !== null)
    : [];

  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  const plans = getProductSubscriptionPlans(product);
  if (plans.length > 0) {
    return Math.min(...plans.map((plan) => plan.firstMonthPrice));
  }

  return (
    toFiniteNumber(product?.salePrice) ??
    toFiniteNumber(product?.regularPrice) ??
    null
  );
}

export function getProductThenPrice(product) {
  const variantPrices = Array.isArray(product?.variants)
    ? product.variants
        .map(
          (variant) =>
            toFiniteNumber(variant?.salePrice) ?? toFiniteNumber(variant?.price),
        )
        .filter((price) => price !== null)
    : [];

  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  const cheapestPlan = [...getProductSubscriptionPlans(product)].sort(
    (left, right) =>
      left.firstMonthPrice - right.firstMonthPrice ||
      left.thenPrice - right.thenPrice,
  )[0];

  if (cheapestPlan) {
    return cheapestPlan.thenPrice ?? cheapestPlan.firstMonthPrice;
  }

  return (
    toFiniteNumber(product?.regularPrice) ??
    toFiniteNumber(product?.salePrice) ??
    null
  );
}

export function getProductSavings(product) {
  const firstMonthPrice = getProductFirstMonthPrice(product);
  const thenPrice = getProductThenPrice(product);

  if (firstMonthPrice === null || thenPrice === null || thenPrice <= firstMonthPrice) {
    return 0;
  }

  return Math.round((thenPrice - firstMonthPrice) * 100) / 100;
}

export function getProductPriceSummary(product) {
  const firstMonthPrice = getProductFirstMonthPrice(product);
  const thenPrice = getProductThenPrice(product);

  if (firstMonthPrice === null) {
    return null;
  }

  return {
    firstMonthPrice,
    thenPrice,
    savings: getProductSavings(product),
  };
}

export function getPricingMetadataSummary(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const unitPrice =
    toFiniteNumber(metadata.unitPrice) ??
    toFiniteNumber(metadata.firstMonthPrice) ??
    null;
  const regularPrice =
    toFiniteNumber(metadata.regularPrice) ??
    toFiniteNumber(metadata.thenPrice) ??
    unitPrice;

  if (unitPrice === null) {
    return null;
  }

  return {
    pricingKey:
      typeof metadata.pricingKey === "string" && metadata.pricingKey.trim()
        ? metadata.pricingKey.trim()
        : null,
    unitPrice,
    regularPrice,
    planName:
      typeof metadata.planName === "string" && metadata.planName.trim()
        ? metadata.planName.trim()
        : null,
  };
}

export function getEffectiveProductUnitPrice(product, options = {}) {
  const variantPrice = toFiniteNumber(options.variant?.price);
  if (variantPrice !== null) {
    return variantPrice;
  }

  const metadataSummary = getPricingMetadataSummary(options.metadata);
  if (metadataSummary?.unitPrice !== null && metadataSummary?.unitPrice !== undefined) {
    return metadataSummary.unitPrice;
  }

  const defaultPlan = getDefaultProductSubscriptionPlan(product);
  if (defaultPlan) {
    return defaultPlan.firstMonthPrice;
  }

  return (
    toFiniteNumber(product?.salePrice) ??
    toFiniteNumber(product?.regularPrice) ??
    0
  );
}

export function getEffectiveProductOriginalPrice(product, options = {}) {
  const variantOriginal =
    toFiniteNumber(options.variant?.salePrice) ??
    (toFiniteNumber(options.variant?.price) !== null &&
    toFiniteNumber(options.variant?.salePrice) !== null
      ? toFiniteNumber(options.variant?.salePrice)
      : null);

  if (variantOriginal !== null) {
    return variantOriginal;
  }

  const metadataSummary = getPricingMetadataSummary(options.metadata);
  if (
    metadataSummary?.regularPrice !== null &&
    metadataSummary?.regularPrice !== undefined &&
    metadataSummary.regularPrice > metadataSummary.unitPrice
  ) {
    return metadataSummary.regularPrice;
  }

  const defaultPlan = getDefaultProductSubscriptionPlan(product);
  if (defaultPlan?.thenPrice > defaultPlan.firstMonthPrice) {
    return defaultPlan.thenPrice;
  }

  const regularPrice = toFiniteNumber(product?.regularPrice);
  const salePrice = toFiniteNumber(product?.salePrice);

  if (regularPrice !== null && salePrice !== null && regularPrice > salePrice) {
    return regularPrice;
  }

  return null;
}
