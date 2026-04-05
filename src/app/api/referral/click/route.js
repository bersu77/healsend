import { prisma } from "@/lib/prisma";
import {
  resolveAffiliateLinkByCode,
  createOrRefreshReferral,
} from "@/lib/affiliate-service";
import { NextResponse } from "next/server";

/**
 * POST /api/referral/click
 *
 * Lightweight endpoint called by the /go/[code] redirect page immediately
 * before forwarding the visitor. Increments AffiliateLink.clickCount and
 * creates/refreshes a Referral row. Designed to be called with no-cors
 * fetch or from a server component — does NOT require authentication.
 *
 * Body: { code: string }
 * Returns: { ok: true, destination: string, referralId?: string }
 */
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = String(body.code || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  if (!code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  const link = await resolveAffiliateLinkByCode(code);
  if (!link) {
    return NextResponse.json(
      { error: "Unknown or inactive referral code", destination: "/" },
      { status: 404 },
    );
  }

  const destination = String(link.destinationPath || "/");

  // Resolve affiliate userId from linked application
  const referrerId = link.application?.userId ?? null;

  if (referrerId) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const userAgent = request.headers.get("user-agent") || "";

    try {
      const referral = await createOrRefreshReferral({
        linkId: link.id,
        referrerId,
        ip,
        userAgent,
      });
      return NextResponse.json({
        ok: true,
        destination,
        referralId: referral.id,
      });
    } catch {
      // Tracking failed — still return the destination so the redirect works
      return NextResponse.json({ ok: true, destination });
    }
  }

  // No affiliate user linked yet — just increment the click count
  await prisma.affiliateLink
    .update({ where: { id: link.id }, data: { clickCount: { increment: 1 } } })
    .catch(() => {});

  return NextResponse.json({ ok: true, destination });
}

/**
 * GET /api/referral/click?code=... — same logic, for use from the Edge page component.
 */
export async function GET(request) {
  const code = new URL(request.url).searchParams.get("code") || "";
  return POST(
    new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify({ code }),
    }),
  );
}
