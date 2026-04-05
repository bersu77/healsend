import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const AFFILIATE_COOKIE_NAMES = Object.freeze({
  visitorId: "hs_affiliate_vid",
  sessionKey: "hs_affiliate_sid",
  touch: "hs_affiliate_touch",
});

export const AFFILIATE_COOKIE_MAX_AGE = Object.freeze({
  visitorId: 60 * 60 * 24 * 90,
  sessionKey: 60 * 30,
  touch: 60 * 60 * 24 * 90,
});

const AFFILIATE_QUERY_KEYS = Object.freeze({
  source: ["utm_source", "source"],
  medium: ["utm_medium", "medium"],
  campaign: ["utm_campaign", "campaign"],
  term: ["utm_term", "term"],
  content: ["utm_content", "content"],
  affiliateId: ["aff", "affiliate", "affiliate_id", "ref", "referrer_id"],
});

function getFirstQueryValue(searchParams, keys = []) {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) {
      return value.trim();
    }
  }

  return null;
}

export function parseAffiliateTouch(rawUrl, referrer = "") {
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(rawUrl, "https://healsend.local");
    const searchParams = url.searchParams;
    const touch = {
      affiliateSource: getFirstQueryValue(searchParams, AFFILIATE_QUERY_KEYS.source),
      affiliateMedium: getFirstQueryValue(searchParams, AFFILIATE_QUERY_KEYS.medium),
      affiliateCampaign: getFirstQueryValue(searchParams, AFFILIATE_QUERY_KEYS.campaign),
      affiliateTerm: getFirstQueryValue(searchParams, AFFILIATE_QUERY_KEYS.term),
      affiliateContent: getFirstQueryValue(searchParams, AFFILIATE_QUERY_KEYS.content),
      affiliateId: getFirstQueryValue(searchParams, AFFILIATE_QUERY_KEYS.affiliateId),
      landingPath: `${url.pathname}${url.search}`,
      landingUrl: url.toString(),
      referrer: referrer || "",
    };

    if (!hasAffiliateTouch(touch) && !touch.referrer) {
      return null;
    }

    return touch;
  } catch {
    return null;
  }
}

export function parseAffiliateTouchCookie(raw) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function hasAffiliateTouch(touch) {
  if (!touch) {
    return false;
  }

  return Boolean(
    touch.affiliateSource ||
      touch.affiliateMedium ||
      touch.affiliateCampaign ||
      touch.affiliateTerm ||
      touch.affiliateContent ||
      touch.affiliateId,
  );
}

export function mergeAffiliateTouch(primaryTouch, fallbackTouch = null) {
  if (!primaryTouch && !fallbackTouch) {
    return null;
  }

  return {
    affiliateSource:
      primaryTouch?.affiliateSource || fallbackTouch?.affiliateSource || null,
    affiliateMedium:
      primaryTouch?.affiliateMedium || fallbackTouch?.affiliateMedium || null,
    affiliateCampaign:
      primaryTouch?.affiliateCampaign || fallbackTouch?.affiliateCampaign || null,
    affiliateTerm:
      primaryTouch?.affiliateTerm || fallbackTouch?.affiliateTerm || null,
    affiliateContent:
      primaryTouch?.affiliateContent || fallbackTouch?.affiliateContent || null,
    affiliateId: primaryTouch?.affiliateId || fallbackTouch?.affiliateId || null,
    landingPath: primaryTouch?.landingPath || fallbackTouch?.landingPath || null,
    landingUrl: primaryTouch?.landingUrl || fallbackTouch?.landingUrl || null,
    referrer: primaryTouch?.referrer || fallbackTouch?.referrer || null,
  };
}

export function shouldRotateAffiliateSession(nextTouch, currentTouch = null) {
  if (!hasAffiliateTouch(nextTouch)) {
    return false;
  }

  if (!currentTouch || !hasAffiliateTouch(currentTouch)) {
    return true;
  }

  return [
    "affiliateSource",
    "affiliateMedium",
    "affiliateCampaign",
    "affiliateId",
  ].some((key) => (nextTouch?.[key] || null) !== (currentTouch?.[key] || null));
}

function getHeaderValue(headers, key) {
  if (!headers) {
    return "";
  }

  if (typeof headers.get === "function") {
    return headers.get(key) || "";
  }

  return headers[key] || headers[key.toLowerCase()] || "";
}

