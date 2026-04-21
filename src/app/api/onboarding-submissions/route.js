import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  isStripePaymentAuthorizedStatus,
  isStripePaymentCapturedStatus,
  retrieveStripeCheckoutSession,
  retrieveStripePaymentIntent,
  syncPaymentMethodForUser,
} from "@/lib/stripe-payment-workflow";
import { getCheckoutPricingState } from "@/lib/onboarding-pricing";
import {
  buildDuplicatePurchaseMessage,
  findExistingActivePurchaseForProduct,
} from "@/lib/purchase-guards";
import { NextResponse } from "next/server";
import { sendGhlQuestionnaire } from "@/lib/ghl";
import { isGhlApiEnabled } from "@/lib/integration-settings";
import { getSiteSetting } from "@/lib/site-settings";
import {
  getMdiAccessToken,
  getMdiConfig,
  createDirectMdiIntakeForOrder,
  loadOrderForMdi,
} from "@/lib/mdi-client";
import { scheduleFollowUp } from "@/lib/follow-up-questionnaires";

const GLP1_QUESTIONNAIRE_ID_FALLBACK = "921e0175-e7d7-4b08-ab11-de4183b393ab";
const GLP1_FUNNEL_SLUGS_FALLBACK = ["glp-1-eligibility", "glp-1"];

