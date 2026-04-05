import { getCurrentUser } from "@/lib/auth";
import {
  findMdiPatientByEmail,
  getMdiAccessToken,
  getMdiConfig,
  getMdiMessagingAuth,
} from "@/lib/mdi-client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "").trim(),
  );
}

/**
 * POST /api/account/mdi/portal-auth
 *
 * Lightweight endpoint to get (or refresh) a white-label portal auth URL for
 * the current user. Called by the in-account iframe when its session expires.
 *
 * Body (optional): { caseId?: string }
 * Response: { ok, consultationUrl, verificationCode }
 */
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, clientSecret } = getMdiConfig();
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "MDI credentials not configured" },
      { status: 503 },
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // no body is fine
  }
  const caseId = body?.caseId || undefined;

  let accessToken;
  try {
    accessToken = await getMdiAccessToken({ clientId, clientSecret });
  } catch {
    return NextResponse.json(
      { error: "Failed to obtain MDI access token" },
      { status: 502 },
    );
  }

  // Resolve patientId — use cached value or look it up by email
  let patientId = isValidUuid(user.mdiPatientId) ? user.mdiPatientId : null;

  if (!patientId && user.email) {
    try {
      const found = await findMdiPatientByEmail({
        email: user.email,
        accessToken,
      });
      if (isValidUuid(found)) {
        patientId = found;
        await prisma.user.updateMany({
          where: { id: user.id, mdiPatientId: null },
          data: { mdiPatientId: patientId },
        });
      }
    } catch {
      // Non-fatal
    }
  }

  if (!patientId) {
    return NextResponse.json(
      { error: "No MDI patient record found for this account" },
      { status: 404 },
    );
  }

  try {
    const auth = await getMdiMessagingAuth({
      accessToken,
      patientId,
      caseId,
    });

    return NextResponse.json({
      ok: true,
      consultationUrl: auth.consultationUrl,
      verificationCode: auth.verificationCode || null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to get portal auth URL" },
      { status: 502 },
    );
  }
}
