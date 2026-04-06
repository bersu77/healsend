import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { syncNewUserToGhl } from "@/lib/ghl-sync";
import { linkMdiPatientOnSignup } from "@/lib/mdi-client";
import { NextResponse } from "next/server";

/**
 * Returns an HTML page that posts a message to the opener window and closes the popup.
 */
function popupResponse(payload, token) {
  const html = `<!DOCTYPE html><html><head><title>Authenticating…</title></head><body>
<script>
  if (window.opener) {
    window.opener.postMessage(${JSON.stringify(payload)}, window.location.origin);
  }
  window.close();
</script>
<p>Signing you in…</p>
</body></html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });

  if (token) {
    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }

  return response;
}

/**
 * Returns an HTML popup response for OAuth errors.
 */
export function oauthErrorResponse(errorCode) {
  return popupResponse({ type: "oauth_error", error: errorCode }, null);
}

/**
 * Find or create a user from an OAuth provider, create a session,
 * and return a popup HTML that messages the opener.
 */
export async function handleOAuthUser({ provider, providerId, email, name }) {
  // 1. Try to find user by provider + providerId
  let user = await prisma.user.findFirst({
    where: { authProvider: provider, authProviderId: providerId },
  });

  if (!user) {
    // 2. Try to find user by email (might already have an email/password account)
    user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (user) {
      // Link OAuth to existing account
      await prisma.user.update({
        where: { id: user.id },
        data: {
          authProvider: user.authProvider || provider,
          authProviderId: user.authProviderId || providerId,
          name: user.name || name || null,
        },
      });
    } else {
      // 3. Create new user
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: name || null,
          authProvider: provider,
          authProviderId: providerId,
          role: "CUSTOMER",
        },
      });

      // Sync new OAuth user to GHL and link any existing MDI patient (non-blocking)
      syncNewUserToGhl(user).catch(() => {});
      linkMdiPatientOnSignup(user.id, user.email).catch(() => {});
    }
  }

  // Create session
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await prisma.session.create({
    data: { userId: user.id, token, expiresAt },
  });

  const payload = {
    type: "oauth_success",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };

  const response = popupResponse(payload, token);

  // Clear the CSRF state cookie
  response.cookies.set("oauth_state", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
