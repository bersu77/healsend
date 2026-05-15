"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  Headset,
  Laptop,
  Minus,
  PillBottle,
  Plus,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import {
  MinimalMarketingNavbar,
  ActiveMembersBanner,
  MarketingFooter,
  TrustBadgesRow,
} from "@/components/marketing/shared";
import {
  WillpowerVerticalColumn,
  WillpowerHorizontalRow,
  WILLPOWER_LEFT_MARQUEE_ITEMS,
  WILLPOWER_RIGHT_MARQUEE_ITEMS,
  MarketingTrustMarquee,
  LabTested,
  SupportAvailabilitySection,
  SimpleSteps,
  CleanSimpleEffective,
  SameMedicationSection,
  RelatedProductsSection,
  FDADisclaimerSection,
  MedicalPlanCard,
  MediaLogosBanner,
  RestoredTirzepatideBenefitsCarouselSection,
  BMICalculatorPreviewSection,
  TestimonialsSection,
  MemberResultsStatsSection,
  ComprehensiveCare,
  mergeProductContent,
  PricingPlansTable,
  MobileStickyCta,
  BeforeAfterSliderSection,
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/oral-glp-1";

const ORAL_GLP1_TRUST_ITEMS = [
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "Two Oral Protocol Options", Icon: Stethoscope },
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
/*  1. Willpower / Hero                                                */
/* ------------------------------------------------------------------ */

function OralGLP1WillpowerSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1F0FF]">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-6 md:px-[3.25rem] md:py-10 lg:min-h-[calc(100dvh-60px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:py-12">
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <div className="max-w-[34rem]">
              <ActiveMembersBanner />
              <h1 className="text-balance font-title text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
                The first oral GLP-1 that{" "}
                <span className="font-playfair italic text-[#6D6FFC]">
                  actually works.
                </span>
              </h1>
              <p className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-700 lg:text-[1.05rem]">
                A new generation of oral GLP-1 therapy designed to deliver
                injectable-tier weight loss — without the needle, without the
                freezer, without the food restrictions.
              </p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              <li className="flex items-start gap-3 text-sm md:text-base">
                <PillBottle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
                <span>
                  <strong className="text-gray-900">Two oral GLP-1 options</strong>{" "}
                  — Orforglipron + B6 (newest, highest patient-reported efficacy) and Semaglutide RDT
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
                <span>
                  <strong className="text-gray-900">BMI 25+ qualifies you</strong>{" "}
                  — broader access than federal GLP-1 guidelines
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base">
                <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
                <span>
                  <strong className="text-gray-900">B6 added to reduce nausea</strong>{" "}
                  — designed to help GI tolerability so you can stay on the medication
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

        <div className="flex flex-col gap-3 overflow-hidden lg:hidden">
          <WillpowerHorizontalRow items={WILLPOWER_LEFT_MARQUEE_ITEMS} />
          <WillpowerHorizontalRow items={WILLPOWER_RIGHT_MARQUEE_ITEMS} reverse />
        </div>

        <div className="relative hidden min-h-0 w-full shrink-0 overflow-hidden lg:block lg:max-h-[600px] lg:min-h-[480px] lg:w-[45%] lg:self-center xl:w-[450px]">
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

const ORAL_HERO_BENEFITS = [
  { icon: Check, text: "Two oral GLP-1 options — Orforglipron + B6 (newest) and Semaglutide RDT." },
  { icon: ShieldCheck, text: "BMI 25+ qualifies — broader access than standard GLP-1 guidelines." },
  { icon: Sparkles, text: "B6 added to Orforglipron to reduce nausea and improve tolerability." },
];

const ORAL_HERO_PRICING = [
  { name: "Orforglipron + B6", price: 349, isNew: true },
  { name: "Semaglutide RDT", price: 249, isNew: false },
];

const ORAL_HERO_DESCRIPTION =
  "Oral GLP-1 therapy delivers GLP-1 agonist weight-loss results without injections. Orforglipron (newest) achieved 12.4% weight loss in phase 3 ATTAIN-1 trials — comparable to injectable semaglutide. Semaglutide RDT is a rapidly-dissolving semaglutide tablet for those who prefer a proven mechanism at a lower cost.";

const ORAL_HERO_FAQS = [
  {
    question: "What's the difference between Orforglipron + B6 and Semaglutide RDT?",
    answer:
      "Orforglipron is a newer small-molecule GLP-1 agonist that showed up to 12.4% weight loss in phase 3 trials with no food restrictions. Semaglutide RDT is a rapidly-dissolving semaglutide tablet — same proven mechanism as Ozempic, now oral. Your clinician will help you choose based on your profile and goals.",
  },
  {
    question: "Do I have to follow food restrictions?",
    answer:
      "With Orforglipron + B6: no fasting or timing restrictions — take it anytime. With Semaglutide RDT: minimal restrictions compared to older oral semaglutide (Rybelsus). Your clinician will provide specific guidance based on your protocol.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most members notice reduced appetite by week 3–4. Clinically measurable weight loss (≥5%) typically appears by week 8. Our 60-day guarantee is based on measurable weight loss at that mark.",
  },
];

