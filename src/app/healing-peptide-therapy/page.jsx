import dynamic from "next/dynamic";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const HealingPeptideTherapyLandingPage = dynamic(
  () => import("@/components/marketing/healing-peptide-therapy-landing-page"),
  { ssr: true },
);

const HP_PRODUCT_SLUG = "healing-peptide-therapy";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getMarketingProductPageData(HP_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "Healing Peptide Therapy — Restore Your Body's Repair Signal | HealSend",
    description:
      product?.seoDescription ||
      "Clinician-prescribed healing peptide therapy for joint pain, tendon repair, and accelerated recovery. 4-peptide protocol targeting tissue repair at the cellular level. 90-day guarantee.",
    path: "/healing-peptide-therapy",
    image: product?.image || null,
  });
}

export default async function HealingPeptideTherapyPage() {
  const product = await getMarketingProductPageData(HP_PRODUCT_SLUG);

  const serializableProduct = product
    ? JSON.parse(JSON.stringify(product))
    : null;

  return <HealingPeptideTherapyLandingPage product={serializableProduct} />;
}
