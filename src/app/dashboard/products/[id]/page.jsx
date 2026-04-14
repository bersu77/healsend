"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ui/ImageUpload";
import { useNotifications } from "@/lib/NotificationContext";

const DEFAULT_PLANS = [
  {
    months: 1,
    label: "1 Month",
    enabled: false,
    pricePerMonth: "",
    isDefault: true,
  },
  {
    months: 3,
    label: "3 Months",
    enabled: false,
    pricePerMonth: "",
    isDefault: false,
  },
  {
    months: 6,
    label: "6 Months",
    enabled: false,
    pricePerMonth: "",
    isDefault: false,
  },
  {
    months: 12,
    label: "12 Months",
    enabled: false,
    pricePerMonth: "",
    isDefault: false,
  },
];

const EMPTY = {
  name: "",
  sku: "",
  type: "SIMPLE",
  published: true,
  featured: false,
  shortDescription: "",
  description: "",
  regularPrice: "",
  salePrice: "",
  inStock: true,
  stock: "",
  images: [],
  tags: "",
  categoryId: "",
  brandId: "",
  priority: 0,
  telehealthProvider: "MDI",
  olaServiceKey: "",
  mdiQuestionnaireId: "",
  _rawAttributes: {},
  questionnaireTemplateId: "",
  subscriptionPlansEnabled: false,
  subscriptionPlans: DEFAULT_PLANS.map((p) => ({ ...p })),
};

function getStripeSyncState(product) {
  const stripeSync =
    product?.stripeSync ||
    (product?.attributes &&
    typeof product.attributes === "object" &&
    !Array.isArray(product.attributes)
      ? product.attributes.stripeSync
      : null) ||
    null;
  const stripeProductId =
    product?.stripeProductId || stripeSync?.productId || null;

  return {
    status: stripeSync?.status || (stripeProductId ? "synced" : "pending"),
    productId: stripeProductId,
    defaultPriceId: stripeSync?.defaultPriceId || null,
    lastSyncedAt: stripeSync?.lastSyncedAt || null,
    lastAttemptAt: stripeSync?.lastAttemptAt || null,
    lastError: stripeSync?.lastError || null,
  };
}

function hydrateSubscriptionPlans(tiers) {
  return DEFAULT_PLANS.map((def) => {
    if (!Array.isArray(tiers)) return { ...def };
    const match = tiers.find(
      (t) => Number(t.duration_months ?? t.durationMonths) === def.months,
    );
    if (!match) return { ...def };

    const price =
      match.first_price ??
      match.firstMonthPrice ??
      match.then_price ??
      match.price;

    return {
      ...def,
      enabled: true,
      pricePerMonth: price != null ? String(price) : "",
      isDefault: !!(match.is_default_plan || match.isDefault),
    };
  });
}

function buildSubscriptionTiers(form) {
  return form.subscriptionPlans
    .filter((p) => p.enabled && p.pricePerMonth !== "")
    .map((p) => {
      const price = parseFloat(p.pricePerMonth) || 0;
      const base = parseFloat(form.regularPrice) || price;
      const discountPct = base > 0 ? Math.round((1 - price / base) * 100) : 0;
      const badges = discountPct > 0 ? [`Save ${discountPct}%`] : [];

      return {
        name: `${p.label} Plan`,
        duration_months: p.months,
        first_price: price,
        then_price: price,
        is_default_plan: p.isDefault,
        is_recommended: p.months === 12,
        plan_badges: badges,
      };
    });
}

function hydrateFormState(product) {
  const tiers = Array.isArray(product?.subscriptionTiers)
    ? product.subscriptionTiers
    : null;

  return {
    name: product?.name || "",
    sku: product?.sku || "",
    type: product?.type || "SIMPLE",
    published: product?.published ?? true,
    featured: product?.featured ?? false,
    shortDescription: product?.shortDescription || "",
    description: product?.description || "",
    regularPrice: product?.regularPrice?.toString() || "",
    salePrice: product?.salePrice?.toString() || "",
    inStock: product?.inStock ?? true,
    stock: product?.stock?.toString() || "",
    images: product?.images || [],
    tags: Array.isArray(product?.tags) ? product.tags.join(", ") : "",
    categoryId: product?.categoryId || "",
    brandId: product?.brandId || "",
    priority: product?.priority || 0,
    telehealthProvider: product?.telehealthProvider || "MDI",
    olaServiceKey: product?.olaServiceKey || "",
    mdiQuestionnaireId:
      (product?.attributes &&
      typeof product.attributes === "object" &&
      !Array.isArray(product.attributes)
        ? product.attributes.mdiQuestionnaireId || ""
        : "") || "",
    _rawAttributes:
      product?.attributes &&
      typeof product.attributes === "object" &&
      !Array.isArray(product.attributes)
        ? product.attributes
        : {},
    questionnaireTemplateId: product?.questionnaireTemplateId || "",
    subscriptionPlansEnabled: !!(tiers && tiers.length > 0),
    subscriptionPlans: hydrateSubscriptionPlans(tiers),
  };
}

