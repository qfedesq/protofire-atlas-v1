import { NextResponse, type NextRequest } from "next/server";

import { getPublicChainPayload } from "@/lib/public-data/service";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/public/chains/[slug]">,
) {
  const { slug } = await params;
  const payload = getPublicChainPayload(slug);

  if (!payload) {
    return NextResponse.json({ error: "Unknown chain." }, { status: 404 });
  }

  return NextResponse.json(payload);
}
