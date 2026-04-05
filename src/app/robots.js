import { getSiteUrl } from "@/lib/seo";

export default function robots() {
  const siteUrl = getSiteUrl();
  const origin = siteUrl.origin;

  return {
    host: origin,
    sitemap: `${origin}/sitemap.xml`,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/api/",
          "/cart",
          "/consultation/",
          "/dashboard/",
          "/funnels/",
          "/login",
          "/onboarding/",
          "/order-confirmation",
          "/signup",
        ],
      },
    ],
  };
}
