"use client";

import React from "react";
import AppIcon from "@/components/ui/AppIcon";

export default function StepBMI({ feet, inches, weight, onChange, onNext }) {
  const computeBMI = () => {
    const ft = Number(feet) || 0;
    const inc = Number(inches) || 0;
    const w = Number(weight) || 0;
    const totalInches = ft * 12 + inc;
    if (!totalInches || !w) return null;
    const heightM = totalInches * 0.0254;
    const kg = w * 0.45359237;
    return (kg / (heightM * heightM)).toFixed(1);
  };

  const bmi = computeBMI();
  const eligible = bmi && Number(bmi) >= 25;
  const hasValues = feet && inches && weight;

  const getBmiColor = () => {
    if (!bmi) return "border-[#c9c4d8]";
    if (Number(bmi) >= 25)
      return "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
    return "border-amber-500";
  };

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-[#1c1a24] mb-3">
          Let&apos;s check your BMI
        </h1>
        <p className="font-body text-[#484555] text-base leading-relaxed">
          We need your height and weight to determine eligibility.
        </p>
        <div className="mt-4 rounded-xl border border-[#d7d1e4] bg-[#f8f7fc] px-4 py-3">
          <p className="font-body text-[0.8125rem] text-[#6b6480] leading-relaxed">
            By clicking, you provide HIPAA authorization for our partnered
            providers and pharmacies to use your health data for treatment and
            marketing via email.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form Inputs */}
        <div className="md:col-span-7 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-body text-[0.6875rem] uppercase tracking-wider text-[#484555] font-semibold">
                Feet
              </label>
              <input
                type="number"
                value={feet}
                onChange={(e) => onChange({ feet: e.target.value })}
                placeholder="5"
                className="bg-white border border-[#c9c4d8]/20 focus:border-[#5b3cdd] focus:ring-0 px-4 py-4 rounded-xl font-body text-lg transition-all outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-body text-[0.6875rem] uppercase tracking-wider text-[#484555] font-semibold">
                Inches
              </label>
              <input
                type="number"
                value={inches}
                onChange={(e) => onChange({ inches: e.target.value })}
                placeholder="10"
                className="bg-white border border-[#c9c4d8]/20 focus:border-[#5b3cdd] focus:ring-0 px-4 py-4 rounded-xl font-body text-lg transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-body text-[0.6875rem] uppercase tracking-wider text-[#484555] font-semibold">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => onChange({ weight: e.target.value })}
              placeholder="210"
              className="bg-white border border-[#c9c4d8]/20 focus:border-[#5b3cdd] focus:ring-0 px-4 py-4 rounded-xl font-body text-lg transition-all outline-none"
            />
          </div>
        </div>

        {/* BMI Ring Display */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#c9c4d8]/20" />
            <div
              className={`absolute inset-0 rounded-full border-[6px] transition-all duration-500 ${getBmiColor()}`}
            />
            <div className="bg-white shadow-sm rounded-full w-[85%] h-[85%] flex flex-col items-center justify-center text-center">
              <span className="font-headline text-3xl md:text-4xl font-extrabold text-[#1c1a24] tracking-tighter">
                {bmi ?? "—"}
              </span>
              <span className="font-body text-[0.625rem] uppercase tracking-widest text-[#797587] mt-1">
                Your BMI
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onNext}
          disabled={!hasValues || !eligible}
          className="w-full hs-gradient-btn py-4 px-8 rounded-xl font-headline text-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
          <AppIcon name="arrow_forward" />
        </button>
        <p className="mt-3 text-center font-body text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#b0acbe]">
          Safe and Secure Clinical Intake
        </p>
      </div>
    </div>
  );
}
