import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const SurgeLandingPage = dynamic(
  () => import("@/components/marketing/surge-landing-page"),
  { ssr: true },
);

const SURGE_PRODUCT_SLUG = "surge";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(SURGE_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "SURGE — Performance Medication, Prescribed | HealSend",
    description:
      product?.seoDescription ||
      "Clinical-grade ED medication prescribed by US-licensed physicians. SURGE combines fast onset with a 24–36 hour window. 60-day effective-dose guarantee.",
    path: "/surge",
    image: product?.image || null,
  });
}

export default async function SurgePage() {
  const product = await getMarketingProductPageData(SURGE_PRODUCT_SLUG);

  const serializableProduct = product
    ? JSON.parse(JSON.stringify(product))
    : null;

  return <SurgeLandingPage product={serializableProduct} />;
}
