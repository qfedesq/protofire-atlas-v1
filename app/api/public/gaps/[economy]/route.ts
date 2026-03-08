import { NextResponse, type NextRequest } from "next/server";

import { listEconomyTypes } from "@/lib/config/economies";
import { getPublicGapsPayload } from "@/lib/public-data/service";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/public/gaps/[economy]">,
) {
  const { economy } = await params;
  const resolvedEconomy = listEconomyTypes().find((item) => item.slug === economy);

  if (!resolvedEconomy) {
    return NextResponse.json({ error: "Unknown economy." }, { status: 404 });
  }

  return NextResponse.json(getPublicGapsPayload(resolvedEconomy.slug));
}
