import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { getLocalCartUser, isGuestCartEnabled, isLocalCartUser } from "@/lib/cart";
import { recordAffiliateServerEvent } from "@/lib/affiliate-tracking";
import { isOrderPaymentCaptured } from "@/lib/order-workflow";
import { getPublicCatalogPrimaryImage } from "@/lib/public-catalog";
import {
  getEffectiveProductUnitPrice,
  getPricingMetadataSummary,
} from "@/lib/pricing";
import {
  buildDuplicatePurchaseMessage,
  findExistingActivePurchasesForProducts,
} from "@/lib/purchase-guards";
import { ensureStripeCustomerForUser } from "@/lib/stripe-payment-workflow";
import { NextResponse } from "next/server";

function buildCheckoutFingerprint({ cart, subtotal, addressId, successUrl, cancelUrl }) {
  const payload = {
    cartId: cart.id,
    userId: cart.userId,
    subtotal: Math.round(subtotal * 100),
    addressId: addressId || null,
    successUrl: successUrl || null,
    cancelUrl: cancelUrl || null,
    items: cart.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      metadata: item.metadata || null,
      price:
        getEffectiveProductUnitPrice(item.product, {
          variant: item.variant,
          metadata: item.metadata,
        }) ?? 0,
    })),
  };

  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

