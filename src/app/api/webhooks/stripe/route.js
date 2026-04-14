import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { recordAffiliateServerEvent } from "@/lib/affiliate-tracking";
import { submitOrderToMdi } from "@/lib/mdi-client";
import {
  buildFulfillmentProjection,
  getPrimaryStripePaymentMethod,
  isOrderPaymentCaptured,
  isStripePaymentAuthorized,
  isStripePaymentSettled,
} from "@/lib/order-workflow";
import {
  isStripePaymentAuthorizedStatus,
  retrieveStripePaymentIntent,
  syncPaymentMethodForUser,
} from "@/lib/stripe-payment-workflow";
import { stripe } from "@/lib/stripe";
import { getPricingMetadataSummary } from "@/lib/pricing";
import { NextResponse } from "next/server";

function addMonths(date, count = 1) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + Math.max(1, count));
  return nextDate;
}

function resolveSubscriptionSeed(order, item, sessionId) {
  const pricingSummary = getPricingMetadataSummary(item.metadata);
  const rawDurationMonths = Number.parseInt(
    String(item?.metadata?.durationMonths || ""),
    10,
  );
  const durationMonths =
    Number.isFinite(rawDurationMonths) && rawDurationMonths > 0
      ? rawDurationMonths
      : null;

  const amount =
    (pricingSummary?.regularPrice ??
      pricingSummary?.unitPrice ??
      item.price ??
      0) * Math.max(1, item.quantity || 1);

  const planName = pricingSummary?.planName || item.name;
  const stripeSubscriptionId = `hs_checkout_${order.id}_${item.id}`;

  return {
    stripeSubscriptionId,
    planName,
    amount,
    currency: "USD",
    interval: "month",
    intervalCount: 1,
    status: "ACTIVE",
    startDate: new Date(),
    nextBillingDate: addMonths(new Date(), 1),
    cancelAtPeriodEnd: false,
    notes: JSON.stringify({
      source: "stripe-checkout",
      orderId: order.id,
      orderItemId: item.id,
      stripeSessionId: sessionId,
      durationMonths,
    }),
  };
}

async function syncOrderSubscriptions(orderId, sessionId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, subscriptionTiers: true },
          },
        },
      },
    },
  });

  if (!order) {
    return;
  }

  for (const item of order.items) {
    const hasSubscriptionMetadata =
      getPricingMetadataSummary(item.metadata) !== null ||
      (Array.isArray(item.product?.subscriptionTiers) &&
        item.product.subscriptionTiers.length > 0);

    if (!hasSubscriptionMetadata) {
      continue;
    }

    const subscriptionSeed = resolveSubscriptionSeed(order, item, sessionId);

    const subscription = await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscriptionSeed.stripeSubscriptionId },
      update: subscriptionSeed,
      create: {
        userId: order.userId,
        ...subscriptionSeed,
      },
    });

    await recordAffiliateServerEvent({
      userId: order.userId,
      orderId: order.id,
      subscriptionId: subscription.id,
      eventType: "PATIENT",
      eventName: "subscription_activated",
      paymentStatus: order.stripePaymentStatus || null,
      metadata: {
        planName: subscription.planName,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
      },
    });
  }
}

function getAffiliatePaymentEventName(stripeEventType, object) {
  switch (stripeEventType) {
    case "checkout.session.completed":
      return isStripePaymentSettled(object?.payment_status)
        ? "payment_captured"
        : "payment_authorized";
    case "checkout.session.async_payment_succeeded":
    case "payment_intent.succeeded":
      return "payment_captured";
    case "payment_intent.amount_capturable_updated":
      return "payment_authorized";
    case "payment_intent.payment_failed":
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired":
      return "payment_failed";
    case "charge.refunded":
      return "payment_refunded";
    default:
      return "payment_updated";
  }
}

