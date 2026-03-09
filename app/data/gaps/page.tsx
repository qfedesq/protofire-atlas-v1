import Link from "next/link";

import { CitationBlock } from "@/components/public/citation-block";
import { listActiveEconomyTypes } from "@/lib/assumptions/resolve";

export default function DataGapsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-accent text-xs tracking-[0.16em] uppercase">Gap datasets</p>
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">
          Public gap exports
        </h1>
        <p className="text-muted max-w-4xl text-base leading-7">
          Inspect chain-level missing and weak modules for each supported economy.
        </p>
      </section>

      <section className="border-border/70 divide-y border-t">
        {listActiveEconomyTypes().map((economy) => (
          <div key={economy.slug} className="py-5">
            <p className="text-foreground text-xl font-semibold">{economy.name}</p>
            <div className="text-accent mt-3 flex flex-wrap gap-4 text-sm">
              <Link href={`/data/gaps/${economy.slug}.json`}>JSON</Link>
              <Link href={`/api/public/gaps/${economy.slug}`}>API</Link>
            </div>
          </div>
        ))}
      </section>

      <CitationBlock />
    </div>
  );
}
