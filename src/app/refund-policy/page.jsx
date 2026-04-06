import MarketingLegalPage from "@/components/marketing/legal-page";
import { buildPageMetadata } from "@/lib/seo";
import { LEGAL_PAGE_DATA } from "@/lib/legal-page-content";

const page = LEGAL_PAGE_DATA["refund-policy"];

export const metadata = buildPageMetadata({
  title: "Refund Policy | HealSend",
  description: page.description,
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return <MarketingLegalPage page={page} />;
}
