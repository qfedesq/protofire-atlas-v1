import Link from "next/link";

import { getPublicGlobalRankingPayload } from "@/lib/public-data/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export default async function EmbedGlobalRankingPage() {
  await ensureAtlasPersistence();
  const payload = getPublicGlobalRankingPayload();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-accent text-xs tracking-[0.16em] uppercase">Embed</p>
        <h1 className="text-foreground mt-2 text-2xl font-semibold">
          Global Chain Ranking
        </h1>
      </div>
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-border/70 border-b">
            <th className="py-3 pr-4">Rank</th>
            <th className="py-3 pr-4">Chain</th>
            <th className="py-3 pr-4">Global Score</th>
            <th className="py-3 pr-4">Economy Composite</th>
            <th className="py-3">Ecosystem</th>
          </tr>
        </thead>
        <tbody>
          {payload.rows.slice(0, 10).map((row) => (
            <tr key={row.chain.slug} className="border-border/60 border-b last:border-b-0">
              <td className="py-3 pr-4">#{row.rank}</td>
              <td className="py-3 pr-4">
                <Link href={`/chains/${row.chain.slug}`} className="text-accent hover:underline">
                  {row.chain.name}
                </Link>
              </td>
              <td className="py-3 pr-4">{row.score}</td>
              <td className="py-3 pr-4">{row.economy_composite_score}</td>
              <td className="py-3">{row.ecosystem_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
