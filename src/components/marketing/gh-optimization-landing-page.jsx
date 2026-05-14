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
  CleanSimpleEffective,
  SameMedicationSection,
  RelatedProductsSection,
  FDADisclaimerSection,
  MedicalPlanCard,
  MediaLogosBanner,
  RestoredTirzepatideBenefitsCarouselSection,
  mergeProductContent,
  SimpleSteps,
  PricingPlansTable,
  MobileStickyCta,
  BeforeAfterSliderSection,
  DarkMemberStatsSection,
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
    <section className="relative overflow-hidden bg-[#F1F5F9] px-3 sm:px-5 md:px-6">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 py-10 md:px-[3.25rem] md:py-14 lg:h-[calc(100dvh-60px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
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
    <section className="bg-[#f9f9f9] px-4 py-6 md:px-[3.25rem] md:py-10 lg:px-[3.25rem]">
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
                    <PricingPlansTable footnote="Includes clinician review, labs, and supplies. Cancel anytime." />
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
                *Pricing shown applies to the Sermorelin Starter tier. Final treatment fit and
                pricing depend on clinician review and IGF-1 lab results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Savings Calculator                                              */
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
    <div ref={ref} className="flex w-full flex-col items-center text-center">
      <p className="whitespace-nowrap font-title text-5xl font-bold text-white md:text-6xl lg:text-7xl">
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
    <section className="bg-[#0d0d18] py-10 md:py-16">
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

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
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
    title: "Peptide signals your pituitary",
    desc: "Sermorelin and CJC-1295 bind to GHRH receptors on your pituitary gland — triggering a natural pulse of growth hormone. No bypassing your body's own system.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "GH pulse stimulates the liver",
    desc: "The natural GH pulse travels to your liver and stimulates IGF-1 (Insulin-like Growth Factor 1) production — the downstream hormone responsible for most of GH's anabolic effects.",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "IGF-1 activates muscle & fat metabolism",
    desc: "IGF-1 signals muscle cells to grow and repair, and signals fat cells to release stored energy. The combined effect: more lean mass, less fat, faster recovery.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Sleep, skin, and cognition improve",
    desc: "GH is secreted primarily during deep sleep. As your pulse amplitude restores, sleep architecture improves — and with it, mental clarity, skin quality, and systemic recovery.",
    image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&w=600&q=80",
  },
];

function GHHowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#0B1120] pt-20 pb-10 md:pt-28 md:pb-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#6D6FFC]/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-14 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            The Science
          </span>
          <h2 className="mb-2 font-title text-4xl font-bold text-white md:text-5xl">
            Peptides that work with
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            your own pituitary.
          </p>
          <p className="mx-auto mt-5 max-w-[580px] text-base text-gray-400">
            Synthetic HGH shuts down your body&apos;s own production. Peptide secretagogues stimulate
            it — keeping the natural feedback loop intact.
          </p>
        </div>

        <div ref={ref} className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting arrows between cards — desktop only */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`arrow-${i}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.2 }}
              className="pointer-events-none absolute top-[30%] z-10 hidden origin-left items-center gap-0.5 lg:flex"
              style={{ left: `${25 * (i + 1)}%`, transform: `translateX(-50%) translateY(-50%)` }}
              aria-hidden="true"
            >
              <div className="h-px w-8 bg-gradient-to-r from-[#6D6FFC]/60 to-[#6D6FFC]/20" />
              <ArrowRight className="h-3 w-3 text-[#6D6FFC]/50" />
            </motion.div>
          ))}

          {GH_HOW_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.15 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:border-[#6D6FFC]/30 hover:bg-white/[0.08]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-base font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
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
    <section className="relative overflow-hidden bg-[#0B1120] pt-10 pb-20 md:pt-14 md:pb-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] translate-x-1/4 rounded-full bg-[#6D6FFC]/8 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-[900px] px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-[640px] text-center md:mb-16">
          <h2 className="mb-3 font-title text-4xl font-bold text-white md:text-5xl">
            Peptide secretagogues vs.
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            synthetic HGH.
          </p>
          <p className="mt-5 text-base text-gray-400">
            The protocol uses GHRH peptides, not synthetic HGH. Here&apos;s why that distinction matters.
          </p>
        </div>

        <FadeIn>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-3 bg-[#6D6FFC]/10 px-5 py-4 md:px-8">
              <p className="text-sm font-semibold text-gray-400">Feature</p>
              <p className="text-center text-sm font-bold text-[#6D6FFC]">HealSend Peptides</p>
              <p className="text-center text-sm font-semibold text-gray-500">Synthetic HGH</p>
            </div>
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 items-center px-5 py-4 md:px-8 ${
                  idx % 2 === 0 ? "bg-white/[0.03]" : "bg-white/[0.06]"
                } ${idx !== COMPARISON_ROWS.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <p className="text-sm text-gray-300">{row.label}</p>
                <div className="flex justify-center">
                  {row.peptide ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6D6FFC] shadow-lg shadow-[#6D6FFC]/25">
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10">
                      <XIcon className="h-3.5 w-3.5 text-red-400" strokeWidth={2.5} />
                    </span>
                  )}
                </div>
                <div className="flex justify-center">
                  {row.synthetic ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10">
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

const GH_PLAN_CARDS = [
  {
    id: "gh-sermorelin",
    headerClass: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["Best First Step", "GH Optimization"],
    title: "Sermorelin\nMonotherapy",
    subtitle: "Single-peptide GHRH analog",
    image: "/images/marketing/bundle/sermorelin-product.png",
    bulletsHeading: "MEMBER RESULTS",
    bullets: [
      { icon: Moon, text: "Better sleep within 3–4 weeks" },
      { icon: ShieldCheck, text: "Mimics natural pulsatile GH rhythm" },
      { icon: Stethoscope, text: "Clinician + quarterly IGF-1 labs" },
    ],
    primaryCta: "Start Sermorelin",
    secondaryCta: "Why Sermorelin?",
    href: CTA_HREF,
    description: "The gold standard starter. Short half-life mimics the body's natural rhythm. Daily subcutaneous injection before bed.",
    whyItWorks: [
      "Sermorelin 200–500mcg nightly dosing",
      "Quarterly IGF-1 blood panel included",
      "Supplies & injection kit included",
    ],
    bestFor: [
      "First-time peptide users starting GH optimization",
      "Members who want a gentle, proven protocol",
    ],
  },
  {
    id: "gh-combo",
    headerClass: "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["Most Popular", "Dual-Peptide Stack"],
    title: "CJC-1295 +\nIpamorelin",
    subtitle: "GHRH + GHRP amplified GH protocol",
    image: "/images/marketing/bundle/sermorelin-product.png",
    bulletsHeading: "MEMBER RESULTS",
    bullets: [
      { icon: Dumbbell, text: "Best for body recomp and lean mass" },
      { icon: TrendingUp, text: "Amplified GH pulse — faster IGF-1" },
      { icon: FlaskConical, text: "Quarterly labs + clinician check-ins" },
    ],
    primaryCta: "Start CJC + Ipamorelin",
    secondaryCta: "Why This Combo?",
    href: CTA_HREF,
    description: "Dual-peptide stack: CJC-1295 extends half-life for sustained GH elevation while Ipamorelin adds selective GH release without cortisol spike.",
    whyItWorks: [
      "GH pulse synergy via GHRH + GHRP dual-pathway",
      "Better body recomposition results per published data",
      "Designed for faster IGF-1 response vs. sermorelin alone",
    ],
    bestFor: [
      "Members who want faster, more visible results",
      "Anyone focused on body recomp and sleep quality",
    ],
  },
  {
    id: "gh-oral",
    headerClass: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["Oral Option", "No Injections"],
    title: "MK-677\n(Ibutamoren)",
    subtitle: "Oral GH secretagogue — no needles",
    image: "/images/marketing/bundle/sermorelin-product.png",
    bulletsHeading: "MEMBER RESULTS",
    bullets: [
      { icon: Zap, text: "Daily oral dosing — no needles" },
      { icon: TrendingUp, text: "24-hour sustained GH and IGF-1" },
      { icon: Moon, text: "Sleep improvement within 1–2 weeks" },
    ],
    primaryCta: "Start MK-677",
    secondaryCta: "Why MK-677?",
    href: CTA_HREF,
    description: "An oral GH secretagogue that raises GH and IGF-1 levels without injections. Taken once daily — ideal for members who prefer a needle-free protocol.",
    whyItWorks: [
      "Oral capsule — 10–25mg daily dosing",
      "24-hour sustained GH elevation",
      "Quarterly IGF-1 blood panel included",
    ],
    bestFor: [
      "Members who prefer oral dosing over injections",
      "Anyone prioritizing convenience and compliance",
    ],
  },
];

function GHTwoOptionsSection() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section className="bg-[#f9f9f9] py-10 md:py-14">
      <div className="mx-auto max-w-[1340px] px-4 md:px-8">
        <div className="mb-10 grid grid-cols-1 gap-8 md:mb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-x-8 xl:gap-x-12">
          <div className="min-w-0">
            <h2 className="font-title text-3xl font-bold leading-[1.05] tracking-tight text-gray-950 sm:text-4xl lg:text-[2.625rem]">
              Three clinically-guided
            </h2>
            <p className="mt-2 font-playfair text-2xl italic leading-tight text-[#5d62f3] sm:text-3xl">
              GH protocols.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#474257] md:text-lg">
              Your clinician will help you choose based on your IGF-1 baseline, goals, and health history.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 lg:w-auto lg:shrink-0 lg:flex-nowrap lg:justify-end lg:pt-1">
            <div className="flex min-w-0 flex-initial items-center justify-center">
              <div className="relative flex items-center">
                <img src="/images/clean/image.png" alt="" aria-hidden="true" className="h-10 w-auto shrink-0 object-contain sm:h-12 md:h-14 lg:h-16" />
                <img src={`/images/${encodeURIComponent("google_trust_badge_white (1).svg")}`} alt="Google reviews rating" loading="lazy" className="z-10 -ml-2 -mr-1 h-auto max-h-[40px] w-[120px] object-contain mix-blend-multiply sm:-ml-3 sm:-mr-2 sm:max-h-[50px] sm:w-[140px] md:max-h-[55px] md:w-[150px] lg:-ml-4 lg:-mr-2 lg:max-h-[60px] lg:w-[160px]" />
                <img src="/images/articles/blogs/image.png" alt="" aria-hidden="true" className="h-10 w-auto shrink-0 object-contain sm:h-12 md:h-14 lg:h-16" />
              </div>
            </div>
            <div className="flex min-w-0 flex-initial items-center justify-center">
              <div className="relative flex items-center">
                <img src="/images/clean/image.png" alt="" aria-hidden="true" className="z-20 h-10 w-auto shrink-0 object-contain sm:h-12 md:h-14 lg:h-16" />
                <img src="/images/healsend-2k-members-trust.png" alt="HealSend — 2K+ members" loading="lazy" className="z-10 -mx-5 h-auto max-h-[50px] w-[150px] shrink-0 object-contain sm:-mx-6 sm:max-h-[60px] sm:w-[170px] md:-mx-7 md:max-h-[65px] md:w-[180px] lg:-mx-8 lg:max-h-[70px] lg:w-[200px]" />
                <img src="/images/articles/blogs/image.png" alt="" aria-hidden="true" className="z-20 h-10 w-auto shrink-0 object-contain sm:h-12 md:h-14 lg:h-16" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto grid items-start gap-7 sm:gap-8 lg:grid-cols-2 xl:grid-cols-3 lg:gap-6">
          {GH_PLAN_CARDS.map((plan) => (
            <MedicalPlanCard
              key={plan.id}
              plan={plan}
              ctaHref={plan.href}
              expanded={expandedId === plan.id}
              onToggleExpand={() => setExpandedId(expandedId === plan.id ? null : plan.id)}
            />
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
    <section className="bg-[#F1F5F9] py-10 md:py-14">
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
    <section className="bg-white py-10 md:py-14">
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
    image: "/images/negative-sell/negative_1.webp",
    bullets: [
      "Soreness lasts 3 days instead of 1. You're not doing less — your GH is.",
      "Muscle gains plateau despite consistent effort.",
    ],
  },
  {
    title: "Your body composition shifted without changing habits.",
    image: "/images/negative-sell/negative_2.jpeg",
    bullets: [
      "More fat around the midsection. Less lean mass in the mirror.",
      "Diet and training are the same — but the results aren't.",
    ],
  },
  {
    title: "Sleep stopped feeling like recovery.",
    image: "/images/negative-sell/negative_3.jpg",
    bullets: [
      "You wake up tired. Deep sleep is shorter than it used to be.",
      "GH is secreted almost entirely during deep sleep — and you're getting less of it.",
    ],
  },
  {
    title: "Energy and drive dropped quietly over the years.",
    image: "/images/negative-sell/negative_4.webp",
    bullets: [
      "Not burned out. Not depressed. Just operating at 70% of what you used to.",
      "This is what low-GH feels like — and most people think it's just aging.",
    ],
  },
];

function GHPainPointsSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            Sound familiar?
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          Grinding harder with{" "}
          <span className="font-playfair italic text-[#6D6FFC]">less to show.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          Declining GH isn&apos;t a willpower problem. It&apos;s a signaling problem. And a
          signaling problem has a signaling solution.
        </p>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {GH_PAIN_CARDS.map((card) => (
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
    <section className="bg-white py-10 md:py-14">
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0d0d1a] py-20 md:py-28">
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D6FFC]/10 blur-[120px]"
          animate={inView ? { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6D6FFC]/10"
          animate={inView ? { scale: [1, 1.6], opacity: [0.4, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", repeatDelay: 1 }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[800px] px-4 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, filter: "blur(16px)" }}
          animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <span className="font-title text-8xl font-black tracking-tight text-white md:text-9xl">
            90
          </span>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={inView ? { opacity: 1, letterSpacing: "0.25em" } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-1 text-sm font-semibold uppercase text-[#6D6FFC]"
          >
            Day Promise
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto my-8 origin-center"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#6D6FFC] to-transparent" />
          <div className="absolute inset-0 h-px w-24 bg-gradient-to-r from-transparent via-[#6D6FFC] to-transparent blur-sm" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 font-title text-2xl font-bold leading-snug text-white md:text-3xl"
        >
          If your IGF-1 doesn&apos;t move in 90 days,{" "}
          <span className="font-playfair italic text-[#6D6FFC]">first month free.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mb-8 text-sm text-white/40"
        >
          No fine print. No retention scripts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
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
    <section className="bg-white py-10 md:py-14">
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
    <section className="bg-[#F1F5F9] py-10 md:py-14">
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
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: FlaskConical,
    title: "Quarterly IGF-1 labs",
    desc: "Labs are included in your protocol — not an add-on. Quarterly IGF-1 rechecks keep your dose calibrated throughout your program.",
    image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Headset,
    title: "Always-on messaging",
    desc: "Message your care team anytime through the HealSend portal. Questions about your dose, side effects, or results get a response within 24 hours.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: RefreshCw,
    title: "Auto-refill, zero friction",
    desc: "Your medication ships automatically each month. No refill requests, no clinic visits, no interruption to your protocol.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
  },
];

function GHCareProgramSection() {
  return (
    <section className="bg-white py-10 md:py-14">
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
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="relative h-36">
                    <Image
                      src={f.image}
                      alt={f.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[#6D6FFC]/30" />
                    <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 font-title text-lg font-bold text-gray-900">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{f.desc}</p>
                  </div>
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
          appropriate.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export                                                     */
/* ------------------------------------------------------------------ */

export default function GHOptimizationLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <GHWillpowerSection />
      <GHProductHeroSection />
      <MediaLogosBanner />
      <GHDeclineStatsSection />
      <GHPainPointsSection />
      <GHLabResultsSection />
      <GHHowItWorksSection />
      <GHComparisonSection />
      <GHTwoOptionsSection />
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="Growth Hormone Optimization Benefits" />
      <GHTrackLevelsSection />
      <GHIGFChartSection />
      <BeforeAfterSliderSection category="fitness" heading="Real transformations." ctaHref={CTA_HREF} />
      <DarkMemberStatsSection variant="igf1" />
      <GHPromiseSection />
      <GHResearchSection />
      <SimpleSteps productData={productData} />
      <GHCareProgramSection />
      <GHUpgradeBanner />
      <CleanSimpleEffective productData={null} />
      <LabTested productData={null} />
      <MarketingTrustMarquee items={GH_TRUST_ITEMS} edgeToEdge={false} />
      <SameMedicationSection planLabel="Personalized, clinically-proven GH optimization plans" />
      <GHFAQSection />
      <SupportAvailabilitySection />
      <GHClosingCTA />
      <MarketingFooter />
      <MobileStickyCta ctaHref={CTA_HREF} />
    </div>
  );
}
