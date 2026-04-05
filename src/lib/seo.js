import { getDefaultMarketingImageForPath } from "@/lib/marketing-images";

const DEFAULT_APP_URL = "http://localhost:3000";

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL;

  try {
    return new URL(value);
  } catch {
    return new URL(DEFAULT_APP_URL);
  }
}

export function resolveAbsoluteUrl(value) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value, getSiteUrl()).toString();
  } catch {
    return null;
  }
}

export function humanizeSlugTitle(slug) {
  const normalized = String(slug || "")
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .pop();

  if (!normalized) {
    return "HealSend";
  }

  return normalized
    .replace(/-\d+$/i, "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((segment) => {
      const lower = segment.toLowerCase();

      if (lower === "glp") return "GLP";
      if (lower === "ldn") return "LDN";
      if (lower === "nad") return "NAD+";
      if (lower === "pt") return "PT";
      if (lower === "b12") return "B12";
      if (lower === "cjc") return "CJC";
      if (lower === "l") return "L";
      if (/^\d+$/.test(lower)) return lower;

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ")
    .replace(/\bGlp 1\b/g, "GLP-1")
    .replace(/\bPt 141\b/g, "PT-141")
    .replace(/\bB 12\b/g, "B12")
    .trim();
}

export function isSlugLikeTitle(value, slug) {
  const normalizedValue = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const normalizedSlug = String(slug || "")
    .toLowerCase()
    .replace(/-\d+$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const humanizedSlug = humanizeSlugTitle(slug)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  return Boolean(
    normalizedValue &&
      (normalizedValue === normalizedSlug || normalizedValue === humanizedSlug),
  );
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noIndex = false,
}) {
  const canonical = resolveAbsoluteUrl(path) || getSiteUrl().toString();
  const resolvedImage = resolveAbsoluteUrl(
    image || getDefaultMarketingImageForPath(path),
  );

  return {
    metadataBase: getSiteUrl(),
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "HealSend",
      type,
      ...(resolvedImage
        ? {
            images: [
              {
                url: resolvedImage,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: resolvedImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(resolvedImage ? { images: [resolvedImage] } : {}),
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
