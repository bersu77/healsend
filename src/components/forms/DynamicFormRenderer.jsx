"use client";

import React, { useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

/**
 * Renders a FormTemplate's fields array as a beautiful form
 * matching the HealSend step/onboarding design language.
 */
export default function DynamicFormRenderer({
  template,
  onSubmit,
  className = "",
}) {
  const fields = Array.isArray(template?.fields)
    ? template.fields
    : Array.isArray(template?.schema?.fields)
      ? template.schema.fields
      : [];
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (id, val) => setValues((v) => ({ ...v, [id]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        const response = await fetch(`/api/forms/${template.id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: values }),
        });
        if (!response.ok) {
          throw new Error("Form submission failed");
        }
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={`max-w-md mx-auto text-center space-y-6 py-12 ${className}`}
      >
        <div className="w-16 h-16 rounded-full hs-gradient mx-auto flex items-center justify-center">
          <AppIcon name="check" className="text-white text-3xl" />
        </div>
        <h2 className="font-headline text-2xl font-bold text-[#1c1a24]">
          Thank You!
        </h2>
        <p className="text-[#484555]">
          Your response has been submitted successfully.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-2xl border border-[#c9c4d8]/20 shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-headline text-2xl font-bold text-[#1c1a24]">
            {template.name}
          </h2>
          {template.description && (
            <p className="text-sm text-[#484555]">{template.description}</p>
          )}
        </div>

        {fields.map((f) => {
          const val = values[f.id] ?? "";

          if (f.type === "heading") {
            return (
              <h3
                key={f.id}
                className="font-headline text-lg font-bold text-[#1c1a24] pt-2 border-t border-[#c9c4d8]/15"
              >
                {f.label}
              </h3>
            );
          }

          if (f.type === "radio") {
            return (
              <div key={f.id} className="space-y-3">
                <p className="text-sm font-semibold text-[#484555]">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-0.5">*</span>}
                </p>
                <div className="grid gap-3">
                  {(f.options || []).map((opt, oi) => {
                    const optLabel = typeof opt === "string" ? opt : opt.label;
                    const selected = val === optLabel;
                    return (
                      <label
                        key={oi}
                        className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selected
                            ? "border-[#5b3cdd] bg-[#fdf8ff] shadow-sm"
                            : "border-[#c9c4d8]/30 hover:border-[#5b3cdd]/50"
                        }`}
                      >
                        {(opt.icon || f.icon) && (
                          <AppIcon
                            name={opt.icon || f.icon}
                            className="text-[#5b3cdd] text-[24px]"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-[#1c1a24]">
                            {optLabel}
                          </p>
                          {opt.description && (
                            <p className="text-xs text-[#797587]">
                              {opt.description}
                            </p>
                          )}
                        </div>
                        <input
                          type="radio"
                          name={f.id}
                          value={optLabel}
                          checked={selected}
                          onChange={() => set(f.id, optLabel)}
                          required={f.required}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-[#5b3cdd]" : "border-[#c9c4d8]"}`}
                        >
                          {selected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#5b3cdd]" />
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (f.type === "checkbox") {
            return (
              <label
                key={f.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={!!val}
                  onChange={(e) => set(f.id, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded border-2 border-[#c9c4d8] peer-checked:border-[#5b3cdd] peer-checked:bg-[#5b3cdd] flex items-center justify-center transition-colors">
                  {val && (
                    <AppIcon name="check" className="text-white text-[14px]" />
                  )}
                </div>
                <span className="text-sm text-[#484555] group-hover:text-[#1c1a24]">
                  {f.label}
                </span>
              </label>
            );
          }

          if (f.type === "select") {
            return (
              <div key={f.id}>
                <label className="text-sm font-semibold text-[#484555]">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <select
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] outline-none"
                  value={val}
                  onChange={(e) => set(f.id, e.target.value)}
                  required={f.required}
                >
                  <option value="">{f.placeholder || "Select..."}</option>
                  {(f.options || []).map((opt, oi) => (
                    <option
                      key={oi}
                      value={typeof opt === "string" ? opt : opt.label}
                    >
                      {typeof opt === "string" ? opt : opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (f.type === "textarea") {
            return (
              <div key={f.id}>
                <label className="text-sm font-semibold text-[#484555]">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <textarea
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-[#c9c4d8]/30 text-sm h-24 focus:border-[#5b3cdd] outline-none resize-none"
                  placeholder={f.placeholder}
                  value={val}
                  onChange={(e) => set(f.id, e.target.value)}
                  required={f.required}
                />
              </div>
            );
          }

          // Default: text, email, number, tel, date
          return (
            <div key={f.id}>
              <label className="text-sm font-semibold text-[#484555]">
                {f.label}
                {f.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <input
                type={f.type}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-[#c9c4d8]/30 text-sm focus:border-[#5b3cdd] outline-none"
                placeholder={f.placeholder}
                value={val}
                onChange={(e) => set(f.id, e.target.value)}
                required={f.required}
              />
            </div>
          );
        })}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl hs-gradient-btn text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
}
