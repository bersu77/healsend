import { NextResponse } from "next/server";
import {
  createOrRefreshReferral,
  resolveAffiliateLinkByCode,
  REFERRAL_COOKIE_NAME,
  REFERRAL_COOKIE_TTL,
} from "@/lib/affiliate-service";

/**
 * POST /api/referral/track
 *
 * Called when a visitor lands on the site via an affiliate link.
 * Creates or refreshes a Referral row and sets the hs_ref cookie.
 *
 * Body: { code: string }
 * The code is also accepted from the existing hs_ref cookie (idempotent).
 */
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Accept code from body or fallback to existing cookie
  const code =
    String(body.code || "").trim() ||
    request.cookies.get(REFERRAL_COOKIE_NAME)?.value ||
    "";

  if (!code) {
    return NextResponse.json(
      { error: "Referral code required" },
      { status: 400 },
    );
  }

  const link = await resolveAffiliateLinkByCode(code);
  if (!link) {
    return NextResponse.json(
      { error: "Invalid or inactive referral code" },
      { status: 404 },
    );
  }

  // Determine affiliate userId (from linked application)
  const referrerId = link.application?.userId;
  if (!referrerId) {
    // Link exists but has no assigned affiliate user — still track click, skip Referral row
    return NextResponse.json({ ok: true, tracked: false });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";
  const userAgent = request.headers.get("user-agent") || "";

  const referral = await createOrRefreshReferral({
    linkId: link.id,
    referrerId,
    ip,
    userAgent,
  });

  const response = NextResponse.json({
    ok: true,
    tracked: true,
    referralId: referral.id,
  });

  // Persist the referral cookie (first-touch: don't overwrite existing)
  const existing = request.cookies.get(REFERRAL_COOKIE_NAME)?.value;
  if (!existing) {
    response.cookies.set(REFERRAL_COOKIE_NAME, code, {
      path: "/",
      maxAge: REFERRAL_COOKIE_TTL,
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}
