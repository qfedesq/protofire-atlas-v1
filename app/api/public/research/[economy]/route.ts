import { NextResponse, type NextRequest } from "next/server";

import { listActiveEconomyTypes } from "@/lib/assumptions/resolve";
import { getPublicResearchPayload } from "@/lib/public-data/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/public/research/[economy]">,
) {
  await ensureAtlasPersistence();
  const { economy } = await params;
  const resolvedEconomy = listActiveEconomyTypes().find(
    (item) => item.slug === economy,
  );

  if (!resolvedEconomy) {
    return NextResponse.json({ error: "Unknown economy." }, { status: 404 });
  }

  return NextResponse.json(getPublicResearchPayload(resolvedEconomy.slug));
}
