"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { LEGAL_ROUTE_PATHS, buildSupportMailto } from "@/lib/legal-links";
import { trackAffiliateClientEvent } from "@/lib/affiliate-tracking-client";
import {
  getCheckoutPricingState,
  normalizeCheckoutPricingMode,
  resolveCheckoutTotalAmount,
} from "@/lib/onboarding-pricing";
import AppIcon from "@/components/ui/AppIcon";

const stripePromiseCache = new Map();
const ONBOARDING_DRAFT_VERSION = 1;

function getStripePromise(publishableKey) {
  if (!publishableKey) return null;
  if (!stripePromiseCache.has(publishableKey)) {
    stripePromiseCache.set(publishableKey, loadStripe(publishableKey));
  }
  return stripePromiseCache.get(publishableKey);
}

const fadeVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const RECT_INPUT_CLASS =
  "w-full rounded-[1.1rem] border border-[#d7d1e4] bg-white px-4 py-4 text-base transition-colors outline-none focus:border-[#5b3cdd]";
const RECT_SELECT_TRIGGER_CLASS =
  `${RECT_INPUT_CLASS} appearance-none cursor-pointer bg-[#fbfcfe] py-[1.05rem] pr-12 font-medium text-[#0f172a] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-[#bcb6d8] hover:bg-white focus:border-[#5b3cdd] focus:shadow-[0_0_0_3px_rgba(91,60,221,0.14)]`;
const PRIMARY_PILL_BUTTON_CLASS =
  "hs-solid-btn w-full rounded-full px-6 py-4 font-headline text-base font-bold disabled:cursor-not-allowed disabled:opacity-40";
const SECONDARY_PILL_BUTTON_CLASS =
  "w-full rounded-full border border-[#d7d1e4] bg-white px-6 py-4 font-headline text-base font-semibold text-[#1c1a24] transition-colors hover:bg-[#f8f8ff] disabled:cursor-not-allowed disabled:opacity-40";

function parseAmountValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function resolveDurationMonths(plan) {
  const explicit = Number(plan?.durationMonths || plan?.duration_months || 0);
  if (Number.isFinite(explicit) && explicit > 0) {
    return explicit;
  }

  const haystack = `${plan?.id || ""} ${plan?.name || ""}`.toLowerCase();
  if (/\b12\b/.test(haystack)) return 12;
  if (/\b6\b/.test(haystack)) return 6;
  if (/\b3\b/.test(haystack)) return 3;
  if (/monthly|\b1\b/.test(haystack)) return 1;
  return null;
}

function resolveProjectedPlanTotal(plan) {
  const durationMonths = resolveDurationMonths(plan);
  const firstMonth = parseAmountValue(
    plan?.firstMonth || plan?.firstMonthPrice,
  );
  const thenPrice = parseAmountValue(
    plan?.thenPrice || plan?.recurringPrice,
  );

  if (!durationMonths) {
    return firstMonth || thenPrice || 0;
  }

  if (durationMonths <= 1) {
    const single = firstMonth > 0 ? firstMonth : thenPrice;
    return single || thenPrice || firstMonth || 0;
  }

  const fm = Number.isFinite(firstMonth) ? firstMonth : thenPrice;
  const rm =
    Number.isFinite(thenPrice) && thenPrice >= 0
      ? thenPrice
      : Number.isFinite(fm)
        ? fm
        : 0;

  return fm + Math.max(durationMonths - 1, 0) * rm;
}

function resolvePerDayAmount(plan) {
  const durationMonths = resolveDurationMonths(plan);
  if (durationMonths !== 12) {
    return null;
  }

  const total = resolveProjectedPlanTotal(plan);
  if (!total) {
    return null;
  }

  return Math.round((total / 365) * 10) / 10;
}

function resolvePlanDailyAverage(plan) {
  const months = Math.max(resolveDurationMonths(plan), 1);
  const total = resolveProjectedPlanTotal(plan);
  if (!total || !Number.isFinite(total)) return null;
  const days = months * 30;
  return Math.round((total / days) * 100) / 100;
}

function getCurrentPath() {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function clearCheckoutReturnParams() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("checkout_status");
  url.searchParams.delete("checkout_method");
  url.searchParams.delete("checkout_session_id");
  window.history.replaceState(
    {},
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

const OAUTH_ERROR_MESSAGES = {
  access_denied: "Sign-in was cancelled.",
  invalid_state: "Session expired. Please try again.",
  token_exchange_failed: "Authentication failed. Please try again.",
  userinfo_failed: "Could not retrieve your account info.",
  no_email: "Email is required to sign in.",
  oauth_failed: "Something went wrong. Please try again.",
  oauth_disabled: "That sign-in provider is not enabled right now.",
  missing_code: "Authentication was incomplete. Please try again.",
};

function openOAuthPopup(url) {
  if (typeof window === "undefined") return null;
  const width = 500;
  const height = 640;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    url,
    "oauth_popup",
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`,
  );

  if (!popup) return null;

  // Detect popup closed without completing OAuth → reload to reset state
  let oauthCompleted = false;
  const onMsg = (e) => {
    if (e.origin === window.location.origin) {
      oauthCompleted = true;
      clearInterval(pollTimer);
      window.removeEventListener("message", onMsg);
    }
  };
  window.addEventListener("message", onMsg);
  const pollTimer = setInterval(() => {
    if (popup.closed) {
      clearInterval(pollTimer);
      window.removeEventListener("message", onMsg);
      if (!oauthCompleted) {
        window.location.reload();
      }
    }
  }, 500);

  return popup;
}

function parseOAuthPopupPayload(data) {
  if (!data) return null;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  return typeof data === "object" ? data : null;
}

function getOnboardingDraftStorageKey(templateId) {
  return templateId ? `hs:onboarding-draft:${templateId}` : "";
}

function readOnboardingDraft(storageKey) {
  if (!storageKey || typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed?.version !== ONBOARDING_DRAFT_VERSION) return null;
    if (
      typeof parsed.currentStep !== "number" ||
      !parsed.answers ||
      typeof parsed.answers !== "object"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeOnboardingDraft(storageKey, draft) {
  if (!storageKey || typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch { }
}

function clearOnboardingDraft(storageKey) {
  if (!storageKey || typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(storageKey);
  } catch { }
}

function parseCheckoutCurrency(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/-?\d+(\.\d+)?/);
  if (!match) return null;

  const amount = Number.parseFloat(match[0]);
  return Number.isFinite(amount) ? amount : null;
}

function formatCheckoutCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getPaymentMethodDisplayName(value) {
  switch (
  String(value || "")
    .trim()
    .toLowerCase()
  ) {
    case "klarna":
      return "Klarna";
    case "afterpay_clearpay":
      return "Afterpay";
    case "card":
      return "Credit or debit card";
    case "link":
      return "Link";
    default:
      return "payment";
  }
}

function KlarnaBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f7bfd4] text-[0.95rem] font-black text-[#1c1a24] ${className}`}
      aria-hidden="true"
    >
      K.
    </span>
  );
}

function AfterpayBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#c9f2e3] text-[#1c1a24] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
        <path
          d="M9.4 7.1 4.8 10a2 2 0 0 0 0 3.4l4.6 2.9M14.6 16.9l4.6-2.9a2 2 0 0 0 0-3.4l-4.6-2.9M10.2 15.5 13.8 8.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ApplePayBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex h-8 min-w-[56px] items-center justify-center rounded-[0.65rem] bg-black px-2 text-white ${className}`}
      aria-hidden="true"
    >
      <span className="text-[0.95rem] font-semibold">Apple Pay</span>
    </span>
  );
}

function GooglePayBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex h-8 min-w-[64px] items-center justify-center rounded-[0.65rem] border border-[#d9d4e7] bg-white px-2 text-[#202124] ${className}`}
      aria-hidden="true"
    >
      <span className="text-[0.95rem] font-semibold">G Pay</span>
    </span>
  );
}

function PaymentShortcutRow({
  children,
  suffix,
  onClick,
  disabled = false,
  loading = false,
}) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      {...(onClick ? { type: "button", onClick, disabled } : {})}
      className="flex w-full flex-col items-center justify-center rounded-[1rem] border border-[#d9d4e7] bg-white px-4 py-2.5 text-center shadow-[0_8px_18px_rgba(28,26,36,0.04)] transition-colors enabled:hover:border-[#c8c1dd] enabled:hover:bg-[#fcfbff] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex items-center justify-center gap-2.5 text-base font-bold text-[#1c1a24] md:text-[1.05rem]">
        {loading ? (
          <span className="h-4.5 w-4.5 rounded-full border-2 border-[#d7d1e4] border-t-[#5b3cdd] animate-spin" />
        ) : null}
        {children}
      </span>
      {suffix ? (
        <span className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#8b8698]">
          {suffix}
        </span>
      ) : null}
    </Component>
  );
}

function getCheckoutSelection(data, steps, summary) {
  let medicationId = null;
  let planId = null;
  let selectedMedication = null;
  let selectedPlan = null;

  if (data && typeof data === "object" && Array.isArray(steps)) {
    for (const currentStep of steps) {
      const currentValue = data[currentStep.id];

      if (
        currentStep.type === "MEDICATION_SELECT" &&
        typeof currentValue === "string" &&
        currentValue.trim()
      ) {
        medicationId = currentValue;
        selectedMedication = Array.isArray(currentStep.config?.medications)
          ? currentStep.config.medications.find(
            (med) => med?.id === currentValue,
          ) || null
          : null;
      }

      if (
        currentStep.type === "PLAN_SELECTION" &&
        typeof currentValue === "string" &&
        currentValue.trim()
      ) {
        planId = currentValue;
        selectedPlan = Array.isArray(currentStep.config?.plans)
          ? currentStep.config.plans.find(
            (plan) => plan?.id === currentValue,
          ) || null
          : null;
      }
    }
  }

  return {
    medicationId,
    planId,
    selectedMedication,
    selectedPlan,
    totalAmount: resolveCheckoutTotalAmount({
      selectedPlan,
      selectedMedication,
      summary,
    }),
  };
}

/* ═══════════════════════ Progress Bar ══════════════════════════ */
function ProgressBar({ current, total, label }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-10">
      <div className="h-3 w-full overflow-hidden rounded-full bg-[#e4e7f1]">
        <div
          className="h-full rounded-full bg-[#262626] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function normalizeQuestionOption(option) {
  if (typeof option === "string") {
    return {
      value: option,
      label: option,
      description: "",
    };
  }

  return {
    value: option?.value || option?.label || "",
    label: option?.label || option?.value || "",
    description: option?.description || "",
  };
}

function isGlp1EligibilityTemplate(template) {
  const slug = String(template?.slug || "");
  return slug === "glp-1-eligibility" || slug === "glp-1";
}

function getAnswerByStepType(answers, steps, stepType) {
  const matchingStep = Array.isArray(steps)
    ? steps.find((step) => step?.type === stepType)
    : null;

  if (!matchingStep) {
    return null;
  }

  return answers?.[matchingStep.id] ?? null;
}

function resolvePrimaryGoalCopy(goalAnswer) {
  const normalized = String(goalAnswer || "").toLowerCase();

  if (normalized.includes("food")) {
    return "Stop thinking about food";
  }
  if (normalized.includes("plateau")) {
    return "Break through a plateau";
  }
    if (normalized.includes("clinician") || normalized.includes("guided care")) {
    return "Get clinician-guided care";
  }
  if (normalized.includes("maintain")) {
    return "Lose weight & keep it off";
  }

  return goalAnswer || "Weight loss";
}

function resolveProjectedWeightOutcome(answers, steps) {
  const bmiAnswer = getAnswerByStepType(answers, steps, "BMI_CALCULATOR");
  const currentWeight = Number(bmiAnswer?.weight) || 0;

  if (!currentWeight) {
    return {
      currentWeight: null,
      projectedLoss: 40,
      targetWeight: null,
    };
  }

  const projectedLoss = Math.max(14, Math.round(currentWeight * 0.2));
  const targetWeight = Math.max(currentWeight - projectedLoss, 90);

  return {
    currentWeight,
    projectedLoss,
    targetWeight,
  };
}

function buildAugmentedSteps(template, baseSteps) {
  if (!isGlp1EligibilityTemplate(template) || !Array.isArray(baseSteps)) {
    return baseSteps;
  }

  const augmentedSteps = [];

  baseSteps.forEach((step, index) => {
    if (index === 1 && step?.type === "QUESTION_SINGLE") {
      return;
    }

    if (index === 0 && step?.type === "QUESTION_SINGLE") {
      augmentedSteps.push({
        ...step,
        title: "What matters most to you?",
        subtitle:
          "No wrong answers. We use this to personalize your plan.",
        config: {
          ...step.config,
          options: [
            {
              value: "Lose weight & keep it off",
              label: "Lose weight & keep it off",
              description: "No more yo-yo cycles.",
            },
            {
              value: "Stop thinking about food",
              label: "Stop thinking about food",
              description: "Quiet the cravings.",
            },
            {
              value: "Break through a plateau",
              label: "Break through a plateau",
              description: "Diet & exercise stalled.",
            },
            {
              value: "Get clinician-guided care",
              label: "Get clinician-guided care",
              description: "Real medication, real outcomes.",
            },
          ],
        },
      });
      augmentedSteps.push({
        id: `${template.id}-glp1-plan-intro`,
        title: "Your Personalized Plan — in 2 minutes.",
        subtitle: "",
        type: "GLP1_PLAN_INTRO",
        config: {},
        required: false,
      });
      return;
    }

    augmentedSteps.push(step);

    if (step?.type === "ACCOUNT_CREATE") {
      augmentedSteps.push(
        {
          id: `${template.id}-glp1-results-preview`,
          title: "See how much weight you could lose",
          subtitle: "",
          type: "GLP1_RESULTS_PREVIEW",
          config: {},
          required: false,
        },
        {
          id: `${template.id}-glp1-proven-results`,
          title: "Proven results. Backed by data.",
          subtitle: "",
          type: "GLP1_PROVEN_RESULTS",
          config: {},
          required: false,
        },
        {
          id: `${template.id}-glp1-contact-capture`,
          title: "Last bit before your plan.",
          subtitle:
            "We use this to ship your medication and message you about your care.",
          type: "GLP1_CONTACT_CAPTURE",
          config: {},
          required: true,
        },
      );
    }
  });

  // Keep "Stay in the loop" directly after plan selection.
  const planIndex = augmentedSteps.findIndex(
    (step) => step?.type === "PLAN_SELECTION",
  );
  const loopIndex = augmentedSteps.findIndex((step) => step?.type === "TEXT_ALERTS");
  if (planIndex !== -1 && loopIndex !== -1 && loopIndex !== planIndex + 1) {
    const [loopStep] = augmentedSteps.splice(loopIndex, 1);
    augmentedSteps.splice(planIndex + 1, 0, loopStep);
  }

  return augmentedSteps.map((step, index) => ({
    ...step,
    order: index + 1,
  }));
}

