"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingSectionTabs } from "@/components/marketing/content-organizer";
import {
  MarketingFooter,
  MarketingNavbar,
  MarketingProductCarousel,
  MARKETING_ROUTES,
} from "@/components/marketing/shared";

function FeatureGrid({ products }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1340px] px-4 py-12 md:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
            Featured Treatments
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">
            Compare your options at a glance.
          </h2>
        </div>
        <Link
          href={MARKETING_ROUTES.shop}
          className="hidden text-sm font-bold text-[#7b75f0] transition-colors hover:text-[#665ce0] md:inline-flex"
        >
          Browse all treatments
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm"
          >
            <div className="relative h-72 overflow-hidden bg-[#f4f5f9]">
              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={`${product.id}-${tag.label}`}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tag.bg} ${tag.text}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain p-8"
              />
            </div>

            <div className="space-y-3 p-6">
              <div>
                <h3 className="mb-2 text-2xl font-bold text-black">
                  {product.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>

              <p className="text-sm font-medium text-[#7b75f0]">{product.price}</p>

              <div className="flex gap-3">
                <Link
                  href={product.href}
                  className="flex-1 rounded-full bg-black px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-gray-800"
                >
                  Get Started
                </Link>
                <Link
                  href={product.secondaryHref}
                  className="flex-1 rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-bold text-black transition-colors hover:bg-gray-50"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SupportPillars({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1340px] px-4 py-12 md:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
          Why this category matters
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">
          Built to turn broad interest into a clearer next step.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 inline-flex rounded-full bg-[#f3f0ff] p-3 text-[#7b75f0]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-black">{item.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CarePath({ steps, ctaHref, ctaText, categoryName }) {
  if (!steps.length) {
    return null;
  }

  return (
    <section className="bg-[#fafbff] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
            Care path
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">
            What {categoryName} care looks like in practice.
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-sm font-bold text-white">
                {index + 1}
              </div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6473]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7b75f0]" />
                Step {index + 1}
              </div>
              <h3 className="mb-3 text-xl font-bold text-black">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-gray-800"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryFaq({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[2rem] border border-black/5 bg-[#fbf9ff] p-6 shadow-sm md:p-8">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
        Frequently asked
      </p>
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-black md:text-3xl">
        Common questions about this category
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

function CategoryContentSections({ page }) {
  const hasSections = page.sectionBlocks?.length > 0 || Boolean(page.introHtml);

  if (!hasSections) {
    return null;
  }

  const useTabs = (page.sectionBlocks?.length || 0) >= 4;

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto grid max-w-[1340px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-10">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
              Category guide
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">
              Full details for {page.categoryName}
            </h2>
          </div>

          {page.introHtml ? (
            <div
              className="marketing-wysiwyg rounded-[1.75rem] border border-black/5 bg-[#fbf9ff] p-6 md:p-8"
              dangerouslySetInnerHTML={{ __html: page.introHtml }}
            />
          ) : null}

          {page.sectionBlocks?.length ? (
            <div className={page.introHtml ? "mt-8" : ""}>
              {useTabs ? (
                <MarketingSectionTabs sections={page.sectionBlocks} />
              ) : (
                <div className="space-y-6">
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

          <CategoryFaq items={page.faqItems || []} />
        </article>

        <aside className="space-y-4">
          {page.sectionBlocks?.length ? (
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
                On this page
              </p>
              <div className="space-y-2">
                {page.sectionBlocks.map((section) =>
                  useTabs ? (
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
              Explore the next step for {page.categoryName}
            </h3>
            <p className="mb-6 text-sm leading-7 text-[#5f5b70]">
              Start with the category’s main detail or funnel path, then compare the specific treatment options below.
            </p>
            <Link
              href={page.ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25242a]"
            >
              {page.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function MarketingCategoryPage({ page }) {
  const products = page.products || [];
  const featuredProducts = page.featuredProducts || [];
  const supportPillars = page.supportPillars || [];
  const careSteps = page.careSteps || [];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <section className="bg-[radial-gradient(circle_at_top_left,#f1ecff,transparent_38%),linear-gradient(180deg,#ffffff_0%,#f8f8ff_100%)] px-4 pb-12 pt-10 md:px-8 md:pt-14">
        <div className="mx-auto grid max-w-[1340px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              {page.eyebrow}
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-black md:text-6xl">
              {page.title}
            </h1>
            <p className="mb-6 max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl">
              {page.description}
            </p>

            <div className="mb-6 flex flex-wrap gap-2.5">
              {page.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-black/5"
                >
                  <ShieldCheck className="h-4 w-4 text-[#7b75f0]" />
                  {highlight}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={page.ctaHref}
                className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-gray-800"
              >
                {page.ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={MARKETING_ROUTES.shop}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-black transition-colors hover:bg-gray-50"
              >
                Browse all treatments
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#eef0ff] p-6 shadow-sm md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,104,238,0.22),transparent_45%)]" />
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7b75f0]">
                <Sparkles className="h-4 w-4" />
                {page.categoryName}
              </div>
              <img
                src={page.heroImage}
                alt={page.categoryName}
                className="mx-auto h-[340px] w-full object-contain md:h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      <CategoryContentSections page={page} />

      <SupportPillars items={supportPillars} />
      <CarePath
        steps={careSteps}
        ctaHref={page.ctaHref}
        ctaText={page.ctaText}
        categoryName={page.categoryName}
      />
      {products.length > 0 ? <MarketingProductCarousel products={products} /> : null}
      <FeatureGrid products={featuredProducts} />
      <MarketingFooter />
    </div>
  );
}
