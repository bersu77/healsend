"use client";

import React, { useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

const PLAN_MONTHLY_PRICE = 35; // $35/mo for all GLP-1 plans

function getPlanDuration(plan) {
  if (plan === "12-month") return 12;
  if (plan === "3-month") return 3;
  return 1; // monthly
}

export default function StepCheckout({ data, onNext }) {
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const plan = data?.plan || "monthly";
  const medication = data?.medication || "semaglutide-injections";

  const planLabel =
    plan === "12-month"
      ? "12-Month"
      : plan === "3-month"
        ? "3-Month"
        : "Monthly";
  const medLabel = medication
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const durationMonths = getPlanDuration(plan);
  const totalDue = PLAN_MONTHLY_PRICE * durationMonths;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);
    // NOTE: This component is a placeholder. Real payment is handled by the
    // funnel-based onboarding flow at /onboarding/[slug] via Stripe Elements.
    setTimeout(() => {
      setProcessing(false);
      onNext({ paymentComplete: true });
    }, 2000);
  };

  const formatCardNumber = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-headline text-2xl font-bold text-[#1c1a24]">
          Review & Pay
        </h1>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-[1rem] border border-[#c9c4d8]/20 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl hs-gradient flex items-center justify-center flex-shrink-0">
            <AppIcon name="medication" className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1c1a24]">All-Inclusive Care</h3>
            <p className="text-xs text-[#797587]">
              {planLabel} &middot; {medLabel}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#f1ecf9] text-[10px] font-semibold text-[#5b3cdd]">
              Verified Plan
            </span>
          </div>
        </div>

        <div className="border-t border-[#c9c4d8]/15 pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#484555]">
              {planLabel} Plan
              {durationMonths > 1
                ? ` · $${PLAN_MONTHLY_PRICE}/mo × ${durationMonths} months`
                : ""}
            </span>
            <span className="font-semibold">${totalDue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#484555]">Provider Consultation Fee</span>
            <span className="font-semibold text-green-600">FREE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#484555]">Overnight Shipping</span>
            <span className="font-semibold text-green-600">FREE</span>
          </div>
        </div>

        <div className="border-t border-[#c9c4d8]/15 pt-3 flex justify-between items-baseline">
          <span className="font-bold text-lg text-[#1c1a24]">Due today</span>
          <span className="font-bold text-2xl text-[#5b3cdd]">
            ${totalDue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Alternative Payment */}
      <div className="grid grid-cols-2 gap-3">
        <button className="py-3 rounded-[1rem] bg-[#f5c7d3] text-sm font-semibold text-[#1c1a24] hover:opacity-90">
          Klarna
        </button>
        <button className="py-3 rounded-[1rem] bg-[#b2dfdb] text-sm font-semibold text-[#1c1a24] hover:opacity-90">
          Afterpay
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs text-[#797587]">
        <div className="flex-1 h-px bg-[#c9c4d8]/30" />
        Or pay with card
        <div className="flex-1 h-px bg-[#c9c4d8]/30" />
      </div>

      {/* Card Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#484555] uppercase">
            Card Number
          </label>
          <div className="relative">
            <AppIcon
              name="credit_card"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#797587] text-[18px]"
            />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-[1rem] border border-[#c9c4d8]/30 text-sm focus:border-[#5b3cdd] focus:ring-2 focus:ring-[#5b3cdd]/20 outline-none"
              placeholder="1234 5678 9012 3456"
              value={card.number}
              onChange={(e) =>
                setCard((c) => ({
                  ...c,
                  number: formatCardNumber(e.target.value),
                }))
              }
              required
              autoComplete="cc-number"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#484555] uppercase">
              Expiry
            </label>
            <input
              className="w-full px-4 py-3 rounded-[1rem] border border-[#c9c4d8]/30 text-sm focus:border-[#5b3cdd] focus:ring-2 focus:ring-[#5b3cdd]/20 outline-none"
              placeholder="MM/YY"
              value={card.expiry}
              onChange={(e) =>
                setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))
              }
              required
              autoComplete="cc-exp"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#484555] uppercase">
              CVC
            </label>
            <input
              className="w-full px-4 py-3 rounded-[1rem] border border-[#c9c4d8]/30 text-sm focus:border-[#5b3cdd] focus:ring-2 focus:ring-[#5b3cdd]/20 outline-none"
              placeholder="123"
              value={card.cvc}
              onChange={(e) =>
                setCard((c) => ({
                  ...c,
                  cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                }))
              }
              required
              type="password"
              autoComplete="cc-csc"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AppIcon name="error" className="text-[16px]" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={processing}
          className="w-full py-3.5 rounded-[1rem] hs-gradient-btn text-sm font-semibold disabled:opacity-90 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            `Pay Now — $${totalDue.toFixed(2)}`
          )}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 text-[10px] text-[#797587]">
        <div className="flex items-start gap-2">
          <AppIcon name="verified_user" className="text-[14px]" />
          <div>
            <p className="font-bold uppercase">HIPAA Compliant</p>
            <p>Your health data is protected</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <AppIcon name="star" className="text-[14px]" />
          <div>
            <p className="font-bold uppercase">Trusted Care</p>
            <p>4.9/5 rating from patients</p>
          </div>
        </div>
      </div>
    </div>
  );
}
