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
  { name: "Foundational", price: 99, isFeatured: false },
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
                  *$99 applies to the Foundational tier first month. Enhanced is $179/mo and Advanced Stack is $299/mo. Final tier and pricing depends on clinician review. Cancel anytime.
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

          <div className="rounded-[1rem] bg-gray-100 p-4 text-xs leading-relaxed text-gray-700">
            The statements on this page have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure or prevent any disease.
          </div>
          <div className="mt-3 text-[11px] leading-relaxed text-gray-600">
            <p>
              *Pricing shown applies to the Foundational tier. Final treatment fit and pricing depend
              on clinician review and the tier prescribed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Three Tiers                                                     */
/* ------------------------------------------------------------------ */

const GLOW_TIERS = [
  {
    tag: "TIER 01",
    title: "Foundational Regenerative",
    image: "https://plus.unsplash.com/premium_photo-1682096433084-b68c0cf072b8?auto=format&fit=crop&w=800&q=80",
    descriptionBullets: [
      "Gentle entry-level dose for first-time users",
      "Supports skin hydration, tone, and texture",
      "Daily subcutaneous self-injection — painless",
      "Clinician access included from day one",
    ],
    price: 99,
    originalPrice: 129,
    featured: false,
    checks: [
      "Single-compound protocol — gentle entry-level dose",
      "Designed to help support skin hydration & tone",
      "Daily subcutaneous, painless",
      "Clinician access included",
      "Quarterly progress check-ins",
    ],
    crosses: ["No advanced cellular renewal stack", "No hair-density pathway support"],
    orangePlus: [],
    cta: "Start Foundational",
    footnote: "Cancel anytime · No surprise renewals",
    ctaClass: "border border-[#6D6FFC] text-[#6D6FFC] hover:bg-[#6D6FFC] hover:text-white",
  },
  {
    tag: "TIER 02",
    title: "Enhanced Skin & Hair Optimization",
    image: "https://plus.unsplash.com/premium_photo-1682096435591-54a1758e6723?auto=format&fit=crop&w=800&q=80",
    descriptionBullets: [
      "Stronger cellular-renewal + collagen pathway",
      "Hair density support included",
      "Most visible 12-week results of any tier",
      "Clinician access + quarterly progress labs",
    ],
    price: 179,
    originalPrice: 229,
    featured: true,
    checks: [
      "Dual-compound protocol — cellular renewal + collagen pathway",
      "Hair density support included",
      "May support visible improvement in tone & texture by week 12",
      "Designed to help skin barrier function",
      "Daily subcutaneous, painless",
      "Clinician access + quarterly labs",
    ],
    crosses: ["No regenerative wound-healing add-on"],
    orangePlus: [],
    cta: "Start Enhanced",
    footnote: "Most popular · Cancel anytime",
    ctaClass: "bg-[#1a1a2e] text-white hover:bg-[#2d2d4e]",
  },
  {
    tag: "TIER 03",
    title: "Advanced Regenerative Stack",
    image: "https://plus.unsplash.com/premium_photo-1706800175278-4b39bab8ffc2?auto=format&fit=crop&w=800&q=80",
    descriptionBullets: [
      "Full cellular-renewal stack — triple compound",
      "Hair density + tissue repair pathway",
      "Broader systemic regenerative effect",
      "Priority same-day clinician access",
    ],
    price: 299,
    originalPrice: 399,
    featured: false,
    checks: [
      "Triple-compound protocol — full regenerative stack",
      "Hair density + tissue repair pathway",
      "Broader cellular renewal effect",
      "Designed to help systemic recovery",
    ],
    crosses: [],
    orangePlus: [
      "+ Includes regenerative wound-healing add-on",
      "+ Priority clinician access (same-day)",
      "+ Bi-monthly progress labs",
    ],
    cta: "Start Advanced",
    footnote: "For experienced peptide users · Cancel anytime",
    ctaClass: "border border-[#6D6FFC] text-[#6D6FFC] hover:bg-[#6D6FFC] hover:text-white",
  },
];

