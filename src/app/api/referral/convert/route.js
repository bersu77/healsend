import { NextResponse } from "next/server";
import { convertReferral } from "@/lib/affiliate-service";
import { getCurrentUser } from "@/lib/auth";

/**
 * POST /api/referral/convert
 *
 * Called after a user signs up to link their account to a pending referral.
 * Idempotent — safe to call multiple times for the same referral/user pair.
 *
 * Body: { referralId: string, orderTotal?: number }
 *
 * Requires: authenticated session (the newly registered user).
 */
export async function POST(request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const referralId = String(body.referralId || "").trim();
  if (!referralId) {
    return NextResponse.json(
      { error: "referralId is required" },
      { status: 400 },
    );
  }

  const orderTotal = Number(body.orderTotal) || 0;

  const result = await convertReferral({
    referralId,
    referredUserId: currentUser.id,
    orderTotal,
  });

  if (!result.referral) {
    // Conversion blocked (fraud, expired, duplicate) — return 200 silently
    // to avoid leaking fraud-detection logic to callers.
    return NextResponse.json({ ok: true, converted: false });
  }

  return NextResponse.json({
    ok: true,
    converted: true,
    reward: result.reward
      ? {
          id: result.reward.id,
          amount: result.reward.rewardAmount,
          status: result.reward.status,
        }
      : null,
  });
}
