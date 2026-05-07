"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Minus,
  Pill,
  Plus,
  ShieldCheck,
  Star,
  Stethoscope,
  TrendingUp,
  Zap,
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
  SimpleSteps,
  OurTreatmentsSection,
  TREATMENT_PLAN_CARDS,
  SupportAvailabilitySection,
  WillpowerVerticalColumn,
  WillpowerHorizontalRow,
  WILLPOWER_LEFT_MARQUEE_ITEMS,
  WILLPOWER_RIGHT_MARQUEE_ITEMS,
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/growth-hormone-support";

/* ------------------------------------------------------------------ */
/*  Local FadeInSection                                                */
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
  "/images/4_Home_Doctors_Online_Consultation-Testimonials_02.jpg",
  "/images/slider/Copy of pexels-farhadirani-34650790.jpg",
  "/images/slider/Copy of look-studio-S0T98VD2KZs-unsplash.jpg",
  "/images/slider/Copy of pexels-tima-miroshnichenko-5928317.jpg",
];

/* ------------------------------------------------------------------ */
/*  1. Hero — with product card                                        */
/* ------------------------------------------------------------------ */

const HERO_QUICK_STATS = [
  {
    icon: Clock3,
    bold: "4–8 weeks",
    text: "to full effect, with energy gains by week 2.",
  },
  {
    icon: TrendingUp,
    bold: "Up to 2× testosterone",
    text: "with fertility intact.",
  },
  {
    icon: Star,
    bold: "Reversible",
    text: "— stop anytime, return to baseline.",
  },
];

const ENCLO_HERO_BENEFITS = [
  { icon: TrendingUp, text: "Up to 2× total testosterone in 8 weeks — clinically validated." },
  { icon: ShieldCheck, text: "Preserves fertility & testicular function — unlike traditional TRT." },
  { icon: Pill, text: "One oral pill, once a day — no needles, no creams, no clinic visits." },
];

const ENCLO_HERO_PRICING = [
  { name: "Quarterly Plan", firstMonth: 39, thenPrice: 79, isBestValue: true },
  { name: "Monthly Plan", firstMonth: 79, thenPrice: 79, isBestValue: false, isMuted: true },
];

const ENCLO_HERO_DESCRIPTION =
  "Enclomiphene citrate is a selective estrogen receptor modulator (SERM) that stimulates your body's natural testosterone production by signaling the hypothalamus and pituitary gland. Unlike TRT, it preserves fertility and testicular function while raising T levels — making it the preferred first-line option for men who want optimization without trade-offs.";

