export function isUuidLike(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "").trim(),
  );
}

export function isLocalFallbackConsultationUrl(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url, "https://healsend.local");
    return parsed.pathname.includes("/consultation/local-dev");
  } catch {
    return String(url).includes("/consultation/local-dev");
  }
}

export function isUsableConsultationUrl(
  url,
  { allowLocalFallback = false } = {},
) {
  if (!url) return false;
  return allowLocalFallback || !isLocalFallbackConsultationUrl(url);
}

export function stripUnusableConsultationState(
  record,
  { allowLocalFallback = false } = {},
) {
  if (!record || !record.consultationUrl) {
    return record;
  }

  if (
    isUsableConsultationUrl(record.consultationUrl, {
      allowLocalFallback,
    })
  ) {
    return record;
  }

  return {
    ...record,
    consultationId: null,
    consultationUrl: null,
  };
}
