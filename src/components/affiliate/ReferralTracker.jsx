"use client";

import { useEffect } from "react";

/**
 * ReferralTracker — mounts on every page.
 * Reads the hs_ref cookie set by middleware (when ?ref= param was in the URL)
 * and fires POST /api/referral/track once per session per code,
 * which increments AffiliateLink.clickCount and creates a Referral row.
 */
export default function ReferralTracker() {
  useEffect(() => {
    const code = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hs_ref="))
      ?.split("=")[1];

    if (!code) return;

    // Deduplicate: only track once per session per code
    const sessionKey = `hs_tracked_${code}`;
    if (sessionStorage.getItem(sessionKey)) return;

    fetch("/api/referral/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((r) => r.json())
      .then((data) => {
        sessionStorage.setItem(sessionKey, "1");
        if (data.referralId) {
          sessionStorage.setItem("hs_referral_id", String(data.referralId));
        }
      })
      .catch(() => {
        // Silently ignore — never block the page
      });
  }, []);

  return null;
}
