"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart2,
  Check,
  ChevronDown,
  ClipboardCheck,
  Dumbbell,
  FlaskConical,
  Headset,
  Laptop,
  Layers,
  Minus,
  Moon,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  Truck,
  X as XIcon,
  Zap,
} from "lucide-react";
import {
  MinimalMarketingNavbar,
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
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/gh-optimization";

const GH_TRUST_ITEMS = [
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "Clinician-Guided GH Protocols", Icon: Stethoscope },
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

function GHWillpowerSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1F5F9]">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-10 md:px-[3.25rem] md:py-14 lg:h-[calc(100dvh-80px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <div className="mt-5 max-w-[34rem]">
              <h1 className="text-balance font-title text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
                Growth hormone that{" "}
                <span className="font-playfair italic text-[#6D6FFC]">
                  works with your body.
                </span>
              </h1>
              <p className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-700 lg:text-[1.05rem]">
                A clinically guided GH optimization protocol using sermorelin
                and peptide secretagogues — designed to restore IGF-1 levels,
                build lean mass, and improve recovery from within.
              </p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              <li className="grid grid-cols-[auto_1fr] items-start gap-1 text-sm md:text-lg">
                <div className="flex items-center gap-4 text-base md:text-sm">
                  <Dumbbell className="h-6 w-6 shrink-0" strokeWidth={2} />
                  <span>Restore lean mass, strength, and recovery — at the hormonal source</span>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-start gap-1 text-sm md:text-lg">
                <div className="flex items-center gap-4 text-base md:text-sm">
                  <ShieldCheck className="h-6 w-6 shrink-0" strokeWidth={2} />
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
                  Check my eligibility
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

const GH_HERO_BENEFITS = [
  { icon: Dumbbell, text: "Subcutaneous peptide protocol · Daily 5–7 min at home, supplies included." },
  { icon: ShieldCheck, text: "Full-strength compounds from a licensed U.S. compounding pharmacy." },
  { icon: Stethoscope, text: "Board-certified clinician review + quarterly IGF-1 labs included." },
];

const GH_TIERS_PRICING = [
  { name: "Sermorelin Starter", price: 149, isFeatured: false },
  { name: "GH Optimizer", price: 249, isFeatured: true, badge: "BULLSEYE" },
  { name: "Elite Stack", price: 399, isFeatured: false },
];

const GH_HERO_FAQS = [
  {
    question: "What is growth hormone optimization?",
    answer:
      "GH optimization uses peptide secretagogues — like sermorelin and CJC-1295 — to stimulate your pituitary gland to produce more of your own growth hormone naturally. Unlike synthetic HGH, this works with your body's own feedback loop.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most members notice improved sleep quality and recovery within 3–4 weeks. Visible lean mass gains and fat reduction are typically evident by week 8–12, particularly on the GH Optimizer and Elite Stack tiers.",
  },
  {
    question: "Is this the same as synthetic HGH injections?",
    answer:
      "No. Synthetic HGH bypasses your pituitary and can suppress your own GH production. Peptide secretagogues work by stimulating your pituitary — so your body's natural regulatory feedback loop stays intact. Safer, more sustainable.",
  },
];

