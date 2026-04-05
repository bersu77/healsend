/**
 * affiliate-constants.js
 *
 * Shared constants imported by both the Edge middleware and the server-side
 * affiliate-service.js. This file must remain free of Node.js-only APIs so
 * it can run in the Next.js Edge runtime.
 */

/** Cookie name that carries the affiliate referral code. */
export const REFERRAL_COOKIE_NAME = "hs_ref";

/**
 * Referral cookie lifetime in seconds.
 * Default: 30 days. Override via REFERRAL_COOKIE_TTL_SECONDS env var.
 */
export const REFERRAL_COOKIE_TTL =
  typeof process !== "undefined"
    ? parseInt(process.env?.REFERRAL_COOKIE_TTL_SECONDS || "2592000", 10)
    : 2592000; // 30 days
