import { notFound } from "next/navigation";
import DynamicOnboardingClient from "./onboarding-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { buildPageMetadata } from "@/lib/seo";
import { sanitizeOnboardingTemplate } from "@/lib/onboarding-template-utils";
import { ensureGlp1BuiltinTemplateSynced } from "@/lib/builtin-onboarding/ensure-glp1-template";
import { GLP1_ONBOARDING_SLUG } from "@/lib/builtin-onboarding/glp1-definition";

export const dynamic = "force-dynamic";

async function getOnboardingTemplate(slug) {
  let template = await prisma.onboardingTemplate.findFirst({
    where: {
      OR: [{ id: slug }, { slug }],
    },
    include: {
      steps: { orderBy: { order: "asc" } },
      category: true,
      _count: { select: { submissions: true } },
    },
  });

  if (!template && slug === GLP1_ONBOARDING_SLUG) {
    await ensureGlp1BuiltinTemplateSynced(prisma);
    template = await prisma.onboardingTemplate.findFirst({
      where: {
        OR: [{ id: slug }, { slug }],
      },
      include: {
        steps: { orderBy: { order: "asc" } },
        category: true,
        _count: { select: { submissions: true } },
      },
    });
  }

  return sanitizeOnboardingTemplate(template);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const template = await getOnboardingTemplate(slug);

  if (!template) {
    return buildPageMetadata({
      title: "Funnel Not Found | HealSend",
      description: "This HealSend funnel could not be found.",
      path: `/funnels/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${template.name} | HealSend`,
    description:
      template.description ||
      `Start the ${template.name} funnel with HealSend.`,
    path: `/funnels/${slug}`,
    noIndex: true,
  });
}

export default async function DynamicOnboardingPage({ params }) {
  const { slug } = await params;
  const [template, user] = await Promise.all([
    getOnboardingTemplate(slug),
    getCurrentUser(),
  ]);

  if (!template) {
    notFound();
  }

  const serializableTemplate = JSON.parse(JSON.stringify(template));

  return (
    <DynamicOnboardingClient
      initialTemplate={serializableTemplate}
      initialIsLoggedIn={Boolean(user)}
    />
  );
}
