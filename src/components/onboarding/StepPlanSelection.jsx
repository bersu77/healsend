"use client";

import React, { useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

const PLANS = [
  {
    id: "12-month",
    badge: "BEST VALUE",
    badgeIcon: "star",
    badgeClass: "hs-gradient text-white",
    name: "12-Month Plan",
    monthlyPrice: "$35",
    totalLabel: "$420 billed upfront",
    featured: true,
    features: [
      "1:1 doctor consultations included",
      "Prescription GLP-1 medications",
      "Monthly progress check-ins",
    ],
  },
  {
    id: "3-month",
    badge: "MOST POPULAR",
    badgeIcon: null,
    badgeClass: "bg-[#f1ecf9] text-[#5b3cdd]",
    name: "3-Month Plan",
    monthlyPrice: "$35",
    totalLabel: "$105 billed upfront",
    featured: false,
    features: [
      "1:1 doctor consultations included",
      "Prescription GLP-1 medications",
    ],
  },
  {
    id: "monthly",
    badge: null,
    badgeIcon: null,
    badgeClass: "",
    name: "Monthly Plan",
    monthlyPrice: "$35",
    totalLabel: "$35/month",
    featured: false,
    features: [
      "1:1 doctor consultations included",
      "Prescription GLP-1 medications",
    ],
  },
];

export default function StepPlanSelection({ onNext }) {
  const [selected, setSelected] = useState("12-month");

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-headline text-2xl font-bold text-[#1c1a24]">
          Choose your metabolic path
        </h1>
        <p className="text-sm text-[#484555]">
          Select a plan that fits your clinical goals. All plans include 1:1
          doctor support and prescription GLP-1 medications if eligible.
        </p>
      </div>

      <div className="space-y-4">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all hover:scale-[1.01] ${
              selected === plan.id
                ? "border-[#5b3cdd] bg-[#fdf8ff] shadow-md"
                : "border-[#c9c4d8]/30 bg-white hover:border-[#5b3cdd]/40"
            }`}
          >
            {plan.badge && (
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-3 ${plan.badgeClass}`}
              >
                {plan.badgeIcon && (
                  <AppIcon name={plan.badgeIcon} className="text-[12px]" />
                )}
                {plan.badge}
              </span>
            )}
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-headline font-bold text-lg text-[#1c1a24]">
                {plan.name}
              </h3>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#5b3cdd]">
                  {plan.monthlyPrice}
                  <span className="text-sm font-normal text-[#797587]">
                    /mo
                  </span>
                </span>
                <span className="text-xs text-[#797587] block">
                  {plan.totalLabel}
                </span>
              </div>
            </div>
            <ul className="space-y-1.5 mt-3">
              {plan.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-[#484555]"
                >
                  <AppIcon
                    name="check_circle"
                    className="text-[#5b3cdd] text-[16px]"
                  />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <button
        onClick={() => onNext({ plan: selected })}
        className="w-full py-3.5 rounded-xl hs-gradient-btn text-sm font-semibold"
      >
        Select Plan
      </button>

      <div className="flex justify-center gap-6 text-[10px] text-[#797587]">
        <div className="flex items-center gap-1">
          <AppIcon name="verified_user" className="text-[14px]" />
          HIPAA Compliant
        </div>
        <div className="flex items-center gap-1">
          <AppIcon name="security" className="text-[14px]" />
          Secure Checkout
        </div>
      </div>
    </div>
  );
}
