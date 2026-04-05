"use client";

import React, { useCallback, useEffect, useState } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import { useNotifications } from "@/lib/NotificationContext";
import AppIcon from "@/components/ui/AppIcon";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    priority: 0,
  });
  const { notify } = useNotifications();

  const load = useCallback(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing("new");
    setForm({ name: "", description: "", image: "", priority: 0 });
  };
  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
      image: cat.image || "",
      priority: cat.priority || 0,
    });
  };

  const save = async () => {
    const isNew = editing === "new";
    const url = isNew ? "/api/categories" : `/api/categories/${editing.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      notify.success(
        isNew ? "Category Created" : "Category Updated",
        `"${form.name}" has been ${isNew ? "created" : "updated"} successfully.`,
      );
    } else {
      notify.error("Error", "Failed to save category.");
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    notify.success("Deleted", "Category has been removed.");
    load();
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] focus:ring-0 outline-none";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#484555]">{categories.length} categories</p>
        <button
          onClick={openNew}
          className="hs-gradient-btn px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <AppIcon name="add" className="h-[18px] w-[18px]" />
          Add
          Category
        </button>
      </div>

      {/* Inline form */}
      {editing !== null && (
        <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 space-y-4">
          <h3 className="font-headline text-lg font-bold">
            {editing === "new" ? "New Category" : "Edit Category"}
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
              <ImageUpload
                label="Category Image"
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
              />
            </div>
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f1ecf9] text-[#484555]">
              <th className="text-left px-6 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Slug</th>
              <th className="text-center px-4 py-3 font-semibold">Products</th>
              <th className="text-right px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c9c4d8]/10">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#fdf8ff]">
                <td className="px-6 py-4 font-medium text-[#1c1a24]">
                  {c.name}
                </td>
                <td className="px-4 py-4 text-[#797587]">{c.slug}</td>
                <td className="px-4 py-4 text-center">
                  {c._count?.products ?? 0}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-[#5b3cdd] hover:opacity-70 mr-2"
                  >
                    <AppIcon name="edit" className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="text-red-500 hover:opacity-70"
                  >
                    <AppIcon name="delete" className="h-[18px] w-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-[#484555]">
                  No categories yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
