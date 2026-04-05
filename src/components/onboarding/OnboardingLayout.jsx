"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LEGAL_ROUTE_PATHS } from "@/lib/legal-links";
import AppIcon from "@/components/ui/AppIcon";

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-3">
        <span className="font-headline text-sm font-bold text-[#5b3cdd]">
          GLP-1
        </span>
        <span className="font-body text-xs uppercase tracking-wider text-[#484555] font-semibold">
          Step {current} of {total} — {pct}%
        </span>
      </div>
      <div className="h-2 w-full bg-[#e5e0ee] rounded-full overflow-hidden">
        <div
          className="h-full hs-gradient rounded-full shadow-[0_0_8px_rgba(93,63,224,0.4)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function OnboardingLayout({
  step,
  totalSteps,
  onBack = undefined,
  children,
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8ff] font-body text-[#1c1a24] antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fdf8ff]/90 backdrop-blur-xl">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="text-[#5b3cdd] hover:opacity-80 transition-opacity"
                aria-label="Go back"
              >
                <AppIcon name="arrow_back" className="text-2xl" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="HealSend"
                width={120}
                height={26}
                className="h-6 w-auto"
                priority
              />
            </div>
          </div>
          <span className="font-headline text-sm font-bold text-[#5b3cdd]">
            GLP-1
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow max-w-2xl mx-auto w-full px-6 py-8">
        <ProgressBar current={step} total={totalSteps} />
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#fdf8ff] w-full py-10 px-6 border-t border-[#c9c4d8]/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 max-w-2xl mx-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 opacity-60">
              <AppIcon name="verified_user" className="text-[#5b3cdd] text-base" />
              <span className="font-body text-[0.6875rem] uppercase tracking-widest font-bold">
                HIPAA Compliant
              </span>
            </div>
            <p className="font-body text-[0.6875rem] uppercase tracking-wider text-slate-500">
              © 2024 HealSend. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link
              className="font-body text-[0.6875rem] uppercase tracking-wider text-slate-400 hover:text-[#5b3cdd] transition-colors"
              href={LEGAL_ROUTE_PATHS.privacy}
            >
              Privacy Policy
            </Link>
            <Link
              className="font-body text-[0.6875rem] uppercase tracking-wider text-slate-400 hover:text-[#5b3cdd] transition-colors"
              href={LEGAL_ROUTE_PATHS.terms}
            >
              Terms of Service
            </Link>
            <Link
              className="font-body text-[0.6875rem] uppercase tracking-wider text-slate-400 hover:text-[#5b3cdd] transition-colors"
              href={LEGAL_ROUTE_PATHS.hipaa}
            >
              HIPAA Compliance
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
