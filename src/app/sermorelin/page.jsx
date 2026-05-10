import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const SermorelinLandingPage = dynamic(
  () => import("@/components/marketing/sermorelin-landing-page"),
  { ssr: true },
);

const SERMORELIN_PRODUCT_SLUG = "sermorelin";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(SERMORELIN_PRODUCT_SLUG);
  return buildPageMetadata({
    title:
      product?.seoTitle || "Sermorelin — Entry-Level GH Support | HealSend",
    description:
      product?.seoDescription ||
      "Clinician-guided sermorelin therapy. The gentlest way to start feeling like yourself again.",
    path: "/sermorelin",
    image: product?.image || null,
  });
}

export default async function SermorelinPage() {
  const product = await getMarketingProductPageData(SERMORELIN_PRODUCT_SLUG);
  const serializableProduct = product
    ? JSON.parse(JSON.stringify(product))
    : null;
  return <SermorelinLandingPage product={serializableProduct} />;
}
