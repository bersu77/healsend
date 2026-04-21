/**
 * /api/follow-up-questionnaires
 *
 * GET  — return all due (scheduledFor <= now, status SENT) follow-ups for the
 *         authenticated user. Creates the MDI voucher (consultation URL) for
 *         each follow-up as it transitions from PENDING → SENT.
 * PATCH — mark a follow-up as completed once the user finishes the MDI form.
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveFollowUpConsultationUrl } from "@/lib/follow-up-questionnaires";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Find PENDING follow-ups whose scheduled time has arrived
  const duePending = await prisma.followUpQuestionnaire.findMany({
    where: {
      userId: user.id,
      status: "PENDING",
      scheduledFor: { lte: now },
    },
  });

  // Advance each one to SENT, creating the MDI voucher to get the URL
  for (const followUp of duePending) {
    try {
      const consultationUrl = await resolveFollowUpConsultationUrl(
        followUp,
        user.mdiPatientId || null,
      );

      await prisma.followUpQuestionnaire.update({
        where: { id: followUp.id },
        data: {
          status: "SENT",
          sentAt: now,
          ...(consultationUrl
            ? { consultationUrl, mdiPatientId: user.mdiPatientId }
            : {}),
        },
      });
    } catch (err) {
      console.error(
        `[follow-up] Failed to advance follow-up ${followUp.id} to SENT:`,
        err,
      );
      // Still mark as SENT so the user can see it even without a URL
      await prisma.followUpQuestionnaire
        .update({
          where: { id: followUp.id },
          data: { status: "SENT", sentAt: now },
        })
        .catch(() => {});
    }
  }

  const followUps = await prisma.followUpQuestionnaire.findMany({
    where: {
      userId: user.id,
      status: { in: ["SENT", "COMPLETED"] },
    },
    orderBy: { scheduledFor: "desc" },
  });

  return NextResponse.json({ followUps });
}

export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id } = body || {};

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { error: "Missing follow-up id" },
      { status: 400 },
    );
  }

  const followUp = await prisma.followUpQuestionnaire.findFirst({
    where: { id, userId: user.id, status: "SENT" },
  });

  if (!followUp) {
    return NextResponse.json(
      { error: "Follow-up not found or already completed" },
      { status: 404 },
    );
  }

  const updated = await prisma.followUpQuestionnaire.update({
    where: { id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  return NextResponse.json({ followUp: updated });
}
