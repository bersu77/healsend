export const PRODUCT_ONBOARDING = {
  "tirzepatide-injections": "craving-portion-control",
  "tirzepatide-drops": "craving-portion-control",
  "tirzepatide-tablets": "craving-portion-control",
  "semaglutide-injections": "food-noise-appetite",
  "semaglutide-drops": "food-noise-appetite",
  "semaglutide-tablets": "food-noise-appetite",
  "pt-141-nasal-spray": "low-intimacy-drive",
  "pt-141-oxytocin-nasal-sprays": "low-intimacy-drive",
  "oxytocin-nasal-spray": "low-intimacy-drive",
  "pt-141-surge-2-in-1": "low-intimacy-drive",
  "viagra-sildenafil": "performance-issues",
  sildefanil: "performance-issues",
  sildenafil: "performance-issues",
  "generic-viagra": "performance-issues",
  "generic-cialis": "performance-issues",
  "nad-injection-glutathione-1x-product": "nad-injection-therapy",
  "nad-nasal-glutathione-injection": "nad-nasal-spray",
  "glutathione-injection": "nad-injection-therapy",
  glutathione: "nad-injection-therapy",
  "glutathione-low-dose-naltrexone-ldn": "nad-injection-therapy",
  "low-dose-naltrexone-ldn": "nad-injection-therapy",
  "nad-injections": "nad-injection-therapy",
  "nad-nasal-spray": "nad-nasal-spray",
  "mic-injection": "micc-b12-shots",
  "sermorelin-injection-him-her": "growth-hormone-support",
  "sermorelin-injection": "growth-hormone-support",
  "sermorelin-injection-2": "growth-hormone-support",
  "sermorelin-enclomiphene-capsules-him": "growth-hormone-support",
  "sermorelin-enclomiphene": "growth-hormone-support",
  "cjc-1295-ipamorelin": "growth-hormone-support",
  enclomiphene: "growth-hormone-support",
  "generic-remeron-mirtazapine": "sleep",
  "generic-trazodone": "sleep",
};

export const MARKETING_PRIMARY_PRODUCT_SLUGS = [
  "nad-injections",
  "nad-injection-glutathione-1x-product",
  "nad-injection",
];

const MARKETING_PRODUCT_DETAIL_ALIASES = {
  "pt-141-oxytocin-nasal-sprays": "pt-141-surge-2-in-1",
  sildefanil: "viagra-sildenafil",
  sildenafil: "viagra-sildenafil",
  "generic-viagra": "viagra-sildenafil",
};

export function getFunnelPath(slug) {
  return slug ? `/funnels/${slug}` : null;
}

export function getProductOnboardingPath(slug) {
  const onboardingSlug = PRODUCT_ONBOARDING[slug];
  return getFunnelPath(onboardingSlug);
}

export function getProductDetailPath(slug) {
  return `/shop/${slug}`;
}

export function getMarketingProductDetailPath(slug) {
  const resolvedSlug = MARKETING_PRODUCT_DETAIL_ALIASES[slug] || slug;

  return MARKETING_PRIMARY_PRODUCT_SLUGS.includes(resolvedSlug)
    ? "/nad"
    : `/${resolvedSlug}`;
}
