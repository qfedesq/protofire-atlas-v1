import type { NextRequest } from "next/server";

import { listActiveEconomyTypes } from "@/lib/assumptions/resolve";
import { buildBadgeSvg } from "@/lib/badges/svg";
import { getPublicChainPayload } from "@/lib/public-data/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/badge/chains/[slug]/[economy]">,
) {
  await ensureAtlasPersistence();
  const { slug, economy } = await params;
  const resolvedEconomy = listActiveEconomyTypes().find(
    (item) => item.slug === economy,
  );
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
