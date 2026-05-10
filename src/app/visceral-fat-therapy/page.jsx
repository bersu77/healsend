import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const VisceralFatTherapyLandingPage = dynamic(
  () => import("@/components/marketing/visceral-fat-therapy-landing-page"),
  { ssr: true },
);

const VF_PRODUCT_SLUG = "visceral-fat-therapy";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(VF_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "Visceral Fat Therapy — Target Deep Belly Fat | HealSend",
    description:
      product?.seoDescription ||
      "Clinician-guided visceral fat-targeting therapy using tesamorelin. Specifically reduces deep abdominal fat that GLP-1s can't reach. 60-day guarantee.",
    path: "/visceral-fat-therapy",
    image: product?.image || null,
  });
}

export default async function VisceralFatTherapyPage() {
  const product = await getMarketingProductPageData(VF_PRODUCT_SLUG);

  const serializableProduct = product
    ? JSON.parse(JSON.stringify(product))
    : null;

  return <VisceralFatTherapyLandingPage product={serializableProduct} />;
}
