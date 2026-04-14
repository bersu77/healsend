"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";
import { buildLoginPath } from "@/lib/auth-routing";
import AppIcon from "@/components/ui/AppIcon";

function formatStatusLabel(value, fallback = "Pending") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getOlaStatusBadge(status) {
  const s = String(status || "").toLowerCase();
  if (s === "completed" || s === "approved")
    return {
      label: formatStatusLabel(status),
      cls: "bg-emerald-100 text-emerald-700",
    };
  if (s === "in_progress" || s === "active" || s === "scheduled")
    return {
      label: formatStatusLabel(status),
      cls: "bg-blue-100 text-blue-700",
    };
  if (s === "cancelled" || s === "rejected")
    return { label: formatStatusLabel(status), cls: "bg-red-100 text-red-700" };
  return {
    label: formatStatusLabel(status, "Pending"),
    cls: "bg-amber-100 text-amber-700",
  };
}

function getOlaStepStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "completed" || s === "approved") return 3;
  if (s === "in_progress" || s === "active" || s === "scheduled") return 2;
  if (s === "submitted" || s === "pending") return 1;
  return 0;
}

const STEPS = [
  { label: "Appointment Requested", icon: "event_note" },
  { label: "Provider Review", icon: "medical_services" },
  { label: "Consultation", icon: "video_call" },
  { label: "Care Plan Ready", icon: "check_circle" },
];

