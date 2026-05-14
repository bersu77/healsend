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

const CTA_HREF = "/funnels/recovery";

const RECOVERY_TRUST_ITEMS = [
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "Clinician-Guided Recovery Protocol", Icon: Stethoscope },
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

function RecoveryHeroSection() {
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
                Heal what{" "}
                <span className="font-playfair italic text-[#6D6FFC]">didn&apos;t.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-700 lg:text-[1.05rem]"
              >
                A clinically guided protocol designed to accelerate tissue repair,
                reduce inflammation, and support joint, tendon, and gut healing —
                at the cellular level. For the injuries that won&apos;t quite go away.
              </motion.p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              {[
                { icon: ClipboardCheck, bold: "Two healing protocols", rest: "— choose targeted single-compound or full multi-compound stack" },
                { icon: Target, bold: "Supports joint, tendon, gut & soft-tissue repair", rest: "— designed to work where rest alone won't" },
                { icon: Stethoscope, bold: "Provider-prescribed when appropriate", rest: "— every protocol clinician-reviewed" },
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
                    See the protocols
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

const RECOVERY_HERO_BENEFITS = [
  {
    icon: Target,
    text: "Two protocols: Targeted Recovery ($179/mo) or Full Regenerative Stack ($299/mo).",
  },
  {
    icon: Stethoscope,
    text: "Board-certified clinician review + protocol selection included.",
  },
  {
    icon: BadgeCheck,
    text: "Month-to-month · cancel anytime · FSA & HSA accepted.",
  },
];

const RECOVERY_HERO_FAQS = [
  {
    question: "What's prescribed in each protocol?",
    answer:
      "Targeted Recovery is a single-compound protocol (BPC-157) for focused tissue repair. The Full Regenerative Stack combines BPC-157, TB-500, KPV, and GHK-Cu — four compounds working via different but complementary healing pathways.",
  },
  {
    question: "Should I start Targeted or Full Stack?",
    answer:
      "Targeted is ideal for one specific area — a single chronic injury, isolated tendon issue, or focused gut healing. Full Stack is for multi-area injuries, chronic systemic inflammation, post-surgical recovery, or stubborn injuries that haven't responded to single-compound therapy.",
  },
  {
    question: "How quickly will I notice changes?",
    answer:
      "Most members notice subtle inflammation reduction within 2 weeks, pain and stiffness changes by week 3–4, and meaningful functional improvement by week 6–8. Full benefits typically stabilize around 90 days.",
  },
];

function RecoveryProductHeroSection() {
  const [activeTab, setActiveTab] = useState("benefits");
  const [openFaq, setOpenFaq] = useState(null);
  const [showPriceFootnote, setShowPriceFootnote] = useState(false);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: false, margin: "-80px" });

  return (
    <section ref={sectionRef} className="bg-[#f9f9f9] px-4 py-6 md:px-[3.25rem] md:py-10 lg:px-[3.25rem]">
      <div className="mx-auto flex max-w-[1340px] flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6 xl:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[55%] lg:max-w-[740px]"
        >
          <div className="flex flex-col gap-6 sm:gap-7 md:gap-10 lg:isolate lg:sticky lg:top-24 lg:z-10">
            <div className="relative z-[1] shrink-0 bg-[#f9f9f9] pb-1">
              <h2 className="text-balance text-start text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-5xl md:leading-tight">
                Recovery &amp; Repair Therapy
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Two protocols · Daily subcutaneous · Clinician-guided
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
                  alt="Recovery & Repair Therapy — in stock"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="rounded-[1rem] object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[45%] xl:w-[450px]"
        >
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
                    Full Regenerative Stack from $299/mo
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
                  Targeted Recovery starts at $179/mo. Full Regenerative Stack (4-compound) is $299/mo. Cancel anytime.
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
                    RECOVERY_HERO_BENEFITS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex gap-3">
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                          <p className="text-[0.938rem] leading-relaxed text-gray-700 md:text-base">{item.text}</p>
                        </div>
                      );
                    })}
                  {activeTab === "pricing" && (
                    <PricingPlansTable footnote="Includes clinician review and protocol selection. Cancel anytime." />
                  )}
                  {activeTab === "description" && (
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      Targeted Recovery uses a single-compound protocol for focused tissue repair. The Full Regenerative Stack combines four healing compounds (BPC-157, TB-500, KPV, GHK-Cu) working via different but complementary pathways for systemic repair when single-compound therapy isn&apos;t enough.
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[1rem] border border-gray-200 bg-white shadow-sm"
          >
            <div className="border-b border-gray-100 px-6 py-4 md:px-7">
              <p className="text-sm font-semibold text-gray-900">Quick answers</p>
            </div>
            {RECOVERY_HERO_FAQS.map((faq, idx) => (
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
            <h3 className="mb-4 text-base font-medium text-gray-900">Related Products</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "gh-optimization", name: "GH Optimization", image: "/images/marketing/bundle/tirzepatide-injections-product.png" },
                { id: "healing-peptide-therapy", name: "Healing Peptide Therapy", image: "/images/marketing/semaglutide.webp" },
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
/*  3. Audience / Who It's For                                         */
/* ------------------------------------------------------------------ */

function RecoveryAudienceSection() {
  return (
    <section className="bg-[#0d0d1a] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <h2 className="mb-4 text-center font-title text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            The injuries{" "}
            <span className="font-playfair italic text-[#FF6B35]">rest didn&apos;t fix.</span>
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-base text-white/70 md:text-lg">
            Some things heal on their own. Some things stop healing and just become &ldquo;the thing you live with.&rdquo;
            That second category is what this protocol is for.
          </p>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:p-0 lg:grid-cols-4">
          {[
            {
              tag: "CHRONIC INJURY",
              title: "An injury that won't fully go away.",
              body: "Months of PT, rest, ice. Still flares up. You've started avoiding the movements that aggravate it.",
            },
            {
              tag: "SLOW RECOVERY",
              title: "One hard workout costs you three days.",
              body: "Recovery used to take a day. Now it takes a week. You're training less because the bounce-back doesn't bounce.",
            },
            {
              tag: "GUT ISSUES",
              title: "Chronic gut issues that never fully resolve.",
              body: "Elimination diets. Probiotics. The whole thing. Some days are great. Then a flare-up out of nowhere.",
            },
            {
              tag: "POST-SURGERY",
              title: "Recovering from surgery.",
              body: "The official recovery timeline feels conservative. You want everything that helps without compromising healing.",
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
/*  4. How It Works / Mechanism                                        */
/* ------------------------------------------------------------------ */

function RecoveryMechanismSection() {
  return (
    <section id="how-it-works" className="bg-[#F1F0FF] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
              How Healing Accelerates
            </span>
            <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              Your body knows how to heal.{" "}
              <span className="font-playfair italic text-[#6D6FFC]">This signals it to do it faster.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
              These compounds work upstream of your natural repair machinery — amplifying the same healing
              pathways your body already uses. The Full Stack hits four of those pathways simultaneously.
            </p>
          </div>
        </FadeIn>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {[
            {
              title: "Daily injection",
              desc: "Small subcutaneous dose, typically into the abdominal area. Easy, painless, takes seconds.",
              image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Healing pathways activate",
              desc: "Compounds signal fibroblast activity, angiogenesis, and tissue-repair — accelerating natural healing at the cellular level.",
              image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Inflammation drops",
              desc: "Inflammatory markers reduce while reparative cell activity increases. The Full Stack hits this from four angles instead of one.",
              image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Visible recovery by week 6",
              desc: "Pain reduction, increased range of motion, faster training recovery — typically noticeable within 4–6 weeks.",
              image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
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
                    <Image src={card.image} alt={card.title} fill sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
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
/*  5. Pain Points                                                     */
/* ------------------------------------------------------------------ */

function RecoveryPainPointsSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            Sound familiar?
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          What this protocol may{" "}
          <span className="font-playfair italic text-[#6D6FFC]">support &amp; help with.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          Outcomes the literature and our member data both support. Individual results vary —
          provider-prescribed when appropriate.
        </p>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 pr-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-4">
          {[
            {
              title: "Joint & tendon repair",
              bullets: [
                "Designed to help support tendon, ligament, and joint capsule healing.",
                "Particularly effective for chronic strain injuries.",
              ],
              image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Inflammation reduction",
              bullets: [
                "May support broader anti-inflammatory effect.",
                "The Full Stack works across multiple inflammatory pathways simultaneously.",
              ],
              image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Gut & soft-tissue healing",
              bullets: [
                "Designed to help support gut lining repair and soft-tissue regeneration.",
                "Useful for chronic gut issues or post-surgical recovery.",
              ],
              image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Faster training recovery",
              bullets: [
                "Shorter recovery between hard sessions.",
                "Reduced post-workout soreness over consistent use.",
              ],
              image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="w-[72vw] shrink-0 snap-start sm:w-auto sm:shrink flex flex-col overflow-hidden rounded-[1.5rem] border border-[#ebebeb] bg-white shadow-sm"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#f5f5f5]">
                <Image src={card.image} alt={card.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
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
            See which protocol fits →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. 60-day Promise                                                  */
/* ------------------------------------------------------------------ */

function RecoveryPromiseSection() {
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
          No meaningful change by week 6?{" "}
          <span className="font-playfair italic text-[#6D6FFC]">First month free.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mb-8 text-sm text-white/40"
        >
          No fine print. No retention scripts. Email us and it&apos;s done.
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
/*  7. Upgrade Banner                                                  */
/* ------------------------------------------------------------------ */

function RecoveryUpgradeBanner() {
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
            <h3 className="mb-1.5 text-xl font-bold text-white">Healing faster? Stack with GH Optimization.</h3>
            <p className="max-w-xl text-sm leading-relaxed text-white/70">
              Many recovery members add Advanced GH Optimization for systemic recovery support — deeper sleep,
              faster training bounce-back, and broader tissue regeneration.
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
/*  8. FAQ                                                             */
/* ------------------------------------------------------------------ */

const RECOVERY_FAQS = [
  {
    question: "How does the 60-day money-back guarantee work?",
    answer: "Start your protocol. If by week 6 you don't notice meaningful change in pain, stiffness, range of motion, or recovery time, email us and we'll refund your first month. No phone calls, no retention pressure, no fine print.",
  },
  {
    question: "What's actually prescribed in each protocol?",
    answer: "Targeted Recovery is a single-compound protocol most commonly prescribed as BPC-157 — one of the most studied body-protection compounds for tendon, ligament, and gut repair. The Full Regenerative Stack combines BPC-157 with TB-500 (broader anti-inflammatory and tissue repair), KPV (potent anti-inflammatory peptide fragment), and GHK-Cu (collagen synthesis and connective tissue density). All compounds are prescribed off-label when appropriate by a licensed U.S. clinician.",
  },
  {
    question: "Should I start with Targeted or the Full Stack?",
    answer: "Targeted Recovery is ideal if you have one specific area of concern — a single chronic injury, an isolated tendon issue, or focused gut healing. The Full Regenerative Stack is for members with multi-area injuries, chronic systemic inflammation, post-surgical recovery, or stubborn injuries that haven't responded to single-compound therapy. Your clinician will recommend based on your situation.",
  },
  {
    question: "How quickly will I notice changes?",
    answer: "Most members notice subtle inflammation reduction within 2 weeks, pain and stiffness changes by week 3–4, and meaningful functional improvement (range of motion, recovery time) by week 6–8. Full benefits typically stabilize around 90 days.",
  },
  {
    question: "Is the Full Stack just 'more' of the same?",
    answer: "No — it works through four distinct healing mechanisms. BPC-157 supports tissue repair via angiogenesis and growth factor signaling. TB-500 acts on a different cellular repair pathway and offers broader anti-inflammatory effect. KPV hits inflammation through yet another mechanism. GHK-Cu supports collagen synthesis and connective tissue density. The result is healing that's not just stronger but more multi-dimensional.",
  },
  {
    question: "What about side effects?",
    answer: "Side effects are uncommon and typically mild. Most commonly: injection-site reactions (redness, mild bruising), occasional transient fatigue in the first week as inflammation recalibrates. Your clinician monitors via check-ins and adjusts dose as needed.",
  },
  {
    question: "Is this legal?",
    answer: "The compounds in these protocols are prescribed off-label by licensed clinicians for tissue repair and inflammation reduction — a regulated, common practice. Your medication ships from a state-licensed 503B compounding pharmacy.",
  },
  {
    question: "Can I combine this with PT or other recovery?",
    answer: "Yes — and many members do. The protocol works at the cellular level; physical therapy, mobility work, and conventional recovery practices all complement it. Your clinician can help integrate it with your existing recovery plan.",
  },
  {
    question: "Can I switch between Targeted and Full Stack?",
    answer: "Yes. Many members start with Targeted Recovery for an isolated issue, then upgrade to the Full Stack if they want broader systemic effect or have additional areas of concern. Your clinician adjusts your protocol — you only pay the new tier's monthly price.",
  },
  {
    question: "Do you accept insurance?",
    answer: "HealSend operates as a cash-pay telehealth service. Every plan is FSA and HSA eligible, and we provide itemized receipts for any reimbursement claims.",
  },
];

function RecoveryFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:!pb-10 md:!pt-20 md:mt-0 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-balance font-title text-4xl font-medium text-slate-900 md:text-5xl">
          Recovery questions.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Answered.</span>
        </h2>
        <p className="mb-16 max-w-lg text-start text-sm text-gray-600">
          Everything we get asked about Targeted Recovery and the Full Regenerative Stack.
          Want a real answer? Message a clinician for free.
        </p>
        <div className="flex flex-col gap-4">
          {RECOVERY_FAQS.map((faq, idx) => {
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
/*  9. Closing CTA                                                     */
/* ------------------------------------------------------------------ */

function RecoveryClosingCTA() {
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
          Get back to{" "}
          <span className="font-playfair italic text-[#FF6B35]">moving heavy.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-base leading-relaxed text-white/75 md:text-lg"
        >
          A clinician reviews your injury history and builds a recovery protocol around your actual healing needs.
          60-day money-back guarantee. Results in 6 weeks or your first month is free.
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

export default function RecoveryLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <RecoveryHeroSection />
      <RecoveryProductHeroSection />
      <MediaLogosBanner />
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="Recovery & Repair Benefits" />
      <RecoveryPainPointsSection />
      <RecoveryAudienceSection />
      <RecoveryMechanismSection />
      <MemberResultsStatsSection />
      <RecoveryPromiseSection />
      <SimpleSteps productData={productData} />
      <RecoveryUpgradeBanner />
      <CleanSimpleEffective productData={null} />
      <LabTested productData={null} />
      <MarketingTrustMarquee items={RECOVERY_TRUST_ITEMS} edgeToEdge={false} />
      <SameMedicationSection planLabel="Clinician-guided recovery & repair protocols" />
      <RecoveryFAQSection />
      <SupportAvailabilitySection />
      <RecoveryClosingCTA />
      <MarketingFooter />
      <MobileStickyCta ctaHref={CTA_HREF} />
    </div>
  );
}
