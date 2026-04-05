import { notFound, permanentRedirect } from "next/navigation";
import MarketingArticlePage from "@/components/marketing/article-page";
import MarketingCategoryPage from "@/components/marketing/category-page";
import MarketingCustomPage from "@/components/marketing/custom-page";
import MarketingLegalPage from "@/components/marketing/legal-page";
import MarketingPsychiatryPage from "@/components/marketing/psychiatry-page";
import MarketingProductPage from "@/components/marketing/product-page";
import {
  getMarketingCategoryPageData,
  getMarketingCustomPageData,
  getMarketingProductPageData,
} from "@/lib/marketing-data";
import { getLegalRouteLabel } from "@/lib/legal-links";
import { resolveMarketingProductSlug } from "@/lib/marketing-pages";
import { getMarketingProductDetailPath } from "@/lib/product-routing";
import { buildPageMetadata, humanizeSlugTitle, isSlugLikeTitle } from "@/lib/seo";

export const dynamic = "force-dynamic";

function resolveCustomPageTitle(customPage, slug) {
  if (customPage.nativeTemplate === "legalDocument") {
    return getLegalRouteLabel(slug) || humanizeSlugTitle(slug);
  }

  if (customPage.title && !isSlugLikeTitle(customPage.title, slug)) {
    return customPage.title;
  }

  return humanizeSlugTitle(slug);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const resolvedProductSlug = resolveMarketingProductSlug(slug);
  if (resolvedProductSlug && resolvedProductSlug !== slug) {
    const canonicalProductPath = getMarketingProductDetailPath(resolvedProductSlug);

    return buildPageMetadata({
      title: `${humanizeSlugTitle(resolvedProductSlug)} | HealSend`,
      description: "Personalized treatment options from HealSend.",
      path: canonicalProductPath || `/${resolvedProductSlug}`,
    });
  }

  const page = await getMarketingCategoryPageData(slug);
  if (page) {
    return buildPageMetadata({
      title: page.seoTitle || `${page.title} | HealSend`,
      description: page.seoDescription || page.description,
      path: `/${slug}`,
      image: page.heroImage || null,
    });
  }

  const product = await getMarketingProductPageData(slug);
  if (product) {
    const canonicalProductPath = getMarketingProductDetailPath(product.slug);

    return buildPageMetadata({
      title: product.seoTitle || `${product.name} | HealSend`,
      description:
        product.seoDescription ||
        product.summary ||
        product.tabs?.description ||
        "Personalized treatment options from HealSend.",
      path: canonicalProductPath || `/${slug}`,
      image: product.image || product.heroImage || null,
    });
  }

  const customPage = await getMarketingCustomPageData(slug);
  if (customPage) {
    const readableTitle = resolveCustomPageTitle(customPage, slug);

    return buildPageMetadata({
      title: customPage.seoTitle || `${readableTitle} | HealSend`,
      description: customPage.seoDescription || customPage.description,
      path: customPage.redirectTo || `/${slug}`,
      image: customPage.heroImage || null,
      noIndex: customPage.noIndex === true,
      type:
        customPage.nativeTemplate === "editorialArticle" ||
        customPage.sourcePostType === "post"
          ? "article"
          : "website",
    });
  }

  return buildPageMetadata({
    title: "HealSend",
    description:
      "Clinician-guided treatment, onboarding, and ongoing care through HealSend.",
    path: `/${slug}`,
    noIndex: true,
  });
}

export default async function MarketingSlugPage({ params }) {
  const { slug } = await params;
  const resolvedProductSlug = resolveMarketingProductSlug(slug);
  if (resolvedProductSlug && resolvedProductSlug !== slug) {
    const canonicalProductPath = getMarketingProductDetailPath(resolvedProductSlug);

    if (canonicalProductPath && canonicalProductPath !== `/${slug}`) {
      permanentRedirect(canonicalProductPath);
    }
  }

  const page = await getMarketingCategoryPageData(slug);
  if (page) {
    return <MarketingCategoryPage page={page} />;
  }

  const product = await getMarketingProductPageData(slug);
  if (product) {
    const canonicalProductPath = getMarketingProductDetailPath(product.slug);

    if (canonicalProductPath && canonicalProductPath !== `/${slug}`) {
      permanentRedirect(canonicalProductPath);
    }

    const serializableProduct = JSON.parse(JSON.stringify(product));
    return <MarketingProductPage product={serializableProduct} />;
  }

  const customPage = await getMarketingCustomPageData(slug);
  if (customPage) {
    if (customPage.nativeTemplate === "psychiatry") {
      const serializablePage = JSON.parse(JSON.stringify(customPage));
      return <MarketingPsychiatryPage page={serializablePage} />;
    }

    if (
      customPage.nativeTemplate === "medicationLanding" ||
      customPage.nativeTemplate === "treatmentLanding"
    ) {
      const serializableProduct = JSON.parse(
        JSON.stringify(customPage.productPageData || customPage),
      );
      return <MarketingProductPage product={serializableProduct} />;
    }

    if (customPage.nativeTemplate === "editorialArticle") {
      const serializablePage = JSON.parse(JSON.stringify(customPage));
      return <MarketingArticlePage page={serializablePage} />;
    }

    if (customPage.nativeTemplate === "legalDocument") {
      const serializablePage = JSON.parse(JSON.stringify(customPage));
      return <MarketingLegalPage page={serializablePage} />;
    }

    if (customPage.redirectTo) {
      permanentRedirect(customPage.redirectTo);
    }

    const serializablePage = JSON.parse(JSON.stringify(customPage));
    return <MarketingCustomPage page={serializablePage} />;
  }

  notFound();
}
