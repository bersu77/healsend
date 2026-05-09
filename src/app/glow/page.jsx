import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const GlowLandingPage = dynamic(
  () => import("@/components/marketing/glow-landing-page"),
  { ssr: true },
);

const GLOW_PRODUCT_SLUG = "skin-hair-regenerative";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(GLOW_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "Glow — Skin & Hair Regenerative Therapy | HealSend",
    description:
      product?.seoDescription ||
      "Clinician-guided regenerative therapy for skin texture, hair density, and cellular repair. Three personalized tiers.",
    path: "/glow",
    image: product?.image || null,
  });
}

export default async function GlowPage() {
  const product = await getMarketingProductPageData(GLOW_PRODUCT_SLUG);

  const serializableProduct = product
    ? JSON.parse(JSON.stringify(product))
    : null;

  return <GlowLandingPage product={serializableProduct} />;
}