// POST /api/checkout — create a Stripe Checkout session
export async function POST(request) {
  const { cartId, successUrl, cancelUrl } = await request.json();

  if (!cartId) {
    return NextResponse.json({ error: "cartId required" }, { status: 400 });
  }

  const currentUser = await getCurrentUser();
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      user: true,
      items: { include: { product: true, variant: true } },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  if (currentUser) {
    if (currentUser.role !== "ADMIN" && currentUser.id !== cart.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (!isGuestCartEnabled()) {
    return NextResponse.json(
      { error: "You must be logged in to checkout." },
      { status: 401 },
    );
  } else {
    const localCartUser = await getLocalCartUser();
    if (cart.userId !== localCartUser.id) {
      return NextResponse.json(
        { error: "You must be logged in to checkout." },
        { status: 401 },
      );
    }
  }

  const lineItems = cart.items.map((item) => {
    const price =
      getEffectiveProductUnitPrice(item.product, {
        variant: item.variant,
        metadata: item.metadata,
      }) ?? 0;
    const pricingSummary = getPricingMetadataSummary(item.metadata);

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.variant
            ? `${item.product.name} — ${item.variant.name}`
            : pricingSummary?.planName
              ? `${item.product.name} — ${pricingSummary.planName}`
              : item.product.name,
          images: [getPublicCatalogPrimaryImage(item.product, "/logo.png")].filter(
            (url) => typeof url === "string" && /^https?:\/\//.test(url),
          ),
        },
        unit_amount: Math.round(price * 100),
      },
      quantity: item.quantity,
    };
  });

  const subtotal = cart.items.reduce((sum, item) => {
    const price =
      getEffectiveProductUnitPrice(item.product, {
        variant: item.variant,
        metadata: item.metadata,
      }) ?? 0;

    return sum + price * item.quantity;
  }, 0);

  const defaultAddress = await prisma.address.findFirst({
    where: { userId: cart.userId },
    orderBy: { isDefault: "desc" },
  });
  const origin = new URL(request.url).origin;
  const resolvedSuccessUrl =
    successUrl || `${origin}/order-confirmation?orderId={ORDER_ID}`;
  const resolvedCancelUrl = cancelUrl || `${origin}/cart`;
  const checkoutFingerprint = buildCheckoutFingerprint({
    cart,
    subtotal,
    addressId: defaultAddress?.id || null,
    successUrl: resolvedSuccessUrl,
    cancelUrl: resolvedCancelUrl,
  });

  const existingOrder = await prisma.order.findFirst({
    where: {
      userId: cart.userId,
      checkoutFingerprint,
      status: { in: ["PENDING", "PAID", "PROCESSING"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existingOrder && isOrderPaymentCaptured(existingOrder)) {
    return NextResponse.json({
      sessionUrl: `${origin}/order-confirmation?orderId=${existingOrder.id}`,
      orderId: existingOrder.id,
      reused: true,
      alreadyPaid: true,
    });
  }

  if (existingOrder?.stripeSessionId) {
    try {
      const existingSession = await stripe.checkout.sessions.retrieve(
        existingOrder.stripeSessionId,
      );
      if (existingSession?.url && existingSession.status === "open") {
        return NextResponse.json({
          sessionUrl: existingSession.url,
          orderId: existingOrder.id,
          reused: true,
        });
      }
    } catch {
      // If Stripe can no longer retrieve the session, we'll issue a fresh one below.
    }
  }

  const duplicatePurchases = await findExistingActivePurchasesForProducts({
    userId: cart.userId,
    productIds: cart.items.map((item) => item.productId),
    excludeOrderId: existingOrder?.id || null,
  });
  const blockedCartItem = cart.items.find(
    (item) => item.productId && duplicatePurchases.has(item.productId),
  );

  if (blockedCartItem?.productId) {
    const existingPurchase = duplicatePurchases.get(blockedCartItem.productId);
    return NextResponse.json(
      {
        error: buildDuplicatePurchaseMessage(
          existingPurchase?.itemName || blockedCartItem.product?.name,
        ),
        duplicateProduct: true,
        existingOrderId: existingPurchase?.orderId || null,
      },
      { status: 409 },
    );
  }

  // Create the order first (PENDING)
  let order = existingOrder;
  if (!order) {
    order = await prisma.order.create({
      data: {
        userId: cart.userId,
        addressId: defaultAddress?.id || null,
        subtotal,
        total: subtotal,
        status: "PENDING",
        checkoutFingerprint,
        fulfillmentBlockedReason: "Awaiting settled payment confirmation.",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.variant
              ? `${item.product.name} — ${item.variant.name}`
              : getPricingMetadataSummary(item.metadata)?.planName
                ? `${item.product.name} — ${getPricingMetadataSummary(item.metadata).planName}`
                : item.product.name,
            price:
              getEffectiveProductUnitPrice(item.product, {
                variant: item.variant,
                metadata: item.metadata,
              }) ?? 0,
            quantity: item.quantity,
            metadata: item.metadata,
          })),
        },
      },
    });
  }

  let stripeCustomerId = cart.user.stripeCustomerId;
  if (currentUser && cart.user.email) {
    stripeCustomerId = await ensureStripeCustomerForUser(cart.user);
  }

  const sessionPayload = {
    mode: "payment",
    line_items: lineItems,
    success_url: resolvedSuccessUrl.replace("{ORDER_ID}", order.id),
    cancel_url: resolvedCancelUrl,
    metadata: { orderId: order.id, userId: cart.userId },
    payment_intent_data: {
      capture_method: "manual",
      setup_future_usage: "off_session",
      metadata: { orderId: order.id, userId: cart.userId },
    },
  };

  if (stripeCustomerId) {
    sessionPayload.customer = stripeCustomerId;
  } else if (!currentUser && isLocalCartUser(cart.user)) {
    // Avoid attaching placeholder guest email addresses to Stripe records.
  } else if (cart.user.email) {
    sessionPayload.customer_email = cart.user.email;
  }

  const session = await stripe.checkout.sessions.create(sessionPayload, {
    idempotencyKey: `checkout:${checkoutFingerprint}`,
  });

  // Save stripe session ID
  await prisma.order.update({
    where: { id: order.id },
    data: {
      stripeSessionId: session.id,
      stripePaymentStatus: "pending",
      stripePaymentMethod: Array.isArray(session.payment_method_types)
        ? session.payment_method_types[0]
        : null,
    },
  });

  await recordAffiliateServerEvent({
    userId: cart.userId,
    orderId: order.id,
    eventType: "PAYMENT",
    eventName: "checkout_session_created",
    stripeSessionId: session.id,
    paymentStatus: session.payment_status || "pending",
    metadata: {
      cartId: cart.id,
      lineItemCount: cart.items.length,
      successUrl: resolvedSuccessUrl,
      cancelUrl: resolvedCancelUrl,
    },
  });

  return NextResponse.json({ sessionUrl: session.url, orderId: order.id });
}
