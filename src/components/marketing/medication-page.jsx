"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Dumbbell,
  HeartPulse,
  MessageSquare,
  MoonStar,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";
import { MarketingSectionTabs } from "@/components/marketing/content-organizer";
import { MARKETING_ROUTE_PATHS } from "@/lib/marketing-pages";
import {
  getDefaultMarketingImageForPath,
  WORDPRESS_MARKETING_IMAGES,
} from "@/lib/marketing-images";

const CARE_STEP_ICONS = [CheckCircle2, Stethoscope, MessageSquare];
const DETAIL_CARD_ICONS = [
  Sparkles,
  Target,
  TrendingUp,
  ShieldCheck,
  HeartPulse,
  Dumbbell,
];
const DEFAULT_TAB_ORDER = ["overview", "benefits", "faq"];

function stripHtmlToText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractParagraphs(html, limit = 2) {
  const matches = [...String(html || "").matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];
  const items = matches
    .map((match) => stripHtmlToText(match[1]))
    .filter((value) => value.length >= 40);

  return [...new Set(items)].slice(0, limit);
}

function extractListItems(html, limit = 4) {
  const matches = [...String(html || "").matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)];
  const items = matches
    .map((match) => stripHtmlToText(match[1]))
    .filter((value) => value.length >= 8 && value.length <= 180);

  return [...new Set(items)].slice(0, limit);
}

function getHeroSurfaceConfig(supportHref) {
  if (supportHref === MARKETING_ROUTE_PATHS.strength) {
    return {
      surface: "bg-[#b7d1ae]",
      accent: "bg-[#20221f]",
      accentText: "text-white",
      imageWrap: "bg-[radial-gradient(circle_at_top,#e6f3df_0%,#b7d1ae_68%)]",
      softCard: "bg-[#f2f7ed]",
    };
  }

  if (supportHref === MARKETING_ROUTE_PATHS.weightLoss) {
    return {
      surface: "bg-[#d7e7bd]",
      accent: "bg-[#1f2615]",
      accentText: "text-white",
      imageWrap: "bg-[radial-gradient(circle_at_top,#f2f8e7_0%,#d7e7bd_68%)]",
      softCard: "bg-[#f4f8eb]",
    };
  }

  if (supportHref === MARKETING_ROUTE_PATHS.sexualHealth) {
    return {
      surface: "bg-[#e7cad0]",
      accent: "bg-[#2a161c]",
      accentText: "text-white",
      imageWrap: "bg-[radial-gradient(circle_at_top,#f8eaee_0%,#e7cad0_68%)]",
      softCard: "bg-[#faf0f2]",
    };
  }

  if (supportHref === MARKETING_ROUTE_PATHS.psychiatry) {
    return {
      surface: "bg-[#cfd7ff]",
      accent: "bg-[#1a1f35]",
      accentText: "text-white",
      imageWrap: "bg-[radial-gradient(circle_at_top,#edf0ff_0%,#cfd7ff_68%)]",
      softCard: "bg-[#f2f4ff]",
    };
  }

  return {
    surface: "bg-[#dbe6ef]",
    accent: "bg-[#1b2026]",
    accentText: "text-white",
    imageWrap: "bg-[radial-gradient(circle_at_top,#eef4f8_0%,#dbe6ef_68%)]",
    softCard: "bg-[#f4f7fa]",
  };
}

function getHighlightIcon(text) {
  const value = String(text || "").toLowerCase();

  if (/(energy|vitality|boost|focus)/.test(value)) {
    return Zap;
  }

  if (/(strength|muscle|recovery|performance|lean|hormone)/.test(value)) {
    return Target;
  }

  if (/(metabolism|fat|weight|body composition)/.test(value)) {
    return TrendingUp;
  }

  if (/(sleep|rest)/.test(value)) {
    return MoonStar;
  }

  if (/(doctor|provider|clinician|prescribed|prescription|safety)/.test(value)) {
    return ShieldCheck;
  }

  return Sparkles;
}