async function resolveGlp1Settings() {
  const [questionnaireId, slugsCsv] = await Promise.all([
    getSiteSetting("ghl.glp1QuestionnaireId", GLP1_QUESTIONNAIRE_ID_FALLBACK),
    getSiteSetting("ghl.glp1FunnelSlugs", null),
  ]);
  const slugs = slugsCsv
    ? String(slugsCsv)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : GLP1_FUNNEL_SLUGS_FALLBACK;
  return { questionnaireId: String(questionnaireId), slugs };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeStripeStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

async function resolveProductFromMedication(template, medicationSelection) {
  if (!medicationSelection) return null;

  const medicationId = String(medicationSelection);
  const medicationStep = (template.steps || []).find(
    (step) => step.type === "MEDICATION_SELECT",
  );
  const medicationOptions = medicationStep?.config?.medications;

  const selectedMedication = Array.isArray(medicationOptions)
    ? medicationOptions.find((med) => med?.id === medicationId)
    : null;

  const directProductId =
    selectedMedication?.productId || template.productId || null;
  if (directProductId) {
    const byId = await prisma.product.findUnique({
      where: { id: directProductId },
    });
    if (byId) {
      return { product: byId, selectedMedication };
    }
  }

  const slugCandidates = [
    medicationId,
    slugify(selectedMedication?.name),
  ].filter(Boolean);

  for (const slug of slugCandidates) {
    const bySlug = await prisma.product.findUnique({ where: { slug } });
    if (bySlug) {
      return { product: bySlug, selectedMedication };
    }
  }

  return { product: null, selectedMedication };
}

// GET /api/onboarding-submissions — list submissions (admin)
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get("templateId");

  const where = {};
  if (templateId) where.templateId = templateId;

  const submissions = await prisma.onboardingSubmission.findMany({
    where,
    include: {
      template: { select: { name: true, slug: true } },
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(submissions);
}

// POST /api/onboarding-submissions — submit onboarding data
export async function POST(request) {
  const body = await request.json();
  const { templateId, data } = body;

  if (!templateId || !data) {
    return NextResponse.json(
      { error: "templateId and data are required" },
      { status: 400 },
    );
  }

  const [user, template] = await Promise.all([
    getCurrentUser(),
    prisma.onboardingTemplate.findUnique({
      where: { id: templateId },
      include: { steps: { orderBy: { order: "asc" } } },
    }),
  ]);

  if (!template) {
    return NextResponse.json(
      { error: "Onboarding template not found" },
      { status: 404 },
    );
  }

  const submission = await prisma.onboardingSubmission.create({
    data: {
      templateId,
      userId: user?.id || null,
      data,
      completedAt: new Date(),
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        submission,
        orderCreated: false,
        reason: "User account is required to place an order.",
      },
      { status: 201 },
    );
  }

  const stepTypeById = new Map(
    (template.steps || []).map((step) => [step.id, step.type]),
  );
  const medicationEntry = Object.entries(data).find(([stepId, value]) => {
    return (
      stepTypeById.get(stepId) === "MEDICATION_SELECT" &&
      typeof value === "string" &&
      value.trim()
    );
  });
  const checkoutEntry = Object.entries(data).find(([stepId, value]) => {
    return (
      stepTypeById.get(stepId) === "CHECKOUT" &&
      value &&
      typeof value === "object"
    );
  });
  const planEntry = Object.entries(data).find(([stepId, value]) => {
    return (
      stepTypeById.get(stepId) === "PLAN_SELECTION" &&
      typeof value === "string" &&
      value.trim()
    );
  });

  const medicationSelection = medicationEntry?.[1] || null;
  const checkoutData = checkoutEntry?.[1] || {};
  const paymentComplete = checkoutData?.paymentComplete === true;
  const stripePaymentIntentId = checkoutData?.stripePaymentIntentId || null;
  const stripeCheckoutSessionId = checkoutData?.stripeCheckoutSessionId || null;
  const checkoutSession = stripeCheckoutSessionId
    ? await retrieveStripeCheckoutSession(stripeCheckoutSessionId)
    : null;
  const directPaymentIntent = stripePaymentIntentId
    ? await retrieveStripePaymentIntent(stripePaymentIntentId)
    : null;
  const sessionPaymentIntent =
    checkoutSession?.payment_intent &&
    typeof checkoutSession.payment_intent === "object"
      ? checkoutSession.payment_intent
      : null;
  const paymentIntent = directPaymentIntent || sessionPaymentIntent || null;
  const paymentAuthorized = isStripePaymentAuthorizedStatus(
    paymentIntent?.status,
  );
  const paymentCaptured =
    isStripePaymentCapturedStatus(paymentIntent?.status) ||
    normalizeStripeStatus(checkoutSession?.payment_status) === "paid";
  const checkoutSessionComplete =
    normalizeStripeStatus(checkoutSession?.status) === "complete";

  if (paymentComplete && !paymentIntent && !checkoutSession) {
    return NextResponse.json(
      { error: "A valid payment authorization is required before submission." },
      { status: 400 },
    );
  }

  if (
    paymentComplete &&
    !paymentAuthorized &&
    !paymentCaptured &&
    !checkoutSessionComplete
  ) {
    return NextResponse.json(
      { error: "Payment authorization is still incomplete." },
      { status: 409 },
    );
  }

  if (paymentIntent) {
    await syncPaymentMethodForUser(user.id, paymentIntent);
  }
  const planSelection = planEntry?.[1] || null;

  // Always create an order when the onboarding is completed
  let product = null;
  let selectedMedication = null;

  if (medicationSelection) {
    const resolved = await resolveProductFromMedication(
      template,
      medicationSelection,
    );
    product = resolved.product;
    selectedMedication = resolved.selectedMedication;
  }

  // Fallback: resolve product from template's productId or slug
  if (!product && template.productId) {
    product = await prisma.product.findUnique({
      where: { id: template.productId },
    });
  }
  if (!product) {
    const slugCandidate = slugify(template.name);
    if (slugCandidate) {
      product = await prisma.product.findUnique({
        where: { slug: slugCandidate },
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
          submission,
          orderCreated: false,
          duplicateProduct: true,
          existingOrderId: duplicatePurchase.id,
          reason: buildDuplicatePurchaseMessage(
            duplicatePurchase.itemName || product.name,
          ),
        },
        { status: 200 },
      );
    }
  }

  const planStep = (template.steps || []).find(
    (step) => step.type === "PLAN_SELECTION",
  );
  const checkoutStep = (template.steps || []).find(
    (step) => step.type === "CHECKOUT",
  );
  const selectedPlan = Array.isArray(planStep?.config?.plans)
    ? planStep.config.plans.find((plan) => plan?.id === planSelection)
    : null;
  const pricingState = getCheckoutPricingState({
    styling: template.styling,
    selectedPlan,
    selectedMedication,
    summary: checkoutStep?.config?.summary,
  });
  const itemPrice = pricingState.totalAmount;
  const orderStatus = paymentCaptured ? "PAID" : "PENDING";
  const itemName = selectedMedication?.name || product?.name || template.name;
  const resolvedPaymentStatus =
    paymentIntent?.status ||
    checkoutSession?.payment_status ||
    (paymentComplete ? "processing" : "pending");
  const resolvedPaymentMethod =
    checkoutSession?.payment_method_types?.[0] ||
    paymentIntent?.payment_method_types?.[0] ||
    null;

  const orderData = {
    userId: user.id,
    status: orderStatus,
    subtotal: itemPrice,
    total: itemPrice,
    telehealthProvider: product?.telehealthProvider || "MDI",
    stripePaymentId: paymentIntent?.id || stripePaymentIntentId,
    stripeSessionId: stripeCheckoutSessionId || null,
    stripePaymentStatus: resolvedPaymentStatus,
    stripePaymentMethod: resolvedPaymentMethod,
    paymentCapturedAt: paymentCaptured ? new Date() : null,
    fulfillmentBlockedReason: paymentCaptured
      ? "Medical review has not started yet."
      : paymentAuthorized
        ? "Awaiting medical approval before charge capture."
        : checkoutSessionComplete
          ? "Awaiting payment confirmation."
          : "Awaiting payment authorization.",
    items: {
      create: [
        {
          productId: product?.id || null,
          name: itemName,
          price: itemPrice,
          quantity: 1,
          metadata: {
            onboardingSubmissionId: submission.id,
            onboardingTemplateId: template.id,
            onboardingTemplateSlug: template.slug,
            checkoutPricingMode: pricingState.pricingMode,
            delayedChargeDays: pricingState.delayedChargeDays,
            selectedMedicationId: medicationSelection,
            selectedPlanId: planSelection,
          },
        },
      ],
    },
  };

  const order = await prisma.order.create({ data: orderData });

  // Send the GLP-1 questionnaire via GHL chat when a GLP-1 order is created
  if (isGhlApiEnabled()) {
    try {
      const { questionnaireId, slugs } = await resolveGlp1Settings();
      if (slugs.includes(template.slug)) {
        const ghlContact = await prisma.ghlContact.findFirst({
          where: { userId: user.id },
        });
        if (ghlContact?.ghlId) {
          await sendGhlQuestionnaire(ghlContact.ghlId, questionnaireId);
        }
      }
    } catch (err) {
      console.error(
        "[onboarding-submissions] Failed to send GLP-1 questionnaire:",
        err,
      );
    }
  }

  // Schedule a follow-up questionnaire 4–7 days after submission
  if (user?.id && submission?.id) {
    try {
      await scheduleFollowUp(prisma, {
        userId: user.id,
        submissionId: submission.id,
        templateSlug: template.slug,
        templateName: template.name,
      });
    } catch (fuErr) {
      console.error(
        "[onboarding-submissions] Failed to schedule follow-up questionnaire:",
        fuErr,
      );
    }
  }

  // For any MDI-routed order with payment authorized or captured, proactively
  // create the MDI patient and questionnaire voucher so the intake is ready
  // before the user visits the account dashboard.
  const orderTelehealthProvider = product?.telehealthProvider || "MDI";
  if (
    (paymentCaptured || paymentAuthorized) &&
    orderTelehealthProvider === "MDI"
  ) {
    try {
      const mdiConfig = getMdiConfig();
      if (mdiConfig.clientId && mdiConfig.clientSecret) {
        const mdiAccessToken = await getMdiAccessToken({
          baseUrl: mdiConfig.baseUrl,
          clientId: mdiConfig.clientId,
          clientSecret: mdiConfig.clientSecret,
        });
        const fullOrder = await loadOrderForMdi(order.id);
        if (fullOrder) {
          await createDirectMdiIntakeForOrder(fullOrder, {
            accessToken: mdiAccessToken,
            baseUrl: mdiConfig.baseUrl,
            isSandbox: process.env.MD_IS_SANDBOX === "true",
          });
        }
      }
    } catch (mdiErr) {
      console.error(
        "[onboarding-submissions] Failed to create MDI intake after order:",
        mdiErr,
      );
    }
  }

  return NextResponse.json(
    {
      submission,
      orderCreated: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
    { status: 201 },
  );
}
