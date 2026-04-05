import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatUsd } from "@/lib/pricing";
import { isGuestCartEnabled, LOCAL_CART_EMAIL } from "@/lib/cart";
import AppIcon from "@/components/ui/AppIcon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Confirmed | HealSend",
  robots: {
    index: false,
    follow: false,
  },
};

function canViewOrder(order, user) {
  if (!order) {
    return false;
  }

  if (user?.role === "ADMIN" || user?.id === order.userId) {
    return true;
  }

  return !user && isGuestCartEnabled() && order.user?.email === LOCAL_CART_EMAIL;
}

export default async function OrderConfirmationPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const orderId =
    typeof resolvedSearchParams.orderId === "string"
      ? resolvedSearchParams.orderId
      : "";
  const user = await getCurrentUser();

  let order = null;

  if (orderId) {
    const candidateOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true, variant: true } },
        user: { select: { id: true, email: true, name: true } },
        address: true,
      },
    });

    if (canViewOrder(candidateOrder, user)) {
      order = JSON.parse(JSON.stringify(candidateOrder));
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf8ff] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full hs-gradient mx-auto flex items-center justify-center">
          <AppIcon name="check" className="text-white text-4xl" />
        </div>

        <h1 className="font-headline text-3xl font-bold text-[#1c1a24]">
          Order Confirmed!
        </h1>
        <p className="text-[#484555]">
          Thank you for your purchase. Your order has been placed successfully
          and you will receive a confirmation email shortly.
        </p>

        {orderId ? (
          <p className="text-xs text-[#797587] bg-[#f1ecf9] rounded-lg px-4 py-2">
            Order ID: {orderId.slice(0, 12)}...
          </p>
        ) : null}

        {order ? (
          <div className="bg-white rounded-2xl border border-[#c9c4d8]/15 p-6 space-y-4 text-left">
            <h3 className="font-headline font-bold text-[#1c1a24] text-center">
              Order Summary
            </h3>

            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-2 border-b border-[#c9c4d8]/10 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f1ecf9] flex items-center justify-center flex-shrink-0">
                    <AppIcon
                      name="medication"
                      className="text-[#5b3cdd] text-lg"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1c1a24]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#797587]">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#5b3cdd]">
                  {formatUsd(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div className="flex justify-between items-baseline pt-2 border-t border-[#c9c4d8]/20">
              <span className="font-bold text-[#1c1a24]">Total</span>
              <span className="font-bold text-lg text-[#5b3cdd]">
                {formatUsd(order.total)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  order.status === "PAID" || order.status === "PROCESSING"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />
              <span className="text-xs font-semibold text-[#484555] uppercase tracking-wider">
                {order.status}
              </span>
            </div>
          </div>
        ) : null}

        <div className="bg-white rounded-2xl border border-[#c9c4d8]/15 p-6 space-y-3">
          <div className="flex items-center gap-3 text-left">
            <AppIcon name="video_call" className="text-emerald-600" />
            <div>
              <p className="font-semibold text-sm text-[#1c1a24]">
                Doctor Consultation
              </p>
              <p className="text-xs text-[#797587]">
                Chat with a licensed physician about your treatment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <AppIcon name="local_shipping" className="text-[#5b3cdd]" />
            <div>
              <p className="font-semibold text-sm text-[#1c1a24]">
                Shipping Updates
              </p>
              <p className="text-xs text-[#797587]">
                You&apos;ll receive tracking information via email
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <AppIcon name="support_agent" className="text-[#5b3cdd]" />
            <div>
              <p className="font-semibold text-sm text-[#1c1a24]">Need Help?</p>
              <p className="text-xs text-[#797587]">
                Contact our support team anytime
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-4 flex-wrap">
          {order ? (
            <Link
              href={`/consultation/${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hs-gradient-btn px-5 py-3 rounded-xl text-sm font-semibold"
            >
              Start Doctor Chat
            </Link>
          ) : null}
          <Link
            href="/account"
            className="px-5 py-3 rounded-xl border border-[#c9c4d8]/30 text-sm font-semibold hover:bg-[#f1ecf9]"
          >
            My Account
          </Link>
          <Link
            href="/shop"
            className="px-5 py-3 rounded-xl border border-[#c9c4d8]/30 text-sm font-semibold hover:bg-[#f1ecf9]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
