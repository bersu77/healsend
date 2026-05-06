import { notFound } from "next/navigation";
import EnclomipheneLandingPage from "@/components/marketing/enclomiphene-landing-page";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const ENCLO_PRODUCT_SLUG = "enclomiphene";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const product = await getMarketingProductPageData(ENCLO_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      "Enclomiphene — Natural Testosterone Support | HealSend",
    description:
      product?.seoDescription ||
      "Raise your testosterone naturally while preserving fertility. Clinician-guided enclomiphene therapy from HealSend.",
    path: "/enclomiphene",
    image: product?.image || null,
  });
}

export default async function EnclomiphenePage() {
  const product = await getMarketingProductPageData(ENCLO_PRODUCT_SLUG);

  if (!product) {
    notFound();
  }

  const serializableProduct = JSON.parse(JSON.stringify(product));
  return <EnclomipheneLandingPage product={serializableProduct} />;
}
