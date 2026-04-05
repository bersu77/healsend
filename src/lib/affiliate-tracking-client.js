"use client";

export async function trackAffiliateClientEvent(payload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const body = {
    path: `${window.location.pathname}${window.location.search}`,
    fullUrl: window.location.href,
    referrer: document.referrer || "",
    ...payload,
  };

  try {
    await fetch("/api/affiliate/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      keepalive: true,
      body: JSON.stringify(body),
    });
  } catch {
    // Tracking should never block the user experience.
  }
}