function getClientIp(headers) {
  const forwardedFor = getHeaderValue(headers, "x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "";
  }

  return getHeaderValue(headers, "x-real-ip") || "";
}

async function upsertAffiliateSession({
  sessionKey,
  visitorId,
  userId,
  touch,
  path,
  fullUrl,
  referrer,
  userAgent,
  ipAddress,
}) {
  const existing = await prisma.affiliateSession.findUnique({
    where: { sessionKey },
  });

  const sessionData = {
    visitorId,
    userId: userId || existing?.userId || null,
    affiliateSource:
      existing?.affiliateSource || touch?.affiliateSource || null,
    affiliateMedium:
      existing?.affiliateMedium || touch?.affiliateMedium || null,
    affiliateCampaign:
      existing?.affiliateCampaign || touch?.affiliateCampaign || null,
    affiliateTerm: existing?.affiliateTerm || touch?.affiliateTerm || null,
    affiliateContent:
      existing?.affiliateContent || touch?.affiliateContent || null,
    affiliateId: existing?.affiliateId || touch?.affiliateId || null,
    landingPath: existing?.landingPath || touch?.landingPath || path || null,
    landingUrl: existing?.landingUrl || touch?.landingUrl || fullUrl || null,
    referrer: existing?.referrer || touch?.referrer || referrer || null,
    userAgent: existing?.userAgent || userAgent || null,
    ipAddress: existing?.ipAddress || ipAddress || null,
    lastSeenAt: new Date(),
  };

  if (existing) {
    return prisma.affiliateSession.update({
      where: { id: existing.id },
      data: sessionData,
    });
  }

  return prisma.affiliateSession.create({
    data: {
      sessionKey,
      startedAt: new Date(),
      ...sessionData,
    },
  });
}

async function resolveAffiliateSession({ sessionKey, userId }) {
  if (sessionKey) {
    const session = await prisma.affiliateSession.findUnique({
      where: { sessionKey },
    });
    if (session) {
      return session;
    }
  }

  if (!userId) {
    return null;
  }

  return prisma.affiliateSession.findFirst({
    where: { userId },
    orderBy: { lastSeenAt: "desc" },
  });
}

export async function recordAffiliateEvent({
  sessionKey,
  visitorId,
  userId,
  eventType,
  eventName,
  path,
  fullUrl,
  referrer,
  funnelSlug,
  funnelStep,
  funnelStepLabel,
  orderId,
  subscriptionId,
  paymentIntentId,
  stripeSessionId,
  paymentStatus,
  consultationStatus,
  mdiWorkflowPhase,
  metadata,
  touch,
  userAgent,
  ipAddress,
}) {
  if (!eventType || !eventName) {
    return null;
  }

  let session = null;

  if (sessionKey && visitorId) {
    session = await upsertAffiliateSession({
      sessionKey,
      visitorId,
      userId,
      touch,
      path,
      fullUrl,
      referrer,
      userAgent,
      ipAddress,
    });
  } else {
    session = await resolveAffiliateSession({ sessionKey, userId });
  }

  return prisma.affiliateEvent.create({
    data: {
      sessionId: session?.id || null,
      userId: userId || session?.userId || null,
      orderId: orderId || null,
      subscriptionId: subscriptionId || null,
      eventType,
      eventName,
      path: path || null,
      fullUrl: fullUrl || null,
      referrer: referrer || session?.referrer || null,
      funnelSlug: funnelSlug || null,
      funnelStep: Number.isFinite(funnelStep) ? funnelStep : null,
      funnelStepLabel: funnelStepLabel || null,
      paymentIntentId: paymentIntentId || null,
      stripeSessionId: stripeSessionId || null,
      paymentStatus: paymentStatus || null,
      consultationStatus: consultationStatus || null,
      mdiWorkflowPhase: mdiWorkflowPhase || null,
      metadata: metadata || null,
      occurredAt: new Date(),
    },
  });
}

