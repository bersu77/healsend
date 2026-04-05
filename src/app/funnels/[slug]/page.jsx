import OnboardingPage, {
  generateMetadata as generateOnboardingMetadata,
} from "../../onboarding/[slug]/page";

export const dynamic = "force-dynamic";

export async function generateMetadata(context) {
  return generateOnboardingMetadata(context);
}

export default OnboardingPage;
