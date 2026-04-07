import { WORDPRESS_MARKETING_IMAGES } from "@/lib/marketing-images";

export const MARKETING_ROUTE_PATHS = {
  home: "/",
  shop: "/shop",
  login: "/?auth=login",
  nad: "/nad",
  antiAging: "/anti-aging",
  psychiatry: "/psychiatry",
  sleep: "/sleep",
  weightLoss: "/weight-loss",
  sexualHealth: "/sexual-health",
  strength: "/strength-recovery",
};

const CATEGORY_ALIAS_MAP = {
  "anti-aging": "anti-aging",
  "glp-1": "weight-loss",
  "glp-1-form": "weight-loss",
  "glp-1-weight-loss": "weight-loss",
  "glutathione-ldn": "glutathione-ldn",
  "sexual-health": "sexual-health",
  sleep: "sleep",
  "strength-recovery": "strength-recovery",
  "weight-loss": "weight-loss",
};

const PRODUCT_ALIAS_MAP = {
  nad: "nad-injections",
  "nad-therapy": "nad-injections",
  "nad-injections": "nad-injections",
  "pt-141-oxytocin-nasal-sprays": "pt-141-surge-2-in-1",
  sildefanil: "viagra-sildenafil",
  sildenafil: "viagra-sildenafil",
  "generic-viagra": "viagra-sildenafil",
};

