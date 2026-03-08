import Link from "next/link";

import { CitationBlock } from "@/components/public/citation-block";
import { listEconomyTypes } from "@/lib/config/economies";

export default function DataResearchPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-accent text-xs tracking-[0.16em] uppercase">Research</p>
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">
          Public research snapshots
        </h1>
        <p className="text-muted max-w-4xl text-base leading-7">
          Each economy exposes a deterministic research snapshot with top chains,
          lagging chains, and recurring gap patterns.
        </p>
      </section>

      <section className="border-border/70 divide-y border-t">
        {listEconomyTypes().map((economy) => (
          <div key={economy.slug} className="py-5">
            <p className="text-foreground text-xl font-semibold">{economy.name}</p>
            <div className="text-accent mt-3 flex flex-wrap gap-4 text-sm">
              <Link href={`/api/public/research/${economy.slug}`}>API</Link>
            </div>
          </div>
        ))}
      </section>

      <CitationBlock />
    </div>
  );
}
