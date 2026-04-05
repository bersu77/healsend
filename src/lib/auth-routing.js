export function normalizeLoginRedirectPath(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw, "https://healsend.com");
    const normalized = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return normalized.startsWith("/") ? normalized : "";
  } catch {
    return raw.startsWith("/") ? raw : "";
  }
}

export function buildLoginPath(redirectTo = "") {
  const normalizedRedirect = normalizeLoginRedirectPath(redirectTo);
  const searchParams = new URLSearchParams({ auth: "login" });

  if (
    normalizedRedirect &&
    normalizedRedirect !== "/" &&
    normalizedRedirect !== "/login"
  ) {
    searchParams.set("redirect", normalizedRedirect);
  }

  return `/?${searchParams.toString()}`;
}

export function buildSignupPath(redirectTo = "") {
  const normalizedRedirect = normalizeLoginRedirectPath(redirectTo);
  const searchParams = new URLSearchParams({ auth: "signup" });

  if (
    normalizedRedirect &&
    normalizedRedirect !== "/" &&
    normalizedRedirect !== "/signup"
  ) {
    searchParams.set("redirect", normalizedRedirect);
  }

  return `/?${searchParams.toString()}`;
}
