const SETTLED_ORDER_STATUSES = new Set([
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
]);

const POSITIVE_FULFILLMENT_KEYWORDS = [
  "approved",
  "cleared",
  "rx",
  "prescription",
  "pharmacy",
  "dispens",
  "fulfillment_ready",
  "ready_to_ship",
  "fulfilled",
  "shipped",
  "completed",
  "closed",
];

const TRANSITIONAL_MEDICAL_KEYWORDS = [
  "submitted",
  "created",
  "pending",
  "assigned",
  "review",
  "intake",
  "questionnaire",
  "awaiting",
  "auth",
  "consultation",
  "active",
  "in_progress",
];

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function containsKeyword(values, keywords) {
  return values.some((value) =>
    keywords.some((keyword) => value.includes(keyword)),
  );
}

function hasStructuredData(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value && typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return false;
}

export function isStripePaymentSettled(value) {
  const normalized = normalizeValue(value);
  return normalized === "paid" || normalized === "succeeded";
}

export function isStripePaymentAuthorized(value) {
  return normalizeValue(value) === "requires_capture";
}

export function getPrimaryStripePaymentMethod(value) {
  if (Array.isArray(value)) {
    return value.find(Boolean) || null;
  }

  return value ? String(value) : null;
}

export function isOrderPaymentCaptured(order) {
  if (!order) return false;
  if (order.paymentCapturedAt) return true;
  if (isStripePaymentSettled(order.stripePaymentStatus)) return true;
  return SETTLED_ORDER_STATUSES.has(String(order.status || "").toUpperCase());
}

export function isOrderPaymentAuthorized(order) {
  if (!order) return false;
  return isOrderPaymentCaptured(order) || isStripePaymentAuthorized(order.stripePaymentStatus);
}

export function getOrderFulfillmentAssessment(order, caseSnapshot = null) {
  if (!order) {
    return {
      ready: false,
      paymentCaptured: false,
      blockedReason: "Order not found.",
    };
  }

  const currentStatus = String(order.status || "").toUpperCase();
  if (currentStatus === "REFUNDED") {
    return {
      ready: false,
      paymentCaptured: true,
      blockedReason: "Order was refunded.",
    };
  }

  if (currentStatus === "CANCELLED") {
    return {
      ready: false,
      paymentCaptured: false,
      blockedReason: "Order was cancelled.",
    };
  }

  const paymentCaptured = isOrderPaymentCaptured(order);
  const paymentAuthorized = isOrderPaymentAuthorized(order);
  if (!paymentAuthorized) {
    return {
      ready: false,
      medicallyReady: false,
      paymentCaptured: false,
      paymentAuthorized: false,
      blockedReason: "Awaiting payment authorization.",
    };
  }

  const rawSignals = [
    order.mdiWorkflowPhase,
    order.mdiOrderStatus,
    order.consultationStatus,
    caseSnapshot?.status,
    caseSnapshot?.phase,
    caseSnapshot?.latestEventType,
  ]
    .map(normalizeValue)
    .filter(Boolean);

  const hasMedicalContext = Boolean(
    order.mdiOrderId ||
      order.mdiCaseId ||
      order.consultationId ||
      order.consultationUrl ||
      rawSignals.length > 0 ||
      caseSnapshot,
  );

  if (!hasMedicalContext) {
    return {
      ready: false,
      paymentCaptured,
      medicallyReady: false,
      paymentAuthorized,
      blockedReason: paymentCaptured
        ? "Medical review has not started yet."
        : "Awaiting medical approval before charge capture.",
    };
  }

  const hasPrescription = hasStructuredData(caseSnapshot?.prescriptions);
  const hasFulfillmentReadyKeyword = containsKeyword(
    rawSignals,
    POSITIVE_FULFILLMENT_KEYWORDS,
  );

  if (hasPrescription || hasFulfillmentReadyKeyword) {
    if (!paymentCaptured) {
      return {
        ready: false,
        medicallyReady: true,
        paymentCaptured,
        paymentAuthorized,
        blockedReason: "Awaiting charge capture after medical approval.",
      };
    }

    return {
      ready: true,
      medicallyReady: true,
      paymentCaptured,
      paymentAuthorized,
      blockedReason: null,
    };
  }

  const inMedicalReview = containsKeyword(
    rawSignals,
    TRANSITIONAL_MEDICAL_KEYWORDS,
  );

  return {
    ready: false,
    medicallyReady: false,
    paymentCaptured,
    paymentAuthorized,
    blockedReason: inMedicalReview
      ? paymentCaptured
        ? "Awaiting provider approval or prescription release."
        : "Awaiting provider approval before charge capture."
      : paymentCaptured
        ? "Medical fulfillment is not cleared yet."
        : "Payment authorized. Medical review is still in progress.",
  };
}

export function buildFulfillmentProjection(order, caseSnapshot = null) {
  const assessment = getOrderFulfillmentAssessment(order, caseSnapshot);
  const update = {
    fulfillmentBlockedReason: assessment.blockedReason,
  };

  if (assessment.ready) {
    update.fulfillmentReadyAt = order.fulfillmentReadyAt || new Date();
    update.fulfillmentBlockedReason = null;

    if (String(order.status || "").toUpperCase() === "PAID") {
      update.status = "PROCESSING";
    }
  } else {
    update.fulfillmentReadyAt = null;
  }

  return { assessment, update };
}

export function assertOrderStatusTransition(order, nextStatus, caseSnapshot = null) {
  const currentStatus = String(order?.status || "").toUpperCase();
  const targetStatus = String(nextStatus || "").toUpperCase();

  if (!targetStatus || currentStatus === targetStatus) {
    return { ok: true };
  }

  if (targetStatus === "SHIPPED") {
    const assessment = getOrderFulfillmentAssessment(order, caseSnapshot);
    if (!assessment.ready) {
      return {
        ok: false,
        status: 409,
        reason:
          assessment.blockedReason ||
          "This order is not cleared for shipment yet.",
      };
    }
  }

  if (targetStatus === "DELIVERED" && currentStatus !== "SHIPPED") {
    return {
      ok: false,
      status: 409,
      reason: "An order must be marked as shipped before it can be delivered.",
    };
  }

  if (targetStatus === "PROCESSING" && !isOrderPaymentCaptured(order)) {
    return {
      ok: false,
      status: 409,
      reason: "Payment must settle before the order can enter processing.",
    };
  }

  return { ok: true };
}

export function getSettledRevenueStatuses() {
  return ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
}
