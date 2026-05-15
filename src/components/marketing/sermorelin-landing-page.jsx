"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  Headset,
  Laptop,
  Minus,
  Plus,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  Heart,
  Shield,
  Star,
  Quote,
  Truck,
  Zap,
} from "lucide-react";
import {
  MinimalMarketingNavbar,
  ActiveMembersBanner,
  MarketingFooter,
} from "@/components/marketing/shared";
import {
  WillpowerVerticalColumn,
  WillpowerHorizontalRow,
  WILLPOWER_LEFT_MARQUEE_ITEMS,
  WILLPOWER_RIGHT_MARQUEE_ITEMS,
  MarketingTrustMarquee,
  LabTested,
  SupportAvailabilitySection,
  CleanSimpleEffective,
  SameMedicationSection,
  RelatedProductsSection,
  FDADisclaimerSection,
  MediaLogosBanner,
  RestoredTirzepatideBenefitsCarouselSection,
  mergeProductContent,
  SimpleSteps,
  PricingPlansTable,
  MobileStickyCta,
  BeforeAfterSliderSection,
  DarkMemberStatsSection,
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/sermorelin";

const SERMORELIN_TRUST_ITEMS = [
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "Entry-Level GH Peptide Protocol", Icon: Stethoscope },
  { text: "Free & Fast Shipping", Icon: Truck },
  { text: "U.S. Only Certified Pharmacies", Icon: null, svg: "True" },
  { text: "Always On Clinician Support", Icon: Headset },
  { text: "1,200,000+ prescriptions written", Icon: ClipboardCheck },
  { text: "FSA & HSA Eligible", Icon: BadgeCheck },
];

function FadeIn({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Willpower / Hero intro                                          */
/* ------------------------------------------------------------------ */

function SermorelinWillpowerSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1F5F9]">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-6 md:px-[3.25rem] md:py-10 lg:h-[calc(100dvh-60px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <div className="mt-3 max-w-[34rem]">
              <ActiveMembersBanner />
              <h1 className="text-balance font-title text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
                The gentlest way to{" "}
                <span className="font-playfair italic text-[#6D6FFC]">
                  start
                </span>{" "}
                feeling like yourself again.
              </h1>
              <p className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-700 lg:text-[1.05rem]">
                Sermorelin is a clinically-studied peptide that signals your
                body to produce more of its own growth hormone — naturally and
                gradually. The simplest, most accessible first step.
              </p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              <li className="flex items-start gap-3 text-sm md:text-base">
                <Zap className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
                <span>
                  <strong className="text-gray-900">Beginner-friendly</strong>{" "}
                  — designed for first-time peptide users
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
                <span>
                  <strong className="text-gray-900">Works with your body</strong>{" "}
                  — supports natural GH release, doesn't override it
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base">
                <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
                <span>
                  <strong className="text-gray-900">Clinician access + lab work included</strong>{" "}
                  — no extra fees
                </span>
              </li>
            </ul>

            <div className="mt-5 w-full">
              <div className="inline-flex w-full max-w-full flex-col items-center gap-2.5 sm:w-auto">
                <Link
                  href={CTA_HREF}
                  className="hs-solid-btn inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold sm:w-auto"
                >
                  Start consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="w-full text-center text-sm">
                  <span className="font-semibold text-gray-700">Takes 90 seconds</span> · <span className="text-gray-500">100% private · free</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: horizontal marquee rows */}
        <div className="flex flex-col gap-3 overflow-hidden lg:hidden">
          <WillpowerHorizontalRow items={WILLPOWER_LEFT_MARQUEE_ITEMS} />
          <WillpowerHorizontalRow items={WILLPOWER_RIGHT_MARQUEE_ITEMS} reverse />
        </div>

        {/* Desktop: vertical marquee columns */}
        <div className="relative hidden min-h-0 w-full shrink-0 overflow-hidden lg:block lg:h-full lg:w-[45%] lg:self-stretch xl:w-[450px]">
          <div className="grid h-full grid-cols-2 gap-3 lg:gap-4">
            <WillpowerVerticalColumn items={WILLPOWER_LEFT_MARQUEE_ITEMS} />
            <WillpowerVerticalColumn items={WILLPOWER_RIGHT_MARQUEE_ITEMS} reverse />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Product Hero                                                    */
/* ------------------------------------------------------------------ */

const SERMORELIN_HERO_BENEFITS = [
  {
    icon: ShieldCheck,
    text: "Subcutaneous once-daily injection · 5-on, 2-off cycle · supplies included.",
  },
  {
    icon: Stethoscope,
    text: "Board-certified clinician review + baseline IGF-1 labs included.",
  },
  {
    icon: BadgeCheck,
    text: "Month-to-month · cancel anytime · FSA & HSA accepted.",
  },
];

const SERMORELIN_HERO_FAQS = [
  {
    question: "What is sermorelin?",
    answer:
      "Sermorelin is a synthetic GHRH (growth hormone-releasing hormone) analog. It signals your pituitary gland to produce more of your own growth hormone — naturally, without replacing it.",
  },
  {
    question: "How quickly will I notice results?",
    answer:
      "Most members notice improved sleep quality within 1–2 weeks. Steadier energy and recovery improvements are typically felt by week 3–4. Lab-measurable IGF-1 changes are usually visible at the 60-day recheck.",
  },
  {
    question: "Is this prescription-only?",
    answer:
      "Yes. Sermorelin is a compounded prescription medication. A HealSend-affiliated clinician reviews your intake and labs before prescribing. No charge until approved.",
  },
];

