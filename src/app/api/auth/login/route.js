import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";

// POST /api/auth/login — authenticate user
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  // User signed up with OAuth only — no password set
  if (!user.passwordHash) {
    const provider = user.authProvider === "apple" ? "Apple" : "Google";
    return NextResponse.json(
      {
        error: `This account uses ${provider} sign-in. Please use the "${provider}" button to log in.`,
      },
      { status: 400 },
    );
  }

  const passwordCheck = await verifyPassword(password, user.passwordHash);

  if (!passwordCheck.valid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  if (passwordCheck.upgradedHash) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: passwordCheck.upgradedHash },
    });
  }

  // Create session
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await prisma.session.create({
    data: { userId: user.id, token, expiresAt },
  });

  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });

  response.cookies.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
