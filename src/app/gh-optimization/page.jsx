import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const GHOptimizationLandingPage = dynamic(
  () => import("@/components/marketing/gh-optimization-landing-page"),
  { ssr: true },
);

const GH_PRODUCT_SLUG = "growth-hormone-optimization";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(GH_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "GH Optimization — Growth Hormone Therapy | HealSend",
    description:
      product?.seoDescription ||
      "Clinician-guided growth hormone optimization using sermorelin and peptide secretagogues. Restore IGF-1 levels, build lean mass, and feel stronger.",
    path: "/gh-optimization",
    image: product?.image || null,
  });
}

export default async function GHOptimizationPage() {
  const product = await getMarketingProductPageData(GH_PRODUCT_SLUG);

  const serializableProduct = product
    ? JSON.parse(JSON.stringify(product))
    : null;

  return <GHOptimizationLandingPage product={serializableProduct} />;
}
