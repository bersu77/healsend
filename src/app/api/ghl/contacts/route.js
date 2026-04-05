import { NextResponse } from "next/server";
import { createGhlContact } from "@/lib/ghl";
import { isGhlApiEnabled } from "@/lib/integration-settings";
import { prisma } from "@/lib/prisma";

// POST /api/ghl/contacts — Create a new GHL contact
export async function POST(request) {
  if (!isGhlApiEnabled()) {
    return NextResponse.json(
      { error: "GHL contact sync is disabled in this environment" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, tags } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: "At least email or phone is required" },
        { status: 400 },
      );
    }

    // Create the contact in GoHighLevel
    const result = await createGhlContact({
      firstName,
      lastName,
      email,
      phone,
      tags,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const ghlContact = result.data?.contact;

    // Store in local database for sync
    if (ghlContact?.id) {
      await prisma.ghlContact.upsert({
        where: { ghlId: ghlContact.id },
        update: { firstName, lastName, email, phone },
        create: {
          ghlId: ghlContact.id,
          firstName: firstName || null,
          lastName: lastName || null,
          email: email || null,
          phone: phone || null,
          tags: tags || [],
        },
      });
    }

    return NextResponse.json({ contact: ghlContact }, { status: 201 });
  } catch (err) {
    console.error("[GHL] Create contact error:", err);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}
