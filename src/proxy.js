/**
 * middleware.js
 *
 * Edge middleware — runs before every matched request.
 *
 * Responsibilities:
 *  1. Detect ?ref=CODE (or ?aff=CODE) query parameters and persist a
 *     short-lived referral cookie (hs_ref) so the signup flow can
 *     attribute the new user to the correct affiliate.
 *  2. Pass all other requests through unchanged.
 *
 * The cookie value is the raw affiliate code (not a secret — codes are
 * public links). Validation happens server-side in the API layer when
 * the referral is converted.
 */

import { NextResponse } from "next/server";
import {
  REFERRAL_COOKIE_NAME,
  REFERRAL_COOKIE_TTL,
} from "@/lib/affiliate-service";

/** Query param names we watch for referral codes. */
const REF_PARAMS = ["ref", "aff", "affiliate"];

/** Routes that should never trigger referral cookie logic. */
const SKIP_PREFIXES = ["/api/", "/_next/", "/fonts/", "/images/", "/uploads/"];

export function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip static assets and API routes
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Look for a referral code in the query string
  let refCode = null;
  for (const param of REF_PARAMS) {
    const value = searchParams.get(param);
    if (value?.trim()) {
      refCode = value.trim().toLowerCase();
      break;
    }
  }

  if (!refCode) {
    // No ref param — pass through without touching cookies
    return NextResponse.next();
  }

  // Sanitise: only allow alphanumeric, hyphens, underscores (max 64 chars)
  const sanitised = refCode.replace(/[^a-z0-9_-]/g, "").slice(0, 64);
  if (!sanitised) return NextResponse.next();

  const response = NextResponse.next();

  // Only set the cookie if: no existing cookie, OR a different code is present
  // (first-touch attribution — existing cookie wins)
  const existing = request.cookies.get(REFERRAL_COOKIE_NAME)?.value;
  if (!existing) {
    response.cookies.set(REFERRAL_COOKIE_NAME, sanitised, {
      path: "/",
      maxAge: REFERRAL_COOKIE_TTL,
      sameSite: "lax",
      httpOnly: false, // readable client-side for tracking pixels
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  // Match all routes except Next.js internals, static files, and API routes
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.json).*)",
  ],
};
