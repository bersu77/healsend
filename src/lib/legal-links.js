export const LEGAL_ROUTE_PATHS = {
  privacy: "/privacy-policy",
  terms: "/terms-of-service-2",
  telehealthConsent: "/consent-to-telehealth-2",
  safety: "/safety-information",
  consumerHealthData: "/consumer-health-data",
  refund: "/refund-policy",
  hipaa: "/privacy-policy",
};

export const LEGAL_ROUTE_LABELS = {
  [LEGAL_ROUTE_PATHS.privacy]: "Privacy Policy",
  [LEGAL_ROUTE_PATHS.terms]: "Terms of Service",
  [LEGAL_ROUTE_PATHS.telehealthConsent]: "Telehealth Consent",
  [LEGAL_ROUTE_PATHS.safety]: "Safety Information",
  [LEGAL_ROUTE_PATHS.consumerHealthData]: "Consumer Health Data",
  [LEGAL_ROUTE_PATHS.refund]: "Refund Policy",
};

export const SUPPORT_EMAIL = "yourhealth@healsend.com";

export function getLegalRouteLabel(pathOrSlug) {
  const normalized = String(pathOrSlug || "").trim();
  if (!normalized) {
    return null;
  }

  const path = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return LEGAL_ROUTE_LABELS[path] || null;
}

export function buildSupportMailto(subject) {
  const trimmedSubject = String(subject || "").trim();
  if (!trimmedSubject) {
    return `mailto:${SUPPORT_EMAIL}`;
  }

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(trimmedSubject)}`;
}
