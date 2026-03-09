import Link from "next/link";
import { notFound } from "next/navigation";

import { listActiveEconomyTypes } from "@/lib/assumptions/resolve";
import { getPublicEconomyRankingPayload } from "@/lib/public-data/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export default async function EmbedEconomyRankingPage({
  params,
}: PageProps<"/embed/rankings/[economy]">) {
  await ensureAtlasPersistence();
  const { economy } = await params;
  const resolvedEconomy = listActiveEconomyTypes().find(
    (item) => item.slug === economy,
  );

  if (!resolvedEconomy) {
    notFound();
  }

  const payload = getPublicEconomyRankingPayload(resolvedEconomy.slug);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-accent text-xs tracking-[0.16em] uppercase">Embed</p>
        <h1 className="text-foreground mt-2 text-2xl font-semibold">
          {payload.economy_name}
        </h1>
      </div>
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-border/70 border-b">
            <th className="py-3 pr-4">Rank</th>
            <th className="py-3 pr-4">Chain</th>
            <th className="py-3 pr-4">Score</th>
            <th className="py-3">Missing modules</th>
          </tr>
        </thead>
        <tbody>
          {payload.rows.slice(0, 10).map((row) => (
            <tr key={row.chain.slug} className="border-border/60 border-b last:border-b-0">
              <td className="py-3 pr-4">#{row.rank}</td>
              <td className="py-3 pr-4">
                <Link
                  href={`/chains/${row.chain.slug}?economy=${payload.economy}`}
                  className="text-accent hover:underline"
                >
                  {row.chain.name}
                </Link>
              </td>
              <td className="py-3 pr-4">{row.score}</td>
              <td className="py-3">{row.missing_modules.join(", ") || "None"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