function GHProductHeroSection() {
  const [activeTab, setActiveTab] = useState("benefits");
  const [openFaq, setOpenFaq] = useState(null);
  const [showPriceFootnote, setShowPriceFootnote] = useState(false);

  return (
    <section className="bg-[#f9f9f9] px-4 py-16 md:px-[3.25rem] md:py-20 lg:px-[3.25rem]">
      <div className="mx-auto flex max-w-[1340px] flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6 xl:gap-8">
        {/* Left — sticky image */}
        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[55%] lg:max-w-[740px]">
          <div className="flex flex-col gap-6 sm:gap-7 md:gap-10 lg:isolate lg:sticky lg:top-24 lg:z-10">
            <div className="relative z-[1] shrink-0 bg-[#f9f9f9] pb-1">
              <h2 className="text-balance text-start text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-5xl md:leading-tight">
                GH Optimization Protocol
              </h2>
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
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
                  alt="GH Optimization Protocol — in stock"
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
          {/* Price card */}
          <div className="mb-6 overflow-hidden rounded-[1rem] border border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2 bg-[#fde073] px-5 py-3.5 text-sm font-medium text-gray-900 md:text-base">
              <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
              FSA &amp; HSA Eligible
            </div>
            <div className="px-6 py-6 md:px-7 md:py-7">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div className="min-w-0 shrink">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 md:text-4xl">$149</span>
                    <span className="text-lg font-medium text-gray-800 md:text-xl">first month</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPriceFootnote((v) => !v)}
                    aria-expanded={showPriceFootnote}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500 underline decoration-dotted underline-offset-4 hover:text-gray-700 md:text-base"
                  >
                    then from $249/mo*
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

              {showPriceFootnote && (
                <div className="mb-5 rounded-[0.75rem] bg-gray-50 p-3 text-xs leading-5 text-gray-600 md:text-sm">
                  *$149 applies to the Sermorelin Starter tier first month. GH Optimizer is $249/mo and Elite Stack is $399/mo. Final tier and pricing depends on clinician review and IGF-1 labs. Cancel anytime.
                </div>
              )}

              <div className="flex w-full flex-col items-stretch gap-3">
                <Link
                  href={CTA_HREF}
                  className="hs-solid-btn flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold shadow-[0_8px_24px_rgba(109,111,252,0.35)] transition-colors"
                >
                  See the protocols <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-1 w-full text-center text-xs text-gray-500 md:text-sm">
                  No charge until your protocol is approved
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
                  {activeTab === "benefits"
                    ? GH_HERO_BENEFITS.map((item, idx) => {
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
                        GH Optimization Protocol
                      </h3>
                      <div className="rounded-[1rem] border border-gray-200">
                        {GH_TIERS_PRICING.map((tier, index) => (
                          <div
                            key={tier.name}
                            className={`relative flex items-center justify-between p-4 ${
                              index !== GH_TIERS_PRICING.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            } ${tier.isFeatured ? "bg-gray-50/50" : ""}`}
                          >
                            {tier.isFeatured && (
                              <span className="absolute right-4 top-0 z-10 flex h-[1.4rem] -translate-y-1/2 items-center rounded-full bg-[#FF6B35] px-3 text-[11px] font-semibold leading-none text-white">
                                Most Popular
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-medium md:text-base ${
                                  tier.isFeatured ? "text-[#6D6FFC]" : "text-gray-700"
                                }`}
                              >
                                {tier.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-xl font-bold leading-none ${
                                  tier.isFeatured ? "text-[#6D6FFC]" : "text-gray-900"
                                }`}
                              >
                                ${tier.price}{" "}
                                <span className="text-sm font-semibold">/mo</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "description" ? (
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      The GH Optimization Protocol uses clinically-studied peptide secretagogues
                      to work at the hormonal level — stimulating your pituitary to restore
                      growth hormone production naturally. Three tiers let you calibrate your
                      approach based on your IGF-1 baseline and performance goals.
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

          {/* FAQs */}
          <div className="mb-6 space-y-3">
            {GH_HERO_FAQS.map((faq, idx) => (
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
            The statements on this page have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure or prevent any disease.
          </div>
          <div className="mt-3 text-[11px] leading-relaxed text-gray-600">
            <p>
              *Pricing shown applies to the Sermorelin Starter tier. Final treatment fit and
              pricing depend on clinician review and IGF-1 lab results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Savings Calculator                                              */
/* ------------------------------------------------------------------ */

function GHSavingsCalculatorSection() {
  const STICKER_PRICE = 299;
  const [federalBracket, setFederalBracket] = useState(24);
  const [stateSavings, setStateSavings] = useState(10);

  const totalTaxRate = (federalBracket + stateSavings) / 100;
  const preTaxSavings = Math.round(STICKER_PRICE * totalTaxRate);
  const realCost = STICKER_PRICE - preTaxSavings;
  const annualSavings = preTaxSavings * 12;

  return (
    <section
      className="py-16 md:py-24"
      style={{ background: "linear-gradient(135deg, #4c3fd4 0%, #6b5ce7 50%, #7c6ef0 100%)" }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div>
            <h2 className="mb-5 font-title text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Your real cost,
              <br />
              <span className="font-playfair italic text-[#FF6B35]">
                after HSA &amp; FSA savings.
              </span>
            </h2>
            <p className="mb-5 text-base leading-relaxed text-white/80 md:text-lg">
              Most members pay with pre-tax dollars through their HSA or FSA —
              which means the real cost is{" "}
              <strong className="text-white">significantly lower</strong> than the
              sticker price. Drag the slider to see your specific savings.
            </p>
            <p className="text-sm leading-relaxed text-white/60">
              No premium telehealth program is FSA-eligible by accident. We built
              HealSend to qualify so you keep more of your money.
            </p>
          </div>

          {/* Right — white card */}
          <div className="rounded-3xl bg-white p-8 shadow-xl md:p-10">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              HSA / FSA SAVINGS CALCULATOR
            </p>
            <h3 className="mb-7 text-lg font-bold text-gray-900 md:text-xl">
              What does GH optimization actually cost you?
            </h3>

            <div className="mb-6 space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Your federal tax bracket
                  </span>
                  <span className="rounded-full bg-[#6D6FFC]/15 px-3 py-0.5 text-sm font-bold text-[#6D6FFC]">
                    {federalBracket}%
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={35}
                  step={1}
                  value={federalBracket}
                  onChange={(e) => setFederalBracket(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#6D6FFC]"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>12%</span>
                  <span>22%</span>
                  <span>24%</span>
                  <span>32%</span>
                  <span>35%</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    State + payroll savings
                  </span>
                  <span className="rounded-full bg-[#6D6FFC]/15 px-3 py-0.5 text-sm font-bold text-[#6D6FFC]">
                    {stateSavings}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={stateSavings}
                  onChange={(e) => setStateSavings(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#6D6FFC]"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>0%</span>
                  <span>6%</span>
                  <span>12%</span>
                </div>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="rounded-2xl bg-[#F7F8FA] p-5 text-sm">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Sticker price (quarterly plan)</span>
                <span>${STICKER_PRICE}/mo</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 py-2 text-gray-600">
                <span>
                  Pre-tax savings ({federalBracket + stateSavings}%)
                </span>
                <span>−${preTaxSavings}/mo</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 py-2.5 font-bold text-gray-900">
                <span>Real cost to you</span>
                <span>${realCost}/mo</span>
              </div>
              <div className="mt-2 flex justify-between rounded-xl bg-emerald-50 px-3 py-3 font-semibold text-emerald-700">
                <span>You save</span>
                <span>${annualSavings.toLocaleString()}/year</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. GH Decline Stats                                               */
/* ------------------------------------------------------------------ */

const DECLINE_STATS = [
  { value: 14, prefix: "~", suffix: "%", label: "decline in GH per decade after age 30" },
  { value: 50, prefix: "", suffix: "%", label: "drop in nightly GH pulse output by age 50" },
  { value: 2, prefix: "", suffix: "×", label: "slower recovery from training in your 40s vs 20s" },
  { value: 35, prefix: "", suffix: "%", label: "less deep sleep on average over 40" },
];


function CountUpStat({ value, prefix = "", suffix = "", label, duration = 1000 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (frame >= totalFrames) {
        setCount(value);
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <p className="font-title text-6xl font-bold text-white md:text-7xl lg:text-8xl">
        {prefix}{count}{suffix}
      </p>
      <p className="mt-4 max-w-[180px] text-sm leading-relaxed text-white/55 md:text-base">
        {label}
      </p>
    </div>
  );
}

function GHDeclineStatsSection() {
  return (
    <section className="bg-[#0d0d18] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-[640px] text-center md:mb-20">
          <h2 className="mb-3 font-title text-4xl font-bold text-white md:text-5xl">
            Your GH levels peaked at 20.
          </h2>
          <p className="font-playfair text-3xl italic text-[#FF6B35] md:text-4xl">
            Then started falling.
          </p>
          <p className="mt-5 text-base text-white/60">
            Most men don&apos;t realize how much it&apos;s dropped — until they feel it.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
          {DECLINE_STATS.map((stat) => (
            <CountUpStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. How It Works                                                   */
/* ------------------------------------------------------------------ */

const GH_HOW_STEPS = [
  {
    icon: Zap,
    title: "Peptide signals your pituitary",
    desc: "Sermorelin and CJC-1295 bind to GHRH receptors on your pituitary gland — triggering a natural pulse of growth hormone. No bypassing your body's own system.",
  },
  {
    icon: Activity,
    title: "GH pulse stimulates the liver",
    desc: "The natural GH pulse travels to your liver and stimulates IGF-1 (Insulin-like Growth Factor 1) production — the downstream hormone responsible for most of GH's anabolic effects.",
  },
  {
    icon: RefreshCw,
    title: "IGF-1 activates muscle & fat metabolism",
    desc: "IGF-1 signals muscle cells to grow and repair, and signals fat cells to release stored energy. The combined effect: more lean mass, less fat, faster recovery.",
  },
  {
    icon: Sparkles,
    title: "Sleep, skin, and cognition improve",
    desc: "GH is secreted primarily during deep sleep. As your pulse amplitude restores, sleep architecture improves — and with it, mental clarity, skin quality, and systemic recovery.",
  },
];

function GHDiagram() {
  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <svg viewBox="0 0 260 260" className="w-full max-w-[280px]" aria-hidden="true">
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L0,8 L8,4 Z" fill="#6D6FFC" />
          </marker>
        </defs>
        {/* Center: Pituitary */}
        <circle cx="130" cy="130" r="36" fill="#6D6FFC" />
        <text x="130" y="125" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">PITUITARY</text>
        <text x="130" y="138" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">GLAND</text>
        {/* Top: Peptide Signal */}
        <line x1="130" y1="60" x2="130" y2="91" stroke="#6D6FFC" strokeWidth="2" markerEnd="url(#arr)" />
        <circle cx="130" cy="42" r="20" fill="#6D6FFC" />
        <text x="130" y="38" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">PEPTIDE</text>
        <text x="130" y="49" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">SIGNAL</text>
        {/* Right: GH Pulse */}
        <line x1="201" y1="130" x2="170" y2="130" stroke="#6D6FFC" strokeWidth="2" markerEnd="url(#arr)" />
        <circle cx="218" cy="130" r="20" fill="#FF6B35" />
        <text x="218" y="126" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">GH</text>
        <text x="218" y="137" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">PULSE</text>
        {/* Bottom: IGF-1 */}
        <line x1="130" y1="200" x2="130" y2="169" stroke="#6D6FFC" strokeWidth="2" markerEnd="url(#arr)" />
        <circle cx="130" cy="218" r="20" fill="#FF6B35" />
        <text x="130" y="214" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">IGF-1</text>
        <text x="130" y="225" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">LIVER</text>
        {/* Left: Results */}
        <line x1="59" y1="130" x2="90" y2="130" stroke="#6D6FFC" strokeWidth="2" markerEnd="url(#arr)" />
        <circle cx="42" cy="130" r="20" fill="#6D6FFC" />
        <text x="42" y="126" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">LEAN</text>
        <text x="42" y="137" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">MASS</text>
      </svg>
    </div>
  );
}

function GHHowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-10 text-center md:mb-12">
          <span className="mb-4 inline-block rounded-full bg-[#F1F5F9] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            The Science
          </span>
          <h2 className="mb-2 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Peptides that work with
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            your own pituitary.
          </p>
          <p className="mx-auto mt-5 max-w-[580px] text-base text-gray-600">
            Synthetic HGH shuts down your body&apos;s own production. Peptide secretagogues stimulate
            it — keeping the natural feedback loop intact.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-[#F1F5F9] p-6 shadow-sm md:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <FadeIn>
              <GHDiagram />
            </FadeIn>
            <div className="space-y-6">
              {GH_HOW_STEPS.map((step, idx) => (
                <FadeIn key={idx}>
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC] text-white">
                      <step.icon className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="mb-1 font-title text-lg font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Comparison: Peptides vs. Synthetic HGH                        */
/* ------------------------------------------------------------------ */

const COMPARISON_ROWS = [
  { label: "Preserves natural GH axis", peptide: true, synthetic: false },
  { label: "FDA-regulated pathway", peptide: true, synthetic: false },
  { label: "Clinician-prescribed", peptide: true, synthetic: true },
  { label: "At-home self-administration", peptide: true, synthetic: true },
  { label: "Monthly cost under $400", peptide: true, synthetic: false },
  { label: "IGF-1 monitoring included", peptide: true, synthetic: true },
  { label: "Pulsatile — mimics natural rhythm", peptide: true, synthetic: false },
  { label: "Long-term suppression risk", peptide: false, synthetic: true },
];

function GHComparisonSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center md:mb-16">
          <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Peptide secretagogues vs.
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            synthetic HGH.
          </p>
          <p className="mt-5 text-base text-gray-600">
            The protocol uses GHRH peptides, not synthetic HGH. Here&apos;s why that distinction matters.
          </p>
        </div>

        <FadeIn>
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50 px-5 py-4 md:px-8">
              <p className="text-sm font-semibold text-gray-600">Feature</p>
              <p className="text-center text-sm font-bold text-[#6D6FFC]">HealSend Peptides</p>
              <p className="text-center text-sm font-semibold text-gray-500">Synthetic HGH</p>
            </div>
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 items-center px-5 py-4 md:px-8 ${
                  idx !== COMPARISON_ROWS.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <p className="text-sm text-gray-700">{row.label}</p>
                <div className="flex justify-center">
                  {row.peptide ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6D6FFC]">
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50">
                      <XIcon className="h-3.5 w-3.5 text-red-400" strokeWidth={2.5} />
                    </span>
                  )}
                </div>
                <div className="flex justify-center">
                  {row.synthetic ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                      <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50">
                      <XIcon className="h-3.5 w-3.5 text-red-400" strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Two Protocol Options                                           */
/* ------------------------------------------------------------------ */

const GH_OPTIONS = [
  {
    tag: "OPTION A",
    title: "Sermorelin Monotherapy",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    descriptionBullets: [
      "Single-peptide GHRH analog — the gold standard starter",
      "Short half-life mimics the body's natural pulsatile rhythm",
      "Daily subcutaneous injection before bed",
      "Clinician access + quarterly IGF-1 monitoring",
    ],
    price: 149,
    originalPrice: 199,
    featured: false,
    checks: [
      "Sermorelin 200–500mcg nightly",
      "Quarterly IGF-1 blood panel",
      "Clinician access included",
      "Supplies & injection kit included",
    ],
    crosses: ["No GHRP co-agonist synergy", "No ipamorelin blending"],
    orangePlus: [],
    cta: "Start Sermorelin",
    footnote: "Cancel anytime · No surprise renewals",
    ctaClass: "border border-[#6D6FFC] text-[#6D6FFC] hover:bg-[#6D6FFC] hover:text-white",
  },
  {
    tag: "OPTION B",
    title: "CJC-1295 + Ipamorelin Combo",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80",
    descriptionBullets: [
      "Dual-peptide stack: GHRH + GHRP for amplified GH pulse",
      "CJC-1295 extends half-life for sustained GH elevation",
      "Ipamorelin adds selective GH release without cortisol spike",
      "Most effective for body recomp and sleep quality",
    ],
    price: 249,
    originalPrice: 349,
    featured: true,
    checks: [
      "CJC-1295 without DAC + Ipamorelin blend",
      "2x daily or nightly dosing — clinician-set",
      "Amplified GH pulse amplitude vs. sermorelin alone",
      "Designed for faster IGF-1 response",
      "Quarterly labs + bi-monthly clinician check-ins",
    ],
    crosses: [],
    orangePlus: [
      "+ GH pulse synergy via GHRH + GHRP dual-pathway",
      "+ Better body recomposition results per published data",
    ],
    cta: "Start CJC + Ipamorelin",
    footnote: "Most popular combo · Cancel anytime",
    ctaClass: "bg-[#1a1a2e] text-white hover:bg-[#2d2d4e]",
  },
];

function GHOptionCard({ option }) {
  const [expanded, setExpanded] = useState(false);
  const hasFeatures = option.checks.length + option.orangePlus.length + option.crosses.length > 0;

  return (
    <div className="relative flex flex-col">
      {option.featured && (
        <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
          <span className="inline-block rounded-full bg-[#FF6B35] px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
            Most Members Choose This
          </span>
        </div>
      )}
      <div
        className={`flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm ${
          option.featured
            ? "border-2 border-[#6D6FFC] ring-4 ring-[#6D6FFC]/10"
            : "border-gray-200"
        } ${option.featured ? "pt-4" : ""}`}
      >
        <div className="flex flex-col p-6 md:p-7">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#6D6FFC]">
            {option.tag}
          </p>
          <h3 className="mb-3 min-h-[4rem] font-title text-2xl font-bold text-gray-900">
            {option.title}
          </h3>

          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
            <Image
              src={option.image}
              alt={option.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
          </div>

          <ul className="mb-5 space-y-2">
            {option.descriptionBullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6D6FFC]" />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="mb-5 flex items-baseline gap-2">
            <span className="font-title text-4xl font-bold text-gray-900">${option.price}</span>
            <span className="text-sm text-gray-500">/mo</span>
            <span className="text-sm text-gray-400 line-through">${option.originalPrice}</span>
          </div>

          <Link
            href={CTA_HREF}
            className={`flex items-center justify-center rounded-full py-3.5 text-sm font-semibold transition ${option.ctaClass}`}
          >
            {option.cta}
          </Link>
          <p className="mt-2 text-center text-xs text-gray-400">{option.footnote}</p>

          {hasFeatures && (
            <>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm text-[#6D6FFC] transition hover:opacity-70"
              >
                <span>{expanded ? "Hide details" : "See what's included"}</span>
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2.5 pt-4">
                      {option.checks.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC]">
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                          </span>
                          {f}
                        </li>
                      ))}
                      {option.orangePlus.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm font-medium text-[#FF6B35]">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]">
                            <span className="text-[8px] font-bold text-white">+</span>
                          </span>
                          {f}
                        </li>
                      ))}
                      {option.crosses.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                          <XIcon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GHTwoOptionsSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[#F1F5F9] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            Choose Your Protocol
          </span>
          <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Two clinically-guided
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            GH protocols.
          </p>
          <p className="mx-auto mt-5 max-w-[640px] text-base text-gray-600">
            Your clinician will help you choose based on your IGF-1 baseline, goals, and health history.
            Most members who want faster results choose the CJC + Ipamorelin combo.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2 lg:max-w-[860px] lg:mx-auto">
          {GH_OPTIONS.map((option) => (
            <FadeIn key={option.tag}>
              <GHOptionCard option={option} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Track Your IGF-1 Levels                                        */
/* ------------------------------------------------------------------ */

const TRACK_FEATURES = [
  {
    icon: FlaskConical,
    title: "Baseline IGF-1 lab panel",
    desc: "We order your labs before the protocol starts. Your clinician prescribes based on your actual numbers — not a generic dose.",
  },
  {
    icon: BarChart2,
    title: "Quarterly IGF-1 monitoring",
    desc: "Every 90 days, we recheck your IGF-1 and GH markers. Your dose is adjusted to keep you in the optimal range — not just above baseline.",
  },
  {
    icon: ClipboardCheck,
    title: "Clinician-reviewed progress",
    desc: "A board-certified clinician reviews your results and schedules a follow-up. You're never just managing a protocol alone.",
  },
];

function GHTrackLevelsSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
          <FadeIn>
            <div>
              <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
                Lab-Driven Protocol
              </span>
              <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
                We track your
              </h2>
              <p className="mb-5 font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
                IGF-1 every quarter.
              </p>
              <p className="mb-8 max-w-[480px] text-base leading-relaxed text-gray-600">
                GH optimization without labs is guesswork. Every HealSend GH protocol includes
                baseline and quarterly IGF-1 monitoring so your dose is always calibrated to
                your biology — not a number on a box.
              </p>

              <div className="space-y-6">
                {TRACK_FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC]/10">
                        <Icon className="h-5 w-5 text-[#6D6FFC]" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="mb-1 font-title text-base font-bold text-gray-900">
                          {f.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="relative h-[420px] overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80"
                alt="Lab IGF-1 tracking"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-2xl bg-white/95 p-4 backdrop-blur-sm">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#6D6FFC]">
                    Sample IGF-1 Progress
                  </p>
                  <div className="flex items-end gap-3">
                    <div className="text-center">
                      <p className="font-title text-2xl font-bold text-gray-400">142</p>
                      <p className="text-[11px] text-gray-400">Baseline</p>
                    </div>
                    <ArrowRight className="mb-3 h-4 w-4 text-[#6D6FFC]" />
                    <div className="text-center">
                      <p className="font-title text-2xl font-bold text-emerald-600">218</p>
                      <p className="text-[11px] text-gray-500">Week 12</p>
                    </div>
                    <ArrowRight className="mb-3 h-4 w-4 text-[#6D6FFC]" />
                    <div className="text-center">
                      <p className="font-title text-2xl font-bold text-[#6D6FFC]">274</p>
                      <p className="text-[11px] text-gray-500">Week 24</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. IGF-1 Chart Visualization                                      */
/* ------------------------------------------------------------------ */

function GHIGFChartSection() {
  const months = [0, 1, 2, 3, 4, 5, 6];
  const values = [140, 158, 178, 204, 224, 252, 274];
  const maxVal = 300;
  const width = 320;
  const height = 160;
  const padL = 36;
  const padB = 24;
  const padR = 16;
  const padT = 12;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const pts = months.map((m, i) => {
    const x = padL + (m / 6) * chartW;
    const y = padT + chartH - (values[i] / maxVal) * chartH;
    return `${x},${y}`;
  });

  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M ${pts[0]} L ${pts.join(" L ")} L ${padL + chartW},${padT + chartH} L ${padL},${padT + chartH} Z`;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16 lg:items-center">
          <FadeIn>
            <div>
              <span className="mb-4 inline-block rounded-full bg-[#F1F5F9] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
                Real Member Data
              </span>
              <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
                What IGF-1 looks like
              </h2>
              <p className="mb-6 font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
                on protocol.
              </p>
              <p className="mb-8 max-w-[480px] text-base leading-relaxed text-gray-600">
                Average IGF-1 trajectory for HealSend GH Optimizer members over 6 months.
                Individual results depend on baseline, compliance, and tier.
              </p>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: "+95", label: "avg IGF-1 gain (ng/mL)", color: "text-[#6D6FFC]" },
                  { val: "68%", label: "report better sleep quality", color: "text-emerald-600" },
                  { val: "82%", label: "notice lean mass improvement", color: "text-[#FF6B35]" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-[#F1F5F9] p-4 text-center">
                    <p className={`font-title text-2xl font-bold ${s.color}`}>{s.val}</p>
                    <p className="mt-1 text-[11px] leading-tight text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="rounded-3xl border border-gray-100 bg-[#F1F5F9] p-6 shadow-sm md:p-8">
              <p className="mb-1 text-sm font-bold text-gray-900">IGF-1 Level (ng/mL)</p>
              <p className="mb-4 text-xs text-gray-500">Average trajectory — GH Optimizer tier</p>
              <div className="overflow-hidden rounded-2xl bg-white p-4">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
                  {/* Grid lines */}
                  {[100, 150, 200, 250, 300].map((v) => {
                    const y = padT + chartH - (v / maxVal) * chartH;
                    return (
                      <g key={v}>
                        <line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                        <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="8" fill="#9ca3af">{v}</text>
                      </g>
                    );
                  })}
                  {/* X axis labels */}
                  {months.map((m, i) => (
                    <text key={m} x={padL + (m / 6) * chartW} y={height - 6} textAnchor="middle" fontSize="8" fill="#9ca3af">
                      mo{m}
                    </text>
                  ))}
                  {/* Area fill */}
                  <path d={areaD} fill="#6D6FFC" opacity="0.1" />
                  {/* Line */}
                  <path d={pathD} fill="none" stroke="#6D6FFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Dots */}
                  {months.map((m, i) => {
                    const x = padL + (m / 6) * chartW;
                    const y = padT + chartH - (values[i] / maxVal) * chartH;
                    return (
                      <g key={m}>
                        <circle cx={x} cy={y} r="4" fill="white" stroke="#6D6FFC" strokeWidth="2" />
                        <text x={x} y={y - 8} textAnchor="middle" fontSize="8" fill="#6D6FFC" fontWeight="700">{values[i]}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3">
                <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-xs font-medium text-emerald-700">
                  Average +95 ng/mL IGF-1 increase over 6 months
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Pain Points                                                   */
/* ------------------------------------------------------------------ */

const GH_PAIN_CARDS = [
  {
    title: "You train hard but recovery takes longer than it used to.",
    bullets: [
      "Soreness lasts 3 days instead of 1. You're not doing less — your GH is.",
      "Muscle gains plateau despite consistent effort.",
    ],
  },
  {
    title: "Your body composition shifted without changing habits.",
    bullets: [
      "More fat around the midsection. Less lean mass in the mirror.",
      "Diet and training are the same — but the results aren't.",
    ],
  },
  {
    title: "Sleep stopped feeling like recovery.",
    bullets: [
      "You wake up tired. Deep sleep is shorter than it used to be.",
      "GH is secreted almost entirely during deep sleep — and you're getting less of it.",
    ],
  },
  {
    title: "Energy and drive dropped quietly over the years.",
    bullets: [
      "Not burned out. Not depressed. Just operating at 70% of what you used to.",
      "This is what low-GH feels like — and most people think it's just aging.",
    ],
  },
];

function GHPainPointsSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center md:mb-16">
          <p className="mb-3 font-playfair text-lg italic text-gray-600">Sound familiar?</p>
          <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Grinding harder with{" "}
            <span className="font-playfair italic text-[#6D6FFC]">less to show.</span>
          </h2>
          <p className="text-base text-gray-600">
            Declining GH isn&apos;t a willpower problem. It&apos;s a signaling problem. And a
            signaling problem has a signaling solution.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {GH_PAIN_CARDS.map((c) => (
            <FadeIn key={c.title}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                <h3 className="mb-4 font-title text-xl font-bold text-gray-900">{c.title}</h3>
                <ul className="space-y-2">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-600 md:text-base">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B35]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={CTA_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#e55a26]"
          >
            Check my IGF-1 levels <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. Lab Results Section                                           */
/* ------------------------------------------------------------------ */

const LAB_OUTCOMES = [
  {
    marker: "IGF-1",
    unit: "ng/mL",
    before: "142",
    after: "274",
    change: "+93%",
    positive: true,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
  },
  {
    marker: "Lean Body Mass",
    unit: "lbs",
    before: "158",
    after: "167",
    change: "+5.7%",
    positive: true,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  },
  {
    marker: "Body Fat %",
    unit: "%",
    before: "22.4",
    after: "18.1",
    change: "−19%",
    positive: true,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
  },
  {
    marker: "Deep Sleep",
    unit: "hrs/night",
    before: "0.9",
    after: "1.6",
    change: "+78%",
    positive: true,
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
  },
];

function GHLabResultsSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[#F1F5F9] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            Verified Outcomes
          </span>
          <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            What the labs show
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            after 6 months.
          </p>
          <p className="mt-5 text-base text-gray-600">
            Aggregate member data from HealSend GH Optimizer protocols. Individual results vary
            and depend on baseline, tier, and compliance.
          </p>
        </div>

        {/* Mobile: horizontal scroll strip. Desktop: 4-col grid */}
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {LAB_OUTCOMES.map((item) => (
            <div
              key={item.marker}
              className="w-[72vw] shrink-0 snap-start sm:w-auto"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.marker}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#6D6FFC]">
                    {item.marker}
                  </p>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="text-center">
                      <p className="font-title text-xl font-bold text-gray-400">
                        {item.before}
                      </p>
                      <p className="text-[11px] text-gray-400">{item.unit}</p>
                      <p className="text-[10px] text-gray-400">Baseline</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#6D6FFC]" />
                    <div className="text-center">
                      <p className="font-title text-xl font-bold text-gray-900">{item.after}</p>
                      <p className="text-[11px] text-gray-500">{item.unit}</p>
                      <p className="text-[10px] text-gray-500">6 months</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-center rounded-xl bg-emerald-50 px-3 py-2">
                    <p className="text-sm font-bold text-emerald-600">{item.change}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  12. 90-Day Promise                                                */
/* ------------------------------------------------------------------ */

function GHPromiseSection() {
  return (
    <section className="bg-[#F1F5F9] pb-8 pt-0 md:pb-10">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-[#6D6FFC]/30 bg-white p-8 shadow-sm md:flex-row md:items-center md:gap-10 md:p-10">
          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-2 border-[#6D6FFC]">
            <span className="font-title text-2xl font-bold text-[#6D6FFC]">90</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#6D6FFC]">
              Day Promise
            </span>
          </div>
          <div className="flex-1">
            <h3 className="mb-2 font-title text-xl font-bold leading-snug text-gray-900 md:text-2xl">
              If your IGF-1 doesn&apos;t move in 90 days,{" "}
              <span className="font-playfair italic text-[#6D6FFC]">your first month is free.</span>
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600 md:text-base">
              We believe in this protocol. If your 90-day IGF-1 recheck shows no meaningful
              improvement from baseline, we&apos;ll refund your first month — no retention scripts,
              no fine print. Email us and it&apos;s done.
            </p>
            <Link
              href={CTA_HREF}
              className="text-sm font-semibold text-[#6D6FFC] underline underline-offset-4 hover:text-[#5b3cdd]"
            >
              Read the full guarantee →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  13. Research                                                      */
/* ------------------------------------------------------------------ */

const GH_RESEARCH_CITATIONS = [
  {
    author: "Walker et al. (2004):",
    desc: "Sermorelin significantly increased IGF-1 and lean body mass in men with age-related GH deficiency.",
  },
  {
    author: "Sigalos & Pastuszak (2018):",
    desc: "Comprehensive review of GH secretagogue safety and efficacy in adult populations.",
  },
  {
    author: "Teichman et al. (2006):",
    desc: "CJC-1295 produced sustained dose-dependent increases in GH and IGF-1 with a safety profile superior to synthetic HGH.",
  },
  {
    author: "Raun et al. (1998):",
    desc: "Ipamorelin selective GH secretagogue with no cortisol or prolactin elevation — the cleanest GHRP in the literature.",
  },
];

function GHResearchSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[55fr_45fr] lg:gap-16">
          <FadeIn>
            <div>
              <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
                Backed by published
              </h2>
              <p className="mb-5 font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
                peptide science.
              </p>
              <p className="mb-8 max-w-[480px] text-base leading-relaxed text-gray-600">
                The compounds in this protocol come from among the most studied GHRH peptides
                in the published literature — including endocrinology, sports medicine, and
                longevity research.
              </p>

              <div className="mb-8 divide-y divide-gray-100">
                {GH_RESEARCH_CITATIONS.map((c) => (
                  <div key={c.author} className="flex flex-col gap-0.5 py-4 sm:grid sm:grid-cols-[auto_1fr] sm:gap-4 sm:gap-y-0">
                    <span className="text-sm font-bold text-gray-900 sm:whitespace-nowrap">
                      {c.author}
                    </span>
                    <span className="text-sm leading-relaxed text-gray-600">{c.desc}</span>
                  </div>
                ))}
              </div>

              <Link
                href={CTA_HREF}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#6D6FFC] px-6 py-2.5 text-sm font-semibold text-[#6D6FFC] transition hover:bg-[#6D6FFC] hover:text-white"
              >
                Read the HealSend whitepaper →
              </Link>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Reviewed by HealSend Clinical Team
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
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
                    <p className="text-sm font-bold text-gray-900">Dr. M. Chen &amp; team</p>
                    <p className="text-xs text-gray-500">
                      Board-certified endocrinology &amp; regenerative medicine
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#6D6FFC]">
                Featured Study
              </p>
              <h3 className="mb-4 font-title text-xl font-bold leading-snug text-gray-900">
                &ldquo;CJC-1295 Produces Sustained, Dose-Dependent Increases in GH and IGF-1&rdquo;
              </h3>
              <blockquote className="mb-6 border-l-2 border-[#6D6FFC] pl-4 text-sm italic leading-relaxed text-gray-500">
                Teichman SL et al. Journal of Clinical Endocrinology & Metabolism. Demonstrated
                sustained GH elevation with a superior safety profile vs. synthetic HGH.
              </blockquote>

              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  { val: "+93%", label: "avg IGF-1 increase" },
                  { val: "+9 lbs", label: "avg lean mass gain" },
                  { val: "−4.3%", label: "avg body fat reduction" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-[#6D6FFC]/5 p-3 text-center">
                    <p className="text-xl font-bold text-[#6D6FFC]">{s.val}</p>
                    <p className="text-[11px] text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href={CTA_HREF}
                className="flex w-full items-center justify-center rounded-full bg-[#3d35b5] py-4 text-sm font-semibold text-white transition hover:bg-[#2d2880]"
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
/*  14. Steps                                                         */
/* ------------------------------------------------------------------ */

const GH_STEPS = [
  {
    step: "STEP 1",
    title: "Online intake + labs",
    desc: "90-second assessment focused on your GH/IGF-1 history, goals, and health baseline. Baseline blood panel ordered — IGF-1, GH markers, and metabolic panel.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    step: "STEP 2",
    title: "Clinician prescribes protocol",
    desc: "A board-certified clinician reviews your labs and health history, prescribes your peptide protocol, and sets your starting dose based on your actual IGF-1 baseline.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
  },
  {
    step: "STEP 3",
    title: "Medication & kit delivered",
    desc: "Your protocol ships in discreet packaging with all supplies, a video walkthrough for your first dose, and a 90-day follow-up lab already scheduled.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
  },
];

function GHStepsSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[580px] text-center md:mb-16">
          <h2 className="mb-2 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            From baseline labs to
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            protocol in one week.
          </p>
          <p className="mt-5 text-base text-gray-600">
            Every step is guided by a clinician. No guesswork on dose, timing, or protocol selection.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {GH_STEPS.map((s) => (
            <FadeIn key={s.step}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative h-44 bg-[#e8e8f0]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className="absolute left-4 top-4 inline-block rounded-full bg-[#1a1a2e] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {s.step}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 font-title text-xl font-bold text-gray-900">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{s.desc}</p>
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
/*  15. Care Program                                                  */
/* ------------------------------------------------------------------ */

const CARE_FEATURES = [
  {
    icon: Stethoscope,
    title: "Board-certified clinician",
    desc: "Every GH protocol is reviewed and prescribed by a U.S. board-certified physician with endocrinology or men's/women's health experience.",
  },
  {
    icon: FlaskConical,
    title: "Quarterly IGF-1 labs",
    desc: "Labs are included in your protocol — not an add-on. Quarterly IGF-1 rechecks keep your dose calibrated throughout your program.",
  },
  {
    icon: Headset,
    title: "Always-on messaging",
    desc: "Message your care team anytime through the HealSend portal. Questions about your dose, side effects, or results get a response within 24 hours.",
  },
  {
    icon: RefreshCw,
    title: "Auto-refill, zero friction",
    desc: "Your medication ships automatically each month. No refill requests, no clinic visits, no interruption to your protocol.",
  },
];

function GHCareProgramSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-[#F1F5F9] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            Full-Spectrum Care
          </span>
          <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Not a kit. A
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            complete care program.
          </p>
          <p className="mt-5 text-base text-gray-600">
            Every GH Optimization plan includes clinician oversight, lab monitoring, and ongoing
            support — at a price that actually makes sense.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARE_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title}>
                <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#6D6FFC]/10">
                    <Icon className="h-5 w-5 text-[#6D6FFC]" strokeWidth={2} />
                  </div>
                  <h3 className="mb-2 font-title text-lg font-bold text-gray-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{f.desc}</p>
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
/*  16. Upgrade Banner                                                */
/* ------------------------------------------------------------------ */

function GHUpgradeBanner() {
  return (
    <section className="bg-[#5b3cdd] py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-[560px]">
            <h2 className="mb-3 font-title text-2xl font-bold text-white md:text-3xl">
              Already on Sermorelin?
            </h2>
            <p className="mb-1 font-playfair text-2xl italic text-[#FF6B35] md:text-3xl">
              Most members upgrade to CJC + Ipamorelin by month 3.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              Members who start on Sermorelin typically move to the CJC-1295 + Ipamorelin combo
              once they feel the protocol working. The dual-peptide stack unlocks synergistic GH
              pulse amplitude — and the IGF-1 numbers show it.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href={CTA_HREF}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#e55a26]"
            >
              Compare protocols →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  17. FAQ                                                           */
/* ------------------------------------------------------------------ */

const GH_FAQS = [
  {
    question: "What's the difference between sermorelin and CJC-1295?",
    answer:
      "Sermorelin is a shorter-chain GHRH analog with a very short half-life — it mimics the natural pulsatile pattern closely. CJC-1295 has a longer half-life, sustaining GH elevation for hours. The CJC + Ipamorelin combo combines a GHRH analog with a GHRP for synergistic pulse amplitude.",
  },
  {
    question: "Do I need blood tests before starting?",
    answer:
      "Yes. We order a baseline IGF-1 panel before your first dose — it's included in your protocol cost. Your clinician uses your actual numbers to set starting dose. Quarterly rechecks are also included.",
  },
  {
    question: "Is this the same as taking synthetic HGH?",
    answer:
      "No. Synthetic HGH bypasses your pituitary and introduces exogenous growth hormone. Peptide secretagogues stimulate your pituitary to produce its own GH — keeping the natural feedback loop intact and significantly reducing the suppression risk associated with synthetic HGH.",
  },
  {
    question: "How quickly will I notice results?",
    answer:
      "Most members notice improved sleep quality within 2–3 weeks. Recovery improvements and early body composition changes are typically noticed by week 6–8. IGF-1 lab changes are usually measurable at the 90-day recheck.",
  },
  {
    question: "What time of day should I inject?",
    answer:
      "GH is secreted primarily during deep sleep. Most clinicians recommend injecting 30–60 minutes before bed on an empty stomach to align the peptide signal with your natural sleep-phase GH pulse.",
  },
  {
    question: "Are there side effects?",
    answer:
      "The most commonly reported effects are mild injection-site redness and, in some cases, transient water retention in the first 2–4 weeks as GH levels adjust. Ipamorelin is specifically selected for its lack of cortisol or prolactin elevation — the cleanest GHRP available.",
  },
  {
    question: "Can women use this protocol?",
    answer:
      "Yes. GH optimization is clinically studied in both men and women. Dosing is adjusted based on your IGF-1 baseline and goals. Your clinician will calibrate your protocol accordingly.",
  },
  {
    question: "How do I inject?",
    answer:
      "Subcutaneous injection into the abdomen or thigh — the same as insulin or semaglutide. Your kit includes everything, and a video walkthrough covers your first dose step by step.",
  },
  {
    question: "Can I combine this with TRT or other HealSend protocols?",
    answer:
      "In many cases, yes — GH optimization and TRT are complementary. Your clinician will review your current protocols during intake and advise on any interactions or dosing adjustments.",
  },
];

function GHFAQSection() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:mt-0 md:py-20 md:!pt-20 md:!pb-10">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-balance font-title text-4xl font-medium text-slate-900 md:text-5xl">
          GH questions.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Honest answers.</span>
        </h2>
        <p className="mb-16 max-w-lg text-start text-sm text-gray-600">
          Everything we get asked about growth hormone optimization. Want a real answer? Message a
          HealSend clinician for free before you commit.
        </p>

        <div className="flex flex-col gap-4">
          {GH_FAQS.map((faq, idx) => (
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
                <div className="flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 p-1.5">
                  {openFaq === idx ? (
                    <Minus className="h-3.5 w-3.5 text-gray-600" strokeWidth={2.5} />
                  ) : (
                    <Plus className="h-3.5 w-3.5 text-gray-600" strokeWidth={2.5} />
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
            Check my eligibility
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
/*  18. Closing CTA                                                   */
/* ------------------------------------------------------------------ */

function GHClosingCTA() {
  return (
    <section className="bg-[#1e1854] py-20 text-center text-white md:py-32">
      <div className="mx-auto max-w-[640px] px-4">
        <h2 className="mb-5 font-title text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          Recover faster. Sleep deeper.
          <br />
          <span className="font-playfair italic text-[#FF6B35]">Feel like yourself again.</span>
        </h2>
        <p className="mb-10 text-base leading-relaxed text-white/75 md:text-lg">
          A clinician reviews your IGF-1 labs and builds a protocol around your actual numbers.
          No guesswork. No generic doses. Just results.
        </p>
        <Link
          href={CTA_HREF}
          className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#e55a26]"
        >
          Start consultation →
        </Link>
        <p className="mt-6 text-xs text-white/40">
          By starting, you agree to our terms &amp; privacy policy. Provider-prescribed when
          appropriate. 90-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export                                                     */
/* ------------------------------------------------------------------ */

export default function GHOptimizationLandingPage({ product }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <GHWillpowerSection />
      <GHProductHeroSection />
      <GHSavingsCalculatorSection />
      <GHDeclineStatsSection />
      <GHHowItWorksSection />
      <GHComparisonSection />
      <GHTwoOptionsSection />
      <GHTrackLevelsSection />
      <GHIGFChartSection />
      <GHPainPointsSection />
      <GHLabResultsSection />
      <GHPromiseSection />
      <GHResearchSection />
      <GHStepsSection />
      <GHCareProgramSection />
      <MarketingTrustMarquee items={GH_TRUST_ITEMS} edgeToEdge={false} />
      <GHUpgradeBanner />
      <LabTested productData={null} />
      <GHFAQSection />
      <SupportAvailabilitySection />
      <GHClosingCTA />
      <MarketingFooter />
    </div>
  );
}
