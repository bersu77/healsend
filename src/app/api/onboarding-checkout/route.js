import { readFileSync } from "node:fs";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { recordAffiliateServerEvent } from "@/lib/affiliate-tracking";
import { ensureStripeCustomerForUser } from "@/lib/stripe-payment-workflow";
import { getCheckoutPricingState } from "@/lib/onboarding-pricing";
import {
  buildDuplicatePurchaseMessage,
  findExistingActivePurchaseForProduct,
} from "@/lib/purchase-guards";
import { NextResponse } from "next/server";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getRuntimeStripePublishableKey() {
  const directValue = String(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  ).trim();

  if (
    directValue &&
    directValue !== "REPLACE_ME" &&
    directValue.startsWith("pk_")
  ) {
    return directValue;
  }

  try {
    const envBlob = readFileSync("/proc/self/environ", "utf8");
    const keyEntry = envBlob
      .split("\u0000")
      .find((entry) => entry.startsWith("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="));

    return keyEntry
      ? keyEntry.slice("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=".length)
      : "";
  } catch {
    return "";
  }
}

/**
 * POST /api/onboarding-checkout
 *
 * Creates a Stripe PaymentIntent for an onboarding checkout.
 * Body: { templateId, medicationId, planId }
 *
 * Returns: { clientSecret, amount, paymentIntentId }
 */
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to checkout." },
        { status: 401 },
      );
    }

    const { templateId, medicationId, planId, preferredPricingMode } =
      await request.json();

    if (!templateId) {
      return NextResponse.json(
        { error: "templateId is required" },
        { status: 400 },
      );
    }

    const template = await prisma.onboardingTemplate.findUnique({
      where: { id: templateId },
      include: { steps: { orderBy: { order: "asc" } } },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Onboarding template not found" },
        { status: 404 },
      );
    }

    const checkoutStep = template.steps.find((s) => s.type === "CHECKOUT");
    const medicationStep = template.steps.find(
      (s) => s.type === "MEDICATION_SELECT",
    );
    const planStep = template.steps.find((s) => s.type === "PLAN_SELECTION");

    const selectedMedication = Array.isArray(
      medicationStep?.config?.medications,
    )
      ? medicationStep.config.medications.find((m) => m?.id === medicationId)
      : null;

    const selectedPlan = Array.isArray(planStep?.config?.plans)
      ? planStep.config.plans.find((p) => p?.id === planId)
      : null;

    const stylingForPricing =
      preferredPricingMode === "ALL_AT_ONCE" ||
      preferredPricingMode === "UPFRONT_ZERO"
        ? {
            ...(template.styling || {}),
            checkoutPricingMode: preferredPricingMode,
          }
        : template.styling;

    const pricingState = getCheckoutPricingState({
      styling: stylingForPricing,
      selectedPlan,
      selectedMedication,
      summary: checkoutStep?.config?.summary,
    });

    if (!pricingState.totalAmount) {
      return NextResponse.json(
        { error: "Unable to determine price for this treatment." },
        { status: 400 },
      );
    }

    let product = null;
    const directProductId =
      selectedMedication?.productId || template.productId || null;
    if (directProductId) {
      product = await prisma.product.findUnique({
        where: { id: directProductId },
      });
    }

    if (!product && medicationId) {
      const slugCandidates = [
        slugify(medicationId),
        slugify(selectedMedication?.name),
      ].filter(Boolean);

      for (const slug of slugCandidates) {
        const candidate = await prisma.product.findUnique({
          where: { slug },
        });
        if (candidate) {
          product = candidate;
          break;
        }
      }
    }

    if (!product) {
      const templateSlug = slugify(template.name);
      if (templateSlug) {
        product = await prisma.product.findUnique({
          where: { slug: templateSlug },
        });
      }
    }

    if (product?.id) {
      const duplicatePurchase = await findExistingActivePurchaseForProduct({
        userId: user.id,
        productId: product.id,
      });

      if (duplicatePurchase) {
        return NextResponse.json(
          {
            error: buildDuplicatePurchaseMessage(
              duplicatePurchase.itemName || product.name,
            ),
            duplicateProduct: true,
            existingOrderId: duplicatePurchase.id,
          },
          { status: 409 },
        );
      }
    }

    const productName =
      product?.name || selectedMedication?.name || template.name;

    const stripeCustomerId = await ensureStripeCustomerForUser(user);

    const amountCents = Math.round(pricingState.totalAmount * 100);
    const paymentIntentKey = [
      "onboarding-card-link-v4",
      user.id,
      template.id,
      medicationId || "none",
      planId || "none",
      stripeCustomerId || "guest",
      amountCents,
      pricingState.pricingMode,
    ].join(":");
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountCents,
        currency: "usd",
        customer: stripeCustomerId || undefined,
        capture_method: pricingState.captureMethod,
        payment_method_types: ["card", "link"],
        payment_method_options: {
          card: {
            setup_future_usage: "off_session",
          },
          link: {
            setup_future_usage: "off_session",
          },
        },
        metadata: {
          userId: user.id,
          templateId: template.id,
          templateSlug: template.slug,
          medicationId: medicationId || "",
          planId: planId || "",
          checkoutPricingMode: pricingState.pricingMode,
          delayedChargeDays: String(pricingState.delayedChargeDays),
        },
        description: `HealSend — ${productName}`,
      },
      {
        idempotencyKey: paymentIntentKey,
      },
    );

    await recordAffiliateServerEvent({
      userId: user.id,
      eventType: "PAYMENT",
      eventName: "payment_intent_created",
      funnelSlug: template.slug,
      paymentIntentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
      metadata: {
        templateId: template.id,
        medicationId: medicationId || null,
        planId: planId || null,
        amount: pricingState.totalAmount,
        checkoutPricingMode: pricingState.pricingMode,
        delayedChargeDays: pricingState.delayedChargeDays,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: pricingState.totalAmount,
      dueTodayAmount: pricingState.dueTodayAmount,
      checkoutPricingMode: pricingState.pricingMode,
      delayedChargeDays: pricingState.delayedChargeDays,
      publishableKey: getRuntimeStripePublishableKey(),
    });
  } catch (error) {
    console.error("[onboarding-checkout] Failed to initialize payment intent", {
      message: error?.message || "Unknown error",
      code: error?.code || null,
      type: error?.type || null,
    });

    return NextResponse.json(
      { error: "Unable to initialize payment right now. Please try again." },
      { status: 500 },
    );
  }
}