function EncoHeroTabs() {
  const [activeTab, setActiveTab] = useState("benefits");

  return (
    <div className="mt-5 rounded-[1rem] border border-gray-200 bg-white p-2 shadow-sm">
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
              ? ENCLO_HERO_BENEFITS.map((item, idx) => {
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
                  Enclomiphene Citrate
                </h3>
                <div className="rounded-[1rem] border border-gray-200">
                  {ENCLO_HERO_PRICING.map((plan, index) => (
                    <div
                      key={plan.name}
                      className={`relative flex items-center justify-between p-4 ${
                        index !== ENCLO_HERO_PRICING.length - 1 ? "border-b border-gray-200" : ""
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
                {ENCLO_HERO_DESCRIPTION}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const ENCLO_HERO_FAQS = [
  {
    question: "What is enclomiphene and why does it matter?",
    answer:
      "Enclomiphene citrate is a selective estrogen receptor modulator (SERM) that stimulates your body's own testosterone production. It raises T levels naturally while preserving fertility — something traditional TRT cannot do.",
  },
  {
    question: "How is it different from testosterone injections?",
    answer:
      "Unlike TRT, enclomiphene works with your body's hormonal axis instead of replacing it. That means no testicular shrinkage, no fertility shutdown, and no dependency. You can stop anytime.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most men notice energy and mood improvements within 2–4 weeks. Full testosterone optimization typically occurs by 8–12 weeks, confirmed by lab work.",
  },
];

function EncoHeroFaqs() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="mt-4 space-y-3">
      {ENCLO_HERO_FAQS.map((faq, idx) => (
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

function EncloWillpowerSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1F5F9]">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-10 md:px-[3.25rem] md:py-14 lg:h-[calc(100dvh-80px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <div className="mt-5 max-w-[34rem]">
              <h2 className="text-balance font-title text-4xl font-medium leading-tight tracking-tight text-gray-950 md:text-5xl">
                Boost testosterone.{" "}
                <span className="font-playfair italic font-medium text-[#6d6ffc]">
                  Keep your fertility.
                </span>
              </h2>
              <p className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-800 lg:text-[1.05rem]">
                The smart alternative to TRT. One pill a day stimulates your
                body&apos;s natural testosterone production &mdash; without
                shutting down your testicles or your fertility.
              </p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              <li className="grid grid-cols-[auto_1fr] items-start gap-1 text-sm md:text-lg">
                <div className="flex items-center gap-4 text-base md:text-sm">
                  <Pill className="h-6 w-6 shrink-0" strokeWidth={2} />
                  <span>
                    Enclomiphene citrate &mdash; boost testosterone naturally,
                    no needles required
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
                <p className="w-full text-center text-sm font-semibold text-gray-700">
                  Takes 90 seconds · 100% private · free
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

function EncloProductHeroSection() {
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
                Enclomiphene Citrate
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
                    src="/images/Enclomiphene-20260506T071530Z-3-001/Enclomiphene/Extra/image 1.webp"
                    alt="Enclomiphene Citrate — in stock"
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
                      $39
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
                    then $79/mo*
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
                  *$39 first month covers the clinician visit and initial supply
                  on the quarterly plan. Recurring billing of $79/month begins at
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
                  See if you qualify
                </Link>
                <p className="mt-1 w-full text-center text-xs text-gray-500 md:text-sm">
                  Discount auto-applied at checkout
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
                    ? ENCLO_HERO_BENEFITS.map((item, idx) => {
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
                        Enclomiphene Citrate
                      </h3>
                      <div className="rounded-[1rem] border border-gray-200">
                        {ENCLO_HERO_PRICING.map((plan, index) => (
                          <div
                            key={plan.name}
                            className={`relative flex items-center justify-between p-4 ${
                              index !== ENCLO_HERO_PRICING.length - 1 ? "border-b border-gray-200" : ""
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
                      {ENCLO_HERO_DESCRIPTION}
                    </p>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-2 flex justify-between border-t border-gray-100 px-5 pb-2 pt-4 text-xs text-gray-500 md:px-6">
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
            {ENCLO_HERO_FAQS.map((faq, idx) => (
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

          <div className="rounded-[1rem] bg-gray-100 p-4 text-xs leading-relaxed text-gray-700">
            The statements on this page have not been evaluated by the Food
            and Drug Administration. This product is not intended to diagnose,
            treat, cure or prevent any disease.
          </div>

          <div className="mt-3 space-y-2.5 text-[11px] leading-relaxed text-gray-600">
            <p>
              *Price shown applies to Enclomiphene quarterly plan. Actual
              price will depend on plan prescribed. Final treatment fit
              depends on clinician review.
            </p>
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

function EncoPressStrip() {
  return (
    <section className="border-y border-gray-200 bg-[#f9f9f9] py-6">
      <div className="mx-auto max-w-[1200px] px-4">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
          As featured in
        </p>
        <div className="flex flex-wrap items-center justify-around gap-6">
          {PRESS_LOGOS.map((name) => (
            <span key={name} className="font-title text-lg text-gray-400 opacity-60 md:text-xl">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Stat bar ("Low T is everywhere")                                */
/* ------------------------------------------------------------------ */

function useCountAnimation(from, to, duration = 1.8, trigger = false) {
  const [value, setValue] = useState(from);
  React.useEffect(() => {
    if (!trigger) {
      setValue(from);
      return;
    }
    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, from, to, duration]);
  return value;
}

function AnimatedStat({ from, to, duration, format, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });
  const count = useCountAnimation(from, to, duration, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <p className="mb-3 font-title text-5xl leading-none md:text-6xl">{format(count)}</p>
      <p className="text-sm text-white/70">{label}</p>
    </motion.div>
  );
}

function EncoStatBarSection() {
  return (
    <section className="relative overflow-hidden bg-[#101726] py-14 text-white md:py-16">
      <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full bg-[#6D6FFC]/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mx-auto mb-3 max-w-[800px] text-center font-title text-3xl font-medium md:text-4xl">
          You&apos;re not imagining it.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Low T is everywhere.</span>
        </h2>
        <p className="mb-12 text-center text-sm text-white/60">And most men don&apos;t even know they have it.</p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
          <AnimatedStat from={1} to={4} duration={1.5} format={(v) => `1 in ${v}`} label="men over 30 have clinically low testosterone" />
          <AnimatedStat from={0} to={80} duration={1.8} format={(v) => `${v}%`} label="have never had their levels tested" />
          <AnimatedStat from={100} to={40} duration={1.8} format={(v) => `${v}%`} label="of men over 45 are below the optimal range" />
          <AnimatedStat from={0} to={500000} duration={2} format={(v) => v.toLocaleString()} label="U.S. men diagnosed every single year" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. How enclomiphene works (HPG axis)                               */
/* ------------------------------------------------------------------ */

const HPG_STEPS = [
  { icon: "/images/img/image.png", title: "Hypothalamus", desc: "Enclomiphene blocks estrogen receptors in your brain — removing the brake on your hormone signal.", tag: "Where it acts" },
  { icon: "/images/img/pituitary-icon-element-design-260nw-2700802657.webp", title: "Pituitary", desc: "Your brain releases more LH and FSH — the messenger hormones that talk to your testicles.", tag: "Signal cascade" },
  { icon: "/images/img/Testicles.png", title: "Testicles", desc: "Your testicles ramp up natural testosterone production — and keep producing sperm normally.", tag: "Production restored" },
  { icon: "/images/img/bloodstram.jpg", title: "Bloodstream", desc: "Total and free T rise to optimal levels — without the shutdown TRT causes.", tag: "2× T levels" },
];

function HpgCarousel() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const w = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };
  return (
    <>
      {/* Mobile: horizontal scroll + nav buttons */}
      <div className="relative sm:hidden">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {HPG_STEPS.map((step) => (
            <div key={step.title} data-card className="min-w-[75vw] snap-center">
              <div className="group h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                    <Image src={step.icon} alt={step.title} fill sizes="36px" className="object-contain" loading="lazy" />
                  </div>
                  <h3 className="font-title text-lg font-medium text-gray-900">{step.title}</h3>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">{step.desc}</p>
                <span className="inline-block rounded-md bg-gray-50 px-2 py-1 text-[10px] font-semibold text-[#6D6FFC]">
                  {step.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button onClick={() => scroll(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button onClick={() => scroll(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {HPG_STEPS.map((step) => (
          <FadeIn key={step.title}>
            <div className="group h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#6D6FFC]/30 hover:bg-[#F1F5F9]">
              <div className="mb-3 flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                  <Image src={step.icon} alt={step.title} fill sizes="36px" className="object-contain" loading="lazy" />
                </div>
                <h3 className="font-title text-lg font-medium text-gray-900">{step.title}</h3>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-gray-600">{step.desc}</p>
              <span className="inline-block rounded-md bg-gray-50 px-2 py-1 text-[10px] font-semibold text-[#6D6FFC] group-hover:bg-white">
                {step.tag}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </>
  );
}

function EncoHowItWorksSection() {
  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <span className="mb-4 inline-block rounded-full bg-[#F1F5F9] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            How enclomiphene works
          </span>
          <h2 className="mb-4 font-title text-4xl font-medium text-gray-900 md:text-5xl">
            Your body already makes testosterone.{" "}
            <span className="font-playfair italic text-[#6D6FFC]">Enclomiphene tells it to make more.</span>
          </h2>
          <p className="text-base text-gray-600">
            Unlike TRT, which replaces what your body makes, enclomiphene gently restarts your own production
            by targeting one tiny signal in your brain.
          </p>
        </div>

        <HpgCarousel />

        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[#F1F5F9] p-5 text-sm text-gray-700">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#6D6FFC]" />
          <p>
            <strong>Why this matters:</strong> Traditional TRT shuts down this entire pathway because your body senses
            external testosterone and stops making its own. Enclomiphene does the opposite — it keeps the whole system
            running, just at a higher set point. That&apos;s why fertility and testicular size are preserved.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Enclomiphene vs TRT comparison table                            */
/* ------------------------------------------------------------------ */

const COMPARISON_ROWS = [
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
      <XIcon className="h-3.5 w-3.5 text-gray-400" strokeWidth={3} />
    </span>
  );
  return null;
}

function EncoComparisonSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
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
              {COMPARISON_ROWS.map((row, i) => (
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
          <Link href={CTA_HREF} className="hs-solid-btn inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold">
            See if enclomiphene fits your goals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Daily protocol (pill calendar)                                  */
/* ------------------------------------------------------------------ */

const PROTOCOL_STEPS = [
  { title: "Take with breakfast", desc: "One capsule, swallowed whole. Most patients pair it with their morning coffee or first meal." },
  { title: "Track in your dashboard", desc: "Optional check-ins so your clinician sees your symptoms, energy, and side effects in real time." },
  { title: "Bloodwork at week 6", desc: "Phlebotomist comes to your home. Your dose is titrated based on the result — not guessed." },
  { title: "Stop anytime", desc: "Unlike TRT, you can pause or quit without shutdown protocols. Your levels return to baseline naturally." },
];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function EncoDailyProtocolSection() {
  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 md:grid-cols-2 md:gap-14 md:px-8 items-start">
        <div>
          <h2 className="mb-4 font-title text-4xl font-medium text-gray-900 md:text-5xl">
            One pill. Same time.{" "}
            <span className="font-playfair italic text-[#6D6FFC]">Every day.</span>
          </h2>
          <p className="mb-8 text-base text-gray-600">
            No injections to schedule. No creams to apply. No clinic visits. The simplest TRT-alternative protocol on the market.
          </p>
          <div className="space-y-0 divide-y divide-gray-100">
            {PROTOCOL_STEPS.map((s, i) => (
              <div key={s.title} className="flex gap-4 py-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC] font-title text-sm text-white">
                  {i + 1}
                </span>
                <div>
                  <h4 className="mb-1 text-base font-semibold text-gray-900">{s.title}</h4>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="relative -mx-8 -mt-8 mb-6 overflow-hidden rounded-t-3xl">
            <div className="relative aspect-[16/8]">
              <Image
                src="/images/Enclomiphene-20260506T071530Z-3-001/Enclomiphene/Extra/image 1.webp"
                alt="Morning routine"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">This week&apos;s routine</p>
          <div className="mb-6 grid grid-cols-7 gap-2">
            {DAYS.map((d, i) => {
              const taken = i < 3;
              const today = i === 3;
              return (
                <div
                  key={`${d}-${i}`}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-semibold ${
                    today
                      ? "bg-[#6D6FFC] text-white"
                      : taken
                        ? "bg-[#F1F5F9] text-[#6D6FFC]"
                        : "bg-gray-50 text-gray-300"
                  }`}
                >
                  <span>{d}</span>
                  <div className={`mt-1 h-2 w-4 rounded-full ${today ? "bg-white/60" : taken ? "bg-[#6D6FFC]" : "bg-gray-200"}`} />
                </div>
              );
            })}
          </div>
          <div className="rounded-2xl bg-[#F1F5F9] p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#6D6FFC]">What to expect</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Week 1&ndash;2:</strong> Energy and morning wood return.</li>
              <li><strong>Week 3&ndash;4:</strong> Mood lifts, drive comes back.</li>
              <li><strong>Week 6&ndash;8:</strong> Total T peaks. Body comp shifts.</li>
              <li><strong>Week 12+:</strong> Steady-state. Strength gains.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. 90-Day T-Level Timeline (NEW)                                   */
/* ------------------------------------------------------------------ */

const TIMELINE_POINTS = [
  { week: "Day 0", value: 280, cx: 64, cy: 254 },
  { week: "Week 2", value: 380, cx: 222, cy: 223 },
  { week: "Week 4", value: 540, cx: 382, cy: 173 },
  { week: "Week 8", value: 780, cx: 540, cy: 100 },
  { week: "Week 12", value: 920, cx: 700, cy: 56 },
];

const ENCLO_RESULTS = [
  { name: "Marcus T., 34", note: "Trying for kids", before: 312, after: 1022, months: 3 },
  { name: "David R., 41", note: "Switched from TRT", before: 334, after: 913, months: 3 },
  { name: "Andrew K., 38", note: "Wanted gentler option", before: 295, after: 812, months: 4 },
];

function EncoTimelineSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <h2 className="mb-3 font-title text-4xl font-medium text-gray-900 md:text-5xl">
            What your levels actually do over{" "}
            <span className="font-playfair italic text-[#6D6FFC]">90 days.</span>
          </h2>
          <p className="text-base text-gray-600">
            Average HealSend member labs vs. baseline, measured over the first 12 weeks of treatment.
          </p>
        </div>

        {/* Chart card — full width */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 w-full">
            <svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Testosterone levels rising from 280 to 920 ng/dL over 12 weeks" className="w-full">
              <rect x="64" y="30" width="636" height="62" fill="#6D6FFC" opacity="0.08" rx="4" />
              <text x="74" y="48" fontFamily="sans-serif" fontSize="11" fill="#6D6FFC" fontWeight="600" letterSpacing="0.04em">OPTIMAL ZONE &middot; 800&ndash;1000 ng/dL</text>

              <line x1="64" y1="30" x2="700" y2="30" stroke="#E2E8F0" strokeWidth="1" />
              <text x="56" y="34" fontFamily="sans-serif" fontSize="11" fill="#94A3B8" textAnchor="end">1000</text>

              <line x1="64" y1="92" x2="700" y2="92" stroke="#E2E8F0" strokeWidth="1" />
              <text x="56" y="96" fontFamily="sans-serif" fontSize="11" fill="#94A3B8" textAnchor="end">800</text>

              <line x1="64" y1="155" x2="700" y2="155" stroke="#E2E8F0" strokeWidth="1" />
              <text x="56" y="159" fontFamily="sans-serif" fontSize="11" fill="#94A3B8" textAnchor="end">600</text>

              <line x1="64" y1="218" x2="700" y2="218" stroke="#E2E8F0" strokeWidth="1" />
              <text x="56" y="222" fontFamily="sans-serif" fontSize="11" fill="#94A3B8" textAnchor="end">400</text>

              <line x1="64" y1="280" x2="700" y2="280" stroke="#CBD5E1" strokeWidth="1" />
              <text x="56" y="284" fontFamily="sans-serif" fontSize="11" fill="#94A3B8" textAnchor="end">200</text>

              <text x="20" y="160" fontFamily="sans-serif" fontSize="11" fill="#94A3B8" fontWeight="500" transform="rotate(-90 20 160)" textAnchor="middle">Total T (ng/dL)</text>

              <path d="M 64 254 C 150 250, 200 232, 254 200 C 318 168, 380 122, 446 92 C 510 70, 580 60, 700 56 L 700 280 L 64 280 Z" fill="#6D6FFC" opacity="0.06" />

              <line x1="64" y1="255" x2="700" y2="255" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 5" />

              <path d="M 64 254 C 150 250, 200 232, 254 200 C 318 168, 380 122, 446 92 C 510 70, 580 60, 700 56" stroke="#6D6FFC" strokeWidth="3" fill="none" strokeLinecap="round" />

              {TIMELINE_POINTS.map((pt, i) => (
                <g key={pt.week}>
                  <circle cx={pt.cx} cy={pt.cy} r={i === TIMELINE_POINTS.length - 1 ? 9 : 6} fill="#6D6FFC" stroke="white" strokeWidth={i === TIMELINE_POINTS.length - 1 ? 2.5 : 2} />
                  <text x={pt.cx} y={304} fontFamily="sans-serif" fontSize="12" fill="#94A3B8" textAnchor="middle">{pt.week}</text>
                  <text x={pt.cx} y={320} fontFamily="sans-serif" fontSize="12" fill="#6D6FFC" textAnchor="middle" fontWeight="700">{pt.value}</text>
                </g>
              ))}

              <g transform="translate(560 18)">
                <rect width="130" height="26" rx="13" fill="#6D6FFC" />
                <text x="65" y="17" fontFamily="sans-serif" fontSize="11" fill="white" fontWeight="700" textAnchor="middle">+640 ng/dL &middot; 3.3&times;</text>
              </g>
            </svg>
          </div>

          <div className="flex flex-wrap gap-6 border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="h-[3px] w-[18px] rounded-full bg-[#6D6FFC]" />
              Avg. HealSend member on enclomiphene
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-[18px] border-t-2 border-dashed border-gray-400" />
              Untreated baseline
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="h-3 w-[18px] rounded-sm bg-[#6D6FFC]/10" />
              Optimal range (800&ndash;1000)
            </div>
          </div>
        </div>

        {/* Real member lab results */}
        <LabResultsCarousel />
      </div>
    </section>
  );
}

function ResultCard({ r }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative grid grid-cols-2 border-b border-gray-100 bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Month 0</p>
          <p className="mt-1 font-title text-3xl text-gray-400">{r.before}</p>
          <p className="text-[10px] text-gray-400">ng/dL Total T</p>
        </div>
        <div className="border-l border-dashed border-gray-200 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Month {r.months}</p>
          <p className="mt-1 font-title text-3xl text-[#6D6FFC]">{r.after}</p>
          <p className="text-[10px] text-gray-400">ng/dL Total T</p>
        </div>
        <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#6D6FFC] text-white">
          <ArrowUp className="h-4 w-4" />
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="font-title text-lg text-gray-900">{r.name}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-[#6D6FFC]">
          <Check className="h-3.5 w-3.5" /> Verified — {r.note}
        </p>
      </div>
    </div>
  );
}

function LabResultsCarousel() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const w = card ? card.offsetWidth + 20 : 300;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };
  return (
    <div className="mt-10">
      <h3 className="mb-6 text-center font-title text-2xl font-medium text-gray-900 md:text-3xl">
        Real lab results from{" "}
        <span className="font-playfair italic text-[#6D6FFC]">real members.</span>
      </h3>

      {/* Mobile: horizontal scroll */}
      <div className="relative sm:hidden">
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {ENCLO_RESULTS.map((r) => (
            <div key={r.name} data-card className="min-w-[80vw] snap-center">
              <ResultCard r={r} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <button onClick={() => scroll(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button onClick={() => scroll(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {ENCLO_RESULTS.map((r) => (
          <FadeIn key={r.name}><ResultCard r={r} /></FadeIn>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Why enclomiphene (3 pillars)                                    */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    num: "01.",
    title: "Energy, mood, drive",
    desc: "The same outcomes you'd want from TRT — restored libido, sharper focus, gym recovery — without ceding control of your hormones.",
    img: "/images/Enclomiphene-20260506T071530Z-3-001/Enclomiphene/Uses & Benefits(background)/Man-lifting.jpeg",
  },
  {
    num: "02.",
    title: "Fertility intact",
    desc: "Want kids now or later? Enclomiphene maintains sperm production and testicular size. TRT can't say that.",
    img: "/images/marketing/bundle/strength-lifestyle.jpg",
  },
  {
    num: "03.",
    title: "No dependency",
    desc: "Your body keeps making its own testosterone. Stop the medication and you return to baseline — no withdrawal protocol needed.",
    img: "/images/energy recovery longevity-20260506T071648Z-3-001/energy recovery longevity/Why do people explore Sermorelin therapy_/pexels-julia-larson-6455960-scaled-1-optimized.jpg",
  },
];

function PillarCard({ p }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative aspect-[16/10]">
        <Image src={p.img} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" loading="lazy" />
      </div>
      <div className="p-7">
        <h3 className="mb-2 font-title text-xl font-medium text-gray-900">{p.title}</h3>
        <p className="text-sm text-gray-600">{p.desc}</p>
      </div>
    </div>
  );
}

function PillarsCarousel() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const w = card ? card.offsetWidth + 20 : 300;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };
  return (
    <>
      {/* Mobile: horizontal scroll */}
      <div className="relative md:hidden">
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {PILLARS.map((p) => (
            <div key={p.num} data-card className="min-w-[80vw] snap-center">
              <PillarCard p={p} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <button onClick={() => scroll(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button onClick={() => scroll(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden gap-5 md:grid md:grid-cols-3">
        {PILLARS.map((p) => (
          <FadeIn key={p.num}><PillarCard p={p} /></FadeIn>
        ))}
      </div>
    </>
  );
}

function EncoWhySection() {
  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-[700px] text-center">
          <h2 className="mb-3 font-title text-4xl font-medium text-gray-900 md:text-5xl">
            A smarter way to raise testosterone{" "}
            <span className="font-playfair italic text-[#6D6FFC]">naturally.</span>
          </h2>
          <p className="text-base text-gray-600">
            Three reasons men switch from TRT to enclomiphene — and never look back.
          </p>
        </div>
        <PillarsCarousel />
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/*  10. Testimonials                                                   */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote: "I almost did injections. Then my urologist said 'try enclomiphene first — you're 32, your wife wants a second kid.' Three months in, T doubled, sperm count untouched. This is the move.",
    name: "Daniel R., 32",
    detail: "Quarterly plan · Texas",
  },
  {
    quote: "Switched from TRT injections after 18 months. The shutdown was real — I felt locked in. On enclomiphene I'm at 740 ng/dL, my own production is back, and the convenience is night and day.",
    name: "Marcus S., 41",
    detail: "Annual plan · Florida",
  },
  {
    quote: "What I appreciated most: the clinician explained the trade-offs honestly. Said TRT might be stronger but enclomiphene was a smarter starting point at my age. Wish more doctors talked like this.",
    name: "James T., 38",
    detail: "Quarterly plan · California",
  },
];

function TestimonialCard({ t }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
      <div className="mb-4 flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mb-6 flex-1 font-title text-lg leading-relaxed text-gray-900">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 border-t border-gray-50 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6D6FFC] text-sm font-semibold text-white">
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-400">{t.detail}</p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-[#6D6FFC]">
          <Check className="h-3 w-3" /> Verified
        </span>
      </div>
    </div>
  );
}

function TestimonialsCarousel() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const w = card ? card.offsetWidth + 20 : 300;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };
  return (
    <>
      {/* Mobile: horizontal scroll */}
      <div className="relative md:hidden">
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} data-card className="min-w-[80vw] snap-center">
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <button onClick={() => scroll(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button onClick={() => scroll(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden gap-5 md:grid md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <FadeIn key={t.name}><TestimonialCard t={t} /></FadeIn>
        ))}
      </div>
    </>
  );
}

function EncoTestimonialsSection() {
  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-14 text-center">
          <h2 className="mb-3 font-title text-4xl font-medium text-gray-900 md:text-5xl">
            &ldquo;I got my edge back without losing{" "}
            <span className="font-playfair italic text-[#6D6FFC]">anything else.</span>&rdquo;
          </h2>
          <p className="text-base text-gray-600">Verified reviews from HealSend enclomiphene patients.</p>
        </div>
        <TestimonialsCarousel />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. Process steps                                                  */
/* ------------------------------------------------------------------ */

const PROCESS_STEPS = [
  { num: "STEP 1", title: "Complete your assessment", desc: "Answer a quick health questionnaire and upload recent labs or order an at-home blood draw. A clinician reviews your case within 48 hours." },
  { num: "STEP 2", title: "Get your prescription delivered", desc: "If approved, your enclomiphene capsules ship free from a licensed U.S. pharmacy — discreet packaging, 2-day delivery." },
  { num: "STEP 3", title: "Ongoing care & optimization", desc: "Follow-up labs at week 6, clinician dose adjustments, and unlimited messaging to keep your protocol dialed in." },
];

function EncoProcessSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mx-auto mb-4 max-w-[800px] text-center font-title text-4xl font-medium text-gray-900 md:text-5xl">
          Get started in{" "}
          <span className="font-playfair italic text-[#6D6FFC]">3 simple steps</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[600px] text-center text-base text-gray-600">
          No clinic visits. No waiting rooms. Everything happens online.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {PROCESS_STEPS.map((s, i) => (
            <FadeIn key={s.num}>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative flex h-44 items-center justify-center bg-[#f9f9f9]">
                  <span className="font-title text-7xl text-[#6D6FFC]/20">{i + 1}</span>
                  <span className="absolute left-4 top-4 rounded-full bg-[#101726] px-3 py-1 text-[10px] font-semibold tracking-widest text-white">
                    {s.num}
                  </span>
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
/*  12. What's included                                                */
/* ------------------------------------------------------------------ */

const INCLUDED_ITEMS = [
  {
    icon: "/images/Enclomiphene-20260506T071530Z-3-001/Enclomiphene/Product icons/68d6978435f95fbbdc1797bb_doctor-optimized (1).png",
    title: "Board-Certified Clinicians",
    bullets: ["See a licensed clinician same-day", "Unlimited visits, all online"],
  },
  {
    icon: "/images/Enclomiphene-20260506T071530Z-3-001/Enclomiphene/Product icons/68d697847ba4a0041e418f22_Icon-optimized (1).png",
    title: "At-Home Lab Work",
    bullets: ["Phlebotomist visits your house", "Full hormone panel — no clinic needed"],
  },
  {
    icon: "/images/Enclomiphene-20260506T071530Z-3-001/Enclomiphene/Product icons/68d69784136da5a12ee40221_shipping-optimized (1).png",
    title: "Free 2-Day Shipping",
    bullets: ["Discreet packaging, every refill", "Refills arrive before you run out"],
  },
  {
    icon: "/images/Enclomiphene-20260506T071530Z-3-001/Enclomiphene/Product icons/68d6978475a915f65539d15e_tag-optimized (1).png",
    title: "Transparent Pricing",
    bullets: ["No hidden fees or surprise charges", "HSA/FSA accepted"],
  },
];

function EncoIncludedSection() {
  return (
    <section className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mx-auto mb-3 max-w-[780px] text-center font-title text-4xl font-medium text-gray-900 md:text-5xl">
          Everything you need for{" "}
          <span className="font-playfair italic text-[#6D6FFC]">complete care.</span>
        </h2>
        <p className="mx-auto mb-14 max-w-[640px] text-center text-base text-gray-600">
          Medication is just the start. Your plan includes ongoing clinician support, lab work, and everything you need to optimize.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {INCLUDED_ITEMS.map((item) => (
            <FadeIn key={item.title}>
              <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex-1">
                  <span className="mb-2 inline-block rounded-full bg-[#F1F5F9] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
                    Included
                  </span>
                  <h3 className="mb-2 font-title text-lg font-medium text-gray-900">{item.title}</h3>
                  <ul className="space-y-1">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6D6FFC]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#F1F5F9]">
                  <Image src={item.icon} alt={item.title} fill sizes="80px" className="object-contain p-3" loading="lazy" />
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
/*  13. Trust Marquee (NEW)                                            */
/* ------------------------------------------------------------------ */

const TRUST_ITEMS = [
  "FSA & HSA eligible",
  "Personalized Rx enclomiphene",
  "No memberships or hidden fees",
  "Free & fast shipping",
  "US-only certified pharmacies",
  "Always-on clinician support",
  "1,000,000+ prescriptions written",
  "Cancel anytime",
];

function EncoTrustMarquee() {
  const loopItems = [...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS];
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-gray-200 bg-[#f9f9f9] py-5">
      <motion.div
        className="flex min-w-max gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {loopItems.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex shrink-0 items-center gap-2.5 text-sm text-gray-500">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#6D6FFC]" />
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  14. FAQ                                                            */
/* ------------------------------------------------------------------ */

const ENCLOMIPHENE_FAQ_ITEMS = [
  { question: "What is Enclomiphene?", answer: "Enclomiphene citrate is a selective estrogen receptor modulator (SERM) that stimulates your body's natural testosterone production by acting on the hypothalamus and pituitary gland. It increases LH and FSH, which signal the testes to produce more testosterone." },
  { question: "How is it different from TRT?", answer: "Unlike testosterone injections which shut down your body's own production and can impair fertility, enclomiphene works WITH your body. It preserves natural hormone signaling, maintains sperm production, and doesn't cause testicular atrophy." },
  { question: "How quickly does it work?", answer: "Most patients see testosterone levels rise within 2–4 weeks. Energy and mood improvements typically follow within the first month. Full optimization is usually achieved by 8–12 weeks with lab-confirmed levels." },
  { question: "Will it affect my fertility?", answer: "No — that's one of its key advantages. Enclomiphene actually supports fertility by maintaining LH and FSH production, which are essential for sperm production. It's the preferred option for men planning to have children." },
  { question: "What's included in my plan?", answer: "Online clinician consultation, enclomiphene prescription, free shipping, regular lab work to track testosterone, LH, FSH, and estradiol levels, unlimited clinician messaging, and ongoing dose optimization." },
  { question: "Are there side effects?", answer: "Side effects are generally mild and may include headaches, nausea, or mood changes. Your clinician monitors your labs regularly and adjusts dosing to minimize any issues." },
  { question: "Can I stop taking it anytime?", answer: "Yes. Unlike TRT, enclomiphene is fully reversible. If you stop, your testosterone levels return to your natural baseline without a withdrawal protocol. There's no dependency." },
  { question: "Is enclomiphene right for me?", answer: "Enclomiphene is best for men 25-55 with low T symptoms who want to preserve fertility, avoid injections, or try a reversible option before considering TRT. Your clinician will confirm if it's the right fit based on your labs." },
  { question: "Do you accept insurance or HSA/FSA?", answer: "HealSend is cash-pay, but all plans are HSA/FSA eligible. We provide itemized receipts for any reimbursement. No surprise fees — your price is locked in." },
];

function EnclomipheneFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:!pb-10 md:!pt-20 md:mt-0 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-4xl font-medium text-slate-900 md:text-5xl text-balance font-title">
          Your questions.{" "}
          <span className="italic font-playfair text-[#6d6ffc]">Honest answers.</span>
        </h2>
        <p className="mb-16 text-start text-sm text-gray-600 max-w-lg">
          Everything you want to know about enclomiphene therapy before getting started.
        </p>

        <div className="flex flex-col gap-4">
          {ENCLOMIPHENE_FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="overflow-hidden rounded-[1.25rem] bg-[#FFFFFF] shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-7 py-7 gap-6 text-left md:px-10 md:py-9"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-lg font-bold text-gray-900 md:text-xl">{item.question}</span>
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-[#333333] p-1.5 md:p-2">
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
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
          <Link href={CTA_HREF} className="hs-solid-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto">
            Get started
          </Link>
          <Link href={CTA_HREF} className="hs-outline-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto">
            See if you&apos;re eligible
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Clinical Research                                                  */
/* ------------------------------------------------------------------ */

const ENCLO_STUDIES = [
  {
    authors: "Wiehle et al. (2014):",
    finding:
      "Enclomiphene normalized testosterone in 84% of hypogonadal men while maintaining sperm counts.",
  },
  {
    authors: "Kaminetsky et al. (2013):",
    finding:
      "Significant T increase from baseline, with no decline in semen parameters over 6 months.",
  },
  {
    authors: "Kim et al. (2016):",
    finding:
      "Enclomiphene preserved both spermatogenesis and FSH/LH responsiveness — unlike TRT.",
  },
  {
    authors: "Earl & Kim (2019):",
    finding:
      "Comparable efficacy to topical T for symptom relief, with better fertility outcomes.",
  },
];

const FEATURED_STUDY_STATS = [
  { value: "+438", unit: "ng/dL avg", label: "T increase" },
  { value: "84%", unit: "", label: "reached eugonadal range" },
  { value: "100%", unit: "", label: "maintained sperm counts" },
];

function EncoClinicalResearchSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div>
            <h2 className="mb-5 font-title text-4xl font-medium text-[#101726] md:text-5xl">
              Backed by published{" "}
              <span className="font-playfair italic text-[#6D6FFC]">
                clinical research.
              </span>
            </h2>
            <p className="mb-10 max-w-[520px] text-base leading-relaxed text-gray-600">
              Enclomiphene isn&apos;t a fad. It&apos;s been studied for over 15
              years in peer-reviewed journals — and the data on testosterone
              restoration with fertility preservation is unambiguous.
            </p>

            <div className="mb-10 divide-y divide-gray-200">
              {ENCLO_STUDIES.map((s) => (
                <div key={s.authors} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="w-[130px] shrink-0 text-sm font-bold text-[#101726] md:w-[160px]">
                    {s.authors}
                  </span>
                  <span className="text-sm leading-relaxed text-gray-600">
                    {s.finding}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={CTA_HREF}
              className="hs-outline-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              Read the HealSend whitepaper <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Clinical reviewer strip */}
            <div className="mt-8 rounded-2xl bg-white p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Reviewed by HealSend Clinical Team
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    "/images/4_Home_Doctors_Online_Consultation-Doctors_02.jpg",
                    "/images/4_Home_Doctors_Online_Consultation-Doctors_04.jpg",
                    "/images/4_Home_Doctors_Online_Consultation-Avatar.jpg",
                  ].map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#101726]">
                    Dr. R. Adler &amp; team
                  </p>
                  <p className="text-xs text-gray-500">
                    Board-certified urology &amp; endocrinology
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — featured study card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#6D6FFC]">
              Featured Study
            </p>
            <h3 className="mb-5 font-title text-2xl font-medium leading-tight text-[#101726] md:text-3xl">
              &ldquo;Enclomiphene Citrate Stimulates Testosterone Production
              While Preserving Sperm Counts&rdquo;
            </h3>

            <blockquote className="mb-8 border-l-2 border-[#6D6FFC]/30 pl-4">
              <p className="text-sm italic leading-relaxed text-gray-400">
                Wiehle RD, Fontenot GK, Wike J, Hsu K, Nydell J, Lipshultz L.
                Journal of Sexual Medicine, 2014. N=124 hypogonadal men,
                16-week double-blind study.
              </p>
            </blockquote>

            <div className="mb-8 grid grid-cols-3 gap-4">
              {FEATURED_STUDY_STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-[#6D6FFC] md:text-3xl">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.unit && (
                      <>
                        {s.unit}
                        <br />
                      </>
                    )}
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={CTA_HREF}
              className="hs-solid-btn flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
            >
              View full study <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  15. Final CTA                                                      */
/* ------------------------------------------------------------------ */

function EncoFinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#101726] py-20 text-center text-white md:py-28">
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[500px] w-[500px] rounded-full bg-[#6D6FFC]/20 blur-3xl" />
      <div className="relative mx-auto max-w-[700px] px-4">
        <h2 className="mb-5 font-title text-4xl font-medium md:text-6xl">
          Your testosterone.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Your fertility.</span>{" "}
          Both.
        </h2>
        <p className="mb-8 text-lg text-white/70">
          Take the 90-second assessment. A clinician will review your case within 48 hours.
          No charge until your plan is approved.
        </p>
        <Link href={CTA_HREF} className="hs-solid-btn inline-flex items-center gap-2 rounded-full px-10 py-4 text-base font-semibold">
          Start free assessment <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-xs text-white/40">
          By starting, you agree to our terms &amp; privacy policy. Doctor-prescribed only.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page composition                                                   */
/* ------------------------------------------------------------------ */

export default function EnclomipheneLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <EncloWillpowerSection />
      <EncloProductHeroSection />
      <EncoStatBarSection />
      <FadeIn><OurTreatmentsSection cards={TREATMENT_PLAN_CARDS.filter(c => c.id !== "enclomiphene")} /></FadeIn>
      <FadeIn><EncoHowItWorksSection /></FadeIn>
      <FadeIn><EncoComparisonSection /></FadeIn>
      <FadeIn><EncoDailyProtocolSection /></FadeIn>
      <FadeIn><EncoTimelineSection /></FadeIn>
      <FadeIn><EncoWhySection /></FadeIn>
      <FadeIn><EncoClinicalResearchSection /></FadeIn>
      <FadeIn><EncoTestimonialsSection /></FadeIn>
      <FadeIn><SimpleSteps productData={productData} /></FadeIn>
      <FadeIn><EncoIncludedSection /></FadeIn>
      <FadeIn><LabTested productData={productData} /></FadeIn>
      <EncoTrustMarquee />
      <EnclomipheneFAQSection />
      <FadeIn><SupportAvailabilitySection /></FadeIn>
      <EncoFinalCTASection />
      <MarketingFooter />
    </div>
  );
}