function GlowTierCard({ tier }) {
  const [expanded, setExpanded] = useState(false);
  const hasFeatures =
    tier.checks.length + tier.orangePlus.length + tier.crosses.length > 0;

  return (
    <div className="relative flex flex-col">
      {tier.featured && (
        <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
          <span className="inline-block rounded-full bg-[#FF6B35] px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
            Most Members Start Here
          </span>
        </div>
      )}

      {/* Main card */}
      <div
        className={`flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm ${
          tier.featured
            ? "border-2 border-[#6D6FFC] ring-4 ring-[#6D6FFC]/10"
            : "border-gray-200"
        } ${tier.featured ? "pt-4" : ""}`}
      >
        <div className="flex flex-col p-6 md:p-7">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#6D6FFC]">
            {tier.tag}
          </p>
          <h3 className="mb-3 min-h-[4rem] font-title text-2xl font-bold text-gray-900">
            {tier.title}
          </h3>

          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
            <Image
              src={tier.image}
              alt={tier.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 400px"
            />
          </div>

          {/* Description as bullet points */}
          <ul className="mb-5 space-y-2">
            {tier.descriptionBullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6D6FFC]" />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="mb-5 flex items-baseline gap-2">
            <span className="font-title text-4xl font-bold text-gray-900">${tier.price}</span>
            <span className="text-sm text-gray-500">/mo</span>
            <span className="text-sm text-gray-400 line-through">${tier.originalPrice}</span>
          </div>

          {/* CTA button */}
          <Link
            href={CTA_HREF}
            className={`flex items-center justify-center rounded-full py-3.5 text-sm font-semibold transition ${tier.ctaClass}`}
          >
            {tier.cta}
          </Link>
          <p className="mt-2 text-center text-xs text-gray-400">{tier.footnote}</p>

          {/* See what's included toggle — below CTA, inside card */}
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

              {/* Expandable features — inside the card, pushes card height */}
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
                      {tier.checks.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC]">
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                          </span>
                          {f}
                        </li>
                      ))}
                      {tier.orangePlus.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm font-medium text-[#FF6B35]">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]">
                            <span className="text-[8px] font-bold text-white">+</span>
                          </span>
                          {f}
                        </li>
                      ))}
                      {tier.crosses.map((f) => (
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

function GlowThreeTiersSection() {
  return (
    <section id="tiers" className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6D6FFC] shadow-sm">
            Three Tiers · One Protocol
          </span>
          <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Start where you are.
          </h2>
          <p className="font-playfair text-3xl italic text-[#6D6FFC] md:text-4xl">
            Step up when you&apos;re ready.
          </p>
          <p className="mx-auto mt-5 max-w-[640px] text-base text-gray-600">
            Most members start at Enhanced — it&apos;s the one with the strongest cellular-renewal
            effect at the most accessible price. Foundational works gently. Advanced is for the all-in.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-3">
          {GLOW_TIERS.map((tier) => (
            <FadeIn key={tier.tag}>
              <GlowTierCard tier={tier} />
            </FadeIn>
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

        <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm md:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <FadeIn>
              <CellDiagram />
            </FadeIn>
            <div className="space-y-6">
              {HOW_STEPS.map((step) => (
                <FadeIn key={step.n}>
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6D6FFC] text-white">
                      <step.icon className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="mb-1 font-title text-lg font-bold text-gray-900">{step.title}</h3>
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
  },
  {
    name: "Jenna P., 41",
    tier: "Foundational → Enhanced · 10 weeks",
    quote:
      "Started Foundational because I wasn't sure. Felt like I was 80% there at week 6, so my clinician moved me to Enhanced. The remaining 20% showed up in the next month.",
    stats: [
      { val: "+27%", label: "Texture (post-upgrade)" },
      { val: "+12%", label: "Hydration" },
    ],
    verified: "Started Foundational, upgraded to Enhanced",
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
                <div className="h-48 w-full bg-[#e8e8f0]" />
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
    bullets: [
      "The 8-product routine isn't doing more than the 3-product one used to.",
      "Texture isn't holding the way it did at 28.",
    ],
  },
  {
    title: "Hair quietly thinned over the last few years.",
    bullets: [
      "The part is wider. The crown looks thinner in photos.",
      "You've watched it happen but haven't found a real fix.",
    ],
  },
  {
    title: "Cuts & injuries take longer to heal.",
    bullets: [
      "Small things linger. Bruises stay too long.",
      "Your body's repair machinery is moving slower than it used to.",
    ],
  },
  {
    title: "You want regenerative — not just cosmetic.",
    bullets: [
      "You've done filler. You've done laser. You're tired of treating symptoms.",
      "You want the underlying cell biology to do its job again.",
    ],
  },
];

function GlowPainPointsSection() {
  return (
    <section className="bg-[#F1F5F9] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-[640px] text-center md:mb-16">
          <p className="mb-3 font-playfair text-lg italic text-gray-600">Sound familiar?</p>
          <h2 className="mb-3 font-title text-4xl font-bold text-gray-900 md:text-5xl">
            Topicals stopped{" "}
            <span className="font-playfair italic text-[#6D6FFC]">holding.</span>
          </h2>
          <p className="text-base text-gray-600">
            If creams and serums plateau every six months, it&apos;s not your routine. Topicals only
            work on the surface. Real change has to happen below it.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {PAIN_CARDS.map((c) => (
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
  return (
    <section className="bg-[#F1F5F9] pb-8 pt-0 md:pb-10">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-[#6D6FFC]/30 bg-white p-8 shadow-sm md:flex-row md:items-center md:gap-10 md:p-10">
          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-2 border-[#6D6FFC]">
            <span className="font-title text-2xl font-bold text-[#6D6FFC]">60</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#6D6FFC]">
              Day Promise
            </span>
          </div>
          <div className="flex-1">
            <h3 className="mb-2 font-title text-xl font-bold leading-snug text-gray-900 md:text-2xl">
              If you don&apos;t see visible change by week 12,{" "}
              <span className="font-playfair italic text-[#6D6FFC]">your first month is free.</span>
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600 md:text-base">
              We&apos;re confident enough in this protocol that we&apos;ll refund your first month if
              you don&apos;t notice meaningful improvement in skin texture, tone, or hair density. No
              fine print. No retention scripts. Email us and it&apos;s done.
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
/*  9. Research                                                        */
/* ------------------------------------------------------------------ */

const RESEARCH_CITATIONS = [
  {
    author: "Pickart & Margolina (2018):",
    desc: "Comprehensive review of GHK-Cu in skin remodeling, collagen synthesis, and barrier repair.",
  },
  {
    author: "Bickers et al. (2017):",
    desc: "Regenerative peptide effects on fibroblast activity and dermal density.",
  },
  {
    author: "Trink et al. (2013):",
    desc: "Peptide signaling in hair follicle cycling and density support.",
  },
  {
    author: "Sigalos & Pastuszak (2018):",
    desc: "Systematic review of regenerative peptide safety profiles in adults.",
  },
];

function GlowResearchSection() {
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
                regenerative research.
              </p>
              <p className="mb-8 max-w-[480px] text-base leading-relaxed text-gray-600">
                The compounds in this protocol family come from the most studied regenerative peptide
                literature available — including dermatology, wound-healing, and hair-cycle research.
              </p>

              <div className="mb-8 divide-y divide-gray-100">
                {RESEARCH_CITATIONS.map((c) => (
                  <div key={c.author} className="grid grid-cols-[auto_1fr] gap-4 py-4">
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{c.author}</span>
                    <span className="text-sm text-gray-600">{c.desc}</span>
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
                    <div className="h-10 w-10 rounded-full bg-gray-300 ring-2 ring-white" />
                    <div className="h-10 w-10 rounded-full bg-gray-200 ring-2 ring-white" />
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
  },
  {
    step: "STEP 2",
    title: "Tier & protocol",
    desc: "A licensed clinician reviews your goals, recommends a tier, and prescribes your personalized regenerative protocol.",
  },
  {
    step: "STEP 3",
    title: "Medication shipped",
    desc: "Discreet packaging, free shipping, all supplies and a video walkthrough for your first dose.",
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
              <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <span className="mb-4 inline-block rounded-full bg-[#1a1a2e] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {s.step}
                </span>
                <div className="mb-4 h-40 w-full rounded-xl bg-[#e8e8f0]" />
                <h3 className="mb-2 font-title text-xl font-bold text-gray-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{s.desc}</p>
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
      "Foundational uses a single compound. Enhanced adds a second compound targeting the collagen pathway plus hair-density support. Advanced adds a third compound with wound-healing and tissue-repair support.",
  },
  {
    question: "Which tier should I start at?",
    answer:
      "Most members start at Enhanced — it has the strongest 12-week results at the most accessible price. If you're new to peptides or want to start gently, Foundational is a valid first step.",
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
          appropriate. 60-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export                                                     */
/* ------------------------------------------------------------------ */

export default function GlowLandingPage({ product }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f9f9f9] font-sans selection:bg-[#7b75f0] selection:text-white">
      <MinimalMarketingNavbar />
      <GlowWillpowerSection />
      <GlowProductHeroSection />
      <GlowThreeTiersSection />
      <GlowProtocolSupportSection />
      <GlowHowItWorksSection />
      <GlowTestimonialsSection />
      <GlowPainPointsSection />
      <GlowPromiseSection />
      <GlowResearchSection />
      <GlowStepsSection />
      <MarketingTrustMarquee items={GLOW_TRUST_ITEMS} edgeToEdge={false} />
      <GlowUpgradeBanner />
      <LabTested productData={null} />
      <GlowFAQSection />
      <SupportAvailabilitySection />
      <GlowClosingCTA />
      <MarketingFooter />
    </div>
  );
}