function normalizeBenefitText(value) {
  let text = stripHtmlToText(value)
    .replace(/^and\s+/i, "")
    .replace(/\$\$+/g, "$")
    .replace(/\bdoctor-prescribed\b/gi, "clinician-reviewed")
    .replace(/\bno hidden fees\b/gi, "transparent pricing")
    .replace(/\bdiscount auto-applied at checkout\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const verbMatch = text.match(
    /\b(Boosts|Improves|Supports|Helps|Promotes|Enhances|Encourages|Reduces)\b/i,
  );
  if (verbMatch && verbMatch.index > 0 && verbMatch.index < 20) {
    text = text.slice(verbMatch.index).trim();
  }

  if (
    !text ||
    text.length < 18 ||
    text.length > 96 ||
    !/\s/.test(text) ||
    text.split(/\s+/).length > 12 ||
    /^\$/.test(text) ||
    /^then\s+\$/i.test(text) ||
    /(monthly plan|3-month plan|klarna|afterpay|trustindex|step\s*\d+)/i.test(text)
  ) {
    return null;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeDisplayPrice(value) {
  return String(value || "")
    .replace(/\$\$+/g, "$")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveTreatmentHeroImage(heroImage, supportHref) {
  const image = String(heroImage || "").trim();
  const fallback = getDefaultMarketingImageForPath(supportHref);

  if (!image) {
    return fallback;
  }

  if (
    image === WORDPRESS_MARKETING_IMAGES.nadInjection &&
    supportHref !== MARKETING_ROUTE_PATHS.antiAging
  ) {
    return fallback;
  }

  return image;
}

function buildBenefitItems(page) {
  const extractedBullets = (page.sectionBlocks || []).flatMap((section) =>
    extractListItems(section.html, 5),
  );

  const fallback = [
    page.clusterDescription,
    page.description,
    ...extractedBullets,
    ...(page.careSteps || []).map((step) => step.description),
    page.safetyNote,
  ].filter(Boolean);

  const items = [...(page.highlights || []), ...fallback]
    .map((value) => normalizeBenefitText(value))
    .filter(Boolean);

  return [...new Set(items)].slice(0, 6).map((text) => ({
    text,
    icon: getHighlightIcon(text),
  }));
}

function buildHeroStats(page) {
  const stats = [];

  if (page.offerDetails?.primaryPrice) {
    stats.push({
      label: "Starts at",
      value: page.offerDetails.primaryPrice,
      icon: BadgeCheck,
    });
  }

  if (page.careSteps?.length) {
    stats.push({
      label: "Care path",
      value: `${page.careSteps.length} steps`,
      icon: Clock3,
    });
  }

  if (page.faqItems?.length) {
    stats.push({
      label: "Questions answered",
      value: `${page.faqItems.length}+`,
      icon: MessageSquare,
    });
  }

  return stats.slice(0, 3);
}

function buildDetailCards(page) {
  const cards = (page.sectionBlocks || [])
    .filter((section) => section?.id && section?.title)
    .slice(0, 6)
    .map((section, index) => {
      const paragraphs = extractParagraphs(section.html, 2);
      const bullets = extractListItems(section.html, 4);
      const description =
        paragraphs[0] ||
        section.summary ||
        stripHtmlToText(section.html).slice(0, 180);

      return {
        id: section.id,
        title: section.title,
        description,
        paragraphs,
        bullets,
        icon: DETAIL_CARD_ICONS[index % DETAIL_CARD_ICONS.length],
      };
    });

  if (cards.length > 0) {
    return cards;
  }

  return [
    {
      id: "overview",
      title: "Treatment overview",
      description: page.description,
      paragraphs: [page.clusterDescription || page.description].filter(Boolean),
      bullets: (page.highlights || []).slice(0, 4),
      icon: Sparkles,
    },
  ];
}

function ProductStyleFaq({ items }) {
  const [openFaq, setOpenFaq] = useState(0);

  if (!items?.length) {
    return null;
  }

  return (
    <section className="bg-[#f9f9f9] px-4 py-20 md:px-8 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
            Frequently asked
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Common questions about treatment, timing, and safety.
          </h2>
          <p className="text-base leading-8 text-gray-600">
            Review the most common questions patients ask before starting,
            while taking, and while following up on treatment.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((faq, idx) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-[1rem] bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="flex w-full items-center justify-between px-5 py-5 text-left md:px-6 md:py-6"
              >
                <span className="pr-4 text-base font-bold text-gray-900 md:text-lg">
                  {faq.question}
                </span>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem] bg-[#333333] text-white">
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-90" : ""
                    }`}
                    strokeWidth={2.5}
                  />
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === idx ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.26, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4 text-sm leading-7 text-gray-600 md:px-6 md:pb-6 md:text-base">
                      {faq.answerText}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TreatmentSummaryExplorer({ page }) {
  const detailCards = useMemo(() => buildDetailCards(page), [page]);
  const [activeId, setActiveId] = useState(detailCards[0]?.id || "");
  const activeCard =
    detailCards.find((card) => card.id === activeId) || detailCards[0];

  if (!activeCard) {
    return null;
  }

  return (
    <section className="bg-white px-4 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
            Treatment guide
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Explore the most important details in focused sections.
          </h2>
          <p className="text-base leading-8 text-gray-600">
            Use the panels below to review how treatment works, what to expect,
            and where to go next.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {detailCards.map((card) => {
            const Icon = card.icon;
            const isActive = card.id === activeCard.id;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveId(card.id)}
                className={`rounded-[1.5rem] border p-5 text-left transition-all ${
                  isActive
                    ? "border-[#7b75f0] bg-[#f7f4ff] shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#cfc8ff] hover:bg-[#fbfaff]"
                }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#6d5ce7] shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                  {card.title}
                </h3>
                <p className="text-sm leading-7 text-gray-600">{card.description}</p>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={activeCard.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="grid gap-6 rounded-[2rem] bg-[#f4f5f9] p-6 md:p-8 xl:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm md:p-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
                In this section
              </p>
              <h3 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                {activeCard.title}
              </h3>

              <div className="space-y-4">
                {(activeCard.paragraphs.length > 0
                  ? activeCard.paragraphs
                  : [activeCard.description]
                ).map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.5rem] bg-white p-6 shadow-sm md:p-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
                  Key takeaways
                </p>
                <div className="space-y-3">
                  {(activeCard.bullets.length > 0
                    ? activeCard.bullets
                    : buildBenefitItems(page).slice(0, 4).map((item) => item.text)
                  ).map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3efff] text-[#6d5ce7]">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-7 text-gray-600">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>

              {page.safetyNote ? (
                <div className="rounded-[1.5rem] border border-[#f1d0d0] bg-[#fff7f7] p-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#c45a5a]">
                    Safety note
                  </p>
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#c45a5a]" />
                    <p className="text-sm leading-7 text-[#5f5b70]">{page.safetyNote}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </section>
  );
}

function TreatmentHero({ page, supportHref, supportLabel, secondaryHref, secondaryLabel }) {
  const [activeTab, setActiveTab] = useState("overview");
  const heroSurface = getHeroSurfaceConfig(supportHref);
  const benefitItems = useMemo(() => buildBenefitItems(page), [page]);
  const faqPreview = (page.faqItems || []).slice(0, 4);
  const heroStats = buildHeroStats(page);
  const heroImage = resolveTreatmentHeroImage(page.heroImage, supportHref);
  const primaryPrice = normalizeDisplayPrice(page.offerDetails?.primaryPrice);
  const secondaryPrice = normalizeDisplayPrice(page.offerDetails?.secondaryPrice);
  const tabOrder = DEFAULT_TAB_ORDER.filter((tab) => {
    if (tab === "faq") {
      return faqPreview.length > 0;
    }
    return true;
  });

  return (
    <section className="bg-[#f9f9f9] px-4 py-12 md:px-8 lg:px-16">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-center gap-6 lg:flex-row lg:gap-8 xl:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`relative flex aspect-[4/5] w-full shrink-0 items-center justify-center overflow-hidden rounded-[1rem] ${heroSurface.surface} lg:sticky lg:top-8 lg:w-[55%] lg:self-start xl:w-[740px]`}
        >
          <div className={`absolute inset-0 ${heroSurface.imageWrap}`} />
          <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-2">
            <span className={`rounded-[1rem] px-4 py-2 text-sm font-medium shadow-sm ${heroSurface.accent} ${heroSurface.accentText}`}>
              {page.eyebrow}
            </span>
            {primaryPrice ? (
              <span className="rounded-[1rem] bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm backdrop-blur-sm">
                {primaryPrice}
              </span>
            ) : null}
          </div>

          {heroImage ? (
            <img
              src={heroImage}
              alt={page.title}
              className="relative z-[1] h-full w-full rounded-[1rem] object-cover"
            />
          ) : (
            <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#6d5ce7] shadow-lg">
                <Pill className="h-9 w-9" />
              </div>
              <p className="max-w-sm text-base font-medium leading-7 text-[#2f3240]">
                Clinician-guided treatment information with clear next steps.
              </p>
            </div>
          )}

          {heroStats.length > 0 ? (
            <div className="absolute bottom-6 left-6 right-6 z-10 grid gap-3 md:grid-cols-3">
              {heroStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={`${stat.label}-${stat.value}`}
                    className="rounded-[1rem] bg-white/88 p-4 shadow-sm backdrop-blur-md"
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3efff] text-[#6d5ce7]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
          className="flex w-full shrink-0 flex-col lg:w-[45%] xl:w-[450px]"
        >
          <h1 className="mb-5 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {page.title}
          </h1>

          <p className="mb-6 text-base leading-8 text-gray-600 md:text-lg">
            {page.description}
          </p>

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {benefitItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="flex items-start gap-3 rounded-[1rem] border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3efff] text-[#6d5ce7]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium leading-6 text-[#433f53]">{item.text}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mb-8 overflow-hidden rounded-[1rem] border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-center gap-2 bg-[#fde073] px-4 py-3 text-sm font-medium text-gray-900 md:text-base">
              <BadgeCheck className="h-4 w-4 md:h-5 md:w-5" />
              Clinician-guided treatment with clear next steps
            </div>
            <div className="p-5 md:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 md:text-4xl">
                      {primaryPrice || "Provider reviewed"}
                    </span>
                    <span className="text-lg font-medium text-gray-800 md:text-xl">
                      {primaryPrice ? "starting point" : "support path"}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 md:text-base">
                    {secondaryPrice ||
                      page.clusterDescription ||
                      "Review pricing context, treatment details, and next steps in one place."}
                  </div>
                </div>
                <div className="flex gap-1.5 pt-2">
                  <span className="flex items-center rounded-[1rem] bg-[#f0f2f4] px-2.5 py-1 text-[10px] font-bold text-black md:text-xs">
                    Secure
                  </span>
                  <span className="flex items-center rounded-[1rem] bg-[#edf4e9] px-2.5 py-1 text-[10px] font-bold text-black md:text-xs">
                    Clinician reviewed
                  </span>
                </div>
              </div>

              <Link
                href={supportHref}
                className="block w-full rounded-[1rem] bg-[#141414] py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-black md:py-4"
              >
                {supportLabel}
              </Link>
              <Link
                href={secondaryHref}
                className="mt-3 block w-full rounded-[1rem] border border-gray-200 bg-white py-3.5 text-center text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 md:py-4"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>

          <div className="rounded-[1rem] border border-gray-200 bg-white p-2 shadow-sm">
            <div className="mb-4 flex rounded-[1rem] bg-gray-100 p-1.5">
              {tabOrder.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-[1rem] py-2.5 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-hidden p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="space-y-5"
                >
                  {activeTab === "overview" ? (
                    <div className="space-y-4">
                      <div className={`rounded-[1rem] border border-gray-200 p-4 ${heroSurface.softCard}`}>
                        <p className="text-sm leading-7 text-gray-600">
                          {page.clusterDescription || page.description}
                        </p>
                      </div>
                      {page.safetyNote ? (
                        <div className="flex gap-3 rounded-[1rem] border border-[#f1d0d0] bg-[#fff7f7] p-4">
                          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#c45a5a]" />
                          <p className="text-sm leading-7 text-[#5f5b70]">{page.safetyNote}</p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {activeTab === "benefits" ? (
                    <div className="space-y-4">
                      {benefitItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.text} className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3efff] text-[#6d5ce7]">
                              <Icon className="h-5 w-5" />
                            </div>
                            <p className="text-sm leading-7 text-gray-600">{item.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {activeTab === "faq" ? (
                    <div className="space-y-3">
                      {faqPreview.map((item) => (
                        <div
                          key={item.question}
                          className="rounded-[1rem] border border-gray-200 bg-[#fafafa] p-4"
                        >
                          <p className="font-semibold text-gray-900">{item.question}</p>
                          <p className="mt-2 text-sm leading-7 text-gray-600">
                            {item.answerText}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TreatmentContextSection({ page, supportHref, supportLabel }) {
  const benefitItems = buildBenefitItems(page).slice(0, 4);

  return (
    <section className="bg-[#f4f5f9] py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="relative flex flex-col justify-between gap-12 overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm md:flex-row md:p-16">
          <div className="z-10 flex-1">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              {page.clusterTitle || "Treatment context"}
            </p>
            <h2 className="mb-4 text-3xl font-black leading-[1.1] tracking-tight text-[#1c1d20] md:text-4xl">
              How this treatment fits into your care plan.
            </h2>

            <p className="mb-8 max-w-2xl text-lg leading-8 text-gray-600">
              {page.clusterDescription || page.description}
            </p>

            <ul className="mb-10 space-y-4">
              {benefitItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.text} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3efff] text-[#6d5ce7]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-base text-[#1c1d20] md:text-[1.1rem]">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href={supportHref}
                className="w-full rounded-full bg-[#7b75f0] px-10 py-4 text-center text-[1.05rem] font-bold text-white transition-colors hover:bg-[#665ce0] sm:w-auto"
              >
                {supportLabel}
              </Link>
              <Link
                href={MARKETING_ROUTE_PATHS.shop}
                className="w-full rounded-full border-2 border-[#7b75f0] px-10 py-4 text-center text-[1.05rem] font-bold text-[#7b75f0] transition-colors hover:bg-[#7b75f0]/5 sm:w-auto"
              >
                Browse treatments
              </Link>
            </div>
          </div>

          <div className="z-0 flex w-full flex-1 items-start justify-center md:absolute md:right-16 md:top-16 md:w-[34%] md:justify-end">
            <div className="w-full max-w-[340px] rounded-[2rem] bg-[#f8f6ff] p-6 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#6d5ce7] shadow-sm">
                <HeartPulse className="h-7 w-7" />
              </div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
                Support built in
              </p>
              <h3 className="mb-3 text-2xl font-bold tracking-tight text-[#1c1d20]">
                Guidance, support, and follow-through in one place.
              </h3>
              <p className="text-sm leading-7 text-gray-600">
                Move from treatment details to clinician review, delivery, and
                follow-up care with a clearer path from start to finish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TreatmentDetailsExplorer({
  page,
  supportHref,
  supportLabel,
  secondaryHref,
  secondaryLabel,
}) {
  const hasStructuredSections =
    Boolean(page.introHtml) || (page.sectionBlocks?.length || 0) > 0;
  const useTabbedSections = (page.sectionBlocks?.length || 0) >= 4;

  if (!hasStructuredSections) {
    return <TreatmentSummaryExplorer page={page} />;
  }

  return (
    <section className="bg-white px-4 py-24 md:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1400px] gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              Treatment details
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Review the full treatment guide in one place.
            </h2>
            <p className="text-base leading-8 text-gray-600">
              Explore benefits, use, safety information, and common questions
              in a clearer reading flow.
            </p>
          </div>

          {page.introHtml ? (
            <div
              className="marketing-wysiwyg rounded-[1.75rem] border border-black/5 bg-[#fbf9ff] p-6 shadow-sm md:p-8"
              dangerouslySetInnerHTML={{ __html: page.introHtml }}
            />
          ) : null}

          {page.sectionBlocks?.length ? (
            <div className={page.introHtml ? "mt-8" : ""}>
              {useTabbedSections ? (
                <MarketingSectionTabs sections={page.sectionBlocks} />
              ) : (
                <div className="space-y-8">
                  {page.sectionBlocks.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm md:p-8"
                    >
                      <div className="mb-5 flex flex-col gap-3 border-b border-black/5 pb-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
                          Section
                        </p>
                        <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                          {section.title}
                        </h3>
                        {section.summary ? (
                          <p className="max-w-3xl text-sm leading-7 text-[#5f5b70]">
                            {section.summary}
                          </p>
                        ) : null}
                      </div>
                      <div
                        className="marketing-wysiwyg"
                        dangerouslySetInnerHTML={{ __html: section.html }}
                      />
                    </section>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          {page.sectionBlocks?.length ? (
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
                On this page
              </p>
              <div className="space-y-2">
                {page.sectionBlocks.map((section) =>
                  useTabbedSections ? (
                    <div
                      key={section.id}
                      className="rounded-2xl border border-black/5 px-4 py-3 text-sm font-semibold text-[#26232f]"
                    >
                      {section.title}
                    </div>
                  ) : (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block rounded-2xl border border-black/5 px-4 py-3 text-sm font-semibold text-[#26232f] transition-colors hover:bg-[#faf9fe]"
                    >
                      {section.title}
                    </a>
                  ),
                )}
              </div>
            </div>
          ) : null}

          <div className="rounded-[2rem] border border-black/5 bg-[#f7f5ff] p-6 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
              Next step
            </p>
            <h3 className="mb-3 text-2xl font-bold tracking-tight text-black">
              Ready to continue?
            </h3>
            <p className="mb-6 text-sm leading-7 text-[#5f5b70]">
              Start the intake for this treatment or browse other options when
              you’re ready to move forward.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={supportHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25242a]"
              >
                {supportLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#26232f] transition-colors hover:bg-[#faf9fe]"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function TreatmentStepsSection({ page, supportHref, supportLabel }) {
  if (!page.careSteps?.length) {
    return null;
  }

  return (
    <section className="bg-[#f4f5f9] py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-16 text-center">
          <h2 className="mx-auto mb-10 w-full text-[2.5rem] font-semibold leading-[1.15] tracking-tight text-[#1c1d20] md:text-[3rem] lg:text-[3.5rem]">
            How treatment works
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={supportHref}
              className="w-full rounded-full bg-[#7b75f0] px-10 py-4 text-center text-[1.1rem] font-bold text-white transition-colors hover:bg-[#665ce0] sm:w-auto"
            >
              {supportLabel}
            </Link>
            <Link
              href={MARKETING_ROUTE_PATHS.shop}
              className="w-full rounded-full border-2 border-[#7b75f0] px-10 py-4 text-center text-[1.1rem] font-bold text-[#7b75f0] transition-colors hover:bg-[#7b75f0]/5 sm:w-auto"
            >
              View treatment catalog
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {page.careSteps.map((step, index) => {
            const Icon = CARE_STEP_ICONS[index] || CheckCircle2;

            return (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white px-8 pt-10 shadow-sm"
              >
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efff] text-[#6d5ce7]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-[0.78rem] font-bold tracking-[0.18em] text-[#8a8d98]">
                    STEP {index + 1}
                  </div>
                </div>

                <h3 className="mb-6 text-[1.45rem] font-bold leading-[1.25] text-[#1c1d20]">
                  {step.title}
                </h3>

                <p className="pb-8 text-[1rem] leading-[1.7] text-[#4a4d57]">
                  {step.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TreatmentSupportStrip({ supportHref, supportLabel, secondaryHref, secondaryLabel }) {
  const blocks = [
    {
      title: "Clinician review",
      description:
        "A licensed clinician reviews your health history, goals, and treatment fit before medication moves forward.",
      icon: ShieldCheck,
    },
    {
      title: "Ongoing follow-up",
      description:
        "Stay connected through refills, progress updates, and support after your first order.",
      icon: MessageSquare,
    },
    {
      title: "Clear treatment guidance",
      description:
        "Review benefits, safety information, and next steps without losing the most important details.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="bg-white px-4 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              What to expect
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Care that stays clear from intake to follow-up.
            </h2>
            <p className="text-base leading-8 text-gray-600">
              See how treatment details, clinician review, and ongoing support
              fit together before you begin.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={supportHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              {supportLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {blocks.map((block) => {
            const Icon = block.icon;

            return (
              <article
                key={block.title}
                className="rounded-[1.5rem] border border-gray-200 bg-[#fafafa] p-6 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#6d5ce7] shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-gray-900">
                  {block.title}
                </h3>
                <p className="text-sm leading-7 text-gray-600">{block.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function MarketingMedicationPage({ page }) {
  const supportHref = page.primaryCta?.href || MARKETING_ROUTE_PATHS.psychiatry;
  const supportLabel = page.primaryCta?.label || "Explore treatment options";
  const secondaryHref = page.secondaryCta?.href || MARKETING_ROUTE_PATHS.login;
  const secondaryLabel = page.secondaryCta?.label || "Access your account";

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <TreatmentHero
        page={page}
        supportHref={supportHref}
        supportLabel={supportLabel}
        secondaryHref={secondaryHref}
        secondaryLabel={secondaryLabel}
      />

      <TreatmentContextSection
        page={page}
        supportHref={supportHref}
        supportLabel={supportLabel}
      />

      <TreatmentDetailsExplorer
        page={page}
        supportHref={supportHref}
        supportLabel={supportLabel}
        secondaryHref={secondaryHref}
        secondaryLabel={secondaryLabel}
      />

      <TreatmentStepsSection
        page={page}
        supportHref={supportHref}
        supportLabel={supportLabel}
      />

      <ProductStyleFaq items={page.faqItems} />

      <TreatmentSupportStrip
        supportHref={supportHref}
        supportLabel={supportLabel}
        secondaryHref={secondaryHref}
        secondaryLabel={secondaryLabel}
      />

      <MarketingFooter />
    </div>
  );
}
