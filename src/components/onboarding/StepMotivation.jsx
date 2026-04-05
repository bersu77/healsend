"use client";

import React from "react";
import AppIcon from "@/components/ui/AppIcon";

const OPTIONS = [
  { label: "My physical health", icon: "fitness_center" },
  { label: "My appearance", icon: "visibility" },
  { label: "My mental health", icon: "psychology" },
  { label: "All of the above", icon: "done_all" },
];

export default function StepMotivation({ value, onChange, onNext }) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold leading-tight mb-3 text-[#1c1a24]">
          What are you hoping to improve by losing weight?
        </h1>
        <p className="text-[#484555] text-base leading-relaxed max-w-prose">
          Understanding your core motivation helps us tailor your clinical
          protocol and support plan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {OPTIONS.map(({ label, icon }) => {
          const selected = value === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(label)}
              className={`group relative flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                selected
                  ? "bg-[#5b3cdd] border-[#5b3cdd] shadow-xl shadow-[#5b3cdd]/10 ring-4 ring-[#e5deff]/30"
                  : "bg-white border-[#c9c4d8]/20 hover:border-[#5b3cdd]/40"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selected
                      ? "bg-white/10 text-white"
                      : "bg-[#e5deff] text-[#5b3cdd]"
                  }`}
                >
                  <AppIcon name={icon} className="text-xl" />
                </div>
                <span
                  className={`font-body text-lg font-semibold ${
                    selected ? "text-white" : "text-[#1c1a24]"
                  }`}
                >
                  {label}
                </span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selected
                    ? "border-white bg-white"
                    : "border-[#c9c4d8] group-hover:border-[#5b3cdd]/40"
                }`}
                >
                  {selected && (
                  <AppIcon
                    name="check"
                    className="text-[16px] text-[#5b3cdd]"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={!value}
          className="w-full py-4 px-8 rounded-xl hs-gradient-btn font-headline font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue Assessment
        </button>
      </div>
    </div>
  );
}