export const MARKETING_CATEGORY_PAGE_CONTENT = {
  "weight-loss": {
    eyebrow: "Weight Loss Programs",
    title: "Provider-guided GLP-1 care built for real life.",
    description:
      "Explore weight loss treatments with clear pricing, clinician review, and home delivery without the usual waiting room friction.",
    highlights: [
      "Transparent monthly pricing",
      "Licensed clinician review",
      "Medication delivered discreetly",
    ],
    ctaText: "See if I qualify",
    fallbackCtaHref: "/funnels/glp-1",
    fallbackImage: WORDPRESS_MARKETING_IMAGES.tirzepatide,
    supportPillars: [
      {
        title: "Medication plus real clinician follow-through",
        description:
          "This category is meant to feel like a guided weight-loss front door, not a loose collection of disconnected product pages.",
      },
      {
        title: "Routes for appetite, cravings, and routine fit",
        description:
          "Different GLP-1 options support different preferences around injections, oral formats, pacing, and ongoing care style.",
      },
      {
        title: "Clear next steps into the right funnel",
        description:
          "Each treatment card keeps the details page and the matching funnel path separate so the user can learn first, then start care.",
      },
    ],
    careSteps: [
      {
        title: "Choose the treatment path that matches your goals",
        description:
          "Compare injection and oral GLP-1 options, then start with the detail page that best fits cravings, appetite, and body-composition goals.",
      },
      {
        title: "Complete a short online intake",
        description:
          "A licensed clinician reviews your health history, weight-loss goals, and medication fit before treatment is approved.",
      },
      {
        title: "Stay supported with refills and follow-up care",
        description:
          "Ongoing messaging, refill coordination, and clinician oversight keep the plan usable after the first shipment arrives.",
      },
    ],
  },
  "sexual-health": {
    eyebrow: "Sexual Wellness",
    title: "Confidential care for intimacy, desire, and performance.",
    description:
      "Start online, review your options with a licensed provider, and get treatment delivered discreetly to your door.",
    highlights: [
      "Private online intake",
      "Fast clinician review",
      "Discreet fulfillment",
    ],
    ctaText: "Start confidential visit",
    fallbackCtaHref: "/funnels/low-intimacy-drive",
    fallbackImage: WORDPRESS_MARKETING_IMAGES.pt141,
    supportPillars: [
      {
        title: "Private, direct, and easy to navigate",
        description:
          "This category keeps sensitive care options clear so users can review treatments before deciding whether to start a confidential intake.",
      },
      {
        title: "Built around desire, arousal, and performance goals",
        description:
          "The product mix covers support for intimacy, confidence, and sexual wellness without forcing everyone into the same route.",
      },
      {
        title: "Details first, funnel second",
        description:
          "Every route can open with a details page first, then hand off to the matching funnel when the user is ready to continue.",
      },
    ],
    careSteps: [
      {
        title: "Review the right treatment fit",
        description:
          "Start by comparing the detail pages for intimacy, arousal, and performance support so the next step feels informed.",
      },
      {
        title: "Complete a private online assessment",
        description:
          "A licensed clinician reviews symptoms, goals, and medical history before deciding whether treatment is appropriate.",
      },
      {
        title: "Continue care discreetly at home",
        description:
          "Approved treatment is fulfilled discreetly, with follow-up access for questions, refill timing, and ongoing support.",
      },
    ],
  },
  "anti-aging": {
    eyebrow: "Energy And Longevity",
    title: "Support energy, recovery, and vitality with precision care.",
    description:
      "Compare anti-aging and longevity-focused treatments designed to support focus, resilience, metabolism, and everyday performance.",
    highlights: [
      "Science-backed treatment options",
      "Clear pricing and follow-up care",
      "Personalized monthly plans",
    ],
    ctaText: "Explore anti-aging care",
    fallbackCtaHref: "/nad",
    fallbackImage: WORDPRESS_MARKETING_IMAGES.nadInjection,
    supportPillars: [
      {
        title: "Designed around energy, clarity, and recovery",
        description:
          "This category should feel like a focused longevity hub instead of a loose import dump from older marketing pages.",
      },
      {
        title: "Different formats for different routines",
        description:
          "Injections, nasal support, and other vitality options are surfaced with a clearer split between learning and starting care.",
      },
      {
        title: "Cleaner path into treatment",
        description:
          "The category page keeps the promise simple: compare the options, understand the use case, then move into the right next step.",
      },
    ],
    careSteps: [
      {
        title: "Choose the longevity route that fits your routine",
        description:
          "Start with the details page for the format that best matches your energy, focus, and recovery priorities.",
      },
      {
        title: "Get clinician review online",
        description:
          "A licensed provider reviews your goals and health history before recommending the best fit for ongoing support.",
      },
      {
        title: "Stay on plan with ongoing access",
        description:
          "Follow-up care, refill coordination, and continued guidance make the category feel like a real care path, not a one-time transaction.",
      },
    ],
  },
  "strength-recovery": {
    eyebrow: "Strength And Recovery",
    title: "Recovery, performance, and hormone support built around follow-through.",
    description:
      "Explore clinician-guided options for recovery, body composition, vitality, and sustainable performance support.",
    highlights: [
      "Strength-focused treatment options",
      "Clinician review and ongoing care",
      "Transparent monthly pricing",
    ],
    ctaText: "Explore strength support",
    fallbackCtaHref: "/funnels/growth-hormone-support",
    fallbackImage: WORDPRESS_MARKETING_IMAGES.sermorelin,
    supportPillars: [
      {
        title: "Recovery that stays structured",
        description:
          "Programs are positioned around consistency, clinician review, and sustainable strength support instead of one-off hype.",
      },
      {
        title: "Hormone-aware treatment options",
        description:
          "The category covers recovery and hormone-support routes that fit body composition, energy, and performance goals.",
      },
      {
        title: "Clear next steps into care",
        description:
          "Each route points into the matching onboarding or product-detail flow so the category page does not dead-end.",
      },
    ],
    careSteps: [
      {
        title: "Tell us what you want to improve",
        description:
          "Start with the online intake so the provider team can understand recovery, vitality, and hormone-support goals.",
      },
      {
        title: "Review treatment fit with a clinician",
        description:
          "A licensed clinician reviews eligibility and helps determine whether peptide or hormone-support care fits your case.",
      },
      {
        title: "Stay on plan with follow-up support",
        description:
          "Ongoing check-ins, refills, and care updates keep the plan usable instead of making it a one-time consult.",
      },
    ],
    fallbackFeaturedProducts: [
      {
        id: "sermorelin-injection-2",
        title: "Sermorelin Injection Rx",
        description:
          "Recovery-focused support positioned around body composition, vitality, and longer-term hormone follow-through.",
        price: "Clinician-guided evaluation",
        image: WORDPRESS_MARKETING_IMAGES.sermorelin,
        href: "/funnels/growth-hormone-support",
        secondaryHref: "/sermorelin-injection-2",
        tags: [],
      },
      {
        id: "cjc-1295-ipamorelin",
        title: "CJC-1295 + Ipamorelin Rx",
        description:
          "Peptide-based recovery support for strength, sleep quality, and performance routines that need more structure.",
        price: "Clinician-guided evaluation",
        image: WORDPRESS_MARKETING_IMAGES.sermorelin,
        href: "/funnels/growth-hormone-support",
        secondaryHref: "/cjc-1295-ipamorelin",
        tags: [],
      },
      {
        id: "enclomiphene",
        title: "Enclomiphene Rx",
        description:
          "Hormone-support care designed around energy, fertility preservation, and sustainable performance improvement.",
        price: "From provider-reviewed monthly plans",
        image: WORDPRESS_MARKETING_IMAGES.enclomiphene,
        href: "/funnels/growth-hormone-support",
        secondaryHref: "/enclomiphene",
        tags: [],
      },
    ],
  },
  sleep: {
    eyebrow: "Sleep Support",
    title: "Deeper, more restorative sleep without guesswork.",
    description:
      "Compare clinician-guided sleep support options designed to help with onset, staying asleep, and better next-day recovery.",
    highlights: [
      "Fast online evaluation",
      "Licensed clinician review",
      "Delivered discreetly to your door",
    ],
    ctaText: "Start sleep support",
    fallbackCtaHref: "/funnels/sleep-support",
    fallbackImage: WORDPRESS_MARKETING_IMAGES.remeron,
    supportPillars: [
      {
        title: "Focused on better nights and steadier mornings",
        description:
          "The category is meant to explain the sleep-support options clearly instead of dropping users into a noisy imported wall of text.",
      },
      {
        title: "Support for onset, staying asleep, and next-day function",
        description:
          "Different treatments in this category target different sleep problems, so the page should help users compare them cleanly.",
      },
      {
        title: "Simple handoff into care",
        description:
          "Users can review the details first, then move into the matching sleep-support funnel when they feel ready.",
      },
    ],
    careSteps: [
      {
        title: "Compare the sleep-support options",
        description:
          "Look at the details pages first so the next step feels specific to trouble falling asleep, staying asleep, or daytime recovery.",
      },
      {
        title: "Complete a quick online intake",
        description:
          "A clinician reviews sleep patterns, medication history, and goals before recommending treatment.",
      },
      {
        title: "Build a steadier routine with follow-up care",
        description:
          "Treatment continues with refill support, medication guidance, and provider follow-through as the plan evolves.",
      },
    ],
  },
  "glutathione-ldn": {
    eyebrow: "Cellular Repair And Recovery",
    title: "Recovery-focused support for inflammation, energy, and long-term resilience.",
    description:
      "Explore glutathione and LDN-based treatment options designed to support recovery, cellular repair, and everyday vitality.",
    highlights: [
      "Transparent monthly plans",
      "Clinician-guided care",
      "Ongoing refill and support access",
    ],
    ctaText: "Explore recovery support",
    fallbackCtaHref: "/glutathione-low-dose-naltrexone-ldn",
    fallbackImage: WORDPRESS_MARKETING_IMAGES.glutathioneLdn,
    supportPillars: [
      {
        title: "Recovery-oriented from the start",
        description:
          "The category is framed around inflammation, resilience, and everyday recovery instead of generic imported sales blocks.",
      },
      {
        title: "Built for longer-term support, not hype",
        description:
          "The treatments in this group are positioned around consistency, clinician review, and measured follow-through.",
      },
      {
        title: "Clear bridge into the right route",
        description:
          "Users can learn what each option is for, then continue into the matching detail or funnel path with less confusion.",
      },
    ],
    careSteps: [
      {
        title: "Review the recovery-focused options",
        description:
          "Start by comparing the detail pages so the next step matches your goals around inflammation, resilience, and energy.",
      },
      {
        title: "Get clinician input on fit and safety",
        description:
          "A licensed provider reviews symptoms, history, and treatment goals before recommending a plan.",
      },
      {
        title: "Stay on track with ongoing support",
        description:
          "Refill access and follow-up care help turn the category into a usable care path instead of a one-click dead end.",
      },
    ],
  },
};

export function resolveMarketingCategorySlug(slug) {
  return CATEGORY_ALIAS_MAP[slug] || null;
}

export function resolveMarketingProductSlug(slug) {
  return PRODUCT_ALIAS_MAP[slug] || null;
}

export function getMarketingCategoryPath(slug) {
  const resolvedSlug = resolveMarketingCategorySlug(slug);
  return resolvedSlug ? `/${resolvedSlug}` : null;
}

export function getMarketingProductPath(slug) {
  const resolvedSlug = resolveMarketingProductSlug(slug);
  if (!resolvedSlug) {
    return null;
  }

  if (resolvedSlug === "nad-injections") {
    return MARKETING_ROUTE_PATHS.nad;
  }

  return `/${resolvedSlug}`;
}
