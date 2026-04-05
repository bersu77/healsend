/**
 * GoHighLevel OAuth helpers for multi-tenant SaaS.
 *
 * Flow:
 *   1. Redirect user to GHL OAuth URL → ghlOAuthUrl()
 *   2. GHL redirects back with ?code=...
 *   3. Exchange code for tokens → exchangeGhlCode()
 *   4. Store tokens in GhlOAuthToken table
 *   5. Use per-user tokens for API calls → ghlRequestWithToken()
 *   6. Refresh tokens when expired → refreshGhlToken()
 */

const GHL_BASE_URL = "https://rest.gohighlevel.com/v1";
const GHL_OAUTH_URL =
  "https://marketplace.gohighlevel.com/oauth/chooselocation";
const GHL_TOKEN_URL = "https://services.leadconnectorhq.com/oauth/token";

function getOAuthConfig() {
  const clientId = process.env.GHL_CLIENT_ID;
  const clientSecret = process.env.GHL_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/ghl/oauth/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("GHL_CLIENT_ID and GHL_CLIENT_SECRET must be set");
  }

  return { clientId, clientSecret, redirectUri };
}

/** Generate the GHL OAuth authorization URL */
export function ghlOAuthUrl() {
  const { clientId, redirectUri } = getOAuthConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope:
      "contacts.readonly contacts.write locations.readonly opportunities.readonly opportunities.write",
  });
  return `${GHL_OAUTH_URL}?${params}`;
}

/** Exchange authorization code for access + refresh tokens */
export async function exchangeGhlCode(code) {
  const { clientId, clientSecret, redirectUri } = getOAuthConfig();

  const res = await fetch(GHL_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      ok: false,
      error: data.error_description || "Token exchange failed",
    };
  }

  return {
    ok: true,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    locationId: data.locationId,
  };
}

/** Refresh an expired access token */
export async function refreshGhlToken(refreshToken) {
  const { clientId, clientSecret } = getOAuthConfig();

  const res = await fetch(GHL_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      ok: false,
      error: data.error_description || "Token refresh failed",
    };
  }

  return {
    ok: true,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/** Make an API call using a per-user access token (instead of the global API key) */
export async function ghlRequestWithToken(
  accessToken,
  endpoint,
  { method = "GET", body, params } = {},
) {
  let url = `${GHL_BASE_URL}${endpoint}`;

  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const fetchOptions = { method, headers };
  if (body && (method === "POST" || method === "PUT")) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data?.message || `GHL API error: ${response.status}`,
      };
    }

    return { ok: true, status: response.status, data };
  } catch (err) {
    return { ok: false, status: 500, error: err.message };
  }
}