function getStripeEventLinks(event) {
  const object = event.data.object || {};
  const objectType = String(object.object || "");
  const paymentIntentId =
    typeof object.payment_intent === "string"
      ? object.payment_intent
      : objectType === "payment_intent"
        ? object.id
        : null;
  const checkoutSessionId =
    objectType === "checkout.session" ? object.id : null;
  const metadataOrderId =
    typeof object.metadata?.orderId === "string"
      ? object.metadata.orderId
      : null;

  return {
    objectId: typeof object.id === "string" ? object.id : null,
    paymentIntentId,
    checkoutSessionId,
    metadataOrderId,
  };
}

async function reserveStripeWebhookEvent(event) {
  const links = getStripeEventLinks(event);

  try {
    const stripeEvent = await prisma.stripeWebhookEvent.create({
      data: {
        stripeEventId: event.id,
        eventType: event.type,
        payload: event,
        objectId: links.objectId,
        paymentIntentId: links.paymentIntentId,
        checkoutSessionId: links.checkoutSessionId,
      },
    });

    return { stripeEvent, duplicate: false };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existing = await prisma.stripeWebhookEvent.findUnique({
        where: { stripeEventId: event.id },
      });

      if (existing?.status === "FAILED") {
        const retried = await prisma.stripeWebhookEvent.update({
          where: { id: existing.id },
          data: {
            status: "PROCESSING",
            payload: event,
            eventType: event.type,
            objectId: links.objectId,
            paymentIntentId: links.paymentIntentId,
            checkoutSessionId: links.checkoutSessionId,
            processedAt: null,
            error: null,
          },
        });

        return {
          stripeEvent: retried,
          duplicate: false,
        };
      }

      return {
        stripeEvent: existing,
        duplicate: true,
      };
    }

    throw error;
  }
}

async function markStripeWebhookEvent(id, data) {
  return prisma.stripeWebhookEvent.update({
    where: { id },
    data,
  });
}

async function findOrderForStripeEvent(event) {
  const links = getStripeEventLinks(event);

  if (links.metadataOrderId) {
    const order = await prisma.order.findUnique({
      where: { id: links.metadataOrderId },
    });
    if (order) return order;
  }

  if (links.checkoutSessionId) {
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: links.checkoutSessionId },
    });
    if (order) return order;
  }

  if (links.paymentIntentId) {
    const order = await prisma.order.findFirst({
      where: { stripePaymentId: links.paymentIntentId },
    });
    if (order) return order;
  }

  return null;
}

async function clearUserCart(tx, userId) {
  if (!userId) return;

  const cart = await tx.cart.findUnique({ where: { userId } });
  if (!cart) return;

  await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
}

async function applyFulfillmentProjection(
  tx,
  orderId,
  order,
  caseSnapshot = null,
) {
  const { update } = buildFulfillmentProjection(order, caseSnapshot);
  if (Object.keys(update).length === 0) {
    return order;
  }

  return tx.order.update({
    where: { id: orderId },
    data: update,
  });
}

async function applySettledSession(
  order,
  session,
  { triggerMdi = false } = {},
) {
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? await retrieveStripePaymentIntent(session.payment_intent)
      : null;
  const paymentMethod = getPrimaryStripePaymentMethod(
    session.payment_method_types,
  );
  const paymentStatus =
    session.payment_status && isStripePaymentSettled(session.payment_status)
      ? "paid"
      : String(session.payment_status || "paid");

  const updatedOrder = await prisma.$transaction(async (tx) => {
    let nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status:
          order.status === "PENDING" || order.status === "CANCELLED"
            ? "PAID"
            : order.status,
        stripeSessionId: session.id,
        stripePaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : order.stripePaymentId,
        stripePaymentStatus: paymentStatus,
        stripePaymentMethod: paymentMethod || order.stripePaymentMethod,
        paymentCapturedAt: order.paymentCapturedAt || new Date(),
      },
    });

    nextOrder = await applyFulfillmentProjection(tx, order.id, nextOrder);
    await clearUserCart(tx, session.metadata?.userId || order.userId);

    return nextOrder;
  });

  await syncOrderSubscriptions(order.id, session.id);
  if (paymentIntent) {
    await syncPaymentMethodForUser(order.userId, paymentIntent);
  }

  if (triggerMdi) {
    try {
      await submitOrderToMdi(order.id);
    } catch (error) {
      console.error("Failed to sync paid order to MDI:", error);
    }
  }

  return updatedOrder;
}

