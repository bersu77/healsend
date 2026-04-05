import { NextResponse } from "next/server";
import { GET as handleGoogleCallback } from "@/app/api/auth/google/callback/route";
import { POST as handleAppleCallback } from "@/app/api/auth/apple/callback/route";
import { getGoogleOAuthRedirectUri } from "@/lib/oauth-redirects";

function getAppOrigin(request) {
  const configuredGoogleRedirect = getGoogleOAuthRedirectUri();
  try {
    return new URL(configuredGoogleRedirect).origin;
  } catch {
    return new URL(request.url).origin;
  }
}

function getLoginRedirect(request) {
  return NextResponse.redirect(new URL("/?auth=login", getAppOrigin(request)));
}

export async function GET(request) {
  const provider = new URL(request.url).searchParams.get("loginSocial");

  if (provider === "google") {
    return handleGoogleCallback(request);
  }

  return getLoginRedirect(request);
}

export async function POST(request) {
  const provider = new URL(request.url).searchParams.get("loginSocial");

  if (provider === "apple") {
    return handleAppleCallback(request);
  }

  return getLoginRedirect(request);
}
