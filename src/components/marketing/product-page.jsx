"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Apple,
  ArrowRight,
  Ban,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Droplet,
  FlaskConical,
  Flag,
  Hourglass,
  Minus,
  Plus,
  PlusCircle,
  Rabbit,
  Sparkles,
  ShieldCheck,
  Star,
  Stethoscope,
  Syringe,
  Target,
  TrendingUp,
  TreePine,
  Wheat,
  X,
  Zap,
} from "lucide-react";
import {
  MarketingFooter,
  MarketingNavbar,
  MARKETING_ROUTES,
} from "@/components/marketing/shared";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductPageTestSections } from "@/app/test/TestHeroPreviewContent";
import { productContent as defaultProductContent } from "@/components/marketing/product-content";
import { WORDPRESS_MARKETING_IMAGES } from "@/lib/marketing-images";
import {
  getMarketingProductDetailPath,
  getProductOnboardingPath,
} from "@/lib/product-routing";
import { formatUsdCompact } from "@/lib/pricing";

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

const ICON_MAP = {
  Apple,
  Ban,
  BadgeCheck,
  Check,
  Droplet,
  FlaskConical,
  Hourglass,
  Rabbit,
  ShieldCheck,
  Sparkles,
  Syringe,
  Target,
  TrendingUp,
  TreePine,
  Wheat,
  X,
  Zap,
};

const WILLPOWER_LEFT_MARQUEE_ITEMS = [
  {
    src: "/images/marketing/bundle/weight-loss-lifestyle-1.png",
    alt: "HealSend weight-loss member",
    heightClass: "h-[218px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#dcebff]",
  },
  {
    src: "/weight-loss-image-menu.png",
    alt: "GLP-1 treatment kit",
    heightClass: "h-[198px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#d7f0fb]",
  },
  {
    src: "/images/home/reference/nad-cellular-energy.jpeg",
    alt: "Microscopic wellness texture",
    heightClass: "h-[236px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#edf1ff]",
  },
  {
    src: "/images/marketing/bundle/care-support-lifestyle.webp",
    alt: "HealSend care-support member",
    heightClass: "h-[214px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#f5efe8]",
  },
  {
    src: "/images/home/reference/split-feature-product.jpg",
    alt: "Treatment options",
    heightClass: "h-[228px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#e8efff]",
  },
];

const WILLPOWER_RIGHT_MARQUEE_ITEMS = [
  {
    src: "/application-step-1.png",
    alt: "Online consultation flow",
    heightClass: "h-[214px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#dbe8ff]",
  },
  {
    src: "/images/marketing/bundle/sermorelin-product.png",
    alt: "HealSend recovery support vial",
    heightClass: "h-[194px]",
    objectClass: "object-contain object-center scale-[0.86]",
    bgClass: "bg-[#f6e6bf]",
  },
  {
    src: "/application-step-2.png",
    alt: "Patient dashboard on mobile",
    heightClass: "h-[214px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#e7edf8]",
  },
  {
    src: "/images/marketing/bundle/strength-lifestyle.jpg",
    alt: "HealSend strength and vitality member",
    heightClass: "h-[196px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#ead5bf]",
  },
  {
    src: "/application-step-3.png",
    alt: "Clinicians",
    heightClass: "h-[176px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#eff3ff]",
  },
];

