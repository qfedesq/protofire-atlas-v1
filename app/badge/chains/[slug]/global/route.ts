import type { NextRequest } from "next/server";

import { buildBadgeSvg } from "@/lib/badges/svg";
import { getPublicChainPayload } from "@/lib/public-data/service";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/badge/chains/[slug]/global">,
) {
  const { slug } = await params;
  const payload = getPublicChainPayload(slug);

  if (!payload) {
    return new Response("Unknown chain", { status: 404 });
  }

  return new Response(
    buildBadgeSvg({
      label: `${payload.chain.name} Global Score`,
      value: `${payload.global_score} · Rank #${payload.global_rank}`,
    }),
    {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
      },
    },
  );
}
