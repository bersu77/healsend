function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getGoogleOAuthRedirectUri() {
  return process.env.GOOGLE_REDIRECT_URI || `${getAppUrl()}/api/auth/google/callback`;
}

export function getAppleOAuthRedirectUri() {
  return process.env.APPLE_REDIRECT_URI || `${getAppUrl()}/api/auth/apple/callback`;
}