function formatStripeId(value) {
  if (!value) return "Not connected yet";
  return value.length > 30
    ? `${value.slice(0, 14)}...${value.slice(-8)}`
    : value;
}

export default function ProductForm() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [saving, setSaving] = useState(false);
  const [originalQuestionnaireId, setOriginalQuestionnaireId] = useState("");
  const [stripeSync, setStripeSync] = useState({
    status: "pending",
    productId: null,
    defaultPriceId: null,
    lastSyncedAt: null,
    lastAttemptAt: null,
    lastError: null,
  });
  const { notify } = useNotifications();

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
    fetch("/api/brands")
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {});
    fetch("/api/onboarding-templates")
      .then((r) => r.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => {});
    if (!isNew) {
      fetch(`/api/products/${params.id}`)
        .then(async (r) => {
          if (!r.ok) {
            throw new Error("Failed to load product.");
          }
          return r.json();
        })
        .then((p) => {
          setForm(hydrateFormState(p));
          setStripeSync(getStripeSyncState(p));
          setOriginalQuestionnaireId(p.questionnaireTemplateId || "");
        })
        .catch(() => {
          notify.error("Error", "Failed to load this product.");
        });
    }
  }, [isNew, params.id]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      regularPrice: form.regularPrice || null,
      salePrice: form.salePrice || null,
      stock: form.stock ? parseInt(form.stock, 10) : null,
      images: Array.isArray(form.images) ? form.images : [],
      tags: form.tags
        ? form.tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      categoryId: form.categoryId || null,
      brandId: form.brandId || null,
      telehealthProvider: form.telehealthProvider || "MDI",
      olaServiceKey: form.olaServiceKey || null,
      attributes: {
        ...(typeof form._rawAttributes === "object" && form._rawAttributes
          ? form._rawAttributes
          : {}),
        ...(form.mdiQuestionnaireId
          ? { mdiQuestionnaireId: form.mdiQuestionnaireId }
          : {}),
      },
      subscriptionTiers: form.subscriptionPlansEnabled
        ? buildSubscriptionTiers(form)
        : null,
    };

    const url = isNew ? "/api/products" : `/api/products/${params.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setSaving(false);
        notify.error("Error", data?.error || "Failed to save product.");
        return;
      }

      const savedProductId = data?.id || params.id;

      // Sync questionnaire assignment if changed
      const newTemplateId = form.questionnaireTemplateId || null;
      const oldTemplateId = originalQuestionnaireId || null;
      if (!isNew && newTemplateId !== oldTemplateId) {
        await fetch(`/api/products/${savedProductId}/questionnaire`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId: newTemplateId || null }),
        }).catch(() => {});
        setOriginalQuestionnaireId(newTemplateId || "");
      }

      setForm(hydrateFormState(data));
      setStripeSync(getStripeSyncState(data));

      if (isNew && data?.id) {
        router.replace(`/dashboard/products/${data.id}`);
      }

      setSaving(false);

      if (data?.stripeSync?.status === "needs_attention") {
        notify.warning(
          isNew ? "Product Saved" : "Product Updated",
          "Saved locally, but Stripe needs attention. Open the Stripe sync panel below and save again after fixing any issue.",
        );
        return;
      }

      notify.success(
        isNew ? "Product Created" : "Product Updated",
        `"${data?.name || form.name}" saved and synced successfully.`,
      );
      router.push("/dashboard/products");
    } catch {
      setSaving(false);
      notify.error(
        "Error",
        "We couldn't save this product right now. Please try again.",
      );
    }
  };

  const Field = ({ label, children }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#484555] uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] focus:ring-0 outline-none";
  const stripeStatusClasses =
    stripeSync.status === "needs_attention"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : stripeSync.status === "synced"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-[#c9c4d8]/30 bg-[#f8f6ff] text-[#484555]";
  const stripeStatusLabel =
    stripeSync.status === "needs_attention"
      ? "Needs attention"
      : stripeSync.status === "synced"
        ? "Connected"
        : "Ready to connect";

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-extrabold text-[#1c1a24]">
          {isNew ? "Add Product" : "Edit Product"}
        </h1>
        <div className="flex items-center gap-2">
          {!isNew ? (
            <Link
              href={`/dashboard/product-pages/${params.id}`}
              className="px-3 py-2 rounded-lg border border-[#c9c4d8]/30 text-sm font-semibold text-[#484555] hover:bg-[#f7f5fb]"
            >
              Edit Detail Page
            </Link>
          ) : null}
          <button
            onClick={save}
            disabled={saving || !form.name}
            className="hs-gradient-btn px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save & Sync Product"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Product Name">
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </Field>
          <Field label="SKU">
            <input
              className={inputCls}
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Type">
            <select
              className={inputCls}
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="SIMPLE">Simple</option>
              <option value="VARIABLE">Variable</option>
            </select>
          </Field>
          <Field label="Regular Price ($)">
            <input
              className={inputCls}
              type="number"
              step="0.01"
              value={form.regularPrice}
              onChange={(e) => update("regularPrice", e.target.value)}
            />
          </Field>
          <Field label="Sale Price ($)">
            <input
              className={inputCls}
              type="number"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => update("salePrice", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Short Description">
          <textarea
            className={`${inputCls} h-20`}
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
          />
        </Field>

        <Field label="Description">
          <textarea
            className={`${inputCls} h-32`}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Category">
            <select
              className={inputCls}
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Brand">
            <select
              className={inputCls}
              value={form.brandId}
              onChange={(e) => update("brandId", e.target.value)}
            >
              <option value="">No brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Field label="Stock">
            <input
              className={inputCls}
              type="number"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
            />
          </Field>
          <Field label="Priority">
            <input
              className={inputCls}
              type="number"
              value={form.priority}
              onChange={(e) =>
                update("priority", parseInt(e.target.value, 10) || 0)
              }
            />
          </Field>
        </div>

        <div className={`rounded-xl border p-4 ${stripeStatusClasses}`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-[#1c1a24]">
                Stripe Sync
              </p>
              <p className="text-sm leading-6 text-[#5f5b70]">
                Managed automatically when you save. The client never needs to
                open Stripe or paste any IDs here.
              </p>
              <p className="text-xs text-[#484555]">
                Product ID: {formatStripeId(stripeSync.productId)}
              </p>
              {stripeSync.defaultPriceId ? (
                <p className="text-xs text-[#484555]">
                  Default price: {formatStripeId(stripeSync.defaultPriceId)}
                </p>
              ) : null}
              {stripeSync.lastSyncedAt ? (
                <p className="text-xs text-[#484555]">
                  Last synced:{" "}
                  {new Date(stripeSync.lastSyncedAt).toLocaleString()}
                </p>
              ) : null}
              {stripeSync.lastError ? (
                <p className="text-xs text-amber-700">{stripeSync.lastError}</p>
              ) : null}
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-current/10 bg-white/70 px-3 py-1 text-xs font-semibold">
              {stripeStatusLabel}
            </span>
          </div>
        </div>

        <ImageUpload
          label="Product Images"
          value={form.images}
          onChange={(urls) => update("images", urls)}
          multiple
        />

        <Field label="Tags (comma-separated)">
          <input
            className={inputCls}
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
          />
        </Field>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update("published", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-[#1c1a24]">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-[#1c1a24]">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => update("inStock", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-[#1c1a24]">In Stock</span>
          </label>
        </div>

        {/* ── Telehealth Provider ── */}
        <div className="rounded-xl border border-[#c9c4d8]/30 p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#1c1a24]">
              Telehealth Provider
            </p>
            <p className="text-xs text-[#797587] mt-0.5">
              Select which telehealth provider handles consultations for this
              product.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Provider">
              <select
                className={inputCls}
                value={form.telehealthProvider}
                onChange={(e) => update("telehealthProvider", e.target.value)}
              >
                <option value="MDI">MD Integrations (MDI)</option>
                <option value="OLA">OLA Portal</option>
                <option value="NONE">None</option>
              </select>
            </Field>
            {form.telehealthProvider === "OLA" && (
              <Field label="OLA Service Key (optional override)">
                <input
                  className={inputCls}
                  value={form.olaServiceKey}
                  placeholder="healsend-inc-semaglutide-injection-subscription"
                  onChange={(e) => update("olaServiceKey", e.target.value)}
                />
              </Field>
            )}
            {form.telehealthProvider === "MDI" && (
              <Field label="MDI Questionnaire ID (optional override)">
                <input
                  className={inputCls}
                  value={form.mdiQuestionnaireId}
                  placeholder="Leave blank to use keyword auto-selection"
                  onChange={(e) => update("mdiQuestionnaireId", e.target.value)}
                />
              </Field>
            )}
          </div>

          <div className="border-t border-[#c9c4d8]/20 pt-4 space-y-1.5">
            <label className="text-xs font-semibold text-[#484555] uppercase tracking-wider">
              Questionnaire / Funnel
            </label>
            <p className="text-xs text-[#797587]">
              The intake questionnaire that patients complete before checkout
              for this product.
            </p>
            <select
              className={inputCls}
              value={form.questionnaireTemplateId}
              onChange={(e) =>
                update("questionnaireTemplateId", e.target.value)
              }
            >
              <option value="">— No questionnaire linked —</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {t.productId && t.productId !== params.id
                    ? " (assigned to another product)"
                    : ""}
                </option>
              ))}
            </select>
            {form.questionnaireTemplateId && (
              <p className="text-xs text-[#5b3cdd]">
                <a
                  href={`/dashboard/questionnaires/${form.questionnaireTemplateId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:no-underline"
                >
                  Open questionnaire editor ↗
                </a>
              </p>
            )}
          </div>
        </div>

        {/* ── Subscription Plans ── */}
        <div className="rounded-xl border border-[#c9c4d8]/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1c1a24]">
                Subscription Plans
              </p>
              <p className="text-xs text-[#797587] mt-0.5">
                Enable multi-month discount options that clients can choose at
                checkout.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.subscriptionPlansEnabled}
                onChange={(e) => {
                  update("subscriptionPlansEnabled", e.target.checked);
                }}
                className="rounded"
              />
              <span className="text-sm font-semibold text-[#1c1a24]">
                Enable
              </span>
            </label>
          </div>

          {form.subscriptionPlansEnabled && (
            <div className="space-y-3">
              {/* Header row */}
              <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-3 items-center text-[10px] font-bold uppercase tracking-wider text-[#797587] px-1">
                <span>On</span>
                <span>Duration</span>
                <span>Price / month ($)</span>
                <span>Discount</span>
                <span>Default</span>
              </div>

              {form.subscriptionPlans.map((plan, idx) => {
                const base = parseFloat(form.regularPrice) || 0;
                const planPrice = parseFloat(plan.pricePerMonth) || 0;
                const discountPct =
                  base > 0 && planPrice > 0
                    ? Math.round((1 - planPrice / base) * 100)
                    : 0;

                return (
                  <div
                    key={plan.months}
                    className={`grid grid-cols-[auto_1fr_1fr_auto_auto] gap-3 items-center rounded-lg px-3 py-2.5 border transition-colors ${
                      plan.enabled
                        ? "border-[#5b3cdd]/30 bg-[#fdf8ff]"
                        : "border-[#c9c4d8]/20 bg-white opacity-60"
                    }`}
                  >
                    {/* Enable toggle */}
                    <input
                      type="checkbox"
                      checked={plan.enabled}
                      onChange={(e) => {
                        const next = form.subscriptionPlans.map((p, i) =>
                          i === idx ? { ...p, enabled: e.target.checked } : p,
                        );
                        update("subscriptionPlans", next);
                      }}
                      className="rounded cursor-pointer"
                    />

                    {/* Label */}
                    <span className="text-sm font-semibold text-[#1c1a24]">
                      {plan.label}
                    </span>

                    {/* Price input */}
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={plan.pricePerMonth}
                      placeholder={base > 0 ? base.toFixed(2) : "0.00"}
                      disabled={!plan.enabled}
                      onChange={(e) => {
                        const next = form.subscriptionPlans.map((p, i) =>
                          i === idx
                            ? { ...p, pricePerMonth: e.target.value }
                            : p,
                        );
                        update("subscriptionPlans", next);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] focus:ring-0 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                    />

                    {/* Discount badge */}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full w-16 text-center ${
                        discountPct > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {discountPct > 0 ? `−${discountPct}%` : "—"}
                    </span>

                    {/* Default radio */}
                    <input
                      type="radio"
                      name="defaultPlan"
                      checked={plan.isDefault}
                      disabled={!plan.enabled}
                      onChange={() => {
                        const next = form.subscriptionPlans.map((p, i) => ({
                          ...p,
                          isDefault: i === idx,
                        }));
                        update("subscriptionPlans", next);
                      }}
                      className="cursor-pointer disabled:opacity-40"
                      title="Set as default plan"
                    />
                  </div>
                );
              })}

              <p className="text-xs text-[#797587] pt-1">
                The <strong>Default</strong> plan is pre-selected at checkout.
                Price/month discount is computed relative to the regular price
                above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
