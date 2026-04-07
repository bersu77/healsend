import "server-only";

import net from "node:net";
import { prisma } from "@/lib/prisma";
import { productContent as fallbackProductContent } from "@/components/marketing/product-content";
import {
  MARKETING_PRIMARY_PRODUCT_SLUGS,
  getMarketingProductDetailPath,
  getProductOnboardingPath,
} from "@/lib/product-routing";
import {
  MARKETING_CATEGORY_PAGE_CONTENT,
  MARKETING_ROUTE_PATHS,
  resolveMarketingCategorySlug,
  resolveMarketingProductSlug,
} from "@/lib/marketing-pages";
import {
  buildPublicCatalogProductWhere,
  filterReadyPublicCatalogProducts,
  getPublicCatalogPrimaryImage,
  isExcludedPublicCatalogSlug,
  isPublicCatalogProductReady,
} from "@/lib/public-catalog";
import {
  getDefaultMarketingImageForPath,
  isSuspiciousMarketingImage,
  normalizeMarketingImage,
  WORDPRESS_MARKETING_IMAGES,
} from "@/lib/marketing-images";
import { SYNTHETIC_MARKETING_ARTICLE_PAGES } from "@/lib/marketing-articles";
import {
  formatUsdCompact,
  getProductPriceSummary,
  getProductSubscriptionPlans,
} from "@/lib/pricing";
import { humanizeSlugTitle, isSlugLikeTitle } from "@/lib/seo";

const HOME_CATEGORY_ORDER = [
  { slug: "weight-loss", key: "weightLossProducts" },
  { slug: "sexual-health", key: "sexualHealthProducts" },
  { slug: "anti-aging", key: "energyProducts" },
  { slug: "strength-recovery", key: "strengthProducts" },
];

const PSYCHIATRY_FEATURED_PAGE_CONFIG = [
  {
    slug: "adderall",
    label: "ADHD support",
    description:
      "Clinician-guided stimulant care for focus, consistency, and day-to-day performance.",
  },
  {
    slug: "vyvanse-lisdexamfetamine",
    label: "ADHD support",
    description:
      "Longer-acting prescription support designed for steady attention and structured routines.",
  },
  {
    slug: "lexapro",
    label: "Depression and anxiety",
    description:
      "A widely used SSRI option for depression and anxiety with licensed provider oversight.",
  },
  {
    slug: "wellbutrin-bupropion",
    label: "Depression care",
    description:
      "Non-SSRI depression support often used when energy, motivation, and focus are part of the picture.",
  },
  {
    slug: "propranolol",
    label: "Performance anxiety",
    description:
      "Fast-acting support for physical anxiety symptoms, stressful events, and high-pressure moments.",
  },
  {
    slug: "xanax-alprazolam",
    label: "Acute anxiety relief",
    description:
      "Fast-acting anxiety support evaluated carefully by licensed clinicians for the right fit.",
  },
];

const PSYCHIATRY_INSURANCE_LOGOS = [
  "/images/marketing/logos/insurance-logo-1.png",
  "/images/marketing/logos/insurance-logo-2.png",
  "/images/marketing/logos/insurance-logo-cigna-white.png",
  "/images/marketing/logos/insurance-logo-united-white.png",
  "/images/marketing/logos/insurance-logo-3.png",
  "/images/marketing/logos/insurance-logo-medicaid-white.svg",
  "/images/marketing/logos/insurance-logo-medicare-white.svg",
];

const MENTAL_HEALTH_CARE_STEPS = [
  {
    title: "Start with a secure intake",
    description:
      "Share symptoms, history, and priorities so a licensed clinician can review the full picture.",
  },
  {
    title: "Get medication-specific guidance",
    description:
      "Your provider evaluates fit, dosing, risks, and next steps before treatment moves forward.",
  },
  {
    title: "Stay supported as care continues",
    description:
      "Use your HealSend account for follow-up communication, order tracking, and ongoing care access.",
  },
];

const SLEEP_CARE_STEPS = [
  {
    title: "Describe your sleep pattern",
    description:
      "Start with a short intake that covers sleep onset, nighttime wakeups, and daytime impact.",
  },
  {
    title: "Review treatment fit with a clinician",
    description:
      "A licensed provider reviews your insomnia history, medication fit, and safety considerations.",
  },
  {
    title: "Manage follow-up in one place",
    description:
      "Track progress, revisit your account, and keep care moving in one place.",
  },
];

const WEIGHT_LOSS_CARE_STEPS = [
  {
    title: "Start with a weight-loss intake",
    description:
      "Share appetite, food-noise, weight history, and treatment goals in a short secure intake.",
  },
  {
    title: "Get clinician-guided treatment review",
    description:
      "Your provider reviews fit, medication options, dosing, and safety before treatment moves forward.",
  },
  {
    title: "Track progress with follow-up support",
    description:
      "Stay connected to orders, care updates, and ongoing progress in your account.",
  },
];

const LONGEVITY_CARE_STEPS = [
  {
    title: "Describe your goals and symptoms",
    description:
      "Start with a secure intake focused on energy, recovery, longevity, body composition, or performance goals.",
  },
  {
    title: "Review fit with a clinician",
    description:
      "A licensed provider reviews your goals, treatment fit, and the right next step for your protocol.",
  },
  {
    title: "Stay on track with ongoing support",
    description:
      "Manage follow-up, account access, and care continuity in one place.",
  },
];

const STRENGTH_RECOVERY_CARE_STEPS = [
  {
    title: "Start with your recovery and performance goals",
    description:
      "Share recovery priorities, training goals, hormone-support questions, and symptom context in a secure intake.",
  },
  {
    title: "Review protocol fit with a clinician",
    description:
      "A licensed provider reviews treatment fit, recovery goals, and the safest next step for your plan.",
  },
  {
    title: "Stay consistent with ongoing support",
    description:
      "Use your account for follow-up communication, order visibility, and care continuity.",
  },
];

const SEXUAL_HEALTH_CARE_STEPS = [
  {
    title: "Begin with a private online intake",
    description:
      "Share symptoms, goals, and health context privately so your clinician can review the right details.",
  },
  {
    title: "Get a treatment-specific review",
    description:
      "Your provider reviews medication fit, risks, and the most appropriate next step for care.",
  },
  {
    title: "Continue discreetly through HealSend",
    description:
      "Track care, revisit your account, and keep the treatment process moving with ongoing follow-up.",
  },
];

const NATIVE_MEDICATION_PAGE_CONFIG = {
  adderall: {
    eyebrow: "ADHD Medication",
    title: "Adderall care with clearer next steps.",
    description:
      "Review how stimulant-based ADHD treatment is evaluated, what provider-guided care looks like, and how ongoing monitoring fits into the HealSend flow.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "Understand how stimulant-based ADHD care is evaluated, prescribed, and followed over time.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "Stimulant medications are controlled substances and require clinician review before they are prescribed.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  "vyvanse-lisdexamfetamine": {
    eyebrow: "ADHD Medication",
    title: "Vyvanse care with a clear, clinician-guided path.",
    description:
      "Understand how longer-acting ADHD medication is reviewed, what to expect from clinician oversight, and how follow-up fits into care.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "Review longer-acting ADHD treatment with guidance around fit, follow-up, and ongoing monitoring.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "Stimulant medications require careful clinician review and are not appropriate for every patient or symptom profile.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  lexapro: {
    eyebrow: "Depression And Anxiety Support",
    title: "Lexapro guidance for anxiety and depression support.",
    description:
      "See how SSRI-based anxiety and depression care is explained, reviewed, and supported with clinician guidance.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "A cleaner landing page for medication information, care expectations, and the next step into psychiatry support.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "SSRI treatment should be reviewed around side effects, interactions, and dose changes with a licensed clinician.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  "wellbutrin-bupropion": {
    eyebrow: "Depression Support",
    title: "Wellbutrin care for mood, focus, and energy support.",
    description:
      "Review how bupropion-based treatment is positioned, what use cases it may support, and where clinician oversight matters.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "Review how bupropion may fit into a broader mental-health plan with clear next steps and follow-up.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "Medication fit, contraindications, and dose changes should be evaluated carefully with clinician review.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  propranolol: {
    eyebrow: "Performance Anxiety Support",
    title: "Propranolol care with the noise stripped out.",
    description:
      "Understand how propranolol is used for physical anxiety symptoms and performance situations, with a clearer path into clinician review.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "Review how propranolol may help with physical anxiety symptoms and performance situations.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "Beta-blocker use still requires clinician review around symptoms, blood pressure, heart rate, and medication history.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  "xanax-alprazolam": {
    eyebrow: "Acute Anxiety Support",
    title: "Xanax information, presented with a safer care context.",
    description:
      "Review how short-term anxiety relief is discussed, where the major risks sit, and how clinician oversight fits into care.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "A cleaner native page for medication context, care expectations, and the route back into psychiatry support.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "Benzodiazepines carry sedation, dependence, and interaction risks, so they require careful clinician review.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  "paxil-paroxetine": {
    eyebrow: "Depression And Anxiety Support",
    title: "Paxil care for anxiety and depression support.",
    description:
      "Get a cleaner view into paroxetine-based care, what symptoms it may support, and how clinician oversight fits into treatment decisions.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "See how paroxetine may fit into a clinician-guided care plan with follow-up and symptom review.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "SSRI care should be reviewed carefully for side effects, tapering, and medication interactions.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  prozac: {
    eyebrow: "Depression And Anxiety Support",
    title: "Prozac care for anxiety, depression, and ongoing support.",
    description:
      "Understand how fluoxetine-based treatment is positioned, what ongoing support can look like, and how to navigate the next step into care.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "Understand how fluoxetine may fit into symptom relief, follow-up care, and long-term treatment planning.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "Fluoxetine dosing and side effects should be reviewed with a clinician, especially during treatment changes.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  "klonopin-clonazepam": {
    eyebrow: "Acute Anxiety Support",
    title: "Clonazepam guidance with a safer, cleaner landing page.",
    description:
      "Review how clonazepam is discussed for panic and anxiety, plus the oversight and risk review that should come with it.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "Review how clonazepam is discussed for panic and anxiety alongside careful clinician oversight.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "Benzodiazepines require careful clinician review because of sedation, dependence, and interaction risk.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  "lorazepam-ativan": {
    eyebrow: "Acute Anxiety Support",
    title: "Lorazepam care with clearer expectations and next steps.",
    description:
      "See how fast-acting anxiety support is presented, where the caution points sit, and how the next steps are handled.",
    clusterTitle: "Mental health care path",
    clusterDescription:
      "See how fast-acting anxiety support fits into a safer, closely reviewed care plan.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.psychiatry,
      label: "Explore mental health care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "Lorazepam is a benzodiazepine and should be evaluated carefully for safety, fit, and dependence risk.",
    careSteps: MENTAL_HEALTH_CARE_STEPS,
  },
  "ambien-zolpidem": {
    eyebrow: "Sleep Support",
    title: "Ambien guidance with a clearer sleep-care path.",
    description:
      "Understand how zolpidem-based insomnia care is described, what the main safety considerations are, and how follow-up is handled.",
    clusterTitle: "Sleep support path",
    clusterDescription:
      "Understand how zolpidem-based sleep support fits into treatment expectations, safety review, and follow-up care.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.sleep,
      label: "Explore sleep support",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    safetyNote:
      "Sleep medications should be reviewed carefully for next-day effects, interactions, and fit with your sleep history.",
    careSteps: SLEEP_CARE_STEPS,
  },
};

