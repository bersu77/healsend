import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { recordAffiliateServerEvent } from "@/lib/affiliate-tracking";
import {
  ensureStripeCustomerForUser,
  retrieveStripeCheckoutSession,
} from "@/lib/stripe-payment-workflow";
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

function normalizePaymentMethod(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "klarna" || normalized === "afterpay_clearpay") {
    return normalized;
  }
  return null;
}

function normalizeReturnPath(value) {
  const path = String(value || "").trim();
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }
  return path;
}

function isStripeTestMode() {
  return String(process.env.STRIPE_SECRET_KEY || "").startsWith("sk_test_");
}

async function resolveCheckoutContext({ templateId, medicationId, planId }) {
  const template = await prisma.onboardingTemplate.findUnique({
    where: { id: templateId },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  if (!template) {
    return { error: "Onboarding template not found", status: 404 };
  }

  const checkoutStep = template.steps.find((s) => s.type === "CHECKOUT");
  const medicationStep = template.steps.find(
    (s) => s.type === "MEDICATION_SELECT",
  );
  const planStep = template.steps.find((s) => s.type === "PLAN_SELECTION");

  const selectedMedication = Array.isArray(medicationStep?.config?.medications)
    ? medicationStep.config.medications.find((m) => m?.id === medicationId)
    : null;

  const selectedPlan = Array.isArray(planStep?.config?.plans)
    ? planStep.config.plans.find((p) => p?.id === planId)
    : null;

  const pricingState = getCheckoutPricingState({
    styling: template.styling,
    selectedPlan,
    selectedMedication,
    summary: checkoutStep?.config?.summary,
  });

  if (!pricingState.totalAmount) {
    return {
      error: "Unable to determine price for this treatment.",
      status: 400,
    };
  }

  let product = null;
  const directProductId = selectedMedication?.productId || template.productId || null;
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

  return {
    template,
    pricingState,
    product,
    productName: product?.name || selectedMedication?.name || template.name,
    selectedMedication,
    selectedPlan,
  };
}

async function assertHostedMethodAvailable(paymentMethod, pricingState) {
  if (!pricingState?.allowsBnpl) {
    return {
      error:
        "This funnel is set to $0 upfront, so Klarna and Afterpay are only available when checkout mode is All at once.",
      status: 409,
    };
  }

  if (paymentMethod !== "klarna") {
    return null;
  }

  const account = await stripe.accounts.retrieve();
  if (!account.charges_enabled || account.details_submitted === false) {
    return {
      error:
        "Klarna isn't available on this Stripe account yet. Finish Stripe account activation in Stripe first, then try again.",
      status: 409,
    };
  }

  return null;
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to checkout." },
        { status: 401 },
      );
    }

    const { templateId, medicationId, planId, method, returnPath } =
      await request.json();

    if (!templateId) {
      return NextResponse.json(
        { error: "templateId is required" },
        { status: 400 },
      );
    }

    const paymentMethod = normalizePaymentMethod(method);
    if (!paymentMethod) {
      return NextResponse.json(
        { error: "A supported BNPL method is required." },
        { status: 400 },
      );
    }

    const resolved = await resolveCheckoutContext({
      templateId,
      medicationId,
      planId,
    });

    if (resolved.error) {
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status || 400 },
      );
    }

    if (resolved.product?.id) {
      const duplicatePurchase = await findExistingActivePurchaseForProduct({
        userId: user.id,
        productId: resolved.product.id,
      });

      if (duplicatePurchase) {
        return NextResponse.json(
          {
            error: buildDuplicatePurchaseMessage(
              duplicatePurchase.itemName || resolved.product.name,
            ),
            duplicateProduct: true,
            existingOrderId: duplicatePurchase.id,
          },
          { status: 409 },
        );
      }
    }

    const availability = await assertHostedMethodAvailable(
      paymentMethod,
      resolved.pricingState,
    );
    if (availability) {
      return NextResponse.json(
        { error: availability.error },
        { status: availability.status },
      );
    }

    const stripeCustomerId =
      paymentMethod === "klarna"
        ? null
        : await ensureStripeCustomerForUser(user);
    const amountCents = Math.round(resolved.pricingState.totalAmount * 100);
    const origin = new URL(request.url).origin;
    const normalizedReturnPath = normalizeReturnPath(returnPath);
    const successUrl = new URL(normalizedReturnPath, origin);
    successUrl.searchParams.set("checkout_status", "success");
    successUrl.searchParams.set("checkout_method", paymentMethod);
    successUrl.searchParams.set("checkout_session_id", "{CHECKOUT_SESSION_ID}");

    const cancelUrl = new URL(normalizedReturnPath, origin);
    cancelUrl.searchParams.set("checkout_status", "cancelled");
    cancelUrl.searchParams.set("checkout_method", paymentMethod);

    const sessionPayload = {
      mode: "payment",
      payment_method_types: [paymentMethod],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      phone_number_collection: {
        enabled: true,
      },
      locale: "en",
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: resolved.productName,
              description:
                resolved.selectedPlan?.name ||
                resolved.template.name ||
                undefined,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        checkoutFlow: "onboarding",
        userId: user.id,
        templateId: resolved.template.id,
        templateSlug: resolved.template.slug,
        medicationId: medicationId || "",
        planId: planId || "",
        returnPath: normalizedReturnPath,
        checkoutPricingMode: resolved.pricingState.pricingMode,
        delayedChargeDays: String(resolved.pricingState.delayedChargeDays),
      },
      payment_intent_data: {
        metadata: {
          checkoutFlow: "onboarding",
          userId: user.id,
          templateId: resolved.template.id,
          templateSlug: resolved.template.slug,
          medicationId: medicationId || "",
          planId: planId || "",
          checkoutPricingMode: resolved.pricingState.pricingMode,
          delayedChargeDays: String(resolved.pricingState.delayedChargeDays),
        },
      },
    };

    if (stripeCustomerId) {
      sessionPayload.customer = stripeCustomerId;
      sessionPayload.customer_update = {
        address: "auto",
        name: "auto",
        shipping: "auto",
      };
    } else if (paymentMethod === "klarna" && isStripeTestMode()) {
      sessionPayload.customer_creation = "always";
      sessionPayload.customer_email =
        process.env.KLARNA_TEST_EMAIL || "customer@email.us";
      sessionPayload.metadata.originalUserEmail = user.email || "";
    } else if (user.email) {
      sessionPayload.customer_creation = "always";
      sessionPayload.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);

    await recordAffiliateServerEvent({
      userId: user.id,
      eventType: "PAYMENT",
      eventName: "checkout_session_created",
      funnelSlug: resolved.template.slug,
      stripeSessionId: session.id,
      paymentStatus: session.payment_status || "pending",
      metadata: {
        templateId: resolved.template.id,
        medicationId: medicationId || null,
        planId: planId || null,
        paymentMethod,
        amount: resolved.pricingState.totalAmount,
        checkoutPricingMode: resolved.pricingState.pricingMode,
        delayedChargeDays: resolved.pricingState.delayedChargeDays,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
      delayedChargeDays: resolved.pricingState.delayedChargeDays,
    });
  } catch (error) {
    console.error("[onboarding-checkout/session] Failed to create session", {
      message: error?.message || "Unknown error",
      code: error?.code || null,
      type: error?.type || null,
    });

    return NextResponse.json(
      { error: "Unable to start that payment method right now. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to verify checkout." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 },
      );
    }

    const session = await retrieveStripeCheckoutSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: "Checkout session not found." },
        { status: 404 },
      );
    }

    if (session.metadata?.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const paymentIntent =
      session.payment_intent && typeof session.payment_intent === "object"
        ? session.payment_intent
        : null;
    const paymentIntentStatus = String(paymentIntent?.status || "").toLowerCase();
    const sessionStatus = String(session.status || "").toLowerCase();
    const paymentStatus = String(session.payment_status || "").toLowerCase();
    const isReadyForSubmission =
      sessionStatus === "complete" ||
      paymentStatus === "paid" ||
      ["requires_capture", "succeeded", "processing"].includes(
        paymentIntentStatus,
      );

    return NextResponse.json({
      sessionId: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      paymentMethodTypes: session.payment_method_types || [],
      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : paymentIntent?.id || null,
      paymentIntentStatus: paymentIntent?.status || null,
      isReadyForSubmission,
    });
  } catch (error) {
    console.error("[onboarding-checkout/session] Failed to verify session", {
      message: error?.message || "Unknown error",
      code: error?.code || null,
      type: error?.type || null,
    });

    return NextResponse.json(
      { error: "Unable to verify checkout right now. Please try again." },
      { status: 500 },
    );
  }
}
