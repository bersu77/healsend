"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import {
  MarketingBanner,
  MarketingFooter,
  MarketingNavbar,
  MarketingProductCarousel,
  MARKETING_ROUTES,
} from "@/components/marketing/shared";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  normalizeHomepageHeadlinePhrases,
  normalizeHomepageManagedImage,
} from "@/lib/homepage-assets";
import { WORDPRESS_MARKETING_IMAGES } from "@/lib/marketing-images";
import { getFunnelPath } from "@/lib/product-routing";

const REFERENCE_HOME_ASSETS = Object.freeze({
  weightLossBand: "/images/home/reference/weight-loss-band.jpeg",
  nadBand: "/images/home/reference/nad-band.webp",
  splitFeatureProduct: "/images/home/reference/split-feature-product.jpg",
  splitFeatureGlow: "/images/home/reference/Photoroom-1.png",
  verifiedBadge: "/images/home/reference/verified-badge.svg",
  guideCard: "/images/home/reference/guide-card.jpg",
});

const BUNDLE_MARKETING_IMAGES = Object.freeze({
  semaglutideInjections:
    "/images/marketing/bundle/semaglutide-injections-product.png",
  tirzepatideInjections:
    "/images/marketing/bundle/tirzepatide-injections-product.png",
  oralTirzepatide: "/images/marketing/bundle/oral-tirzepatide-product.png",
  micB12: "/images/marketing/bundle/mic-b12-product.png",
  cjc1295Ipamorelin: "/images/marketing/bundle/cjc-1295-ipamorelin-product.png",
  glutathioneInjections:
    "/images/marketing/bundle/glutathione-injection-product.png",
  sermorelin: "/images/marketing/bundle/sermorelin-product.png",
  enclomiphene: "/images/marketing/bundle/enclomiphene-product.png",
  nadNasalSpray: "/images/marketing/bundle/nad-nasal-spray-product.png",
  oxytocinNasalSpray:
    "/images/marketing/bundle/oxytocin-nasal-spray-product.png",
  nadInjections: "/images/marketing/bundle/nad-injections-product.png",
  microdoseSemaglutideDrops:
    "/images/marketing/bundle/microdose-semaglutide-drops.webp",
});

