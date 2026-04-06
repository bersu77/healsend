import MarketingLegalPage from "@/components/marketing/legal-page";
import { buildPageMetadata } from "@/lib/seo";
import { LEGAL_PAGE_DATA } from "@/lib/legal-page-content";

const page = LEGAL_PAGE_DATA["privacy-policy"];

export const metadata = buildPageMetadata({
  title: "Privacy Policy | HealSend",
  description: page.description,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <MarketingLegalPage page={page} />;
}
