/**
 * /api/follow-up-questionnaires/process
 *
 * POST — called by a cron job (or manually) to advance all PENDING
 *         follow-ups whose `scheduledFor` has passed to the SENT state.
 *         Creates the MDI voucher for each follow-up and delivers an inbox
 *         notification message to the user's client area.
 *
 * Protected by: Authorization: Bearer <CRON_SECRET>
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveFollowUpConsultationUrl } from "@/lib/follow-up-questionnaires";

function isCronAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

export async function POST(request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const due = await prisma.followUpQuestionnaire.findMany({
    where: { status: "PENDING", scheduledFor: { lte: now } },
    include: {
      user: {
        select: { id: true, email: true, name: true, mdiPatientId: true },
      },
    },
  });

  if (due.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;

  for (const followUp of due) {
    try {
      // Attempt to create the MDI voucher to get the consultation URL
      const consultationUrl = await resolveFollowUpConsultationUrl(
        followUp,
        followUp.user?.mdiPatientId || null,
      ).catch(() => null);

      await prisma.$transaction([
        prisma.followUpQuestionnaire.update({
          where: { id: followUp.id },
          data: {
            status: "SENT",
            sentAt: now,
            ...(consultationUrl
              ? {
                  consultationUrl,
                  mdiPatientId: followUp.user?.mdiPatientId || null,
                }
              : {}),
          },
        }),
        prisma.message.create({
          data: {
            userId: followUp.userId,
            subject: `Follow-up: How's your ${followUp.templateName} going?`,
            body: `Hi${followUp.user?.name ? ` ${followUp.user.name}` : ""},\n\nIt's been a few days since you completed your ${followUp.templateName} intake. Your care team would love to hear how you're doing!\n\nLog in to your account and open the Action Items tab to complete your follow-up questionnaire from your provider.\n\nThank you for trusting us with your health journey.`,
            fromAdmin: true,
            read: false,
          },
        }),
      ]);
      processed++;
    } catch (err) {
      console.error(
        `[follow-up-process] Failed to process follow-up ${followUp.id}:`,
        err,
      );
    }
  }

  return NextResponse.json({ processed, total: due.length });
}
