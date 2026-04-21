import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { syncNewUserToGhl } from "@/lib/ghl-sync";
import { linkMdiPatientOnSignup } from "@/lib/mdi-client";
import {
  convertReferral,
  resolveAffiliateLinkByCode,
  createOrRefreshReferral,
} from "@/lib/affiliate-service";
import { REFERRAL_COOKIE_NAME } from "@/lib/affiliate-constants";
import { NextResponse } from "next/server";

/**
 * Attempt to convert an affiliate referral for a newly registered user.
 * Reads the hs_ref cookie, resolves the link, creates/refreshes the Referral
 * row, then marks it converted. All errors are swallowed — referral tracking
 * must never break the signup flow.
 */
async function convertReferralOnSignup(request, newUserId) {
  const refCode = request.cookies.get(REFERRAL_COOKIE_NAME)?.value;
  if (!refCode) return;

  const link = await resolveAffiliateLinkByCode(refCode);
  if (!link?.application?.userId) return;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";

  // Ensure a Referral row exists (visitor may not have hit /api/referral/track)
  const referral = await createOrRefreshReferral({
    linkId: link.id,
    referrerId: link.application.userId,
    ip,
    userAgent: request.headers.get("user-agent") || "",
  });

  await convertReferral({ referralId: referral.id, referredUserId: newUserId });
}

// POST /api/auth/register — create a new user account
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
  const { email, password, name, phone, dateOfBirth } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 },
    );
  }

  // Check password length
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = hashPassword(password);
  let parsedDob = null;
  if (dateOfBirth) {
    const d = new Date(dateOfBirth);
    if (!isNaN(d.getTime())) parsedDob = d;
  }
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      dateOfBirth: parsedDob,
      role: "CUSTOMER",
    },
  });

  // Sync new user to GoHighLevel CRM (non-blocking)
  syncNewUserToGhl(user).catch(() => {});

  // Link MDI patient if one already exists for this email (non-blocking)
  linkMdiPatientOnSignup(user.id, user.email).catch(() => {});

  // Convert referral if visitor arrived via an affiliate link (non-blocking)
  convertReferralOnSignup(request, user.id).catch(() => {});

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
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });

  return response;
}
