import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const OralGLP1LandingPage = dynamic(
  () => import("@/components/marketing/oral-glp1-landing-page"),
  { ssr: true },
);

const ORAL_GLP1_PRODUCT_SLUG = "oral-glp-1";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(ORAL_GLP1_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "Oral GLP-1 Therapy — Orforglipron + B6 & Semaglutide RDT | HealSend",
    description:
      product?.seoDescription ||
      "The first oral GLP-1 that actually works. Two options: Orforglipron + B6 (newest, $349/mo) and Semaglutide RDT ($249/mo). No injections. BMI 25+ qualifies. 60-day guarantee.",
    path: "/oral-glp-1",
    image: product?.image || null,
  });
}

export default async function OralGLP1Page() {
  const product = await getMarketingProductPageData(ORAL_GLP1_PRODUCT_SLUG);

  const serializableProduct = product
    ? JSON.parse(JSON.stringify(product))
    : null;

  return <OralGLP1LandingPage product={serializableProduct} />;
}
