"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";
import { getPublicCatalogPrimaryImage } from "@/lib/public-catalog";
import {
  formatUsd,
  getDefaultProductSubscriptionPlan,
  getEffectiveProductOriginalPrice,
  getEffectiveProductUnitPrice,
  getProductSubscriptionPlans,
} from "@/lib/pricing";
import { getProductOnboardingPath } from "@/lib/product-routing";
import { buildLoginPath } from "@/lib/auth-routing";
import AppIcon from "@/components/ui/AppIcon";

const STEPS = [
  {
    icon: "edit_note",
    title: "Complete Online Visit",
    desc: "Answer a few health questions from the comfort of home.",
  },
  {
    icon: "medical_services",
    title: "Doctor Review",
    desc: "A licensed provider reviews your visit within 24 hours.",
  },
  {
    icon: "local_shipping",
    title: "Treatment Delivered",
    desc: "Your prescription is shipped in discreet packaging.",
  },
];

const BADGES = [
  { icon: "verified_user", label: "FDA-Approved" },
  { icon: "local_pharmacy", label: "US-Licensed Pharmacy" },
  { icon: "lock", label: "HIPAA Compliant" },
  { icon: "support_agent", label: "24/7 Provider Support" },
];

function resolveProjectedPlanTotal(plan) {
  const firstMonth = Number(plan?.firstMonthPrice || 0);
  const thenPrice = Number(plan?.thenPrice || firstMonth || 0);
  const durationMonths = Number(plan?.durationMonths || 0);

  if (!durationMonths || durationMonths <= 1) {
    return firstMonth || thenPrice || 0;
  }

  return firstMonth + Math.max(durationMonths - 1, 0) * thenPrice;
}

function resolvePerDayAmount(plan) {
  if (Number(plan?.durationMonths || 0) !== 12) {
    return null;
  }

  const total = resolveProjectedPlanTotal(plan);
  if (!total) {
    return null;
  }

  return Math.round((total / 365) * 10) / 10;
}