export default function OlaConsultationPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { user, isLoadingAuth, isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [olaData, setOlaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.push(
        buildLoginPath(
          `/consultation/ola/${encodeURIComponent(String(orderId || ""))}`,
        ),
      );
    }
  }, [isLoadingAuth, isAuthenticated, orderId, router]);

  // Load order
  useEffect(() => {
    if (!orderId || !isAuthenticated) return;
    fetch(`/api/orders/${orderId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Order not found");
        return r.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load order details.");
        setLoading(false);
      });
  }, [orderId, isAuthenticated]);

  // Auto-create OLA consultation if not yet submitted
  useEffect(() => {
    if (!order || order.olaOrderGuid || creating || error) return;
    setCreating(true);

    fetch("/api/ola/create-consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok)
          throw new Error(data?.error || "Failed to create OLA consultation.");
        return data;
      })
      .then((data) => {
        setOlaData(data);
        setOrder((prev) => ({
          ...prev,
          olaOrderGuid: data.olaOrderGuid,
          olaStatus: data.olaStatus,
          olaRedirectUrl: data.olaRedirectUrl,
        }));
        setCreating(false);
      })
      .catch((err) => {
        setError(err.message);
        setCreating(false);
      });
  }, [order, creating, orderId, error]);

  // Refresh status for existing OLA orders
  const refreshStatus = useCallback(async () => {
    if (!order?.olaOrderGuid) return;
    setPolling(true);
    try {
      const r = await fetch(`/api/ola/order-status/${order.olaOrderGuid}`);
      const data = await r.json();
      if (r.ok) {
        setOlaData(data);
        setOrder((prev) => ({
          ...prev,
          olaStatus: data.olaStatus,
          olaRedirectUrl: data.olaRedirectUrl,
        }));
      }
    } catch {
      // silent fail for polling
    } finally {
      setPolling(false);
    }
  }, [order?.olaOrderGuid]);

  useEffect(() => {
    if (!order?.olaOrderGuid) return;
    refreshStatus();
    const interval = setInterval(refreshStatus, 30000);
    return () => clearInterval(interval);
  }, [order?.olaOrderGuid, refreshStatus]);

  if (isLoadingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdf8ff] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#5b3cdd] border-t-transparent rounded-full" />
      </div>
    );
  }

  const stepIndex = getOlaStepStatus(order?.olaStatus);
  const badge = getOlaStatusBadge(order?.olaStatus);

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <section className="bg-[radial-gradient(circle_at_top_left,#efeaff,transparent_34%),linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] px-4 pb-16 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto max-w-[1340px]">
          {/* Header Card */}
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
                    OLA Telehealth
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <AppIcon
                      name="health_and_safety"
                      className="text-emerald-600 text-[20px]"
                    />
                    <span className="font-headline font-bold text-[#1c1a24]">
                      Doctor Consultation
                    </span>
                  </div>
                </div>
              </div>
              {order && (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${badge.cls}`}
                >
                  {badge.label}
                </span>
              )}
            </div>
          </div>

          {/* Progress Steps */}
          {order?.olaOrderGuid && (
            <div className="mb-6 rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm md:p-8">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold text-[#1c1a24]">
                  Consultation Progress
                </p>
                <button
                  onClick={refreshStatus}
                  disabled={polling}
                  className="text-xs font-semibold text-[#5b3cdd] hover:text-[#4a2fc7] transition-colors disabled:opacity-40"
                >
                  {polling ? "Refreshing..." : "Refresh Status"}
                </button>
              </div>
              <div className="flex items-center gap-0">
                {STEPS.map((step, i) => {
                  const isComplete = i < stepIndex;
                  const isCurrent = i === stepIndex;
                  return (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center text-center min-w-[80px]">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isComplete
                              ? "bg-emerald-500 text-white"
                              : isCurrent
                                ? "bg-[#5b3cdd] text-white ring-4 ring-[#5b3cdd]/20"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <AppIcon
                            name={isComplete ? "check" : step.icon}
                            className="text-[20px]"
                          />
                        </div>
                        <p
                          className={`mt-2 text-xs font-semibold ${
                            isComplete || isCurrent
                              ? "text-[#1c1a24]"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mt-[-1.5rem] ${
                            i < stepIndex ? "bg-emerald-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info Cards */}
          {order && (
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b75f0]">
                  Appointment
                </p>
                <p className="mt-2 text-sm font-semibold text-[#1c1a24]">
                  {order.olaOrderGuid
                    ? formatStatusLabel(order.olaStatus, "Processing")
                    : "Creating appointment..."}
                </p>
                <p className="mt-1 text-xs text-[#797587]">
                  {order.olaOrderGuid
                    ? "Your telehealth appointment has been submitted to OLA Portal."
                    : "We're setting up your appointment now."}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b75f0]">
                  Provider Status
                </p>
                <p className="mt-2 text-sm font-semibold text-[#1c1a24]">
                  {olaData?.orderDetails?.provider_name ||
                    "Awaiting assignment"}
                </p>
                <p className="mt-1 text-xs text-[#797587]">
                  {olaData?.orderDetails?.provider_name
                    ? "A licensed provider has been assigned to your consultation."
                    : "A provider will be assigned once your request is reviewed."}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b75f0]">
                  Next Steps
                </p>
                <p className="mt-2 text-sm font-semibold text-[#1c1a24]">
                  {order.olaRedirectUrl
                    ? "Continue on Portal"
                    : "Waiting for Review"}
                </p>
                <p className="mt-1 text-xs text-[#797587]">
                  {order.olaRedirectUrl
                    ? "Click below to continue your consultation on the OLA portal."
                    : "You'll receive next steps once your appointment is reviewed."}
                </p>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
            {loading || creating ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#5b3cdd]/20 border-t-[#5b3cdd]" />
                <p className="text-sm text-[#484555]">
                  {creating
                    ? "Setting up your OLA consultation..."
                    : "Loading consultation..."}
                </p>
              </div>
            ) : error ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
                <AppIcon name="error" className="text-5xl text-red-400" />
                <p className="max-w-md text-center text-sm text-[#484555]">
                  {error}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setError(null);
                      setCreating(false);
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
            ) : order?.olaRedirectUrl ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4">
                <div className="w-16 h-16 rounded-full bg-[#5b3cdd]/10 flex items-center justify-center">
                  <AppIcon
                    name="health_and_safety"
                    className="text-[32px] text-[#5b3cdd]"
                  />
                </div>
                <div className="text-center max-w-md">
                  <h2 className="font-headline text-xl font-bold text-[#1c1a24]">
                    Your Consultation is Ready
                  </h2>
                  <p className="mt-2 text-sm text-[#797587]">
                    Continue to the OLA Portal to complete your telehealth
                    consultation with a licensed provider.
                  </p>
                </div>
                <a
                  href={order.olaRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hs-gradient-btn inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold"
                >
                  <AppIcon name="open_in_new" className="text-[18px]" />
                  Open OLA Portal
                </a>
                <p className="text-xs text-[#797587]">Opens in a new tab</p>
              </div>
            ) : order?.olaOrderGuid ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                  <AppIcon
                    name="schedule"
                    className="text-[32px] text-amber-500"
                  />
                </div>
                <div className="text-center max-w-md">
                  <h2 className="font-headline text-xl font-bold text-[#1c1a24]">
                    Appointment Submitted
                  </h2>
                  <p className="mt-2 text-sm text-[#797587]">
                    Your appointment request has been submitted. We'll update
                    this page once your provider review is complete and your
                    consultation link is ready.
                  </p>
                </div>
                <button
                  onClick={refreshStatus}
                  disabled={polling}
                  className="rounded-full border border-[#5b3cdd] px-6 py-2.5 text-sm font-semibold text-[#5b3cdd] transition-colors hover:bg-[#5b3cdd] hover:text-white disabled:opacity-40"
                >
                  {polling ? "Checking..." : "Check for Updates"}
                </button>
              </div>
            ) : (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
                <AppIcon name="pending" className="text-5xl text-gray-300" />
                <p className="text-sm text-[#484555]">
                  Preparing your consultation...
                </p>
              </div>
            )}
          </div>

          {/* Order Details */}
          {olaData?.serviceDetails && (
            <div className="mt-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#1c1a24] mb-4">
                Service Details
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {olaData.serviceDetails.service_name && (
                  <div>
                    <p className="text-xs text-[#797587]">Service</p>
                    <p className="text-sm font-medium text-[#1c1a24]">
                      {olaData.serviceDetails.service_name}
                    </p>
                  </div>
                )}
                {olaData.serviceDetails.session_type && (
                  <div>
                    <p className="text-xs text-[#797587]">Session Type</p>
                    <p className="text-sm font-medium text-[#1c1a24]">
                      {olaData.serviceDetails.session_type}
                    </p>
                  </div>
                )}
                {olaData.serviceDetails.scheduled_date && (
                  <div>
                    <p className="text-xs text-[#797587]">Scheduled Date</p>
                    <p className="text-sm font-medium text-[#1c1a24]">
                      {new Date(
                        olaData.serviceDetails.scheduled_date,
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {olaData.serviceDetails.provider_name && (
                  <div>
                    <p className="text-xs text-[#797587]">Provider</p>
                    <p className="text-sm font-medium text-[#1c1a24]">
                      {olaData.serviceDetails.provider_name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
