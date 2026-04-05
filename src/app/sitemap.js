import { getPublicSitemapEntries } from "@/lib/marketing-data";
import { resolveAbsoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const entries = await getPublicSitemapEntries();

  return entries.map((entry) => ({
    url: resolveAbsoluteUrl(entry.path),
    lastModified: entry.lastModified,
    changeFrequency:
      entry.path === "/" ? "daily" : entry.path === "/shop" ? "weekly" : "monthly",
    priority:
      entry.path === "/" ? 1 : entry.path === "/shop" ? 0.9 : 0.8,
  }));
}
