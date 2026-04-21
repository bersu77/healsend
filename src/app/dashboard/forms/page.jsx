"use client";

import React, { useCallback, useEffect, useState } from "react";
import AppIcon from "@/components/ui/AppIcon";
import { useNotifications } from "@/lib/NotificationContext";

const FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "tel", label: "Phone" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Cards" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
  { value: "heading", label: "Section Heading" },
];

function emptyField() {
  return {
    id: crypto.randomUUID(),
    type: "text",
    label: "",
    placeholder: "",
    required: false,
    options: [],
    icon: "",
    description: "",
  };
}

export default function FormsPage() {
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(null); // null | template obj | "new"
  const [form, setForm] = useState({
    name: "",
    description: "",
    fields: [],
    active: false,
  });
  const [preview, setPreview] = useState(false);
  const { notify } = useNotifications();

  const load = useCallback(() => {
    fetch("/api/forms")
      .then((r) => r.json())
      .then(setTemplates)
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing("new");
    setForm({
      name: "",
      description: "",
      fields: [emptyField()],
      active: false,
    });
    setPreview(false);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name,
      description: t.description || "",
      fields:
        (Array.isArray(t.fields) ? t.fields : []).length > 0
          ? t.fields
          : [emptyField()],
      active: !!t.active,
    });
    setPreview(false);
  };

  const save = async () => {
    const isNew = editing === "new";
    const url = isNew ? "/api/forms" : `/api/forms/${editing.id}`;
    const body = {
      name: form.name,
      description: form.description,
      active: !!form.active,
      fields: form.fields,
    };
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      notify.error("Error", data?.error || "Failed to save form.");
      return;
    }
    notify.success(
      isNew ? "Form Created" : "Form Updated",
      `"${form.name}" has been ${isNew ? "created" : "updated"} successfully.`,
    );
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this form template?")) return;
    await fetch(`/api/forms/${id}`, { method: "DELETE" });
    load();
  };

  const updateField = (idx, key, val) => {
    setForm((f) => {
      const fields = [...f.fields];
      fields[idx] = { ...fields[idx], [key]: val };
      return { ...f, fields };
    });
  };

  const addField = () =>
    setForm((f) => ({ ...f, fields: [...f.fields, emptyField()] }));

  const removeField = (idx) =>
    setForm((f) => ({ ...f, fields: f.fields.filter((_, i) => i !== idx) }));

  const moveField = (idx, dir) => {
    setForm((f) => {
      const fields = [...f.fields];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= fields.length) return f;
      [fields[idx], fields[newIdx]] = [fields[newIdx], fields[idx]];
      return { ...f, fields };
    });
  };

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] outline-none";

  // If editing — show the form builder / preview
  if (editing !== null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setEditing(null)}
            className="text-[#5b3cdd] flex items-center gap-1 text-sm font-semibold"
          >
            <AppIcon name="arrow_back" className="h-[18px] w-[18px]" />
            Back to Forms
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className={`px-4 py-2 rounded-lg text-sm border ${preview ? "bg-[#5b3cdd] text-white" : ""}`}
            >
              <AppIcon
                name={preview ? "edit" : "preview"}
                className="mr-1 inline h-4 w-4 align-middle"
              />
              {preview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={save}
              disabled={!form.name}
              className="hs-gradient-btn px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
            >
              Save Template
            </button>
          </div>
        </div>

        {/* Meta */}
        <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Form Name
              </label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Status
              </label>
              <select
                className={inputCls}
                value={form.active ? "ACTIVE" : "DRAFT"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    active: e.target.value === "ACTIVE",
                  }))
                }
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#484555] uppercase">
              Description
            </label>
            <textarea
              className={`${inputCls} h-16`}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
        </div>

        {preview ? (
          /* ===== PREVIEW – matches HealSend step design ===== */
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border border-[#c9c4d8]/20 shadow-lg p-8 space-y-6">
              <h2 className="font-headline text-2xl font-bold text-[#1c1a24] text-center">
                {form.name || "Untitled Form"}
              </h2>
              {form.description && (
                <p className="text-sm text-[#484555] text-center">
                  {form.description}
                </p>
              )}

              {form.fields.map((f, i) => (
                <div key={f.id}>
                  {f.type === "heading" ? (
                    <h3 className="font-headline text-lg font-bold text-[#1c1a24] pt-2">
                      {f.label}
                    </h3>
                  ) : f.type === "radio" ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[#484555]">
                        {f.label}
                        {f.required && (
                          <span className="text-red-500 ml-0.5">*</span>
                        )}
                      </p>
                      <div className="grid gap-3">
                        {(f.options || []).map((opt, oi) => (
                          <label
                            key={oi}
                            className="flex items-center gap-4 border border-[#c9c4d8]/30 rounded-xl p-4 cursor-pointer hover:border-[#5b3cdd] transition-colors"
                          >
                            {f.icon && (
                              <AppIcon
                                name={opt.icon || f.icon}
                                className="h-5 w-5 text-[#5b3cdd]"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-[#1c1a24]">
                                {opt.label || opt}
                              </p>
                              {opt.description && (
                                <p className="text-xs text-[#797587]">
                                  {opt.description}
                                </p>
                              )}
                            </div>
                            <div className="w-5 h-5 rounded-full border-2 border-[#c9c4d8]" />
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : f.type === "checkbox" ? (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="w-5 h-5 rounded border-2 border-[#c9c4d8]" />
                      <span className="text-sm text-[#484555]">{f.label}</span>
                    </label>
                  ) : f.type === "textarea" ? (
                    <div>
                      <label className="text-sm font-semibold text-[#484555]">
                        {f.label}
                        {f.required && (
                          <span className="text-red-500 ml-0.5">*</span>
                        )}
                      </label>
                      <textarea
                        className="w-full mt-1 px-4 py-3 rounded-xl border border-[#c9c4d8]/30 text-sm h-24"
                        placeholder={f.placeholder}
                        readOnly
                      />
                    </div>
                  ) : f.type === "select" ? (
                    <div>
                      <label className="text-sm font-semibold text-[#484555]">
                        {f.label}
                        {f.required && (
                          <span className="text-red-500 ml-0.5">*</span>
                        )}
                      </label>
                      <select
                        className="w-full mt-1 px-4 py-3 rounded-xl border border-[#c9c4d8]/30 text-sm"
                        disabled
                      >
                        <option>{f.placeholder || "Select..."}</option>
                        {(f.options || []).map((opt, oi) => (
                          <option key={oi}>{opt.label || opt}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-semibold text-[#484555]">
                        {f.label}
                        {f.required && (
                          <span className="text-red-500 ml-0.5">*</span>
                        )}
                      </label>
                      <input
                        type={f.type}
                        className="w-full mt-1 px-4 py-3 rounded-xl border border-[#c9c4d8]/30 text-sm"
                        placeholder={f.placeholder}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              ))}

              <button className="hs-gradient-btn w-full py-3.5 rounded-xl text-sm font-semibold">
                Submit
              </button>
            </div>
          </div>
        ) : (
          /* ===== FIELD BUILDER ===== */
          <div className="space-y-4">
            {form.fields.map((f, idx) => (
              <div
                key={f.id}
                className="bg-white rounded-xl border border-[#c9c4d8]/20 p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#797587] w-6 text-center">
                    {idx + 1}
                  </span>
                  <select
                    className="px-3 py-1.5 rounded border border-[#c9c4d8]/30 text-xs"
                    value={f.type}
                    onChange={(e) => updateField(idx, "type", e.target.value)}
                  >
                    {FIELD_TYPES.map((ft) => (
                      <option key={ft.value} value={ft.value}>
                        {ft.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1" />
                  <button
                    onClick={() => moveField(idx, -1)}
                    disabled={idx === 0}
                    className="text-[#797587] disabled:opacity-20"
                  >
                    <AppIcon
                      name="arrow_upward"
                      className="h-[18px] w-[18px]"
                    />
                  </button>
                  <button
                    onClick={() => moveField(idx, 1)}
                    disabled={idx === form.fields.length - 1}
                    className="text-[#797587] disabled:opacity-20"
                  >
                    <AppIcon
                      name="arrow_downward"
                      className="h-[18px] w-[18px]"
                    />
                  </button>
                  <button
                    onClick={() => removeField(idx)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <AppIcon name="delete" className="h-[18px] w-[18px]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-[#797587] uppercase">
                      Label
                    </label>
                    <input
                      className={inputCls}
                      value={f.label}
                      onChange={(e) =>
                        updateField(idx, "label", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#797587] uppercase">
                      Placeholder
                    </label>
                    <input
                      className={inputCls}
                      value={f.placeholder}
                      onChange={(e) =>
                        updateField(idx, "placeholder", e.target.value)
                      }
                    />
                  </div>
                </div>

                {(f.type === "radio" || f.type === "select") && (
                  <div>
                    <label className="text-[10px] font-semibold text-[#797587] uppercase">
                      Options (one per line — format: label|description|icon)
                    </label>
                    <textarea
                      className={`${inputCls} h-20 font-mono text-xs`}
                      value={(f.options || [])
                        .map((o) =>
                          typeof o === "string"
                            ? o
                            : `${o.label}|${o.description || ""}|${o.icon || ""}`,
                        )
                        .join("\n")}
                      onChange={(e) => {
                        const opts = e.target.value
                          .split("\n")
                          .filter(Boolean)
                          .map((line) => {
                            const [label, description, icon] = line.split("|");
                            return {
                              label: label?.trim() || "",
                              description: description?.trim() || "",
                              icon: icon?.trim() || "",
                            };
                          });
                        updateField(idx, "options", opts);
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-[#484555]">
                    <input
                      type="checkbox"
                      checked={f.required}
                      onChange={(e) =>
                        updateField(idx, "required", e.target.checked)
                      }
                    />
                    Required
                  </label>
                  {f.type === "radio" && (
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] text-[#797587]">
                        Icon:
                      </label>
                      <input
                        className="w-28 px-2 py-1 rounded border border-[#c9c4d8]/30 text-xs"
                        value={f.icon}
                        onChange={(e) =>
                          updateField(idx, "icon", e.target.value)
                        }
                        placeholder="Material icon"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addField}
              className="w-full py-3 rounded-xl border-2 border-dashed border-[#c9c4d8]/40 text-sm font-semibold text-[#5b3cdd] hover:bg-[#fdf8ff] flex items-center justify-center gap-2"
            >
              <AppIcon name="add" className="h-[18px] w-[18px]" />
              Add Field
            </button>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#484555]">
          {templates.length} form templates
        </p>
        <button
          onClick={openNew}
          className="hs-gradient-btn px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <AppIcon name="add" className="h-[18px] w-[18px]" />
          New Form
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-[#c9c4d8]/20 p-5 space-y-2 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-headline font-bold text-[#1c1a24]">
                  {t.name}
                </h3>
                <p className="text-xs text-[#797587]">
                  {(Array.isArray(t.fields) ? t.fields.length : 0) || 0} fields
                  &middot; {t._count?.submissions || 0} submissions
                </p>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
              >
                {t.active ? "ACTIVE" : "DRAFT"}
              </span>
            </div>
            {t.description && (
              <p className="text-sm text-[#484555] line-clamp-2">
                {t.description}
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => openEdit(t)}
                className="text-[#5b3cdd] text-xs font-semibold flex items-center gap-1"
              >
                <AppIcon name="edit" className="h-[14px] w-[14px]" />
                Edit
              </button>
              <button
                onClick={() => remove(t.id)}
                className="text-red-500 text-xs font-semibold flex items-center gap-1"
              >
                <AppIcon name="delete" className="h-[14px] w-[14px]" />
                Delete
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-2 text-center py-16 text-[#484555]">
            <AppIcon
              name="description"
              className="mx-auto mb-2 block h-12 w-12 text-[#c9c4d8]"
            />
            <p>No form templates yet. Create your first form.</p>
          </div>
        )}
      </div>
    </div>
  );
}
