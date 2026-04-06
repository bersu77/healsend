import MarketingLegalPage from "@/components/marketing/legal-page";
import { buildPageMetadata } from "@/lib/seo";
import { LEGAL_PAGE_DATA } from "@/lib/legal-page-content";

const page = LEGAL_PAGE_DATA["consent-to-telehealth-2"];

export const metadata = buildPageMetadata({
  title: "Consent to Telehealth | HealSend",
  description: page.description,
  path: "/consent-to-telehealth-2",
});

export default function ConsentToTelehealthPage() {
  return <MarketingLegalPage page={page} />;
}
