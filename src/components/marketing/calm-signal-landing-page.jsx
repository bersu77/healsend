"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Plus,
  ShieldCheck,
  Stethoscope,
  Target,
  Truck,
  X,
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
  MediaLogosBanner,
  RestoredTirzepatideBenefitsCarouselSection,
  mergeProductContent,
  SimpleSteps,
  PricingPlansTable,
  MobileStickyCta,
  MemberResultsStatsSection,
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/calm-signal";

const CALM_SIGNAL_TRUST_ITEMS = [
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "US-Licensed Clinicians", Icon: Stethoscope },
  { text: "Free & Discreet Shipping", Icon: Truck },
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

function CountUpStat({ value, prefix = "", suffix = "", label, duration = 1000, color = "text-[#6D6FFC]" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) { setCount(0); return; }
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (frame >= totalFrames) { setCount(value); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value, duration]);
  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <p className={`font-title text-5xl font-bold md:text-6xl ${color}`}>
        {prefix}{count}{suffix}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Hero                                                            */
/* ------------------------------------------------------------------ */

function CalmSignalHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1F5F9]">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-10 md:px-[3.25rem] md:py-14 lg:h-[calc(100dvh-60px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <div className="mt-5 max-w-[34rem]">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-balance font-title text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl"
              >
                It&apos;s not a personality flaw.{" "}
                <span className="font-playfair italic text-[#6D6FFC]">It&apos;s a signal.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-700 lg:text-[1.05rem]"
              >
                Anxiety is a neurochemical state — not a character defect. Clinical
                anxiety protocol that works without sedation, without dependency,
                without dulling who you are.
              </motion.p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              {[
                { icon: Stethoscope, bold: "US-licensed clinicians", rest: "— full intake reviewed before any prescription" },
                { icon: ShieldCheck, bold: "No SSRIs, no benzodiazepines", rest: "— a different neurochemical approach entirely" },
                { icon: Target, bold: "First effects in 3–7 days", rest: "— not 6–8 weeks like traditional options" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.bold}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3 text-sm md:text-base"
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                    <span>
                      <strong className="text-gray-900">{item.bold}</strong>{" "}
                      {item.rest}
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 w-full"
            >
              <div className="inline-flex w-full max-w-full flex-col items-center gap-2.5 sm:w-auto">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
                  <Link
                    href={CTA_HREF}
                    className="hs-solid-btn inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold sm:w-auto"
                  >
                    Begin protocol
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <p className="w-full text-center text-sm">
                  <span className="font-semibold text-gray-700">Takes 90 seconds</span> · <span className="text-gray-500">100% private · free</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-hidden lg:hidden">
          <WillpowerHorizontalRow items={WILLPOWER_LEFT_MARQUEE_ITEMS} />
          <WillpowerHorizontalRow items={WILLPOWER_RIGHT_MARQUEE_ITEMS} reverse />
        </div>

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

const CALM_HERO_BENEFITS = [
  {
    icon: Target,
    text: "Calm Signal nasal spray · daily protocol · first effects in 3–7 days, full benefit at 4–8 weeks.",
  },
  {
    icon: Stethoscope,
    text: "US-licensed clinician review + dose calibration included.",
  },
  {
    icon: BadgeCheck,
    text: "Month-to-month · cancel anytime · FSA & HSA accepted.",
  },
];

const CALM_HERO_FAQS = [
  {
    question: "What peptide is actually prescribed?",
    answer:
      "The Calm Signal protocol prescribes Selank, a synthetic peptide studied for anxiolytic effects without sedation or dependency. It modulates GABA, serotonin, and BDNF — supporting stress regulation, mood, and neuroplasticity without binding GABA receptors directly.",
  },
  {
    question: "How is this different from SSRIs?",
    answer:
      "SSRIs block serotonin reuptake — keeping more in the synapse. Selank works upstream, modulating neurochemical balance through different pathways. Similar clinical effect, markedly different side-effect profile. No sexual side effects, no emotional blunting, no weight changes.",
  },
  {
    question: "How quickly will I feel different?",
    answer:
      "Most members report first noticeable shift in 3–7 days. Compare: SSRIs typically require 6–8 weeks. Full benefit at 4–8 weeks of consistent use. Effect builds gradually — expect a tide, not a wave.",
  },
];

function CalmSignalProductHeroSection() {
  const [activeTab, setActiveTab] = useState("benefits");
  const [openFaq, setOpenFaq] = useState(null);
  const [showPriceFootnote, setShowPriceFootnote] = useState(false);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: false, margin: "-80px" });

  return (
    <section ref={sectionRef} className="bg-[#f9f9f9] px-4 py-6 md:px-[3.25rem] md:py-10 lg:px-[3.25rem]">
      <div className="mx-auto flex max-w-[1340px] flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6 xl:gap-8">
        {/* Left — sticky */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[55%] lg:max-w-[740px]"
        >
          <div className="flex flex-col gap-6 sm:gap-7 md:gap-10 lg:isolate lg:sticky lg:top-24 lg:z-10">
            <div className="relative z-[1] shrink-0 bg-[#f9f9f9] pb-1">
              <h2 className="text-balance text-start text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-5xl md:leading-tight">
                Calm Signal · Clinical Anxiety Protocol
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Nasal spray · Daily · Clinician-prescribed
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
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
                  alt="Calm Signal — clinical anxiety protocol in stock"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="rounded-[1rem] object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[45%] xl:w-[450px]"
        >
          {/* Promo + price card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 overflow-hidden rounded-[1rem] border border-gray-200 bg-white"
          >
            <div className="flex items-center justify-center gap-2 bg-[#fde073] px-5 py-3.5 text-sm font-medium text-gray-900 md:text-base">
              <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
              FSA &amp; HSA Eligible
            </div>
            <div className="px-6 py-6 md:px-7 md:py-7">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">Starting at</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold text-gray-900">$179</span>
                    <span className="text-lg font-medium text-gray-600">/mo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPriceFootnote((v) => !v)}
                    className="mt-1 text-xs text-gray-500 underline decoration-dotted underline-offset-4 hover:text-gray-700"
                  >
                    Includes clinician review &amp; nasal spray
                  </button>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="flex items-center rounded-[0.6rem] bg-[#FFB3C7] px-3 py-1.5">
                    <img src="/images/marketing/logos/klarna.png" alt="Klarna" className="h-3 w-auto" />
                  </span>
                  <span className="flex items-center rounded-[0.6rem] bg-[#B2FCE4] px-3 py-1.5">
                    <img src="/images/marketing/logos/afterpay.png" alt="Afterpay" className="h-3 w-auto" />
                  </span>
                  <span className="flex items-center rounded-[0.6rem] bg-[#EEF0FA] px-3 py-1.5 text-[10px] font-bold text-[#6D6FFC]">
                    FSA / HSA
                  </span>
                </div>
              </div>

              {showPriceFootnote && (
                <div className="mb-4 rounded-[0.75rem] bg-gray-50 p-3 text-xs leading-5 text-gray-600">
                  Calm Signal protocol is $179/mo. Includes nasal spray, clinician review, and dose calibration. Cancel anytime.
                </div>
              )}

              <div className="inline-flex w-full flex-col items-center gap-2.5">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }} className="w-full sm:w-auto">
                  <Link
                    href={CTA_HREF}
                    className="hs-solid-btn inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold sm:w-auto"
                  >
                    Start consultation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <p className="w-full text-center text-sm">
                  <span className="font-semibold text-gray-700">Takes 90 seconds</span> · <span className="text-gray-500">100% private · free</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs: benefits / pricing / description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 rounded-[1rem] border border-gray-200 bg-white p-2 shadow-sm"
          >
            <div className="mb-6 flex rounded-full bg-gray-100 p-1.5">
              {["benefits", "pricing", "description"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-full py-2.5 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
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
                    CALM_HERO_BENEFITS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex gap-3">
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                          <p className="text-[0.938rem] leading-relaxed text-gray-700 md:text-base">{item.text}</p>
                        </div>
                      );
                    })}
                  {activeTab === "pricing" && (
                    <PricingPlansTable footnote="Includes clinician review and dose calibration. Cancel anytime." />
                  )}
                  {activeTab === "description" && (
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      Calm Signal is a clinical anxiety protocol using Selank — a synthetic peptide that modulates GABA, serotonin, and BDNF to restore baseline calm without sedation, dependency, or emotional blunting. Administered as a daily nasal spray, prescribed by a US-licensed clinician.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-2 flex flex-col items-center gap-2 border-t border-gray-100 px-5 pb-2 pt-4 text-center text-xs text-gray-500 md:flex-row md:items-center md:justify-between md:px-6 md:text-left">
              <span className="flex items-center gap-1.5">
                <img draggable={false} role="img" alt="us" src="/images/marketing/logos/flag-usa.svg" className="h-3.5 w-auto" />
                U.S. Licensed Pharmacies Only
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Clinician-reviewed
              </span>
            </div>
          </motion.div>

          {/* Quick answers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[1rem] border border-gray-200 bg-white shadow-sm"
          >
            <div className="border-b border-gray-100 px-6 py-4 md:px-7">
              <p className="text-sm font-semibold text-gray-900">Quick answers</p>
            </div>
            {CALM_HERO_FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-gray-100 last:border-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left md:px-7"
                >
                  <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                  <div className="flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 p-1">
                    {openFaq === idx ? (
                      <Minus className="h-3 w-3 text-gray-600" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-3 w-3 text-gray-600" strokeWidth={2.5} />
                    )}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-sm leading-relaxed text-gray-600 md:px-7">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Related Products */}
          <div className="mb-6 mt-8">
            <h3 className="mb-4 text-base font-medium text-gray-900">Related Products</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "recovery", name: "Recovery & Repair", image: "/images/marketing/bundle/tirzepatide-injections-product.png" },
                { id: "gh-optimization", name: "GH Optimization", image: "/images/marketing/semaglutide.webp" },
              ].map((product) => (
                <Link
                  key={product.id}
                  href={`/${product.id}`}
                  className="flex flex-col items-center rounded-[1rem] border border-gray-200 bg-white p-4 text-center shadow-sm"
                >
                  <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[1rem]">
                    <img src={product.image} alt={product.name} loading="lazy" className="h-full max-h-[160px] w-full rounded-[1rem] object-contain" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">{product.name}</span>
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
              <p>*Price shown applies to the monthly plan. Final treatment fit depends on clinician review.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Truth — "The anxiety isn't who you are"                         */
/* ------------------------------------------------------------------ */

function CalmSignalTruthSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            If this sounds familiar
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          The anxiety isn&apos;t{" "}
          <span className="font-playfair italic text-[#6D6FFC]">who you are.</span>
        </h2>
        <p className="mx-auto mb-4 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          It&apos;s a state your nervous system slips into — and gets stuck in — when the signaling
          that should bring you back to baseline isn&apos;t firing. The problem is mechanical, not moral.
        </p>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-base leading-relaxed text-[#5d6169]">
          What people often describe as &ldquo;high-functioning anxiety&rdquo; is your brain running a stress
          response that should have ended hours ago. You&apos;re exhausted. The world keeps moving. You keep
          performing. Underneath, your body never gets to rest.
        </p>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 pr-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:p-0">
          {[
            {
              title: "The 3am spiral",
              bullets: [
                "Wide awake replaying a conversation from years ago.",
                "Your body is exhausted. Your mind won't release.",
              ],
              image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "The chest tightening",
              bullets: [
                "The physical signal that something's wrong — but nothing's happening.",
                "Fight-or-flight at the grocery store.",
              ],
              image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "The masking",
              bullets: [
                "Performing being-okay all day. Smiling through meetings.",
                "Coming home depleted. Doing it again tomorrow.",
              ],
              image: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=800&q=80",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="w-[72vw] shrink-0 snap-start sm:w-auto sm:shrink flex flex-col overflow-hidden rounded-[1.5rem] border border-[#ebebeb] bg-white shadow-sm"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#f5f5f5]">
                <Image src={card.image} alt={card.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-4 text-base font-bold leading-snug text-[#1c1a24]">{card.title}</h3>
                <ul className="flex flex-col gap-3">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-sm leading-snug text-[#5d6169]">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC]">
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      </div>
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
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#e55a26]"
          >
            Start the protocol →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Audience / Who It's For                                         */
/* ------------------------------------------------------------------ */

function CalmSignalAudienceSection() {
  return (
    <section className="bg-[#0d0d1a] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-4 text-center font-title text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            What you&apos;re{" "}
            <span className="font-playfair italic text-[#FF6B35]">actually asking.</span>
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-base text-white/70 md:text-lg">
            Every concern we hear — answered honestly, not marketed around.
          </p>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:p-0 lg:grid-cols-4">
          {[
            {
              tag: "SEDATION",
              title: "\"Will I feel sedated or flat?\"",
              body: "No. The protocol doesn't sedate or suppress. Members report keeping full emotional range — just without the spiral. You stay yourself.",
            },
            {
              tag: "EXISTING MEDS",
              title: "\"What if I'm already on an SSRI?\"",
              body: "Compatible with most existing medications. Many members use this to come off SSRIs with clinician supervision. Never stop SSRIs abruptly.",
            },
            {
              tag: "SPEED",
              title: "\"How fast will I feel different?\"",
              body: "Most members report first shift in 3–7 days. SSRIs typically need 6–8 weeks. Full benefit at 4–8 weeks of consistent daily use.",
            },
            {
              tag: "DEPENDENCY",
              title: "\"Will I be dependent on this?\"",
              body: "No documented tolerance or dependency. No withdrawal profile unlike benzodiazepines. Discontinue anytime, no taper required. Many use it seasonally.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-[72vw] shrink-0 snap-start snap-always md:w-auto md:shrink"
            >
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="flex h-full w-full flex-col rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              >
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#FF6B35]">{card.tag}</p>
                <h3 className="mb-3 text-xl font-bold leading-snug text-white">{card.title}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-white/60">{card.body}</p>
                <Link
                  href={CTA_HREF}
                  className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/15"
                >
                  → Learn more
                </Link>
              </motion.div>
            </motion.div>
          ))}
          <div className="w-2 shrink-0 md:hidden" aria-hidden />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. How It Works / Mechanism                                        */
/* ------------------------------------------------------------------ */

function CalmSignalMechanismSection() {
  return (
    <section id="how-it-works" className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
              How It Works
            </span>
            <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              Three things have to happen for anxiety to{" "}
              <span className="font-playfair italic text-[#6D6FFC]">actually release.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
              The clinical anxiety protocol supports each of them — without sedation,
              dependency, or numbing.
            </p>
          </div>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:p-0">
          {[
            {
              title: "Restore baseline calm",
              desc: "The protocol supports your body's natural production of serotonin, GABA, and BDNF — the neurochemicals that let your nervous system return to rest after a stressor. Not sedation. Restoration.",
              image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Quiet the HPA axis",
              desc: "Chronic anxiety means the hypothalamic-pituitary-adrenal axis is stuck in \"on.\" The protocol supports return to parasympathetic dominance — your body's actual rest state — without blunting normal emotional response.",
              image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Break the spiral loop",
              desc: "Anxious thought spirals are neurological grooves. As your baseline neurochemistry restores, the compulsive return to anxious thinking weakens. Members report this is the first thing they notice — the loop just stops looping.",
              image: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=600&q=80",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-[72vw] shrink-0 snap-start snap-always sm:w-auto sm:shrink"
            >
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-36 overflow-hidden">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="relative h-full w-full">
                    <Image src={card.image} alt={card.title} fill sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                  </motion.div>
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-base font-bold text-gray-900">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{card.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
          <div className="w-2 shrink-0 sm:hidden" aria-hidden />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Comparison — Not another SSRI                                   */
/* ------------------------------------------------------------------ */

function CalmSignalComparisonSection() {
  return (
    <section className="bg-[#f9f9f9] py-10 md:py-16">
      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
              A Different Approach
            </span>
            <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              Not{" "}
              <span className="font-playfair italic text-[#6D6FFC]">another SSRI.</span>{" "}
              Not a benzodiazepine.
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
              The two most-common anxiety treatments work — at a cost. The clinical
              anxiety protocol takes a different route.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Bad — SSRIs & Benzos */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-7 md:p-8"
          >
            <span className="mb-4 inline-block rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-400">
              SSRIs &amp; Benzodiazepines
            </span>
            <h3 className="mb-3 text-xl font-bold text-gray-900">What they cost you</h3>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              They work for many people. They also come with side effects most clinicians won&apos;t lead with.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "SSRIs: 6–8 weeks to take effect, sexual side effects in ~40% of users, weight gain, emotional blunting",
                "Benzodiazepines: rapid tolerance, dependency, severe withdrawal, contraindicated long-term",
                "Difficult to discontinue once started",
                "Many report feeling \"flat\" — calmer, but less themselves",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-gray-600">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Good — Clinical Anxiety Protocol */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border-2 border-[#6D6FFC] bg-white p-7 shadow-lg md:p-8"
          >
            <span className="mb-4 inline-block rounded-full bg-[#f0eeff] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6D6FFC]">
              Clinical Anxiety Protocol
            </span>
            <h3 className="mb-3 text-xl font-bold text-gray-900">What this actually does</h3>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              A nasal-administered peptide protocol that supports your own neurochemistry — not a substitute for it.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "First effects typically reported within 3–7 days",
                "No documented dependency or tolerance profile",
                "No sexual side effects, no weight changes, no emotional blunting",
                "Discontinue anytime, no taper required",
                "You stay yourself — just without the spiral",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-gray-600">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC]">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Timeline                                                        */
/* ------------------------------------------------------------------ */

function CalmSignalTimelineSection() {
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1000px] px-4 md:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
              What Members Actually Report
            </span>
            <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              The{" "}
              <span className="font-playfair italic text-[#6D6FFC]">first month</span>, on protocol.
            </h2>
          </div>
        </FadeIn>

        <div className="flex flex-col gap-6">
          {[
            {
              marker: "Day 1–3",
              title: "Subtle. Almost imperceptible.",
              body: "You might not notice anything at all. Your nervous system is beginning to respond — but the experience is internal and gradual. Don't expect a wave; expect a tide turning.",
            },
            {
              marker: "Day 4–7",
              title: "The first quiet.",
              body: "Most members notice it in retrospect: a moment in the day where the background anxiety just wasn't there. Then another. Then a longer stretch. The spirals lose some of their grip.",
            },
            {
              marker: "Week 2–4",
              title: "Your baseline shifts.",
              body: "This is when partners and close friends often comment unprompted. You're sleeping better. The 3am spirals get rarer. The chest tightening fades. You still feel things — you're just not running stress response on idle.",
            },
            {
              marker: "Week 6–8",
              title: "The new normal.",
              body: "Most members on protocol for 6+ weeks describe it as the version of themselves they always knew was underneath. Same emotional range. Same depth. Just without the spiral.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.marker}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-6"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC] text-sm font-bold text-white">
                  {i + 1}
                </div>
                {i < 3 && <div className="mt-2 w-px flex-1 bg-gradient-to-b from-[#6D6FFC]/40 to-transparent" />}
              </div>
              <div className="pb-6">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#6D6FFC]">{step.marker}</p>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={CTA_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#e55a26]"
          >
            Begin protocol →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Testimonials                                                    */
/* ------------------------------------------------------------------ */

function CalmSignalTestimonialsSection() {
  return (
    <section className="bg-[#f9f9f9] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-4 text-center font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            What members{" "}
            <span className="font-playfair italic text-[#6D6FFC]">actually say.</span>
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-base text-gray-600 md:text-lg">
            Verified Calm Signal members. Compensated for their testimonials. Individual results vary.
          </p>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:p-0">
          {[
            {
              quote: "I tried two SSRIs over six years. The side effects were as bad as the anxiety. Three weeks on this and the 3am spirals just stopped. I'm still me — I just have a floor again.",
              name: "Sarah K.",
              meta: "38 · Calm Signal · 4 months",
              image: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=200&q=80",
            },
            {
              quote: "I'd been on Xanax 'as needed' for years. The dependency scared me. I came off slowly while starting this. Six weeks later I haven't needed a benzo at all. That's the part I didn't think was possible.",
              name: "David R.",
              meta: "44 · Calm Signal · 6 months",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
            },
            {
              quote: "My therapist suggested I look into this. Eight weeks in and the work we do together actually sticks. Before, I'd leave a session feeling better and crash by Tuesday. Now the floor stays.",
              name: "Maya L.",
              meta: "31 · Calm Signal · 8 weeks",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-[72vw] shrink-0 snap-start snap-always md:w-auto md:shrink"
            >
              <div className="flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
                <div className="mb-4 flex gap-0.5 text-[#6D6FFC]">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-700">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.meta}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f0eeff] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6D6FFC]">
                    Verified
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="w-2 shrink-0 md:hidden" aria-hidden />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-gray-400 italic">
          Members were compensated for their testimonials. Results based on self-reported data from ~480
          HealSend Calm Signal members. Individual results vary.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. 60-day Promise                                                  */
/* ------------------------------------------------------------------ */

function CalmSignalPromiseSection() {
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
          <span className="font-title text-8xl font-black tracking-tight text-white md:text-9xl">60</span>
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
          Calmer.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Or your money back.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mb-4 text-sm leading-relaxed text-white/60"
        >
          Stay on protocol for 60 days. Complete your clinician check-ins. If you don&apos;t notice
          meaningful improvement in baseline anxiety, sleep quality, or the spiral loop, we refund
          your most recent month.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mb-8 text-sm text-white/40"
        >
          No fine print. No retention scripts. 84% of members report meaningful improvement by week 4.
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
            Start risk-free →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Upgrade Banner                                                 */
/* ------------------------------------------------------------------ */

function CalmSignalUpgradeBanner() {
  return (
    <section className="bg-[#F1F0FF] py-6 md:py-8">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-5 rounded-2xl bg-[#6D6FFC] px-7 py-7 md:flex-row md:items-center md:gap-10 md:px-10"
        >
          <div className="flex-1">
            <h3 className="mb-1.5 text-xl font-bold text-white">Anxiety affecting your sleep? Consider GH Optimization.</h3>
            <p className="max-w-xl text-sm leading-relaxed text-white/70">
              Many Calm Signal members add GH Optimization for deeper, more restorative sleep —
              the neurochemical reset that makes everything else work better.
            </p>
          </div>
          <Link
            href="/gh-optimization"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#e55a26]"
          >
            See GH Optimization →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. FAQ                                                            */
/* ------------------------------------------------------------------ */

const CALM_SIGNAL_FAQS = [
  {
    question: "What peptide is actually prescribed?",
    answer: "The Calm Signal protocol prescribes Selank, a synthetic peptide originally developed and studied for anxiolytic effects without sedation or dependency. Selank works by modulating GABA, serotonin, and BDNF — the neurochemicals involved in stress regulation, mood, and neuroplasticity. Unlike benzodiazepines, it doesn't bind GABA receptors directly, which is why it doesn't produce sedation or tolerance.",
  },
  {
    question: "How is this different from SSRIs?",
    answer: "SSRIs block serotonin reuptake — keeping more serotonin in the synapse. Selank works upstream — modulating neurochemical balance through different pathways. It doesn't keep serotonin elevated; it supports the system that produces and regulates it. The clinical effect can be similar; the side-effect profile is markedly different. SSRIs remain appropriate for many cases. This is an alternative — not a replacement.",
  },
  {
    question: "How is it administered?",
    answer: "Selank is administered as a nasal spray — typically 1–3 sprays per nostril, once daily. Mucosal absorption bypasses digestive degradation, allowing the peptide to reach the central nervous system efficiently without injection. Most members find the routine fits easily into morning habits.",
  },
  {
    question: "Are there side effects?",
    answer: "Selank is well-tolerated in clinical literature. Most-reported effects are mild nasal irritation in the first few days, occasional mild headache, and rare reports of vivid dreams. No serious adverse events documented in published trials. No tolerance, dependency, or withdrawal profile. No sexual side effects. No documented weight changes.",
  },
  {
    question: "Can I use this to come off SSRIs or benzodiazepines?",
    answer: "Many members do — and report it as one of the most meaningful outcomes of the protocol. Never stop SSRIs or benzodiazepines abruptly. Coordinate any taper with your prescriber. Your HealSend clinician can also support a structured taper if appropriate. Selank pairs safely with most existing medications during the transition period.",
  },
  {
    question: "Is this legal? Is it FDA-approved?",
    answer: "Selank is prescribed as a compounded medication, prepared by 503A and 503B FDA-inspected pharmacies under prescription from a US-licensed physician. Selank is not FDA-approved in the same sense as a branded drug, but it is legally prescribed, manufactured under FDA pharmacy-level oversight, and supported by published clinical literature.",
  },
  {
    question: "What if it doesn't work for me?",
    answer: "Our 60-day satisfaction guarantee covers exactly that. Complete your scheduled clinician check-ins, and if you don't notice meaningful improvement, we refund your most recent month. Beyond the guarantee, your clinician can adjust dosing or discuss other approaches. We don't keep you on something that isn't working.",
  },
  {
    question: "Is this a substitute for therapy?",
    answer: "No. The medication addresses the neurochemistry; therapy addresses the patterns. Members who pair Calm Signal with cognitive-behavioral therapy or other evidence-based talk therapy consistently report the strongest outcomes. If you're not currently in therapy and want a referral, your clinician can recommend approaches and providers.",
  },
  {
    question: "Will I feel sedated or flat?",
    answer: "No. The protocol doesn't sedate or suppress the nervous system. No documented emotional blunting in clinical literature. Members report keeping full emotional range — just without the spiral. You can still feel joy, sadness, anger — just not as a constant stress baseline.",
  },
  {
    question: "Do you accept insurance?",
    answer: "HealSend operates as a cash-pay telehealth service. Every plan is FSA and HSA eligible, and we provide itemized receipts for any reimbursement claims.",
  },
];

function CalmSignalFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:!pb-10 md:!pt-20 md:mt-0 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-balance font-title text-4xl font-medium text-slate-900 md:text-5xl">
          Asked.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Answered.</span>
        </h2>
        <p className="mb-16 max-w-lg text-start text-sm text-gray-600">
          Everything we get asked about the Calm Signal protocol.
          Want a real answer? Message a clinician for free.
        </p>
        <div className="flex flex-col gap-4">
          {CALM_SIGNAL_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-[1.25rem] bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-6 px-7 py-7 text-left md:px-10 md:py-9"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-lg font-bold text-gray-900 md:text-xl">{faq.question}</span>
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-[#333333] p-1.5 md:p-2">
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
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
              </motion.div>
            );
          })}
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={CTA_HREF} className="hs-solid-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto">
            Start consultation
          </Link>
          <Link href={CTA_HREF} className="hs-outline-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto">
            Talk to a clinician
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  12a. Urgency Banner                                                */
/* ------------------------------------------------------------------ */

function CalmSignalUrgencyBanner() {
  return (
    <section className="bg-[#f0eeff] py-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 px-4 text-center text-sm text-[#3d35b5]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6D6FFC] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#6D6FFC]" />
        </span>
        <p>
          <strong>16</strong> mental health consults available this week
          <span className="ml-1 text-[#5d6169]">· Capacity is limited by clinician availability</span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  12b. Closing CTA                                                   */
/* ------------------------------------------------------------------ */

function CalmSignalClosingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#3d35b5] py-20 text-center text-white md:py-32">
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6B35]/10 blur-[100px]"
          animate={inView ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className="relative mx-auto max-w-[640px] px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 font-title text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
        >
          You don&apos;t have to{" "}
          <span className="font-playfair italic text-[#FF6B35]">perform okay</span> anymore.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-base leading-relaxed text-white/75 md:text-lg"
        >
          90-second intake. Clinician review within 24 hours. Protocol shipped within
          48 hours of approval. 60-day satisfaction guarantee.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={CTA_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#e55a26] hover:shadow-[0_8px_32px_rgba(255,107,53,0.4)]"
          >
            Start free intake →
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-xs text-white/40"
        >
          By starting, you agree to our terms &amp; privacy policy. Provider-prescribed when appropriate.
        </motion.p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export                                                     */
/* ------------------------------------------------------------------ */

export default function CalmSignalLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <CalmSignalHeroSection />
      <CalmSignalProductHeroSection />
      <MediaLogosBanner />
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="Clinical Anxiety Protocol Benefits" />
      <CalmSignalTruthSection />
      <CalmSignalAudienceSection />
      <CalmSignalMechanismSection />
      <CalmSignalComparisonSection />
      <CalmSignalTimelineSection />
      <CalmSignalTestimonialsSection />
      <MemberResultsStatsSection />
      <CalmSignalPromiseSection />
      <SimpleSteps productData={productData} />
      <CalmSignalUpgradeBanner />
      <CleanSimpleEffective productData={null} />
      <LabTested productData={null} />
      <MarketingTrustMarquee items={CALM_SIGNAL_TRUST_ITEMS} edgeToEdge={false} />
      <SameMedicationSection planLabel="Clinical anxiety protocol — clinician-prescribed" />
      <CalmSignalFAQSection />
      <SupportAvailabilitySection />
      <CalmSignalUrgencyBanner />
      <CalmSignalClosingCTA />
      <MarketingFooter />
      <MobileStickyCta ctaHref={CTA_HREF} />
    </div>
  );
}
