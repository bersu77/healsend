"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";
import { getPublicCatalogPrimaryImage } from "@/lib/public-catalog";
import {
  formatUsdCompact,
  getDefaultProductSubscriptionPlan,
  getProductPriceSummary,
} from "@/lib/pricing";
import { buildLoginPath } from "@/lib/auth-routing";
import AppIcon from "@/components/ui/AppIcon";

const DEFAULT_META = { total: 0, page: 1, totalPages: 1 };
const DEFAULT_PARAMS = { page: 1, search: "", categoryId: "" };

export default function ShopPageClient({ initialData }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFetchSkippedRef = useRef(false);
  const [products, setProducts] = useState(initialData?.products || []);
  const [categories, setCategories] = useState(initialData?.categories || []);
  const [meta, setMeta] = useState(initialData?.meta || DEFAULT_META);
  const [params, setParams] = useState(initialData?.params || DEFAULT_PARAMS);
  const [cartMessage, setCartMessage] = useState("");

  const categorySlug = useMemo(() => searchParams.get("category") || "", [
    searchParams,
  ]);

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    if (!categorySlug) {
      if (params.categoryId) {
        setParams((state) => ({ ...state, categoryId: "", page: 1 }));
      }
      return;
    }

    const match = categories.find((c) => c.slug === categorySlug);
    if (match && params.categoryId !== match.id) {
      setParams((state) => ({ ...state, categoryId: match.id, page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, categories]);

  const load = useCallback(() => {
    const limit = 12;
    const sp = new URLSearchParams({ page: String(params.page), limit: "12" });
    if (params.search) sp.set("search", params.search);
    if (params.categoryId) sp.set("categoryId", params.categoryId);

    fetch(`/api/products?${sp}`)
      .then((r) => r.json())
      .then((d) => {
        const nextProducts = Array.isArray(d?.products) ? d.products : [];
        const total = typeof d?.total === "number" ? d.total : nextProducts.length;
        const page = typeof d?.page === "number" ? d.page : params.page;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        setProducts(nextProducts);
        setMeta({ total, page, totalPages });
      })
      .catch(() => {});
  }, [params.categoryId, params.page, params.search]);

  useEffect(() => {
    if (!initialFetchSkippedRef.current) {
      initialFetchSkippedRef.current = true;
      return;
    }

    load();
  }, [load]);

  const addToCart = async (product) => {
    const defaultPlan = getDefaultProductSubscriptionPlan(product);
    setCartMessage("");

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          metadata: defaultPlan
            ? {
                pricingKey: defaultPlan.pricingKey,
                planName: defaultPlan.name,
                unitPrice: defaultPlan.firstMonthPrice,
                regularPrice: defaultPlan.thenPrice,
                durationMonths: defaultPlan.durationMonths,
              }
            : undefined,
        }),
      });

      if (response.status === 401) {
        const redirectTarget = `${pathname || "/shop"}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
        router.push(buildLoginPath(redirectTarget));
        return;
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setCartMessage(payload?.error || "Unable to add this treatment right now.");
      }
    } catch {
      setCartMessage("Unable to add this treatment right now.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <main className="mx-auto flex-1 max-w-7xl w-full px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#797587] mb-6">
          <Link href="/" className="hover:text-[#5b3cdd]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1c1a24] font-medium">Shop</span>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
            <div>
              <h3 className="font-headline font-bold text-sm mb-3">
                Categories
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() =>
                      setParams((s) => ({ ...s, categoryId: "", page: 1 }))
                    }
                    className={`text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                      !params.categoryId
                        ? "bg-[#f1ecf9] text-[#5b3cdd] font-semibold"
                        : "text-[#484555] hover:bg-[#f1ecf9]"
                    }`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() =>
                        setParams((s) => ({ ...s, categoryId: c.id, page: 1 }))
                      }
                      className={`text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                        params.categoryId === c.id
                          ? "bg-[#f1ecf9] text-[#5b3cdd] font-semibold"
                          : "text-[#484555] hover:bg-[#f1ecf9]"
                      }`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 space-y-6">
            {/* Search + mobile category */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <AppIcon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#797587] text-[20px]"
                />
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] outline-none"
                  placeholder="Search products..."
                  value={params.search}
                  onChange={(e) =>
                    setParams((s) => ({
                      ...s,
                      search: e.target.value,
                      page: 1,
                    }))
                  }
                />
              </div>
              <select
                className="lg:hidden px-3 py-2 rounded-xl border border-[#c9c4d8]/30 text-sm bg-white"
                value={params.categoryId}
                onChange={(e) =>
                  setParams((s) => ({
                    ...s,
                    categoryId: e.target.value,
                    page: 1,
                  }))
                }
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Results header */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#484555]">
                {(meta?.total ?? products.length) || 0} products
              </p>
            </div>

            {/* Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-[#c9c4d8]/15 overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  {(() => {
                    const priceSummary = getProductPriceSummary(p);
                    return (
                      <>
                  <Link href={`/shop/${p.slug}`}>
                    <div className="aspect-[4/3] bg-[#f1ecf9] flex items-center justify-center overflow-hidden">
                      {getPublicCatalogPrimaryImage(p, null) ? (
                        <img
                          src={getPublicCatalogPrimaryImage(p)}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <AppIcon
                          name="medication"
                          className="text-5xl text-[#c9c4d8]"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="p-4 space-y-2">
                    {p.category && (
                      <span className="text-[10px] font-semibold uppercase text-[#5b3cdd] tracking-wider">
                        {p.category.name}
                      </span>
                    )}
                    <Link href={`/shop/${p.slug}`}>
                      <h3 className="font-headline font-bold text-[#1c1a24] group-hover:text-[#5b3cdd] transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#797587] line-clamp-2">
                      {p.shortDescription || p.description?.slice(0, 80)}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        {priceSummary ? (
                          <span className="text-lg font-bold text-[#1c1a24]">
                            {formatUsdCompact(priceSummary.firstMonthPrice)}
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-[#797587]">
                            See pricing
                          </span>
                        )}
                        {priceSummary ? (
                          <p className="text-[11px] text-[#797587]">
                            Starting price per month
                          </p>
                        ) : null}
                      </div>
                      <button
                        onClick={() => addToCart(p)}
                        className="w-10 h-10 rounded-xl bg-[#5b3cdd] text-white flex items-center justify-center hover:bg-[#4a2fc7] transition-colors"
                        aria-label="Add to cart"
                      >
                        <AppIcon
                          name="add_shopping_cart"
                          className="text-[20px]"
                        />
                      </button>
                    </div>
                  </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16 text-[#484555]">
                No products found
              </div>
            )}

            {cartMessage ? (
              <p className="text-sm text-red-600">{cartMessage}</p>
            ) : null}

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-2">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setParams((s) => ({ ...s, page: p }))}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold ${
                        p === meta.page
                          ? "hs-gradient text-white"
                          : "border hover:bg-[#f1ecf9]"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
