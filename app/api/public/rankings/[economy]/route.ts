import { NextResponse, type NextRequest } from "next/server";

import { listEconomyTypes } from "@/lib/config/economies";
import { getPublicEconomyRankingPayload } from "@/lib/public-data/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/public/rankings/[economy]">,
) {
  await ensureAtlasPersistence();
  const { economy } = await params;
  const resolvedEconomy = listEconomyTypes().find((item) => item.slug === economy);

  if (!resolvedEconomy) {
    return NextResponse.json({ error: "Unknown economy." }, { status: 404 });
  }

  return NextResponse.json(getPublicEconomyRankingPayload(resolvedEconomy.slug));
}
