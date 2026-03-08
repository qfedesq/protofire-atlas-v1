import Link from "next/link";
import { notFound } from "next/navigation";

import { listEconomyTypes } from "@/lib/config/economies";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

const repository = createSeedChainsRepository();

export default async function EmbedModuleGapPage({
  params,
}: PageProps<"/embed/gaps/[module]">) {
  const { module } = await params;
  const matches = listEconomyTypes()
    .flatMap((economy) =>
      repository
        .listRankedChains({ economy: economy.slug })
        .filter((row) =>
          row.readinessScore.moduleBreakdown.some(
            (item) => item.module.slug === module && item.status !== "available",
          ),
        )
        .map((row) => ({
          economy,
          row,
        })),
    )
    .slice(0, 12);

  if (matches.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-accent text-xs tracking-[0.16em] uppercase">Embed</p>
        <h1 className="text-foreground mt-2 text-2xl font-semibold">
          Module gaps for {matches[0]?.row.readinessScore.moduleBreakdown.find((item) => item.module.slug === module)?.module.name ?? module}
        </h1>
      </div>
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-border/70 border-b">
            <th className="py-3 pr-4">Chain</th>
            <th className="py-3 pr-4">Economy</th>
            <th className="py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(({ economy, row }) => {
            const moduleStatus = row.readinessScore.moduleBreakdown.find(
              (item) => item.module.slug === module,
            );

            return (
              <tr
                key={`${economy.slug}:${row.chain.slug}`}
                className="border-border/60 border-b last:border-b-0"
              >
                <td className="py-3 pr-4">
                  <Link href={`/chains/${row.chain.slug}?economy=${economy.slug}`} className="text-accent hover:underline">
                    {row.chain.name}
                  </Link>
                </td>
                <td className="py-3 pr-4">{economy.shortLabel}</td>
                <td className="py-3 capitalize">{moduleStatus?.status ?? "missing"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
