"use client";

import React from "react";
import AppIcon from "@/components/ui/AppIcon";

const BENEFITS = [
  {
    icon: "prescriptions",
    title: "Prescription Reminders",
    desc: "Never miss a dose with timely medication reminders",
  },
  {
    icon: "local_shipping",
    title: "Shipping Updates",
    desc: "Real-time tracking for your medication deliveries",
  },
  {
    icon: "medical_services",
    title: "Healthcare Provider Updates",
    desc: "Important messages from your care team",
  },
  {
    icon: "lab_research",
    title: "Lab Results",
    desc: "Get notified when your lab results are ready",
  },
  {
    icon: "sell",
    title: "Latest Offers",
    desc: "Exclusive discounts and promotional offers",
  },
];

export default function StepTextAlerts({ onNext }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-headline text-2xl font-bold text-[#1c1a24]">
          Stay in the loop with text alerts
        </h1>
        <p className="text-sm text-[#484555]">
          Get critical health updates and exclusive access directly to your
          phone. You can opt-out at any time.
        </p>
      </div>

      <div className="space-y-3">
        {BENEFITS.map((b, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f1ecf9] transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#f1ecf9] flex items-center justify-center flex-shrink-0">
              <AppIcon name={b.icon} className="text-[#5b3cdd]" />
            </div>
            <div>
              <p className="font-semibold text-[#1c1a24]">{b.title}</p>
              <p className="text-xs text-[#797587]">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onNext({ textAlerts: true })}
          className="w-full py-3.5 rounded-xl hs-gradient-btn text-sm font-semibold"
        >
          Yes, I&apos;d like to receive updates
        </button>
        <button
          onClick={() => onNext({ textAlerts: false })}
          className="w-full py-3.5 rounded-xl bg-[#f1ecf9] text-sm font-semibold text-[#484555] hover:bg-[#e8e0f5] transition-colors"
        >
          No
        </button>
      </div>

      <div className="space-y-2 text-[10px] text-[#797587]">
        <div className="flex items-start gap-2">
          <AppIcon name="lock" className="text-[14px]" />
          <p>
            By opting in, you agree to receive SMS messages. Msg & data rates
            may apply. Reply STOP to unsubscribe.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <AppIcon name="verified_user" className="text-[14px]" />
          <p>
            Your information is protected under HIPAA guidelines and will never
            be shared.
          </p>
        </div>
      </div>
    </div>
  );
}
