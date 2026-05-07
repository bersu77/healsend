import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const TRTLandingPage = dynamic(
  () => import("@/components/marketing/trt-landing-page"),
  { ssr: true },
);

const TRT_PRODUCT_SLUG = "testosterone-injections";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(TRT_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "TRT — Testosterone Replacement Therapy | HealSend",
    description:
      product?.seoDescription ||
      "Clinician-guided TRT with at-home labs, 48-hour prescriptions, and ongoing optimization.",
    path: "/trt",
    image: product?.image || null,
  });
}

export default async function TRTPage() {
  const product = await getMarketingProductPageData(TRT_PRODUCT_SLUG);

  if (!product) {
    notFound();
  }

  const serializableProduct = JSON.parse(JSON.stringify(product));
  return <TRTLandingPage product={serializableProduct} />;
}
