export const WORDPRESS_MARKETING_IMAGES = Object.freeze({
  nadInjection: "/images/marketing/nad-injection.png",
  nadNasal: "/images/marketing/nad-nasal.png",
  nadPatches: "/images/marketing/nad-patches.png",
  tirzepatide: "/images/marketing/tirzepatide.png",
  semaglutide: "/images/marketing/semaglutide-sermorelin.png",
  pt141: "/images/marketing/pt141.png",
  oxytocin: "/images/marketing/oxytocin.png",
  sermorelin: "/images/marketing/sermorelin.png",
  enclomiphene: "/images/marketing/enclomiphene.png",
  glutathioneLdn: "/images/marketing/glutathione-ldn.png",
  remeron: "/images/marketing/remeron.png",
  trazodone: "/images/marketing/trazodone.png",
  viagra: "/images/marketing/viagra.png",
});

const SUSPICIOUS_MARKETING_IMAGE_PATTERN =
  /(imageuploadtest|placeholder|dummy|sample|photoroom|wmremove|befv|product-image\.webp|via\.placeholder|unsplash)/i;

const LEGACY_MARKETING_IMAGE_ALIAS_GROUPS = Object.freeze([
  {
    replacement: WORDPRESS_MARKETING_IMAGES.nadInjection,
    aliases: [
      "/product-image.webp",
      "/2nd-section.webp",
      "/photoroom-2.png",
      "/photoroom-6.png",
      "/befv.webp",
      "/wp-content/uploads/2026/02/nad.png",
      "/wp-content/uploads/2026/03/nad.png",
      "/wp-content/uploads/2026/03/glutathione-nad.png",
    ],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.nadNasal,
    aliases: [
      "/related-prod-1.webp",
      "/2nd-last-section.webp",
      "/wp-content/uploads/2026/02/1772677216790-181-nad-nasal.png",
      "/wp-content/uploads/2026/03/1772677216790-181-nad-nasal.png",
    ],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.nadPatches,
    aliases: ["/related-prod-2.webp", "/last-section.webp"],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.tirzepatide,
    aliases: [
      "/wp-content/uploads/2026/02/tirzepatide-injection.png",
      "/wp-content/uploads/2026/02/tirzepatide.png",
      "/photoroom-0.png",
      "/wmremove-transformed-2-1.jpeg",
    ],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.semaglutide,
    aliases: [
      "/wp-content/uploads/2026/02/semaglutide-sermorelin.png",
      "/photoroom-1.png",
    ],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.pt141,
    aliases: [
      "/wp-content/uploads/2026/02/pt-141-nasal-spray-nad-nasal-spray.png",
      "/wp-content/uploads/2026/03/pt-141-nasal-spray-nad-nasal-spray.png",
      "/photoroom-3.png",
    ],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.oxytocin,
    aliases: [
      "/wp-content/uploads/2026/03/pt-141-oxytocin.png",
      "/wp-content/uploads/2026/03/oxytocin-1.png",
    ],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.sermorelin,
    aliases: ["/photoroom-4.png", "/wp-content/uploads/2026/03/sermorelin.png"],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.enclomiphene,
    aliases: [
      "/wp-content/uploads/2026/03/enclomiphene.png",
      "/wp-content/uploads/2026/03/enclomiphene-seromroelin.png",
    ],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.glutathioneLdn,
    aliases: [
      "/wp-content/uploads/2026/03/glutathione.png",
      "/wp-content/uploads/2026/03/ldn-glutathione.png",
      "/wp-content/uploads/2026/03/ldn.png",
    ],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.remeron,
    aliases: ["/wp-content/uploads/2026/03/remeron.png"],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.trazodone,
    aliases: ["/wp-content/uploads/2026/03/trazadone.png"],
  },
  {
    replacement: WORDPRESS_MARKETING_IMAGES.viagra,
    aliases: [
      "/wp-content/uploads/2026/03/generic-viagra-sildenafil.png",
      "/wp-content/uploads/2026/03/cialis-tadalifil-1.png",
      "/wp-content/uploads/2026/03/1772677196344-801-surge-pt-141.png",
    ],
  },
]);

const LEGACY_MARKETING_IMAGE_REPLACEMENTS = Object.freeze(
  Object.fromEntries(
    LEGACY_MARKETING_IMAGE_ALIAS_GROUPS.flatMap(({ replacement, aliases }) =>
      aliases.map((alias) => [alias, replacement]),
    ),
  ),
);

function normalizeMarketingImageKey(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw, "https://healsend.com");
    return `${parsed.pathname}${parsed.search}`.toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
}

export function getLegacyMarketingImageReplacement(value) {
  const normalized = normalizeMarketingImageKey(value);
  return LEGACY_MARKETING_IMAGE_REPLACEMENTS[normalized] || null;
}

export function isSuspiciousMarketingImage(value) {
  return SUSPICIOUS_MARKETING_IMAGE_PATTERN.test(String(value || ""));
}

export function normalizeMarketingImage(value, fallbackValue = null) {
  const raw = String(value || "").trim();
  if (!raw) {
    return fallbackValue || raw;
  }

  const normalized = getLegacyMarketingImageReplacement(raw) || raw;

  if (isSuspiciousMarketingImage(normalized) && fallbackValue) {
    return fallbackValue;
  }

  return normalized;
}

function normalizeMarketingPath(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "/";
  }

  try {
    const parsed = new URL(raw, "https://healsend.com");
    const pathname = parsed.pathname || "/";
    return pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1).toLowerCase()
      : pathname.toLowerCase();
  } catch {
    const pathname = raw.startsWith("/") ? raw : `/${raw}`;
    return pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1).toLowerCase()
      : pathname.toLowerCase();
  }
}

export function getDefaultMarketingImageForPath(path) {
  const normalizedPath = normalizeMarketingPath(path);

  if (
    normalizedPath === "/" ||
    normalizedPath === "/home" ||
    normalizedPath === "/shop" ||
    normalizedPath.startsWith("/weight-loss")
  ) {
    return WORDPRESS_MARKETING_IMAGES.tirzepatide;
  }

  if (
    normalizedPath === "/sexual-health" ||
    normalizedPath.startsWith("/sexual-health")
  ) {
    return WORDPRESS_MARKETING_IMAGES.pt141;
  }

  if (
    normalizedPath === "/anti-aging" ||
    normalizedPath === "/nad" ||
    normalizedPath.startsWith("/nad")
  ) {
    return WORDPRESS_MARKETING_IMAGES.nadInjection;
  }

  if (
    normalizedPath === "/strength-recovery" ||
    normalizedPath.startsWith("/strength-recovery")
  ) {
    return WORDPRESS_MARKETING_IMAGES.sermorelin;
  }

  if (normalizedPath === "/sleep" || normalizedPath.startsWith("/sleep")) {
    return WORDPRESS_MARKETING_IMAGES.remeron;
  }

  if (
    normalizedPath === "/glutathione-ldn" ||
    normalizedPath.startsWith("/glutathione-ldn")
  ) {
    return WORDPRESS_MARKETING_IMAGES.glutathioneLdn;
  }

  if (
    normalizedPath === "/psychiatry" ||
    normalizedPath.startsWith("/psychiatry")
  ) {
    return WORDPRESS_MARKETING_IMAGES.trazodone;
  }

  return WORDPRESS_MARKETING_IMAGES.nadInjection;
}
