"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";

export default function ProductPagesAdminListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await fetch("/api/products?limit=200", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();
        if (isMounted) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      } catch (error) {
        console.error("Failed to load products for detail-page editor:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const haystack = [product?.name, product?.slug, product?.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [products, searchTerm]);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-headline text-2xl font-bold text-[#1c1a24] md:text-3xl">
              Product Detail Pages
            </h1>
            <p className="mt-2 text-sm text-[#484555] md:text-base">
              Edit per-product content for the storefront detail tabs, including
              benefits, safety copy, and before/after slides.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <AppIcon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8a9e]"
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="text"
              placeholder="Search product"
              className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 bg-white pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#5b3cdd]"
            />
          </div>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[#c9c4d8]/20 bg-white">
        {loading ? (
          <div className="p-6 text-sm text-[#6b6778]">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 text-sm text-[#6b6778]">
            No products found for your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#ebe7f4]">
              <thead className="bg-[#f7f5fb]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b6778]">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b6778]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b6778]">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#6b6778]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ecf7]">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 text-sm font-medium text-[#1c1a24]">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6b6778]">
                      {product.category?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6b6778]">
                      {product.slug}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/product-pages/${product.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/30 px-3 py-2 text-sm font-medium text-[#5b3cdd] transition-colors hover:bg-[#f4f1ff]"
                      >
                        <AppIcon name="edit" className="text-[16px]" />
                        Edit Content
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
