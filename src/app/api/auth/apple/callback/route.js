import { cookies } from "next/headers";
import crypto from "crypto";
import { handleOAuthUser, oauthErrorResponse } from "@/lib/oauth";
import { getAppleOAuthRedirectUri } from "@/lib/oauth-redirects";
import { isAppleOAuthEnabled } from "@/lib/integration-settings";

// Generate Apple client_secret JWT
async function generateAppleClientSecret() {
  const teamId = process.env.APPLE_TEAM_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!teamId || !clientId || !keyId || !privateKey) {
    throw new Error("Apple OAuth env vars not fully configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "ES256", kid: keyId };
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 15777000, // ~6 months
    aud: "https://appleid.apple.com",
    sub: clientId,
  };

  // Base64url encode
  const b64url = (obj) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const headerB64 = b64url(header);
  const payloadB64 = b64url(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  // Import the ES256 private key and sign
  const key = crypto.createPrivateKey(privateKey);
  const signature = crypto.sign("sha256", Buffer.from(signingInput), {
    key,
    dsaEncoding: "ieee-p1363",
  });
  const sigB64 = signature
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${signingInput}.${sigB64}`;
}

// Decode a JWT payload without verification (Apple id_token)
function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT");
  const payload = Buffer.from(parts[1], "base64").toString("utf-8");
  return JSON.parse(payload);
}

// POST /api/auth/apple/callback — handle Apple OAuth callback (form_post)
export async function POST(request) {
  if (!isAppleOAuthEnabled()) {
    return oauthErrorResponse("oauth_disabled");
  }

  try {
    const formData = await request.formData();
    const code = formData.get("code");
    const state = formData.get("state");
    const userStr = formData.get("user"); // Apple sends user info only on first auth
    const errorParam = formData.get("error");

    if (errorParam) {
      return oauthErrorResponse(errorParam);
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

    const redirectUri = getAppleOAuthRedirectUri();
    const clientSecret = await generateAppleClientSecret();

    // Exchange code for tokens
    const tokenRes = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.id_token) {
      return oauthErrorResponse("token_exchange_failed");
    }

    // Decode id_token to get user info
    const idToken = decodeJwtPayload(tokenData.id_token);
    const appleUserId = idToken.sub;
    const email = idToken.email;

    if (!email) {
      return oauthErrorResponse("no_email");
    }

    // Apple only sends user name on first authorization
    let name = null;
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        const first = userData.name?.firstName || "";
        const last = userData.name?.lastName || "";
        name = [first, last].filter(Boolean).join(" ") || null;
      } catch {
        // ignore parse errors
      }
    }

    // Create/find user and set session cookie; returns HTML popup response
    return await handleOAuthUser({
      provider: "apple",
      providerId: appleUserId,
      email,
      name,
    });
  } catch {
    return oauthErrorResponse("oauth_failed");
  }
}
