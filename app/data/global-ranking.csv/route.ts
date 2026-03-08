import { buildPublicGlobalRankingCsv } from "@/lib/public-data/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export async function GET() {
  await ensureAtlasPersistence();
  return new Response(buildPublicGlobalRankingCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="global-ranking.csv"',
    },
  });
}