// ─── Google review helpers ────────────────────────────────────────────────────

function GoogleGLogo({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#4285f4"
        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
      />
      <path
        fill="#34a853"
        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
      />
      <path
        fill="#fbbc04"
        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
      />
      <path
        fill="#ea4335"
        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
      />
    </svg>
  );
}

function GoogleStarIcon({ filled = true }) {
  return (
    <svg
      className={`h-3.5 w-3.5 ${filled ? "text-[#FBBC04]" : "text-[#dadce0]"}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function GoogleRatingBadge() {
  return (
    <a
      href="https://www.google.com/search?q=healsend+reviews"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-black/5"
      aria-label="HealSend Google reviews — 4.9 out of 5"
    >
      <GoogleGLogo className="h-5 w-5 shrink-0" />
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-[13px] font-bold text-[#202124]">4.9</span>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <GoogleStarIcon key={i} filled />
            ))}
          </div>
        </div>
        <p className="mt-0.5 text-[10px] leading-none text-[#70757a]">
          5 stars on Google
        </p>
      </div>
    </a>
  );
}

const FUNNEL_GOOGLE_REVIEWS = [
  {
    name: "Sarah M.",
    initials: "SM",
    bgColor: "#4285F4",
    rating: 5,
    timeAgo: "2 months ago",
    text: "The food noise completely disappeared within the first two weeks. I've lost 28 lbs and my energy is back. The clinician was responsive and the process was seamless.",
  },
  {
    name: "Michael T.",
    initials: "MT",
    bgColor: "#34A853",
    rating: 5,
    timeAgo: "3 months ago",
    text: "Down 41 lbs in 5 months. I was skeptical but the results were undeniable. Straightforward process, responsive medical team, and I finally feel in control.",
  },
  {
    name: "Jennifer R.",
    initials: "JR",
    bgColor: "#EA4335",
    rating: 5,
    timeAgo: "1 month ago",
    text: "After years of trying everything, this actually worked. Lost 34 lbs and feel like myself again. The support from start to finish made all the difference.",
  },
];

function GoogleReviewCard({
  name,
  initials,
  bgColor,
  rating = 5,
  timeAgo,
  text,
}) {
  return (
    <div className="rounded-xl border border-[#e8eaed] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: bgColor }}
          >
            {initials}
          </div>
          <div>
            <p className="text-[0.875rem] font-semibold leading-tight text-[#202124]">
              {name}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <GoogleStarIcon key={i} filled={i < rating} />
                ))}
              </div>
              <span className="text-[11px] text-[#70757a]">{timeAgo}</span>
            </div>
          </div>
        </div>
        <GoogleGLogo className="h-4 w-4 shrink-0 opacity-80" />
      </div>
      <p className="mt-3 text-[0.8125rem] leading-[1.5] text-[#3c4043]">
        {text}
      </p>
    </div>
  );
}

/* ═══════════════════════ Step Renderers ════════════════════════ */

function QuestionSingleStep({ step, value, onChange, onNext }) {
  const options = (step.config?.options || []).map(normalizeQuestionOption);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-[1.75rem] md:text-[2rem] font-extrabold leading-tight mb-3 text-[#1c1a24]">
          {step.title}
        </h1>
        {step.subtitle && (
          <p className="text-[#484555] text-base leading-relaxed">
            {step.subtitle}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setTimeout(() => onNext(), 0);
              }}
              className={`w-full text-left rounded-[1.35rem] border bg-white p-4 transition-all duration-200 ${selected
                  ? "border-[#5b3cdd] bg-[#faf7ff] shadow-[0_12px_32px_rgba(91,60,221,0.14)]"
                  : "border-[#d7d1e4] hover:border-[#8d80dd] hover:bg-[#f8f4ff]"
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-body text-[1.15rem] font-semibold leading-tight text-[#1c1a24]">
                    {opt.label}
                  </p>
                  {opt.description ? (
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-[#5f5a6d]">
                      {opt.description}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected
                      ? "border-[#5b3cdd] bg-[#5b3cdd] text-white"
                      : "border-[#cbc6d8] bg-white text-transparent"
                    }`}
                >
                  <AppIcon name="check" className="text-[15px]" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuestionMultiStep({ step, value, onChange, onNext }) {
  const options = step.config?.options || [];
  const selected = Array.isArray(value) ? value : [];

  const toggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((v) => v !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-[1.75rem] md:text-[2rem] font-extrabold leading-tight mb-3 text-[#1c1a24]">
          {step.title}
        </h1>
        {step.subtitle && (
          <p className="text-[#484555] text-base leading-relaxed">
            {step.subtitle}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`w-full text-left p-4 rounded-[1.2rem] border transition-all duration-200 flex items-center justify-between ${isSelected
                  ? "bg-[#faf7ff] text-[#1c1a24] border-[#5b3cdd] shadow-[0_12px_32px_rgba(91,60,221,0.14)] scale-[1.01]"
                  : "bg-white border-[#d7d1e4] hover:border-[#8d80dd] hover:bg-[#f8f4ff]"
                }`}
            >
              <span className="font-body text-[1rem] font-semibold">{opt}</span>
              <AppIcon
                name={isSelected ? "check_box" : "check_box_outline_blank"}
                className={`text-xl ${isSelected ? "text-[#5b3cdd]" : "text-[#a49db7]"}`}
              />
            </button>
          );
        })}
      </div>
      <ContinueButton onClick={onNext} disabled={selected.length === 0} />
    </div>
  );
}

function BMICalculatorStep({ step, value, onChange, onNext }) {
  const cfg = step.config || {};
  const v = value || { feet: "", inches: "", weight: "" };

  const computeBMI = () => {
    const ft = Number(v.feet) || 0;
    const inc = Number(v.inches) || 0;
    const w = Number(v.weight) || 0;
    const totalInches = ft * 12 + inc;
    if (!totalInches || !w) return null;
    const heightM = totalInches * 0.0254;
    const kg = w * 0.45359237;
    return (kg / (heightM * heightM)).toFixed(1);
  };

  const bmi = computeBMI();
  const eligibleMin =
    typeof cfg.eligibleMinBmi === "number" && cfg.eligibleMinBmi > 0
      ? cfg.eligibleMinBmi
      : 25;
  const eligible =
    bmi &&
    (cfg.strictMinBmi
      ? Number(bmi) > eligibleMin
      : Number(bmi) >= eligibleMin);

  const getBmiColor = () => {
    if (!bmi) return "border-[#c9c4d8]";
    if (Number(bmi) >= 25)
      return "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
    return "border-amber-500";
  };

  // Build outcome for the transformation card
  const currentWeight = Number(v.weight) || 0;
  const projectedLoss = currentWeight
    ? Math.max(14, Math.round(currentWeight * 0.2))
    : 40;
  const targetWeight = currentWeight
    ? Math.max(currentWeight - projectedLoss, 90)
    : null;
  const bmiOutcome = {
    currentWeight: currentWeight || null,
    projectedLoss,
    targetWeight,
  };

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-[#1c1a24] mb-3">
          {cfg.title || "Let's check your BMI"}
        </h1>
        <p className="font-body text-[#484555] text-base leading-relaxed">
          {cfg.subtitle ||
            "We need your height and weight to determine eligibility."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-body text-[0.6875rem] uppercase tracking-wider text-[#484555] font-semibold">
                {cfg.feetLabel || "Feet"}
              </label>
              <input
                type="number"
                value={v.feet}
                onChange={(e) => onChange({ ...v, feet: e.target.value })}
                placeholder={cfg.feetPlaceholder || "5"}
                className={RECT_INPUT_CLASS}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-body text-[0.6875rem] uppercase tracking-wider text-[#484555] font-semibold">
                {cfg.inchesLabel || "Inches"}
              </label>
              <input
                type="number"
                value={v.inches}
                onChange={(e) => onChange({ ...v, inches: e.target.value })}
                placeholder={cfg.inchesPlaceholder || "10"}
                className={RECT_INPUT_CLASS}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-body text-[0.6875rem] uppercase tracking-wider text-[#484555] font-semibold">
              {cfg.weightLabel || "Weight (lbs)"}
            </label>
            <input
              type="number"
              value={v.weight}
              onChange={(e) => onChange({ ...v, weight: e.target.value })}
              placeholder={cfg.weightPlaceholder || "210"}
              className={RECT_INPUT_CLASS}
            />
          </div>
        </div>

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
        <ContinueButton
          onClick={() => onNext()}
          disabled={!v.feet || !v.inches || !v.weight || !eligible}
          label={cfg.continueLabel || "Continue"}
        />
        <p className="mt-3 text-center font-body text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#b0acbe]">
          Safe and Secure Clinical Intake
        </p>
      </div>
      <div className="mt-4 rounded-xl border border-[#d7d1e4] bg-[#f8f7fc] px-4 py-3">
        <p className="font-body text-[0.8125rem] text-[#6b6480] leading-relaxed">
          By clicking, you provide HIPAA authorization for our partnered
          providers and pharmacies to use your health data for treatment and
          marketing via email.
        </p>
      </div>
    </div>
  );
}

function TextInputStep({ step, value, onChange, onNext }) {
  const fields = step.config?.fields || [
    { name: "response", label: step.title, type: "text" },
  ];
  const v = value || {};

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold leading-tight mb-3 text-[#1c1a24]">
          {step.title}
        </h1>
        {step.subtitle && (
          <p className="text-[#484555] text-base leading-relaxed">
            {step.subtitle}
          </p>
        )}
      </div>
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label className="font-body text-[0.6875rem] uppercase tracking-wider text-[#484555] font-semibold">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={v[field.name] || ""}
                onChange={(e) =>
                  onChange({ ...v, [field.name]: e.target.value })
                }
                placeholder={field.placeholder || ""}
                rows={4}
                className="bg-white border border-[#c9c4d8]/20 focus:border-[#5b3cdd] focus:ring-0 px-4 py-4 rounded-xl font-body text-lg transition-all outline-none resize-none"
              />
            ) : (
              <input
                type={field.type || "text"}
                value={v[field.name] || ""}
                onChange={(e) =>
                  onChange({ ...v, [field.name]: e.target.value })
                }
                placeholder={field.placeholder || ""}
                className="bg-white border border-[#c9c4d8]/20 focus:border-[#5b3cdd] focus:ring-0 px-4 py-4 rounded-xl font-body text-lg transition-all outline-none"
              />
            )}
          </div>
        ))}
      </div>
      <ContinueButton
        onClick={onNext}
        disabled={
          step.required &&
          fields.some(
            (f) =>
              !v[f.name] ||
              (typeof v[f.name] === "string" && !v[f.name].trim()),
          )
        }
      />
    </div>
  );
}

const ACCOUNT_HEADLINE_ACCENT_CLASS =
  "bg-gradient-to-r from-[#5b3cdd] via-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent";

function AccountStepAccentHeadline({ mode, step, sc }) {
  const headlineClass =
    "font-headline text-2xl font-extrabold tracking-tight text-[#1c1a24] md:text-3xl";
  if (mode === "login") {
    const p = sc.loginHeadlineParts;
    if (p?.accent != null) {
      return (
        <h1 className={headlineClass}>
          {p.lead}
          <span className={ACCOUNT_HEADLINE_ACCENT_CLASS}>{p.accent}</span>
          {p.tail ?? ""}
        </h1>
      );
    }
    return (
      <h1 className={headlineClass}>
        {sc.loginHeadline || "Log in to continue."}
      </h1>
    );
  }
  const p = sc.signupHeadlineParts;
  if (p?.accent != null) {
    return (
      <h1 className={headlineClass}>
        {p.lead}
        <span className={ACCOUNT_HEADLINE_ACCENT_CLASS}>{p.accent}</span>
        {p.tail ?? ""}
      </h1>
    );
  }
  return (
    <h1 className={headlineClass}>
      {sc.signupHeadline || step.title || "View My Results"}
    </h1>
  );
}

function AccountCreateStep({
  step,
  value,
  onChange,
  onNext,
  onAuthenticated,
  notice,
}) {
  const v = value || { email: "", password: "", authMode: "signup" };
  const [mode, setMode] = useState(v.authMode === "login" ? "login" : "signup");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState("");
  const [providers, setProviders] = useState({
    google: false,
    apple: false,
  });
  const extraFields = Array.isArray(step.config?.fields)
    ? step.config.fields
    : [];
  const requiredExtraFields = extraFields.filter((field) => field.required);

  useEffect(() => {
    onChange({
      ...v,
      authMode: mode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data || typeof data !== "object") return;
        setProviders({
          google: Boolean(data.google),
          apple: Boolean(data.apple),
        });
      })
      .catch(() => { });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOAuthMessage = useCallback(
    async (event) => {
      if (event.origin !== window.location.origin) return;
      const payload = parseOAuthPopupPayload(event.data);
      if (!payload?.type) return;

      if (payload.type === "oauth_error") {
        setOauthLoading("");
        setError(
          OAUTH_ERROR_MESSAGES[payload.error] ||
          "Sign-in failed. Please try again.",
        );
        return;
      }

      if (payload.type !== "oauth_success") return;

      try {
        const response = await fetch("/api/auth/me");
        const user = response.ok
          ? await response.json().catch(() => null)
          : null;

        onChange({
          ...v,
          authMode: mode,
          accountCreated: true,
          email: user?.email || payload.user?.email || v.email || "",
          userId: user?.id || payload.user?.id || null,
        });
        onAuthenticated?.(user || payload.user || null);
        onNext();
      } catch {
        setOauthLoading("");
        setError("We signed you in, but could not continue the funnel yet.");
      }
    },
    [mode, onAuthenticated, onChange, onNext, v],
  );

  useEffect(() => {
    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, [handleOAuthMessage]);

  const emailValid = v.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email);
  const passwordValid =
    mode === "login"
      ? typeof v.password === "string" && v.password.trim().length > 0
      : typeof v.password === "string" &&
      v.password.length >= 8 &&
      /\d/.test(v.password);
  const extraFieldsValid =
    mode === "login"
      ? true
      : requiredExtraFields.every((field) => {
        const fieldValue = v[field.name];
        if (field.type === "checkbox") {
          return Boolean(fieldValue);
        }
        return typeof fieldValue === "string"
          ? fieldValue.trim().length > 0
          : Boolean(fieldValue);
      });
  const canSubmit =
    mode === "login"
      ? emailValid && passwordValid
      : emailValid && passwordValid && extraFieldsValid;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setError("");

    try {
      if (mode === "login") {
        setLoading(true);
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: v.email,
            password: v.password,
          }),
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          setError(payload?.error || "Login failed. Please try again.");
          setLoading(false);
          return;
        }

        onChange({
          ...v,
          authMode: mode,
          accountCreated: true,
          userId: payload?.user?.id || null,
        });
        onAuthenticated?.(payload?.user || null);
        onNext();
        return;
      }

      // Signup: register with email and password
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: v.email,
          password: v.password,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      onChange({
        ...v,
        authMode: mode,
        accountCreated: true,
        userId: payload?.user?.id || null,
      });
      onAuthenticated?.(payload?.user || null);
      onNext();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const openProvider = (provider) => {
    setError("");
    setOauthLoading(provider);
    openOAuthPopup(`/api/auth/${provider}`);
  };

  const sc = step.config || {};
  const oauthGoogleLabel =
    mode === "login"
      ? sc.oauthGoogleLogin || "Log in with Google"
      : sc.oauthGoogleSignup || "Continue with Google";
  const oauthAppleLabel =
    mode === "login"
      ? sc.oauthAppleLogin || "Log in with Apple"
      : sc.oauthAppleSignup || "Continue with Apple";
  const accountEyebrow =
    sc.accountEyebrow ??
    (String(step.title || "").includes("Almost there")
      ? step.title
      : null);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="text-center">
        {accountEyebrow ? (
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/[0.12] px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                aria-hidden
              />
              {accountEyebrow}
            </span>
          </div>
        ) : null}
        <AccountStepAccentHeadline mode={mode} step={step} sc={sc} />
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[#484555]">
          {mode === "login"
            ? sc.loginLede ||
              "Pick up where you left off without losing your progress."
            : sc.signupLede ||
              "See how much weight you could lose. Skip the waiting room and create your secure account to keep going."}
        </p>

        {/* Client funnel: AUTH TABS — “Create account” | “I already have one” (glp1-funnel CONTENT.account) */}
        <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-1.5 rounded-[14px] border border-[#e2dced] bg-[#f3efff] p-1">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => setMode("signup")}
            className={`rounded-[10px] px-3 py-2.5 text-sm font-semibold tracking-tight transition-all ${mode === "signup"
                ? "bg-[#5b3cdd] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_14px_rgba(91,60,221,0.35)]"
                : "bg-transparent text-[#797587] hover:text-[#484555]"
              }`}
          >
            {sc.authTabSignup || "Create account"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            onClick={() => setMode("login")}
            className={`rounded-[10px] px-3 py-2.5 text-sm font-semibold tracking-tight transition-all ${mode === "login"
                ? "bg-[#5b3cdd] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_14px_rgba(91,60,221,0.35)]"
                : "bg-transparent text-[#797587] hover:text-[#484555]"
              }`}
          >
            {sc.authTabLogin || "I already have one"}
          </button>
        </div>
      </section>

      <div className="rounded-[1rem] border border-[#c9c4d8]/20 bg-white p-6 shadow-[0_32px_64px_-12px_rgba(28,26,36,0.04)] md:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {notice ? (
            <div className="rounded-[1rem] border border-[#d8cffd] bg-[#f6f2ff] px-4 py-3 text-sm text-[#4c3aa9]">
              {notice}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <>
              {mode === "signup" && extraFields.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {extraFields.map((field) => {
                    const fieldValue =
                      field.type === "checkbox"
                        ? Boolean(v[field.name])
                        : v[field.name] || "";
                    const wrapperClass =
                      field.type === "textarea" || field.fullWidth
                        ? "md:col-span-2"
                        : "";

                    return (
                      <div key={field.name} className={wrapperClass}>
                        <label className="mb-1.5 ml-1 block text-xs font-semibold text-[#797587]">
                          {field.label}
                        </label>
                        {field.type === "checkbox" ? (
                          <label className="flex items-center gap-3 rounded-[1rem] border border-[#d7d1e4] px-4 py-4 text-sm text-[#1c1a24]">
                            <input
                              type="checkbox"
                              checked={fieldValue}
                              onChange={(e) =>
                                onChange({
                                  ...v,
                                  [field.name]: e.target.checked,
                                })
                              }
                              className="h-4 w-4 rounded border-[#c9c4d8] text-[#5b3cdd] focus:ring-[#5b3cdd]"
                            />
                            <span>{field.placeholder || field.label}</span>
                          </label>
                        ) : field.type === "textarea" ? (
                          <textarea
                            value={fieldValue}
                            onChange={(e) =>
                              onChange({
                                ...v,
                                [field.name]: e.target.value,
                              })
                            }
                            rows={4}
                            placeholder={field.placeholder || ""}
                            className={`${RECT_INPUT_CLASS} resize-none`}
                          />
                        ) : (
                          <input
                            type={field.type || "text"}
                            value={fieldValue}
                            onChange={(e) =>
                              onChange({
                                ...v,
                                [field.name]: e.target.value,
                              })
                            }
                            placeholder={field.placeholder || ""}
                            className={RECT_INPUT_CLASS}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div>
                <label className="mb-1.5 ml-1 block text-xs font-semibold text-[#797587]">
                  Email
                </label>
                <input
                  type="email"
                  value={v.email || ""}
                  onChange={(e) => onChange({ ...v, email: e.target.value })}
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                  className={RECT_INPUT_CLASS}
                />
              </div>

              <div>
                <label className="mb-1.5 ml-1 block text-xs font-semibold text-[#797587]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={v.password || ""}
                    onChange={(e) =>
                      onChange({ ...v, password: e.target.value })
                    }
                    placeholder={
                      mode === "signup"
                        ? "At least 8 characters"
                        : "Password"
                    }
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    required
                    className={`${RECT_INPUT_CLASS} pr-20`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#484555]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {mode === "signup" ? (
                  <p className="mt-2 px-1 text-[11px] text-[#797587]">
                    Must be at least 8 characters with one number.
                  </p>
                ) : null}
              </div>
            </>

            {mode === "login" ? (
              <div className="-mt-1 flex justify-end">
                <Link
                  href={buildSupportMailto("Password reset help")}
                  className="text-[13px] font-medium text-[#5b3cdd] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            ) : null}

            {mode === "signup" ? (
              <p className="text-sm leading-6 text-[#484555]">
                By continuing, you agree to the{" "}
                <Link
                  href={LEGAL_ROUTE_PATHS.privacy}
                  className="text-[#5b3cdd] hover:underline"
                >
                  Privacy Policy
                </Link>
                ,{" "}
                <Link
                  href={LEGAL_ROUTE_PATHS.terms}
                  className="text-[#5b3cdd] hover:underline"
                >
                  Terms
                </Link>
                , and{" "}
                <Link
                  href={LEGAL_ROUTE_PATHS.telehealthConsent}
                  className="text-[#5b3cdd] hover:underline"
                >
                  Telehealth Consent
                </Link>
                .
              </p>
            ) : null}

            {error ? (
              <div className="rounded-[1rem] bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || loading || Boolean(oauthLoading)}
              className={`${PRIMARY_PILL_BUTTON_CLASS} flex items-center justify-center gap-2`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4.5 w-4.5 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                  {mode === "login"
                    ? "Logging in..."
                    : "Creating your account..."}
                </span>
              ) : (
                <>
                  <span>
                    {mode === "login"
                      ? sc.loginCta || "Log in"
                      : sc.signupCta || "Create Account"}
                  </span>
                  <svg
                    className="h-[18px] w-[18px] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {providers.google || providers.apple ? (
            <>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-px flex-1 bg-[#e2dced]" />
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-[#797587]">
                  or
                </span>
                <div className="h-px flex-1 bg-[#e2dced]" />
              </div>

              <div className="space-y-3">
                {providers.google ? (
                  <button
                    type="button"
                    onClick={() => openProvider("google")}
                    disabled={loading || Boolean(oauthLoading)}
                    className="flex w-full items-center justify-center gap-3 rounded-[1rem] border border-[#d7d1e4] bg-white px-4 py-4 text-base font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {oauthLoading === "google" ? (
                      <span className="h-4.5 w-4.5 rounded-full border-2 border-[#d7d1e4] border-t-[#5b3cdd] animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    {oauthGoogleLabel}
                  </button>
                ) : null}

                {providers.apple ? (
                  <button
                    type="button"
                    onClick={() => openProvider("apple")}
                    disabled={loading || Boolean(oauthLoading)}
                    className="flex w-full items-center justify-center gap-3 rounded-[1rem] border border-[#d7d1e4] bg-white px-4 py-4 text-base font-medium text-[#17181d] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {oauthLoading === "apple" ? (
                      <span className="h-4.5 w-4.5 rounded-full border-2 border-[#d7d1e4] border-t-[#5b3cdd] animate-spin" />
                    ) : (
                      <svg
                        className="h-5 w-5 text-black"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    )}
                    {oauthAppleLabel}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TextAlertsStep({ step, onNext }) {
  const benefits = step.config?.benefits || [
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
  ];
  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <span className="inline-flex rounded-full bg-[#f3efff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5b3cdd]">
          {`Step ${step.order || ""} · Stay in the loop`}
        </span>
        <h1 className="font-headline text-2xl font-bold text-[#1c1a24]">
          {step.title}
        </h1>
        {step.subtitle && (
          <p className="text-sm text-[#484555]">{step.subtitle}</p>
        )}
      </div>

      <div className="space-y-2.5">
        {benefits.map((b, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-[1rem] border border-[#e2dced] bg-white px-3.5 py-2.5 shadow-[0_6px_14px_rgba(28,26,36,0.03)]"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[0.85rem] bg-[#f3efff] text-[#4c34c7]">
              <AppIcon name={b.icon} className="text-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#1c1a24]">{b.title}</p>
              <p className="text-xs text-[#797587]">{b.desc}</p>
            </div>
            <AppIcon
              name="check_circle"
              className="text-[18px] text-[#5b3cdd]"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-1">
        <button
          onClick={() => onNext("opted_in")}
          className={PRIMARY_PILL_BUTTON_CLASS}
        >
          Yes, I&apos;d like to receive updates
        </button>
        <button
          onClick={() => onNext("opted_out")}
          className={SECONDARY_PILL_BUTTON_CLASS}
        >
          No, I don&apos;t want to receive updates
        </button>
      </div>

      <div className="rounded-[1.15rem] border border-[#ddd8e9] bg-white px-4 py-4 text-sm leading-6 text-[#5f5a6d]">
        <p>
          By selecting &ldquo;Text me updates&rdquo;, you agree to receive texts
          from HealSend to the number you provided. Message and data rates may
          apply. Message frequency varies. Reply HELP for help. Reply STOP to
          opt out.
        </p>
        <p className="mt-3">
          Read HealSend&apos;s{" "}
          <Link
            href={LEGAL_ROUTE_PATHS.terms}
            className="font-semibold text-[#1c1a24] underline underline-offset-2"
          >
            terms
          </Link>{" "}
          and{" "}
          <Link
            href={LEGAL_ROUTE_PATHS.privacy}
            className="font-semibold text-[#1c1a24] underline underline-offset-2"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function formatPlanFirstMonthBlurb(plan) {
  const raw = plan?.firstMonth ?? plan?.firstMonthPrice;
  const n = parseAmountValue(raw);
  if (n === 0) return "Free first month";
  return `${raw || `$${n}`} first month`;
}

function formatPlanThenBlurb(plan) {
  const then = plan?.thenPrice || plan?.recurringPrice;
  return then ? `then ${then} · lowest rate` : "";
}

function PlanSelectionStep({
  step,
  value,
  onChange,
  onNext,
  checkoutPricingMode,
}) {
  const plans = step.config?.plans || [];

  function handleSelect(planId) {
    onChange(planId);
    onNext();
  }

  const planSortPriority = { 3: 1, 12: 2, 1: 3 };
  const visiblePlans = [...plans]
    .filter((p) => resolveDurationMonths(p) !== 6)
    .sort((a, b) => {
      const ma = resolveDurationMonths(a);
      const mb = resolveDurationMonths(b);
      const pa = planSortPriority[ma] || 20;
      const pb = planSortPriority[mb] || 20;
      if (pa !== pb) return pa - pb;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex rounded-full bg-[#f3efff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5b3cdd]">
          {`Step ${step.order || ""} · Choose your plan`}
        </span>
        <h1 className="font-headline text-[1.85rem] font-extrabold leading-tight text-[#1c1a24]">
          {step.title || "Choose your treatment plan"}
        </h1>
        <p className="text-sm text-[#797587]">
          {step.subtitle ||
            "All plans include provider consultation, medication, and ongoing support."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1">
          {[
            "FDA-inspected facility",
            "Licensed US providers",
            "HIPAA compliant",
          ].map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[#797587]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#5b3cdd]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3 lg:gap-8">
        {visiblePlans.map((plan) => {
        const months = resolveDurationMonths(plan);
        const dailyAvg = resolvePlanDailyAverage(plan);
        const firstMonthRaw = plan?.firstMonth ?? plan?.firstMonthPrice;
        const firstMonthAmount =
          parseAmountValue(firstMonthRaw) || parseAmountValue(plan.thenPrice || plan.recurringPrice);
        const recurring = plan.thenPrice || plan.recurringPrice || plan.firstMonth;
        const baseFeatures =
          Array.isArray(plan.features) && plan.features.length > 0
            ? [...plan.features]
            : months === 3
              ? [
                  "1:1 provider consultations",
                  "GLP-1 medication included",
                  "Free metabolic health kit",
                  "Free cold-chain shipping",
                ]
              : months === 12
                ? [
                    "Priority 1:1 specialist access",
                    "Full 12mo GLP-1 supply",
                    "Continuous Glucose Monitor (CGM)",
                    "Premium lab testing suite",
                    "Concierge shipping & support",
                ]
              : months === 1
                ? [
                    "Standard medical screening",
                    "GLP-1 prescription service",
                    "Digital coaching platform",
                    "Standard shipping",
                  ]
                : [];
        const hasShippingFeature = baseFeatures.some((feature) =>
          String(feature || "").toLowerCase().includes("shipping"),
        );
        const planFeatures =
          months === 1 && !hasShippingFeature
            ? [...baseFeatures, "Free shipping"]
            : baseFeatures;
        const isPopular = months === 12;
        const yearlyTotal =
          months === 12
            ? Math.round(resolveProjectedPlanTotal(plan))
            : null;
        return (
          <div
            key={plan.id}
            className={`relative flex min-h-0 flex-col space-y-4 rounded-[1.15rem] border bg-white px-5 pb-5 pt-5 shadow-[0_8px_18px_rgba(28,26,36,0.04)] md:px-6 md:pb-5 md:pt-6 ${
              isPopular
                ? "border-[#0b57d0] ring-1 ring-[#0b57d0]/30"
                : "border-[#dfe3f2]"
            }`}
          >
            {isPopular ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0b57d0] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                Most Popular
              </span>
            ) : null}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-headline text-[2rem] font-extrabold leading-tight text-[#111827]">
                  {plan.name}
                </h3>
              </div>
            </div>
            <div>
              {months === 12 && dailyAvg ? (
                <>
                  <p className="font-headline text-[1.2rem] font-semibold text-[#4b5563]">
                    ${""}
                    <span className="text-[3.2rem] font-extrabold leading-none text-[#0b57d0]">
                      {dailyAvg.toFixed(2)}
                    </span>
                    /day
                  </p>
                  <p className="text-[0.95rem] font-medium text-[#6b7280]">
                    Billed annually at ${yearlyTotal}/yr
                  </p>
                </>
              ) : (
                <>
                  <p className="font-headline text-[1.15rem] font-semibold text-[#4b5563]">
                    $
                    <span className="text-[2.5rem] font-extrabold leading-none text-[#111827]">
                      {Math.round(firstMonthAmount || parseAmountValue(recurring))}
                    </span>
                    {months === 1 ? "/mo" : "/first mo"}
                  </p>
                  {months !== 1 ? (
                    <p className="text-[0.95rem] text-[#6b7280]">
                      Then {recurring}/mo thereafter
                    </p>
                  ) : (
                    <p className="text-[0.95rem] text-[#6b7280]">
                      No commitment, cancel anytime
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="space-y-2">
              {planFeatures.slice(0, 5).map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-[1.05rem] text-[#4b5563]">
                  <AppIcon name="check_circle" className="text-[18px] text-[#0f8a63]" />
                  <span>{feature}</span>
                </p>
              ))}
            </div>
            <div className="mt-auto flex justify-center pt-1">
              <button
                type="button"
                onClick={() => handleSelect(plan.id)}
                className={`rounded-lg px-8 py-2.5 font-headline text-sm font-bold transition-colors md:text-base ${
                  isPopular
                    ? "bg-[#0b57d0] text-white hover:bg-[#0848ad]"
                    : "border border-[#d8deef] bg-[#eef2ff] text-[#0b57d0] hover:bg-[#e4ebff]"
                }`}
              >
                Select Plan
              </button>
            </div>
          </div>
        );
        })}
      </div>

      {/* Bottom trust row */}
      <div className="space-y-2 pt-1 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {[
            { icon: "○", label: "No hidden fees" },
            { icon: "⏱", label: "Ships within 48hrs" },
            { icon: "✦", label: "HSA/FSA eligible" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1 text-[11px] font-medium text-[#797587]"
            >
              <span className="text-[10px]">{icon}</span>
              {label}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-[#b0acbe]">
          Licensed US providers &middot; HIPAA compliant &middot; Cancel anytime
        </p>
      </div>
    </div>
  );
}

function MedicationSelectStep({ step, value, onChange, onNext }) {
  const medications = step.config?.medications || [];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-headline text-2xl font-bold text-[#1c1a24]">
          {step.title}
        </h1>
        {step.subtitle && (
          <p className="text-sm text-[#484555]">{step.subtitle}</p>
        )}
      </div>

      <div className="space-y-4">
        {medications.map((med) => {
          const isSelected = value === med.id;
          return (
            <button
              key={med.id}
              onClick={() => onChange(med.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all hover:scale-[1.01] relative ${isSelected
                  ? "border-[#5b3cdd] bg-[#fdf8ff] shadow-md"
                  : "border-[#c9c4d8]/30 bg-white hover:border-[#5b3cdd]/40"
                }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full hs-gradient flex items-center justify-center">
                  <AppIcon name="check" className="text-white text-[14px]" />
                </div>
              )}
              {med.badge && (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-3 ${med.badgeClass || "bg-[#f1ecf9] text-[#5b3cdd]"
                    }`}
                >
                  {med.badge}
                </span>
              )}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#f1ecf9] flex items-center justify-center flex-shrink-0">
                  <AppIcon
                    name={med.icon || "medication"}
                    className="text-[#5b3cdd] text-[28px]"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-headline font-bold text-[#1c1a24]">
                      {med.name}
                    </h3>
                    {med.price && (
                      <span className="font-bold text-[#5b3cdd] text-sm">
                        {med.price}
                      </span>
                    )}
                  </div>
                  {med.description && (
                    <p className="text-xs text-[#797587] mt-1">
                      {med.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <ContinueButton onClick={onNext} disabled={!value} />
    </div>
  );
}

function CheckoutStep({
  step,
  data,
  onNext,
  onRequireAccount,
  templateId,
  steps,
  checkoutPricingMode,
}) {
  const [openFaq, setOpenFaq] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [initError, setInitError] = useState("");
  const [loading, setLoading] = useState(true);
  const [publishableKey, setPublishableKey] = useState("");
  const [requiresAuth, setRequiresAuth] = useState(false);
  const stripePromise = React.useMemo(
    () => getStripePromise(publishableKey),
    [publishableKey],
  );
  const checkoutSelection = React.useMemo(
    () => getCheckoutSelection(data, steps, step.config?.summary),
    [data, step.config?.summary, steps],
  );
  const pricingState = React.useMemo(
    () =>
      getCheckoutPricingState({
        styling: checkoutPricingMode,
        selectedPlan: checkoutSelection.selectedPlan,
        selectedMedication: checkoutSelection.selectedMedication,
        summary: step.config?.summary,
      }),
    [
      checkoutPricingMode,
      checkoutSelection.selectedMedication,
      checkoutSelection.selectedPlan,
      step.config?.summary,
    ],
  );
  const totalAmount = pricingState.totalAmount;
  const dueTodayAmount = pricingState.dueTodayAmount;
  const monthlyInstallment = pricingState.monthlyInstallment;
  const monthlyRate = pricingState.monthlyRate;
  const durationMonths = pricingState.durationMonths;
  const allowsBnpl = pricingState.allowsBnpl;

  // ── Payment mode is set by admin funnel settings (not user-selectable) ──────
  const effectivePricingMode = pricingState.pricingMode;
  const effectiveDueTodayAmount =
    effectivePricingMode === "ALL_AT_ONCE" ? totalAmount : 0;
  const effectiveAllowsBnpl =
    effectivePricingMode === "ALL_AT_ONCE" && allowsBnpl;
  const selectedMedicationLabel =
    checkoutSelection.selectedMedication?.name ||
    step.config?.summary?.medicationLabel ||
    "Selected at checkout";
  const selectedPlanLabel =
    checkoutSelection.selectedPlan?.name ||
    step.config?.summary?.planLabel ||
    "Recommended plan";
  const dailyAmount = resolvePerDayAmount(checkoutSelection.selectedPlan);
  const firstMonthRaw =
    checkoutSelection.selectedPlan?.firstMonth ||
    checkoutSelection.selectedPlan?.firstMonthPrice ||
    "$0";
  const firstMonthAmount = parseAmountValue(firstMonthRaw);
  const monthsRemaining = Math.max((durationMonths || 1) - 1, 0);
  const monthlyAmount = parseAmountValue(monthlyRate) || 0;
  const compareClinicAmount = Math.max(
    Math.round(totalAmount + 13599),
    Math.round(totalAmount * 2.2),
  );
  const totalSavings = Math.max(compareClinicAmount - totalAmount, 0);
  const isGlp1 = steps.some(
    (s) => s.type === "BMI_CALCULATOR" || s.type === "GLP1_PLAN_INTRO",
  );
  const warrantyLabel = isGlp1
    ? "HealSend Weight Loss Warranty"
    : "HealSend Care Warranty";

  const planFeatures = checkoutSelection.selectedPlan?.features;
  const orderBenefits =
    Array.isArray(planFeatures) && planFeatures.length > 0
      ? planFeatures.slice(0, 4)
      : step.config?.checkoutOrderBenefits || [
          "Flexible month-to-month",
          "Clinically proven",
          "Results or you don't pay",
          "No long-term commitment",
        ];

  const defaultIncludedBenefits = [
    {
      title: "Unlimited Video Calls With Clinicians",
      previousPrice: "$129",
    },
    {
      title: "Always On Medical Assistance via Phone",
      previousPrice: "$89",
    },
    {
      title: "100% U.S. Based HealSend Care Agents",
      previousPrice: "$69",
    },
    {
      title: "On-Time Refills Guaranteed",
      previousPrice: "$49",
    },
    {
      title: "Access the HealSend Member Community",
      previousPrice: "$29",
    },
    {
      title: warrantyLabel,
      previousPrice: "$179",
    },
  ];
  const includedBenefits =
    Array.isArray(step.config?.includedBenefits) &&
    step.config.includedBenefits.length > 0
      ? step.config.includedBenefits
      : defaultIncludedBenefits;

  useEffect(() => {
    if (!templateId) return;

    setLoading(true);
    setInitError("");

    const createIntent = async () => {
      try {
        const res = await fetch("/api/onboarding-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId,
            medicationId: checkoutSelection.medicationId,
            planId: checkoutSelection.planId,
            preferredPricingMode: pricingState.pricingMode,
          }),
        });
        const json = await res.json();
        if (res.status === 401) {
          setRequiresAuth(true);
          setInitError("");
          setLoading(false);
          onRequireAccount?.(
            "Log in or create your account inside the funnel to finish checkout.",
          );
          return;
        }
        if (!res.ok) {
          setInitError(json.error || "Failed to initialize payment.");
          setLoading(false);
          return;
        }
        setClientSecret(json.clientSecret);
        setPublishableKey(json.publishableKey || "");
        setLoading(false);
      } catch {
        setInitError("Failed to connect to payment service.");
        setLoading(false);
      }
    };

    createIntent();
  }, [
    checkoutSelection.medicationId,
    checkoutSelection.planId,
    pricingState.pricingMode,
    onRequireAccount,
    templateId,
  ]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-extrabold text-[#1c1a24] md:text-5xl">
            {step.config?.checkoutHeadline || "Start Your Transformation Today"}
          </h1>
          {step.subtitle && (
            <p className="text-sm text-[#484555] md:text-base">
              {step.subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#5b3cdd]/20 border-t-[#5b3cdd] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-extrabold text-[#1c1a24] md:text-5xl">
            {step.config?.checkoutHeadline || "Start Your Transformation Today"}
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-700 text-sm">{initError}</p>
          <p className="mt-2 text-xs text-red-500">
            Please review your account and treatment history, then try again.
          </p>
        </div>
      </div>
    );
  }

  if (requiresAuth) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-extrabold text-[#1c1a24] md:text-5xl">
            {step.config?.checkoutHeadline || "Start Your Transformation Today"}
          </h1>
        </div>
        <div className="bg-white rounded-2xl border border-[#c9c4d8]/20 p-6 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1ecf9]">
            <AppIcon name="person" className="text-[#5b3cdd] text-2xl" />
          </div>
          <div className="space-y-2">
            <p className="text-base font-semibold text-[#1c1a24]">
              Log in or create an account to finish checkout.
            </p>
            <p className="text-sm text-[#484555]">
              Your answers are already saved, and the funnel will continue as
              soon as you complete the account step.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRequireAccount?.()}
            className="mx-auto rounded-[1rem] bg-[#5b3cdd] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4a2fc7]"
          >
            Go to account step
          </button>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <h1 className="font-headline text-2xl font-extrabold leading-tight text-[#1c1a24] md:text-3xl">
            {step.config?.checkoutHeadline || "Start Your Transformation Today"}
          </h1>
        </div>
        <div className="rounded-[1rem] border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm font-semibold text-red-700">
            Payment form is not available right now.
          </p>
          <p className="mt-2 text-xs text-red-500">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  const trustChips = step.config?.checkoutTrustChips;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-1">
        <h1 className="font-headline text-[2.1rem] font-extrabold leading-tight text-[#001b8f] md:text-[2.4rem]">
          Order Summary
        </h1>
      </div>

      <div className="overflow-hidden rounded-[1.4rem] border border-[#dbe0f2] bg-white shadow-[0_14px_34px_rgba(28,26,36,0.05)]">
        <div className="bg-[#3f4fde] px-5 py-3 text-center text-sm font-semibold text-white md:px-8">
          {step.config?.fsaBannerText ?? "FSA/HSA eligible for reimbursement"}
        </div>
        <div className="space-y-6 px-5 py-6 md:px-8 md:py-7">
          <div className="border-b border-[#edf0f8] pb-4">
            <h2 className="font-headline text-[2rem] font-extrabold text-[#0f172a]">
              {selectedPlanLabel}
            </h2>
            <p className="text-[1.2rem] italic text-[#616a81]">Billed monthly</p>
          </div>

          <div className="space-y-0.5 text-[1.05rem] text-[#1c1a24]">
            <div className="flex items-center justify-between gap-4 py-2">
              <span>First month membership</span>
              <span className="font-semibold text-[#0f172a] tabular-nums">
                {formatCheckoutCurrency(firstMonthAmount || monthlyAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <span>Subsequent months</span>
              <span className="font-semibold text-[#0f172a] tabular-nums">
                {formatCheckoutCurrency(monthlyAmount)}/mo
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <span>Online Clinician Visit</span>
              <span className="font-semibold text-[#2f8d4e]">FREE</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <span>Overnight Cold-Chain Shipping</span>
              <span className="font-semibold text-[#2f8d4e]">FREE</span>
            </div>
            <div className="flex flex-col gap-1 py-2">
              <div className="flex items-center justify-between gap-4">
                <span>Protected by {warrantyLabel}</span>
                <span className="font-semibold text-[#2f8d4e]">Activated</span>
              </div>
              {step.config?.warrantyTagline ? (
                <p className="text-xs text-[#5f5a6d]">
                  {step.config.warrantyTagline}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[1rem] border border-[#dde6eb] bg-[#f8fcfb] px-4 py-3">
            <div className="flex items-center justify-between gap-4 text-[#6f6a7f]">
              <p className="text-[1.05rem] font-bold uppercase tracking-[0.08em]">
                vs. traditional clinics
              </p>
              <p className="text-[1.9rem] font-semibold line-through tabular-nums">
                {formatCheckoutCurrency(compareClinicAmount)}
              </p>
            </div>
            <div className="mt-1 flex items-end justify-between gap-4">
              <p className="font-headline text-[2rem] font-bold text-[#001b8f]">
                Your Total Savings
              </p>
              <p className="font-headline text-[2.65rem] font-extrabold leading-none text-[#001b8f] tabular-nums">
                -{formatCheckoutCurrency(totalSavings)}
              </p>
            </div>
          </div>

          <div className="border-t border-[#e7ebf8] pt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-headline text-[3rem] font-extrabold leading-none text-[#001b8f]">
                  {effectivePricingMode === "UPFRONT_ZERO"
                    ? "Total After Approval"
                    : "Total Due Today"}
                </p>
                {dailyAmount ? (
                  <p className="mt-1 text-[1.25rem] text-[#5f5a6d]">
                    Breakdown: only ${dailyAmount.toFixed(2)}/day
                  </p>
                ) : null}
              </div>
              <p className="font-headline text-[4rem] font-extrabold leading-none text-[#001b8f] tabular-nums">
                {formatCheckoutCurrency(effectiveDueTodayAmount)}
              </p>
            </div>

            {effectiveAllowsBnpl ? (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-[#484555]">
                <span>Express checkout:</span>
                <ApplePayBadge className="h-9" />
                <GooglePayBadge className="h-9" />
                <KlarnaBadge className="h-9 w-9 text-[0.9rem]" />
                <AfterpayBadge className="h-9 w-9" />
              </div>
            ) : null}

            <p className="mt-4 text-sm text-[#5f5a6d]">
              Plan selected:{" "}
              <span className="font-semibold text-[#1c1a24]">
                {selectedPlanLabel}
              </span>
            </p>
          </div>
        </div>
      </div>

      {dailyAmount ? (
        <div className="rounded-[1.35rem] border border-[#dfe1fb] bg-gradient-to-r from-[#f2f4ff] to-[#eef1ff] px-5 py-6 text-center shadow-[0_10px_24px_rgba(28,26,36,0.04)] md:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6f6a7f]">
            Just
          </p>
          <p className="font-headline text-[4rem] font-extrabold leading-none text-[#3740d1]">
            ${dailyAmount.toFixed(2)}
            <span className="text-[3rem]">/day</span>
          </p>
          <p className="mt-1 text-base font-semibold text-[#6f6a7f]">
            Less than a coffee
          </p>
        </div>
      ) : null}

      {Array.isArray(trustChips) && trustChips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {trustChips.map((label) => (
            <span
              key={label}
              className="rounded-[0.75rem] border border-[#dfe1fb] bg-[#eef1ff] px-3 py-1.5 text-sm font-semibold text-[#3740d1]"
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-[#1f2439] bg-[#0f1220] px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[0.85rem] bg-[#1a1f35] text-[#6f78ff]">
            <AppIcon name="local_shipping" className="text-[1.2rem]" />
          </span>
          <div>
            <p className="text-xl font-bold leading-tight">FedEx Express</p>
            <p className="text-sm text-white/80">Medicine arrives within 2 business days</p>
          </div>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-sm font-extrabold text-[#4626a8]">
          FedEx
        </span>
      </div>

      <div className="rounded-[1.35rem] border border-[#dfe1fb] bg-[#eef1ff] px-5 py-5 shadow-[0_10px_24px_rgba(28,26,36,0.04)] md:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-headline text-xl font-bold text-[#1c1a24]">
            Your all-inclusive plan includes upgraded benefits
          </h2>
          <AppIcon name="redeem" className="text-[1.4rem] text-[#5560db]" />
        </div>
        <div className="space-y-3">
          {includedBenefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-center justify-between gap-3 rounded-[1rem] bg-white/80 px-4 py-3 text-sm text-[#1c1a24]"
            >
              <span>{benefit.title}</span>
              <span className="flex items-center gap-3 whitespace-nowrap">
                <span className="text-[#8a8598] line-through">
                  {benefit.previousPrice}
                </span>
                <span className="font-semibold text-[#2f8d4e]">FREE</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {Array.isArray(step.config?.faq) && step.config.faq.length > 0 ? (
        <div className="rounded-[1.35rem] border border-[#dfe1fb] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(28,26,36,0.04)] md:px-6">
          <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
            Common questions
          </h2>
          <div className="mt-3 divide-y divide-[#ece8f3]">
            {step.config.faq.map((item, idx) => (
              <div key={`faq-${idx}`} className="py-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-[#1c1a24]"
                  onClick={() =>
                    setOpenFaq((prev) => (prev === idx ? null : idx))
                  }
                >
                  {item.q}
                  <AppIcon
                    name="arrow_downward"
                    className={`shrink-0 text-[#797587] transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === idx ? (
                  <p className="pb-3 text-sm leading-relaxed text-[#484555]">
                    {item.a}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Google Reviews trust strip ─────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-[#e8eaed] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <GoogleGLogo className="h-5 w-5 shrink-0" />
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-[#202124]">4.9</span>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <GoogleStarIcon key={i} filled />
            ))}
          </div>
        </div>
        <span className="text-sm text-[#70757a]">5 stars on Google</span>
        <div className="ml-auto hidden items-center gap-3 sm:flex">
          {[
            { initials: "SM", bg: "#4285F4" },
            { initials: "MT", bg: "#34A853" },
            { initials: "JR", bg: "#EA4335" },
          ].map(({ initials, bg }) => (
            <div
              key={initials}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white"
              style={{ backgroundColor: bg }}
            >
              {initials}
            </div>
          ))}
          <span className="text-xs text-[#70757a]">+125 more</span>
        </div>
      </div>

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#5b3cdd",
                colorText: "#1c1a24",
                colorTextSecondary: "#6d6879",
                colorBackground: "#ffffff",
                colorDanger: "#ff4f79",
                borderRadius: "16px",
                fontFamily: "inherit",
                spacingUnit: "6px",
              },
              rules: {
                ".Input": {
                  border: "1px solid rgba(186, 180, 210, 0.55)",
                  boxShadow: "none",
                  backgroundColor: "#fbfaff",
                },
                ".Input:focus": { border: "1px solid #5b3cdd" },
                ".Tab": {
                  border: "1px solid rgba(201, 196, 216, 0.35)",
                  boxShadow: "none",
                },
              },
            },
          }}
        >
          <StripePaymentForm
            onNext={onNext}
            totalAmount={totalAmount}
            dueTodayAmount={effectiveDueTodayAmount}
            checkoutPricingMode={effectivePricingMode}
            templateId={templateId}
            medicationId={checkoutSelection.medicationId}
            planId={checkoutSelection.planId}
          />
        </Elements>
      )}
    </div>
  );
}

/* ─── Stripe Payment Form (inside Elements provider) ─── */
function StripePaymentForm({
  onNext,
  totalAmount,
  dueTodayAmount,
  checkoutPricingMode,
  templateId,
  medicationId,
  planId,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [walletReady, setWalletReady] = useState(false);
  const [walletChecked, setWalletChecked] = useState(false);
  const [redirectingMethod, setRedirectingMethod] = useState("");
  const [verifyingMethod, setVerifyingMethod] = useState("");
  const paymentMethodsRef = React.useRef(null);
  const handledSessionRef = React.useRef("");
  const allowsBnpl =
    normalizeCheckoutPricingMode(checkoutPricingMode) === "ALL_AT_ONCE";
  const hasAlternativePayments = allowsBnpl || walletReady;

  const finishSuccessfulPayment = useCallback(
    (paymentIntent) => {
      if (
        paymentIntent &&
        (paymentIntent.status === "succeeded" ||
          paymentIntent.status === "requires_capture")
      ) {
        onNext({
          paymentComplete: true,
          stripePaymentIntentId: paymentIntent.id,
        });
        return true;
      }

      return false;
    },
    [onNext],
  );

  const handleBnplCheckout = useCallback(
    async (method) => {
      setRedirectingMethod(method);
      setError("");

      try {
        const response = await fetch("/api/onboarding-checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId,
            medicationId,
            planId,
            method,
            returnPath: getCurrentPath(),
          }),
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.sessionUrl) {
          throw new Error(
            payload?.error ||
            `Unable to start ${getPaymentMethodDisplayName(method)} right now.`,
          );
        }

        window.location.assign(payload.sessionUrl);
      } catch (bnplError) {
        setError(
          bnplError?.message ||
          "Unable to start that payment method right now. Please try again.",
        );
        setRedirectingMethod("");
      }
    },
    [medicationId, planId, templateId],
  );

  useEffect(() => {
    const checkoutStatus = searchParams.get("checkout_status");
    const checkoutMethod = searchParams.get("checkout_method");
    const checkoutSessionId = searchParams.get("checkout_session_id");

    if (checkoutStatus === "cancelled" && checkoutMethod) {
      setError(
        `${getPaymentMethodDisplayName(checkoutMethod)} checkout was cancelled. You can try again or use another payment option.`,
      );
      clearCheckoutReturnParams();
      setRedirectingMethod("");
      return;
    }

    if (
      checkoutStatus !== "success" ||
      !checkoutSessionId ||
      handledSessionRef.current === checkoutSessionId
    ) {
      return;
    }

    handledSessionRef.current = checkoutSessionId;
    setVerifyingMethod(checkoutMethod || "payment");
    setError("");

    let cancelled = false;

    const verifySession = async () => {
      try {
        const response = await fetch(
          `/api/onboarding-checkout/session?sessionId=${encodeURIComponent(checkoutSessionId)}`,
        );
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            payload?.error ||
            "Unable to verify your payment. Please try again.",
          );
        }

        if (!payload?.isReadyForSubmission) {
          throw new Error(
            `${getPaymentMethodDisplayName(checkoutMethod)} is still finalizing. Please refresh in a moment if it doesn't continue automatically.`,
          );
        }

        if (cancelled) return;
        clearCheckoutReturnParams();
        onNext({
          paymentComplete: true,
          stripeCheckoutSessionId: payload.sessionId,
          stripePaymentIntentId: payload.paymentIntentId || null,
        });
      } catch (verificationError) {
        if (cancelled) return;
        setError(
          verificationError?.message ||
          "We couldn't confirm your payment yet. Please try again.",
        );
        handledSessionRef.current = "";
        setVerifyingMethod("");
        setRedirectingMethod("");
        clearCheckoutReturnParams();
      }
    };

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [onNext, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (!finishSuccessfulPayment(paymentIntent)) {
      setError("Payment was not completed. Please try again.");
      setProcessing(false);
    }
  };

  const handleExpressCheckoutConfirm = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (!finishSuccessfulPayment(paymentIntent)) {
      setError(
        "Wallet payment could not be completed. Please try another method.",
      );
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-[1.35rem] border border-[#d9d4e7] bg-white p-4 shadow-[0_14px_32px_rgba(28,26,36,0.06)] md:space-y-4 md:p-5"
    >
      {verifyingMethod ? (
        <div className="flex items-center justify-center gap-3 rounded-[1rem] border border-[#d9d4e7] bg-[#faf8ff] px-4 py-3 text-center text-sm font-medium text-[#484555]">
          <span className="h-4.5 w-4.5 rounded-full border-2 border-[#d7d1e4] border-t-[#5b3cdd] animate-spin" />
          <span>
            Confirming your {getPaymentMethodDisplayName(verifyingMethod)}{" "}
            checkout...
          </span>
        </div>
      ) : null}

      {hasAlternativePayments ? (
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-[#ece8f3]" />
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b768c]">
            Express checkout
          </p>
          <span className="h-px flex-1 bg-[#ece8f3]" />
        </div>
      ) : null}

      {allowsBnpl ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PaymentShortcutRow
            onClick={() => handleBnplCheckout("klarna")}
            disabled={
              processing ||
              Boolean(redirectingMethod) ||
              Boolean(verifyingMethod)
            }
            loading={redirectingMethod === "klarna"}
            suffix="$0 today"
          >
            <KlarnaBadge />
            <span>Klarna</span>
          </PaymentShortcutRow>

          <PaymentShortcutRow
            onClick={() => handleBnplCheckout("afterpay_clearpay")}
            disabled={
              processing ||
              Boolean(redirectingMethod) ||
              Boolean(verifyingMethod)
            }
            loading={redirectingMethod === "afterpay_clearpay"}
            suffix="$0 today"
          >
            <AfterpayBadge />
            <span>Afterpay</span>
          </PaymentShortcutRow>
        </div>
      ) : null}

      {!walletChecked || walletReady ? (
        <div
          className={
            walletReady
              ? "rounded-[1rem] border border-[#d9d4e7] bg-[#f7f6ff] px-3 py-3 shadow-[0_8px_20px_rgba(28,26,36,0.05)] md:px-4"
              : "pointer-events-none absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
          }
          aria-hidden={!walletReady}
        >
          <ExpressCheckoutElement
            onConfirm={handleExpressCheckoutConfirm}
            onReady={({ availablePaymentMethods }) => {
              const hasAvailableMethods = Array.isArray(availablePaymentMethods)
                ? availablePaymentMethods.length > 0
                : Boolean(
                  availablePaymentMethods &&
                  Object.keys(availablePaymentMethods).length,
                );

              setWalletReady(hasAvailableMethods);
              setWalletChecked(true);
            }}
            options={{
              buttonHeight: 52,
              layout: {
                maxColumns: 2,
                maxRows: 1,
                overflow: "never",
              },
              paymentMethodOrder: ["applePay", "googlePay"],
              paymentMethods: {
                applePay: "always",
                googlePay: "always",
                link: "never",
              },
              buttonType: {
                applePay: "check-out",
                googlePay: "pay",
              },
            }}
          />
        </div>
      ) : null}

      <div className="flex items-center gap-3 pt-1">
        <span className="h-px flex-1 bg-[#ece8f3]" />
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b768c]">
          Or pay with card
        </p>
        <span className="h-px flex-1 bg-[#ece8f3]" />
      </div>

      <div
        ref={paymentMethodsRef}
        className="rounded-[1rem] border border-[#d9d4e7] bg-[#fcfbff] px-4 py-4 shadow-[0_8px_20px_rgba(28,26,36,0.05)] md:px-6"
      >
        <div className="space-y-2.5">
          <div className="space-y-0.5">
            <h3 className="font-headline text-[1.05rem] font-bold text-[#1c1a24] md:text-[1.15rem]">
              Payment details
            </h3>
            <p className="text-xs text-[#797587] md:text-sm">
              {hasAlternativePayments
                ? "Use Apple Pay, Google Pay, Klarna, Afterpay, card, or Link to finish checkout."
                : "Use card or Link to finish checkout."}
            </p>
          </div>
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card", "link"],
            }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-[1rem] border border-[#ffc3d3] bg-[#fff4f8] p-3 text-center">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="rounded-[1rem] border border-[#d9d4e7] bg-[#fcfbff] px-4 py-3.5 shadow-[0_8px_20px_rgba(28,26,36,0.05)] md:px-6">
        <button
          type="submit"
          disabled={
            processing ||
            !stripe ||
            !elements ||
            Boolean(redirectingMethod) ||
            Boolean(verifyingMethod)
          }
          className={`${PRIMARY_PILL_BUTTON_CLASS} inline-flex items-center justify-center gap-2`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Processing Payment...
            </span>
          ) : (
            <>
              Start my transformation
              <AppIcon name="lock" className="text-[1.05rem]" />
            </>
          )}
        </button>

        <div className="mt-3 text-center">
          <p className="mx-auto max-w-4xl text-xs leading-6 text-[#797587] md:text-sm">
            By continuing, you agree to the self-pay arrangement for your care.
            Your subscription renews automatically and you can adjust, pause, or
            cancel your plan from the patient portal.
          </p>
          {totalAmount > 0 && dueTodayAmount === 0 && (
            <p className="mt-2 text-xs font-medium text-[#5b3cdd] md:text-sm">
              $0 due today. A charge of {formatCheckoutCurrency(totalAmount)}{" "}
              will be applied to your card only after provider approval.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

function Glp1PlanIntroStep({ answers, steps, onNext }) {
  const primaryGoal = resolvePrimaryGoalCopy(
    getAnswerByStepType(answers, steps, "QUESTION_SINGLE"),
  );

  useEffect(() => {
    const t = setTimeout(() => onNext(), 3000);
    return () => clearTimeout(t);
  }, [onNext]);

  // Mirrors client funnel CONTENT.preview.timeline
  const journeySteps = [
    {
      title: "Quick health profile",
      desc: "Target weight, body & lifestyle",
      timing: "60s",
      active: true,
    },
    {
      title: "We match your plan",
      desc: "Medication, dose & timeline",
      timing: "30s",
      active: false,
    },
    {
      title: "Clinician reviews & prescribes",
      desc: "Fast provider review and next steps",
      timing: "30s",
      active: false,
    },
  ];

  return (
    <div className="rounded-[1.75rem] border border-[#d9d4e7] bg-white p-6 shadow-[0_24px_52px_rgba(28,26,36,0.06)] md:p-8">
      {/* Top row: icon + empty circle */}
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-[0.9rem] bg-[#eef1ff] text-[#5b3cdd]">
          <AppIcon name="chat" className="text-[1.35rem]" />
        </div>
        <span className="mt-0.5 h-7 w-7 rounded-full border-2 border-[#c9c4d8]" />
      </div>

      {/* Title */}
      <h1 className="mt-5 font-headline text-[2rem] font-extrabold leading-tight text-[#1c1a24] md:text-[2.4rem]">
        Your Personalized Plan — in 2 minutes.
      </h1>

      {/* Primary goal — CONTENT.preview.goalLabel */}
      <p className="mt-4 flex items-center gap-2 font-body text-[0.95rem] text-[#797587]">
        <AppIcon name="check" className="text-[1rem] text-emerald-500" />
        <span>
          Primary goal:{" "}
          <span className="font-semibold text-[#484555]">{primaryGoal}</span>
        </span>
      </p>

      {/* Timeline */}
      <div className="relative mt-7 space-y-3 pl-6">
        {/* Vertical line */}
        <div className="absolute left-[6px] top-2 bottom-2 w-px bg-[#d9d4e7]" />

        {journeySteps.map((journeyStep) => (
          <div key={journeyStep.title} className="relative">
            {/* Dot */}
            <span
              className={`absolute -left-6 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 ${journeyStep.active
                  ? "border-emerald-400 bg-emerald-400"
                  : "border-[#c9c4d8] bg-white"
                }`}
            />
            {/* Card */}
            <div
              className={`rounded-[1.1rem] border px-5 py-4 ${journeyStep.active
                  ? "border-[#d9d4e7] bg-white shadow-[0_4px_16px_rgba(28,26,36,0.06)]"
                  : "border-transparent bg-[#faf9fd]"
                }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-headline text-[1.05rem] font-bold leading-snug text-[#1c1a24]">
                    {journeyStep.title}
                  </p>
                  <p className="mt-0.5 font-body text-sm text-[#797587]">
                    {journeyStep.desc}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 font-body text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  {journeyStep.timing}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-progress bar */}
      <div
        className="mt-6 overflow-hidden rounded-full bg-[#ebe6f3]"
        style={{ height: "4px" }}
      >
        <motion.div
          className="h-full rounded-full bg-[#5b3cdd]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "linear" }}
        />
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-4 w-full rounded-full bg-[#5b3cdd] py-4 font-headline text-base font-bold text-white transition-opacity hover:opacity-90"
      >
        Continue
      </button>
    </div>
  );
}

function TransformationResultsCard({ outcome, onNext }) {
  const current = outcome.currentWeight || 200;
  const projectedLoss = outcome.projectedLoss || Math.round(current * 0.2);
  const target = outcome.targetWeight || current - projectedLoss;

  const effectiveLoss = current - target;
  const bmiValue =
    Number.isFinite(Number(outcome?.bmi)) && Number(outcome?.bmi) > 0
      ? Number(outcome?.bmi)
      : Number.isFinite(Number(outcome?.startingBmi)) && Number(outcome?.startingBmi) > 0
        ? Number(outcome?.startingBmi)
        : null;
  const bmiLabel =
    bmiValue == null
      ? "—"
      : bmiValue >= 40
        ? "Class III obesity"
        : bmiValue >= 35
          ? "Class II obesity"
          : bmiValue >= 30
            ? "Class I obesity"
            : bmiValue >= 25
              ? "Overweight"
              : "Healthy range";
  const savings = Number(outcome?.estimatedSavingsYearly) || effectiveLoss * 500;
  const milestoneRows = [
    { month: "1 MO", factor: 0.28 },
    { month: "3 MOS", factor: 0.66 },
    { month: "6 MOS", factor: 0.9 },
    { month: "9 MOS", factor: 0.97 },
    { month: "12 MO", factor: 1 },
  ].map((entry) => {
    const loss = Math.max(1, Math.round(effectiveLoss * entry.factor));
    const weight = Math.max(1, current - loss);
    return { ...entry, loss, weight };
  });
  const milestoneTimeline = [
    { month: "START", weight: current, loss: 0, factor: 0.08, caption: "DAY 0" },
    ...milestoneRows.map((row, idx) => ({
      ...row,
      caption:
        idx === 0
          ? "INITIAL"
          : idx === 1
            ? "MOMENTUM"
            : idx === 2
              ? "DEEP SHIFT"
              : idx === 3
                ? "REFINING"
                : "HEALTHY TARGET",
    })),
  ];

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.93 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      className="w-full space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="text-center">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[#797587]">
          Your results · Ready
        </p>
        <h2 className="mt-2 font-headline text-[1.75rem] font-extrabold leading-tight text-[#1c1a24] md:text-[2.1rem]">
          In 12 months, you could weigh{" "}
          <span className="text-[#5b3cdd]">{target} lbs</span>
        </h2>
        <p className="mt-3 mx-auto max-w-md font-body text-sm leading-relaxed text-[#484555] md:text-base">
          Your personalized GLP-1 projection, based on real patient data.
        </p>
      </div>

      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="rounded-[1.2rem] border border-[#e7e9f8] bg-white p-4 shadow-[0_10px_20px_rgba(28,26,36,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f57df]">
              Weight Trajectory
            </p>
            <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold text-[#3349dd]">
              Starting: {current} lbs
            </span>
          </div>
          <h3 className="font-headline text-[1.55rem] font-extrabold leading-tight text-[#0f172a] md:text-[1.7rem]">
            Healthy Target: {target}lb
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#e5ebff] border-r-[#0f57df] border-t-[#0f57df] text-[#0f57df]">
              <span className="font-headline text-[1.35rem] font-extrabold">
                80%
              </span>
            </div>
            <div>
              <p className="text-[0.95rem] text-[#3e4458]">
                You are{" "}
                <span className="font-bold text-[#0f57df]">
                  {Math.max(current - target, 0)} lbs
                </span>{" "}
                from your clinical optimum.
              </p>
              <p className="mt-0.5 text-[0.95rem] text-[#3e4458]">
                Projected in 12 months.
              </p>
              <p className="mt-1 text-[0.92rem] font-semibold text-[#007a53]">
                Clinical Grade Progress
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.2rem] border border-[#e7e9f8] bg-white p-4 shadow-[0_10px_20px_rgba(28,26,36,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#007a53]">
            Value Summary
          </p>
          <h3 className="mt-1 font-headline text-[1.55rem] font-extrabold leading-tight text-[#0f172a] md:text-[1.7rem]">
            Total Savings:{" "}
            <span className="text-[#3349dd]">${Math.round(savings).toLocaleString()}</span>
          </h3>
          <div className="mt-3 rounded-[0.8rem] border border-[#bdf1dd] bg-[#ebfff7] px-3 py-2">
            <p className="text-[0.98rem] font-bold text-[#007a53]">
              Eligibility: Qualified
            </p>
            <p className="text-[0.86rem] text-[#246251]">
              Your profile matches the criteria.
            </p>
          </div>
          <button
            type="button"
            onClick={onNext}
            className="mt-3 w-full rounded-[0.8rem] bg-[#4f5df7] py-2.5 text-left font-headline text-[1.35rem] font-bold text-white"
          >
            <span className="flex items-center justify-between px-3">
              Ready for Next Step
              <span aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      </motion.div>

      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-[1.35rem] border border-[#e8ebf7] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(28,26,36,0.05)] md:px-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f57df]">
              Clinical Timeline
            </p>
            <h3 className="mt-1 font-headline text-[2.2rem] font-extrabold text-[#0f172a]">
              Your Milestones
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#6f6a7f]">
            Weight target vs baseline
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {milestoneTimeline.map((milestone, idx) => {
            const barHeight = Math.max(45, Math.round(milestone.factor * 170));
            const isTarget = idx === milestoneTimeline.length - 1;
            return (
              <div key={`${milestone.month}-${idx}`} className="text-center">
                <div className="mb-2 rounded-[0.7rem] border border-[#edf0f8] bg-white px-2 py-1.5 shadow-[0_4px_10px_rgba(28,26,36,0.05)]">
                  <p className="text-[1.05rem] font-extrabold text-[#0f57df]">
                    {milestone.weight}lb
                  </p>
                  {idx > 0 ? (
                    <p className="text-xs font-bold text-[#ef4444]">
                      -{milestone.loss} LB
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-[#6f6a7f]">Baseline</p>
                  )}
                </div>
                <div className="mx-auto flex h-[190px] w-14 items-end rounded-[0.8rem] bg-[#eef1ff]">
                  <div
                    className={`w-full rounded-[0.8rem] ${isTarget ? "bg-[#007a53]" : "bg-gradient-to-t from-[#6a4dff] to-[#3b66ff]"}`}
                    style={{ height: `${barHeight}px` }}
                  />
                </div>
                <p className="mt-2 text-[1.05rem] font-bold text-[#0f172a]">
                  {milestone.month.toLowerCase()}
                </p>
                <p
                  className={`text-xs font-semibold ${isTarget ? "text-[#007a53]" : "text-[#7b7690]"}`}
                >
                  {milestone.caption}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA */}
      <button
        type="button"
        onClick={onNext}
        className="hs-solid-btn flex w-full items-center justify-center gap-2 rounded-full py-4 font-headline text-base font-bold text-white"
      >
        Continue
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Trust row */}
      <div className="flex flex-wrap items-center justify-center gap-4 font-body text-[11px] font-medium text-[#797587]">
        <span className="flex items-center gap-1">
          <svg
            className="h-3.5 w-3.5 text-[#5b3cdd]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          HIPAA Secure
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="h-3.5 w-3.5 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          4.9/5 Rating
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="h-3.5 w-3.5 text-emerald-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          FDA Approved
        </span>
      </div>

      {/* Disclaimer — CONTENT.results.disclaimer */}
      <p className="text-center font-body text-[10px] leading-relaxed text-[#b0acbe]">
        Projections are estimates based on aggregate patient data. Eligibility
        for GLP-1 medications is determined by a licensed physician. Not for
        use during pregnancy. Not medical advice.
      </p>
    </motion.div>
  );
}

function Glp1ResultsPreviewStep({ answers, steps, onNext }) {
  const outcome = resolveProjectedWeightOutcome(answers, steps);

  return (
    <div className="space-y-4">
      <TransformationResultsCard outcome={outcome} onNext={onNext} />
    </div>
  );
}

function Glp1FinalizingPlanStep({ answers, steps, onNext }) {
  const primaryGoal = resolvePrimaryGoalCopy(
    getAnswerByStepType(answers, steps, "QUESTION_SINGLE"),
  );
  const outcome = resolveProjectedWeightOutcome(answers, steps);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onNext(), 1400);
    return () => window.clearTimeout(timeoutId);
  }, [onNext]);

  return (
    <div className="rounded-[2rem] border border-[#d9d4e7] bg-white p-6 shadow-[0_20px_42px_rgba(28,26,36,0.08)] md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef1ff] text-[#5560db]">
          <AppIcon name="medical_services" className="text-[2rem]" />
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#cbc6d8]">
          <span className="h-4 w-4 rounded-full border-2 border-[#cbc6d8] border-t-[#5560db] animate-spin" />
        </span>
      </div>

      <h1 className="mt-5 font-headline text-3xl font-extrabold leading-tight text-[#1c1a24] md:text-[3rem]">
        Finalizing your plan...
      </h1>

      <div className="mt-8 space-y-4 text-[1.05rem] text-[#8b8698]">
        <p className="flex items-center gap-3">
          <AppIcon name="check" className="text-[#9aa0b0]" />
          <span>
          Primary goal:{" "}
          <span className="font-medium text-[#6d6879]">{primaryGoal}</span>
          </span>
        </p>
        {outcome.currentWeight && outcome.targetWeight ? (
          <p className="flex items-center gap-3">
            <AppIcon name="check" className="text-[#9aa0b0]" />
            <span>
              Goal: {outcome.currentWeight} lbs → {outcome.targetWeight} lbs
            </span>
          </p>
        ) : null}
        <p className="flex items-center gap-3 text-[#1c1a24]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9ad3a8] text-[#1c1a24]">
            <AppIcon name="check" className="text-[13px]" />
          </span>
          <span>Your personalized plan is ready</span>
        </p>
      </div>
    </div>
  );
}

function useCountUp(target, duration = 1600) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = null;
    function tick(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

function StatCard({ stat, index }) {
  const isPercent = stat.value.includes("%");
  const rawNumber = parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0;
  const counted = useCountUp(rawNumber, 1400 + index * 200);

  let displayValue;
  if (stat.value === "$0") {
    displayValue = "$0";
  } else if (isPercent) {
    displayValue = `${counted.toFixed(rawNumber % 1 !== 0 ? 1 : 0)}%`;
  } else {
    displayValue = stat.value;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
      className="rounded-[1.5rem] border border-[#e2dced] bg-white px-6 py-5 shadow-[0_12px_28px_rgba(28,26,36,0.05)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f5a6d]">
            {stat.label}
          </p>
          <p className="mt-3 font-headline text-[3rem] font-extrabold leading-none text-[#1c1a24]">
            {displayValue}
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[#5f5a6d]">
            {stat.copy}
          </p>
        </div>
        <AppIcon name={stat.icon} className="text-[1.6rem] text-[#9b97ab]" />
      </div>
    </motion.div>
  );
}

function Glp1ProvenResultsStep({ onNext }) {
  // CONFIG.proofStats from client reference funnel (4 cards)
  const stats = [
    {
      label: "Members see results",
      value: "94.6%",
      copy: "of members lose at least 5% of their body weight.",
      icon: "leaderboard",
    },
    {
      label: "Reach their target",
      value: "96.8%",
      copy: "of members on the 12-month plan reach their target weight.",
      icon: "star",
    },
    {
      label: "Members stay",
      value: "93%",
      copy: "of members stay past 90 days.",
      icon: "group",
    },
    {
      label: "Risk-free",
      value: "$0",
      copy: "If it doesn't work for you, you're covered by the Weight Loss Warranty.",
      icon: "paid",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[#797587] md:text-xs">
            Verified outcomes
          </p>
          <h1 className="mt-1 font-headline text-3xl font-extrabold leading-tight text-[#1c1a24] md:text-[3rem]">
            Proven results. Backed by data.
          </h1>
        </div>
        <img
          src="/images/weight-loss-warranty-badge.png"
          alt="Weight Loss Warranty"
          className="hidden h-20 w-20 rounded-full object-cover md:block"
        />
      </div>

      <div className="space-y-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      <ContinueButton onClick={onNext} label="Next" hideDefaultCaption />
    </div>
  );
}

function Glp1ContactCaptureStep({ step, value, onChange, onNext }) {
  const v = {
    firstName: "",
    lastName: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    ...(typeof value === "object" && value !== null ? value : {}),
  };
  const stateOptions = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DC",
    "DE",
    "FL",
    "GA",
    "HI",
    "IA",
    "ID",
    "IL",
    "IN",
    "KS",
    "KY",
    "LA",
    "MA",
    "MD",
    "ME",
    "MI",
    "MN",
    "MO",
    "MS",
    "MT",
    "NC",
    "ND",
    "NE",
    "NH",
    "NJ",
    "NM",
    "NV",
    "NY",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VA",
    "VT",
    "WA",
    "WI",
    "WV",
    "WY",
  ];
  const isValid =
    v.firstName.trim() &&
    v.lastName.trim() &&
    v.streetAddress.trim() &&
    v.city.trim() &&
    v.state.trim() &&
    v.zipCode.trim();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-[2.1rem] font-extrabold leading-tight text-[#0f172a] md:text-[2.5rem]">
          Final details for your custom plan
        </h1>
        <p className="mt-2 max-w-3xl text-[1.05rem] leading-relaxed text-[#4b5563]">
          This information is used for prescription verification and secure
          shipping of your medication.
        </p>
      </div>

      <div className="rounded-[1.25rem] border border-[#e5eaf6] bg-white p-5 shadow-[0_10px_24px_rgba(28,26,36,0.04)] md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[0.95rem] font-semibold text-[#0f172a]">
              First Name
            </label>
            <input
              type="text"
              value={v.firstName}
              onChange={(event) =>
                onChange({
                  ...v,
                  firstName: event.target.value,
                })
              }
              placeholder="e.g. Alexander"
              className={RECT_INPUT_CLASS}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.95rem] font-semibold text-[#0f172a]">
              Last Name
            </label>
            <input
              type="text"
              value={v.lastName}
              onChange={(event) =>
                onChange({
                  ...v,
                  lastName: event.target.value,
                })
              }
              placeholder="e.g. Stanton"
              className={RECT_INPUT_CLASS}
            />
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <label className="text-[0.95rem] font-semibold text-[#0f172a]">
            Phone Number{" "}
            <span className="font-normal text-[#6b7280]">(optional)</span>
          </label>
          <input
            type="tel"
            value={v.phone}
            onChange={(event) =>
              onChange({
                ...v,
                phone: event.target.value,
              })
            }
            placeholder="(555) 000-0000"
            className={RECT_INPUT_CLASS}
          />
        </div>

        <div className="mt-6 border-t border-[#edf1f8] pt-5">
          <h2 className="font-headline text-[1.9rem] font-extrabold text-[#0f172a]">
            Shipping Address
          </h2>

          <div className="mt-3 space-y-1.5">
            <label className="text-[0.95rem] font-semibold text-[#0f172a]">
              Street Address
            </label>
            <input
              type="text"
              value={v.streetAddress}
              onChange={(event) =>
                onChange({
                  ...v,
                  streetAddress: event.target.value,
                })
              }
              placeholder="123 Wellness Way"
              className={RECT_INPUT_CLASS}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[0.95rem] font-semibold text-[#0f172a]">
                City
              </label>
              <input
                type="text"
                value={v.city}
                onChange={(event) =>
                  onChange({
                    ...v,
                    city: event.target.value,
                  })
                }
                placeholder="Palo Alto"
                className={RECT_INPUT_CLASS}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.95rem] font-semibold text-[#0f172a]">
                State
              </label>
              <div className="relative">
                <select
                  value={v.state}
                  onChange={(event) =>
                    onChange({
                      ...v,
                      state: event.target.value,
                    })
                  }
                  className={RECT_SELECT_TRIGGER_CLASS}
                  aria-label="State"
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {stateOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span
                  className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-[1.05rem] border-l border-[#e8e4f2] bg-gradient-to-b from-[#fdfbff] to-[#f3efff] text-[#5b3cdd]"
                  aria-hidden="true"
                >
                  <AppIcon name="arrow_downward" className="text-[18px]" />
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.95rem] font-semibold text-[#0f172a]">
                Zip Code
              </label>
              <input
                type="text"
                value={v.zipCode}
                onChange={(event) =>
                  onChange({
                    ...v,
                    zipCode: event.target.value,
                  })
                }
                placeholder="94301"
                className={RECT_INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-[0.9rem] leading-relaxed text-[#6b7280]">
            By continuing, you agree to our terms of service and acknowledge our
            privacy policy regarding medical data.
          </p>
          <button
            type="button"
            onClick={onNext}
            disabled={!isValid}
            className="hs-solid-btn inline-flex min-w-[230px] items-center justify-center gap-2 rounded-[0.85rem] px-6 py-3.5 font-headline text-[1.1rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to Plan Selection
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomFormStep({ step, value, onChange, onNext }) {
  const fields = step.config?.fields || [];
  const v = value || {};

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold leading-tight mb-3 text-[#1c1a24]">
          {step.title}
        </h1>
        {step.subtitle && (
          <p className="text-[#484555] text-base leading-relaxed">
            {step.subtitle}
          </p>
        )}
      </div>
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label className="font-body text-[0.6875rem] uppercase tracking-wider text-[#484555] font-semibold">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {field.type === "select" ? (
              <select
                value={v[field.name] || ""}
                onChange={(e) =>
                  onChange({ ...v, [field.name]: e.target.value })
                }
                className="bg-white border border-[#c9c4d8]/20 focus:border-[#5b3cdd] px-4 py-4 rounded-xl font-body text-lg transition-all outline-none"
              >
                <option value="">Select...</option>
                {(field.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                value={v[field.name] || ""}
                onChange={(e) =>
                  onChange({ ...v, [field.name]: e.target.value })
                }
                placeholder={field.placeholder || ""}
                rows={4}
                className="bg-white border border-[#c9c4d8]/20 focus:border-[#5b3cdd] px-4 py-4 rounded-xl font-body text-lg transition-all outline-none resize-none"
              />
            ) : field.type === "checkbox" ? (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!v[field.name]}
                  onChange={(e) =>
                    onChange({ ...v, [field.name]: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-[#c9c4d8] text-[#5b3cdd] focus:ring-[#5b3cdd]"
                />
                <span className="text-[#484555]">
                  {field.placeholder || field.label}
                </span>
              </label>
            ) : (
              <input
                type={field.type || "text"}
                value={v[field.name] || ""}
                onChange={(e) =>
                  onChange({ ...v, [field.name]: e.target.value })
                }
                placeholder={field.placeholder || ""}
                className="bg-white border border-[#c9c4d8]/20 focus:border-[#5b3cdd] px-4 py-4 rounded-xl font-body text-lg transition-all outline-none"
              />
            )}
          </div>
        ))}
      </div>
      <ContinueButton
        onClick={onNext}
        disabled={
          step.required &&
          fields
            .filter((f) => f.required)
            .some(
              (f) =>
                !v[f.name] ||
                (typeof v[f.name] === "string" && !v[f.name].trim()),
            )
        }
      />
    </div>
  );
}

function InfoScreenStep({ step, onNext }) {
  const content = step.config || {};

  return (
    <div className="space-y-10">
      <div className="text-center">
        {content.icon && (
          <div className="w-20 h-20 rounded-full hs-gradient mx-auto flex items-center justify-center mb-6">
            <AppIcon name={content.icon} className="text-white text-4xl" />
          </div>
        )}
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold leading-tight mb-3 text-[#1c1a24]">
          {step.title}
        </h1>
        {step.subtitle && (
          <p className="text-[#484555] text-base leading-relaxed max-w-md mx-auto">
            {step.subtitle}
          </p>
        )}
      </div>

      {content.bullets && (
        <div className="space-y-3">
          {content.bullets.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#c9c4d8]/10"
            >
              <AppIcon name="check_circle" className="text-[#5b3cdd] mt-0.5" />
              <span className="text-[#484555]">{b}</span>
            </div>
          ))}
        </div>
      )}

      {content.imageUrl && (
        <img
          src={content.imageUrl}
          alt=""
          className="w-full rounded-2xl max-h-64 object-cover"
        />
      )}

      <ContinueButton onClick={onNext} disabled={false} />
    </div>
  );
}

function ContinueButton({
  onClick,
  disabled,
  label = "Continue",
  footnote = null,
  hideDefaultCaption = false,
}) {
  return (
    <div className="pt-4">
      <button
        onClick={onClick}
        disabled={disabled}
        className={PRIMARY_PILL_BUTTON_CLASS}
      >
        {label}
      </button>
      {footnote ? <div className="mt-3">{footnote}</div> : null}
      {!hideDefaultCaption ? (
        <p className="text-center mt-3 text-[#484555] font-body text-[0.6875rem] uppercase tracking-wider">
          Safe and secure clinical intake
        </p>
      ) : null}
    </div>
  );
}

/* ═══════════════════════ Main Page ════════════════════════════ */

export default function DynamicOnboardingClient({
  initialTemplate,
  initialIsLoggedIn = false,
}) {
  const router = useRouter();

  const [template] = useState(initialTemplate);
  const [currentStep, setCurrentStep] = useState(1);
  const [furthestStepReached, setFurthestStepReached] = useState(1);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);
  const [accountStepNotice, setAccountStepNotice] = useState("");
  const [completionMessage, setCompletionMessage] = useState(
    "Your information has been submitted. Our team will review everything and follow up shortly.",
  );

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        setIsLoggedIn(res.ok);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const rawSteps = template?.steps?.sort((a, b) => a.order - b.order) || [];
  const steps = buildAugmentedSteps(template, rawSteps);
  const draftStorageKey = getOnboardingDraftStorageKey(template?.id);
  const totalSteps = steps.length;
  const activeStep = steps[currentStep - 1];
  const shouldSkipStep = useCallback(
    (step) => {
      if (step && isLoggedIn && step.type === "ACCOUNT_CREATE") return true;
      if (
        step &&
        step.type === "QUESTION_MULTI" &&
        typeof step.title === "string" &&
        step.title.toLowerCase().includes("approaches")
      )
        return true;
      return false;
    },
    [isLoggedIn],
  );
  const visibleSteps = steps.filter((step) => !shouldSkipStep(step));
  const totalVisibleSteps = visibleSteps.length || totalSteps || 1;
  const displayStep = activeStep
    ? Math.max(
      1,
      visibleSteps.findIndex((step) => step.id === activeStep.id) + 1,
    )
    : 1;
  const accountStepIndex = steps.findIndex(
    (step) => step.type === "ACCOUNT_CREATE",
  );
  const planSelectionStepIndex = steps.findIndex(
    (step) => step.type === "PLAN_SELECTION",
  );
  const medicationSelectionStepIndex = steps.findIndex(
    (step) => step.type === "MEDICATION_SELECT",
  );
  const checkoutStepIndex = steps.findIndex((step) => step.type === "CHECKOUT");

  const getNextCompletedStep = useCallback(() => {
    let nextStep = currentStep + 1;

    while (
      nextStep <= furthestStepReached &&
      shouldSkipStep(steps[nextStep - 1])
    ) {
      nextStep += 1;
    }

    return nextStep <= furthestStepReached ? nextStep : null;
  }, [currentStep, furthestStepReached, shouldSkipStep, steps]);

  useEffect(() => {
    const draft = readOnboardingDraft(draftStorageKey);

    if (draft) {
      const hydratedStep = Math.min(
        Math.max(draft.currentStep, 1),
        totalSteps || 1,
      );
      setAnswers(draft.answers);
      setCurrentStep(hydratedStep);
      setFurthestStepReached(hydratedStep);
    }

    setHasHydratedDraft(true);
  }, [draftStorageKey, totalSteps]);

  useEffect(() => {
    setFurthestStepReached((previous) => Math.max(previous, currentStep));
  }, [currentStep]);

  useEffect(() => {
    if (!hasHydratedDraft || completed) return;

    writeOnboardingDraft(draftStorageKey, {
      version: ONBOARDING_DRAFT_VERSION,
      templateId: template?.id || "",
      templateSlug: template?.slug || "",
      currentStep,
      answers,
      updatedAt: new Date().toISOString(),
    });
  }, [
    answers,
    completed,
    currentStep,
    draftStorageKey,
    hasHydratedDraft,
    template?.id,
    template?.slug,
  ]);

  useEffect(() => {
    if (!activeStep || !hasHydratedDraft || completed) {
      return;
    }

    trackAffiliateClientEvent({
      eventType: "FUNNEL",
      eventName: "funnel_step_view",
      funnelSlug: template?.slug || template?.id || "unknown-funnel",
      funnelStep: displayStep,
      funnelStepLabel: activeStep.title || activeStep.type,
      metadata: {
        stepId: activeStep.id,
        stepType: activeStep.type,
        templateId: template?.id || null,
      },
    });
  }, [
    activeStep,
    completed,
    displayStep,
    hasHydratedDraft,
    template?.id,
    template?.slug,
  ]);

  const setStepAnswer = useCallback(
    (val) => {
      if (!activeStep) return;
      setAnswers((prev) => ({
        ...prev,
        [activeStep.id]: val,
      }));
    },
    [activeStep],
  );

  const handleAuthenticated = useCallback(() => {
    setIsLoggedIn(true);
    setAccountStepNotice("");
  }, []);

  const sendToAccountStep = useCallback(
    (message = "Log in or create your account to keep going.") => {
      if (accountStepIndex < 0) return;
      setAccountStepNotice(message);
      setCurrentStep(accountStepIndex + 1);
    },
    [accountStepIndex],
  );

  const goNext = useCallback(
    (val) => {
      const nextAnswers =
        val !== undefined && activeStep
          ? {
            ...answers,
            [activeStep.id]: val,
          }
          : answers;

      if (activeStep) {
        trackAffiliateClientEvent({
          eventType: "FUNNEL",
          eventName: "funnel_step_complete",
          funnelSlug: template?.slug || template?.id || "unknown-funnel",
          funnelStep: displayStep,
          funnelStepLabel: activeStep.title || activeStep.type,
          metadata: {
            stepId: activeStep.id,
            stepType: activeStep.type,
          },
        });
      }

      if (val !== undefined && activeStep) {
        setAnswers(nextAnswers);
      }
      if (activeStep?.type === "ACCOUNT_CREATE") {
        setAccountStepNotice("");
      }
      if (currentStep >= totalSteps) {
        // Submit the onboarding
        submitOnboarding(nextAnswers);
      } else {
        let nextStep = currentStep + 1;
        while (nextStep <= totalSteps && shouldSkipStep(steps[nextStep - 1])) {
          nextStep += 1;
        }

        if (nextStep > totalSteps) {
          submitOnboarding(nextAnswers);
          return;
        }

        setCurrentStep(nextStep);
      }
    },
    [
      activeStep,
      answers,
      currentStep,
      displayStep,
      shouldSkipStep,
      steps,
      template?.id,
      template?.slug,
      totalSteps,
    ],
  );

  const exitFunnelToHome = useCallback(() => {
    clearOnboardingDraft(draftStorageKey);
    router.push("/");
  }, [draftStorageKey, router]);

  const goBack = () => {
    const hasReachedCheckout =
      checkoutStepIndex >= 0 && furthestStepReached >= checkoutStepIndex + 1;

    if (hasReachedCheckout) {
      const currentType = activeStep?.type;

      if (currentType === "CHECKOUT") {
        if (medicationSelectionStepIndex >= 0) {
          setCurrentStep(medicationSelectionStepIndex + 1);
          return;
        }

        if (planSelectionStepIndex >= 0) {
          setCurrentStep(planSelectionStepIndex + 1);
          return;
        }
      }

      if (currentType === "MEDICATION_SELECT" && planSelectionStepIndex >= 0) {
        setCurrentStep(planSelectionStepIndex + 1);
        return;
      }

      if (currentType === "PLAN_SELECTION") {
        return;
      }
    }

    let previousStep = currentStep - 1;
    while (previousStep >= 1 && shouldSkipStep(steps[previousStep - 1])) {
      previousStep -= 1;
    }
    setCurrentStep(Math.max(previousStep, 1));
  };

  useEffect(() => {
    if (!activeStep || !shouldSkipStep(activeStep)) return;

    let nextStep = currentStep + 1;
    while (nextStep <= totalSteps && shouldSkipStep(steps[nextStep - 1])) {
      nextStep += 1;
    }

    if (nextStep <= totalSteps) {
      setCurrentStep(nextStep);
    }
  }, [activeStep, currentStep, shouldSkipStep, steps, totalSteps]);

  const submitOnboarding = async (submissionAnswers = answers) => {
    let shouldClearDraft = false;

    trackAffiliateClientEvent({
      eventType: "FUNNEL",
      eventName: "funnel_submitted",
      funnelSlug: template?.slug || template?.id || "unknown-funnel",
      funnelStep: totalVisibleSteps,
      funnelStepLabel: "Submission",
      metadata: {
        templateId: template?.id || null,
      },
    });

    try {
      const res = await fetch("/api/onboarding-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          data: submissionAnswers,
        }),
      });
      const payload = await res.json().catch(() => null);

      if (res.ok && payload?.orderId) {
        trackAffiliateClientEvent({
          eventType: "FUNNEL",
          eventName: "order_created_from_funnel",
          funnelSlug: template?.slug || template?.id || "unknown-funnel",
          funnelStep: totalVisibleSteps,
          funnelStepLabel: "Order created",
          orderId: payload.orderId,
          metadata: {
            templateId: template?.id || null,
          },
        });
        clearOnboardingDraft(draftStorageKey);
        router.push(`/order-confirmation?orderId=${payload.orderId}`);
        return;
      }

      if (res.ok && payload?.orderCreated === false && payload?.reason) {
        if (payload.reason === "User account is required to place an order.") {
          sendToAccountStep(
            "Log in or create your account inside the funnel to finish checkout.",
          );
          return;
        }

        setCompletionMessage(
          payload.duplicateProduct
            ? payload.reason
            : `Your information has been submitted. ${payload.reason}`,
        );
      }

      if (!res.ok && payload?.duplicateProduct && payload?.error) {
        shouldClearDraft = true;
        setCompletionMessage(payload.error);
      }

      if (res.ok) {
        shouldClearDraft = true;
      }
    } catch {
      // best-effort submission
    }
    if (shouldClearDraft) {
      clearOnboardingDraft(draftStorageKey);
    }
    setCompleted(true);
  };

  const nextCompletedStep = getNextCompletedStep();
  const canJumpForward = Boolean(
    nextCompletedStep &&
    !(activeStep?.type === "ACCOUNT_CREATE" && accountStepNotice),
  );

  if (completed) {
    return (
      <OnboardingShell
        step={totalVisibleSteps}
        totalSteps={totalVisibleSteps}
        label={template.name}
      >
        <div className="text-center py-16 space-y-6">
          <div className="w-20 h-20 rounded-full hs-gradient mx-auto flex items-center justify-center">
            <AppIcon name="check_circle" className="text-white text-4xl" />
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-[#1c1a24]">
            You&apos;re all set!
          </h1>
          <p className="text-[#484555] font-body text-lg max-w-md mx-auto">
            {completionMessage}
          </p>
          <a
            href="/"
            className="inline-block hs-gradient-btn px-8 py-3 rounded-xl text-sm font-semibold"
          >
            Go to Homepage
          </a>
        </div>
      </OnboardingShell>
    );
  }

  const isPlanSelectionStep = activeStep?.type === "PLAN_SELECTION";

  return (
    <OnboardingShell
      step={displayStep}
      totalSteps={totalVisibleSteps}
      onBack={
        currentStep > 1 ? goBack : exitFunnelToHome
      }
      backAriaLabel={
        currentStep > 1 ? "Go to previous step" : "Return to home"
      }
      onForward={
        canJumpForward ? () => setCurrentStep(nextCompletedStep) : undefined
      }
      label={template.name}
      mainMaxWidthClass={
        isPlanSelectionStep
          ? "max-w-6xl xl:max-w-7xl"
          : "max-w-3xl"
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <StepRenderer
            step={activeStep}
            value={answers[activeStep?.id]}
            onChange={setStepAnswer}
            onNext={goNext}
            onAuthenticated={handleAuthenticated}
            accountStepNotice={accountStepNotice}
            onRequireAccount={sendToAccountStep}
            allData={answers}
            templateId={template?.id}
            steps={steps}
            checkoutPricingMode={template?.styling?.checkoutPricingMode}
          />
        </motion.div>
      </AnimatePresence>
    </OnboardingShell>
  );
}

/* ═══════════════════════ Shell Layout ═════════════════════════ */

function OnboardingShell({
  step,
  totalSteps,
  onBack,
  backAriaLabel = "Go back",
  onForward,
  label,
  mainMaxWidthClass = "max-w-3xl",
  children,
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8ff] font-body text-[#1c1a24] antialiased">
      <header className="sticky top-0 z-50 bg-[#fdf8ff]/90 backdrop-blur-xl">
        <div className="relative flex w-full items-center justify-between px-4 py-4 md:px-6 md:py-5">
          <div className="flex min-w-[56px] items-center justify-start">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex h-11 w-11 items-center justify-center text-[#1c1a24] transition-opacity hover:opacity-80"
                aria-label={backAriaLabel}
              >
                <AppIcon name="arrow_back" className="text-[2rem]" />
              </button>
            )}
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <Image
              src="/logo.png"
              alt="HealSend"
              width={120}
              height={26}
              className="h-6 w-auto"
              priority
            />
          </div>

          <div className="flex min-w-[132px] items-center justify-end">
            <GoogleRatingBadge />
          </div>
        </div>
      </header>

      <main
        className={`flex-grow mx-auto w-full px-5 py-6 md:px-6 md:py-7 ${mainMaxWidthClass}`}
      >
        <ProgressBar current={step} total={totalSteps} label={label} />
        {children}
      </main>

      <footer className="bg-[#fdf8ff] w-full py-10 px-6 border-t border-[#c9c4d8]/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 max-w-3xl mx-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 opacity-60">
              <AppIcon
                name="verified_user"
                className="text-[#5b3cdd] text-base"
              />
              <span className="font-body text-[0.6875rem] uppercase tracking-widest font-bold">
                HIPAA Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════ Step Router ══════════════════════════ */

function StepRenderer({
  step,
  value,
  onChange,
  onNext,
  onAuthenticated,
  accountStepNotice,
  onRequireAccount,
  allData,
  templateId,
  steps,
  checkoutPricingMode,
}) {
  if (!step) return null;

  switch (step.type) {
    case "GLP1_PLAN_INTRO":
      return (
        <Glp1PlanIntroStep
          answers={allData}
          steps={steps}
          onNext={() => onNext()}
        />
      );
    case "QUESTION_SINGLE":
      return (
        <QuestionSingleStep
          step={step}
          value={value}
          onChange={onChange}
          onNext={() => onNext()}
        />
      );
    case "QUESTION_MULTI":
      return (
        <QuestionMultiStep
          step={step}
          value={value}
          onChange={onChange}
          onNext={() => onNext()}
        />
      );
    case "BMI_CALCULATOR":
      return (
        <BMICalculatorStep
          step={step}
          value={value}
          onChange={onChange}
          onNext={() => onNext()}
        />
      );
    case "TEXT_INPUT":
      return (
        <TextInputStep
          step={step}
          value={value}
          onChange={onChange}
          onNext={() => onNext()}
        />
      );
    case "ACCOUNT_CREATE":
      return (
        <AccountCreateStep
          step={step}
          value={value}
          onChange={onChange}
          onNext={() => onNext()}
          onAuthenticated={onAuthenticated}
          notice={accountStepNotice}
        />
      );
    case "GLP1_RESULTS_PREVIEW":
      return (
        <Glp1ResultsPreviewStep
          answers={allData}
          steps={steps}
          onNext={() => onNext()}
        />
      );
    case "GLP1_FINALIZING_PLAN":
      return (
        <Glp1FinalizingPlanStep
          answers={allData}
          steps={steps}
          onNext={() => onNext()}
        />
      );
    case "GLP1_PROVEN_RESULTS":
      return <Glp1ProvenResultsStep onNext={() => onNext()} />;
    case "GLP1_CONTACT_CAPTURE":
      return (
        <Glp1ContactCaptureStep
          step={step}
          value={value}
          onChange={onChange}
          onNext={() => onNext()}
        />
      );
    case "TEXT_ALERTS":
      return <TextAlertsStep step={step} onNext={(v) => onNext(v)} />;
    case "PLAN_SELECTION":
      return (
        <PlanSelectionStep
          step={step}
          value={value}
          onChange={onChange}
          onNext={() => onNext()}
          checkoutPricingMode={checkoutPricingMode}
        />
      );
    case "MEDICATION_SELECT":
      return (
        <MedicationSelectStep
          step={step}
          value={value}
          onChange={onChange}
          onNext={() => onNext()}
        />
      );
    case "CHECKOUT":
      return (
        <CheckoutStep
          step={step}
          data={allData}
          onNext={(v) => onNext(v)}
          onRequireAccount={onRequireAccount}
          templateId={templateId}
          steps={steps}
          checkoutPricingMode={checkoutPricingMode}
        />
      );
    case "CUSTOM_FORM":
      return (
        <CustomFormStep
          step={step}
          value={value}
          onChange={onChange}
          onNext={() => onNext()}
        />
      );
    case "INFO_SCREEN":
      return <InfoScreenStep step={step} onNext={() => onNext()} />;
    default:
      return (
        <div className="text-center py-16">
          <p className="text-[#484555]">Unknown step type: {step.type}</p>
          <button
            onClick={() => onNext()}
            className="mt-4 text-[#5b3cdd] font-semibold hover:underline"
          >
            Skip
          </button>
        </div>
      );
  }
}
