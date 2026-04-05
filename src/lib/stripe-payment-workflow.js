import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { buildFulfillmentProjection } from "@/lib/order-workflow";

function normalizeStripeValue(value) {
  return String(value || "").trim().toLowerCase();
}

export function isStripePaymentAuthorizedStatus(value) {
  return normalizeStripeValue(value) === "requires_capture";
}

export function isStripePaymentCapturedStatus(value) {
  return normalizeStripeValue(value) === "succeeded";
}

export async function ensureStripeCustomerForUser(user) {
  if (!user?.id) {
    return null;
  }

  if (user.stripeCustomerId) {
    try {
      const existingCustomer = await stripe.customers.retrieve(user.stripeCustomerId);
      if (existingCustomer && !existingCustomer.deleted) {
        return existingCustomer.id;
      }
    } catch (error) {
      if (error?.code !== "resource_missing") {
        throw error;
      }
    }
  }

  const customer = await stripe.customers.create({
    email: user.email || undefined,
    name: user.name || undefined,
    metadata: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function retrieveStripePaymentIntent(paymentIntentId) {
  if (!paymentIntentId) {
    return null;
  }

  return stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["payment_method"],
  });
}

export async function retrieveStripeCheckoutSession(sessionId) {
  if (!sessionId) {
    return null;
  }

  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent.payment_method"],
  });
}

function extractPaymentMethodSummary(paymentMethod) {
  if (!paymentMethod || typeof paymentMethod !== "object") {
    return null;
  }

  const paymentMethodId =
    typeof paymentMethod.id === "string" ? paymentMethod.id : null;

  if (!paymentMethodId) {
    return null;
  }

  if (paymentMethod.type === "card") {
    return {
      stripePaymentMethodId: paymentMethodId,
      brand: paymentMethod.card?.brand || "card",
      last4: paymentMethod.card?.last4 || null,
      expMonth: paymentMethod.card?.exp_month || null,
      expYear: paymentMethod.card?.exp_year || null,
    };
  }

  return {
    stripePaymentMethodId: paymentMethodId,
    brand: paymentMethod.type || "unknown",
    last4: null,
    expMonth: null,
    expYear: null,
  };
}

export async function syncPaymentMethodForUser(userId, paymentIntent) {
  if (!userId || !paymentIntent) {
    return null;
  }

  const paymentMethod =
    paymentIntent.payment_method &&
    typeof paymentIntent.payment_method === "object"
      ? paymentIntent.payment_method
      : typeof paymentIntent.payment_method === "string"
        ? await stripe.paymentMethods.retrieve(paymentIntent.payment_method)
        : null;

  const summary = extractPaymentMethodSummary(paymentMethod);
  if (!summary?.stripePaymentMethodId) {
    return null;
  }

  const existing = await prisma.paymentMethod.findFirst({
    where: {
      userId,
      stripePaymentMethodId: summary.stripePaymentMethodId,
    },
  });

  if (existing) {
    return prisma.paymentMethod.update({
      where: { id: existing.id },
      data: {
        brand: summary.brand,
        last4: summary.last4,
        expMonth: summary.expMonth,
        expYear: summary.expYear,
      },
    });
  }

  const existingCount = await prisma.paymentMethod.count({
    where: { userId },
  });

  return prisma.paymentMethod.create({
    data: {
      userId,
      stripePaymentMethodId: summary.stripePaymentMethodId,
      brand: summary.brand,
      last4: summary.last4,
      expMonth: summary.expMonth,
      expYear: summary.expYear,
      isDefault: existingCount === 0,
    },
  });
}

export async function captureAuthorizedOrderPayment(orderOrId, options = {}) {
  const order =
    typeof orderOrId === "string"
      ? await prisma.order.findUnique({ where: { id: orderOrId } })
      : orderOrId;

  if (!order?.id || !order.stripePaymentId) {
    return { status: "missing_payment_intent", order: order || null };
  }

  const existingPaymentIntent = await retrieveStripePaymentIntent(
    order.stripePaymentId,
  );

  if (!existingPaymentIntent) {
    return { status: "missing_payment_intent", order };
  }

  if (isStripePaymentCapturedStatus(existingPaymentIntent.status)) {
    return { status: "already_captured", order, paymentIntent: existingPaymentIntent };
  }

  if (!isStripePaymentAuthorizedStatus(existingPaymentIntent.status)) {
    return { status: "not_capturable", order, paymentIntent: existingPaymentIntent };
  }

  const capturedPaymentIntent = await stripe.paymentIntents.capture(
    existingPaymentIntent.id,
    {
      metadata: {
        ...existingPaymentIntent.metadata,
        capture_reason: options.reason || "medical_approval",
      },
    },
  );

  const updatedOrder = await prisma.$transaction(async (tx) => {
    let nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status:
          String(order.status || "").toUpperCase() === "CANCELLED"
            ? order.status
            : "PAID",
        stripePaymentStatus: capturedPaymentIntent.status,
        paymentCapturedAt: new Date(),
        fulfillmentBlockedReason: null,
      },
    });

    const { update } = buildFulfillmentProjection(
      nextOrder,
      options.caseSnapshot || null,
    );
    if (Object.keys(update).length > 0) {
      nextOrder = await tx.order.update({
        where: { id: order.id },
        data: update,
      });
    }

    return nextOrder;
  });

  await syncPaymentMethodForUser(order.userId, capturedPaymentIntent);

  return {
    status: "captured",
    order: updatedOrder,
    paymentIntent: capturedPaymentIntent,
  };
}

export async function cancelAuthorizedOrderPayment(orderOrId, options = {}) {
  const order =
    typeof orderOrId === "string"
      ? await prisma.order.findUnique({ where: { id: orderOrId } })
      : orderOrId;

  if (!order?.id || !order.stripePaymentId) {
    return { status: "missing_payment_intent", order: order || null };
  }

  const existingPaymentIntent = await retrieveStripePaymentIntent(
    order.stripePaymentId,
  );

  if (!existingPaymentIntent) {
    return { status: "missing_payment_intent", order };
  }

  if (isStripePaymentCapturedStatus(existingPaymentIntent.status)) {
    return { status: "already_captured", order, paymentIntent: existingPaymentIntent };
  }

  if (!isStripePaymentAuthorizedStatus(existingPaymentIntent.status)) {
    return { status: "not_cancellable", order, paymentIntent: existingPaymentIntent };
  }

  const cancelledPaymentIntent = await stripe.paymentIntents.cancel(
    existingPaymentIntent.id,
  );

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "CANCELLED",
      stripePaymentStatus: cancelledPaymentIntent.status,
      fulfillmentBlockedReason:
        options.reason || "Authorization hold released after medical review.",
    },
  });

  return {
    status: "cancelled",
    order: updatedOrder,
    paymentIntent: cancelledPaymentIntent,
  };
}
