import { NextResponse } from "next/server";
import { addTagToGhlContact } from "@/lib/ghl";
import { isGhlApiEnabled } from "@/lib/integration-settings";

// POST /api/ghl/contacts/tag — Add a tag to a GHL contact
export async function POST(request) {
  if (!isGhlApiEnabled()) {
    return NextResponse.json(
      { error: "GHL contact sync is disabled in this environment" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const { contactId, tag } = body;

    if (!contactId || !tag) {
      return NextResponse.json(
        { error: "contactId and tag are required" },
        { status: 400 },
      );
    }

    const result = await addTagToGhlContact(contactId, tag);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err) {
    console.error("[GHL] Add tag error:", err);
    return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
  }
}
