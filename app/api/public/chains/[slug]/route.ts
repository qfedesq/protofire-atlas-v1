import { NextResponse, type NextRequest } from "next/server";

import { getPublicChainPayload } from "@/lib/public-data/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/public/chains/[slug]">,
) {
  await ensureAtlasPersistence();
  const { slug } = await params;
  const payload = getPublicChainPayload(slug);

  if (!payload) {
    return NextResponse.json({ error: "Unknown chain." }, { status: 404 });
  }

  return NextResponse.json(payload);
}
