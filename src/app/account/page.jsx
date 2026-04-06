import { redirect } from "next/navigation";
import AccountClient from "./account-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { buildLoginPath } from "@/lib/auth-routing";
import { stripUnusableConsultationState } from "@/lib/mdi-shared";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Account | HealSend",
  robots: {
    index: false,
    follow: false,
  },
};

function normalizeMdiSignal(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function containsInternalMarker(value) {
  const normalized = normalizeMdiSignal(value);
  if (!normalized) {
    return false;
  }

  return (
    normalized.includes("mdi-payload") ||
    normalized.includes("payload variant") ||
    normalized.includes("local-dev") ||
    normalized.includes("development seed order") ||
    /^dev-\d+$/i.test(String(value || "").trim())
  );
}

function isInternalCaseSnapshot(snapshot) {
  if (!snapshot) {
    return false;
  }

  const rawValues = [
    snapshot.mdiCaseId,
    snapshot.mdiOrderId,
    snapshot.mdiPatientId,
    snapshot.encounterId,
    snapshot.consultationId,
    snapshot.consultationUrl,
    snapshot.providerName,
    snapshot.latestEventType,
    snapshot.rawSnapshot ? JSON.stringify(snapshot.rawSnapshot) : null,
  ];

  return rawValues.some(containsInternalMarker);
}

function isInternalOrder(order) {
  if (!order) {
    return false;
  }

  const rawValues = [
    order.orderNumber,
    order.notes,
    order.mdiOrderId,
    order.mdiCaseId,
    order.mdiEncounterId,
    order.consultationId,
    order.consultationUrl,
  ];

  if (rawValues.some(containsInternalMarker)) {
    return true;
  }

  return (order.items || []).some((item) => item?.metadata?.seeded);
}

function isInternalSubscription(subscription) {
  if (!subscription) {
    return false;
  }

  const rawValues = [subscription.stripeSubscriptionId, subscription.notes];

  if (rawValues.some(containsInternalMarker)) {
    return true;
  }

  return /^sub_dev_/i.test(
    String(subscription.stripeSubscriptionId || "").trim(),
  );
}

function sanitizePatientFacingText(value, fallback = "") {
  const raw = String(value || "").trim();
  if (!raw) {
    return fallback;
  }

  const cleaned = raw
    .replace(/\s*case[:\s]+(?:mdi|local|dev)[^.\s<]+\.?/gi, ".")
    .replace(/\s*consultation[:\s]+(?:mdi|local|dev)[^.\s<]+\.?/gi, ".")
    .replace(/\s{2,}/g, " ")
    .replace(/\.\s*\./g, ".")
    .trim();

  return cleaned || fallback;
}

function sanitizePatientMessage(message) {
  if (!message) {
    return null;
  }

  return {
    ...message,
    subject: sanitizePatientFacingText(message.subject, message.subject || ""),
    body: sanitizePatientFacingText(
      message.body,
      "Your care team shared an update on your treatment.",
    ),
  };
}

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginPath("/account"));
  }

  const [
    orders,
    messages,
    paymentMethods,
    subscriptions,
    address,
    caseSnapshots,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                subscriptionTiers: true,
                telehealthProvider: true,
              },
            },
            variant: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.message.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.paymentMethod.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
    prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    }),
    prisma.address.findFirst({
      where: { userId: user.id },
      orderBy: { isDefault: "desc" },
    }),
    prisma.mdiCaseSnapshot.findMany({
      where: { userId: user.id },
      orderBy: [{ updatedAt: "desc" }, { latestEventAt: "desc" }],
    }),
  ]);

  const visibleOrders = orders
    .map((order) => stripUnusableConsultationState(order))
    .filter((order) => !isInternalOrder(order));
  const visibleCaseSnapshots = caseSnapshots.filter(
    (snapshot) => !isInternalCaseSnapshot(snapshot),
  );
  const visibleMessages = messages.map(sanitizePatientMessage);
  const visibleSubscriptions = subscriptions.filter(
    (subscription) => !isInternalSubscription(subscription),
  );

  return (
    <AccountClient
      initialUser={JSON.parse(JSON.stringify(user))}
      initialOrders={JSON.parse(JSON.stringify(visibleOrders))}
      initialMessages={JSON.parse(JSON.stringify(visibleMessages))}
      initialPaymentMethods={JSON.parse(JSON.stringify(paymentMethods))}
      initialSubscriptions={JSON.parse(JSON.stringify(visibleSubscriptions))}
      initialAddress={address ? JSON.parse(JSON.stringify(address)) : null}
      initialCaseSnapshots={JSON.parse(JSON.stringify(visibleCaseSnapshots))}
    />
  );
}
