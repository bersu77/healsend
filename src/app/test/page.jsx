import { buildPageMetadata } from "@/lib/seo";
import TestHeroPreview from "./TestHeroPreview";

export const metadata = buildPageMetadata({
  title: "Hero Section Test | HealSend",
  description:
    "Local full-screen hero section prototype for reviewing new homepage layouts before moving them into production.",
  path: "/test",
  noIndex: true,
});

export default function TestPage() {
  return <TestHeroPreview />;
}