async function applyAuthorizedSession(
  order,
  session,
  paymentIntent,
  { triggerMdi = false } = {},
) {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    let nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
        stripePaymentId:
          paymentIntent?.id ||
          (typeof session.payment_intent === "string"
            ? session.payment_intent
            : order.stripePaymentId),
        stripePaymentStatus: paymentIntent?.status || "requires_capture",
        stripePaymentMethod:
          getPrimaryStripePaymentMethod(paymentIntent?.payment_method_types) ||
          getPrimaryStripePaymentMethod(session.payment_method_types) ||
          order.stripePaymentMethod,
        paymentCapturedAt: null,
        authCreatedAt: order.authCreatedAt || new Date(),
      },
    });

    nextOrder = await applyFulfillmentProjection(tx, order.id, nextOrder);
    await clearUserCart(tx, session.metadata?.userId || order.userId);

    return nextOrder;
  });

  if (paymentIntent) {
    await syncPaymentMethodForUser(order.userId, paymentIntent);
  }

  if (triggerMdi) {
    try {
      await submitOrderToMdi(order.id);
    } catch (error) {
      console.error("Failed to sync authorized order to MDI:", error);
    }
  }

  return updatedOrder;
}

async function applyPendingSession(order, session) {
  return prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
        stripePaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : order.stripePaymentId,
        stripePaymentStatus: String(session.payment_status || "pending"),
        stripePaymentMethod:
          getPrimaryStripePaymentMethod(session.payment_method_types) ||
          order.stripePaymentMethod,
      },
    });

    return applyFulfillmentProjection(tx, order.id, nextOrder);
  });
}

async function applyFailedSession(order, session, status = "failed") {
  return prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: isOrderPaymentCaptured(order) ? order.status : "CANCELLED",
        stripeSessionId: session.id,
        stripePaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : order.stripePaymentId,
        stripePaymentStatus: status,
        stripePaymentMethod:
          getPrimaryStripePaymentMethod(session.payment_method_types) ||
          order.stripePaymentMethod,
      },
    });

    return applyFulfillmentProjection(tx, order.id, nextOrder);
  });
}

async function applySettledPaymentIntent(order, paymentIntent) {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status:
          order.status === "PENDING" || order.status === "CANCELLED"
            ? "PAID"
            : order.status,
        stripePaymentId: paymentIntent.id,
        stripePaymentStatus: "succeeded",
        stripePaymentMethod:
          getPrimaryStripePaymentMethod(paymentIntent.payment_method_types) ||
          (typeof paymentIntent.payment_method === "string"
            ? paymentIntent.payment_method
            : order.stripePaymentMethod),
        paymentCapturedAt: order.paymentCapturedAt || new Date(),
      },
    });

    return applyFulfillmentProjection(tx, order.id, nextOrder);
  });

  await syncPaymentMethodForUser(order.userId, paymentIntent);

  return updatedOrder;
}

async function applyAuthorizedPaymentIntent(order, paymentIntent) {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        stripePaymentId: paymentIntent.id,
        stripePaymentStatus: paymentIntent.status || "requires_capture",
        stripePaymentMethod:
          getPrimaryStripePaymentMethod(paymentIntent.payment_method_types) ||
          (typeof paymentIntent.payment_method === "string"
            ? paymentIntent.payment_method
            : order.stripePaymentMethod),
        paymentCapturedAt: null,
        authCreatedAt: order.authCreatedAt || new Date(),
      },
    });

    return applyFulfillmentProjection(tx, order.id, nextOrder);
  });

  await syncPaymentMethodForUser(order.userId, paymentIntent);

  return updatedOrder;
}

