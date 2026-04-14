import { getCurrentUser } from "@/lib/auth";
import { searchOlaPharmacy } from "@/lib/ola-client";
import { NextResponse } from "next/server";

/**
 * GET /api/ola/pharmacy-search?name=...&city=...&state=...&zip_code=...
 *
 * Proxied pharmacy search (DoseSpot) through OLA.
 */
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = {
    name: searchParams.get("name") || undefined,
    city: searchParams.get("city") || undefined,
    state: searchParams.get("state") || undefined,
    zipCode:
      searchParams.get("zip_code") || searchParams.get("zipCode") || undefined,
  };

  if (!query.name && !query.city && !query.state && !query.zipCode) {
    return NextResponse.json(
      { error: "At least one search parameter is required." },
      { status: 400 },
    );
  }

  try {
    const result = await searchOlaPharmacy(query);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[OLA] pharmacy-search error:", err);
    return NextResponse.json(
      { error: "Failed to search pharmacies." },
      { status: 500 },
    );
  }
}
