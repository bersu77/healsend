import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  AFFILIATE_COOKIE_MAX_AGE,
  AFFILIATE_COOKIE_NAMES,
  buildTrackingContextFromRequest,
  hasAffiliateTouch,
  recordAffiliateEvent,
} from "@/lib/affiliate-tracking";

export async function POST(request) {
  let body = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const eventType = String(body.eventType || "").trim().toUpperCase();
  const eventName = String(body.eventName || "").trim();

  if (!eventType || !eventName) {
    return NextResponse.json(
      { error: "eventType and eventName are required" },
      { status: 400 },
    );
  }

  const trackingContext = buildTrackingContextFromRequest(request, body);
  const user = await getCurrentUser().catch(() => null);

  await recordAffiliateEvent({
    ...trackingContext,
    userId: user?.id || null,
    eventType,
    eventName,
    funnelSlug: body.funnelSlug || null,
    funnelStep:
      Number.isFinite(Number(body.funnelStep)) && body.funnelStep !== null
        ? Number(body.funnelStep)
        : null,
    funnelStepLabel: body.funnelStepLabel || null,
    orderId: body.orderId || null,
    subscriptionId: body.subscriptionId || null,
    paymentIntentId: body.paymentIntentId || null,
    stripeSessionId: body.stripeSessionId || null,
    paymentStatus: body.paymentStatus || null,
    consultationStatus: body.consultationStatus || null,
    mdiWorkflowPhase: body.mdiWorkflowPhase || null,
    metadata: body.metadata || null,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AFFILIATE_COOKIE_NAMES.visitorId, trackingContext.visitorId, {
    path: "/",
    maxAge: AFFILIATE_COOKIE_MAX_AGE.visitorId,
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });
  response.cookies.set(AFFILIATE_COOKIE_NAMES.sessionKey, trackingContext.sessionKey, {
    path: "/",
    maxAge: AFFILIATE_COOKIE_MAX_AGE.sessionKey,
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });

  if (hasAffiliateTouch(trackingContext.touch) || trackingContext.touch?.referrer) {
    response.cookies.set(
      AFFILIATE_COOKIE_NAMES.touch,
      JSON.stringify(trackingContext.touch),
      {
        path: "/",
        maxAge: AFFILIATE_COOKIE_MAX_AGE.touch,
        sameSite: "lax",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      },
    );
  }

  return response;
}
