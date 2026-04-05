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
    <div className="space-y-10">
      <div className="text-center md:text-left">
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-[#1c1a24] mb-3">
          Check your eligibility
        </h1>
        <p className="font-body text-[#484555] text-base leading-relaxed">
          Please enter your physical details to calculate your Body Mass Index
          (BMI).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Form Inputs */}
        <div className="md:col-span-7 space-y-6">
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
          <div className="relative w-44 h-44 md:w-52 md:h-52 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#c9c4d8]/10" />
            <div
              className={`absolute inset-0 rounded-full border-[6px] transition-all duration-500 ${getBmiColor()}`}
            />
            <div className="bg-white shadow-[0_32px_64px_-12px_rgba(28,26,36,0.04)] rounded-full w-[85%] h-[85%] flex flex-col items-center justify-center text-center">
              <span className="font-headline text-4xl md:text-5xl font-extrabold text-[#1c1a24] tracking-tighter">
                {bmi ?? "—"}
              </span>
              <span className="font-body text-[0.6875rem] uppercase tracking-widest text-[#484555] mt-1">
                Your BMI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility Banner */}
      {bmi && (
        <div
          className={`p-5 rounded-2xl flex items-start gap-4 border ${
            eligible
              ? "bg-emerald-50 border-emerald-100/50"
              : "bg-amber-50 border-amber-100/50"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              eligible ? "bg-emerald-500" : "bg-amber-500"
            }`}
          >
            <AppIcon
              name={eligible ? "check" : "info"}
              className="text-white"
            />
          </div>
          <div>
            <p
              className={`font-body font-semibold leading-snug ${
                eligible ? "text-emerald-900" : "text-amber-900"
              }`}
            >
              {eligible
                ? "Based on your BMI, you are eligible for our treatment program."
                : "Your BMI is below 25. You may not qualify for GLP-1 treatment, but our team can help with other options."}
            </p>
            <p
              className={`font-body text-sm mt-1 ${
                eligible ? "text-emerald-700/80" : "text-amber-700/80"
              }`}
            >
              Our clinical team will review your data to confirm the best path
              forward.
            </p>
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={!hasValues || !eligible}
          className="w-full hs-gradient-btn py-4 px-8 rounded-xl font-headline text-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <AppIcon name="arrow_forward" />
        </button>
        <p className="mt-3 text-center font-body text-xs text-[#484555]/60">
          Secure &amp; HIPAA Compliant. Your data is encrypted.
        </p>
      </div>
    </div>
  );
}
