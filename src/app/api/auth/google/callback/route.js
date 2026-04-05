import { cookies } from "next/headers";
import { handleOAuthUser, oauthErrorResponse } from "@/lib/oauth";
import { getGoogleOAuthRedirectUri } from "@/lib/oauth-redirects";
import { isGoogleOAuthEnabled } from "@/lib/integration-settings";

// GET /api/auth/google/callback — handle Google OAuth callback
export async function GET(request) {
  if (!isGoogleOAuthEnabled()) {
    return oauthErrorResponse("oauth_disabled");
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return oauthErrorResponse(error);
  }

  if (!code) {
    return oauthErrorResponse("missing_code");
  }

  // Verify CSRF state
  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  if (!state || state !== storedState) {
    return oauthErrorResponse("invalid_state");
  }

  try {
    const redirectUri = getGoogleOAuthRedirectUri();

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return oauthErrorResponse("token_exchange_failed");
    }

    // Fetch user info from Google
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
    );

    const googleUser = await userInfoRes.json();
    if (!userInfoRes.ok || !googleUser.email) {
      return oauthErrorResponse("userinfo_failed");
    }

    // Create/find user and set session cookie; returns HTML popup response
    return await handleOAuthUser({
      provider: "google",
      providerId: googleUser.id,
      email: googleUser.email,
      name: googleUser.name || null,
    });
  } catch {
    return oauthErrorResponse("oauth_failed");
  }
}
