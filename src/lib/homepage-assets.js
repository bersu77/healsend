import {
  getLegacyMarketingImageReplacement,
  isSuspiciousMarketingImage,
  normalizeMarketingImage,
} from "@/lib/marketing-images";

const KNOWN_BAD_HOMEPAGE_IMAGES = new Set([
  "/images/articles/blogs/online-prescription-consultation.jpg",
]);

function sanitizeText(value) {
  const normalized = String(value || "").trim();
  return normalized.length > 0 ? normalized : "";
}

function isLegacyCmsImage(value) {
  return /^(https?:\/\/[^/]*healsend\.com)?\/wp-content\/uploads\//i.test(
    String(value || "").trim(),
  );
}

export function normalizeHomepageManagedImage(value, fallbackValue = "") {
  const raw = sanitizeText(value);
  const fallback = sanitizeText(fallbackValue);

  if (!raw) {
    return fallback;
  }

  if (KNOWN_BAD_HOMEPAGE_IMAGES.has(raw)) {
    return fallback || raw;
  }

  if (isLegacyCmsImage(raw)) {
    return fallback || raw;
  }

  if (getLegacyMarketingImageReplacement(raw)) {
    return fallback || normalizeMarketingImage(raw, fallback || null) || raw;
  }

  const normalized = normalizeMarketingImage(raw, fallback || null);
  if (
    isSuspiciousMarketingImage(raw) ||
    (normalized && isSuspiciousMarketingImage(normalized))
  ) {
    return fallback || normalized || raw;
  }

  return normalized || fallback || raw;
}

export function normalizeHomepageHeadlinePhrases(
  source,
  defaultPhrases = [],
) {
  const fallbackPhrases = Array.isArray(defaultPhrases)
    ? defaultPhrases.filter((phrase) => sanitizeText(phrase?.text))
    : [];

  const incomingPhrases = Array.isArray(source) ? source : [];
  const normalizedIncoming = incomingPhrases
    .map((phrase, index) => {
      const rawText =
        typeof phrase === "string" ? sanitizeText(phrase) : sanitizeText(phrase?.text);

      if (!rawText) {
        return null;
      }

      const matchedFallback =
        fallbackPhrases.find(
          (item) => sanitizeText(item?.text).toLowerCase() === rawText.toLowerCase(),
        ) ||
        fallbackPhrases[index] ||
        fallbackPhrases[0] ||
        null;

      const rawColor =
        typeof phrase === "object" && phrase !== null
          ? sanitizeText(phrase.color)
          : "";

      return {
        text: rawText,
        color: rawColor || matchedFallback?.color || "#1D1D1F",
      };
    })
    .filter(Boolean);

  if (normalizedIncoming.length > 0) {
    return normalizedIncoming;
  }

  return fallbackPhrases.map((phrase) => ({
    text: sanitizeText(phrase?.text),
    color: sanitizeText(phrase?.color) || "#1D1D1F",
  }));
}
