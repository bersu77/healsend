import { NextResponse } from "next/server";
import crypto from "crypto";
import { oauthErrorResponse } from "@/lib/oauth";
import { getAppleOAuthRedirectUri } from "@/lib/oauth-redirects";
import { isAppleOAuthEnabled } from "@/lib/integration-settings";

// GET /api/auth/apple — redirect to Apple OAuth consent screen
export async function GET() {
  if (!isAppleOAuthEnabled()) {
    return oauthErrorResponse("oauth_disabled");
  }
  const clientId = process.env.APPLE_CLIENT_ID;

  const redirectUri = getAppleOAuthRedirectUri();

  // Generate CSRF state token
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "name email",
    response_mode: "form_post",
    state,
  });

  const response = NextResponse.redirect(
    `https://appleid.apple.com/auth/authorize?${params}`,
  );

  // Store state in a short-lived cookie for CSRF verification
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  return response;
}
