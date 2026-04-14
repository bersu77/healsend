import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getMdiAccessToken,
  getMdiConfig,
  listMdiPartnerOfferings,
  listMdiPartnerQuestionnaires,
  resolveMdiCatalogSelection,
} from "@/lib/mdi-client";

/**
 * GET /api/admin/mdi/questionnaires
 *
 * Fetches all MDI questionnaires and offerings, then for every product × tier
 * combination in the local catalogue, previews which MDI questionnaire and
 * offering would be selected at checkout.
 *
 * Products can store a manual override in:
 *   product.attributes.mdiQuestionnaireId         — applies to all tiers
 *   subscriptionTier.mdi_questionnaire_id          — applies to one duration
 *
 * The response lets admins verify the auto-matching and set overrides if needed.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getMdiConfig();
  if (!config.clientId || !config.clientSecret) {
    return NextResponse.json(
      {
        error:
          "MDI credentials are not configured (MD_CLIENT_ID / MD_CLIENT_SECRET)",
      },
      { status: 503 },
    );
  }

  let accessToken;
  try {
    accessToken = await getMdiAccessToken({
      baseUrl: config.baseUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to obtain MDI access token: ${err.message}` },
      { status: 502 },
    );
  }

  const [questionnaires, offerings, products] = await Promise.all([
    listMdiPartnerQuestionnaires({ accessToken, baseUrl: config.baseUrl }),
    listMdiPartnerOfferings({ accessToken, baseUrl: config.baseUrl }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        subscriptionTiers: true,
        attributes: true,
        telehealthProvider: true,
      },
    }),
  ]);

  // For each product × tier, build a synthetic order stub and score against
  // the live MDI catalogue
  const productMappings = products
    .filter((p) => p.telehealthProvider === "MDI")
    .map((product) => {
      const tiers = Array.isArray(product.subscriptionTiers)
        ? product.subscriptionTiers
        : [];
      const attrs =
        product.attributes && typeof product.attributes === "object"
          ? product.attributes
          : {};
      const productOverrideId =
        attrs.mdiQuestionnaireId || attrs.mdi_questionnaire_id || null;

      const tierMappings = (tiers.length > 0 ? tiers : [null]).map((tier) => {
        const durationMonths = tier
          ? Number(tier.duration_months) || null
          : null;
        const tierOverrideId = tier
          ? tier.mdi_questionnaire_id || tier.mdiQuestionnaireId || null
          : null;
        const overrideId = tierOverrideId || productOverrideId;

        // Synthetic order stub — just enough for the scoring functions
        const syntheticOrder = {
          items: [
            {
              name: `${product.name}${durationMonths ? ` - ${durationMonths} Month` : ""}`,
              product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                subscriptionTiers: product.subscriptionTiers,
                attributes: product.attributes,
              },
              variant: durationMonths
                ? {
                    name: `${durationMonths} Month`,
                    attributes: { duration_months: durationMonths },
                  }
                : null,
            },
          ],
        };

        const selection = resolveMdiCatalogSelection(syntheticOrder, {
          questionnaires,
          offerings,
        });

        const autoQuestionnaireId =
          selection.questionnaire?.partner_questionnaire_id ||
          selection.questionnaire?.id ||
          null;
        const resolvedQuestionnaireId = overrideId || autoQuestionnaireId;

        // Score all questionnaires for this tier so admins can see rankings
        const allScores = questionnaires
          .map((q) => {
            const { resolveMdiCatalogSelection: _ignored, ...rest } = {};
            void rest;
            // Re-score via selection
            const sel = resolveMdiCatalogSelection(syntheticOrder, {
              questionnaires: [q],
              offerings: [],
            });
            return {
              id: q.partner_questionnaire_id || q.id,
              name: q.name || q.title || q.intro_title || "Untitled",
              score: sel.questionnaire ? 1 : 0,
              rawScore: sel.questionnaire === q ? "matched" : "unmatched",
            };
          })
          .filter((s) => s.score > 0);

        return {
          durationMonths,
          tierOverrideId: tierOverrideId || null,
          resolved: {
            questionnaireId: resolvedQuestionnaireId,
            questionnaireName:
              selection.questionnaire?.name ||
              selection.questionnaire?.title ||
              (overrideId ? "(override — id not in fetched list)" : null),
            offeringId: selection.offering?.id || null,
            offeringTitle:
              selection.offering?.title ||
              selection.offering?.product?.name ||
              null,
            source: overrideId
              ? "override"
              : selection.questionnaire
                ? "auto"
                : "none",
          },
        };
      });

      return {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productOverrideQuestionnaireId: productOverrideId || null,
        tiers: tierMappings,
      };
    });

  return NextResponse.json({
    mdiQuestionnaires: questionnaires.map((q) => ({
      id: q.partner_questionnaire_id || q.id,
      name: q.name || q.title || q.intro_title || "Untitled",
    })),
    mdiOfferings: offerings.map((o) => ({
      id: o.id,
      title: o.title || o.product?.name || "Untitled",
      daysSupply: o.product?.days_supply || o.days_supply || null,
    })),
    productMappings,
  });
}
