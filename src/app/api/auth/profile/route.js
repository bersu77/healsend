import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// PUT /api/auth/profile — update user profile
export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { name, phone, dateOfBirth } = body;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name !== undefined ? name : user.name,
      phone: phone !== undefined ? phone : user.phone,
      dateOfBirth:
        dateOfBirth === undefined
          ? user.dateOfBirth
          : dateOfBirth
            ? new Date(dateOfBirth)
            : null,
    },
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      phone: updated.phone,
      dateOfBirth: updated.dateOfBirth,
      role: updated.role,
    },
  });
}
