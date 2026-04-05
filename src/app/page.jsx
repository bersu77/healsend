import MarketingHomePage from "@/components/marketing/home-page";
import { getMarketingHomePageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const data = await getMarketingHomePageData();

  return buildPageMetadata({
    title: data?.seoTitle || data?.title || "HealSend",
    description:
      data?.seoDescription ||
      "Clinician-guided treatment, onboarding, and ongoing care through HealSend.",
    path: "/",
    image: data?.heroImage || null,
  });
}

export default async function HomePage() {
  const data = await getMarketingHomePageData();

  return <MarketingHomePage {...(data || {})} />;
}
