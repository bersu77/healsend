"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";
import { buildLoginPath } from "@/lib/auth-routing";
import { trackAffiliateClientEvent } from "@/lib/affiliate-tracking-client";
import { isUsableConsultationUrl } from "@/lib/mdi-shared";
import AppIcon from "@/components/ui/AppIcon";

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function formatStatusLabel(value, fallback = "Pending") {
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

function getPrimaryConsultationBadge(order) {
  const normalized = normalizeStatus(order?.consultationStatus);

  if (normalized === "completed") {
    return {
      label: "Completed",
      className: "bg-emerald-100 text-emerald-700",
    };
  }

  if (
    normalized === "active" ||
    normalized === "in_progress" ||
    normalized === "review" ||
    normalized === "ready"
  ) {
    return {
      label: normalized === "ready" ? "Portal ready" : "In progress",
      className: "bg-blue-100 text-blue-700",
    };
  }

  return {
    label: isUsableConsultationUrl(order?.consultationUrl)
      ? "Portal ready"
      : "Preparing",
    className: "bg-amber-100 text-amber-700",
  };
}

function getReviewStageLabel(order) {
  const raw = normalizeStatus(
    order?.mdiCaseSnapshot?.status ||
      order?.mdiCaseSnapshot?.phase ||
      order?.mdiWorkflowPhase,
  );

  if (!raw) {
    return isUsableConsultationUrl(order?.consultationUrl)
      ? "Portal ready"
      : "Preparing your visit";
  }

  if (raw.includes("completed") || raw.includes("closed")) {
    return "Completed";
  }

  if (
    raw.includes("approved") ||
    raw.includes("cleared") ||
    raw.includes("prescription") ||
    raw.includes("fulfillment")
  ) {
    return "Approved";
  }

  if (
    raw.includes("review") ||
    raw.includes("assigned") ||
    raw.includes("processing") ||
    raw.includes("active") ||
    raw.includes("provider")
  ) {
    return "In medical review";
  }

  if (
    raw.includes("intake") ||
    raw.includes("questionnaire") ||
    raw.includes("pending") ||
    raw.includes("submitted") ||
    raw.includes("incomplete")
  ) {
    return "Finishing intake";
  }

  return formatStatusLabel(raw, "Preparing your visit");
}

function getReviewStageSummary(order) {
  const raw = normalizeStatus(
    order?.mdiCaseSnapshot?.status ||
      order?.mdiCaseSnapshot?.phase ||
      order?.mdiWorkflowPhase,
  );

  if (!raw) {
    return isUsableConsultationUrl(order?.consultationUrl)
      ? "Your secure intake is ready whenever you want to continue."
      : "We’re preparing your secure consultation now.";
  }

  if (raw.includes("completed") || raw.includes("closed")) {
    return "Your medical review is complete and your care plan is moving forward.";
  }

  if (
    raw.includes("approved") ||
    raw.includes("cleared") ||
    raw.includes("prescription") ||
    raw.includes("fulfillment")
  ) {
    return "Your treatment has moved past medical review and is progressing.";
  }

  if (
    raw.includes("review") ||
    raw.includes("assigned") ||
    raw.includes("processing") ||
    raw.includes("active") ||
    raw.includes("provider")
  ) {
    return "A licensed clinician is reviewing your information now.";
  }

  if (
    raw.includes("intake") ||
    raw.includes("questionnaire") ||
    raw.includes("pending") ||
    raw.includes("submitted") ||
    raw.includes("incomplete")
  ) {
    return "Finish your secure intake and we’ll move you into medical review next.";
  }

  return "Your consultation is moving through the next care step now.";
}

function formatShortTimestamp(value) {
  if (!value) {
    return null;
  }

  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

function ensureFullscreenParam(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("fullscreen")) {
      parsed.searchParams.set("fullscreen", "true");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function parseEmbedPayload(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return { event: raw };
    }
  }
  return null;
}

export default function ConsultationPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { user, isLoadingAuth, isAuthenticated } = useAuth();
  const iframeRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [verificationCode, setVerificationCode] = useState(null);
  const [embedEvent, setEmbedEvent] = useState(null);
  const [refreshingAuth, setRefreshingAuth] = useState(false);
  const lastRefreshRef = useRef(0);
  const hasAttemptedCreateRef = useRef(false);
  const hasTrackedPortalOpenRef = useRef(false);
  const showEmbedDebug = process.env.NODE_ENV !== "production";

  useEffect(() => {
    hasAttemptedCreateRef.current = false;
  }, [orderId]);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.push(
        buildLoginPath(
          `/consultation/${encodeURIComponent(String(orderId || ""))}`,
        ),
      );
    }
  }, [isLoadingAuth, isAuthenticated, orderId, router]);

  // Load order details
  useEffect(() => {
    if (!orderId || !isAuthenticated) return;

    fetch(`/api/orders/${orderId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Order not found");
        return r.json();
      })
      .then((data) => {
        if (
          data?.consultationUrl &&
          !isUsableConsultationUrl(data.consultationUrl)
        ) {
          data.consultationId = null;
          data.consultationUrl = null;
          data.consultationStatus = null;
        }

        if (data?.consultationUrl) {
          data.consultationUrl = ensureFullscreenParam(data.consultationUrl);
        }

        // Redirect OLA orders to the OLA consultation page
        const isOlaOrder =
          data?.telehealthProvider === "OLA" ||
          data?.items?.some(
            (item) => item?.product?.telehealthProvider === "OLA",
          );
        if (isOlaOrder) {
          router.replace(
            `/consultation/ola/${encodeURIComponent(String(orderId || ""))}`,
          );
          return;
        }

        setOrder(data);
        setLoading(false);

        try {
          const savedCode = localStorage.getItem(`mdi-otp-${orderId}`);
          if (savedCode) setVerificationCode(savedCode);
        } catch {
          // no-op: localStorage may be unavailable in some browser contexts
        }
      })
      .catch(() => {
        setError("Unable to load order details.");
        setLoading(false);
      });
  }, [orderId, isAuthenticated]);

  useEffect(() => {
    if (
      !order?.id ||
      !order?.consultationUrl ||
      hasTrackedPortalOpenRef.current
    ) {
      return;
    }

    hasTrackedPortalOpenRef.current = true;
    trackAffiliateClientEvent({
      eventType: "PATIENT",
      eventName: "patient_portal_opened",
      orderId: order.id,
      consultationStatus: order.consultationStatus || null,
      mdiWorkflowPhase: order.mdiWorkflowPhase || null,
      metadata: {
        consultationId: order.consultationId || null,
      },
    });
  }, [
    order?.consultationId,
    order?.consultationStatus,
    order?.consultationUrl,
    order?.id,
    order?.mdiWorkflowPhase,
  ]);

  // Auto-create consultation if one doesn't exist yet
  useEffect(() => {
    if (!order || isUsableConsultationUrl(order.consultationUrl) || creating) {
      return;
    }
    if (hasAttemptedCreateRef.current) return;

    hasAttemptedCreateRef.current = true;
    setCreating(true);
    fetch("/api/create-consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          throw new Error(
            data?.error || "Unable to create consultation. Please try again.",
          );
        }
        return data;
      })
      .then((data) => {
        if (data.consultationUrl) {
          const normalizedUrl = ensureFullscreenParam(data.consultationUrl);

          if (data.verificationCode) {
            setVerificationCode(data.verificationCode);
            try {
              localStorage.setItem(`mdi-otp-${orderId}`, data.verificationCode);
            } catch {
              // no-op
            }
          }

          setOrder((prev) => ({
            ...prev,
            consultationId: data.consultationId,
            consultationUrl: normalizedUrl,
            consultationStatus: data.consultationStatus,
          }));
        } else if (data.pendingProviderAuth) {
          setOrder((prev) =>
            prev
              ? {
                  ...prev,
                  consultationId: null,
                  consultationUrl: null,
                  consultationStatus: data.consultationStatus || "pending",
                }
              : prev,
          );
        } else {
          throw new Error(
            data.error || "Unable to create consultation. Please try again.",
          );
        }
        setCreating(false);
      })
      .catch((err) => {
        setError(err.message || "Unable to reach consultation provider.");
        setCreating(false);
      });
  }, [order, orderId, creating]);

  const refreshMessagingAuth = async (incomingCaseId = null) => {
    if (!orderId) return null;

    // Rate-limit provider auth refreshes to avoid rapid loops from iframe events.
    const now = Date.now();
    if (now - lastRefreshRef.current < 4000) return null;
    lastRefreshRef.current = now;

    setRefreshingAuth(true);
    setError(null);

    try {
      const response = await fetch("/api/create-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          refreshAuth: true,
          caseId: incomingCaseId || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.consultationUrl) {
        throw new Error(
          data?.error || "Unable to refresh consultation session",
        );
      }

      const normalizedUrl = ensureFullscreenParam(data.consultationUrl);
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              consultationId: data.consultationId || prev.consultationId,
              consultationUrl: normalizedUrl,
              consultationStatus:
                data.consultationStatus || prev.consultationStatus,
            }
          : prev,
      );

      if (data.verificationCode) {
        setVerificationCode(data.verificationCode);
        try {
          localStorage.setItem(`mdi-otp-${orderId}`, data.verificationCode);
        } catch {
          // no-op
        }
      }

      return data;
    } catch (err) {
      setError(err.message || "Unable to refresh consultation session.");
      return null;
    } finally {
      setRefreshingAuth(false);
    }
  };

  // Handle MD Integrations iframe events and OTP handshake for messaging embeds.
  useEffect(() => {
    if (!order?.consultationUrl) return;

    const frameUrl = ensureFullscreenParam(order.consultationUrl);
    let targetOrigin = "*";
    try {
      targetOrigin = new URL(frameUrl).origin;
    } catch {
      targetOrigin = "*";
    }

    const onMessage = (event) => {
      const data = parseEmbedPayload(event?.data);
      if (!data) return;

      const eventName = data.event || data.message || null;
      if (!eventName) return;

      if (
        eventName === "otp_ready" &&
        iframeRef.current?.contentWindow === event.source
      ) {
        if (verificationCode) {
          const payload = {
            message: "otp",
            data: verificationCode,
          };

          // Tutorial recommends wildcard target to support auth redirects.
          iframeRef.current.contentWindow.postMessage(payload, "*");
          if (targetOrigin !== "*") {
            iframeRef.current.contentWindow.postMessage(payload, targetOrigin);
          }
        } else if (!refreshingAuth) {
          refreshMessagingAuth(data.case_id || data.caseId).then((fresh) => {
            if (
              fresh?.verificationCode &&
              iframeRef.current?.contentWindow === event.source
            ) {
              const payload = {
                message: "otp",
                data: fresh.verificationCode,
              };
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

      if (
        [
          "start",
          "step",
          "finish",
          "encounter_created",
          "patient_created",
          "otp_ready",
        ].includes(eventName)
      ) {
        setEmbedEvent(eventName);
      }

      if (eventName === "finish" || eventName === "encounter_created") {
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                consultationStatus: "completed",
                mdiCaseSnapshot: prev.mdiCaseSnapshot
                  ? {
                      ...prev.mdiCaseSnapshot,
                      status: "completed",
                    }
                  : prev.mdiCaseSnapshot,
              }
            : prev,
        );
      }

      if (["expired", "auth_expired", "session_expired"].includes(eventName)) {
        if (!refreshingAuth) {
          refreshMessagingAuth(data.case_id || data.caseId);
        }
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [order?.consultationUrl, verificationCode, refreshingAuth]);

  if (isLoadingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdf8ff] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#5b3cdd] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <section className="bg-[radial-gradient(circle_at_top_left,#efeaff,transparent_34%),linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] px-4 pb-16 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto max-w-[1340px]">
          <div className="mb-6 rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => router.push("/account")}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#484555] transition-colors hover:text-[#5b3cdd]"
                >
                  <AppIcon name="arrow_back" className="text-[18px]" />
                  Back to Account
                </button>
                <span className="hidden text-gray-300 md:inline">|</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
                    Secure Visit
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <AppIcon
                      name="video_call"
                      className="text-emerald-600 text-[20px]"
                    />
                    <span className="font-headline font-bold text-[#1c1a24]">
                      Doctor Consultation
                    </span>
                  </div>
                </div>
              </div>
              {order ? (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${getPrimaryConsultationBadge(order).className}`}
                >
                  {getPrimaryConsultationBadge(order).label}
                </span>
              ) : null}
              {order &&
              (order?.mdiCaseSnapshot?.status ||
                order?.mdiCaseSnapshot?.phase ||
                order?.mdiWorkflowPhase) &&
              getReviewStageLabel(order) !==
                getPrimaryConsultationBadge(order).label ? (
                <span className="inline-flex items-center justify-center rounded-full bg-[#f1ecf9] px-3 py-1 text-xs font-semibold text-[#5b3cdd]">
                  {getReviewStageLabel(order)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
            {loading || creating ? (
              <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#5b3cdd]/20 border-t-[#5b3cdd]" />
                <p className="text-sm text-[#484555]">
                  {creating
                    ? "Setting up your consultation..."
                    : "Loading consultation..."}
                </p>
              </div>
            ) : error ? (
              <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4">
                <AppIcon name="error" className="text-5xl text-red-400" />
                <p className="max-w-md text-center text-sm text-[#484555]">
                  {error}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      hasAttemptedCreateRef.current = false;
                      setError(null);
                      setLoading(true);
                      fetch(`/api/orders/${orderId}`)
                        .then((r) => {
                          if (!r.ok) throw new Error("Order not found");
                          return r.json();
                        })
                        .then((data) => {
                          if (
                            data?.consultationUrl &&
                            !isUsableConsultationUrl(data.consultationUrl)
                          ) {
                            data.consultationId = null;
                            data.consultationUrl = null;
                            data.consultationStatus = null;
                          }

                          if (data?.consultationUrl) {
                            data.consultationUrl = ensureFullscreenParam(
                              data.consultationUrl,
                            );
                          }
                          setOrder(data);
                          setLoading(false);
                        })
                        .catch(() => {
                          setError("Unable to load order details.");
                          setLoading(false);
                        });
                    }}
                    className="rounded-full bg-[#5b3cdd] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a2fc7]"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => router.push("/account")}
                    className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-50"
                  >
                    Back to Account
                  </button>
                </div>
              </div>
            ) : isUsableConsultationUrl(order?.consultationUrl) ? (
              <iframe
                ref={iframeRef}
                src={ensureFullscreenParam(order.consultationUrl)}
                className="w-full border-0"
                style={{ minHeight: "calc(100vh - 220px)" }}
                title="Secure HealSend consultation"
                allow="camera; microphone; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
              />
            ) : (
              <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4">
                <AppIcon name="pending" className="text-5xl text-gray-300" />
                <p className="text-sm text-[#484555]">
                  Waiting for consultation to be ready...
                </p>
              </div>
            )}

            {showEmbedDebug && embedEvent && (
              <div className="border-t border-gray-200 bg-white px-4 py-2 text-xs text-[#6a6578]">
                Session event: {embedEvent.replaceAll("_", " ")}
              </div>
            )}
            {refreshingAuth && (
              <div className="border-t border-gray-200 bg-[#f6f8ff] px-4 py-2 text-xs text-[#4b4f63]">
                Refreshing secure doctor chat session...
              </div>
            )}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
