"use client";

import React from "react";
import AppIcon from "@/components/ui/AppIcon";

const OPTIONS = [
  "Lose 1-20 lbs for good",
  "Lose 21-50 lbs for good",
  "Lose over 50 lbs for good",
  "Maintain my weight and get fit",
  "Haven't decided",
];

export default function StepGoal({ value, onChange, onNext }) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold leading-tight mb-3 text-[#1c1a24]">
          What is your weight loss goal?
        </h1>
        <p className="text-[#484555] text-base leading-relaxed">
          This helps us personalize your clinical journey and track your
          milestones effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {OPTIONS.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                selected
                  ? "bg-[#5b3cdd] text-white border-[#5b3cdd] shadow-lg scale-[1.02]"
                  : "bg-white border-[#c9c4d8]/20 hover:border-[#5b3cdd]/40 hover:bg-[#e5deff]/30"
              }`}
            >
              <span className="font-body text-lg font-semibold">{opt}</span>
              <AppIcon
                name={selected ? "check_circle" : "circle"}
                className="text-xl"
              />
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
          Continue
        </button>
        <p className="text-center mt-3 text-[#484555] font-body text-[0.6875rem] uppercase tracking-wider">
          Safe and secure clinical intake
        </p>
      </div>
    </div>
  );
}
