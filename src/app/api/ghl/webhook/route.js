import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/ghl/webhook — Handle incoming GHL webhook events
export async function POST(request) {
  try {
    const payload = await request.json();
    const eventType = payload.type || payload.event || "unknown";

    console.log(`[GHL Webhook] Received event: ${eventType}`);

    // Store webhook event in database for audit/debugging
    await prisma.ghlWebhookEvent.create({
      data: {
        eventType,
        payload,
        processed: false,
      },
    });

    // Handle specific event types
    switch (eventType) {
      case "contact.created":
        await handleContactCreated(payload);
        break;

      case "opportunity.created":
        await handleOpportunityCreated(payload);
        break;

      default:
        console.log(`[GHL Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[GHL Webhook] Error:", err);
    // Return 200 to prevent GHL from retrying
    return NextResponse.json({ received: true, error: err.message });
  }
}

// ─── Event Handlers ──────────────────────────────────────────

async function handleContactCreated(payload) {
  const contact = payload.contact || payload.data || payload;

  if (!contact.id) return;

  // Sync the contact to our local database
  await prisma.ghlContact.upsert({
    where: { ghlId: contact.id },
    update: {
      firstName: contact.firstName || null,
      lastName: contact.lastName || null,
      email: contact.email || null,
      phone: contact.phone || null,
      tags: contact.tags || [],
    },
    create: {
      ghlId: contact.id,
      firstName: contact.firstName || null,
      lastName: contact.lastName || null,
      email: contact.email || null,
      phone: contact.phone || null,
      tags: contact.tags || [],
    },
  });

  // Mark the webhook event as processed
  await prisma.ghlWebhookEvent.updateMany({
    where: { eventType: "contact.created", processed: false },
    data: { processed: true },
  });

  console.log(`[GHL Webhook] Synced contact: ${contact.id}`);
}

async function handleOpportunityCreated(payload) {
  const opportunity = payload.opportunity || payload.data || payload;
  console.log(
    `[GHL Webhook] Opportunity created: ${opportunity.id || "unknown"}`,
  );
  // Add custom logic here, e.g. create an order or notify admin
}
