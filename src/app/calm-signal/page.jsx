import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const CalmSignalLandingPage = dynamic(
  () => import("@/components/marketing/calm-signal-landing-page"),
  { ssr: true },
);

const CALM_SIGNAL_PRODUCT_SLUG = "calm-signal";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(CALM_SIGNAL_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "Calm Signal — Clinical Anxiety Protocol, Prescribed | HealSend",
    description:
      product?.seoDescription ||
      "Anxiety isn't a personality flaw. It's a neurochemical state. Clinical anxiety protocol — no sedation, no dependency, no character changes. Just calm.",
    path: "/calm-signal",
    image: product?.image || null,
  });
}

export default async function CalmSignalPage() {
  const product = await getMarketingProductPageData(CALM_SIGNAL_PRODUCT_SLUG);

  const serializableProduct = product
    ? JSON.parse(JSON.stringify(product))
    : null;

  return <CalmSignalLandingPage product={serializableProduct} />;
}
