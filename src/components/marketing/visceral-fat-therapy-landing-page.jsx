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
  RelatedProductsSection,
  FDADisclaimerSection,
  MediaLogosBanner,
  RestoredTirzepatideBenefitsCarouselSection,
  mergeProductContent,
  SimpleSteps,
  PricingPlansTable,
  MobileStickyCta,
  MemberResultsStatsSection,
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/visceral-fat-therapy";

const VF_TRUST_ITEMS = [
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "Clinician-Guided Visceral Fat Protocol", Icon: Stethoscope },
  { text: "Free & Fast Shipping", Icon: Truck },
  { text: "U.S. Only Certified Pharmacies", Icon: null, svg: "True" },
  { text: "Always On Clinician Support", Icon: Headset },
  { text: "1,000,000+ prescriptions written", Icon: ClipboardCheck },
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
/*  1. Willpower / Hero intro                                          */
/* ------------------------------------------------------------------ */

function VFWillpowerSection() {
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
                className="text-balance font-title text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl"
              >
                The belly{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 font-playfair italic text-[#6D6FFC]">GLP-1s</span>
                  <motion.svg
                    className="absolute left-0 top-1/2 z-20 w-full"
                    style={{ transform: "translateY(-50%)" }}
                    height="3"
                    viewBox="0 0 100 3"
                    preserveAspectRatio="none"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                  >
                    <line x1="0" y1="1.5" x2="100" y2="1.5" stroke="#FF6B35" strokeWidth="3" />
                  </motion.svg>
                </span>{" "}
                can&apos;t reach.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-700 lg:text-[1.05rem]"
              >
                A clinician-guided protocol targeting visceral adiposity — the
                deep abdominal fat that diet, exercise, and even GLP-1s
                consistently leave behind.
              </motion.p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              {[
                { bold: "Not just weight loss", rest: "— specifically targets deep abdominal visceral fat" },
                { bold: "No appetite suppression", rest: "— works through metabolic pathways, not hunger control" },
                { bold: "Clinician access + baseline labs included", rest: "— no extra fees" },
              ].map((item, i) => (
                <motion.li
                  key={item.bold}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 text-sm md:text-base"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC]">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                  <span>
                    <strong className="text-gray-900">{item.bold}</strong>{" "}
                    {item.rest}
                  </span>
                </motion.li>
              ))}
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
                    Start consultation
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

const VF_HERO_BENEFITS = [
  {
    icon: Target,
    text: "Tesamorelin-based protocol · subcutaneous daily injection · supplies included.",
  },
  {
    icon: Stethoscope,
    text: "Board-certified clinician review + baseline metabolic labs included.",
  },
  {
    icon: BadgeCheck,
    text: "Month-to-month · cancel anytime · FSA & HSA accepted.",
  },
];

const VF_HERO_FAQS = [
  {
    question: "What is tesamorelin?",
    answer:
      "Tesamorelin is the most studied peptide for visceral fat reduction — FDA-approved for HIV-associated lipodystrophy and studied extensively in non-HIV populations. It stimulates GH release to specifically reduce visceral adipose tissue.",
  },
  {
    question: "How is this different from a GLP-1?",
    answer:
      "GLP-1s work through appetite suppression and slow gastric emptying — they reduce overall body weight but don't specifically target visceral fat. This protocol targets visceral adipose tissue directly through growth hormone secretagogue pathways.",
  },
  {
    question: "Do I need to be overweight to qualify?",
    answer:
      "No. Many members are in a healthy BMI range but carry excess visceral fat. The protocol is for anyone with measurable visceral adiposity, not just those who qualify for GLP-1 therapy.",
  },
];

function VFProductHeroSection() {
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
                Visceral Fat-Targeting Therapy
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Tesamorelin-based · Daily subcutaneous · Clinician-guided
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
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
                  alt="Visceral Fat-Targeting Therapy — in stock"
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
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold text-gray-900">$249</span>
                    <span className="text-lg font-medium text-gray-600">per month</span>
                  </div>
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
                    VF_HERO_BENEFITS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex gap-3">
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                          <p className="text-[0.938rem] leading-relaxed text-gray-700 md:text-base">{item.text}</p>
                        </div>
                      );
                    })}
                  {activeTab === "pricing" && (
                    <PricingPlansTable footnote="Includes clinician review, labs, and supplies. Cancel anytime." />
                  )}
                  {activeTab === "description" && (
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      Tesamorelin is a GHRH analog clinically proven to reduce visceral adipose tissue. Unlike GLP-1 medications that work through appetite suppression, tesamorelin targets deep abdominal fat through growth hormone secretagogue pathways — making it effective even when other approaches have failed.
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
            {VF_HERO_FAQS.map((faq, idx) => (
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
/*  3. Built for the people GLP-1s weren't built for                  */
/* ------------------------------------------------------------------ */

function VFAudienceSection() {
  return (
    <section className="bg-[#0d0d1a] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-4 text-center font-title text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            Built for the people GLP-1s{" "}
            <span className="font-playfair italic text-[#FF6B35]">weren&apos;t built for.</span>
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-base text-white/70 md:text-lg">
            <strong className="text-white">40% of U.S. adults</strong>{" "}have clinically significant visceral fat. Most aren&apos;t candidates for Wegovy or Zepbound. Most have nowhere to go. This protocol exists for them.
          </p>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:p-0">
          {[
            {
              tag: "AUDIENCE 1",
              title: "You don't qualify for a GLP-1.",
              body: "BMI under 27. No diabetes, no comorbidity. You look \"fine\" on paper — but you can see the visceral fat in the mirror, and your labs aren't where they should be. GLP-1s won't be prescribed to you. This will.",
            },
            {
              tag: "AUDIENCE 2",
              title: "You tried a GLP-1. The belly stayed.",
              body: "You lost 30 pounds on semaglutide. Your face is leaner, your arms are leaner, your legs are leaner. The belly ring didn't move. That's because GLP-1s reduce overall adipose — not visceral fat specifically. This protocol does.",
            },
            {
              tag: "AUDIENCE 3",
              title: "You don't want appetite suppression.",
              body: "You don't want food noise gone — you like food. You don't want GI side effects, \"Ozempic face,\" or social weirdness. You want targeted fat loss without losing the parts of eating you actually enjoy.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-[75vw] shrink-0 snap-start snap-always md:w-auto md:shrink"
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
                  → This might be you
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
/*  5. Visceral fat science                                           */
/* ------------------------------------------------------------------ */

function VFOrganDiagram() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[400px]" fill="none">
      {/* Outer ring — subcutaneous */}
      <circle cx="200" cy="200" r="170" fill="#EEE9FF" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="5 3" />
      {/* Mid ring */}
      <circle cx="200" cy="200" r="140" fill="#E8E2FF" stroke="#A78BFA" strokeWidth="1" />
      {/* Inner visceral zone */}
      <circle cx="200" cy="200" r="100" fill="#D4C8FF" />
      {/* Organ: Stomach */}
      <ellipse cx="168" cy="186" rx="32" ry="26" fill="#7C5CBF" opacity="0.85" />
      <text x="168" y="191" textAnchor="middle" fontSize="13" fill="white" fontWeight="700">STOMACH</text>
      {/* Organ: Liver */}
      <ellipse cx="226" cy="175" rx="30" ry="22" fill="#7C5CBF" opacity="0.85" />
      <text x="226" y="180" textAnchor="middle" fontSize="13" fill="white" fontWeight="700">LIVER</text>
      {/* Organ: Intestines */}
      <ellipse cx="200" cy="230" rx="40" ry="22" fill="#7C5CBF" opacity="0.85" />
      <text x="200" y="235" textAnchor="middle" fontSize="13" fill="white" fontWeight="700">INTESTINES</text>
      {/* Fat dots (visceral) */}
      {[[185,210],[218,206],[195,195],[212,222],[178,222],[202,198],[230,215]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="#FF6B35" opacity="0.75" />
      ))}
      {/* Label: Subcutaneous */}
      <line x1="22" y1="100" x2="70" y2="132" stroke="#6D6FFC" strokeWidth="1.5" />
      <text x="6" y="88" fontSize="14" fill="#6D6FFC" fontWeight="700">Subcutaneous fat</text>
      <text x="6" y="104" fontSize="12" fill="#6D6FFC">(you pinch)</text>
      {/* Label: Visceral */}
      <line x1="332" y1="100" x2="290" y2="138" stroke="#FF6B35" strokeWidth="1.5" />
      <text x="308" y="88" fontSize="14" fill="#FF6B35" fontWeight="700">Visceral</text>
      <text x="308" y="104" fontSize="12" fill="#FF6B35">(wraps your</text>
      <text x="308" y="118" fontSize="12" fill="#FF6B35">organs)</text>
      {/* Label: VAT */}
      <line x1="320" y1="298" x2="270" y2="260" stroke="#FF6B35" strokeWidth="1.5" />
      <text x="308" y="296" fontSize="14" fill="#FF6B35" fontWeight="700">VAT cluster</text>
      <text x="308" y="312" fontSize="12" fill="#FF6B35">(metabolic)</text>
    </svg>
  );
}

function VFVisceralFatSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#FEF2F2] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="mb-4 text-center font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Visceral fat isn&apos;t{" "}
            <br />
            the fat you can{" "}
            <span className="font-playfair italic text-red-600">pinch.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-base text-gray-600 md:text-lg">
            It&apos;s the fat that wraps your liver, pancreas, and intestines. Metabolically active. Hormonally disruptive. Far more dangerous than the fat under your skin — and uniquely resistant to diet alone.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
            {/* Left: diagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex shrink-0 items-center justify-center lg:w-[45%]"
            >
              <VFOrganDiagram />
            </motion.div>
            {/* Right: info panels */}
            <div className="flex flex-1 flex-col divide-y divide-gray-100">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="pb-6"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-[#6D6FFC] bg-[#6D6FFC]/20" />
                  <span className="text-base font-bold text-gray-900">Subcutaneous fat</span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">
                  The fat layer right under your skin. The kind you can pinch on your arms, thighs, hips. Cosmetically annoying — but metabolically harmless.
                </p>
                <div className="flex gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">Pinchable</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">Diet-responsive</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="pt-6"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#FF6B35]" />
                  <span className="text-base font-bold text-gray-900">Visceral fat (VAT)</span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">
                  Stored deep around your organs. Releases inflammatory hormones into your bloodstream 24/7. Linked to insulin resistance, fatty liver, cardiovascular disease, type 2 diabetes, and metabolic syndrome.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-red-100/60 px-3 py-1 text-xs font-semibold text-red-300">Hidden</span>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">Diet-resistant</span>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">Dangerous</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Risk stat cards — "negative sell" */}
        <div className="mx-auto grid max-w-sm grid-cols-1 gap-4 sm:max-w-none sm:grid-cols-3">
          {[
            { value: 10, suffix: "×", label: "Higher risk of type 2 diabetes with elevated visceral fat" },
            { value: 2, suffix: ".4×", label: "Cardiovascular event risk vs. subcutaneous fat at same BMI", prefix: "" },
            { value: 40, prefix: "~", suffix: "%", label: "Of U.S. adults have clinically elevated visceral fat — most undiagnosed" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
                <CountUpStat {...s} duration={900} color="text-red-600" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Targeted, not blanket                                          */
/* ------------------------------------------------------------------ */

function VFMechanismSection() {
  return (
    <section id="how-it-works" className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
              How It Works
            </span>
            <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              Targeted, not{" "}
              <span className="font-playfair italic text-[#6D6FFC]">blanket.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
              This protocol works upstream of fat metabolism — not on appetite. It signals your body to mobilize visceral fat specifically, while preserving lean muscle and subcutaneous fat balance.
            </p>
          </div>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {[
            {
              title: "Daily subcutaneous injection",
              desc: "One small injection per day, typically into the abdominal area. Painless, and most members say it's easier than they expected.",
              image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Restores GH-axis signaling",
              desc: "Activates your body's natural growth hormone-releasing pathway, which triggers fat-mobilizing enzymes specifically active around visceral tissue.",
              image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Visceral fat preferentially mobilized",
              desc: "Unlike GLP-1s (which reduce overall food intake) or general fat burners, this protocol preferentially targets visceral adipose — sparing lean muscle.",
              image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Waistline reduction by week 12",
              desc: "Most members see measurable waist circumference change by the end of the 12-week protocol, alongside improvements in metabolic markers (lipids, glucose).",
              image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-[75vw] shrink-0 snap-start snap-always sm:w-auto sm:shrink"
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
/*  7. Comparison table                                               */
/* ------------------------------------------------------------------ */

function VFComparisonSection() {
  const rows = [
    {
      label: "Targets visceral fat specifically",
      vf: { icon: "check", text: "Yes — primary mechanism" },
      glp: { icon: "partial", text: "Partial — overall fat" },
      diet: { icon: "none", text: "Slow & difficult" },
    },
    {
      label: "BMI requirement",
      vf: { icon: "none", text: "No BMI floor\nProvider judgment" },
      glp: { icon: "none", text: "BMI 30+ or 27+ w/ comorbidity" },
      diet: { icon: "none", text: "—" },
    },
    {
      label: "Appetite suppression",
      vf: { icon: "none", text: "No — eat normally" },
      glp: { icon: "warn", text: "Strong" },
      diet: { icon: "none", text: "—" },
    },
    {
      label: "Preserves lean muscle",
      vf: { icon: "check", text: "Yes" },
      glp: { icon: "partial", text: "Some loss reported" },
      diet: { icon: "partial", text: "Depends on protein/training" },
    },
    {
      label: "Time to visible change",
      vf: { icon: "none", text: "8–12 weeks" },
      glp: { icon: "none", text: "4–8 weeks" },
      diet: { icon: "none", text: "6+ months" },
    },
    {
      label: "Side effect profile",
      vf: { icon: "none", text: "Mild\nInjection site, mild fluid retention" },
      glp: { icon: "none", text: "Moderate\nGI, nausea, food aversion" },
      diet: { icon: "none", text: "None" },
    },
    {
      label: "Best for",
      vf: { icon: "none", text: "People with visceral fat resistant to lifestyle changes — at any BMI" },
      glp: { icon: "none", text: "People with BMI 30+, or 27+ with metabolic comorbidity" },
      diet: { icon: "none", text: "Foundational — pairs with both above" },
    },
    {
      label: "Money-back guarantee",
      vf: { icon: "check", text: "60 days" },
      glp: { icon: "check", text: "60 days (HealSend)" },
      diet: { icon: "none", text: "—" },
    },
  ];

  function Cell({ data, isVF = false }) {
    return (
      <td className={`px-4 py-4 text-center align-top text-sm ${isVF ? "bg-[#F1F0FF]/70 text-[#6D6FFC]" : "text-gray-600"}`}>
        <div className="flex flex-col items-center gap-1">
          {data.icon === "check" && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6D6FFC]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </span>
          )}
          {data.icon === "partial" && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B35]/20">
              <span className="text-[10px] font-bold text-[#FF6B35]">~</span>
            </span>
          )}
          {data.icon === "warn" && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B35]">
              <span className="text-xs font-bold text-white">!</span>
            </span>
          )}
          <span className={`whitespace-pre-line text-xs leading-snug ${isVF ? "font-semibold text-[#6D6FFC]" : data.icon === "warn" || data.icon === "partial" ? "text-[#FF6B35]" : ""}`}>
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
          <h2 className="mb-3 text-center font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Where this fits in the{" "}
            <span className="font-playfair italic text-[#6D6FFC]">metabolic stack.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-base text-gray-600 md:text-lg">
            Not every tool fits every person. Here&apos;s how Visceral Fat Therapy compares with GLP-1s and diet/exercise alone — so you can pick what&apos;s right for where you are.
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
                        Targets Visceral Fat
                      </span>
                      <span className="block rounded-lg bg-[#6D6FFC] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                        Visceral Fat Therapy
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">GLP-1s</th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Diet + Exercise</th>
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
                    <Cell data={row.vf} isVF />
                    <Cell data={row.glp} />
                    <Cell data={row.diet} />
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-center text-sm text-gray-500">
            Many members combine all three. Your clinician can help you sequence them.{" "}
            <Link href={CTA_HREF} className="font-medium text-[#6D6FFC] underline underline-offset-4">
              Talk to a clinician — it&apos;s free.
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Waistline over 12 weeks                                        */
/* ------------------------------------------------------------------ */

function VFWaistlineChart() {
  const points = [
    { label: "Day 0", val: 42.0 },
    { label: "Week 4", val: 41.4 },
    { label: "Week 8", val: 40.4 },
    { label: "Week 10", val: 39.8 },
    { label: "Week 12", val: 39.5 },
  ];
  const W = 400, H = 220, padL = 44, padR = 24, padT = 30, padB = 50;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const minV = 38.5, maxV = 42.5;
  const x = (i) => padL + (i / (points.length - 1)) * chartW;
  const y = (v) => padT + chartH - ((v - minV) / (maxV - minV)) * chartH;
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.val)}`).join(" ");
  const baselineY = y(42.0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D6FFC" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6D6FFC" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Y grid lines */}
      {[39, 40, 41, 42].map((v) => (
        <line key={v} x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {[39, 40, 41, 42].map((v) => (
        <text key={v} x={padL - 5} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{v}&quot;</text>
      ))}
      {/* Baseline dashed */}
      <line x1={padL} y1={baselineY} x2={W - padR} y2={baselineY} stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="5 3" />
      {/* Fill area */}
      <path d={`${linePath} L ${x(points.length - 1)} ${padT + chartH} L ${x(0)} ${padT + chartH} Z`} fill="url(#chartFill)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#6D6FFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.val)} r={i === points.length - 1 ? 5 : 3.5}
          fill={i === points.length - 1 ? "#FF6B35" : "#6D6FFC"} />
      ))}
      {/* X labels */}
      {points.map((p, i) => (
        <g key={i}>
          <text x={x(i)} y={H - padB + 14} textAnchor="middle" fontSize="10" fill="#6b7280">{p.label}</text>
          <text x={x(i)} y={H - padB + 26} textAnchor="middle" fontSize="10"
            fill={i === points.length - 1 ? "#FF6B35" : "#6b7280"} fontWeight={i === points.length - 1 ? "700" : "400"}>
            {p.val}&quot;
          </text>
        </g>
      ))}
      {/* Badge */}
      <rect x={x(points.length - 1) - 36} y={padT - 20} width="72" height="18" rx="9" fill="#FF6B35" />
      <text x={x(points.length - 1)} y={padT - 8} textAnchor="middle" fontSize="9" fill="white" fontWeight="700">−2.5&quot; − 18% VAT</text>
    </svg>
  );
}

function VFTimelineSection() {
  return (
    <section className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-3 text-center font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            What your waistline does{" "}
            <br className="hidden sm:block" />
            over{" "}
            <span className="font-playfair italic text-[#6D6FFC]">12 weeks.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-base text-gray-600">
            Average HealSend member waist circumference and visceral fat metric change over the first 12 weeks of the protocol.
          </p>
        </FadeIn>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Testimonial card */}
          <FadeIn>
            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Verified Member</span>
              </div>
              <div className="relative h-44 overflow-hidden bg-[#F1F0FF]">
                <Image
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
                  alt="Member result"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="mb-0.5 text-lg font-bold text-gray-900">Marcus T., 44</p>
                <p className="mb-4 text-sm text-gray-500">Started protocol after Wegovy stalled</p>
                <blockquote className="mb-5 rounded-xl border-l-4 border-[#6D6FFC] bg-gray-50 py-3 pl-4 pr-3 text-sm italic leading-relaxed text-gray-700">
                  &ldquo;Lost 28 pounds on Wegovy but the gut wouldn&apos;t go. Three months on this and I&apos;m down 2.5 inches in the waist. The mirror finally caught up with the scale.&rdquo;
                </blockquote>
                <div className="flex gap-6">
                  <div>
                    <p className="text-lg font-bold text-[#6D6FFC]">42→39.5&quot;</p>
                    <p className="text-xs text-gray-500">Waist circumference</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#FF6B35]">−18%</p>
                    <p className="text-xs text-gray-500">Visceral fat (DEXA)</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Chart card */}
          <FadeIn>
            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-7">
              <VFWaistlineChart />
              <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-6 rounded bg-[#6D6FFC]" /> Avg HealSend member waist (in)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-6 rounded border-t-2 border-dashed border-gray-400" /> Untreated baseline
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. What members notice                                            */
/* ------------------------------------------------------------------ */

function VFOutcomesSection() {
  return (
    <section className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-3 text-center font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            What members notice{" "}
            <span className="font-playfair italic text-[#6D6FFC]">over 12 weeks.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-base text-gray-600">
            Outcomes the clinical literature and our member data both support. Individual results vary — provider-prescribed when appropriate.
          </p>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {[
            {
              title: "Smaller waistline",
              desc: "Members average 1.5–2.5 inch waist circumference reduction by week 12, with continued change after.",
              image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Better metabolic markers",
              desc: "Designed to help improve fasting glucose, triglycerides, and insulin sensitivity over time.",
              image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Steadier energy",
              desc: "Less of the post-meal energy crash. More consistent focus throughout the day as inflammation drops.",
              image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Lean mass preserved",
              desc: "Unlike crash dieting or some GLP-1 protocols, this approach is designed to preserve lean muscle.",
              image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
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
                className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden bg-[#E8E3FF]">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="relative h-full w-full">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                  </motion.div>
                </div>
                <div className="p-5">
                  <h3 className="mb-1.5 text-base font-bold text-gray-900">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{card.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }} className="inline-block">
            <Link
              href={CTA_HREF}
              className="inline-flex items-center gap-2 rounded-full bg-[#6D6FFC] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#5a5ce8]"
            >
              Start consultation →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Pain points                                                   */
/* ------------------------------------------------------------------ */

const VF_PAIN_CARDS = [
  {
    title: "You lose weight everywhere except your stomach.",
    bullets: [
      "Arms, face, legs all leaned out. The belly stayed.",
      "The midsection is the last place to go — and the first to come back.",
    ],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    bg: "#F0E8FF",
  },
  {
    title: "Your labs are sliding even though you feel fine.",
    bullets: [
      "Fasting glucose creeping up. Triglycerides not where they were.",
      "The visceral fat is doing something — even silently.",
    ],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    bg: "#E8F0FF",
  },
  {
    title: "You're not heavy enough to qualify for a GLP-1.",
    bullets: [
      'BMI under 27. No diabetes diagnosis. No "official" reason for treatment.',
      "But the belly says otherwise — and your doctor shrugs.",
    ],
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
    bg: "#E8FFF0",
  },
  {
    title: "You tried a GLP-1. The face thinned. The belly didn't.",
    bullets: [
      "30 pounds lost. Same waist circumference.",
      "You need something that targets, not blanket-suppresses.",
    ],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    bg: "#FFF8E8",
  },
];

function VFPainPointsSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            Sound familiar?
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          The belly that{" "}
          <span className="font-playfair italic text-[#6D6FFC]">won&apos;t quit.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          If you&apos;ve done the work — the diet, the gym, the discipline — and the abdominal fat still won&apos;t move, it&apos;s not a willpower issue. It&apos;s a hormonal one.
        </p>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {VF_PAIN_CARDS.map((card) => (
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
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#e55a26]"
          >
            See if this protocol fits →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. 60-day promise                                                */
/* ------------------------------------------------------------------ */

function VFPromiseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0d0d1a] py-20 md:py-28">
      {/* Animated radial glow — pulses when in view */}
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
        {/* Secondary glow ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6D6FFC]/10"
          animate={inView ? { scale: [1, 1.6], opacity: [0.4, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", repeatDelay: 1 }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[800px] px-4 text-center md:px-8">
        {/* Animated number with scale + blur reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, filter: "blur(16px)" }}
          animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <span className="font-title text-8xl font-black tracking-tight text-white md:text-9xl">
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

        {/* Animated divider — expands from center with glow */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto my-8 origin-center"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#6D6FFC] to-transparent" />
          <div className="absolute inset-0 h-px w-24 bg-gradient-to-r from-transparent via-[#6D6FFC] to-transparent blur-sm" />
        </motion.div>

        {/* Headline — slides up */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 font-title text-2xl font-bold leading-snug text-white md:text-3xl"
        >
          No change by week 12?{" "}
          <span className="font-playfair italic text-[#6D6FFC]">First month free.</span>
        </motion.h2>

        {/* Subtext — fades in */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mb-8 text-sm text-white/40"
        >
          No fine print. No retention scripts.
        </motion.p>

        {/* CTA — scales up with glow */}
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
/*  12. Research                                                      */
/* ------------------------------------------------------------------ */

const VF_CITATIONS = [
  { author: "Falutz et al. (2007):", desc: "26-week phase III trial — 15.4% reduction in VAT vs. placebo. Published in NEJM." },
  { author: "Stanley et al. (2014):", desc: "12-month follow-up — sustained VAT reduction with continued use, improvements in lipid profile." },
  { author: "Adrian et al. (2018):", desc: "Off-label use in non-HIV adults showed similar VAT reduction patterns with comparable safety." },
  { author: "Stanley et al. (2019):", desc: "Liver fat reduction confirmed via MRI in patients with metabolic syndrome." },
];

function VFResearchSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 font-title text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl"
            >
              The most studied peptide{" "}
              <br />
              for{" "}
              <span className="font-playfair italic text-[#6D6FFC]">visceral fat reduction.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 text-base leading-relaxed text-gray-600"
            >
              Unlike most peptides being marketed today, the compound used in this protocol is FDA-approved (for HIV-associated lipodystrophy) with multiple large randomized trials specifically measuring visceral fat reduction in adults.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {VF_CITATIONS.map((c, i) => (
                <motion.div
                  key={c.author}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col gap-0.5 px-6 py-4 sm:grid sm:grid-cols-[auto_1fr] sm:gap-4 ${i < VF_CITATIONS.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <span className="text-sm font-bold text-gray-900 sm:whitespace-nowrap">{c.author}</span>
                  <span className="text-sm leading-relaxed text-gray-600">{c.desc}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Reviewed by HealSend Clinical Team</p>
              <div className="flex items-center gap-3">
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
                  <p className="text-xs text-gray-500">Board-certified metabolic medicine &amp; endocrinology</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — featured study */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm md:p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B35]">Featured Study</p>
              <h3 className="mb-4 text-xl font-bold leading-snug text-gray-900">
                &ldquo;GHRH Analog Effects on Visceral Adipose Tissue: NEJM Phase III Trial&rdquo;
              </h3>
              <blockquote className="mb-6 rounded-xl border-l-4 border-[#6D6FFC] bg-[#F5F4FF] py-3 pl-4 pr-3 text-sm italic leading-relaxed text-gray-600">
                Falutz J, Allas S, Blot K, et al. New England Journal of Medicine. N=412 adults, 26-week double-blind randomized placebo-controlled trial.
              </blockquote>
              <div className="mb-6 grid grid-cols-3 gap-4 text-center">
                {[
                  { val: "−15.4%", label: "visceral adipose (vs. placebo)" },
                  { val: '−2.0"', label: "avg waist circumference" },
                  { val: "−50", label: "mg/dL avg triglyceride drop" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-xl font-bold text-[#6D6FFC]">{s.val}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Link
                  href={CTA_HREF}
                  className="flex w-full items-center justify-center rounded-full bg-[#6D6FFC] py-3.5 text-sm font-semibold text-white transition hover:bg-[#5a5ce8]"
                >
                  View full study →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  13. Steps                                                         */
/* ------------------------------------------------------------------ */

function VFStepsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="mb-3 text-center font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            From intake to protocol{" "}
            <span className="font-playfair italic text-[#6D6FFC]">in one week.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-base text-gray-600">
            Online intake. Provider review. Medication shipped. No clinic visits, no referrals.
          </p>
        </motion.div>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:p-0">
          {[
            {
              step: "STEP 1",
              title: "Online intake",
              desc: "90-second medical assessment with metabolic and waist circumference questions. Baseline labs ordered.",
              image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
            },
            {
              step: "STEP 2",
              title: "Provider review",
              desc: "A licensed clinician confirms appropriateness based on labs and metabolic profile, then designs your protocol.",
              image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
            },
            {
              step: "STEP 3",
              title: "Medication shipped",
              desc: "Discreet packaging, free shipping, all supplies included, video walkthrough for first dose.",
              image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
            },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: -50, scale: 0.85 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -50, scale: 0.85 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
                delay: 0.15 + i * 0.18,
              }}
              className="relative flex w-[75vw] shrink-0 snap-start snap-always md:w-auto md:shrink"
            >
              {/* ripple ring on drop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: [0, 0.35, 0], scale: [0.6, 1.25, 1.5] } : { opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.8, delay: 0.35 + i * 0.18, ease: "easeOut" }}
                className="pointer-events-none absolute -inset-3 rounded-3xl border-2 border-[#6D6FFC]/30"
              />
              <motion.div whileHover={{ y: -6 }} className="h-full w-full transition-shadow hover:shadow-lg">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="relative h-44 overflow-hidden bg-[#E8E3FF]">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="relative h-full w-full">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        sizes="(max-width: 768px) 80vw, 33vw"
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="absolute left-4 top-4 inline-block rounded-full bg-gray-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {s.step}
                    </span>
                  </div>
                  <div className="flex-1 p-6">
                    <h3 className="mb-2 text-base font-bold text-gray-900">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{s.desc}</p>
                  </div>
                </div>
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
/*  14. Upgrade banner                                                */
/* ------------------------------------------------------------------ */

function VFUpgradeBanner() {
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
            <h3 className="mb-1.5 text-xl font-bold text-white">Higher BMI? GLP-1s might fit better.</h3>
            <p className="max-w-xl text-sm leading-relaxed text-white/70">
              If your BMI is 30+ or 27+ with a comorbidity, semaglutide or tirzepatide may be a stronger starting point. We offer both — a clinician will help you find the right fit.
            </p>
          </div>
          <Link
            href="/weight-loss"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#e55a26]"
          >
            See GLP-1 Options →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  15. FAQ (two-column)                                              */
/* ------------------------------------------------------------------ */

const VF_FAQS = [
  {
    question: "How does this differ from Wegovy or Zepbound?",
    answer: "Wegovy and Zepbound are GLP-1 agonists — they work by suppressing appetite and slowing gastric emptying, reducing total body weight. This protocol uses a GHRH analog (tesamorelin) that stimulates GH release to specifically mobilize visceral adipose tissue. The mechanisms, targets, and side effect profiles are completely different.",
  },
  {
    question: "What's actually prescribed?",
    answer: "Tesamorelin — a GHRH (growth hormone-releasing hormone) analog, FDA-approved for HIV-associated lipodystrophy and used off-label for visceral adiposity. Compounded by a U.S.-licensed pharmacy and dispensed as a daily subcutaneous injection.",
  },
  {
    question: "I don't qualify for a GLP-1. Will I qualify for this?",
    answer: "Potentially yes. This protocol doesn't require a BMI threshold. Qualifying criteria focus on evidence of visceral adiposity (waist circumference, waist-to-hip ratio, metabolic markers) and the absence of contraindications to GHRH therapy. A clinician makes the final determination after reviewing your labs.",
  },
  {
    question: "I already lost weight on a GLP-1 but still have the belly. Will this work?",
    answer: "Yes — this is one of the most common presentations we see. GLP-1s are effective for total weight loss but clinical literature consistently shows visceral fat is disproportionately retained. Tesamorelin specifically addresses the depot that GLP-1s leave behind.",
  },
  {
    question: "How fast will I see results?",
    answer: "Belt-notch changes typically begin around weeks 3–5. Clinician-measurable waist circumference reduction is usually seen by week 8. The largest reductions happen between weeks 8 and 12 as the protocol reaches steady-state GH levels.",
  },
  {
    question: "What about side effects?",
    answer: "The most commonly reported effects are mild injection-site reactions and temporary water retention in the first 2 weeks as GH levels normalize. Tesamorelin has a long safety record from HIV-associated lipodystrophy clinical trials spanning over a decade.",
  },
  {
    question: "Is this legal & safe?",
    answer: "Yes. Tesamorelin is FDA-approved and legally dispensed as a compounded prescription medication for off-label use in non-HIV visceral adiposity. A HealSend-affiliated clinician must prescribe it — that review is part of the process.",
  },
  {
    question: "Can I combine this with a GLP-1?",
    answer: "In some cases yes. Some members are on both protocols simultaneously under clinician supervision. The mechanisms are complementary — GLP-1 for total body weight, tesamorelin for visceral-specific reduction.",
  },
  {
    question: "Do I need a baseline lab panel?",
    answer: "Yes. We order a baseline panel before your first dose — including fasting glucose, IGF-1, and a metabolic panel. It's included in your protocol cost. Your clinician uses your actual numbers to set the right starting dose and schedule your 8-week recheck.",
  },
  {
    question: "How does the 60-day money-back guarantee work?",
    answer: "If your clinician-measured waist circumference hasn't decreased by week 12, we refund your first month in full. No retention calls, no fine print. Measurement is done by your HealSend clinician at week 4 and week 12 as part of the standard protocol.",
  },
];

function VFFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:!pb-10 md:!pt-20 md:mt-0 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-balance font-title text-4xl font-medium text-slate-900 md:text-5xl">
          Visceral fat questions.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Honest answers.</span>
        </h2>
        <p className="mb-16 max-w-lg text-start text-sm text-gray-600">
          Everything we get asked about this protocol. If your question isn&apos;t here, message a clinician before you commit.
        </p>
        <div className="flex flex-col gap-4">
          {VF_FAQS.map((faq, idx) => {
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
/*  16. Closing CTA                                                   */
/* ------------------------------------------------------------------ */

function VFClosingCTA() {
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
          Target the fat that actually matters.
          <br />
          <span className="font-playfair italic text-[#FF6B35]">Start today.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-base leading-relaxed text-white/75 md:text-lg"
        >
          A clinician reviews your metabolic labs and builds a protocol around your actual visceral fat burden. No guesswork. 60-day money-back guarantee. Results in 12 weeks or your first month is free.
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
            Start consultation →
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

export default function VisceralFatTherapyLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <VFWillpowerSection />
      <VFProductHeroSection />
      <MediaLogosBanner />
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="Visceral Fat Therapy Benefits" />
      <VFPainPointsSection />
      <VFAudienceSection />
      <VFVisceralFatSection />
      <VFMechanismSection />
      {/* VFComparisonSection removed per client request */}
      <VFTimelineSection />
      <VFOutcomesSection />
      <MemberResultsStatsSection />
      <VFPromiseSection />
      <VFResearchSection />
      <SimpleSteps productData={productData} />
      <VFUpgradeBanner />
      <CleanSimpleEffective productData={null} />
      <LabTested productData={null} />
      <MarketingTrustMarquee items={VF_TRUST_ITEMS} edgeToEdge={false} />
      <SameMedicationSection planLabel="Personalized, clinically-proven visceral fat plans" />
      <VFFAQSection />
      <SupportAvailabilitySection />
      <VFClosingCTA />
      <MarketingFooter />
      <MobileStickyCta ctaHref={CTA_HREF} />
    </div>
  );
}
