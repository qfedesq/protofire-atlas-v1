import type { NextRequest } from "next/server";

import { listEconomyTypes } from "@/lib/config/economies";
import { buildBadgeSvg } from "@/lib/badges/svg";
import { getPublicChainPayload } from "@/lib/public-data/service";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/badge/chains/[slug]/[economy]">,
) {
  const { slug, economy } = await params;
  const resolvedEconomy = listEconomyTypes().find((item) => item.slug === economy);
  const payload = getPublicChainPayload(slug);

  if (!resolvedEconomy || !payload) {
    return new Response("Unknown chain or economy", { status: 404 });
  }

  const economySnapshot = payload.economies.find((item) => item.economy === resolvedEconomy.slug);

  if (!economySnapshot) {
    return new Response("Unknown chain or economy", { status: 404 });
  }

  return new Response(
    buildBadgeSvg({
      label: `${resolvedEconomy.shortLabel} Rank`,
      value: `#${economySnapshot.rank} · Score ${economySnapshot.score}`,
    }),
    {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
      },
    },
  );
}
