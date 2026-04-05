"use client";

import React, { useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

const MEDICATIONS = [
  {
    id: "tirzepatide-drops",
    badge: "NEEDLE FREE",
    badgeClass: "bg-[#e8e0f5] text-[#5b3cdd]",
    name: "Tirzepatide Drops",
    description:
      "Sublingual administration — no injections needed. Easy daily dosing for consistent results.",
    price: "$329/month",
    icon: "water_drop",
  },
  {
    id: "semaglutide-injections",
    badge: "COST EFFECTIVE",
    badgeClass: "bg-[#fff3e0] text-[#ef6c00]",
    name: "Semaglutide Injections",
    description:
      "The clinical gold standard for GLP-1 weight loss therapy. Weekly subcutaneous injection.",
    price: "$249/month",
    icon: "vaccines",
  },
  {
    id: "tirzepatide-injections",
    badge: "HIGHEST SUCCESS RATE",
    badgeClass: "bg-[#f1ecf9] text-[#5b3cdd]",
    name: "Tirzepatide Injections",
    description:
      "Dual-agonist medication targeting both GLP-1 and GIP receptors for maximum efficacy.",
    price: "$329/month",
    icon: "syringe",
  },
];

export default function StepMedication({ onNext }) {
  const [selected, setSelected] = useState("semaglutide-injections");

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-headline text-2xl font-bold text-[#1c1a24]">
          Select your medication
        </h1>
        <p className="text-sm text-[#484555]">
          Choose the treatment that works best for you. All options are
          prescribed by licensed physicians.
        </p>
      </div>

      <div className="space-y-4">
        {MEDICATIONS.map((med) => {
          const isSelected = selected === med.id;
          return (
            <button
              key={med.id}
              onClick={() => setSelected(med.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all hover:scale-[1.01] relative ${
                isSelected
                  ? "border-[#5b3cdd] bg-[#fdf8ff] shadow-md"
                  : "border-[#c9c4d8]/30 bg-white hover:border-[#5b3cdd]/40"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full hs-gradient flex items-center justify-center">
                  <AppIcon name="check" className="text-white text-[14px]" />
                </div>
              )}
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-3 ${med.badgeClass}`}
              >
                {med.badge}
              </span>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#f1ecf9] flex items-center justify-center flex-shrink-0">
                  <AppIcon
                    name={med.icon}
                    className="text-[#5b3cdd] text-[28px]"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-headline font-bold text-[#1c1a24]">
                      {med.name}
                    </h3>
                    <span className="font-bold text-[#5b3cdd] text-sm">
                      {med.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#797587] mt-1">
                    {med.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f1ecf9]">
        <AppIcon name="security" className="text-[#5b3cdd]" />
        <div>
          <p className="font-semibold text-sm text-[#1c1a24]">
            Doctor-Supervised
          </p>
          <p className="text-xs text-[#797587]">
            All plans include medical consultations.
          </p>
        </div>
      </div>

      <button
        onClick={() => onNext({ medication: selected })}
        className="w-full py-3.5 rounded-xl hs-gradient-btn text-sm font-semibold"
      >
        Continue to Payment
      </button>
    </div>
  );
}
