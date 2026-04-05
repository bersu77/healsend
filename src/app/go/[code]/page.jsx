import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  resolveAffiliateLinkByCode,
  createOrRefreshReferral,
  REFERRAL_COOKIE_NAME,
  REFERRAL_COOKIE_TTL,
} from "@/lib/affiliate-service";

/**
 * /go/[code]  — Masked affiliate link redirect.
 *
 * What this page does (all server-side, before the browser sees anything):
 *  1. Resolve the affiliate code to an active AffiliateLink in the DB.
 *  2. Set the hs_ref cookie (first-touch — won't overwrite an existing one).
 *  3. Increment AffiliateLink.clickCount and create/refresh a Referral row.
 *  4. 307-redirect to the link's destinationPath (default "/").
 *
 * The URL format is  /go/<code>  — e.g. /go/alice2026
 * which hides the destination and the tracking mechanism from the visitor.
 *
 * Because this is a Next.js Server Component, it runs Node.js (not Edge),
 * so Prisma is available directly.
 */
export default async function AffiliateLinkRedirect({ params }) {
  const code = String(params?.code || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 64);

  // Default fallback destination
  let destination = "/";

  if (code) {
    try {
      const link = await resolveAffiliateLinkByCode(code);

      if (link) {
        destination = String(link.destinationPath || "/");

        // ── Set hs_ref cookie (first-touch attribution) ──────────────────────
        const cookieStore = await cookies();
        const existing = cookieStore.get(REFERRAL_COOKIE_NAME)?.value;
        if (!existing) {
          cookieStore.set(REFERRAL_COOKIE_NAME, code, {
            path: "/",
            maxAge: REFERRAL_COOKIE_TTL,
            sameSite: "lax",
            httpOnly: false, // readable by client-side JS for checkout attribution
            secure: process.env.NODE_ENV === "production",
          });
        }

        // ── Record click ─────────────────────────────────────────────────────
        const headerStore = await headers();
        const ip =
          headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          headerStore.get("x-real-ip") ||
          "";
        const userAgent = headerStore.get("user-agent") || "";

        const referrerId = link.application?.userId ?? null;

        if (referrerId) {
          // Full referral tracking — creates Referral row and increments clickCount
          await createOrRefreshReferral({
            linkId: link.id,
            referrerId,
            ip,
            userAgent,
          }).catch(() => {});
        } else {
          // No affiliate user yet — just count the raw click
          await prisma.affiliateLink
            .update({
              where: { id: link.id },
              data: { clickCount: { increment: 1 } },
            })
            .catch(() => {});
        }
      }
    } catch {
      // Never crash the redirect — fall back to home silently
    }
  }

  // Ensure destination is a relative path (no open-redirect)
  if (!destination.startsWith("/")) {
    destination = "/";
  }

  redirect(destination);
}

export const dynamic = "force-dynamic";
