"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ScrollButton({ direction, onClick }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#17181d] shadow-sm transition-colors hover:bg-[#f6f6f8]"
      aria-label={direction === "left" ? "Scroll highlights left" : "Scroll highlights right"}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function MarketingHighlightRail({ items }) {
  const trackRef = useRef(null);
  const highlights = useMemo(() => (Array.isArray(items) ? items.filter(Boolean) : []), [items]);

  if (highlights.length === 0) {
    return null;
  }

  if (highlights.length <= 3) {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {highlights.map((highlight) => (
          <div
            key={highlight}
            className="rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-sm"
          >
            <p className="text-sm font-medium leading-6 text-[#433f53]">{highlight}</p>
          </div>
        ))}
      </div>
    );
  }

  const scrollByAmount = (direction) => {
    const node = trackRef.current;
    if (!node) {
      return;
    }

    node.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
            Key points
          </p>
          <p className="mt-1 text-sm leading-6 text-[#5f5b70]">
            The page is organized into a smaller set of useful takeaways instead of one long noisy stack.
          </p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <ScrollButton direction="left" onClick={() => scrollByAmount("left")} />
          <ScrollButton direction="right" onClick={() => scrollByAmount("right")} />
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {highlights.map((highlight, index) => (
          <article
            key={`${index}-${highlight}`}
            className="min-w-[280px] max-w-[320px] snap-start rounded-[1.75rem] border border-black/5 bg-white p-5 shadow-sm"
          >
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              Point {index + 1}
            </p>
            <p className="text-sm font-medium leading-7 text-[#433f53]">{highlight}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function MarketingSectionTabs({ sections }) {
  const normalizedSections = useMemo(
    () => (Array.isArray(sections) ? sections.filter((section) => section?.id && section?.title) : []),
    [sections],
  );
  const [activeId, setActiveId] = useState(normalizedSections[0]?.id || "");

  if (normalizedSections.length === 0) {
    return null;
  }

  const activeSection =
    normalizedSections.find((section) => section.id === activeId) || normalizedSections[0];

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-black/5 bg-[#fbf9ff] p-4 md:p-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
          Page sections
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {normalizedSections.map((section) => {
            const isActive = section.id === activeSection.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveId(section.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-[#26232f] hover:bg-[#f3efff]"
                }`}
              >
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      <section
        id={activeSection.id}
        className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="mb-5 flex flex-col gap-3 border-b border-black/5 pb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
            Selected section
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
            {activeSection.title}
          </h2>
          {activeSection.summary ? (
            <p className="max-w-3xl text-sm leading-7 text-[#5f5b70]">
              {activeSection.summary}
            </p>
          ) : null}
        </div>

        <div
          className="marketing-wysiwyg"
          dangerouslySetInnerHTML={{ __html: activeSection.html }}
        />
      </section>
    </div>
  );
}
