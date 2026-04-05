import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * POST /api/user/update-card
 *
 * Creates a Stripe Checkout Session in "setup" mode so the user can
 * securely add or replace their card. On success, Stripe fires
 * checkout.session.completed (mode = "setup") and the webhook saves the
 * new payment method to the database and sets it as default.
 *
 * Body: { successUrl?: string, cancelUrl?: string }
 */
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // No body is fine — we'll use defaults
  }

  const origin = new URL(request.url).origin;
  const successUrl =
    body.successUrl || `${origin}/account?tab=subscriptions&card=updated`;
  const cancelUrl = body.cancelUrl || `${origin}/account?tab=subscriptions`;

  // Resolve or create the Stripe customer for this user
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "setup",
    customer: stripeCustomerId,
    currency: "usd",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId: user.id, purpose: "card_update" },
  });

  return NextResponse.json({ sessionUrl: session.url });
}
