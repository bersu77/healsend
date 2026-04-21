/**
 * Follow-up Questionnaire Helpers
 *
 * Server-side only. Schedules follow-up questionnaires that are delivered
 * to the user's client area 4–7 days after they complete an onboarding funnel.
 * The questionnaire itself is fetched from and hosted by MDI — no custom
 * question definitions live here.
 */

import {
  getMdiAccessToken,
  getMdiConfig,
  listMdiPartnerQuestionnaires,
  createMdiVoucher,
  normalizeMdiPayload,
} from "@/lib/mdi-client";
import { isUuidLike } from "@/lib/mdi-shared";

// ─── MDI questionnaire selection ─────────────────────────────

/**
 * Score an MDI questionnaire for suitability as a follow-up / check-in form.
 * Higher is better. Questionnaires with "follow-up", "check-in", "refill", or
 * "progress" in their title are preferred; initial-intake titles are penalised.
 */
function scoreFollowUpQuestionnaire(questionnaire) {
  const title = String(
    questionnaire?.name ||
      questionnaire?.title ||
      questionnaire?.intro_title ||
      "",
  ).toLowerCase();

  let score = 0;
  if (/follow.?up|followup/.test(title)) score += 80;
  if (/check.?in|checkin/.test(title)) score += 60;
  if (/refill/.test(title)) score += 40;
  if (/progress|ongoing|continuation/.test(title)) score += 30;
  // Penalise initial-intake questionnaires
  if (/\binitial\b|new[\s/]initial|new patient/.test(title)) score -= 50;
  return score;
}

/**
 * Fetch all MDI partner questionnaires and return the ID of the best
 * follow-up / check-in questionnaire, or null if none can be found.
 *
 * @param {{ accessToken: string, baseUrl: string }} params
 * @returns {Promise<string|null>}
 */
export async function fetchMdiFollowUpQuestionnaireId({
  accessToken,
  baseUrl,
}) {
  const questionnaires = await listMdiPartnerQuestionnaires({
    accessToken,
    baseUrl,
  });

  const ranked = questionnaires
    .map((q) => ({ q, score: scoreFollowUpQuestionnaire(q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return null;

  const best = ranked[0].q;
  return best?.partner_questionnaire_id || best?.id || null;
}

// ─── Scheduling ──────────────────────────────────────────────

/**
 * Return a random delay between 4 and 7 days (in ms).
 */
export function getFollowUpDelay() {
  const days = 4 + Math.floor(Math.random() * 4); // 4, 5, 6, or 7
  return days * 24 * 60 * 60 * 1000;
}

/**
 * Schedule a follow-up questionnaire for a user after they complete a funnel.
 * Resolves the MDI follow-up questionnaire ID at schedule time (no voucher yet —
 * the MDI patient may not be created until the intake call that follows in the
 * same request).
 *
 * @param {object} prismaClient - Prisma client instance
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.submissionId
 * @param {string} params.templateSlug
 * @param {string} params.templateName
 */
export async function scheduleFollowUp(
  prismaClient,
  { userId, submissionId, templateSlug, templateName },
) {
  const scheduledFor = new Date(Date.now() + getFollowUpDelay());

  // Attempt to resolve the MDI follow-up questionnaire ID now so we have it
  // when the follow-up becomes due and the voucher needs to be created.
  let mdiQuestionnaireId = null;
  try {
    const mdiConfig = getMdiConfig();
    if (mdiConfig.clientId && mdiConfig.clientSecret) {
      const accessToken = await getMdiAccessToken({
        baseUrl: mdiConfig.baseUrl,
        clientId: mdiConfig.clientId,
        clientSecret: mdiConfig.clientSecret,
      });
      mdiQuestionnaireId = await fetchMdiFollowUpQuestionnaireId({
        accessToken,
        baseUrl: mdiConfig.baseUrl,
      });
    }
  } catch (err) {
    console.warn(
      "[follow-up] Could not resolve MDI follow-up questionnaire ID:",
      err?.message,
    );
  }

  return prismaClient.followUpQuestionnaire.create({
    data: {
      userId,
      submissionId,
      templateSlug,
      templateName,
      scheduledFor,
      mdiQuestionnaireId,
    },
  });
}

// ─── Voucher creation (lazy — when due) ──────────────────────

/**
 * Create an MDI voucher for a due follow-up questionnaire and return the
 * consultation URL. Called when a PENDING follow-up advances to SENT.
 *
 * @param {object} followUp  - FollowUpQuestionnaire record from DB
 * @param {string|null} userMdiPatientId - MDI patient UUID for this user
 * @returns {Promise<string|null>}
 */
export async function resolveFollowUpConsultationUrl(
  followUp,
  userMdiPatientId,
) {
  if (!isUuidLike(followUp.mdiQuestionnaireId)) return null;
  if (!isUuidLike(userMdiPatientId)) return null;

  try {
    const mdiConfig = getMdiConfig();
    if (!mdiConfig.clientId || !mdiConfig.clientSecret) return null;

    const accessToken = await getMdiAccessToken({
      baseUrl: mdiConfig.baseUrl,
      clientId: mdiConfig.clientId,
      clientSecret: mdiConfig.clientSecret,
    });

    const voucherPayload = await createMdiVoucher({
      patientId: userMdiPatientId,
      questionnaireId: followUp.mdiQuestionnaireId,
      // createMdiVoucher only uses order.id for its metadata string
      order: { id: followUp.submissionId, userId: followUp.userId, items: [] },
      accessToken,
      baseUrl: mdiConfig.baseUrl,
    });

    const normalized = normalizeMdiPayload(voucherPayload);
    return normalized.consultationUrl || null;
  } catch (err) {
    console.error(
      "[follow-up] Could not create MDI voucher for follow-up:",
      err?.message,
    );
    return null;
  }
}