const defaultWeightLossProducts = [
  {
    title: "Semaglutide Injection",
    price: "Starting at $149 per month",
    image: BUNDLE_MARKETING_IMAGES.semaglutideInjections,
    href: MARKETING_ROUTES.weightLoss,
    tags: [
      { label: "Most Popular", bg: "bg-green-500", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
  {
    title: "Tirzepatide Injection",
    price: "Starting at $199 per month",
    image: BUNDLE_MARKETING_IMAGES.tirzepatideInjections,
    href: MARKETING_ROUTES.weightLoss,
    tags: [
      { label: "Most Effective", bg: "bg-blue-600", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
  {
    title: "Tirzepatide Drops",
    price: "Starting at $199 per month",
    image: BUNDLE_MARKETING_IMAGES.oralTirzepatide,
    href: MARKETING_ROUTES.weightLoss,
    tags: [
      { label: "Needle-Free", bg: "bg-blue-500", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
  {
    title: "Lipotropic Injection",
    price: "Starting at $99 per month",
    image: BUNDLE_MARKETING_IMAGES.micB12,
    href: MARKETING_ROUTES.weightLoss,
    tags: [{ label: "Rx", bg: "bg-white", text: "text-black" }],
  },
];

const defaultSexualHealthProducts = [
  {
    title: "PT-141 Nasal Spray",
    price: "Starting at $129 per month",
    image: WORDPRESS_MARKETING_IMAGES.pt141,
    href: MARKETING_ROUTES.sexualHealth,
    tags: [
      { label: "Most Effective", bg: "bg-blue-600", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
  {
    title: "Oxytocin Nasal Spray",
    price: "Coming Soon*",
    image: BUNDLE_MARKETING_IMAGES.oxytocinNasalSpray,
    href: MARKETING_ROUTES.sexualHealth,
    tags: [
      { label: "Coming Soon", bg: "bg-black", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
  {
    title: "Sexual Wellness",
    price: "See your options in under 1 minute",
    image: WORDPRESS_MARKETING_IMAGES.pt141,
    href: MARKETING_ROUTES.sexualHealth,
    tags: [{ label: "Rx", bg: "bg-white", text: "text-black" }],
    isAssessment: true,
  },
];

const defaultEnergyProducts = [
  {
    title: "NAD+ Injection",
    price: "Starting at $139 per month",
    image: BUNDLE_MARKETING_IMAGES.nadInjections,
    href: MARKETING_ROUTES.nad,
    secondaryHref: MARKETING_ROUTES.nad,
    tags: [
      { label: "Most Popular", bg: "bg-green-500", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
  {
    title: "NAD+ Nasal Spray",
    price: "Starting at $139 per month",
    image: BUNDLE_MARKETING_IMAGES.nadNasalSpray,
    href: "/nad-nasal-spray",
    secondaryHref: "/nad-nasal-spray",
    tags: [
      { label: "Needle-Free", bg: "bg-blue-500", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
  {
    title: "NAD+ Patches",
    price: "Starting at $199 per month",
    image: WORDPRESS_MARKETING_IMAGES.nadPatches,
    href: "/nad-patches",
    secondaryHref: "/nad-patches",
    tags: [
      { label: "Needle-Free", bg: "bg-blue-500", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
];

const defaultStrengthProducts = [
  {
    title: "Sermorelin Injection",
    price: "Starting at $159 per month",
    image: BUNDLE_MARKETING_IMAGES.sermorelin,
    href: getFunnelPath("growth-hormone-support"),
    secondaryHref: "/sermorelin-injection-2",
    tags: [
      { label: "Most Popular", bg: "bg-green-500", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
  {
    title: "CJC-1295 + Ipamorelin",
    price: "Starting at $189 per month",
    image: BUNDLE_MARKETING_IMAGES.cjc1295Ipamorelin,
    href: getFunnelPath("growth-hormone-support"),
    secondaryHref: "/cjc-1295-ipamorelin",
    tags: [
      { label: "Recovery", bg: "bg-blue-600", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
  {
    title: "Enclomiphene",
    price: "Starting at $149 per month",
    image: BUNDLE_MARKETING_IMAGES.enclomiphene,
    href: getFunnelPath("growth-hormone-support"),
    secondaryHref: "/enclomiphene",
    tags: [
      { label: "Hormone Support", bg: "bg-[#7b75f0]", text: "text-white" },
      { label: "Rx", bg: "bg-white", text: "text-black" },
    ],
  },
];

const defaultHeroContent = {
  headlinePhrases: [
    { text: "Weight Loss", color: "#7B75F0" },
    { text: "More Energy", color: "#7B68EE" },
    { text: "Sharper Mind", color: "#2F5EFF" },
    { text: "Heal & Recover", color: "#12B379" },
    { text: "Stronger Body", color: "#485867" },
    { text: "Better Sex", color: "#8B2020" },
    { text: "100% Online", color: "#1D1D1F" },
  ],
  titleLineOne: "Weight loss",
  titleLineTwo: "tailored to you",
  description: "Look, feel and perform your best every day.",
  trustPoints: [
    {
      icon: BadgeCheck,
      label: "Licensed providers in your state",
    },
    {
      icon: Clock3,
      label: "Free discreet shipping",
    },
    {
      icon: ShieldCheck,
      label: "FSA & HSA eligible with all plans",
    },
  ],
  row1: [
    {
      title: "Personalized\nGLP-1 Treatments",
      subtitle: "for weight loss",
      image: "/images/marketing/glp1-hero-merged-tight.png",
      href: MARKETING_ROUTES.weightLoss,
      hoverOverlayClass:
        "bg-[radial-gradient(circle_at_center,#37c773_0%,#24ad62_44%,#149353_74%,#0c8c52_100%)]",
      artClass: "scale-[0.96] translate-x-1 sm:scale-[1.0]",
    },
    {
      title: "Oxytocin\nNasal Spray",
      subtitle: "for intimacy support",
      image: BUNDLE_MARKETING_IMAGES.oxytocinNasalSpray,
      href: "/oxytocin-nasal-spray",
      hoverOverlayClass:
        "bg-[radial-gradient(circle_at_center,#f55b7f_0%,#e94369_42%,#d52b56_72%,#c91d48_100%)]",
      artClass: "scale-[0.98] translate-x-2",
    },
    {
      title: "NAD+\nInjections",
      subtitle: "for energy and longevity",
      image: BUNDLE_MARKETING_IMAGES.nadInjections,
      href: MARKETING_ROUTES.nad,
      hoverOverlayClass:
        "bg-[radial-gradient(circle_at_center,#2ec5d9_0%,#23b2cf_40%,#1b99c6_70%,#177fbd_100%)]",
      artClass: "scale-[0.82] -translate-x-1",
    },
  ],
  row2: [
    {
      title: "MIC+B12",
      subtitle: "for mood and energy",
      image: BUNDLE_MARKETING_IMAGES.micB12,
      href: "/mic-injection",
      hoverOverlayClass:
        "bg-[radial-gradient(circle_at_center,#8a98ff_0%,#7886fb_42%,#6873f2_72%,#5c63ef_100%)]",
    },
    {
      title: "Hormone Therapy",
      subtitle: "for women",
      image: BUNDLE_MARKETING_IMAGES.enclomiphene,
      href: MARKETING_ROUTES.strength,
      hoverOverlayClass:
        "bg-[radial-gradient(circle_at_center,#b88aff_0%,#a272fb_42%,#905ff3_72%,#8459f1_100%)]",
    },
    {
      title: "Glutathione",
      subtitle: "for antioxidant support",
      image: BUNDLE_MARKETING_IMAGES.glutathioneInjections,
      href: "/glutathione-ldn",
      hoverOverlayClass:
        "bg-[radial-gradient(circle_at_center,#4fcbae_0%,#33b699_42%,#1fa987_72%,#119f7a_100%)]",
    },
    {
      title: "Skin Care",
      subtitle: "with NAD+",
      image: WORDPRESS_MARKETING_IMAGES.nadPatches,
      href: MARKETING_ROUTES.antiAging,
      hoverOverlayClass:
        "bg-[radial-gradient(circle_at_center,#66b9f6_0%,#4ea2ee_42%,#398be8_72%,#2f7fe6_100%)]",
    },
  ],
};

const defaultHomeBanners = [
  {
    title: "Lose weight Fast with GLP-1s online",
    subtitle: "• Licensed Providers • No Hidden Fees",
    buttonText: "Qualify in 1 minute",
    buttonHref: getFunnelPath("glp-1"),
    backgroundImage: REFERENCE_HOME_ASSETS.weightLossBand,
    backgroundPosition: "top center",
  },
  {
    title: "Activate arousal — safe, fast, and reliable.",
    subtitle: "Discreet • Licensed Providers • No Hidden Fees",
    buttonText: "Qualify in 1 minute",
    buttonHref: getFunnelPath("performance-issues"),
    video: "/coup_l.mp4",
  },
  {
    title: "Better Energy, Focus, and Vitality. Backed by Science.",
    secondTitle: "Personalized for you",
    buttonText: "Qualify in 1 minute",
    buttonHref: getFunnelPath("nad-injection-therapy"),
    backgroundImage: REFERENCE_HOME_ASSETS.nadBand,
    backgroundPosition: "center center",
  },
  {
    title: "Optimize Growth Hormone. Recover Faster. Perform Stronger.",
    subtitle: "Clinician-guided recovery support built for consistency",
    buttonText: "Get Started",
    buttonHref: "/sermorelin-injection-2",
    image: BUNDLE_MARKETING_IMAGES.sermorelin,
  },
];

const defaultEligibilitySection = {
  eyebrow: "Get medical care in minutes",
  title:
    "Check your eligibility with a guided intake that feels fast, clear, and modern.",
  description:
    "Move from interest to intake with a guided flow that feels fast, clear, and easy to follow on every screen.",
  primaryCtaText: "Check your eligibility",
  primaryCtaHref: getFunnelPath("glp-1"),
  secondaryCtaText: "Browse treatments",
  secondaryCtaHref: MARKETING_ROUTES.shop,
  highlights: [
    "Secure intake with clinician review",
    "Account creation only when you are ready to continue",
    "Flexible payment options once treatment is approved",
  ],
  checkpoints: [
    {
      icon: Sparkles,
      label: "Step 1",
      title: "Tell us what you want help with",
      description:
        "Choose the care path that fits your goal, from weight loss to energy, performance, or recovery support.",
    },
    {
      icon: Clock3,
      label: "Step 2",
      title: "Answer a few guided questions",
      description:
        "Move through a lighter, clearer intake instead of bouncing between disconnected sections and long blocks of text.",
    },
    {
      icon: ShieldCheck,
      label: "Step 3",
      title: "Continue into account, payment, and review",
      description:
        "Once you are ready, you can create your account, move through payment, and continue with medical review.",
    },
  ],
  quickActions: [
    "Start with weight-loss eligibility",
    "Continue into a secure account flow",
    "Move to provider review with confidence",
  ],
};

const defaultCareJourneySection = {
  eyebrow: "Your free online visit starts here",
  title: "Easy as 1-2-3.",
  description:
    "From a quick online intake to doorstep delivery, the path is designed to feel direct, calm, and easy to understand on every screen.",
  primaryCtaText: "Get Started",
  primaryCtaHref: getFunnelPath("glp-1"),
  secondaryCtaText: "See if you qualify",
  secondaryCtaHref: MARKETING_ROUTES.shop,
  steps: [
    {
      number: "STEP 1",
      title: "Submit your application and meet with a doctor",
      description:
        "Complete a quick form and meet with a licensed medical provider 100% online. They will determine if a personalized treatment plan is right for you.",
    },
    {
      number: "STEP 2",
      title: "Get your medication delivered at home",
      description:
        "If eligible, your custom prescription can be shipped directly to your door, quickly and discreetly.",
    },
    {
      number: "STEP 3",
      title: "Receive 24/7 support and ongoing care",
      description:
        "Stay supported with check-ins, provider guidance, and follow-up care that continues after your first order.",
    },
  ],
};

const defaultSplitFeatures = {
  cards: [
    {
      title: "No one-size-fits-all",
      description:
        "A provider licensed in your state will review your information, so that they can combine guidance on nutrition, activity, sleep, and more into a plan designed around your body's needs.",
      ctaText: "Get started",
      ctaHref: getFunnelPath("glp-1"),
      variant: "solid",
      accentText: "it's personal",
      image: REFERENCE_HOME_ASSETS.splitFeatureProduct,
      imageAlt: "HealSend treatment options",
    },
    {
      title: "Moving in the\nright direction",
      description:
        "Get a personalized weight loss plan designed with one goal in mind: helping you feel happy in your body.",
      ctaText: "See if I'm eligible",
      ctaHref: getFunnelPath("glp-1"),
      variant: "image",
      image: REFERENCE_HOME_ASSETS.splitFeatureGlow,
      imageAlt: "Confidence and progress",
    },
  ],
};

const defaultArticleCarousel = {
  items: [
    {
      title: "NAD: The Key to Cellular Energy Production",
      ctaText: "Explore",
      ctaHref: MARKETING_ROUTES.nad,
      image: "/images/home/reference/nad-cellular-energy.jpeg",
      imageAlt: "NAD cellular energy production",
    },
    {
      title: "Exploring the Benefits of PT-141 Therapy",
      ctaText: "Explore",
      ctaHref: "/pt-141-nasal-spray",
      image: "/images/home/reference/pt141-benefits.webp",
      imageAlt: "PT-141 therapy benefits",
    },
    {
      title: "Exploring the Benefits of NAD+ Therapy",
      ctaText: "Explore",
      ctaHref: MARKETING_ROUTES.nad,
      image: "/images/home/reference/nad-therapy-benefits.webp",
      imageAlt: "NAD therapy benefits",
    },
    {
      title: "Understanding Lipotropic Agents and Their Benefits",
      ctaText: "Explore",
      ctaHref: "/lipotropic",
      image: "/images/home/reference/lipotropic-benefits.jpeg",
      imageAlt: "Lipotropic benefits",
    },
    {
      title: "Where to Buy Tirzepatide Peptides Safely",
      ctaText: "Explore",
      ctaHref: MARKETING_ROUTES.weightLoss,
      image: "/images/home/reference/tirzepatide-safely.jpg",
      imageAlt: "Tirzepatide ordering guidance",
    },
  ],
};

const defaultCategoryGrid = {
  items: [
    {
      title: "Oral GLP-1",
      subtitle: "Needle-free appetite control",
      bg: "bg-[linear-gradient(145deg,#7c7eff_0%,#6769f1_100%)]",
      hoverBg: "hover:bg-[linear-gradient(145deg,#6d6ffc_0%,#5d60f1_100%)]",
      href: MARKETING_ROUTES.weightLoss,
    },
    {
      title: "Metabolic Health",
      subtitle: "GLP-1 + GIP Treatments",
      bg: "bg-[linear-gradient(145deg,#858cff_0%,#6d6ffc_100%)]",
      hoverBg: "hover:bg-[linear-gradient(145deg,#7478ff_0%,#5f61f3_100%)]",
      href: MARKETING_ROUTES.weightLoss,
    },
    {
      title: "Strength & Recovery",
      subtitle: "Recovery, vitality, and hormone support",
      bg: "bg-[linear-gradient(145deg,#53b1ee_0%,#2f91e0_100%)]",
      hoverBg: "hover:bg-[linear-gradient(145deg,#42a4e8_0%,#247fd4_100%)]",
      href: MARKETING_ROUTES.strength,
    },
    {
      title: "Desire & Intimacy",
      subtitle: "Better sex",
      bg: "bg-[linear-gradient(145deg,#9878ff_0%,#7d63ef_100%)]",
      hoverBg: "hover:bg-[linear-gradient(145deg,#8869fb_0%,#6d56e7_100%)]",
      href: MARKETING_ROUTES.sexualHealth,
    },
    {
      title: "PT-141 Nasal Spray",
      subtitle: "Natural boost in desire and arousal",
      bg: "bg-[linear-gradient(145deg,#b68ce8_0%,#d46ab9_100%)]",
      hoverBg: "hover:bg-[linear-gradient(145deg,#ab7de1_0%,#c55aa9_100%)]",
      href: MARKETING_ROUTES.sexualHealth,
    },
    {
      title: "NAD+",
      subtitle: "Energy and focus",
      bg: "bg-[linear-gradient(145deg,#63b7f1_0%,#479cf0_100%)]",
      hoverBg: "hover:bg-[linear-gradient(145deg,#52aaeb_0%,#378ee6_100%)]",
      href: MARKETING_ROUTES.nad,
    },
  ],
};

const defaultBlogCarousel = {
  title: "Your guide to health and wellness starts here.",
  description:
    "Understand treatments, compare options, and learn what to expect before you start.",
  posts: [
    {
      title:
        "Telehealth VS In-Person Care: The Key Differences You Should Know",
      content:
        "A practical look at how virtual care compares with in-person visits when you're deciding where to start.",
      image: "/images/articles/blogs/telehealth-benefits.jpg",
      href: "/telehealth-vs-in-person-care",
    },
    {
      title:
        "From Consultation to Prescription: How to Get an Online Prescription Safely",
      content:
        "See what a safe online prescription process should look like from intake through provider review.",
      image: "/images/articles/blogs/semaglutide-dose-prep.jpg",
      href: "/how-to-get-an-online-prescription",
    },
    {
      title:
        "Can I Get Anxiety Meds Online? How It Works, What’s Safe, & What to Avoid",
      content:
        "Understand the online anxiety-medication process, key safety checks, and what to watch for.",
      image: "/images/articles/blogs/anxiety-meds-support.jpg",
      href: "/can-i-get-anxiety-meds-online",
    },
    {
      title:
        "How Much Semaglutide to Take: Understanding Dosages and Titration",
      content:
        "A clearer guide to semaglutide dosing, titration, and what changes to expect as treatment progresses.",
      image: "/images/articles/blogs/semaglutide-provider-guidance.jpg",
      href: "/how-much-semaglutide-to-take",
    },
  ],
};

const defaultMemberStoriesSection = {
  title: "More from our members",
  stories: [
    {
      name: "Sarah M., 44",
      label: "Verified Customer",
      quote:
        "The silence is life changing. For years my brain was dominated by food noise and cravings. Within weeks, that noise got quiet and the mental freedom felt priceless.",
    },
    {
      name: "Michael K., 58",
      label: "Verified Customer",
      quote:
        "Losing the weight was great, but watching my blood work improve was even better. My energy is back, my routine feels steady, and it finally feels sustainable.",
    },
    {
      name: "Maria R., 41",
      label: "Verified Customer",
      quote:
        "The transition felt smoother than I expected. Starting slow and staying consistent made the process manageable, and the results have absolutely been worth it.",
    },
    {
      name: "Chris H., 62",
      label: "Verified Customer",
      quote:
        "I hesitated because of the price, but it ended up being one of the best investments I have made in my health. My quality of life changed dramatically.",
    },
    {
      name: "Ben A., 49",
      label: "Verified Customer",
      quote:
        "I used to feel wiped out by energy swings all day. Now things feel steady again, and I have the motivation to move, train, and actually keep the routine going.",
    },
  ],
};

function useGuardedCarouselAction(api, delay = 420) {
  const isTransitioningRef = useRef(false);
  const releaseTimeoutRef = useRef(null);
  const releaseLock = React.useCallback(() => {
    isTransitioningRef.current = false;

    if (releaseTimeoutRef.current) {
      clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (releaseTimeoutRef.current) {
        clearTimeout(releaseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!api) {
      return undefined;
    }

    api.on("settle", releaseLock);
    api.on("reInit", releaseLock);

    return () => {
      api.off("settle", releaseLock);
      api.off("reInit", releaseLock);
    };
  }, [api, releaseLock]);

  return React.useCallback(
    (callback) => {
      if (!api || isTransitioningRef.current) {
        return false;
      }

      isTransitioningRef.current = true;
      callback(api);

      if (releaseTimeoutRef.current) {
        clearTimeout(releaseTimeoutRef.current);
      }

      releaseTimeoutRef.current = setTimeout(() => {
        releaseLock();
      }, delay);

      return true;
    },
    [api, delay, releaseLock],
  );
}

function buildLoopingItems(items, minimumCount = 8) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const repeatCount =
    items.length < minimumCount ? Math.ceil(minimumCount / items.length) : 1;

  return Array.from({ length: repeatCount }).flatMap(() => items);
}

function mergeIndexedContentList(defaults, source) {
  if (!Array.isArray(source) || source.length === 0) {
    return defaults;
  }

  return source.map((item, index) => ({
    ...(defaults[index % defaults.length] || defaults[0] || {}),
    ...(item || {}),
  }));
}

function resolveGradientBackground(bgValue) {
  if (typeof bgValue !== "string" || bgValue.trim().length === 0) {
    return null;
  }

  const arbitraryLinearGradient = bgValue.match(
    /bg-\[(linear-gradient\(.+\))\]/,
  );
  if (arbitraryLinearGradient) {
    return {
      backgroundImage: arbitraryLinearGradient[1].replaceAll("_", " "),
    };
  }

  const from = bgValue.match(/from-\[(#[0-9A-Fa-f]{3,8})\]/)?.[1];
  const via = bgValue.match(/via-\[(#[0-9A-Fa-f]{3,8})\]/)?.[1];
  const to = bgValue.match(/to-\[(#[0-9A-Fa-f]{3,8})\]/)?.[1];

  if (!from || !to) {
    return null;
  }

  const angle = bgValue.includes("bg-gradient-to-r")
    ? "90deg"
    : bgValue.includes("bg-gradient-to-b")
      ? "180deg"
      : "145deg";

  return {
    backgroundImage: via
      ? `linear-gradient(${angle}, ${from} 0%, ${via} 52%, ${to} 100%)`
      : `linear-gradient(${angle}, ${from} 0%, ${to} 100%)`,
  };
}

function mergeHeroContent(hero) {
  const source = hero && typeof hero === "object" ? hero : {};
  const defaultTrustPoints = defaultHeroContent.trustPoints || [];
  const defaultRow1 = defaultHeroContent.row1 || [];
  const defaultRow2 = defaultHeroContent.row2 || [];
  const sourceHeadlinePhrases =
    Array.isArray(source.headlinePhrases) && source.headlinePhrases.length > 0
      ? source.headlinePhrases
      : Array.isArray(source.phrases) && source.phrases.length > 0
        ? source.phrases
        : [];
  const isLegacyHeroCard = (card) =>
    Boolean(
      card &&
      typeof card === "object" &&
      ("highlight" in card || "hoverGradient" in card),
    );
  const prefersFallbackImage = (value, fallback) => {
    const raw = String(value || "")
      .trim()
      .toLowerCase();
    const fallbackPath = String(fallback || "")
      .trim()
      .toLowerCase();

    return (
      (raw.endsWith(".jpg") || raw.endsWith(".jpeg")) &&
      (fallbackPath.endsWith(".png") || fallbackPath.endsWith(".webp"))
    );
  };
  const mergeHeroRow = (defaults, incoming) =>
    defaults.map((item, index) => {
      const sourceCard =
        Array.isArray(incoming) &&
        incoming[index] &&
        typeof incoming[index] === "object"
          ? incoming[index]
          : null;

      if (!sourceCard) {
        return item;
      }

      const useDefaultVisuals =
        isLegacyHeroCard(sourceCard) ||
        prefersFallbackImage(sourceCard.image, item.image);

      return {
        ...item,
        ...(useDefaultVisuals
          ? {
              href: sourceCard.href || item.href,
            }
          : sourceCard),
        image: useDefaultVisuals
          ? item.image
          : normalizeHomepageManagedImage(sourceCard.image, item.image),
        title: useDefaultVisuals ? item.title : sourceCard.title || item.title,
        subtitle: useDefaultVisuals
          ? item.subtitle
          : sourceCard.subtitle || item.subtitle,
        hoverOverlayClass: useDefaultVisuals
          ? item.hoverOverlayClass
          : sourceCard.hoverOverlayClass || item.hoverOverlayClass,
        artClass: useDefaultVisuals
          ? item.artClass
          : sourceCard.artClass || item.artClass,
      };
    });

  return {
    ...defaultHeroContent,
    ...source,
    headlinePhrases: normalizeHomepageHeadlinePhrases(
      sourceHeadlinePhrases,
      defaultHeroContent.headlinePhrases,
    ),
    titleLineTwo:
      source.titleLineTwo || source.subtitle || defaultHeroContent.titleLineTwo,
    trustPoints:
      Array.isArray(source.trustPoints) && source.trustPoints.length > 0
        ? source.trustPoints.map((point, index) => ({
            ...(defaultTrustPoints[index] || defaultTrustPoints[0] || {}),
            ...(point || {}),
          }))
        : defaultTrustPoints,
    row1: mergeHeroRow(defaultRow1, source.row1),
    row2: mergeHeroRow(defaultRow2, source.row2),
  };
}

function mergeArticleCarouselContent(section) {
  const source = section && typeof section === "object" ? section : {};

  return {
    ...defaultArticleCarousel,
    ...source,
    items: mergeIndexedContentList(
      defaultArticleCarousel.items,
      source.items,
    ).map((item, index) => ({
      ...item,
      image: normalizeHomepageManagedImage(
        item.image,
        defaultArticleCarousel.items[
          index % defaultArticleCarousel.items.length
        ]?.image,
      ),
    })),
  };
}

function mergeCategoryGridContent(section) {
  const source = section && typeof section === "object" ? section : {};

  return {
    ...defaultCategoryGrid,
    ...source,
    items: mergeIndexedContentList(defaultCategoryGrid.items, source.items),
  };
}

function mergeMemberStoriesContent(section) {
  const source = section && typeof section === "object" ? section : {};

  return {
    ...defaultMemberStoriesSection,
    ...source,
    stories: mergeIndexedContentList(
      defaultMemberStoriesSection.stories,
      source.stories,
    ),
  };
}

function mergeBlogCarouselContent(section) {
  const source = section && typeof section === "object" ? section : {};

  return {
    ...defaultBlogCarousel,
    ...source,
    posts: mergeIndexedContentList(defaultBlogCarousel.posts, source.posts).map(
      (post, index) => ({
        ...post,
        image: normalizeHomepageManagedImage(
          post.image,
          defaultBlogCarousel.posts[index % defaultBlogCarousel.posts.length]
            ?.image,
        ),
      }),
    ),
  };
}

function mergeHomeBannersContent(banners) {
  if (!Array.isArray(banners) || banners.length === 0) {
    return defaultHomeBanners;
  }

  return defaultHomeBanners.map((defaultBanner, index) => {
    const sourceBanner = banners[index];
    if (!sourceBanner || typeof sourceBanner !== "object") {
      return defaultBanner;
    }

    return {
      ...defaultBanner,
      ...sourceBanner,
      backgroundImage:
        normalizeHomepageManagedImage(
          sourceBanner.backgroundImage,
          defaultBanner.backgroundImage || null,
        ) ||
        defaultBanner.backgroundImage ||
        undefined,
      image:
        normalizeHomepageManagedImage(
          sourceBanner.image,
          defaultBanner.image || null,
        ) ||
        defaultBanner.image ||
        undefined,
    };
  });
}

function mergeSplitFeaturesContent(section) {
  const source = section && typeof section === "object" ? section : {};
  const defaultCards = defaultSplitFeatures.cards || [];

  return {
    ...defaultSplitFeatures,
    ...source,
    cards:
      Array.isArray(source.cards) && source.cards.length > 0
        ? source.cards.map((card, index) => ({
            ...(defaultCards[index] || defaultCards[0] || {}),
            ...(card || {}),
            image: normalizeHomepageManagedImage(
              card?.image,
              (defaultCards[index] || defaultCards[0] || {}).image,
            ),
          }))
        : defaultCards,
  };
}

function HeroCategories({ hero = defaultHeroContent }) {
  const [index, setIndex] = useState(0);
  const headlinePhrases =
    hero.headlinePhrases?.length > 0
      ? hero.headlinePhrases
      : defaultHeroContent.headlinePhrases;
  const normalizedHeadlinePhrases = headlinePhrases.map(
    (phrase, phraseIndex) => {
      const fallbackPhrase =
        defaultHeroContent.headlinePhrases[phraseIndex] ||
        defaultHeroContent.headlinePhrases[0];

      if (typeof phrase === "string") {
        return {
          text: phrase,
          color:
            defaultHeroContent.headlinePhrases.find(
              (defaultPhrase) =>
                defaultPhrase.text.toLowerCase() === phrase.toLowerCase(),
            )?.color || fallbackPhrase.color,
        };
      }

      return {
        ...fallbackPhrase,
        ...(phrase || {}),
        text: phrase?.text || fallbackPhrase.text,
        color: phrase?.color || fallbackPhrase.color,
      };
    },
  );
  const row1 = (
    hero.row1?.length > 0 ? hero.row1 : defaultHeroContent.row1
  ).slice(0, defaultHeroContent.row1.length);
  const row2 = (
    hero.row2?.length > 0 ? hero.row2 : defaultHeroContent.row2
  ).slice(0, defaultHeroContent.row2.length);
  const titleLineTwo = hero.titleLineTwo || defaultHeroContent.titleLineTwo;
  const description = hero.description || defaultHeroContent.description;
  const trustPoints =
    hero.trustPoints?.length > 0
      ? hero.trustPoints
      : defaultHeroContent.trustPoints;
  const activeHeadline =
    normalizedHeadlinePhrases[index] || defaultHeroContent.headlinePhrases[0];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex(
        (currentIndex) => (currentIndex + 1) % normalizedHeadlinePhrases.length,
      );
    }, 5600);

    return () => window.clearInterval(interval);
  }, [normalizedHeadlinePhrases.length]);

  return (
    <section className="mx-auto max-w-[1340px] overflow-x-hidden px-4 py-6 sm:py-8 md:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(270px,0.72fr)] lg:items-start lg:gap-8">
        <div>
          <h1 className="[font-family:'Poppins',sans-serif] flex flex-col text-[clamp(1.95rem,9vw,2.8rem)] font-semibold leading-[0.99] tracking-[-0.05em] text-[#1d1d1f] max-[419px]:text-[clamp(1.72rem,8.2vw,2.2rem)] sm:text-6xl sm:leading-[0.97] lg:text-[4.45rem] lg:leading-[0.95]">
            <span className="relative block min-h-[1.44em] max-w-full overflow-hidden pb-[0.22em] pt-[0.04em] sm:min-h-[1.28em] sm:pb-[0.16em] sm:pt-[0.02em]">
              <span
                aria-hidden="true"
                className="invisible inline-flex max-w-full whitespace-pre"
                style={{ color: activeHeadline.color }}
              >
                {activeHeadline.text}
              </span>
              <AnimatePresence initial={false}>
                <motion.span
                  key={activeHeadline.text}
                  className="absolute left-0 top-0 inline-flex max-w-full whitespace-pre"
                  style={{ color: activeHeadline.color }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {Array.from(activeHeadline.text).map(
                    (character, characterIndex) => (
                      <motion.span
                        key={`${activeHeadline.text}-${characterIndex}`}
                        className="inline-block origin-center [transform-style:preserve-3d]"
                        variants={{
                          hidden: {
                            rotateX: -76,
                            y: "0.12em",
                            opacity: 0,
                          },
                          visible: {
                            rotateX: 0,
                            y: "0em",
                            opacity: 1,
                            transition: {
                              delay: characterIndex * 0.052,
                              duration: 0.74,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          },
                          exit: {
                            rotateX: 76,
                            y: "-0.08em",
                            opacity: 0.18,
                            transition: {
                              delay: characterIndex * 0.036,
                              duration: 0.46,
                              ease: [0.55, 0.08, 0.68, 0.53],
                            },
                          },
                        }}
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {character === " " ? "\u00A0" : character}
                      </motion.span>
                    ),
                  )}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>{titleLineTwo}</span>
          </h1>

          <p className="[font-family:'Open_Sans',sans-serif] mt-4 max-w-[34rem] text-lg leading-relaxed text-[#5d6169] sm:text-xl">
            {description === "Personalized Medications for You"
              ? null
              : description}
          </p>
        </div>

        <div className="hidden md:block">
          <div className="flex max-w-[21rem] flex-col items-start justify-start space-y-3 text-left">
            {trustPoints.map((point) => {
              const Icon = point.icon || BadgeCheck;

              return (
                <div
                  key={point.label}
                  className="[font-family:'Open_Sans',sans-serif] flex w-full items-center gap-3 text-left text-[0.98rem] leading-relaxed text-[#525764]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1d1d1f] shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="max-w-[16rem] text-left">{point.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {row1.map((cat, index) => (
            <Link
              key={`${cat.title}-${cat.href || index}-${index}`}
              href={cat.href}
              className={`group relative flex min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-[1.9rem] border border-[#afb2ef] bg-[#C8C9FD] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.1)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#8f93ef] hover:shadow-[0_24px_55px_rgba(109,111,252,0.18)] sm:min-h-[330px] sm:p-7 ${
                index === 2 ? "hidden md:flex" : ""
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${cat.hoverOverlayClass || ""}`}
              />
              <div className="relative z-10 max-w-[48%] pr-2">
                <h2 className="[font-family:'Poppins',sans-serif] whitespace-pre-line text-[1.42rem] font-semibold leading-[0.95] tracking-[-0.04em] text-[#151824] max-[419px]:text-[1.28rem] sm:text-[1.9rem]">
                  {cat.title}
                </h2>
                <p className="[font-family:'Open_Sans',sans-serif] mt-2 max-w-[16rem] text-sm leading-snug text-[#353a48] sm:text-base">
                  {cat.subtitle}
                </p>
              </div>

              <div className="relative z-10 mt-auto flex items-end justify-between gap-4" />

              <div className="pointer-events-none absolute inset-y-0 right-0 z-0 flex w-[50%] items-end justify-end overflow-hidden pr-3 sm:pr-4">
                <div
                  className={`pointer-events-none relative h-[80%] w-[68%] ${cat.artClass || ""}`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    priority
                    loading="eager"
                    sizes="(min-width: 1024px) 22vw, 34vw"
                    className="object-contain object-bottom-right drop-shadow-[0_30px_44px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {row2.map((cat, index) => (
            <Link
              key={`${cat.title}-${cat.href || index}-${index}`}
              href={cat.href}
              className={`group relative flex min-h-[108px] items-end justify-between overflow-hidden rounded-[1.65rem] border border-[#afb2ef] bg-[#C8C9FD] p-3.5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#8f93ef] hover:shadow-[0_22px_50px_rgba(109,111,252,0.12)] sm:min-h-[120px] md:min-h-[196px] sm:p-5`}
            >
              <div
                className={`pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${cat.hoverOverlayClass || ""}`}
              />
              <div className="relative z-10 max-w-[65%]">
                <h3 className="[font-family:'Poppins',sans-serif] text-[1.08rem] font-semibold leading-tight tracking-[-0.03em] text-[#1d1d1f] sm:text-[1.2rem]">
                  {cat.title}
                </h3>
                <p className="[font-family:'Open_Sans',sans-serif] mt-2 text-sm leading-snug text-[#616674]">
                  {cat.subtitle}
                </p>
              </div>

              <div className="pointer-events-none absolute inset-y-0 right-2 flex w-[44%] items-center justify-end overflow-hidden sm:right-3 sm:w-[46%]">
                <div className="relative h-[66%] w-[66%] sm:h-[72%] sm:w-[72%]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    loading="eager"
                    sizes="(min-width: 1024px) 6vw, 12vw"
                    className="object-contain drop-shadow-[0_20px_35px_rgba(15,23,42,0.14)] transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const MEDIA_LOGOS = [
  { name: "Yahoo!", style: "font-black text-[1.1rem] tracking-tight" },
  { name: "USA TODAY", style: "font-black text-[0.9rem] tracking-[0.08em]" },
  { name: "AXIOS", style: "font-black text-[1.05rem] tracking-[0.12em]" },
  { name: "Forbes", style: "font-bold italic text-[1.1rem]" },
  {
    name: "Business Insider",
    style: "font-black text-[0.85rem] tracking-[0.04em]",
  },
  { name: "Reuters", style: "font-bold text-[1rem] tracking-[0.06em]" },
];

function MediaLogosBanner() {
  return (
    <div className="overflow-hidden bg-[#5b3cdd] py-3.5">
      <div className="flex animate-[mediaLogoScroll_22s_linear_infinite]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center gap-16 px-8"
          >
            {MEDIA_LOGOS.map((logo, i) => (
              <span
                key={i}
                className={`whitespace-nowrap text-white ${logo.style}`}
              >
                {logo.name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const NEGATIVE_SELL_CARDS = [
  {
    title: "The hunger that never shuts off.",
    image: "/images/home/reference/weight-loss-band.jpeg",
    bullets: [
      "You just ate — and you're already thinking about food again.",
      "The mental load of tracking, restricting, and starting over is exhausting.",
    ],
  },
  {
    title: "Your metabolism turned on you.",
    image: "/images/home/reference/tirzepatide-safely.jpg",
    bullets: [
      "Postpartum weight, stress eating, hormonal changes — it all adds up.",
      "Slower metabolism means doing everything right and still not seeing results.",
    ],
  },
  {
    title: "Lose 20. Gain 25 back. Every diet makes it worse.",
    image: "/images/home/reference/guide-card.jpg",
    bullets: [
      "You've lost and regained the same weight more than once.",
      "Each restart is harder, and your body fights you more every time.",
    ],
  },
  {
    title: "This was never about discipline.",
    image: "/images/home/reference/nad-cellular-energy.jpeg",
    bullets: [
      "Feeling like you should be able to do this alone keeps you stuck.",
      "You've looked into this before — you just needed the right support.",
    ],
  },
];

function NegativeSellSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            Sound familiar?
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          Weight loss isn&apos;t just about{" "}
          <span className="italic text-[#5b3cdd]">eating less.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          It&apos;s about understanding why your body holds on to weight.
          Whether it&apos;s food noise, hormonal confusion, or weight resistance
          from years of yo-yo dieting — this is why GLP-1 therapy exists.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {NEGATIVE_SELL_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-[#ebebeb] bg-white shadow-sm"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#f5f5f5]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-4 text-base font-bold leading-snug text-[#1c1a24]">
                  {card.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {card.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2.5 text-sm leading-snug text-[#5d6169]"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ffe4e4] text-[#e53e3e]">
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <line
                            x1="2"
                            y1="2"
                            x2="8"
                            y2="8"
                            stroke="#e53e3e"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <line
                            x1="8"
                            y1="2"
                            x2="2"
                            y2="8"
                            stroke="#e53e3e"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={getFunnelPath("glp-1")}
            className="rounded-full bg-[#1c1a24] px-10 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2d2a3a] hover:shadow-xl"
          >
            See if GLP-1 is right for you
          </Link>
        </div>
      </div>
    </section>
  );
}

function HimsTopSection() {
  return (
    <section className="bg-white">
      <div className="px-3 pt-3 pb-4">
        {/* Two featured dark cards */}
        <div className="mb-2.5 grid grid-cols-2 gap-2">
          {/* Left card – Weight Loss */}
          <Link
            href={MARKETING_ROUTES.weightLoss}
            className="relative flex min-h-[215px] flex-col overflow-hidden rounded-[18px] bg-[#1a0e38] p-4 sm:min-h-[240px]"
          >
            <span className="mb-2.5 inline-block w-fit rounded-full bg-[#f5a623] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              New
            </span>
            <h2 className="[font-family:'Poppins',sans-serif] text-[0.88rem] font-semibold leading-snug tracking-tight text-white sm:text-[1rem]">
              Start your
              <br />
              weight loss
              <br />
              today
            </h2>

            <div className="pointer-events-none absolute bottom-8 right-0 h-[52%] w-[55%]">
              <Image
                src={BUNDLE_MARKETING_IMAGES.tirzepatideInjections}
                alt="Weight loss treatment"
                fill
                sizes="(max-width: 640px) 26vw, 22vw"
                className="object-contain object-bottom"
              />
            </div>

            <div className="mt-auto pt-10">
              <span className="[font-family:'Open_Sans',sans-serif] text-[0.7rem] text-white/60">
                Find your Rx match →
              </span>
            </div>
          </Link>

          {/* Right card – Results */}
          <Link
            href={MARKETING_ROUTES.weightLoss}
            className="relative flex min-h-[215px] flex-col overflow-hidden rounded-[18px] bg-[#0f1628] p-4 sm:min-h-[240px]"
          >
            <h2 className="[font-family:'Poppins',sans-serif] text-[0.88rem] font-semibold leading-snug tracking-tight text-[#f5c842] sm:text-[1rem]">
              See how much
              <br />
              weight you
              <br />
              can lose
            </h2>

            <div className="pointer-events-none absolute bottom-10 right-0 h-[50%] w-[55%]">
              <Image
                src={BUNDLE_MARKETING_IMAGES.semaglutideInjections}
                alt="Weight loss results"
                fill
                sizes="(max-width: 640px) 26vw, 22vw"
                className="object-contain object-bottom"
              />
            </div>

            <div className="mt-auto pt-10">
              <span className="[font-family:'Open_Sans',sans-serif] text-[0.7rem] text-white/60">
                ↓ Lose up to 22%* →
              </span>
            </div>
          </Link>
        </div>

        {/* Category rows */}
        <div className="flex flex-col gap-2">
          <Link
            href={MARKETING_ROUTES.sexualHealth}
            className="flex items-center justify-between overflow-hidden rounded-[14px] bg-[#f7f5ff] px-4 py-3.5"
          >
            <h3 className="[font-family:'Poppins',sans-serif] text-[1.05rem] font-semibold leading-tight text-[#1a0e38]">
              Have better <span className="text-[#e8647a]">sex</span>
            </h3>
            <div className="flex items-center gap-1">
              <div className="relative mr-1 h-14 w-12 shrink-0">
                <Image
                  src={WORDPRESS_MARKETING_IMAGES.pt141}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-[#9ca3af]" />
            </div>
          </Link>

          <Link
            href={MARKETING_ROUTES.nad}
            className="flex items-center justify-between overflow-hidden rounded-[14px] bg-[#f7f5ff] px-4 py-3.5"
          >
            <h3 className="[font-family:'Poppins',sans-serif] text-[1.05rem] font-semibold leading-tight text-[#1a0e38]">
              Boost <span className="text-[#22bfa2]">energy</span>
            </h3>
            <div className="flex items-center gap-1">
              <div className="relative mr-1 h-14 w-12 shrink-0">
                <Image
                  src={BUNDLE_MARKETING_IMAGES.nadInjections}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-[#9ca3af]" />
            </div>
          </Link>

          <Link
            href={MARKETING_ROUTES.strength}
            className="flex items-center justify-between overflow-hidden rounded-[14px] bg-[#f7f5ff] px-4 py-3.5"
          >
            <h3 className="[font-family:'Poppins',sans-serif] text-[1.05rem] font-semibold leading-tight text-[#1a0e38]">
              Build <span className="text-[#7b75f0]">strength</span>
            </h3>
            <div className="flex items-center gap-1">
              <div className="relative mr-1 h-14 w-12 shrink-0">
                <Image
                  src={BUNDLE_MARKETING_IMAGES.sermorelin}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-[#9ca3af]" />
            </div>
          </Link>

          <Link
            href={getFunnelPath("glp-1")}
            className="flex items-center justify-between overflow-hidden rounded-[14px] bg-[#f7f5ff] px-4 py-3.5"
          >
            <h3 className="[font-family:'Poppins',sans-serif] text-[1.05rem] font-semibold leading-tight text-[#1a0e38]">
              Get a <span className="text-[#f5a623]">health check</span>
            </h3>
            <div className="flex items-center gap-1">
              <div className="relative mr-1 h-14 w-12 shrink-0">
                <Image
                  src={BUNDLE_MARKETING_IMAGES.enclomiphene}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-[#9ca3af]" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function EligibilitySection({ section = defaultEligibilitySection }) {
  const content = section?.title ? section : defaultEligibilitySection;

  return (
    <section className="bg-[#f7f8fc] py-12">
      <div className="mx-auto max-w-[1340px] px-4 md:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.15fr,0.85fr]">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-[2rem] bg-white p-8 shadow-sm md:p-10"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#eef0ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5b54e8]">
              <Sparkles className="h-4 w-4" />
              {content.eyebrow}
            </div>
            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#1c1d20] md:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {content.description}
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {content.checkpoints?.map((checkpoint, index) => {
                const Icon = checkpoint.icon || CheckCircle2;

                return (
                  <motion.div
                    key={`${checkpoint.title}-${index}`}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                      ease: "easeOut",
                    }}
                    className="rounded-[1.5rem] border border-[#ececf6] bg-[#fafbff] p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7b75f0] text-white shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#7b75f0]">
                        {checkpoint.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1c1d20]">
                      {checkpoint.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {checkpoint.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
            className="overflow-hidden rounded-[2rem] bg-[#15161a] text-white shadow-sm"
          >
            <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,#6760ff_0%,#2b2f46_55%,#15161a_100%)] p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                <BadgeCheck className="h-4 w-4" />
                Start your online visit
              </div>
              <h3 className="mt-5 text-2xl font-bold leading-tight md:text-3xl">
                Just a few more details, then you are into the right funnel.
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70 md:text-base">
                Keep the flow quick and clear, with the next action obvious on
                every screen size.
              </p>

              <div className="mt-5 space-y-2.5">
                {content.highlights?.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-3 rounded-2xl bg-white/8 px-4 py-3 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8be0b0]" />
                    <span className="text-sm text-white/90">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Quick actions
              </p>
              <div className="mb-6 space-y-2.5">
                {content.quickActions?.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/85"
                  >
                    <span>{item}</span>
                    <ArrowRight className="h-4 w-4 text-white/55" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={
                    content.primaryCtaHref ||
                    defaultEligibilitySection.primaryCtaHref
                  }
                  className="hs-solid-btn inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto"
                >
                  {content.primaryCtaText}
                </Link>
                <Link
                  href={
                    content.secondaryCtaHref ||
                    defaultEligibilitySection.secondaryCtaHref
                  }
                  className="hs-outline-btn inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-colors sm:w-auto"
                >
                  {content.secondaryCtaText}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function _CareJourneySection({ section = defaultCareJourneySection }) {
  const content = section?.title ? section : defaultCareJourneySection;

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-[1340px] px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b75f0]">
              {content.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#1c1d20] md:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
              {content.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={
                content.primaryCtaHref ||
                defaultCareJourneySection.primaryCtaHref
              }
              className="hs-solid-btn inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5"
            >
              {content.primaryCtaText}
            </Link>
            <Link
              href={
                content.secondaryCtaHref ||
                defaultCareJourneySection.secondaryCtaHref
              }
              className="hs-outline-btn inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors"
            >
              {content.secondaryCtaText}
            </Link>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {content.steps?.map((step, index) => (
            <motion.div
              key={step.number}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="rounded-[2rem] border border-[#ececf6] bg-[#fafbff] p-6 md:p-8"
            >
              <span className="text-sm font-black uppercase tracking-[0.18em] text-[#7b75f0] md:text-base">
                {step.number}
              </span>
              <h3 className="mt-6 text-xl font-semibold text-[#1c1d20]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitFeatures({ section = defaultSplitFeatures }) {
  const cards =
    section.cards?.length > 0 ? section.cards : defaultSplitFeatures.cards;
  const [leftCard, rightCard] = cards.slice(0, 2);
  const rightTitle = String(rightCard?.title || "");
  const rightTitleMobile = rightTitle.replace(/\s*\n\s*/g, " ");

  return (
    <section className="mx-auto px-4 py-12 md:px-8 md:py-16">
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.article
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative flex min-h-[470px] flex-col overflow-hidden rounded-[24px] border border-[#ebe8f5] bg-[#7b68ee] px-8 pb-8 pt-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] md:min-h-[580px] md:px-10 md:pb-10 md:pt-12"
        >
          <div className="relative z-10 mx-auto max-w-[29rem] text-center">
            <h2 className="[font-family:'Roboto',sans-serif] text-center text-[2.7rem] font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-[3.35rem] md:text-[45px]">
              {leftCard?.title}
            </h2>
            <p className="[font-family:'Open_Sans',sans-serif] mx-auto mt-5 max-w-[64%] text-center text-[1rem] leading-8 text-[#efeaff] md:text-[1.05rem]">
              {leftCard?.description}
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href={leftCard?.ctaHref || MARKETING_ROUTES.weightLoss}
                className="[font-family:'Open_Sans',sans-serif] hs-outline-btn inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                {leftCard?.ctaText}
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex justify-center md:mt-10">
            <div className="relative h-[250px] w-[250px] max-w-full overflow-hidden rounded-[1rem] sm:h-[280px] sm:w-[280px] md:h-[500px] md:w-[440px] md:max-w-full">
              <Image
                src={leftCard?.image}
                alt={leftCard?.imageAlt || leftCard?.title}
                fill
                loading="eager"
                sizes="(min-width: 768px) 440px, 280px"
                className="rounded-[1rem] border border-white/15 bg-white/8 object-cover shadow-[0_18px_40px_rgba(15,23,42,0.18)] md:rounded-[1rem] md:border-white/12 md:bg-white/8 md:object-contain md:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
              />
            </div>
          </div>

          <div className="relative z-10 mt-auto pt-10">
            <p className="[font-family:'Roboto',sans-serif] text-center text-[2rem] font-semibold tracking-[-0.045em] text-white md:text-[2.75rem]">
              {leftCard?.accentText}
            </p>
          </div>
        </motion.article>

        <motion.article
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.06, ease: "easeOut" }}
          className="relative flex min-h-[470px] flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(140deg,#5b61fe_0%,#6a62f3_45%,#7c74ff_100%)] px-8 pb-8 pt-10 text-left text-white shadow-[0_34px_84px_rgba(95,90,235,0.26)] md:min-h-[580px] md:px-10 md:pb-10 md:pt-12"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55"
            style={{
              backgroundImage: `url("${rightCard?.image || REFERENCE_HOME_ASSETS.splitFeatureGlow}")`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_34%)]" />

          <div className="relative z-10 mx-auto max-w-[15rem] sm:max-w-[17.5rem] md:max-w-[26rem]">
            <h2 className="[font-family:'Roboto',sans-serif] text-center text-[2.7rem] font-semibold leading-[1.2] tracking-[-0.05em] sm:text-[3.35rem] md:text-[45px]">
              <span className="md:hidden">{rightTitleMobile}</span>
              <span className="hidden whitespace-pre-line md:inline">
                {rightTitle}
              </span>
            </h2>
            <p className="[font-family:'Open_Sans',sans-serif] mx-auto mt-5 max-w-[15rem] text-center text-[1rem] leading-8 text-white/88 sm:max-w-[17rem] md:max-w-[70%] md:text-[1.05rem]">
              {
                rightCard?.description?.split(
                  "helping you feel happy in your body.",
                )[0]
              }
              <span className="text-[#d6d8ff]">
                {" "}
                helping you feel happy in your body.
              </span>
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href={rightCard?.ctaHref || MARKETING_ROUTES.weightLoss}
                className="[font-family:'Open_Sans',sans-serif] hs-outline-btn inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                {rightCard?.ctaText}
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-auto pt-14">
            <div className="[font-family:'Open_Sans',sans-serif] flex items-center justify-center gap-3 text-center text-sm font-medium text-white/70">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-white/70" />
              Personalized path. Smoother intake. Better follow-through.
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function ArticleCarousel({ section = defaultArticleCarousel }) {
  const items = buildLoopingItems(
    section.items?.length > 0 ? section.items : defaultArticleCarousel.items,
    8,
  );
  const [index, setIndex] = useState(0);
  const [api, setApi] = useState(null);
  const runCarouselAction = useGuardedCarouselAction(api, 460);

  const goToPrevious = () =>
    runCarouselAction((carouselApi) => carouselApi.scrollPrev());

  const goToNext = () =>
    runCarouselAction((carouselApi) => carouselApi.scrollNext());

  useEffect(() => {
    if (!api) {
      return undefined;
    }

    const handleSelect = () => {
      setIndex(api.selectedScrollSnap());
    };

    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || items.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      runCarouselAction((carouselApi) => carouselApi.scrollNext());
    }, 5000);

    return () => window.clearInterval(interval);
  }, [api, items.length, runCarouselAction]);

  const getSlideState = (itemIndex) => {
    const directDistance = Math.abs(itemIndex - index);
    const wrappedDistance = items.length - directDistance;
    const distance = Math.min(directDistance, wrappedDistance);

    if (distance === 0) {
      return "active";
    }

    if (distance === 1) {
      return "neighbor";
    }

    return "distant";
  };

  return (
    <section className="overflow-hidden bg-[#f3f4f6] py-10 md:py-14">
      <div className="mx-auto w-full max-w-none">
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              containScroll: false,
              loop: true,
              duration: 40,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 items-stretch md:-ml-6">
              {items.map((item, itemIndex) => {
                const slideState = getSlideState(itemIndex);
                const isActive = slideState === "active";

                return (
                  <CarouselItem
                    key={`${item.title}-${itemIndex}`}
                    className="basis-[94%] pl-4 sm:basis-[90%] md:basis-[86%] md:pl-6 xl:basis-[80%]"
                  >
                    <article
                      className={`relative h-[460px] overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(15,23,42,0.14)] transition-all duration-500 ease-out md:h-[620px] ${
                        isActive
                          ? "scale-100 opacity-100"
                          : slideState === "neighbor"
                            ? "scale-[0.94] opacity-100"
                            : "scale-[0.9] opacity-70"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        fill
                        loading="eager"
                        sizes="(min-width: 768px) 70vw, 94vw"
                        className="h-full w-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 transition-colors duration-500 ${
                          isActive ? "bg-black/28" : "bg-black/42"
                        }`}
                      />
                      <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-10">
                        <h2 className="[font-family:'Open_Sans',sans-serif] max-w-[min(36rem,82%)] text-[1.9rem] font-bold leading-[1.02] tracking-[-0.045em] text-white md:text-[3.35rem]">
                          {item.title}
                        </h2>

                        <div className="flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between">
                          <div className="flex gap-2">
                            {items.map((carouselItem, itemDotIndex) => (
                              <button
                                key={`${carouselItem.title}-${itemDotIndex}`}
                                type="button"
                                aria-label={`Go to slide ${itemDotIndex + 1}`}
                                onClick={() => {
                                  if (!api || itemDotIndex === index) {
                                    return;
                                  }

                                  runCarouselAction((carouselApi) =>
                                    carouselApi.scrollTo(itemDotIndex),
                                  );
                                }}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                  itemDotIndex === index
                                    ? "w-10 bg-white"
                                    : "w-2.5 bg-white/45 hover:bg-white/70"
                                }`}
                              />
                            ))}
                          </div>

                          <Link
                            href={item.ctaHref || MARKETING_ROUTES.shop}
                            className="hs-solid-btn inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition-colors"
                          >
                            {item.ctaText || "Explore"}
                          </Link>
                        </div>
                      </div>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/42 text-white backdrop-blur-md transition-colors hover:bg-black/56 md:flex md:left-6 lg:left-8"
            aria-label="Previous article"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/42 text-white backdrop-blur-md transition-colors hover:bg-black/56 md:flex md:right-6 lg:right-8"
            aria-label="Next article"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid({ section = defaultCategoryGrid }) {
  const categories = buildLoopingItems(
    section.items?.length > 0 ? section.items : defaultCategoryGrid.items,
    8,
  );
  const [api, setApi] = useState(null);
  const runCarouselAction = useGuardedCarouselAction(api, 430);

  return (
    <section className="w-full py-10 md:py-14">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          containScroll: false,
          loop: true,
          duration: 38,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 items-stretch md:-ml-6">
          {categories.map((cat, catIndex) => (
            <CarouselItem
              key={`${cat.title || "category"}-${cat.href || catIndex}-${catIndex}`}
              className="basis-[84%] pl-4 sm:basis-[48%] md:pl-6 lg:basis-[24%] xl:basis-[21.5%] 2xl:basis-[20.25%]"
            >
              <Link
                href={cat.href || MARKETING_ROUTES.shop}
                style={resolveGradientBackground(cat.bg)}
                className={`group relative flex h-[286px] flex-col justify-between overflow-hidden rounded-[24px] border border-white/30 bg-[linear-gradient(145deg,#7c7eff_0%,#6769f1_100%)] p-7 text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(109,111,252,0.2)] md:h-[320px] ${cat.hoverBg || ""}`}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/18 text-sm font-semibold text-white backdrop-blur-sm">
                  •
                </span>
                <div className="pb-1">
                  <h3 className="[font-family:'Poppins',sans-serif] mb-2 text-[1.55rem] font-semibold leading-tight tracking-[-0.035em] md:text-[1.85rem]">
                    {cat.title}
                  </h3>
                  <p className="[font-family:'Open_Sans',sans-serif] max-w-[16rem] text-sm leading-6 text-white/82 md:text-[0.98rem]">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 hidden items-center justify-end gap-2 px-4 md:flex md:px-6 lg:px-8">
        <button
          type="button"
          onClick={() =>
            runCarouselAction((carouselApi) => carouselApi.scrollPrev())
          }
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7b75f0] text-white transition-colors hover:bg-[#665ce0]"
          aria-label="Previous categories"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() =>
            runCarouselAction((carouselApi) => carouselApi.scrollNext())
          }
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7b75f0] text-white transition-colors hover:bg-[#665ce0]"
          aria-label="Next categories"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function BlogCarousel({ section = defaultBlogCarousel }) {
  const posts =
    section.posts?.length > 0 ? section.posts : defaultBlogCarousel.posts;
  const carouselPosts = buildLoopingItems(posts, 8);
  const [api, setApi] = useState(null);
  const runCarouselAction = useGuardedCarouselAction(api, 430);

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto mb-12 max-w-3xl px-4 text-center md:px-6 lg:px-8">
        <h2 className="[font-family:'Poppins',sans-serif] mb-4 text-3xl font-semibold tracking-[-0.04em] text-black md:text-5xl">
          {section.title || defaultBlogCarousel.title}
        </h2>
        <p className="[font-family:'Open_Sans',sans-serif] mx-auto max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
          {section.description || defaultBlogCarousel.description}
        </p>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          containScroll: false,
          loop: true,
          duration: 38,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 items-stretch md:-ml-6">
          {carouselPosts.map((post, postIndex) => (
            <CarouselItem
              key={`${post.title}-${postIndex}`}
              className="box-border basis-[84%] pl-4 sm:basis-[52%] md:basis-[48%] md:pl-6 xl:basis-[29.5%] 2xl:basis-[28.5%]"
            >
              <article className="flex h-full min-h-[440px] min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#dfe3ef] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.06)] md:min-h-[470px]">
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#e8ecfb]">
                  <Image
                    src={post.image || REFERENCE_HOME_ASSETS.guideCard}
                    alt={post.title}
                    fill
                    loading="eager"
                    sizes="(min-width: 1536px) 28vw, (min-width: 1280px) 30vw, (min-width: 768px) 48vw, 84vw"
                    className="block h-full min-h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-7">
                  <p
                    className="[font-family:'Open_Sans',sans-serif] mb-4 min-w-0 text-sm leading-6 text-gray-500 sm:leading-7"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.content}
                  </p>
                  <h3
                    className="[font-family:'Poppins',sans-serif] mb-6 min-w-0 text-[1.08rem] font-semibold leading-snug tracking-[-0.03em] text-black sm:text-[1.25rem]"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.title}
                  </h3>
                  <div className="mt-auto">
                    <Link
                      href={post.href || MARKETING_ROUTES.shop}
                      className="hs-solid-btn mb-5 inline-flex rounded-full px-6 py-2.5 text-sm font-bold transition-colors"
                    >
                      Read More
                    </Link>
                    <span className="block text-xs text-gray-500 underline underline-offset-2">
                      Important safety information
                    </span>
                  </div>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 hidden items-center justify-end gap-4 px-4 md:flex md:px-6 lg:px-8">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              runCarouselAction((carouselApi) => carouselApi.scrollPrev())
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7b75f0] text-white transition-colors hover:bg-[#665ce0]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              runCarouselAction((carouselApi) => carouselApi.scrollNext())
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7b75f0] text-white transition-colors hover:bg-[#665ce0]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function MemberStoriesSection({ section = defaultMemberStoriesSection }) {
  const stories = buildLoopingItems(
    section.stories?.length > 0
      ? section.stories
      : defaultMemberStoriesSection.stories,
    8,
  );
  const [api, setApi] = useState(null);
  const runCarouselAction = useGuardedCarouselAction(api, 430);

  return (
    <section className="w-full py-12 md:py-14">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left md:px-6 lg:px-8">
        <div className="w-full">
          <h2 className="[font-family:'Poppins',sans-serif] text-3xl font-semibold tracking-[-0.04em] text-[#1c1d20] md:text-5xl">
            {section.title || defaultMemberStoriesSection.title}
          </h2>
        </div>

        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() =>
              runCarouselAction((carouselApi) => carouselApi.scrollPrev())
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7b75f0] text-white transition-colors hover:bg-[#665ce0]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              runCarouselAction((carouselApi) => carouselApi.scrollNext())
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7b75f0] text-white transition-colors hover:bg-[#665ce0]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          containScroll: false,
          loop: true,
          duration: 38,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 items-stretch md:-ml-6">
          {stories.map((story, storyIndex) => (
            <CarouselItem
              key={`${story.name}-${storyIndex}`}
              className="basis-[88%] pl-4 sm:basis-[54%] md:pl-6 xl:basis-[29.5%] 2xl:basis-[28.5%]"
            >
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.35,
                  delay: storyIndex * 0.05,
                  ease: "easeOut",
                }}
                className="flex h-full min-h-[340px] flex-col rounded-[20px] border border-[#ece7f7] bg-[#fcfbff] p-8 shadow-[0_14px_30px_rgba(15,23,42,0.05)] md:min-h-[380px]"
              >
                <div className="mb-6 flex items-center gap-1.5 text-[#f2b62f]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-current text-current"
                      strokeWidth={1.6}
                    />
                  ))}
                </div>
                <p className="[font-family:'Open_Sans',sans-serif] text-[1.03rem] leading-8 text-[#31343c]">
                  "{story.quote}"
                </p>
                <div className="mt-6 border-t border-black/5 pt-5">
                  <h3 className="[font-family:'Poppins',sans-serif] text-lg font-semibold text-[#1c1d20]">
                    {story.name}
                  </h3>
                  <div className="[font-family:'Open_Sans',sans-serif] mt-2 flex items-center gap-2 text-sm text-[#6c7280]">
                    <Image
                      src={REFERENCE_HOME_ASSETS.verifiedBadge}
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                    <span>{story.label}</span>
                  </div>
                </div>
              </motion.article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export default function MarketingHomePage({
  weightLossProducts = defaultWeightLossProducts,
  sexualHealthProducts = defaultSexualHealthProducts,
  energyProducts = defaultEnergyProducts,
  strengthProducts = defaultStrengthProducts,
  hero = defaultHeroContent,
  eligibilitySection = defaultEligibilitySection,
  careJourneySection = defaultCareJourneySection,
  banners = defaultHomeBanners,
  splitFeatures = defaultSplitFeatures,
  articleCarousel = defaultArticleCarousel,
  categoryGrid = defaultCategoryGrid,
  memberStoriesSection = defaultMemberStoriesSection,
  blogCarousel = defaultBlogCarousel,
}) {
  const _legacyHomeProps = {
    hero,
    eligibilitySection,
    careJourneySection,
    banners,
    splitFeatures,
    articleCarousel,
    categoryGrid,
    memberStoriesSection,
    blogCarousel,
  };
  const activeHero = mergeHeroContent(hero);
  const activeEligibilitySection = eligibilitySection;
  const _activeCareJourneySection = careJourneySection;
  const activeBanners = mergeHomeBannersContent(banners);
  const activeSplitFeatures = mergeSplitFeaturesContent(splitFeatures);
  const activeArticleCarousel = mergeArticleCarouselContent(articleCarousel);
  const activeCategoryGrid = mergeCategoryGridContent(categoryGrid);
  const activeMemberStoriesSection =
    mergeMemberStoriesContent(memberStoriesSection);
  const activeBlogCarousel = mergeBlogCarouselContent(blogCarousel);
  const weightLossCarousel =
    weightLossProducts.length > 0
      ? weightLossProducts
      : defaultWeightLossProducts;
  const sexualHealthCarousel =
    sexualHealthProducts.length > 0
      ? sexualHealthProducts
      : defaultSexualHealthProducts;
  const energyCarousel =
    energyProducts.length > 0 ? energyProducts : defaultEnergyProducts;
  const strengthCarousel =
    strengthProducts.length > 0 ? strengthProducts : defaultStrengthProducts;
  const weightLossBanner = activeBanners[0] || defaultHomeBanners[0];
  const sexualHealthBanner = activeBanners[1] || defaultHomeBanners[1];
  const energyBanner = activeBanners[2] || defaultHomeBanners[2];
  const strengthBanner = activeBanners[3] || defaultHomeBanners[3];
  const showDeferredHomeSections = false;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />
      <div className="overflow-x-hidden">
        {/* Mobile: Hims-style layout. Desktop (md+): original HeroCategories grid. */}
        <div className="md:hidden">
          <HimsTopSection />
        </div>
        <div className="hidden md:block">
          <HeroCategories hero={activeHero} />
        </div>

        <NegativeSellSection />

        {/* Keep these optional sections behind a flag so we can restore them quickly if needed. */}
        {showDeferredHomeSections ? (
          <EligibilitySection section={activeEligibilitySection} />
        ) : null}

        <MarketingBanner {...weightLossBanner} eagerMedia />
        <MarketingProductCarousel products={weightLossCarousel} eagerImages />
        <MarketingBanner {...sexualHealthBanner} eagerMedia />
        <MarketingProductCarousel products={sexualHealthCarousel} eagerImages />
        <MarketingBanner {...energyBanner} eagerMedia />
        <MarketingProductCarousel products={energyCarousel} eagerImages />
        <SplitFeatures section={activeSplitFeatures} />
        <ArticleCarousel section={activeArticleCarousel} />
        <CategoryGrid section={activeCategoryGrid} />
        <MemberStoriesSection section={activeMemberStoriesSection} />
        <BlogCarousel section={activeBlogCarousel} />

        {showDeferredHomeSections ? (
          <>
            <MarketingBanner {...strengthBanner} eagerMedia />
            <MarketingProductCarousel products={strengthCarousel} eagerImages />
          </>
        ) : null}
        <MarketingFooter />
      </div>
    </div>
  );
}
