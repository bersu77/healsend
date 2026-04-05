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

  return mode === "ALL_AT_ONCE" ? "ALL_AT_ONCE" : "UPFRONT_ZERO";
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
  const priceCandidates = [
    parseCurrency(selectedPlan?.firstMonth),
    parseCurrency(summary?.total),
    parseCurrency(selectedMedication?.price),
    parseCurrency(selectedPlan?.thenPrice),
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

  return {
    pricingMode,
    totalAmount,
    dueTodayAmount,
    delayedChargeDays,
    monthlyInstallment: totalAmount > 0 ? totalAmount / 12 : 0,
    captureMethod: pricingMode === "ALL_AT_ONCE" ? "automatic" : "manual",
    allowsBnpl: pricingMode === "ALL_AT_ONCE",
  };
}
