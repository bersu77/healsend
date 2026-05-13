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
  Truck,
  Zap,
  Shield,
  Activity,
  RotateCcw,
  Flame,
  Bone,
  Heart,
  Sparkles,
  Circle,
  ChevronRight,
  Clock,
  Star,
  Play,
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
  MediaLogosBanner,
  RestoredTirzepatideBenefitsCarouselSection,
  mergeProductContent,
  SimpleSteps,
  PricingPlansTable,
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/healing-peptide-therapy";

const HP_TRUST_ITEMS = [
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "Clinician-Prescribed Healing Protocols", Icon: Stethoscope },
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

function CountUpStat({ value, prefix = "", suffix = "", label, duration = 1000 }) {
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
      <p className="font-title text-5xl font-bold text-[#6D6FFC] md:text-6xl">
        {prefix}{count}{suffix}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Hero / Willpower                                                */
/* ------------------------------------------------------------------ */

const HP_HERO_FAQS = [
  { question: "What peptides are prescribed?", answer: "Your clinician selects from healing peptides that target tissue repair, inflammation modulation, and cellular regeneration — dosed to your specific case. Compound names appear on your prescription label and in our FAQ." },
  { question: "How is this different from cortisone?", answer: "Cortisone suppresses inflammation temporarily. Healing peptides restore the body's actual repair signaling — targeting the cause at the cellular level, not just masking symptoms." },
  { question: "Do I need to be an athlete?", answer: "No. This protocol is for anyone dealing with lingering pain, slow recovery, or tissue that isn't healing — whether from age, overuse, surgery, or injury." },
];

function HPWillpowerSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1F5F9]">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-10 md:px-[3.25rem] md:py-14 lg:h-[calc(100dvh-60px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Healing Peptide Therapy · Prescribed
              </span>
            </motion.div>
            <div className="mt-5 max-w-[34rem]">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-balance font-title text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl"
              >
                The repair signal your body{" "}
                <span className="font-playfair italic text-[#6D6FFC]">stopped sending</span>.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 max-w-[30rem] text-lg leading-relaxed text-gray-600"
              >
                Pain that lingers. Tendons that won&apos;t heal. Workouts you can&apos;t recover from. They share a cause — weak repair signaling — and now, a clinical solution prescribed by a US-licensed physician.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href={CTA_HREF}
                    className="inline-flex items-center gap-2 rounded-full bg-[#6D6FFC] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#5a5ce8]"
                  >
                    Find my protocol <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                  >
                    How it works
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500"
              >
                {["US-licensed clinicians", "503A & 503B FDA-inspected", "Ships in 48 hrs"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 lg:static lg:translate-y-0 lg:flex-1">
          <WillpowerVerticalColumn items={WILLPOWER_LEFT_MARQUEE_ITEMS} />
        </div>
        <div className="block lg:hidden w-full mt-6">
          <WillpowerHorizontalRow items={WILLPOWER_LEFT_MARQUEE_ITEMS} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Product Hero                                                    */
/* ------------------------------------------------------------------ */

function HPProductHeroSection() {
  const [activeTab, setActiveTab] = useState("benefits");
  const [openFaq, setOpenFaq] = useState(null);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: false, margin: "-80px" });

  return (
    <section ref={sectionRef} className="bg-[#F1F5F9] pb-10 md:pb-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 md:px-8 lg:flex-row lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[1rem] border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex border-b border-gray-100">
                {["benefits", "pricing", "description"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 border-b-2 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider transition ${activeTab === tab ? "border-[#6D6FFC] text-[#6D6FFC]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 md:p-6"
                >
                  {activeTab === "benefits" && (
                    <ul className="space-y-3">
                      {[
                        "Targets tissue repair at the cellular level",
                        "Clinician-prescribed, dosed to your case",
                        "First effects typically in 7–14 days",
                        "90-day performance guarantee",
                        "Free clinician messaging for protocol duration",
                      ].map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === "pricing" && (
                    <PricingPlansTable footnote="Includes clinician review, labs, and supplies. Cancel anytime." />
                  )}
                  {activeTab === "description" && (
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      Healing peptide therapy restores weakened repair signaling — targeting tissue repair, inflammation modulation, and cellular regeneration at clinical doses. Prescribed by a US-licensed physician and shipped from 503A/503B FDA-inspected pharmacies.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[1rem] border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-100 px-6 py-4 md:px-7">
                <p className="text-sm font-semibold text-gray-900">Quick answers</p>
              </div>
              {HP_HERO_FAQS.map((faq, idx) => (
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
                      {openFaq === idx ? <Minus className="h-3 w-3 text-gray-600" strokeWidth={2.5} /> : <Plus className="h-3 w-3 text-gray-600" strokeWidth={2.5} />}
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
                  *Price shown applies to the Complete protocol. Actual price will depend on plan prescribed.
                  Final treatment fit depends on clinician review.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[420px] lg:shrink-0"
        >
          <div className="sticky top-24 rounded-2xl border border-[#6D6FFC]/20 bg-white p-7 shadow-lg shadow-[#6D6FFC]/5 md:p-8">
            <span className="mb-4 inline-block rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
              ★ Most Chosen · 64%
            </span>
            <h3 className="mb-2 font-title text-2xl font-bold text-gray-900">
              Repair Signal · <span className="font-playfair italic">Complete</span>
            </h3>
            <p className="mb-5 text-sm text-gray-500">Full repair protocol — for systemic healing, multi-area issues, or accelerated recovery.</p>
            <ul className="mb-6 space-y-4">
              {[
                { bold: "4-peptide healing stack", rest: "targeting tissue, joint, and inflammation pathways" },
                { bold: "First effects in 7–14 days", rest: ", full benefit by week 6–8" },
                { bold: "Clinician-prescribed", rest: ", dosed to your case" },
                { bold: "Free clinician access", rest: "for the duration of your protocol" },
              ].map((item) => (
                <li key={item.bold} className="flex items-start gap-3 text-sm text-gray-700">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span><strong>{item.bold}</strong> {item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-end gap-3">
              <p className="font-title text-4xl font-bold text-gray-900">$249<span className="text-base font-normal text-gray-500">/mo</span></p>
              <p className="mb-1 text-lg text-[#6D6FFC] line-through">$329</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Who It's For — Tabbed conditions                                */
/* ------------------------------------------------------------------ */

const CONDITIONS = [
  {
    id: "joint",
    label: "Joint pain",
    icon: Bone,
    color: "#6D6FFC",
    title: "Joint pain that doesn’t go away.",
    whatHappening: "The cartilage and synovial tissue inside your joint depend on continuous repair signaling. When that signal weakens — from age, overuse, or injury — micro-damage accumulates faster than it heals. The result is the dull, persistent pain that flares with use and won’t quit with rest.",
    howHelps: "Healing peptide therapy targets the repair shortfall directly. Members report reduced joint pain, improved range of motion, and the kind of progress that compounds week-over-week — not the day-by-day plateau of NSAIDs.",
    testimonial: { quote: "Two years of knee pain. Six weeks on the Recovery Stack and I’m back to running 4 miles, pain-free.", name: "James L., 47", detail: "Bilateral knee pain · Recovery Stack · 6 weeks" },
  },
  {
    id: "tendon",
    label: "Tendons & ligaments",
    icon: Activity,
    color: "#6D6FFC",
    title: "Tendons that won’t finish healing.",
    whatHappening: "Tendons and ligaments have poor blood supply and depend heavily on local peptide signaling to recruit repair cells. When that signal fades — from repetitive stress, age, or prior injury — partial tears linger, tendinopathy becomes chronic, and \"rest\" never quite finishes the job.",
    howHelps: "Healing peptides amplify the signal your body needs to complete the repair cycle. Members report meaningful improvement in tendon pain and function, often within the first 3–4 weeks.",
    testimonial: { quote: "My Achilles tendinitis lasted 18 months. I tried PT, ice, rest, NSAIDs — everything. Within a month on the Foundation, I was running again.", name: "Priya S., 36", detail: "Achilles · Foundation · 4 weeks" },
  },
  {
    id: "soft",
    label: "Soft tissue",
    icon: Heart,
    color: "#6D6FFC",
    title: "Soft tissue injuries that stall out.",
    whatHappening: "Muscle strains, fascial tears, and ligament sprains follow the same repair pathway — and when repair signaling weakens, healing plateaus. The injury feels \"80% better\" for months without ever reaching resolution.",
    howHelps: "Healing peptide therapy targets the cellular machinery that rebuilds damaged tissue. Members report faster return to training and fewer re-injuries — because the tissue is structurally repaired, not just feeling less inflamed.",
    testimonial: { quote: "Hamstring tear in January. Still couldn’t sprint by June. Four weeks on the protocol and I’m back to full training.", name: "David K., 33", detail: "Hamstring · Complete · 4 weeks" },
  },
  {
    id: "surgical",
    label: "Post-surgical",
    icon: Shield,
    color: "#8B8D99",
    title: "Post-surgical recovery that drags.",
    whatHappening: "Surgery fixes the structural problem — but your body still has to heal the wound. That process depends on repair signaling. When the signal is weak (age, prior injury load, metabolic factors), recovery timelines stretch and scar tissue forms poorly.",
    howHelps: "Healing peptides support the repair cascade your body runs after surgery. Members report faster incision healing, less post-op stiffness, and earlier return to function — complementing, not replacing, their surgical care.",
    testimonial: { quote: "ACL reconstruction in March. My surgeon said 9 months minimum. I was cleared at 6.", name: "Sarah M., 29", detail: "ACL repair · Complete · 6 months" },
  },
  {
    id: "recovery",
    label: "Slow recovery",
    icon: Zap,
    color: "#FF6B35",
    title: "Recovery that used to take days now takes weeks.",
    whatHappening: "At 25, a hard workout might leave you sore for a day. At 40, the same session can sideline you for a week. The difference isn’t effort — it’s repair signaling. Your body sends fewer repair peptides, and the ones it sends are weaker.",
    howHelps: "Healing peptide therapy restores the repair signal to clinical levels. Members report faster recovery between sessions, less accumulated soreness, and the ability to train at higher volumes without breaking down.",
    testimonial: { quote: "I’m 44 and training harder than I did at 30. Recovery between sessions went from 4 days to 2.", name: "Mike R., 44", detail: "Athletic recovery · Foundation · 8 weeks" },
  },
  {
    id: "gut",
    label: "Gut & inflammation",
    icon: Flame,
    color: "#FF8A80",
    title: "Chronic inflammation that won’t resolve.",
    whatHappening: "Gut lining integrity and systemic inflammation both depend on repair peptide signaling. When that signal weakens, the gut barrier breaks down, inflammation becomes self-perpetuating, and seemingly unrelated symptoms — joint pain, fatigue, brain fog — compound.",
    howHelps: "Healing peptides target gut lining repair and modulate the chronic inflammatory loop. Members report reduced GI symptoms, lower systemic inflammation markers, and improvement in inflammation-driven pain.",
    testimonial: { quote: "Years of gut issues and joint pain. Six weeks in, my CRP dropped from 8.2 to 1.4. The joint pain followed.", name: "Elena V., 51", detail: "Gut + inflammation · Complete · 6 weeks" },
  },
];

function HPWhoItsForSection() {
  const [activeCondition, setActiveCondition] = useState("joint");
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const condition = CONDITIONS.find((c) => c.id === activeCondition);

  return (
    <section ref={ref} className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span className="mb-4 inline-block rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#FF6B35]">
            Who it&apos;s for
          </span>
          <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Different stories.{" "}
            <span className="font-playfair italic text-[#6D6FFC]">Same broken signal.</span>
          </h2>
          <p className="max-w-2xl text-base text-gray-600 md:text-lg">
            Pick what brought you here. The protocol is the same — your body is what&apos;s specific.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CONDITIONS.map((c, i) => {
            const Icon = c.icon;
            const isActive = c.id === activeCondition;
            return (
              <motion.button
                key={c.id}
                type="button"
                onClick={() => setActiveCondition(c.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`flex shrink-0 snap-start flex-col items-center gap-2 rounded-xl border px-5 py-4 text-center transition ${isActive ? "border-[#6D6FFC] bg-[#F5F4FF] shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? "bg-[#6D6FFC]/10" : "bg-gray-100"}`}>
                  <Icon className={`h-5 w-5 ${isActive ? "text-[#6D6FFC]" : "text-gray-400"}`} />
                </div>
                <span className={`whitespace-nowrap text-xs font-semibold ${isActive ? "text-[#6D6FFC]" : "text-gray-600"}`}>{c.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {condition && (
            <motion.div
              key={condition.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <div className="flex-1">
                  <h3 className="mb-5 font-title text-2xl font-bold text-gray-900 md:text-3xl">{condition.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    <strong className="text-gray-800">What&apos;s actually happening:</strong> {condition.whatHappening}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">{condition.howHelps}</p>
                </div>
                <div className="lg:w-[340px] lg:shrink-0">
                  <div className="rounded-xl border border-gray-200 bg-[#FAFAFA] p-6">
                    <p className="mb-4 font-playfair text-lg italic leading-snug text-gray-800">
                      &ldquo;{condition.testimonial.quote}&rdquo;
                    </p>
                    <p className="text-sm font-bold text-gray-900">{condition.testimonial.name}</p>
                    <p className="text-xs text-gray-500">{condition.testimonial.detail}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. The Mechanism — Orbital diagram                                 */
/* ------------------------------------------------------------------ */

function OrbitDiagram() {
  return (
    <div className="relative mx-auto h-[320px] w-[320px] md:h-[380px] md:w-[380px]">
      {/* Outer orbit */}
      <div className="absolute inset-0 rounded-full border border-gray-200" />
      {/* Middle orbit */}
      <div className="absolute inset-[15%] rounded-full border border-gray-200" />
      {/* Inner orbit */}
      <div className="absolute inset-[30%] rounded-full border border-[#6D6FFC]/20" />

      {/* Center sphere */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#6D6FFC] to-[#4F46E5] shadow-lg shadow-[#6D6FFC]/30 md:h-28 md:w-28"
        >
          <span className="font-playfair text-xl italic text-white md:text-2xl">repair</span>
        </motion.div>
      </div>

      {/* Orbiting dots */}
      {[
        { size: "100%", duration: 12, color: "#1e1b4b", dotSize: 10, startAngle: 0 },
        { size: "100%", duration: 12, color: "#6D6FFC", dotSize: 8, startAngle: 180 },
        { size: "70%", duration: 8, color: "#FF6B35", dotSize: 8, startAngle: 90 },
        { size: "70%", duration: 8, color: "#6D6FFC", dotSize: 6, startAngle: 270 },
        { size: "100%", duration: 15, color: "#4ade80", dotSize: 8, startAngle: 120 },
        { size: "100%", duration: 15, color: "#4ade80", dotSize: 6, startAngle: 300 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: dot.dotSize,
            height: dot.dotSize,
            backgroundColor: dot.color,
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [
              Math.cos((dot.startAngle * Math.PI) / 180) * (dot.size === "100%" ? 155 : 105) - dot.dotSize / 2,
              Math.cos(((dot.startAngle + 120) * Math.PI) / 180) * (dot.size === "100%" ? 155 : 105) - dot.dotSize / 2,
              Math.cos(((dot.startAngle + 240) * Math.PI) / 180) * (dot.size === "100%" ? 155 : 105) - dot.dotSize / 2,
              Math.cos(((dot.startAngle + 360) * Math.PI) / 180) * (dot.size === "100%" ? 155 : 105) - dot.dotSize / 2,
            ],
            y: [
              Math.sin((dot.startAngle * Math.PI) / 180) * (dot.size === "100%" ? 155 : 105) - dot.dotSize / 2,
              Math.sin(((dot.startAngle + 120) * Math.PI) / 180) * (dot.size === "100%" ? 155 : 105) - dot.dotSize / 2,
              Math.sin(((dot.startAngle + 240) * Math.PI) / 180) * (dot.size === "100%" ? 155 : 105) - dot.dotSize / 2,
              Math.sin(((dot.startAngle + 360) * Math.PI) / 180) * (dot.size === "100%" ? 155 : 105) - dot.dotSize / 2,
            ],
          }}
          transition={{ duration: dot.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function HPMechanismSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  const steps = [
    { num: 1, title: "Tissue repair signaling", desc: "Direct activation of fibroblasts and growth factor pathways involved in tendon, ligament, and soft tissue repair." },
    { num: 2, title: "Inflammation modulation", desc: "Quiet the chronic inflammatory loop that keeps injuries from healing — without blocking the acute response your body needs." },
    { num: 3, title: "Cellular regeneration", desc: "Support the cellular machinery that replaces damaged tissue with new, structurally sound tissue." },
  ];

  return (
    <section ref={ref} className="bg-[#FAFAFA] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex shrink-0 items-center justify-center lg:w-[45%]"
          >
            <OrbitDiagram />
          </motion.div>

          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-4 inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-600 shadow-sm">
                The Mechanism
              </span>
              <h2 className="mb-5 font-title text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                Your body has a <span className="font-playfair italic text-[#6D6FFC]">repair system</span>. The signal weakens with age, injury, and overuse.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 space-y-4 text-sm leading-relaxed text-gray-600 md:text-base"
            >
              <p>When you tear a muscle or stress a tendon, your body sends a wave of repair signals — peptides — that direct cells to migrate, divide, and rebuild. <strong className="text-gray-800">This is how healing actually happens.</strong></p>
              <p>As you age, train hard, or accumulate injuries, that signal weakens. The repair shortfall is why a &ldquo;minor&rdquo; injury at 40 takes three times longer to heal than the same injury at 25. It&apos;s why some pain just <em className="font-playfair italic text-gray-800">doesn&apos;t go away</em>.</p>
              <p>Healing peptide therapy restores those signals — at clinical doses, prescribed, and directed at the tissue that needs them.</p>
            </motion.div>

            <div className="space-y-5">
              {steps.map((s, i) => (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F4FF] text-sm font-bold text-[#6D6FFC]">{s.num}</span>
                  <div>
                    <p className="font-bold text-gray-900">{s.title}</p>
                    <p className="text-sm leading-relaxed text-gray-600">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Two Protocols / Pricing                                         */
/* ------------------------------------------------------------------ */

function HPPricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[960px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-[#6D6FFC]/30 bg-[#F5F4FF] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
            Two Protocols
          </span>
          <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Pick the level of <span className="font-playfair italic text-[#6D6FFC]">repair</span> your body needs.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            Both are clinician-prescribed. Both ship from US-based 503A/503B FDA-inspected pharmacies. Your clinician finalizes the protocol after a free intake.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              name: "Foundation",
              desc: "Foundational repair protocol — best for one specific area of pain or recovery.",
              price: 149,
              oldPrice: 199,
              highlighted: false,
              features: [
                { bold: "Single healing peptide protocol", rest: " — the foundational compound for tissue repair signaling" },
                { bold: "Best for:", rest: " a specific tendon, joint, or soft tissue issue" },
                { bold: "First effects typically in", rest: "  10–14 days" },
                { bold: "Clinician-prescribed", rest: " and dosed to your case" },
                { bold: "Ships discreet, 2-day delivery, free", rest: "" },
                { bold: "Cancel anytime", rest: "" },
              ],
              members: 9,
              rating: "4.8",
              reviews: "412",
            },
            {
              name: "Complete",
              desc: "Complete repair protocol — for systemic healing, multi-area issues, or accelerated recovery.",
              price: 249,
              oldPrice: 329,
              highlighted: true,
              features: [
                { bold: "4-peptide healing stack", rest: " — targets tissue repair, anti-inflammatory pathways, and cellular regeneration in parallel" },
                { bold: "Best for:", rest: " multi-area pain, post-surgical recovery, accelerated timelines, or chronic inflammation" },
                { bold: "First effects typically in", rest: "  7–14 days, full benefit by week 6–8" },
                { bold: "Clinician-prescribed;", rest: " doses tuned to your case" },
                { bold: "Free clinician messaging", rest: " for the protocol’s duration" },
                { bold: "Ships discreet, 2-day delivery, free", rest: "" },
                { bold: "Performance Guarantee", rest: " - 90 days" },
              ],
              members: 17,
              rating: "4.9",
              reviews: "1,184",
            },
          ].map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className={`flex h-full flex-col rounded-2xl border p-7 transition-shadow hover:shadow-lg md:p-8 ${plan.highlighted ? "border-[#6D6FFC]/30 bg-white shadow-lg shadow-[#6D6FFC]/5" : "border-gray-200 bg-white"}`}
              >
                {plan.highlighted && (
                  <span className="mb-4 inline-block w-fit rounded-full bg-[#FF6B35] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    ★ Most Chosen · 64%
                  </span>
                )}
                <h3 className="mb-1 font-title text-xl font-bold text-gray-900">
                  Repair Signal · <span className="font-playfair italic">{plan.name}</span>
                </h3>
                <p className="mb-5 text-sm text-gray-500">{plan.desc}</p>
                <div className="mb-5 flex items-end gap-3">
                  <p className="font-title text-3xl font-bold text-gray-900">${plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                  <p className="mb-0.5 text-base text-[#6D6FFC] line-through">${plan.oldPrice}</p>
                </div>
                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.bold} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span><strong>{f.bold}</strong>{f.rest}</span>
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={CTA_HREF}
                    className={`flex w-full items-center justify-center rounded-full py-3.5 text-sm font-semibold transition ${plan.highlighted ? "bg-[#6D6FFC] text-white hover:bg-[#5a5ce8]" : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400"}`}
                  >
                    Start free intake →
                  </Link>
                </motion.div>
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> {plan.members} members started this protocol today</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <span className="text-yellow-500">★★★★★</span> <strong>{plan.rating}</strong> · {plan.reviews} reviews
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {[
            { icon: ShieldCheck, label: "LegitScript Certified", border: true },
            { icon: ShieldCheck, label: "HIPAA Compliant", border: true },
            { icon: Check, label: "USA-licensed clinicians", border: false },
            { icon: ShieldCheck, label: "503A & 503B FDA-Inspected Facilities", border: false },
            { icon: Check, label: "Cancel anytime", border: false },
          ].map((b) => (
            <span key={b.label} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
              <b.icon className="h-3.5 w-3.5 text-[#6D6FFC]" /> {b.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Comparison table                                                */
/* ------------------------------------------------------------------ */

const COMPARISON_ROWS = [
  { label: "What it does", repair: "Restores the body’s repair signal", nsaids: "Masks pain", cortisone: "Suppresses inflammation", pt: "Strengthens around the issue", surgery: "Mechanical fix", live: "Issue compounds quietly" },
  { label: "Targets the cause?", repair: "Yes — at cellular level", nsaids: "No — masks symptoms", cortisone: "No — suppresses signal", pt: "Partial", surgery: "Sometimes", live: "No" },
  { label: "Onset", repair: "7–14 days", nsaids: "~1 hour", cortisone: "1–3 days", pt: "Weeks–months", surgery: "Surgery + 6+ months", live: "—" },
  { label: "Risk profile", repair: "Clinician-monitored, well-tolerated", nsaids: "GI, kidney, cardiovascular", cortisone: "Tendon weakening, cartilage loss", pt: "Low", surgery: "Surgical, recovery, anesthesia", live: "Compounds with time" },
  { label: "Builds on itself", repair: "Yes — tissue is structurally repaired", nsaids: "No — must keep taking", cortisone: "No — diminishing returns", pt: "Yes", surgery: "One-time", live: "In the wrong direction" },
  { label: "Insurance hassle", repair: "None — cash pay", nsaids: "OTC", cortisone: "Yes — copay, prior auth", pt: "Often yes", surgery: "Significant", live: "—" },
  { label: "Cost over 6 months", repair: "$894 – $1,494", nsaids: "~$120", cortisone: "~$300–600 per shot", pt: "$1,800+", surgery: "$15K–$50K", live: "Free now, expensive later" },
];

function HPComparisonSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#FAFAFA] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span className="mb-4 inline-block rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#FF6B35]">
            Vs the Alternatives
          </span>
          <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Most options <span className="font-playfair italic text-[#6D6FFC]">manage pain</span>. Only one heals the cause.
          </h2>
          <p className="max-w-2xl text-base text-gray-600">
            If you&apos;ve tried NSAIDs, cortisone, PT, or a surgeon&apos;s office — you already know &ldquo;managing&rdquo; isn&apos;t healing. Here&apos;s how each option compares on what actually matters.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]"
        >
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-4 text-left font-medium text-gray-500" />
                <th className="border-l-2 border-[#6D6FFC] bg-[#F5F4FF] px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#6D6FFC]">Repair Signal</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">NSAIDs</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Cortisone</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">PT Alone</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Surgery</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-red-400">Live With It</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <motion.tr
                  key={row.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-4 font-semibold text-gray-800">{row.label}</td>
                  <td className="border-l-2 border-[#6D6FFC] bg-[#F5F4FF]/50 px-4 py-4 font-medium text-[#6D6FFC]">{row.repair}</td>
                  <td className="px-4 py-4 text-gray-600">{row.nsaids}</td>
                  <td className="px-4 py-4 text-gray-600">{row.cortisone}</td>
                  <td className="px-4 py-4 text-gray-600">{row.pt}</td>
                  <td className="px-4 py-4 text-gray-600">{row.surgery}</td>
                  <td className="px-4 py-4 font-playfair italic text-red-500">{row.live}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Verified Outcomes                                               */
/* ------------------------------------------------------------------ */

function HPOutcomesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-600">
            Verified Outcomes
          </span>
          <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Healing isn&apos;t a promise. <span className="font-playfair italic text-[#6D6FFC]">It&apos;s the data.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            Member-reported outcomes from across our healing peptide protocols.
          </p>
        </motion.div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { value: 91, suffix: "%", label: "report meaningful pain reduction by week 6" },
            { value: 88, suffix: "%", label: "renew after their first 90 days" },
            { value: 2, suffix: ".4×", label: "average reported recovery acceleration" },
            { value: 48, suffix: "hrs", label: "average time to first prescription" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-gray-200 bg-[#FAFAFA] p-5 text-center"
            >
              <CountUpStat {...s} duration={900} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex items-center justify-center gap-2"
        >
          <span className="text-yellow-500">★★★★★</span>
          <span className="font-title text-lg font-bold text-gray-900">4.9 / 5</span>
          <span className="text-sm text-gray-500">based on 1,596 verified members</span>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center rounded-2xl bg-[#E8E3FF] p-8"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#6D6FFC]">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Member story · video</p>
            <p className="text-xs italic text-gray-500">[INSERT: 30-sec testimonial when available]</p>
          </motion.div>

          {[
            { quote: "Three orthopedists and two cortisone shots later, my shoulder still wasn’t right. Six weeks on this and I’m benching again, pain-free for the first time in two years.", name: "Marcus H., 41", detail: "Rotator cuff · Recovery Stack · 6 weeks", initials: "MH" },
            { quote: "My Achilles tendinitis lasted 18 months. I tried PT, ice, rest, NSAIDs — everything. Within a month on the Foundation, I was running again.", name: "Priya S., 36", detail: "Achilles · Foundation · 4 weeks", initials: "PS" },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <p className="mb-6 flex-1 font-playfair text-base italic leading-relaxed text-gray-800">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6D6FFC] text-xs font-bold text-white">{t.initials}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.detail}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs italic text-gray-400">
          Internal HealSend member-reported outcomes (n=1,596+ across all healing peptide protocols). Individual experience varies. Not a substitute for emergency medical care. Testimonials are placeholder pre-launch — real member stories will replace before publishing.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. What's In Your Protocol                                         */
/* ------------------------------------------------------------------ */

const PEPTIDE_CARDS = [
  { icon: ArrowRight, color: "#6D6FFC", title: "Tissue Repair Peptide", desc: "Direct-acting on fibroblast migration. Tendon, ligament, soft tissue, and gut lining repair." },
  { icon: Sparkles, color: "#6D6FFC", title: "Cellular Regeneration Peptide", desc: "Supports cellular migration and angiogenesis at injury sites — the cellular machinery of new tissue." },
  { icon: Circle, color: "#FF8A80", title: "Skin & Connective Tissue Peptide", desc: "Copper-bound peptide that supports collagen, elastin, and connective tissue remodeling." },
  { icon: Minus, color: "#FF6B35", title: "Anti-Inflammatory Peptide", desc: "Modulates the chronic inflammatory loop that keeps injuries from healing — without suppressing the acute response." },
];

function HPProtocolSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#FAFAFA] py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-[40%] lg:shrink-0"
          >
            <span className="mb-4 inline-block rounded-full border border-[#6D6FFC]/30 bg-[#F5F4FF] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC]">
              What&apos;s in your protocol
            </span>
            <h2 className="mb-5 font-title text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              No proprietary blends. <span className="font-playfair italic text-[#6D6FFC]">No mystery.</span>
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
              <p>Every healing peptide in your protocol does a specific job. Your clinician selects from these, dosed to your case, and prescribes the version that matches your repair shortfall.</p>
              <p>Compounded by 503A pharmacies. Manufactured in 503B FDA-inspected facilities. Shipped with a printed protocol and dosing guide.</p>
            </div>
            <p className="mt-6 text-xs italic text-gray-400">
              Specific compound names appear in your prescription label and in our FAQ — they&apos;re omitted from main marketing copy because we lead with what each peptide <u>does</u>, not what it&apos;s called.
            </p>
          </motion.div>

          <div className="flex-1 space-y-4">
            {PEPTIDE_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${card.color}15` }}>
                      <Icon className="h-5 w-5" style={{ color: card.color }} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{card.title}</p>
                      <p className="text-sm leading-relaxed text-gray-600">{card.desc}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. How It Works — 4 Steps                                          */
/* ------------------------------------------------------------------ */

function HPStepsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  const steps = [
    { num: 1, title: "2-min intake", desc: "Tell us about your pain or injury, your training, your history. Free." },
    { num: 2, title: "Clinician review", desc: "A US-licensed physician reviews your case and finalizes a protocol, usually within 24 hours." },
    { num: 3, title: "Ships in 48 hrs", desc: "Your medication arrives discreet, 2-day, free. Printed protocol & dosing guide included." },
    { num: 4, title: "Clinician access", desc: "Message your clinician any time during your protocol. Adjust dose if needed." },
  ];

  return (
    <section ref={ref} id="how-it-works" className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-600 shadow-sm">
            How It Works
          </span>
          <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Four steps. <span className="font-playfair italic text-[#6D6FFC]">About 48 hours.</span>
          </h2>
          <p className="mx-auto max-w-xl text-base text-gray-600">
            From first click to medication shipped, most members are done within two days.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -40, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 + i * 0.12 }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center transition-shadow hover:shadow-lg"
              >
                <motion.div
                  animate={inView ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#6D6FFC] text-lg font-bold text-white shadow-md shadow-[#6D6FFC]/30"
                >
                  {s.num}
                </motion.div>
                <h3 className="mb-2 font-title text-base font-bold text-gray-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. 90-Day Performance Guarantee                                   */
/* ------------------------------------------------------------------ */

function HPPromiseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#FAFAFA] py-10 md:py-16">
      <div className="mx-auto max-w-[700px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-emerald-300/60"
          >
            <div className="flex flex-col items-center">
              <motion.span
                initial={{ filter: "blur(8px)" }}
                animate={inView ? { filter: "blur(0px)" } : { filter: "blur(8px)" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-title text-3xl font-bold text-emerald-600"
              >
                90
              </motion.span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-emerald-500">Day Promise</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 font-title text-2xl font-bold text-gray-900 md:text-3xl"
          >
            Performance <span className="font-playfair italic text-[#6D6FFC]">Guarantee</span>.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 text-sm leading-relaxed text-gray-600"
          >
            <p>
              Notice meaningful improvement in your target outcome — pain reduction, recovery acceleration, mobility — by the end of <strong className="text-gray-800">week 12</strong>, or your most recent month is on us.
            </p>
            <p>
              Complete your scheduled clinician check-ins. If the protocol isn&apos;t working, we don&apos;t keep your money. <strong className="text-gray-800">One-time per member, first 90 days on the protocol.</strong> No phone calls, no retention pressure.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. FAQ                                                            */
/* ------------------------------------------------------------------ */

const HP_FAQS = [
  { question: "What peptides are actually prescribed?", answer: "Your clinician selects from BPC-157, TB-500, GHK-Cu, and Thymosin Alpha-1 — depending on your case. These compound names appear on your prescription label. We omit them from marketing copy because we lead with function, not chemical names." },
  { question: "How is this different from anti-inflammatories or cortisone?", answer: "NSAIDs and cortisone suppress symptoms. Healing peptides restore the body's repair signaling at the cellular level — targeting the cause, not the sensation. The result is structural repair, not temporary relief." },
  { question: "Is this legal? Are the medications FDA-approved?", answer: "Yes, this is legal. Healing peptides are prescribed off-label by US-licensed physicians and compounded by 503A and 503B FDA-inspected pharmacies. Off-label prescribing is a standard, legal medical practice." },
  { question: "How is the medication administered?", answer: "Most protocols use subcutaneous injection — a tiny needle, similar to insulin. Your kit includes everything: medication, syringes, alcohol swabs, and a video walkthrough for your first dose." },
  { question: "What if it doesn't work for me?", answer: "Our 90-day Performance Guarantee covers you. If you don't notice meaningful improvement in your target outcome by week 12, your most recent month is refunded. No phone calls, no retention pressure." },
  { question: "How fast will I feel results?", answer: "Most members report initial effects within 7–14 days. Full benefit typically builds over 6–8 weeks as tissue structurally repairs. Recovery acceleration is often noticed first; pain reduction follows as repair completes." },
  { question: "Are there side effects?", answer: "Healing peptides are generally well-tolerated. The most common side effects are mild injection-site reactions (redness, slight stinging) that resolve within minutes. Your clinician monitors your case throughout." },
  { question: "Can I stack this with other treatments — PT, training, supplements?", answer: "Yes. Healing peptide therapy complements PT, training, and most supplement regimens. In fact, combining it with PT often accelerates results because the peptides help your body respond to the stimulus. Discuss specifics with your clinician." },
];

function HPFAQSection() {
  const [openIdx, setOpenIdx] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[780px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-600 shadow-sm">
            Questions
          </span>
          <h2 className="font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Asked. <span className="font-playfair italic text-[#6D6FFC]">Answered.</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {HP_FAQS.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
                >
                  <span className="text-sm font-semibold text-gray-800 md:text-base">{faq.question}</span>
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-[#F5F4FF] p-1.5">
                    {openIdx === idx ? <Minus className="h-3.5 w-3.5 text-[#6D6FFC]" strokeWidth={2.5} /> : <Plus className="h-3.5 w-3.5 text-[#6D6FFC]" strokeWidth={2.5} />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {openIdx === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600 md:px-6">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  12. Closing CTA                                                    */
/* ------------------------------------------------------------------ */

function HPClosingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-[#F5F4FF] to-white py-20 text-center md:py-28">
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D6FFC]/5 blur-[120px]"
          animate={inView ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[700px] px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-600 shadow-sm">
            Get Started
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 font-title text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl"
        >
          Restore the <span className="font-playfair italic text-[#6D6FFC]">repair signal</span>. Stop managing pain.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 text-base text-gray-600 md:text-lg"
        >
          2-minute intake. Free clinician review within 24 hours. No commitment until you&apos;re prescribed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex flex-wrap items-center justify-center gap-3"
        >
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
            <Clock className="h-5 w-5 text-[#6D6FFC]" />
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900"><span className="text-[#6D6FFC]">23</span> clinician consults available this week</p>
              <p className="text-xs text-gray-500">Slots refresh every Monday at 9am ET</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-400" /> LIVE</span>
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href={CTA_HREF}
              className="inline-flex items-center gap-2 rounded-full bg-[#6D6FFC] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#5a5ce8]"
            >
              Start free intake <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: Check, label: "USA-licensed clinicians" },
            { icon: ShieldCheck, label: "503A & 503B FDA-inspected" },
            { icon: Check, label: "Cancel anytime" },
          ].map((b) => (
            <span key={b.label} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
              <b.icon className="h-3.5 w-3.5 text-[#6D6FFC]" /> {b.label}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC] text-[9px] font-bold leading-tight text-white">
              MD
            </div>
            <div className="text-left">
              <p className="text-sm italic text-gray-700">
                &ldquo;Every protocol is reviewed and prescribed by a US-licensed physician. Your safety is non-negotiable.&rdquo;
              </p>
              <p className="mt-1 text-xs font-bold text-gray-800">[INSERT: Medical Director Name], MD</p>
              <p className="text-xs text-gray-500">[INSERT: Specialty / Credential] · Medical Director, HealSend</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export                                                     */
/* ------------------------------------------------------------------ */

export default function HealingPeptideTherapyLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <HPWillpowerSection />
      <HPProductHeroSection />
      <MediaLogosBanner />
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="Healing Peptide Therapy Benefits" />
      <HPWhoItsForSection />
      <HPMechanismSection />
      <HPPricingSection />
      <HPComparisonSection />
      <HPOutcomesSection />
      <HPProtocolSection />
      <SimpleSteps productData={productData} />
      <HPPromiseSection />
      <CleanSimpleEffective productData={null} />
      <LabTested productData={null} />
      <MarketingTrustMarquee items={HP_TRUST_ITEMS} edgeToEdge={false} />
      <SameMedicationSection planLabel="Personalized, clinically-proven healing peptide plans" />
      <HPFAQSection />
      <SupportAvailabilitySection />
      <HPClosingCTA />
      <MarketingFooter />
    </div>
  );
}
