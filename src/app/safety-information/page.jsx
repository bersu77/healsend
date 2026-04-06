import MarketingLegalPage from "@/components/marketing/legal-page";
import { buildPageMetadata } from "@/lib/seo";
import { LEGAL_PAGE_DATA } from "@/lib/legal-page-content";

const page = LEGAL_PAGE_DATA["safety-information"];

export const metadata = buildPageMetadata({
  title: "Safety Information | HealSend",
  description: page.description,
  path: "/safety-information",
});

export default function SafetyInformationPage() {
  return <MarketingLegalPage page={page} />;
}