function SermorelinProductHeroSection() {
  const [activeTab, setActiveTab] = useState("benefits");
  const [openFaq, setOpenFaq] = useState(null);
  const [showPriceFootnote, setShowPriceFootnote] = useState(false);

  return (
    <section className="bg-[#f9f9f9] px-4 py-6 md:px-[3.25rem] md:py-10 lg:px-[3.25rem]">
      <div className="mx-auto flex max-w-[1340px] flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6 xl:gap-8">
        {/* Left — sticky */}
        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[55%] lg:max-w-[740px]">
          <div className="flex flex-col gap-6 sm:gap-7 md:gap-10 lg:isolate lg:sticky lg:top-24 lg:z-10">
            <div className="relative z-[1] shrink-0 bg-[#f9f9f9] pb-1">
              <h2 className="text-balance text-start text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-5xl md:leading-tight">
                Sermorelin Therapy
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Subcutaneous · Once daily · 5-on, 2-off cycle
              </p>
            </div>
            <div className="relative z-0 flex aspect-[4/5] w-full shrink-0 items-start justify-start overflow-hidden rounded-[1rem] bg-[#F1F5F9] ring-1 ring-black/[0.04]">
              <div className="relative h-full w-full">
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] md:left-5 md:top-5 md:px-6 md:py-2.5 md:text-base">
                  <div className="relative h-2.5 w-2.5 md:h-3 md:w-3">
                    <span className="absolute inset-0 rounded-full bg-emerald-400/40 blur-[3px]" />
                    <span className="absolute inset-0 rounded-full bg-emerald-500" />
                  </div>
                  In Stock
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80"
                  alt="Sermorelin Therapy — in stock"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="rounded-[1rem] object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[45%] xl:w-[450px]">
          {/* Promo + price card */}
          <div className="mb-6 overflow-hidden rounded-[1rem] border border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2 bg-[#fde073] px-5 py-3.5 text-sm font-medium text-gray-900 md:text-base">
              <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
              FSA &amp; HSA Eligible
            </div>
            <div className="px-6 py-6 md:px-7 md:py-7">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">Starting at</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold text-gray-900">$249</span>
                    <span className="text-lg font-medium text-gray-600">/mo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPriceFootnote((v) => !v)}
                    className="mt-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    $199 first month on quarterly plan
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
                  <span className="flex items-center rounded-[0.6rem] bg-[#EEF0FA] px-3 py-1.5 text-[10px] font-bold text-[#6D6FFC]">
                    FSA / HSA
                  </span>
                </div>
              </div>

              {showPriceFootnote && (
                <div className="mb-4 rounded-[0.75rem] bg-gray-50 p-3 text-xs leading-5 text-gray-600">
                  $199 applies to your first month on a quarterly plan. Regular
                  price is $249/month. Includes clinician review, labs, and supplies. Cancel anytime.
                </div>
              )}

              <div className="inline-flex w-full flex-col items-center gap-2.5">
                <Link
                  href={CTA_HREF}
                  className="hs-solid-btn inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold sm:w-auto"
                >
                  Start consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="w-full text-center text-sm">
                  <span className="font-semibold text-gray-700">Takes 90 seconds</span> · <span className="text-gray-500">100% private · free</span>
                </p>
              </div>
            </div>

          </div>

          {/* Tabs card */}
          <div className="mb-6 rounded-[1rem] border border-gray-200 bg-white p-2 shadow-sm">
            <div className="mb-6 flex rounded-full bg-gray-100 p-1.5">
              {["benefits", "pricing", "description"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-full py-2.5 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
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
                  {activeTab === "benefits" &&
                    SERMORELIN_HERO_BENEFITS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex gap-3">
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                          <p className="text-[0.938rem] leading-relaxed text-gray-700 md:text-base">
                            {item.text}
                          </p>
                        </div>
                      );
                    })}

                  {activeTab === "pricing" && (
                    <PricingPlansTable footnote="Includes clinician review, labs, and supplies. Cancel anytime." />
                  )}

                  {activeTab === "description" && (
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      Sermorelin is a synthetic GHRH analog that stimulates
                      your pituitary gland to produce growth hormone naturally.
                      The 5-on, 2-off dosing cycle preserves your body's own
                      feedback loop — making it the gentlest, most sustainable
                      entry point for GH support.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-2 flex flex-col items-center gap-2 border-t border-gray-100 px-5 pb-2 pt-4 text-center text-xs text-gray-500 md:flex-row md:items-center md:justify-between md:px-6 md:text-left">
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
                <ShieldCheck className="h-4 w-4" /> FSA &amp; HSA Eligible
              </div>
            </div>
          </div>

          {/* Mini FAQs */}
          <div className="mb-6 space-y-3">
            {SERMORELIN_HERO_FAQS.map((faq, idx) => (
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
                  <div className="flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 p-1.5">
                    {openFaq === idx ? (
                      <Minus className="h-3.5 w-3.5 text-gray-600" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-3.5 w-3.5 text-gray-600" strokeWidth={2.5} />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
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
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mb-6 mt-8">
            <h3 className="mb-4 text-base font-medium text-gray-900">
              Related Products
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "tirzepatide-injections", name: "Tirzepatide Injections", image: "/images/marketing/bundle/tirzepatide-injections-product.png" },
                { id: "semaglutide-injections", name: "Semaglutide Injections", image: "/images/marketing/semaglutide.webp" },
              ].map((product) => (
                <Link
                  key={product.id}
                  href={`/${product.id}`}
                  className="flex flex-col items-center rounded-[1rem] border border-gray-200 bg-white p-4 text-center shadow-sm"
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

          <div className="space-y-5">
            <div className="rounded-[1rem] bg-gray-100 p-4 text-xs leading-relaxed text-gray-700">
              The statements on this page have not been evaluated by the Food and
              Drug Administration. This product is not intended to diagnose,
              treat, cure or prevent any disease.
            </div>
            <div className="space-y-2.5 text-[11px] leading-relaxed text-gray-600">
              <p>
                *Price shown applies to Sermorelin quarterly plan. Actual price
                will depend on plan prescribed. Final treatment fit depends on
                clinician review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Why Sermorelin                                                  */
/* ------------------------------------------------------------------ */

const WHY_CARDS = [
  {
    icon: Activity,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    title: "Gradual onset",
    desc: "Designed to help your body restore GH signaling slowly, with minimal side effects compared to stronger protocols.",
  },
  {
    icon: Zap,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    title: "Beginner-friendly dosing",
    desc: "Simple once-daily subcutaneous injection. Your clinician walks you through your first dose by video.",
  },
  {
    icon: TrendingUp,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    title: "Easy to step up later",
    desc: "Many members start here, then graduate to a more advanced GH stack with their clinician's guidance after 60–90 days.",
  },
];

function SermorelinWhySection() {
  return (
    <section className="bg-[#F1F5F9] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            Why Sermorelin
          </span>
          <h2 className="font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Start gentle.
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            Build from there.
          </p>
          <p className="mt-5 text-base text-gray-600">
            Sermorelin is the easiest, most accessible peptide for first-time
            users — and a smart on-ramp before considering more advanced GH
            protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {WHY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <FadeIn
                key={card.title}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full bg-[#EEF0FA]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 inline-flex rounded-xl bg-[#EEF0FA] p-2">
                    <Icon className="h-5 w-5 text-[#6D6FFC]" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {card.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Comparison Table                                                */
/* ------------------------------------------------------------------ */

function SermorelinComparisonSection() {
  const rows = [
    {
      label: "Intensity",
      sublabel: "How aggressive the protocol is",
      sermorelin: { text: "Gentle", sub: "Best for first-timers", purple: true },
      advanced: { text: "Stronger", sub: "More advanced" },
      nothing: { text: "—" },
    },
    {
      label: "Starting price",
      sublabel: "per month",
      sermorelin: { text: "$129", purple: true },
      advanced: { text: "$199–$249" },
      nothing: { text: "$0 (and zero results)", small: true },
    },
    {
      label: "Time to first results",
      sublabel: null,
      sermorelin: { text: "2–4 weeks", purple: true },
      advanced: { text: "2–4 weeks" },
      nothing: { text: "Never" },
    },
    {
      label: "Best for",
      sublabel: null,
      sermorelin: {
        text: "First-time peptide users, gradual support, lower commitment",
        purple: true,
        small: true,
      },
      advanced: {
        text: "Experienced users, max recovery, performance focus",
        small: true,
      },
      nothing: {
        text: "Hoping the symptoms go away on their own",
        small: true,
      },
    },
    {
      label: "Reversible",
      sublabel: null,
      sermorelin: { check: true, text: "Yes, fully", purple: true },
      advanced: { check: true, text: "Yes, fully", purple: true },
      nothing: { text: "—" },
    },
    {
      label: "Money-back guarantee",
      sublabel: null,
      sermorelin: { check: true, text: "60 days", purple: true },
      advanced: { check: true, text: "60 days", purple: true },
      nothing: { text: "—" },
    },
  ];

  function Cell({ data }) {
    if (!data) return <td className="p-4 text-center text-gray-400">—</td>;
    return (
      <td className="p-4 text-center">
        {data.check ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6D6FFC]">
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            </div>
            <span
              className={`text-sm font-semibold ${data.purple ? "text-[#6D6FFC]" : "text-gray-700"}`}
            >
              {data.text}
            </span>
          </div>
        ) : (
          <div>
            <p
              className={`font-semibold ${data.small ? "text-sm" : "text-base"} ${data.purple ? "text-[#6D6FFC]" : "text-gray-700"}`}
            >
              {data.text}
            </p>
            {data.sub && (
              <p className="mt-0.5 text-xs text-gray-500">{data.sub}</p>
            )}
          </div>
        )}
      </td>
    );
  }

  return (
    <section className="bg-[#f9f9f9] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <h2 className="font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Where Sermorelin{" "}
            <span className="font-playfair italic text-[#6D6FFC]">
              fits in.
            </span>
          </h2>
          <p className="mt-5 text-base text-gray-600">
            Sermorelin is intentionally gentler than advanced GH protocols.
            Here's how to think about which is right for where you are.
          </p>
        </div>

        <FadeIn>
          <div className="rounded-3xl bg-white shadow-sm">
            <div className="overflow-x-auto rounded-3xl pt-3">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr>
                    <th className="w-1/4 p-4" />
                    <th className="relative w-1/4 bg-[#6D6FFC] p-4 text-center">
                      <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#FF6B35] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Best for First-Timers
                      </span>
                      <span className="text-sm font-bold uppercase tracking-wider text-white">
                        Sermorelin
                      </span>
                    </th>
                    <th className="w-1/4 p-4 text-center">
                      <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
                        Advanced GH
                      </span>
                    </th>
                    <th className="w-1/4 p-4 text-center">
                      <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
                        Doing Nothing
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <td className="border-t border-gray-100 p-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {row.label}
                        </p>
                        {row.sublabel && (
                          <p className="text-xs text-gray-400">{row.sublabel}</p>
                        )}
                      </td>
                      <td className="border-t border-[#6D6FFC]/20 bg-[#6D6FFC]/5 p-4 text-center">
                        {row.sermorelin.check ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6D6FFC]">
                              <Check className="h-4 w-4 text-white" strokeWidth={3} />
                            </div>
                            <span className="text-sm font-semibold text-[#6D6FFC]">
                              {row.sermorelin.text}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <p
                              className={`font-bold text-[#6D6FFC] ${row.sermorelin.small ? "text-sm" : "text-base"}`}
                            >
                              {row.sermorelin.text}
                            </p>
                            {row.sermorelin.sub && (
                              <p className="mt-0.5 text-xs text-[#6D6FFC]/70">
                                {row.sermorelin.sub}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="border-t border-gray-100 p-4 text-center">
                        {row.advanced.check ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6D6FFC]">
                              <Check className="h-4 w-4 text-white" strokeWidth={3} />
                            </div>
                            <span className="text-sm font-semibold text-[#6D6FFC]">
                              {row.advanced.text}
                            </span>
                          </div>
                        ) : (
                          <p
                            className={`font-medium text-gray-700 ${row.advanced.small ? "text-sm" : "text-base"}`}
                          >
                            {row.advanced.text}
                          </p>
                        )}
                      </td>
                      <td className="border-t border-gray-100 p-4 text-center text-sm text-gray-400">
                        {row.nothing.text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Mechanism                                                       */
/* ------------------------------------------------------------------ */

function SermorelinMechanismSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const MECHANISM_STEPS = [
    {
      num: "01",
      title: "Hypothalamus",
      desc: "Sermorelin mimics GHRH — the natural signal that tells your brain it's time to produce growth hormone.",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
    },
    {
      num: "02",
      title: "Pituitary",
      desc: "Your pituitary gland responds with stronger natural GH pulses — especially during deep sleep, when most GH is released.",
      image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=600&q=80",
    },
    {
      num: "03",
      title: "Whole body",
      desc: "Sleep deepens, recovery improves, energy stabilizes — gradually, over 4–8 weeks.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#0B1120] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D6FFC]/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-[640px] text-center">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            How Sermorelin works
          </span>
          <h2 className="font-title text-4xl font-bold text-white md:text-5xl">
            Tap your body's own
            <br />
            <span className="font-playfair italic text-[#6D6FFC]">
              natural rhythm.
            </span>
          </h2>
          <p className="mt-5 text-base text-gray-400">
            Sermorelin doesn't replace growth hormone — it whispers to the
            part of your brain that already knows how to make it.
          </p>
        </div>

        <div ref={ref} className="grid grid-rows-[1fr] gap-6 md:grid-cols-3">
          {MECHANISM_STEPS.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.2 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:border-[#6D6FFC]/30 hover:bg-white/[0.08]"
            >
              <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-lg font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 rounded-2xl border border-[#6D6FFC]/20 bg-[#6D6FFC]/5 p-6 md:p-8"
        >
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6D6FFC]/20">
              <Shield className="h-5 w-5 text-[#6D6FFC]" />
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold text-white">
                Why "gentle"?
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Sermorelin works with your body's natural pulse pattern —
                no overriding, no forcing. That's what makes it the safest
                first step.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Outcomes                                                        */
/* ------------------------------------------------------------------ */

const OUTCOME_CARDS = [
  {
    image:
      "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&w=800&q=80",
    title: "Better sleep quality",
    desc: "May support deeper, more restorative sleep within the first few weeks.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    title: "Recovery support",
    desc: "Designed to help reduce post-training soreness and shorten recovery time.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    title: "Energy & mood",
    desc: "Members report steadier daytime energy and an overall sense of vitality.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    title: "Body composition",
    desc: "May support healthier body composition when paired with consistent training.",
  },
];

function SermorelinOutcomesSection() {
  return (
    <section className="bg-[#f9f9f9] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <h2 className="font-title text-4xl font-bold text-gray-900 md:text-5xl">
            What Sermorelin{" "}
            <span className="font-playfair italic text-[#6D6FFC]">
              may help with.
            </span>
          </h2>
          <p className="mt-5 text-base text-gray-600">
            Outcomes members typically notice in the first 60–90 days.
            Individual results vary — provider-prescribed when appropriate.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOME_CARDS.map((card) => (
            <FadeIn
              key={card.title}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full bg-[#EEF0FA]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-1.5 text-base font-bold text-gray-900">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {card.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={CTA_HREF}
            className="hs-solid-btn inline-flex items-center gap-2 rounded-full px-10 py-4 text-base font-semibold"
          >
            Start consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Timeline                                                        */
/* ------------------------------------------------------------------ */

const TIMELINE_ROWS = [
  {
    weeks: "Week 1–2",
    title: "Sleep starts to deepen",
    desc: "The first thing most members notice. Falling asleep faster. Fewer 3 AM wake-ups. Mornings feel slightly easier.",
    tag: "First signal",
    highlight: false,
  },
  {
    weeks: "Week 3–4",
    title: "Energy stabilizes",
    desc: "The 2 PM crash starts to soften. Mood feels steadier. Workouts feel less punishing.",
    tag: "Daytime gains",
    highlight: false,
  },
  {
    weeks: "Week 6–8",
    title: "Recovery accelerates",
    desc: "Soreness clears faster. Old aches quiet down. Body feels like it's working with you, not against you.",
    tag: "Compound effect",
    highlight: false,
  },
  {
    weeks: "Week 10–12",
    title: "Body composition shifts",
    desc: "When paired with consistent training and nutrition, members often see a leaner overall composition. This is when most decide to continue or step up to a more advanced protocol.",
    tag: "Decision point",
    highlight: true,
  },
];

function SermorelinTimelineSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative overflow-hidden bg-[#0B1120] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[#6D6FFC]/8 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-[640px] text-center">
          <h2 className="font-title text-4xl font-bold text-white md:text-5xl">
            What happens,{" "}
            <span className="font-playfair italic text-[#6D6FFC]">
              week by week.
            </span>
          </h2>
          <p className="mt-5 text-base text-gray-400">
            The honest timeline. Most members notice changes in this order —
            though individual results vary.
          </p>
        </div>

        <div ref={ref} className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[480px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&w=1200&q=80"
              alt="The honest timeline"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Day 1 — Day 90
              </p>
              <p className="text-2xl font-bold text-white">
                The honest timeline.
              </p>
            </div>
          </motion.div>

          <div className="relative flex flex-col gap-4">
            {/* Vertical connecting line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="absolute left-[19px] top-[40px] hidden h-[calc(100%-80px)] w-px origin-top bg-gradient-to-b from-[#6D6FFC]/40 via-[#6D6FFC]/20 to-transparent lg:block"
            />
            {TIMELINE_ROWS.map((row, i) => (
              <motion.div
                key={row.weeks}
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 + i * 0.15 }}
                className={`relative rounded-xl border p-5 transition-colors ${
                  row.highlight
                    ? "border-[#6D6FFC]/30 bg-[#6D6FFC]/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-[#6D6FFC] text-xs font-bold text-white shadow-lg shadow-[#6D6FFC]/25">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-[#6D6FFC]">
                    {row.weeks}
                  </span>
                  <span className="ml-auto rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {row.tag}
                  </span>
                </div>
                <h3 className="mb-1 text-base font-bold text-white">{row.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {row.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Testimonial                                                     */
/* ------------------------------------------------------------------ */

const SERMORELIN_TESTIMONIALS = [
  {
    name: "Aisha M., 39",
    started: "Started Sermorelin 4 months ago",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    heading: (
      <>
        From &ldquo;I'm not sure if I should&rdquo; to{" "}
        <span className="font-playfair italic text-[#6D6FFC]">
          &ldquo;I should have started sooner.&rdquo;
        </span>
      </>
    ),
    quote:
      "I almost didn’t try it. Felt like I was being dramatic — I was 39, not 60. By week 4 I was sleeping like college again. By month 3 I was thinking about the harder protocol. Sermorelin gave me a soft place to land.",
  },
  {
    name: "Marcus T., 47",
    started: "Started Sermorelin 6 months ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    heading: (
      <>
        &ldquo;My recovery changed{" "}
        <span className="font-playfair italic text-[#6D6FFC]">
          before anything else did.&rdquo;
        </span>
      </>
    ),
    quote:
      "I train 5 days a week. The soreness used to linger for days. By week 3 on Sermorelin, I noticed I was bouncing back faster. By month 2, my sleep was deeper and I had energy I hadn’t felt in years.",
  },
  {
    name: "Rachel K., 34",
    started: "Started Sermorelin 3 months ago",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
    heading: (
      <>
        &ldquo;I finally feel like{" "}
        <span className="font-playfair italic text-[#6D6FFC]">
          my body is working with me.&rdquo;
        </span>
      </>
    ),
    quote:
      "I was skeptical about peptides. But the sleep improvements alone were worth it. I fall asleep faster, wake up less, and my morning brain fog is basically gone. My skin even looks better.",
  },
];

function SermorelinTestimonialSection() {
  const count = SERMORELIN_TESTIMONIALS.length;
  const wrapperRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollableHeight = wrapper.offsetHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const progress = Math.min(
        Math.max(-rect.top / scrollableHeight, 0),
        0.999
      );
      const idx = Math.floor(progress * count);
      setActive(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [count]);

  const testimonial = SERMORELIN_TESTIMONIALS[active];

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${count * 100}vh` }}
    >
      <section className="sticky top-0 flex min-h-screen items-center overflow-hidden bg-[#0B1120]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-[400px] w-[400px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[#6D6FFC]/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1200px] items-center gap-8 px-4 py-20 md:gap-12 md:px-8 md:py-28">
          {/* Left chevron */}
          <button
            type="button"
            onClick={() => setActive((prev) => (prev - 1 + count) % count)}
            className="hidden shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-white/60 transition-colors hover:border-[#6D6FFC]/30 hover:bg-white/10 hover:text-white lg:flex"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Review content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-2xl ring-1 ring-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/60 via-transparent to-transparent" />
              </div>

              <div className="flex flex-col">
                <div className="mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="mb-6 font-title text-2xl font-bold leading-snug text-white md:text-3xl">
                      {testimonial.heading}
                    </h2>
                    <blockquote className="relative rounded-xl border border-white/10 bg-white/5 p-6 text-base italic leading-relaxed text-gray-300 backdrop-blur-sm md:text-lg">
                      <Quote className="absolute -top-3 left-4 h-6 w-6 fill-[#6D6FFC] text-[#6D6FFC]" />
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center gap-4">
                      <div>
                        <p className="font-bold text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">
                          {testimonial.started}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        </div>
                        Verified Member
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Progress dots + mobile arrows */}
                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActive((prev) => (prev - 1 + count) % count)}
                    className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 p-1.5 text-white/60 transition-colors hover:text-white lg:hidden"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {SERMORELIN_TESTIMONIALS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        i === active
                          ? "w-8 bg-[#6D6FFC]"
                          : "w-2.5 bg-white/20"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500">
                    {active + 1} / {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActive((prev) => (prev + 1) % count)}
                    className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 p-1.5 text-white/60 transition-colors hover:text-white lg:hidden"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right chevron */}
          <button
            type="button"
            onClick={() => setActive((prev) => (prev + 1) % count)}
            className="hidden shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-white/60 transition-colors hover:border-[#6D6FFC]/30 hover:bg-white/10 hover:text-white lg:flex"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  9. Pain Points                                                     */
/* ------------------------------------------------------------------ */

const PAIN_POINT_CARDS = [
  {
    title: "You've never taken a peptide before.",
    image: "/images/negative-sell/negative_1.webp",
    bullets: [
      "The advanced stuff feels like a lot to commit to.",
      "You want to start small and see how your body responds.",
    ],
  },
  {
    title: "You want to support your body, not override it.",
    image: "/images/negative-sell/negative_2.jpeg",
    bullets: [
      "Not replacing what your body makes — augmenting it.",
      "Sermorelin signals your pituitary; it doesn't bypass it.",
    ],
  },
  {
    title: "Your sleep is the first thing that broke.",
    image: "/images/negative-sell/negative_3.jpg",
    bullets: [
      "Eight hours, but the deep sleep is gone.",
      "You wake up tired before the day even begins.",
    ],
  },
  {
    title: "You're ready to do something — but cheaper than the longevity clinic.",
    image: "/images/negative-sell/negative_4.webp",
    bullets: [
      "$2,000/mo wellness clinics aren't realistic for everyone.",
      "You want clinical-grade care without the clinical-grade markup.",
    ],
  },
];

function SermorelinPainPointsSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            Sound familiar?
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          Curious — but{" "}
          <span className="italic text-[#5b3cdd]">cautious.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          Sermorelin is for people who want to begin a peptide protocol with
          the gentlest, most accessible option available.
        </p>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {PAIN_POINT_CARDS.map((card) => (
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
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <line x1="2" y1="2" x2="8" y2="8" stroke="#e53e3e" strokeWidth="1.8" strokeLinecap="round" />
                          <line x1="8" y1="2" x2="2" y2="8" stroke="#e53e3e" strokeWidth="1.8" strokeLinecap="round" />
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
            href={CTA_HREF}
            className="hs-solid-btn rounded-full px-10 py-4 text-base font-semibold transition-all hover:-translate-y-0.5"
          >
            See if Sermorelin fits
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Promise / Guarantee                                            */
/* ------------------------------------------------------------------ */

function SermorelinPromiseSection() {
  const promiseRef = useRef(null);
  const promiseInView = useInView(promiseRef, { once: false, margin: "-100px" });

  return (
    <section ref={promiseRef} className="relative overflow-hidden bg-[#0d0d1a] py-20 md:py-28">
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={promiseInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D6FFC]/10 blur-[120px]"
          animate={promiseInView ? { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6D6FFC]/10"
          animate={promiseInView ? { scale: [1, 1.6], opacity: [0.4, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", repeatDelay: 1 }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[800px] px-4 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, filter: "blur(16px)" }}
          animate={promiseInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <span className="font-title text-8xl font-black tracking-tight text-white md:text-9xl">
            60
          </span>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={promiseInView ? { opacity: 1, letterSpacing: "0.25em" } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-1 text-sm font-semibold uppercase text-[#6D6FFC]"
          >
            Day Promise
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={promiseInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto my-8 origin-center"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#6D6FFC] to-transparent" />
          <div className="absolute inset-0 h-px w-24 bg-gradient-to-r from-transparent via-[#6D6FFC] to-transparent blur-sm" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={promiseInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 font-title text-2xl font-bold leading-snug text-white md:text-3xl"
        >
          If you don&apos;t notice deeper sleep or steadier energy by week 6,{" "}
          <span className="font-playfair italic text-[#6D6FFC]">your first month is free.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={promiseInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mb-8 text-sm text-white/40"
        >
          No fine print. No retention scripts. Email us and it&apos;s done.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={promiseInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={CTA_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-[#6D6FFC] px-8 py-4 text-base font-semibold text-white shadow-[0_8px_32px_rgba(109,111,252,0.35)] transition hover:bg-[#5a5ce8] hover:shadow-[0_8px_40px_rgba(109,111,252,0.5)]"
          >
            Start consultation →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. Research                                                       */
/* ------------------------------------------------------------------ */

const RESEARCH_STUDIES = [
  {
    author: "Walker et al. (2006):",
    text: "GHRH analogs significantly increased IGF-1 and improved sleep architecture in healthy older adults.",
  },
  {
    author: "Khorram et al. (1997):",
    text: "16-week trial showed restored GH pulse amplitude in adults over 50.",
  },
  {
    author: "Vittone et al. (1997):",
    text: "Sermorelin specifically improved nocturnal GH secretion patterns in middle-aged adults.",
  },
  {
    author: "Sigalos & Pastuszak (2018):",
    text: "Systematic review confirmed safety profile of GHRH analogs across multiple trials.",
  },
];

function SermorelinResearchSection() {
  return (
    <section className="bg-[#F1F5F9] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <FadeIn>
            <h2 className="mb-4 font-title text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Sermorelin has{" "}
              <span className="font-playfair italic text-[#6D6FFC]">
                40+ years
              </span>{" "}
              of clinical history.
            </h2>
            <p className="mb-8 text-base leading-relaxed text-gray-600">
              It was originally developed for pediatric GH deficiency in the
              1980s and has since been extensively studied as a GHRH analog. The
              safety profile is one of the most established in the peptide
              category.
            </p>

            <div className="mb-6 space-y-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {RESEARCH_STUDIES.map((study, i) => (
                <div
                  key={i}
                  className={`flex gap-3 px-5 py-4 text-sm ${i !== 0 ? "border-t border-gray-100" : ""}`}
                >
                  <span className="shrink-0 font-bold text-gray-900">
                    {study.author}
                  </span>
                  <span className="text-gray-600">{study.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=100&q=80",
                ].map((src, i) => (
                  <div key={i} className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
                    <Image src={src} alt="Clinician" fill className="object-cover" sizes="36px" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Reviewed by HealSend Clinical Team
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  Dr. R. Adler &amp; team
                </p>
                <p className="text-xs text-gray-500">
                  Board-certified endocrinology &amp; longevity medicine
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Right — featured study card */}
          <FadeIn className="flex flex-col">
            <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
              <span className="mb-4 inline-block text-[10px] font-bold uppercase tracking-widest text-[#6D6FFC]">
                Featured Study
              </span>
              <h3 className="mb-4 text-xl font-bold leading-snug text-gray-900 md:text-2xl">
                &ldquo;Sermorelin Effects on Sleep Architecture and IGF-1 in
                Adults&rdquo;
              </h3>
              <blockquote className="mb-6 border-l-4 border-[#6D6FFC]/30 pl-4 text-sm italic text-gray-500">
                Vittone J, Blackman MR, Busby-Whitehead J, et al. Metabolism:
                Clinical &amp; Experimental. N=64 adults, 16-week double-blind
                study.
              </blockquote>

              <div className="mb-8 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-[#EEF0FA] p-4">
                  <p className="font-title text-2xl font-bold text-[#6D6FFC]">
                    +58%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">avg IGF-1 increase</p>
                </div>
                <div className="rounded-2xl bg-[#EEF0FA] p-4">
                  <p className="font-title text-2xl font-bold text-[#6D6FFC]">
                    +28%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">deep sleep (SWS)</p>
                </div>
                <div className="rounded-2xl bg-[#EEF0FA] p-4">
                  <p className="font-title text-2xl font-bold text-[#6D6FFC]">
                    96%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">tolerated well</p>
                </div>
              </div>

              <Link
                href={CTA_HREF}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6D6FFC] px-8 py-4 text-base font-semibold text-white hover:bg-[#5a5de8]"
              >
                View full study →
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  12. Steps                                                          */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    step: "STEP 1",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    title: "Online intake",
    desc: "90-second medical assessment built so a clinician can act on it the same day. We order baseline labs (including IGF-1).",
  },
  {
    step: "STEP 2",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
    title: "Provider review",
    desc: "A licensed clinician reviews your goals and labs, confirms Sermorelin is appropriate, and prescribes accordingly.",
  },
  {
    step: "STEP 3",
    image:
      "https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?auto=format&fit=crop&w=800&q=80",
    title: "Medication shipped",
    desc: "Sermorelin ships discreetly with all supplies, instructions, and a video walkthrough for your first dose.",
  },
];

function SermorelinStepsSection() {
  return (
    <section className="bg-[#f9f9f9] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <h2 className="font-title text-4xl font-bold text-gray-900 md:text-5xl">
            From intake to delivery{" "}
            <span className="font-playfair italic text-[#6D6FFC]">
              in one week.
            </span>
          </h2>
          <p className="mt-5 text-base text-gray-600">
            Same simple process. Same clinician care. Just the gentlest
            protocol on the menu.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <FadeIn
              key={s.step}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full bg-[#EEF0FA]">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="p-6">
                <span className="mb-3 inline-block rounded-full bg-gray-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {s.step}
                </span>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  13. Upgrade Banner                                                 */
/* ------------------------------------------------------------------ */

function SermorelinUpgradeBanner() {
  return (
    <section className="bg-[#6D6FFC] py-12">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 px-4 md:flex-row md:px-8">
        <div className="max-w-[560px]">
          <p className="mb-1 text-sm font-semibold text-white">
            Ready for more?
          </p>
          <p className="font-playfair text-2xl italic text-[#FF6B35] md:text-3xl">
            Step up to Advanced GH Optimization.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
            Many Sermorelin members graduate to a more advanced protocol after
            60–90 days. If you're already responding well, your clinician can
            help you decide whether you're ready to step up.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/gh-optimization"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#e55a26]"
          >
            See Advanced Protocol →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  14. FAQ (two-column layout)                                        */
/* ------------------------------------------------------------------ */

const SERMORELIN_FAQS = [
  {
    question: "How does the 60-day money-back guarantee work?",
    answer:
      "If you don't notice deeper sleep or steadier energy by week 6, we refund your first month in full. No retention calls, no fine print. Email support and it's done within 3–5 business days.",
  },
  {
    question: "What exactly is Sermorelin?",
    answer:
      "Sermorelin is a synthetic GHRH (growth hormone-releasing hormone) analog. Injected subcutaneously once daily, it signals the pituitary gland to produce your own GH — naturally, without bypassing the pituitary or suppressing your own production.",
  },
  {
    question: "How is this different from a more advanced GH protocol?",
    answer:
      "Advanced protocols (like CJC-1295 + Ipamorelin) use longer-acting or stacked peptides for stronger GH pulse amplitude. Sermorelin is shorter-acting with a milder effect — ideal for first-timers who want to feel the protocol before committing to a stronger stack.",
  },
  {
    question: "How quickly will I notice changes?",
    answer:
      "Most members notice improved sleep quality within 1–2 weeks. Steadier energy typically follows in weeks 3–4. Body composition changes are usually measurable by 60–90 days when paired with consistent training.",
  },
  {
    question: "What about side effects?",
    answer:
      "The most commonly reported effects are mild injection-site redness and temporary fatigue in the first few days as your GH levels begin to shift. Sermorelin's short half-life means side effects are typically transient and mild compared to stronger protocols.",
  },
  {
    question: "Is Sermorelin legal?",
    answer:
      "Yes. Sermorelin is legally dispensed as a compounded prescription medication in the U.S. through a licensed compounding pharmacy. A HealSend-affiliated clinician must prescribe it — which is part of the process.",
  },
  {
    question: "Do I need labs first?",
    answer:
      "Yes. We order a baseline IGF-1 panel before your first dose. It's included in your protocol cost. Your clinician uses your actual numbers to set the right starting dose. A follow-up recheck is included at 60 days.",
  },
  {
    question: "Is daily injection hard?",
    answer:
      "Most members adapt within 3–5 injections. It's a small subcutaneous injection into the abdomen or thigh — similar to insulin. Your kit includes everything, and a video walkthrough covers your first dose step by step.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "Compounded Sermorelin is not typically covered by insurance. However, it's FSA and HSA eligible — so you can use pre-tax dollars. We accept Klarna and Afterpay for flexible payment.",
  },
];

function SermorelinFAQSection() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:mt-0 md:!pb-10 md:!pt-20 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-balance font-title text-4xl font-medium text-slate-900 md:text-5xl">
          Sermorelin questions.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Honest answers.</span>
        </h2>
        <p className="mb-16 max-w-lg text-start text-sm text-gray-600">
          Everything we get asked about starting Sermorelin. Want a real answer? Message a
          HealSend clinician for free before you commit.
        </p>

        <div className="flex flex-col gap-4">
          {SERMORELIN_FAQS.map((faq, idx) => (
            <div key={faq.question} className="overflow-hidden rounded-[1.25rem] bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between gap-6 px-7 py-7 text-left md:px-10 md:py-9"
                aria-expanded={openFaq === idx}
              >
                <span className="pr-4 text-lg font-bold text-gray-900 md:text-xl">
                  {faq.question}
                </span>
                <div className="flex shrink-0 items-center justify-center rounded-full bg-[#333333] p-1.5 md:p-2">
                  {openFaq === idx ? (
                    <Minus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
                  ) : (
                    <Plus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
                  )}
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-7 pb-7 text-base leading-relaxed text-gray-600 md:px-10 md:pb-9 md:text-lg">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={CTA_HREF}
            className="hs-solid-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto"
          >
            Start consultation
          </Link>
          <Link
            href={CTA_HREF}
            className="hs-outline-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto"
          >
            Talk to a clinician
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  15. Closing CTA                                                    */
/* ------------------------------------------------------------------ */

function SermorelinClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-[#101726] py-20 text-center text-white md:py-28">
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[500px] w-[500px] rounded-full bg-[#FF6B35]/15 blur-3xl" />
      <div className="relative mx-auto max-w-[700px] px-4">
        <h2 className="mb-5 font-title text-4xl font-medium md:text-6xl">
          Recover faster. Sleep deeper.{" "}
          <span className="font-playfair italic text-[#FF6B35]">
            Feel like yourself again.
          </span>
        </h2>
        <p className="mb-8 text-lg text-white/70">
          A clinician reviews your IGF-1 labs and builds a protocol around your actual numbers. No guesswork. No generic doses. Just results.
        </p>
        <Link
          href={CTA_HREF}
          className="hs-solid-btn inline-flex items-center gap-2 rounded-full px-10 py-4 text-base font-semibold"
        >
          Start consultation <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-xs text-white/40">
          By starting, you agree to our terms &amp; privacy policy.
          Provider-prescribed when appropriate.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export                                                     */
/* ------------------------------------------------------------------ */

export default function SermorelinLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <SermorelinWillpowerSection />
      <SermorelinProductHeroSection />
      <MediaLogosBanner />
      <SermorelinWhySection />
      <SermorelinComparisonSection />
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="Sermorelin Benefits" />
      <SermorelinMechanismSection />
      <SermorelinOutcomesSection />
      <SermorelinTimelineSection />
      <SermorelinTestimonialSection />
      <BeforeAfterSliderSection category="fitness" heading="Real transformations." ctaHref={CTA_HREF} />
      <DarkMemberStatsSection variant="igf1" />
      <SermorelinPainPointsSection />
      <SermorelinPromiseSection />
      <SermorelinResearchSection />
      <SimpleSteps productData={productData} />
      <SermorelinUpgradeBanner />
      <CleanSimpleEffective productData={null} />
      <LabTested productData={null} />
      <MarketingTrustMarquee items={SERMORELIN_TRUST_ITEMS} edgeToEdge={false} />
      <SameMedicationSection planLabel="Personalized, clinically-proven sermorelin plans" />
      <SermorelinFAQSection />
      <SupportAvailabilitySection />
      <SermorelinClosingCTA />
      <MarketingFooter />
      <MobileStickyCta ctaHref={CTA_HREF} />
    </div>
  );
}
