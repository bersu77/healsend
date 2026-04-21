"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";
import { useNotifications } from "@/lib/NotificationContext";
import {
  DEFAULT_UPFRONT_ZERO_DELAY_DAYS,
  normalizeCheckoutPricingMode,
  normalizeDelayedChargeDays,
} from "@/lib/onboarding-pricing";
import {
  normalizeOnboardingStepsForEditor,
  normalizeOnboardingStepsForPersistence,
} from "@/lib/onboarding-template-utils";

const STEP_TYPES = [
  {
    value: "QUESTION_SINGLE",
    label: "Single Choice Question",
    icon: "radio_button_checked",
  },
  {
    value: "QUESTION_MULTI",
    label: "Multi Choice Question",
    icon: "check_box",
  },
  { value: "BMI_CALCULATOR", label: "BMI Calculator", icon: "monitor_weight" },
  { value: "TEXT_INPUT", label: "Text Input", icon: "edit_note" },
  { value: "ACCOUNT_CREATE", label: "Account Creation", icon: "person_add" },
  { value: "PLAN_SELECTION", label: "Plan Selection", icon: "payments" },
  {
    value: "MEDICATION_SELECT",
    label: "Medication Select",
    icon: "medication",
  },
  { value: "CHECKOUT", label: "Checkout / Payment", icon: "credit_card" },
  { value: "TEXT_ALERTS", label: "Text Alerts OPT-in", icon: "sms" },
  { value: "CUSTOM_FORM", label: "Custom Form", icon: "dynamic_form" },
  { value: "INFO_SCREEN", label: "Info Screen", icon: "info" },
];

const CHECKOUT_PRICING_MODES = Object.freeze([
  { value: "UPFRONT_ZERO", label: "Upfront $0" },
  { value: "ALL_AT_ONCE", label: "All at once" },
]);

function normalizeComparableText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function deriveMedicationSelectProductIds(config, products) {
  const explicitIds = Array.isArray(config?.productIds)
    ? config.productIds.map((id) => String(id || "").trim()).filter(Boolean)
    : [];

  const medicationIds = Array.isArray(config?.medications)
    ? config.medications
        .map((medication) => {
          const matchedProduct = products.find((product) => {
            const productId = String(product?.id || "").trim();
            const productSlug = String(product?.slug || "").trim();
            const productName = normalizeComparableText(product?.name);
            const medicationProductId = String(
              medication?.productId || "",
            ).trim();
            const medicationId = String(medication?.id || "").trim();
            const medicationName = normalizeComparableText(medication?.name);

            return (
              (medicationProductId && medicationProductId === productId) ||
              (medicationId &&
                (medicationId === productId || medicationId === productSlug)) ||
              (medicationName && medicationName === productName)
            );
          });

          return matchedProduct?.id || null;
        })
        .filter(Boolean)
    : [];

  return [...new Set([...explicitIds, ...medicationIds])];
}

function mergeTemplateStyling(styling, pricingMode, delayedChargeDays) {
  const baseStyling = styling && typeof styling === "object" ? styling : {};

  return {
    ...baseStyling,
    checkoutPricingMode: pricingMode,
    delayedChargeDays: normalizeDelayedChargeDays(
      delayedChargeDays ?? baseStyling.delayedChargeDays,
    ),
  };
}

function PricingModeDropdown({
  value,
  onChange,
  compact = false,
  loading = false,
  disabled = false,
}) {
  return (
    <div className={`relative ${compact ? "min-w-[118px]" : "max-w-[260px]"}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none rounded-lg border border-gray-200 bg-white pr-9 text-sm font-semibold text-[#1c1a24] outline-none transition-colors focus:border-[#5b3cdd] disabled:cursor-not-allowed disabled:opacity-70 ${
          compact ? "h-8 px-3 text-xs" : "h-11 px-4"
        }`}
      >
        {CHECKOUT_PRICING_MODES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading ? (
        <span
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#cfc9de] border-t-[#5b3cdd] animate-spin ${
            compact ? "h-3.5 w-3.5" : "h-4 w-4"
          }`}
        />
      ) : (
        <AppIcon
          name="arrow_downward"
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#797587] ${
            compact ? "h-3 w-3" : "h-4 w-4"
          }`}
        />
      )}
    </div>
  );
}

