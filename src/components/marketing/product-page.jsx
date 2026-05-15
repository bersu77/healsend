"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Apple,
  ArrowRight,
  Ban,
  BadgeCheck,
  Check,
  Clock3,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Droplet,
  FlaskConical,
  Headset,
  Hourglass,
  Laptop,
  ClipboardList,
  Minus,
  Mail,
  Phone,
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
  TrendingDown,
  TrendingUp,
  TreePine,
  Truck,
  Users,
  Wheat,
  X,
  Zap,
} from "lucide-react";
import {
  ActiveMembersBanner,
  MarketingFooter,
  MinimalMarketingNavbar,
  MARKETING_ROUTES,
  TrustBadgesRow,
} from "@/components/marketing/shared";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { productContent as defaultProductContent } from "@/components/marketing/product-content";
import { WORDPRESS_MARKETING_IMAGES } from "@/lib/marketing-images";
import {
  getMarketingProductDetailPath,
  getProductOnboardingPath,
} from "@/lib/product-routing";
import { formatUsdCompact } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

export function FadeInSection({ children, delay = 0, y = 48, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
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
];

/** HealSend consultation/marketing portraits — overlapping stack (Willpower stat + testimonials header). */
const MEMBER_FACE_STACK_IMAGE_SRCS = [
  "https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?auto=format&fit=facearea&facepad=2&w=96&q=80",
  "/images/4_Home_Doctors_Online_Consultation-Doctors_04.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Avatar.jpg",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=96&q=80",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=facearea&facepad=2&w=96&q=80",
  "/images/4_Home_Doctors_Online_Consultation-Testimonials_02.jpg",
];

const MEMBER_FACE_STACK_IMAGE_SRCS_SIX = [
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&facepad=2&w=96&q=80",
  "/images/4_Home_Doctors_Online_Consultation-Doctors_04.jpg",
  "https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?auto=format&fit=facearea&facepad=2&w=96&q=80",
  "/images/4_Home_Doctors_Online_Consultation-Testimonials_02.jpg",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=96&q=80",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=facearea&facepad=2&w=96&q=80",
  "/images/4_Home_Doctors_Online_Consultation-Avatar.jpg",
  "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=facearea&facepad=2&w=96&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=facearea&facepad=2&w=96&q=80",
];

export function MediaLogosBanner() {
  const copies = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#5b3cdd] py-6">
      <div className="flex min-w-max animate-[mediaLogoScroll_50s_linear_infinite]" style={{ width: "max-content" }}>
        {copies.map((copy) => (
          <div
            key={copy}
            aria-hidden={copy > 0 ? true : undefined}
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
  src:
    typeof filename === "string" && filename.startsWith("/")
      ? encodeURI(filename)
      : `/images/slider/${encodeURI(filename)}`,
  alt: "HealSend member",
  heightClass: SLIDER_HEIGHTS[index % SLIDER_HEIGHTS.length],
  objectClass: "object-cover object-center",
  bgClass: SLIDER_BGS[index % SLIDER_BGS.length],
});

export const WILLPOWER_LEFT_MARQUEE_ITEMS = [
  "/images/add.png",
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

export const WILLPOWER_RIGHT_MARQUEE_ITEMS = [
  "/images/addslider.jpg",
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

export function WillpowerVerticalColumn({ items, reverse = false }) {
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

export function WillpowerHorizontalRow({ items, reverse = false }) {
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
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-6 md:px-[3.25rem] md:py-10 lg:h-[calc(100dvh-60px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
        {/* Same 55% / 45% (+ xl 450px) split as ProductHero so the right column lines up down the page */}
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <div className="mt-3 max-w-[34rem]">
              <ActiveMembersBanner />
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

            <div className="mt-5 w-full">
              {/* Left-align the cluster (matches body copy edge); trust line stays centered under the pill */}
              <div className="inline-flex w-full max-w-full flex-col items-center gap-2.5 sm:w-auto">
                <Link
                  href="/funnels/glp-1"
                  className="hs-solid-btn inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold sm:w-auto"
                >
                  Get my personalized plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="w-full text-center text-sm">
                  <span className="font-semibold text-gray-700">Takes 90 seconds</span> · <span className="text-gray-500">100% private · free</span>
                </p>
              </div>
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
        <div className="relative hidden min-h-0 w-full shrink-0 overflow-hidden lg:block lg:h-full lg:w-[45%] lg:self-stretch xl:w-[450px]">
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
    <section className="bg-white py-10 md:py-14">
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

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {NEGATIVE_SELL_CARDS.map((card) => (
            <div
              key={card.title}
              className="w-[75vw] shrink-0 snap-start sm:w-auto sm:shrink flex flex-col overflow-hidden rounded-[1.5rem] border border-[#ebebeb] bg-white shadow-sm"
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
    imageClass: "h-full w-full object-contain object-bottom",
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
    "Most wellness programs stop at product access. HealSend pairs your treatment with clinician guidance, support, and ongoing care.",
  ctaText: "Lose Fat Now",
  features: [
    {
      title: "Unlimited Access to Clinicians",
      points: [
        "See a licensed clinician same-day",
        "Unlimited visits, all online",
      ],
      image: "/images/clean/Gemini_Generated_Image_pmzg64pmzg64pmzg-removebg-preview.png",
      imageClass:
        "absolute bottom-0 right-6 h-30 w-32 object-contain md:h-35s md:w-40",
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
      title: "Member Community & Platform",
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
  if (!productData) return null;
  return productData.slug || productData.id;
}

export function getPrimaryCtaHref(productData) {
  return (
    getProductOnboardingPath(getProductSlug(productData)) ||
    productData?.primaryCta?.href ||
    MARKETING_ROUTES.nad
  );
}

function hasNumericPrice(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function getPricePresentation(productData) {
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

// /** Default slides when a Tirzepatide PDP has no CMS `benefitsCarousel` (avoid NAD+ fallback). */
// const TIRZEPATIDE_BENEFITS_CAROUSEL = [
//   {
//     text: "TRT (Testosterone Injections)",
//     image: "/images/articles/wmremove-transformed-2%20(1).jpeg",
//     alt: "TRT Testosterone Injections",
//     description: [
//       "Boosts energy and overall daily vitality",
//       "Supports lean muscle growth efficiently naturally",
//       "Enhances mood, focus, and mental clarity",
//       "Promotes healthy libido and hormone balance",
//     ],
//     ctaHref: "/trt",
//   },
//   {
//     text: "Enclomiphene",
//     image: "/images/marketing/enclomiphene.png",
//     alt: "Enclomiphene therapy",
//     description: [
//       "Boosts energy and overall daily vitality",
//       "Supports lean muscle growth efficiently naturally",
//       "Enhances mood, focus, and mental clarity",
//       "Promotes healthy libido and hormone balance",
//     ],
//     ctaHref: "/enclomiphene",
//   },
//   {
//     text: "GHRH Peptide Therapy",
//     image: "/images/marketing/bundle/cjc-1295-ipamorelin-product.png",
//     alt: "GHRH peptide therapy",
//     description: [
//       "Stimulates natural growth hormone production for vitality",
//       "Enhances muscle recovery and rapid tissue repair",
//       "Improves deep sleep quality and cognitive function",
//       "Boosts metabolism and fat-burning efficiency",
//     ],
//   },
//   {
//     text: "Wolverine Blend Healing Peptide Protocol",
//     image: "/images/wmremove-transformed-3-1%20(1).jpeg",
//     alt: "Wolverine Blend Healing Peptide Protocol",
//     description: [
//       "Relieves persistent joint pain and muscle soreness",
//       "Accelerates healing of tendons and ligaments",
//       "Reduces systemic inflammation for faster recovery",
//       "Supports targetness and overall structural health",
//     ],
//   },
//   {
//     text: "Glow Blend",
//     image: "/images/articles/med1.webp",
//     alt: "Glow Blend skincare peptide",
//     description: [
//       "Promotes youthful skin through collagen production",
//       "Reduces fine lines and improves skin texture",
//       "Accelerates wound healing and skin repair",
//       "Enhances hair follicle health and thickness",
//     ],
//   },
//   {
//     text: "Sermorelin",
//     image: "/images/home/reference/nad-cellular-energy.jpeg",
//     alt: "Sermorelin growth hormone therapy",
//     description: [
//       "Stimulates natural growth hormone release for anti-aging",
//       "Improves body composition by reducing fat and building lean muscle",
//       "Enhances deep restorative sleep and overnight recovery",
//       "Supports stronger immune function and cellular repair",
//     ],
//   },
//   {
//     text: "Tesamorelin",
//     image: "/images/marketing/bundle/strength-lifestyle.jpg",
//     alt: "Tesamorelin peptide therapy",
//     description: [
//       "Targets and reduces stubborn visceral abdominal fat",
//       "Boosts growth hormone levels without disrupting natural rhythms",
//       "Supports improved cognitive function and mental sharpness",
//       "Promotes healthier lipid profiles and metabolic markers",
//     ],
//     ctaText: "Get Started",
//   },
// ];

const TIRZEPATIDE_BENEFITS_CAROUSEL = [
  {
    text: "Combines GLP-1 & GIP hormones for superior fat loss results",
    image: "/images/articles/wmremove-transformed-2%20(1).jpeg",
    alt: "Dual-action Tirzepatide support",
  },
  {
    text: "Supports stronger appetite control and fewer food cravings",
    image: "/images/wmremove-transformed-4-1%20(1).jpeg",
    alt: "Improved appetite control",
  },
  // {
  //   text: "Built for consistent weekly progress with clinician-guided dosing",
  //   image: "/images/4_Home_Doctors_Online_Consultation-Doctors_04.jpg",
  //   alt: "Clinician-guided Tirzepatide plan",
  // },
  {
    text: "Helps improve metabolic markers alongside sustainable weight loss",
    image: "/images/wmremove-transformed-3-1%20(1).jpeg",
    alt: "Metabolic health benefits",
  },
  {
    text: "A strong option when you need next-level support beyond basics",
    image: "/images/articles/med1.webp",
    alt: "Support beyond basics for your weight-loss journey",
    ctaText: "Get Started",
  },
];
/** Research split for Tirzepatide PDPs (avoids NAD+ placeholder from default product content). */
const TIRZEPATIDE_SURMOUNT_RESEARCH_SECTION = {
  title: "Results from SURMOUNT Clinical Trials",
  points: [
    "Adults without diabetes lost up to 22.5% of body weight in 72 weeks.",
    "Adults with type 2 diabetes lost 12–15% of their weight.",
    "Combining tirzepatide with lifestyle programs leads to even stronger outcomes.",
  ],
};

function productLooksLikeTirzepatide(p) {
  const blob = `${p?.slug ?? ""} ${p?.id ?? ""} ${p?.name ?? ""}`.toLowerCase();
  return (
    blob.includes("tirzepatide") ||
    blob.includes("zepbound") ||
    (blob.includes("glp") && blob.includes("inject"))
  );
}

/** SURMOUNT trial copy applies to tirzepatide-class products only (not semaglutide). */
function productShouldUseSurmountResearch(p) {
  const blob = `${p?.slug ?? ""} ${p?.id ?? ""} ${p?.name ?? ""}`.toLowerCase();
  return (
    blob.includes("tirzepatide") ||
    blob.includes("mounjaro") ||
    blob.includes("zepbound")
  );
}

/** Show Tirzepatide / GLP-1-style benefits carousel (not NAD+ skin-care style PDPs). */
function showWeightLossBenefitsCarousel(p, isHomepage) {
  if (isHomepage) return true;
  const blob = `${p?.slug ?? ""} ${p?.id ?? ""} ${p?.name ?? ""}`.toLowerCase();
  if (productLooksLikeTirzepatide(p)) return true;
  if (blob.includes("semaglutide") || blob.includes("wegovy") || blob.includes("ozempic"))
    return true;
  if (blob.includes("mounjaro")) return true;
  if (blob.includes("weight") && blob.includes("loss")) return true;
  if (blob.includes("glp")) return true;
  return false;
}

/** Prev/next: identical default style (no permanent filled “next” accent), square hit target at any zoom. */
const benefitCarouselNavButtonClassName =
  "inline-flex size-11 shrink-0 aspect-square items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-700 shadow-none transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/80 focus-visible:ring-offset-2";

export function mergeProductContent(product) {
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
    benefitsCarouselTitle: product.benefitsCarouselTitle ||
      (productLooksLikeTirzepatide(product)
        ? (product?.name || "").toLowerCase().includes("inject")
          ? "What are the benefits of Tirzepatide Injections?"
          : "What Are the Benefits of Tirzepatide?"
        : `What are the benefits of ${product.name || defaultProductContent.name}?`),
    benefitsCarousel:
      product.benefitsCarousel?.length > 0
        ? product.benefitsCarousel
        : productLooksLikeTirzepatide(product)
          ? TIRZEPATIDE_BENEFITS_CAROUSEL
          : defaultProductContent.benefitsCarousel,
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
    researchSection: productShouldUseSurmountResearch(product)
      ? {
        ...defaultProductContent.researchSection,
        ...product.researchSection,
        ...TIRZEPATIDE_SURMOUNT_RESEARCH_SECTION,
        /* Editorial slice: member portrait — do not inherit catalog product hero (vial). */
        image: "/images/female-removebg-preview.png",
      }
      : {
        ...defaultProductContent.researchSection,
        ...product.researchSection,
      },
  };
}

export function ProductHero({ productData, isHomepage: _isHomepage = false }) {
  const [activeTab, setActiveTab] = useState("benefits");
  const [openFaq, setOpenFaq] = useState(null);
  const [showPriceFootnote, setShowPriceFootnote] = useState(false);
  const ctaHref = getPrimaryCtaHref(productData);
  const pricePresentation = getPricePresentation(productData);
  const relatedProducts = productData.relatedProducts || [];

  return (
    <section className="bg-[#f9f9f9] px-4 pb-10 pt-6 md:px-[3.25rem] md:pb-14 md:pt-8 lg:px-[3.25rem]">
      <div className="mx-auto flex max-w-[1340px] flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6 xl:gap-8">
        {/* Tall right column stretches this cell; sticky block pins until section scrolls past */}
        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[55%] lg:max-w-[740px]">
          {/* Isolate + chunky gap + header shrink-0: avoids title/visual bleed onto image at fractional zoom */}
          <div className="flex flex-col gap-6 sm:gap-7 md:gap-10 lg:isolate lg:sticky lg:top-24 lg:z-10">
            <div className="relative z-[1] shrink-0 bg-[#f9f9f9] pb-1">
              <h1 className="text-balance text-start text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-5xl md:leading-tight">
                {productData.name}
              </h1>
            </div>
            <div className="relative z-0 flex aspect-[4/5] w-full shrink-0 items-start justify-start overflow-hidden rounded-[1rem] bg-[#f9f9f9] ring-1 ring-black/[0.04]">
              <div className="flex h-full min-h-0 w-full flex-1 items-stretch justify-stretch">
                <div className="relative h-full min-h-0 w-full">
                  {productData.inStock ? (
                    <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] md:left-5 md:top-5 md:px-6 md:py-2.5 md:text-base">
                      <div className="relative h-2.5 w-2.5 md:h-3 md:w-3">
                        <span className="absolute inset-0 rounded-full bg-emerald-400/40 blur-[3px]" />
                        <span className="absolute inset-0 rounded-full bg-emerald-500" />
                      </div>
                      In Stock
                    </div>
                  ) : null}
                  <img
                    src="/images/marketing/instock.jpeg"
                    alt={`${productData.name} — in stock`}
                    className="h-full w-full rounded-2xl object-cover object-bottom object-right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[45%] xl:w-[450px]">
          <div className="mb-6 overflow-hidden rounded-[1rem] border border-gray-200 bg-white">
            {pricePresentation.savings ? (
              <div className="flex items-center justify-center gap-2 bg-[#fde073] px-5 py-3.5 text-sm font-medium text-gray-900 md:text-base">
                <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
                FSA &amp; HSA Eligible
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 bg-[#fde073] px-5 py-3.5 text-sm font-medium text-gray-900 md:text-base">
                <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
                FSA &amp; HSA Eligible
              </div>
            )}
            <div className="px-6 py-6 md:px-7 md:py-7">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div className="min-w-0 shrink">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 md:text-4xl">
                      $0
                    </span>
                    <span className="text-lg font-medium text-gray-800 md:text-xl">
                      first month
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPriceFootnote((v) => !v)}
                    aria-expanded={showPriceFootnote}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 md:text-base"
                  >
                    then $299/mo*
                  </button>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
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

              {showPriceFootnote ? (
                <div className="mb-5 rounded-[0.75rem] bg-gray-50 p-3 text-xs leading-5 text-gray-600 md:text-sm">
                  *$0 first month covers the clinician visit and initial supply
                  on eligible plans. Recurring billing of $299/month begins at
                  month two and continues until you cancel. Includes
                  medication, follow-up care, and shipping. Cancel anytime in
                  your account.
                </div>
              ) : null}

              <div className="flex w-full flex-col items-stretch gap-3">
                <Link
                  href={ctaHref}
                  className="hs-solid-btn flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold shadow-[0_8px_24px_rgba(109,111,252,0.35)] transition-colors"
                >
                  See if you qualify
                </Link>
                <p className="mt-1 w-full text-center text-xs text-gray-500 md:text-sm">
                  {pricePresentation.savings
                    ? "Discount auto-applied at checkout"
                    : "Discount auto-applied at checkout"}
                </p>
              </div>

            </div>
          </div>

          <div className="mb-6 rounded-[1rem] border border-gray-200 bg-white p-2 shadow-sm">
            <div className="mb-6 flex rounded-full bg-gray-100 p-1.5">
              {["benefits", "pricing", "description"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-full py-2.5 text-sm font-medium capitalize transition-colors ${activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="overflow-hidden px-5 pb-5 pt-2 md:px-6 md:pb-6">
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
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                          <p className="text-[0.938rem] leading-relaxed text-gray-700 md:text-base">
                            {item.text}
                          </p>
                        </div>
                      );
                    })
                    : null}

                  {activeTab === "pricing" ? (
                    <div className="space-y-8">
                      <PricingPlansTable productName="Tirzepatide Injections" />
                      <PricingPlansTable productName="Semaglutide Injections" />
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
            <div className="mt-2 flex flex-col items-center gap-2 border-t border-gray-100 px-5 pb-2 pt-4 text-center text-xs text-gray-500 md:flex-row md:items-center md:justify-between md:text-left md:px-6">
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
                <ShieldCheck className="h-4.5 w-4.5" /> FSA & HSA Eligible
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
                    <span className="text-xs font-medium text-gray-500">
                      {relatedProduct.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-5">
            <div className="rounded-[1rem] bg-gray-100 p-4 text-xs leading-relaxed text-gray-700">
              The statements on this page have not been evaluated by the Food
              and Drug Administration. This product is not intended to diagnose,
              treat, cure or prevent any disease.
            </div>

            <div className="space-y-2.5 text-[11px] leading-relaxed text-gray-600">
              <p>
                *Price shown applies to Semaglutide 12-month plan paid upfront
                or with buy now, pay later programs. Actual price will depend on
                product and plan prescribed.
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
    image: WORDPRESS_MARKETING_IMAGES.semaglutide,
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

export function MedicalPlanCard({ plan, ctaHref, spanFull, expanded, onToggleExpand, cardRef, style }) {
  const isMinimal = plan.bullets.length === 0;
  const hasDetails =
    plan.description ||
    (plan.whyItWorks && plan.whyItWorks.length > 0) ||
    (plan.bestFor && plan.bestFor.length > 0);

  return (
    <div
      ref={cardRef}
      style={style}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_40px_-24px_rgba(91,60,221,0.12)]",
        isMinimal ? "h-auto self-start w-full" : "w-full",
        spanFull && "sm:col-span-2 lg:col-span-1",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          plan.useFullImage ? "h-[222px]" : "min-h-[248px] sm:min-h-[268px] md:min-h-[288px]",
          plan.headerClass,
          plan.headerTextClass,
        )}
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
            alt=""
            aria-hidden
            loading="lazy"
            className="pointer-events-none absolute bottom-0 right-0 h-[78%] max-h-[220px] w-auto max-w-[min(46%,11.5rem)] object-contain object-bottom sm:max-h-[240px] sm:max-w-[min(48%,13rem)] md:max-h-[260px] md:max-w-[min(50%,15rem)]"
          />
        )}
        <div className="absolute inset-0 z-10 flex flex-col justify-between gap-y-5 p-6 sm:p-7 md:gap-y-6 md:p-8">
          <div className="flex max-w-[min(100%,18rem)] flex-col items-start gap-y-2 sm:max-w-[20rem]">
            {plan.badges.map((badge, i) => (
              <span
                key={badge}
                className={`rounded-lg px-2.5 py-1 text-sm font-medium leading-5 text-gray-800 ${i === 0
                  ? "bg-gradient-to-r from-white/80 to-white/50"
                  : "bg-white/50"
                  }`}
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="max-w-[min(100%,calc(100%-7.5rem))] sm:max-w-[min(100%,calc(100%-9rem))] md:max-w-[min(100%,calc(100%-10.5rem))]">
            <p className="text-2xl font-medium leading-snug tracking-tight sm:text-[1.65rem] sm:leading-snug">
              {plan.title.split("\n").map((line, idx, arr) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < arr.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </p>
            {plan.subtitle ? (
              <p className="mt-2 text-sm font-medium leading-snug sm:text-[0.9375rem] sm:leading-relaxed">
                {plan.subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-col",
          isMinimal
            ? "shrink-0 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 md:px-7 md:pb-7"
            : "flex-1 px-6 pb-7 pt-6 sm:px-7 sm:pb-8 sm:pt-7 md:px-8 md:pb-9 md:pt-8",
        )}
      >
        {!isMinimal ? (
          <>
            <p className="mb-5 text-xs font-bold uppercase tracking-wider text-[#1c1a24]">
              {plan.bulletsHeading}
            </p>
            <ul className="flex shrink-0 flex-col gap-5">
              {plan.bullets.map((bullet) => {
                const Icon = bullet.icon;
                return (
                  <li key={bullet.text} className="flex min-w-0 items-start gap-3.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1ecf9]">
                      <Icon className="h-4 w-4 shrink-0 text-[#5b3cdd]" />
                    </span>
                    <span className="text-pretty break-words text-base leading-relaxed text-gray-700 [overflow-wrap:anywhere] md:text-[1.0625rem] md:leading-relaxed">
                      {bullet.text}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 min-h-3 flex-1 shrink" aria-hidden />
            <div className="mb-6 h-px w-full bg-gray-200" />
          </>
        ) : null}

        <div
          className={cn(
            "shrink-0 flex w-full flex-col gap-3.5",
            !isMinimal && "mt-auto",
          )}
        >
          <Link
            href={ctaHref}
            className="flex min-h-[3.375rem] w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#1c1a24] px-4 py-2.5 text-center text-[13px] font-bold leading-snug tracking-tight text-white transition-colors hover:bg-[#2a2740] sm:px-5 sm:text-sm sm:leading-tight"
          >
            <span className="text-balance">
              {plan.primaryCta}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 self-center" aria-hidden />
          </Link>
          {plan.secondaryCta && hasDetails ? (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-expanded={expanded}
              className={`flex min-h-[2.875rem] w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border bg-white px-4 py-2.5 text-center text-[13px] font-semibold leading-snug tracking-tight transition-colors sm:text-sm ${expanded
                ? "border-[#d8d2ee] text-[#5b3cdd] hover:bg-[#f1ecf9]"
                : "border-[#e5e0ee] text-[#1c1a24] hover:bg-[#f1ecf9]"
                }`}
            >
              {expanded ? "Hide details" : plan.secondaryCta}
            </button>
          ) : null}
        </div>

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
              <div className="space-y-6 border-t border-[#f0ecf7] px-6 py-7 sm:px-7 sm:py-8 md:px-8 md:py-9">
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
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5b3cdd]" strokeWidth={3} />
                          <span className="text-sm leading-6 text-[#1c1a24]">{item}</span>
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
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5b3cdd]" strokeWidth={3} />
                          <span className="text-sm leading-6 text-[#1c1a24]">{item}</span>
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
  const [expandedId, setExpandedId] = useState(null);
  const expandedPlan = expandedId ? MEDICAL_PLANS.find((p) => p.id === expandedId) : null;

  return (
    <section className="bg-[#f9f9f9] py-10 md:py-14">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-16">
        <div className="mb-10 grid grid-cols-1 gap-8 md:mb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-x-8 xl:gap-x-12">
          <div className="min-w-0">
            <h2 className="font-title text-3xl font-bold leading-[1.05] tracking-tight text-gray-950 sm:text-4xl lg:text-[2.625rem] xl:text-[3.15rem]">
              Medical weight-loss care
            </h2>
            <p className="mt-2 font-playfair text-2xl italic leading-tight text-[#5d62f3] sm:text-3xl lg:text-[2.125rem] xl:text-[2.5rem]">
              matched to your stage and goals.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#474257] md:text-lg">
              Weight loss isn&apos;t one-size-fits-all. Choose the plan built
              for where you are right now &mdash; your goals, your lifestyle,
              your timeline.
            </p>
          </div>

          <div className="hidden w-full lg:block lg:w-auto lg:shrink-0 lg:pt-1">
            <TrustBadgesRow />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {MEDICAL_PLANS.map((plan) => (
            <MedicalPlanCard
              key={plan.id}
              plan={plan}
              ctaHref={ctaHref}
              spanFull={plan.bullets.length === 0}
              expanded={expandedId === plan.id}
              onToggleExpand={() => setExpandedId(expandedId === plan.id ? null : plan.id)}
            />
          ))}
        </div>

        <div className="mt-8 lg:hidden">
          <TrustBadgesRow />
        </div>

        <AnimatePresence initial={false}>
          {expandedPlan && (expandedPlan.description || expandedPlan.whyItWorks?.length > 0 || expandedPlan.bestFor?.length > 0) ? (
            <motion.div
              key={expandedPlan.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_40px_-24px_rgba(91,60,221,0.12)]"
            >
              <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-8 md:px-10 md:py-9">
                {expandedPlan.description ? (
                  <p className="text-sm leading-6 text-[#474257]">
                    {expandedPlan.description}
                  </p>
                ) : null}
                {expandedPlan.whyItWorks?.length > 0 ? (
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#1c1a24]">
                      WHY IT WORKS
                    </p>
                    <ul className="space-y-2.5">
                      {expandedPlan.whyItWorks.map((item) => (
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
                {expandedPlan.bestFor?.length > 0 ? (
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#1c1a24]">
                      BEST FOR
                    </p>
                    <ul className="space-y-2.5">
                      {expandedPlan.bestFor.map((item) => (
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

export function SupportFeatures({ productData }) {
  return (
    <section className="bg-[#f4f4f4] px-4 pt-16 pb-10 md:px-8 md:pt-20 md:pb-12 lg:px-16">
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
                <div className="mb-6 flex h-20 w-20 items-center justify-center">
                  {hasIconImage ? (
                    <img
                      src={feature.iconImage}
                      alt={feature.title}
                      className="h-full w-full object-contain mix-blend-multiply"
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
                      className="h-16 w-16 text-[#7b75f0]"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
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

/** Order: women first, then interleave so two men are never adjacent. `gender` stripped after sort. */
function orderTransformationTestimonials(rows) {
  const females = [];
  const males = [];
  for (const row of rows) {
    const { gender, ...rest } = row;
    if (gender === "m") males.push(rest);
    else females.push(rest);
  }
  const lead = Math.max(0, females.length - males.length);
  const ordered = [];
  let fi = 0;
  for (let i = 0; i < lead && fi < females.length; i++) ordered.push(females[fi++]);
  let mi = 0;
  while (mi < males.length || fi < females.length) {
    if (mi < males.length) ordered.push(males[mi++]);
    if (fi < females.length) ordered.push(females[fi++]);
  }
  return ordered;
}

const TRANSFORMATION_TESTIMONIALS_RAW = [
  {
    name: "Vineeth R.",
    weightLoss: 20,
    gender: "m",
    before: "/images/firstbefore.png",
    after: "/images/firstafter.png",
  },
  {
    name: "Ashley",
    weightLoss: 110,
    gender: "f",
    image: "/images/wmremove-transformed.png",
    afterMonth: 9,
  },
  {
    name: "Emily T.",
    weightLoss: 26,
    gender: "f",
    before: "/images/secondbefore.jpg",
    after: "/images/secondafter.jpg",
  },
  {
    name: "Sophia M.",
    weightLoss: 22,
    gender: "f",
    before: "/images/thirdbefore.jpeg",
    after: "/images/thirdafter.jpeg",
  },
  {
    name: "Olivia J.",
    weightLoss: 25,
    gender: "f",
    image: "/images/fourth.jpeg",
  },
  {
    name: "Megan L.",
    weightLoss: 24,
    gender: "f",
    image: "/images/sixth.jpg",
  },
  {
    name: "Daniel C.",
    weightLoss: 31,
    gender: "m",
    before: "/images/sevenbefore.jpg",
    after: "/images/7.jpg",
  },
  {
    name: "Rachel B.",
    weightLoss: 28,
    gender: "f",
    before: "/images/lastbefore.jpg",
    after: "/images/lastafter.jpg",
  },
];

const TRANSFORMATION_TESTIMONIALS = orderTransformationTestimonials(
  TRANSFORMATION_TESTIMONIALS_RAW,
);

/**
 * After-photo month (after month 0). Optional per-member `afterMonth` overrides the default hash (4–7).
 */
function transformationAfterMonthNumber(person) {
  const explicit = Number(person.afterMonth);
  if (Number.isFinite(explicit) && explicit >= 0) return Math.round(explicit);
  const base = [...String(person.name ?? "")].reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0,
  );
  const wl = Number(person.weightLoss) || 0;
  return ((base * 31 + wl) % 4) + 4; /* 4–7 */
}

function TransformationMonthLabel({ month }) {
  return (
    <span className="text-xs font-semibold tabular-nums text-gray-600 sm:text-sm">
      Month {month}
    </span>
  );
}

function TransformationTestimonialSlide({ person, afterMonth }) {
  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm md:p-5">
      {person.image ? (
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] bg-gray-100">
            <img
              src={person.image}
              alt={`${person.name} result`}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
          <div className="flex items-center justify-center gap-10 sm:gap-12">
            <TransformationMonthLabel month={0} />
            <TransformationMonthLabel month={afterMonth} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-w-0 flex-col items-center gap-3">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1rem] bg-gray-100">
              <img
                src={person.before}
                alt={`${person.name} before`}
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
            <TransformationMonthLabel month={0} />
          </div>
          <div className="flex min-w-0 flex-col items-center gap-3">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1rem] bg-gray-100">
              <img
                src={person.after}
                alt={`${person.name} after`}
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
            <TransformationMonthLabel month={afterMonth} />
          </div>
        </div>
      )}
      <p className="mt-5 text-center text-lg font-medium text-gray-700 md:text-xl">
        {person.name} lost{" "}
        <span className="font-semibold text-[#00a86b]">{person.weightLoss} lbs</span>
      </p>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#4d5160] md:text-sm">
        <BadgeCheck className="h-4 w-4 text-[#00a86b]" />
        <span>Verified HealSend Members</span>
      </div>
    </article>
  );
}

export function TestimonialsSection() {
  const [api, setApi] = useState(null);
  const carouselTransformations = buildLoopingItems(
    TRANSFORMATION_TESTIMONIALS,
    8,
  );
  const ctaHref = "/funnels/glp-1";

  return (
    <section className="bg-[#f4f5f9] py-10 md:py-14">
      <div className="mx-auto max-w-[1340px] px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-start  md:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl md:text-4xl lg:text-5xl">
                2000+ members.
              </h2>
              <div className="flex -space-x-2">
                {MEMBER_FACE_STACK_IMAGE_SRCS.map((src) => (
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
            <p className="mt-3 w-full text-center text-sm">
              <span className="font-semibold text-gray-700">Takes 90 seconds</span> · <span className="text-gray-500">100% private · free</span>
            </p>
          </div>
        </div>

        <div className="mb-6 hidden gap-3 md:flex">
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

      <div
        className="md:hidden flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Member transformation results"
      >
        {carouselTransformations.map((person, index) => {
          const afterMonth = transformationAfterMonthNumber(person);
          return (
            <div
              key={`${person.name}-m-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${carouselTransformations.length}`}
              className="min-w-0 shrink-0 grow-0 basis-[88%] snap-start snap-always"
            >
              <TransformationTestimonialSlide person={person} afterMonth={afterMonth} />
            </div>
          );
        })}
        <div className="w-4 shrink-0" aria-hidden />
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          containScroll: false,
          loop: carouselTransformations.length > 1,
          duration: 34,
        }}
        className="hidden w-full md:block"
      >
        <CarouselContent className="-ml-4 items-stretch md:-ml-6">
          {carouselTransformations.map((person, index) => {
            const afterMonth = transformationAfterMonthNumber(person);
            return (
              <CarouselItem
                key={`${person.name}-${index}`}
                className="basis-[88%] pl-4 sm:basis-[60%] md:pl-6 lg:basis-[36%] xl:basis-[32%]"
              >
                <TransformationTestimonialSlide person={person} afterMonth={afterMonth} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export function PricingPlansTable({ productName, footnote }) {
  const plans = [
    { name: "12 Month Plan", firstMonth: 0, thenPrice: 249, isBestValue: true },
    { name: "3 Month Plan", firstMonth: 149, thenPrice: 249, isBestValue: false },
    { name: "Monthly Plan", firstMonth: 199, thenPrice: 199, isBestValue: false, isMuted: true },
  ];
  return (
    <div className="space-y-4">
      {productName && (
        <h3 className="text-lg font-bold text-gray-900">{productName}</h3>
      )}
      <div className="mt-2 overflow-visible rounded-[1rem] border border-gray-200">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative flex items-center justify-between p-4 ${index !== 2 ? "border-b border-gray-200" : ""} ${plan.isMuted ? "bg-gray-50/50" : ""}`}
          >
            {plan.isBestValue && (
              <span className="absolute right-4 top-0 z-10 flex h-[1.4rem] -translate-y-1/2 items-center rounded-full bg-[#00a86b] px-3 text-sm font-semibold leading-none text-white">
                Best Value
              </span>
            )}
            <span className={`text-sm font-medium md:text-base ${plan.isMuted ? "text-gray-500" : "text-gray-700"}`}>
              {plan.name}
            </span>
            <div className="text-right">
              <div className={`text-xl font-bold leading-none ${plan.isMuted ? "text-gray-500" : "text-[#00a86b]"}`}>
                ${plan.firstMonth}{" "}
                <span className="text-sm font-semibold">first month</span>
              </div>
              <div className="mt-1 text-sm font-normal text-gray-500">
                {plan.name === "Monthly Plan" ? `$${plan.thenPrice}/mo*` : `then $${plan.thenPrice}/mo*`}
              </div>
            </div>
          </div>
        ))}
      </div>
      {footnote && <p className="text-xs text-gray-500">{footnote}</p>}
    </div>
  );
}

const BEFORE_AFTER_PLACEHOLDER_SLIDES = {
  "weight-loss": [
    { name: "Sarah M.", result: "Lost 34 lbs", before: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80", after: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80" },
    { name: "Jessica R.", result: "Lost 28 lbs", before: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80", after: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80" },
    { name: "Michael T.", result: "Lost 41 lbs", before: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80", after: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" },
  ],
  fitness: [
    { name: "James K.", result: "12 week transformation", before: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80", after: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" },
    { name: "Ryan D.", result: "8 week transformation", before: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80", after: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80" },
    { name: "Alex P.", result: "16 week transformation", before: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80", after: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80" },
  ],
  skin: [
    { name: "Emma L.", result: "12 week glow-up", before: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80", after: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80" },
    { name: "Olivia W.", result: "8 week results", before: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80", after: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80" },
    { name: "Sophia H.", result: "10 week results", before: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", after: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" },
  ],
};

function BeforeAfterCard({ slide }) {
  const containerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);

  const handleMove = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm md:p-5">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] w-full cursor-col-resize select-none overflow-hidden rounded-[1rem] bg-gray-100"
        style={{ touchAction: "none" }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handleMove(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons > 0) handleMove(e.clientX);
        }}
      >
        <img src={slide.after} alt="After" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
          <img src={slide.before} alt="Before" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100vw", maxWidth: "none" }} />
        </div>
        <div className="absolute inset-y-0 z-10" style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}>
          <div className="flex h-full w-0.5 flex-col items-center bg-white shadow-sm">
            <div className="absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/90 shadow-md backdrop-blur-sm">
              <ChevronLeft className="h-3.5 w-3.5 text-gray-600" />
              <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
            </div>
          </div>
        </div>
        <span className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">Before</span>
        <span className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">After</span>
      </div>
      <p className="mt-4 text-center text-lg font-medium text-gray-700 md:text-xl">
        {slide.name} — <span className="font-semibold text-[#00a86b]">{slide.result}</span>
      </p>
      <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[#4d5160] md:text-sm">
        <BadgeCheck className="h-4 w-4 text-[#00a86b]" />
        <span>Verified HealSend Member</span>
      </div>
    </article>
  );
}

export function BeforeAfterSliderSection({ category = "fitness", heading, ctaHref = "/funnels/glp-1" }) {
  const slides = BEFORE_AFTER_PLACEHOLDER_SLIDES[category] || BEFORE_AFTER_PLACEHOLDER_SLIDES.fitness;
  return (
    <section className="bg-[#f4f5f9] py-10 md:py-14">
      <div className="mx-auto max-w-[1340px] px-4 md:px-8">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl md:text-4xl lg:text-5xl">
            {heading || "Real transformations."}
          </h2>
          <p className="mt-1 font-playfair text-2xl italic font-medium tracking-tight text-[#6d6ffc] sm:text-3xl md:text-4xl">
            Life-changing results
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm text-gray-500 md:text-base">
            Drag the slider to compare before and after. Placeholder images — real member photos coming soon.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide) => (
            <BeforeAfterCard key={slide.name} slide={slide} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-10 py-4 text-sm font-medium text-white transition-colors hover:bg-slate-900"
          >
            See what&apos;s possible for you
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CountUp({ target, decimals = 0, prefix = "", suffix = "", duration = 2000 }) {
  const [display, setDisplay] = useState(target);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();
        setDisplay(0);
        const start = performance.now();
        const step = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

export function HormoneIcon() {
  return (
    <img
      src={`/images/${encodeURIComponent("WhatsApp Image 2026-05-14 at 2.00.13 AM.jpeg")}`}
      alt=""
      aria-hidden="true"
      className="h-7 w-7 object-contain"
      style={{ filter: "invert(1) brightness(1) opacity(0.4)", mixBlendMode: "screen" }}
    />
  );
}

const DARK_STATS_VARIANTS = {
  testosterone: {
    label: "Avg. T Increase",
    target: 418,
    unit: "ng/dL",
    desc: "Average increase in total testosterone within 90 days of starting HealSend's program.",
    subtitle: "9 out of 10 members reach optimal T levels in 90 days.",
  },
  igf1: {
    label: "Avg. IGF-1 Increase",
    target: 418,
    unit: "ng/mL",
    desc: "Average increase in IGF-1 levels within 90 days of starting HealSend's GH protocol.",
    subtitle: "9 out of 10 members reach optimal IGF-1 levels in 90 days.",
  },
};

export function DarkMemberStatsSection({ variant = "testosterone" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const statsScrollRef = useRef(null);
  const v = DARK_STATS_VARIANTS[variant] || DARK_STATS_VARIANTS.testosterone;

  const memberStats = [
    { label: "Faster Results", target: 2.4, decimals: 1, suffix: "×", icon: Zap, desc: "HealSend members raise total T levels at twice the speed of monitor-and-wait clinics within 90 days." },
    { label: v.label, target: v.target, decimals: 0, prefix: "+", unit: v.unit, icon: HormoneIcon, desc: v.desc },
    { label: "Success Rate", target: 94, decimals: 0, suffix: "%", icon: BadgeCheck, desc: "of HealSend members report higher energy, mood, and libido by week 6 of treatment." },
    { label: "Member Retention", target: 93, decimals: 0, suffix: "%", icon: Star, desc: "of HealSend members continue treatment past 90 days because the results speak for themselves." },
  ];

  useEffect(() => {
    const el = statsScrollRef.current;
    if (!el) return;
    const slides = () => [...el.querySelectorAll("[data-dark-stat]")];
    const onScroll = () => {
      const list = slides();
      if (!list.length) return;
      const mid = el.scrollLeft + el.clientWidth * 0.2;
      let best = 0;
      list.forEach((node, i) => {
        if (mid >= node.offsetLeft && mid < node.offsetLeft + node.offsetWidth) best = i;
      });
      setActiveIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#101726] text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#6D6FFC]/20 blur-3xl" />
      <div className="relative mx-auto hidden max-w-[1200px] px-4 py-16 md:block md:px-8 md:py-20">
        <h2 className="mb-3 max-w-[800px] font-title text-4xl font-medium md:text-5xl">
          Why members{" "}
          <span className="font-playfair italic">start and <span className="text-[#6D6FFC]">stay</span></span>{" "}
          with HealSend.
        </h2>
        <p className="mb-14 max-w-[640px] text-base text-white/70">{v.subtitle}</p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {memberStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="border-t border-white/20 pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">{s.label}</p>
                  {Icon && <Icon className="h-5 w-5 text-white/40" strokeWidth={1.5} />}
                </div>
                <p className="mb-4 font-title text-5xl leading-none md:text-6xl">
                  <CountUp target={s.target} decimals={s.decimals} prefix={s.prefix || ""} suffix={s.suffix || ""} />
                  {s.unit && <span className="ml-1 text-2xl text-white/50">{s.unit}</span>}
                </p>
                <p className="text-sm text-white/60">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative px-6 py-14 md:hidden">
        <h2 className="mb-3 font-title text-3xl font-medium">
          Why members{" "}
          <span className="font-playfair italic">start and <span className="text-[#6D6FFC]">stay</span></span>{" "}
          with HealSend.
        </h2>
        <p className="mb-8 text-sm text-white/70">{v.subtitle}</p>
        <div
          ref={statsScrollRef}
          className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-2 pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="region" aria-roledescription="carousel" aria-label="Member statistics"
        >
          {memberStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} data-dark-stat className="min-w-0 shrink-0 basis-[88%] snap-start snap-always rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <div className="border-t border-white/20 pt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">{s.label}</p>
                    {Icon && <Icon className="h-5 w-5 text-white/40" strokeWidth={1.5} />}
                  </div>
                  <p className="mb-4 font-title text-5xl leading-none">
                    <CountUp target={s.target} decimals={s.decimals} prefix={s.prefix || ""} suffix={s.suffix || ""} />
                    {s.unit && <span className="ml-1 text-2xl text-white/50">{s.unit}</span>}
                  </p>
                  <p className="text-sm text-white/60">{s.desc}</p>
                </div>
              </div>
            );
          })}
          <div className="w-3 shrink-0" aria-hidden />
        </div>
        <div className="mt-5 flex justify-center gap-2">
          {memberStats.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-[#6D6FFC]" : "w-1.5 bg-white/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MemberResultsStatsSection() {
  const memberStats = [
    {
      label: "Faster Results",
      value: "2",
      unit: "x",
      target: 2,
      decimals: 0,
      description:
        "HealSend members raise total T levels at twice the speed of monitor-and-wait clinics within 90 days.",
      icon: TrendingUp,
    },
    {
      label: "Avg. Weight Loss",
      value: "-20",
      unit: "lbs",
      target: 20,
      decimals: 0,
      prefix: "-",
      description: "Average weight loss within 90 days of starting HealSend's program.",
      icon: TrendingDown,
    },
    {
      label: "Success Rate",
      value: "96.8",
      unit: "%",
      target: 96.8,
      decimals: 1,
      description: "of HealSend members report higher energy, mood, and libido by week 6 of treatment.",
      icon: BadgeCheck,
    },
    {
      label: "Member Retention",
      value: "91",
      unit: "%",
      target: 91,
      decimals: 0,
      description: "of HealSend members continue their protocol past 90 days — because the results speak for themselves.",
      icon: Star,
    },
  ];

  return (
    <section className="relative overflow-hidden py-8 md:py-14 bg-slate-50">
      <img
        src="/images/articles/liquid-bubbles-desktop.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full object-cover object-top md:block"
      />
      <img
        src="/images/articles/liquid-bubbles-desktop.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-bottom md:hidden"
      />
      <div className="absolute inset-0 bg-white/70 md:hidden" />
      <div className="container relative mx-auto max-w-screen-xl space-y-8 px-4">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="flex flex-col gap-y-0 space-y-6 px-4 md:px-0">
            <h2 className="font-medium text-balance font-title text-4xl tracking-[-0.01em] text-gray-950 md:text-5xl">
              Why members start and stay{" "}
              <span className="font-playfair italic text-[#3b4cc0]">
                with HealSend.
              </span>
            </h2>
            <p className="text-sm font-bold text-gray-700">
              8 out of 10 members lose{" "}
              <em>20+ lbs in 90 days</em>*
              <br />
              <span className="font-normal text-inherit">
                Join 2,000+ members nationwide achieving their weight loss goals.
              </span>
            </p>
          </div>

          <div className="min-w-0">
            {/* Mobile: native horizontal scroll */}
            <div
              className="md:hidden flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-roledescription="carousel"
              aria-label="Member statistics"
            >
              {memberStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`m-${item.label}`}
                    role="group"
                    aria-roledescription="slide"
                    className="min-w-0 shrink-0 grow-0 basis-[88%] snap-start snap-always"
                  >
                    <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm uppercase tracking-wider text-slate-700">
                          {item.label}
                        </p>
                        <Icon className="size-[30px] shrink-0 text-slate-500" aria-hidden="true" strokeWidth={1.5} />
                      </div>
                      <div className="flex items-baseline justify-start gap-0.5 pb-6 pt-1">
                        <span className="text-4xl font-medium tracking-tight text-gray-950">
                          <CountUp target={item.target} decimals={item.decimals} prefix={item.prefix || ""} />
                        </span>
                        <span className="text-4xl font-medium tracking-tight text-gray-950">
                          {item.unit}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  </div>
                );
              })}
              <div className="w-4 shrink-0" aria-hidden />
            </div>

            {/* md+: 2x2 grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-4">
              {memberStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="overflow-hidden shadow-lg rounded-2xl p-6 pb-11 bg-white border border-gray-200"
                  >
                    <div className="flex gap-4 justify-between items-start">
                      <p className="text-sm tracking-wider uppercase text-slate-700">
                        {item.label}
                      </p>
                      <Icon className="size-[30px] text-slate-500" aria-hidden="true" strokeWidth={1.5} />
                    </div>
                    <div className="flex justify-start gap-0.5 items-baseline pb-6 pt-1">
                      <span className="font-medium text-4xl tracking-tight text-gray-950">
                        <CountUp target={item.target} decimals={item.decimals} prefix={item.prefix || ""} />
                      </span>
                      <span className="font-medium text-4xl tracking-tight text-gray-950">
                        {item.unit}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BMICalculatorPreviewSection() {
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("10");
  const [weightLbs, setWeightLbs] = useState("210");
  const [modalOpen, setModalOpen] = useState(false);
  const [projectedStartWeight, setProjectedStartWeight] = useState(334);
  const sliderTimerRef = useRef(null);

  const totalInches =
    (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
  const weightNum = parseFloat(weightLbs) || 0;
  const bmi =
    totalInches > 0 && weightNum > 0
      ? (weightNum * 703) / (totalInches * totalInches)
      : 0;
  const bmiDisplay = bmi > 0 ? bmi.toFixed(1) : "—";

  const bmiCategory =
    bmi <= 0
      ? null
      : bmi < 18.5
        ? "underweight"
        : bmi < 25
          ? "healthy"
          : bmi < 30
            ? "overweight"
            : "obesity";

  const categoryMessages = {
    underweight:
      "Your BMI is below the typical healthy range. A licensed clinician can review your full picture and recommend the right next step for you.",
    healthy:
      "Your BMI is in the healthy range. If you'd like guidance on long-term wellness, our clinicians can help you find the right plan.",
    overweight:
      "Your BMI is in a range where medical support can help. A licensed clinician can build a personalized plan to help you feel better, move more easily, and regain confidence.",
    obesity:
      "Your BMI is in a range where medical support can help. A licensed clinician can build a personalized plan to help you feel better, move more easily, and regain confidence.",
  };

  const bmiRanges = [
    { key: "underweight", label: "Underweight", value: "<18.5", dot: "#a5a8ff", bg: "bg-[#eef0ff]" },
    { key: "healthy", label: "Healthy Weight", value: "18.5+", dot: "#7be0a5", bg: "bg-[#eaf6f0]" },
    { key: "overweight", label: "Overweight", value: "25+", dot: "#ffd07a", bg: "bg-[#fbf3e6]" },
    { key: "obesity", label: "Obesity", value: "30+", dot: "#ef4444", bg: "bg-[#fde6e6]" },
  ];

  const arcLength = 361;
  const fillPercent = Math.max(0, Math.min(1, (bmi - 15) / 20));
  const dashFill = (fillPercent * arcLength).toFixed(0);
  const projectedLossLbs = Math.round(projectedStartWeight * 0.15);
  const projectedFillPercent = Math.max(
    0,
    Math.min(100, ((projectedStartWeight - 120) / (450 - 120)) * 100),
  );

  const handleNumericChange = (setter, max) => (event) => {
    const raw = event.target.value;
    if (raw === "") {
      setter("");
      return;
    }
    if (!/^\d{0,3}$/.test(raw)) return;
    const value = parseInt(raw, 10);
    if (Number.isNaN(value)) return;
    if (max !== undefined && value > max) return;
    setter(String(value));
  };
  const handleProjectedWeightChange = (event) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) return;
    setProjectedStartWeight(value);
    setModalOpen(true);
  };

  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="max-w-[72rem]">
          <h2 className="font-title text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#101726] sm:text-[3.1rem] lg:text-[4.25rem]">
            Find out what you could lose{" "}
            <span className="font-playfair italic text-[#5d62f3]">with HealSend.</span>
          </h2>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <article className="rounded-[1rem] border border-[#edf1f7] bg-white p-4 shadow-[0_18px_34px_rgba(20,24,34,0.08)] md:p-8">
            <p className="text-center text-[1rem] font-medium tracking-[-0.03em] text-[#121726] md:text-[1.25rem]">
              Check your eligibility.
            </p>

            <div className="relative mx-auto mt-4 h-[160px] w-[200px] md:mt-8 md:h-[210px] md:w-[260px]">
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
                  strokeDasharray={`${dashFill} ${arcLength}`}
                  strokeDashoffset="0"
                  style={{ transition: "stroke-dasharray 0.3s ease" }}
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
              <div className="absolute inset-x-0 bottom-4 text-center md:bottom-6">
                <div className="font-title text-[3.2rem] font-semibold leading-none tracking-[-0.06em] text-[#0b1020] md:text-[4.6rem]">
                  {bmiDisplay}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-[#7a859c] md:text-sm">
                  Your BMI
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-4 md:mt-6 md:space-y-5">
              <div>
                <label className="mb-1.5 block text-[0.9rem] font-medium text-[#313948] md:mb-2 md:text-[1rem]">
                  Height
                </label>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-3 py-2.5 focus-within:border-[#5d62f3] md:px-4 md:py-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={heightFt}
                      onChange={handleNumericChange(setHeightFt, 8)}
                      aria-label="Height in feet"
                      className="w-full bg-transparent text-[0.9rem] text-[#172030] outline-none md:text-[1.02rem]"
                    />
                    <span className="text-[0.9rem] font-medium text-[#68748f] md:text-[1.02rem]">ft</span>
                  </div>
                  <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-3 py-2.5 focus-within:border-[#5d62f3] md:px-4 md:py-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={heightIn}
                      onChange={handleNumericChange(setHeightIn, 11)}
                      aria-label="Height in inches"
                      className="w-full bg-transparent text-[0.9rem] text-[#172030] outline-none md:text-[1.02rem]"
                    />
                    <span className="text-[0.9rem] font-medium text-[#68748f] md:text-[1.02rem]">in</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[0.9rem] font-medium text-[#313948] md:mb-2 md:text-[1rem]">
                  Weight
                </label>
                <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-3 py-2.5 focus-within:border-[#5d62f3] md:px-4 md:py-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={weightLbs}
                    onChange={handleNumericChange(setWeightLbs, 999)}
                    aria-label="Weight in pounds"
                    className="w-full bg-transparent text-[0.9rem] text-[#172030] outline-none md:text-[1.02rem]"
                  />
                  <span className="text-[0.9rem] font-medium text-[#68748f] md:text-[1.02rem]">lbs</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={bmi <= 0}
              className="hs-solid-btn mt-6 inline-flex min-h-[2.8rem] w-full items-center justify-center gap-2 rounded-full px-6 text-[0.9rem] font-semibold disabled:cursor-not-allowed disabled:opacity-60 md:mt-8 md:min-h-[3.4rem] md:px-8 md:text-[1.02rem]"
            >
              See my BMI eligibility
              <ArrowRight className="h-4 w-4" />
            </button>
          </article>

          <BMIEligibilityModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            bmi={bmi}
            bmiDisplay={bmiDisplay}
            dashFill={dashFill}
            arcLength={arcLength}
            bmiCategory={bmiCategory}
            categoryMessages={categoryMessages}
            bmiRanges={bmiRanges}
          />

          <article className="hidden overflow-hidden rounded-[1rem] border border-[#edf1f7] bg-white shadow-[0_18px_34px_rgba(20,24,34,0.08)] lg:block">
            <div className="relative h-full min-h-[720px]">
              <Image
                src="/images/wmremove-transformed%20(1).jpeg"
                alt="Happy HealSend member"
                fill
                unoptimized
                sizes="(max-width: 1280px) 100vw, 32vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.88)_44%,rgba(255,255,255,1)_100%)] px-6 pb-5 pt-24">
                <div className="flex justify-center">
                  <div className="flex -space-x-2.5">
                    {MEMBER_FACE_STACK_IMAGE_SRCS_SIX.map((src) => (
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
                  Over <span className="font-semibold text-[#141c2b]">2,000</span>{" "}
                  members treated. <span className="font-semibold text-[#141c2b]">96.8%</span>{" "}
                  success backed by real HealSend member progress nationwide.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1rem] border border-[#edf1f7] bg-white p-4 shadow-[0_18px_34px_rgba(20,24,34,0.08)] md:p-8">
            <div className="text-center">
              <p className="text-[1rem] font-medium leading-[1.2] tracking-[-0.03em] text-[#121726] md:text-[1.3rem]">
                Your projected weight loss
              </p>

              <div className="mt-5 md:mt-10">
                <span className="font-title text-[3.5rem] font-semibold leading-none tracking-[-0.08em] text-[#0b1020] md:text-[5.7rem]">
                  {projectedLossLbs}
                </span>
                <span className="ml-1.5 text-[2rem] font-medium tracking-[-0.04em] text-[#66748f] md:ml-2 md:text-[3.25rem]">
                  lbs
                </span>
              </div>

              <p className="mx-auto mt-4 max-w-[19rem] text-[0.85rem] leading-6 text-[#4f5c76] md:mt-7 md:text-[0.98rem] md:leading-7">
                Based on <span className="font-semibold text-[#121726]">2000+</span>{" "}
                average HealSend member results in guided weight-loss care.
              </p>
            </div>

            <div className="mt-6 border-t border-[#d9e1ef] pt-6 md:mt-10 md:pt-9">
              <p className="text-center text-[0.9rem] font-medium text-[#20283a] md:text-[1.02rem]">
                Starting weight
              </p>
              <div className="mx-auto mt-3 flex max-w-[9rem] items-end justify-center gap-1 rounded-[0.9rem] bg-[#f2f5fa] px-4 py-3 md:mt-4 md:max-w-[10.5rem] md:px-5 md:py-4">
                <span className="font-title text-[2.4rem] font-semibold leading-none tracking-[-0.06em] text-[#48536b] md:text-[3.2rem]">
                  {projectedStartWeight}
                </span>
                <span className="mb-0.5 text-[1rem] font-medium text-[#68748f] md:mb-1 md:text-[1.15rem]">
                  lbs
                </span>
              </div>

              <div className="mt-8 md:mt-12">
                <input
                  type="range"
                  min={120}
                  max={450}
                  value={projectedStartWeight}
                  onChange={(e) => {
                    setProjectedStartWeight(Number(e.target.value));
                  }}
                  className="bmi-slider w-full cursor-grab active:cursor-grabbing"
                  style={{ background: `linear-gradient(90deg, #5d62f3 ${projectedFillPercent}%, #e5e7f0 ${projectedFillPercent}%)` }}
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );

}
function BMIEligibilityModal({
  open,
  onOpenChange,
  bmi: _bmi,
  bmiDisplay,
  dashFill,
  arcLength,
  bmiCategory,
  categoryMessages,
  bmiRanges,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogPrimitive.Content
          onPointerDownOutside={() => onOpenChange(false)}
          onEscapeKeyDown={() => onOpenChange(false)}
          className="fixed inset-x-0 bottom-0 z-50 grid max-h-[90vh] w-auto overflow-y-auto rounded-t-[1.25rem] bg-white px-5 pb-5 pt-0 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:max-h-[92vh] md:w-[95vw] md:max-w-[1100px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[1.25rem] md:p-10"
        >
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-5 top-4 z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50 md:flex"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <div className="grid gap-3 md:grid-cols-2 md:gap-8">
            <div className="rounded-[0.75rem] bg-[#f5f7fb] px-3 pb-3 pt-2 md:rounded-[1rem] md:p-8">
              <div className="flex items-center justify-between md:hidden">
                <span className="text-[0.8rem] font-semibold text-[#121726]">Your BMI result</span>
                <DialogPrimitive.Close
                  aria-label="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700"
                >
                  <X className="h-3.5 w-3.5" />
                </DialogPrimitive.Close>
              </div>
              <div className="relative mx-auto h-[100px] w-[150px] md:mt-6 md:h-[200px] md:w-[260px]">
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
                    stroke="url(#bmiGradientModal)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${dashFill} ${arcLength}`}
                    strokeDashoffset="0"
                  />
                  <defs>
                    <linearGradient id="bmiGradientModal" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6db1ff" />
                      <stop offset="50%" stopColor="#91e2a8" />
                      <stop offset="78%" stopColor="#ffd34d" />
                      <stop offset="100%" stopColor="#ff845b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-x-0 bottom-1 text-center md:bottom-4">
                  <div className="font-title text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[#0b1020] md:text-[3.6rem]">
                    {bmiDisplay}
                  </div>
                  <div className="mt-0.5 text-[0.65rem] font-medium text-[#5b6478] md:mt-1 md:text-sm">
                    Your BMI
                  </div>
                </div>
              </div>

              <p className="mt-1 text-center text-[0.7rem] leading-4 text-[#3a4254] md:mt-6 md:text-[0.95rem] md:leading-7">
                Body Mass Index (BMI) uses your height and weight to estimate
                whether your weight is in a healthy range.*
              </p>
            </div>

            <div className="flex flex-col gap-1.5 md:gap-3">
              {bmiRanges.map((range) => {
                const isActive = range.key === bmiCategory;
                return (
                  <div
                    key={range.key}
                    className={`rounded-[0.6rem] px-3 py-2 md:rounded-[1rem] md:p-5 ${isActive ? range.bg : "bg-[#f5f7fb]"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full md:h-2.5 md:w-2.5"
                          style={{ backgroundColor: range.dot }}
                        />
                        <span className="text-[0.8rem] font-semibold text-[#101726] md:text-[1.05rem]">
                          {range.label}
                        </span>
                      </div>
                      <span className="text-[0.75rem] font-semibold text-[#101726] md:text-[0.95rem]">
                        {range.value}
                      </span>
                    </div>

                    {isActive ? (
                      <>
                        <p className="mt-1.5 text-[0.72rem] leading-4 text-[#3a4254] md:mt-3 md:text-[0.92rem] md:leading-6">
                          {categoryMessages[range.key]}
                        </p>
                        <Link
                          href={range.key === "underweight" ? "mailto:yourhealth@healsend.com" : "/funnels/glp-1"}
                          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5d62f3] px-5 py-2.5 text-[0.8rem] font-semibold text-white transition-colors hover:bg-[#4b55eb] md:mt-4 md:py-3.5 md:text-[0.98rem]"
                        >
                          {range.key === "underweight"
                            ? "Talk to a clinician"
                            : "Start treatment today"}
                          <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </Link>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

export function LowTSymptomScreenerSection() {
  const questions = [
    "Persistent low energy?",
    "Reduced libido?",
    "Trouble building muscle?",
    "Brain fog or low motivation?",
  ];
  const [answers, setAnswers] = useState({});
  const yesCount = Object.values(answers).filter(Boolean).length;
  const answered = Object.keys(answers).length;
  const score = answered === 0 ? 0 : Math.round((yesCount / questions.length) * 10);
  const scoreLabel = score === 0 ? "no symptoms" : score <= 3 ? "low likelihood" : score <= 6 ? "moderate likelihood" : "high likelihood";
  const barPercent = (score / 10) * 100;

  const resultMessage = score <= 3
    ? "Your symptoms are minimal. If anything changes, we’re here."
    : score <= 6
      ? "Worth checking your bloodwork — TRT may help."
      : "Strong indicators of low T. A clinician review is recommended.";

  return (
    <section className="scroll-mt-24 bg-[#F7F5FA] py-10 md:py-16">
      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-title text-[2.2rem] font-bold leading-[1.05] tracking-tight text-[#101726] sm:text-[2.8rem] lg:text-[3.2rem]">
              Find out if <em className="text-[#6D6FFC]">TRT is right</em> for you.
            </h2>
            <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-gray-500 md:text-[1.1rem]">
              Take our 60-second symptom screener. We&apos;ll tell you if your symptoms suggest low testosterone — and if HealSend is the right fit.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
            <p className="text-sm font-medium text-gray-400">Your Low-T Symptom Score</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-title text-[3.5rem] font-bold leading-none tracking-tight text-[#101726]">{score}</span>
              <span className="text-base text-gray-400">/ 10 — {scoreLabel}</span>
            </div>

            <div className="mt-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.max(barPercent, 2)}%`,
                    background: score <= 3 ? '#22c55e' : score <= 6 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[0.7rem] text-gray-400">
                <span>No symptoms</span>
                <span>High likelihood</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {questions.map((q, i) => (
                <div key={i} className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-300",
                  answers[i] === true ? "bg-[#EDE9F6]" : answers[i] === false ? "bg-gray-50" : "bg-[#FAF8FB]"
                )}>
                  <span className="text-[0.92rem] font-medium text-[#101726]">{q}</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, [i]: true }))}
                      className={cn(
                        "rounded-full px-3.5 py-1 text-xs font-bold transition-all duration-200",
                        answers[i] === true
                          ? "bg-[#6D6FFC] text-white shadow-sm"
                          : "bg-white text-gray-400 ring-1 ring-gray-200 hover:ring-[#6D6FFC]/30"
                      )}
                    >Yes</button>
                    <button
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, [i]: false }))}
                      className={cn(
                        "rounded-full px-3.5 py-1 text-xs font-bold transition-all duration-200",
                        answers[i] === false
                          ? "bg-[#101726] text-white shadow-sm"
                          : "bg-white text-gray-400 ring-1 ring-gray-200 hover:ring-gray-300"
                      )}
                    >No</button>
                  </div>
                </div>
              ))}
            </div>

            {answered === questions.length && (
              <div className={cn(
                "mt-5 flex items-center gap-2.5 rounded-xl px-4 py-3 transition-all duration-500",
                score <= 3 ? "bg-emerald-50" : score <= 6 ? "bg-[#EDE9F6]" : "bg-red-50"
              )}>
                <span className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  score <= 3 ? "bg-emerald-500" : score <= 6 ? "bg-[#6D6FFC]" : "bg-red-500"
                )}>
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </span>
                <span className="text-[0.9rem] font-medium text-[#101726]">{resultMessage}</span>
              </div>
            )}

            <Link
              href="/quiz"
              className="hs-solid-btn mt-5 flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full text-base font-semibold shadow-[0_8px_24px_rgba(109,111,252,0.35)]"
            >
              See my eligibility →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// function _DeprecatedBMICalculatorPreviewSection() {
//   const [heightFt, setHeightFt] = useState("5");
//   const [heightIn, setHeightIn] = useState("10");
//   const [weightLbs, setWeightLbs] = useState("210");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [projectedStartWeight, setProjectedStartWeight] = useState(334);
//   const sliderTimerRef = useRef(null);

//   const totalInches =
//     (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
//   const weightNum = parseFloat(weightLbs) || 0;
//   const bmi =
//     totalInches > 0 && weightNum > 0
//       ? (weightNum * 703) / (totalInches * totalInches)
//       : 0;
//   const bmiDisplay = bmi > 0 ? bmi.toFixed(1) : "—";

//   const bmiCategory =
//     bmi <= 0
//       ? null
//       : bmi < 18.5
//         ? "underweight"
//         : bmi < 25
//           ? "healthy"
//           : bmi < 30
//             ? "overweight"
//             : "obesity";

//   const categoryMessages = {
//     underweight:
//       "Your BMI is below the typical healthy range. A licensed clinician can review your full picture and recommend the right next step for you.",
//     healthy:
//       "Your BMI is in the healthy range. If you'd like guidance on long-term wellness, our clinicians can help you find the right plan.",
//     overweight:
//       "Your BMI is in a range where medical support can help. A licensed clinician can build a personalized plan to help you feel better, move more easily, and regain confidence.",
//     obesity:
//       "Your BMI is in a range where medical support can help. A licensed clinician can build a personalized plan to help you feel better, move more easily, and regain confidence.",
//   };

//   const bmiRanges = [
//     { key: "underweight", label: "Underweight", value: "<18.5", dot: "#a5a8ff", bg: "bg-[#eef0ff]" },
//     { key: "healthy", label: "Healthy Weight", value: "18.5+", dot: "#7be0a5", bg: "bg-[#eaf6f0]" },
//     { key: "overweight", label: "Overweight", value: "25+", dot: "#ffd07a", bg: "bg-[#fbf3e6]" },
//     { key: "obesity", label: "Obesity", value: "30+", dot: "#ef4444", bg: "bg-[#fde6e6]" },
//   ];

//   const arcLength = 361;
//   const fillPercent = Math.max(0, Math.min(1, (bmi - 15) / 20));
//   const dashFill = (fillPercent * arcLength).toFixed(0);
//   const projectedLossLbs = Math.round(projectedStartWeight * 0.15);
//   const projectedFillPercent = Math.max(
//     0,
//     Math.min(100, ((projectedStartWeight - 120) / (450 - 120)) * 100),
//   );

//   const handleNumericChange = (setter, max) => (event) => {
//     const raw = event.target.value;
//     if (raw === "") {
//       setter("");
//       return;
//     }
//     if (!/^\d{0,3}$/.test(raw)) return;
//     const value = parseInt(raw, 10);
//     if (Number.isNaN(value)) return;
//     if (max !== undefined && value > max) return;
//     setter(String(value));
//   };

//   const handleProjectedWeightChange = (event) => {
//     const value = Number(event.target.value);
//     if (Number.isNaN(value)) return;
//     setProjectedStartWeight(value);
//     setModalOpen(true);
//   };

//   return (
//     <section className="bg-white px-5 py-20 md:px-8 lg:px-10">
//       <div className="mx-auto max-w-[1240px]">
//         <div className="max-w-[72rem]">
//           <h2 className="font-title text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#101726] sm:text-[3.1rem] lg:text-[4.25rem]">
//             Find out what you could lose{" "}
//             <span className="font-playfair italic text-[#5d62f3]">with HealSend.</span>
//           </h2>
//         </div>

//         <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
//           <article className="rounded-[1rem] border border-[#edf1f7] bg-white p-4 shadow-[0_18px_34px_rgba(20,24,34,0.08)] md:p-8">
//             <p className="text-center text-[1rem] font-medium tracking-[-0.03em] text-[#121726] md:text-[1.25rem]">
//               Check your eligibility.
//             </p>

//             <div className="relative mx-auto mt-4 h-[160px] w-[200px] md:mt-8 md:h-[210px] md:w-[260px]">
//               <svg viewBox="0 0 280 170" className="h-full w-full overflow-visible">
//                 <path
//                   d="M 25 150 A 115 115 0 0 1 255 150"
//                   fill="none"
//                   stroke="#e5e7eb"
//                   strokeWidth="16"
//                   strokeLinecap="round"
//                 />
//                 <path
//                   d="M 25 150 A 115 115 0 0 1 255 150"
//                   fill="none"
//                   stroke="url(#bmiGradientPreview)"
//                   strokeWidth="16"
//                   strokeLinecap="round"
//                   strokeDasharray={`${dashFill} ${arcLength}`}
//                   strokeDashoffset="0"
//                   style={{ transition: "stroke-dasharray 0.3s ease" }}
//                 />
//                 <defs>
//                   <linearGradient id="bmiGradientPreview" x1="0%" y1="0%" x2="100%" y2="0%">
//                     <stop offset="0%" stopColor="#6db1ff" />
//                     <stop offset="50%" stopColor="#91e2a8" />
//                     <stop offset="78%" stopColor="#ffd34d" />
//                     <stop offset="100%" stopColor="#ff845b" />
//                   </linearGradient>
//                 </defs>
//               </svg>
//               <div className="absolute inset-x-0 bottom-4 text-center md:bottom-6">
//                 <div className="font-title text-[3.2rem] font-semibold leading-none tracking-[-0.06em] text-[#0b1020] md:text-[4.6rem]">
//                   {bmiDisplay}
//                 </div>
//                 <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-[#7a859c] md:text-sm">
//                   Your BMI
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 space-y-4 md:mt-6 md:space-y-5">
//               <div>
//                 <label className="mb-1.5 block text-[0.9rem] font-medium text-[#313948] md:mb-2 md:text-[1rem]">
//                   Height
//                 </label>
//                 <div className="grid grid-cols-2 gap-3 md:gap-4">
//                   <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-3 py-2.5 focus-within:border-[#5d62f3] md:px-4 md:py-3">
//                     <input
//                       type="text"
//                       inputMode="numeric"
//                       pattern="[0-9]*"
//                       value={heightFt}
//                       onChange={handleNumericChange(setHeightFt, 8)}
//                       aria-label="Height in feet"
//                       className="w-full bg-transparent text-[0.9rem] text-[#172030] outline-none md:text-[1.02rem]"
//                     />
//                     <span className="text-[0.9rem] font-medium text-[#68748f] md:text-[1.02rem]">ft</span>
//                   </div>
//                   <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-3 py-2.5 focus-within:border-[#5d62f3] md:px-4 md:py-3">
//                     <input
//                       type="text"
//                       inputMode="numeric"
//                       pattern="[0-9]*"
//                       value={heightIn}
//                       onChange={handleNumericChange(setHeightIn, 11)}
//                       aria-label="Height in inches"
//                       className="w-full bg-transparent text-[0.9rem] text-[#172030] outline-none md:text-[1.02rem]"
//                     />
//                     <span className="text-[0.9rem] font-medium text-[#68748f] md:text-[1.02rem]">in</span>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-[0.9rem] font-medium text-[#313948] md:mb-2 md:text-[1rem]">
//                   Weight
//                 </label>
//                 <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-3 py-2.5 focus-within:border-[#5d62f3] md:px-4 md:py-3">
//                   <input
//                     type="text"
//                     inputMode="numeric"
//                     pattern="[0-9]*"
//                     value={weightLbs}
//                     onChange={handleNumericChange(setWeightLbs, 999)}
//                     aria-label="Weight in pounds"
//                     className="w-full bg-transparent text-[0.9rem] text-[#172030] outline-none md:text-[1.02rem]"
//                   />
//                   <span className="text-[0.9rem] font-medium text-[#68748f] md:text-[1.02rem]">lbs</span>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={() => setModalOpen(true)}
//               disabled={bmi <= 0}
//               className="hs-solid-btn mt-6 inline-flex min-h-[2.8rem] w-full items-center justify-center gap-2 rounded-full px-6 text-[0.9rem] font-semibold disabled:cursor-not-allowed disabled:opacity-60 md:mt-8 md:min-h-[3.4rem] md:px-8 md:text-[1.02rem]"
//             >
//               See my BMI eligibility
//               <ArrowRight className="h-4 w-4" />
//             </button>
//           </article>

//           <BMIEligibilityModal
//             open={modalOpen}
//             onOpenChange={setModalOpen}
//             bmi={bmi}
//             bmiDisplay={bmiDisplay}
//             dashFill={dashFill}
//             arcLength={arcLength}
//             bmiCategory={bmiCategory}
//             categoryMessages={categoryMessages}
//             bmiRanges={bmiRanges}
//           />

//           <article className="hidden overflow-hidden rounded-[1rem] border border-[#edf1f7] bg-white shadow-[0_18px_34px_rgba(20,24,34,0.08)] lg:block">
//             <div className="relative h-full min-h-[720px]">
//               <Image
//                 src="/images/wmremove-transformed%20(1).jpeg"
//                 alt="Happy HealSend member"
//                 fill
//                 unoptimized
//                 sizes="(max-width: 1280px) 100vw, 32vw"
//                 className="object-cover object-center"
//               />
//               <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.88)_44%,rgba(255,255,255,1)_100%)] px-6 pb-5 pt-24">
//                 <div className="flex justify-center">
//                   <div className="flex -space-x-2.5">
//                     {MEMBER_FACE_STACK_IMAGE_SRCS_SIX.map((src) => (
//                       <span
//                         key={src}
//                         className="relative h-10 w-10 overflow-hidden rounded-full border-[3px] border-white bg-[#edf1f8]"
//                       >
//                         <Image
//                           src={src}
//                           alt=""
//                           fill
//                           sizes="40px"
//                           className="object-cover object-center"
//                         />
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <p className="mx-auto mt-4 max-w-[22rem] text-center text-[0.98rem] leading-7 text-[#4e5a73]">
//                   Over <span className="font-semibold text-[#141c2b]">2,000</span>{" "}
//                   members treated. <span className="font-semibold text-[#141c2b]">96.8%</span>{" "}
//                   success backed by real HealSend member progress nationwide.
//                 </p>
//               </div>
//             </div>
//           </article>

//           <article className="hidden rounded-[1rem] border border-[#edf1f7] bg-white p-8 shadow-[0_18px_34px_rgba(20,24,34,0.08)] lg:block">
//             <div className="text-center">
//               <p className="text-[1.3rem] font-medium leading-[1.2] tracking-[-0.03em] text-[#121726]">
//                 Your projected
//                 <br />
//                 weight loss
//               </p>

//               <div className="mt-10">
//                 <span className="font-title text-[5.7rem] font-semibold leading-none tracking-[-0.08em] text-[#0b1020]">
//                   {projectedLossLbs}
//                 </span>
//                 <span className="ml-2 text-[3.25rem] font-medium tracking-[-0.04em] text-[#66748f]">
//                   lbs
//                 </span>
//               </div>

//               <p className="mx-auto mt-7 max-w-[19rem] text-[0.98rem] leading-7 text-[#4f5c76]">
//                 Based on <span className="font-semibold text-[#121726]">2000+</span>{" "}
//                 average HealSend member results in guided weight-loss care.
//               </p>
//             </div>

//             <div className="mt-10 border-t border-[#d9e1ef] pt-9">
//               <p className="text-center text-[1.02rem] font-medium text-[#20283a]">
//                 Starting weight
//               </p>
//               <div className="mx-auto mt-4 flex max-w-[10.5rem] items-end justify-center gap-1 rounded-[0.9rem] bg-[#f2f5fa] px-5 py-4">
//                 <span className="font-title text-[3.2rem] font-semibold leading-none tracking-[-0.06em] text-[#48536b]">
//                   {projectedStartWeight}
//                 </span>
//                 <span className="mb-1 text-[1.15rem] font-medium text-[#68748f]">
//                   lbs
//                 </span>
//               </div>

//               <div className="relative mt-12 py-3">
//                 <div
//                   className="relative h-4 w-full overflow-hidden rounded-full bg-[#5d62f3]/10 pointer-events-none"
//                   role="progressbar"
//                   aria-valuemin={0}
//                   aria-valuemax={100}
//                 >
//                   <div
//                     className="h-full w-full flex-1 rounded-full bg-gradient-to-r from-[#4347d9] to-[#5d62f3]"
//                     style={{ transform: `translateX(-${100 - projectedFillPercent}%)` }}
//                   />
//                 </div>
//                 <div
//                   aria-label={`Weight: ${projectedStartWeight} lbs`}
//                   aria-valuenow={projectedStartWeight}
//                   aria-valuemin={120}
//                   aria-valuemax={450}
//                   role="slider"
//                   tabIndex={0}
//                   className="absolute top-1/2 size-6 rounded-full bg-white border-2 border-[#3b3ff0] shadow-md cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b3ff0] focus-visible:ring-offset-2"
//                   style={{
//                     left: `${projectedFillPercent}%`,
//                     top: "50%",
//                     transform: "translateX(-50%) translateY(-50%)",
//                   }}
//                   onPointerDown={(e) => {
//                     e.currentTarget.setPointerCapture(e.pointerId);
//                     const bar = e.currentTarget.parentElement;
//                     clearTimeout(sliderTimerRef.current);
//                     const move = (ev) => {
//                       const rect = bar.getBoundingClientRect();
//                       const pct = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
//                       setProjectedStartWeight(Math.round(120 + pct * (450 - 120)));
//                     };
//                     move(e);
//                     const up = () => {
//                       bar.removeEventListener("pointermove", move);
//                       bar.removeEventListener("pointerup", up);
//                       sliderTimerRef.current = setTimeout(() => setModalOpen(true), 2000);
//                     };
//                     bar.addEventListener("pointermove", move);
//                     bar.addEventListener("pointerup", up);
//                   }}
//                   draggable="false"
//                 />
//               </div>
//             </div>
//           </article>
//         </div>
//       </div>
//     </section>
//   );
// }

// function BMIEligibilityModal({
//   open,
//   onOpenChange,
//   bmi: _bmi,
//   bmiDisplay,
//   dashFill,
//   arcLength,
//   bmiCategory,
//   categoryMessages,
//   bmiRanges,
// }) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogPortal>
//         <DialogOverlay className="bg-black/50" />
//         <DialogPrimitive.Content className="fixed inset-x-3 bottom-0 z-50 grid max-h-[92vh] w-auto overflow-y-auto rounded-t-[1.25rem] bg-white p-4 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:max-h-[92vh] md:w-[95vw] md:max-w-[1100px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[1.25rem] md:p-10">
//           <DialogPrimitive.Close
//             aria-label="Close"
//             className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
//           >
//             <X className="h-4 w-4" />
//           </DialogPrimitive.Close>

//           <div className="grid gap-6 md:grid-cols-2 md:gap-8">
//             <div className="rounded-[1rem] bg-[#f5f7fb] p-4 md:p-8">
//               <p className="text-center text-[1.05rem] font-medium tracking-[-0.02em] text-[#121726] md:text-[1.15rem]">
//                 Check your eligibility.
//               </p>

//               <div className="relative mx-auto mt-4 h-[160px] w-[220px] md:mt-6 md:h-[200px] md:w-[260px]">
//                 <svg viewBox="0 0 280 170" className="h-full w-full overflow-visible">
//                   <path
//                     d="M 25 150 A 115 115 0 0 1 255 150"
//                     fill="none"
//                     stroke="#e5e7eb"
//                     strokeWidth="16"
//                     strokeLinecap="round"
//                   />
//                   <path
//                     d="M 25 150 A 115 115 0 0 1 255 150"
//                     fill="none"
//                     stroke="url(#bmiGradientModal)"
//                     strokeWidth="16"
//                     strokeLinecap="round"
//                     strokeDasharray={`${dashFill} ${arcLength}`}
//                     strokeDashoffset="0"
//                   />
//                   <defs>
//                     <linearGradient id="bmiGradientModal" x1="0%" y1="0%" x2="100%" y2="0%">
//                       <stop offset="0%" stopColor="#6db1ff" />
//                       <stop offset="50%" stopColor="#91e2a8" />
//                       <stop offset="78%" stopColor="#ffd34d" />
//                       <stop offset="100%" stopColor="#ff845b" />
//                     </linearGradient>
//                   </defs>
//                 </svg>
//                 <div className="absolute inset-x-0 bottom-4 text-center">
//                   <div className="font-title text-[2.8rem] font-semibold leading-none tracking-[-0.06em] text-[#0b1020] md:text-[3.6rem]">
//                     {bmiDisplay}
//                   </div>
//                   <div className="mt-1 text-xs font-medium text-[#5b6478] md:text-sm">
//                     Your BMI
//                   </div>
//                 </div>
//               </div>

//               <p className="mt-4 text-center text-[0.82rem] leading-6 text-[#3a4254] md:mt-6 md:text-[0.95rem] md:leading-7">
//                 Body Mass Index (BMI) is a measurement that uses your height and
//                 weight to estimate whether your weight is in a healthy range for
//                 your height.*
//               </p>
//             </div>

//             <div className="flex flex-col gap-3">
//               {bmiRanges.map((range) => {
//                 const isActive = range.key === bmiCategory;
//                 return (
//                   <div
//                     key={range.key}
//                     className={`rounded-[1rem] p-4 md:p-5 ${isActive ? range.bg : "bg-[#f5f7fb]"}`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2.5">
//                         <span
//                           className="h-2.5 w-2.5 rounded-full"
//                           style={{ backgroundColor: range.dot }}
//                         />
//                         <span className="text-[1rem] font-semibold text-[#101726] md:text-[1.05rem]">
//                           {range.label}
//                         </span>
//                       </div>
//                       <span className="text-[0.95rem] font-semibold text-[#101726]">
//                         {range.value}
//                       </span>
//                     </div>

//                     {isActive ? (
//                       <>
//                         <p className="mt-3 text-[0.92rem] leading-6 text-[#3a4254]">
//                           {categoryMessages[range.key]}
//                         </p>
//                         <Link
//                           href={range.key === "underweight" ? "mailto:yourhealth@healsend.com" : "/funnels/glp-1"}
//                           className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5d62f3] px-6 py-3.5 text-[0.98rem] font-semibold text-white transition-colors hover:bg-[#4b55eb]"
//                         >
//                           {range.key === "underweight"
//                             ? "Talk to a clinician"
//                             : "Start treatment today"}
//                           <ArrowRight className="h-4 w-4" />
//                         </Link>
//                       </>
//                     ) : null}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//         </DialogPrimitive.Content>
//       </DialogPortal>
//     </Dialog>
//   );
// }

export function ResearchSplit({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const researchImage =
    productData.researchSection?.title?.includes("NAD+")
      ? "/images/female-removebg-preview.png"
      : productData.researchSection.image;

  return (
    <section className="bg-[#f9f9f9] px-4 pt-8 pb-0 md:px-8 md:pt-20 lg:px-16">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 relative overflow-hidden lg:order-1">
          <img
            src={researchImage}
            alt="Woman smiling outdoors"
            className="h-full w-full object-contain object-bottom"
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
          <div className="text-center">
            <Link
              href={ctaHref}
              className="hs-solid-btn hs-no-shimmer inline-block rounded-full px-8 py-3.5 text-base font-medium transition-colors"
            >
              See if you qualify
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step3ImageMale() {
  return (
    <div className="relative flex h-full w-full items-end justify-center">
      <img
        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
        alt="Man receiving ongoing care"
        className="h-full w-full object-cover object-top"
      />
      <div className="absolute right-3 top-6 flex items-start gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg md:right-5 md:top-10">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=80&q=80" alt="Doctor" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Dr. Nguyen</p>
          <p className="text-sm font-medium text-gray-800">How are you feeling today?</p>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D6FFC] shadow-lg md:bottom-6 md:right-6 md:h-12 md:w-12">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      </div>
    </div>
  );
}

export function SimpleSteps({ productData, variant }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const steps = defaultSimpleSteps;

  return (
    <section className="bg-[#f4f5f9] pt-16 pb-8 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="mx-auto mb-10 w-full text-[2.5rem] font-semibold leading-[1.15] tracking-tight text-[#1c1d20] md:text-[3rem] lg:text-[3.5rem]">
            Hit your health goals safely &amp; affordably in 3 simple steps
          </h2>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ctaHref}
              className="hs-solid-btn inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-center text-base font-semibold transition-colors sm:w-auto"
            >
              Get started
            </Link>
            <Link
              href={ctaHref}
              className="hs-outline-btn inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-center text-base font-semibold transition-colors sm:w-auto"
            >
              See if you&apos;re eligible
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white px-4 pt-5 shadow-sm md:rounded-[2rem] md:px-6 md:pt-7"
            >
              <h3 className="mb-3 min-h-0 pr-2 text-[1.1rem] font-bold leading-[1.3] text-[#1c1d20] md:mb-5 md:min-h-[56px] md:text-[1.4rem]">
                {step.title}
              </h3>

              <div className="mb-3 h-px w-full bg-gray-100/80 md:mb-5" />

              <div className="relative z-10 mb-3 flex items-start gap-3 md:mb-5 md:gap-4">
                <div className="flex w-10 shrink-0 flex-col items-center md:w-14">
                  <span className="mb-1 text-[0.65rem] font-bold tracking-[0.15em] text-[#8a8d98] md:text-[0.75rem]">
                    STEP
                  </span>
                  <span className="text-center text-[2.4rem] font-extrabold leading-none text-[#1c1d20] md:text-[3.3rem]">
                    {step.step}
                  </span>
                </div>
                <p className="pt-0.5 text-[0.9rem] leading-[1.5] text-[#4a4d57] md:text-[1.05rem] md:leading-[1.6]">
                  {step.description}
                </p>
              </div>

              <div className="mt-auto flex w-full items-end justify-center h-[300px] md:h-[360px]">
                {variant === "men" && step.step === 3 ? (
                  <Step3ImageMale />
                ) : (
                  <img
                    src={step.image}
                    alt={`Step ${step.step}`}
                    className={step.imageClass}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LabTested({ productData }) {
  const merged = mergeProductContent(productData);
  const from = merged.labTestedSection || {};
  const content = {
    title: from.title || staticLabTestedSection.title,
    description: from.description || staticLabTestedSection.description,
    image: from.image || staticLabTestedSection.image,
  };
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

      <section className="bg-[#f9f9f9] px-4 py-12 md:px-8 md:py-16 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center gap-8 rounded-[2.5rem] bg-gradient-to-br from-[#6f68f0] to-[#8f88ff] p-6 md:p-10 lg:flex-row lg:gap-12 lg:p-12">
            <div className="flex-1 text-white">
              <h2 className="mb-6 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.75rem]">
                {content.title}
              </h2>
              <p className="mb-10 max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
                {content.description}
              </p>

              <div className="max-w-lg grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:p-5">
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    <BadgeCheck
                      className="h-6 w-6 shrink-0 text-white"
                      strokeWidth={1.5}
                    />
                    <span className="min-w-0 text-base font-medium leading-snug text-white">
                      Third party quality control testing
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="hs-outline-btn inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors sm:w-auto sm:px-5"
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

export function ComprehensiveCare({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const content = productData?.comprehensiveCare || defaultComprehensiveCare;
  const features =
    content.features?.length > 0
      ? content.features
      : defaultComprehensiveCare.features;

  return (
    <section className="bg-[#f9f9f9] pt-4 pb-4 md:pt-6 md:pb-6">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-8 text-left">
          <h2 className="mb-4 font-title text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl lg:text-6xl">
            Doctor guided{" "}
            <span className="font-playfair italic text-[#5b3cdd]">weight loss.</span>
          </h2>
          <p className="max-w-2xl text-lg text-gray-600">
            Most wellness programs stop at product access. HealSend pairs your treatment with clinician guidance, support, and ongoing care.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 pb-4 shadow-sm md:p-10 md:pb-6 lg:p-12 lg:pb-8">
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-md"
              >
                <div className="flex items-center justify-center gap-1.5 bg-[#7b75f0] py-2 text-xs font-bold text-white">
                  Included <PlusCircle className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-1 flex-col gap-5 p-6 lg:flex-row lg:items-start lg:gap-6 lg:p-8">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-4 text-xl font-bold leading-tight text-[#7b75f0] md:text-3xl">
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
                  <div className="mx-auto mt-1 h-48 w-48 shrink-0 overflow-hidden bg-white sm:h-56 sm:w-56 lg:mx-0 lg:mt-0 lg:h-64 lg:w-64">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-contain object-top mix-blend-multiply"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={ctaHref}
            className="hs-solid-btn mx-auto block w-full max-w-sm rounded-full py-4 text-center text-lg font-bold transition-colors md:py-5 md:text-xl"
          >
            Lose Fat Now
          </Link>
        </div>
      </div>
    </section>
  );
}

const CLEAN_CARD_DESCRIPTIONS = {
  "Evidence-Based Treatments": "Protocols backed by clinical research, not trends.",
  "100% Online & Private": "No waiting rooms. No awkward in-person visits.",
  "Automatic refills": "Your medication ships before you ever run out.",
  "Same-Day Prescriptions": "Clinician review and Rx issued the same day.",
  "Affordable, Transparent Pricing": "No hidden fees. Know exactly what you pay.",
  "Fast free delivery": "Discreet, free shipping straight to your door.",
};

const CLEAN_CARD_HIGHLIGHT = "Same-Day Prescriptions";

export function CleanSimpleEffective({ productData }) {
  const ctaHref = getPrimaryCtaHref(productData);
  const items =
    productData?.cleanIngredients?.length > 0
      ? productData.cleanIngredients
      : mergeIconItems(
        defaultProductContent.cleanIngredients,
        defaultProductContent.cleanIngredients,
      );

  return (
    <section className="relative overflow-hidden bg-[#F9F9F9] py-8 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 font-title text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Everything you need for{" "}
            <span className="font-playfair italic text-[#6D6FFC]">complete care.</span>
          </h2>
          <p className="mx-auto max-w-xl text-base text-gray-600 md:text-lg">
            Medication is just the start. Your plan includes ongoing clinician support, lab work, and everything you need to optimize.
          </p>
        </div>

        {/* Mobile: horizontal scroll — one card at a time with peek */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
          {items.map((item) => {
            const label = item.text || item.name;
            const desc = CLEAN_CARD_DESCRIPTIONS[label];
            const highlighted = label === CLEAN_CARD_HIGHLIGHT;
            return (
              <div
                key={label}
                className="flex w-[75vw] shrink-0 snap-start flex-col items-center justify-center rounded-[1.25rem] bg-white px-7 py-20 text-center shadow-sm"
              >
                <div className="mb-7 flex h-28 w-28 items-center justify-center">
                  {item.iconImage ? (
                    <img src={item.iconImage} alt="" aria-hidden="true" className="h-24 w-24 object-contain" />
                  ) : (
                    <item.icon className="h-[4.5rem] w-[4.5rem] text-[#6D6FFC]" strokeWidth={1.3} />
                  )}
                </div>
                <p className="mb-3 whitespace-pre-line text-lg font-bold leading-snug text-[#1c1a24]">{label}</p>
                {desc && <p className="text-base leading-relaxed text-gray-500">{desc}</p>}
              </div>
            );
          })}
        </div>

        {/* Desktop: grid */}
        <div className="hidden gap-4 md:grid md:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => {
            const label = item.text || item.name;
            const desc = CLEAN_CARD_DESCRIPTIONS[label];
            const highlighted = label === CLEAN_CARD_HIGHLIGHT;
            return (
              <div
                key={label}
                className="flex flex-col items-center rounded-[1.25rem] bg-white px-5 py-10 text-center shadow-sm transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:shadow-md"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center">
                  {item.iconImage ? (
                    <img
                      src={item.iconImage}
                      alt=""
                      aria-hidden="true"
                      className={`object-contain ${item.iconImage.includes("fast-free-delivery") ? "h-20 w-14" : "h-12 w-12"}`}
                    />
                  ) : (
                    <item.icon className="h-9 w-9 text-[#6D6FFC]" strokeWidth={1.5} />
                  )}
                </div>
                <p className="mb-2 whitespace-pre-line text-sm font-bold leading-snug text-[#1c1a24]">{label}</p>
                {desc && <p className="text-xs leading-relaxed text-gray-500">{desc}</p>}
              </div>
            );
          })}
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
  "Personalized, clinically-proven treatment plans",
  "Expert-led education with an active member community",
  "Treatment precisely matched to your body and goals",
  "Doses titrated by your clinician to minimize side effects",
  "Unlimited video calls and messaging with your clinician",
  "100% online. Free, discreet shipping.",
];

/** Trust strip icons (client assets in /public/images). Mixed “clinical” + brand-style marks per line. */
const SAME_MED_MARQUEE_ITEMS = [
  { text: "Free & Fast Shipping", Icon: Truck },
  { text: "U.S. Only Certified Pharmacies", Icon: null, svg: "True" },
  { text: "Always On Clinician Support", Icon: Headset },
  { text: "1,200,000+ prescriptions written", Icon: ClipboardCheck },
  { text: "250,000+ members", Icon: Users },
  { text: "FSA & HSA Eligible", Icon: BadgeCheck },
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "Personalized Rx Weight Loss Plans", Icon: PillBottle },
];

const SAME_MED_OTHERS_POINTS = [
  "Generic, fixed plans you have to adapt to",
  "No education, no nutrition support, no community",
  "Same dose for everyone, basic diagnosis protocols",
  "Side effects handled reactively, not proactively",
  "No follow-up after your prescription ships",
  "Pharmacy lines, long waits, no guarantees",
];

/**
 * Yellow animated trust strip for the GLP marketing homepage only.
 * Renders its own `<section>` — keep it a sibling of `SameMedicationSection`, not nested inside it.
 */
export function SameMedicationTrustMarqueeSection() {
  return <MarketingTrustMarquee items={SAME_MED_MARQUEE_ITEMS} edgeToEdge />;
}

/**
 * Yellow animated trust strip (shared; used by `SameMedicationTrustMarqueeSection` and other landings).
 * Use `edgeToEdge={false}` on standalone pages (e.g. /enclomiphene, /trt): full-bleed
 * `w-screen` + `-translate-x-1/2` can clip or show the wrong background behind the strip.
 */
export function MarketingTrustMarquee({ items, edgeToEdge = true }) {
  const loopItems = [...items, ...items];
  return (
    <section
      aria-label="Care and pharmacy highlights"
      className={cn(
        "shrink-0 bg-[#fde073] py-3",
        edgeToEdge
          ? "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2"
          : "relative z-10 w-full",
      )}
      style={{ backgroundColor: "#fde073" }}
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex min-w-max items-center gap-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 26,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {loopItems.map((item, index) => (
            <div
              key={`${item.text}-${index}`}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[13px] font-medium leading-none text-gray-500"
            >
              {item.svg === "True" ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 8h20" />
                  <path d="M2 12h20" />
                  <path d="M2 16h20" />
                  <rect x="2" y="4" width="8" height="8" fill="gray" stroke="none" />
                </svg>
              ) : (
                <item.Icon className="h-4 w-4 shrink-0" />
              )}
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function SameMedicationSection({ planLabel } = {}) {
  const healPoints = planLabel
    ? [planLabel, ...SAME_MED_HEALSEND_POINTS.slice(1)]
    : SAME_MED_HEALSEND_POINTS;

  const comparisonRowMotion = (i) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.4 },
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  });

  return (
    <section className="bg-slate-100 pt-6 pb-12 md:pt-8 md:pb-20">
      <div className="container mx-auto max-w-screen-md space-y-10 px-4 md:space-y-14 md:px-8">
        <div className="space-y-2 text-center">
          <h2 className="font-title text-4xl font-bold tracking-tight text-gray-950 md:text-6xl">
            Same medication.
          </h2>
          <p className="font-playfair text-3xl italic text-[#5b3cdd] md:text-5xl">
            Very different experience.
          </p>
        </div>

        {/* Mobile: one grid so each feature row shares height across columns */}
        <div className="grid grid-cols-2 gap-x-3 md:hidden">
          <div className="flex flex-col items-center gap-6 rounded-tl-2xl bg-gradient-to-b from-[#15204a] to-[#2a3360] px-4 pb-2 pt-8 text-center text-white">
            <img
              src="/images/marketing/glp1-hero-merged.png"
              alt="HealSend GLP-1 medications"
              loading="lazy"
              className="h-28 w-auto object-contain"
            />
            <div className="font-playfair text-2xl italic">HealSend</div>
          </div>
          <div className="flex flex-col items-center gap-6 rounded-tr-2xl border border-b-0 border-gray-200 bg-white px-4 pb-2 pt-8 text-center">
            <img
              src="/images/marketing/others.webp"
              alt="Other providers' medications"
              loading="lazy"
              className="h-28 w-auto object-contain"
            />
            <div className="text-2xl font-medium text-[#5f5b70]">Others</div>
          </div>

          {healPoints.map((healPoint, i) => {
            const otherPoint = SAME_MED_OTHERS_POINTS[i];
            const isLast = i === healPoints.length - 1;
            return (
              <React.Fragment key={healPoint}>
                <motion.div
                  {...comparisonRowMotion(i)}
                  className={cn(
                    "flex h-full min-h-0 flex-col items-center justify-between gap-3 border-t border-white/10 bg-gradient-to-b from-[#15204a] to-[#2a3360] px-2 py-4 text-center text-white",
                    isLast && "rounded-bl-2xl pb-8",
                  )}
                >
                  <span className="flex flex-1 items-center text-center text-sm font-semibold leading-snug">
                    {healPoint}
                  </span>
                  <span className="flex shrink-0 items-center justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#22c55e]">
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </span>
                  </span>
                </motion.div>
                <motion.div
                  {...comparisonRowMotion(i)}
                  className={cn(
                    "flex h-full min-h-0 flex-col items-center justify-between gap-3 border-l border-r border-t border-gray-200 bg-white px-2 py-4 text-center",
                    isLast && "rounded-br-2xl border-b border-gray-200 pb-8",
                  )}
                >
                  <span className="flex flex-1 items-center text-center text-sm leading-snug text-[#5f5b70]">
                    {otherPoint}
                  </span>
                  <span className="flex shrink-0 items-center justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#cdd0d8]">
                      <Minus className="h-4 w-4 text-white" strokeWidth={3} />
                    </span>
                  </span>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="hidden grid-cols-2 gap-8 md:grid">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-gradient-to-b from-[#15204a] to-[#2a3360] px-6 py-10 text-center text-white">
            <img
              src="/images/marketing/glp1-hero-merged.png"
              alt="HealSend GLP-1 medications"
              loading="lazy"
              className="h-40 w-auto object-contain"
            />
            <div className="font-playfair text-3xl italic">HealSend</div>
            <ul className="grid w-full auto-rows-fr gap-6">
              {healPoints.map((point, i) => (
                <motion.li
                  key={point}
                  {...comparisonRowMotion(i)}
                  className="grid min-h-[120px] grid-rows-[1fr_1fr] border-t border-white/10 px-2 py-4 text-center"
                >
                  <span className="flex items-center justify-center text-center text-base font-semibold leading-snug">
                    {point}
                  </span>
                  <span className="flex items-center justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#22c55e]">
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-6 rounded-2xl bg-white px-6 py-10 text-center">
            <img
              src="/images/marketing/others.webp"
              alt="Other providers' medications"
              loading="lazy"
              className="h-40 w-auto object-contain"
            />
            <div className="text-3xl font-medium text-[#5f5b70]">Others</div>
            <ul className="grid w-full auto-rows-fr gap-6">
              {SAME_MED_OTHERS_POINTS.map((point, i) => (
                <motion.li
                  key={point}
                  {...comparisonRowMotion(i)}
                  className="grid min-h-[120px] grid-rows-[1fr_1fr] border-t border-white/10 px-2 py-4 text-center"
                >
                  <span className="flex items-center justify-center text-center text-base leading-snug text-[#5f5b70]">
                    {point}
                  </span>
                  <span className="flex items-center justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#cdd0d8]">
                      <Minus className="h-4 w-4 text-white" strokeWidth={3} />
                    </span>
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

export function RelatedProductsSection({ products }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="bg-[#f9f9f9] px-4 pb-12 pt-10 md:px-8 md:pb-16 md:pt-12">
      <div className="mx-auto max-w-[600px]">
        <h3 className="mb-5 text-lg font-medium text-gray-900">
          Related Products
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href || getMarketingProductDetailPath(product.id)}
              className="flex flex-col items-center rounded-[1rem] border border-gray-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[1rem]">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full max-h-[160px] w-full rounded-[1rem] object-contain"
                />
              </div>
              <span className="text-xs font-medium text-gray-500">
                {product.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FDADisclaimerSection({ priceNote } = {}) {
  return (
    <section className="bg-[#f9f9f9] px-4 pb-10 pt-6 md:px-8 md:pb-14">
      <div className="mx-auto max-w-[600px] space-y-5">
        <div className="rounded-[1rem] bg-gray-100 p-4 text-xs leading-relaxed text-gray-700">
          The statements on this page have not been evaluated by the Food and
          Drug Administration. This product is not intended to diagnose, treat,
          cure or prevent any disease.
        </div>
        {priceNote ? (
          <div className="text-[11px] leading-relaxed text-gray-600">
            <p>{priceNote}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SupportAvailabilitySection() {
  return (
    <section className="bg-white px-5 py-12 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative aspect-[1.08/1] overflow-hidden rounded-2xl">
          <Image
            src="/images/marketing/bundle/care-support-lifestyle.webp"
            alt="HealSend care support"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-center"
          />
        </div>

        <div className="max-w-[34rem] lg:justify-self-center">
          <h2 className="font-headline text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#111621] sm:text-[3rem] lg:text-[3.7rem]">
            We&apos;re here when
            <br />
            <span className="italic text-[#5d62f3]">You need us.</span>
          </h2>
          <div className="mt-8 space-y-6">

            <div className="flex items-center gap-4">
              <span className="w-6 flex-shrink-0 flex items-center justify-center text-[#30394d]">
                <Clock3 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.98rem] font-medium text-[#626b7f]">
                  Always available
                </p>
                <p className="mt-1 whitespace-nowrap text-[0.95rem] font-semibold leading-[1.22] text-[#434b5d] md:text-[1.28rem]">
                  7 days a week · 8:00am - 8:00pm ET
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-6 flex-shrink-0 flex items-center justify-center text-[#30394d]">
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

            <div className="flex items-center gap-4">
              <span className="w-6 flex-shrink-0 flex items-center justify-center text-[#30394d]">
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

            <div className="flex items-center gap-4">
              <span className="w-6 flex-shrink-0 flex items-center justify-center text-[#30394d]">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.98rem] font-medium text-[#626b7f]">
                  Patient care line
                </p>
                <a
                  href="tel:+16318009294"
                  className="mt-1 inline-block text-[1.28rem] font-semibold leading-[1.22] text-[#434b5d]"
                >
                  1-631-800-9294
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/** Single benefit card (shared by native mobile strip + Embla from md). */
function TirzepatideBenefitCard({ item, index, benefitsCount }) {
  const label =
    item.ctaText?.trim() ||
    (index === benefitsCount - 1 ? "Get Started" : "");
  const showCta = Boolean(label);
  const hasDesc = item.description && item.description.length > 0;
  return (
    <article className="group relative h-[420px] select-none overflow-hidden rounded-[1.25rem] shadow-md ring-1 ring-black/5 md:h-[460px]">
      <img
        src={item.image}
        alt={item.alt}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 p-6 transition-all duration-500 ease-out md:p-7",
          hasDesc
            ? "bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.92)_100%)] lg:bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.6)_40%,rgba(0,0,0,0.92)_100%)] lg:group-hover:inset-y-0 lg:group-hover:bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.5)_20%,rgba(0,0,0,0.93)_50%)]"
            : "bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.6)_60%,rgba(0,0,0,0.85)_100%)]",
        )}
      >
        <div className={cn("flex h-full flex-col", hasDesc ? "justify-end" : "justify-end")}>
          <p className="text-[1.25rem] font-semibold leading-snug text-white md:text-[1.45rem]">
            {item.title}
          </p>
          {hasDesc && (
            <ul className="mt-3 max-h-[300px] space-y-1.5 overflow-hidden opacity-100 transition-all duration-500 ease-out lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-[300px] lg:group-hover:opacity-100">
              {item.description.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-[0.85rem] leading-snug text-white/90">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {line}
                </li>
              ))}
            </ul>
          )}
          {showCta ? (
            <Link
              href={item.ctaHref}
              className="hs-solid-btn mt-4 inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold shadow-[0_10px_28px_rgba(109,111,252,0.4)] md:min-h-[3.75rem] md:px-8 md:py-4 md:text-[1.05rem]"
            >
              {label}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * Tirzepatide benefits carousel (static slide set), same layout as main carousel but separate from CMS data.
 */
export function RestoredTirzepatideBenefitsCarouselSection({
  productData,
  isHomepage = false,
  heading = "Explore Our Treatments & Benefits",
}) {
  const [api, setApi] = useState(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const ctaHref = getPrimaryCtaHref(productData);

  useEffect(() => {
    if (!api) {
      return;
    }
    const updateScrollLocks = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };
    updateScrollLocks();
    api.on("select", updateScrollLocks);
    api.on("reInit", updateScrollLocks);
    return () => {
      api.off("select", updateScrollLocks);
      api.off("reInit", updateScrollLocks);
    };
  }, [api]);

  if (!showWeightLossBenefitsCarousel(productData, isHomepage)) {
    return null;
  }

  const benefits = (() => {
    const items = TIRZEPATIDE_BENEFITS_CAROUSEL;
    const valid = items.filter(
      (item) =>
        item.image && String(item.text || item.title || "").trim(),
    );
    return valid.map((item, index) => {
      const isLast = index === valid.length - 1;
      const title = item.text || item.title || "";
      const rawCta =
        item.ctaText != null && item.ctaText !== "" ? String(item.ctaText) : "";
      return {
        title,
        image: item.image,
        alt: item.alt || item.title || item.text || "Benefit card image",
        ctaText: isLast ? (rawCta.trim() || "Get Started") : rawCta.trim(),
        ctaHref: item.ctaHref || ctaHref,
        description: item.description || [],
      };
    });
  })();

  return (
    <section
      id="tirzepatide-benefits-classic"
      aria-labelledby="tirzepatide-benefits-classic-heading"
      className="scroll-mt-24 bg-white pt-8 pb-8 md:pt-10 md:pb-12"
    >
      <div className="mx-auto max-w-[1340px] px-4 md:px-8">
        <h2
          id="tirzepatide-benefits-classic-heading"
          className="mb-10 text-center font-title text-3xl font-bold tracking-tight text-[#101726] md:mb-12 md:text-4xl lg:text-5xl"
        >
          {heading}
        </h2>

        {benefits.length === 0 ? (
          <p className="text-center text-sm text-gray-600">
            Benefit carousel is unavailable.
          </p>
        ) : (
          <>
            {/*
              Native horizontal scroll below md: Embla touch-drag often cancels when vertical
              movement competes with horizontal on tall cards (see DragHandler in embla-carousel).
            */}
            <div
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain py-0.5 pl-3 pr-4 pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] scroll-pl-3 scroll-pr-4 md:hidden [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-roledescription="carousel"
              aria-label="Treatments and benefits"
            >
              {benefits.map((item, index) => (
                <div
                  key={`restored-m-${item.title}-${index}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${benefits.length}`}
                  className="min-w-0 shrink-0 grow-0 basis-[88%] snap-start snap-always"
                >
                  <TirzepatideBenefitCard
                    item={item}
                    index={index}
                    benefitsCount={benefits.length}
                  />
                </div>
              ))}
              <div className="w-4 shrink-0" aria-hidden />
            </div>

            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                containScroll: "trimSnaps",
                loop: true,
              }}
              className="hidden w-full md:block"
            >
              <CarouselContent className="-ml-4 items-stretch md:-ml-6">
                {benefits.map((item, index) => {
                  const isCenter = index === 1;
                  return (
                    <CarouselItem
                      key={`restored-${item.title}-${index}`}
                      className={cn(
                        "basis-[88%] pl-4 sm:basis-[60%] md:pl-6 lg:basis-[33.333%]",
                        isCenter ? "md:col-span-2" : "",
                      )}
                    >
                      <TirzepatideBenefitCard
                        item={item}
                        index={index}
                        benefitsCount={benefits.length}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>

            <div className="mt-6 hidden items-center justify-end gap-4 md:flex">
              {/* <div className="h-px flex-1 bg-gray-200" /> */}
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={!canScrollPrev}
                  onClick={() => api?.scrollPrev()}
                  aria-label="Previous benefit"
                  className={cn(
                    benefitCarouselNavButtonClassName,
                    !canScrollPrev &&
                    "opacity-55 cursor-not-allowed border-gray-200 text-gray-400 hover:bg-white",
                  )}
                >
                  <ChevronLeft
                    className={cn(
                      "h-5 w-5 shrink-0",
                      !canScrollPrev && "text-gray-400",
                    )}
                  />
                </button>
                <button
                  type="button"
                  disabled={!canScrollNext}
                  onClick={() => api?.scrollNext()}
                  aria-label="Next benefit"
                  className={cn(
                    benefitCarouselNavButtonClassName,
                    !canScrollNext &&
                    "opacity-55 cursor-not-allowed border-gray-200 text-gray-400 hover:bg-white",
                  )}
                >
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 shrink-0",
                      !canScrollNext && "text-gray-400",
                    )}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

const COMPARE_ROWS = [
  { feature: "Monthly cost", healsend: "From $89/mo", others: "$99–$199/mo", doctor: "$250–$500+/mo" },
  { feature: "Lab work included", healsend: true, others: "Extra $145+", doctor: "Extra $200+" },
  { feature: "At-home blood draw", healsend: true, others: false, doctor: false },
  { feature: "Free shipping", healsend: true, others: "Varies", doctor: "N/A" },
  { feature: "Clinician messaging", healsend: "Unlimited", others: "Limited", doctor: "Office visits only" },
  { feature: "Time to prescription", healsend: "48 hours", others: "1–2 weeks", doctor: "2–4 weeks" },
  { feature: "Cancel anytime", healsend: true, others: "Annual lock-in", doctor: "N/A" },
  { feature: "Fertility preservation options", healsend: true, others: "Some", doctor: "Rarely discussed" },
  { feature: "503B FDA-registered pharmacy", healsend: true, others: "Varies", doctor: "Retail pharmacy" },
];

const ENCLO_VS_TRT_ROWS = [
  { feature: "How it works", enclo: "Signals your body to make more testosterone naturally", trt: "Replaces your natural production with external testosterone" },
  { feature: "Average T increase", enclo: "2× baseline", trt: "5× baseline", note: true },
  { feature: "Fertility preserved", enclo: true, trt: false },
  { feature: "Sperm production", enclo: "Maintained or improved", trt: "Often suppressed or eliminated" },
  { feature: "Testicular size", enclo: "Preserved", trt: "Commonly shrinks" },
  { feature: "Delivery", enclo: "One pill daily", trt: "Weekly injections" },
  { feature: "Dependency risk", enclo: "None — stop anytime, levels return to baseline", trt: "High — stopping can crash T below original levels" },
  { feature: "Estrogen management", enclo: "Built-in (blocks estrogen receptors)", trt: "Often requires additional AI medication" },
  { feature: "Lab monitoring", enclo: "Every 6 weeks", trt: "Every 6–12 weeks" },
  { feature: "Best for", enclo: "Men wanting natural optimization + fertility", trt: "Men wanting maximum T regardless of trade-offs" },
];

export function EnclomipheneVsTrtSection() {
  const rows = ENCLO_VS_TRT_ROWS;

  function renderIcon(val) {
    if (val === true) return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100"><Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} /></span>;
    if (val === false) return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50"><X className="h-3.5 w-3.5 text-red-400" strokeWidth={3} /></span>;
    return null;
  }

  return (
    <section className="scroll-mt-24 bg-[#F7F5FA] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-white px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#6D6FFC] ring-1 ring-[#6D6FFC]/10">
            Head-to-head
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl font-title text-[2rem] font-bold leading-[1.1] tracking-tight text-[#101726] sm:text-[2.5rem] lg:text-[3rem]">
            Enclomiphene vs TRT — <em className="text-[#6D6FFC]">the real trade-offs.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-gray-500 md:text-[1.05rem]">
            Both raise testosterone. Only one keeps your body&apos;s own production running.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {/* Enclomiphene card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#6D6FFC] to-[#5550E8] p-6 text-white shadow-xl md:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="relative">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Recommended</span>
              <h3 className="mt-3 text-2xl font-bold md:text-3xl">Enclomiphene</h3>
              <p className="mt-1 text-sm text-white/70">Oral capsule · No injections · No dependency</p>
              <div className="mt-6 space-y-0">
                {rows.map((row) => (
                  <div key={`e-${row.feature}`} className="flex items-start gap-3 border-t border-white/10 py-3.5">
                    <div className="mt-0.5 shrink-0">
                      {typeof row.enclo === 'boolean' ? (
                        row.enclo
                          ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/25"><Check className="h-3 w-3 text-emerald-300" strokeWidth={3} /></span>
                          : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400/20"><X className="h-3 w-3 text-red-300" strokeWidth={3} /></span>
                      ) : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15"><span className="h-1.5 w-1.5 rounded-full bg-white/60" /></span>}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{row.feature}</p>
                      <p className="mt-0.5 text-[0.92rem] font-medium leading-snug text-white/95">
                        {typeof row.enclo === 'boolean' ? (row.enclo ? 'Yes' : 'No') : row.enclo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TRT card */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-md ring-1 ring-gray-100 md:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gray-50" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gray-50" />
            <div className="relative">
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">Alternative</span>
              <h3 className="mt-3 text-2xl font-bold text-[#101726] md:text-3xl">Injectable TRT</h3>
              <p className="mt-1 text-sm text-gray-400">Testosterone Cypionate · Weekly injection</p>
              <div className="mt-6 space-y-0">
                {rows.map((row) => (
                  <div key={`t-${row.feature}`} className="flex items-start gap-3 border-t border-gray-100 py-3.5">
                    <div className="mt-0.5 shrink-0">
                      {typeof row.trt === 'boolean' ? renderIcon(row.trt) : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100"><span className="h-1.5 w-1.5 rounded-full bg-gray-300" /></span>}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">{row.feature}</p>
                      <p className="mt-0.5 text-[0.92rem] font-medium leading-snug text-gray-500">
                        {typeof row.trt === 'boolean' ? (row.trt ? 'Yes' : 'No') : row.trt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[1200px] rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-gray-100 md:px-8">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC]/10 text-sm font-bold text-[#6D6FFC]">&#9432;</span>
            <p className="text-[0.88rem] leading-relaxed text-gray-500">
              <strong className="text-[#101726]">Note on T levels:</strong> TRT delivers higher absolute testosterone because it&apos;s direct replacement. Enclomiphene produces a more moderate increase (typically 2×) but preserves your body&apos;s natural hormone axis, fertility, and testicular function. Your clinician will help you decide which trade-off fits your goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ComparisonTableSection() {
  function renderCell(val) {
    if (val === true) return <Check className="mx-auto h-5 w-5 text-emerald-500" strokeWidth={2.5} />;
    if (val === false) return <X className="mx-auto h-5 w-5 text-gray-300" strokeWidth={2.5} />;
    return <span>{val}</span>;
  }

  return (
    <section className="scroll-mt-24 bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#EDE9F6] px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#6D6FFC]">
            Why HealSend
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl font-title text-[2rem] font-bold leading-[1.1] tracking-tight text-[#101726] sm:text-[2.5rem] lg:text-[3rem]">
            How we compare — <em className="text-[#6D6FFC]">honestly.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-gray-500 md:text-[1.05rem]">
            We publish what others bury. Here&apos;s a side-by-side look at what you actually get.
          </p>
        </div>

        <div className="relative mt-12 overflow-x-auto rounded-2xl ring-1 ring-gray-100">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-[#F7F5FA]">
                <th className="py-4 pl-6 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:pl-8">Feature</th>
                <th className="px-4 py-4 text-center">
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="rounded-full bg-[#6D6FFC] px-3 py-0.5 text-xs font-bold text-white">Recommended</span>
                    <span className="text-sm font-bold text-[#101726]">HealSend</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-400">Online TRT Clinics</th>
                <th className="px-4 py-4 pr-6 text-center text-sm font-semibold text-gray-400 md:pr-8">Local Doctor</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => (
                <tr key={row.feature} className={cn("transition-colors hover:bg-[#FAF8FB]", i % 2 === 0 ? "bg-white" : "bg-[#FDFCFE]")}>
                  <td className="py-3.5 pl-6 pr-4 text-[0.9rem] font-medium text-[#101726] md:pl-8">{row.feature}</td>
                  <td className="px-4 py-3.5 text-center text-[0.9rem] font-semibold text-[#6D6FFC]">{renderCell(row.healsend)}</td>
                  <td className="px-4 py-3.5 text-center text-[0.9rem] text-gray-400">{renderCell(row.others)}</td>
                  <td className="px-4 py-3.5 pr-6 text-center text-[0.9rem] text-gray-400 md:pr-8">{renderCell(row.doctor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Based on publicly available pricing and features as of 2026. Individual experiences may vary.
        </p>
      </div>
    </section>
  );
}

export function NinetyDayLevelsSection() {
  const dataPoints = [
    { label: "Day 0", value: 280, x: 10 },
    { label: "Week 2", value: 380, x: 27.5 },
    { label: "Week 4", value: 540, x: 47.5 },
    { label: "Week 8", value: 780, x: 70 },
    { label: "Week 12", value: 920, x: 92 },
  ];

  const yMin = 200;
  const yMax = 1050;
  const chartH = 260;
  const chartW = 540;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  function toX(pct) { return padL + (pct / 100) * innerW; }
  function toY(val) { return padT + innerH - ((val - yMin) / (yMax - yMin)) * innerH; }

  const optimalTop = toY(1000);
  const optimalBot = toY(800);
  const baselineY = toY(280);

  const pathD = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.x)},${toY(p.value)}`).join(" ");

  const curveD = (() => {
    const pts = dataPoints.map(p => ({ x: toX(p.x), y: toY(p.value) }));
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * 0.4;
      const cp1y = pts[i - 1].y;
      const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) * 0.4;
      const cp2y = pts[i].y;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i].x},${pts[i].y}`;
    }
    return d;
  })();

  const yTicks = [200, 400, 600, 800, 1000];

  return (
    <section className="scroll-mt-24 bg-[#F7F5FA] py-10 md:py-16">
      <div className="mx-auto max-w-[1340px] px-4 md:px-8">
        <div className="text-center">
          <h2 className="font-title text-[2rem] font-bold leading-[1.1] tracking-tight text-[#101726] sm:text-[2.5rem] lg:text-[3rem]">
            What your levels actually do
            <br />
            over <em className="text-[#6D6FFC]">90 days.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-gray-500 md:text-[1.05rem]">
            Average HealSend member labs vs. baseline, measured over the first 12 weeks of treatment.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1100px] gap-6 md:grid-cols-[380px_1fr] md:items-start lg:grid-cols-[420px_1fr]">
          {/* Left — member card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
            <div className="relative">
              <div className="h-[300px] bg-gray-200 md:h-[340px]">
                <img
                  src="/images/slider/Copy of look-studio-S0T98VD2KZs-unsplash.jpg"
                  alt="Marcus T., verified HealSend member"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Verified member
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#101726]">Marcus T., 42</h3>
              <p className="mt-1 text-sm text-gray-400">Father of two · Started enclomiphene 12 weeks ago</p>
              <blockquote className="mt-4 border-l-[3px] border-[#6D6FFC] py-1 pl-4 text-[0.95rem] italic leading-relaxed text-gray-600">
                &ldquo;By week 6 I felt like myself again. Energy back, gym numbers back, and we&apos;re still trying for our third.&rdquo;
              </blockquote>
              <div className="mt-5 flex gap-8">
                <div>
                  <p className="text-xl font-bold text-[#6D6FFC]">280→920</p>
                  <p className="text-xs text-gray-400">Total T (ng/dL)</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#6D6FFC]">3.3×</p>
                  <p className="text-xs text-gray-400">Increase in 12 weeks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — chart */}
          <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5 md:p-7">
            <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Optimal zone */}
              <rect x={padL} y={optimalTop} width={innerW} height={optimalBot - optimalTop} fill="#6D6FFC" opacity="0.08" rx="4" />
              <text x={padL + 6} y={optimalTop + 14} fill="#6D6FFC" fontSize="8" fontWeight="600" fontFamily="sans-serif" opacity="0.7">
                OPTIMAL ZONE · 800–1000 ng/dL
              </text>

              {/* Y axis ticks */}
              {yTicks.map(v => (
                <g key={v}>
                  <line x1={padL} y1={toY(v)} x2={padL + innerW} y2={toY(v)} stroke="#E5E7EB" strokeWidth="0.7" />
                  <text x={padL - 8} y={toY(v) + 3} fill="#9CA3AF" fontSize="8" textAnchor="end" fontFamily="sans-serif">{v}</text>
                </g>
              ))}

              {/* Y axis label */}
              <text x="12" y={padT + innerH / 2} fill="#9CA3AF" fontSize="7" textAnchor="middle" fontFamily="sans-serif" transform={`rotate(-90, 12, ${padT + innerH / 2})`}>
                Total T (ng/dL)
              </text>

              {/* Baseline dashed line */}
              <line x1={padL} y1={baselineY} x2={padL + innerW} y2={baselineY} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="5 4" />

              {/* Curve */}
              <path d={curveD} stroke="#6D6FFC" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Data points + labels */}
              {dataPoints.map((p, i) => {
                const cx = toX(p.x);
                const cy = toY(p.value);
                const isLast = i === dataPoints.length - 1;
                return (
                  <g key={p.label}>
                    <circle cx={cx} cy={cy} r={isLast ? 6 : 4} fill={isLast ? "#E87461" : "#6D6FFC"} />
                    {isLast && <circle cx={cx} cy={cy} r="10" fill="#E87461" opacity="0.2" />}
                    {/* X label */}
                    <text x={cx} y={padT + innerH + 18} fill="#6B7280" fontSize="8" textAnchor="middle" fontFamily="sans-serif">{p.label}</text>
                    {/* Value */}
                    <text x={cx} y={padT + innerH + 30} fill={isLast ? "#E87461" : "#6D6FFC"} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">{p.value}</text>
                    {/* Callout for last point */}
                    {isLast && (
                      <g>
                        <rect x={cx - 48} y={cy - 24} width="58" height="18" rx="9" fill="#E87461" />
                        <text x={cx - 19} y={cy - 12} fill="white" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">+640 ng/dL · 3.3×</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.78rem] text-gray-500">
              <span className="flex items-center gap-2">
                <span className="h-[3px] w-5 rounded-full bg-[#6D6FFC]" />
                Average HealSend member on enclomiphene
              </span>
              <span className="flex items-center gap-2">
                <span className="h-[2px] w-5 border-t-[2px] border-dashed border-gray-400" />
                Untreated baseline (no medication)
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-3.5 w-5 rounded-sm bg-[#6D6FFC]/10" />
                Optimal range (800–1000 ng/dL)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowEnclomipheneWorksSection() {
  const pathwaySteps = [
    {
      num: 1,
      title: "Hypothalamus",
      desc: "Enclomiphene blocks estrogen receptors in your brain — removing the brake on your hormone signal.",
      tag: "Where it acts",
    },
    {
      num: 2,
      title: "Pituitary",
      desc: "Your brain releases more LH and FSH — the messenger hormones that talk to your testicles.",
      tag: "Signal cascade",
    },
    {
      num: 3,
      title: "Testicles",
      desc: "Your testicles ramp up natural testosterone production — and keep producing sperm normally.",
      tag: "Production restored",
    },
    {
      num: 4,
      title: "Bloodstream",
      desc: "Total and free T rise to optimal levels — without the shutdown TRT causes.",
      tag: "2× T levels",
    },
  ];

  return (
    <section className="scroll-mt-24 bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1340px] px-4 md:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#EDE9F6] px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#6D6FFC]">
            How Enclomiphene Works
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl font-title text-[2rem] font-bold leading-[1.1] tracking-tight text-[#101726] sm:text-[2.5rem] lg:text-[3rem]">
            Your body already makes testosterone.
            <br />
            <em className="text-[#6D6FFC]">Enclomiphene tells it to make more.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-gray-500 md:text-[1.05rem]">
            Unlike TRT, which replaces what your body makes, enclomiphene gently restarts your own production by targeting one tiny signal in your brain.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1100px] rounded-3xl bg-[#FAFAFE] p-6 ring-1 ring-gray-100 md:p-10">
          <div className="grid items-end gap-6 md:grid-cols-[220px_1fr]">
            {/* Body diagram */}
            <div className="relative mx-auto flex w-[180px] items-end justify-center md:mx-0 md:w-full">
              <svg viewBox="0 0 220 380" className="h-full max-h-[420px] w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Human body silhouette */}
                <path d="M 110 14 Q 86 14 86 38 Q 86 56 100 64 L 100 76 Q 76 80 70 110 L 56 156 Q 50 218 64 222 L 76 220 L 80 250 L 80 320 Q 80 332 88 332 L 96 332 L 96 296 L 110 296 L 124 296 L 124 332 L 132 332 Q 140 332 140 320 L 140 250 L 144 220 L 156 222 Q 170 218 164 196 L 150 110 Q 144 80 120 76 L 120 64 Q 134 56 134 38 Q 134 14 110 14 Z" fill="#FAF8FB" stroke="#D2C2DC" strokeWidth="1.2" />

                {/* Brain dot */}
                <circle cx="110" cy="32" r="5" fill="#3D3270" />
                {/* Pituitary dot */}
                <circle cx="110" cy="58" r="3.5" fill="#3D3270" />

                {/* Dashed line from brain down through body */}
                <line x1="110" y1="64" x2="110" y2="250" stroke="#3D3270" strokeWidth="1.5" strokeDasharray="6 5" />

                {/* LH label */}
                <text x="118" y="140" fill="#3D3270" fontSize="12" fontWeight="600" fontFamily="sans-serif">LH</text>
                {/* FSH label */}
                <text x="118" y="200" fill="#3D3270" fontSize="12" fontWeight="600" fontFamily="sans-serif">FSH</text>

                {/* Orange arrow up */}
                <line x1="110" y1="280" x2="110" y2="258" stroke="#E87461" strokeWidth="2" />
                <polygon points="105,262 110,250 115,262" fill="#E87461" />

                {/* Testicle dots */}
                <ellipse cx="100" cy="290" rx="6" ry="7" fill="#3D3270" />
                <ellipse cx="120" cy="290" rx="6" ry="7" fill="#3D3270" />

                {/* T↑ label */}
                <text x="132" y="294" fill="#E87461" fontSize="11" fontWeight="700" fontFamily="sans-serif">T↑</text>

                {/* Badge 1 - right of head */}
                <line x1="115" y1="32" x2="145" y2="28" stroke="#3D3270" strokeWidth="0.75" />
                <circle cx="158" cy="28" r="13" fill="#3D3270" />
                <text x="158" y="33" fill="white" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">1</text>

                {/* Badge 2 - below badge 1 */}
                <line x1="114" y1="58" x2="145" y2="58" stroke="#3D3270" strokeWidth="0.75" />
                <circle cx="158" cy="58" r="13" fill="#3D3270" />
                <text x="158" y="63" fill="white" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">2</text>

                {/* Badge 4 - left of abdomen (orange) */}
                <circle cx="30" cy="230" r="13" fill="#E87461" />
                <text x="30" y="235" fill="white" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">4</text>
                <line x1="43" y1="230" x2="58" y2="230" stroke="#E87461" strokeWidth="0.75" />

                {/* Badge 3 - right of testicles */}
                <circle cx="185" cy="290" r="13" fill="#3D3270" />
                <text x="185" y="295" fill="white" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">3</text>
                <line x1="172" y1="290" x2="148" y2="290" stroke="#3D3270" strokeWidth="0.75" />
              </svg>
            </div>

            {/* 4 cards grid */}
            <div className="mb-8 grid auto-rows-min gap-4 sm:grid-cols-2">
              {pathwaySteps.map((step) => (
                <div key={step.num} className="cursor-default rounded-2xl bg-[#F4F1FA] px-4 py-4 transition-all duration-300 hover:bg-[#6D6FFC] hover:shadow-lg hover:ring-1 hover:ring-[#6D6FFC]/30 [&:hover_h3]:text-white [&:hover_p]:text-white/80 [&:hover_span.tag]:border-white/30 [&:hover_span.tag]:bg-white/15 [&:hover_span.tag]:text-white md:px-5 md:py-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6D6FFC] text-xs font-bold text-white">
                      {step.num}
                    </span>
                    <h3 className="text-[1.05rem] font-bold text-[#101726] transition-colors duration-300">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-gray-500 transition-colors duration-300 md:line-clamp-2">{step.desc}</p>
                  <span className="tag mt-2 inline-block rounded-full border border-[#6D6FFC]/20 bg-white px-3 py-0.5 text-xs font-semibold text-[#6D6FFC] transition-all duration-300">
                    {step.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why this matters callout */}
        <div className="mx-auto mt-6 max-w-[1100px] rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-gray-100 md:px-8">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC]/10 text-sm font-bold text-[#6D6FFC]">&#9432;</span>
            <p className="text-[0.92rem] leading-relaxed text-gray-600 md:text-[0.95rem]">
              <strong className="text-[#101726]">Why this matters:</strong> Traditional TRT shuts down this entire pathway because your body senses external testosterone and stops making its own. Enclomiphene does the opposite — it keeps the whole system running, just at a higher set point. That&apos;s why fertility and testicular size are preserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DailyProtocolSection() {
  const days = [
    { label: "M", filled: true },
    { label: "T", filled: true },
    { label: "W", filled: true },
    { label: "T", filled: true, active: true },
    { label: "F", filled: false },
    { label: "S", filled: false },
    { label: "S", filled: false },
  ];

  const steps = [
    {
      num: 1,
      title: "Take with breakfast",
      desc: "One capsule, swallowed whole. Most patients pair it with their morning coffee or first meal.",
    },
    {
      num: 2,
      title: "Track in your dashboard",
      desc: "Optional check-ins so your clinician sees your symptoms, energy, and side effects in real time.",
    },
    {
      num: 3,
      title: "Bloodwork at week 6",
      desc: "Phlebotomist comes to your home. Your dose is titrated based on the result — not guessed.",
    },
    {
      num: 4,
      title: "Stop anytime",
      desc: "Unlike TRT, you can pause or quit without shutdown protocols. Your levels return to baseline naturally.",
    },
  ];

  const timeline = [
    { week: "Week 1–2:", result: "Energy and morning wood return." },
    { week: "Week 3–4:", result: "Mood lifts, drive comes back." },
    { week: "Week 6–8:", result: "Total T peaks. Body comp shifts." },
    { week: "Week 12+:", result: "Steady-state. Strength gains." },
  ];

  return (
    <section className="scroll-mt-24 bg-[#F4F1FA] py-10 md:py-16">
      <div className="mx-auto grid max-w-[1340px] gap-12 px-4 md:grid-cols-2 md:items-start md:gap-16 md:px-8">
        <div>
          <h2 className="font-title text-[2.2rem] font-bold leading-[1.05] tracking-tight text-[#101726] sm:text-[2.8rem] lg:text-[3.5rem]">
            One pill. Same time.
            <br />
            <em className="text-[#6D6FFC]">Every day.</em>
          </h2>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-gray-600 md:text-[1.1rem]">
            No injections to schedule. No creams to apply. No clinic visits. The simplest TRT-alternative protocol on the market.
          </p>

          <div className="mt-10 space-y-0">
            {steps.map((step, i) => (
              <div key={step.num} className={cn("flex items-start gap-4 py-5", i < steps.length - 1 && "border-b border-gray-200/80")}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC] text-sm font-bold text-white">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-[1.05rem] font-bold text-[#101726] md:text-[1.1rem]">{step.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
            <img
              src="/images/marketing/bundle/care-support-lifestyle.webp"
              alt="Morning ritual"
              className="h-[260px] w-full object-cover object-center md:h-[300px]"
            />
            <div className="flex items-center gap-2 bg-white px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-sm font-medium text-[#101726]">7:42 AM · Morning ritual</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">This week&apos;s routine</p>
            <div className="flex justify-between gap-2">
              {days.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    d.active
                      ? "bg-[#6D6FFC] text-white"
                      : d.filled
                        ? "bg-[#EDE9F6] text-[#6D6FFC]"
                        : "bg-gray-100 text-gray-300"
                  )}>
                    {d.label}
                  </span>
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    d.active ? "bg-orange-400" : d.filled ? "bg-[#6D6FFC]/60" : "bg-gray-200"
                  )} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#EDE9F6] p-6 ring-1 ring-[#6D6FFC]/10">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#6D6FFC]">What to expect</p>
            <div className="space-y-2">
              {timeline.map((t) => (
                <div key={t.week} className="flex gap-3 text-[0.92rem]">
                  <span className="w-[5.5rem] shrink-0 font-bold text-[#101726]">{t.week}</span>
                  <span className="text-gray-600">{t.result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const TREATMENT_PLAN_CARDS = [
  {
    id: "glp1",
    headerClass: "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["Most Popular", "GLP-1 Weight Loss"],
    title: "GLP-1\nWeight Loss",
    subtitle: "Tirzepatide & Semaglutide",
    image: "/images/marketing/bundle/tirzepatide-injections-product.png",
    bulletsHeading: "WHAT YOU GET",
    bullets: [
      { icon: Target, text: "Clinician-prescribed GLP-1 injections that target appetite at the source" },
      { icon: TrendingUp, text: "Real, measurable weight loss — not willpower" },
      { icon: Syringe, text: "Once-weekly injection your clinician dials in to your body" },
    ],
    primaryCta: "Start GLP-1",
    secondaryCta: "Why GLP-1?",
    href: "/weight-loss",
    description: "Clinician-prescribed GLP-1 injections that calm food noise, ease cravings, and support steady, predictable progress.",
    whyItWorks: [
      "Feel full sooner and stay full longer",
      "Quiets persistent food cravings between meals",
      "Supports gradual, sustainable fat loss",
    ],
    bestFor: [
      "Anyone ready for real, clinician-guided weight loss",
      "Members who want steady, predictable progress",
    ],
  },
  {
    id: "trt",
    headerClass: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["For Men", "Testosterone Therapy"],
    title: "TRT —\nTestosterone",
    subtitle: "Testosterone Cypionate Injections",
    image: "/images/marketing/bundle/sermorelin-product.png",
    bulletsHeading: "WHAT YOU GET",
    bullets: [
      { icon: Zap, text: "Restore energy, strength, and drive with clinician-guided TRT" },
      { icon: FlaskConical, text: "Lab-monitored and delivered to your door" },
      { icon: Stethoscope, text: "Ongoing clinician support and dose optimization" },
    ],
    primaryCta: "Start TRT",
    secondaryCta: "Why TRT?",
    href: "/trt",
    description: "Restore energy, strength, and drive with clinician-guided testosterone replacement. Lab-monitored and delivered to your door.",
    whyItWorks: [
      "Boosts energy, mood, and physical performance",
      "Clinician-monitored dosing for safe, steady results",
      "Convenient at-home injections with ongoing lab work",
    ],
    bestFor: [
      "Men with clinically low testosterone",
      "Anyone experiencing fatigue, low drive, or muscle loss",
    ],
  },
  {
    id: "enclomiphene",
    headerClass: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["Fertility Safe", "Natural Support"],
    title: "Enclomiphene",
    subtitle: "Natural Testosterone Support",
    image: "/images/marketing/bundle/enclomiphene-product.webp",
    bulletsHeading: "WHAT YOU GET",
    bullets: [
      { icon: ShieldCheck, text: "Boost testosterone naturally without shutting down your body's own production" },
      { icon: Star, text: "Fertility-safe — one pill daily" },
      { icon: TrendingUp, text: "Supports natural hormone balance and energy" },
    ],
    primaryCta: "Start Enclomiphene",
    secondaryCta: "Why Enclomiphene?",
    href: "/enclomiphene",
    description: "Boost testosterone naturally without shutting down your body's own production. Fertility-safe, one pill daily.",
    whyItWorks: [
      "Stimulates your body's own testosterone production",
      "Preserves fertility — unlike traditional TRT",
      "Simple daily oral pill, no injections required",
    ],
    bestFor: [
      "Men who want to preserve fertility",
      "Anyone looking for a natural testosterone boost",
    ],
  },
];

const ENCLO_COMPARISON_TABLE_ROWS = [
  { label: "Increases testosterone", enclo: "2x", trt: "5x", encloIcon: null, trtIcon: null },
  { label: "Maintains fertility", enclo: null, trt: null, encloIcon: "check", trtIcon: "x" },
  { label: "No dependency", enclo: null, trt: null, encloIcon: "check", trtIcon: "x" },
  { label: "Ease", enclo: null, trt: null, encloIcon: "check", trtIcon: "x" },
  { label: "Risk of side effects", enclo: "Low", trt: "Medium", encloIcon: null, trtIcon: null },
  { label: "Function", enclo: "Boosts natural production", trt: "Adds exogenous hormones", encloIcon: null, trtIcon: null },
  { label: "Liver safety", enclo: null, trt: null, encloIcon: "check", trtIcon: "check" },
];

function ComparisonIcon({ type }) {
  if (type === "check") return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#101726]">
      <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
    </span>
  );
  if (type === "x") return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
      <X className="h-3.5 w-3.5 text-gray-400" strokeWidth={3} />
    </span>
  );
  return null;
}

function EncloVsTrtComparisonSection() {
  return (
    <section className="bg-[#F1F5F9] py-10 md:py-14">
      <div className="mx-auto max-w-[900px] px-4 md:px-8">
        <h2 className="mb-10 text-center font-title text-3xl font-bold text-[#101726] md:text-4xl">
          Enclomiphene <span className="font-playfair italic">vs.</span> TRT
        </h2>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#F1F5F9] to-transparent md:hidden" />
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="min-w-[560px]">
              {/* Header */}
              <div className="grid grid-cols-[1.2fr_1fr_1fr] items-end border-b border-gray-100 px-1 pb-0 pt-4">
                <div />
                <div className="mx-auto mb-0 w-full max-w-[180px] rounded-t-lg bg-[#6D6FFC] px-5 py-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70">HealSend</p>
                  <p className="text-sm font-semibold text-white">Enclomiphene</p>
                </div>
                <div className="pb-4 text-center">
                  <p className="text-sm font-medium text-gray-400">Traditional TRT</p>
                </div>
              </div>

              {/* Rows */}
              {ENCLO_COMPARISON_TABLE_ROWS.map((row, i) => (
                <div key={row.label} className={`grid grid-cols-[1.2fr_1fr_1fr] items-center ${i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}>
                  <div className="px-6 py-5">
                    <p className="text-sm font-semibold text-[#101726]">{row.label}</p>
                  </div>
                  <div className="flex justify-center py-5">
                    {row.encloIcon ? (
                      <ComparisonIcon type={row.encloIcon} />
                    ) : (
                      <span className="text-sm text-gray-600">{row.enclo}</span>
                    )}
                  </div>
                  <div className="flex justify-center py-5">
                    {row.trtIcon ? (
                      <ComparisonIcon type={row.trtIcon} />
                    ) : (
                      <span className="text-sm text-gray-400">{row.trt}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-gray-400 md:hidden">Swipe to compare &rarr;</p>
        </div>

        <div className="mt-10 text-center">
          <Link href="/enclomiphene" className="hs-solid-btn inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold">
            See if enclomiphene fits your goals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function OurTreatmentsSection({ cards = MEDICAL_PLANS, avatars }) {
  const [expandedId, setExpandedId] = useState(null);
  const cardElMap = useRef({});
  const [cardMinHeight, setCardMinHeight] = useState(0);

  useEffect(() => {
    const equalize = () => {
      const els = cards
        .filter((p) => p.bullets.length > 0)
        .map((p) => cardElMap.current[p.id])
        .filter(Boolean);
      if (els.length < 2) return;

      els.forEach((el) => { el.style.minHeight = ""; });

      requestAnimationFrame(() => {
        let maxH = 0;
        els.forEach((el) => { maxH = Math.max(maxH, el.offsetHeight); });
        setCardMinHeight(maxH);
      });
    };

    equalize();
    window.addEventListener("resize", equalize);
    return () => window.removeEventListener("resize", equalize);
  }, [cards]);

  return (
    <section className="bg-[#f9f9f9] pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-16">
        <div className="mb-10 grid grid-cols-1 gap-8 md:mb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-x-8 xl:gap-x-12">
          <div className="min-w-0">
            <h2 className="font-title text-3xl font-bold leading-[1.05] tracking-tight text-gray-950 sm:text-4xl lg:text-[2.625rem] xl:text-[3.15rem]">
              Medical care
            </h2>
            <p className="mt-2 font-playfair text-2xl italic leading-tight text-[#5d62f3] sm:text-3xl lg:text-[2.125rem] xl:text-[2.5rem]">
              matched to your stage and goals.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#474257] md:text-lg">
              Every treatment is prescribed by U.S.-licensed clinicians, delivered
              to your door, and backed by ongoing care.
            </p>
          </div>

          <div className="hidden w-full lg:block lg:w-auto lg:shrink-0 lg:pt-1">
            <TrustBadgesRow avatars={avatars} />
          </div>
        </div>

        <div
          className={cn(
            "mx-auto grid items-start gap-7 sm:gap-8 lg:gap-10",
            cards.length === 1 && "max-w-lg sm:grid-cols-1",
            cards.length === 2 && "max-w-[1200px] sm:grid-cols-1 lg:grid-cols-2",
            cards.length >= 3 && "max-w-[1400px] sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {cards.map((plan) => {
            const isMinimal = plan.bullets.length === 0;
            return (
              <MedicalPlanCard
                key={plan.id}
                plan={plan}
                ctaHref={plan.href || "/weight-loss"}
                spanFull={isMinimal}
                expanded={expandedId === plan.id}
                onToggleExpand={() => setExpandedId(expandedId === plan.id ? null : plan.id)}
                cardRef={(el) => { if (el) cardElMap.current[plan.id] = el; }}
                style={!isMinimal && cardMinHeight ? { minHeight: cardMinHeight } : undefined}
              />
            );
          })}
        </div>

        <div className="mt-8 lg:hidden">
          <TrustBadgesRow avatars={avatars} />
        </div>

      </div>
    </section>
  );
}

export function MobileStickyCta({ productData, ctaHref: ctaHrefProp }) {
  const ctaHref = ctaHrefProp || getPrimaryCtaHref(productData);
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const THRESHOLD = 100;

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
      <div className="px-4 pb-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pr-[5%]">
        <div className="md:flex md:justify-end">
          <Link
            href={ctaHref}
            className="hs-solid-btn inline-flex w-full min-h-[3rem] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold shadow-[0_8px_24px_rgba(109,111,252,0.35)] md:w-auto md:min-w-[280px]"
          >
            <span>Get Started</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MarketingProductPage({ product, isHomepage = false }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <WillpowerSection />
      <ProductHero productData={productData} isHomepage={isHomepage} />
      <MediaLogosBanner />

      <FadeInSection><OurTreatmentsSection /></FadeInSection>

      <RestoredTirzepatideBenefitsCarouselSection
        productData={productData}
        heading="GLP-1 Benefits"
        isHomepage={isHomepage}
      />

      {/* <FadeInSection><EncloVsTrtComparisonSection /></FadeInSection> */}

      <FadeInSection><NegativeSellSection /></FadeInSection>


      {/* <FeatureSplit productData={productData} /> */}
      <FadeInSection><SupportFeatures productData={productData} /></FadeInSection>
      <FadeInSection><TestimonialsSection /></FadeInSection>
      <FadeInSection><MemberResultsStatsSection /></FadeInSection>
      <FadeInSection><BMICalculatorPreviewSection /></FadeInSection>
      <ResearchSplit productData={productData} />
      <FadeInSection><SimpleSteps productData={productData} /></FadeInSection>
      <FadeInSection><LabTested productData={productData} /></FadeInSection>
      <FadeInSection><ComprehensiveCare productData={productData} /></FadeInSection>
      <FadeInSection><CleanSimpleEffective productData={productData} /></FadeInSection>
      <SameMedicationTrustMarqueeSection />
      <FadeInSection><SameMedicationSection planLabel="Personalized, clinically-proven GLP-1 plans" /></FadeInSection>
      <FadeInSection><FAQSection /></FadeInSection>
      <FadeInSection><SupportAvailabilitySection /></FadeInSection>
      {/* <ProductPageTestSections /> */}
      <MarketingFooter />
      <MobileStickyCta productData={productData} />
    </div>
  );
}
