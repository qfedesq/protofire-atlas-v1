import { NextResponse } from "next/server";

import { getPublicGlobalRankingPayload } from "@/lib/public-data/service";

export function GET() {
  return NextResponse.json(getPublicGlobalRankingPayload());
}
