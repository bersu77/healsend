/**
 * Sync a newly registered user to GoHighLevel.
 *
 * Call this from your registration flow after the user is created.
 * It creates a GHL contact and applies the "app-user" tag.
 *
 * Server-side only — do NOT import from client code.
 */

import { createGhlContact, addTagToGhlContact } from "@/lib/ghl";
import { isGhlApiEnabled } from "@/lib/integration-settings";
import { prisma } from "@/lib/prisma";

/**
 * @param {{ id: string, email: string, name?: string, phone?: string }} user
 */
export async function syncNewUserToGhl(user) {
  if (!isGhlApiEnabled()) {
    return;
  }

  try {
    const [firstName, ...rest] = (user.name || "").split(" ");
    const lastName = rest.join(" ") || undefined;

    // Format DOB as YYYY-MM-DD for GHL
    let dobStr;
    if (user.dateOfBirth) {
      const d = new Date(user.dateOfBirth);
      if (!isNaN(d.getTime())) {
        dobStr = d.toISOString().slice(0, 10);
      }
    }

    // Create contact in GHL
    const result = await createGhlContact({
      firstName: firstName || undefined,
      lastName,
      email: user.email,
      phone: user.phone || undefined,
      dateOfBirth: dobStr,
      tags: ["app-user"],
    });

    if (!result.ok) {
      console.error("[GHL Sync] Failed to create contact:", result.error);
      return;
    }

    const ghlContactId = result.data?.contact?.id;
    if (!ghlContactId) return;

    // Store in local DB with link to user
    await prisma.ghlContact.upsert({
      where: { ghlId: ghlContactId },
      update: { userId: user.id },
      create: {
        ghlId: ghlContactId,
        firstName: firstName || null,
        lastName: lastName || null,
        email: user.email,
        phone: user.phone || null,
        tags: ["app-user"],
        userId: user.id,
      },
      update: { userId: user.id },
    });

    // Add the "app-user" tag (also sent during creation, but this ensures it)
    await addTagToGhlContact(ghlContactId, "app-user");

    console.log(
      `[GHL Sync] User ${user.email} synced as contact ${ghlContactId}`,
    );
  } catch (err) {
    // GHL sync failure should not break registration
    console.error("[GHL Sync] Error syncing user:", err);
  }
}
