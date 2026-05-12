"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Check,
  ClipboardCheck,
  Clock3,
  Headset,
  Laptop,
  Minus,
  Plus,
  PillBottle,
  ShieldCheck,
  Stethoscope,
  Syringe,
  TrendingUp,
  Zap,
  Dumbbell,
  Heart,
  Brain,
  Truck,
  Phone,
  FlaskConical,
  Users,
  X as XIcon,
} from "lucide-react";
import {
  MinimalMarketingNavbar,
  MarketingFooter,
} from "@/components/marketing/shared";
import {
  mergeProductContent,
  LabTested,
  MarketingTrustMarquee,
  OurTreatmentsSection,
  TREATMENT_PLAN_CARDS,
  SupportAvailabilitySection,
  RestoredTirzepatideBenefitsCarouselSection,
  WillpowerVerticalColumn,
  WillpowerHorizontalRow,
  WILLPOWER_LEFT_MARQUEE_ITEMS,
  WILLPOWER_RIGHT_MARQUEE_ITEMS,
  CleanSimpleEffective,
  SameMedicationSection,
  RelatedProductsSection,
  FDADisclaimerSection,
  MediaLogosBanner,
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/growth-hormone-support";

/* ------------------------------------------------------------------ */
/*  Local FadeIn                                                       */
/* ------------------------------------------------------------------ */

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
/*  Face stack                                                         */
/* ------------------------------------------------------------------ */

const MEMBER_FACES = [
  "/images/4_Home_Doctors_Online_Consultation-Doctors_02.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Doctors_04.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Avatar.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Testimonials_01.jpg",
];

/* ------------------------------------------------------------------ */
/*  1. Hero — sticky left + scrollable right                           */
/* ------------------------------------------------------------------ */

const TRT_HERO_BENEFITS = [
  { icon: Syringe, text: "Steady T levels with one weekly painless shot — supplies included." },
  { icon: ShieldCheck, text: "Pharmaceutical-grade Testosterone Cypionate (200mg/mL) from a U.S. pharmacy." },
  { icon: FlaskConical, text: "Lab work and clinician follow-ups included with every plan." },
];

const TRT_HERO_PRICING = [
  { name: "Annual Plan", firstMonth: 0, thenPrice: 129, isBestValue: true },
  { name: "3 Month Plan", firstMonth: 49, thenPrice: 149, isBestValue: false },
  { name: "Monthly Plan", firstMonth: 149, thenPrice: 149, isBestValue: false, isMuted: true },
];

const TRT_HERO_DESCRIPTION =
  "Testosterone Replacement Therapy (TRT) uses bioidentical Testosterone Cypionate to restore your levels to an optimal range. Administered via a simple weekly subcutaneous injection, it addresses fatigue, low libido, brain fog, and muscle loss at the hormonal root — not with stimulants or supplements.";

const TRT_HERO_FAQS = [
  {
    question: "What is TRT and who is it for?",
    answer:
      "TRT replaces the testosterone your body is no longer producing enough of. It's for men with clinically low T levels experiencing fatigue, low drive, brain fog, or muscle loss.",
  },
  {
    question: "How are the injections administered?",
    answer:
      "You self-administer a small subcutaneous injection once per week at home. The kit includes everything you need — no clinic visits required.",
  },
  {
    question: "Will TRT affect my fertility?",
    answer:
      "TRT can suppress sperm production. If fertility is a priority, your clinician may recommend enclomiphene instead, or add HCG to your protocol.",
  },
];

function TRTHeroTabs() {
  const [activeTab, setActiveTab] = useState("benefits");

  return (
    <div className="mt-4 rounded-[1rem] border border-gray-200 bg-white p-2 shadow-sm">
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
            {activeTab === "benefits"
              ? TRT_HERO_BENEFITS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-3">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                      <p className="text-[0.938rem] leading-relaxed text-gray-700 md:text-base">
                        {item.text}
                      </p>
                    </div>
                  );
                })
              : null}

            {activeTab === "pricing" ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold leading-tight text-gray-900 md:text-xl">
                  Testosterone Cypionate
                </h3>
                <div className="rounded-[1rem] border border-gray-200">
                  {TRT_HERO_PRICING.map((plan, index) => (
                    <div
                      key={plan.name}
                      className={`relative flex items-center justify-between p-4 ${
                        index !== TRT_HERO_PRICING.length - 1 ? "border-b border-gray-200" : ""
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
                          ${plan.firstMonth}{" "}
                          <span className="text-sm font-semibold">first month</span>
                          <div className="mt-1 text-sm font-normal text-gray-500">
                            then ${plan.thenPrice}/mo
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTab === "description" ? (
              <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                {TRT_HERO_DESCRIPTION}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TRTHeroFaqs() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="mt-4 space-y-3">
      {TRT_HERO_FAQS.map((faq, idx) => (
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
                <Minus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
              ) : (
                <Plus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
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
  );
}

function TRTWillpowerSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1F5F9]">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-10 md:px-[3.25rem] md:py-14 lg:h-[calc(100dvh-80px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <div className="mt-5 max-w-[34rem]">
              <h2 className="text-balance font-title text-4xl font-medium leading-tight tracking-tight text-gray-950 md:text-5xl">
                Your low energy isn&apos;t a willpower problem.{" "}
                <span className="font-playfair italic font-medium text-[#6d6ffc]">
                  It&apos;s a hormonal one.
                </span>
              </h2>
              <p className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-800 lg:text-[1.05rem]">
                Personalized injectable TRT. Unlimited clinician-led care.
                Delivered to your door. Guaranteed or it&apos;s free.
              </p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              <li className="grid grid-cols-[auto_1fr] items-start gap-1 text-sm md:text-lg">
                <div className="flex items-center gap-4 text-base md:text-sm">
                  <Syringe className="h-6 w-6 shrink-0" strokeWidth={2} />
                  <span>
                    Testosterone Cypionate &mdash; the most prescribed and
                    clinically-studied form of TRT
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
              <div className="inline-flex w-full max-w-full flex-col items-center gap-2.5 sm:w-auto">
                <Link
                  href={CTA_HREF}
                  className="hs-solid-btn inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold sm:w-auto"
                >
                  Get my personalized plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="w-full text-center text-sm">
                  <span className="font-semibold text-gray-700">Takes 90 seconds</span> · <span className="text-slate-500">100% private · free</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: two animated horizontal marquee rows */}
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

function TRTProductHeroSection() {
  const [activeTab, setActiveTab] = useState("benefits");
  const [openFaq, setOpenFaq] = useState(null);
  const [showPriceFootnote, setShowPriceFootnote] = useState(false);

  return (
    <section className="bg-[#f9f9f9] px-4 py-16 md:px-[3.25rem] md:py-20 lg:px-[3.25rem]">
      <div className="mx-auto flex max-w-[1340px] flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6 xl:gap-8">
        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[55%] lg:max-w-[740px]">
          <div className="flex flex-col gap-6 sm:gap-7 md:gap-10 lg:isolate lg:sticky lg:top-24 lg:z-10">
            <div className="relative z-[1] shrink-0 bg-[#f9f9f9] pb-1">
              <h1 className="text-balance text-start text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-5xl md:leading-tight">
                Testosterone Cypionate
              </h1>
            </div>
            <div className="relative z-0 flex aspect-[4/5] w-full shrink-0 items-start justify-start overflow-hidden rounded-[1rem] bg-[#f9f9f9] ring-1 ring-black/[0.04]">
              <div className="flex h-full min-h-0 w-full flex-1 items-stretch justify-stretch">
                <div className="relative h-full min-h-0 w-full">
                  <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] md:left-5 md:top-5 md:px-6 md:py-2.5 md:text-base">
                    <div className="relative h-2.5 w-2.5 md:h-3 md:w-3">
                      <span className="absolute inset-0 rounded-full bg-emerald-400/40 blur-[3px]" />
                      <span className="absolute inset-0 rounded-full bg-emerald-500" />
                    </div>
                    In Stock
                  </div>
                  <Image
                    src="/images/Enclomiphene-20260506T071530Z-3-001/Enclomiphene/Ready to feel like you again_/Testosterone-Therapy-for-men-1-optimized.jpg"
                    alt="Testosterone Cypionate — in stock"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="rounded-2xl object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[45%] xl:w-[450px]">
          <div className="mb-6 overflow-hidden rounded-[1rem] border border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2 bg-[#fde073] px-5 py-3.5 text-sm font-medium text-gray-900 md:text-base">
              <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
              FSA &amp; HSA Eligible
            </div>
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
                    className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500 underline decoration-dotted underline-offset-4 hover:text-gray-700 md:text-base"
                  >
                    then $129/mo*
                  </button>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="flex items-center rounded-[0.6rem] bg-[#FFB3C7] px-3 py-1.5">
                    <img src="/images/marketing/logos/klarna.png" alt="Klarna" className="h-3 w-auto" />
                  </span>
                  <span className="flex items-center rounded-[0.6rem] bg-[#B2FCE4] px-3 py-1.5">
                    <img src="/images/marketing/logos/afterpay.png" alt="Afterpay" className="h-3 w-auto" />
                  </span>
                </div>
              </div>

              {showPriceFootnote ? (
                <div className="mb-5 rounded-[0.75rem] bg-gray-50 p-3 text-xs leading-5 text-gray-600 md:text-sm">
                  *$0 first month covers the clinician visit and initial supply
                  on the annual plan. Recurring billing of $129/month begins at
                  month two and continues until you cancel. Includes
                  medication, follow-up care, and shipping. Cancel anytime in
                  your account.
                </div>
              ) : null}

              <div className="flex w-full flex-col items-stretch gap-3">
                <Link
                  href={CTA_HREF}
                  className="hs-solid-btn flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold shadow-[0_8px_24px_rgba(109,111,252,0.35)] transition-colors"
                >
                  Start consultation
                </Link>
                <p className="mt-1 w-full text-center text-xs text-gray-500 md:text-sm">
                  Takes 90 seconds · 100% private · free
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
                  {activeTab === "benefits"
                    ? TRT_HERO_BENEFITS.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="flex gap-3">
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                            <p className="text-[0.938rem] leading-relaxed text-gray-700 md:text-base">
                              {item.text}
                            </p>
                          </div>
                        );
                      })
                    : null}

                  {activeTab === "pricing" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold leading-tight text-gray-900 md:text-xl">
                        Testosterone Cypionate
                      </h3>
                      <div className="rounded-[1rem] border border-gray-200">
                        {TRT_HERO_PRICING.map((plan, index) => (
                          <div
                            key={plan.name}
                            className={`relative flex items-center justify-between p-4 ${
                              index !== TRT_HERO_PRICING.length - 1 ? "border-b border-gray-200" : ""
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
                                ${plan.firstMonth}{" "}
                                <span className="text-sm font-semibold">first month</span>
                                <div className="mt-1 text-sm font-normal text-gray-500">
                                  then ${plan.thenPrice}/mo
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "description" ? (
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      {TRT_HERO_DESCRIPTION}
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
                <ShieldCheck className="h-4 w-4 md:h-4.5 md:w-4.5" /> FSA & HSA Eligible
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {TRT_HERO_FAQS.map((faq, idx) => (
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
                      <Minus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
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
              The statements on this page have not been evaluated by the Food
              and Drug Administration. This product is not intended to diagnose,
              treat, cure or prevent any disease.
            </div>

            <div className="space-y-2.5 text-[11px] leading-relaxed text-gray-600">
              <p>
                *Price shown applies to TRT annual plan. Actual price will
                depend on plan prescribed. Final treatment fit depends on
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
/*  2. Press logos                                                      */
/* ------------------------------------------------------------------ */

const PRESS_LOGOS = ["Yahoo!", "USA TODAY", "AXIOS", "Forbes", "BUSINESS INSIDER"];

function TRTPressStrip() {
  return (
    <section className="border-y border-gray-200 bg-[#f9f9f9] py-6">
      <div className="mx-auto max-w-[1200px] px-4">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
          As featured in
        </p>
        <div className="flex flex-wrap items-center justify-around gap-6">
          {PRESS_LOGOS.map((name) => (
            <span key={name} className="font-title text-lg text-gray-400 opacity-60 md:text-xl">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Plans (3-plan grid)                                             */
/* ------------------------------------------------------------------ */

const TRT_PLANS = [
  {
    tag: "Just starting TRT?",
    tagAccent: "Recommended starter",
    title: "Standard TRT",
    subtitle: "Testosterone Cypionate · 100mg/week",
    image: "/images/marketing/bundle/cjc-1295-ipamorelin-product.png",
    features: [
      "Steady total T increase to optimal range (700–1000 ng/dL)",
      "Once-weekly subcutaneous injection your clinician dials in",
      "Best for first-time TRT patients",
    ],
    featured: false,
  },
  {
    tag: "Concerned about fertility?",
    tagAccent: "Most chosen plan",
    title: "TRT + hCG",
    subtitle: "Cypionate + hCG fertility support",
    image: "/images/marketing/bundle/sermorelin-product.png",
    features: [
      "Combines TRT with hCG to preserve testicular function",
      "Great option if you want kids now or in the future",
      "Slow titration designed to keep side effects minimal",
    ],
    featured: true,
  },
  {
    tag: "Want the full optimization stack?",
    tagAccent: "Premium",
    title: "Optimized TRT",
    subtitle: "TRT + hCG + Anastrozole + Tadalafil",
    image: "/images/marketing/bundle/glutathione-injection-product.png",
    features: [
      "Full hormone optimization with estrogen control",
      "Tadalafil included free for daily ED + prostate support",
      "Best for men who want maximum results",
    ],
    featured: false,
  },
];

function TRTPlansSection() {
  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <span className="mb-4 inline-block rounded-full bg-[#F1F5F9] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            Medical TRT care
          </span>
          <h2 className="mb-3 font-title text-4xl font-medium text-gray-900 md:text-5xl">
            Hormone care matched to your{" "}
            <span className="font-playfair italic text-[#6D6FFC]">levels and goals.</span>
          </h2>
          <p className="text-base text-gray-600">
            TRT isn&apos;t one-size-fits-all. Choose the plan built for where you are right now — your symptoms, your bloodwork, your timeline.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TRT_PLANS.map((plan) => (
            <FadeIn key={plan.title}>
              <div className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm ${plan.featured ? "border-[#6D6FFC] border-2 ring-4 ring-[#6D6FFC]/10" : "border-gray-100"}`}>
                <div className="relative h-[180px] w-full bg-[#F1F5F9]">
                  <Image
                    src={plan.image}
                    alt={plan.title}
                    fill
                    sizes="400px"
                    className="object-contain p-4"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7 pt-5">
                <p className="mb-1 text-xs text-gray-500">
                  <span className="font-semibold text-[#6D6FFC]">{plan.tag}</span>{" "}
                  {plan.tagAccent}
                </p>
                <h3 className="mb-1 font-title text-2xl text-gray-900">{plan.title}</h3>
                <p className="mb-5 text-xs text-gray-400">{plan.subtitle}</p>
                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6D6FFC]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={CTA_HREF}
                  className={`flex items-center justify-center rounded-full py-3 text-sm font-semibold transition ${
                    plan.featured
                      ? "hs-solid-btn"
                      : "border border-[#6D6FFC] text-[#6D6FFC] hover:bg-[#6D6FFC] hover:text-white"
                  }`}
                >
                  Start {plan.title.split(" ")[0]}
                </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Benefits                                                        */
/* ------------------------------------------------------------------ */

const TRT_BENEFITS = [
  { icon: Zap, title: "More energy by week 4", desc: "Restored testosterone increases mitochondrial output and morning energy within the first month." },
  { icon: Dumbbell, title: "Stronger lifts. Less belly fat.", desc: "TRT improves protein synthesis, lean muscle, and visceral fat reduction alongside training." },
  { icon: Heart, title: "Drive returns. Mood lifts.", desc: "Supports libido, erectile function, and consistent mood in clinical hypogonadism patients." },
  { icon: Brain, title: "Sharper focus. Deeper sleep.", desc: "Optimized hormones support cognitive clarity, recovery, and consolidated nighttime sleep." },
];

function TRTBenefitsSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mb-12 text-center font-title text-4xl font-medium text-gray-900 md:text-5xl">
          What are the{" "}
          <span className="font-playfair italic text-[#6D6FFC]">benefits of TRT?</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRT_BENEFITS.map((b) => (
            <FadeIn key={b.title}>
              <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <b.icon className="mb-4 h-8 w-8 text-[#6D6FFC]" strokeWidth={1.6} />
                <h3 className="mb-2 font-title text-xl font-medium text-gray-900">{b.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{b.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href={CTA_HREF} className="hs-solid-btn inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold">
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Symptoms ("Sound familiar?")                                    */
/* ------------------------------------------------------------------ */

const SYMPTOM_CARDS = [
  { title: "The energy that vanishes by 2 PM.", bullets: ["Eight hours of sleep — and you're still drained.", "Coffee stopped working. The afternoon wall is now your whole afternoon."], image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" },
  { title: "Your body turned on you.", bullets: ["Belly fat showed up and won't leave — same diet, different result.", "Lifts feel heavier. Recovery takes days, not hours."], image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" },
  { title: "The drive that quietly disappeared.", bullets: ["Libido dimmed. Morning erections faded.", "You miss feeling like yourself, and you've stopped bringing it up."], image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=800&q=80" },
  { title: "This was never about discipline.", bullets: ["Feeling like you should 'push through' keeps you stuck.", "You've Googled this before — you just needed the right care."], image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80" },
];

function TRTSymptomsSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            Sound familiar?
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          Low T isn&apos;t just about{" "}
          <span className="font-playfair italic text-[#6D6FFC]">getting older.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          It&apos;s about understanding why your body stopped producing what it used to.
        </p>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {SYMPTOM_CARDS.map((card) => (
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

        <div className="mt-10 text-center">
          <Link href={CTA_HREF} className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#e55a26]">
            See if TRT is right for you <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Designed to support                                             */
/* ------------------------------------------------------------------ */

const SUPPORT_CARDS = [
  { title: "Restore Energy", desc: "Wake up feeling the way you used to. Steady all-day energy, no 2 PM crash.", img: "/images/pexels-ivan-samkov-4164510-scaled-1.jpeg" },
  { title: "Build Lean Strength", desc: "Recover faster. Train harder. Real changes in body composition you can see.", img: "/images/energy recovery longevity-20260506T071648Z-3-001/energy recovery longevity/Why do people explore Sermorelin therapy_/pexels-julia-larson-6455960-scaled-1-optimized.jpg" },
  { title: "Reignite Drive", desc: "Libido and confidence return. Most patients notice within the first 4-6 weeks.", img: "/images/marketing/bundle/strength-lifestyle.jpg" },
];

function TRTCombinedTreatmentsSection({ cards }) {
  return (
    <>
      <OurTreatmentsSection cards={cards} />

      <section className="bg-[#f9f9f9] py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="mb-3 font-playfair text-lg italic text-gray-600">Rooted in Science</p>
            <h2 className="font-title text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              Designed to support how you feel &amp; function
            </h2>
            <p className="mt-3 text-base text-gray-600 md:text-lg">
              You will notice differences in how you sleep, train, and feel.
            </p>
          </div>

          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {SUPPORT_CARDS.map((c) => (
              <div key={c.title} className="w-[80vw] shrink-0 snap-start md:w-auto md:shrink">
                <div className="h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="relative aspect-[5/3]">
                    <Image src={c.img} alt={c.title} fill sizes="(max-width: 768px) 80vw, 33vw" className="object-cover" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 font-title text-xl font-medium text-gray-900">{c.title}</h3>
                    <p className="text-sm text-gray-600">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRT_BENEFITS.map((b) => (
              <div key={b.title} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <b.icon className="mb-4 h-8 w-8 text-[#6D6FFC]" strokeWidth={1.6} />
                <h3 className="mb-2 font-title text-lg font-medium text-gray-900">{b.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href={CTA_HREF} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-slate-900">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function TRTDesignedToSupportSection() {
  return (
    <section className="overflow-hidden bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <p className="mb-3 text-center font-playfair text-lg italic text-gray-600">Rooted in Science</p>
        <h2 className="mx-auto mb-4 max-w-[760px] text-center font-title text-4xl font-medium text-gray-900 md:text-5xl">
          Designed to support how you feel &amp; function
        </h2>
        <p className="mx-auto mb-12 text-center text-base text-gray-600">
          You will notice differences in how you sleep, train, and feel.
        </p>
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {SUPPORT_CARDS.map((c) => (
            <div
              key={c.title}
              data-support-card
              className="w-[88%] shrink-0 snap-start snap-always md:w-auto md:shrink"
            >
              <div className="h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative aspect-[5/3]">
                  <Image src={c.img} alt={c.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-title text-xl font-medium text-gray-900">{c.title}</h3>
                  <p className="text-sm text-gray-600">{c.desc}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="w-2 shrink-0 md:hidden" aria-hidden />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Member results                                                  */
/* ------------------------------------------------------------------ */

const MEMBER_RESULTS = [
  { name: "Daniel R., 47", before: 218, after: 812, months: 4, image: "/images/negative-sell/negative_1.webp" },
  { name: "Marcus S., 39", before: 298, after: 945, months: 5, image: "/images/negative-sell/negative_2.jpeg" },
  { name: "James T., 52", before: 245, after: 880, months: 6, image: "/images/negative-sell/negative_3.jpg" },
  { name: "Vineeth R., 41", before: 312, after: 1024, months: 5, image: "/images/negative-sell/negative_4.webp" },
  { name: "Brian K., 55", before: 189, after: 756, months: 6, image: "/images/negative-sell/negative_1.webp" },
  { name: "Tom V., 44", before: 267, after: 892, months: 5, image: "/images/negative-sell/negative_2.jpeg" },
];

function MemberResultCard({ r }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={r.image}
          alt={`${r.name} result`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 36vw, 25vw"
        />
      </div>
      <div className="relative grid grid-cols-2 border-b border-gray-100 bg-gray-50 p-5">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Month 0</p>
          <p className="mt-1 font-title text-2xl text-gray-400">{r.before}</p>
          <p className="text-[10px] text-gray-400">ng/dL Total T</p>
        </div>
        <div className="border-l border-dashed border-gray-200 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Month {r.months}</p>
          <p className="mt-1 font-title text-2xl text-[#6D6FFC]">{r.after}</p>
          <p className="text-[10px] text-gray-400">ng/dL Total T</p>
        </div>
        <div className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#6D6FFC] text-white">
          <ArrowUp className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-center text-base font-medium text-gray-900">{r.name}</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-[#6D6FFC]">
          <Check className="h-3.5 w-3.5" /> Verified HealSend Member
        </p>
      </div>
    </article>
  );
}

function TRTMemberResultsSection() {
  return (
    <section className="overflow-hidden bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-14 text-center">
          <p className="font-title text-6xl font-medium text-gray-900 md:text-7xl">
            <span className="text-[#6D6FFC]">2,000+</span> members.
          </p>
          <p className="mt-2 font-playfair text-2xl italic text-[#6D6FFC] md:text-3xl">Life-changing results</p>
          <div className="mt-5">
            <Link href={CTA_HREF} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-slate-900">
              See what&apos;s possible for you <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MEMBER_RESULTS.map((r) => (
            <div
              key={r.name}
              className="w-[80vw] shrink-0 snap-start sm:w-[48%] lg:w-[30%]"
            >
              <MemberResultCard r={r} />
            </div>
          ))}
          <div className="w-2 shrink-0" aria-hidden />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Stats panel                                                     */
/* ------------------------------------------------------------------ */

const TRT_STATS = [
  { label: "Faster Results", value: "2.4×", desc: "HealSend members raise total T levels at twice the speed of monitor-and-wait clinics within 90 days." },
  { label: "Avg. T Increase", value: "+418", unit: "ng/dL", desc: "Average increase in total testosterone within 90 days of starting HealSend's program." },
  { label: "Success Rate", value: "94%", desc: "of HealSend members report higher energy, mood, and libido by week 6 of treatment." },
  { label: "Member Retention", value: "93%", desc: "of HealSend members continue treatment past 90 days because the results speak for themselves." },
];

function StatCard({ s }) {
  return (
    <div className="border-t border-white/20 pt-6">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/50">{s.label}</p>
      <p className="mb-4 font-title text-5xl leading-none md:text-6xl">
        {s.value}
        {s.unit && <span className="ml-1 text-2xl text-white/50">{s.unit}</span>}
      </p>
      <p className="text-sm text-white/60">{s.desc}</p>
    </div>
  );
}

function TRTStatsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const statsScrollRef = useRef(null);

  useEffect(() => {
    const el = statsScrollRef.current;
    if (!el) return;
    const slides = () => [...el.querySelectorAll("[data-stat-slide]")];
    const onScroll = () => {
      const list = slides();
      if (!list.length) return;
      const mid = el.scrollLeft + el.clientWidth * 0.2;
      let best = 0;
      list.forEach((node, i) => {
        const left = node.offsetLeft;
        const right = left + node.offsetWidth;
        if (mid >= left && mid < right) best = i;
      });
      setActiveIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollStatTo = useCallback((index) => {
    const el = statsScrollRef.current;
    const node = el?.querySelectorAll("[data-stat-slide]")?.[index];
    if (node && "scrollIntoView" in node) {
      node.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#101726] text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#6D6FFC]/20 blur-3xl" />

      {/* Desktop: normal grid */}
      <div className="relative mx-auto hidden max-w-[1200px] px-4 py-16 md:block md:px-8 md:py-20">
        <h2 className="mb-3 max-w-[800px] font-title text-4xl font-medium md:text-5xl">
          Why members{" "}
          <span className="font-playfair italic">
            start and <span className="text-[#6D6FFC]">stay</span>
          </span>{" "}
          with HealSend.
        </h2>
        <p className="mb-14 max-w-[640px] text-base text-white/70">
          9 out of 10 members reach optimal T levels in 90 days.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRT_STATS.map((s) => (
            <FadeIn key={s.label}>
              <StatCard s={s} />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Mobile: horizontal scroll + dot indicators (no chevrons) */}
      <div className="relative px-6 py-14 md:hidden">
        <h2 className="mb-3 font-title text-3xl font-medium">
          Why members{" "}
          <span className="font-playfair italic">
            start and <span className="text-[#6D6FFC]">stay</span>
          </span>{" "}
          with HealSend.
        </h2>
        <p className="mb-8 text-sm text-white/70">
          9 out of 10 members reach optimal T levels in 90 days.
        </p>
        <div
          ref={statsScrollRef}
          className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-2 pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Member statistics"
        >
          {TRT_STATS.map((s) => (
            <div
              key={s.label}
              data-stat-slide
              className="min-w-0 shrink-0 basis-[88%] snap-start snap-always rounded-2xl border border-white/10 bg-white/[0.06] p-5"
            >
              <StatCard s={s} />
            </div>
          ))}
          <div className="w-3 shrink-0" aria-hidden />
        </div>
        <div className="mt-5 flex justify-center gap-2">
          {TRT_STATS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollStatTo(i)}
              aria-label={`Show stat ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-[#6D6FFC]" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. Eligibility screener                                            */
/* ------------------------------------------------------------------ */

const SCREENER_QUESTIONS = [
  "Persistent low energy?",
  "Reduced libido?",
  "Trouble building muscle?",
  "Brain fog or low motivation?",
];

function TRTEligibilitySection() {
  const [answers, setAnswers] = useState([true, true, true, true]);
  const yesCount = answers.filter(Boolean).length;
  const score = Math.round((yesCount / 4) * 10);
  const label = score >= 7 ? "high likelihood" : score >= 4 ? "moderate likelihood" : "low likelihood";
  const message =
    score >= 7
      ? "You're a strong candidate for TRT evaluation."
      : score >= 4
        ? "Worth checking your bloodwork — TRT may help."
        : "Few symptoms — but a baseline lab still gives you peace of mind.";

  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 md:grid-cols-2 md:items-stretch md:gap-14 md:px-8">
        <div className="min-w-0 md:flex md:min-h-0 md:flex-col md:justify-center">
          <h2 className="mb-4 font-title text-4xl font-medium text-gray-900 md:text-5xl">
            Find out if{" "}
            <span className="font-playfair italic text-[#6D6FFC]">TRT is right</span>{" "}
            for you.
          </h2>
          <p className="mb-6 text-base leading-relaxed text-gray-600 md:mb-8">
            Take our 60-second symptom screener. We&apos;ll tell you if your symptoms suggest low testosterone.
          </p>
          <div className="relative hidden aspect-[16/10] overflow-hidden rounded-2xl md:block">
            <Image src="/images/energy recovery longevity-20260506T071648Z-3-001/energy recovery longevity/Why do people explore Sermorelin therapy_/pexels-dmitry-ovsyannikov-271243380-17542096-scaled-1-optimized.jpg" alt="Man exercising" fill sizes="50vw" className="object-cover" loading="lazy" />
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-md sm:p-8 md:self-stretch">
          <p className="mb-1 text-sm text-gray-400">Your Low-T Symptom Score</p>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="font-title text-6xl text-[#6D6FFC]">{score}</span>
            <span className="text-sm text-gray-400">/ 10 — {label}</span>
          </div>
          <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
            <motion.div className="h-full rounded-full bg-[#6D6FFC]" animate={{ width: `${score * 10}%` }} transition={{ duration: 0.4 }} />
          </div>
          <div className="mb-6 flex justify-between text-[10px] text-gray-400">
            <span>No symptoms</span><span>High likelihood</span>
          </div>
          <div className="mb-6 space-y-4">
            {SCREENER_QUESTIONS.map((q, i) => (
              <div key={q} className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-4 text-sm sm:px-5 sm:py-5">
                <span className="min-w-0 flex-1 leading-snug text-gray-700">{q}</span>
                <div className="flex shrink-0 gap-2">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setAnswers((a) => a.map((v, j) => (j === i ? val : v)))}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${answers[i] === val ? "bg-[#6D6FFC] text-white" : "border border-gray-200 bg-white text-gray-500"}`}
                    >
                      {val ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-[#F1F5F9] px-4 py-3.5 text-sm font-medium text-[#6D6FFC] sm:px-5">
            <Check className="h-5 w-5 shrink-0" /> {message}
          </div>
          <Link href={CTA_HREF} className="hs-solid-btn flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-semibold">
            See my eligibility <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Process steps                                                  */
/* ------------------------------------------------------------------ */

const PROCESS_STEPS = [
  { num: "STEP 1", title: "Submit your application & meet a doctor", desc: "Complete a quick form and meet with a licensed medical provider 100% online. We'll order your at-home blood draw to confirm your hormone levels.", image: "/images/marketing/bundle/care-support-lifestyle.webp" },
  { num: "STEP 2", title: "Get your medication delivered at home", desc: "If your labs and clinician approve, your custom TRT protocol ships directly to your door — discreet, free, and fast.", image: "/images/marketing/instock.jpeg" },
  { num: "STEP 3", title: "Receive 24/7 support and ongoing care", desc: "Quarterly lab reviews, dose titration, and on-demand clinician messaging keep your protocol dialed in for the long haul.", image: "/images/marketing/bundle/strength-lifestyle.jpg" },
];

function TRTProcessSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mx-auto mb-4 max-w-[800px] text-center font-title text-4xl font-medium text-gray-900 md:text-5xl">
          Hit your hormone goals safely &amp; affordably{" "}
          <span className="font-playfair italic text-[#6D6FFC]">in 3 simple steps</span>
        </h2>
        <div className="mt-6 mb-12 flex flex-wrap justify-center gap-3">
          <Link href={CTA_HREF} className="hs-solid-btn rounded-full px-8 py-3.5 text-base font-semibold">Get started</Link>
          <Link href={CTA_HREF} className="hs-outline-btn rounded-full px-8 py-3.5 text-base font-semibold">See if you&apos;re eligible</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PROCESS_STEPS.map((s, i) => (
            <FadeIn key={s.num}>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative h-44 bg-[#F1F5F9]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-[#101726] px-3 py-1 text-[10px] font-semibold tracking-widest text-white">{s.num}</span>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-title text-xl font-medium text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. Lab Tested                                                     */
/* ------------------------------------------------------------------ */

function TRTLabTestedSection() {
  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 md:grid-cols-2 md:gap-14 md:px-8">
        <div>
          <h2 className="mb-4 font-title text-4xl font-medium text-gray-900 md:text-5xl">
            Lab tested medications for{" "}
            <span className="font-playfair italic text-[#6D6FFC]">quality &amp; potency</span>
          </h2>
          <p className="mb-6 text-base text-gray-600">
            Our medication is delivered from a state-licensed 503B pharmacy in our network, right to your door.
          </p>
          <ul className="divide-y divide-gray-100">
            {[
              ["Third-party quality control testing", "every batch verified for purity and potency."],
              ["Compounded in U.S. pharmacies", "no overseas labs, no gray-market suppliers."],
              ["MCT-oil base", "cleaner absorption and gentler injection than seed-oil formulations."],
              ["200mg/mL pharmaceutical-grade dosing", "full strength, no dilution."],
            ].map(([bold, rest]) => (
              <li key={bold} className="flex gap-3 py-3.5 text-sm text-gray-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6D6FFC]" />
                <span><strong className="text-gray-900">{bold}</strong> — {rest}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-3xl">
          <Image src="/images/67b8bc339365c3a3c21c8190_cta_sermorelin-optimized.jpg" alt="Lab tested TRT medication" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  12. What's Included                                                */
/* ------------------------------------------------------------------ */

const INCLUDED_ITEMS = [
  { icon: Users, title: "Unlimited Access to Clinicians", bullets: ["See a licensed clinician same-day", "Unlimited visits, all online"] },
  { icon: FlaskConical, title: "At-Home Lab Work", bullets: ["Phlebotomist visits your house", "Full hormone panel — no clinic needed"] },
  { icon: Phone, title: "Always-On Medical Hotline", bullets: ["Questions about side effects? Call our medical hotline", "Fast, clear support from U.S. agents"] },
  { icon: Truck, title: "On-Time Refills Guaranteed", bullets: ["Fast, reliable delivery for every refill", "Refills arrive before you ever run out"] },
];

function TRTIncludedSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mx-auto mb-3 max-w-[760px] text-center font-title text-4xl font-medium text-gray-900 md:text-5xl">
          The most comprehensive TRT care{" "}
          <span className="font-playfair italic text-[#6D6FFC]">program online.</span>
        </h2>
        <p className="mx-auto mb-14 max-w-[640px] text-center text-base text-gray-600">
          Most TRT clinics stop at medication. HealSend pairs your treatment with clinician guidance, lab work, and ongoing care.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {INCLUDED_ITEMS.map((item) => (
            <FadeIn key={item.title}>
              <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex-1">
                  <span className="mb-2 inline-block rounded-full bg-[#F1F5F9] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6D6FFC]">Included</span>
                  <h3 className="mb-2 font-title text-lg font-medium text-gray-900">{item.title}</h3>
                  <ul className="space-y-1">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6D6FFC]" />{b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F1F5F9]">
                  <item.icon className="h-9 w-9 text-[#6D6FFC]" strokeWidth={1.4} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  13. Trust marquee                                                  */
/* ------------------------------------------------------------------ */

const TRT_TRUST_ITEMS = [
  { text: "FSA & HSA eligible", Icon: BadgeCheck },
  { text: "Personalized Rx TRT plans", Icon: PillBottle },
  { text: "No memberships or hidden fees", Icon: Laptop },
  { text: "Free & fast shipping", Icon: Truck },
  { text: "US-only certified pharmacies", Icon: null, svg: "True" },
  { text: "Always-on clinician support", Icon: Headset },
  { text: "1,000,000+ prescriptions written", Icon: ClipboardCheck },
  { text: "2,000+ members", Icon: Users },
];

/* ------------------------------------------------------------------ */
/*  14. Comparison                                                     */
/* ------------------------------------------------------------------ */

function TRTComparisonSection() {
  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mb-3 text-center font-title text-4xl font-medium text-gray-900 md:text-5xl">
          Same medication.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Very different experience.</span>
        </h2>
        <p className="mx-auto mb-14 max-w-[600px] text-center text-base text-gray-600">
          What separates HealSend from typical TRT clinics and online testosterone programs.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[#101726] p-8 text-white">
            <h3 className="mb-5 font-title text-2xl">HealSend</h3>
            <ul className="space-y-3">
              {["Personalized, lab-driven TRT protocols", "Expert-led education with active member community", "Treatment precisely matched to your bloodwork and goals", "Doses titrated by your clinician to minimize side effects", "Unlimited video calls and messaging with your clinician", "Quarterly lab work included — no surprise fees", "100% online. Free, discreet shipping."].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-white/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6D6FFC]" />{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-8">
            <h3 className="mb-5 font-title text-2xl text-gray-800">Others</h3>
            <ul className="space-y-3">
              {["Generic, fixed protocols you have to adapt to", "No education, no support, no community", "Same dose for everyone, basic intake forms", "Side effects handled reactively, not proactively", "No follow-up after your prescription ships", "$70-150 lab fees on top of monthly cost", "Pharmacy lines, long waits, no guarantees"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                  <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" aria-hidden />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  15. FAQ                                                            */
/* ------------------------------------------------------------------ */

const TRT_FAQ_ITEMS = [
  { question: "What is TRT?", answer: "Testosterone Replacement Therapy restores testosterone to optimal levels (600–900 ng/dL) in men diagnosed with low T. HealSend uses testosterone cypionate injections — the gold standard — with clinician-guided dosing." },
  { question: "How quickly will I see results?", answer: "Most members notice improved energy and mood within 2–4 weeks. Strength and body composition changes typically appear by weeks 6–8. Full optimization with lab-confirmed levels by week 12." },
  { question: "Will TRT affect my fertility?", answer: "Exogenous testosterone can suppress natural production and sperm count. If fertility is a concern, ask your clinician about enclomiphene — it raises T naturally while preserving fertility." },
  { question: "What's included in my plan?", answer: "At-home blood draw kit, clinician review, testosterone cypionate prescription, syringes and supplies, free 48-hour shipping, unlimited clinician messaging, and regular follow-up labs." },
  { question: "Is lab work included?", answer: "Yes. Initial and follow-up labs are included in all plans. We test total testosterone, free T, SHBG, estradiol, CBC, and metabolic panel." },
  { question: "Can I cancel anytime?", answer: "Yes. All plans are month-to-month with no contracts or cancellation fees. 91% of members stay past 90 days because the results speak for themselves." },
  { question: "Which states do you serve for TRT?", answer: "HealSend is licensed in 47 states. Your eligibility is confirmed during the assessment before any charge. If we can't ship to your state, you don't pay." },
  { question: "What medications do HealSend clinicians prescribe?", answer: "Our primary protocol uses Testosterone Cypionate (compounded with MCT oil) administered as weekly subcutaneous injections. Optional add-ons include hCG for fertility preservation, Anastrozole for estrogen control, and Tadalafil for daily ED + prostate support." },
  { question: "Does the price stay the same as my dose changes?", answer: "Yes. Your monthly price is locked in regardless of dose adjustments. Your clinician titrates your protocol based on bloodwork — at no extra cost to you." },
  { question: "Does my plan include lab work and supplies?", answer: "Every plan includes your medication, syringes, alcohol pads, sharps disposal, your initial hormone panel, and quarterly follow-up labs." },
];

function TRTFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:!pb-10 md:!pt-20 md:mt-0 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-balance font-title text-4xl font-medium text-slate-900 md:text-5xl">
          Your questions.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Honest answers.</span>
        </h2>
        <p className="mb-16 max-w-lg text-start text-sm text-gray-600">
          Everything you want to know about TRT before getting started.
        </p>
        <div className="flex flex-col gap-4">
          {TRT_FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="overflow-hidden rounded-[1.25rem] bg-white shadow-sm">
                <button type="button" onClick={() => setOpenIndex(isOpen ? null : idx)} className="flex w-full items-center justify-between gap-6 px-7 py-7 text-left md:px-10 md:py-9" aria-expanded={isOpen}>
                  <span className="pr-4 text-lg font-bold text-gray-900 md:text-xl">{item.question}</span>
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-[#333333] p-1.5 md:p-2">
                    {isOpen ? <Minus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} /> : <Plus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
                      <div className="px-7 pb-7 text-base leading-relaxed text-gray-600 md:px-10 md:pb-9 md:text-lg">{item.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={CTA_HREF} className="hs-solid-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto">Get started</Link>
          <Link href={CTA_HREF} className="hs-outline-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto">See if you&apos;re eligible</Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  16. Care                                                           */
/* ------------------------------------------------------------------ */

function TRTCareSection() {
  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 md:grid-cols-2 md:gap-14 md:px-8">
        <div className="relative aspect-square overflow-hidden rounded-3xl">
          <Image src="/images/articles/care-support-lifestyle.webp" alt="HealSend care team" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" loading="lazy" />
        </div>
        <div>
          <h2 className="mb-6 font-title text-4xl font-medium text-gray-900 md:text-5xl">
            We&apos;re here when{" "}
            <span className="font-playfair italic text-[#6D6FFC]">you need us.</span>
          </h2>
          <div className="divide-y divide-gray-100">
            {[
              ["Always available", "7 days a week · 8:00am – 8:00pm ET"],
              ["Care-team messaging", "Secure support inside your HealSend account"],
              ["Email us", "yourhealth@healsend.com"],
              ["Patient care line", "1-631-800-9294"],
            ].map(([label, val]) => (
              <div key={label} className="py-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
                <p className="mt-1 text-base text-gray-900">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  17. Final CTA                                                      */
/* ------------------------------------------------------------------ */

function TRTFinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#101726] py-20 text-center text-white md:py-28">
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[500px] w-[500px] rounded-full bg-[#6D6FFC]/20 blur-3xl" />
      <div className="relative mx-auto max-w-[700px] px-4">
        <h2 className="mb-5 font-title text-4xl font-medium md:text-6xl">
          The next 90 days will pass{" "}
          <span className="font-playfair italic text-[#6D6FFC]">either way.</span>
        </h2>
        <p className="mb-8 text-lg text-white/70">
          Take the 90-second assessment. A clinician will review your case within 48 hours of your labs.
        </p>
        <Link href={CTA_HREF} className="hs-solid-btn inline-flex items-center gap-2 rounded-full px-10 py-4 text-base font-semibold">
          Get my personalized plan <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-xs text-white/40">By starting, you agree to our terms &amp; privacy policy. Provider-prescribed when appropriate.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page composition                                                   */
/* ------------------------------------------------------------------ */

export default function TRTLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <TRTWillpowerSection />
      <TRTProductHeroSection />
      <MediaLogosBanner />
      <FadeIn><TRTCombinedTreatmentsSection cards={TREATMENT_PLAN_CARDS.filter(c => c.id !== "trt")} /></FadeIn>
      {/* <FadeIn><TRTPlansSection /></FadeIn> */}
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="TRT Benefits" />
      <FadeIn><TRTSymptomsSection /></FadeIn>
      {/* <FadeIn><TRTDesignedToSupportSection /></FadeIn> — merged into TRTCombinedTreatmentsSection */}
      <FadeIn><TRTMemberResultsSection /></FadeIn>
      <TRTStatsSection />
      <FadeIn><TRTEligibilitySection /></FadeIn>
      <FadeIn><TRTProcessSection /></FadeIn>
      <CleanSimpleEffective productData={productData} />
      <FadeIn><LabTested productData={productData} /></FadeIn>
      <MarketingTrustMarquee items={TRT_TRUST_ITEMS} edgeToEdge={false} />
      <FadeIn><SameMedicationSection planLabel="Personalized, clinically-proven TRT plans" /></FadeIn>
      <TRTFAQSection />
      <FadeIn><SupportAvailabilitySection /></FadeIn>
      <TRTFinalCTASection />
      <MarketingFooter />
    </div>
  );
}
