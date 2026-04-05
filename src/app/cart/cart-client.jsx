"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPublicCatalogPrimaryImage } from "@/lib/public-catalog";
import { formatUsd, getEffectiveProductUnitPrice } from "@/lib/pricing";
import { buildLoginPath } from "@/lib/auth-routing";
import AppIcon from "@/components/ui/AppIcon";

export default function CartClient({ initialCart }) {
  const router = useRouter();
  const [cart, setCart] = useState(initialCart);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        return;
      }

      const nextCart = await response.json();
      setCart(nextCart);
    } catch {
      // no-op
    }
  }, []);

  const updateQty = async (itemId, quantity) => {
    setCheckoutError("");

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId: itemId, quantity }),
    });

    if (!response.ok) {
      return;
    }

    const nextCart = await response.json().catch(() => null);
    if (nextCart) {
      setCart(nextCart);
      return;
    }

    load();
  };

  const removeItem = async (itemId) => {
    setCheckoutError("");

    const response = await fetch(`/api/cart?itemId=${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    const nextCart = await response.json().catch(() => null);
    if (nextCart?.items) {
      setCart(nextCart);
      return;
    }

    load();
  };

  const checkout = async () => {
    if (!cart?.id) {
      return;
    }

    setCheckoutError("");
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: cart.id }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          router.push(buildLoginPath("/cart"));
          return;
        }

        setCheckoutError(data?.error || "Unable to start checkout.");
        return;
      }

      if (data?.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch {
      setCheckoutError("Unable to start checkout.");
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.items || [];
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price =
          getEffectiveProductUnitPrice(item.product, {
            variant: item.variant,
            metadata: item.metadata,
          }) ?? 0;

        return sum + price * item.quantity;
      }, 0),
    [items],
  );

  return (
    <div className="min-h-screen bg-[#fdf8ff]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#c9c4d8]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="HealSend"
              width={130}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <Link
            href="/shop"
            className="text-sm text-[#484555] hover:text-[#5b3cdd]"
          >
            Continue Shopping
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <h1 className="font-headline text-3xl font-bold text-[#1c1a24]">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <AppIcon name="shopping_cart" className="text-6xl text-[#c9c4d8]" />
            <p className="text-[#484555]">Your cart is empty</p>
            <Link
              href="/shop"
              className="inline-block hs-gradient-btn px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.product;
                const price =
                  getEffectiveProductUnitPrice(product, {
                    variant: item.variant,
                    metadata: item.metadata,
                  }) ?? 0;
                const productImage = getPublicCatalogPrimaryImage(product, null);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#c9c4d8]/15 p-4 flex gap-4"
                  >
                    <div className="w-20 h-20 rounded-xl bg-[#f1ecf9] flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <AppIcon
                          name="medication"
                          className="text-2xl text-[#c9c4d8]"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1c1a24] truncate">
                        {product?.name}
                      </h3>
                      {item.variant ? (
                        <p className="text-xs text-[#797587]">{item.variant.name}</p>
                      ) : item.metadata?.planName ? (
                        <p className="text-xs text-[#797587]">{item.metadata.planName}</p>
                      ) : null}
                      <p className="text-sm font-bold text-[#5b3cdd] mt-1">
                        {formatUsd(price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#797587] hover:text-red-500"
                      >
                        <AppIcon name="close" className="text-[18px]" />
                      </button>
                      <div className="flex items-center border border-[#c9c4d8]/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-[#f1ecf9] text-xs"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-[#f1ecf9] text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-[#c9c4d8]/15 p-6 space-y-4 h-fit sticky top-24">
              <h3 className="font-headline font-bold text-lg text-[#1c1a24]">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#484555]">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold">{formatUsd(total)}</span>
                </div>
                <div className="flex justify-between text-[#484555]">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
              </div>
              <div className="border-t border-[#c9c4d8]/20 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#5b3cdd]">{formatUsd(total)}</span>
              </div>
              <button
                onClick={checkout}
                disabled={loading}
                className="w-full py-3.5 rounded-xl hs-gradient-btn text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <AppIcon name="lock" className="text-[18px]" />
                {loading ? "Starting Checkout..." : "Proceed to Checkout"}
              </button>
              {checkoutError ? (
                <p className="text-xs text-center text-red-600">{checkoutError}</p>
              ) : null}
              <p className="text-[10px] text-center text-[#797587]">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
