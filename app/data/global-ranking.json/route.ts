import { getPublicGlobalRankingPayload } from "@/lib/public-data/service";

export function GET() {
  return Response.json(getPublicGlobalRankingPayload());
}