async function applyFailedPaymentIntent(order, paymentIntent) {
  return prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: isOrderPaymentCaptured(order) ? order.status : "CANCELLED",
        stripePaymentId: paymentIntent.id,
        stripePaymentStatus:
          String(paymentIntent.status || "payment_failed") || "payment_failed",
        stripePaymentMethod:
          getPrimaryStripePaymentMethod(paymentIntent.payment_method_types) ||
          (typeof paymentIntent.payment_method === "string"
            ? paymentIntent.payment_method
            : order.stripePaymentMethod),
      },
    });

    return applyFulfillmentProjection(tx, order.id, nextOrder);
  });
}

async function applyRefund(order) {
  return prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: "REFUNDED",
        stripePaymentStatus: "refunded",
      },
    });

    await tx.subscription.updateMany({
      where: {
        userId: order.userId,
        stripeSubscriptionId: {
          startsWith: `hs_checkout_${order.id}_`,
        },
      },
      data: {
        status: "CANCELED",
        cancelAtPeriodEnd: true,
        endDate: new Date(),
        nextBillingDate: null,
      },
    });

    return applyFulfillmentProjection(tx, order.id, {
      ...nextOrder,
      stripePaymentStatus: "refunded",
    });
  });
}

/**
 * Handles checkout.session.completed events triggered by card-update setup
 * sessions (mode = "setup"). Saves the new payment method for the user,
 * sets it as default, and detaches any other cards that are no longer default
 * only if the user explicitly wanted a replacement.
 */
async function applySetupSessionCardUpdate(session) {
  const userId = session.metadata?.userId;
  if (!userId) return { ok: false, reason: "no_userId_in_metadata" };

  const setupIntentId =
    typeof session.setup_intent === "string" ? session.setup_intent : null;
  if (!setupIntentId) return { ok: false, reason: "no_setup_intent" };

  const setupIntent = await stripe.setupIntents.retrieve(setupIntentId, {
    expand: ["payment_method"],
  });

  const pm = setupIntent.payment_method;
  if (!pm || typeof pm !== "object") {
    return { ok: false, reason: "no_payment_method_on_setup_intent" };
  }

  const stripePaymentMethodId = pm.id;
  const brand = pm.card?.brand || pm.type || "card";
  const last4 = pm.card?.last4 || null;
  const expMonth = pm.card?.exp_month || null;
  const expYear = pm.card?.exp_year || null;

  // Attach payment method to customer in Stripe if not already attached
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.stripeCustomerId) {
    try {
      await stripe.paymentMethods.attach(stripePaymentMethodId, {
        customer: user.stripeCustomerId,
      });
    } catch {
      // Already attached — safe to ignore
    }

    // Set as Stripe customer's default payment method
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: stripePaymentMethodId },
    });
  }

  // Unset all existing defaults, then save/update the new card as default
  await prisma.paymentMethod.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  const existing = await prisma.paymentMethod.findFirst({
    where: { userId, stripePaymentMethodId },
  });

  if (existing) {
    await prisma.paymentMethod.update({
      where: { id: existing.id },
      data: { brand, last4, expMonth, expYear, isDefault: true },
    });
  } else {
    await prisma.paymentMethod.create({
      data: {
        userId,
        stripePaymentMethodId,
        brand,
        last4,
        expMonth,
        expYear,
        isDefault: true,
      },
    });
  }

  return { ok: true };
}

