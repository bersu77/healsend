import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeGhlCode } from "@/lib/ghl-oauth";
import { getCurrentUser } from "@/lib/auth";
import { buildLoginPath } from "@/lib/auth-routing";
import { isGhlOAuthEnabled } from "@/lib/integration-settings";

export const dynamic = "force-dynamic";

// GET /api/ghl/oauth/callback — Handle GHL OAuth redirect
export async function GET(request) {
  if (!isGhlOAuthEnabled()) {
    return NextResponse.json(
      { error: "GHL OAuth is disabled in this environment" },
      { status: 503 },
    );
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(
        new URL(buildLoginPath("/dashboard"), request.url),
      );
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 },
      );
    }

    const result = await exchangeGhlCode(code);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Store tokens in database linked to the current user
    const expiresAt = new Date(Date.now() + result.expiresIn * 1000);

    await prisma.ghlOAuthToken.upsert({
      where: { userId: user.id },
      update: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        locationId: result.locationId,
        expiresAt,
      },
      create: {
        userId: user.id,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        locationId: result.locationId,
        expiresAt,
      },
    });

    // Redirect to dashboard after successful OAuth
    return NextResponse.redirect(
      new URL("/dashboard?ghl=connected", request.url),
    );
  } catch (err) {
    console.error("[GHL OAuth] Callback error:", err);
    return NextResponse.json(
      { error: "OAuth callback failed" },
      { status: 500 },
    );
  }
}
