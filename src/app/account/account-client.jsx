"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";
import AppIcon from "@/components/ui/AppIcon";
import { buildLoginPath } from "@/lib/auth-routing";
import { buildSupportMailto } from "@/lib/legal-links";
import { isUsableConsultationUrl } from "@/lib/mdi-shared";
import { getOrderFulfillmentAssessment } from "@/lib/order-workflow";
import { formatUsd } from "@/lib/pricing";

const TABS = [
  { key: "action-items", label: "Action Items", icon: "info" },
  { key: "orders", label: "Orders", icon: "receipt_long" },
  { key: "messages", label: "Messages", icon: "chat" },
  { key: "care-history", label: "Care Tracker", icon: "medical_services" },
  { key: "affiliate", label: "Affiliate", icon: "dollar" },
  { key: "profile", label: "Profile", icon: "person" },
  { key: "logout", label: "Logout", icon: "logout" },
];

function formatDate(value, options = {}) {
  if (!value) {
    return "Not available";
  }

  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    });
  } catch {
    return "Not available";
  }
}

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  try {
    return new Date(value).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Not available";
  }
}

function getStatusPill(status) {
  switch (String(status || "").toUpperCase()) {
    case "PAID":
    case "ACTIVE":
      return "bg-green-100 text-green-700";
    case "PROCESSING":
    case "TRIALING":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
    case "PAST_DUE":
      return "bg-amber-100 text-amber-700";
    case "SHIPPED":
      return "bg-sky-100 text-sky-700";
    case "CANCELED":
    case "CANCELLED":
    case "REFUNDED":
    case "EXPIRED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getMdiStatusPill(status) {
  switch (String(status || "").toUpperCase()) {
    case "READY":
    case "COMPLETED":
    case "CLOSED":
      return "bg-emerald-100 text-emerald-700";
    case "ASSIGNED":
    case "IN_PROGRESS":
    case "ACTIVE":
      return "bg-blue-100 text-blue-700";
    case "CREATED":
    case "SUBMITTED":
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "CANCELLED":
    case "CANCELED":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatStatusLabel(value, fallback = "Not available") {
  const raw = String(value || "").trim();
  if (!raw) {
    return fallback;
  }

  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function sanitizeInternalRecords(records = [], predicate) {
  return records.filter((record) => !predicate(record));
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

function getDisplayOrderReference(order) {
  const raw = String(order?.orderNumber || "").trim();
  if (!raw) {
    return null;
  }

  if (/^dev-\d+$/i.test(raw) || /^cmn[a-z0-9]+$/i.test(raw)) {
    return null;
  }

  return raw;
}

function getSupportReference(order) {
  return (
    getDisplayOrderReference(order) || order?.items?.[0]?.name || "your order"
  );
}

function getCaseSnapshotScore(snapshot, order) {
  if (!snapshot || isInternalCaseSnapshot(snapshot)) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = 0;
  const status = normalizeMdiSignal(snapshot.status || snapshot.phase);
  const latestEvent = normalizeMdiSignal(snapshot.latestEventType);

  if (snapshot.orderId && snapshot.orderId === order?.id) {
    score += 80;
  }

  if (order?.mdiCaseId && snapshot.mdiCaseId === order.mdiCaseId) {
    score += 50;
  }

  if (snapshot.providerName) {
    score += 15;
  }

  if (summarizeStructuredValue(snapshot.offerings)) {
    score += 20;
  }

  if (summarizeStructuredValue(snapshot.prescriptions)) {
    score += 25;
  }

  if (latestEvent.includes("prescription")) {
    score += 20;
  }

  if (status.includes("completed") || status.includes("closed")) {
    score += 35;
  } else if (
    status.includes("active") ||
    status.includes("assigned") ||
    status.includes("ready")
  ) {
    score += 18;
  } else if (status.includes("pending") || status.includes("submitted")) {
    score += 8;
  }

  const recency = new Date(
    snapshot.latestEventAt || snapshot.updatedAt || 0,
  ).getTime();
  if (Number.isFinite(recency) && recency > 0) {
    score += recency / 1_000_000_000_000;
  }

  return score;
}

function getCaseSnapshotForOrder(order, caseSnapshots = []) {
  const matches = caseSnapshots.filter(
    (snapshot) =>
      !isInternalCaseSnapshot(snapshot) &&
      (snapshot.orderId === order.id ||
        (order.mdiCaseId && snapshot.mdiCaseId === order.mdiCaseId)),
  );

  if (matches.length === 0) {
    return null;
  }

  return [...matches].sort(
    (left, right) =>
      getCaseSnapshotScore(right, order) - getCaseSnapshotScore(left, order),
  )[0];
}

function normalizeMdiSignal(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
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

function getMdiDashboardState(order, caseSnapshot = null) {
  if (!order) {
    return {
      showTask: false,
      kind: "none",
      heading: "Continue care",
      summary: "",
      ctaLabel: "Open patient portal",
      badgeLabel: null,
    };
  }

  const fulfillmentAssessment = getOrderFulfillmentAssessment(
    order,
    caseSnapshot,
  );
  const workflowPhase = normalizeMdiSignal(order.mdiWorkflowPhase);
  const consultationStatus = normalizeMdiSignal(order.consultationStatus);
  const caseStatus = normalizeMdiSignal(
    caseSnapshot?.status || caseSnapshot?.phase,
  );
  const hasLiveConsultation = isUsableConsultationUrl(order.consultationUrl);
  const hasProviderContext = Boolean(
    caseSnapshot?.mdiCaseId ||
    order.mdiCaseId ||
    caseSnapshot?.providerName ||
    order.mdiEncounterId,
  );
  const isComplete =
    consultationStatus === "completed" ||
    caseStatus.includes("completed") ||
    caseStatus.includes("closed") ||
    workflowPhase.includes("completed") ||
    workflowPhase.includes("closed");

  const needsQuestionnaire =
    hasLiveConsultation &&
    !isComplete &&
    (workflowPhase.includes("intake") ||
      workflowPhase.includes("questionnaire") ||
      consultationStatus === "pending" ||
      consultationStatus === "incomplete" ||
      (!hasProviderContext && !caseStatus));

  if (needsQuestionnaire) {
    return {
      showTask: true,
      kind: "questionnaire",
      heading: "Patient portal ready",
      summary:
        "Open your secure patient portal to review your intake status. If you already submitted it, your physician will review it next.",
      ctaLabel: hasLiveConsultation ? "Open patient portal" : "Start intake",
      badgeLabel: hasLiveConsultation ? "Portal ready" : "Intake ready",
    };
  }

  const reviewInProgress =
    !isComplete &&
    !needsQuestionnaire &&
    (caseStatus ||
      hasProviderContext ||
      workflowPhase.includes("review") ||
      workflowPhase.includes("assigned") ||
      workflowPhase.includes("processing") ||
      workflowPhase.includes("submitted") ||
      workflowPhase.includes("active"));

  if (reviewInProgress) {
    return {
      showTask: true,
      kind: "review",
      heading: "Medical review in progress",
      summary:
        fulfillmentAssessment.blockedReason ||
        "Your questionnaire is complete and your provider review is underway.",
      ctaLabel: hasLiveConsultation
        ? "Open patient portal"
        : "Check review status",
      badgeLabel: "Review in progress",
    };
  }

  const canStartQuestionnaire =
    !isComplete &&
    !hasLiveConsultation &&
    fulfillmentAssessment.paymentAuthorized;

  if (canStartQuestionnaire) {
    return {
      showTask: true,
      kind: "start",
      heading: "Medical questionnaire ready",
      summary:
        "Your payment is authorized and your secure intake is ready to start. Begin the questionnaire to move into medical review.",
      ctaLabel: "Start questionnaire",
      badgeLabel: "Questionnaire ready",
    };
  }

  return {
    showTask: false,
    kind: "none",
    heading: "Continue care",
    summary: "",
    ctaLabel: hasLiveConsultation ? "Open patient portal" : "Open care",
    badgeLabel: null,
  };
}

function summarizeStructuredValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) =>
        typeof entry === "string"
          ? entry
          : entry?.name || entry?.title || entry?.medication || entry?.label,
      )
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
  }

  if (value && typeof value === "object") {
    return Object.values(value)
      .map((entry) =>
        typeof entry === "string"
          ? entry
          : entry?.name || entry?.title || entry?.medication || entry?.label,
      )
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
  }

  return null;
}

function getDefaultPaymentMethod(paymentMethods = []) {
  return (
    paymentMethods.find((method) => method.isDefault) ||
    paymentMethods[0] ||
    null
  );
}

function getOrderTelehealthProvider(order) {
  const items = order?.items || [];
  for (const item of items) {
    if (item?.product?.telehealthProvider) {
      return item.product.telehealthProvider;
    }
  }
  // Fallback: if OLA fields are populated, it's OLA
  if (order?.olaOrderGuid) return "OLA";
  return order?.telehealthProvider || "MDI";
}

function getConsultationPath(order) {
  const provider = getOrderTelehealthProvider(order);
  if (provider === "OLA") return `/consultation/ola/${order.id}`;
  return `/consultation/${order.id}`;
}

function openConsultationTab(order) {
  const consultationPath = getConsultationPath(order);

  if (typeof window !== "undefined") {
    window.open(consultationPath, "_blank", "noopener,noreferrer");
  }

  return consultationPath;
}

function formatInterval(subscription) {
  const interval = String(subscription?.interval || "month").toLowerCase();
  const intervalCount = Number(subscription?.intervalCount) || 1;

  if (intervalCount <= 1) {
    return interval;
  }

  return `${intervalCount} ${interval}s`;
}

export default function AccountClient({
  initialUser,
  initialOrders,
  initialMessages,
  initialPaymentMethods,
  initialSubscriptions,
  initialAddress,
  initialCaseSnapshots,
}) {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState("action-items");
  const [liveOrders, setLiveOrders] = useState(null);
  const [liveMessages, setLiveMessages] = useState(null);
  const [liveCaseSnapshots, setLiveCaseSnapshots] = useState(null);
  const [messagingAuthUrl, setMessagingAuthUrl] = useState(null);
  const [messagingVerificationCode, setMessagingVerificationCode] =
    useState(null);
  const [mdiSyncing, setMdiSyncing] = useState(false);
  const [mdiSyncError, setMdiSyncError] = useState(false);

  const visibleOrders = useMemo(
    () =>
      sanitizeInternalRecords(
        liveOrders ?? initialOrders ?? [],
        isInternalOrder,
      ),
    [liveOrders, initialOrders],
  );
  const visibleCaseSnapshots = useMemo(
    () =>
      sanitizeInternalRecords(
        liveCaseSnapshots ?? initialCaseSnapshots ?? [],
        isInternalCaseSnapshot,
      ),
    [liveCaseSnapshots, initialCaseSnapshots],
  );
  const visibleMessages = liveMessages ?? initialMessages ?? [];

  const runMdiSync = React.useCallback(async () => {
    setMdiSyncing(true);
    setMdiSyncError(false);
    try {
      const res = await fetch("/api/account/mdi/sync", { method: "POST" });
      if (!res.ok) {
        setMdiSyncError(true);
        return;
      }
      const data = await res.json();
      if (data.orders) setLiveOrders(data.orders);
      if (data.messages) setLiveMessages(data.messages);
      if (data.caseSnapshots) setLiveCaseSnapshots(data.caseSnapshots);
      if (data.messagingAuthUrl) setMessagingAuthUrl(data.messagingAuthUrl);
      if (data.messagingVerificationCode)
        setMessagingVerificationCode(data.messagingVerificationCode);
    } catch {
      setMdiSyncError(true);
    } finally {
      setMdiSyncing(false);
    }
  }, []);

  // Auto-sync once on mount
  useEffect(() => {
    runMdiSync();
  }, [runMdiSync]);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const handleTabClick = async (key) => {
    if (key === "logout") {
      await logout();
      router.push(buildLoginPath());
      return;
    }
    setActiveTab(key);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <section className="min-h-[calc(100svh-88px)] bg-[radial-gradient(circle_at_top_left,#efeaff,transparent_34%),linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] px-4 pb-12 pt-10 sm:pb-16 sm:pt-12 md:px-8 md:pt-16">
        <div className="mx-auto max-w-[1340px]">
          <main className="min-h-[68svh] rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="grid grid-cols-2 flex-1 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors sm:px-5 lg:w-auto ${
                      activeTab === tab.key
                        ? "bg-[#5b3cdd] text-white"
                        : "border border-black/5 bg-[#faf9fe] text-[#484555] hover:bg-white"
                    } ${
                      tab.key === "profile" || tab.key === "logout"
                        ? "lg:px-3"
                        : ""
                    }`}
                    title={
                      tab.key === "profile" || tab.key === "logout"
                        ? tab.label
                        : undefined
                    }
                    aria-label={
                      tab.key === "profile" || tab.key === "logout"
                        ? tab.label
                        : undefined
                    }
                  >
                    <AppIcon className="h-[18px] w-[18px]" name={tab.icon} />
                    {tab.key !== "profile" && tab.key !== "logout" && tab.label}
                  </button>
                ))}
              </div>

              {/* Sync indicator / refresh button */}
              <button
                type="button"
                onClick={runMdiSync}
                disabled={mdiSyncing}
                title={
                  mdiSyncError
                    ? "Sync failed — click to retry"
                    : "Refresh care data"
                }
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  mdiSyncError
                    ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border border-black/5 bg-[#faf9fe] text-[#484555] hover:bg-white"
                } disabled:opacity-60`}
              >
                <AppIcon
                  className={`h-[15px] w-[15px] ${mdiSyncing ? "animate-spin" : ""}`}
                  name={mdiSyncing ? "progress_activity" : "sync"}
                />
                <span className="hidden sm:inline">
                  {mdiSyncing ? "Syncing…" : mdiSyncError ? "Retry" : "Refresh"}
                </span>
              </button>
            </div>

            {activeTab === "action-items" && (
              <ActionItemsTab
                initialOrders={visibleOrders}
                initialCaseSnapshots={visibleCaseSnapshots}
              />
            )}
            {activeTab === "orders" && (
              <OrdersTab
                initialOrders={visibleOrders}
                initialPaymentMethods={initialPaymentMethods}
                initialCaseSnapshots={visibleCaseSnapshots}
              />
            )}
            {activeTab === "messages" && (
              <MessagesTab
                initialMessages={visibleMessages}
                initialCaseSnapshots={visibleCaseSnapshots}
                messagingAuthUrl={messagingAuthUrl}
                verificationCode={messagingVerificationCode}
                mdiSyncing={mdiSyncing}
              />
            )}
            {activeTab === "care-history" && (
              <CareHistoryTab
                user={user}
                initialOrders={visibleOrders}
                initialSubscriptions={initialSubscriptions}
                initialCaseSnapshots={visibleCaseSnapshots}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                user={user}
                initialPaymentMethods={initialPaymentMethods}
                initialAddress={initialAddress}
                initialSubscriptions={initialSubscriptions}
                onUserUpdate={setUser}
              />
            )}
            {activeTab === "affiliate" && <AffiliateTab />}
          </main>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function FollowUpQuestionnaireCard({ followUp, onCompleted }) {
  const [open, setOpen] = useState(true);
  const [marking, setMarking] = useState(false);

  const handleOpen = () => {
    if (followUp.consultationUrl) {
      window.open(followUp.consultationUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleMarkDone = async () => {
    setMarking(true);
    try {
      await fetch("/api/follow-up-questionnaires", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: followUp.id }),
      });
      onCompleted(followUp.id);
    } catch {
      // silently ignore; user can dismiss instead
    } finally {
      setMarking(false);
    }
  };

  if (!open) return null;

  const hasUrl = Boolean(followUp.consultationUrl);

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 bg-gradient-to-r from-violet-50 to-purple-50 px-5 py-4 sm:px-6">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
              Provider follow-up
            </span>
          </div>
          <h3 className="text-base font-bold text-[#1c1a24]">
            Follow-up questionnaire ready
          </h3>
          <p className="mt-0.5 text-sm text-[#484555]">
            Your care team has sent a follow-up check-in for your{" "}
            <span className="font-medium">{followUp.templateName}</span>{" "}
            program. Please complete it so your provider can review your
            progress.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="shrink-0 rounded-full p-1 text-[#797587] transition-colors hover:bg-black/5"
          aria-label="Dismiss"
        >
          <AppIcon className="h-5 w-5" name="close" />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-[#797587]">
          {hasUrl
            ? "Opens securely in your patient portal."
            : "Your portal link is being prepared — check back shortly."}
        </p>

        <div className="flex items-center gap-3">
          {hasUrl && (
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center gap-2 rounded-full bg-[#5b3cdd] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a2fc7]"
            >
              <AppIcon className="h-[18px] w-[18px]" name="assignment" />
              Open questionnaire
            </button>
          )}
          <button
            type="button"
            onClick={handleMarkDone}
            disabled={marking}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#484555] transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <AppIcon className="h-[16px] w-[16px]" name="check_circle" />
            {marking ? "Saving…" : "Mark as done"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionItemsTab({ initialOrders, initialCaseSnapshots }) {
  const [orders] = useState(initialOrders || []);
  const [consultLoading, setConsultLoading] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [followUpLoading, setFollowUpLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/follow-up-questionnaires")
      .then((res) => (res.ok ? res.json() : { followUps: [] }))
      .then((data) => {
        if (!cancelled) {
          setFollowUps(
            (data.followUps || []).filter((f) => f.status === "SENT"),
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setFollowUpLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFollowUpCompleted = (id) => {
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
  };

  const pendingReview = orders.flatMap((order) => {
    const caseSnapshot = getCaseSnapshotForOrder(order, initialCaseSnapshots);
    const mdiState = getMdiDashboardState(order, caseSnapshot);

    if (!mdiState.showTask) {
      return [];
    }

    return order.items.map((item) => ({
      order,
      item,
      caseSnapshot,
      mdiState,
    }));
  });

  const handleStartReview = async (orderId) => {
    setConsultLoading(orderId);
    try {
      // Find the order to determine the provider
      const targetOrder = pendingReview.find(
        (pr) => pr.order.id === orderId,
      )?.order;
      const provider = targetOrder
        ? getOrderTelehealthProvider(targetOrder)
        : "MDI";
      const apiUrl =
        provider === "OLA"
          ? "/api/ola/create-consultation"
          : "/api/create-consultation";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        openConsultationTab(targetOrder || { id: orderId });
      }
    } catch {
      // Keep the UI calm; the consultation route can retry creation.
    } finally {
      setConsultLoading(null);
    }
  };

  const hasAnything = pendingReview.length > 0 || followUps.length > 0;

  if (!hasAnything && !followUpLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
        <AppIcon
          className="mx-auto mb-4 h-12 w-12 text-gray-300"
          name="check_circle"
        />
        <h3 className="mb-2 text-xl font-bold text-[#1c1a24]">
          No Action Items
        </h3>
        <p className="mb-6 text-sm text-[#484555]">
          You&apos;re all caught up. Check back after placing an order or when a
          provider follow-up is ready.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {followUps.map((followUp) => (
        <FollowUpQuestionnaireCard
          key={followUp.id}
          followUp={followUp}
          onCompleted={handleFollowUpCompleted}
        />
      ))}
      {pendingReview.map(({ order, item, caseSnapshot, mdiState }) => {
        const caseStatus = caseSnapshot?.status || caseSnapshot?.phase || null;
        const friendlyCaseStatus = formatStatusLabel(caseStatus, "In review");
        const hasLiveConsultation =
          isUsableConsultationUrl(order.consultationUrl) ||
          !!order.olaOrderGuid;

        return (
          <div
            key={item.id}
            className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 text-center sm:p-8"
          >
            <h3 className="text-xl font-bold text-[#1c1a24]">
              {mdiState.heading}
            </h3>
            <p className="text-sm text-[#484555]">For: {item.name}</p>
            <p className="mx-auto max-w-lg text-sm text-[#484555]">
              {caseSnapshot && mdiState.kind === "review"
                ? `Current review status: ${friendlyCaseStatus}. ${caseSnapshot.providerName ? `${caseSnapshot.providerName} is attached to your care. ` : ""}${mdiState.summary}`
                : mdiState.summary}
            </p>
            {mdiState.badgeLabel ? (
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    mdiState.kind === "questionnaire"
                      ? "bg-violet-100 text-violet-700"
                      : mdiState.kind === "review"
                        ? getMdiStatusPill(caseStatus || "pending")
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {mdiState.badgeLabel}
                </span>
              </div>
            ) : null}
            {hasLiveConsultation ? (
              <Link
                href={getConsultationPath(order)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <AppIcon className="h-[18px] w-[18px]" name="assignment" />
                {mdiState.ctaLabel}
              </Link>
            ) : (
              <button
                onClick={() => handleStartReview(order.id)}
                disabled={consultLoading === order.id}
                className="inline-flex items-center gap-2 rounded-full bg-[#5b3cdd] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a2fc7] disabled:opacity-50"
              >
                <AppIcon
                  className="h-[18px] w-[18px]"
                  name={
                    consultLoading === order.id ? "hourglass_top" : "assignment"
                  }
                />
                {consultLoading === order.id
                  ? "Starting..."
                  : mdiState.ctaLabel}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrdersTab({
  initialOrders,
  initialPaymentMethods,
  initialCaseSnapshots,
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders || []);
  const [consultLoading, setConsultLoading] = useState(null);
  const defaultPaymentMethod = useMemo(
    () => getDefaultPaymentMethod(initialPaymentMethods),
    [initialPaymentMethods],
  );

  const handleContactDoctor = async (orderId) => {
    const order = orders.find(
      (candidateOrder) => candidateOrder.id === orderId,
    );
    if (isUsableConsultationUrl(order?.consultationUrl)) {
      openConsultationTab(orderId);
      return;
    }

    setConsultLoading(orderId);
    try {
      const res = await fetch("/api/create-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok && data.consultationUrl) {
        setOrders((currentOrders) =>
          currentOrders.map((currentOrder) =>
            currentOrder.id === orderId
              ? {
                  ...currentOrder,
                  consultationId: data.consultationId,
                  consultationUrl: data.consultationUrl,
                  consultationStatus: data.consultationStatus,
                }
              : currentOrder,
          ),
        );
      }
    } catch {
      // The consultation route will retry creation if needed.
    } finally {
      setConsultLoading(null);
      openConsultationTab(orderId);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
        <p className="mb-4 text-[#484555]">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
        >
          {(() => {
            const caseSnapshot = getCaseSnapshotForOrder(
              order,
              initialCaseSnapshots,
            );
            const mdiState = getMdiDashboardState(order, caseSnapshot);
            const displayReference = getDisplayOrderReference(order);
            return (
              <div className="flex flex-col items-start gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusPill(order.status)}`}
                    >
                      {formatStatusLabel(order.status, "Order")}
                    </span>
                    {mdiState.badgeLabel ? (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          mdiState.kind === "questionnaire"
                            ? "bg-violet-100 text-violet-700"
                            : mdiState.kind === "review"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {mdiState.badgeLabel}
                      </span>
                    ) : null}
                    {displayReference ? (
                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#797587]">
                        {displayReference}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-[#797587]">
                    Placed {formatDate(order.createdAt)}
                  </p>
                  {caseSnapshot ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${getMdiStatusPill(caseSnapshot.status || caseSnapshot.phase)}`}
                      >
                        {formatStatusLabel(
                          caseSnapshot.status || caseSnapshot.phase,
                          "Case open",
                        )}
                      </span>
                      {caseSnapshot.providerName ? (
                        <span className="text-xs text-[#797587]">
                          Provider: {caseSnapshot.providerName}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <button
                  onClick={() => handleContactDoctor(order.id)}
                  disabled={consultLoading === order.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  <AppIcon
                    className="h-[16px] w-[16px]"
                    name={
                      consultLoading === order.id
                        ? "hourglass_top"
                        : "assignment"
                    }
                  />
                  {consultLoading === order.id
                    ? "Opening..."
                    : mdiState.showTask
                      ? mdiState.ctaLabel
                      : isUsableConsultationUrl(order.consultationUrl)
                        ? "Open patient portal"
                        : "Start medical review"}
                </button>
              </div>
            );
          })()}

          <div className="space-y-4 p-6">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-xl bg-[#faf9fe] p-4">
                <h4 className="text-lg font-bold text-[#1c1a24]">
                  {item.name}
                </h4>
                <p className="text-sm text-[#484555]">
                  {formatUsd(item.price)} x {item.quantity}
                </p>
              </div>
            ))}

            {order.consultationId || order.olaOrderGuid ? (
              <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4">
                <AppIcon
                  className="h-5 w-5 text-emerald-600"
                  name="medical_services"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-800">
                    {getOrderTelehealthProvider(order) === "OLA"
                      ? order.olaStatus === "completed"
                        ? "Consultation completed"
                        : "OLA consultation in progress"
                      : getMdiDashboardState(
                            order,
                            getCaseSnapshotForOrder(
                              order,
                              initialCaseSnapshots,
                            ),
                          ).kind === "questionnaire"
                        ? "Patient portal ready"
                        : order.consultationStatus === "completed"
                          ? "Consultation completed"
                          : "Consultation in progress"}
                  </p>
                </div>
                {isUsableConsultationUrl(order.consultationUrl) ||
                order.olaOrderGuid ? (
                  <Link
                    href={getConsultationPath(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    {getOrderTelehealthProvider(order) === "OLA"
                      ? "View Consultation"
                      : getMdiDashboardState(
                          order,
                          getCaseSnapshotForOrder(order, initialCaseSnapshots),
                        ).ctaLabel}
                  </Link>
                ) : null}
              </div>
            ) : null}

            <div>
              <h5 className="mb-2 text-sm font-semibold text-[#1c1a24]">
                Saved payment method
              </h5>
              <div className="rounded-lg bg-gray-50 p-4">
                {defaultPaymentMethod ? (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        {(defaultPaymentMethod.brand || "CARD").toUpperCase()}
                      </span>
                      <span className="text-[#484555]">
                        Card ending in {defaultPaymentMethod.last4 || "----"}
                      </span>
                    </div>
                    <span className="text-xs text-[#797587]">
                      {defaultPaymentMethod.expMonth || "--"}/
                      {defaultPaymentMethod.expYear || "--"}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-[#484555]">
                    No saved card is on file yet.
                  </p>
                )}
              </div>
            </div>

            {(() => {
              const caseSnapshot = getCaseSnapshotForOrder(
                order,
                initialCaseSnapshots,
              );
              if (!caseSnapshot) return null;

              const offeringsSummary = summarizeStructuredValue(
                caseSnapshot.offerings,
              );
              const prescriptionsSummary = summarizeStructuredValue(
                caseSnapshot.prescriptions,
              );

              return (
                <div className="rounded-lg bg-[#f6f3ff] p-4">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h5 className="text-sm font-semibold text-[#1c1a24]">
                        Care review status
                      </h5>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getMdiStatusPill(caseSnapshot.status || caseSnapshot.phase)}`}
                    >
                      {formatStatusLabel(
                        caseSnapshot.status || caseSnapshot.phase,
                        "Open",
                      )}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#797587]">
                        Provider
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#1c1a24]">
                        {caseSnapshot.providerName || "Not assigned yet"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#797587]">
                        Last update
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#1c1a24]">
                        {formatDateTime(
                          caseSnapshot.latestEventAt || caseSnapshot.updatedAt,
                        )}
                      </p>
                    </div>
                  </div>
                  {offeringsSummary || prescriptionsSummary ? (
                    <div className="mt-3 space-y-2 text-sm text-[#484555]">
                      {offeringsSummary ? (
                        <p>
                          <span className="font-semibold text-[#1c1a24]">
                            Offerings:
                          </span>{" "}
                          {offeringsSummary}
                        </p>
                      ) : null}
                      {prescriptionsSummary ? (
                        <p>
                          <span className="font-semibold text-[#1c1a24]">
                            Prescriptions:
                          </span>{" "}
                          {prescriptionsSummary}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })()}

            <div>
              <h5 className="mb-2 text-sm font-semibold text-[#1c1a24]">
                Billing summary
              </h5>
              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#484555]">Status</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusPill(order.status)}`}
                  >
                    {formatStatusLabel(order.status, "Order")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#484555]">Total</span>
                  <span className="font-bold text-[#1c1a24]">
                    {formatUsd(order.total)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#484555]">Placed on</span>
                  <span className="text-[#1c1a24]">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <Link
                  href={`/order-confirmation?orderId=${order.id}`}
                  className="inline-flex items-center gap-2 pt-1 text-sm font-medium text-[#5b3cdd] hover:underline"
                >
                  <AppIcon className="h-4 w-4" name="receipt_long" />
                  View order summary
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="text-[#484555]">Receipt ready</span>
            <a
              href={buildSupportMailto(
                `Order support: ${getSupportReference(order)}`,
              )}
              className="font-medium text-[#5b3cdd] hover:underline"
            >
              Contact support
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function SavedCardPanel({
  paymentMethod,
  allPaymentMethods,
  onUpdateCard,
  onDeleteCard,
  deletingCardId,
  updatingCard,
  cardError,
}) {
  const cards =
    allPaymentMethods && allPaymentMethods.length > 0
      ? allPaymentMethods
      : paymentMethod
        ? [paymentMethod]
        : [];

  return (
    <div className="rounded-2xl border border-[#c9c4d8]/30 bg-[#faf9fe] p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#797587]">
          Payment Methods
        </p>
        <button
          onClick={onUpdateCard}
          disabled={updatingCard}
          className="inline-flex items-center gap-2 rounded-full bg-[#5b3cdd] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4a2fc7] disabled:opacity-50"
        >
          <AppIcon className="h-[14px] w-[14px]" name="credit_card" />
          {updatingCard ? "Redirecting..." : "Add New Card"}
        </button>
      </div>

      {cards.length > 0 ? (
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#c9c4d8]/20 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="rounded bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white uppercase">
                  {card.brand || "CARD"}
                </span>
                <span className="text-sm font-semibold text-[#1c1a24]">
                  •••• {card.last4 || "----"}
                </span>
                <span className="text-xs text-[#797587]">
                  {card.expMonth || "--"}/{card.expYear || "--"}
                </span>
                {card.isDefault ? (
                  <span className="rounded-full bg-[#eeeafe] px-2 py-0.5 text-[10px] font-bold text-[#5b3cdd] uppercase">
                    Default
                  </span>
                ) : null}
              </div>
              {onDeleteCard ? (
                <button
                  type="button"
                  onClick={() => onDeleteCard(card.id)}
                  disabled={cards.length <= 1 || deletingCardId === card.id}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title={
                    cards.length <= 1
                      ? "You must keep at least one card"
                      : "Delete card"
                  }
                >
                  {deletingCardId === card.id ? "Removing…" : "Remove"}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#484555]">No card on file yet.</p>
      )}

      <p className="mt-3 text-xs text-[#797587]">
        Cards are securely saved for recurring billing. At least one card must
        remain on file.
      </p>
      {cardError ? (
        <p className="mt-2 text-xs text-red-600">{cardError}</p>
      ) : null}
    </div>
  );
}

function SubscriptionsTab({ initialSubscriptions, initialPaymentMethods }) {
  const [subscriptions, setSubscriptions] = useState(
    initialSubscriptions || [],
  );
  const [paymentMethods, setPaymentMethods] = useState(
    initialPaymentMethods || [],
  );
  const [savingId, setSavingId] = useState(null);
  const [updatingCard, setUpdatingCard] = useState(false);
  const [cardError, setCardError] = useState("");
  const [deletingCardId, setDeletingCardId] = useState(null);

  const defaultPaymentMethod = useMemo(
    () => getDefaultPaymentMethod(paymentMethods),
    [paymentMethods],
  );

  const handleDeleteCard = async (id) => {
    setDeletingCardId(id);
    try {
      const res = await fetch(
        `/api/user/payment-methods?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      if (!res.ok) return;
      setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setDeletingCardId(null);
    }
  };

  const handleUpdateCard = async () => {
    setUpdatingCard(true);
    setCardError("");
    try {
      const res = await fetch("/api/user/update-card", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.sessionUrl) {
        setCardError(
          data.error || "Could not start card update. Please try again.",
        );
        return;
      }
      window.location.href = data.sessionUrl;
    } catch {
      setCardError("Could not start card update. Please try again.");
    } finally {
      setUpdatingCard(false);
    }
  };

  const handleToggleRenewal = async (subscription) => {
    setSavingId(subscription.id);
    try {
      const res = await fetch("/api/user/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subscription.id,
          cancelAtPeriodEnd: !subscription.cancelAtPeriodEnd,
        }),
      });

      if (!res.ok) {
        return;
      }

      const updated = await res.json();
      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.map((currentSubscription) =>
          currentSubscription.id === updated.id ? updated : currentSubscription,
        ),
      );
    } finally {
      setSavingId(null);
    }
  };

  if (subscriptions.length === 0) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
          <AppIcon
            className="mx-auto mb-4 h-12 w-12 text-gray-300"
            name="autorenew"
          />
          <h3 className="mb-2 text-xl font-bold text-[#1c1a24]">
            No active subscriptions yet
          </h3>
          <p className="mb-6 text-sm text-[#484555]">
            Once you complete a treatment checkout, your ongoing plan details
            will appear here.
          </p>
        </div>
        <SavedCardPanel
          paymentMethod={defaultPaymentMethod}
          allPaymentMethods={paymentMethods}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
          deletingCardId={deletingCardId}
          updatingCard={updatingCard}
          cardError={cardError}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saved card panel at the top */}
      <SavedCardPanel
        paymentMethod={defaultPaymentMethod}
        allPaymentMethods={paymentMethods}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        deletingCardId={deletingCardId}
        updatingCard={updatingCard}
        cardError={cardError}
      />
      {subscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
        >
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusPill(subscription.status)}`}
                >
                  {subscription.status}
                </span>
                {subscription.cancelAtPeriodEnd ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Cancels at renewal
                  </span>
                ) : null}
              </div>
              <h3 className="text-xl font-bold text-[#1c1a24]">
                {subscription.planName}
              </h3>
              <p className="mt-1 text-sm text-[#484555]">
                {formatUsd(subscription.amount)} every{" "}
                {formatInterval(subscription)}
              </p>
            </div>

            <button
              onClick={() => handleToggleRenewal(subscription)}
              disabled={savingId === subscription.id}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                subscription.cancelAtPeriodEnd
                  ? "bg-[#5b3cdd] text-white hover:bg-[#4a2fc7]"
                  : "border border-red-200 text-red-600 hover:bg-red-50"
              } disabled:opacity-50`}
            >
              <AppIcon
                className="h-4 w-4"
                name={subscription.cancelAtPeriodEnd ? "undo" : "cancel"}
              />
              {savingId === subscription.id
                ? "Saving..."
                : subscription.cancelAtPeriodEnd
                  ? "Keep subscription"
                  : "Cancel order"}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl bg-[#faf9fe] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#797587]">
                Started
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1c1a24]">
                {formatDate(subscription.startDate)}
              </p>
            </div>
            <div className="rounded-xl bg-[#faf9fe] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#797587]">
                Next billing
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1c1a24]">
                {subscription.nextBillingDate
                  ? formatDate(subscription.nextBillingDate)
                  : "No future billing scheduled"}
              </p>
            </div>
            <div className="rounded-xl bg-[#faf9fe] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#797587]">
                Billing cadence
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1c1a24]">
                Every {formatInterval(subscription)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#484555]">
            Need help with billing changes or plan questions?{" "}
            <a
              href={buildSupportMailto(
                `Subscription support: ${subscription.planName}`,
              )}
              className="font-medium text-[#5b3cdd] hover:underline"
            >
              Contact support
            </a>
            .
          </p>
        </div>
      ))}
    </div>
  );
}

function PortalTab({
  messagingAuthUrl,
  verificationCode: initialVerificationCode,
  mdiSyncing,
}) {
  const iframeRef = useRef(null);
  const [portalUrl, setPortalUrl] = useState(messagingAuthUrl || null);
  const [verificationCode, setVerificationCode] = useState(
    initialVerificationCode || null,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const lastRefreshRef = useRef(0);

  // Sync updated URL/code from parent (e.g. after a background MDI sync)
  useEffect(() => {
    if (messagingAuthUrl && messagingAuthUrl !== portalUrl) {
      setPortalUrl(messagingAuthUrl);
    }
  }, [messagingAuthUrl, portalUrl]);

  useEffect(() => {
    if (
      initialVerificationCode &&
      initialVerificationCode !== verificationCode
    ) {
      setVerificationCode(initialVerificationCode);
    }
  }, [initialVerificationCode, verificationCode]);

  const refreshAuth = useCallback(async (incomingCaseId = null) => {
    const now = Date.now();
    if (now - lastRefreshRef.current < 4000) return null;
    lastRefreshRef.current = now;

    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/account/mdi/portal-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: incomingCaseId || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.consultationUrl) {
        throw new Error(data?.error || "Unable to refresh portal session");
      }
      setPortalUrl(data.consultationUrl);
      if (data.verificationCode) setVerificationCode(data.verificationCode);
      return data;
    } catch (err) {
      setError(err.message || "Unable to refresh portal session");
      return null;
    } finally {
      setRefreshing(false);
    }
  }, []);

  // OTP handshake and session-expiry listener
  useEffect(() => {
    if (!portalUrl) return;

    let targetOrigin = "*";
    try {
      targetOrigin = new URL(portalUrl).origin;
    } catch {
      targetOrigin = "*";
    }

    const onMessage = (event) => {
      let data;
      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (!data || typeof data !== "object") return;

      const eventName = data.event || data.message || null;
      if (!eventName) return;

      if (
        eventName === "otp_ready" &&
        iframeRef.current?.contentWindow === event.source
      ) {
        if (verificationCode) {
          const payload = { message: "otp", data: verificationCode };
          iframeRef.current.contentWindow.postMessage(payload, "*");
          if (targetOrigin !== "*") {
            iframeRef.current.contentWindow.postMessage(payload, targetOrigin);
          }
        } else if (!refreshing) {
          refreshAuth(data.case_id || data.caseId).then((fresh) => {
            if (
              fresh?.verificationCode &&
              iframeRef.current?.contentWindow === event.source
            ) {
              const payload = { message: "otp", data: fresh.verificationCode };
              iframeRef.current.contentWindow.postMessage(payload, "*");
              if (targetOrigin !== "*") {
                iframeRef.current.contentWindow.postMessage(
                  payload,
                  targetOrigin,
                );
              }
            }
          });
        }
      }

      if (["expired", "auth_expired", "session_expired"].includes(eventName)) {
        if (!refreshing) refreshAuth(data.case_id || data.caseId);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [portalUrl, verificationCode, refreshing, refreshAuth]);

  if (mdiSyncing && !portalUrl) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#5b3cdd]/20 border-t-[#5b3cdd]" />
        <p className="text-sm text-[#484555]">
          Connecting to your care portal…
        </p>
      </div>
    );
  }

  if (!portalUrl && !mdiSyncing) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4">
        <AppIcon name="health_and_safety" className="text-5xl text-gray-300" />
        <h3 className="text-lg font-bold text-[#1c1a24]">
          Patient portal not available yet
        </h3>
        <p className="max-w-sm text-center text-sm text-[#484555]">
          Complete a treatment order to unlock your secure patient portal.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4">
        <AppIcon name="error" className="text-5xl text-red-400" />
        <p className="max-w-md text-center text-sm text-[#484555]">{error}</p>
        <button
          onClick={() => {
            setError(null);
            refreshAuth();
          }}
          className="rounded-full bg-[#5b3cdd] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a2fc7]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="-m-4 md:-m-6 overflow-hidden rounded-b-[2rem]">
      {refreshing && (
        <div className="flex items-center gap-2 border-b border-black/5 bg-[#faf9fe] px-6 py-2 text-xs text-[#484555]">
          <AppIcon
            className="h-3.5 w-3.5 animate-spin text-[#5b3cdd]"
            name="progress_activity"
          />
          Refreshing portal session…
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={portalUrl}
        className="w-full border-0"
        style={{ minHeight: "calc(100svh - 280px)" }}
        title="HealSend patient portal"
        allow="camera; microphone; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
      />
    </div>
  );
}

function MessagesTab({
  initialMessages,
  initialCaseSnapshots,
  messagingAuthUrl,
  verificationCode,
  mdiSyncing,
}) {
  const messages = initialMessages || [];
  const derivedCaseUpdates = (initialCaseSnapshots || [])
    .filter(
      (snapshot) =>
        snapshot.latestEventType || snapshot.status || snapshot.phase,
    )
    .slice(0, 8)
    .map((snapshot) => ({
      id: `mdi-${snapshot.id}`,
      subject: snapshot.latestEventType
        ? `Care update: ${formatStatusLabel(snapshot.latestEventType)}`
        : "Care update",
      body: sanitizePatientFacingText(
        `${snapshot.providerName ? `${snapshot.providerName} updated your care. ` : ""}${snapshot.status ? `Status: ${formatStatusLabel(snapshot.status)}. ` : ""}${snapshot.phase ? `Stage: ${formatStatusLabel(snapshot.phase)}. ` : ""}`.trim(),
        "Your care team shared an update on your treatment.",
      ),
      fromAdmin: true,
      createdAt: snapshot.latestEventAt || snapshot.updatedAt,
    }));

  const combinedMessages = messages.length > 0 ? messages : derivedCaseUpdates;

  return (
    <div className="space-y-6">
      {/* Embedded MDI messaging portal */}
      <PortalTab
        messagingAuthUrl={messagingAuthUrl}
        verificationCode={verificationCode}
        mdiSyncing={mdiSyncing}
      />

      {/* Message history */}
      {combinedMessages.length === 0 ? (
        <div className="py-4 text-sm text-[#484555]">
          Message history will appear here after your first care-team update.
        </div>
      ) : (
        combinedMessages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl border p-4 ${
              message.fromAdmin
                ? "border-[#c9c4d8]/30 bg-[#f1ecf9]"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-[#484555]">
                {message.fromAdmin ? "Care Team" : "You"}
              </span>
              <span className="text-xs text-gray-400">
                {formatDateTime(message.createdAt)}
              </span>
            </div>
            {message.subject ? (
              <h4 className="mb-1 text-sm font-semibold text-[#1c1a24]">
                {message.subject}
              </h4>
            ) : null}
            <p className="text-sm text-[#484555]">
              {sanitizePatientFacingText(
                message.body,
                "Your care team shared an update on your treatment.",
              )}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

// ── Care History helpers ──────────────────────────────────────────────────────

const PHARMACY_STATUSES = new Set([
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
]);

function getVisitStatusSteps(order, caseSnapshot, mdiState) {
  const phase = String(order.mdiWorkflowPhase || "").toLowerCase();
  const consultStatus = String(order.consultationStatus || "").toLowerCase();
  const caseStatus = String(
    caseSnapshot?.status || caseSnapshot?.phase || "",
  ).toLowerCase();

  const isFullyComplete =
    caseStatus.includes("completed") ||
    caseStatus.includes("closed") ||
    phase.includes("completed") ||
    phase.includes("closed") ||
    order.status === "SHIPPED" ||
    order.status === "DELIVERED";

  const underReview =
    mdiState.kind === "review" ||
    phase.includes("review") ||
    phase.includes("assigned") ||
    phase.includes("processing") ||
    phase.includes("submitted") ||
    phase.includes("active") ||
    Boolean(caseSnapshot?.providerName);

  const intakeSubmitted =
    consultStatus === "completed" || underReview || isFullyComplete;

  const providerName = caseSnapshot?.providerName;

  return [
    {
      label: "Intake Submitted",
      description: "Your medical questionnaire has been received.",
      status: intakeSubmitted
        ? "completed"
        : mdiState.kind === "questionnaire"
          ? "active"
          : "pending",
    },
    {
      label: "Under Medical Review",
      description: providerName
        ? `${providerName} is currently reviewing your medical history. This usually takes 2–4 hours.`
        : "A clinician is reviewing your medical history. This usually takes 2–4 hours.",
      status: isFullyComplete
        ? "completed"
        : underReview
          ? "active"
          : "pending",
    },
    {
      label: "Treatment Plan Ready",
      description: "Your personalized treatment plan will be available.",
      status: isFullyComplete ? "completed" : "pending",
    },
  ];
}

function getPharmacySteps(order) {
  const s = order.status;
  const shipped = s === "SHIPPED" || s === "DELIVERED";
  const processing = s === "PROCESSING" || shipped;
  const paid = s === "PAID" || processing;
  return [
    {
      label: "Prescription Sent",
      description: "We securely sent your prescription to the pharmacy.",
      status: paid ? "completed" : "pending",
    },
    {
      label: "Processing at Pharmacy",
      description: "Your medication is being prepared.",
      status: processing ? "completed" : paid ? "active" : "pending",
    },
    {
      label: "Ready for Pickup",
      description: "Your medication is ready to collect.",
      status: shipped ? "completed" : processing ? "active" : "pending",
    },
  ];
}

function CareTimelineStep({ step, isLast }) {
  const { label, description, status } = step;
  const isPending = status === "pending";

  return (
    <div className="flex gap-4">
      {/* Circle + connector line */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
            status === "completed"
              ? "bg-[#5b3cdd]"
              : status === "active"
                ? "border-2 border-[#5b3cdd] bg-white"
                : "border-2 border-gray-200 bg-white"
          }`}
        >
          {status === "completed" && (
            <AppIcon name="check" className="h-4 w-4 text-white" />
          )}
          {status === "active" && (
            <div className="h-3 w-3 rounded-full bg-[#5b3cdd]" />
          )}
        </div>
        {!isLast && (
          <div
            className="mt-1 w-px flex-1 bg-gray-200"
            style={{ minHeight: "2rem" }}
          />
        )}
      </div>

      {/* Text */}
      <div className="pb-6">
        <p
          className={`text-sm font-semibold ${
            isPending ? "text-gray-400" : "text-[#1c1a24]"
          }`}
        >
          {label}
        </p>
        <p
          className={`mt-0.5 text-sm ${isPending ? "text-gray-300" : "text-[#484555]"}`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function CareTrackingCard({ icon, title, subtitle, subtitleBadge, steps }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Card header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#ede9ff]">
          <AppIcon name={icon} className="h-5 w-5 text-[#5b3cdd]" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-[#1c1a24]">{title}</p>
          <p className="mt-0.5 text-sm text-[#484555]">
            {subtitle}
            {subtitleBadge && (
              <span className="ml-1.5 inline-block rounded bg-[#5b3cdd] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {subtitleBadge}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="pl-1">
        {steps.map((step, i) => (
          <CareTimelineStep
            key={step.label}
            step={step}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function CareHistoryTab({
  user,
  initialOrders,
  initialSubscriptions,
  initialCaseSnapshots,
}) {
  const orders = initialOrders || [];
  const subscriptions = initialSubscriptions || [];
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "ACTIVE",
  );
  const firstName = user?.name?.trim().split(" ")[0] || "there";
  const isEmpty = orders.length === 0 && activeSubscriptions.length === 0;

  return (
    <div className="space-y-5">
      {/* ── Patient Portal header ── */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#5b3cdd]">
          <AppIcon name="favorite" className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1c1a24]">Patient Portal</h2>
          <p className="text-sm text-[#484555]">Welcome back, {firstName}</p>
        </div>
      </div>

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ede9ff]">
            <AppIcon
              name="medical_services"
              className="h-7 w-7 text-[#5b3cdd]"
            />
          </div>
          <h3 className="text-lg font-bold text-[#1c1a24]">
            Start a treatment to build your care history.
          </h3>
          <p className="mt-2 text-sm text-[#484555]">
            Once you place an order, your visit status and pharmacy tracking
            will appear here.
          </p>
        </div>
      )}

      {/* ── Per-order cards ── */}
      {orders.map((order) => {
        const caseSnapshot = getCaseSnapshotForOrder(
          order,
          initialCaseSnapshots,
        );
        const mdiState = getMdiDashboardState(order, caseSnapshot);
        const visitSteps = getVisitStatusSteps(order, caseSnapshot, mdiState);
        const showPharmacy = PHARMACY_STATUSES.has(order.status);
        const pharmacySteps = showPharmacy ? getPharmacySteps(order) : null;

        // Split "Tirzepatide 10mg" → title + dosage badge
        const rawName = order.items?.[0]?.name || "Prescription";
        const dosageMatch = rawName.match(/(\d+\s*(?:mg|mcg|ml|iu|units?))/i);
        const medTitle = dosageMatch
          ? rawName.replace(dosageMatch[0], "").trim()
          : rawName;
        const medBadge = dosageMatch ? dosageMatch[0].trim() : null;

        return (
          <div key={order.id} className="space-y-4">
            <CareTrackingCard
              icon="stethoscope"
              title="Your Visit Status"
              subtitle="Track your consultation progress"
              steps={visitSteps}
            />

            {showPharmacy && (
              <CareTrackingCard
                icon="medication"
                title="Pharmacy Tracking"
                subtitle={medTitle}
                subtitleBadge={medBadge}
                steps={pharmacySteps}
              />
            )}
          </div>
        );
      })}

      {/* ── Active subscriptions (compact) ── */}
      {activeSubscriptions.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {activeSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#ede9ff]">
                <AppIcon name="autorenew" className="h-5 w-5 text-[#5b3cdd]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-widest text-[#797587]">
                  Active care plan
                </p>
                <h4 className="mt-0.5 text-[15px] font-bold text-[#1c1a24]">
                  {sub.planName}
                </h4>
                <p className="mt-1 text-sm text-[#484555]">
                  Next billing:{" "}
                  {sub.nextBillingDate
                    ? formatDate(sub.nextBillingDate)
                    : "Not scheduled"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileTab({
  user,
  initialPaymentMethods,
  initialAddress,
  initialSubscriptions,
  onUserUpdate,
}) {
  const { refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth?.split("T")[0] || "",
  );
  const [saving, setSaving] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(
    initialPaymentMethods || [],
  );
  const [address, setAddress] = useState(initialAddress);
  const [addressForm, setAddressForm] = useState({
    line1: initialAddress?.line1 || "",
    line2: initialAddress?.line2 || "",
    city: initialAddress?.city || "",
    state: initialAddress?.state || "",
    zip: initialAddress?.zip || "",
    country: initialAddress?.country || "US",
  });
  const [subscriptions, setSubscriptions] = useState(
    initialSubscriptions || [],
  );
  const [savingSubscriptionId, setSavingSubscriptionId] = useState(null);
  const [updatingCard, setUpdatingCard] = useState(false);
  const [cardError, setCardError] = useState("");
  const [deletingCardId, setDeletingCardId] = useState(null);

  const defaultPaymentMethod = useMemo(
    () => getDefaultPaymentMethod(initialPaymentMethods),
    [initialPaymentMethods],
  );

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setDateOfBirth(user?.dateOfBirth?.split("T")[0] || "");
  }, [user]);

  useEffect(() => {
    setAddress(initialAddress);
    setAddressForm({
      line1: initialAddress?.line1 || "",
      line2: initialAddress?.line2 || "",
      city: initialAddress?.city || "",
      state: initialAddress?.state || "",
      zip: initialAddress?.zip || "",
      country: initialAddress?.country || "US",
    });
  }, [initialAddress]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          dateOfBirth: dateOfBirth || null,
        }),
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json().catch(() => null);
      if (data?.user) {
        onUserUpdate(data.user);
      }
      await refreshUser();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePayment = async (id) => {
    setDeletingCardId(id);
    try {
      const res = await fetch(
        `/api/user/payment-methods?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        return;
      }

      setPaymentMethods((currentMethods) =>
        currentMethods.filter((m) => m.id !== id),
      );
    } finally {
      setDeletingCardId(null);
    }
  };

  const handleMakeDefault = async (id) => {
    const res = await fetch("/api/user/payment-methods", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      return;
    }

    setPaymentMethods((currentMethods) =>
      currentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  const handleAddressSave = async () => {
    setSavingAddress(true);
    try {
      const res = await fetch("/api/user/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });

      if (!res.ok) {
        return;
      }

      const savedAddress = await res.json();
      setAddress(savedAddress);
      setAddressForm({
        line1: savedAddress.line1 || "",
        line2: savedAddress.line2 || "",
        city: savedAddress.city || "",
        state: savedAddress.state || "",
        zip: savedAddress.zip || "",
        country: savedAddress.country || "US",
      });
      setEditingAddress(false);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleUpdateCard = async () => {
    setUpdatingCard(true);
    setCardError("");
    try {
      const res = await fetch("/api/user/update-card", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.sessionUrl) {
        setCardError(
          data.error || "Could not start card update. Please try again.",
        );
        return;
      }
      window.location.href = data.sessionUrl;
    } catch {
      setCardError("Could not start card update. Please try again.");
    } finally {
      setUpdatingCard(false);
    }
  };

  const handleToggleRenewal = async (subscription) => {
    setSavingSubscriptionId(subscription.id);
    try {
      const res = await fetch("/api/user/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subscription.id,
          cancelAtPeriodEnd: !subscription.cancelAtPeriodEnd,
        }),
      });

      if (!res.ok) {
        return;
      }

      const updated = await res.json();
      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.map((s) => (s.id === updated.id ? updated : s)),
      );
    } finally {
      setSavingSubscriptionId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-[#1c1a24]">
          Subscriptions
        </h2>
        {subscriptions.length === 0 ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
              <AppIcon
                className="mx-auto mb-4 h-12 w-12 text-gray-300"
                name="autorenew"
              />
              <h3 className="mb-2 text-xl font-bold text-[#1c1a24]">
                No active subscriptions yet
              </h3>
              <p className="mb-6 text-sm text-[#484555]">
                Once you complete a treatment checkout, your ongoing plan
                details will appear here.
              </p>
            </div>
            {defaultPaymentMethod && (
              <SavedCardPanel
                paymentMethod={defaultPaymentMethod}
                allPaymentMethods={paymentMethods}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeletePayment}
                deletingCardId={deletingCardId}
                updatingCard={updatingCard}
                cardError={cardError}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <SavedCardPanel
              paymentMethod={defaultPaymentMethod}
              allPaymentMethods={paymentMethods}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeletePayment}
              deletingCardId={deletingCardId}
              updatingCard={updatingCard}
              cardError={cardError}
            />
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
              >
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusPill(subscription.status)}`}
                      >
                        {subscription.status}
                      </span>
                      {subscription.cancelAtPeriodEnd ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Cancels at renewal
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-xl font-bold text-[#1c1a24]">
                      {subscription.planName}
                    </h3>
                    <p className="mt-1 text-sm text-[#484555]">
                      {formatUsd(subscription.amount)} every{" "}
                      {formatInterval(subscription)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleRenewal(subscription)}
                    disabled={savingSubscriptionId === subscription.id}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                      subscription.cancelAtPeriodEnd
                        ? "bg-[#5b3cdd] text-white hover:bg-[#4a2fc7]"
                        : "border border-red-200 text-red-600 hover:bg-red-50"
                    } disabled:opacity-50`}
                  >
                    <AppIcon
                      className="h-4 w-4"
                      name={subscription.cancelAtPeriodEnd ? "undo" : "cancel"}
                    />
                    {savingSubscriptionId === subscription.id
                      ? "Saving..."
                      : subscription.cancelAtPeriodEnd
                        ? "Keep subscription"
                        : "Cancel order"}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-xl bg-[#faf9fe] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#797587]">
                      Started
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1c1a24]">
                      {formatDate(subscription.startDate)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#faf9fe] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#797587]">
                      Next billing
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1c1a24]">
                      {subscription.nextBillingDate
                        ? formatDate(subscription.nextBillingDate)
                        : "No future billing scheduled"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#faf9fe] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#797587]">
                      Billing cadence
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1c1a24]">
                      Every {formatInterval(subscription)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[#484555]">
                  Need help with billing changes or plan questions?{" "}
                  <a
                    href={buildSupportMailto(
                      `Subscription support: ${subscription.planName}`,
                    )}
                    className="font-medium text-[#5b3cdd] hover:underline"
                  >
                    Contact support
                  </a>
                  .
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-[#1c1a24]">
          Account Details
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex justify-stretch sm:justify-end">
            <button
              onClick={() => setEditing((currentValue) => !currentValue)}
              className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[#484555]">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#484555]">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#484555]">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#484555]">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="text-sm font-medium text-[#1c1a24] transition-colors hover:text-[#5b3cdd] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-[#484555]">Name</span>
                <p className="font-semibold text-[#1c1a24]">
                  {user.name || "Not provided"}
                </p>
              </div>
              <div>
                <span className="text-sm text-[#484555]">Email</span>
                <p className="font-semibold text-[#1c1a24]">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-[#484555]">Phone</span>
                <p className="font-semibold text-[#1c1a24]">
                  {user.phone || "Not provided"}
                </p>
              </div>
              <div>
                <span className="text-sm text-[#484555]">Date of birth</span>
                <p className="font-semibold text-[#1c1a24]">
                  {user.dateOfBirth
                    ? formatDate(user.dateOfBirth)
                    : "Not provided"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-[#1c1a24]">
          Payment Methods
        </h2>
        <div className="space-y-3">
          {paymentMethods.map((paymentMethod) => (
            <div
              key={paymentMethod.id}
              className={`flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between ${
                paymentMethod.isDefault
                  ? "border-[#5b3cdd] bg-[#f1ecf9]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {(paymentMethod.brand || "CARD").toUpperCase()}
                </span>
                <span className="text-sm text-[#484555]">
                  Card ending in {paymentMethod.last4 || "4242"}
                </span>
                {paymentMethod.isDefault ? (
                  <span className="rounded-full bg-[#5b3cdd] px-2 py-0.5 text-[10px] font-semibold text-white">
                    Default
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {!paymentMethod.isDefault ? (
                  <button
                    onClick={() => handleMakeDefault(paymentMethod.id)}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium transition-colors hover:bg-gray-50"
                  >
                    Make default
                  </button>
                ) : null}
                <button
                  onClick={() => handleDeletePayment(paymentMethod.id)}
                  className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-dashed border-[#c9c4d8] bg-[#faf9fe] p-4 text-sm text-[#484555]">
            Need to add or replace a card? Use secure billing support so our
            team can help update your saved payment method.
            <div className="mt-3">
              <a
                href={buildSupportMailto("Billing update request")}
                className="inline-flex items-center gap-2 rounded-full bg-[#5b3cdd] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a2fc7]"
              >
                <AppIcon className="h-4 w-4" name="support_agent" />
                Contact billing support
              </a>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[#1c1a24]">
            Shipping Address
          </h2>
          <button
            onClick={() => setEditingAddress((currentValue) => !currentValue)}
            className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            {editingAddress
              ? "Cancel"
              : address
                ? "Edit Address"
                : "Add Address"}
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <p className="mb-2 text-sm text-[#484555]">
            <strong>Orders</strong>
          </p>
          <p className="mb-4 text-sm text-[#484555]">
            Need to change the address of an order already in progress?{" "}
            <a
              href={buildSupportMailto("Order support")}
              className="text-[#5b3cdd] hover:underline"
            >
              Contact customer support
            </a>
            .
          </p>

          {editingAddress ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[#484555]">
                  Line 1
                </label>
                <input
                  type="text"
                  value={addressForm.line1}
                  onChange={(event) =>
                    setAddressForm((currentValue) => ({
                      ...currentValue,
                      line1: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#484555]">
                  Line 2
                </label>
                <input
                  type="text"
                  value={addressForm.line2}
                  onChange={(event) =>
                    setAddressForm((currentValue) => ({
                      ...currentValue,
                      line2: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-[#484555]">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(event) =>
                      setAddressForm((currentValue) => ({
                        ...currentValue,
                        city: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[#484555]">
                    State
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(event) =>
                      setAddressForm((currentValue) => ({
                        ...currentValue,
                        state: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[#484555]">
                    ZIP
                  </label>
                  <input
                    type="text"
                    value={addressForm.zip}
                    onChange={(event) =>
                      setAddressForm((currentValue) => ({
                        ...currentValue,
                        zip: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[#484555]">
                    Country
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(event) =>
                      setAddressForm((currentValue) => ({
                        ...currentValue,
                        country: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#5b3cdd] focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAddressSave}
                disabled={savingAddress}
                className="text-sm font-medium text-[#1c1a24] transition-colors hover:text-[#5b3cdd] disabled:opacity-50"
              >
                {savingAddress ? "Saving..." : "Save address"}
              </button>
            </div>
          ) : address ? (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-[#484555]">
              <p className="font-semibold text-[#1c1a24]">
                {user?.name || "Saved Address"}
              </p>
              <p>{address.line1}</p>
              {address.line2 ? <p>{address.line2}</p> : null}
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-semibold text-[#1c1a24]">
                No address has been provided yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Affiliate Commission Table Data ───────────────────────────────────────
const COMMISSION_ROWS = [
  {
    product: "Tirzepatide Injections",
    monthly: 50,
    threeMonth: 100,
    twelveMonth: 260,
  },
  {
    product: "Semaglutide Injections",
    monthly: 35,
    threeMonth: 70,
    twelveMonth: 200,
  },
];

// ─── Affiliate Tab ──────────────────────────────────────────────────────────

function AffiliateTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [motivation, setMotivation] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetch("/api/affiliate/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleApply(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivation, website }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Submission failed");
      setSubmitSuccess(true);
      // Reload dashboard to reflect new PENDING status
      fetch("/api/affiliate/dashboard")
        .then((r) => r.json())
        .then((d) => setData(d))
        .catch(() => {});
    } catch (err) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function copyUrl(id, url) {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const app = data?.application;
  const stats = data?.stats;
  const links = data?.links ?? [];
  const referrals = data?.referrals ?? [];
  const rewards = data?.rewards ?? [];

  const STATUS_BADGE = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-rose-100 text-rose-700",
    CONVERTED: "bg-emerald-100 text-emerald-700",
    REWARDED: "bg-blue-100 text-blue-700",
    EXPIRED: "bg-gray-100 text-gray-500",
    INVALID: "bg-rose-100 text-rose-700",
    PAID: "bg-emerald-100 text-emerald-700",
  };

  function StatusBadge({ status }) {
    return (
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[status] ?? "bg-gray-100 text-gray-600"}`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-[#1c1a24]">Affiliate Program</h2>
        <p className="mt-1 text-sm text-[#5f5b70]">
          Earn commissions by referring new patients to HealSend weight-loss
          programs.
        </p>
      </div>

      {/* ── Commission table (always visible) ── */}
      <div className="overflow-x-auto rounded-2xl border border-black/5">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-[#faf9fe]">
              <th className="px-5 py-3 text-left font-semibold text-[#484555]">
                Product
              </th>
              <th className="px-5 py-3 text-center font-semibold text-[#484555]">
                Monthly
              </th>
              <th className="px-5 py-3 text-center font-semibold text-[#484555]">
                3-Month
              </th>
              <th className="px-5 py-3 text-center font-semibold text-[#484555]">
                12-Month
              </th>
            </tr>
          </thead>
          <tbody>
            {COMMISSION_ROWS.map((row) => (
              <tr
                key={row.product}
                className="border-b border-black/5 last:border-0"
              >
                <td className="px-5 py-3 font-medium text-[#1c1a24]">
                  {row.product}
                </td>
                <td className="px-5 py-3 text-center font-semibold text-[#5b3cdd]">
                  ${row.monthly}
                </td>
                <td className="px-5 py-3 text-center font-semibold text-[#5b3cdd]">
                  ${row.threeMonth}
                </td>
                <td className="px-5 py-3 text-center font-semibold text-[#5b3cdd]">
                  ${row.twelveMonth}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Status area ── */}
      {loading ? (
        <div className="py-8 text-center text-sm text-[#797587]">Loading…</div>
      ) : app?.status === "APPROVED" ? (
        /* ═══════════════════ APPROVED PARTNER DASHBOARD ═══════════════════ */
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Clicks",
                value: stats?.totalClicks ?? 0,
                icon: "ads_click",
                bg: "bg-blue-100 text-blue-700",
              },
              {
                label: "Referrals",
                value: stats?.totalReferrals ?? 0,
                icon: "person_add",
                bg: "bg-violet-100 text-violet-700",
              },
              {
                label: "Conversions",
                value: `${stats?.conversions ?? 0} (${stats?.conversionRate ?? 0}%)`,
                icon: "check_circle",
                bg: "bg-emerald-100 text-emerald-700",
              },
              {
                label: "Pending payout",
                value: formatUsd(app.pendingPayout ?? 0),
                icon: "payments",
                bg: "bg-amber-100 text-amber-700",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-black/5 bg-[#faf9fe] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8e8a9d]">
                      {c.label}
                    </p>
                    <p className="mt-2 text-lg font-bold text-[#1c1a24]">
                      {c.value}
                    </p>
                  </div>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${c.bg}`}
                  >
                    <AppIcon name={c.icon} className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total earned */}
          <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-[#faf9fe] px-5 py-4">
            <span className="text-sm font-medium text-[#484555]">
              Total earned
            </span>
            <span className="text-xl font-bold text-[#1c1a24]">
              {formatUsd(app.totalEarnings ?? 0)}
            </span>
          </div>

          {/* Sub-tabs */}
          <div className="border-b border-[#ece8f6]">
            <nav className="flex gap-1">
              {[
                { id: "overview", label: "Links" },
                { id: "referrals", label: "Referrals" },
                { id: "rewards", label: "Rewards" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                    tab === t.id
                      ? "border-[#5b3cdd] text-[#5b3cdd]"
                      : "border-transparent text-[#797587] hover:text-[#484555]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* ── Links sub-tab ── */}
          {tab === "overview" && (
            <div className="space-y-3">
              {links.length === 0 ? (
                <p className="rounded-2xl bg-[#faf9fe] px-5 py-6 text-sm text-[#797587]">
                  No active links yet. Contact support to get your links set up.
                </p>
              ) : (
                links.map((lnk) => {
                  const url = `${origin}/go/${lnk.code}`;
                  return (
                    <div
                      key={lnk.id}
                      className="flex flex-col gap-3 rounded-2xl border border-[#ece8f6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1c1a24]">
                          {lnk.name}
                        </p>
                        <p className="break-all font-mono text-xs text-[#5b3cdd]">
                          {url}
                        </p>
                        <p className="mt-1 text-xs text-[#b0acba]">
                          {lnk.clickCount} clicks
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyUrl(lnk.id, url)}
                        className="shrink-0 rounded-full border border-[#d7d1e4] px-4 py-2 text-xs font-semibold text-[#1c1a24] hover:bg-[#f6f2ff]"
                      >
                        {copied === lnk.id ? "Copied!" : "Copy link"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── Referrals sub-tab ── */}
          {tab === "referrals" && (
            <div>
              {referrals.length === 0 ? (
                <p className="rounded-2xl bg-[#faf9fe] px-5 py-6 text-sm text-[#797587]">
                  No referrals yet.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#ece8f6]">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead>
                      <tr className="border-b border-[#ece8f6] bg-[#faf9fe] text-xs font-semibold uppercase tracking-wide text-[#797587]">
                        <th className="px-4 py-3 text-left">Link</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f0f9]">
                      {referrals.slice(0, 50).map((ref) => (
                        <tr key={ref.id}>
                          <td className="px-4 py-3 font-mono text-xs text-[#5b3cdd]">
                            {ref.link?.code || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={ref.status} />
                          </td>
                          <td className="px-4 py-3 text-xs text-[#797587]">
                            {formatDate(ref.convertedAt || ref.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Rewards sub-tab ── */}
          {tab === "rewards" && (
            <div>
              {rewards.length === 0 ? (
                <p className="rounded-2xl bg-[#faf9fe] px-5 py-6 text-sm text-[#797587]">
                  No rewards yet.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#ece8f6]">
                  <table className="w-full min-w-[360px] text-sm">
                    <thead>
                      <tr className="border-b border-[#ece8f6] bg-[#faf9fe] text-xs font-semibold uppercase tracking-wide text-[#797587]">
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f0f9]">
                      {rewards.slice(0, 50).map((rw) => (
                        <tr key={rw.id}>
                          <td className="px-4 py-3 font-bold text-[#1c1a24]">
                            {formatUsd(rw.rewardAmount)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={rw.status} />
                          </td>
                          <td className="px-4 py-3 text-xs text-[#797587]">
                            {formatDate(rw.paidAt || rw.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      ) : app?.status === "PENDING" ? (
        /* ═══════════════════ PENDING ═══════════════════ */
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-3">
            <AppIcon name="schedule" className="h-5 w-5 text-amber-600" />
            <p className="font-semibold text-amber-700">
              Application under review
            </p>
          </div>
          <p className="mt-2 text-sm text-amber-600">
            Submitted on {formatDate(app.createdAt)}. We’ll email you once we’ve
            reviewed it.
          </p>
        </div>
      ) : app?.status === "REJECTED" ? (
        /* ═══════════════════ REJECTED ═══════════════════ */
        <div className="space-y-5">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <p className="font-semibold text-rose-700">
              Application not approved
            </p>
            {app.rejectionReason && (
              <p className="mt-1 text-sm text-rose-600">
                {app.rejectionReason}
              </p>
            )}
            <p className="mt-2 text-sm text-rose-600">
              You may update and resubmit below.
            </p>
          </div>
          <AffiliateApplyForm
            motivation={motivation}
            setMotivation={setMotivation}
            website={website}
            setWebsite={setWebsite}
            submitting={submitting}
            submitError={submitError}
            submitSuccess={submitSuccess}
            onSubmit={handleApply}
          />
        </div>
      ) : (
        /* ═══════════════════ NO APPLICATION ═══════════════════ */
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold text-[#1c1a24]">
              Apply to become an affiliate
            </h3>
            <p className="mt-1 text-sm text-[#5f5b70]">
              Approved affiliates receive a unique referral link and commission
              payments on every new patient subscription.
            </p>
          </div>
          <AffiliateApplyForm
            motivation={motivation}
            setMotivation={setMotivation}
            website={website}
            setWebsite={setWebsite}
            submitting={submitting}
            submitError={submitError}
            submitSuccess={submitSuccess}
            onSubmit={handleApply}
          />
        </div>
      )}
    </div>
  );
}

function AffiliateApplyForm({
  motivation,
  setMotivation,
  website,
  setWebsite,
  submitting,
  submitError,
  submitSuccess,
  onSubmit,
}) {
  if (submitSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-center gap-3">
          <AppIcon name="check_circle" className="h-5 w-5 text-emerald-600" />
          <p className="font-semibold text-emerald-700">
            Application submitted!
          </p>
        </div>
        <p className="mt-2 text-sm text-emerald-600">
          We’ll review your application and notify you by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1c1a24]">
          Why do you want to join? <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          required
          rows={4}
          placeholder="Tell us about your audience or platform…"
          className="w-full rounded-2xl border border-[#d7d1e4] px-4 py-3 text-sm focus:border-[#5b3cdd] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1c1a24]">
          Website or social URL{" "}
          <span className="text-xs text-[#8e8a9d]">(optional)</span>
        </label>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://"
          className="w-full rounded-[1.75rem] border border-[#d7d1e4] px-5 py-4 text-sm focus:border-[#5b3cdd] focus:outline-none"
        />
      </div>
      {submitError && (
        <div className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
          {submitError}
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="hs-solid-btn rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