async function processStripeEvent(event, stripeEventRow) {
  // Handle setup-mode sessions (card update) — no order is involved
  if (
    event.type === "checkout.session.completed" &&
    event.data.object?.mode === "setup"
  ) {
    const result = await applySetupSessionCardUpdate(event.data.object);
    await markStripeWebhookEvent(stripeEventRow.id, {
      status: result.ok ? "PROCESSED" : "IGNORED",
      processedAt: new Date(),
      error: result.ok ? null : result.reason,
    });
    return { processed: result.ok, cardUpdate: true };
  }

  const order = await findOrderForStripeEvent(event);
  const links = getStripeEventLinks(event);
  const object = event.data.object;

  if (!order) {
    await markStripeWebhookEvent(stripeEventRow.id, {
      status: "IGNORED",
      orderId: null,
      processedAt: new Date(),
      error: "No matching order found",
    });

    return { ignored: true, reason: "no_matching_order" };
  }

  const baseStripeEventUpdate = {
    orderId: order.id,
    paymentIntentId: links.paymentIntentId,
    checkoutSessionId: links.checkoutSessionId,
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const session = object;
      const paymentIntent =
        typeof session.payment_intent === "string"
          ? await retrieveStripePaymentIntent(session.payment_intent)
          : null;

      if (isStripePaymentAuthorizedStatus(paymentIntent?.status)) {
        await applyAuthorizedSession(order, session, paymentIntent, {
          triggerMdi: true,
        });
      } else if (isStripePaymentSettled(session.payment_status)) {
        await applySettledSession(order, session, { triggerMdi: true });
      } else {
        await applyPendingSession(order, session);
      }
      break;
    }

    case "checkout.session.async_payment_succeeded": {
      await applySettledSession(order, object, { triggerMdi: true });
      break;
    }

    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      await applyFailedSession(
        order,
        object,
        event.type === "checkout.session.expired"
          ? "expired"
          : "async_payment_failed",
      );
      break;
    }

    case "payment_intent.succeeded": {
      await applySettledPaymentIntent(order, object);
      break;
    }

    case "payment_intent.amount_capturable_updated": {
      if (
        isStripePaymentAuthorizedStatus(object.status) ||
        isStripePaymentAuthorized(object.status)
      ) {
        await applyAuthorizedPaymentIntent(order, object);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      await applyFailedPaymentIntent(order, object);
      break;
    }

    case "charge.refunded": {
      if (!object.payment_intent) {
        await markStripeWebhookEvent(stripeEventRow.id, {
          ...baseStripeEventUpdate,
          status: "IGNORED",
          processedAt: new Date(),
          error: "Refund event missing payment_intent",
        });
        return { ignored: true, reason: "refund_missing_payment_intent" };
      }

      await applyRefund(order);
      break;
    }

    default: {
      await markStripeWebhookEvent(stripeEventRow.id, {
        ...baseStripeEventUpdate,
        status: "IGNORED",
        processedAt: new Date(),
        error: `Unhandled event type: ${event.type}`,
      });
      return { ignored: true, reason: "unhandled_event_type" };
    }
  }

  await markStripeWebhookEvent(stripeEventRow.id, {
    ...baseStripeEventUpdate,
    status: "PROCESSED",
    processedAt: new Date(),
    error: null,
  });

  const latestOrder = await prisma.order.findUnique({
    where: { id: order.id },
  });

  await recordAffiliateServerEvent({
    userId: latestOrder?.userId || order.userId,
    orderId: order.id,
    eventType: "PAYMENT",
    eventName: getAffiliatePaymentEventName(event.type, object),
    paymentIntentId: links.paymentIntentId,
    stripeSessionId: links.checkoutSessionId,
    paymentStatus:
      latestOrder?.stripePaymentStatus ||
      object?.status ||
      object?.payment_status ||
      null,
    consultationStatus: latestOrder?.consultationStatus || null,
    mdiWorkflowPhase: latestOrder?.mdiWorkflowPhase || null,
    metadata: {
      stripeEventType: event.type,
    },
  });

  return { processed: true, orderId: order.id };
}

export async function POST(request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { stripeEvent, duplicate } = await reserveStripeWebhookEvent(event);
  if (duplicate) {
    return NextResponse.json({
      received: true,
      duplicate: true,
      eventId: stripeEvent?.id || null,
    });
  }

  try {
    const result = await processStripeEvent(event, stripeEvent);
    return NextResponse.json({
      received: true,
      ...result,
      eventId: stripeEvent.id,
    });
  } catch (error) {
    console.error("Failed to process Stripe webhook:", error);

    await markStripeWebhookEvent(stripeEvent.id, {
      status: "FAILED",
      processedAt: new Date(),
      error:
        error instanceof Error ? error.message : "Unknown processing error",
    });

    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 },
    );
  }
}
