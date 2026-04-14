"use client";

import React, { useEffect, useState } from "react";
import { useNotifications } from "@/lib/NotificationContext";

const GLP1_QID_DEFAULT = "921e0175-e7d7-4b08-ab11-de4183b393ab";

export default function IntegrationSettingsPage() {
  const { notify } = useNotifications();
  const [glp1QuestionnaireId, setGlp1QuestionnaireId] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState(new Set());
  const [olaBaseUrl, setOlaBaseUrl] = useState("");
  const [olaServiceKey, setOlaServiceKey] = useState("");
  const [olaSessionType, setOlaSessionType] = useState("");
  const [funnels, setFunnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings")
        .then((r) => r.json())
        .catch(() => ({})),
      fetch("/api/onboarding-templates")
        .then((r) => r.json())
        .catch(() => []),
    ]).then(([settings, templates]) => {
      setGlp1QuestionnaireId(settings["ghl.glp1QuestionnaireId"] || "");
      const saved = settings["ghl.glp1FunnelSlugs"]
        ? String(settings["ghl.glp1FunnelSlugs"])
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      setSelectedSlugs(new Set(saved));
      setOlaBaseUrl(settings["ola.baseUrl"] || "");
      setOlaServiceKey(settings["ola.serviceKey"] || "");
      setOlaSessionType(settings["ola.sessionType"] || "");
      setFunnels(Array.isArray(templates) ? templates : []);
      setLoading(false);
    });
  }, []);

  const toggleSlug = (slug) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        "ghl.glp1QuestionnaireId": glp1QuestionnaireId,
        "ghl.glp1FunnelSlugs": [...selectedSlugs].join(","),
        "ola.baseUrl": olaBaseUrl,
        "ola.serviceKey": olaServiceKey,
        "ola.sessionType": olaSessionType,
      };
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      notify.success("Settings Saved", "Integration settings updated.");
    } catch {
      notify.error("Error", "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] focus:ring-0 outline-none";

  const Field = ({ label, description, children }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#484555] uppercase tracking-wider">
        {label}
      </label>
      {description && <p className="text-xs text-[#797587]">{description}</p>}
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-2xl">
        <p className="text-sm text-[#797587]">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-extrabold text-[#1c1a24]">
          Integration Settings
        </h1>
        <button
          onClick={save}
          disabled={saving}
          className="hs-gradient-btn px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>

      {/* ── GHL ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-8 space-y-6">
        <div>
          <p className="text-sm font-semibold text-[#1c1a24]">
            GoHighLevel (GHL)
          </p>
          <p className="text-xs text-[#797587] mt-0.5">
            Select which funnels trigger the GLP-1 GHL questionnaire after an
            order is created.
          </p>
        </div>

        <Field
          label="GLP-1 Questionnaire ID"
          description="The GHL questionnaire UUID sent via chat when a GLP-1 order is created."
        >
          <input
            className={inputCls}
            value={glp1QuestionnaireId}
            placeholder={GLP1_QID_DEFAULT}
            onChange={(e) => setGlp1QuestionnaireId(e.target.value)}
          />
        </Field>

        <Field
          label="GLP-1 Funnels"
          description="Tick every funnel that should trigger the GLP-1 questionnaire on order creation."
        >
          {funnels.length === 0 ? (
            <p className="text-xs text-[#797587] py-2">
              No funnels found. Create funnels in the Funnels section first.
            </p>
          ) : (
            <div className="rounded-lg border border-[#c9c4d8]/30 divide-y divide-[#c9c4d8]/20 overflow-hidden">
              {funnels.map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f7f5fb] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSlugs.has(f.slug)}
                    onChange={() => toggleSlug(f.slug)}
                    className="rounded shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1c1a24] truncate">
                      {f.name}
                    </p>
                    <p className="text-xs text-[#797587] font-mono">{f.slug}</p>
                  </div>
                  {!f.active && (
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
                      inactive
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </Field>
      </div>

      {/* ── OLA ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-8 space-y-6">
        <div>
          <p className="text-sm font-semibold text-[#1c1a24]">
            OLA Telehealth Portal
          </p>
          <p className="text-xs text-[#797587] mt-0.5">
            Global defaults for the OLA integration. Per-product service key
            overrides can be set on the product&apos;s edit page.
          </p>
        </div>

        <Field
          label="API Base URL"
          description="OLA API base URL. Use the production URL for live; staging URL for testing."
        >
          <input
            className={inputCls}
            value={olaBaseUrl}
            placeholder="https://api.ola-digital-int.com"
            onChange={(e) => setOlaBaseUrl(e.target.value)}
          />
        </Field>

        <Field
          label="Default Service Key"
          description="Fallback OLA service key used when a product does not have its own override."
        >
          <input
            className={inputCls}
            value={olaServiceKey}
            placeholder="healsend-inc-semaglutide-injection-subscription"
            onChange={(e) => setOlaServiceKey(e.target.value)}
          />
        </Field>

        <Field
          label="Session Type"
          description='Appointment session type sent to OLA (e.g. "Initial", "Follow-up").'
        >
          <input
            className={inputCls}
            value={olaSessionType}
            placeholder="Initial"
            onChange={(e) => setOlaSessionType(e.target.value)}
          />
        </Field>
      </div>

      <p className="text-xs text-[#797587]">
        These settings override the server environment defaults and take effect
        immediately (no redeploy required). Environment variables still serve as
        the fallback when a field is left blank.
      </p>
    </div>
  );
}