export async function recordAffiliateServerEvent({
  userId,
  eventType,
  eventName,
  path,
  fullUrl,
  referrer,
  funnelSlug,
  funnelStep,
  funnelStepLabel,
  orderId,
  subscriptionId,
  paymentIntentId,
  stripeSessionId,
  paymentStatus,
  consultationStatus,
  mdiWorkflowPhase,
  metadata,
  sessionKey,
}) {
  try {
    return await recordAffiliateEvent({
      userId,
      sessionKey,
      visitorId: null,
      eventType,
      eventName,
      path,
      fullUrl,
      referrer,
      funnelSlug,
      funnelStep,
      funnelStepLabel,
      orderId,
      subscriptionId,
      paymentIntentId,
      stripeSessionId,
      paymentStatus,
      consultationStatus,
      mdiWorkflowPhase,
      metadata,
    });
  } catch (error) {
    console.error("[affiliate-tracking] Failed to record server event", {
      eventType,
      eventName,
      userId,
      orderId,
      subscriptionId,
      message: error?.message || "Unknown error",
    });
    return null;
  }
}

export function buildTrackingContextFromRequest(request, body = {}) {
  const visitorId =
    request.cookies.get(AFFILIATE_COOKIE_NAMES.visitorId)?.value ||
    randomUUID();
  const currentSessionKey =
    request.cookies.get(AFFILIATE_COOKIE_NAMES.sessionKey)?.value || "";
  const currentTouch = parseAffiliateTouchCookie(
    request.cookies.get(AFFILIATE_COOKIE_NAMES.touch)?.value,
  );
  const referrer =
    String(body.referrer || "").trim() ||
    getHeaderValue(request.headers, "referer") ||
    "";
  const fullUrl = String(body.fullUrl || body.url || "").trim();
  const path = String(body.path || "").trim() || null;
  const requestTouch = parseAffiliateTouch(fullUrl, referrer);
  const mergedTouch = mergeAffiliateTouch(requestTouch, currentTouch);
  const shouldRotate = shouldRotateAffiliateSession(requestTouch, currentTouch);
  const sessionKey = shouldRotate || !currentSessionKey
    ? randomUUID()
    : currentSessionKey;

  return {
    visitorId,
    sessionKey,
    touch: mergedTouch,
    path,
    fullUrl: fullUrl || mergedTouch?.landingUrl || null,
    referrer,
    userAgent: getHeaderValue(request.headers, "user-agent") || "",
    ipAddress: getClientIp(request.headers) || "",
  };
}

function countBy(items, getKey) {
  const counts = new Map();
  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count);
}

function getAffiliateSourceLabel(record) {
  const parts = [
    record?.affiliateSource,
    record?.affiliateMedium,
    record?.affiliateCampaign,
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" / ");
  }

  if (record?.affiliateId) {
    return `Affiliate ID: ${record.affiliateId}`;
  }

  if (record?.referrer) {
    return "Referral / direct";
  }

  return "Unknown source";
}

function buildJourneyKey(event, fallback) {
  return (
    event?.orderId ||
    event?.subscriptionId ||
    event?.userId ||
    event?.sessionId ||
    fallback ||
    null
  );
}

