import Link from "next/link";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";
import { LEGAL_ROUTE_PATHS, SUPPORT_EMAIL } from "@/lib/legal-links";
import AppIcon from "@/components/ui/AppIcon";

const LEGAL_NAV_ITEMS = [
  {
    href: LEGAL_ROUTE_PATHS.privacy,
    label: "Privacy Policy",
    icon: "shield",
    eyebrow: "Data protection",
  },
  {
    href: LEGAL_ROUTE_PATHS.terms,
    label: "Terms of Service",
    icon: "description",
    eyebrow: "Platform agreement",
  },
  {
    href: LEGAL_ROUTE_PATHS.telehealthConsent,
    label: "Telehealth Consent",
    icon: "video_call",
    eyebrow: "Care delivery",
  },
  {
    href: LEGAL_ROUTE_PATHS.safety,
    label: "Safety Information",
    icon: "health_and_safety",
    eyebrow: "Medication safety",
  },
  {
    href: LEGAL_ROUTE_PATHS.consumerHealthData,
    label: "Consumer Health Data",
    icon: "lock_person",
    eyebrow: "Health data rights",
  },
  {
    href: LEGAL_ROUTE_PATHS.refund,
    label: "Refund Policy",
    icon: "receipt_long",
    eyebrow: "Billing & refunds",
  },
];

const PAGE_HERO_CONFIG = {
  "privacy-policy": {
    icon: "shield",
    accentColor: "#7b75f0",
    bgGradient:
      "radial-gradient(circle at top right, rgba(123,117,240,0.18) 0%, transparent 55%), linear-gradient(160deg, #f8f6ff 0%, #eeeaff 100%)",
    iconBg: "bg-[#7b75f0]/10",
    iconColor: "text-[#7b75f0]",
    highlights: ["HIPAA compliant", "U.S.-only", "No data selling"],
    effectiveDate: "October 5, 2025",
    badge: "Data Protection",
  },
  "terms-of-service-2": {
    icon: "description",
    accentColor: "#0ea5e9",
    bgGradient:
      "radial-gradient(circle at top right, rgba(14,165,233,0.15) 0%, transparent 55%), linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 100%)",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    highlights: ["26 sections", "Wyoming law", "Binding agreement"],
    effectiveDate: "October 5, 2025",
    badge: "Platform Agreement",
  },
  "consent-to-telehealth-2": {
    icon: "video_call",
    accentColor: "#10b981",
    bgGradient:
      "radial-gradient(circle at top right, rgba(16,185,129,0.15) 0%, transparent 55%), linear-gradient(160deg, #f0fdf4 0%, #dcfce7 100%)",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    highlights: ["All 50 states", "HIPAA encrypted", "Revocable anytime"],
    effectiveDate: "October 5, 2025",
    badge: "Telehealth Care",
  },
  "safety-information": {
    icon: "health_and_safety",
    accentColor: "#f59e0b",
    bgGradient:
      "radial-gradient(circle at top right, rgba(245,158,11,0.15) 0%, transparent 55%), linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%)",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    highlights: ["FDA disclosure", "Drug interactions", "Emergency guidance"],
    effectiveDate: "Current",
    badge: "Medication Safety",
  },
  "consumer-health-data": {
    icon: "lock_person",
    accentColor: "#8b5cf6",
    bgGradient:
      "radial-gradient(circle at top right, rgba(139,92,246,0.15) 0%, transparent 55%), linear-gradient(160deg, #faf5ff 0%, #ede9fe 100%)",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    highlights: ["WA MHMDA", "BIPA compliant", "No data sales"],
    effectiveDate: "October 5, 2025",
    badge: "Health Data Rights",
  },
  "refund-policy": {
    icon: "receipt_long",
    accentColor: "#0d9488",
    bgGradient:
      "radial-gradient(circle at top right, rgba(13,148,136,0.15) 0%, transparent 55%), linear-gradient(160deg, #f0fdfa 0%, #ccfbf1 100%)",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    highlights: ["30-day processing", "Prorated refunds", "No hidden fees"],
    effectiveDate: "October 7, 2025",
    badge: "Billing & Refunds",
  },
};

const DEFAULT_HERO_CONFIG = {
  icon: "gavel",
  accentColor: "#7b75f0",
  bgGradient:
    "radial-gradient(circle at top right, rgba(123,117,240,0.15) 0%, transparent 55%), linear-gradient(160deg, #f8f6ff 0%, #eeeaff 100%)",
  iconBg: "bg-[#7b75f0]/10",
  iconColor: "text-[#7b75f0]",
  highlights: ["Legally binding", "Updated 2025"],
  effectiveDate: "October 5, 2025",
  badge: "Legal",
};

