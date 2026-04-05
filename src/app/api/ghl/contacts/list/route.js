import { NextResponse } from "next/server";
import { listGhlContacts } from "@/lib/ghl";
import { isGhlApiEnabled } from "@/lib/integration-settings";

export const dynamic = "force-dynamic";

// GET /api/ghl/contacts/list — Fetch contacts from GHL
export async function GET(request) {
  if (!isGhlApiEnabled()) {
    return NextResponse.json(
      { error: "GHL contact sync is disabled in this environment" },
      { status: 503 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await listGhlContacts({ query, limit });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ contacts: result.data?.contacts || [] });
  } catch (err) {
    console.error("[GHL] List contacts error:", err);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}
