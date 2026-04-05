"use client";

import { useEffect, useState } from "react";
import TestHeroPreviewContent from "./TestHeroPreviewContent";

function TestHeroPreviewSkeleton() {
  return (
    <main className="bg-[#f7f8fc]">
      <section className="relative h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[52%] bg-white" />
        <div className="relative mx-auto grid h-full max-w-[1500px] grid-cols-1 gap-6 px-5 md:px-8 lg:grid-cols-[minmax(0,0.93fr)_minmax(420px,0.82fr)] lg:gap-8 lg:px-10">
          <section className="flex h-full items-center">
            <div className="mx-auto w-full max-w-[34rem] py-5 lg:py-6">
              <div className="space-y-4">
                <div className="h-24 rounded-[1rem] bg-white/80 shadow-[0_18px_36px_rgba(20,24,34,0.08)]" />
                <div className="h-52 rounded-[1rem] bg-white/70 shadow-[0_18px_36px_rgba(20,24,34,0.06)]" />
                <div className="h-28 rounded-[1rem] bg-white/70 shadow-[0_18px_36px_rgba(20,24,34,0.06)]" />
              </div>
            </div>
          </section>
          <section className="grid h-full grid-cols-2 gap-3 lg:gap-4">
            <div className="grid gap-3 lg:gap-4">
              <div className="h-[218px] rounded-[1rem] bg-[#dcebff]" />
              <div className="h-[198px] rounded-[1rem] bg-[#d7f0fb]" />
              <div className="h-[236px] rounded-[1rem] bg-[#edf1ff]" />
            </div>
            <div className="grid gap-3 lg:gap-4">
              <div className="h-[214px] rounded-[1rem] bg-[#dbe8ff]" />
              <div className="h-[194px] rounded-[1rem] bg-[#f6e6bf]" />
              <div className="h-[214px] rounded-[1rem] bg-[#e7edf8]" />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default function TestHeroPreview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <TestHeroPreviewSkeleton />;
  }

  return <TestHeroPreviewContent />;
}