export default function ProductDetailClient({ product }) {
  const router = useRouter();
  const productImage = getPublicCatalogPrimaryImage(product, null);
  const subscriptionPlans = useMemo(
    () => getProductSubscriptionPlans(product),
    [product],
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null,
  );
  const [selectedPlanKey, setSelectedPlanKey] = useState(
    getDefaultProductSubscriptionPlan(product)?.pricingKey || null,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setSelectedVariant(product.variants?.[0] || null);
    setSelectedPlanKey(
      getDefaultProductSubscriptionPlan(product)?.pricingKey || null,
    );
  }, [product]);

  const selectedPlan =
    subscriptionPlans.find((plan) => plan.pricingKey === selectedPlanKey) ||
    subscriptionPlans[0] ||
    null;
  const pricingMetadata = selectedPlan
    ? {
        pricingKey: selectedPlan.pricingKey,
        planName: selectedPlan.name,
        unitPrice: selectedPlan.firstMonthPrice,
        regularPrice: selectedPlan.thenPrice,
        durationMonths: selectedPlan.durationMonths,
      }
    : null;

  const addToCart = async () => {
    setCartError("");

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        variantId: selectedVariant?.id || null,
        quantity: qty,
        metadata: selectedVariant ? null : pricingMetadata,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      if (response.status === 401) {
        router.push(buildLoginPath(`/shop/${product.slug}`));
        return;
      }
      setCartError(payload?.error || "Unable to add this treatment right now.");
      return;
    }

    setAdded(true);
    setCartError("");
    setTimeout(() => setAdded(false), 2000);
  };

  const price =
    getEffectiveProductUnitPrice(product, {
      variant: selectedVariant,
      metadata: pricingMetadata,
    }) ?? 0;
  const originalPrice = getEffectiveProductOriginalPrice(product, {
    variant: selectedVariant,
    metadata: pricingMetadata,
  });
  const onboardingHref = getProductOnboardingPath(product.slug);

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <div className="bg-gradient-to-br from-[#f1ecf9] via-[#fdf8ff] to-white">
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-0">
          <div className="flex items-center gap-2 text-sm text-[#797587] mb-6">
            <Link href="/" className="hover:text-[#5b3cdd] transition-colors">
              Home
            </Link>
            <AppIcon name="chevron_right" className="text-[14px]" />
            <Link
              href="/shop"
              className="hover:text-[#5b3cdd] transition-colors"
            >
              Shop
            </Link>
            {product.category && (
              <>
                <AppIcon name="chevron_right" className="text-[14px]" />
                <span className="text-[#797587]">{product.category.name}</span>
              </>
            )}
            <AppIcon name="chevron_right" className="text-[14px]" />
            <span className="text-[#1c1a24] font-medium">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-[#c9c4d8]/15 overflow-hidden aspect-square flex items-center justify-center shadow-sm">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[#c9c4d8]">
                    <AppIcon name="medication" className="text-[80px]" />
                    <span className="text-sm font-medium">Product Image</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {BADGES.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-xl px-3 py-2.5 border border-[#c9c4d8]/10"
                  >
                    <AppIcon
                      name={badge.icon}
                      className="text-[18px] text-[#5b3cdd]"
                    />
                    <span className="text-xs font-medium text-[#484555]">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 lg:sticky lg:top-28">
              {product.category && (
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#5b3cdd] tracking-wider bg-[#5b3cdd]/8 px-3 py-1 rounded-full">
                  <AppIcon name="category" className="text-[14px]" />
                  {product.category.name}
                </span>
              )}

              <h1 className="font-headline text-3xl lg:text-4xl font-bold text-[#1c1a24] leading-tight">
                {product.name}
              </h1>

              {product.brand && (
                <p className="text-sm text-[#797587]">
                  by{" "}
                  <span className="font-semibold text-[#484555]">
                    {product.brand.name}
                  </span>
                </p>
              )}

              <div className="bg-white rounded-2xl p-5 border border-[#c9c4d8]/15 shadow-sm">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-bold text-[#5b3cdd]">
                    {formatUsd(price)}
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-[#797587] line-through">
                      {formatUsd(originalPrice)}
                    </span>
                  )}
                  <span className="text-sm text-[#797587]">/month</span>
                </div>
                <p className="text-xs text-[#797587]">
                  Free shipping &middot; Cancel anytime
                </p>
              </div>

              {(product.variants?.length > 0 ||
                subscriptionPlans.length > 0) && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-[#1c1a24]">
                    Choose your treatment plan
                  </p>
                  <div className="grid gap-2.5">
                    {product.variants?.length > 0
                      ? product.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                              selectedVariant?.id === variant.id
                                ? "border-[#5b3cdd] bg-[#5b3cdd]/5 shadow-sm"
                                : "border-[#c9c4d8]/30 hover:border-[#5b3cdd]/50 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedVariant?.id === variant.id
                                    ? "border-[#5b3cdd]"
                                    : "border-[#c9c4d8]"
                                }`}
                              >
                                {selectedVariant?.id === variant.id && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#5b3cdd]" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-[#1c1a24] text-sm">
                                  {variant.name}
                                </p>
                                {variant.description && (
                                  <p className="text-xs text-[#797587]">
                                    {variant.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-[#5b3cdd]">
                              {formatUsd(variant.price)}
                            </span>
                          </button>
                        ))
                      : subscriptionPlans.map((plan) => {
                          const isSelected =
                            selectedPlan?.pricingKey === plan.pricingKey;
                          const perDayAmount = resolvePerDayAmount(plan);
                          const borderClass =
                            plan.durationMonths === 12
                              ? isSelected
                                ? "border-[#5b3cdd]"
                                : "border-[#6d6ffc]"
                              : plan.durationMonths === 3
                                ? isSelected
                                  ? "border-[#7e62ef]"
                                  : "border-[#d7cdfc]"
                                : isSelected
                                  ? "border-[#7f7a90]"
                                  : "border-[#d9d4e7]";
                          const badgeText =
                            plan.durationMonths === 12
                              ? "Best Value"
                              : plan.durationMonths === 3
                                ? "Most Popular"
                                : null;

                          return (
                            <button
                              key={plan.pricingKey}
                              onClick={() =>
                                setSelectedPlanKey(plan.pricingKey)
                              }
                              className={`rounded-[1.75rem] border-2 bg-white p-4 text-left transition-all ${borderClass} ${
                                isSelected ? "bg-[#fdf8ff] shadow-sm" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-[#1c1a24] text-base">
                                      {plan.name}
                                    </p>
                                    {badgeText ? (
                                      <span className="rounded-full bg-[#f1ecf9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5b3cdd]">
                                        {badgeText}
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="mt-1 text-sm font-semibold text-[#1c1a24]">
                                    {formatUsd(plan.firstMonthPrice)} First
                                    Month
                                  </p>
                                  <p className="text-xs text-[#797587]">
                                    then {formatUsd(plan.thenPrice)}/mo
                                  </p>
                                  {perDayAmount ? (
                                    <p className="mt-1 text-sm font-bold text-[#2f6df6]">
                                      Just ${perDayAmount.toFixed(2)} / day
                                    </p>
                                  ) : null}
                                </div>
                                <div
                                  className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                    isSelected
                                      ? "border-[#5b3cdd]"
                                      : "border-[#c9c4d8]"
                                  }`}
                                >
                                  {isSelected ? (
                                    <div className="h-2.5 w-2.5 rounded-full bg-[#5b3cdd]" />
                                  ) : null}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#c9c4d8]/30 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() =>
                      setQty((currentQty) => Math.max(1, currentQty - 1))
                    }
                    className="px-3 py-2.5 hover:bg-[#f1ecf9] transition-colors"
                  >
                    <AppIcon name="remove" className="text-[18px]" />
                  </button>
                  <span className="px-4 py-2.5 font-semibold text-sm min-w-[44px] text-center border-x border-[#c9c4d8]/30">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((currentQty) => currentQty + 1)}
                    className="px-3 py-2.5 hover:bg-[#f1ecf9] transition-colors"
                  >
                    <AppIcon name="add" className="text-[18px]" />
                  </button>
                </div>

                <button
                  onClick={addToCart}
                  className="hs-solid-btn flex-1 rounded-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#5b3cdd]/20 hover:shadow-lg hover:shadow-[#5b3cdd]/30 transition-shadow"
                >
                  {added ? (
                    <>
                      <AppIcon name="check_circle" className="text-[20px]" />
                      Added!
                    </>
                  ) : (
                    <>
                      <AppIcon
                        name="add_shopping_cart"
                        className="text-[20px]"
                      />
                      Get Started — {formatUsd(price * qty)}
                    </>
                  )}
                </button>
              </div>

              {cartError ? (
                <p className="text-sm text-red-600">{cartError}</p>
              ) : null}

              <div className="space-y-2 text-center">
                <p className="text-sm text-[#6e697b]">
                  Flexible care. Adjust, pause, or cancel your plan at any time
                  through your patient portal.
                </p>
                {selectedPlan && selectedPlan.firstMonthPrice > 0 ? (
                  <p className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#484555]">
                    <span>Pay over time with</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f7bfd4] text-[0.8rem] font-black text-[#1c1a24]">
                      K.
                    </span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#c9f2e3] text-[#1c1a24]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                        <path
                          d="M9.4 7.1 4.8 10a2 2 0 0 0 0 3.4l4.6 2.9M14.6 16.9l4.6-2.9a2 2 0 0 0 0-3.4l-4.6-2.9M10.2 15.5 13.8 8.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                ) : null}
              </div>

              {selectedPlan?.durationMonths === 12 && (
                <p className="text-center text-base font-extrabold text-[#2f6df6]">
                  Just ${resolvePerDayAmount(selectedPlan)?.toFixed(2)} / day
                </p>
              )}

              {onboardingHref && (
                <Link
                  href={onboardingHref}
                  className="w-full py-3.5 rounded-xl border-2 border-[#5b3cdd] text-[#5b3cdd] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#5b3cdd]/5 transition-colors"
                >
                  <AppIcon name="clinical_notes" className="text-[20px]" />
                  Start Your Free Online Visit
                </Link>
              )}

              <div className="flex items-center gap-4 text-xs text-[#797587]">
                <span className="flex items-center gap-1">
                  <AppIcon name="check_circle" className="text-[14px]" />
                  No commitment
                </span>
                <span className="flex items-center gap-1">
                  <AppIcon name="check_circle" className="text-[14px]" />
                  Free consultation
                </span>
                <span className="flex items-center gap-1">
                  <AppIcon name="check_circle" className="text-[14px]" />
                  Discreet packaging
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16 flex-1">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 max-w-md">
          {[
            { key: "overview", label: "Overview" },
            { key: "how", label: "How It Works" },
            { key: "safety", label: "Safety Info" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab.key
                  ? "bg-white text-[#5b3cdd] shadow-sm"
                  : "text-[#797587] hover:text-[#484555]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {product.description && (
                <div className="bg-white rounded-2xl border border-[#c9c4d8]/15 p-8">
                  <h3 className="font-headline font-bold text-xl text-[#1c1a24] mb-4">
                    About This Treatment
                  </h3>
                  <div className="text-[15px] text-[#484555] whitespace-pre-line leading-relaxed">
                    {product.description}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-[#c9c4d8]/15 p-8">
                <h3 className="font-headline font-bold text-xl text-[#1c1a24] mb-4">
                  Key Benefits
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: "science",
                      text: "Clinically proven ingredients",
                    },
                    {
                      icon: "schedule",
                      text: "Results in as few as 2-4 weeks",
                    },
                    {
                      icon: "person",
                      text: "Personalized to your health profile",
                    },
                    {
                      icon: "local_pharmacy",
                      text: "Compounded by US pharmacies",
                    },
                  ].map((benefit) => (
                    <div key={benefit.text} className="flex items-start gap-3">
                      <AppIcon
                        name={benefit.icon}
                        className="text-[22px] text-[#5b3cdd] mt-0.5"
                      />
                      <span className="text-sm text-[#484555]">
                        {benefit.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#5b3cdd]/5 rounded-2xl p-6 border border-[#5b3cdd]/10">
                <h4 className="font-bold text-[#1c1a24] mb-3 flex items-center gap-2">
                  <AppIcon name="help" className="text-[20px] text-[#5b3cdd]" />
                  Have Questions?
                </h4>
                <p className="text-sm text-[#484555] mb-4">
                  Our medical team is here to help you find the right treatment.
                </p>
                {onboardingHref ? (
                  <Link
                    href={onboardingHref}
                    className="inline-flex items-center gap-1.5 bg-[#5b3cdd] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#4a2fc7] transition-colors"
                  >
                    <AppIcon name="clinical_notes" className="text-[18px]" />
                    Start Free Visit
                  </Link>
                ) : (
                  <Link
                    href="/account"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5b3cdd] hover:underline"
                  >
                    <AppIcon name="chat" className="text-[18px]" />
                    Contact a Doctor
                  </Link>
                )}
              </div>

              {product.sku && (
                <div className="bg-white rounded-2xl p-6 border border-[#c9c4d8]/15">
                  <p className="text-xs text-[#797587]">SKU: {product.sku}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "how" && (
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-2xl text-[#1c1a24]">
              How It Works
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="bg-white rounded-2xl border border-[#c9c4d8]/15 p-8 text-center relative"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#5b3cdd] text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <AppIcon
                    name={step.icon}
                    className="text-[40px] text-[#5b3cdd] mb-4 inline-block"
                  />
                  <h4 className="font-headline font-bold text-lg text-[#1c1a24] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-[#484555]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "safety" && (
          <div className="max-w-3xl space-y-6">
            <h3 className="font-headline font-bold text-2xl text-[#1c1a24]">
              Safety Information
            </h3>
            <div className="bg-white rounded-2xl border border-[#c9c4d8]/15 p-8 space-y-4">
              <div className="flex items-start gap-3">
                <AppIcon
                  name="warning"
                  className="text-[22px] text-amber-500"
                />
                <div>
                  <h4 className="font-semibold text-[#1c1a24] mb-1">
                    Important Safety Information
                  </h4>
                  <p className="text-sm text-[#484555] leading-relaxed">
                    This treatment requires a prescription. A licensed
                    healthcare provider will review your health information and
                    determine if this medication is right for you. Do not use if
                    you are pregnant, nursing, or have a known allergy to any of
                    the listed ingredients.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AppIcon name="info" className="text-[22px] text-blue-500" />
                <div>
                  <h4 className="font-semibold text-[#1c1a24] mb-1">
                    Side Effects
                  </h4>
                  <p className="text-sm text-[#484555] leading-relaxed">
                    Common side effects may include nausea, headache, or mild
                    discomfort at the injection site. Consult your healthcare
                    provider if you experience any adverse reactions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AppIcon
                  name="verified_user"
                  className="text-[22px] text-emerald-500"
                />
                <div>
                  <h4 className="font-semibold text-[#1c1a24] mb-1">
                    Quality Assurance
                  </h4>
                  <p className="text-sm text-[#484555] leading-relaxed">
                    All medications are sourced from licensed US pharmacies and
                    undergo rigorous quality testing. Our compounding pharmacies
                    are FDA-registered and follow strict cGMP guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MarketingFooter />
    </div>
  );
}
