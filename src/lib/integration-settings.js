const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);
const FALSE_VALUES = new Set(["0", "false", "no", "off"]);

export function isPlaceholderEnvValue(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return (
    !normalized ||
    normalized === "replace_me" ||
    normalized.includes("replace_me") ||
    normalized.includes("placeholder") ||
    normalized.includes("your_") ||
    normalized.includes("changeme")
  );
}

function readBooleanEnv(...names) {
  for (const name of names) {
    const raw = String(process.env[name] || "").trim().toLowerCase();
    if (!raw) {
      continue;
    }

    if (TRUE_VALUES.has(raw)) {
      return true;
    }

    if (FALSE_VALUES.has(raw)) {
      return false;
    }
  }

  return null;
}

function hasConfiguredEnv(name, { requirePrivateKey = false } = {}) {
  const value = String(process.env[name] || "").trim();
  if (isPlaceholderEnvValue(value)) {
    return false;
  }

  if (requirePrivateKey && !value.includes("BEGIN PRIVATE KEY")) {
    return false;
  }

  return true;
}

export function isGoogleOAuthEnabled() {
  const explicit = readBooleanEnv(
    "GOOGLE_OAUTH_ENABLED",
    "NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED",
  );
  if (explicit === false) {
    return false;
  }

  return (
    hasConfiguredEnv("GOOGLE_CLIENT_ID") &&
    hasConfiguredEnv("GOOGLE_CLIENT_SECRET")
  );
}

export function isAppleOAuthEnabled() {
  const explicit = readBooleanEnv(
    "APPLE_OAUTH_ENABLED",
    "NEXT_PUBLIC_APPLE_OAUTH_ENABLED",
  );
  if (explicit === false) {
    return false;
  }

  return (
    hasConfiguredEnv("APPLE_CLIENT_ID") &&
    hasConfiguredEnv("APPLE_TEAM_ID") &&
    hasConfiguredEnv("APPLE_KEY_ID") &&
    hasConfiguredEnv("APPLE_PRIVATE_KEY", { requirePrivateKey: true })
  );
}

export function isGhlApiEnabled() {
  const explicit = readBooleanEnv("GHL_SYNC_ENABLED", "GHL_API_ENABLED");
  if (explicit === false) {
    return false;
  }

  return hasConfiguredEnv("GHL_API_KEY");
}

export function isGhlOAuthEnabled() {
  const explicit = readBooleanEnv("GHL_OAUTH_ENABLED");
  if (explicit === false) {
    return false;
  }

  return (
    hasConfiguredEnv("GHL_CLIENT_ID") &&
    hasConfiguredEnv("GHL_CLIENT_SECRET")
  );
}

export function getPublicAuthProviderConfig() {
  return {
    google: isGoogleOAuthEnabled(),
    apple: isAppleOAuthEnabled(),
  };
}
