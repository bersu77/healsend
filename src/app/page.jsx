import { notFound } from "next/navigation";
import MarketingProductPage from "@/components/marketing/product-page";
import { getMarketingProductPageData } from "@/lib/marketing-data";
import { buildPageMetadata } from "@/lib/seo";

const HOME_PRODUCT_SLUG = "tirzepatide-injections";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const product = await getMarketingProductPageData(HOME_PRODUCT_SLUG);

  return buildPageMetadata({
    title:
      product?.seoTitle ||
      (product?.name ? `${product.name} | HealSend` : "HealSend"),
    description:
      product?.seoDescription ||
      product?.summary ||
      product?.tabs?.description ||
      "Personalized treatment options from HealSend.",
    path: "/",
    image: product?.image || product?.heroImage || null,
  });
}

export default async function HomePage() {
  const product = await getMarketingProductPageData(HOME_PRODUCT_SLUG);

  if (!product) {
    notFound();
  }

  const serializableProduct = JSON.parse(JSON.stringify(product));
  return <MarketingProductPage product={serializableProduct} />;
}
