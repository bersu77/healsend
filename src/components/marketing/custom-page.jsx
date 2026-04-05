import Link from "next/link";
import { ArrowRight, FileText, Globe } from "lucide-react";
import {
  MarketingHighlightRail,
  MarketingSectionTabs,
} from "@/components/marketing/content-organizer";
import { MARKETING_ROUTE_PATHS } from "@/lib/marketing-pages";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";

export function HighlightPills({ highlights }) {
  if (!highlights?.length) {
    return null;
  }

  if (highlights.length >= 4) {
    return <MarketingHighlightRail items={highlights} />;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {highlights.map((highlight) => (
        <span
          key={highlight}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#433f53]"
        >
          {highlight}
        </span>
      ))}
    </div>
  );
}

export function OfferSnapshot({ offerDetails, cta }) {
  if (!offerDetails?.primaryPrice && !offerDetails?.secondaryPrice) {
    return null;
  }

  return (
    <div className="mt-8 rounded-[1.75rem] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
        Offer snapshot
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2">
        {offerDetails.primaryPrice ? (
          <div>
            <p className="text-3xl font-bold tracking-tight text-black md:text-4xl">
              {offerDetails.primaryPrice}
            </p>
          </div>
        ) : null}
        {offerDetails.secondaryPrice ? (
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5f5b70]">
            {offerDetails.secondaryPrice}
          </p>
        ) : null}
      </div>
      {cta ? (
        <div className="mt-5">
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25242a]"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function EmptyState({ cta, title, description }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-black/10 bg-[#faf9fe] p-8 text-center md:p-12">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#6d5ce7] shadow-sm">
        <FileText className="h-6 w-6" />
      </div>
      <h2 className="mb-3 text-2xl font-bold tracking-tight text-black">
        {title || "Continue in HealSend"}
      </h2>
      <p className="mx-auto max-w-2xl text-base leading-7 text-[#5f5b70]">
        {description ||
          "Continue with the matching treatment or intake flow below."}
      </p>
      {cta ? (
        <div className="mt-8">
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25242a]"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function ShortcodeSupportCard({ card }) {
  if (!card) {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-black/5 bg-[#f7f5ff] p-6 shadow-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
        {card.eyebrow}
      </p>
      <h2 className="mb-3 text-2xl font-bold tracking-tight text-black">
        {card.title}
      </h2>
      <p className="mb-5 text-sm leading-7 text-[#5f5b70]">
        {card.description}
      </p>
      {card.bullets?.length ? (
        <ul className="mb-6 space-y-3 text-sm text-[#433f53]">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#7b75f0]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {card.cta ? (
        <Link
          href={card.cta.href}
          className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25242a]"
        >
          {card.cta.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export function NativeFaq({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="mt-10 rounded-[1.75rem] border border-black/5 bg-[#fbf9ff] p-6 md:p-8">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
        Frequently asked
      </p>
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-black md:text-3xl">
        Common questions
      </h2>
      <div className={items.length >= 6 ? "grid gap-3 md:grid-cols-2" : "space-y-3"}>
        {items.map((item, index) => (
          <details
            key={item.question}
            open={index === 0}
            className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white"
          >
            <summary className="cursor-pointer list-none px-5 py-4 text-base font-semibold text-black">
              {item.question}
            </summary>
            <div
              className="marketing-wysiwyg border-t border-black/5 px-5 pb-5 pt-4"
              dangerouslySetInnerHTML={{ __html: item.answerHtml }}
            />
          </details>
        ))}
      </div>
    </div>
  );
}

export function NativeSectionBlocks({ introHtml, sections }) {
  if (!introHtml && !sections?.length) {
    return null;
  }

  const useTabs = (sections?.length || 0) >= 4;

  return (
    <div className="space-y-8">
      {introHtml ? (
        <div
          className="marketing-wysiwyg rounded-[1.75rem] border border-black/5 bg-[#fbf9ff] p-6 md:p-8"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      ) : null}

      {useTabs ? (
        <MarketingSectionTabs sections={sections} />
      ) : (
        sections?.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="mb-5 flex flex-col gap-3 border-b border-black/5 pb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
                Section
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                {section.title}
              </h2>
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
        ))
      )}
    </div>
  );
}

export function SectionJumpList({ sections, tabbed = false }) {
  if (!sections?.length) {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
        {tabbed ? "Sections in this guide" : "On this page"}
      </p>
      <div className="space-y-2">
        {sections.map((section) => (
          tabbed ? (
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
          )
        ))}
      </div>
    </div>
  );
}

export default function MarketingCustomPage({ page }) {
  const useNativeSections =
    page.sectionBlocks?.length > 0 || Boolean(page.introHtml);
  const useTabbedSections = (page.sectionBlocks?.length || 0) >= 4;

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <section className="bg-[radial-gradient(circle_at_top_left,#efeaff,transparent_38%),linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] px-4 pb-16 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto grid max-w-[1340px] gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              {page.eyebrow}
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-black md:text-6xl">
              {page.title}
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-[#5f5b70] md:text-xl">
              {page.description}
            </p>
            <HighlightPills highlights={page.highlights} />
            <OfferSnapshot offerDetails={page.offerDetails} cta={page.cta} />
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
            {page.heroImage ? (
              <img
                src={page.heroImage}
                alt={page.title}
                className="h-[320px] w-full object-cover md:h-[420px]"
              />
            ) : (
              <div className="flex h-[320px] flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_top_right,rgba(123,117,240,0.2),transparent_40%),#f6f3ff] p-8 text-center md:h-[420px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#6d5ce7] shadow-sm">
                  <Globe className="h-7 w-7" />
                </div>
                <p className="max-w-xs text-sm font-medium leading-6 text-[#4a4658]">
                  Treatment information displayed in HealSend&apos;s reading
                  layout.
                </p>
              </div>
            )}
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
            ) : !page.faqItems?.length ? (
              <EmptyState
                cta={page.cta}
                title={page.emptyStateTitle}
                description={page.emptyStateDescription}
              />
            ) : null}

            <NativeFaq items={page.faqItems} />
          </article>

          <aside className="space-y-6">
            <SectionJumpList
              sections={useNativeSections ? page.sectionBlocks : []}
              tabbed={useTabbedSections}
            />

            <ShortcodeSupportCard card={page.shortcodeSupportCard} />

            {page.cta ? (
              <div className="rounded-[2rem] border border-black/5 bg-[#f7f5ff] p-6 shadow-sm">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
                  Next step
                </p>
                <h2 className="mb-3 text-2xl font-bold tracking-tight text-black">
                  {page.cta.title}
                </h2>
                <p className="mb-6 text-sm leading-7 text-[#5f5b70]">
                  {page.cta.description}
                </p>
                <Link
                  href={page.cta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25242a]"
                >
                  {page.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}

            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
                Explore
              </p>
              <div className="space-y-3">
                <Link
                  href={MARKETING_ROUTE_PATHS.shop}
                  className="block rounded-2xl border border-black/5 px-4 py-3 text-sm font-semibold text-[#26232f] transition-colors hover:bg-[#faf9fe]"
                >
                  Browse all treatments
                </Link>
                <Link
                  href={MARKETING_ROUTE_PATHS.weightLoss}
                  className="block rounded-2xl border border-black/5 px-4 py-3 text-sm font-semibold text-[#26232f] transition-colors hover:bg-[#faf9fe]"
                >
                  Weight loss
                </Link>
                <Link
                  href={MARKETING_ROUTE_PATHS.sexualHealth}
                  className="block rounded-2xl border border-black/5 px-4 py-3 text-sm font-semibold text-[#26232f] transition-colors hover:bg-[#faf9fe]"
                >
                  Sexual health
                </Link>
                <Link
                  href="/anti-aging"
                  className="block rounded-2xl border border-black/5 px-4 py-3 text-sm font-semibold text-[#26232f] transition-colors hover:bg-[#faf9fe]"
                >
                  Anti-aging
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
