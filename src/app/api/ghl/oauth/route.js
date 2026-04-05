import { NextResponse } from "next/server";
import { ghlOAuthUrl } from "@/lib/ghl-oauth";
import { isGhlOAuthEnabled } from "@/lib/integration-settings";

// GET /api/ghl/oauth — Redirect user to GHL OAuth flow
export async function GET() {
  if (!isGhlOAuthEnabled()) {
    return NextResponse.json(
      { error: "GHL OAuth is disabled in this environment" },
      { status: 503 },
    );
  }

  try {
    const url = ghlOAuthUrl();
    return NextResponse.redirect(url);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
