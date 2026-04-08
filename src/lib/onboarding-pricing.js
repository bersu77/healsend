function parseCurrency(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/-?\d+(\.\d+)?/);
  if (!match) {
    return null;
  }

  const amount = parseFloat(match[0]);
  return Number.isFinite(amount) ? amount : null;
}

export const DEFAULT_UPFRONT_ZERO_DELAY_DAYS = 20;

export function normalizeCheckoutPricingMode(value) {
  const mode =
    typeof value === "string" ? value : value?.checkoutPricingMode || null;

  // Default to ALL_AT_ONCE — UPFRONT_ZERO requires a working delayed-capture
  // backend and should only be used when explicitly configured.
  return mode === "UPFRONT_ZERO" ? "UPFRONT_ZERO" : "ALL_AT_ONCE";
}

/**
 * Resolve the number of months for a plan from its id/name/durationMonths.
 * Returns null when duration is ambiguous (monthly/1-month treated as 1).
 */
export function resolvePlanDurationMonths(plan) {
  if (!plan) return null;
  const explicit = Number(plan.durationMonths || plan.duration_months || 0);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;

  const haystack = `${plan.id || ""} ${plan.name || ""}`.toLowerCase();
  if (/\b12\b/.test(haystack)) return 12;
  if (/\b6\b/.test(haystack)) return 6;
  if (/\b3\b/.test(haystack)) return 3;
  if (/monthly|\b1\b/.test(haystack)) return 1;
  return null;
}

export function normalizeDelayedChargeDays(value) {
  const rawValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : value && typeof value === "object"
          ? value.delayedChargeDays
          : null;

  const normalized = Number.parseInt(String(rawValue ?? ""), 10);
  if (!Number.isFinite(normalized)) {
    return DEFAULT_UPFRONT_ZERO_DELAY_DAYS;
  }

  return Math.min(60, Math.max(1, normalized));
}

export function resolveCheckoutTotalAmount({
  selectedPlan,
  selectedMedication,
  summary,
}) {
  // For multi-month plans: compute total upfront cost (firstMonth + remaining months × thenPrice)
  if (selectedPlan) {
    const durationMonths = resolvePlanDurationMonths(selectedPlan);
    const firstMonth = parseCurrency(
      selectedPlan?.firstMonth ?? selectedPlan?.firstMonthPrice,
    );
    const thenPrice = parseCurrency(selectedPlan?.thenPrice) ?? firstMonth;

    if (firstMonth !== null && firstMonth > 0) {
      if (durationMonths && durationMonths > 1) {
        return (
          firstMonth +
          Math.max(durationMonths - 1, 0) * (thenPrice ?? firstMonth)
        );
      }
      return firstMonth;
    }
  }

  const priceCandidates = [
    parseCurrency(summary?.total),
    parseCurrency(selectedMedication?.price),
  ].filter((candidate) => typeof candidate === "number" && candidate > 0);

  return priceCandidates[0] || 0;
}

export function getCheckoutPricingState({
  styling,
  selectedPlan,
  selectedMedication,
  summary,
}) {
  const pricingMode = normalizeCheckoutPricingMode(styling);
  const delayedChargeDays = normalizeDelayedChargeDays(styling);
  const totalAmount = resolveCheckoutTotalAmount({
    selectedPlan,
    selectedMedication,
    summary,
  });
  const dueTodayAmount = pricingMode === "ALL_AT_ONCE" ? totalAmount : 0;

  // Per-month display rate — always the base monthly price, not the total
  const monthlyRate =
    parseCurrency(selectedPlan?.firstMonth ?? selectedPlan?.firstMonthPrice) ??
    parseCurrency(selectedMedication?.price) ??
    totalAmount;

  const durationMonths = resolvePlanDurationMonths(selectedPlan);

  return {
    pricingMode,
    totalAmount,
    dueTodayAmount,
    delayedChargeDays,
    monthlyRate,
    durationMonths,
    monthlyInstallment: totalAmount > 0 ? totalAmount / 12 : 0,
    captureMethod: pricingMode === "ALL_AT_ONCE" ? "automatic" : "manual",
    allowsBnpl: pricingMode === "ALL_AT_ONCE",
  };
}
