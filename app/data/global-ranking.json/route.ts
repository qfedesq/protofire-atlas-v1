import { getPublicGlobalRankingPayload } from "@/lib/public-data/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export async function GET() {
  await ensureAtlasPersistence();
  return Response.json(getPublicGlobalRankingPayload());
}
