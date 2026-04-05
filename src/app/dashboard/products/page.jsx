"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setTotal(d.total || 0);
      })
      .catch(() => {});
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <AppIcon
            name="search"
            className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#797587]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] focus:ring-0 outline-none"
          />
        </div>
        <Link
          href="/dashboard/products/new"
          className="hs-gradient-btn px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <AppIcon name="add" className="h-[18px] w-[18px]" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f1ecf9] text-[#484555]">
              <th className="text-left px-6 py-3 font-semibold">Product</th>
              <th className="text-left px-4 py-3 font-semibold">Category</th>
              <th className="text-left px-4 py-3 font-semibold">Type</th>
              <th className="text-right px-4 py-3 font-semibold">Price</th>
              <th className="text-center px-4 py-3 font-semibold">Stock</th>
              <th className="text-right px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c9c4d8]/10">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-[#fdf8ff] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#e5deff] flex items-center justify-center">
                        <AppIcon name="image" className="h-[18px] w-[18px] text-[#5b3cdd]" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#1c1a24]">{p.name}</p>
                      {p.sku && (
                        <p className="text-xs text-[#797587]">SKU: {p.sku}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-[#484555]">
                  {p.category?.name || "—"}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.type === "VARIABLE"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-medium">
                  {p.salePrice ? (
                    <>
                      <span className="line-through text-[#797587] mr-1">
                        ${p.regularPrice}
                      </span>
                      <span className="text-[#5b3cdd]">${p.salePrice}</span>
                    </>
                  ) : p.regularPrice ? (
                    `$${p.regularPrice}`
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`w-2 h-2 rounded-full inline-block mr-1 ${p.inStock ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                  {p.inStock ? "In Stock" : "Out"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/products/${p.id}`}
                      className="text-[#5b3cdd] hover:opacity-70"
                    >
                      <AppIcon name="edit" className="h-[18px] w-[18px]" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:opacity-70"
                    >
                      <AppIcon name="delete" className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#484555]">
                  No products found. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#484555]">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of{" "}
            {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 20 >= total}
              className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
