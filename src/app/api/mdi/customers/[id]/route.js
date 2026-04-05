import {
  buildUserMdiUpdate,
  isAuthorizedMdiRequest,
  normalizeMdiPayload,
  resolveUserFromRouteId,
  upsertMdiPatientMessageSync,
} from "@/lib/mdi-client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    mdiPatientId: user.mdiPatientId,
    mdiPatientStatus: user.mdiPatientStatus,
    mdiLastSyncedAt: user.mdiLastSyncedAt,
  };
}

export async function GET(request, { params }) {
  if (!isAuthorizedMdiRequest(Object.fromEntries(request.headers.entries()))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const user = await resolveUserFromRouteId(id);
  if (!user) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, customer: serializeUser(user) });
}

export async function PATCH(request, { params }) {
  if (!isAuthorizedMdiRequest(Object.fromEntries(request.headers.entries()))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const user = await resolveUserFromRouteId(id);
  if (!user) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const normalized = normalizeMdiPayload(body);
  const update = buildUserMdiUpdate({
    ...body,
    patient_id: normalized.patientId || body.patient_id || body.patientId,
    patient_status:
      normalized.patientStatus || body.patient_status || body.patientStatus,
  });

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No patient linkage fields provided" },
      { status: 400 },
    );
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const nextUser = await tx.user.update({
      where: { id: user.id },
      data: update,
    });

    await upsertMdiPatientMessageSync(tx, normalized, user.id);
    return nextUser;
  });

  return NextResponse.json({ ok: true, customer: serializeUser(updatedUser) });
}