function LegalHeroVisual({ config, title }) {
  const {
    icon,
    iconBg,
    iconColor,
    bgGradient,
    highlights = [],
    effectiveDate,
    badge,
  } = config;

  return (
    <div
      className="flex h-full min-h-[260px] flex-col items-start justify-between overflow-hidden rounded-[2rem] border border-black/5 p-8 shadow-sm md:min-h-[300px]"
      style={{ background: bgGradient }}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
      >
        <AppIcon name={icon} className={`text-2xl ${iconColor}`} />
      </div>

      <div className="mt-auto">
        {badge ? (
          <span
            className={`mb-3 inline-block rounded-full border border-current/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${iconColor} bg-white/60`}
          >
            {badge}
          </span>
        ) : null}
        <p className="mb-4 text-sm font-semibold text-black">{title}</p>

        {highlights.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[#433f53] backdrop-blur-sm"
              >
                {h}
              </span>
            ))}
          </div>
        ) : null}

        {effectiveDate ? (
          <p className="mt-4 text-[11px] font-medium text-[#5f5b70]">
            Effective: {effectiveDate}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function LegalSideNav({ currentSlug }) {
  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
        Legal library
      </p>
      <div className="space-y-2">
        {LEGAL_NAV_ITEMS.map((item) => {
          const isActive = currentSlug === item.href.replace(/^\//, "");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-black/5 text-[#26232f] hover:bg-[#faf9fe]"
              }`}
            >
              <AppIcon
                name={item.icon}
                className={`text-base ${isActive ? "text-white" : "text-[#7b75f0]"}`}
              />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function LegalContactCard() {
  return (
    <div className="rounded-[2rem] border border-black/5 bg-[#f7f5ff] p-6 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7b75f0]/10">
        <AppIcon name="mail" className="text-base text-[#7b75f0]" />
      </div>
      <p className="mb-1 text-sm font-bold text-black">Questions?</p>
      <p className="mb-4 text-xs leading-5 text-[#5f5b70]">
        Contact our compliance team for any concerns about these policies.
      </p>
      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#25242a]"
      >
        <AppIcon name="mail" className="text-sm" />
        {SUPPORT_EMAIL}
      </a>
    </div>
  );
}

export default function MarketingLegalPage({ page }) {
  const heroConfig = PAGE_HERO_CONFIG[page.slug] || DEFAULT_HERO_CONFIG;

  return (
    <div className="min-h-screen bg-[#f9f8fd] font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      {/* ── Hero ── */}
      <section className="px-4 pb-0 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto max-w-[1340px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    color: heroConfig.accentColor,
                    borderColor: heroConfig.accentColor + "33",
                    background: heroConfig.accentColor + "0d",
                  }}
                >
                  {heroConfig.badge || "Legal"}
                </span>
                <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[11px] font-semibold text-[#5f5b70]">
                  Effective {heroConfig.effectiveDate}
                </span>
              </div>
              <h1 className="mb-5 text-4xl font-bold tracking-tight text-black md:text-6xl lg:text-7xl">
                {page.title}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[#5f5b70] md:text-xl">
                {page.description}
              </p>
              {heroConfig.highlights?.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {heroConfig.highlights.map((h) => (
                    <span
                      key={h}
                      className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#433f53]"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: heroConfig.accentColor }}
                      />
                      {h}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <LegalHeroVisual config={heroConfig} title={page.title} />
          </div>
        </div>
      </section>

      {/* ── Content + Sidebar ── */}
      <section className="px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-[1340px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {/* Main content */}
          <article className="min-w-0">
            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm md:p-12">
              {page.introHtml ? (
                <div
                  className="marketing-wysiwyg mb-8"
                  dangerouslySetInnerHTML={{ __html: page.introHtml }}
                />
              ) : null}
              {page.sectionBlocks?.map((section) => (
                <div key={section.id} className="mb-8 last:mb-0">
                  <h2 className="mb-3 text-lg font-bold text-black">
                    {section.title}
                  </h2>
                  <div
                    className="marketing-wysiwyg"
                    dangerouslySetInnerHTML={{ __html: section.html }}
                  />
                </div>
              ))}
              {page.hasRenderableBody && page.html ? (
                <div
                  className="marketing-wysiwyg"
                  dangerouslySetInnerHTML={{ __html: page.html }}
                />
              ) : null}
            </div>
          </article>

          {/* Sticky sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <LegalSideNav currentSlug={page.slug} />
            <LegalContactCard />
          </aside>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
