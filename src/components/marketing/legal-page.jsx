import Link from "next/link";
import {
  NativeFaq,
  NativeSectionBlocks,
  SectionJumpList,
} from "@/components/marketing/custom-page";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";
import { LEGAL_ROUTE_PATHS } from "@/lib/legal-links";

const LEGAL_NAV_ITEMS = [
  { href: LEGAL_ROUTE_PATHS.privacy, label: "Privacy Policy" },
  { href: LEGAL_ROUTE_PATHS.terms, label: "Terms of Service" },
  { href: LEGAL_ROUTE_PATHS.telehealthConsent, label: "Telehealth Consent" },
  { href: LEGAL_ROUTE_PATHS.safety, label: "Safety Information" },
  { href: LEGAL_ROUTE_PATHS.consumerHealthData, label: "Consumer Health Data" },
  { href: LEGAL_ROUTE_PATHS.refund, label: "Refund Policy" },
];

export default function MarketingLegalPage({ page }) {
  const useNativeSections =
    page.sectionBlocks?.length > 0 || Boolean(page.introHtml);
  const useTabbedSections = (page.sectionBlocks?.length || 0) >= 4;

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <section className="bg-[radial-gradient(circle_at_top_left,#efeaff,transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] px-4 pb-12 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto grid max-w-[1340px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              Legal Information
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-black md:text-6xl">
              {page.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#5f5b70] md:text-xl">
              {page.description}
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
              Legal library
            </p>
            <div className="space-y-2">
              {LEGAL_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    page.slug === item.href.replace(/^\//, "")
                      ? "border-black bg-black text-white"
                      : "border-black/5 text-[#26232f] hover:bg-[#faf9fe]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-[1340px] gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-10">
            {useNativeSections ? (
              <NativeSectionBlocks
                introHtml={page.introHtml}
                sections={page.sectionBlocks}
              />
            ) : page.hasRenderableBody ? (
              <div
                className="marketing-wysiwyg"
                dangerouslySetInnerHTML={{ __html: page.html }}
              />
            ) : null}

            <NativeFaq items={page.faqItems} />
          </article>

          <aside className="space-y-6">
            <SectionJumpList
              sections={useNativeSections ? page.sectionBlocks : []}
              tabbed={useTabbedSections}
            />

            <div className="rounded-[2rem] border border-black/5 bg-[#f7f5ff] p-6 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
                Important
              </p>
              <p className="text-sm leading-7 text-[#5f5b70]">
                Review the legal and compliance details that apply to treatment,
                privacy, and your use of the site.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
