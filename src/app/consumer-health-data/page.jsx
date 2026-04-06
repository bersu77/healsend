import MarketingLegalPage from "@/components/marketing/legal-page";
import { buildPageMetadata } from "@/lib/seo";
import { LEGAL_PAGE_DATA } from "@/lib/legal-page-content";

const page = LEGAL_PAGE_DATA["consumer-health-data"];

export const metadata = buildPageMetadata({
  title: "Consumer Health Data Policy | HealSend",
  description: page.description,
  path: "/consumer-health-data",
});

export default function ConsumerHealthDataPage() {
  return <MarketingLegalPage page={page} />;
}
