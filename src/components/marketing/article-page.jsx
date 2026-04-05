import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import {
  HighlightPills,
  NativeFaq,
  NativeSectionBlocks,
  SectionJumpList,
} from "@/components/marketing/custom-page";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";
import { MARKETING_ROUTE_PATHS } from "@/lib/marketing-pages";

export default function MarketingArticlePage({ page }) {
  const useNativeSections =
    page.sectionBlocks?.length > 0 || Boolean(page.introHtml);
  const useTabbedSections = (page.sectionBlocks?.length || 0) >= 4;

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <section className="bg-[radial-gradient(circle_at_top_left,#efeaff,transparent_34%),linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] px-4 pb-16 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto grid max-w-[1340px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              {page.eyebrow || "HealSend Article"}
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-black md:text-6xl">
              {page.title}
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-[#5f5b70] md:text-xl">
              {page.description}
            </p>
            <HighlightPills highlights={page.highlights?.slice(0, 5)} />
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efff] text-[#7b75f0]">
                <FileText className="h-6 w-6" />
              </div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
                Article guide
              </p>
              <p className="text-sm leading-7 text-[#5f5b70]">
                Read the article with section navigation and a cleaner reading
                layout.
              </p>
            </div>

            {page.heroImage ? (
              <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
                <img
                  src={page.heroImage}
                  alt={page.title}
                  className="h-[280px] w-full object-cover"
                />
              </div>
            ) : null}
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
                Continue in HealSend
              </p>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-black">
                Explore treatments, not just articles.
              </h2>
              <p className="mb-6 text-sm leading-7 text-[#5f5b70]">
                Move from reading to the treatment path that fits your goals.
              </p>
              <div className="space-y-3">
                <Link
                  href={MARKETING_ROUTE_PATHS.shop}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25242a]"
                >
                  Browse treatments
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={MARKETING_ROUTE_PATHS.home}
                  className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#17181d] transition-colors hover:bg-[#f6f6f8]"
                >
                  Back to homepage
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
