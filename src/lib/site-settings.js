/**
 * Site Settings helper — reads admin-managed configuration from the
 * SiteSettings table. Results are cached in-process for 30 seconds to
 * avoid a DB round-trip on every request.
 *
 * Keys are namespaced by integration, e.g.:
 *   "ghl.glp1QuestionnaireId"
 *   "ghl.glp1FunnelSlugs"      (JSON array)
 *   "ola.baseUrl"
 *   "ola.serviceKey"
 *   "ola.sessionType"
 */

import { prisma } from "@/lib/prisma";

let _cache = null;
let _cacheAt = 0;
const CACHE_TTL_MS = 30_000;

/**
 * Returns all site settings as a plain { key: parsedValue } object.
 * Values stored as JSON are automatically parsed.
 */
export async function getAllSiteSettings() {
  if (_cache && Date.now() - _cacheAt < CACHE_TTL_MS) return _cache;

  const rows = await prisma.siteSettings.findMany();
  const result = {};
  for (const row of rows) {
    try {
      result[row.key] = JSON.parse(row.value);
    } catch {
      result[row.key] = row.value;
    }
  }

  _cache = result;
  _cacheAt = Date.now();
  return result;
}

/**
 * Returns the value for a single key. Falls back to `defaultValue` when the
 * key is not set.
 */
export async function getSiteSetting(key, defaultValue = null) {
  const all = await getAllSiteSettings();
  return key in all ? all[key] : defaultValue;
}

/** Clears the in-process cache so the next read fetches fresh data. */
export function invalidateSiteSettingsCache() {
  _cache = null;
  _cacheAt = 0;
}
