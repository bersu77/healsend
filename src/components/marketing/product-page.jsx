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
  Clock3,
  ChevronLeft,
  ChevronRight,
  Droplet,
  FlaskConical,
  Hourglass,
  Minus,
  Mail,
  PillBottle,
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
  MinimalMarketingNavbar,
  MARKETING_ROUTES,
} from "@/components/marketing/shared";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { productContent as defaultProductContent } from "@/components/marketing/product-content";
import {
  getMarketingProductDetailPath,
  getProductOnboardingPath,
} from "@/lib/product-routing";
import { formatUsdCompact } from "@/lib/pricing";

function FadeInSection({ children, delay = 0, y = 48, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const MEDIA_LOGOS = [
  { name: "Yahoo!", image: "/sponsers/yahoo.webp", alt: "Yahoo logo" },
  { name: "USA TODAY", image: "/sponsers/usa-today.webp", alt: "USA TODAY logo", sizeClass: "w-36 md:w-40" },
  { name: "AXIOS", image: "/sponsers/axios.png", alt: "AXIOS logo", sizeClass: "w-40 md:w-44", imageClass: "scale-[0.7]" },
  { name: "Forbes", image: "/sponsers/forbes.webp", alt: "Forbes logo", imageClass: "scale-[0.8]" },
  { name: "Business Insider", image: "/sponsers/business-insider.png", alt: "Business Insider logo", sizeClass: "w-44 md:w-48" },
  // { name: "Reuters", image: "/sponsers/reuters.png", alt: "Reuters logo", sizeClass: "w-40 md:w-44", imageClass: "scale-[1.55]" },
];

function MediaLogosBanner() {
  return (
    <div className="overflow-hidden bg-[#5b3cdd] py-6">
      <div className="flex animate-[mediaLogoScroll_22s_linear_infinite]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center gap-12 px-6 md:gap-16 md:px-10"
          >
            {MEDIA_LOGOS.map((logo, i) => (
              <div
                key={i}
                className={`relative flex h-8 shrink-0 items-center justify-center px-1 opacity-90 transition-opacity hover:opacity-100 ${logo.sizeClass || "w-36 md:w-40"}`}
              >
                <Image
                  src={logo.image}
                  alt={logo.alt}
                  fill
                  sizes="(max-width: 768px) 144px, 160px"
                  className={`object-contain ${logo.imageClass || ""} ${logo.name === "Business Insider" ? "brightness-0 invert" : ""} ${logo.name === "Reuters" ? "filter contrast-200 brightness-1.5" : ""}`}
                />
              </div>
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

const SLIDER_HEIGHTS = [
  "h-[218px]",
  "h-[198px]",
  "h-[236px]",
  "h-[214px]",
  "h-[228px]",
  "h-[196px]",
];
const SLIDER_BGS = [
  "bg-[#dcebff]",
  "bg-[#d7f0fb]",
  "bg-[#edf1ff]",
  "bg-[#f5efe8]",
  "bg-[#e8efff]",
  "bg-[#dbe8ff]",
];

const buildSliderItem = (filename, index) => ({
  src: `/images/slider/${encodeURI(filename)}`,
  alt: "HealSend member",
  heightClass: SLIDER_HEIGHTS[index % SLIDER_HEIGHTS.length],
  objectClass: "object-cover object-center",
  bgClass: SLIDER_BGS[index % SLIDER_BGS.length],
});

const WILLPOWER_LEFT_MARQUEE_ITEMS = [
  "Copy of Gemini_Generated_Image_ctnnloctnnloctnn.png",

  "240_F_554794353_4b7WK5XeFkemnF1o7RXL2WFt4ITps4jX.jpg",

  "Box_2.png",
  "Copy of 240_F_1859749441_tdF1skYaEk8hSO9lo4tAYXdwVvq7Km4c.jpg",
  "Copy of 240_F_1861119733_Y7uOou4SbKCsL0DzOOy5RA0UASKblWIO.jpg",
  "Copy of 240_F_255843378_E2xPB7yqctJZrRIgyeAj8HxXzg5N2mr6.jpg",
  "Copy of pexels-tima-miroshnichenko-5928317.jpg",

  "Copy of Gemini_Generated_Image_r1o81rr1o81rr1o8.png",
  "Copy of Gemini_Generated_Image_schuohschuohschu.png",
  "Copy of happyveganfit-remove-4559326 (1).jpg",
  "Copy of natali-hordiiuk-OIn0cEu0iQ0-unsplash.jpg",
  "Copy of pexels-cottonbro-6941311.jpg",
].map(buildSliderItem);

const WILLPOWER_RIGHT_MARQUEE_ITEMS = [
  "Copy of pexels-daniel-dan-47825192-7558820.jpg",
  "Copy of pexels-farhadirani-34650790.jpg",
  "Copy of pexels-karola-g-4498158.jpg",
  "Copy of pexels-lara-stratiychuk-1606923648-27536859.jpg",
  "Copy of pexels-olly-3807548.jpg",
  "Copy of pexels-tima-miroshnichenko-6011604.jpg",
  "Copy of pexels-tirachard-kumtanom-112571-347135.jpg",
  "Gemini_Generated_Image_n1o1o6n1o1o6n1o1.png",
  "Copy of look-studio-S0T98VD2KZs-unsplash.jpg",
  "Gemini_Generated_Image_4a1v034a1v034a1v.png",
  "Gemini_Generated_Image_neknhtneknhtnekn.png",
  "PHOTO-2026-03-29-18-10-25(1).jpg",
].map(buildSliderItem);

function WillpowerVerticalColumn({ items, reverse = false }) {
  const loopItems = [...items, ...items];
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="flex flex-col gap-3 lg:gap-4"
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {loopItems.map((item, index) => (
          <article
            key={`${item.src}-${index}`}
            className={`relative overflow-hidden rounded-[1rem] ${item.heightClass} ${item.bgClass}`}
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
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F1F5F9] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F1F5F9] to-transparent" />
      <motion.div
        className="flex gap-3"
        style={{ width: "max-content" }}
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: 36,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {loopItems.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            className={`relative h-[158px] w-[140px] shrink-0 overflow-hidden rounded-[1rem] sm:h-[178px] sm:w-[158px] ${item.bgClass}`}
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
    <section className="relative overflow-hidden bg-[#F1F5F9]">
      <div className="relative mx-auto grid max-w-[1340px] grid-cols-1 items-start gap-10 px-4 py-10 md:gap-16 md:px-[3.25rem] md:py-14 lg:h-[calc(100dvh-80px)] lg:grid-cols-2 lg:items-center lg:overflow-hidden lg:py-0">
        <div className="w-full">
          <div className="w-full max-w-[34rem]">
            <div className="flex flex-wrap items-stretch gap-3">
              <div className="relative h-[96px] w-[68px] shrink-0 self-stretch overflow-hidden rounded-2xl md:h-[127px] md:w-[91px]">
                <Image
                  src="/images/marketing/logos/forbes-best-of-2026.webp"
                  alt="Forbes Health Best of 2026 — GLP-1 Provider"
                  fill
                  sizes="120px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col gap-2 self-start rounded-2xl border border-gray-100 bg-slate-50 px-3 py-2 shadow-[0px_9.54px_42.93px_0px_#0000002B] md:px-6 md:py-3">
                <p className="text-5xl font-medium leading-[42px] tracking-tighter text-gray-950 md:text-[57px] md:leading-[57px]">
                  1,200,000+
                </p>
                <div className="flex items-center justify-start gap-2">
                  <span className="text-[10px] font-medium leading-[14px] text-gray-950 md:text-xl">
                    Prescriptions written
                  </span>
                  <div className="flex -space-x-2">
                    {[
                      "/photoroom-6.png",
                      "/photoroom-4.png",
                      "/photoroom-3.png",
                      "/photoroom-2.png",
                    ].map((src) => (
                      <span
                        key={src}
                        className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-[#eef0f8] md:h-9 md:w-9"
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

            <div className="mt-5 max-w-[34rem]">
              <h2 className="text-balance font-title text-4xl font-medium leading-tight tracking-tight text-gray-950 md:text-5xl">
                Your weight isn&apos;t a willpower problem.{" "}
                <span className="font-playfair italic font-medium text-[#6d6ffc]">
                  It&apos;s a medical one.
                </span>
              </h2>
              <p className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-800 lg:text-[1.05rem]">
                Personalized GLP-1 treatment. Unlimited clinician-led care.
                Delivered to your door. Guaranteed or it&apos;s free
              </p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              <li className="grid grid-cols-[auto_1fr] items-start gap-1 text-sm md:text-lg">
                <div className="flex items-center gap-4 text-base md:text-sm">
                  <PillBottle className="h-6 w-6 shrink-0" strokeWidth={2} />
                  <span>
                    Compounded Semaglutide &amp; Tirzepatide — the most
                    prescribed GLP-1s in clinical weight loss
                  </span>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-start gap-1 text-sm md:text-lg">
                <div className="flex items-center gap-4 text-base md:text-sm">
                  <Stethoscope className="h-6 w-6 shrink-0" strokeWidth={2} />
                  <span>Month-to-month · Cancel anytime · HSA/FSA accepted</span>
                </div>
              </li>
            </ul>

            <div className="mt-5">
              <Link
                href="/funnels/glp-1"
                className="hs-solid-btn inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full px-7 text-base font-semibold"
              >
                Get my personalized plan
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-2.5 text-sm font-semibold text-[#4d5160]">
                Takes 90 seconds · 100% Private · Free
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
        <div className="relative hidden h-full self-stretch overflow-hidden lg:block">
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

const NEGATIVE_SELL_CARDS = [
  {
    title: "The hunger that never shuts off.",
    image: "/images/negative-sell/negative_1.webp",
    bullets: [
      "You just ate — and you're already thinking about food again.",
      "The mental load of tracking, restricting, and starting over is exhausting.",
    ],
  },
  {
    title: "Your metabolism turned on you.",
    image: "/images/negative-sell/negative_2.jpeg",
    bullets: [
      "Postpartum weight, stress eating, hormonal changes — it all adds up.",
      "Slower metabolism means doing everything right and still not seeing results.",
    ],
  },
  {
    title: "Lose 20. Gain 25 back. Every diet makes it worse.",
    image: "/images/negative-sell/negative_3.jpg",
    bullets: [
      "You've lost and regained the same weight more than once.",
      "Each restart is harder, and your body fights you more every time.",
    ],
  },
  {
    title: "This was never about discipline.",
    image: "/images/negative-sell/negative_4.webp",
    bullets: [
      "Feeling like you should be able to do this alone keeps you stuck.",
      "You've looked into this before — you just needed the right support.",
    ],
  },
];

function NegativeSellSection() {
  return (
    <section className="bg-white py-16 md:py-20">
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
            href="/funnels/glp-1"
            className="hs-solid-btn rounded-full px-10 py-4 text-base font-semibold transition-all hover:-translate-y-0.5"
          >
            See if GLP-1 is right for you
          </Link>
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
      "mt-auto flex h-[360px] w-full items-end justify-center",
    imageClass: "h-full w-full object-cover object-bottom",
  },
  {
    title: "Get your medication delivered at home",
    step: 2,
    description:
      "If eligible, your custom prescription will be shipped directly to your door — fast and free.",
    image: "/application-step-2.png",
    imageContainerClass:
      "mt-auto flex h-[360px] w-full items-end justify-center",
    imageClass: "h-full w-full scale-[1.22] object-contain object-bottom",
  },
  {
    title: "Receive 24/7 support and ongoing care",
    step: 3,
    description:
      "We'll be with you every step of the way with regular check-ins and on-demand medical support to keep you on track.",
    image: "/application-step-3.png",
    imageContainerClass:
      "mt-auto flex h-[360px] w-full items-end justify-center",
    imageClass: "h-full w-full object-contain object-bottom",
  },
];

const defaultComprehensiveCare = {
  title: "The most comprehensive GLP-1 care program online.",
  description:
    "Most GLP-1 programs stop at medications. We deliver expert-led care and clinician support for faster, safer results.",
  introLabel: "HealSend",
  introText:
    "You're not just getting medication. You're getting full care on demand to keep you motivated, safe, and reaching your weight-loss goals.",
  ctaText: "Start Your Weight Loss Journey",
  features: [
    {
      title: "Unlimited Video Calls With\nClinicians",
      points: [
        "See a licensed clinician same-day",
        "Unlimited visits, all online",
      ],
      image: "/images/marketing/include-1.jpeg",
      imageClass:
        "absolute bottom-0 right-6 h-32 w-32 object-contain md:h-40 md:w-40",
    },
    {
      title: "Always On Medical Assistance via Phone",
      points: [
        "Questions about side effects? Call our medical hotline",
        "Fast, clear support from U.S. agents - no offshore centers",
      ],
      image: "/images/marketing/include-2.png",
      imageClass:
        "absolute bottom-6 right-6 aspect-square w-28 rounded-full border-4 border-white bg-white object-contain p-3 shadow-xl md:w-36",
    },
    {
      title: "On-Time Refills Guaranteed",
      points: [
        "Fast, reliable delivery for every refill",
        "Refills arrive before you ever run out",
      ],
      image: "/images/marketing/include-3.png",
      imageClass:
        "absolute bottom-2 right-2 w-32 object-contain mix-blend-multiply md:w-48",
    },
    {
      title: "Real-Time Access to Member Community & Platform",
      points: [
        "Share tips, advice, and progress with members",
        "Win rewards, get expert help, and more",
      ],
      image: "/images/marketing/include-4.png",
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
    <section className="bg-[#f9f9f9] px-4 py-16 md:px-8 md:py-20 lg:px-16">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-center gap-5 lg:flex-row lg:gap-6 xl:gap-8">
        <div className="relative flex aspect-[4/5] w-full shrink-0 items-center justify-center overflow-hidden rounded-[1rem] bg-[#f9f9f9] lg:sticky lg:top-8 lg:w-[55%] lg:self-start xl:w-[740px]">
          <h1 className="absolute left-[11%] top-8 z-20 whitespace-nowrap text-start text-3xl font-bold tracking-tight text-gray-900 md:top-9 md:text-5xl">
            Tirzepatide Injections
          </h1>
          <div className="flex h-full w-full items-center justify-center py-4 md:py-8">
            <div className="relative h-full w-full max-h-[78%] max-w-[78%]">
              {productData.inStock ? (
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-[1rem] bg-white/92 px-4 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-white/80 backdrop-blur-sm md:left-5 md:top-5 md:px-5 md:py-2 md:text-base">
                  <div className="relative h-2.5 w-2.5 md:h-3 md:w-3">
                    <span className="absolute inset-0 rounded-full bg-emerald-400/60 blur-[2px]" />
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  In Stock
                </div>
              ) : null}
              <img
                src="/images/marketing/instock.jpeg"
                alt={`${productData.name} — in stock`}
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col lg:w-[45%] xl:w-[450px]">
          <div className="mb-6 overflow-hidden rounded-[1rem] border border-gray-200 bg-white">
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
                      $0
                    </span>
                    <span className="text-lg font-medium text-gray-800 md:text-xl">
                      first month
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 md:text-base">
                    then $299/mo*
                  </div>
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                    Buy now, pay later
                  </span>
                  <div className="flex gap-2">
                    <span className="flex items-center rounded-[0.6rem] bg-[#FFB3C7] px-3 py-1.5">
                      <img
                        src="/images/marketing/logos/klarna.png"
                        alt="Klarna"
                        className="h-3 w-auto"
                      />
                    </span>
                    <span className="flex items-center rounded-[0.6rem] bg-[#B2FCE4] px-3 py-1.5">
                      <img
                        src="/images/marketing/logos/afterpay.png"
                        alt="Afterpay"
                        className="h-3 w-auto"
                      />
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
                  className={`flex-1 rounded-[1rem] py-2.5 text-sm font-medium capitalize transition-colors ${activeTab === tab
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
                    <div className="space-y-8">
                      {/* Tirzepatide Injections Pricing */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold leading-tight text-gray-900 md:text-xl">
                          Tirzepatide Injections
                        </h3>
                        <div className="rounded-[1rem] border border-gray-200">
                          {[
                            { name: "12 Month Plan", firstMonth: 0, thenPrice: 299, isBestValue: true },
                            { name: "3 Month Plan", firstMonth: 149, thenPrice: 299, isBestValue: false },
                            { name: "Monthly Plan", firstMonth: 199, thenPrice: 199, isBestValue: false, isMuted: true }
                          ].map((plan, index) => (
                            <div
                              key={plan.name}
                              className={`relative flex items-center justify-between p-4 ${index !== 2 ? "border-b border-gray-200" : ""
                                } ${plan.isMuted ? "bg-gray-50/50" : ""}`}
                            >
                              {plan.isBestValue ? (
                                <span className="absolute right-4 top-0 z-10 flex h-[1.4rem] -translate-y-1/2 items-center rounded-full bg-[#00a86b] px-3 text-sm font-semibold leading-none text-white">
                                  Best Value
                                </span>
                              ) : null}
                              <span className={`text-sm font-medium md:text-base ${plan.isMuted ? "text-gray-500" : "text-gray-700"}`}>
                                {plan.name}
                              </span>
                              <div className="text-right">
                                <div className={`text-xl font-bold leading-none ${plan.isMuted ? "text-gray-500" : "text-[#00a86b]"}`}>
                                  ${plan.firstMonth === 0 ? "0" : plan.firstMonth}{" "}
                                  <span className="text-sm font-semibold">
                                    {plan.firstMonth === 0 ? "first month" : "first month"}
                                  </span>
                                  {plan.thenPrice && (
                                    <div className="mt-1 text-sm font-normal text-gray-500">
                                      {plan.name === "Monthly Plan"
                                        ? `$${plan.thenPrice}/mo*`
                                        : `then $${plan.thenPrice}/mo*`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Semaglutide Injections Pricing */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold leading-tight text-gray-900 md:text-xl">
                          Semaglutide Injections
                        </h3>
                        <div className="rounded-[1rem] border border-gray-200">
                          {[
                            { name: "12 Month Plan", firstMonth: 0, thenPrice: 249, isBestValue: true },
                            { name: "3 Month Plan", firstMonth: 149, thenPrice: 249, isBestValue: false },
                            { name: "Monthly Plan", firstMonth: 199, thenPrice: 199, isBestValue: false, isMuted: true }
                          ].map((plan, index) => (
                            <div
                              key={plan.name}
                              className={`relative flex items-center justify-between p-4 ${index !== 2 ? "border-b border-gray-200" : ""
                                } ${plan.isMuted ? "bg-gray-50/50" : ""}`}
                            >
                              {plan.isBestValue ? (
                                <span className="absolute right-4 top-0 z-10 flex h-[1.4rem] -translate-y-1/2 items-center rounded-full bg-[#00a86b] px-3 text-sm font-semibold leading-none text-white">
                                  Best Value
                                </span>
                              ) : null}
                              <span className={`text-sm font-medium md:text-base ${plan.isMuted ? "text-gray-500" : "text-gray-700"}`}>
                                {plan.name}
                              </span>
                              <div className="text-right">
                                <div className={`text-xl font-bold leading-none ${plan.isMuted ? "text-gray-500" : "text-[#00a86b]"}`}>
                                  ${plan.firstMonth === 0 ? "0" : plan.firstMonth}{" "}
                                  <span className="text-sm font-semibold">
                                    {plan.firstMonth === 0 ? "first month" : "first month"}
                                  </span>
                                  {plan.thenPrice && (
                                    <div className="mt-1 text-sm font-normal text-gray-500">
                                      {plan.name === "Monthly Plan"
                                        ? `$${plan.thenPrice}/mo*`
                                        : `then $${plan.thenPrice}/mo*`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
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
              <span className="flex items-center gap-1.5">
                <img
                  draggable={false}
                  role="img"
                  alt="us"
                  src="/images/marketing/logos/flag-usa.svg"
                  className="h-4 w-4 align-[-0.1em]"
                />
                Compounded in the U.S.A
              </span>
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
const MEDICAL_PLANS = [
  {
    id: "semaglutide",
    headerClass: "bg-[#f3c787]",
    headerTextClass: "text-white",
    useFullImage: true,
    badges: ["Just starting GLP-1?", "Recommended starter plan"],
    title: "Semaglutide\nPlan",
    subtitle: "GLP-1 receptor agonist",
    image: "/images/marketing/semaglutide.webp",
    bulletsHeading: "WHAT YOU GET",
    bullets: [
      {
        icon: Star,
        text: "Steady, gradual weight loss for first-time GLP-1 users",
      },
      {
        icon: Hourglass,
        text: "Once-weekly injection your clinician dials in to your body",
      },
    ],
    primaryCta: "Start Semaglutide",
    secondaryCta: "Why Sema?",
    description:
      "A simple first step. A once-weekly injection that calms food noise, eases cravings, and supports steady, predictable progress.",
    whyItWorks: [
      "Feel full sooner and stay full longer",
      "Quiets persistent food cravings between meals",
      "Supports gradual, sustainable fat loss",
    ],
    bestFor: [
      "First-time GLP-1 users",
      "Members who want steady, predictable progress",
    ],
  },
  {
    id: "tirzepatide",
    headerClass: "bg-[#3a7fb8]",
    headerTextClass: "text-white",
    useFullImage: true,
    badges: ["Hit a plateau on GLP-1?", "Most chosen plan"],
    title: "Tirzepatide\nPlan",
    subtitle: "Dual GIP + GLP-1 agonist",
    image: "/images/marketing/tirzepatide.webp",
    bulletsHeading: "WHAT YOU GET",
    bullets: [
      {
        icon: Target,
        text: "Targets two metabolic pathways for stronger appetite control",
      },
      {
        icon: TrendingUp,
        text: "A great next step if Semaglutide has stalled for you",
      },
      {
        icon: ShieldCheck,
        text: "Slow titration designed to keep side effects minimal",
      },
    ],
    primaryCta: "Start Tirzepatide",
    secondaryCta: "Why Tirz?",
    description:
      "A dual-action option that goes after both hunger and insulin response for stronger results when one mechanism isn't enough.",
    whyItWorks: [
      "Stronger appetite suppression than single-action GLP-1s",
      "Engages both hunger and insulin response pathways",
      "Built for deeper, faster weight reduction",
    ],
    bestFor: [
      "Members plateauing on Semaglutide",
      "Anyone who needs stronger appetite control",
    ],
  },
  // {
  //   id: "microdose",
  //   headerClass: "bg-gradient-to-br from-[#cdb194] to-[#9c7e5b]",
  //   headerTextClass: "text-white",
  //   badges: ["Gentle start", "Lower-dose option"],
  //   title: "GLP-1 Microdose\nPlan",
  //   subtitle: "GLP-1 agonist · micro-titration",
  //   image: "/images/marketing/glp1-hero-merged-tight.png",
  //   bulletsHeading: "WHY MEMBERS CHOOSE MICRODOSE",
  //   bullets: [
  //     {
  //       icon: PillBottle,
  //       text: "Smaller, more frequent dosing for a gentler introduction",
  //     },
  //     {
  //       icon: ArrowRight,
  //       text: "Move up to the full plan whenever you feel ready",
  //     },
  //   ],
  //   primaryCta: "Start Microdose",
  //   secondaryCta: "Why Microdose?",
  //   description:
  //     "Start low, go slow. Smaller doses split across the week for a gentler ramp and an easier adjustment period.",
  //   whyItWorks: [
  //     "Lower doses, fewer reported side effects",
  //     "Twice-weekly schedule keeps levels steady",
  //     "Easier to stick with long term",
  //   ],
  //   bestFor: [
  //     "First-time injectable users",
  //     "Members sensitive to medication side effects",
  //   ],
  // },
  {
    id: "name-brand",
    headerClass: "bg-[#3a7fb8]",
    headerTextClass: "text-white",
    useFullImage: true,
    badges: ["Prefer a brand name?", "Retail price"],
    title: "Ozempic®\nZepbound®",
    subtitle: "",
    image: "/images/marketing/branded.webp",
    bulletsHeading: "",
    bullets: [],
    primaryCta: "Get a name brand",
    secondaryCta: null,
  },
];

function MedicalPlanCard({ plan, ctaHref }) {
  const [expanded, setExpanded] = useState(false);
  const isMinimal = plan.bullets.length === 0;
  const hasDetails =
    plan.description ||
    (plan.whyItWorks && plan.whyItWorks.length > 0) ||
    (plan.bestFor && plan.bestFor.length > 0);

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_40px_-24px_rgba(91,60,221,0.12)] ring-1 ring-[#ece8f3] ${isMinimal ? "" : "min-h-[620px]"
        }`}
    >
      <div
        className={`relative h-[222px] shrink-0 overflow-hidden ${plan.headerClass} ${plan.headerTextClass}`}
      >
        {plan.useFullImage ? (
          <img
            src={plan.image}
            alt={plan.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <img
            src={plan.image}
            alt={plan.title}
            loading="lazy"
            className="pointer-events-none absolute right-0 top-0 h-full w-[55%] object-contain object-right"
          />
        )}
        <div className="absolute inset-0 z-10 flex flex-col justify-between gap-y-6 p-6">
          <div className="flex flex-col items-start gap-y-2">
            {plan.badges.map((badge, i) => (
              <span
                key={badge}
                className={`rounded-lg px-2 py-1 text-sm font-medium leading-5 text-gray-800 ${i === 0
                  ? "bg-gradient-to-r from-white/80 to-white/50"
                  : "bg-white/50"
                  }`}
              >
                {badge}
              </span>
            ))}
          </div>
          <div>
            <p className="text-2xl font-medium leading-tight">
              {plan.title.split("\n").map((line, idx, arr) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < arr.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </p>
            {plan.subtitle ? (
              <p className="mt-2 text-sm font-medium">{plan.subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        {!isMinimal ? (
          <>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#1c1a24]">
              {plan.bulletsHeading}
            </p>
            <ul className="mb-6 flex-1 space-y-4">
              {plan.bullets.map((bullet) => {
                const Icon = bullet.icon;
                return (
                  <li key={bullet.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1ecf9]">
                      <Icon className="h-3.5 w-3.5 text-[#5b3cdd]" />
                    </span>
                    <span className="text-sm leading-6 text-[#1c1a24]">
                      {bullet.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="flex-1" />
        )}

        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1a24] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2a2740]"
        >
          {plan.primaryCta}
          <ArrowRight className="h-4 w-4" />
        </Link>
        {plan.secondaryCta && hasDetails ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={`mt-3 inline-flex items-center justify-center rounded-full border bg-white px-5 py-3 text-sm font-semibold transition-colors ${expanded
              ? "border-[#d8d2ee] text-[#5b3cdd] hover:bg-[#f1ecf9]"
              : "border-[#e5e0ee] text-[#1c1a24] hover:bg-[#f1ecf9]"
              }`}
          >
            {expanded ? "Hide details" : plan.secondaryCta}
          </button>
        ) : null}

        <AnimatePresence initial={false}>
          {expanded && hasDetails ? (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-6 border-t border-[#ece8f3] pt-6">
                {plan.description ? (
                  <p className="text-sm leading-6 text-[#474257]">
                    {plan.description}
                  </p>
                ) : null}
                {plan.whyItWorks?.length > 0 ? (
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#1c1a24]">
                      WHY IT WORKS
                    </p>
                    <ul className="space-y-2.5">
                      {plan.whyItWorks.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#5b3cdd]"
                            strokeWidth={3}
                          />
                          <span className="text-sm leading-6 text-[#1c1a24]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {plan.bestFor?.length > 0 ? (
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#1c1a24]">
                      BEST FOR
                    </p>
                    <ul className="space-y-2.5">
                      {plan.bestFor.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#5b3cdd]"
                            strokeWidth={3}
                          />
                          <span className="text-sm leading-6 text-[#1c1a24]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MedicalWeightLossSection({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);

  return (
    <section className="overflow-hidden bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-16">
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-title text-3xl font-bold tracking-tight text-gray-950 md:text-5xl">
              Medical weight-loss care
            </h2>
            <p className="mt-1 font-playfair text-2xl italic text-[#5b3cdd] md:text-4xl">
              matched to your stage and goals.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#474257] md:text-lg">
              Weight loss isn&apos;t one-size-fits-all. Choose the plan built
              for where you are right now &mdash; your goals, your lifestyle,
              your timeline.
            </p>
          </div>

          <div className="flex flex-row items-center gap-4 md:gap-6">
            <img
              src="/images/marketing/ratings-trustpilot.webp"
              alt="Trustpilot rating"
              loading="lazy"
              className="h-20 w-auto md:h-24"
            />
            <img
              src="/images/marketing/ratings-fb.webp"
              alt="Facebook community"
              loading="lazy"
              className="h-20 w-auto md:h-24"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
          {MEDICAL_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="w-full max-w-md lg:w-[26%] lg:max-w-none"
            >
              <MedicalPlanCard plan={plan} ctaHref={ctaHref} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const pricePresentation = getPricePresentation(productData);
  const heroFirstMonthPrice = "$0";
  const heroThenPrice = "$299/mo*";

  return (
    <section className="bg-[#f4f5f9] py-16 md:py-20">
      <div className="mx-auto max-w-[560px] px-4">
        <h2 className="mb-5 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {productData.name}
        </h2>

        <div className="overflow-hidden rounded-[1rem] border border-gray-200 bg-white">
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
                    {heroFirstMonthPrice}
                  </span>
                  <span className="text-lg font-medium text-gray-800 md:text-xl">
                    first month
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500 md:text-base">
                  then {heroThenPrice}
                </div>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                  Buy now, pay later
                </span>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-[0.6rem] bg-[#FFB3C7] px-3 py-1.5">
                    <img
                      src="/images/marketing/logos/klarna.png"
                      alt="Klarna"
                      className="h-3 w-auto"
                    />
                  </span>
                  <span className="flex items-center rounded-[0.6rem] bg-[#B2FCE4] px-3 py-1.5">
                    <img
                      src="/images/marketing/logos/afterpay.png"
                      alt="Afterpay"
                      className="h-3 w-auto"
                    />
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
      </div>
    </section>
  );
}

function _FeatureSplit({ productData }) {
  return (
    <section className="bg-white px-4 py-16 md:px-8 md:py-20 lg:px-16">
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
    <section className="bg-[#f4f4f4] px-4 py-16 md:px-8 md:py-20 lg:px-16">
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
            const hasIconImage = Boolean(feature.iconImage);

            return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                {hasIconImage ? (
                  <img
                    src={feature.iconImage}
                    alt={feature.title}
                    className={`mb-6 h-20 w-20 object-contain mix-blend-multiply ${feature.iconTint === "purple"
                      ? "brightness-0 saturate-100"
                      : ""
                      }`}
                    style={
                      feature.iconTint === "purple"
                        ? {
                          filter:
                            "brightness(0) saturate(100%) invert(56%) sepia(72%) saturate(1025%) hue-rotate(218deg) brightness(101%) contrast(95%)",
                        }
                        : undefined
                    }
                  />
                ) : (
                  <Icon
                    className="mb-6 h-16 w-16 text-[#7b75f0]"
                    strokeWidth={1.5}
                  />
                )}
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
    <section className="overflow-hidden bg-[#f9f9f9] py-16 md:py-20">
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

const TRANSFORMATION_TESTIMONIALS = [
  {
    name: "Kala",
    weightLoss: 40,
    before: "/kala_before.webp",
    after: "/kala_after.webp",
  },
  {
    name: "Morgan",
    weightLoss: 36,
    before: "/morgan_before.webp",
    after: "/morgan_after.webp",
  },

  {
    name: "Noelle",
    weightLoss: 32,
    before: "/noelle_before.webp",
    after: "/noelle_after.webp",
  },
  {
    name: "Chris",
    weightLoss: 42,
    before: "/christopher_before.webp",
    after: "/christopher_after.webp",
  },
];

function TestimonialsSection() {
  const [api, setApi] = useState(null);
  const carouselTransformations = buildLoopingItems(
    TRANSFORMATION_TESTIMONIALS,
    8,
  );
  const ctaHref = "/funnels/glp-1";

  return (
    <section className="bg-[#f4f5f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1340px] px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-start  md:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl md:text-4xl lg:text-5xl">
                2000+ members.
              </h2>
              <div className="flex -space-x-2">
                {[
                  "/photoroom-6.png",
                  "/photoroom-4.png",
                  "/photoroom-3.png",
                  "/photoroom-2.png",
                ].map((src) => (
                  <span
                    key={src}
                    className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-[#eef0f8] sm:h-9 sm:w-9 md:h-11 md:w-11"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover object-center"
                    />
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-1 font-playfair text-2xl italic font-medium tracking-tight text-[#6d6ffc] sm:text-3xl md:text-4xl lg:text-5xl">
              Life-changing results
            </p>
          </div>

          <div className="flex w-full flex-col items-center justify-center md:w-auto md:items-end my-auto">
            <Link
              href={ctaHref}
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-slate-950 px-10 py-4 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 sm:w-auto"
            >
              See what&apos;s possible for you
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
            <p className="mt-3 w-full text-center text-sm text-gray-700">
              <span className="text-inherit font-semibold">
                Take 90 seconds ·
              </span>{" "}
              100% private · free
            </p>
          </div>
        </div>

        <div className="mb-6 flex gap-3">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-100 md:h-11 md:w-11"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-100 md:h-11 md:w-11"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          containScroll: false,
          loop: carouselTransformations.length > 1,
          duration: 34,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 items-stretch md:-ml-6">
          {carouselTransformations.map((person, index) => (
            <CarouselItem
              key={`${person.name}-${index}`}
              className="basis-[88%] pl-4 sm:basis-[60%] md:pl-6 lg:basis-[36%] xl:basis-[32%]"
            >
              <article className="flex h-full flex-col rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm md:p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1rem] bg-gray-100">
                    <img
                      src={person.before}
                      alt={`${person.name} before`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1rem] bg-gray-100">
                    <img
                      src={person.after}
                      alt={`${person.name} after`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-5 text-center text-lg font-medium text-gray-700 md:text-xl">
                  {person.name} lost{" "}
                  <span className="font-semibold text-[#00a86b]">
                    {person.weightLoss} lbs
                  </span>
                </p>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#4d5160] md:text-sm">
                  <BadgeCheck className="h-4 w-4 text-[#00a86b]" />
                  <span>Verified HealSend Members</span>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function MemberResultsStatsSection() {
  const memberStats = [
    {
      label: "Faster results",
      value: "2x",
      description:
        "Remedy members lose weight twice as fast as the industry average within 90 days.",
      icon: TrendingUp,
    },
    {
      label: "Avg. weight loss",
      value: "-14 lbs",
      description: "Average weight loss within 90 days of starting Remedy's program.",
      icon: ArrowRight,
    },
    {
      label: "Success rate",
      value: "94.6%",
      description: "of Remedy members lose 5% or more of their body weight on treatment.",
      icon: BadgeCheck,
    },
    {
      label: "Member retention",
      value: "91%",
      description: "of Remedy members stay past 90 days.",
      icon: Star,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-50 py-10 text-gray-700 md:py-14">
      <img
        src="/images/articles/liquid-bubbles-desktop.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full object-cover object-top md:block"
      />
      <div className="absolute inset-0 bg-[#f4f5f9]/35" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="border border-[#d7e0ee]/80 bg-white/15 p-5 md:p-8">
          <div className="grid items-start gap-6 lg:grid-cols-[0.92fr_1.58fr]">
            <div className="p-2 md:pr-5">
              <p className="font-medium text-balance font-title text-4xl  tracking-[-0.01em] text-gray-950">
                Why members start and stay
              </p>
              <h3 className="mt-2 text-3xl font-playfair italic tracking-tight text-balance text-[#5b3cdd] md:text-4xl">
                with Remedy.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                <span className="font-semibold">
                  8 out of 10 members lose 14+ lbs in 90 days*
                </span>
                <br />
                Join 250,000+ members nationwide achieving their weight loss
                goals.
              </p>
            </div>

            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {memberStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.label}
                      className="min-h-[178px] rounded-[1rem] border border-[#dfe5f1] bg-white p-5 shadow-[0_8px_22px_-16px_rgba(24,39,75,0.35)]"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                          {item.label}
                        </p>
                        <Icon className="h-4 w-4 text-gray-400" strokeWidth={1.9} />
                      </div>
                      <p className="text-4xl font-bold tracking-tight text-gray-950 md:text-[3.35rem]">
                        {item.value}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
              <p className="mt-5 text-[10px] leading-relaxed text-gray-600 md:text-[11px]">
                Based on self-reported data from approximately 300,000 Remedy Meds
                members on a personalized treatment plan, including compounded GLP-1
                medications and consultations with medical professionals, compared to
                outcomes reported for GLP-1 medications alone in Rodrigues F., et al.
                (2024). "Semaglutide vs Tirzepatide for Weight Loss in Adults with
                Overweight or Obesity." JAMA Internal Medicine. Members reported
                their weight on their initial medical intake questionnaire and every
                3-4 weeks thereafter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BMICalculatorPreviewSection() {
  const previewAvatars = [
    "/photoroom-6.png",
    "/photoroom-4.png",
    "/photoroom-3.png",
    "/photoroom-2.png",
    "/noelle_after.webp",
    "/morgan_after.webp",
  ];

  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="max-w-[72rem]">
          <h2 className="font-title text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#101726] sm:text-[3.1rem] lg:text-[4.25rem]">
            Find out what you could lose{" "}
            <span className="font-playfair italic text-[#5d62f3]">with HealSend.</span>
          </h2>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,0.95fr)_minmax(0,0.9fr)]">
          <article className="rounded-[1rem] border border-[#edf1f7] bg-white p-6 shadow-[0_18px_34px_rgba(20,24,34,0.08)] md:p-8">
            <p className="text-center text-[1.15rem] font-medium tracking-[-0.03em] text-[#121726] md:text-[1.25rem]">
              Check your eligibility.
            </p>

            <div className="relative mx-auto mt-8 h-[210px] w-[260px]">
              <svg viewBox="0 0 280 170" className="h-full w-full overflow-visible">
                <path
                  d="M 25 150 A 115 115 0 0 1 255 150"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 25 150 A 115 115 0 0 1 255 150"
                  fill="none"
                  stroke="url(#bmiGradientPreview)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="275 361"
                  strokeDashoffset="0"
                />
                <defs>
                  <linearGradient id="bmiGradientPreview" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6db1ff" />
                    <stop offset="50%" stopColor="#91e2a8" />
                    <stop offset="78%" stopColor="#ffd34d" />
                    <stop offset="100%" stopColor="#ff845b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-x-0 bottom-6 text-center">
                <div className="font-title text-[4.6rem] font-semibold leading-none tracking-[-0.06em] text-[#0b1020]">
                  30.1
                </div>
                <div className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-[#7a859c]">
                  Your BMI
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-[1rem] font-medium text-[#313948]">
                  Height
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-4 py-3">
                    <span className="w-full text-[1.02rem] text-[#172030]">5</span>
                    <span className="text-[1.02rem] font-medium text-[#68748f]">ft</span>
                  </div>
                  <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-4 py-3">
                    <span className="w-full text-[1.02rem] text-[#172030]">10</span>
                    <span className="text-[1.02rem] font-medium text-[#68748f]">in</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[1rem] font-medium text-[#313948]">
                  Weight
                </label>
                <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-4 py-3">
                  <span className="w-full text-[1.02rem] text-[#172030]">210</span>
                  <span className="text-[1.02rem] font-medium text-[#68748f]">lbs</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="hs-solid-btn mt-8 inline-flex min-h-[3.4rem] w-full items-center justify-center gap-2 rounded-full px-8 text-[1.02rem] font-semibold"
            >
              See my BMI eligibility
              <ArrowRight className="h-4 w-4" />
            </button>
          </article>

          <article className="overflow-hidden rounded-[1rem] border border-[#edf1f7] bg-white shadow-[0_18px_34px_rgba(20,24,34,0.08)]">
            <div className="relative h-full min-h-[720px]">
              <Image
                src="/photoroom-4.png"
                alt="Happy HealSend member"
                fill
                sizes="(max-width: 1280px) 100vw, 32vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.88)_44%,rgba(255,255,255,1)_100%)] px-6 pb-5 pt-24">
                <div className="flex justify-center">
                  <div className="flex -space-x-2.5">
                    {previewAvatars.map((src) => (
                      <span
                        key={src}
                        className="relative h-10 w-10 overflow-hidden rounded-full border-[3px] border-white bg-[#edf1f8]"
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover object-center"
                        />
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mx-auto mt-4 max-w-[22rem] text-center text-[0.98rem] leading-7 text-[#4e5a73]">
                  Over <span className="font-semibold text-[#141c2b]">250,000</span>{" "}
                  members treated. <span className="font-semibold text-[#141c2b]">94.6%</span>{" "}
                  success backed by real HealSend member progress nationwide.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1rem] border border-[#edf1f7] bg-white p-8 shadow-[0_18px_34px_rgba(20,24,34,0.08)]">
            <div className="text-center">
              <p className="text-[1.3rem] font-medium leading-[1.2] tracking-[-0.03em] text-[#121726]">
                Your projected
                <br />
                weight loss
              </p>

              <div className="mt-10">
                <span className="font-title text-[5.7rem] font-semibold leading-none tracking-[-0.08em] text-[#0b1020]">
                  50
                </span>
                <span className="ml-2 text-[3.25rem] font-medium tracking-[-0.04em] text-[#66748f]">
                  lbs
                </span>
              </div>

              <p className="mx-auto mt-7 max-w-[19rem] text-[0.98rem] leading-7 text-[#4f5c76]">
                Based on <span className="font-semibold text-[#121726]">250,000+</span>{" "}
                average HealSend member results in guided weight-loss care.
              </p>
            </div>

            <div className="mt-10 border-t border-[#d9e1ef] pt-9">
              <p className="text-center text-[1.02rem] font-medium text-[#20283a]">
                Starting weight
              </p>
              <div className="mx-auto mt-4 flex max-w-[10.5rem] items-end justify-center gap-1 rounded-[0.9rem] bg-[#f2f5fa] px-5 py-4">
                <span className="font-title text-[3.2rem] font-semibold leading-none tracking-[-0.06em] text-[#48536b]">
                  334
                </span>
                <span className="mb-1 text-[1.15rem] font-medium text-[#68748f]">
                  lbs
                </span>
              </div>

              <div className="mt-12">
                <div className="relative h-4 rounded-full bg-[#dfe5f4]">
                  <div className="absolute inset-y-0 left-0 w-[74%] rounded-full bg-[#5d62f3]" />
                  <div className="absolute left-[calc(74%-14px)] top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border-2 border-[#4b55eb] bg-white shadow-[0_10px_20px_rgba(93,98,243,0.18)]" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function ResearchSplit({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const researchImage =
    productData.researchSection?.title?.includes("NAD+")
      ? "/images/articles/blogs/female.jpg"
      : productData.researchSection.image;

  return (
    <section className="bg-[#f9f9f9] px-4 py-16 md:px-8 md:py-20 lg:px-16">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 relative aspect-square overflow-hidden rounded-[2rem] lg:order-1 lg:aspect-[4/4.5]">
          <img
            src={researchImage}
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
    <section className="bg-[#f4f5f9] py-16 md:py-20">
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
              className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white px-6 pt-7 shadow-sm"
            >
              <h3 className="mb-5 min-h-[56px] pr-2 text-[1.4rem] font-bold leading-[1.3] text-[#1c1d20]">
                {step.title}
              </h3>

              <div className="mb-5 h-px w-full bg-gray-100/80" />

              <div className="relative z-10 mb-5 flex items-start gap-4">
                <div className="flex w-14 shrink-0 flex-col items-center">
                  <span className="mb-1 text-[0.75rem] font-bold tracking-[0.15em] text-[#8a8d98]">
                    STEP
                  </span>
                  <span className="text-center text-[3.3rem] font-extrabold leading-none text-[#1c1d20]">
                    {step.step}
                  </span>
                </div>
                <p className="pt-0.5 text-[1.05rem] leading-[1.6] text-[#4a4d57]">
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

      <section className="bg-[#f9f9f9] px-4 py-16 md:px-8 md:py-20 lg:px-16">
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
                <img
                  src={content.image}
                  alt="Lab tested medications"
                  className="h-full w-full object-cover"
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
    <section className="bg-[#f9f9f9] py-16 md:py-20">
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
          <div className="mb-12 flex flex-col items-center text-center">
            <Image
              src="/logo.png"
              alt={content.introLabel || "HealSend"}
              width={220}
              height={68}
              className="mb-6 h-12 w-auto md:h-14"
              priority
            />
            <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-700 md:text-xl">
              {content.introText}
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-sm"
              >
                <div className="flex items-center justify-center gap-1.5 bg-[#7b75f0] py-2 text-xs font-bold text-white">
                  Included <PlusCircle className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-1 items-center gap-4 p-6 lg:gap-6 lg:p-8">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-4 whitespace-pre-line text-xl font-bold leading-tight text-[#7b75f0]">
                      {feature.title}
                    </h3>
                    <ul className="space-y-3">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#7b75f0]" />
                          <span className="text-sm leading-relaxed text-gray-600 lg:text-base">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center sm:h-36 sm:w-36 lg:h-40 lg:w-40">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
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
  const items =
    productData.cleanIngredients?.length > 0
      ? productData.cleanIngredients
      : mergeIconItems(
        defaultProductContent.cleanIngredients,
        defaultProductContent.cleanIngredients,
      );

  return (
    <section className="relative bg-[#F9F9F9] py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-4xl">
          Clean, simple, and effective
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.text || item.name}
              className="flex flex-col items-center justify-center rounded-[1.25rem] bg-white p-6 text-center shadow-sm transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:shadow-md"
            >
              <div className="mb-5 flex h-20 w-20 items-center justify-center">
                {item.iconImage ? (
                  <img
                    src={item.iconImage}
                    alt=""
                    aria-hidden="true"
                    className={`object-contain ${item.iconImage.includes("fast-free-delivery")
                      ? "h-30 w-20"
                      : "h-19 w-16"
                      }`}
                  />
                ) : (
                  <item.icon
                    className="h-9 w-9 text-[#1c1a24]"
                    strokeWidth={1.75}
                  />
                )}
              </div>
              <p className="whitespace-pre-line text-[13px] font-bold leading-snug text-[#1c1a24]">
                {item.text || item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    question: "Which states do you serve for GLP-1 treatment?",
    answer:
      "HealSend clinicians are licensed to treat patients in all 50 U.S. states. After your intake, your plan is matched to a clinician licensed in your state so prescribing and follow-up care stays compliant with local rules.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "HealSend's GLP-1 program is cash-pay, so you don't deal with insurance approvals or surprise denials. Your monthly price is what you see on the plan card — no hidden fees. HSA and FSA cards are accepted at checkout.",
  },
  {
    question: "What medications do HealSend clinicians prescribe?",
    answer:
      "Our clinicians prescribe compounded Semaglutide and Tirzepatide injections. The right molecule, dose, and titration schedule are decided after your clinician review based on your goals, history, and any tolerance considerations.",
  },
  {
    question: "Does the price stay the same as my dose increases?",
    answer:
      "Yes. The plan price you sign up at is the same price across every titration step. As your clinician moves you up to a higher dose, your monthly cost doesn't increase — so dose adjustments stay focused on your response, not your bill.",
  },
  {
    question: "Does my plan include the prescription and the medication itself?",
    answer:
      "Yes. Your monthly plan covers the clinician visit, the prescription, the compounded medication, supplies for self-administration, and free expedited shipping to your door. Ongoing follow-up messaging with your care team is included too.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const ctaHref = "/funnels/glp-1";

  return (
    <section className="relative bg-[#F7F7F8] rounded-t-[32px] -mt-7 py-12 md:!pt-20 md:!pb-10 md:py-20 md:mt-0">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-4xl font-medium text-slate-900 md:text-5xl text-balance font-title">
          Your questions. <span className="italic font-playfair text-[#6d6ffc]">Honest answers.</span>
        </h2>
        <p className="mb-16 text-start text-sm text-gray-600  max-w-lg">
          Everything you want to know before getting started. And remember when you start your plan, you will have access to learning tutorials & unlimited access to clinicians for virtual consults or support.
        </p>

        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-[1.25rem] bg-[#FFFFFF] shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-7 py-7 gap-6 text-left md:px-10 md:py-9"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-lg font-bold text-gray-900 md:text-xl">
                    {item.question}
                  </span>
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-[#333333] p-1.5 md:p-2">
                    {isOpen ? (
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
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-7 pb-7 text-base leading-relaxed text-gray-600 md:px-10 md:pb-9 md:text-lg">
                        {item.answer}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ctaHref}
            className="hs-solid-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto"
          >
            Get started
          </Link>
          <Link
            href={ctaHref}
            className="hs-outline-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto"
          >
            See if you&apos;re eligible
          </Link>
        </div>
      </div>
    </section>
  );
}

const SAME_MED_HEALSEND_POINTS = [
  "Personalized, clinically-proven GLP-1 plans",
  "Expert-led education with an active member community",
  "Treatment precisely matched to your body and goals",
  "Doses titrated by your clinician to minimize side effects",
  "Unlimited video calls and messaging with your clinician",
  "100% online. Free, discreet shipping.",
];

const SAME_MED_OTHERS_POINTS = [
  "Generic, fixed plans you have to adapt to",
  "No education, no nutrition support, no community",
  "Same dose for everyone, basic diagnosis protocols",
  "Side effects handled reactively, not proactively",
  "No follow-up after your prescription ships",
  "Pharmacy lines, long waits, no guarantees",
];

function SameMedicationSection() {
  return (
    <section className="bg-slate-100 py-12 md:py-20">
      <div className="container mx-auto max-w-screen-md space-y-10 px-4 md:space-y-14 md:px-8">
        <div className="space-y-2 text-center">
          <h2 className="font-title text-4xl font-bold tracking-tight text-gray-950 md:text-6xl">
            Same medication.
          </h2>
          <p className="font-playfair text-3xl italic text-[#5b3cdd] md:text-5xl">
            Very different experience.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-8">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-gradient-to-b from-[#15204a] to-[#2a3360] px-4 py-8 text-center text-white md:px-6 md:py-10">
            <img
              src="/images/marketing/glp1-hero-merged.png"
              alt="HealSend GLP-1 medications"
              loading="lazy"
              className="h-28 w-auto object-contain md:h-40"
            />
            <div className="font-playfair text-2xl italic md:text-3xl">
              HealSend
            </div>
            <ul className="w-full space-y-8">
              {SAME_MED_HEALSEND_POINTS.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col items-center gap-3 px-1"
                >
                  <span className="text-sm font-semibold leading-snug md:text-base">
                    {point}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#22c55e]">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-6 rounded-2xl bg-white px-4 py-8 text-center md:px-6 md:py-10">
            <img
              src="/images/marketing/others.webp"
              alt="Other providers' medications"
              loading="lazy"
              className="h-28 w-auto object-contain md:h-40"
            />
            <div className="text-2xl font-medium text-[#5f5b70] md:text-3xl">
              Others
            </div>
            <ul className="w-full space-y-8">
              {SAME_MED_OTHERS_POINTS.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col items-center gap-3 px-1"
                >
                  <span className="text-sm leading-snug text-[#5f5b70] md:text-base">
                    {point}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#cdd0d8]">
                    <Minus className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportAvailabilitySection() {
  return (
    <section className="bg-white px-5 pb-20 pt-4 md:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="overflow-hidden rounded-[1rem] bg-[#f2f5fb] shadow-[0_18px_34px_rgba(18,26,42,0.08)]">
          <div className="relative aspect-[1.08/1]">
            <Image
              src="/images/articles/care-support-lifestyle.webp"
              alt="HealSend care support"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="max-w-[34rem] lg:justify-self-center">
          <h2 className="font-headline text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#111621] sm:text-[3rem] lg:text-[3.7rem]">
            We&apos;re here when
            <br />
            <span className="italic text-[#5d62f3]">You need us.</span>
          </h2>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7deeb] text-[#30394d]">
                <Clock3 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.98rem] font-medium text-[#626b7f]">
                  Always available
                </p>
                <p className="mt-1 text-[1.28rem] font-semibold leading-[1.22] text-[#434b5d]">
                  7 days a week · 8:00am - 8:00pm ET
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7deeb] text-[#30394d]">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.98rem] font-medium text-[#626b7f]">
                  Care-team messaging and virtual follow-up
                </p>
                <p className="mt-1 text-[1.28rem] font-semibold leading-[1.22] text-[#434b5d]">
                  Secure support inside your HealSend account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7deeb] text-[#30394d]">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.98rem] font-medium text-[#626b7f]">
                  Email us
                </p>
                <a
                  href="mailto:yourhealth@healsend.com"
                  className="mt-1 inline-block text-[1.28rem] font-semibold leading-[1.22] text-[#434b5d] underline decoration-[#aeb7ca] underline-offset-4"
                >
                  yourhealth@healsend.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileStickyCta({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
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
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${visible
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
      <MinimalMarketingNavbar />
      <WillpowerSection />
      <ProductHero productData={productData} />
      {/* <FeatureSplit productData={productData} /> */}
      <MediaLogosBanner />
      <FadeInSection><MedicalWeightLossSection productData={productData} /></FadeInSection>
      <FadeInSection><PricingSection productData={productData} /></FadeInSection>
      <FadeInSection><NegativeSellSection /></FadeInSection>
      <FadeInSection><BenefitsCarousel productData={productData} /></FadeInSection>
      <FadeInSection><SupportFeatures productData={productData} /></FadeInSection>
      <FadeInSection><TestimonialsSection /></FadeInSection>
      <FadeInSection><MemberResultsStatsSection /></FadeInSection>
      <FadeInSection><BMICalculatorPreviewSection /></FadeInSection>
      <FadeInSection><ResearchSplit productData={productData} /></FadeInSection>
      <FadeInSection><SimpleSteps productData={productData} /></FadeInSection>
      <FadeInSection><LabTested productData={productData} /></FadeInSection>
      <FadeInSection><ComprehensiveCare productData={productData} /></FadeInSection>
      <FadeInSection><CleanSimpleEffective productData={productData} /></FadeInSection>
      <FadeInSection><SameMedicationSection /></FadeInSection>
      <FadeInSection><FAQSection /></FadeInSection>
      <FadeInSection><SupportAvailabilitySection /></FadeInSection>
      {/* <ProductPageTestSections /> */}
      <MarketingFooter />
      <MobileStickyCta productData={productData} />
    </div>
  );
}
