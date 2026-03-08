import Link from "next/link";

import { CitationBlock } from "@/components/public/citation-block";

const resources = [
  {
    href: "/data/rankings",
    title: "Rankings",
    description: "Download the global and economy ranking datasets in JSON or CSV.",
  },
  {
    href: "/data/research",
    title: "Research",
    description: "Read the public research snapshots and economy gap summaries.",
  },
  {
    href: "/data/gaps",
    title: "Gap datasets",
    description: "Inspect chain-level missing and weak modules by economy.",
  },
];

export default function DataIndexPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-accent text-xs tracking-[0.16em] uppercase">Public data</p>
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">
          Atlas public dataset access
        </h1>
        <p className="text-muted max-w-4xl text-base leading-7">
          Atlas exposes read-only rankings, research summaries, gap datasets, and
          public APIs for the current benchmark model.
        </p>
      </section>

      <section className="border-border/70 divide-y border-t">
        {resources.map((resource) => (
          <div key={resource.href} className="py-5">
            <Link href={resource.href} className="text-foreground text-xl font-semibold hover:text-accent">
              {resource.title}
            </Link>
            <p className="text-muted mt-2 max-w-3xl text-sm leading-6">
              {resource.description}
            </p>
          </div>
        ))}
      </section>

      <CitationBlock />
    </div>
  );
}
