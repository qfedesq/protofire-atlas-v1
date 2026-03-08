import Link from "next/link";

import { CitationBlock } from "@/components/public/citation-block";
import { listEconomyTypes } from "@/lib/config/economies";

export default function DataRankingsPage() {
  const economies = listEconomyTypes();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-accent text-xs tracking-[0.16em] uppercase">Data rankings</p>
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">
          Ranking exports
        </h1>
        <p className="text-muted max-w-4xl text-base leading-7">
          Download the Atlas ranking datasets or query the same public data over the
          read-only API.
        </p>
      </section>

      <section className="border-border/70 divide-y border-t">
        <div className="py-5">
          <p className="text-foreground text-xl font-semibold">Global ranking</p>
          <div className="text-accent mt-3 flex flex-wrap gap-4 text-sm">
            <Link href="/data/global-ranking.json">JSON</Link>
            <Link href="/data/global-ranking.csv">CSV</Link>
            <Link href="/api/public/rankings/global">API</Link>
          </div>
        </div>
        {economies.map((economy) => (
          <div key={economy.slug} className="py-5">
            <p className="text-foreground text-xl font-semibold">{economy.name}</p>
            <div className="text-accent mt-3 flex flex-wrap gap-4 text-sm">
              <Link href={`/data/economy/${economy.slug}.json`}>JSON</Link>
              <Link href={`/data/economy/${economy.slug}.csv`}>CSV</Link>
              <Link href={`/api/public/rankings/${economy.slug}`}>API</Link>
            </div>
          </div>
        ))}
      </section>

      <CitationBlock />
    </div>
  );
}
