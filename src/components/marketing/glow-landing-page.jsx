"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ClipboardCheck,
  Headset,
  Laptop,
  Layers,
  Microscope,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
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
} from "@/components/marketing/product-page";

const CTA_HREF = "/funnels/skin-hair";

const GLOW_TRUST_ITEMS = [
  { text: "No Memberships or Hidden Fees", Icon: Laptop },
  { text: "Personalized Rx Skin & Hair Plans", Icon: Sparkles },
  { text: "Free & Fast Shipping", Icon: Truck },
  { text: "U.S. Only Certified Pharmacies", Icon: null, svg: "True" },
  { text: "Always On Clinician Support", Icon: Headset },
  { text: "1,200,000+ prescriptions written", Icon: ClipboardCheck },
  { text: "FSA & HSA Eligible", Icon: BadgeCheck },
];

const MEMBER_FACES = [
  "/images/4_Home_Doctors_Online_Consultation-Doctors_02.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Doctors_04.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Avatar.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Testimonials_01.jpg",
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

function GlowWillpowerSection() {
  return (
    <section className="relative overflow-hidden bg-[#F1F5F9]">
      <div className="relative mx-auto flex max-w-[1340px] flex-col items-start gap-5 px-4 py-10 md:px-[3.25rem] md:py-14 lg:h-[calc(100dvh-80px)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8 lg:overflow-hidden lg:py-0">
        <div className="w-full min-w-0 shrink-0 lg:w-[55%] lg:max-w-[740px] lg:self-center">
          <div className="w-full max-w-[34rem]">
            <div className="mt-5 max-w-[34rem]">
              <h1 className="text-balance font-title text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
                Skin that{" "}
                <span className="font-playfair italic text-[#6D6FFC]">
                  regenerates
                </span>{" "}
                from the inside.
              </h1>
              <p className="mt-4 max-w-[30rem] text-[1rem] leading-6 text-gray-700 lg:text-[1.05rem]">
                A clinically guided regenerative protocol designed to support
                skin quality, hair density, and cellular repair — at the source.
              </p>
            </div>

            <ul className="mt-5 max-w-[34rem] space-y-4 text-[#4d5160]">
              <li className="grid grid-cols-[auto_1fr] items-start gap-1 text-sm md:text-lg">
                <div className="flex items-center gap-4 text-base md:text-sm">
                  <Sparkles className="h-6 w-6 shrink-0" strokeWidth={2} />
                  <span>Three personalized tiers — start where you need, step up when you&apos;re ready</span>
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
                  Get my personalized plan
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

const GLOW_HERO_BENEFITS = [
  { icon: Sparkles, text: "Subcutaneous peptide protocol · Daily 5–7 min at home, supplies included." },
  { icon: ShieldCheck, text: "Full-strength compounds from a licensed U.S. pharmacy." },
  { icon: Stethoscope, text: "Board-certified clinician review + quarterly check-ins included." },
];

const GLOW_TIERS_PRICING = [
  { name: "Enhanced", price: 179, isFeatured: true, badge: "BULLSEYE" },
  { name: "Advanced Stack", price: 299, isFeatured: false },
];

const GLOW_HERO_FAQS = [
  {
    question: "What is regenerative peptide therapy?",
    answer:
      "Regenerative peptide therapy delivers bioactive peptides that signal your cells to renew and repair — mimicking the growth factors your body uses naturally. Unlike topicals, they work inside the cells that make your skin and hair.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most members notice initial changes in skin texture and hydration within 6–8 weeks. Visible changes in tone and hair density typically develop by week 12, particularly on Enhanced and Advanced tiers.",
  },
  {
    question: "Is this the same as regular skincare?",
    answer:
      "No. Topicals act on the epidermis — the surface layer. This protocol works inside the fibroblasts, keratinocytes, and follicle cells. It's not skincare. It's cellular signaling.",
  },
];

function GlowProductHeroSection() {
  const [activeTab, setActiveTab] = useState("benefits");
  const [openFaq, setOpenFaq] = useState(null);
  const [showPriceFootnote, setShowPriceFootnote] = useState(false);

  return (
    <section className="bg-[#f9f9f9] px-4 py-16 md:px-[3.25rem] md:py-20 lg:px-[3.25rem]">
      <div className="mx-auto flex max-w-[1340px] flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6 xl:gap-8">
        {/* Left — sticky */}
        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[55%] lg:max-w-[740px]">
          <div className="flex flex-col gap-6 sm:gap-7 md:gap-10 lg:isolate lg:sticky lg:top-24 lg:z-10">
            <div className="relative z-[1] shrink-0 bg-[#f9f9f9] pb-1">
              <h2 className="text-balance text-start text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-5xl md:leading-tight">
                Glow Regenerative Therapy
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
                  src="https://images.unsplash.com/photo-1581182800629-7d90925ad072?auto=format&fit=crop&w=1200&q=80"
                  alt="Glow Regenerative Therapy — in stock"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="rounded-[1rem] object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right — scrollable */}
        <div className="flex w-full shrink-0 flex-col lg:min-h-0 lg:w-[45%] xl:w-[450px]">

          {/* Price card — yellow banner + price + Klarna/Afterpay + CTA */}
          <div className="mb-6 overflow-hidden rounded-[1rem] border border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2 bg-[#fde073] px-5 py-3.5 text-sm font-medium text-gray-900 md:text-base">
              <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
              FSA &amp; HSA Eligible
            </div>
            <div className="px-6 py-6 md:px-7 md:py-7">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div className="min-w-0 shrink">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 md:text-4xl">$99</span>
                    <span className="text-lg font-medium text-gray-800 md:text-xl">first month</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPriceFootnote((v) => !v)}
                    aria-expanded={showPriceFootnote}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500 underline decoration-dotted underline-offset-4 hover:text-gray-700 md:text-base"
                  >
                    then from $179/mo*
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
                  *Enhanced is $179/mo and Advanced Stack is $299/mo. Final tier and pricing depends on clinician review. Cancel anytime.
                </div>
              )}

              <div className="flex w-full flex-col items-stretch gap-3">
                <Link
                  href={CTA_HREF}
                  className="hs-solid-btn flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold shadow-[0_8px_24px_rgba(109,111,252,0.35)] transition-colors"
                >
                  See the tiers <ArrowRight className="h-4 w-4" />
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
                    ? GLOW_HERO_BENEFITS.map((item, idx) => {
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
                        Glow Regenerative Therapy
                      </h3>
                      <div className="rounded-[1rem] border border-gray-200">
                        {GLOW_TIERS_PRICING.map((tier, index) => (
                          <div
                            key={tier.name}
                            className={`relative flex items-center justify-between p-4 ${index !== GLOW_TIERS_PRICING.length - 1 ? "border-b border-gray-200" : ""
                              } ${tier.isFeatured ? "bg-gray-50/50" : ""}`}
                          >
                            {tier.isFeatured && (
                              <span className="absolute right-4 top-0 z-10 flex h-[1.4rem] -translate-y-1/2 items-center rounded-full bg-[#FF6B35] px-3 text-[11px] font-semibold leading-none text-white">
                                Most Popular
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium md:text-base ${tier.isFeatured ? "text-[#6D6FFC]" : "text-gray-700"}`}>
                                {tier.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className={`text-xl font-bold leading-none ${tier.isFeatured ? "text-[#6D6FFC]" : "text-gray-900"}`}>
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
                      The Glow Regenerative Therapy protocol uses clinically-studied peptides to work
                      at the cellular level — supporting collagen synthesis, hair follicle health, and
                      tissue repair from within. Three tiers let you start at your pace and step up as
                      you see results.
                    </p>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-2 flex flex-col items-center gap-2 border-t border-gray-100 px-5 pb-2 pt-4 text-center text-xs text-gray-500 md:flex-row md:items-center md:justify-between md:px-6 md:text-left">
              <span className="flex items-center gap-1.5">
                <img draggable={false} role="img" alt="us" src="/images/marketing/logos/flag-usa.svg" className="h-4 w-4 align-[-0.1em]" />
                Compounded in the U.S.A
              </span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> FSA &amp; HSA Eligible
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-6 space-y-3">
            {GLOW_HERO_FAQS.map((faq, idx) => (
              <div key={faq.question} className="overflow-hidden rounded-[1rem] bg-white shadow-sm">
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
                *Final treatment fit and pricing depend on clinician review and the tier prescribed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Three Tiers                                                     */
/* ------------------------------------------------------------------ */

const GLOW_PLAN_CARDS = [
  {
    id: "glow-enhanced",
    headerClass: "bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["Most Popular", "Skin & Hair"],
    title: "Enhanced\nSkin & Hair",
    subtitle: "Dual-compound regenerative protocol",
    image: "/images/marketing/bundle/sermorelin-product.png",
    bulletsHeading: "MEMBER RESULTS",
    bullets: [
      { icon: Sparkles, text: "Visible texture & tone improvement by week 12" },
      { icon: RefreshCw, text: "Hair density support included in protocol" },
      { icon: ShieldCheck, text: "Clinician access + quarterly progress labs" },
    ],
    primaryCta: "Start Enhanced",
    secondaryCta: "Why Enhanced?",
    href: CTA_HREF,
    description: "Dual-compound protocol targeting the collagen pathway plus hair-density support. Most visible 12-week results at the most accessible price.",
    whyItWorks: [
      "Cellular renewal + collagen pathway combined",
      "Designed to help skin barrier function",
      "Daily subcutaneous, painless — supplies included",
    ],
    bestFor: [
      "Members who want the strongest 12-week results",
      "Anyone looking for skin + hair improvement",
    ],
  },
  {
    id: "glow-advanced",
    headerClass: "bg-gradient-to-br from-violet-500/20 to-indigo-500/20",
    headerTextClass: "text-[#101726]",
    useFullImage: false,
    badges: ["Full Stack", "Advanced"],
    title: "Advanced\nRegenerative Stack",
    subtitle: "Triple-compound full regenerative protocol",
    image: "/images/marketing/bundle/sermorelin-product.png",
    bulletsHeading: "MEMBER RESULTS",
    bullets: [
      { icon: Layers, text: "Full cellular-renewal stack — triple compound" },
      { icon: Activity, text: "Hair density + tissue repair pathway" },
      { icon: Zap, text: "Priority same-day clinician access" },
    ],
    primaryCta: "Start Advanced",
    secondaryCta: "Why Advanced?",
    href: CTA_HREF,
    description: "Triple-compound protocol for the full regenerative stack. Hair density, tissue repair, and broader systemic recovery.",
    whyItWorks: [
      "Broader cellular renewal effect across pathways",
      "Includes regenerative wound-healing add-on",
      "Bi-monthly progress labs for tighter monitoring",
    ],
    bestFor: [
      "Experienced peptide users ready to go all-in",
      "Members upgrading from Enhanced for deeper results",
    ],
  },
];

function GlowThreeTiersSection() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section id="tiers" className="bg-[#f9f9f9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-10 grid grid-cols-1 gap-8 md:mb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-x-8 xl:gap-x-12">
          <div className="min-w-0">
            <h2 className="font-title text-3xl font-bold leading-[1.05] tracking-tight text-gray-950 sm:text-4xl lg:text-[2.625rem]">
              Start where you are.
            </h2>
            <p className="mt-2 font-playfair text-2xl italic leading-tight text-[#5d62f3] sm:text-3xl">
              Step up when you&apos;re ready.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#474257] md:text-lg">
              Most members start at Enhanced — the strongest cellular-renewal effect at the most accessible price.
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

        <div className="mx-auto grid max-w-[1200px] items-start gap-7 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          {GLOW_PLAN_CARDS.map((plan) => (
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
/*  4. Protocol Support                                                */
/* ------------------------------------------------------------------ */

const SUPPORT_OUTCOMES = [
  {
    title: "Skin texture & tone",
    desc: "May support smoother texture, more even tone, and improved hydration as cellular turnover increases.",
    image: "https://plus.unsplash.com/premium_photo-1682096433084-b68c0cf072b8?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Hair density",
    desc: "Designed to help support hair follicle health and density — particularly in the Enhanced and Advanced tiers.",
    image: "https://plus.unsplash.com/premium_photo-1706800175868-1ef13f9016af?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Cellular repair",
    desc: "Works upstream — supporting your body's natural cellular renewal pathways instead of layering more topicals.",
    image: "https://plus.unsplash.com/premium_photo-1682096423780-41ca1b04af68?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Anti-aging signaling",
    desc: "May support skin barrier function, collagen pathway activity, and broader regenerative cell signaling.",
    image: "https://plus.unsplash.com/premium_photo-1661349870907-53adfc489ee2?auto=format&fit=crop&w=800&q=80",
  },
];

function GlowProtocolSupportSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center md:mb-16">
          <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            What this protocol may
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            support &amp; help with.
          </p>
          <p className="mt-5 text-base text-gray-600">
            Outcomes the literature and our member data both support. Individual results vary —
            provider-prescribed when appropriate.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORT_OUTCOMES.map((item) => (
            <FadeIn key={item.title}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="mb-2 font-title text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
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
/*  5. How It Works                                                    */
/* ------------------------------------------------------------------ */

const HOW_STEPS = [
  {
    n: 1,
    icon: Zap,
    title: "Daily peptide signal",
    desc: "The protocol delivers a clinically-studied regenerative signal — a peptide that mimics natural growth factors involved in tissue repair and cellular renewal.",
  },
  {
    n: 2,
    icon: RefreshCw,
    title: "Cells respond & renew faster",
    desc: "Your fibroblasts, keratinocytes, and follicle cells respond to the signal with increased turnover. The cells that make skin and hair regenerate more quickly.",
  },
  {
    n: 3,
    icon: Activity,
    title: "Repair pathways activate",
    desc: "Collagen synthesis, barrier-function support, and wound-healing pathways activate. This is where the structural change happens — at the matrix level.",
  },
  {
    n: 4,
    icon: Sparkles,
    title: "Visible glow follows the structure",
    desc: "Better texture, more even tone, improved hair density — the visible result of weeks of cellular-level work. Topicals can't do this. Peptides can.",
  },
];

function CellDiagram() {
  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <svg viewBox="0 0 220 220" className="w-full max-w-[260px]" aria-hidden="true">
        {/* Dashed lines */}
        <line x1="110" y1="55" x2="110" y2="88" stroke="#6D6FFC" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="55" y1="110" x2="88" y2="110" stroke="#6D6FFC" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="132" y1="110" x2="165" y2="110" stroke="#6D6FFC" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="110" y1="132" x2="110" y2="165" stroke="#FF6B35" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Outer ring of CELL */}
        <circle cx="110" cy="110" r="30" fill="none" stroke="#6D6FFC" strokeWidth="1.5" />
        {/* CELL circle */}
        <circle cx="110" cy="110" r="24" fill="#6D6FFC" />
        <text x="110" y="114" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">CELL</text>
        {/* SIGNAL */}
        <circle cx="110" cy="36" r="18" fill="#6D6FFC" />
        <text x="110" y="40" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">SIGNAL</text>
        {/* REPAIR */}
        <circle cx="36" cy="110" r="18" fill="#6D6FFC" />
        <text x="36" y="114" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">REPAIR</text>
        {/* RENEW */}
        <circle cx="184" cy="110" r="18" fill="#6D6FFC" />
        <text x="184" y="114" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">RENEW</text>
        {/* GLOW */}
        <circle cx="110" cy="184" r="18" fill="#FF6B35" />
        <text x="110" y="188" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">GLOW</text>
      </svg>
    </div>
  );
}

function GlowHowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-10 text-center md:mb-12">
          <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
            How Regeneration Actually Works
          </span>
          <h2 className="mb-2 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Topicals work on the surface.
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            This works underneath.
          </p>
          <p className="mx-auto mt-5 max-w-[580px] text-base text-gray-600">
            Creams and serums act on your epidermis — the outer layer. This protocol works inside the
            cells that make your skin and hair. That&apos;s why the changes hold.
          </p>
        </div>

        {/* Mobile: horizontal scroll with peek */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
          {HOW_STEPS.map((step) => (
            <div key={step.n} className="w-[75vw] shrink-0 snap-start">
              <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#6D6FFC] text-white">
                  <step.icon className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <h3 className="mb-2 font-title text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: diagram + steps grid */}
        <div className="hidden overflow-hidden rounded-3xl bg-white p-6 shadow-sm md:block md:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <CellDiagram />
            <div className="space-y-6">
              {HOW_STEPS.map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC] text-white">
                    <step.icon className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-title text-lg font-bold text-gray-900">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Testimonials                                                    */
/* ------------------------------------------------------------------ */

const GLOW_TESTIMONIALS = [
  {
    name: "Lauren M., 38",
    tier: "Enhanced Tier · 14 weeks",
    quote:
      "I tried tretinoin for two years. Worked, but it never really stuck. Three months on Enhanced and people keep asking what I changed. The texture is just... different now.",
    stats: [
      { val: "+34%", label: "Skin texture score" },
      { val: "+18%", label: "Hydration" },
    ],
    verified: "Verified - Enhanced Optimization",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Marcus R., 44",
    tier: "Advanced Stack · 18 weeks",
    quote:
      "Started for hair density honestly. Stayed for everything else. Skin tone evened out, the slow-healing thing on my elbow finally closed up. Stack does what topicals couldn't.",
    stats: [
      { val: "+22%", label: "Hair density" },
      { val: "+28%", label: "Skin tone evenness" },
    ],
    verified: "Verified - Advanced Stack",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Jenna P., 41",
    tier: "Enhanced · 10 weeks",
    quote:
      "Wasn't sure at first, but by week 6 I was 80% there. The remaining 20% showed up in the next month. My clinician was great about adjusting the protocol.",
    stats: [
      { val: "+27%", label: "Texture" },
      { val: "+12%", label: "Hydration" },
    ],
    verified: "Verified - Enhanced",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
  },
];

function GlowTestimonialsSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[600px] text-center md:mb-16">
          <h2 className="mb-2 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Real members.
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            Real changes.
          </p>
          <p className="mt-5 text-base text-gray-600">
            HealSend members on Glow protocols at varying tiers. Outcomes verified by member-reported
            progress + clinician check-ins.
          </p>
        </div>

        {/* Mobile: snap scroll */}
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] scroll-pl-4 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {GLOW_TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="w-[88%] shrink-0 snap-start snap-always md:w-auto md:shrink"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative h-48 w-full">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="(max-width: 768px) 88vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="mb-3">
                    <p className="font-title text-base font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.tier}</p>
                  </div>
                  <blockquote className="mb-4 flex-1 rounded-xl bg-[#6D6FFC]/5 p-4 text-sm italic leading-relaxed text-gray-700">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mb-3 flex gap-4">
                    {t.stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-lg font-bold text-emerald-600">{s.val}</p>
                        <p className="text-[11px] text-gray-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6D6FFC]">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    Verified — {t.verified}
                  </div>
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
/*  7. Pain Points                                                     */
/* ------------------------------------------------------------------ */

const PAIN_CARDS = [
  {
    title: "Your skincare routine plateaued.",
    image: "/images/negative-sell/negative_1.webp",
    bullets: [
      "The 8-product routine isn't doing more than the 3-product one used to.",
      "Texture isn't holding the way it did at 28.",
    ],
  },
  {
    title: "Hair quietly thinned over the last few years.",
    image: "/images/negative-sell/negative_2.jpeg",
    bullets: [
      "The part is wider. The crown looks thinner in photos.",
      "You've watched it happen but haven't found a real fix.",
    ],
  },
  {
    title: "Cuts & injuries take longer to heal.",
    image: "/images/negative-sell/negative_3.jpg",
    bullets: [
      "Small things linger. Bruises stay too long.",
      "Your body's repair machinery is moving slower than it used to.",
    ],
  },
  {
    title: "You want regenerative — not just cosmetic.",
    image: "/images/negative-sell/negative_4.webp",
    bullets: [
      "You've done filler. You've done laser. You're tired of treating symptoms.",
      "You want the underlying cell biology to do its job again.",
    ],
  },
];

function GlowPainPointsSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-[#f0eeff] px-4 py-1.5 text-sm font-semibold text-[#5b3cdd]">
            Sound familiar?
          </span>
        </div>
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#1c1a24] md:text-4xl lg:text-5xl">
          Topicals stopped{" "}
          <span className="font-playfair italic text-[#6D6FFC]">holding.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[42rem] text-center text-lg leading-relaxed text-[#5d6169]">
          If creams and serums plateau every six months, it&apos;s not your routine. Topicals only
          work on the surface. Real change has to happen below it.
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
            See which tier fits <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. 60-Day Promise                                                  */
/* ------------------------------------------------------------------ */

function GlowPromiseSection() {
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
          className="mb-4 font-title text-2xl font-bold leading-snug text-white md:text-3xl"
        >
          If you don&apos;t see visible change by week 12,{" "}
          <span className="font-playfair italic text-[#6D6FFC]">your first month is free.</span>
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
/*  9. Research                                                        */
/* ------------------------------------------------------------------ */

const RESEARCH_CITATIONS = [
  {
    focus: "Skin Remodeling & Collagen",
    author: "Pickart & Margolina (2018)",
    desc: "Comprehensive review of GHK-Cu in skin remodeling, collagen synthesis, and barrier repair.",
    icon: Sparkles,
  },
  {
    focus: "Dermal Density Support",
    author: "Bickers et al. (2017)",
    desc: "Regenerative peptide effects on fibroblast activity and dermal density.",
    icon: Activity,
  },
  {
    focus: "Follicle Cycling Science",
    author: "Trink et al. (2013)",
    desc: "Peptide signaling in hair follicle cycling and density support.",
    icon: RefreshCw,
  },
  {
    focus: "Peptide Safety Profiles",
    author: "Sigalos & Pastuszak (2018)",
    desc: "Systematic review of regenerative peptide safety profiles in adults.",
    icon: ShieldCheck,
  },
];

function ResearchAccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-gray-50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC]/10">
          <item.icon className="h-5 w-5 text-[#6D6FFC]" strokeWidth={2} />
        </div>
        <span className="flex-1 text-base font-bold text-gray-900">{item.focus}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400"
        >
          <Plus className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="border-t border-gray-100 px-5 pb-5 pt-4">
              <p className="mb-1 text-sm font-semibold text-[#6D6FFC]">{item.author}</p>
              <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GlowResearchSection() {
  return (
    <section className="bg-[#F9F9F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[55fr_45fr] lg:gap-16">
          <FadeIn>
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6D6FFC]">
                  <Microscope className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#6D6FFC]">Peer-Reviewed Excellence</span>
              </div>
              <h2 className="mb-3 font-title text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                Decades of clinical
              </h2>
              <p className="mb-5 font-playfair text-2xl italic text-[#6D6FFC] md:text-3xl">
                validation.
              </p>
              <p className="mb-8 max-w-[480px] text-base leading-relaxed text-gray-600">
                The compounds in this protocol family come from the most studied regenerative peptide
                literature available — including dermatology, wound-healing, and hair-cycle research.
              </p>

              <div className="space-y-3">
                {RESEARCH_CITATIONS.map((c) => (
                  <ResearchAccordionItem key={c.author} item={c} />
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Reviewed by HealSend Clinical Team
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
                      <Image
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&q=80"
                        alt="Dr. R. Adler"
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
                      <Image
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=80&q=80"
                        alt="Clinical team member"
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Dr. R. Adler &amp; team</p>
                    <p className="text-xs text-gray-500">
                      Board-certified dermatology &amp; regenerative medicine
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
                &ldquo;Regenerative Peptide Effects on Skin Remodeling and Barrier Function&rdquo;
              </h3>
              <blockquote className="mb-6 border-l-2 border-[#6D6FFC] pl-4 text-sm italic leading-relaxed text-gray-500">
                Pickart L, Margolina A. International Journal of Molecular Sciences. Comprehensive
                review of regenerative copper-peptide effects across multiple clinical trials.
              </blockquote>

              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  { val: "+72%", label: "collagen synthesis" },
                  { val: "+34%", label: "skin density" },
                  { val: "−27%", label: "visible fine lines" },
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
/*  10. Steps                                                          */
/* ------------------------------------------------------------------ */

const GLOW_STEPS = [
  {
    step: "STEP 1",
    title: "Online intake",
    desc: "90-second medical assessment focused on your skin/hair concerns and overall regenerative goals. Baseline labs ordered.",
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=600&q=80",
  },
  {
    step: "STEP 2",
    title: "Tier & protocol",
    desc: "A licensed clinician reviews your goals, recommends a tier, and prescribes your personalized regenerative protocol.",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80",
  },
  {
    step: "STEP 3",
    title: "Medication shipped",
    desc: "Discreet packaging, free shipping, all supplies and a video walkthrough for your first dose.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
  },
];

function GlowStepsSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[580px] text-center md:mb-16">
          <h2 className="mb-2 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            From intake to protocol
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            in one week.
          </p>
          <p className="mt-5 text-base text-gray-600">
            Same simple process across all three tiers. Your clinician helps you pick the right one.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {GLOW_STEPS.map((s) => (
            <FadeIn key={s.step}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative h-40">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                  <span className="absolute bottom-3 left-4 rounded-full bg-[#1a1a2e] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
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
/*  11. Upgrade Banner                                                 */
/* ------------------------------------------------------------------ */

function GlowUpgradeBanner() {
  return (
    <section className="bg-[#5b3cdd] py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-[560px]">
            <h2 className="mb-3 font-title text-2xl font-bold text-white md:text-3xl">
              Already on Foundational?
            </h2>
            <p className="mb-1 font-playfair text-2xl italic text-[#FF6B35] md:text-3xl">
              Most members upgrade by month 3.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              Members who start on Foundational typically move to Enhanced or Advanced once they feel
              the protocol working. The compounds compound — and the upgrade unlocks faster, more
              visible change.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href={CTA_HREF}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#e55a26]"
            >
              Compare tiers →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  12. FAQ                                                            */
/* ------------------------------------------------------------------ */

const GLOW_FAQS = [
  {
    question: "How does the 60-day money-back guarantee work?",
    answer:
      "If you don't see meaningful improvement in skin texture, tone, or hair density by week 12, we'll refund your first month. No fine print. Email us and it's done.",
  },
  {
    question: "What's actually in each tier?",
    answer:
      "Enhanced uses a dual-compound protocol targeting the collagen pathway plus hair-density support. Advanced adds a third compound with wound-healing and tissue-repair support.",
  },
  {
    question: "Which tier should I start at?",
    answer:
      "Most members start at Enhanced — it has the strongest 12-week results at the most accessible price. Advanced is for those ready for the full regenerative stack.",
  },
  {
    question: "How quickly will I see changes?",
    answer:
      "Most members report changes in skin texture and hydration within 6–8 weeks. Visible changes in tone and hair density are typically noticed by week 12.",
  },
  {
    question: "Can I keep using my topicals?",
    answer:
      "Yes. The protocol works upstream — at the cellular level. Your existing topicals can continue alongside it. They work on different layers.",
  },
  {
    question: "Are there side effects?",
    answer:
      "The compounds in this protocol have a strong safety profile in the literature. Mild site reactions (redness, brief itch) at the injection site are the most commonly reported. Your clinician reviews your intake before prescribing.",
  },
  {
    question: "Is this legal?",
    answer:
      "Yes. This is a physician-prescribed protocol dispensed from a licensed U.S. compounding pharmacy. It is legal and regulated.",
  },
  {
    question: "Can I switch tiers?",
    answer:
      "Yes. Your clinician can upgrade or adjust your tier at any quarterly check-in, or sooner if you reach out.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "We do not currently accept insurance. The protocol is self-pay. FSA/HSA funds can typically be used for the clinician visit portion.",
  },
];

function GlowFAQSection() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="relative -mt-7 rounded-t-[32px] bg-[#F7F7F8] py-12 md:mt-0 md:py-20 md:!pt-20 md:!pb-10">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-3 text-balance font-title text-4xl font-medium text-slate-900 md:text-5xl">
          Glow questions.{" "}
          <span className="font-playfair italic text-[#6D6FFC]">Honest answers.</span>
        </h2>
        <p className="mb-16 max-w-lg text-start text-sm text-gray-600">
          Everything we get asked about regenerative therapy. Want a real answer? Message a
          HealSend clinician for free before you commit.
        </p>

        <div className="flex flex-col gap-4">
          {GLOW_FAQS.map((faq, idx) => (
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
                <div className="flex shrink-0 items-center justify-center rounded-full bg-[#333333] p-1.5 md:p-2">
                  {openFaq === idx ? (
                    <Minus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
                  ) : (
                    <Plus className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
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
          <Link href={CTA_HREF} className="hs-solid-btn w-full rounded-full px-10 py-4 text-center text-base font-semibold sm:w-auto">
            Choose your tier
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
/*  13. Closing CTA                                                    */
/* ------------------------------------------------------------------ */

function GlowClosingCTA() {
  return (
    <section className="bg-[#3d35b5] py-20 text-center text-white md:py-28">
      <div className="mx-auto max-w-[640px] px-4">
        <h2 className="mb-5 font-title text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          Skin that{" "}
          <span className="font-playfair italic text-[#FF6B35]">regenerates.</span>
          <br />
          Not just covers up.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-white/80 md:text-lg">
          Take the 90-second consultation. A clinician reviews your case within 48 hours of your
          labs. No charge until your protocol is approved.
        </p>
        <Link
          href={CTA_HREF}
          className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#e55a26]"
        >
          Choose your tier →
        </Link>
        <p className="mt-6 text-xs text-white/50">
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

export default function GlowLandingPage({ product }) {
  const productData = mergeProductContent(product);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <GlowWillpowerSection />
      <GlowProductHeroSection />
      <MediaLogosBanner />
      <GlowThreeTiersSection />
      <RestoredTirzepatideBenefitsCarouselSection productData={productData} isHomepage heading="Glow Benefits" />
      <GlowProtocolSupportSection />
      <GlowHowItWorksSection />
      <GlowTestimonialsSection />
      <GlowPainPointsSection />
      <GlowPromiseSection />
      <GlowResearchSection />
      <GlowStepsSection />
      {/* <GlowUpgradeBanner /> */}
      <CleanSimpleEffective productData={null} />
      <LabTested productData={null} />
      <MarketingTrustMarquee items={GLOW_TRUST_ITEMS} edgeToEdge={false} />
      <SameMedicationSection planLabel="Personalized, clinically-proven skin & hair plans" />
      <GlowFAQSection />
      <SupportAvailabilitySection />
      <GlowClosingCTA />
      <MarketingFooter />
    </div>
  );
}
