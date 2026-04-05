import { NextResponse } from "next/server";
import crypto from "crypto";
import { oauthErrorResponse } from "@/lib/oauth";
import { getGoogleOAuthRedirectUri } from "@/lib/oauth-redirects";
import { isGoogleOAuthEnabled } from "@/lib/integration-settings";

// GET /api/auth/google — redirect to Google OAuth consent screen
export async function GET() {
  if (!isGoogleOAuthEnabled()) {
    return oauthErrorResponse("oauth_disabled");
  }
  const clientId = process.env.GOOGLE_CLIENT_ID;

  const redirectUri = getGoogleOAuthRedirectUri();

  // Generate CSRF state token
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    state,
    prompt: "select_account",
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
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
