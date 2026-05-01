import {
  getGlp1OnboardingDefinition,
  GLP1_ONBOARDING_SLUG,
} from "@/lib/builtin-onboarding/glp1-definition";

function sanitizeTemplateSteps(steps) {
  return steps
    .filter(
      (step) =>
        String(step?.title || "")
          .trim()
          .toLowerCase() !== "tell us about your health",
    )
    .map((step, index) => ({
      ...step,
      order: index + 1,
    }));
}

/**
 * If no onboarding row exists for GLP‑1 yet, creates it from
 * {@link getGlp1OnboardingDefinition} so Prisma FKs (checkout / submissions)
 * work. Canonical copy stays in source; DB only stores a persisted instance.
 *
 * Does not overwrite an existing `glp-1` template (dashboard / seeded data wins).
 */
export async function ensureGlp1BuiltinTemplateSynced(prisma) {
  const existing = await prisma.onboardingTemplate.findUnique({
    where: { slug: GLP1_ONBOARDING_SLUG },
  });
  if (existing) {
    return existing;
  }

  const def = getGlp1OnboardingDefinition();
  let productId = null;
  if (def.productSlug) {
    const prod = await prisma.product.findUnique({
      where: { slug: def.productSlug },
    });
    productId = prod?.id ?? null;
  }

  const sanitizedSteps = sanitizeTemplateSteps(def.steps);

  try {
    return await prisma.onboardingTemplate.create({
      data: {
        name: def.name,
        slug: def.slug,
        description: def.description,
        active: true,
        productId,
        styling: def.styling ?? {
          checkoutPricingMode: "ALL_AT_ONCE",
          delayedChargeDays: 20,
        },
        steps: {
          create: sanitizedSteps.map((s, i) => ({
            title: s.title,
            subtitle: s.subtitle || null,
            type: s.type,
            order: i + 1,
            config: s.config || {},
            required: s.required ?? true,
          })),
        },
      },
    });
  } catch (err) {
    if (err?.code === "P2002") {
      return prisma.onboardingTemplate.findUnique({
        where: { slug: GLP1_ONBOARDING_SLUG },
      });
    }
    throw err;
  }
}
