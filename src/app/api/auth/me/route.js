import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/auth/me — get current authenticated user
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
}