export default function OnboardingManagementPage() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pricingModeSavingId, setPricingModeSavingId] = useState(null);
  const { notify } = useNotifications();

  const fetchData = async () => {
    setLoading(true);
    const [tplRes, catRes, prodRes] = await Promise.all([
      fetch("/api/onboarding-templates").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/products?limit=1000").then((r) => r.json()),
    ]);
    setTemplates(Array.isArray(tplRes) ? tplRes : []);
    setCategories(Array.isArray(catRes) ? catRes : []);
    setProducts(prodRes.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this onboarding template?")) return;
    await fetch(`/api/onboarding-templates/${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleActive = async (id, active) => {
    const res = await fetch(`/api/onboarding-templates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      notify.error("Error", data?.error || "Failed to update template.");
      return;
    }
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !active } : t)),
    );
  };

  const handlePricingModeChange = async (template, pricingMode) => {
    const currentMode = normalizeCheckoutPricingMode(template.styling);
    if (currentMode === pricingMode) {
      return;
    }

    const styling = mergeTemplateStyling(template.styling, pricingMode);
    setPricingModeSavingId(template.id);

    try {
      const res = await fetch(`/api/onboarding-templates/${template.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styling }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        notify.error("Error", data?.error || "Failed to save pricing mode.");
        return;
      }

      setTemplates((prev) =>
        prev.map((item) =>
          item.id === template.id ? { ...item, styling } : item,
        ),
      );
    } finally {
      setPricingModeSavingId((currentId) =>
        currentId === template.id ? null : currentId,
      );
    }
  };

  if (editingId) {
    return (
      <OnboardingEditor
        templateId={editingId}
        categories={categories}
        products={products}
        onBack={() => {
          setEditingId(null);
          fetchData();
        }}
      />
    );
  }

  if (showCreate) {
    return (
      <OnboardingCreator
        categories={categories}
        products={products}
        onBack={() => {
          setShowCreate(false);
          fetchData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-[#1c1a24]">
            Funnel Templates
          </h2>
          <p className="text-sm text-[#484555] mt-1">
            Create and manage funnel flows for different categories and products
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#5b3cdd] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a2fc7] transition-colors flex items-center gap-2"
        >
          <AppIcon name="add" className="h-[18px] w-[18px]" />
          Create Template
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#484555]">Loading...</div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-12 text-center">
          <AppIcon
            name="route"
            className="mx-auto mb-4 block h-12 w-12 text-gray-300"
          />
          <h3 className="font-headline text-xl font-bold text-[#1c1a24] mb-2">
            No Funnel Templates Yet
          </h3>
          <p className="text-sm text-[#484555] mb-6">
            Create your first funnel template to get started.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-[#5b3cdd] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a2fc7]"
          >
            Create Your First Template
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-headline font-bold text-[#1c1a24]">
                    {tpl.name}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      tpl.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tpl.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-[#484555]">
                  {tpl.steps?.length || 0} steps
                  {tpl.category ? ` • ${tpl.category.name}` : ""}
                  {tpl._count?.submissions
                    ? ` • ${tpl._count.submissions} submissions`
                    : ""}
                </p>
                {tpl.description && (
                  <p className="text-xs text-[#797587] mt-1">
                    {tpl.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-[#797587]">
                  {normalizeCheckoutPricingMode(tpl.styling) === "UPFRONT_ZERO"
                    ? `Upfront $0 • future charge window ${normalizeDelayedChargeDays(
                        tpl.styling,
                      )} days`
                    : "All at once • collects full payment at checkout"}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <PricingModeDropdown
                  compact
                  value={normalizeCheckoutPricingMode(tpl.styling)}
                  loading={pricingModeSavingId === tpl.id}
                  disabled={pricingModeSavingId === tpl.id}
                  onChange={(value) => handlePricingModeChange(tpl, value)}
                />
                <Link
                  href={`/funnels/${tpl.slug}`}
                  target="_blank"
                  className="border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center gap-1"
                >
                  <AppIcon name="open_in_new" className="h-[14px] w-[14px]" />
                  Preview
                </Link>
                <button
                  onClick={() => handleToggleActive(tpl.id, tpl.active)}
                  className="border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50"
                >
                  {tpl.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => setEditingId(tpl.id)}
                  className="bg-[#e5deff] text-[#5b3cdd] px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#d8ccff]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tpl.id)}
                  className="border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Template Creator ─────────────────────────────────────── */
function OnboardingCreator({ categories, products, onBack }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [styling, setStyling] = useState({
    checkoutPricingMode: "ALL_AT_ONCE",
    delayedChargeDays: DEFAULT_UPFRONT_ZERO_DELAY_DAYS,
  });
  const [steps, setSteps] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addStep = (type) => {
    const typeInfo = STEP_TYPES.find((t) => t.value === type);
    setSteps((prev) => [
      ...prev,
      {
        title: typeInfo?.label || type,
        subtitle: "",
        type,
        order: prev.length + 1,
        config: getDefaultConfig(type),
        required: true,
      },
    ]);
  };

  const removeStep = (index) => {
    setSteps((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const moveStep = (index, direction) => {
    setSteps((prev) => {
      const arr = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const updateStep = (index, patch) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const normalizedSteps = normalizeOnboardingStepsForPersistence(
        steps,
        products,
        { defaultProductId: productId || null },
      );
      const res = await fetch("/api/onboarding-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          categoryId: categoryId || null,
          productId: productId || null,
          styling,
          steps: normalizedSteps,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create template");
        setSaving(false);
        return;
      }
      onBack();
    } catch (saveError) {
      setError(saveError?.message || "Something went wrong");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-[#484555] hover:text-[#5b3cdd]"
        >
          <AppIcon name="arrow_back" className="h-5 w-5" />
        </button>
        <h2 className="font-headline text-2xl font-bold text-[#1c1a24]">
          Create Funnel Template
        </h2>
      </div>

      {/* Template Info */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 space-y-4">
        <h3 className="font-semibold text-sm text-[#1c1a24]">
          Template Details
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm text-[#484555] mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weight Loss Funnel"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#484555] mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            >
              <option value="">None (General)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#484555] mb-1">
              Linked Product
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            >
              <option value="">None</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[#797587]">
              Used as the direct treatment fallback when a funnel doesn&apos;t
              have a medication step.
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-[#484555] mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd] resize-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-[#484555]">
            Checkout pricing mode
          </label>
          <PricingModeDropdown
            value={normalizeCheckoutPricingMode(styling)}
            loading={saving}
            disabled={saving}
            onChange={(value) =>
              setStyling((prev) => mergeTemplateStyling(prev, value))
            }
          />
          <p className="mt-2 text-xs text-[#797587]">
            Use this to flag whether the funnel should represent a $0 upfront
            flow or collect the full amount at checkout.
          </p>
        </div>
        {normalizeCheckoutPricingMode(styling) === "UPFRONT_ZERO" ? (
          <div>
            <label className="mb-2 block text-sm text-[#484555]">
              Future charge delay (days)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={normalizeDelayedChargeDays(styling)}
              onChange={(e) =>
                setStyling((prev) =>
                  mergeTemplateStyling(
                    prev,
                    normalizeCheckoutPricingMode(prev),
                    e.target.value,
                  ),
                )
              }
              className="w-full max-w-[160px] rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
            />
            <p className="mt-2 text-xs text-[#797587]">
              Default is {DEFAULT_UPFRONT_ZERO_DELAY_DAYS} days. This is saved
              with the funnel so your $0 upfront flows keep a consistent charge
              window.
            </p>
          </div>
        ) : null}
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[#1c1a24]">
            Steps ({steps.length})
          </h3>
        </div>

        {steps.length === 0 && (
          <div className="text-center py-8 text-[#484555] text-sm">
            No steps yet. Add steps from the panel below.
          </div>
        )}

        <div className="space-y-3">
          {steps.map((step, i) => (
            <StepEditor
              key={i}
              step={step}
              index={i}
              total={steps.length}
              categories={categories}
              products={products}
              onChange={(patch) => updateStep(i, patch)}
              onRemove={() => removeStep(i)}
              onMoveUp={() => moveStep(i, -1)}
              onMoveDown={() => moveStep(i, 1)}
            />
          ))}
        </div>

        {/* Add Step Buttons */}
        <div>
          <p className="text-xs text-[#484555] mb-2 font-medium">Add a step:</p>
          <div className="flex flex-wrap gap-2">
            {STEP_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => addStep(type.value)}
                className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#f1ecf9] hover:border-[#5b3cdd] transition-colors"
              >
                <AppIcon name={type.icon} className="h-[14px] w-[14px]" />
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2">
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#5b3cdd] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a2fc7] disabled:opacity-50 inline-flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
              Saving...
            </>
          ) : (
            "Create Template"
          )}
        </button>
        <button
          onClick={onBack}
          className="border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Template Editor ──────────────────────────────────────── */
function OnboardingEditor({ templateId, categories, products, onBack }) {
  const [template, setTemplate] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [styling, setStyling] = useState({
    checkoutPricingMode: "ALL_AT_ONCE",
    delayedChargeDays: DEFAULT_UPFRONT_ZERO_DELAY_DAYS,
  });
  const [steps, setSteps] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/onboarding-templates/${templateId}`)
      .then((r) => r.json())
      .then((data) => {
        setTemplate(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setCategoryId(data.categoryId || "");
        setProductId(data.productId || "");
        setStyling(
          mergeTemplateStyling(
            data.styling,
            normalizeCheckoutPricingMode(data.styling),
          ),
        );
        setSteps(
          normalizeOnboardingStepsForEditor(data.steps || [], products, {
            defaultProductId: data.productId || null,
          }).map((s) => ({
            title: s.title,
            subtitle: s.subtitle || "",
            type: s.type,
            order: s.order,
            config: s.config || {},
            required: s.required ?? true,
          })),
        );
      });
  }, [products, templateId]);

  const addStep = (type) => {
    const typeInfo = STEP_TYPES.find((t) => t.value === type);
    setSteps((prev) => [
      ...prev,
      {
        title: typeInfo?.label || type,
        subtitle: "",
        type,
        order: prev.length + 1,
        config: getDefaultConfig(type),
        required: true,
      },
    ]);
  };

  const removeStep = (index) => {
    setSteps((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const moveStep = (index, direction) => {
    setSteps((prev) => {
      const arr = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const updateStep = (index, patch) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const normalizedSteps = normalizeOnboardingStepsForPersistence(
        steps,
        products,
        { defaultProductId: productId || null },
      );
      const res = await fetch(`/api/onboarding-templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          categoryId: categoryId || null,
          productId: productId || null,
          styling,
          steps: normalizedSteps,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update template");
        setSaving(false);
        return;
      }
      onBack();
    } catch (saveError) {
      setError(saveError?.message || "Something went wrong");
      setSaving(false);
    }
  };

  if (!template) {
    return <div className="text-center py-12 text-[#484555]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-[#484555] hover:text-[#5b3cdd]"
        >
          <AppIcon name="arrow_back" className="h-5 w-5" />
        </button>
        <h2 className="font-headline text-2xl font-bold text-[#1c1a24]">
          Edit: {template.name}
        </h2>
      </div>

      {/* Template Info */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 space-y-4">
        <h3 className="font-semibold text-sm text-[#1c1a24]">
          Template Details
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm text-[#484555] mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#484555] mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            >
              <option value="">None (General)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#484555] mb-1">
              Linked Product
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            >
              <option value="">None</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[#797587]">
              Keeps product resolution stable even if the funnel copy changes.
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-[#484555] mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd] resize-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-[#484555]">
            Checkout pricing mode
          </label>
          <PricingModeDropdown
            value={normalizeCheckoutPricingMode(styling)}
            loading={saving}
            disabled={saving}
            onChange={(value) =>
              setStyling((prev) => mergeTemplateStyling(prev, value))
            }
          />
          <p className="mt-2 text-xs text-[#797587]">
            This setting is saved with the funnel so pricing behavior can stay
            consistent between admin edits and live checkout.
          </p>
        </div>
        {normalizeCheckoutPricingMode(styling) === "UPFRONT_ZERO" ? (
          <div>
            <label className="mb-2 block text-sm text-[#484555]">
              Future charge delay (days)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={normalizeDelayedChargeDays(styling)}
              onChange={(e) =>
                setStyling((prev) =>
                  mergeTemplateStyling(
                    prev,
                    normalizeCheckoutPricingMode(prev),
                    e.target.value,
                  ),
                )
              }
              className="w-full max-w-[160px] rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
            />
            <p className="mt-2 text-xs text-[#797587]">
              Default is {DEFAULT_UPFRONT_ZERO_DELAY_DAYS} days. This stays on
              the template when you flip between pricing modes.
            </p>
          </div>
        ) : null}
        <div className="text-xs text-[#797587]">
          Public URL:{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded">
            /funnels/{template.slug}
          </code>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[#1c1a24]">
            Steps ({steps.length})
          </h3>
        </div>

        {steps.length === 0 && (
          <div className="text-center py-8 text-[#484555] text-sm">
            No steps yet. Add steps from the panel below.
          </div>
        )}

        <div className="space-y-3">
          {steps.map((step, i) => (
            <StepEditor
              key={i}
              step={step}
              index={i}
              total={steps.length}
              categories={categories}
              products={products}
              onChange={(patch) => updateStep(i, patch)}
              onRemove={() => removeStep(i)}
              onMoveUp={() => moveStep(i, -1)}
              onMoveDown={() => moveStep(i, 1)}
            />
          ))}
        </div>

        {/* Add Step Buttons */}
        <div>
          <p className="text-xs text-[#484555] mb-2 font-medium">Add a step:</p>
          <div className="flex flex-wrap gap-2">
            {STEP_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => addStep(type.value)}
                className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#f1ecf9] hover:border-[#5b3cdd] transition-colors"
              >
                <AppIcon name={type.icon} className="h-[14px] w-[14px]" />
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2">
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#5b3cdd] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a2fc7] disabled:opacity-50 inline-flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
        <button
          onClick={onBack}
          className="border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Step Editor Component ────────────────────────────────── */
function StepEditor({
  step,
  index,
  total,
  categories,
  products,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) {
  const [expanded, setExpanded] = useState(false);
  const typeInfo = STEP_TYPES.find((t) => t.value === step.type);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Step bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-xs font-bold text-[#5b3cdd] bg-[#e5deff] w-6 h-6 rounded flex items-center justify-center">
          {index + 1}
        </span>
        <AppIcon
          name={typeInfo?.icon || "help"}
          className="h-4 w-4 text-[#484555]"
        />
        <span className="text-sm font-medium text-[#1c1a24] flex-1">
          {step.title}
        </span>
        <span className="text-xs text-[#797587] bg-gray-200 px-2 py-0.5 rounded">
          {typeInfo?.label}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={index === 0}
            className="text-[#484555] hover:text-[#5b3cdd] disabled:opacity-30"
          >
            <AppIcon name="arrow_upward" className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={index === total - 1}
            className="text-[#484555] hover:text-[#5b3cdd] disabled:opacity-30"
          >
            <AppIcon name="arrow_downward" className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-red-400 hover:text-red-600 ml-2"
          >
            <AppIcon name="delete" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Expanded config */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-gray-100">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#484555] mb-1">
                Step Title
              </label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => onChange({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#484555] mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={step.subtitle || ""}
                onChange={(e) => onChange({ subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[#484555]">
              <input
                type="checkbox"
                checked={step.required}
                onChange={(e) => onChange({ required: e.target.checked })}
                className="rounded border-gray-300 text-[#5b3cdd]"
              />
              Required
            </label>
          </div>

          {/* Type-specific config */}
          <StepConfig
            step={step}
            categories={categories}
            products={products}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Type-Specific Config Panels ──────────────────────────── */
function StepConfig({ step, categories, products, onChange }) {
  const config = step.config || {};
  const setConfig = (patch) => onChange({ config: { ...config, ...patch } });

  switch (step.type) {
    case "QUESTION_SINGLE":
    case "QUESTION_MULTI":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Question Text
            </label>
            <input
              type="text"
              value={config.question || ""}
              onChange={(e) => setConfig({ question: e.target.value })}
              placeholder="What is your primary goal?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Options (one per line)
            </label>
            <textarea
              value={(config.options || []).join("\n")}
              onChange={(e) =>
                setConfig({
                  options: e.target.value.split("\n").filter(Boolean),
                })
              }
              rows={4}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd] resize-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Option Style
            </label>
            <select
              value={config.style || "card"}
              onChange={(e) => setConfig({ style: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            >
              <option value="card">Cards</option>
              <option value="radio">Radio buttons</option>
              <option value="list">List</option>
            </select>
          </div>
        </div>
      );

    case "BMI_CALCULATOR":
      return (
        <div className="text-xs text-[#797587]">
          This step automatically collects height (feet/inches) and weight, then
          calculates BMI. No additional configuration needed.
        </div>
      );

    case "TEXT_INPUT":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Field Label
            </label>
            <input
              type="text"
              value={config.label || ""}
              onChange={(e) => setConfig({ label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={config.placeholder || ""}
              onChange={(e) => setConfig({ placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-[#484555]">
            <input
              type="checkbox"
              checked={config.multiline || false}
              onChange={(e) => setConfig({ multiline: e.target.checked })}
              className="rounded border-gray-300 text-[#5b3cdd]"
            />
            Multiline (textarea)
          </label>
        </div>
      );

    case "PLAN_SELECTION": {
      // Parse plans from JSON so we can show per-plan price fields
      let parsedPlans = [];
      try {
        const raw = config.plansJson || "";
        if (raw.trim()) parsedPlans = JSON.parse(raw);
      } catch {}

      const updatePlanField = (idx, field, value) => {
        const updated = [...parsedPlans];
        updated[idx] = { ...updated[idx], [field]: value };
        setConfig({ plansJson: JSON.stringify(updated, null, 2) });
      };

      return (
        <div className="space-y-3">
          {parsedPlans.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#484555]">Plans</p>
              {parsedPlans.map((plan, idx) => (
                <div
                  key={plan.id || idx}
                  className="rounded-lg border border-gray-200 p-3 space-y-2 bg-gray-50"
                >
                  <p className="text-xs font-semibold text-[#1c1a24] truncate">
                    {plan.name || `Plan ${idx + 1}`}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#797587] mb-1">
                        Price / month
                      </label>
                      <input
                        type="text"
                        value={plan.firstMonth || ""}
                        onChange={(e) =>
                          updatePlanField(idx, "firstMonth", e.target.value)
                        }
                        placeholder="$35"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#5b3cdd]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#797587] mb-1">
                        Renewal price / month
                      </label>
                      <input
                        type="text"
                        value={plan.thenPrice || ""}
                        onChange={(e) =>
                          updatePlanField(idx, "thenPrice", e.target.value)
                        }
                        placeholder="$35"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#5b3cdd]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#797587]">
              No plans configured. Save the template after selecting a product
              to auto-populate plans, or paste JSON below.
            </p>
          )}
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Raw plans JSON (advanced)
            </label>
            <textarea
              value={config.plansJson || ""}
              onChange={(e) => setConfig({ plansJson: e.target.value })}
              rows={3}
              placeholder="Leave empty to use product subscription tiers."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#5b3cdd] resize-none font-mono"
            />
          </div>
        </div>
      );
    }

    case "MEDICATION_SELECT":
      const selectedProductIds = deriveMedicationSelectProductIds(
        config,
        products,
      );

      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Filter by Category
            </label>
            <select
              value={config.filterCategoryId || ""}
              onChange={(e) => setConfig({ filterCategoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            >
              <option value="">All Products</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Or select specific products
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
              {products.map((prod) => (
                <label
                  key={prod.id}
                  className="flex items-center gap-2 text-xs p-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(prod.id)}
                    onChange={(e) => {
                      const ids = selectedProductIds;
                      setConfig({
                        productIds: e.target.checked
                          ? [...ids, prod.id]
                          : ids.filter((id) => id !== prod.id),
                      });
                    }}
                    className="rounded border-gray-300 text-[#5b3cdd]"
                  />
                  {prod.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      );

    case "CHECKOUT":
      return (
        <div className="text-xs text-[#797587]">
          This step handles payment collection via Stripe. It uses the selected
          plan/medication from previous steps.
        </div>
      );

    case "ACCOUNT_CREATE":
      return (
        <div className="text-xs text-[#797587]">
          This step collects email and password to create a user account. The
          account is created before proceeding.
        </div>
      );

    case "TEXT_ALERTS":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Custom message
            </label>
            <input
              type="text"
              value={config.message || ""}
              onChange={(e) => setConfig({ message: e.target.value })}
              placeholder="Would you like to receive text alerts?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
        </div>
      );

    case "CUSTOM_FORM":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Fields (JSON array)
            </label>
            <textarea
              value={config.fieldsJson || ""}
              onChange={(e) => setConfig({ fieldsJson: e.target.value })}
              rows={6}
              placeholder={`[{"name":"field_name","type":"text","label":"Field Label","required":true}]`}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd] resize-none font-mono"
            />
          </div>
        </div>
      );

    case "INFO_SCREEN":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Content (Markdown supported)
            </label>
            <textarea
              value={config.content || ""}
              onChange={(e) => setConfig({ content: e.target.value })}
              rows={6}
              placeholder="# Welcome&#10;&#10;This is some information for the user..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd] resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[#484555] mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={config.buttonText || ""}
              onChange={(e) => setConfig({ buttonText: e.target.value })}
              placeholder="Continue"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ─── Helpers ──────────────────────────────────────────────── */
function getDefaultConfig(type) {
  switch (type) {
    case "QUESTION_SINGLE":
    case "QUESTION_MULTI":
      return { question: "", options: [], style: "card" };
    case "BMI_CALCULATOR":
      return {};
    case "TEXT_INPUT":
      return { label: "", placeholder: "", multiline: false };
    case "PLAN_SELECTION":
      return { plansJson: "" };
    case "MEDICATION_SELECT":
      return { filterCategoryId: "", productIds: [] };
    case "CHECKOUT":
      return {};
    case "ACCOUNT_CREATE":
      return {};
    case "TEXT_ALERTS":
      return { message: "" };
    case "CUSTOM_FORM":
      return { fieldsJson: "" };
    case "INFO_SCREEN":
      return { content: "", buttonText: "Continue" };
    default:
      return {};
  }
}