function WillpowerInfoRow({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3 text-[#4f5262]">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef1ff] text-[#6D6FFC]">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-sm leading-6 md:text-[0.97rem]">{children}</p>
    </div>
  );
}

function WillpowerVerticalColumn({ items, reverse = false }) {
  const loopItems = [...items, ...items];
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="flex flex-col gap-3 lg:gap-4"
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: 18,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {loopItems.map((item, index) => (
          <article
            key={`${item.src}-${index}`}
            className={`relative overflow-hidden rounded-[1rem] ${item.heightClass} ${item.bgClass} shadow-[0_14px_30px_rgba(17,24,39,0.08)]`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 24vw"
              className={item.objectClass}
            />
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function WillpowerHorizontalRow({ items, reverse = false }) {
  const loopItems = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#f7f8fc] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#f7f8fc] to-transparent" />
      <motion.div
        className="flex gap-3"
        style={{ width: "max-content" }}
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: 22,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {loopItems.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            className={`relative h-[158px] w-[140px] shrink-0 overflow-hidden rounded-[1rem] sm:h-[178px] sm:w-[158px] ${item.bgClass} shadow-[0_8px_20px_rgba(17,24,39,0.08)]`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="158px"
              className={item.objectClass}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function WillpowerSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f8fc] py-16 md:py-20">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[52%] bg-white" />
      <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-5 md:px-8 lg:grid-cols-[minmax(0,0.93fr)_minmax(420px,0.82fr)] lg:gap-8 lg:px-10">
        <div className="flex items-center py-4 lg:py-8">
          <div className="mx-auto w-full max-w-[34rem]">
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-[1rem] bg-white px-3 py-3 shadow-[0_18px_36px_rgba(20,24,34,0.08)]">
                <p className="font-headline text-[1.35rem] font-extrabold leading-none text-[#11151f]">
                  Forbes
                </p>
                <p className="mt-1 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#5f66d8]">
                  Health 2026
                </p>
                <p className="mt-2 text-[0.78rem] font-medium text-[#5c6170]">
                  GLP-1 Provider
                </p>
              </div>
              <div className="rounded-[1rem] bg-white px-5 py-4 shadow-[0_18px_36px_rgba(20,24,34,0.08)]">
                <p className="font-headline text-[2.2rem] font-semibold italic leading-none text-[#121622]">
                  1,200,000+
                </p>
                <div className="mt-3 flex items-center justify-between gap-6">
                  <p className="text-[1.05rem] font-medium text-[#2b3040]">
                    Prescriptions written
                  </p>
                  <div className="flex -space-x-2">
                    {[
                      "/photoroom-6.png",
                      "/photoroom-4.png",
                      "/photoroom-3.png",
                    ].map((src) => (
                      <span
                        key={src}
                        className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-[#eef0f8]"
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover object-center"
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 max-w-[31rem]">
              <h2 className="font-headline text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#141722] sm:text-[3rem] lg:text-[4rem]">
                Your weight isn&apos;t a willpower problem.
              </h2>
              <p className="mt-1.5 font-headline text-[2.15rem] italic leading-[1.02] tracking-[-0.05em] text-[#6D6FFC] sm:text-[2.55rem] lg:text-[3.55rem]">
                It&apos;s a medical one.
              </p>
              <p className="mt-4 max-w-[29rem] text-[0.98rem] leading-6 text-[#4d5160] lg:text-[1.01rem]">
                Personalized GLP-1 treatment. Unlimited clinician-led care.
                Delivered to your door with a cleaner, calmer care journey from
                intake to refill.
              </p>
            </div>

            <div className="mt-6 max-w-[32rem] space-y-3">
              <WillpowerInfoRow icon={Stethoscope}>
                Compounded Semaglutide &amp; Tirzepatide with clinician-guided
                support and a treatment path that feels simple from day one.
              </WillpowerInfoRow>
              <WillpowerInfoRow icon={Clock3}>
                Month-to-month plans, straightforward billing, and progress
                tracking without bouncing across disconnected tools.
              </WillpowerInfoRow>
              <WillpowerInfoRow icon={ShieldCheck}>
                Private onboarding, secure follow-up care, and visible next
                steps from qualification to ongoing treatment.
              </WillpowerInfoRow>
            </div>

            <div className="mt-6">
              <Link
                href="/funnels/glp-1"
                className="hs-solid-btn inline-flex min-h-[3.5rem] items-center justify-center gap-2 rounded-full px-8 text-base font-semibold"
              >
                Get my personalized plan
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-sm text-[#6b7082]">
                Takes 90 seconds · 100% private · Free
              </p>
            </div>
          </div>
        </div>

        {/* Mobile: two animated horizontal marquee rows */}
        <div className="flex flex-col gap-3 overflow-hidden lg:hidden">
          <WillpowerHorizontalRow items={WILLPOWER_LEFT_MARQUEE_ITEMS} />
          <WillpowerHorizontalRow
            items={WILLPOWER_RIGHT_MARQUEE_ITEMS}
            reverse
          />
        </div>

        {/* Desktop: vertical marquee columns */}
        <div className="relative hidden h-full max-h-[800px] overflow-hidden rounded-[1rem] lg:block">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[#f7f8fc] via-[#f7f8fc]/92 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#f7f8fc] via-[#f7f8fc]/92 to-transparent" />
          <div className="grid h-full grid-cols-2 gap-3 lg:gap-4">
            <WillpowerVerticalColumn items={WILLPOWER_LEFT_MARQUEE_ITEMS} />
            <WillpowerVerticalColumn
              items={WILLPOWER_RIGHT_MARQUEE_ITEMS}
              reverse
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const defaultPricingHighlights = [
  "No hidden fees",
  "Personalized plans",
  "On-demand medical support",
  "Free expedited shipping",
];

function buildLoopingItems(items, minimumCount = 8) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const repeatCount =
    items.length < minimumCount ? Math.ceil(minimumCount / items.length) : 1;

  return Array.from({ length: repeatCount }).flatMap(() => items);
}

const defaultSimpleSteps = [
  {
    title: "Submit your application and meet with a doctor",
    step: 1,
    description:
      "Complete a quick form and meet with a licensed medical provider 100% online. They'll determine if a personalized treatment plan is right for you.",
    image: "/application-step-1.png",
    imageContainerClass:
      "mt-auto flex h-[220px] w-full items-end justify-center",
    imageClass: "h-full w-full object-contain object-bottom",
  },
  {
    title: "Get your medication delivered at home",
    step: 2,
    description:
      "If eligible, your custom prescription will be shipped directly to your door — fast and free.",
    image: "/application-step-2.png",
    imageContainerClass:
      "mt-auto flex h-[220px] w-full items-end justify-center",
    imageClass: "h-full w-full object-contain object-bottom",
  },
  {
    title: "Receive 24/7 support and ongoing care",
    step: 3,
    description:
      "We'll be with you every step of the way with regular check-ins and on-demand medical support to keep you on track.",
    image: "/application-step-3.png",
    imageContainerClass:
      "mt-auto flex h-[220px] w-full items-end justify-center",
    imageClass: "h-full w-full object-contain object-bottom",
  },
];

const defaultComprehensiveCare = {
  title: "The most comprehensive anti-aging care program online.",
  description:
    "Most wellness programs stop at product access. HealSend pairs your treatment with clinician guidance, support, and ongoing care.",
  introLabel: "HealSend",
  introText:
    "You're not just getting medication. You're getting clinician-guided support built to help you stay consistent, informed, and progressing toward better energy and long-term wellness.",
  ctaText: null,
  features: [
    {
      title: "Unlimited Video Calls With Clinicians",
      points: [
        "See a licensed clinician same-day",
        "Unlimited visits, all online",
      ],
      image: WORDPRESS_MARKETING_IMAGES.nadInjection,
      imageClass:
        "absolute bottom-0 right-6 h-32 w-32 rounded-t-2xl border-4 border-white object-contain bg-white p-2 shadow-lg md:h-40 md:w-40",
    },
    {
      title: "Always On Medical Assistance via Phone",
      points: [
        "Questions about side effects? Call our medical hotline",
        "Fast, clear support from U.S. agents - no offshore centers",
      ],
      image: WORDPRESS_MARKETING_IMAGES.nadNasal,
      imageClass:
        "absolute bottom-6 right-6 aspect-square w-28 rounded-full border-4 border-white bg-white object-contain p-3 shadow-xl md:w-36",
    },
    {
      title: "On-Time Refills Guaranteed",
      points: [
        "Fast, reliable delivery for every refill",
        "Refills arrive before you ever run out",
      ],
      image: WORDPRESS_MARKETING_IMAGES.nadPatches,
      imageClass:
        "absolute bottom-2 right-2 w-32 object-contain mix-blend-multiply md:w-48",
    },
    {
      title: "Real-Time Access to Member Community & Platform",
      points: [
        "Share tips, advice, and progress with members",
        "Win rewards, get expert help, and more",
      ],
      image: WORDPRESS_MARKETING_IMAGES.sermorelin,
      imageClass:
        "absolute bottom-6 right-6 aspect-square w-28 rounded-full border-4 border-white bg-white object-contain p-3 shadow-xl md:w-36",
    },
  ],
};

const staticLabTestedSection = {
  title: "Lab tested medications for quality & potency",
  description:
    "Our medication is delivered from a state licensed pharmacy in our network, right to your door when you need it.",
  image: "/lab-tested-medications.jpeg",
};

const defaultTestimonials = defaultProductContent.testimonials || [];
const defaultClosingCta = defaultProductContent.closingCta || {
  eyebrow: "Ready to feel like you again?",
  title: "Find out if this treatment is right for you.",
  description:
    "Every plan includes clinician review, transparent pricing, and a smoother next step into care.",
  bullets: [
    "Clinician-guided intake",
    "Transparent pricing",
    "Fast delivery",
    "Ongoing support",
  ],
  planLabel: defaultProductContent.name,
  supportNote:
    "Final treatment eligibility still depends on clinician review and the plan recommended for you.",
};

function getProductSlug(productData) {
  return productData.slug || productData.id;
}

function getPrimaryCtaHref(productData) {
  return (
    getProductOnboardingPath(getProductSlug(productData)) ||
    productData.primaryCta?.href ||
    MARKETING_ROUTES.nad
  );
}

function hasNumericPrice(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function getPricePresentation(productData) {
  const firstMonth = hasNumericPrice(productData.price?.firstMonth)
    ? formatUsdCompact(productData.price.firstMonth)
    : productData.price?.primaryLabel || "Provider reviewed";
  const regular = hasNumericPrice(productData.price?.regular)
    ? `${formatUsdCompact(productData.price.regular)}/mo`
    : productData.price?.secondaryLabel || null;
  const savings = hasNumericPrice(productData.price?.savings)
    ? formatUsdCompact(productData.price.savings)
    : null;

  return {
    firstMonth,
    regular,
    savings,
    hasNumericFirstMonth: hasNumericPrice(productData.price?.firstMonth),
    hasNumericRegular: hasNumericPrice(productData.price?.regular),
  };
}

function mergeIconItems(items, fallbackItems) {
  if (!Array.isArray(items) || items.length === 0) {
    return fallbackItems;
  }

  const resolveIcon = (icon, fallbackIcon, iconName) => {
    if (typeof icon === "function") {
      return icon;
    }

    if (icon && typeof icon === "object" && typeof icon.render === "function") {
      return icon;
    }

    if (typeof icon === "string" && ICON_MAP[icon]) {
      return ICON_MAP[icon];
    }

    if (typeof iconName === "string" && ICON_MAP[iconName]) {
      return ICON_MAP[iconName];
    }

    return fallbackIcon || ShieldCheck;
  };

  return items.map((item, index) => ({
    ...fallbackItems[index],
    ...item,
    icon: resolveIcon(item?.icon, fallbackItems[index]?.icon, item?.iconName),
  }));
}

function mergeProductContent(product) {
  if (!product) {
    return defaultProductContent;
  }

  const relatedProducts =
    product.relatedProducts === null
      ? []
      : product.relatedProducts?.length > 0
        ? product.relatedProducts
        : defaultProductContent.relatedProducts;

  return {
    ...defaultProductContent,
    ...product,
    tabs: {
      ...defaultProductContent.tabs,
      ...product.tabs,
      benefits: mergeIconItems(
        product.tabs?.benefits,
        defaultProductContent.tabs.benefits,
      ),
      pricing: product.tabs?.pricing || defaultProductContent.tabs.pricing,
      description:
        product.tabs?.description || defaultProductContent.tabs.description,
    },
    supportSection: {
      ...defaultProductContent.supportSection,
      ...product.supportSection,
      features: mergeIconItems(
        product.supportSection?.features,
        defaultProductContent.supportSection.features,
      ),
    },
    cleanIngredients: mergeIconItems(
      product.cleanIngredients,
      defaultProductContent.cleanIngredients,
    ),
    pricingHighlights:
      product.pricingHighlights?.length > 0
        ? product.pricingHighlights
        : defaultPricingHighlights,
    simpleSteps:
      product.simpleSteps?.length > 0
        ? product.simpleSteps
        : defaultSimpleSteps,
    comprehensiveCare: {
      ...defaultComprehensiveCare,
      ...product.comprehensiveCare,
      features:
        product.comprehensiveCare?.features?.length > 0
          ? product.comprehensiveCare.features
          : defaultComprehensiveCare.features,
      ctaText:
        product.comprehensiveCare?.ctaText ||
        defaultComprehensiveCare.ctaText ||
        `Start Your ${product.name || defaultProductContent.name} Journey`,
    },
    benefitsCarouselTitle:
      product.benefitsCarouselTitle ||
      `What are the benefits of ${product.name || defaultProductContent.name}?`,
    relatedProducts: relatedProducts,
    testimonials:
      product.testimonials?.length > 0
        ? product.testimonials
        : defaultTestimonials,
    closingCta: {
      ...defaultClosingCta,
      ...product.closingCta,
      bullets:
        product.closingCta?.bullets?.length > 0
          ? product.closingCta.bullets
          : defaultClosingCta.bullets,
      planLabel:
        product.closingCta?.planLabel ||
        product.name ||
        defaultClosingCta.planLabel,
    },
  };
}

function ProductHero({ productData }) {
  const [activeTab, setActiveTab] = useState("benefits");
  const [openFaq, setOpenFaq] = useState(null);
  const ctaHref = getPrimaryCtaHref(productData);
  const pricePresentation = getPricePresentation(productData);
  const relatedProducts = productData.relatedProducts || [];

  return (
    <section className="bg-[#f9f9f9] px-4 py-12 md:px-8 lg:px-16">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-center gap-5 lg:flex-row lg:gap-6 xl:gap-8">
        <div className="relative flex aspect-[4/5] w-full shrink-0 items-center justify-center overflow-hidden rounded-[1rem] bg-[radial-gradient(circle_at_top,#ffffff_0%,#f2efff_58%,#ece7fa_100%)] lg:sticky lg:top-8 lg:w-[55%] lg:self-start xl:w-[740px]">
          {productData.inStock ? (
            <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-[1rem] bg-white/90 px-5 py-2 text-base font-medium backdrop-blur-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              In Stock
            </div>
          ) : null}
          <div className="flex h-full w-full items-center justify-center p-8 md:p-10 lg:p-12">
            <img
              src={productData.image}
              alt={productData.name}
              className="h-auto max-h-full w-auto max-w-full object-contain drop-shadow-[0_20px_38px_rgba(53,43,126,0.18)]"
            />
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col lg:w-[45%] xl:w-[450px]">
          <h1 className="mb-5 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {productData.name}
          </h1>

          <div className="mb-6 overflow-hidden rounded-[1rem] border border-gray-200 bg-white shadow-sm">
            {pricePresentation.savings ? (
              <div className="flex items-center justify-center gap-2 bg-[#fde073] px-4 py-3 text-sm font-medium text-gray-900 md:text-base">
                <BadgeCheck className="h-4 w-4 md:h-5 md:w-5" />
                Save up to {pricePresentation.savings} on your first order
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 bg-[#fde073] px-4 py-3 text-sm font-medium text-gray-900 md:text-base">
                <BadgeCheck className="h-4 w-4 md:h-5 md:w-5" />
                Clinician-guided treatment with clear next steps
              </div>
            )}
            <div className="p-5 md:p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 md:text-4xl">
                      {pricePresentation.firstMonth}
                    </span>
                    <span className="text-lg font-medium text-gray-800 md:text-xl">
                      {pricePresentation.hasNumericFirstMonth
                        ? "first month"
                        : "support path"}
                    </span>
                  </div>
                  {pricePresentation.regular ? (
                    <div className="mt-1 text-sm text-gray-500 md:text-base">
                      {pricePresentation.hasNumericRegular
                        ? `then ${pricePresentation.regular}*`
                        : pricePresentation.regular}
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-gray-500 md:text-base">
                      Clinician review determines the right treatment path and
                      next step.
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                    Buy now, pay later
                  </span>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 rounded-[0.6rem] bg-[#ffd6e5] px-3 py-1 text-[11px] font-black tracking-tight text-[#1a0030] md:text-xs">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <circle cx="14" cy="14" r="14" fill="#FF6BB2" />
                        <text
                          x="7"
                          y="19"
                          fontFamily="sans-serif"
                          fontWeight="900"
                          fontSize="16"
                          fill="white"
                        >
                          k
                        </text>
                      </svg>
                      Klarna
                    </span>
                    <span className="flex items-center gap-1 rounded-[0.6rem] bg-[#c8f7db] px-3 py-1 text-[11px] font-black tracking-tight text-[#0a2e1a] md:text-xs">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <circle cx="14" cy="14" r="14" fill="#39c77a" />
                        <polyline
                          points="7,14 12,19 21,9"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Afterpay
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={ctaHref}
                className="hs-solid-btn block w-full rounded-[1rem] py-3.5 text-center text-base font-semibold transition-colors md:py-4"
              >
                See if you qualify
              </Link>
              <p className="mt-3 text-center text-xs text-gray-500 md:text-sm">
                {pricePresentation.savings
                  ? "Discount auto-applied at checkout"
                  : "Treatment fit still depends on clinician review"}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-[1rem] border border-gray-200 bg-white p-2 shadow-sm">
            <div className="mb-4 flex rounded-[1rem] bg-gray-100 p-1.5">
              {["benefits", "pricing", "description"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-[1rem] py-2.5 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="overflow-hidden p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {activeTab === "benefits"
                    ? productData.tabs.benefits.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={`${item.text}-${idx}`}
                            className="flex gap-3"
                          >
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                            <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                              {item.text}
                            </p>
                          </div>
                        );
                      })
                    : null}

                  {activeTab === "pricing" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold leading-tight text-gray-900 md:text-xl">
                        {productData.tabs.pricing.title}
                      </h3>
                      <div className="space-y-6">
                        {productData.tabs.pricing.sizes.map((size) => (
                          <div key={size.title}>
                            <h4 className="text-base font-bold text-gray-800 md:text-lg">
                              {size.title}
                            </h4>
                            <p className="mb-3 whitespace-pre-line text-sm text-gray-500">
                              {size.subtitle}
                            </p>
                            <div className="overflow-hidden rounded-[1rem] border border-gray-200">
                              {size.plans.map((plan, index) => (
                                <div
                                  key={plan.name}
                                  className={`flex items-center justify-between p-4 ${
                                    index !== size.plans.length - 1
                                      ? "border-b border-gray-200"
                                      : ""
                                  }`}
                                >
                                  <span className="text-sm font-medium text-gray-700 md:text-base">
                                    {plan.name}
                                  </span>
                                  <div className="text-right">
                                    <div className="mb-1.5 text-xl font-bold leading-none text-[#00a86b]">
                                      ${plan.firstMonthPrice}{" "}
                                      <span className="text-sm font-semibold">
                                        first month
                                      </span>
                                    </div>
                                    <div className="text-sm leading-none text-gray-500">
                                      ${plan.regularPrice}/mo after
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "description" ? (
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      {productData.tabs.description}
                    </p>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-2 flex justify-between border-t border-gray-100 px-4 pb-2 pt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5" /> Compounded in the U.S.A
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> FSA & HSA Eligible
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {productData.faqs.map((faq, idx) => (
              <div
                key={faq.question}
                className="overflow-hidden rounded-[1rem] bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-5 py-5 text-left md:px-6 md:py-6"
                >
                  <span className="pr-4 text-base font-bold text-gray-900 md:text-lg">
                    {faq.question}
                  </span>
                  <div className="flex shrink-0 items-center justify-center rounded-[1rem] bg-[#333333] p-1.5">
                    {openFaq === idx ? (
                      <Minus
                        className="h-4 w-4 text-white md:h-5 md:w-5"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <Plus
                        className="h-4 w-4 text-white md:h-5 md:w-5"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600 md:px-6 md:pb-6 md:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {relatedProducts.length > 0 ? (
            <div className="mb-6">
              <h3 className="mb-4 text-base font-medium text-gray-900">
                Related Products
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={
                      relatedProduct.href ||
                      getMarketingProductDetailPath(relatedProduct.id)
                    }
                    className="flex flex-col items-center rounded-[1rem] border border-gray-200 bg-white p-4 text-center shadow-sm"
                  >
                    <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[1rem]">
                      <img
                        src={relatedProduct.image || productData.image}
                        alt={relatedProduct.name}
                        className="h-full max-h-[160px] w-full rounded-[1rem] object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {relatedProduct.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-5">
            <div className="flex items-center justify-center gap-2 text-base">
              <span className="font-medium">Google</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-sm bg-[#7b75f0] p-1">
                    <Star className="h-3.5 w-3.5 fill-white text-white" />
                  </div>
                ))}
              </div>
              <span className="flex items-center gap-1 font-medium">
                <Star className="h-4 w-4 fill-black" /> 5.0 rating
              </span>
            </div>

            <div className="rounded-[1rem] bg-gray-100 p-4 text-xs leading-relaxed text-gray-500">
              The statements on this page have not been evaluated by the Food
              and Drug Administration. This product is not intended to diagnose,
              treat, cure or prevent any disease.
            </div>

            <div className="space-y-2.5 text-[11px] leading-relaxed text-gray-400">
              <p>
                *Price shown applies to 500mg (2.5mL) 3-month plan paid upfront
                or with buy now, pay later programs. Actual price will depend on
                product and plan prescribed.
              </p>
              <p>
                **The FDA does not review or approve any compounded medications
                for safety or effectiveness.
              </p>
              <p className="mt-5 text-center text-xs underline">
                Important safety information
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function PricingSection({ productData }) {
  const benefits =
    productData.pricingHighlights?.length > 0
      ? productData.pricingHighlights
      : defaultPricingHighlights;
  const ctaHref = getPrimaryCtaHref(productData);
  const pricePresentation = getPricePresentation(productData);

  return (
    <section className="bg-[#f4f5f9] py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="relative flex flex-col gap-8 overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm md:p-10 lg:min-h-[470px] lg:flex-row lg:items-center lg:p-12">
          <div className="z-10 flex-1 lg:max-w-[58%]">
            <h2 className="mb-4 text-3xl font-black leading-[1.1] tracking-tight text-[#1c1d20] md:text-4xl">
              {productData.pricingSectionTitle ||
                `${productData.name} with clear pricing and a smoother next step into care`}
            </h2>

            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-3xl font-black leading-none tracking-tight text-[#1c1d20] md:text-4xl">
                {pricePresentation.firstMonth}
              </span>
              <span className="text-lg font-medium text-gray-500 md:text-xl">
                {pricePresentation.hasNumericFirstMonth
                  ? "first month*"
                  : "support path"}
              </span>
            </div>

            <ul className="mb-8 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <rect width="24" height="24" rx="12" fill="#EEEAFE" />
                    <path
                      d="M17 8L10.125 15.5L7 12.0909"
                      stroke="#7B75F0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-lg text-[#1c1d20] md:text-[1.35rem]">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href={ctaHref}
                className="hs-solid-btn w-full rounded-full px-10 py-4 text-center text-[1.1rem] font-bold transition-colors sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                href={ctaHref}
                className="hs-outline-btn w-full rounded-full px-10 py-4 text-center text-[1.1rem] font-bold transition-colors sm:w-auto"
              >
                See if you&apos;re eligible
              </Link>
            </div>

            <p className="max-w-2xl text-[0.85rem] leading-relaxed text-gray-500">
              {pricePresentation.hasNumericFirstMonth
                ? "*Price shown reflects the lowest current first-month option for this treatment. Actual pricing depends on the plan your clinician recommends for you."
                : pricePresentation.regular ||
                  "Final treatment fit, timing, and any applicable pricing still depend on clinician review and the route recommended for you."}
            </p>
          </div>

          <div className="z-0 flex w-full items-start justify-center lg:absolute lg:bottom-0 lg:right-12 lg:top-10 lg:w-[38%] lg:justify-end">
            <img
              src={productData.image}
              alt={productData.name}
              className="w-full max-w-[360px] rounded-2xl object-contain shadow-lg md:max-w-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSplit({ productData }) {
  return (
    <section className="bg-white px-4 py-20 md:px-8 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="max-w-xl">
          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
            {productData.featureSection.title}
          </h2>
          <div className="space-y-6 leading-relaxed text-gray-600">
            {productData.featureSection.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-square">
          <img
            src={productData.featureSection.image}
            alt="Woman exercising outdoors"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}

function SupportFeatures({ productData }) {
  return (
    <section className="bg-[#f4f4f4] px-4 py-20 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
          Rooted in Science
        </p>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {productData.supportSection.title}
        </h2>
        <p className="mb-12 text-lg text-gray-500">
          {productData.supportSection.subtitle}
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {productData.supportSection.features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <Icon
                  className="mb-6 h-16 w-16 text-[#7b75f0]"
                  strokeWidth={1.5}
                />
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="max-w-[250px] text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BenefitsCarousel({ productData }) {
  const [api, setApi] = useState(null);
  const carouselItems = buildLoopingItems(
    productData.benefitsCarousel || [],
    8,
  );

  return (
    <section className="overflow-hidden bg-[#f9f9f9] py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-16">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
          {productData.benefitsCarouselTitle}
        </h2>
      </div>

      <div className="relative w-full">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            containScroll: false,
            loop: carouselItems.length > 1,
            duration: 34,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 items-stretch md:-ml-6 lg:-ml-8">
            {carouselItems.map((item, itemIndex) => (
              <CarouselItem
                key={`${item.text}-${itemIndex}`}
                className="basis-[84%] pl-4 sm:basis-[58%] md:pl-6 lg:basis-[34%] lg:pl-8 xl:basis-[28%]"
              >
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[1rem]">
                  <Image
                    src={item.image}
                    alt={item.text}
                    fill
                    sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 34vw, (min-width: 640px) 58vw, 84vw"
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-8">
                    <p className="text-base font-normal leading-snug text-white md:text-lg">
                      {item.text}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-16">
          <div className="mt-4 hidden justify-end gap-3 md:flex">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200/80 transition-colors hover:bg-gray-300 md:h-12 md:w-12"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 md:h-6 md:w-6" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200/80 transition-colors hover:bg-gray-300 md:h-12 md:w-12"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ productData }) {
  const testimonials =
    productData.testimonials?.length > 0
      ? productData.testimonials
      : defaultTestimonials;
  const [api, setApi] = useState(null);
  const carouselTestimonials = buildLoopingItems(testimonials, 8);

  if (!carouselTestimonials.length) {
    return null;
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b75f0]">
              Join members achieving life-changing results
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#1c1d20] md:text-4xl">
              Social proof and clearer outcomes belong on the page, not hidden
              in the scroll.
            </h2>
          </div>
          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          containScroll: false,
          loop: carouselTestimonials.length > 1,
          duration: 34,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 items-stretch md:-ml-6">
          {carouselTestimonials.map((testimonial, index) => (
            <CarouselItem
              key={`${testimonial.name}-${index}`}
              className="basis-[84%] pl-4 sm:basis-[58%] md:pl-6 lg:basis-[34%] xl:basis-[30%]"
            >
              <motion.article
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.4,
                  delay: (index % testimonials.length) * 0.06,
                  ease: "easeOut",
                }}
                className="flex min-h-[300px] h-full flex-col rounded-[2rem] border border-[#ececf6] bg-[#fafbff] p-6 shadow-sm md:p-8"
              >
                <div className="mb-5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-[#00b67a] text-[#00b67a]"
                    />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                  “{testimonial.quote}”
                </p>
                <div className="mt-auto pt-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7b75f0]">
                    {testimonial.highlight}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-[#1c1d20]">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111318] text-white">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
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

function ResearchSplit({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);

  return (
    <section className="bg-[#f9f9f9] px-4 py-20 md:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 relative aspect-square overflow-hidden rounded-[2rem] lg:order-1 lg:aspect-[4/4.5]">
          <img
            src={productData.researchSection.image}
            alt="Woman smiling outdoors"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="order-1 max-w-xl lg:order-2">
          <h2 className="mb-8 text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 md:text-4xl lg:text-[2.75rem]">
            {productData.researchSection.title}
          </h2>
          <div className="mb-10 space-y-4">
            {productData.researchSection.points.map((point) => (
              <div key={point} className="flex items-center gap-4">
                <Check
                  className="h-5 w-5 shrink-0 text-[#7b75f0]"
                  strokeWidth={2.5}
                />
                <p className="text-base text-gray-600 md:text-lg">{point}</p>
              </div>
            ))}
          </div>
          <Link
            href={ctaHref}
            className="hs-solid-btn rounded-full px-8 py-3.5 text-base font-medium transition-colors"
          >
            See if you qualify
          </Link>
        </div>
      </div>
    </section>
  );
}

function SimpleSteps({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const steps = defaultSimpleSteps;

  return (
    <section className="bg-[#f4f5f9] py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="mx-auto mb-10 w-full text-[2.5rem] font-semibold leading-[1.15] tracking-tight text-[#1c1d20] md:text-[3rem] lg:text-[3.5rem]">
            Hit your health goals safely &amp; affordably in 3 simple steps
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={ctaHref}
              className="hs-solid-btn w-full rounded-full px-10 py-4 text-center text-[1.1rem] font-bold transition-colors sm:w-auto"
            >
              Get started
            </Link>
            <Link
              href={ctaHref}
              className="hs-outline-btn w-full rounded-full px-10 py-4 text-center text-[1.1rem] font-bold transition-colors sm:w-auto"
            >
              See if you&apos;re eligible
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white px-8 pt-10 shadow-sm"
            >
              <h3 className="mb-8 min-h-[60px] pr-4 text-[1.4rem] font-bold leading-[1.3] text-[#1c1d20]">
                {step.title}
              </h3>

              <div className="mb-8 h-px w-full bg-gray-100/80" />

              <div className="relative z-10 mb-8 flex gap-5">
                <div className="flex w-12 shrink-0 flex-col">
                  <span className="mb-1 text-[0.75rem] font-bold tracking-[0.15em] text-[#8a8d98]">
                    STEP
                  </span>
                  <span className="-ml-1 text-[3.5rem] font-black leading-none text-[#1c1d20]">
                    {step.step}
                  </span>
                </div>
                <p className="pt-1 text-[1.05rem] leading-[1.6] text-[#4a4d57]">
                  {step.description}
                </p>
              </div>

              <div className={step.imageContainerClass}>
                <img
                  src={step.image}
                  alt={`Step ${step.step}`}
                  className={step.imageClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LabTested({ productData: _productData }) {
  const content = staticLabTestedSection;
  const [modalOpen, setModalOpen] = useState(false);

  const LAB_TESTS = [
    {
      name: "Potency Test",
      description:
        "Confirms the medication contains ±10% of the appropriate concentration of the active ingredient.",
    },
    {
      name: "Sterility Test",
      description:
        "Ensures the medication is free from bacteria or pathogens and meets USP 797 requirements.",
    },
    {
      name: "Endotoxicity",
      description:
        "Ensures endotoxin levels remain below USP 85 thresholds for patient safety.",
    },
    {
      name: "pH Test",
      description:
        "Confirms acid/base balance to minimize irritation upon injection.",
    },
  ];

  return (
    <>
      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative z-10 w-full max-w-[680px] overflow-y-auto max-h-[90svh] rounded-[2rem] bg-white p-6 shadow-2xl md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1c1a24] hover:bg-gray-50 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-3 text-2xl font-bold text-[#1c1a24] md:text-3xl">
              Lab tested for quality &amp; potency
            </h2>
            <p className="mb-7 text-sm leading-relaxed text-[#484555] md:text-base">
              Our pharmacies perform third party testing through FDA and DEA
              registered labs to run quality control checks for every compounded
              lot.
            </p>

            {/* Cards — 2-col on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {LAB_TESTS.map((test) => (
                <div
                  key={test.name}
                  className="rounded-2xl border border-gray-100 bg-[#fafafa] p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-base font-bold text-[#1c1a24]">
                      {test.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-[#22c55e] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-white">
                      Passed
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#484555]">
                    {test.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="bg-[#f9f9f9] px-4 py-20 md:px-8 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center gap-8 rounded-[2.5rem] bg-gradient-to-br from-[#6f68f0] to-[#8f88ff] p-6 md:p-10 lg:flex-row lg:gap-12 lg:p-12">
            <div className="flex-1 text-white">
              <h2 className="mb-6 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.75rem]">
                {content.title}
              </h2>
              <p className="mb-10 max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
                {content.description}
              </p>

              <div className="max-w-lg space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:p-5">
                  <div className="flex items-center gap-4">
                    <BadgeCheck
                      className="h-6 w-6 text-white"
                      strokeWidth={1.5}
                    />
                    <span className="text-base font-medium text-white">
                      Third party quality control testing
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="hs-outline-btn rounded-full px-5 py-2 text-sm font-medium transition-colors"
                  >
                    Learn More
                  </button>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:p-5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-white"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 8h20" />
                    <path d="M2 12h20" />
                    <path d="M2 16h20" />
                    <rect
                      x="2"
                      y="4"
                      width="8"
                      height="8"
                      fill="currentColor"
                      rx="1"
                    />
                  </svg>
                  <span className="text-base font-medium text-white">
                    Compounded in U.S. pharmacies
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[45%]">
              <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-2xl">
                <img
                  src={content.image}
                  alt="Lab tested medications"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ComprehensiveCare({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const content = productData.comprehensiveCare || defaultComprehensiveCare;
  const features =
    content.features?.length > 0
      ? content.features
      : defaultComprehensiveCare.features;

  return (
    <section className="bg-[#f9f9f9] py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[#7b75f0] md:text-5xl lg:text-6xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-4xl text-lg text-gray-700 md:text-xl">
            {content.description}
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-10 lg:p-12">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-block text-2xl font-bold text-[#7b75f0] underline decoration-2 underline-offset-4">
              {content.introLabel}
            </div>
            <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-700 md:text-xl">
              {content.introText}
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative flex min-h-[360px] flex-col overflow-hidden rounded-[1.5rem] bg-[#f4f5f9] shadow-sm"
              >
                <div className="flex items-center justify-center gap-1.5 bg-[#7b75f0] py-2 text-xs font-bold text-white">
                  Included <PlusCircle className="h-3.5 w-3.5" />
                </div>
                <div className="relative z-10 flex flex-1 flex-col p-6 md:p-8 md:pr-36">
                  <h3 className="mb-4 text-xl font-bold leading-tight text-[#7b75f0] md:max-w-[65%] md:text-2xl">
                    {feature.title}
                  </h3>
                  <ul className="space-y-3 md:max-w-[65%]">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#7b75f0]" />
                        <span className="text-sm leading-relaxed text-gray-600 md:text-base">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-6 md:hidden">
                  <div className="overflow-hidden rounded-[1.25rem] bg-white/80 p-4">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-40 w-full object-contain"
                    />
                  </div>
                </div>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className={`hidden md:block ${feature.imageClass}`}
                />
              </div>
            ))}
          </div>

          <Link
            href={ctaHref}
            className="hs-solid-btn mx-auto block w-full max-w-2xl rounded-full py-4 text-center text-lg font-bold transition-colors md:py-5 md:text-xl"
          >
            {content.ctaText || `Start Your ${productData.name} Journey`}
          </Link>
        </div>
      </div>
    </section>
  );
}

function CleanSimpleEffective({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const items =
    productData.cleanIngredients?.length > 0
      ? productData.cleanIngredients
      : mergeIconItems(
          defaultProductContent.cleanIngredients,
          defaultProductContent.cleanIngredients,
        );

  return (
    <section className="relative bg-[#f9f9f9] py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-black md:text-4xl lg:text-5xl">
          Clean, simple, and effective
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.text || item.name}
              className="flex flex-col items-center justify-center rounded-[1.5rem] bg-white p-5 text-center shadow-sm"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f9f9f9]">
                <item.icon className="h-7 w-7 text-black" strokeWidth={1.5} />
              </div>
              <p className="whitespace-pre-line text-sm font-medium leading-snug text-black">
                {item.text || item.name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href={ctaHref}
            className="rounded-full bg-gradient-to-r from-[#8b85f5] to-[#665ce0] px-12 py-4 text-lg font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

function MobileStickyCta({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const pricePresentation = getPricePresentation(productData);
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const THRESHOLD = 220;

    const handleScroll = () => {
      const current = window.scrollY;
      const prev = lastScrollY.current;

      if (current > THRESHOLD && current > prev) {
        // scrolling down past threshold → show
        setVisible(true);
      } else if (current < prev || current <= THRESHOLD) {
        // scrolling up OR back near top → hide
        setVisible(false);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      {/* Fade gradient above the bar */}
      <div className="pointer-events-none h-8 bg-[linear-gradient(to_top,rgba(255,255,255,0),transparent)]" />
      <div className="px-4 pb-5">
        <div className="flex justify-end pr-[5%]">
          <Link
            href={ctaHref}
            className="hs-solid-btn inline-flex items-center justify-center rounded-full px-14 py-3.5 text-sm font-semibold shadow-[0_8px_24px_rgba(109,111,252,0.35)] md:min-w-[280px]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MarketingProductPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />
      <ProductHero productData={productData} />
      <WillpowerSection />
      <FeatureSplit productData={productData} />
      <MediaLogosBanner />
      <PricingSection productData={productData} />
      <SupportFeatures productData={productData} />
      <BenefitsCarousel productData={productData} />
      <TestimonialsSection productData={productData} />
      <ResearchSplit productData={productData} />
      <SimpleSteps productData={productData} />
      <LabTested productData={productData} />
      <ComprehensiveCare productData={productData} />
      <CleanSimpleEffective productData={productData} />
      <ProductPageTestSections />
      <MarketingFooter />
      <MobileStickyCta productData={productData} />
    </div>
  );
}
