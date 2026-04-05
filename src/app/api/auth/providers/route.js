import { NextResponse } from "next/server";
import { getPublicAuthProviderConfig } from "@/lib/integration-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPublicAuthProviderConfig());
}
