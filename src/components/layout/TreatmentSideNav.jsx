"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

const TREATMENT_CATEGORIES = [
  { label: "Weight Loss", href: "/shop/weight-loss" },
  { label: "Strength", href: "/shop/strength" },
  { label: "Anti-Aging", href: "/shop/anti-aging" },
  { label: "Hair Growth", href: "/shop/hair-growth" },
  { label: "Mood", href: "/shop/mood" },
  { label: "More", href: "/shop" },
];

const DISCOVER_LINKS = [
  { label: "Eden Health Clubs", href: "/health-clubs" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function TreatmentSideNav({ open, onClose }) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-end px-5 pt-5 pb-4">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center text-[#1c1a24] hover:text-black transition-colors"
          >
            <AppIcon name="close" className="text-[24px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Treatment Categories */}
          <div className="border-t border-gray-200">
            <div className="px-6 pt-6 pb-2">
              <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
                Treatment Categories
              </p>
            </div>
            <div>
              {TREATMENT_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-4 border-b border-gray-100 group"
                >
                  <span className="text-[22px] font-normal text-[#1c1a24] group-hover:text-black transition-colors">
                    {cat.label}
                  </span>
                  <AppIcon
                    name="chevron_right"
                    className="text-[22px] text-[#1c1a24]"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Get Started */}
          <div className="border-t border-gray-200 px-6 pt-6 pb-6">
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-4">
              Get Started
            </p>
            <Link href="/funnels/glp-1" onClick={onClose}>
              <div className="relative rounded-2xl overflow-hidden bg-[#2db560] min-h-[160px] flex items-end p-4">
                {/* Product image */}
                <div className="absolute right-0 bottom-0 w-44 h-44 pointer-events-none select-none">
                  <Image
                    src="/images/marketing/weight-loss-image-menu-cutout.png"
                    alt="GLP-1 treatments"
                    fill
                    className="object-contain object-right-bottom"
                    sizes="176px"
                  />
                </div>
                {/* Text content */}
                <div className="relative z-10 max-w-[55%]">
                  <p className="text-white font-bold text-[18px] leading-snug mb-3">
                    Personalized GLP-1 Treatments
                  </p>
                  <span className="inline-block bg-white/20 text-white text-[12px] font-medium rounded-full px-3 py-1">
                    From $129 first month*
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-[11px] text-gray-400 mt-2">
              *First month discount on 3-month plan.
            </p>
          </div>

          {/* Discover */}
          <div className="border-t border-gray-200 px-6 pt-6 pb-8">
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-4">
              Discover Eden
            </p>
            <div className="space-y-4">
              {DISCOVER_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="block text-[22px] font-normal text-[#1c1a24] hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