export async function buildAffiliateDashboardSummary(windowDays = 30) {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const [sessions, events] = await Promise.all([
    prisma.affiliateSession.findMany({
      where: { startedAt: { gte: since } },
      orderBy: { startedAt: "desc" },
      select: {
        id: true,
        visitorId: true,
        userId: true,
        affiliateSource: true,
        affiliateMedium: true,
        affiliateCampaign: true,
        affiliateId: true,
        landingPath: true,
        referrer: true,
        startedAt: true,
        lastSeenAt: true,
      },
    }),
    prisma.affiliateEvent.findMany({
      where: { occurredAt: { gte: since } },
      orderBy: { occurredAt: "desc" },
      select: {
        id: true,
        sessionId: true,
        userId: true,
        orderId: true,
        subscriptionId: true,
        eventType: true,
        eventName: true,
        path: true,
        funnelSlug: true,
        funnelStep: true,
        funnelStepLabel: true,
        paymentStatus: true,
        consultationStatus: true,
        mdiWorkflowPhase: true,
        occurredAt: true,
        metadata: true,
        session: {
          select: {
            id: true,
            visitorId: true,
            affiliateSource: true,
            affiliateMedium: true,
            affiliateCampaign: true,
            affiliateId: true,
            referrer: true,
          },
        },
        order: {
          select: {
            id: true,
            total: true,
          },
        },
      },
    }),
  ]);

  const pageViews = events.filter((event) => event.eventName === "page_view");
  const funnelEvents = events.filter((event) => event.eventType === "FUNNEL");
  const paymentEvents = events.filter((event) => event.eventType === "PAYMENT");
  const patientEvents = events.filter((event) => event.eventType === "PATIENT");
  const uniqueVisitors = new Set(sessions.map((session) => session.visitorId)).size;
  const affiliateSessions = sessions.filter(
    (session) =>
      session.affiliateSource || session.affiliateCampaign || session.affiliateId,
  );

  const paymentCounts = countBy(paymentEvents, (event) => event.eventName).slice(0, 8);
  const patientJourney = countBy(patientEvents, (event) => event.eventName).slice(0, 8);
  const topSources = countBy(
    affiliateSessions,
    (session) => getAffiliateSourceLabel(session),
  ).slice(0, 8);
  const topLandingPages = countBy(sessions, (session) => session.landingPath).slice(0, 8);
  const sessionsById = new Map(sessions.map((session) => [session.id, session]));
  const attributedOrderIds = new Set(
    events.map((event) => event.orderId).filter(Boolean),
  );
  const capturedOrderIds = new Set();
  const consultationsReadyOrderIds = new Set();
  const attributedUsers = new Set(
    [...sessions.map((session) => session.userId), ...events.map((event) => event.userId)].filter(Boolean),
  );
  let capturedRevenue = 0;

  for (const event of paymentEvents) {
    if (event.eventName !== "payment_captured" || !event.orderId) {
      continue;
    }

    if (capturedOrderIds.has(event.orderId)) {
      continue;
    }

    capturedOrderIds.add(event.orderId);
    capturedRevenue += Number(event.order?.total || 0);
  }

  for (const event of patientEvents) {
    const consultationStatus = String(event.consultationStatus || "").toLowerCase();
    const workflowPhase = String(event.mdiWorkflowPhase || "").toLowerCase();

    if (
      event.orderId &&
      (
        ["ready", "active", "completed", "in_progress"].includes(consultationStatus) ||
        /consultation_ready|partner_auth_completed|auth_completed|ready/.test(workflowPhase)
      )
    ) {
      consultationsReadyOrderIds.add(event.orderId);
    }
  }

  const sourcePerformanceMap = new Map();
  const ensureSourceSummary = (record) => {
    const label = getAffiliateSourceLabel(record);
    if (!sourcePerformanceMap.has(label)) {
      sourcePerformanceMap.set(label, {
        label,
        sessions: 0,
        uniqueVisitors: new Set(),
        orders: new Set(),
        funnelCompletions: new Set(),
        checkoutStarts: new Set(),
        paymentsCaptured: new Set(),
        consultationsReady: new Set(),
        subscriptionsActivated: new Set(),
        revenue: 0,
      });
    }

    return sourcePerformanceMap.get(label);
  };

  for (const session of affiliateSessions) {
    const sourceSummary = ensureSourceSummary(session);
    sourceSummary.sessions += 1;
    if (session.visitorId) {
      sourceSummary.uniqueVisitors.add(session.visitorId);
    }
  }

  for (const event of events) {
    const session = event.sessionId
      ? sessionsById.get(event.sessionId) || event.session
      : event.session;

    if (!session) {
      continue;
    }

    const isAffiliateSession = Boolean(
      session.affiliateSource ||
        session.affiliateCampaign ||
        session.affiliateId,
    );

    if (!isAffiliateSession) {
      continue;
    }

    const sourceSummary = ensureSourceSummary(session);
    if (event.orderId) {
      sourceSummary.orders.add(event.orderId);
    }

    if (event.eventName === "funnel_step_complete") {
      const completionKey = buildJourneyKey(event, session.visitorId);
      if (completionKey) {
        sourceSummary.funnelCompletions.add(completionKey);
      }
    }

    if (
      ["payment_intent_created", "checkout_session_created"].includes(
        event.eventName,
      )
    ) {
      const checkoutKey = buildJourneyKey(event, session.visitorId);
      if (checkoutKey) {
        sourceSummary.checkoutStarts.add(checkoutKey);
      }
    }

    if (event.eventName === "payment_captured" && event.orderId) {
      if (!sourceSummary.paymentsCaptured.has(event.orderId)) {
        sourceSummary.revenue += Number(event.order?.total || 0);
      }
      sourceSummary.paymentsCaptured.add(event.orderId);
    }

    const consultationStatus = String(event.consultationStatus || "").toLowerCase();
    const workflowPhase = String(event.mdiWorkflowPhase || "").toLowerCase();
    if (
      event.orderId &&
      (
        ["ready", "active", "completed", "in_progress"].includes(consultationStatus) ||
        /consultation_ready|partner_auth_completed|auth_completed|ready/.test(workflowPhase)
      )
    ) {
      sourceSummary.consultationsReady.add(event.orderId);
    }

    if (event.eventName === "subscription_activated") {
      const subscriptionKey = buildJourneyKey(event, session.visitorId);
      if (subscriptionKey) {
        sourceSummary.subscriptionsActivated.add(subscriptionKey);
      }
    }
  }

  const sourcePerformance = Array.from(sourcePerformanceMap.values())
    .map((item) => ({
      label: item.label,
      sessions: item.sessions,
      uniqueVisitors: item.uniqueVisitors.size,
      orders: item.orders.size,
      funnelCompletions: item.funnelCompletions.size,
      checkoutStarts: item.checkoutStarts.size,
      paymentsCaptured: item.paymentsCaptured.size,
      consultationsReady: item.consultationsReady.size,
      subscriptionsActivated: item.subscriptionsActivated.size,
      revenue: Number(item.revenue.toFixed(2)),
    }))
    .sort((left, right) => {
      if (right.revenue !== left.revenue) {
        return right.revenue - left.revenue;
      }
      if (right.orders !== left.orders) {
        return right.orders - left.orders;
      }
      return right.sessions - left.sessions;
    })
    .slice(0, 12);

  const funnelBreakdownMap = new Map();
  for (const event of funnelEvents) {
    const key = [
      event.funnelSlug || "unknown-funnel",
      event.funnelStep ?? "unknown-step",
      event.funnelStepLabel || event.eventName,
    ].join("::");
    const current = funnelBreakdownMap.get(key) || {
      funnelSlug: event.funnelSlug || "unknown-funnel",
      step: event.funnelStep || 0,
      label: event.funnelStepLabel || "Unknown step",
      viewed: 0,
      completed: 0,
    };

    if (event.eventName === "funnel_step_view") {
      current.viewed += 1;
    }
    if (event.eventName === "funnel_step_complete") {
      current.completed += 1;
    }
    funnelBreakdownMap.set(key, current);
  }

  const funnelBreakdown = Array.from(funnelBreakdownMap.values())
    .sort((left, right) => {
      if (left.funnelSlug === right.funnelSlug) {
        return left.step - right.step;
      }
      return left.funnelSlug.localeCompare(right.funnelSlug);
    })
    .slice(0, 18);

  return {
    windowDays,
    totals: {
      sessions: sessions.length,
      uniqueVisitors,
      affiliateSessions: affiliateSessions.length,
      attributedUsers: attributedUsers.size,
      attributedOrders: attributedOrderIds.size,
      pageViews: pageViews.length,
      funnelViews: funnelEvents.filter((event) => event.eventName === "funnel_step_view").length,
      funnelCompletions: funnelEvents.filter((event) => event.eventName === "funnel_step_complete").length,
      paymentsStarted: paymentEvents.filter((event) =>
        ["payment_intent_created", "checkout_session_created"].includes(event.eventName),
      ).length,
      paymentsCaptured: paymentEvents.filter((event) => event.eventName === "payment_captured").length,
      capturedRevenue: Number(capturedRevenue.toFixed(2)),
      consultationsReady: consultationsReadyOrderIds.size,
      subscriptionsActivated: patientEvents.filter((event) => event.eventName === "subscription_activated").length,
      patientJourneyEvents: patientEvents.length,
    },
    topSources,
    topLandingPages,
    sourcePerformance,
    paymentCounts,
    patientJourney,
    funnelBreakdown,
    recentEvents: events.slice(0, 16).map((event) => ({
      ...event,
      sourceLabel: event.session ? getAffiliateSourceLabel(event.session) : null,
    })),
  };
}
