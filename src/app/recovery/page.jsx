import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const RecoveryLandingPage = dynamic(
  () => import("@/components/marketing/recovery-landing-page"),
  { ssr: true },
);

const RECOVERY_PRODUCT_SLUG = "recovery";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(RECOVERY_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "Targeted Recovery & Repair Therapy | HealSend",
    description:
      product?.seoDescription ||
      "A clinically guided protocol designed to accelerate healing, reduce inflammation, and support joint, tendon, and tissue repair. Provider-prescribed when appropriate. 60-day money-back guarantee.",
    path: "/recovery",
    image: product?.image || null,
  });
}

export default async function RecoveryPage() {
  const product = await getMarketingProductPageData(RECOVERY_PRODUCT_SLUG);

  const serializableProduct = product
    ? JSON.parse(JSON.stringify(product))
    : null;

  return <RecoveryLandingPage product={serializableProduct} />;
}
