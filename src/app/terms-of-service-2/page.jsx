import MarketingLegalPage from "@/components/marketing/legal-page";
import { buildPageMetadata } from "@/lib/seo";
import { LEGAL_PAGE_DATA } from "@/lib/legal-page-content";

const page = LEGAL_PAGE_DATA["terms-of-service-2"];

export const metadata = buildPageMetadata({
  title: "Terms of Service | HealSend",
  description: page.description,
  path: "/terms-of-service-2",
});

export default function TermsOfServicePage() {
  return <MarketingLegalPage page={page} />;
}
