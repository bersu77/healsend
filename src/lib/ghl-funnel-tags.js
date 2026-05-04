/**
 * GHL Funnel Tagging — tracks user progress through the payment funnel.
 *
 * Tags applied:
 *   "funnel-started"    → user registered / entered the onboarding funnel
 *   "checkout-reached"  → user reached the checkout/payment step
 *   "paid"             → payment captured successfully
 *
 * Server-side only.
 */

import { addTagToGhlContact, removeTagFromGhlContact } from "@/lib/ghl";
import { isGhlApiEnabled } from "@/lib/integration-settings";
import { prisma } from "@/lib/prisma";

const FUNNEL_TAGS = {
  STARTED: "funnel-started",
  CHECKOUT: "checkout-reached",
  PAID: "paid",
  SMS_OPTED_IN: "sms-opted-in",
};

export { FUNNEL_TAGS };

async function getGhlContactId(userId) {
  const ghlContact = await prisma.ghlContact.findFirst({
    where: { userId },
  });
  return ghlContact?.ghlId || null;
}

export async function tagFunnelStarted(userId) {
  if (!isGhlApiEnabled()) return;

  try {
    const ghlId = await getGhlContactId(userId);
    if (!ghlId) return;
    await addTagToGhlContact(ghlId, FUNNEL_TAGS.STARTED);
  } catch (err) {
    console.error("[GHL Funnel] Failed to tag funnel-started:", err);
  }
}

export async function tagCheckoutReached(userId) {
  if (!isGhlApiEnabled()) return;

  try {
    const ghlId = await getGhlContactId(userId);
    if (!ghlId) return;
    await Promise.all([
      addTagToGhlContact(ghlId, FUNNEL_TAGS.STARTED),
      addTagToGhlContact(ghlId, FUNNEL_TAGS.CHECKOUT),
    ]);
  } catch (err) {
    console.error("[GHL Funnel] Failed to tag checkout-reached:", err);
  }
}

export async function tagSmsOptedIn(userId) {
  if (!isGhlApiEnabled()) return;

  try {
    const ghlId = await getGhlContactId(userId);
    if (!ghlId) return;
    await addTagToGhlContact(ghlId, FUNNEL_TAGS.SMS_OPTED_IN);
  } catch (err) {
    console.error("[GHL Funnel] Failed to tag sms-opted-in:", err);
  }
}

export async function tagPaid(userId) {
  if (!isGhlApiEnabled()) return;

  try {
    const ghlId = await getGhlContactId(userId);
    if (!ghlId) return;

    await Promise.all([
      addTagToGhlContact(ghlId, FUNNEL_TAGS.PAID),
      removeTagFromGhlContact(ghlId, FUNNEL_TAGS.CHECKOUT),
      removeTagFromGhlContact(ghlId, FUNNEL_TAGS.STARTED),
    ]);
  } catch (err) {
    console.error("[GHL Funnel] Failed to tag paid:", err);
  }
}
