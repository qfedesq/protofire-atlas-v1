import { buildPublicGlobalRankingCsv } from "@/lib/public-data/service";

export function GET() {
  return new Response(buildPublicGlobalRankingCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="global-ranking.csv"',
    },
  });
}
