"use client";

import React, { useCallback, useEffect, useState } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import AppIcon from "@/components/ui/AppIcon";
import { useNotifications } from "@/lib/NotificationContext";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
  });
  const { notify } = useNotifications();

  const load = useCallback(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing("new");
    setForm({ name: "", description: "", logo: "", website: "" });
  };
  const openEdit = (b) => {
    setEditing(b);
    setForm({
      name: b.name,
      description: b.description || "",
      logo: b.logo || "",
      website: b.website || "",
    });
  };

  const save = async () => {
    const isNew = editing === "new";
    const url = isNew ? "/api/brands" : `/api/brands/${editing.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      notify.success(
        isNew ? "Brand Created" : "Brand Updated",
        `"${form.name}" has been ${isNew ? "created" : "updated"} successfully.`,
      );
    } else {
      notify.error("Error", "Failed to save brand.");
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this brand?")) return;
    await fetch(`/api/brands/${id}`, { method: "DELETE" });
    notify.success("Deleted", "Brand has been removed.");
    load();
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] focus:ring-0 outline-none";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#484555]">{brands.length} brands</p>
        <button
          onClick={openNew}
          className="hs-gradient-btn px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <AppIcon name="add" className="h-[18px] w-[18px]" />
          Add
          Brand
        </button>
      </div>

      {editing !== null && (
        <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 space-y-4">
          <h3 className="font-headline text-lg font-bold">
            {editing === "new" ? "New Brand" : "Edit Brand"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Name
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
                Website
              </label>
              <input
                className={inputCls}
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <ImageUpload
              label="Logo"
              value={form.logo}
              onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#484555] uppercase">
              Description
            </label>
            <textarea
              className={`${inputCls} h-20`}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={!form.name}
              className="hs-gradient-btn px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-5 py-2 rounded-lg border text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f1ecf9] text-[#484555]">
              <th className="text-left px-6 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Slug</th>
              <th className="text-left px-4 py-3 font-semibold">Website</th>
              <th className="text-center px-4 py-3 font-semibold">Products</th>
              <th className="text-right px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c9c4d8]/10">
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-[#fdf8ff]">
                <td className="px-6 py-4 font-medium text-[#1c1a24] flex items-center gap-3">
                  {b.logo && (
                    <img
                      src={b.logo}
                      alt=""
                      className="w-8 h-8 rounded-md object-contain bg-[#f1ecf9]"
                    />
                  )}
                  {b.name}
                </td>
                <td className="px-4 py-4 text-[#797587]">{b.slug}</td>
                <td className="px-4 py-4 text-[#797587]">
                  {b.website ? (
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5b3cdd] hover:underline truncate block max-w-[180px]"
                    >
                      {b.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  {b._count?.products ?? 0}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEdit(b)}
                    className="text-[#5b3cdd] hover:opacity-70 mr-2"
                  >
                    <AppIcon name="edit" className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    onClick={() => remove(b.id)}
                    className="text-red-500 hover:opacity-70"
                  >
                    <AppIcon name="delete" className="h-[18px] w-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-[#484555]">
                  No brands yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