const NATIVE_TREATMENT_PAGE_CONFIG = {
  "tirzepatide-sublingual": {
    eyebrow: "Weight Loss Support",
    title: "Sublingual tirzepatide for needle-free weight-loss support.",
    description:
      "Understand how needle-free tirzepatide support is positioned, what the care path looks like, and where clinician review fits into the process.",
    clusterTitle: "Weight-loss care path",
    clusterDescription:
      "See how needle-free tirzepatide may fit into a broader weight-management plan with clinician review.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.weightLoss,
      label: "Explore weight-loss care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    safetyNote:
      "GLP-1 and related therapies still require clinician review around dosing, side effects, and contraindications.",
    careSteps: WEIGHT_LOSS_CARE_STEPS,
  },
  "oral-tirzepatide": {
    eyebrow: "Weight Loss Support",
    title: "Oral tirzepatide for flexible weight-loss support.",
    description:
      "Review how oral tirzepatide support is explained, what expectations matter, and where the next step into clinician-guided care starts.",
    clusterTitle: "Weight-loss care path",
    clusterDescription:
      "Review how oral tirzepatide may fit into appetite control, clinician oversight, and ongoing follow-up.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.weightLoss,
      label: "Explore weight-loss care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    safetyNote:
      "GLP-1 care should be reviewed around dosing, side effects, and medication history with a clinician.",
    careSteps: WEIGHT_LOSS_CARE_STEPS,
  },
  "tirzepatide-b12": {
    eyebrow: "Weight Loss Support",
    title: "Tirzepatide + B12 support with a cleaner care path.",
    description:
      "See how combination weight-loss support is positioned, what the treatment path looks like, and how the next steps are handled.",
    clusterTitle: "Weight-loss care path",
    clusterDescription:
      "Understand how combination weight-loss support may fit into energy, appetite control, and treatment follow-through.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.weightLoss,
      label: "Explore weight-loss care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    safetyNote:
      "Combination weight-loss protocols still require clinician review for fit, dosing, and side-effect monitoring.",
    careSteps: WEIGHT_LOSS_CARE_STEPS,
  },
  "semaglutide-b12": {
    eyebrow: "Weight Loss Support",
    title: "Semaglutide + B12 for weight-loss support and energy balance.",
    description:
      "Review how combination semaglutide support is described, what a provider-guided path looks like, and where the custom weight-loss flow begins.",
    clusterTitle: "Weight-loss care path",
    clusterDescription:
      "Review how semaglutide plus B12 may fit into appetite control, energy support, and clinician-guided care.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.weightLoss,
      label: "Explore weight-loss care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    safetyNote:
      "Semaglutide-based care still requires clinician review for appropriateness, side effects, and dose changes.",
    careSteps: WEIGHT_LOSS_CARE_STEPS,
  },
  "tirzepatide-injection": {
    eyebrow: "Weight Loss Support",
    title: "Tirzepatide injections for structured weight-loss support.",
    description:
      "Understand how injection-based tirzepatide care is evaluated, what the treatment process looks like, and where clinician review fits in.",
    clusterTitle: "Weight-loss care path",
    clusterDescription:
      "Review how injectable tirzepatide may fit into appetite control, weight management, and ongoing follow-up.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.weightLoss,
      label: "Explore weight-loss care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    safetyNote:
      "Injection-based weight-loss care requires clinician review, dose titration, and side-effect monitoring.",
    careSteps: WEIGHT_LOSS_CARE_STEPS,
  },
  lipotropic: {
    eyebrow: "Weight Loss Support",
    title: "Lipotropic injections for energy, metabolism, and weight support.",
    description:
      "Learn how lipotropic injections can support metabolism, energy, and weight-management goals with clinician-guided care.",
    clusterTitle: "Weight-loss care path",
    clusterDescription:
      "Lipotropic injections can complement a broader weight-management plan with provider-guided next steps.",
    primaryCta: {
      href: getProductOnboardingPath("lipotropic") || MARKETING_ROUTE_PATHS.weightLoss,
      label: "Get started",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    careSteps: WEIGHT_LOSS_CARE_STEPS,
  },
  "l-cartinine-injection": {
    eyebrow: "Metabolic Support",
    title: "L-carnitine support with a cleaner treatment page.",
    description:
      "See how this metabolic-support treatment is presented and how it fits into a broader care path.",
    clusterTitle: "Weight-loss care path",
    clusterDescription:
      "See how L-carnitine may support fat metabolism, energy, and a broader weight-management plan.",
    primaryCta: {
      href:
        getProductOnboardingPath("l-cartinine-injection") ||
        MARKETING_ROUTE_PATHS.weightLoss,
      label: "Get started",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    careSteps: WEIGHT_LOSS_CARE_STEPS,
  },
  "mic-injection": {
    eyebrow: "Metabolic Support",
    title: "MIC injections, now inside the custom treatment flow.",
    description:
      "Review how MIC therapy is explained, how it fits into the broader metabolic-support path, and where to continue next.",
    clusterTitle: "Weight-loss care path",
    clusterDescription:
      "Review how MIC injections can support energy, metabolism, and a clinician-guided weight-loss plan.",
    primaryCta: {
      href: getProductOnboardingPath("mic-injection") || MARKETING_ROUTE_PATHS.weightLoss,
      label: "Get started",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    careSteps: WEIGHT_LOSS_CARE_STEPS,
  },
  "sermorelin-injection-2": {
    eyebrow: "Recovery And Hormone Support",
    title: "Sermorelin support for recovery, sleep, and hormone health.",
    description:
      "Understand how sermorelin-based support is presented, where clinician review fits in, and what the next step looks like.",
    seoTitle: "Sermorelin Support | Strength And Recovery Care",
    seoDescription:
      "Explore sermorelin support inside HealSend's strength-and-recovery experience, with clinician-guided review and clearer next steps.",
    clusterTitle: "Strength-and-recovery care path",
    clusterDescription:
      "Understand how sermorelin may fit into recovery, performance, and clinician-guided hormone support.",
    primaryCta: {
      href:
        getProductOnboardingPath("sermorelin-injection-2") ||
        MARKETING_ROUTE_PATHS.strength,
      label: "Get started",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    careSteps: STRENGTH_RECOVERY_CARE_STEPS,
  },
  "nad-patches": {
    eyebrow: "Energy And Longevity",
    title: "NAD+ patches for energy, recovery, and longevity support.",
    description:
      "Review how NAD+ patch support is described and how it fits into anti-aging care.",
    clusterTitle: "Longevity care path",
    clusterDescription:
      "Review how NAD+ patch support may fit into energy, recovery, and longevity-focused care.",
    primaryCta: {
      href: MARKETING_ROUTE_PATHS.antiAging,
      label: "Explore anti-aging care",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    careSteps: LONGEVITY_CARE_STEPS,
  },
  "cjc-1295-ipamorelin": {
    eyebrow: "Recovery And Performance Support",
    title: "CJC-1295 + Ipamorelin for recovery, sleep, and performance support.",
    description:
      "Understand how peptide-based recovery support is positioned and where the next step into care begins.",
    seoTitle: "CJC-1295 + Ipamorelin | Strength And Recovery Care",
    seoDescription:
      "Explore CJC-1295 + Ipamorelin inside HealSend's strength-and-recovery experience, with clinician-guided review and clearer next steps.",
    clusterTitle: "Strength-and-recovery care path",
    clusterDescription:
      "See how peptide-based recovery support may fit into a strength, performance, and follow-up care plan.",
    primaryCta: {
      href:
        getProductOnboardingPath("cjc-1295-ipamorelin") ||
        MARKETING_ROUTE_PATHS.strength,
      label: "Get started",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    careSteps: STRENGTH_RECOVERY_CARE_STEPS,
  },
  "viagra-sildenafil": {
    eyebrow: "Sexual Health Support",
    title: "Sildenafil guidance for private, clinician-reviewed ED care.",
    description:
      "Review how sildenafil-based ED treatment is presented, what the private care path looks like, and how to continue with clinician guidance.",
    clusterTitle: "Sexual-health care path",
    clusterDescription:
      "Understand how ED treatment fits into private intake, prescribing review, and ongoing support.",
    primaryCta: {
      href:
        getProductOnboardingPath("viagra-sildenafil") ||
        MARKETING_ROUTE_PATHS.sexualHealth,
      label: "Get started",
    },
    secondaryCta: {
      href: MARKETING_ROUTE_PATHS.shop,
      label: "Browse all treatments",
    },
    careSteps: SEXUAL_HEALTH_CARE_STEPS,
  },
};

const CUSTOM_PAGE_CANONICAL_REDIRECTS = {
  "buy-adderall-online": "/adderall",
  "buy-ativan-online-lorazepam": "/lorazepam-ativan",
  "buy-clonazepam-online-klonopin": "/klonopin-clonazepam",
  "buy-lexapro-escitalopram-online": "/lexapro",
  "buy-wellbutrin-online-bupropion": "/wellbutrin-bupropion",
  "buy-xanax-online-alprazolam": "/xanax-alprazolam",
  "inderal-buy-propranolol": "/propranolol",
  "glp1-weight-loss-injections-landing-page-ts": "/weight-loss",
  "glp-1-weight-loss-2": "/weight-loss",
};

const SYNTHETIC_MARKETING_PRODUCT_PAGE_CONFIG = {
  "pt-141-surge-2-in-1": {
    name: "PT-141 + Oxytocin Nasal Sprays",
    summary:
      "A clinician-guided intimacy-support route that combines PT-141 arousal support with Oxytocin-based connection and relationship support.",
    image: WORDPRESS_MARKETING_IMAGES.oxytocin,
    price: {
      firstMonth: 149,
      regular: 189,
      savings: 40,
    },
    seoTitle: "PT-141 + Oxytocin Nasal Sprays | HealSend",
    seoDescription:
      "Targets brain arousal centers for a direct libido boost. Total mental desire meets deeper emotional bonding with clinician-guided follow-through.",
    tabs: {
      benefits: [
        {
          iconName: "Sparkles",
          text: "Pairs arousal support with intimacy and connection support in one guided care path.",
        },
        {
          iconName: "Zap",
          text: "Built for patients exploring desire, responsiveness, and relationship-centered sexual wellness.",
        },
        {
          iconName: "ShieldCheck",
          text: "Still reviewed by a licensed clinician before treatment moves forward.",
        },
      ],
      pricing: {
        title: "Choose the PT-141 + Oxytocin plan that matches your routine.",
        sizes: [
          {
            title: "Combined nasal spray protocol",
            subtitle:
              "A paired support route positioned around desire, arousal, and partner connection with clinician review.",
            plans: [
              { name: "First Month", firstMonthPrice: 149, regularPrice: 189 },
              { name: "Ongoing Plan", firstMonthPrice: 189, regularPrice: 189 },
            ],
          },
        ],
      },
      description:
        "PT-141 + Oxytocin is presented here as a sexual-health route for patients looking for a more complete intimacy-support protocol, with a clearer next step into provider review and follow-up care.",
    },
    faqs: [
      {
        question: "What is the PT-141 + Oxytocin route designed to support?",
        answer:
          "This route is positioned around desire, arousal, intimacy, and partner connection with clinician-guided review.",
      },
      {
        question: "Does this replace provider review?",
        answer:
          "No. A licensed clinician still reviews your health history, goals, and treatment fit before treatment can move forward.",
      },
      {
        question: "What happens after I start?",
        answer:
          "You complete the guided intake, move into clinician review, and keep follow-up communication and order visibility inside your account.",
      },
    ],
    testimonials: [
      {
        name: "Alyssa M.",
        role: "Verified member",
        quote:
          "What helped most was having one clear path instead of trying to guess which option matched what I was experiencing.",
        highlight: "A clearer route into care",
      },
      {
        name: "Jordan R.",
        role: "Verified member",
        quote:
          "The whole process felt private and straightforward, and the next steps were easier to understand than on most wellness sites.",
        highlight: "Private, simple, and structured",
      },
      {
        name: "Tiana C.",
        role: "Verified member",
        quote:
          "I liked that the treatment explanation, intake, and follow-up all felt connected instead of scattered.",
        highlight: "Better continuity from intake to care",
      },
    ],
    featureSection: {
      title: "Combined intimacy support with a clearer next step into care.",
      description: [
        "This route is positioned for patients exploring both physical arousal support and deeper intimacy or bonding support.",
        "Instead of splitting the journey across disconnected pages, the combined product keeps education, intake, and clinician follow-through in one path.",
      ],
      image: WORDPRESS_MARKETING_IMAGES.oxytocin,
    },
    supportSection: {
      title: "Built around desire, responsiveness, and connection.",
      subtitle:
        "A sexual-health route designed to feel more complete than a single-angle treatment page.",
      features: [
        {
          iconName: "Sparkles",
          title: "Desire and intimacy support",
          description:
            "Explores both arousal and connection support in a single product route.",
        },
        {
          iconName: "Target",
          title: "Private clinician-guided review",
          description:
            "Keeps treatment fit, safety, and next steps tied to a licensed-provider decision.",
        },
        {
          iconName: "ShieldCheck",
          title: "Ongoing follow-through",
          description:
            "Your account stays part of the experience for updates, visibility, and care continuity.",
        },
      ],
    },
    benefitsCarouselTitle: "Why patients explore PT-141 + Oxytocin support",
    benefitsCarousel: [
      {
        image: WORDPRESS_MARKETING_IMAGES.pt141,
        text: "Targets desire and arousal support through a dedicated sexual-wellness route.",
      },
      {
        image: WORDPRESS_MARKETING_IMAGES.oxytocin,
        text: "Adds an intimacy and bonding-oriented layer to the care conversation.",
      },
      {
        image: WORDPRESS_MARKETING_IMAGES.pt141,
        text: "Keeps the product, intake, and clinician review path aligned from the start.",
      },
    ],
    researchSection: {
      title: "Why patients consider the combined route",
      image: WORDPRESS_MARKETING_IMAGES.pt141,
      points: [
        "Desire and arousal support",
        "Intimacy and partner-connection support",
        "A single clinician-guided intake path",
        "Clear follow-up through your HealSend account",
      ],
    },
    labTestedSection: {
      title: "Lab tested medications for quality & potency",
      description:
        "Our medication is delivered from a state licensed pharmacy in our network, right to your door when you need it.",
      image: WORDPRESS_MARKETING_IMAGES.oxytocin,
    },
    relatedProducts: [
      {
        id: "pt-141-nasal-spray",
        name: "PT-141 Nasal Spray Rx",
        image: WORDPRESS_MARKETING_IMAGES.pt141,
      },
      {
        id: "oxytocin-nasal-spray",
        name: "Oxytocin Nasal Spray Rx",
        image: WORDPRESS_MARKETING_IMAGES.oxytocin,
      },
    ],
    closingCta: {
      eyebrow: "Ready for a more connected sexual-health path?",
      title: "See whether PT-141 + Oxytocin support fits your goals.",
      description:
        "Review the treatment route, complete the guided intake, and keep the next steps clear from clinician review through follow-up.",
      bullets: [
        "Private online intake and clinician review",
        "Transparent pricing and ongoing support visibility",
        "Discreet fulfillment through licensed pharmacy partners",
        "A cleaner sexual-health path with clearer follow-through",
      ],
      planLabel: "PT-141 + Oxytocin Nasal Sprays",
      supportNote:
        "Treatment fit depends on licensed clinician review, medical history, and the safest next step for care.",
    },
  },
  enclomiphene: {
    name: "Enclomiphene",
    summary:
      "Hormone-support care focused on natural testosterone production, energy, recovery, and fertility-aware treatment planning.",
    image: WORDPRESS_MARKETING_IMAGES.enclomiphene,
    price: {
      firstMonth: 149,
      regular: 189,
      savings: 40,
    },
    seoTitle: "Enclomiphene | Strength And Recovery Care",
    seoDescription:
      "Explore Enclomiphene inside HealSend's strength-and-recovery care path with clinician-guided review, transparent pricing, and ongoing follow-up support.",
    tabs: {
      benefits: [
        {
          iconName: "Target",
          text: "Supports natural testosterone production without defaulting to a generic imported landing page.",
        },
        {
          iconName: "TrendingUp",
          text: "Built around energy, strength, recovery, and long-term performance follow-through.",
        },
        {
          iconName: "ShieldCheck",
          text: "Clinician-reviewed care with transparent monthly pricing and ongoing support access.",
        },
      ],
      pricing: {
        title: "Choose the plan that fits your support cadence.",
        sizes: [
          {
            title: "Enclomiphene tablets",
            subtitle:
              "A clinician-guided option for men focused on hormone support, energy, and fertility-aware care.",
            plans: [
              { name: "First Month", firstMonthPrice: 149, regularPrice: 189 },
              { name: "Ongoing Plan", firstMonthPrice: 189, regularPrice: 189 },
            ],
          },
        ],
      },
      description:
        "Enclomiphene is positioned here as a strength-and-recovery treatment route for people looking at natural testosterone support, sustainable energy, and better day-to-day performance with provider oversight.",
    },
    faqs: [
      {
        question: "What is Enclomiphene support designed to help with?",
        answer:
          "This route is presented around natural testosterone support, energy, recovery, and fertility-aware hormone care.",
      },
      {
        question: "Does this replace clinician review?",
        answer:
          "No. The page is only the entry point. A licensed clinician still reviews eligibility, goals, and treatment fit.",
      },
      {
        question: "How do I continue from here?",
        answer:
          "Use the onboarding flow to start the strength-and-recovery intake and move into provider review.",
      },
    ],
    featureSection: {
      title: "Strength-and-recovery care built around performance and follow-through.",
      description: [
        "Explore hormone-support care with transparent pricing, recovery context, and clinician-guided next steps.",
        "Review how Enclomiphene can fit into energy, performance, and long-term follow-up support.",
      ],
      image: WORDPRESS_MARKETING_IMAGES.enclomiphene,
    },
    supportSection: {
      title: "Designed around how you feel, perform, and recover.",
      subtitle:
        "Built for patients focused on strength, vitality, recovery, and ongoing support.",
      features: [
        {
          iconName: "Zap",
          title: "Energy and drive",
          description:
            "Built for routes where patients are exploring vitality, consistency, and day-to-day performance support.",
        },
        {
          iconName: "Target",
          title: "Strength and recovery",
          description:
            "Presented inside the broader strength-and-recovery category rather than as an isolated landing page.",
        },
        {
          iconName: "ShieldCheck",
          title: "Clinician-guided review",
          description:
            "Treatment fit, follow-up, and ongoing care still run through licensed-provider review.",
        },
      ],
    },
    benefitsCarouselTitle: "Why Enclomiphene sits in the strength-and-recovery path",
    benefitsCarousel: [
      {
        image: WORDPRESS_MARKETING_IMAGES.enclomiphene,
        text: "Keeps hormone-support care tied to recovery and performance goals.",
      },
      {
        image: WORDPRESS_MARKETING_IMAGES.sermorelin,
        text: "Pairs naturally with adjacent recovery-support routes in the same category.",
      },
      {
        image: WORDPRESS_MARKETING_IMAGES.enclomiphene,
        text: "Keeps hormone-support care connected to a clear next step when you're ready to begin.",
      },
    ],
    researchSection: {
      title: "Why patients explore Enclomiphene",
      image: WORDPRESS_MARKETING_IMAGES.enclomiphene,
      points: [
        "Energy and drive",
        "Strength and recovery support",
        "Fertility-aware hormone care",
        "A clear next step into clinician review",
      ],
    },
    labTestedSection: {
      title: "Care delivered with clear guidance and consistent follow-up",
      description:
        "Get a straightforward view of treatment details, pricing, and next steps before you begin.",
      image: WORDPRESS_MARKETING_IMAGES.enclomiphene,
    },
    relatedProducts: [
      {
        id: "sermorelin-injection-2",
        name: "Sermorelin Injection Rx",
        image: WORDPRESS_MARKETING_IMAGES.sermorelin,
      },
      {
        id: "cjc-1295-ipamorelin",
        name: "CJC-1295 + Ipamorelin Rx",
        image: WORDPRESS_MARKETING_IMAGES.sermorelin,
      },
    ],
  },
};

function buildNativeLandingPage(basePage, config, nativeTemplate) {
  const fallbackHeroImage =
    getDefaultMarketingImageForPath(config.primaryCta?.href || `/${basePage.slug}`) ||
    WORDPRESS_MARKETING_IMAGES.nadInjection;
  const normalizedHeroImage =
    normalizeMarketingImage(basePage.heroImage, fallbackHeroImage) ||
    fallbackHeroImage;
  const heroImage =
    normalizedHeroImage === WORDPRESS_MARKETING_IMAGES.nadInjection &&
    config.primaryCta?.href &&
    config.primaryCta.href !== MARKETING_ROUTE_PATHS.antiAging
      ? fallbackHeroImage
      : normalizedHeroImage;
  const normalizedHighlights = normalizeStringArray(basePage.highlights)
    .map((entry) => sanitizeMarketingHighlightItem(entry))
    .filter(Boolean);

  const nativePage = {
    ...basePage,
    nativeTemplate,
    heroImage,
    seoTitle: config.seoTitle || basePage.seoTitle || null,
    seoDescription: config.seoDescription || basePage.seoDescription || null,
    title: config.title || basePage.title,
    eyebrow: config.eyebrow || basePage.eyebrow,
    description: config.description || basePage.description,
    highlights:
      normalizedHighlights.length > 0
        ? normalizedHighlights
        : normalizeStringArray(config.highlights).filter(Boolean),
    primaryCta: config.primaryCta,
    secondaryCta: config.secondaryCta || {
      href: MARKETING_ROUTE_PATHS.login,
      label: "Access your account",
    },
    clusterTitle: config.clusterTitle,
    clusterDescription: config.clusterDescription,
    safetyNote: config.safetyNote,
    careSteps: config.careSteps || [],
  };

  return {
    ...nativePage,
    productPageData: buildUnifiedNativeProductPageData(nativePage),
  };
}

function buildSyntheticNativeLandingPage(slug, config, nativeTemplate) {
  const primaryHref = config.primaryCta?.href || MARKETING_ROUTE_PATHS.shop;
  const heroImage =
    normalizeMarketingImage(
      config.heroImage,
      getDefaultMarketingImageForPath(primaryHref),
    ) || getDefaultMarketingImageForPath(primaryHref);

  return buildNativeLandingPage(
    {
      slug,
      title: config.title || humanizeSlugTitle(slug),
      eyebrow: config.eyebrow || "HealSend",
      description:
        config.description ||
        "Explore this treatment with clear details, pricing context, and the right next step into care.",
      heroImage,
      highlights: normalizeStringArray(config.highlights).filter(Boolean),
      offerDetails: null,
      html: "",
      introHtml: "",
      sectionBlocks: [],
      hasRenderableBody: false,
      faqItems: [],
      redirectTo: null,
      cta: null,
      emptyStateTitle: null,
      emptyStateDescription: null,
      seoTitle: config.seoTitle || null,
      seoDescription: config.seoDescription || config.description || null,
      sourcePostType: "page",
      sourceUrl: null,
      shortcodeNames: [],
      unresolvedShortcodes: [],
      shortcodeSupportCard: null,
      noIndex: false,
    },
    config,
    nativeTemplate,
  );
}

function getSyntheticNativeCustomPage(slug) {
  const syntheticArticle = SYNTHETIC_MARKETING_ARTICLE_PAGES[slug] || null;
  if (syntheticArticle) {
    return syntheticArticle;
  }

  const nativeMedicationConfig = NATIVE_MEDICATION_PAGE_CONFIG[slug];
  if (nativeMedicationConfig) {
    return buildSyntheticNativeLandingPage(
      slug,
      nativeMedicationConfig,
      "medicationLanding",
    );
  }

  const nativeTreatmentConfig = NATIVE_TREATMENT_PAGE_CONFIG[slug];
  if (nativeTreatmentConfig) {
    return buildSyntheticNativeLandingPage(
      slug,
      nativeTreatmentConfig,
      "treatmentLanding",
    );
  }

  return null;
}

function getSyntheticMarketingProductPageData(slug) {
  const config = SYNTHETIC_MARKETING_PRODUCT_PAGE_CONFIG[slug];
  if (!config) {
    return null;
  }

  return {
    id: slug,
    slug,
    inStock: true,
    ...config,
  };
}

function isLegalMarketingPage({ slug, title, sourceUrl }) {
  const haystack = [slug, title, sourceUrl].filter(Boolean).join(" ").toLowerCase();
  return /(privacy|terms|consent|refund|safety|consumer-health|telehealth|notice|hipaa)/.test(
    haystack,
  );
}

function shouldUseEditorialTemplate({ basePage, sourcePostType }) {
  const hasOfferSnapshot = Boolean(
    basePage.offerDetails?.primaryPrice || basePage.offerDetails?.secondaryPrice,
  );

  return (
    sourcePostType === "post" ||
    (!hasOfferSnapshot && (basePage.sectionBlocks?.length || 0) >= 3)
  );
}

const CUSTOM_PAGE_FALLBACKS = {
  checkout: {
    title: "Continue your order",
    description:
      "Use the custom cart and checkout flow in this app to complete your purchase.",
    label: "Go to cart",
    href: "/cart",
    redirectTo: "/cart",
  },
  "payment-complete": {
    title: "Order completed",
    description:
      "View your order confirmation and next steps here.",
    label: "View confirmation",
    href: "/order-confirmation",
  },
  "patient-login": {
    title: "Log in to HealSend",
    description:
      "Use the custom account experience to access your dashboard and ongoing care.",
    label: "Go to login",
    href: "/login",
    redirectTo: "/login",
  },
  "log-in-to-your-account": {
    title: "Log in to HealSend",
    description:
      "Use the custom account experience to access your dashboard and ongoing care.",
    label: "Go to login",
    href: "/login",
    redirectTo: "/login",
  },
  "patient-signup": {
    title: "Create your account",
    description:
      "Continue with the custom signup flow to create your HealSend account.",
    label: "Create account",
    href: "/signup",
    redirectTo: "/signup",
  },
  "my-account": {
    title: "Your HealSend account",
    description:
      "Account management is available through the custom dashboard experience.",
    label: "Open account",
    href: "/account",
    redirectTo: "/account",
  },
  "nadglutathione": {
    title: "Explore NAD+ and glutathione support",
    description:
      "Continue with the main NAD+ and glutathione treatment page.",
    label: "View NAD+",
    href: "/nad",
    redirectTo: "/nad",
  },
  "enclomiphene-2": {
    title: "Explore Enclomiphene",
    description:
      "Continue with the main Enclomiphene treatment page.",
    label: "View Enclomiphene",
    href: "/enclomiphene",
    redirectTo: "/enclomiphene",
  },
  "enclomiphene-3": {
    title: "Explore Enclomiphene",
    description:
      "Continue with the main Enclomiphene treatment page.",
    label: "View Enclomiphene",
    href: "/enclomiphene",
    redirectTo: "/enclomiphene",
  },
  "sleep-2": {
    title: "Explore Glutathione + LDN",
    description:
      "Continue with the main Glutathione and LDN treatment page.",
    label: "View product",
    href: "/glutathione-low-dose-naltrexone-ldn",
    redirectTo: "/glutathione-low-dose-naltrexone-ldn",
  },
  "glp-1-2": {
    title: "Explore weight-loss care",
    description:
      "Continue with the main weight-loss care page.",
    label: "View weight-loss care",
    href: "/weight-loss",
    redirectTo: "/weight-loss",
  },
  "vitality-core": {
    title: "Explore weight-loss care",
    description:
      "Continue with the main weight-loss care page.",
    label: "View weight-loss care",
    href: "/weight-loss",
    redirectTo: "/weight-loss",
  },
  "hrtlite": {
    title: "Explore strength and recovery care",
    description:
      "Continue with the main strength and recovery page.",
    label: "View strength and recovery",
    href: "/strength-recovery",
    redirectTo: "/strength-recovery",
  },
  "trt-prefunnel": {
    title: "Explore strength and recovery care",
    description:
      "Continue with the main strength and recovery page.",
    label: "View strength and recovery",
    href: "/strength-recovery",
    redirectTo: "/strength-recovery",
  },
  "oxytocin-prefunnel": {
    title: "Explore Oxytocin Nasal Spray",
    description:
      "Continue with the main Oxytocin treatment page.",
    label: "View Oxytocin",
    href: "/oxytocin-nasal-spray",
    redirectTo: "/oxytocin-nasal-spray",
  },
  "pt-141-prefunnel": {
    title: "Explore PT-141 Nasal Spray",
    description:
      "Continue with the main PT-141 treatment page.",
    label: "View PT-141",
    href: "/pt-141-nasal-spray",
    redirectTo: "/pt-141-nasal-spray",
  },
  "pt-141-oxytocin-questionnaire": {
    title: "Explore PT-141 + Oxytocin",
    description:
      "Continue with the main PT-141 and Oxytocin treatment page.",
    label: "View combined product",
    href: "/pt-141-surge-2-in-1",
    redirectTo: "/pt-141-surge-2-in-1",
  },
  "patient-order-history": {
    title: "Your HealSend order history",
    description:
      "Open your account to view order history and care updates.",
    label: "Open account",
    href: "/account",
    redirectTo: "/account",
  },
  "erectile-dysfunction-prefunnel": {
    title: "Start your performance-support intake",
    description:
      "Continue with the private intake for performance support.",
    label: "Start intake",
    href: "/funnels/performance-issues",
    redirectTo: "/funnels/performance-issues",
  },
  "resume-fluent-form-where-you-left": {
    title: "Resume your HealSend flow",
    description:
      "Use your HealSend account to continue from your latest saved step.",
    label: "Open account",
    href: "/account",
    redirectTo: "/account",
  },
  "get-started": {
    title: "Start your HealSend journey",
    description:
      "Start with the current HealSend care flow.",
    label: "Get started",
    href: "/",
    redirectTo: "/",
  },
  "nad-form": {
    title: "Start your NAD+ intake",
    description:
      "Begin the clinician-guided NAD+ intake.",
    label: "Start NAD+",
    href: "/funnels/nad-injection-therapy",
    redirectTo: "/funnels/nad-injection-therapy",
  },
  "nad-form-2": {
    title: "Start your NAD+ intake",
    description:
      "Begin the clinician-guided NAD+ intake.",
    label: "Start NAD+",
    href: "/funnels/nad-injection-therapy",
    redirectTo: "/funnels/nad-injection-therapy",
  },
  "pt-141-form": {
    title: "Start your sexual wellness intake",
    description:
      "Begin the guided intake for PT-141 and related sexual wellness options.",
    label: "Start intake",
    href: "/funnels/low-intimacy-drive",
    redirectTo: "/funnels/low-intimacy-drive",
  },
  "pt-141-intake-form": {
    title: "Start your sexual wellness intake",
    description:
      "Begin the guided intake for PT-141 and related sexual wellness options.",
    label: "Start intake",
    href: "/funnels/low-intimacy-drive",
    redirectTo: "/funnels/low-intimacy-drive",
  },
  "glp-1-weight-loss-intake": {
    title: "Start your GLP-1 intake",
    description:
      "Continue with the custom weight-loss eligibility flow.",
    label: "Start GLP-1 intake",
    href: "/funnels/glp-1",
    redirectTo: "/funnels/glp-1",
  },
  "glp-1-agreement-form": {
    title: "Continue your GLP-1 flow",
    description:
      "Continue with the current GLP-1 eligibility and consent flow.",
    label: "Open GLP-1 flow",
    href: "/funnels/glp-1",
    redirectTo: "/funnels/glp-1",
  },
  "metabolic-enhancers-initial-intake-form": {
    title: "Start your anti-aging intake",
    description:
      "Open the custom clinician-guided intake for energy and longevity support.",
    label: "Start intake",
    href: "/funnels/nad-injection-therapy",
    redirectTo: "/funnels/nad-injection-therapy",
  },
  test: {
    title: "Log in to HealSend",
    description:
      "Continue with the current HealSend login flow.",
    label: "Go to login",
    href: "/login",
    redirectTo: "/login",
  },
  "test-funnels": {
    title: "Explore Enclomiphene",
    description:
      "Continue with the main Enclomiphene treatment page.",
    label: "View Enclomiphene",
    href: "/enclomiphene",
    redirectTo: "/enclomiphene",
  },
};

const CUSTOM_PAGE_SHORTCODE_FALLBACKS = [
  {
    pattern: /\[woocommerce_checkout\]/i,
    cta: {
      title: "Continue to checkout",
      description:
        "Start in the cart before continuing to checkout.",
      label: "Go to cart",
      href: "/cart",
    },
  },
];

const LOCAL_DB_PROBE_TIMEOUT_MS = 250;
const LOCAL_DB_PROBE_CACHE_MS = 10_000;

const TAG_STYLE_MAP = {
  "most popular": { bg: "bg-green-500", text: "text-white" },
  "most effective": { bg: "bg-blue-600", text: "text-white" },
  "doctor recommended": { bg: "bg-blue-600", text: "text-white" },
  "best value": { bg: "bg-black", text: "text-white" },
  "needle free": { bg: "bg-blue-500", text: "text-white" },
  "needle-free": { bg: "bg-blue-500", text: "text-white" },
  rx: { bg: "bg-white", text: "text-black" },
  default: { bg: "bg-white", text: "text-black" },
};

const SHORTCODE_CATEGORY_ROUTE_MAP = {
  medication: "/funnels/glp-1",
  "249": "/funnels/glp-1",
  "250": "/funnels/glp-1",
  "weight-loss": "/funnels/glp-1",
  "glp-1": "/funnels/glp-1",
  "pt_141": "/funnels/low-intimacy-drive",
  "pt-141": "/funnels/low-intimacy-drive",
  oxytocin: "/funnels/low-intimacy-drive",
  "ed-meds": "/funnels/performance-issues",
  "nad-therapy": "/funnels/nad-injection-therapy",
  "nad+glutathione": "/funnels/nad-injection-therapy",
  nadglutathione: "/funnels/nad-injection-therapy",
  glutathione: "/funnels/nad-injection-therapy",
  "glutathione-ldn": "/funnels/nad-injection-therapy",
  "sermorelin-therapy": MARKETING_ROUTE_PATHS.strength,
  "hrt-lite": MARKETING_ROUTE_PATHS.strength,
  enclomiphene: MARKETING_ROUTE_PATHS.strength,
  sleep: "/funnels/sleep-support",
  treatments: MARKETING_ROUTE_PATHS.shop,
};

const SHORTCODE_TYPE_COPY = {
  intake: {
    emptyStateTitle: "Continue with the current intake flow.",
    emptyStateDescription:
      "Start the matching intake flow below to continue with treatment.",
  },
  login: {
    emptyStateTitle: "Continue with the current login flow.",
    emptyStateDescription:
      "Use the current HealSend login below.",
  },
  signup: {
    emptyStateTitle: "Continue with the current signup flow.",
    emptyStateDescription:
      "Create your account through the current HealSend signup flow below.",
  },
  account: {
    emptyStateTitle: "Continue with your current account view.",
    emptyStateDescription:
      "Open your HealSend account below.",
  },
  checkout: {
    emptyStateTitle: "Continue with the current checkout flow.",
    emptyStateDescription:
      "Use the current cart and checkout flow below.",
  },
  resume: {
    emptyStateTitle: "Continue where you left off.",
    emptyStateDescription:
      "Open your account below to resume your last saved step.",
  },
  start: {
    emptyStateTitle: "Start your treatment journey here.",
    emptyStateDescription:
      "Begin with the current HealSend care flow below.",
  },
};

const RENDERABLE_SHORTCODE_NAMES = new Set(["trustindex", "caption", "your"]);
const SUPPORTED_SHORTCODE_NAMES = new Set([
  ...RENDERABLE_SHORTCODE_NAMES,
  "woocommerce_checkout",
  "healsend_form",
  "hld_glp_prefunnel",
  "hld_custom_login_form",
  "hld_custom_signup_form",
  "dashboard",
  "patient_dashboard",
  "fluentform",
  "fluentform-resume",
  "get_started",
]);

const SHORTCODE_SUPPORT_CARD_MAP = {
  trustindex: {
    eyebrow: "Native Trust Section",
    title: "Trusted care with a lighter, easier-to-read review section.",
    description:
      "Review treatment information alongside a simpler trust panel that keeps the page focused on care, safety, and next steps.",
    bullets: [
      "Licensed clinician review",
      "Discreet fulfillment and follow-up care",
      "Secure account, checkout, and messaging paths",
    ],
  },
};

const INTERNAL_MARKETING_HOSTS = new Set(["healsend.com", "www.healsend.com"]);
const LEGACY_PREFIX_SEGMENTS = new Set([
  "weight-loss",
  "sexual-health",
  "energy-recovery-longevity",
  "anti-aging",
  "strength-recovery",
  "sleep",
  "treatments",
  "adhd",
  "birth-control",
  "psychiatry",
  "recovery",
]);

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWarningCache() {
  if (!globalThis.__marketingWarnings) {
    globalThis.__marketingWarnings = new Set();
  }

  return globalThis.__marketingWarnings;
}

function warnOnce(key, message) {
  const warnings = getWarningCache();
  if (warnings.has(key)) {
    return;
  }

  warnings.add(key);
  console.warn(message);
}

function getProbeCache() {
  if (!globalThis.__marketingDbProbeCache) {
    globalThis.__marketingDbProbeCache = { checkedAt: 0, reachable: true };
  }

  return globalThis.__marketingDbProbeCache;
}

async function canReachLocalDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return false;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    return false;
  }

  if (!["localhost", "127.0.0.1"].includes(parsedUrl.hostname)) {
    return true;
  }

  const cache = getProbeCache();
  const now = Date.now();
  if (now - cache.checkedAt < LOCAL_DB_PROBE_CACHE_MS) {
    return cache.reachable;
  }

  const port = Number(parsedUrl.port || "5432");

  const reachable = await new Promise((resolve) => {
    const socket = net.createConnection({
      host: parsedUrl.hostname,
      port,
    });

    const finish = (result) => {
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(LOCAL_DB_PROBE_TIMEOUT_MS);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });

  cache.checkedAt = now;
  cache.reachable = reachable;
  return reachable;
}

function buildTag(label) {
  const key = String(label || "").trim().toLowerCase();
  const style = TAG_STYLE_MAP[key] || TAG_STYLE_MAP.default;
  return {
    label,
    bg: style.bg,
    text: style.text,
  };
}

function buildProductTags(product) {
  const labels = [];

  if (product.featured) {
    labels.push("Most Popular");
  }

  for (const tag of product.tags || []) {
    if (labels.length >= 2) {
      break;
    }

    if (typeof tag === "string" && tag.trim()) {
      labels.push(tag.trim());
    }
  }

  if (!labels.some((label) => label.toLowerCase() === "rx")) {
    labels.push("Rx");
  }

  return [...new Set(labels)].slice(0, 2).map(buildTag);
}

function buildCardPrice(product) {
  const priceSummary = getProductPriceSummary(product);
  if (!priceSummary) {
    return "See pricing";
  }

  return `Starting at ${formatUsdCompact(priceSummary.firstMonthPrice)} per month`;
}

const HOMEPAGE_CAROUSEL_IMAGE_BY_SLUG = Object.freeze({
  "pt-141-nasal-spray": WORDPRESS_MARKETING_IMAGES.pt141,
  "pt-141-nasal-spray-2": WORDPRESS_MARKETING_IMAGES.pt141,
  "oxytocin-nasal-spray": WORDPRESS_MARKETING_IMAGES.oxytocin,
  "pt-141-oxytocin-nasal-sprays": WORDPRESS_MARKETING_IMAGES.oxytocin,
  "pt-141-funnel-him-her": WORDPRESS_MARKETING_IMAGES.oxytocin,
  "nad-injections": WORDPRESS_MARKETING_IMAGES.nadInjection,
  "nad-nasal-spray": WORDPRESS_MARKETING_IMAGES.nadNasal,
  "nad-nasal-glutathione-injection": WORDPRESS_MARKETING_IMAGES.nadInjection,
  "nad-injection-glutathione-1x-product": WORDPRESS_MARKETING_IMAGES.nadInjection,
  "glutathione-injection": WORDPRESS_MARKETING_IMAGES.glutathioneLdn,
  "sermorelin-injection-him-her": WORDPRESS_MARKETING_IMAGES.sermorelin,
  "sermorelin-injection": WORDPRESS_MARKETING_IMAGES.sermorelin,
  "sermorelin-enclomiphene-capsules-him": WORDPRESS_MARKETING_IMAGES.enclomiphene,
  "sermorelin-enclomiphene": WORDPRESS_MARKETING_IMAGES.enclomiphene,
  enclomiphene: WORDPRESS_MARKETING_IMAGES.enclomiphene,
  "generic-viagra": WORDPRESS_MARKETING_IMAGES.viagra,
  "generic-cialis": WORDPRESS_MARKETING_IMAGES.viagra,
  sildefanil: WORDPRESS_MARKETING_IMAGES.viagra,
  "generic-remeron-mirtazapine": WORDPRESS_MARKETING_IMAGES.remeron,
  "generic-trazodone": WORDPRESS_MARKETING_IMAGES.trazodone,
  "glutathione-low-dose-naltrexone-ldn": WORDPRESS_MARKETING_IMAGES.glutathioneLdn,
  "low-dose-naltrexone-ldn": WORDPRESS_MARKETING_IMAGES.glutathioneLdn,
});

function isLegacyWordpressUploadImage(value) {
  return /^(https?:\/\/[^/]*healsend\.com)?\/wp-content\/uploads\//i.test(
    String(value || "").trim(),
  );
}

function getHomepageCarouselFallbackImage(product) {
  const categorySlug = String(product?.category?.slug || "")
    .trim()
    .toLowerCase();

  if (categorySlug === "weight-loss") {
    return WORDPRESS_MARKETING_IMAGES.tirzepatide;
  }

  if (categorySlug === "sexual-health") {
    return WORDPRESS_MARKETING_IMAGES.pt141;
  }

  if (categorySlug === "anti-aging") {
    return WORDPRESS_MARKETING_IMAGES.nadInjection;
  }

  if (categorySlug === "strength-recovery") {
    return WORDPRESS_MARKETING_IMAGES.sermorelin;
  }

  if (categorySlug === "sleep") {
    return WORDPRESS_MARKETING_IMAGES.remeron;
  }

  if (categorySlug === "glutathione-ldn") {
    return WORDPRESS_MARKETING_IMAGES.glutathioneLdn;
  }

  return WORDPRESS_MARKETING_IMAGES.nadInjection;
}

function getHomepageCarouselImage(product) {
  const slug = String(product?.slug || "")
    .trim()
    .toLowerCase();
  const mappedImage = HOMEPAGE_CAROUSEL_IMAGE_BY_SLUG[slug] || null;

  if (mappedImage) {
    return mappedImage;
  }

  const primaryImage = getPublicCatalogPrimaryImage(product, null);
  if (primaryImage && !isLegacyWordpressUploadImage(primaryImage)) {
    return primaryImage;
  }

  return getHomepageCarouselFallbackImage(product);
}

function mapCarouselProduct(product) {
  const detailHref = getMarketingProductDetailPath(product.slug);

  return {
    title: product.name,
    price: buildCardPrice(product),
    image: getHomepageCarouselImage(product),
    href: getProductOnboardingPath(product.slug) || detailHref,
    secondaryHref: detailHref,
    tags: buildProductTags(product),
  };
}

function mapFeaturedCategoryProduct(product) {
  const detailHref = getMarketingProductDetailPath(product.slug);

  return {
    id: product.slug,
    title: product.name,
    description:
      stripHtml(product.shortDescription) ||
      stripHtml(product.description) ||
      "Provider-guided care with transparent monthly pricing and follow-up support.",
    price: buildCardPrice(product),
    image: getHomepageCarouselImage(product),
    href: getProductOnboardingPath(product.slug) || detailHref,
    secondaryHref: detailHref,
    tags: buildProductTags(product),
  };
}

function buildPricingTab(product) {
  const variants = Array.isArray(product.variants) ? [...product.variants] : [];
  variants.sort((left, right) => left.price - right.price);
  const subscriptionPlans = getProductSubscriptionPlans(product);

  const plans =
    variants.length > 0
      ? variants.map((variant) => ({
          name: variant.name,
          firstMonthPrice: variant.price,
          regularPrice: variant.salePrice ?? variant.price,
        }))
      : subscriptionPlans.length > 0
        ? subscriptionPlans.map((plan) => ({
            name: plan.name,
            firstMonthPrice: plan.firstMonthPrice,
            regularPrice: plan.thenPrice ?? plan.firstMonthPrice,
          }))
      : [
          {
            name: "Monthly Plan",
            firstMonthPrice: product.salePrice ?? product.regularPrice ?? 0,
            regularPrice: product.regularPrice ?? product.salePrice ?? 0,
          },
        ];

  return {
    title: "Choose the plan best for you. No hidden fees.",
    sizes: [
      {
        title: product.name,
        subtitle:
          stripHtml(product.shortDescription) ||
          "Provider-guided treatment delivered with transparent monthly pricing.",
        plans,
      },
    ],
  };
}

function normalizeContentObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeContentArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeStringArray(value) {
  return normalizeContentArray(value)
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);
}

function sanitizeMarketingHtml(value) {
  return String(value || "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<!--\s*\/?wp:[\s\S]*?-->/gi, "")
    .replace(/\[\/?[a-z0-9_-]+[^\]]*\]/gi, "")
    .replace(/<p>(?:\s|&nbsp;|&#160;)*<\/p>/gi, "")
    .replace(/<div>(?:\s|&nbsp;|&#160;)*<\/div>/gi, "")
    .trim();
}

function sanitizeMarketingText(value) {
  return stripHtml(sanitizeMarketingHtml(value));
}

function truncateMarketingDescription(value, maxLength = 280) {
  const text = sanitizeMarketingText(value);
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  const trimmed = text.slice(0, maxLength);
  const sentenceBreak = Math.max(
    trimmed.lastIndexOf(". "),
    trimmed.lastIndexOf("! "),
    trimmed.lastIndexOf("? "),
  );

  if (sentenceBreak >= 80) {
    return trimmed.slice(0, sentenceBreak + 1).trim();
  }

  const wordBreak = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, wordBreak > 40 ? wordBreak : maxLength).trim()}...`;
}

function inferMarketingCareLabel(slug, title = "") {
  const haystack = [slug, title].filter(Boolean).join(" ").toLowerCase();

  if (
    /(adhd|anxiety|depression|psychiatry|adderall|concerta|lexapro|paxil|prozac|xanax|klonopin|ativan)/.test(
      haystack,
    )
  ) {
    return "online mental-health care";
  }

  if (
    /(glp|weight|semaglutide|tirzepatide|metabolic|lipotropic|mic\b|bpc-157|tesamorelin)/.test(
      haystack,
    )
  ) {
    return "provider-guided weight-loss and metabolic care";
  }

  if (
    /(sexual|intimacy|pt-141|oxytocin|viagra|cialis|sildenafil|tadalafil)/.test(
      haystack,
    )
  ) {
    return "private sexual-wellness care";
  }

  if (/(sleep|remeron|mirtazapine|trazodone|ramalteon|insomnia)/.test(haystack)) {
    return "clinician-guided sleep support";
  }

  if (
    /(sermorelin|ipamorelin|enclomiphene|selank|semax|peptide|growth|recovery|strength|bpc|tesamorelin)/.test(
      haystack,
    )
  ) {
    return "strength, recovery, and performance support";
  }

  if (/(junel|sprintec|birth control|tri-sprintec)/.test(haystack)) {
    return "online birth-control care";
  }

  if (/(nad|glutathione|longevity|anti-aging|energy)/.test(haystack)) {
    return "anti-aging and longevity care";
  }

  return "clinician-guided care";
}

function buildFallbackMarketingDescription({
  title,
  slug,
  sourcePostType,
  careLabel,
}) {
  const readableTitle = resolveReadableMarketingTitle(title, slug);
  const resolvedCareLabel = careLabel || inferMarketingCareLabel(slug, readableTitle);

  if (sourcePostType === "post") {
    return `Read HealSend's guide to ${readableTitle}, including key context, practical considerations, and the next steps for care.`;
  }

  if (sourcePostType === "healsend_product") {
    return `Explore ${readableTitle} through HealSend with ${resolvedCareLabel}, clearer next steps, and clinician-guided review.`;
  }

  return `Explore ${readableTitle} with supporting information, clearer navigation, and the right next step into ${resolvedCareLabel}.`;
}

function resolveMarketingSeoDescription({
  seoDescription,
  description,
  html,
  title,
  slug,
  sourcePostType,
  careLabel,
}) {
  const candidates = [
    truncateMarketingDescription(seoDescription),
    truncateMarketingDescription(description),
    truncateMarketingDescription(html),
  ].filter(Boolean);

  const strongCandidate = candidates.find((candidate) => candidate.length >= 70);
  if (strongCandidate) {
    return strongCandidate;
  }

  const fallbackDescription = buildFallbackMarketingDescription({
    title,
    slug,
    sourcePostType,
    careLabel,
  });

  return truncateMarketingDescription(fallbackDescription);
}

function normalizeAssetUrl(value) {
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

function normalizePathname(pathname) {
  const raw = String(pathname || "").trim();
  if (!raw || raw === "/") {
    return "/";
  }

  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return normalized !== "/" && normalized.endsWith("/")
    ? normalized.slice(0, -1).toLowerCase()
    : normalized.toLowerCase();
}

const EXCLUDED_PUBLIC_CUSTOM_PAGE_SLUGS = new Set(["faheem", "funnel-page"]);

function mapLegacyImportedInternalPath(pathname) {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === "/") {
    return normalizedPath;
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "/";
  }

  const [firstSegment, secondSegment, thirdSegment] = segments;

  if (firstSegment === "product" && secondSegment) {
    const productSlug = resolveMarketingProductSlug(secondSegment) || secondSegment;
    return getMarketingProductDetailPath(productSlug) || `/${productSlug}`;
  }

  if (firstSegment === "shop" && secondSegment) {
    return getMarketingProductDetailPath(secondSegment) || `/${secondSegment}`;
  }

  if (firstSegment === "blog" && secondSegment) {
    return `/${secondSegment}`;
  }

  if (firstSegment === "onboarding" && secondSegment === "growth-hormone-support") {
    return MARKETING_ROUTE_PATHS.strength;
  }

  if (firstSegment === "resume-fluent-form-where-you-left" && thirdSegment) {
    return `/${thirdSegment}`;
  }

  if (firstSegment === "category" && secondSegment) {
    if (secondSegment === "anxiety" || secondSegment === "depression") {
      return "/psychiatry";
    }

    if (secondSegment === "hormone-health") {
      return "/strength-recovery";
    }

    if (secondSegment === "insomnia") {
      return "/sleep";
    }

    return `/${resolveMarketingCategorySlug(secondSegment) || secondSegment}`;
  }

  if (firstSegment === "product-category" && secondSegment) {
    const productCategoryRedirects = {
      "249": "/weight-loss",
      "250": "/weight-loss",
      medication: "/weight-loss",
      pt_141: "/pt-141-nasal-spray",
      "sermorelin-therapy": "/strength-recovery",
      "hrt-lite": "/strength-recovery",
    };

    return (
      productCategoryRedirects[secondSegment] ||
      `/${resolveMarketingCategorySlug(secondSegment) || secondSegment}`
    );
  }

  if (LEGACY_PREFIX_SEGMENTS.has(firstSegment) && secondSegment) {
    return `/${secondSegment}`;
  }

  const directFallback = CUSTOM_PAGE_FALLBACKS[firstSegment]?.redirectTo;
  if (segments.length === 1 && directFallback) {
    return directFallback;
  }

  if (segments.length === 1) {
    const resolvedCategory = resolveMarketingCategorySlug(firstSegment);
    if (resolvedCategory) {
      return `/${resolvedCategory}`;
    }

    const resolvedProduct = resolveMarketingProductSlug(firstSegment);
    if (resolvedProduct) {
      return getMarketingProductDetailPath(resolvedProduct) || `/${resolvedProduct}`;
    }
  }

  return normalizedPath;
}

function normalizeImportedInternalHref(rawHref) {
  const href = String(rawHref || "").trim();
  if (!href || href === "#") {
    return href;
  }

  if (/^(mailto:|tel:|sms:)/i.test(href)) {
    return href;
  }

  if (/^javascript:/i.test(href)) {
    return "#";
  }

  let parsed;
  try {
    parsed = new URL(href, "https://healsend.com");
  } catch {
    return href;
  }

  const isInternal =
    href.startsWith("/") ||
    href.startsWith("./") ||
    href.startsWith("../") ||
    INTERNAL_MARKETING_HOSTS.has(parsed.hostname.toLowerCase());

  if (!isInternal) {
    return href;
  }

  const pathname = mapLegacyImportedInternalPath(parsed.pathname);
  const isMediaAsset = isImportedMarketingMediaPath(pathname);

  if (isMediaAsset) {
    return `${parsed.origin}${pathname}${parsed.search}${parsed.hash}`;
  }

  return `${pathname}${parsed.search}${parsed.hash}`;
}

function isImportedMarketingMediaPath(pathname) {
  return (
    pathname.startsWith("/wp-content/") ||
    pathname.startsWith("/wp-json/") ||
    /\.(?:avif|gif|jpe?g|png|svg|webp|pdf|txt)$/i.test(pathname)
  );
}

const CONTENT_LINK_KEYS = new Set(["href", "buttonHref", "ctaHref", "secondaryHref"]);
const CONTENT_IMAGE_KEYS = new Set(["image", "heroImage", "featuredImage"]);

function normalizeMarketingContentLinks(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeMarketingContentLinks(entry));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => {
      if (typeof entryValue === "string" && CONTENT_LINK_KEYS.has(key)) {
        return [key, normalizeImportedInternalHref(entryValue)];
      }

      if (typeof entryValue === "string" && CONTENT_IMAGE_KEYS.has(key)) {
        return [key, normalizeMarketingImage(entryValue)];
      }

      if (key === "images" && Array.isArray(entryValue)) {
        return [
          key,
          entryValue.map((image) =>
            typeof image === "string"
              ? normalizeMarketingImage(image)
              : normalizeMarketingContentLinks(image),
          ),
        ];
      }

      return [key, normalizeMarketingContentLinks(entryValue)];
    }),
  );
}

function removeLeadingDuplicateHeroImage(html, heroImage) {
  const heroAsset = normalizeAssetUrl(heroImage);
  if (!heroAsset) {
    return html;
  }

  const match = String(html || "").match(
    /^\s*(?:<figure\b[^>]*>\s*)?<img\b[^>]*\ssrc=(["'])(.*?)\1[^>]*>(?:\s*<\/figure>)?\s*/i,
  );
  if (!match) {
    return html;
  }

  const imageAsset = normalizeAssetUrl(match[2]);
  if (!imageAsset || imageAsset !== heroAsset) {
    return html;
  }

  return String(html || "").slice(match[0].length).trimStart();
}

function normalizeImportedMarketingHtml(html, heroImage) {
  const safeHeroImage = normalizeMarketingImage(heroImage, heroImage);
  let cleaned = String(html || "")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, "")
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/gi, "")
    .replace(/<a\b[^>]*href=(["'])#\1[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(
      /<a\b[^>]*>[\s\S]*?(?:get started|see if you qualify|watch video|get care|continue here)[\s\S]*?<\/a>/gi,
      "",
    )
    .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi, "")
    .replace(
      /<h[2-6]\b[^>]*>\s*(?:then\s+)?\$\d[\d,]*(?:\s*\/\s*(?:mo|month))?(?:[^<]{0,24})<\/h[2-6]>/gi,
      "",
    )
    .replace(
      /<h[2-6]\b[^>]*>\s*(?:no hidden fees\.?|discount auto-applied at checkout|monthly plan|3-month plan|benefits|pricing|description)\s*<\/h[2-6]>/gi,
      "",
    )
    .replace(/<h3\b[^>]*>\s*[^<]{0,80}<\/h3>/gi, "")
    .replace(/<img\b[^>]*src=(["'])[^"']*(?:klarna|after-pay|afterpay)[^"']*\1[^>]*>/gi, "")
    .replace(/\sid=(["'])e-n-accordion-item-[^"']*\1/gi, "")
    .replace(/\stabindex=(["'])[^"']*\1/gi, "")
    .replace(/\s(?:class|style|data-[\w:-]+|aria-[\w:-]+)="[^"]*"/gi, "")
    .replace(/\s(?:class|style|data-[\w:-]+|aria-[\w:-]+)='[^']*'/gi, "")
    .replace(/<img\b([^>]*)>/gi, (_, attrs) => {
      const normalizedSrc = String(attrs || "").match(
        /\ssrc=(["'])(.*?)\1/i,
      )?.[2];
      const safeSrc =
        normalizedSrc && isSuspiciousMarketingImage(normalizedSrc)
          ? safeHeroImage
          : normalizedSrc;
      const normalizedAttrs = String(attrs || "")
        .replace(/\s(?:width|height|srcset|sizes|loading|decoding|fetchpriority)="[^"]*"/gi, "")
        .replace(/\s(?:width|height|srcset|sizes|loading|decoding|fetchpriority)='[^']*'/gi, "")
        .replace(/\ssrc=(["'])(.*?)\1/gi, "")
        .trim();

      if (!safeSrc && isSuspiciousMarketingImage(normalizedSrc)) {
        return "";
      }

      const srcAttr = safeSrc ? ` src="${safeSrc}"` : "";
      return normalizedAttrs
        ? `<img${srcAttr} ${normalizedAttrs}>`
        : `<img${srcAttr}>`;
    })
    .replace(/<a\b([^>]*?)\shref=(["'])(.*?)\2([^>]*)>/gi, (_, before, quote, href, after) => {
      const normalizedHref = normalizeImportedInternalHref(href);
      return `<a${before} href=${quote}${normalizedHref}${quote}${after}>`;
    });

  cleaned = removeLeadingDuplicateHeroImage(cleaned, heroImage);

  return cleaned
    .replace(/^(?:\s|<figure\b[^>]*>\s*<img\b[^>]*>\s*<\/figure>|<img\b[^>]*>)+/i, "")
    .replace(/<p>(?:\s|&nbsp;|&#160;)*<\/p>/gi, "")
    .replace(/<div>(?:\s|&nbsp;|&#160;)*<\/div>/gi, "")
    .trim();
}

function stripImportedMarketingPromoPrelude(html) {
  let source = String(html || "").trim();
  if (!source) {
    return source;
  }

  const detailsIndex = source.search(/<details\b/i);
  const informativeHeadingMatch = source.match(
    /<h[2-6]\b[^>]*>\s*(?:what\b|how\b|why\b|benefits?\b|uses?\b|potential\b|possible\b|learn more\b|frequently asked\b|where\b|when\b|who\b|can\b|does\b|is\b|are\b)[\s\S]*?<\/h[2-6]>/i,
  );
  const informativeHeadingIndex =
    informativeHeadingMatch && typeof informativeHeadingMatch.index === "number"
      ? informativeHeadingMatch.index
      : -1;

  const cutCandidates = [detailsIndex, informativeHeadingIndex].filter((index) => index > 0);
  if (cutCandidates.length === 0) {
    return source;
  }

  const cutIndex = Math.min(...cutCandidates);
  const prelude = source.slice(0, cutIndex);

  if (
    sanitizeMarketingText(prelude).length >= 260 &&
    /(?:buy\s+[a-z0-9 +\-]+|discount auto-applied|get started|klarna|after ?pay|benefits\s*pricing\s*description|no hidden fees|monthly plan|3-month plan|\$\d)/i.test(
      prelude,
    )
  ) {
    source = source.slice(cutIndex).trimStart();
  }

  return source;
}

function hasDirtyCategoryBodyContent(contentSource, sectionBlocks = []) {
  const text = sanitizeMarketingText(contentSource);

  if (!text) {
    return false;
  }

  const repeatedReviewCount = (text.match(/verified review/gi) || []).length;
  const repeatedStepCount = (text.match(/step\s*[123]/gi) || []).length;
  const longSingleSection = sectionBlocks.length <= 1 && text.length >= 1400;

  return (
    longSingleSection ||
    repeatedReviewCount >= 2 ||
    repeatedStepCount >= 3 ||
    /(1,000\+\s*members|join 1000\+\s*members|america'?s\s*#?1|most comprehensive glp-1|unlimited video calls|always on medical assistance|on-time refills guaranteed|member community|no insurance\.\s*no waitlist|questions about side effects\?|weight loss goal guarantee)/i.test(
      text,
    )
  );
}

function hasOverSpecificCategoryCopy(categorySlug, ...values) {
  const haystack = values.filter(Boolean).join(" ").toLowerCase();

  if (!haystack) {
    return false;
  }

  if (categorySlug === "weight-loss") {
    return /(oral tirzepatide|tirzepatide tablets|semaglutide injections?|tirzepatide injections?)/i.test(
      haystack,
    );
  }

  if (categorySlug === "strength-recovery") {
    return /(buy sermorelin|sermorelin injections|cjc-1295|ipamorelin|enclomiphene)/i.test(
      haystack,
    );
  }

  if (categorySlug === "anti-aging") {
    return /(nad\+?\s*injections?|nad nasal spray|nad patches)/i.test(haystack);
  }

  if (categorySlug === "sexual-health") {
    return /(pt-141|oxytocin nasal spray|viagra|sildenafil|tadalafil)/i.test(
      haystack,
    );
  }

  if (categorySlug === "sleep") {
    return /(ramalteon|remeron|trazodone|mirtazapine)/i.test(haystack);
  }

  return false;
}

function slugifySectionHeading(value) {
  return sanitizeMarketingText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hasMeaningfulMarketingIntro(html) {
  const text = stripHtml(html);
  return Boolean(
    text.length >= 80 && /<(p|ul|ol|blockquote|table)\b/i.test(html),
  );
}

function sanitizeMarketingHighlightItem(value) {
  let text = sanitizeMarketingText(value)
    .replace(/^and\s+/i, "")
    .replace(/\$\$+/g, "$")
    .replace(/\btrustindex\b/gi, "")
    .replace(/\bno-registration\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const verbMatch = text.match(
    /\b(Boosts|Improves|Supports|Helps|Promotes|Enhances|Encourages|Reduces)\b/i,
  );
  if (verbMatch && verbMatch.index > 0 && verbMatch.index < 20) {
    text = text.slice(verbMatch.index).trim();
  }

  if (!text) {
    return null;
  }

  if (
    text.length < 8 ||
    text.length > 90 ||
    !/\s/.test(text) ||
    text.split(/\s+/).length > 12 ||
    /^\$/.test(text) ||
    /^then\s+\$/i.test(text) ||
    /^(benefits|pricing|description|monthly plan|3-month plan|no hidden fees\.?)$/i.test(
      text,
    ) ||
    /(get started|see if you qualify|discount auto-applied|klarna|after ?pay|trustindex|no-registration)/i.test(
      text,
    )
  ) {
    return null;
  }

  return text;
}

function isDirtyImportedProductCopy(value) {
  const raw = String(value || "");
  const text = sanitizeMarketingText(value).replace(/\s+/g, " ").trim();
  if (!text) {
    return false;
  }

  const repeatedSignals = [
    "submit your application and meet with a doctor",
    "get your medication delivered at home",
    "receive 24/7 support and ongoing care",
    "no hidden fees",
    "see if you qualify",
  ];

  const hasRepeatedSignal = repeatedSignals.some((signal) => {
    const normalizedText = text.toLowerCase();
    const normalizedSignal = signal.toLowerCase();
    return (
      normalizedText.indexOf(normalizedSignal) !==
      normalizedText.lastIndexOf(normalizedSignal)
    );
  });

  return (
    text.length > 420 &&
    (
      /\[trustindex|trustindex|no-registration|benefits pricing description|discount auto-applied|klarna|after ?pay/i.test(
        raw,
      ) ||
      /(step\s*1|step\s*2|step\s*3)/i.test(text) ||
      /frequently asked questions about/i.test(text) ||
      /buy .+ vs .+ (what's|what is) the difference/i.test(text) ||
      hasRepeatedSignal
    )
  );
}

function sanitizeProductCopy(value, fallback = "") {
  const text = sanitizeMarketingText(value).replace(/\s+/g, " ").trim();
  if (!text || isDirtyImportedProductCopy(value)) {
    return typeof fallback === "string" ? fallback : "";
  }

  return text;
}

function buildProductSummaryFallback(product, summary) {
  return (
    sanitizeProductCopy(summary) ||
    `HealSend pairs ${product.name} with clinician-guided review, transparent monthly pricing, and follow-up support tailored to your goals.`
  );
}

function buildProductFeatureFallback(product, summary) {
  const paragraphs = [
    `${product.name} is reviewed by a licensed clinician and paired with a plan based on your goals, health history, and response over time.`,
    buildProductSummaryFallback(product, summary),
  ];

  return [...new Set(paragraphs.filter(Boolean))].slice(0, 2);
}

function sanitizeProductParagraphArray(value, fallback = []) {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : [];

  const cleaned = [...new Set(source.map((entry) => sanitizeProductCopy(entry)).filter(Boolean))];
  return cleaned.length > 0 ? cleaned.slice(0, 4) : fallback;
}

function sanitizeProductFaqItems(value, fallback = []) {
  const items = normalizeContentArray(value)
    .map((item) => ({
      question: sanitizeMarketingText(item?.question || ""),
      answer: sanitizeProductCopy(item?.answer || item?.answerText || ""),
    }))
    .filter((item) => item.question && item.answer);

  return items.length > 0 ? items.slice(0, 16) : fallback;
}

function extractNumericPriceValue(value) {
  const match = String(value || "").match(/\$([\d,]+(?:\.\d{1,2})?)/);
  if (!match) {
    return null;
  }

  const amount = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function resolveNativeLandingProductName(page) {
  const humanized = humanizeSlugTitle(page.slug);
  const resolvedTitle = resolveReadableMarketingTitle(page.title, page.slug)
    .replace(/[.]+$/g, "")
    .trim();

  if (!resolvedTitle) {
    return humanized;
  }

  return /\b(for|with|inside|guidance|support|care|review)\b/i.test(resolvedTitle) &&
    resolvedTitle.length > humanized.length + 8
    ? humanized
    : resolvedTitle;
}

function resolveNativeLandingBenefitIconName(text) {
  const value = String(text || "").toLowerCase();

  if (/(energy|focus|vitality|boost|clarity|drive)/.test(value)) {
    return "Zap";
  }

  if (/(strength|muscle|recovery|performance|sleep|goals)/.test(value)) {
    return "Target";
  }

  if (/(weight|metabolism|body|appetite|progress|support)/.test(value)) {
    return "TrendingUp";
  }

  if (/(doctor|provider|clinician|review|safety|eligible|prescrib)/.test(value)) {
    return "ShieldCheck";
  }

  if (/(follow-up|plan|consisten|continuity|ongoing)/.test(value)) {
    return "Hourglass";
  }

  return "Sparkles";
}

function buildNativeLandingBenefitItems(page, content, fallbackDescription) {
  const structuredBenefits = normalizeContentArray(content.tabs?.benefits)
    .map((item) => ({
      text: sanitizeProductCopy(item?.text),
      iconName:
        typeof item?.iconName === "string"
          ? item.iconName
          : resolveNativeLandingBenefitIconName(item?.text),
    }))
    .filter((item) => item.text);

  if (structuredBenefits.length > 0) {
    return structuredBenefits.slice(0, 6);
  }

  const highlights = normalizeStringArray(page.highlights)
    .map((entry) => sanitizeMarketingHighlightItem(entry))
    .filter(Boolean);
  const stepDescriptions = normalizeContentArray(page.careSteps)
    .map((step) => sanitizeProductCopy(step?.description))
    .filter(Boolean);
  const combined = [...new Set([...highlights, ...stepDescriptions])].slice(0, 6);

  if (combined.length > 0) {
    return combined.map((text) => ({
      text,
      iconName: resolveNativeLandingBenefitIconName(text),
    }));
  }

  return [
    {
      iconName: "ShieldCheck",
      text: "Licensed clinician review tailored to your goals, symptoms, and health history.",
    },
    {
      iconName: "TrendingUp",
      text:
        fallbackDescription ||
        "A clearer next step into treatment, follow-up, and longer-term care continuity.",
    },
    {
      iconName: "Hourglass",
      text: "Ongoing support that keeps intake, delivery, and follow-up connected.",
    },
  ];
}

function buildNativeLandingFaqs(page, content, name, fallbackDescription) {
  const structuredFaqs = sanitizeProductFaqItems(content.faqs);
  if (structuredFaqs.length > 0) {
    return structuredFaqs;
  }

  const extractedFaqs = normalizeContentArray(page.faqItems)
    .map((item) => ({
      question: sanitizeMarketingText(item?.question || ""),
      answer: sanitizeProductCopy(item?.answerText || item?.answer || ""),
    }))
    .filter((item) => item.question && item.answer);

  if (extractedFaqs.length > 0) {
    return extractedFaqs.slice(0, 16);
  }

  const supportLabel = sanitizeMarketingText(page.primaryCta?.label || "Get started");

  return [
    {
      question: `How does ${name} fit into care?`,
      answer:
        fallbackDescription ||
        "This page is designed to explain how treatment fits into clinician-guided care, what to expect next, and how follow-up support works.",
    },
    {
      question: "Do I still need clinician review?",
      answer:
        "Yes. Treatment fit, eligibility, safety considerations, and next steps are still reviewed by a licensed clinician before care moves forward.",
    },
    {
      question: "What should I do next?",
      answer: `Use the ${supportLabel.toLowerCase()} flow to continue your intake, review the right treatment route, and move into clinician evaluation.`,
    },
  ];
}

function buildNativeLandingSupportFeatures(page, content, benefitItems) {
  const structuredFeatures = normalizeContentArray(content.supportSection?.features)
    .map((feature) => ({
      ...feature,
      title: sanitizeMarketingText(feature?.title || ""),
      description: sanitizeProductCopy(feature?.description || ""),
      iconName:
        typeof feature?.iconName === "string"
          ? feature.iconName
          : resolveNativeLandingBenefitIconName(
              `${feature?.title || ""} ${feature?.description || ""}`,
            ),
    }))
    .filter((feature) => feature.title && feature.description);

  if (structuredFeatures.length > 0) {
    return structuredFeatures.slice(0, 3);
  }

  const stepFeatures = normalizeContentArray(page.careSteps)
    .map((step, index) => ({
      title: sanitizeMarketingText(step?.title || ""),
      description: sanitizeProductCopy(step?.description || ""),
      iconName: ["ShieldCheck", "TrendingUp", "BadgeCheck"][index] || "Sparkles",
    }))
    .filter((feature) => feature.title && feature.description);

  if (stepFeatures.length > 0) {
    return stepFeatures.slice(0, 3);
  }

  return benefitItems.slice(0, 3).map((item, index) => ({
    title:
      [
        "Clinician-guided review",
        "A smoother next step",
        "Ongoing follow-through",
      ][index] || "Care continuity",
    description: item.text,
    iconName: item.iconName,
  }));
}

function buildNativeLandingCarouselItems(page, content, benefitItems, fallbackImage) {
  const structuredCarousel = normalizeContentArray(content.benefitsCarousel)
    .map((item) => ({
      text: sanitizeProductCopy(item?.text || ""),
      image: normalizeMarketingImage(item?.image, fallbackImage) || fallbackImage,
    }))
    .filter((item) => item.text && item.image);

  if (structuredCarousel.length > 0) {
    return structuredCarousel.slice(0, 4);
  }

  const candidateImages = [
    fallbackImage,
    normalizeMarketingImage(content.featureSection?.image, fallbackImage) || fallbackImage,
    normalizeMarketingImage(content.researchSection?.image, fallbackImage) || fallbackImage,
    normalizeMarketingImage(content.labTestedSection?.image, fallbackImage) || fallbackImage,
  ].filter(Boolean);

  const uniqueImages = [...new Set(candidateImages)];
  const fallbackTexts = [
    ...benefitItems.map((item) => item.text),
    ...normalizeContentArray(page.careSteps)
      .map((step) => sanitizeProductCopy(step?.description))
      .filter(Boolean),
  ].slice(0, 4);

  return fallbackTexts.map((text, index) => ({
    text,
    image: uniqueImages[index % uniqueImages.length] || fallbackImage,
  }));
}

function buildNativeLandingCareFeatures(content, fallbackImages) {
  const structuredFeatures = normalizeContentArray(content.comprehensiveCare?.features)
    .map((feature) => ({
      ...feature,
      title: sanitizeMarketingText(feature?.title || ""),
      points: normalizeContentArray(feature?.points)
        .map((point) => sanitizeProductCopy(point))
        .filter(Boolean),
      image:
        normalizeMarketingImage(feature?.image, fallbackImages[0]) || fallbackImages[0],
    }))
    .filter((feature) => feature.title && feature.points.length > 0);

  if (structuredFeatures.length > 0) {
    return structuredFeatures.slice(0, 4);
  }

  const imageClasses = [
    "absolute bottom-0 right-6 h-32 w-32 rounded-t-2xl border-4 border-white object-contain bg-white p-2 shadow-lg md:h-40 md:w-40",
    "absolute bottom-6 right-6 aspect-square w-28 rounded-full border-4 border-white bg-white object-contain p-3 shadow-xl md:w-36",
    "absolute bottom-2 right-2 w-32 object-contain mix-blend-multiply md:w-48",
    "absolute bottom-6 right-6 aspect-square w-28 rounded-full border-4 border-white bg-white object-contain p-3 shadow-xl md:w-36",
  ];

  const genericFeatures = [
    {
      title: "Clinician review that keeps the next step clear",
      points: [
        "Licensed review before treatment moves forward",
        "A plan shaped around goals, fit, and safety",
      ],
    },
    {
      title: "Support that stays connected after intake",
      points: [
        "Use your account for follow-up communication",
        "Keep order visibility and care continuity in one place",
      ],
    },
    {
      title: "Delivery and refill visibility without guesswork",
      points: [
        "Track what happens next after clinician review",
        "Stay aligned on timing, delivery, and follow-through",
      ],
    },
    {
      title: "A cleaner bridge from discovery into treatment",
      points: [
        "Move from education into guided care more smoothly",
        "Keep the experience understandable from start to finish",
      ],
    },
  ];

  return genericFeatures.map((feature, index) => ({
    ...feature,
    image: fallbackImages[index % fallbackImages.length] || fallbackImages[0],
    imageClass: imageClasses[index % imageClasses.length],
  }));
}

function buildNativeLandingRelatedProducts(page, content) {
  const relatedProducts = normalizeContentArray(content.relatedProducts)
    .map((item) => {
      const slug = item?.id || item?.slug;
      const href =
        typeof item?.href === "string" && item.href.trim()
          ? item.href
          : slug
            ? getMarketingProductDetailPath(slug)
            : null;

      return {
        id: slug || item?.name,
        name: sanitizeMarketingText(item?.name || ""),
        image: normalizeMarketingImage(item?.image, page.heroImage) || page.heroImage,
        href,
      };
    })
    .filter((item) => item.id && item.name && item.href);

  return relatedProducts.length > 0 ? relatedProducts.slice(0, 2) : null;
}

function buildUnifiedNativeProductPageData(page) {
  const content = normalizeMarketingContentLinks(
    normalizeContentObject(page.structuredContent),
  );
  const name = resolveNativeLandingProductName(page);
  const summary = sanitizeProductCopy(
    page.clusterDescription || page.description,
    page.description,
  );
  const primaryPrice = extractNumericPriceValue(page.offerDetails?.primaryPrice);
  const secondaryPrice = extractNumericPriceValue(page.offerDetails?.secondaryPrice);
  const fallbackImage =
    normalizeMarketingImage(page.heroImage, getDefaultMarketingImageForPath(page.primaryCta?.href || `/${page.slug}`)) ||
    fallbackProductContent.image;
  const benefitItems = buildNativeLandingBenefitItems(page, content, summary);
  const supportFeatures = buildNativeLandingSupportFeatures(
    page,
    content,
    benefitItems,
  );
  const carouselItems = buildNativeLandingCarouselItems(
    page,
    content,
    benefitItems,
    fallbackImage,
  );
  const careFeatureImages = [
    fallbackImage,
    normalizeMarketingImage(content.featureSection?.image, fallbackImage) || fallbackImage,
    normalizeMarketingImage(content.researchSection?.image, fallbackImage) || fallbackImage,
    normalizeMarketingImage(content.labTestedSection?.image, fallbackImage) || fallbackImage,
  ].filter(Boolean);
  const relatedProducts = buildNativeLandingRelatedProducts(page, content);

  return {
    id: page.slug,
    slug: page.slug,
    name,
    summary,
    inStock: true,
    image: fallbackImage,
    primaryCta: page.primaryCta || null,
    secondaryCta: page.secondaryCta || null,
    price: {
      firstMonth: primaryPrice,
      regular: secondaryPrice,
      savings:
        primaryPrice && secondaryPrice && secondaryPrice > primaryPrice
          ? Math.round(secondaryPrice - primaryPrice)
          : null,
      primaryLabel: page.offerDetails?.primaryPrice || null,
      secondaryLabel: page.offerDetails?.secondaryPrice || null,
    },
    tabs: {
      benefits: benefitItems,
      pricing:
        content.tabs?.pricing || {
          title:
            primaryPrice || secondaryPrice
              ? "Review treatment pricing, support details, and the next step into care."
              : "Review the treatment details, clinician guidance, and what happens next.",
          sizes: [
            {
              title: name,
              subtitle:
                summary ||
                "A clinician-guided treatment route with clearer next steps and follow-up support.",
              plans: [
                {
                  name: primaryPrice && secondaryPrice ? "Starting plan" : "Current plan",
                  firstMonthPrice: primaryPrice || secondaryPrice || fallbackProductContent.price.firstMonth,
                  regularPrice:
                    secondaryPrice ||
                    primaryPrice ||
                    fallbackProductContent.price.regular,
                },
              ],
            },
          ],
        },
      description:
        sanitizeProductCopy(content.tabs?.description, summary) ||
        fallbackProductContent.tabs.description,
    },
    faqs: buildNativeLandingFaqs(page, content, name, summary),
    testimonials:
      normalizeContentArray(content.testimonials).length > 0
        ? normalizeContentArray(content.testimonials)
        : undefined,
    featureSection: {
      title:
        sanitizeMarketingText(content.featureSection?.title) ||
        `${name} with clearer treatment context and next steps.`,
      description:
        sanitizeProductParagraphArray(content.featureSection?.description, [
          summary ||
            "Review how treatment fits into care, what to expect next, and how follow-up support stays connected.",
          page.description,
        ]) || [
          summary ||
            "Review how treatment fits into care, what to expect next, and how follow-up support stays connected.",
        ],
      image:
        normalizeMarketingImage(content.featureSection?.image, fallbackImage) ||
        fallbackImage,
    },
    supportSection: {
      title:
        sanitizeMarketingText(content.supportSection?.title) ||
        `A treatment page designed around ${name} and the next step into care.`,
      subtitle:
        sanitizeProductCopy(content.supportSection?.subtitle) ||
        "Keep pricing, clinician review, and follow-through in one clearer experience.",
      features: supportFeatures,
    },
    benefitsCarouselTitle:
      sanitizeMarketingText(content.benefitsCarouselTitle) ||
      `What to know about ${name}`,
    benefitsCarousel: carouselItems,
    researchSection: {
      title:
        sanitizeMarketingText(content.researchSection?.title) ||
        `How ${name} fits into a clinician-guided care path`,
      image:
        normalizeMarketingImage(content.researchSection?.image, fallbackImage) ||
        fallbackImage,
      points:
        normalizeContentArray(content.researchSection?.points)
          .map((point) => sanitizeProductCopy(point))
          .filter(Boolean)
          .slice(0, 4).length > 0
          ? normalizeContentArray(content.researchSection?.points)
              .map((point) => sanitizeProductCopy(point))
              .filter(Boolean)
              .slice(0, 4)
          : benefitItems.map((item) => item.text).slice(0, 4),
    },
    pricingHighlights: benefitItems.map((item) => item.text).slice(0, 4),
    simpleSteps:
      normalizeContentArray(content.simpleSteps).length > 0
        ? content.simpleSteps
        : undefined,
    comprehensiveCare: {
      title:
        sanitizeMarketingText(content.comprehensiveCare?.title) ||
        `${name} with support that continues after intake.`,
      description:
        sanitizeProductCopy(content.comprehensiveCare?.description) ||
        "HealSend keeps treatment, follow-up, and care continuity connected so the experience stays easier to understand.",
      introLabel:
        sanitizeMarketingText(content.comprehensiveCare?.introLabel) || "HealSend",
      introText:
        sanitizeProductCopy(content.comprehensiveCare?.introText) ||
        "Use one account for your intake, order visibility, provider communication, and the next steps that come after clinician review.",
      ctaText:
        sanitizeMarketingText(content.comprehensiveCare?.ctaText) ||
        page.primaryCta?.label ||
        `Start your ${name} journey`,
      features: buildNativeLandingCareFeatures(content, careFeatureImages),
    },
    relatedProducts,
    closingCta: {
      eyebrow: "Ready for the next step?",
      title: `See whether ${name} fits your care plan.`,
      description:
        "Every route keeps clinician review, transparent next steps, and care continuity in one place.",
      bullets: [
        "Clinician-guided intake",
        "Clear treatment details",
        "Order and follow-up visibility",
        "Ongoing care continuity",
      ],
      planLabel: name,
      supportNote:
        "Final treatment fit still depends on clinician review, your history, and the route recommended for you.",
    },
  };
}

function extractMarketingHighlights(html, limit = 4) {
  const items = [];
  const regex = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
  let match;

  while ((match = regex.exec(String(html || "")))) {
    const text = sanitizeMarketingHighlightItem(match[1]);
    if (!text) {
      continue;
    }

    items.push(text);
    if (items.length >= limit) {
      break;
    }
  }

  return [...new Set(items)];
}

function extractMarketingTopParagraphHighlights(html, limit = 4) {
  const items = [];
  const regex = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = regex.exec(String(html || "")))) {
    const text = sanitizeMarketingHighlightItem(match[1]);

    if (!text) {
      continue;
    }

    items.push(text);
    if (items.length >= limit) {
      break;
    }
  }

  return [...new Set(items)];
}

function extractMarketingOfferDetails(html) {
  const source = String(html || "");
  if (!source) {
    return null;
  }

  const priceHeadings = [...source.matchAll(
    /<h[1-6]\b[^>]*>\s*((?:then\s+)?\$\d[\d,]*(?:[^<]{0,32}))<\/h[1-6]>/gi,
  )]
    .map((match) => sanitizeMarketingText(match[1]))
    .filter(Boolean);

  const text = stripHtml(source).slice(0, 1200);
  const inlinePrices = [...text.matchAll(
    /\$\d[\d,]*(?:\s*\/\s*(?:mo|month)|\s*(?:per|a)\s+month)?(?:\s*\|\s*[^|.]{1,28})?/gi,
  )]
    .map((match) => sanitizeMarketingText(match[0]))
    .filter(Boolean);

  const prices = [...new Set([...priceHeadings, ...inlinePrices])];
  if (prices.length === 0) {
    return null;
  }

  const normalizePrice = (value) =>
    sanitizeMarketingText(value)
      .replace(/\$\$+/g, "$")
      .replace(/\s+/g, " ")
      .trim();

  const primaryPrice = normalizePrice(
    prices.find((price) => !/^then\s+/i.test(price)) || prices[0],
  );
  const secondaryPrice = normalizePrice(
    prices.find((price) => /^then\s+/i.test(price)) ||
      prices.find((price) => price !== primaryPrice) ||
      "",
  ) || null;

  return {
    primaryPrice,
    secondaryPrice,
  };
}

function inferFallbackSectionTitle(text, index, total, fallbackTitle) {
  const haystack = String(text || "").toLowerCase();

  if (index === 0 && total === 1) {
    return fallbackTitle;
  }

  if (index === 0) {
    return fallbackTitle;
  }

  const hasPricing =
    /(price|pricing|cost|membership|plan|monthly|subscription|\$\d)/.test(
      haystack,
    );
  const hasUsage =
    /(dose|dosage|how to take|how to use|timing|schedule|start with|taken)/.test(
      haystack,
    );
  const hasSafety =
    /(risk|warning|side effect|safety|contraindication|avoid|interaction)/.test(
      haystack,
    );
  const hasBenefits =
    /(benefit|support|improve|help|advantage)/.test(haystack);

  if (hasPricing) {
    return "Pricing";
  }

  if (hasUsage) {
    return "How to use";
  }

  if (hasBenefits && index <= Math.ceil(total / 2)) {
    return "Potential benefits";
  }

  if (
    index === total - 1 &&
    (
      /(next|start|get started|qualify|delivery|provider|consultation|order)/.test(
        haystack,
      ) ||
      hasSafety
    )
  ) {
    return hasSafety ? "Safety notes" : "Next steps";
  }

  if (index === total - 1) {
    return "Key takeaways";
  }

  const defaults = ["Key details", "What to expect", "More to know"];
  return defaults[(index - 1) % defaults.length];
}

function isLowSignalMarketingSectionTitle(title) {
  const text = sanitizeMarketingText(title);
  if (!text) {
    return true;
  }

  return (
    /^step\s*\d+$/i.test(text) ||
    /^(benefits|pricing|description|monthly plan|3-month plan|discount auto-applied at checkout|no hidden fees\.?|what people ask before starting|get started|see if you qualify|ready to feel like you again\??)$/i.test(
      text,
    )
  );
}

function buildFallbackMarketingSectionLayout(html, fallbackTitle) {
  const source = String(html || "").trim();
  if (!source || !hasMeaningfulMarketingBody(source)) {
    return { introHtml: "", sectionBlocks: [] };
  }

  const blockMatches = [
    ...source.matchAll(
      /<(p|ul|ol|blockquote|figure|table|pre)\b[\s\S]*?<\/\1>/gi,
    ),
  ].map((match) => normalizeImportedMarketingHtml(match[0], null));

  const seenBlocks = new Set();
  const renderableBlocks = blockMatches.filter((block) => {
    if (!hasMeaningfulMarketingBody(block)) {
      return false;
    }

    const text = sanitizeMarketingText(block);
    if (!text) {
      return false;
    }

    const dedupeKey = text.toLowerCase().replace(/\s+/g, " ").slice(0, 280);
    if (seenBlocks.has(dedupeKey)) {
      return false;
    }

    seenBlocks.add(dedupeKey);
    return true;
  });

  if (renderableBlocks.length === 0) {
    return {
      introHtml: "",
      sectionBlocks: [
        {
          id: slugifySectionHeading(fallbackTitle) || "overview",
          title: fallbackTitle,
          html: source,
          summary: sanitizeMarketingText(source).slice(0, 180),
        },
      ],
    };
  }

  const chunks = [];
  let currentChunk = [];
  let currentTextLength = 0;
  const totalRenderableTextLength = renderableBlocks.reduce(
    (sum, block) => sum + sanitizeMarketingText(block).length,
    0,
  );
  const targetSectionCount = Math.max(
    1,
    Math.min(6, Math.ceil(totalRenderableTextLength / 2200)),
  );
  const targetTextLengthPerSection = Math.max(
    900,
    Math.ceil(totalRenderableTextLength / targetSectionCount),
  );

  for (const block of renderableBlocks) {
    const textLength = sanitizeMarketingText(block).length;
    if (!textLength) {
      continue;
    }

    if (
      currentChunk.length > 0 &&
      (
        currentTextLength >= targetTextLengthPerSection ||
        (
          currentChunk.length >= 4 &&
          currentTextLength + textLength > targetTextLengthPerSection * 1.15
        )
      )
    ) {
      chunks.push(currentChunk.join(""));
      currentChunk = [];
      currentTextLength = 0;
    }

    currentChunk.push(block);
    currentTextLength += textLength;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(""));
  }

  const sourceTextLength = sanitizeMarketingText(source).length;
  const chunkTextLength = sanitizeMarketingText(chunks.join("")).length;
  const normalizedChunks =
    chunkTextLength >= sourceTextLength * 0.65 ? chunks : [source];

  const introCandidate =
    normalizedChunks.length > 1 ? normalizedChunks[0] : "";
  const shouldUseIntro = hasMeaningfulMarketingIntro(introCandidate);
  const contentChunks = shouldUseIntro
    ? normalizedChunks.slice(1)
    : normalizedChunks;

  const seenIds = new Map();
  const sectionBlocks = contentChunks.map((chunk, index) => {
    const text = sanitizeMarketingText(chunk);
    const title = inferFallbackSectionTitle(
      text,
      index,
      contentChunks.length,
      fallbackTitle,
    );
    const baseId = slugifySectionHeading(title) || `section-${index + 1}`;
    const seenCount = seenIds.get(baseId) || 0;
    seenIds.set(baseId, seenCount + 1);

    return {
      id: seenCount > 0 ? `${baseId}-${seenCount + 1}` : baseId,
      title,
      html: chunk,
      summary: text.slice(0, 180),
    };
  });

  return {
    introHtml: shouldUseIntro ? introCandidate : "",
    sectionBlocks,
  };
}

function extractMarketingSectionLayout(html, fallbackTitle = "Overview") {
  const source = String(html || "").trim();
  if (!source) {
    return { introHtml: "", sectionBlocks: [] };
  }

  const headingRegex = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(source))) {
    const title = sanitizeMarketingText(match[2]);
    if (
      !title ||
      /^\$/.test(title) ||
      /^then\s+\$/i.test(title) ||
      /^(benefits|pricing|description|monthly plan|3-month plan|discount auto-applied at checkout|no hidden fees\.?|what people ask before starting)$/i.test(
        title,
      ) ||
      /(klarna|after ?pay)/i.test(title)
    ) {
      continue;
    }

    headings.push({
      level: Number(match[1]),
      title,
      index: match.index,
      endIndex: headingRegex.lastIndex,
    });
  }

  if (headings.length >= 1) {
    const introCandidate = normalizeImportedMarketingHtml(
      source.slice(0, headings[0].index),
      null,
    );

    const sectionBlocks = headings
      .map((heading, index) => {
        const nextHeadingIndex = headings[index + 1]?.index ?? source.length;
        const blockHtml = normalizeImportedMarketingHtml(
          source.slice(heading.endIndex, nextHeadingIndex),
          null,
        );

        if (!hasMeaningfulMarketingBody(blockHtml)) {
          return null;
        }

        return {
          id: slugifySectionHeading(heading.title) || `section-${index + 1}`,
          level: heading.level,
          title: heading.title,
          html: blockHtml,
          summary: sanitizeMarketingText(blockHtml).slice(0, 180),
        };
      })
      .filter(Boolean);

    const filteredSectionBlocks = sectionBlocks.filter(
      (section) => !isLowSignalMarketingSectionTitle(section.title),
    );
    const seenSectionKeys = new Set();
    const dedupedSectionBlocks = filteredSectionBlocks.filter((section) => {
      const key = `${section.title.toLowerCase()}::${sanitizeMarketingText(section.html)
        .toLowerCase()
        .replace(/\s+/g, " ")
        .slice(0, 220)}`;

      if (seenSectionKeys.has(key)) {
        return false;
      }

      seenSectionKeys.add(key);
      return true;
    });

    const hasUnwieldyTitles = dedupedSectionBlocks.some(
      (section) => section.title.length > 70,
    );

    if (
      dedupedSectionBlocks.length > 0 &&
      !(headings.length > 2 && dedupedSectionBlocks.length < 2) &&
      dedupedSectionBlocks.length <= 10 &&
      !hasUnwieldyTitles
    ) {
      return {
        introHtml: hasMeaningfulMarketingIntro(introCandidate)
          ? introCandidate
          : "",
        sectionBlocks: dedupedSectionBlocks,
      };
    }
  }

  return buildFallbackMarketingSectionLayout(source, fallbackTitle);
}

function extractMarketingFaqItems(html) {
  const items = [];
  const regex = /<details\b[^>]*>([\s\S]*?)<\/details>/gi;
  const seenItems = new Set();
  let match;

  while ((match = regex.exec(String(html || "")))) {
    const block = String(match[1] || "");
    const summaryMatch = block.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i);
    const question = sanitizeMarketingText(summaryMatch?.[1] || "");
    const answerSource = block.replace(/<summary\b[^>]*>[\s\S]*?<\/summary>/i, "").trim();
    const answerHtml = normalizeImportedMarketingHtml(answerSource, null);
    const answerText = sanitizeMarketingText(answerSource);

    if (!question || !answerText) {
      continue;
    }

    const dedupeKey = `${question.toLowerCase()}::${answerText
      .toLowerCase()
      .replace(/\s+/g, " ")
      .slice(0, 220)}`;

    if (seenItems.has(dedupeKey)) {
      continue;
    }

    seenItems.add(dedupeKey);
    items.push({
      question,
      answerHtml,
      answerText,
    });
  }

  return items;
}

function stripExtractedFaqContent(html, faqItems) {
  let cleaned = String(html || "")
    .replace(/<h[1-6][^>]*>\s*(?:frequently asked questions(?: about [^<]+)?|what people ask before starting)\s*<\/h[1-6]>/gi, "")
    .replace(/<details\b[\s\S]*?<\/details>/gi, "");

  const answerTexts = new Set(
    faqItems
      .map((item) => item.answerText)
      .filter(Boolean),
  );

  if (answerTexts.size > 0) {
    cleaned = cleaned.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (match, inner) => {
      const text = sanitizeMarketingText(inner);
      return answerTexts.has(text) ? "" : match;
    });
  }

  return cleaned;
}

function hasMeaningfulMarketingBody(html) {
  const text = stripHtml(html);

  if (text.length >= 80) {
    return true;
  }

  if (text.length >= 24 && /<(p|ul|ol|blockquote|table|h[1-6]|figure)\b/i.test(html)) {
    return true;
  }

  return Boolean(
    text.length > 0 && /<(img|video|iframe)\b/i.test(html),
  );
}

function createFlowFallback({
  title,
  description,
  label,
  href,
  redirectTo,
  emptyStateTitle,
  emptyStateDescription,
}) {
  return {
    cta: {
      title,
      description,
      label,
      href,
    },
    redirectTo: redirectTo || null,
    emptyStateTitle:
      emptyStateTitle ||
      "Continue in HealSend",
    emptyStateDescription:
      emptyStateDescription ||
      "Use the next step below to continue with the right treatment or intake flow.",
  };
}

function normalizeFlowFallback(config) {
  if (!config) {
    return null;
  }

  if (config.cta) {
    return config;
  }

  return createFlowFallback(config);
}

function extractShortcodes(value) {
  const shortcodes = [];
  const regex = /\[(?!\/)([a-z0-9_-]+)([^\]]*)\]/gi;
  let match;

  while ((match = regex.exec(String(value || "")))) {
    const name = String(match[1] || "").toLowerCase();
    const attrs = {};
    const attrsRegex =
      /([a-z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s\]]+))/gi;
    let attrsMatch;

    while ((attrsMatch = attrsRegex.exec(match[2] || ""))) {
      attrs[String(attrsMatch[1] || "").toLowerCase()] =
        attrsMatch[2] || attrsMatch[3] || attrsMatch[4] || "";
    }

    shortcodes.push({
      name,
      attrs,
      raw: match[0],
    });
  }

  return shortcodes;
}

function resolveReadableMarketingTitle(value, slug) {
  const text = sanitizeMarketingText(value);
  if (!text) {
    return humanizeSlugTitle(slug);
  }

  return isSlugLikeTitle(text, slug) ? humanizeSlugTitle(slug) : text;
}

function resolveShortcodeCategoryHref(category, slug) {
  const normalized = String(category || "")
    .trim()
    .toLowerCase();

  if (SHORTCODE_CATEGORY_ROUTE_MAP[normalized]) {
    return SHORTCODE_CATEGORY_ROUTE_MAP[normalized];
  }

  if (normalized.replace(/\s+/g, "") === "nad+glutathione") {
    return "/funnels/nad-injection-therapy";
  }

  if (slug && /(erectile|performance|viagra|cialis|sildenafil|ed-meds)/i.test(slug)) {
    return "/funnels/performance-issues";
  }

  if (slug && /(pt-141|oxytocin|sexual|intimacy)/i.test(slug)) {
    return "/funnels/low-intimacy-drive";
  }

  if (slug && /(nad|glutathione|longevity|anti-aging|energy)/i.test(slug)) {
    return "/funnels/nad-injection-therapy";
  }

  if (slug && /(sermorelin|enclomiphene|strength|recovery|hrt)/i.test(slug)) {
    return MARKETING_ROUTE_PATHS.strength;
  }

  if (slug && /(glp|weight|semaglutide|tirzepatide)/i.test(slug)) {
    return "/funnels/glp-1";
  }

  if (slug && /(sleep|insomnia|trazodone|mirtazapine|ramalteon)/i.test(slug)) {
    return "/funnels/sleep-support";
  }

  return null;
}

function buildShortcodeFallback(shortcodes, slug) {
  for (const shortcode of shortcodes) {
    if (shortcode.name === "woocommerce_checkout") {
      return createFlowFallback({
        title: "Continue to checkout",
        description:
          "Start in the cart, then continue to checkout.",
        label: "Go to cart",
        href: "/cart",
        redirectTo: "/cart",
        ...SHORTCODE_TYPE_COPY.checkout,
      });
    }

    if (
      shortcode.name === "hld_custom_login_form" ||
      (shortcode.name === "fluentform" && shortcode.attrs.id === "12")
    ) {
      return createFlowFallback({
        title: "Log in to HealSend",
        description:
          "Use the current HealSend login flow to access your account and care.",
        label: "Go to login",
        href: MARKETING_ROUTE_PATHS.login,
        redirectTo: MARKETING_ROUTE_PATHS.login,
        ...SHORTCODE_TYPE_COPY.login,
      });
    }

    if (shortcode.name === "hld_custom_signup_form") {
      return createFlowFallback({
        title: "Create your HealSend account",
        description:
          "Use the current HealSend signup flow to create your account and continue care.",
        label: "Create account",
        href: "/signup",
        redirectTo: "/signup",
        ...SHORTCODE_TYPE_COPY.signup,
      });
    }

    if (["patient_dashboard", "dashboard"].includes(shortcode.name)) {
      return createFlowFallback({
        title: "Open your HealSend account",
        description:
          "Continue through your account for orders, messages, and care.",
        label: "Open account",
        href: "/account",
        redirectTo: "/account",
        ...SHORTCODE_TYPE_COPY.account,
      });
    }

    if (shortcode.name === "fluentform-resume") {
      return createFlowFallback({
        title: "Resume your HealSend flow",
        description:
          "Use your HealSend account to continue where you left off.",
        label: "Open account",
        href: "/account",
        redirectTo: "/account",
        ...SHORTCODE_TYPE_COPY.resume,
      });
    }

    if (shortcode.name === "get_started") {
      return createFlowFallback({
        title: "Start your HealSend journey",
        description:
          "Start with the current HealSend care flow.",
        label: "Get started",
        href: MARKETING_ROUTE_PATHS.home,
        redirectTo: MARKETING_ROUTE_PATHS.home,
        ...SHORTCODE_TYPE_COPY.start,
      });
    }

    if (["healsend_form", "hld_glp_prefunnel"].includes(shortcode.name)) {
      const categoryHref = resolveShortcodeCategoryHref(
        shortcode.attrs.category,
        slug,
      );

      if (categoryHref) {
        return createFlowFallback({
          title: "Continue your HealSend intake",
          description:
            "Continue in the matching intake flow below.",
          label: "Continue intake",
          href: categoryHref,
          redirectTo: categoryHref,
          ...SHORTCODE_TYPE_COPY.intake,
        });
      }
    }
  }

  return null;
}

function buildShortcodeSupportCard(shortcodeNames, slug) {
  if (!shortcodeNames.includes("trustindex")) {
    return null;
  }

  const config = SHORTCODE_SUPPORT_CARD_MAP.trustindex;
  const relatedFlow = inferCustomPageFallback(slug, "");

  return {
    ...config,
    cta: relatedFlow?.cta || null,
  };
}

function summarizeShortcodeResolution({ shortcodes, slug, hasRenderableBody }) {
  const shortcodeNames = [...new Set(shortcodes.map((shortcode) => shortcode.name))];
  const unresolvedShortcodes = shortcodeNames.filter(
    (name) => !SUPPORTED_SHORTCODE_NAMES.has(name),
  );

  return {
    shortcodeNames,
    unresolvedShortcodes,
    supportCard: hasRenderableBody
      ? buildShortcodeSupportCard(shortcodeNames, slug)
      : null,
  };
}

function inferCustomPageFallback(slug, contentHtml) {
  const directMatch = normalizeFlowFallback(CUSTOM_PAGE_FALLBACKS[slug]);
  if (directMatch) {
    return directMatch;
  }

  const shortcodes = extractShortcodes(contentHtml);
  const shortcodeMatch = buildShortcodeFallback(shortcodes, slug);
  if (shortcodeMatch) {
    return shortcodeMatch;
  }

  for (const entry of CUSTOM_PAGE_SHORTCODE_FALLBACKS) {
    if (entry.pattern.test(contentHtml || "")) {
      return normalizeFlowFallback(entry);
    }
  }

  if (/(glp|weight|semaglutide|tirzepatide)/i.test(slug)) {
    return createFlowFallback({
      title: "Explore weight-loss care",
      description:
        "Open the custom weight-loss flow to see current treatment options.",
      label: "Explore weight loss",
      href: MARKETING_ROUTE_PATHS.weightLoss,
      ...SHORTCODE_TYPE_COPY.intake,
    });
  }

  if (/(pt-141|oxytocin|sexual|ed-meds)/i.test(slug)) {
    return createFlowFallback({
      title: "Explore sexual wellness care",
      description:
        "Open the custom sexual wellness flow to compare current options.",
      label: "Explore sexual health",
      href: MARKETING_ROUTE_PATHS.sexualHealth,
      ...SHORTCODE_TYPE_COPY.intake,
    });
  }

  if (/(nad|glutathione|longevity|anti-aging|energy)/i.test(slug)) {
    return createFlowFallback({
      title: "Explore anti-aging care",
      description:
        "Open the custom anti-aging and longevity experience.",
      label: "Explore anti-aging",
      href: "/anti-aging",
      ...SHORTCODE_TYPE_COPY.intake,
    });
  }

  if (/(sermorelin|enclomiphene|strength|recovery)/i.test(slug)) {
    return createFlowFallback({
      title: "Explore strength and recovery care",
      description:
        "Open the custom recovery flow to compare current treatment options.",
      label: "Explore strength and recovery",
      href: MARKETING_ROUTE_PATHS.strength,
      ...SHORTCODE_TYPE_COPY.intake,
    });
  }

  return createFlowFallback({
    title: "Explore HealSend",
    description:
      "Browse treatments to continue with discovery and care.",
    label: "Browse treatments",
    href: MARKETING_ROUTE_PATHS.shop,
  });
}

function mergeWithFallbackProductData(product, relatedProducts, marketingPage) {
  const pageContent = normalizeMarketingContentLinks(
    normalizeContentObject(marketingPage?.content),
  );
  const priceSummary = getProductPriceSummary(product) || {
    firstMonthPrice: fallbackProductContent.price.firstMonth,
    thenPrice: fallbackProductContent.price.regular,
    savings: fallbackProductContent.price.savings,
  };

  const contentRelatedProducts = normalizeContentArray(pageContent.relatedProducts);
  const summary = buildProductSummaryFallback(
    product,
    pageContent.summary ||
      stripHtml(product.shortDescription) ||
      stripHtml(product.description) ||
      "",
  );
  const fallbackFeatureDescription = buildProductFeatureFallback(product, summary);
  const cleanedTabsDescription = sanitizeProductCopy(
    pageContent.tabs?.description,
    sanitizeProductCopy(
      stripHtml(product.description) || stripHtml(product.shortDescription),
      summary,
    ) || fallbackProductContent.tabs.description,
  );
  const cleanedFeatureDescription = sanitizeProductParagraphArray(
    pageContent.featureSection?.description,
    fallbackFeatureDescription,
  );
  const cleanedFaqs = sanitizeProductFaqItems(
    pageContent.faqs,
    fallbackProductContent.faqs,
  );
  const seoDescription = resolveMarketingSeoDescription({
    seoDescription: marketingPage?.seoDescription,
    description: summary,
    html: stripHtml(product.description) || stripHtml(product.shortDescription),
    title: product.name,
    slug: product.slug,
    sourcePostType: "product",
    careLabel: product.category?.name
      ? `${product.category.name.toLowerCase()} care`
      : inferMarketingCareLabel(product.slug, product.name),
  });

  return {
    ...fallbackProductContent,
    ...pageContent,
    id: product.slug,
    slug: product.slug,
    name: product.name,
    summary,
    inStock: product.inStock ?? fallbackProductContent.inStock,
    image:
      pageContent.image ||
      normalizeMarketingImage(marketingPage?.heroImage) ||
      getPublicCatalogPrimaryImage(product, null) ||
      fallbackProductContent.image,
    price: {
      firstMonth: priceSummary.firstMonthPrice,
      regular: priceSummary.thenPrice ?? priceSummary.firstMonthPrice,
      savings: priceSummary.savings,
    },
    seoTitle: marketingPage?.seoTitle || null,
    seoDescription,
    tabs: {
      ...fallbackProductContent.tabs,
      ...normalizeContentObject(pageContent.tabs),
      benefits:
        normalizeContentArray(pageContent.tabs?.benefits).length > 0
          ? pageContent.tabs.benefits
          : fallbackProductContent.tabs.benefits,
      pricing:
        pageContent.tabs?.pricing || buildPricingTab(product),
      description: cleanedTabsDescription,
    },
    faqs: cleanedFaqs,
    featureSection: {
      ...fallbackProductContent.featureSection,
      ...normalizeContentObject(pageContent.featureSection),
      description: cleanedFeatureDescription,
      image:
        pageContent.featureSection?.image ||
        pageContent.image ||
        getPublicCatalogPrimaryImage(product, null) ||
        fallbackProductContent.featureSection.image,
    },
    supportSection: {
      ...fallbackProductContent.supportSection,
      ...normalizeContentObject(pageContent.supportSection),
      features:
        normalizeContentArray(pageContent.supportSection?.features).length > 0
          ? pageContent.supportSection.features
          : fallbackProductContent.supportSection.features,
    },
    benefitsCarouselTitle:
      pageContent.benefitsCarouselTitle ||
      `What are the benefits of ${product.name}?`,
    benefitsCarousel:
      normalizeContentArray(pageContent.benefitsCarousel).length > 0
        ? pageContent.benefitsCarousel.map((item) => ({
            ...item,
            image:
              item?.image ||
              pageContent.image ||
              getPublicCatalogPrimaryImage(product, null) ||
              fallbackProductContent.image,
          }))
        : fallbackProductContent.benefitsCarousel,
    researchSection: {
      ...fallbackProductContent.researchSection,
      ...normalizeContentObject(pageContent.researchSection),
      image:
        pageContent.researchSection?.image ||
        pageContent.image ||
        getPublicCatalogPrimaryImage(product, null) ||
        fallbackProductContent.researchSection.image,
    },
    labTestedSection: {
      ...fallbackProductContent.labTestedSection,
      ...normalizeContentObject(pageContent.labTestedSection),
      image:
        pageContent.labTestedSection?.image ||
        pageContent.image ||
        getPublicCatalogPrimaryImage(product, null) ||
        fallbackProductContent.labTestedSection.image,
    },
    pricingHighlights:
      normalizeStringArray(pageContent.pricingHighlights).length > 0
        ? normalizeStringArray(pageContent.pricingHighlights)
        : [
            "No hidden fees",
            "Personalized plans",
            "On-demand medical support",
            "Free expedited shipping",
          ],
    simpleSteps:
      normalizeContentArray(pageContent.simpleSteps).length > 0
        ? pageContent.simpleSteps
        : null,
    comprehensiveCare: {
      title:
        pageContent.comprehensiveCare?.title ||
        "The most comprehensive anti-aging care program online.",
      description:
        pageContent.comprehensiveCare?.description ||
        "Most wellness programs stop at product access. HealSend pairs your treatment with clinician guidance, support, and ongoing care.",
      introLabel:
        pageContent.comprehensiveCare?.introLabel || "HealSend",
      introText:
        pageContent.comprehensiveCare?.introText ||
        "You're not just getting medication. You're getting clinician-guided support built to help you stay consistent, informed, and progressing toward better energy and long-term wellness.",
      ctaText:
        pageContent.comprehensiveCare?.ctaText ||
        `Start Your ${product.name} Journey`,
      features:
        normalizeContentArray(pageContent.comprehensiveCare?.features).length > 0
          ? pageContent.comprehensiveCare.features
          : null,
    },
    relatedProducts:
      contentRelatedProducts.length > 0
        ? contentRelatedProducts.map((relatedProduct) => ({
            ...relatedProduct,
            id: relatedProduct.id || relatedProduct.slug,
            image:
              normalizeMarketingImage(relatedProduct.image) ||
              pageContent.image ||
              fallbackProductContent.image,
            href:
              relatedProduct.href ||
              getMarketingProductDetailPath(relatedProduct.id || relatedProduct.slug),
          }))
        : relatedProducts.length > 0
          ? relatedProducts.map((relatedProduct) => ({
              id: relatedProduct.slug,
              name: relatedProduct.name,
              image: getPublicCatalogPrimaryImage(
                relatedProduct,
                fallbackProductContent.image,
              ),
              href: getMarketingProductDetailPath(relatedProduct.slug),
            }))
          : fallbackProductContent.relatedProducts,
  };
}

export async function getMarketingHomePageData() {
  if (!(await canReachLocalDatabase())) {
    warnOnce("marketing-home-db-unavailable", "[marketing] Local database is unavailable, using fallback home content.");
    return null;
  }

  try {
    const [categories, homePage] = await Promise.all([
      prisma.category.findMany({
        where: {
          slug: { in: HOME_CATEGORY_ORDER.map((category) => category.slug) },
        },
        select: { id: true, slug: true },
      }),
      prisma.marketingPage.findUnique({
        where: { slug: "home" },
        select: {
          title: true,
          seoTitle: true,
          seoDescription: true,
          content: true,
        },
      }),
    ]);

    const pageContent = normalizeMarketingContentLinks(
      normalizeContentObject(homePage?.content),
    );
    const pageData = {
      ...pageContent,
      title: homePage?.title || pageContent.title || "HealSend",
      seoTitle: homePage?.seoTitle || pageContent.seoTitle || null,
      seoDescription:
        homePage?.seoDescription || pageContent.seoDescription || null,
      heroImage:
        normalizeMarketingImage(
          pageContent.heroImage || pageContent.image || pageContent.featuredImage,
          getDefaultMarketingImageForPath("/"),
        ) || getDefaultMarketingImageForPath("/"),
      weightLossProducts: [],
      sexualHealthProducts: [],
      energyProducts: [],
      strengthProducts: [],
    };

    if (categories.length === 0) {
      return Object.keys(pageContent).length > 0 ? pageData : null;
    }

    const categoryIds = categories.map((category) => category.id);
    const categoryIdsBySlug = new Map(
      categories.map((category) => [category.slug, category.id]),
    );

    const products = filterReadyPublicCatalogProducts(await prisma.product.findMany({
      where: buildPublicCatalogProductWhere({
        published: true,
        categoryId: { in: categoryIds },
      }),
      include: {
        category: true,
        variants: true,
      },
      orderBy: [{ featured: "desc" }, { priority: "desc" }, { createdAt: "asc" }],
    }));

    for (const category of HOME_CATEGORY_ORDER) {
      const categoryId = categoryIdsBySlug.get(category.slug);
      if (!categoryId) {
        continue;
      }

      pageData[category.key] = products
        .filter((product) => product.categoryId === categoryId)
        .map(mapCarouselProduct);
    }

    return pageData;
  } catch (error) {
    warnOnce(
      "marketing-home-query-failed",
      `[marketing] Failed to load home page data, using fallback content. ${error?.message || ""}`.trim(),
    );
    return null;
  }
}

export async function getMarketingCategoryPageData(slug) {
  const categorySlug = resolveMarketingCategorySlug(slug) || slug;
  const fallbackContent = MARKETING_CATEGORY_PAGE_CONTENT[categorySlug];

  const fallbackPage = {
    slug: categorySlug,
    categoryName: categorySlug,
    eyebrow: fallbackContent?.eyebrow || "Treatments",
    title:
      fallbackContent?.title ||
      `Provider-guided ${categorySlug.replace(/-/g, " ")} care built for real life.`,
    description:
      fallbackContent?.description ||
      "Explore treatment options with clear pricing, clinician review, and home delivery.",
    highlights: fallbackContent?.highlights || [
      "Transparent monthly pricing",
      "Licensed clinician review",
      "Medication delivered discreetly",
    ],
    ctaText: fallbackContent?.ctaText || "Get started",
    ctaHref: fallbackContent?.fallbackCtaHref || MARKETING_ROUTE_PATHS.shop,
    heroImage:
      normalizeMarketingImage(
        fallbackContent?.fallbackImage,
        WORDPRESS_MARKETING_IMAGES.nadInjection,
      ) || WORDPRESS_MARKETING_IMAGES.nadInjection,
    products: [],
    featuredProducts: fallbackContent?.fallbackFeaturedProducts || [],
    supportPillars: fallbackContent?.supportPillars || [],
    careSteps: fallbackContent?.careSteps || [],
    introHtml: "",
    sectionBlocks: [],
    faqItems: [],
    hasRenderableBody: false,
    offerDetails: null,
    seoTitle: null,
    seoDescription: null,
  };

  if (!(await canReachLocalDatabase())) {
    if (!fallbackContent) {
      return null;
    }

    warnOnce(
      `marketing-category-db-unavailable:${categorySlug}`,
      `[marketing] Local database is unavailable for ${categorySlug}, using fallback category content.`,
    );
    return fallbackPage;
  }

  try {
    const marketingPage = await prisma.marketingPage.findFirst({
      where: {
        pageType: "CATEGORY",
        OR: [{ slug: categorySlug }, { slug }],
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        seoTitle: true,
        seoDescription: true,
        heroImage: true,
        categoryId: true,
        contentHtml: true,
        content: true,
      },
    });

    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: categorySlug },
          ...(marketingPage?.categoryId ? [{ id: marketingPage.categoryId }] : []),
        ],
      },
      include: {
        products: {
          where: buildPublicCatalogProductWhere({ published: true }),
          include: {
            category: true,
            variants: true,
          },
          orderBy: [
            { featured: "desc" },
            { priority: "desc" },
            { createdAt: "asc" },
          ],
        },
      },
    });

    if (!category && !marketingPage && !fallbackContent) {
      return null;
    }

    const pageContent = normalizeMarketingContentLinks(
      normalizeContentObject(marketingPage?.content),
    );
    const rawHtml =
      pageContent.sourceHtml ||
      marketingPage?.contentHtml ||
      "";
    const sanitizedHtml = sanitizeMarketingHtml(rawHtml);
    const normalizedHtml = normalizeImportedMarketingHtml(
      sanitizedHtml,
      fallbackPage.heroImage,
    );
    const contentSource = stripImportedMarketingPromoPrelude(normalizedHtml);
    const faqItems = extractMarketingFaqItems(contentSource);
    const html = normalizeImportedMarketingHtml(
      stripExtractedFaqContent(contentSource, faqItems),
      fallbackPage.heroImage,
    );
    const { introHtml, sectionBlocks } = extractMarketingSectionLayout(
      html,
      category?.name || fallbackPage.title,
    );
    const extractedHighlights = [
      ...extractMarketingHighlights(contentSource),
      ...extractMarketingTopParagraphHighlights(contentSource),
    ];
    const storedHighlights = normalizeStringArray(pageContent.highlights)
      .map((entry) => sanitizeMarketingHighlightItem(entry))
      .filter(Boolean);
    const preferFallbackCategoryCopy = Boolean(fallbackContent) && (
      hasDirtyCategoryBodyContent(contentSource, sectionBlocks) ||
      hasOverSpecificCategoryCopy(
        categorySlug,
        pageContent.title,
        pageContent.description,
        marketingPage?.title,
        marketingPage?.excerpt,
        marketingPage?.seoTitle,
        marketingPage?.seoDescription,
      )
    );

    if (!category) {
      if (!fallbackContent) {
        return null;
      }

      return fallbackPage;
    }

    const readyCategoryProducts = filterReadyPublicCatalogProducts(category.products);

    const mappedProducts = readyCategoryProducts.map(mapCarouselProduct);
    const featuredProducts =
      readyCategoryProducts.length > 0
        ? readyCategoryProducts.slice(0, 3).map(mapFeaturedCategoryProduct)
        : fallbackContent?.fallbackFeaturedProducts || [];
    const primaryProduct = readyCategoryProducts[0];
    const resolvedTitle = preferFallbackCategoryCopy
      ? fallbackPage.title
      : pageContent.title ||
        marketingPage?.title ||
        fallbackPage.title;
    const resolvedDescription = preferFallbackCategoryCopy
      ? fallbackPage.description
      : pageContent.description ||
        marketingPage?.excerpt ||
        sanitizeMarketingText(html).slice(0, 280) ||
        stripHtml(category.description) ||
        fallbackPage.description;
    const resolvedHighlights = preferFallbackCategoryCopy
      ? fallbackPage.highlights
      : storedHighlights.length > 0
        ? storedHighlights.slice(0, 6)
        : extractedHighlights.length > 0
          ? [...new Set(extractedHighlights)].slice(0, 6)
          : fallbackPage.highlights;
    const resolvedSupportPillars =
      normalizeContentArray(pageContent.supportPillars).length > 0 &&
      !preferFallbackCategoryCopy
        ? pageContent.supportPillars
        : fallbackPage.supportPillars;
    const resolvedCareSteps =
      normalizeContentArray(pageContent.careSteps).length > 0 &&
      !preferFallbackCategoryCopy
        ? pageContent.careSteps
        : fallbackPage.careSteps;
    const resolvedIntroHtml = preferFallbackCategoryCopy ? "" : introHtml;
    const resolvedSectionBlocks = preferFallbackCategoryCopy ? [] : sectionBlocks;
    const resolvedFaqItems = preferFallbackCategoryCopy ? [] : faqItems;
    const resolvedSeoDescription = preferFallbackCategoryCopy
      ? resolveMarketingSeoDescription({
          seoDescription: "",
          description: fallbackPage.description,
          html: "",
          title: resolvedTitle,
          slug: marketingPage?.slug || categorySlug,
          sourcePostType: "category",
          careLabel: `${category.name.toLowerCase()} care`,
        })
      : resolveMarketingSeoDescription({
          seoDescription: marketingPage?.seoDescription,
          description: pageContent.description || fallbackPage.description,
          html: stripHtml(category.description),
          title: marketingPage?.title || fallbackPage.title,
          slug: marketingPage?.slug || categorySlug,
          sourcePostType: "category",
          careLabel: `${category.name.toLowerCase()} care`,
        });

    return {
      ...fallbackPage,
      slug: marketingPage?.slug || fallbackPage.slug,
      categoryName: category.name,
      eyebrow:
        preferFallbackCategoryCopy
          ? fallbackPage.eyebrow
          : pageContent.eyebrow ||
            marketingPage?.title ||
            fallbackContent?.eyebrow ||
            category.name,
      title: resolvedTitle,
      description: resolvedDescription,
      highlights: resolvedHighlights,
      ctaText:
        pageContent.ctaText ||
        fallbackContent?.ctaText ||
        fallbackPage.ctaText,
      ctaHref:
        pageContent.ctaHref ||
        (primaryProduct &&
          (getProductOnboardingPath(primaryProduct.slug) ||
            getMarketingProductDetailPath(primaryProduct.slug))) ||
        fallbackContent?.fallbackCtaHref ||
        MARKETING_ROUTE_PATHS.shop,
      heroImage:
        normalizeMarketingImage(pageContent.heroImage, fallbackPage.heroImage) ||
        normalizeMarketingImage(marketingPage?.heroImage, fallbackPage.heroImage) ||
        normalizeMarketingImage(category.image, fallbackPage.heroImage) ||
        featuredProducts[0]?.image ||
        fallbackPage.heroImage,
      products: mappedProducts,
      featuredProducts,
      supportPillars: resolvedSupportPillars,
      careSteps: resolvedCareSteps,
      introHtml: resolvedIntroHtml,
      sectionBlocks: resolvedSectionBlocks,
      faqItems: resolvedFaqItems,
      hasRenderableBody:
        !preferFallbackCategoryCopy && hasMeaningfulMarketingBody(html),
      offerDetails: extractMarketingOfferDetails(rawHtml),
      seoTitle: preferFallbackCategoryCopy ? null : marketingPage?.seoTitle || null,
      seoDescription: resolvedSeoDescription,
    };
  } catch (error) {
    if (!fallbackContent) {
      return null;
    }

    warnOnce(
      `marketing-category-query-failed:${categorySlug}`,
      `[marketing] Failed to load ${categorySlug} page data, using fallback category content. ${error?.message || ""}`.trim(),
    );
    return fallbackPage;
  }
}

export async function getMarketingProductPageData(slug) {
  const canonicalProductSlug = slug
    ? resolveMarketingProductSlug(slug) || slug
    : null;
  const syntheticFallback = canonicalProductSlug
    ? getSyntheticMarketingProductPageData(canonicalProductSlug)
    : null;

  if (canonicalProductSlug && isExcludedPublicCatalogSlug(canonicalProductSlug)) {
    return null;
  }

  if (!(await canReachLocalDatabase())) {
    warnOnce("marketing-product-db-unavailable", "[marketing] Local database is unavailable, using fallback product content.");
    return null;
  }

  try {
    const marketingPage = canonicalProductSlug
      ? await prisma.marketingPage.findFirst({
          where: {
            pageType: "PRODUCT",
            OR: [{ slug: canonicalProductSlug }, { slug }],
          },
          select: {
            title: true,
            seoTitle: true,
            seoDescription: true,
            heroImage: true,
            productId: true,
            content: true,
          },
        })
      : null;

    const primaryProduct = await prisma.product.findFirst({
      where: buildPublicCatalogProductWhere({
        published: true,
        ...(canonicalProductSlug
          ? {
              OR: [
                { slug: canonicalProductSlug },
                ...(slug && slug !== canonicalProductSlug ? [{ slug }] : []),
                ...(marketingPage?.productId ? [{ id: marketingPage.productId }] : []),
              ],
            }
          : {
              OR: [
                { slug: { in: MARKETING_PRIMARY_PRODUCT_SLUGS } },
                { slug: { contains: "nad" } },
                { name: { contains: "NAD", mode: "insensitive" } },
              ],
            }),
      }),
      include: {
        category: true,
        variants: true,
      },
      orderBy: [{ featured: "desc" }, { priority: "desc" }, { createdAt: "asc" }],
    });

    if (!primaryProduct || !isPublicCatalogProductReady(primaryProduct)) {
      return syntheticFallback;
    }

    const relatedProducts = filterReadyPublicCatalogProducts(await prisma.product.findMany({
      where: buildPublicCatalogProductWhere({
        published: true,
        categoryId: primaryProduct.categoryId || undefined,
        id: { not: primaryProduct.id },
      }),
      select: {
        slug: true,
        name: true,
        images: true,
      },
      orderBy: [{ featured: "desc" }, { priority: "desc" }, { createdAt: "asc" }],
      take: 2,
    }));

    return mergeWithFallbackProductData(
      primaryProduct,
      relatedProducts,
      marketingPage,
    );
  } catch (error) {
    warnOnce(
      "marketing-product-query-failed",
      `[marketing] Failed to load product page data, using fallback content. ${error?.message || ""}`.trim(),
    );
    return syntheticFallback;
  }
}

export async function getMarketingCustomPageData(slug) {
  if (!(await canReachLocalDatabase())) {
    const syntheticPage = getSyntheticNativeCustomPage(slug);
    if (syntheticPage) {
      return syntheticPage;
    }

    warnOnce(
      "marketing-custom-db-unavailable",
      "[marketing] Local database is unavailable for custom marketing pages.",
    );
    return null;
  }

  try {
    const marketingPage = await prisma.marketingPage.findFirst({
      where: {
        slug,
        pageType: "CUSTOM",
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        seoTitle: true,
        seoDescription: true,
        heroImage: true,
        contentHtml: true,
        content: true,
        sourcePostType: true,
        sourceUrl: true,
      },
    });

    if (!marketingPage) {
      return getSyntheticNativeCustomPage(slug);
    }

    const canonicalRedirect = CUSTOM_PAGE_CANONICAL_REDIRECTS[slug];
    if (canonicalRedirect) {
      const fallbackHeroImage = getDefaultMarketingImageForPath(`/${slug}`);
      const description =
        sanitizeMarketingText(marketingPage.excerpt) ||
        "Continue with the main HealSend route for this treatment.";
      return {
        slug: marketingPage.slug,
        title: resolveReadableMarketingTitle(
          marketingPage.title,
          marketingPage.slug,
        ),
        description,
        redirectTo: canonicalRedirect,
        heroImage:
          normalizeMarketingImage(marketingPage.heroImage, fallbackHeroImage) ||
          fallbackHeroImage,
        seoTitle: sanitizeMarketingText(marketingPage.seoTitle) || null,
        seoDescription: resolveMarketingSeoDescription({
          seoDescription: marketingPage.seoDescription,
          description,
          html: "",
          title: marketingPage.title,
          slug: marketingPage.slug,
          sourcePostType: marketingPage.sourcePostType || "page",
        }),
        sourcePostType: marketingPage.sourcePostType || "page",
        sourceUrl: marketingPage.sourceUrl || null,
        noIndex: EXCLUDED_PUBLIC_CUSTOM_PAGE_SLUGS.has(marketingPage.slug),
      };
    }

    if (slug === "psychiatry") {
      const fallbackHeroImage = getDefaultMarketingImageForPath("/psychiatry");
      const relatedPages = await prisma.marketingPage.findMany({
        where: {
          pageType: "CUSTOM",
          slug: {
            in: PSYCHIATRY_FEATURED_PAGE_CONFIG.map((page) => page.slug),
          },
        },
        select: {
          slug: true,
          title: true,
          heroImage: true,
          seoDescription: true,
        },
      });

      const relatedPagesBySlug = new Map(
        relatedPages.map((page) => [page.slug, page]),
      );

      return {
        slug: marketingPage.slug,
        nativeTemplate: "psychiatry",
        title: "Online mental health medication and care that feels human.",
        eyebrow: "Mental Health Care",
        description:
          "Compare clinician-guided medication options for ADHD, anxiety, and depression with faster access, straightforward pricing, and ongoing follow-up care.",
        heroImage: fallbackHeroImage,
        highlights: [
          "Same-day appointment availability",
          "Insurance-friendly care paths",
          "Ongoing provider messaging and follow-up",
        ],
        featuredTreatments: PSYCHIATRY_FEATURED_PAGE_CONFIG.map((config) => {
          const page = relatedPagesBySlug.get(config.slug);
          return {
            slug: config.slug,
            title: sanitizeMarketingText(page?.title || config.slug),
            href: `/${config.slug}`,
            image:
              normalizeMarketingImage(page?.heroImage, fallbackHeroImage) ||
              fallbackHeroImage,
            label: config.label,
            description:
              sanitizeMarketingText(page?.seoDescription) ||
              config.description,
          };
        }).filter((page) => page.title),
        insuranceLogos: PSYCHIATRY_INSURANCE_LOGOS,
        seoTitle:
          sanitizeMarketingText(marketingPage.seoTitle) ||
          "Online Mental Health Medication & Care | HealSend",
        seoDescription: resolveMarketingSeoDescription({
          seoDescription: marketingPage.seoDescription,
          description:
            "Online access to ADHD, anxiety, and depression care with clinician review and medication options through HealSend.",
          html: "",
          title: marketingPage.title,
          slug: marketingPage.slug,
          sourcePostType: marketingPage.sourcePostType || "page",
          careLabel: "online mental-health care",
        }),
        sourcePostType: marketingPage.sourcePostType || "page",
        sourceUrl: marketingPage.sourceUrl || null,
        redirectTo: null,
        noIndex: EXCLUDED_PUBLIC_CUSTOM_PAGE_SLUGS.has(marketingPage.slug),
      };
    }

    const pageContent = normalizeMarketingContentLinks(
      normalizeContentObject(marketingPage.content),
    );
    const fallbackHeroImage = getDefaultMarketingImageForPath(`/${slug}`);
    const heroImage =
      normalizeMarketingImage(pageContent.heroImage, fallbackHeroImage) ||
      normalizeMarketingImage(marketingPage.heroImage, fallbackHeroImage) ||
      fallbackHeroImage;
    const rawHtml =
      pageContent.sourceHtml ||
      marketingPage.contentHtml ||
      "";
    const shortcodes = extractShortcodes(rawHtml);
    const sanitizedHtml = sanitizeMarketingHtml(rawHtml);
    const normalizedHtml = normalizeImportedMarketingHtml(
      sanitizedHtml,
      heroImage,
    );
    const contentSource = stripImportedMarketingPromoPrelude(normalizedHtml);
    const faqItems = extractMarketingFaqItems(contentSource);
    const html = normalizeImportedMarketingHtml(
      stripExtractedFaqContent(contentSource, faqItems),
      heroImage,
    );
    const resolvedTitle = resolveReadableMarketingTitle(
      pageContent.heroTitle || marketingPage.title,
      marketingPage.slug,
    );
    const { introHtml, sectionBlocks } = extractMarketingSectionLayout(
      html,
      "Overview",
    );
    const description =
      sanitizeMarketingText(
        pageContent.sourceExcerpt ||
          marketingPage.excerpt ||
          html,
      ).slice(0, 280) ||
      "Explore this HealSend page for treatment details and next steps.";
    const fallback = inferCustomPageFallback(slug, rawHtml);
    const careLabel =
      fallback?.cta?.href && fallback.cta.href.startsWith("/")
        ? inferMarketingCareLabel(fallback.cta.href, marketingPage.title)
        : inferMarketingCareLabel(slug, marketingPage.title);
    const extractedHighlights = [
      ...extractMarketingHighlights(contentSource),
      ...extractMarketingTopParagraphHighlights(contentSource),
    ];
    const offerDetails = extractMarketingOfferDetails(rawHtml);
    const highlights = normalizeStringArray(pageContent.highlights)
      .map((entry) => sanitizeMarketingHighlightItem(entry))
      .filter(Boolean)
      .slice(0, 6);

    const hasRenderableBody = hasMeaningfulMarketingBody(html);
    const hasRenderableContent = hasRenderableBody || faqItems.length > 0;
    const shortcodeResolution = summarizeShortcodeResolution({
      shortcodes,
      slug,
      hasRenderableBody: hasRenderableContent,
    });

    const basePage = {
      slug: marketingPage.slug,
      title: resolvedTitle,
      eyebrow:
        sanitizeMarketingText(pageContent.eyebrow) ||
        (marketingPage.sourcePostType === "post" ? "HealSend Article" : "HealSend"),
      description,
      heroImage,
      highlights:
        highlights.length > 0
          ? highlights
          : [...new Set(extractedHighlights)].slice(0, 6),
      offerDetails,
      html,
      introHtml,
      sectionBlocks,
      hasRenderableBody,
      faqItems,
      redirectTo: !hasRenderableContent ? fallback?.redirectTo || null : null,
      cta: fallback?.cta || null,
      emptyStateTitle: fallback?.emptyStateTitle || null,
      emptyStateDescription: fallback?.emptyStateDescription || null,
      seoTitle: sanitizeMarketingText(marketingPage.seoTitle) || null,
      seoDescription: resolveMarketingSeoDescription({
        seoDescription: marketingPage.seoDescription,
        description,
        html,
        title: marketingPage.title,
        slug,
        sourcePostType: marketingPage.sourcePostType || "page",
        careLabel,
      }),
      sourcePostType: marketingPage.sourcePostType || "page",
      sourceUrl: marketingPage.sourceUrl || null,
      structuredContent: pageContent,
      shortcodeNames: shortcodeResolution.shortcodeNames,
      unresolvedShortcodes: shortcodeResolution.unresolvedShortcodes,
      shortcodeSupportCard: shortcodeResolution.supportCard,
      noIndex: EXCLUDED_PUBLIC_CUSTOM_PAGE_SLUGS.has(marketingPage.slug),
    };

    const nativeMedicationConfig = NATIVE_MEDICATION_PAGE_CONFIG[slug];
    if (nativeMedicationConfig) {
      return buildNativeLandingPage(
        basePage,
        nativeMedicationConfig,
        "medicationLanding",
      );
    }

    const nativeTreatmentConfig = NATIVE_TREATMENT_PAGE_CONFIG[slug];
    if (nativeTreatmentConfig) {
      return buildNativeLandingPage(
        basePage,
        nativeTreatmentConfig,
        "treatmentLanding",
      );
    }

    if (
      isLegalMarketingPage({
        slug: marketingPage.slug,
        title: marketingPage.title,
        sourceUrl: marketingPage.sourceUrl,
      })
    ) {
      return {
        ...basePage,
        nativeTemplate: "legalDocument",
      };
    }

    if (
      shouldUseEditorialTemplate({
        basePage,
        sourcePostType: marketingPage.sourcePostType || "page",
      })
    ) {
      return {
        ...basePage,
        nativeTemplate: "editorialArticle",
      };
    }

    return basePage;
  } catch (error) {
    warnOnce(
      `marketing-custom-query-failed:${slug}`,
      `[marketing] Failed to load ${slug} custom page data. ${error?.message || ""}`.trim(),
    );
    return null;
  }
}

function updateSitemapEntry(map, path, lastModified) {
  if (!path) {
    return;
  }

  const normalizedDate = lastModified ? new Date(lastModified) : new Date();
  const current = map.get(path);

  if (
    !current ||
    new Date(current.lastModified).getTime() < normalizedDate.getTime()
  ) {
    map.set(path, {
      path,
      lastModified: normalizedDate,
    });
  }
}

function getCustomPageSitemapState(marketingPage) {
  const pageContent = normalizeMarketingContentLinks(
    normalizeContentObject(marketingPage.content),
  );
  const fallbackHeroImage = getDefaultMarketingImageForPath(
    `/${marketingPage.slug}`,
  );
  const heroImage =
    normalizeMarketingImage(pageContent.heroImage, fallbackHeroImage) ||
    normalizeMarketingImage(marketingPage.heroImage, fallbackHeroImage) ||
    fallbackHeroImage;
  const rawHtml = pageContent.sourceHtml || marketingPage.contentHtml || "";
  const sanitizedHtml = sanitizeMarketingHtml(rawHtml);
  const normalizedHtml = normalizeImportedMarketingHtml(
    sanitizedHtml,
    heroImage,
  );
  const contentSource = stripImportedMarketingPromoPrelude(normalizedHtml);
  const faqItems = extractMarketingFaqItems(contentSource);
  const html = normalizeImportedMarketingHtml(
    stripExtractedFaqContent(contentSource, faqItems),
    heroImage,
  );
  const hasRenderableContent =
    hasMeaningfulMarketingBody(html) || faqItems.length > 0;
  const fallback = inferCustomPageFallback(marketingPage.slug, rawHtml);

  return {
    hasRenderableContent,
    redirectTo: !hasRenderableContent ? fallback?.redirectTo || null : null,
  };
}

export async function getPublicSitemapEntries() {
  const entries = new Map();

  updateSitemapEntry(entries, "/", null);
  updateSitemapEntry(entries, MARKETING_ROUTE_PATHS.shop, null);

  if (!(await canReachLocalDatabase())) {
    warnOnce(
      "marketing-sitemap-db-unavailable",
      "[marketing] Local database is unavailable for sitemap generation.",
    );
    return [...entries.values()].sort((a, b) => a.path.localeCompare(b.path));
  }

  try {
    const [homePage, products, categories, categoryPages, customPages] =
      await Promise.all([
        prisma.marketingPage.findFirst({
          where: { pageType: "HOME" },
          select: { updatedAt: true },
        }),
        prisma.product.findMany({
          where: buildPublicCatalogProductWhere({ published: true }),
          select: {
            name: true,
            images: true,
            regularPrice: true,
            salePrice: true,
            subscriptionTiers: true,
            variants: {
              select: {
                price: true,
                salePrice: true,
              },
            },
            slug: true,
            updatedAt: true,
          },
        }),
        prisma.category.findMany({
          where: {
            products: {
              some: {
                ...buildPublicCatalogProductWhere({ published: true }),
              },
            },
          },
          select: {
            slug: true,
            updatedAt: true,
          },
        }),
        prisma.marketingPage.findMany({
          where: { pageType: "CATEGORY" },
          select: {
            slug: true,
            updatedAt: true,
          },
        }),
        prisma.marketingPage.findMany({
          where: { pageType: "CUSTOM" },
          select: {
            slug: true,
            updatedAt: true,
            heroImage: true,
            contentHtml: true,
            content: true,
          },
        }),
      ]);

    updateSitemapEntry(entries, "/", homePage?.updatedAt || null);

    const readyProducts = filterReadyPublicCatalogProducts(products);

    const latestProductDate = readyProducts.reduce((latest, product) => {
      if (!latest) {
        return product.updatedAt;
      }

      return product.updatedAt > latest ? product.updatedAt : latest;
    }, null);

    updateSitemapEntry(entries, MARKETING_ROUTE_PATHS.shop, latestProductDate);

    for (const product of readyProducts) {
      updateSitemapEntry(
        entries,
        getMarketingProductDetailPath(product.slug),
        product.updatedAt,
      );
    }

    const categoryDates = new Map();
    const categoryCandidateSlugs = new Set(
      Object.keys(MARKETING_CATEGORY_PAGE_CONTENT),
    );

    for (const category of categories) {
      const canonicalSlug = resolveMarketingCategorySlug(category.slug) || category.slug;
      categoryCandidateSlugs.add(canonicalSlug);
      updateSitemapEntry(
        categoryDates,
        canonicalSlug,
        category.updatedAt,
      );
    }

    for (const categoryPage of categoryPages) {
      const canonicalSlug =
        resolveMarketingCategorySlug(categoryPage.slug) || categoryPage.slug;
      categoryCandidateSlugs.add(canonicalSlug);
      updateSitemapEntry(
        categoryDates,
        canonicalSlug,
        categoryPage.updatedAt,
      );
    }

    const resolvedCategoryPages = await Promise.all(
      [...categoryCandidateSlugs].map(async (slug) => {
        const page = await getMarketingCategoryPageData(slug);
        return page ? { slug: page.slug } : null;
      }),
    );

    for (const page of resolvedCategoryPages) {
      if (!page?.slug) {
        continue;
      }

      updateSitemapEntry(
        entries,
        `/${page.slug}`,
        categoryDates.get(page.slug)?.lastModified || homePage?.updatedAt || null,
      );
    }

    for (const customPage of customPages) {
      if (isExcludedPublicCatalogSlug(customPage.slug)) {
        continue;
      }

      if (EXCLUDED_PUBLIC_CUSTOM_PAGE_SLUGS.has(customPage.slug)) {
        continue;
      }

      const state = getCustomPageSitemapState(customPage);
      if (state.redirectTo) {
        continue;
      }

      updateSitemapEntry(entries, `/${customPage.slug}`, customPage.updatedAt);
    }

    return [...entries.values()].sort((a, b) => a.path.localeCompare(b.path));
  } catch (error) {
    warnOnce(
      "marketing-sitemap-query-failed",
      `[marketing] Failed to build public sitemap entries. ${error?.message || ""}`.trim(),
    );
    return [...entries.values()].sort((a, b) => a.path.localeCompare(b.path));
  }
}