function OralGLP1ProductHeroSection() {
  const [selectedProtocol, setSelectedProtocol] = useState("orforglipron");
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
                Oral GLP-1 Therapy
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Two oral options · Daily protocol · No injections
              </p>
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
                  <img
                    src="/images/marketing/instock.jpeg"
                    alt="Oral GLP-1 Therapy — in stock"
                    className="h-full w-full rounded-2xl object-cover object-bottom object-right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[45%] xl:w-[450px]">
          {/* Price card */}
          <div className="mb-6 overflow-hidden rounded-[1rem] border border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2 bg-[#fde073] px-5 py-3.5 text-sm font-medium text-gray-900 md:text-base">
              <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
              FSA &amp; HSA Eligible
            </div>
            <div className="px-6 py-6 md:px-7 md:py-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="min-w-0 shrink">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 md:text-4xl">$0</span>
                    <span className="text-lg font-medium text-gray-800 md:text-xl">first month</span>
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
                    <img src="/images/marketing/logos/klarna.png" alt="Klarna" className="h-3 w-auto" />
                  </span>
                  <span className="flex items-center rounded-[0.6rem] bg-[#B2FCE4] px-3 py-1.5">
                    <img src="/images/marketing/logos/afterpay.png" alt="Afterpay" className="h-3 w-auto" />
                  </span>
                </div>
              </div>

              {showPriceFootnote ? (
                <div className="mb-5 rounded-[0.75rem] bg-gray-50 p-3 text-xs leading-5 text-gray-600 md:text-sm">
                  *$0 first month on annual plan. Regular price is $299/mo. Includes medication, clinician follow-up, and shipping. Cancel anytime.
                </div>
              ) : null}

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
                    ? ORAL_HERO_BENEFITS.map((item, idx) => {
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
                    <div className="space-y-8">
                      <PricingPlansTable productName="Orforglipron + B6" />
                      <PricingPlansTable productName="Semaglutide Tablets" footnote="Includes clinician review, labs, and supplies. Cancel anytime." />
                    </div>
                  ) : null}

                  {activeTab === "description" ? (
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      {ORAL_HERO_DESCRIPTION}
                    </p>
                  ) : null}
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

          {/* FAQ accordion */}
          <div className="mb-6 space-y-3">
            {ORAL_HERO_FAQS.map((faq, idx) => (
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
              The statements on this page have not been evaluated by the Food and Drug Administration.
              This product is not intended to diagnose, treat, cure or prevent any disease.
            </div>
            <div className="space-y-2.5 text-[11px] leading-relaxed text-gray-600">
              <p>
                *Discounted first month applies to quarterly plan. Actual price depends on plan prescribed.
                Final treatment fit depends on clinician review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Why Oral · Why Now                                             */
/* ------------------------------------------------------------------ */

function OralGLP1WhyNowSection() {
  return (
    <section className="bg-[#0d0d1a] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn className="text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/70">
            Why Oral · Why Now
          </span>
          <h2 className="mb-4 font-title text-3xl font-bold leading-tight text-white md:text-5xl">
            For years, oral GLP-1s were a downgrade.
            <br />
            <span className="font-playfair italic text-[#FF6B35]">Not anymore.</span>
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-base text-white/55 md:text-lg">
            A new class of oral GLP-1 just hit injectable-tier efficacy in phase 3 trials — and the
            FDA review is underway.{" "}
            <strong className="text-white/80">
              HealSend offers a compounded version available now.
            </strong>
          </p>
        </FadeIn>

        <div className="relative grid gap-6 md:grid-cols-2 md:items-stretch">
          {/* Old card */}
          <FadeIn>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative h-40">
                <Image
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
                  alt="Old oral GLP-1"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d1a]/90" />
                <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Old Oral GLP-1s (Rybelsus, 2019–2024)
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7 md:p-8">
                <h3 className="mb-3 text-xl font-bold text-white md:text-2xl">
                  Underpowered, finicky, fasted-stomach.
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-white/50 md:text-base">
                  Required taking on empty stomach, 30-minute food wait, only ~5–7% average weight
                  loss. Most patients never came close to injectable-tier results.
                </p>
                <div className="flex items-center gap-8 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-2xl font-bold text-white/60">~6%</p>
                    <p className="text-xs text-white/30">avg weight loss</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white/60">Strict</p>
                    <p className="text-xs text-white/30">fasting + timing rules</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Arrow */}
          <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B35] shadow-lg">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* New card */}
          <FadeIn>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#FF6B35] bg-white/5">
              <div className="relative h-40">
                <Image
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
                  alt="New oral GLP-1 breakthrough"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d1a]/90" />
                <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-widest text-[#FF6B35]">
                  New Oral GLP-1s (2025+)
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7 md:p-8">
                <h3 className="mb-3 text-xl font-bold text-white md:text-2xl">
                  Orforglipron just hit injectable-tier results.
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-white/65 md:text-base">
                  Phase 3 ATTAIN-1 (NEJM, 2025) showed up to 12.4% weight loss at 72 weeks. No food
                  restrictions, no timing rules. The first oral GLP-1 to seriously compete with
                  Wegovy and Zepbound.
                </p>
                <div className="flex items-center gap-8 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-2xl font-bold text-[#FF6B35]">12.4%</p>
                    <p className="text-xs text-white/30">avg weight loss at high dose</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#FF6B35]">Zero</p>
                    <p className="text-xs text-white/30">food restrictions</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { pct: "59.6%", desc: "of participants lost ≥10% of body weight", src: "ATTAIN-1, NEJM 2025" },
            { pct: "39.6%", desc: "of participants lost ≥15% of body weight", src: "ATTAIN-1, NEJM 2025" },
            { pct: "91%", desc: "of prediabetic participants reached near-normal blood sugar", src: "ATTAIN-1, NEJM 2025" },
          ].map((s) => (
            <FadeIn key={s.pct}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="mb-1 font-title text-4xl font-bold text-[#6D6FFC]">{s.pct}</p>
                <p className="mb-2 text-sm text-white/60">{s.desc}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/25">{s.src}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Two Options                                                     */
/* ------------------------------------------------------------------ */

const ORAL_GLP1_PLAN_CARDS = [
  {
    id: "oral-orforglipron",
    headerClass: "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["2025 · Newest", "Highest Efficacy"],
    title: "Orforglipron\n+ B6",
    subtitle: "Once-daily oral · No food restrictions",
    image: "/images/marketing/bundle/tirzepatide-injections-product.png",
    bulletsHeading: "MEMBER RESULTS",
    bullets: [
      { icon: TrendingUp, text: "Up to 12.4% weight loss at 72 weeks (ATTAIN-1 trial)" },
      { icon: Zap, text: "B6 added to reduce nausea — designed for GI tolerability" },
      { icon: PillBottle, text: "Daily oral pill · zero needles · zero cold-chain" },
    ],
    primaryCta: "Start Orforglipron + B6",
    secondaryCta: "Why Orforglipron?",
    href: CTA_HREF,
    description: "Newest small-molecule oral GLP-1, phase 3 published in NEJM (2025). No fasting, no timing rules — take any time, with or without food.",
    whyItWorks: [
      "Highest patient-reported efficacy in our member data",
      "No fasting or timing rules — take any time",
      "Quarterly progress check-ins included",
    ],
    bestFor: [
      "Members who want the newest, most effective oral option",
      "Anyone who wants zero needles with maximum results",
    ],
  },
  {
    id: "oral-semaglutide",
    headerClass: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["Established", "Best First Step"],
    title: "Semaglutide\nRDT",
    subtitle: "Once-daily rapid-dissolve tablet · Compounded",
    image: "/images/marketing/bundle/tirzepatide-injections-product.png",
    bulletsHeading: "MEMBER RESULTS",
    bullets: [
      { icon: ShieldCheck, text: "Same active compound as Wegovy / Ozempic — oral form" },
      { icon: Target, text: "Established efficacy & safety across millions of users" },
      { icon: Sparkles, text: "Most accessible price point for oral GLP-1" },
    ],
    primaryCta: "Start Semaglutide RDT",
    secondaryCta: "Why Sema?",
    href: CTA_HREF,
    description: "Same active compound as Wegovy/Ozempic in oral rapid-dissolve form. Designed for sublingual absorption — fast-acting, predictable.",
    whyItWorks: [
      "Established efficacy & safety profile",
      "Designed for sublingual absorption",
      "Quarterly progress check-ins included",
    ],
    bestFor: [
      "Cost-conscious members who want proven results",
      "Anyone new to GLP-1 therapy",
    ],
  },
];

function OralGLP1TwoOptionsSection() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section className="bg-[#f9f9f9] py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-10 grid grid-cols-1 gap-8 md:mb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-x-8 xl:gap-x-12">
          <div className="min-w-0">
            <h2 className="font-title text-3xl font-bold leading-[1.05] tracking-tight text-gray-950 sm:text-4xl lg:text-[2.625rem]">
              Newest tech.
            </h2>
            <p className="mt-2 font-playfair text-2xl italic leading-tight text-[#5d62f3] sm:text-3xl">
              Or proven classic.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#474257] md:text-lg">
              Both are once-daily oral protocols. Both are clinically guided and provider-prescribed when appropriate.
            </p>
          </div>
          <div className="hidden w-full lg:block lg:w-auto lg:shrink-0 lg:pt-1">
            <TrustBadgesRow />
          </div>
        </div>

        <div className="mx-auto grid max-w-[1200px] items-start gap-7 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          {ORAL_GLP1_PLAN_CARDS.map((plan) => (
            <MedicalPlanCard
              key={plan.id}
              plan={plan}
              ctaHref={plan.href}
              expanded={expandedId === plan.id}
              onToggleExpand={() => setExpandedId(expandedId === plan.id ? null : plan.id)}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#474257]">
          Not sure which one fits?{" "}
          <Link href="#quiz" className="font-semibold text-[#5d62f3] underline decoration-dotted underline-offset-4">
            Take our 30-second match quiz →
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Bar Chart — Oral vs Injectable                                 */
/* ------------------------------------------------------------------ */

const BAR_DATA = [
  { label: "Rybelsus", sublabel: "Old oral semaglutide", value: 6.0, color: "#d1d5db", highlight: false },
  { label: "Sema RDT", sublabel: "HealSend compounded", value: 9.0, color: "#6D6FFC", highlight: false },
  { label: "Orforglipron", sublabel: "ATTAIN-1, NEJM 2025", value: 12.4, color: "#6D6FFC", highlight: true },
  { label: "Oral Sema 25mg", sublabel: "OASIS-4 (high-dose)", value: 13.6, color: "#6D6FFC", highlight: false },
  { label: "Wegovy", sublabel: "Injectable semaglutide", value: 15.0, color: "#374151", highlight: false },
  { label: "Zepbound", sublabel: "Injectable tirzepatide", value: 20.9, color: "#111827", highlight: false },
];

function OralGLP1BarChartSection() {
  const maxVal = 25;
  const chartH = 220;
  const padT = 30;
  const padB = 60;
  const padL = 48;
  const padR = 16;
  const svgW = 600;
  const svgH = chartH + padT + padB;
  const barW = (svgW - padL - padR) / BAR_DATA.length - 8;

  const yScale = (v) => padT + (chartH - (v / maxVal) * chartH);
  const xPos = (i) => padL + i * ((svgW - padL - padR) / BAR_DATA.length) + 4;

  return (
    <section className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            How oral compares to{" "}
            <span className="font-playfair italic text-[#6D6FFC]">injectable.</span>
          </h2>
          <p className="mb-10 max-w-2xl text-base text-gray-600 md:text-lg">
            Average weight loss at 72 weeks across the major published trials. Compounded oral
            GLP-1s deliver clinically meaningful results — closer to injectable-tier than ever
            before.
          </p>
        </FadeIn>

        <FadeIn>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-4 text-xs text-gray-400">Weight loss at 72 weeks (%)</div>
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="w-full min-w-[500px]"
              preserveAspectRatio="xMidYMid meet"
            >
              {[5, 10, 15, 20, 25].map((v) => (
                <g key={v}>
                  <line
                    x1={padL}
                    y1={yScale(v)}
                    x2={svgW - padR}
                    y2={yScale(v)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                  <text x={padL - 4} y={yScale(v) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                    -{v}%
                  </text>
                </g>
              ))}

              {BAR_DATA.map((bar, i) => {
                const x = xPos(i);
                const barH = (bar.value / maxVal) * chartH;
                const y = padT + chartH - barH;
                return (
                  <g key={bar.label}>
                    {bar.highlight && (
                      <rect
                        x={x - 3}
                        y={y - 3}
                        width={barW + 6}
                        height={barH + 3}
                        rx="6"
                        fill="none"
                        stroke="#FF6B35"
                        strokeWidth="2"
                      />
                    )}
                    <rect x={x} y={y} width={barW} height={barH} rx="4" fill={bar.color} />
                    <text
                      x={x + barW / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight={bar.highlight ? "700" : "600"}
                      fill={bar.highlight ? "#FF6B35" : bar.color === "#d1d5db" ? "#9ca3af" : bar.color}
                    >
                      -{bar.value}%
                    </text>
                    <text
                      x={x + barW / 2}
                      y={padT + chartH + 16}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill={bar.color === "#6D6FFC" ? "#6D6FFC" : "#374151"}
                    >
                      {bar.label}
                    </text>
                    <text
                      x={x + barW / 2}
                      y={padT + chartH + 30}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#9ca3af"
                    >
                      {bar.sublabel}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-gray-300" />
                Old-generation oral
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-[#6D6FFC]" />
                HealSend &amp; new-generation oral
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-gray-800" />
                Injectable GLP-1s
              </span>
            </div>
            <p className="mt-3 text-[11px] italic text-gray-400">
              Sources: ATTAIN-1 (NEJM, 2025); OASIS-4 (2025); SURMOUNT-5 (2024); STEP trials.
              *HealSend Sema RDT efficacy estimated based on member-reported outcomes; individual
              results vary.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Eligibility Check                                              */
/* ------------------------------------------------------------------ */

function OralGLP1EligibilitySection() {
  const [ft, setFt] = useState("5");
  const [inches, setInches] = useState("10");
  const [weight, setWeight] = useState("180");

  return (
    <section id="eligibility" className="bg-[#F1F0FF] py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn className="text-center">
          <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Check if you qualify in{" "}
            <span className="font-playfair italic text-[#6D6FFC]">20 seconds.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-base text-gray-600">
            HealSend prescribes oral GLP-1 therapy at{" "}
            <strong className="text-gray-900">BMI 25 and above</strong> — a broader threshold than
            the federal Wegovy/Zepbound criteria. Enter your height and weight to see if this fits.
          </p>
        </FadeIn>

        <FadeIn>
          <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Height
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={ft}
                    onChange={(e) => setFt(e.target.value)}
                    min={4}
                    max={7}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-900 focus:border-[#6D6FFC] focus:outline-none focus:ring-2 focus:ring-[#6D6FFC]/20"
                  />
                  <span className="text-sm text-gray-400">ft</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  &nbsp;
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    min={0}
                    max={11}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-900 focus:border-[#6D6FFC] focus:outline-none focus:ring-2 focus:ring-[#6D6FFC]/20"
                  />
                  <span className="text-sm text-gray-400">in</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Weight
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min={80}
                    max={500}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-900 focus:border-[#6D6FFC] focus:outline-none focus:ring-2 focus:ring-[#6D6FFC]/20"
                  />
                  <span className="text-sm text-gray-400">lbs</span>
                </div>
              </div>
            </div>
            <Link
              href={CTA_HREF}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#6D6FFC] py-3.5 text-base font-semibold text-white shadow-[0_8px_24px_rgba(109,111,252,0.3)] transition hover:bg-[#5a5ce8]"
            >
              Check eligibility →
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Match Quiz                                                     */
/* ------------------------------------------------------------------ */

const QUIZ_QUESTIONS = [
  {
    question: "Have you taken a GLP-1 medication before?",
    options: ["No, this would be my first", "Yes — and the nausea was rough", "Yes, tolerated it fine"],
  },
  {
    question: "What matters most to you?",
    options: ["Maximum weight loss (cost is secondary)", "Most affordable option", "Easiest daily routine"],
  },
  {
    question: "Where does budget fit?",
    options: ["$349/mo fits — I want the best", "$249/mo is my limit"],
  },
];

function OralGLP1QuizSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const recommend = () => {
    const hadNausea = answers[0] === "Yes — and the nausea was rough";
    const wantsMax = answers[1] === "Maximum weight loss (cost is secondary)";
    return hadNausea || wantsMax ? "orforglipron" : "semaglutide";
  };

  const handleSelect = (opt) => setSelected(opt);

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => { setCurrentQ(0); setAnswers([]); setSelected(null); setShowResult(false); };

  const isOrf = recommend() === "orforglipron";

  return (
    <section id="quiz" className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <FadeIn>
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-gray-600">2,341+ oral GLP-1 members</span>
              </div>
              <h2 className="mb-4 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                Which one is{" "}
                <span className="font-playfair italic text-[#6D6FFC]">right for you?</span>
              </h2>
              <p className="mb-6 text-base text-gray-600 md:text-lg">
                3 quick questions to match you to either Orforglipron + B6 or Semaglutide RDT —
                based on your goals, budget, and side effect profile.
              </p>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="mb-1 text-sm font-semibold text-gray-800">Quick note:</p>
                <p className="text-sm text-gray-600">
                  Both products are valid options. Your clinician makes the final recommendation
                  based on your full health profile.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md">
              {!showResult ? (
                <>
                  <div className="px-6 pt-6">
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                      <span>Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
                    </div>
                    <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#6D6FFC] transition-all duration-300"
                        style={{ width: `${((currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                      />
                    </div>
                    <p className="mb-5 text-lg font-bold text-gray-900">
                      {QUIZ_QUESTIONS[currentQ].question}
                    </p>
                    <div className="flex flex-col gap-2">
                      {QUIZ_QUESTIONS[currentQ].options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelect(opt)}
                          className={`w-full rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-colors ${selected === opt
                              ? "border-[#6D6FFC] bg-[#6D6FFC]/5 text-[#6D6FFC]"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 px-6 py-4">
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={selected === null}
                      className={`w-full rounded-full py-3 text-sm font-semibold transition-colors ${selected !== null
                          ? "bg-[#6D6FFC] text-white hover:bg-[#5a5ce8]"
                          : "cursor-not-allowed bg-gray-100 text-gray-400"
                        }`}
                    >
                      {currentQ < QUIZ_QUESTIONS.length - 1 ? "Next →" : "See my match →"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="overflow-hidden rounded-xl">
                  <div className="relative h-44 w-full">
                    <Image
                      src={
                        isOrf
                          ? "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
                          : "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={isOrf ? "Orforglipron + B6 oral tablet" : "Semaglutide RDT oral tablet"}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
                  </div>
                  <div className="p-7">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6D6FFC]">
                      Your Match
                    </p>
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      {isOrf ? "Orforglipron + B6" : "Semaglutide RDT"}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-gray-600">
                      {isOrf
                        ? "Based on your answers, Orforglipron + B6 looks like the best fit — it offers the highest efficacy and includes B6 to help with tolerability."
                        : "Based on your answers, Semaglutide RDT looks like a strong match — proven GLP-1 results at the most accessible price point."}
                    </p>
                    <Link
                      href={CTA_HREF}
                      className="mb-3 flex w-full items-center justify-center rounded-full bg-[#6D6FFC] py-3.5 text-base font-semibold text-white transition hover:bg-[#5a5ce8]"
                    >
                      Start {isOrf ? "Orforglipron + B6" : "Semaglutide RDT"} →
                    </Link>
                    <button
                      type="button"
                      onClick={reset}
                      className="w-full text-center text-xs text-gray-400 underline underline-offset-4"
                    >
                      Retake quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. The B6 Difference                                              */
/* ------------------------------------------------------------------ */

function OralGLP1B6Section() {
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <FadeIn>
            <div>
              <div className="relative mb-8 h-56 w-full overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=900&q=80"
                  alt="B6 compound pills — nausea support"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#6D6FFC]/20" />
              </div>
              <h2 className="mb-4 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                The{" "}
                <span className="font-playfair italic text-[#6D6FFC]">B6 difference.</span>
              </h2>
              <p className="mb-6 text-base leading-relaxed text-gray-600 md:text-lg">
                Up to 50% of GLP-1 patients experience nausea — and 6–10% stop treatment because
                of it. We add Vitamin B6 (pyridoxine) directly into the Orforglipron compound for
                one specific reason: to help you stay on the medication long enough for it to work.
              </p>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 bg-[#F1F0FF] p-4 text-center">
                  <p className="text-2xl font-bold text-[#6D6FFC]">~50%</p>
                  <p className="mt-1 text-xs leading-snug text-gray-500">
                    of GLP-1 patients experience nausea on standard formulations
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#F1F0FF] p-4 text-center">
                  <p className="text-2xl font-bold text-[#6D6FFC]">6–10%</p>
                  <p className="mt-1 text-xs leading-snug text-gray-500">
                    of patients discontinue GLP-1s entirely due to GI side effects
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                B6 is a clinically-validated antiemetic with decades of safety data — the same
                compound widely used for pregnancy nausea. Our compounded formulation is designed
                to help you stay consistent.
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="rounded-2xl border border-gray-200 bg-[#F9F9FF] p-6 md:p-8">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Member-Reported Nausea (Week 1–4)
              </p>
              <div className="space-y-5">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">Standard oral GLP-1</span>
                    <span className="font-bold text-gray-600">~38%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#FF6B35]" style={{ width: "38%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">Orforglipron + B6</span>
                    <span className="font-bold text-[#6D6FFC]">~14%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#6D6FFC]" style={{ width: "14%" }} />
                  </div>
                </div>
              </div>
              <p className="mt-5 text-[11px] italic leading-relaxed text-gray-400">
                Internal HealSend member-reported survey data (n=412 across both protocols).
                Individual experience may vary; not a controlled clinical trial result.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. Mechanism — Same Pathway, Easier Delivery                     */
/* ------------------------------------------------------------------ */

const MECHANISM_STEPS = [
  {
    num: "1",
    title: "Once-daily oral dose",
    desc: "One pill or rapid-dissolve tablet, taken at the same time each day. No injections. No cold chain. No fasted-stomach rules with Orforglipron.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    bg: "#E8E3FF",
  },
  {
    num: "2",
    title: "GLP-1 receptors activate",
    desc: "The active compound binds to GLP-1 receptors throughout your body — slowing gastric emptying, reducing appetite, and improving insulin sensitivity.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80",
    bg: "#E3F0FF",
  },
  {
    num: "3",
    title: "Appetite drops, satiety lasts",
    desc: "You feel full faster and stay full longer. Food noise quiets. Cravings reduce. Caloric intake naturally drops without willpower battles.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    bg: "#E3FFE8",
  },
  {
    num: "4",
    title: "Weight loss compounds",
    desc: "Most members notice changes within 4–8 weeks, with the strongest effect by month 3–6. Trial data shows continued loss through month 18.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    bg: "#FFF3E3",
  },
];

function OralGLP1MechanismSection() {
  return (
    <section className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn className="text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6D6FFC]/20 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
            How Oral GLP-1 Works
          </span>
          <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Same hormone pathway.
            <br />
            <span className="font-playfair italic text-[#6D6FFC]">Easier delivery.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-base text-gray-600 md:text-lg">
            Both protocols activate the GLP-1 receptor — the same biology that drives weight loss
            in injectable Wegovy and Zepbound. The difference is purely how you take it.
          </p>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2">
          {MECHANISM_STEPS.map((step) => (
            <FadeIn key={step.num}>
              <div className="flex h-full flex-row overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative w-32 shrink-0 sm:w-40" style={{ backgroundColor: step.bg }}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-5">
                  <h3 className="mb-1.5 text-base font-bold text-gray-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{step.desc}</p>
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
/*  10. Real Results                                                  */
/* ------------------------------------------------------------------ */

const MEMBER_RESULTS = [
  { startWk: 0, endWk: 14, startW: 214, endW: 196, name: "Sarah K., 38", protocol: "Orforglipron + B6" },
  { startWk: 0, endWk: 18, startW: 238, endW: 214, name: "David M., 44", protocol: "Orforglipron + B6" },
  { startWk: 0, endWk: 12, startW: 186, endW: 170, name: "Lauren P., 41", protocol: "Semaglutide RDT" },
];

function OralGLP1ResultsSection() {
  return (
    <section className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn className="text-center">
          <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Real members.
            <br />
            <span className="font-playfair italic text-[#6D6FFC]">Real results.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-base text-gray-600 md:text-lg">
            HealSend members on oral GLP-1 protocols. Outcomes verified by clinician check-ins and
            member-reported progress.
          </p>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-3">
          {MEMBER_RESULTS.map((m) => (
            <FadeIn key={m.name}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Week {m.startWk}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">{m.startW}</p>
                    <p className="text-xs text-gray-400">lbs</p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Week {m.endWk}
                    </p>
                    <p className="text-3xl font-bold text-[#6D6FFC]">{m.endW}</p>
                    <p className="text-xs text-gray-400">lbs</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF0FA] text-xs font-bold text-[#6D6FFC]">
                      {m.name.split(",")[0].split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                      <div className="flex items-center gap-1 text-xs text-[#6D6FFC]">
                        <Check className="h-3 w-3" strokeWidth={3} />
                        <span>Verified · {m.protocol}</span>
                      </div>
                    </div>
                  </div>
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
/*  11. Pain Points                                                   */
/* ------------------------------------------------------------------ */

const PAIN_CARDS = [
  {
    title: "You can't get past the needle.",
    bullets: [
      { text: "You've researched GLP-1s for months but the injection is the wall.", type: "x" },
      { text: "Daily oral fits how you actually live — and works.", type: "check" },
    ],
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80",
    bg: "#F0E8FF",
  },
  {
    title: "You travel constantly.",
    bullets: [
      { text: "The cold chain, the syringes through TSA, the schedule disruption.", type: "x" },
      { text: "Oral fits in any toiletry kit, anywhere in the world.", type: "check" },
    ],
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    bg: "#E8F0FF",
  },
  {
    title: "You tried injectable GLP-1s — the nausea was too much.",
    bullets: [
      { text: "You wanted to stay on, but the GI side effects forced you off.", type: "x" },
      { text: "The B6 formulation is designed to help you stay this time.", type: "check" },
    ],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    bg: "#E8FFF0",
  },
  {
    title: "BMI 25–29.9 — locked out of Wegovy.",
    bullets: [
      { text: "Federal guidelines won't prescribe GLP-1s to you. HealSend will, when appropriate.", type: "x" },
      { text: "You don't need to be 30+ to need help.", type: "check" },
    ],
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    bg: "#FFF8E8",
  },
];

function OralGLP1PainPointsSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            Sound familiar?
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          You wanted GLP-1 — but{" "}
          <span className="font-playfair italic text-[#6D6FFC]">not the needle.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          Oral GLP-1 wasn&apos;t ready until now. If injection hesitancy, lifestyle, or storage
          was holding you back, this is the version you&apos;ve been waiting for.
        </p>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {PAIN_CARDS.map((card) => (
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
                      key={bullet.text}
                      className="flex items-start gap-2.5 text-sm leading-snug text-[#5d6169]"
                    >
                      {bullet.type === "check" ? (
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e4ffe4] text-[#38a169]">
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5.5L4.5 8L8 2" stroke="#38a169" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      ) : (
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ffe4e4] text-[#e53e3e]">
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <line x1="2" y1="2" x2="8" y2="8" stroke="#e53e3e" strokeWidth="1.8" strokeLinecap="round" />
                            <line x1="8" y1="2" x2="2" y2="8" stroke="#e53e3e" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </span>
                      )}
                      {bullet.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={CTA_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#e55a26]"
          >
            See both options →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  12. 60-Day Promise (horizontal card)                             */
/* ------------------------------------------------------------------ */

function OralGLP1PromiseSection() {
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
          If you don&apos;t see measurable weight loss by week 8,{" "}
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
/*  13. Research                                                      */
/* ------------------------------------------------------------------ */

const ATTAIN_CITATIONS = [
  { key: "ATTAIN-1 (NEJM 2025):", desc: "3,127 adults, 72 weeks. 12.4% mean weight loss at highest dose. 59.6% lost ≥10% body weight." },
  { key: "ATTAIN-2 (Lancet 2025):", desc: "1,613 adults with obesity + type 2 diabetes. Up to 9.6% weight loss with HbA1c reduction." },
  { key: "ATTAIN-MAINTAIN (2025):", desc: "Maintained weight loss after switching from injectable Wegovy or Zepbound — first oral-after-injectable trial." },
  { key: "ACHIEVE-1 (2025):", desc: "Type 2 diabetes trial — HbA1c reduced 1.3–1.6% across doses, comparable to injectables." },
];

function OralGLP1ResearchSection() {
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <FadeIn>
            <div>
              <h2 className="mb-4 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                The most{" "}
                <span className="font-playfair italic text-[#6D6FFC]">peer-reviewed</span>
                <br />
                oral GLP-1 in history.
              </h2>
              <p className="mb-8 text-base leading-relaxed text-gray-600 md:text-lg">
                Orforglipron has 4,500+ patients across global phase 3 trials and a New England
                Journal of Medicine publication. This is not a research-grade compound — it&apos;s a
                pharma-tier asset, available to you in compounded form ahead of FDA approval.
              </p>

              <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {ATTAIN_CITATIONS.map((c, i) => (
                  <div
                    key={c.key}
                    className={`flex flex-col gap-0.5 px-5 py-4 sm:grid sm:grid-cols-[auto_1fr] sm:gap-4 ${i < ATTAIN_CITATIONS.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                  >
                    <span className="text-sm font-bold text-gray-900 sm:whitespace-nowrap">{c.key}</span>
                    <span className="text-sm leading-relaxed text-gray-600">{c.desc}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-[#F9F9FF] p-5">
                <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 sm:whitespace-nowrap">
                  Reviewed by<br />HealSend Clinical Team
                </div>
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=100&q=80",
                  ].map((src, i) => (
                    <div key={i} className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
                      <Image src={src} alt="Clinician" fill className="object-cover" sizes="40px" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Dr. R. Adler &amp; team</p>
                  <p className="text-xs text-gray-500">Board-certified obesity medicine &amp; endocrinology</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="rounded-2xl border border-[#6D6FFC]/20 bg-[#6D6FFC]/5 p-7 md:p-8">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#6D6FFC]">
                Featured Study
              </p>
              <blockquote className="mb-4 border-l-4 border-[#6D6FFC] pl-4 text-lg font-bold leading-snug text-gray-900">
                &ldquo;Orforglipron in Adults with Obesity: Phase 3 ATTAIN-1 Trial&rdquo;
              </blockquote>
              <p className="mb-6 text-sm italic leading-relaxed text-gray-500">
                Aronne L, Horn DB, Wadden T, et al. New England Journal of Medicine, 2025.
                N=3,127 adults, 72-week double-blind randomized placebo-controlled trial.
              </p>
              <div className="mb-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { val: "−12.4%", sub: "avg weight loss (high dose)" },
                  { val: "59.6%", sub: "lost ≥10% body weight" },
                  { val: "39.6%", sub: "lost ≥15% body weight" },
                ].map((s) => (
                  <div key={s.val} className="rounded-xl bg-white p-3 shadow-sm">
                    <p className="text-xl font-bold text-[#6D6FFC]">{s.val}</p>
                    <p className="mt-1 text-[10px] text-gray-500">{s.sub}</p>
                  </div>
                ))}
              </div>
              <Link
                href={CTA_HREF}
                className="flex w-full items-center justify-center rounded-full bg-[#6D6FFC] py-3.5 text-sm font-semibold text-white transition hover:bg-[#5a5ce8]"
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
/*  15. Upgrade Banner — Injectable                                   */
/* ------------------------------------------------------------------ */

function OralGLP1UpgradeBanner() {
  return (
    <section className="bg-[#6D6FFC] py-10 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">
              Want maximum efficacy?
            </h3>
            <p className="mb-1 font-playfair text-xl italic text-[#FF6B35] md:text-2xl">
              Talk to us about injectable.
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
              Injectable Wegovy / Zepbound–class compounded medications still deliver the highest
              weight loss numbers (15–21%). If your goal is maximum loss and the needle isn&apos;t a
              hard no, we can help you get there too.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/weight-loss"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#e55a26]"
            >
              See injectable options →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  16. FAQ (two-column)                                              */
/* ------------------------------------------------------------------ */

const ORAL_FAQS = [
  {
    question: "Is Orforglipron the same as Lilly's drug?",
    answer: "Yes and no. Orforglipron is the same molecule developed by Eli Lilly and studied in the ATTAIN trials. HealSend offers a compounded version — the same active compound formulated by a U.S.-licensed 503B compounding pharmacy. Lilly's branded version is pending FDA approval; compounded Orforglipron is available now.",
  },
  {
    question: "Why is B6 added to the Orforglipron formulation?",
    answer: "Vitamin B6 (pyridoxine) is a clinically validated antiemetic — the same compound used in Diclegis for pregnancy-related nausea. Up to 50% of GLP-1 patients experience early nausea. Adding B6 directly to the compound is designed to reduce Week 1–4 GI symptoms and improve treatment adherence.",
  },
  {
    question: "How does oral compare to injectable in real-world weight loss?",
    answer: "The new generation of oral GLP-1s (Orforglipron, high-dose oral semaglutide) now delivers 9–13% average weight loss in trials — compared to 15–21% for injectables. The gap has closed significantly. For people who won't inject, oral now represents a clinically meaningful option rather than a compromise.",
  },
  {
    question: "How quickly will I see weight loss?",
    answer: "Most members notice reduced appetite within 1–2 weeks. Measurable weight changes are typically seen by weeks 4–6. The strongest effect period is months 3–6, with clinical trials showing continued loss through 18 months.",
  },
  {
    question: "Why does HealSend prescribe at BMI 25 when Wegovy requires BMI 27 or 30?",
    answer: "Federal FDA labeling for Wegovy/Zepbound requires BMI ≥30, or ≥27 with a weight-related comorbidity. These are labeling thresholds, not absolute medical limits. HealSend-affiliated clinicians may prescribe GLP-1 therapy at BMI 25+ when clinically appropriate — using clinical judgment, not just BMI criteria.",
  },
  {
    question: "What are the side effects?",
    answer: "The most common are GI effects: nausea, loose stools, reduced appetite, and occasional constipation — mostly in weeks 1–4 as your body adjusts. These are typically mild with dose escalation. The B6 formulation is specifically designed to reduce early nausea. Rare but serious side effects include gallstones and pancreatitis (as with all GLP-1s).",
  },
  {
    question: "What about food restrictions?",
    answer: "None with Orforglipron — it was designed to be taken with or without food, at any time. Semaglutide RDT (sublingual) works best taken sublingually and held under the tongue for 60 seconds before swallowing.",
  },
  {
    question: "Will I keep the weight off after I stop?",
    answer: "Weight regain is common after stopping GLP-1s — this is true of both oral and injectable formulations. The medical consensus is that GLP-1 therapy works best as a long-term intervention. We don't recommend stopping without a clinician-guided tapering plan.",
  },
  {
    question: "Can I switch from injectable to oral?",
    answer: "Yes. The ATTAIN-MAINTAIN trial was specifically designed to study this transition — and showed maintained weight loss when switching from Wegovy/Zepbound to oral Orforglipron. Your clinician can guide the transition.",
  },
  {
    question: "How does the 60-day money-back guarantee work?",
    answer: "If you don't see measurable weight loss by day 56 (week 8), we refund your first month in full. No retention calls, no fine print. Email support and it's processed within 3–5 business days.",
  },
  {
    question: "Do you accept insurance?",
    answer: "Compounded GLP-1s are not covered by insurance. However, they are FSA and HSA eligible — so you can use pre-tax dollars. We accept Klarna and Afterpay for flexible monthly payment.",
  },
];

function OralGLP1FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:mt-0 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-balance font-title text-4xl font-medium text-slate-900 md:text-5xl">
          Oral GLP-1 questions.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Honest answers.</span>
        </h2>
        <p className="mb-16 max-w-lg text-start text-sm text-gray-600">
          Everything we get asked about Orforglipron + B6, Semaglutide RDT, and how oral compares
          to injectable.
        </p>

        <div className="flex flex-col gap-4">
          {ORAL_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.question} className="overflow-hidden rounded-[1.25rem] bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-6 px-7 py-7 text-left md:px-10 md:py-9"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-lg font-bold text-gray-900 md:text-xl">
                    {faq.question}
                  </span>
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-[#333333] p-1.5 md:p-2">
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-white md:h-5 md:w-5" />
                    ) : (
                      <Plus className="h-4 w-4 text-white md:h-5 md:w-5" />
                    )}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
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
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={CTA_HREF}
            className="hs-solid-btn inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-center text-base font-semibold sm:w-auto"
          >
            Start consultation
          </Link>
          <Link
            href={CTA_HREF}
            className="hs-outline-btn inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-center text-base font-semibold sm:w-auto"
          >
            Talk to a clinician
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  17. Closing CTA                                                   */
/* ------------------------------------------------------------------ */

function OralGLP1ClosingCTA() {
  return (
    <section className="bg-[#3d35b5] py-20 text-center text-white md:py-32">
      <div className="mx-auto max-w-[640px] px-4">
        <h2 className="mb-5 font-title text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          The first oral GLP-1 that{" "}
          <span className="font-playfair italic text-[#FF6B35]">actually works.</span>
        </h2>
        <p className="mb-10 text-base leading-relaxed text-white/75 md:text-lg">
          Take the 90-second consultation. A clinician reviews your case within 48 hours of your
          labs. No charge until your protocol is approved.
        </p>
        <Link
          href={CTA_HREF}
          className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#e55a26]"
        >
          See the options →
        </Link>
        <p className="mt-6 text-xs text-white/40">
          By starting, you agree to our terms &amp; privacy policy. Provider-prescribed when
          appropriate.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export                                                     */
/* ------------------------------------------------------------------ */

export default function OralGLP1LandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <OralGLP1WillpowerSection />
      <OralGLP1ProductHeroSection />
      <MediaLogosBanner />
      <OralGLP1WhyNowSection />
      <OralGLP1TwoOptionsSection />
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="Oral GLP-1 Benefits" />
      <OralGLP1BarChartSection />
      <BMICalculatorPreviewSection />
      <OralGLP1B6Section />
      <OralGLP1MechanismSection />
      <TestimonialsSection />
      <MemberResultsStatsSection />
      {/* <BeforeAfterSliderSection category="weight-loss" heading="Real transformations." ctaHref={CTA_HREF} /> */}
      <OralGLP1PainPointsSection />
      <OralGLP1PromiseSection />
      <OralGLP1ResearchSection />
      <SimpleSteps productData={null} />
      <div className="bg-[#f9f9f9] pt-10 md:pt-14">
        <OralGLP1UpgradeBanner />
      </div>
      <CleanSimpleEffective productData={null} />
      <ComprehensiveCare />
      <LabTested productData={null} />
      <MarketingTrustMarquee items={ORAL_GLP1_TRUST_ITEMS} edgeToEdge={false} />
      <SameMedicationSection planLabel="Personalized, clinically-proven oral GLP-1 plans" />
      <OralGLP1FAQSection />
      <SupportAvailabilitySection />
      <OralGLP1ClosingCTA />
      <MarketingFooter />
      <MobileStickyCta ctaHref={CTA_HREF} />
    </div>
  );
}
