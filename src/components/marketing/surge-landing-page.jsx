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
  MediaLogosBanner,
  RestoredTirzepatideBenefitsCarouselSection,
  mergeProductContent,
  SimpleSteps,
  PricingPlansTable,
  MobileStickyCta,
  MemberResultsStatsSection,
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/surge";

const SURGE_TRUST_ITEMS = [
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "US-Licensed Physicians", Icon: Stethoscope },
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
      <p className={`font-headline text-5xl font-medium md:text-6xl ${color}`}>
        {prefix}{count}{suffix}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Hero intro                                                      */
/* ------------------------------------------------------------------ */

function SurgeHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1F5F9]">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-6 md:px-[3.25rem] md:py-10 lg:h-[calc(100dvh-60px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <div className="mt-3 max-w-[34rem]">
              <ActiveMembersBanner />
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-balance font-headline text-4xl font-medium leading-tight tracking-tight text-gray-950 md:text-5xl"
              >
                Not a matter of{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 font-accent italic text-[#6D6FFC]">trying harder.</span>
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-700 lg:text-[1.05rem]"
              >
                ED affects 52% of men over 40. It&apos;s a vascular and signaling
                issue — not a character one. Clinical-grade performance medication,
                prescribed by US-licensed physicians, shipped discreet.
              </motion.p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              {[
                { icon: Stethoscope, bold: "US-licensed physicians", rest: "— full intake reviewed before any prescription" },
                { icon: Truck, bold: "48-hour average to first dose", rest: "— no clinic visits, no awkward conversations" },
                { icon: Target, bold: "96% member response rate", rest: "— effective dose found within first 2 attempts" },
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
                    Get my prescription
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

const SURGE_HERO_BENEFITS = [
  {
    icon: Target,
    text: "SURGE troche · combined sildenafil + tadalafil · 20–30 min onset, 24–36 hr window.",
  },
  {
    icon: Stethoscope,
    text: "US-licensed physician review + dose calibration included.",
  },
  {
    icon: BadgeCheck,
    text: "Month-to-month · cancel anytime · FSA & HSA accepted.",
  },
];

const SURGE_HERO_FAQS = [
  {
    question: "What's actually in SURGE?",
    answer:
      "SURGE is a clinician-prescribed troche (dissolvable lozenge) that combines Sildenafil (the active ingredient in Viagra, fast onset) and Tadalafil (the active ingredient in Cialis, long window) in a single dose. Dosing is calibrated to your case by your clinician.",
  },
  {
    question: "How is this different from my doctor?",
    answer:
      "Same prescription, from a US-licensed physician, dispensed by a US-licensed pharmacy. You skip the awkward in-person visit, the urology referral, and the 2–3 week timeline. SURGE is a HealSend-specific compounded formulation most clinics don't offer.",
  },
  {
    question: "How quickly will I get my first dose?",
    answer:
      "Typical timeline: 90-second intake → clinician review within 24 hours → medication ships within 48 hours → arrives in 2 days. Most members are 48–72 hours from intake to first dose.",
  },
];

function SurgeProductHeroSection() {
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
                SURGE · Performance Medication
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Combined troche · Sildenafil + Tadalafil · Clinician-prescribed
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
                  alt="SURGE — performance medication in stock"
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
                    <span className="text-4xl font-bold text-gray-900">$49</span>
                    <span className="text-lg font-medium text-gray-600">/mo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPriceFootnote((v) => !v)}
                    className="mt-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    SURGE flagship $129/mo
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
                  Sildenafil starts at $49/mo. SURGE (flagship combo troche) is $129/mo. Tadalafil daily is $79/mo. Cancel anytime.
                </div>
              )}

              <div className="inline-flex w-full flex-col items-center gap-2.5">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }} className="w-full sm:w-auto">
                  <Link
                    href={CTA_HREF}
                    className="hs-solid-btn inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold sm:w-auto"
                  >
                    Get my prescription
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <p className="w-full text-center text-sm">
                  <span className="font-semibold text-gray-700">Takes 90 seconds</span> · <span className="text-gray-500">100% private · free</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs card */}
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
                    SURGE_HERO_BENEFITS.map((item, idx) => {
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
                      SURGE is a clinician-prescribed troche combining sildenafil (fast-acting, 30–60 min onset) and tadalafil (long window, 24–36 hrs) in a single dissolvable dose. No water needed. Faster absorption than oral tablets. Clinician-titrated dose based on your case.
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

          {/* Mini-FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[1rem] border border-gray-200 bg-white shadow-sm"
          >
            <div className="border-b border-gray-100 px-6 py-4 md:px-7">
              <p className="text-sm font-semibold text-gray-900">Quick answers</p>
            </div>
            {SURGE_HERO_FAQS.map((faq, idx) => (
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

          <div className="mb-6 mt-8">
            <h3 className="mb-4 text-base font-medium text-gray-900">
              Related Products
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "trt", name: "Testosterone Therapy", image: "/images/marketing/bundle/tirzepatide-injections-product.png" },
                { id: "healing-peptide-therapy", name: "Healing Peptide Therapy", image: "/images/marketing/semaglutide.webp" },
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
                *Price shown applies to the monthly plan. Actual price will depend on plan prescribed.
                Final treatment fit depends on clinician review.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Truth / Reframe Section                                         */
/* ------------------------------------------------------------------ */

function SurgeTruthSection() {
  return (
    <section className="bg-[#0d0d1a] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-4 text-center font-headline text-3xl font-medium leading-tight text-white md:text-4xl lg:text-5xl">
            You&apos;re not broken.{" "}
            <span className="font-accent italic text-[#FF6B35]">You&apos;re statistically common.</span>
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-base text-white/70 md:text-lg">
            ED is a vascular, hormonal, and neurological signaling problem. It&apos;s about{" "}
            <strong className="text-white">blood flow, nitric oxide pathways, and endothelial function</strong>{" "}
            — none of which respond to &ldquo;just relax&rdquo; or &ldquo;try again later.&rdquo;
          </p>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:p-0">
          {[
            {
              tag: "THE STATS",
              title: "52% of men over 40.",
              body: "ED affects more than half of men over 40. It's not rare. It's not unusual. The medications have been studied for 25+ years and are some of the safest, most-prescribed pharmaceuticals in modern medicine.",
            },
            {
              tag: "THE SCIENCE",
              title: "It's in your physiology.",
              body: "It's not in your head. It's about blood flow, nitric oxide pathways, and endothelial function. What's changed: now you can get the prescription in 48 hours, without a clinic visit, without an awkward conversation.",
            },
            {
              tag: "THE SOLUTION",
              title: "Three protocols. One that fits.",
              body: "Fast-acting sildenafil for planned moments. Daily tadalafil for always-ready. SURGE for both at once — 20-min onset, 24-hour window. Your clinician matches the protocol to how you actually live.",
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
                  → Get my prescription
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
/*  4. SURGE Flagship Section                                          */
/* ------------------------------------------------------------------ */

function SurgeFlagshipSection() {
  return (
    <section id="how-it-works" className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
              The HealSend Flagship
            </span>
            <h2 className="mb-3 font-headline text-3xl font-medium text-gray-900 md:text-4xl lg:text-5xl">
              SURGE.{" "}
              <span className="font-accent italic text-[#6D6FFC]">Both, at once.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
              A clinician-prescribed troche that combines fast-acting and long-window performance medications
              in a single dissolvable dose. Onset in 20–30 minutes. Window of effectiveness lasting 24–36 hours.
            </p>
          </div>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {[
            {
              title: "20–30 min onset",
              desc: "Fast-acting sildenafil component kicks in quickly. No need to plan an hour ahead.",
              image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "24–36 hour window",
              desc: "Long-acting tadalafil component means timing isn't your problem anymore. Spontaneity restored.",
              image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Dissolvable troche",
              desc: "Dissolves under the tongue — no water, no swallowing, faster absorption. Discreet and effortless.",
              image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Clinician-titrated dose",
              desc: "Your clinician calibrates the exact sildenafil + tadalafil ratio for your case. Adjustments at no extra charge.",
              image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
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
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
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
/*  5. Three Protocols Section                                         */
/* ------------------------------------------------------------------ */

function SurgeProtocolsSection() {
  return (
    <section className="bg-[#FEF2F2] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
              Three Options
            </span>
            <h2 className="mb-3 font-headline text-3xl font-medium text-gray-900 md:text-4xl lg:text-5xl">
              One{" "}
              <span className="font-accent italic text-[#6D6FFC]">doesn&apos;t fit every man.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
              Match the medication to how you actually live. Your clinician finalizes the prescription
              after a free intake. All shipped from US-licensed 503A/503B FDA-inspected pharmacies.
            </p>
          </div>
        </FadeIn>

        <div className="flex flex-col gap-5 px-4 md:grid md:grid-cols-3 md:px-0">
          {[
            {
              tag: "FAST-ACTING · ON-DEMAND",
              title: "Generic Sildenafil",
              subtitle: "Generic Viagra · the proven fast-acting option.",
              price: "$49",
              strikePrice: "$89",
              attrs: [
                { key: "Onset", val: "30–60 min" },
                { key: "Window", val: "4–6 hours" },
                { key: "Form", val: "Oral tablet" },
                { key: "Best for", val: "Planned moments" },
              ],
              features: [
                "Same active ingredient as branded Viagra — at a fraction of the cost",
                "Highest-volume prescribed ED medication globally",
                "Doses adjustable (25mg / 50mg / 100mg) — clinician sets your starting dose",
                "Take ~1 hour before, on empty stomach for best onset",
              ],
              featured: false,
            },
            {
              tag: "BOTH, COMBINED · 24-HOUR WINDOW",
              title: "SURGE · Troche",
              subtitle: "The flagship. Both active ingredients in a single dissolvable.",
              badge: "★ Most chosen · 68%",
              price: "$129",
              strikePrice: "$189",
              attrs: [
                { key: "Onset", val: "20–30 min" },
                { key: "Window", val: "24–36 hours" },
                { key: "Form", val: "Dissolvable troche" },
                { key: "Best for", val: "Spontaneity + reliability" },
              ],
              features: [
                "Combined dose — fast onset + long window in one troche",
                "Dissolves under the tongue — no water, no swallowing, faster absorption",
                "24–36 hour window means timing isn't your problem anymore",
                "Clinician-titrated dose based on your case",
                "HealSend proprietary protocol — only available here",
              ],
              featured: true,
            },
            {
              tag: "DAILY OPTION · 36-HOUR WINDOW",
              title: "Generic Tadalafil",
              subtitle: "Generic Cialis · steady-state for the always-ready approach.",
              price: "$79",
              strikePrice: "$119",
              attrs: [
                { key: "Onset", val: "~3 days steady-state" },
                { key: "Window", val: "36 hours" },
                { key: "Form", val: "Daily oral tablet" },
                { key: "Best for", val: "Continuous readiness" },
              ],
              features: [
                "Daily low-dose option — once you reach steady-state, you're always ready",
                "Same active ingredient as branded Cialis",
                "Also studied for BPH symptoms — bonus benefit for men over 50",
                "Low-dose daily protocol — better tolerability than larger on-demand doses",
              ],
              featured: false,
            },
          ].map((tier, i) => (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full"
            >
              <div className={`flex h-full w-full flex-col rounded-2xl border p-7 transition-all hover:-translate-y-1 ${
                tier.featured
                  ? "border-[#6D6FFC] bg-gradient-to-br from-white to-[#F1F0FF] shadow-[0_0_0_3px_rgba(109,111,252,0.1),0_30px_80px_-20px_rgba(109,111,252,0.15)]"
                  : "border-gray-200 bg-white shadow-sm hover:border-gray-300"
              }`}>
                <div className="mb-4 h-6">
                  {tier.badge && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6D6FFC] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {tier.badge}
                    </span>
                  )}
                </div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6D6FFC]">{tier.tag}</p>
                <h3 className="mb-1 text-2xl font-bold text-gray-900">{tier.title}</h3>
                <p className="mb-5 text-sm text-gray-500">{tier.subtitle}</p>

                <div className="mb-5 flex flex-col gap-3 border-y border-gray-100 py-4">
                  {tier.attrs.map((attr) => (
                    <div key={attr.key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{attr.key}</span>
                      <span className="font-semibold text-gray-900">{attr.val}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-5 flex items-baseline gap-2.5">
                  <span className="font-headline text-4xl font-medium text-gray-900">{tier.price}</span>
                  <span className="text-sm text-gray-500">/month</span>
                  {tier.strikePrice && (
                    <span className="ml-auto text-xl font-headline text-gray-400 line-through decoration-2">{tier.strikePrice}</span>
                  )}
                </div>

                <ul className="mb-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-snug text-gray-600">
                      <div className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-500">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={CTA_HREF}
                  className={`w-full rounded-full py-3.5 text-center text-sm font-bold transition ${
                    tier.featured
                      ? "bg-[#6D6FFC] text-white hover:bg-[#5a5ce8]"
                      : "border border-gray-200 text-gray-900 hover:border-gray-900"
                  }`}
                >
                  Start {tier.title.split(" ")[0]} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Comparison Table                                                */
/* ------------------------------------------------------------------ */

function SurgeComparisonSection() {
  const rows = [
    {
      label: "Onset",
      surge: { icon: "check", text: "20–30 min" },
      sild: { icon: "none", text: "30–60 min" },
      tad: { icon: "none", text: "~3 days steady-state" },
      nothing: { icon: "none", text: "—" },
    },
    {
      label: "Window of effectiveness",
      surge: { icon: "check", text: "24–36 hours" },
      sild: { icon: "none", text: "4–6 hours" },
      tad: { icon: "check", text: "~36 hours" },
      nothing: { icon: "none", text: "—" },
    },
    {
      label: "Daily dosing required?",
      surge: { icon: "check", text: "No — as needed" },
      sild: { icon: "check", text: "No" },
      tad: { icon: "warn", text: "Yes (low dose)" },
      nothing: { icon: "none", text: "—" },
    },
    {
      label: "Form factor",
      surge: { icon: "check", text: "Dissolvable troche" },
      sild: { icon: "none", text: "Oral tablet" },
      tad: { icon: "none", text: "Oral tablet" },
      nothing: { icon: "none", text: "—" },
    },
    {
      label: "Discretion",
      surge: { icon: "check", text: "No water needed" },
      sild: { icon: "none", text: "Swallow with water" },
      tad: { icon: "none", text: "Daily routine" },
      nothing: { icon: "none", text: "—" },
    },
    {
      label: "Best for",
      surge: { icon: "none", text: "Spontaneity + reliability" },
      sild: { icon: "none", text: "Planned moments" },
      tad: { icon: "none", text: "Always ready" },
      nothing: { icon: "none", text: "—" },
    },
  ];

  function Cell({ data, isSurge = false }) {
    return (
      <td className={`px-4 py-4 text-center align-top text-sm ${isSurge ? "bg-[#F1F0FF]/70 text-[#6D6FFC]" : "text-gray-600"}`}>
        <div className="flex flex-col items-center gap-1">
          {data.icon === "check" && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6D6FFC]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </span>
          )}
          {data.icon === "warn" && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B35]">
              <span className="text-xs font-bold text-white">!</span>
            </span>
          )}
          <span className={`whitespace-pre-line text-xs leading-snug ${isSurge ? "font-semibold text-[#6D6FFC]" : data.icon === "warn" ? "text-[#FF6B35]" : ""}`}>
            {data.text}
          </span>
        </div>
      </td>
    );
  }

  return (
    <section className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-3 text-center font-headline text-3xl font-medium text-gray-900 md:text-4xl lg:text-5xl">
            SURGE vs{" "}
            <span className="font-accent italic text-[#6D6FFC]">the alternatives.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-base text-gray-600 md:text-lg">
            Not every protocol fits every man. Here&apos;s how SURGE compares with standalone sildenafil and tadalafil.
          </p>
        </FadeIn>

        <FadeIn>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-[180px] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400" />
                  <th className="bg-[#F1F0FF]/70 px-4 py-4 text-center">
                    <div className="inline-block">
                      <span className="mb-1 block rounded-full bg-[#FF6B35] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Most Chosen · 68%
                      </span>
                      <span className="block rounded-lg bg-[#6D6FFC] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                        SURGE
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Sildenafil</th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Tadalafil</th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Doing Nothing</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr
                    key={row.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
                  >
                    <td className="px-4 py-4 text-xs font-semibold text-gray-700">{row.label}</td>
                    <Cell data={row.surge} isSurge />
                    <Cell data={row.sild} />
                    <Cell data={row.tad} />
                    <Cell data={row.nothing} />
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-center text-sm text-gray-500">
            Your clinician helps you pick the right protocol.{" "}
            <Link href={CTA_HREF} className="font-medium text-[#6D6FFC] underline underline-offset-4">
              Start free intake →
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Pain Points                                                     */
/* ------------------------------------------------------------------ */

const SURGE_PAIN_CARDS = [
  {
    title: "You dread the timing.",
    bullets: [
      "Planning an hour ahead kills the spontaneity.",
      "You need something that works in 20 minutes and lasts all weekend.",
    ],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "You tried. It worked. But the window was too short.",
    bullets: [
      "Sildenafil works, but 4–6 hours isn't enough.",
      "By the time you're ready again, it's worn off.",
    ],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "You don't want a daily pill.",
    bullets: [
      "Daily tadalafil works — but you don't want to take a pill every single day.",
      "You want on-demand with a long window. That's SURGE.",
    ],
    image: "https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "You've been avoiding the appointment.",
    bullets: [
      "The urology referral. The awkward conversation. The 2–3 week wait.",
      "90-second online intake. Prescription in 48 hours. Shipped discreet.",
    ],
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80",
  },
];

function SurgePainPointsSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            Sound familiar?
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          It&apos;s never been about{" "}
          <span className="font-accent italic text-[#6D6FFC]">trying harder.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          ED is a medical condition, not a character flaw. 52% of men over 40 experience it.
          The science of medicating it is settled — the medications have been studied for 25+ years.
        </p>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 pr-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {SURGE_PAIN_CARDS.map((card) => (
            <div
              key={card.title}
              className="w-[72vw] shrink-0 snap-start sm:w-auto sm:shrink flex flex-col overflow-hidden rounded-[1.5rem] border border-[#ebebeb] bg-white shadow-sm"
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
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#e55a26]"
          >
            Get my prescription →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Testimonials                                                    */
/* ------------------------------------------------------------------ */

function SurgeTestimonialsSection() {
  return (
    <section className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-3 text-center font-headline text-3xl font-medium text-gray-900 md:text-4xl lg:text-5xl">
            2,400+ men.{" "}
            <span className="font-accent italic text-[#6D6FFC]">Real results.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-base text-gray-600">
            Verified HealSend members across the three protocols.
          </p>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-3">
          {[
            {
              quote: "I dreaded the urology appointment more than the issue itself. Did the HealSend intake in five minutes. SURGE arrived in 48 hours. My wife noticed the difference within a week.",
              name: "James M., 47",
              meta: "SURGE · 6 months",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
            },
            {
              quote: "Tried sildenafil first — worked, but the planning killed any spontaneity. Switched to SURGE and the window changed everything. My relationship is back.",
              name: "Marcus L., 52",
              meta: "SURGE · 9 months",
              image: "https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=900&q=80",
            },
            {
              quote: "Daily tadalafil — life-changing. Once it reached steady-state, the problem just stopped being a problem. No timing. No anxiety. No conversation.",
              name: "David K., 58",
              meta: "Daily Tadalafil · 14 months",
              image: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=900&q=80",
            },
          ].map((story, i) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-[72vw] shrink-0 snap-start snap-always sm:w-auto sm:shrink"
            >
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden bg-[#E8E3FF]">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <blockquote className="mb-5 flex-1 text-sm italic leading-relaxed text-gray-700">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{story.name}</p>
                      <p className="text-xs text-gray-500">{story.meta}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Verified
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
          <div className="w-2 shrink-0 sm:hidden" aria-hidden />
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-[11px] italic text-gray-400">
          Members were compensated for their testimonials. Results based on self-reported data. Individual results vary.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. 60-day Promise                                                  */
/* ------------------------------------------------------------------ */

function SurgePromiseSection() {
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
          <span className="font-headline text-8xl font-black tracking-tight text-white md:text-9xl">
            60
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
          className="mb-4 font-headline text-2xl font-medium leading-snug text-white md:text-3xl"
        >
          Effective dose.{" "}
          <span className="font-accent italic text-[#6D6FFC]">Or your money back.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mb-8 text-sm text-white/40"
        >
          If your clinician can&apos;t find an effective dose within 60 days and 3 attempts, we refund your most recent month.
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

function SurgeUpgradeBanner() {
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
            <h3 className="mb-1.5 text-xl font-bold text-white">Looking for weight loss instead?</h3>
            <p className="max-w-xl text-sm leading-relaxed text-white/70">
              If weight management is your primary goal, our GLP-1 and visceral fat therapy protocols may be a better fit. We offer clinician-guided options for both.
            </p>
          </div>
          <Link
            href="/weight-loss"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#e55a26]"
          >
            See Weight Loss Options →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. FAQ                                                            */
/* ------------------------------------------------------------------ */

const SURGE_FAQS = [
  {
    question: "What's actually in SURGE?",
    answer: "SURGE is a clinician-prescribed troche (dissolvable lozenge) that combines Sildenafil (the active ingredient in Viagra, fast onset) and Tadalafil (the active ingredient in Cialis, long window) in a single dose. Dosing is typically 25–50mg Sildenafil + 5–10mg Tadalafil per troche, calibrated to your case. Compounded by US-licensed 503A pharmacies.",
  },
  {
    question: "How is this different from getting a prescription from my doctor?",
    answer: "Same prescription, from a US-licensed physician, dispensed by a US-licensed pharmacy. You skip the awkward in-person visit, the urology referral, and the 2–3 week timeline. SURGE is also a HealSend-specific compounded formulation — your local pharmacy won't have it as a stock item.",
  },
  {
    question: "Is the generic version really the same as branded Viagra / Cialis?",
    answer: "Yes. The active ingredients are identical. Branded Viagra (sildenafil) and branded Cialis (tadalafil) lost patent protection years ago. Generic versions with the same active ingredient at the same dose are FDA-equivalent. The difference is price — generics are typically 70–90% less expensive.",
  },
  {
    question: "How quickly will I get my first dose?",
    answer: "Typical timeline: 90-second intake → clinician review within 24 hours → medication ships within 48 hours → arrives in 2 days. Most members are 48–72 hours from intake to first dose.",
  },
  {
    question: "What are the side effects?",
    answer: "PDE5 inhibitors are among the most-studied medications in modern medicine. Most common side effects: headache, facial flushing, nasal congestion, mild dyspepsia. These typically resolve within hours and are dose-dependent. Critical safety note: these medications interact with nitrate medications (used for heart conditions). Your clinician screens for these during intake.",
  },
  {
    question: "What if the first dose doesn't work?",
    answer: "Dose finding is a normal part of ED treatment. If the first dose isn't effective, your clinician will adjust at no extra charge, typically within 24 hours. Most members find their effective dose within the first 2 attempts. Our 60-day guarantee covers this.",
  },
  {
    question: "What if I have heart disease, diabetes, or take other medications?",
    answer: "Your intake asks about every relevant medical condition and medication. Your clinician screens for interactions before prescribing. Nitrate medications are an absolute contraindication. Diabetes, controlled hypertension, and most cardiovascular conditions are generally compatible, but the clinician makes the final call.",
  },
  {
    question: "Is the shipping really discreet?",
    answer: "Yes. Packaging is plain and unmarked. Shipping labels reference HealSend (not the medication). No medication name visible from the outside of the package. Direct from US-licensed compounding pharmacy.",
  },
  {
    question: "Can I switch protocols later?",
    answer: "Yes, anytime. Many members start with Sildenafil, switch to SURGE for the longer window, or move to daily Tadalafil as their needs evolve. Switching is a clinician-approved change with no friction — message your care team.",
  },
  {
    question: "Is this legal? Is it FDA-approved?",
    answer: "Sildenafil and Tadalafil are FDA-approved medications with decades of safety data. SURGE is a compounded formulation — the active ingredients are the same FDA-approved compounds, combined in a custom troche format by US-licensed 503A pharmacies under prescription. Compounded medications are legally prescribed every day in the US.",
  },
];

function SurgeFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:!pb-10 md:!pt-20 md:mt-0 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-balance font-headline text-4xl font-medium text-slate-900 md:text-5xl">
          Asked.{" "}
          <span className="font-accent italic text-[#6D6FFC]">Answered.</span>
        </h2>
        <p className="mb-16 max-w-lg text-start text-sm text-gray-600">
          Everything you&apos;d want to know before getting started. Once you do, you have unlimited clinician access.
        </p>
        <div className="flex flex-col gap-4">
          {SURGE_FAQS.map((faq, idx) => {
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
            Get my prescription
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
/*  12. Closing CTA                                                    */
/* ------------------------------------------------------------------ */

function SurgeClosingCTA() {
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
          className="mb-5 font-headline text-4xl font-medium leading-tight md:text-5xl lg:text-6xl"
        >
          Two days from your{" "}
          <span className="font-accent italic text-[#FF6B35]">first dose.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-base leading-relaxed text-white/75 md:text-lg"
        >
          90-second intake. Free clinician review. No commitment until you&apos;re prescribed.
          60-day effective-dose guarantee.
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

export default function SurgeLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="hs-font-v2 min-h-screen overflow-x-clip bg-[#f9f9f9] selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <SurgeHeroSection />
      <SurgeProductHeroSection />
      <MediaLogosBanner />
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="SURGE Benefits" />
      <SurgePainPointsSection />
      <SurgeTruthSection />
      <SurgeFlagshipSection />
      <SurgeProtocolsSection />
      <SurgeComparisonSection />
      <SurgeTestimonialsSection />
      <MemberResultsStatsSection />
      <SurgePromiseSection />
      <SimpleSteps productData={productData} />
      <SurgeUpgradeBanner />
      <CleanSimpleEffective productData={null} />
      <LabTested productData={null} />
      <MarketingTrustMarquee items={SURGE_TRUST_ITEMS} edgeToEdge={false} />
      <SameMedicationSection planLabel="Clinician-prescribed performance medication" />
      <SurgeFAQSection />
      <SupportAvailabilitySection />
      <SurgeClosingCTA />
      <MarketingFooter />
      <MobileStickyCta ctaHref={CTA_HREF} />
    </div>
  );
}
