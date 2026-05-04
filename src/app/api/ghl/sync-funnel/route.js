import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateGhlContact } from "@/lib/ghl";
import { isGhlApiEnabled } from "@/lib/integration-settings";
import { tagSmsOptedIn } from "@/lib/ghl-funnel-tags";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isGhlApiEnabled()) {
    return NextResponse.json({ ok: true });
  }

  const body = await request.json();
  const { contactInfo, smsOptedIn } = body;

  try {
    if (contactInfo) {
      const ghlContact = await prisma.ghlContact.findFirst({
        where: { userId: user.id },
      });
      if (ghlContact?.ghlId) {
        const updates = {};
        if (contactInfo.phone) updates.phone = contactInfo.phone.trim();
        if (contactInfo.firstName) updates.firstName = contactInfo.firstName.trim();
        if (contactInfo.lastName) updates.lastName = contactInfo.lastName.trim();
        if (Object.keys(updates).length > 0) {
          await updateGhlContact(ghlContact.ghlId, updates);
        }
      }
    }

    if (smsOptedIn) {
      await tagSmsOptedIn(user.id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ghl/sync-funnel] Error:", err);
    return NextResponse.json({ ok: true });
  }
}
