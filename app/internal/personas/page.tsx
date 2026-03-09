import Link from "next/link";

import { InternalNav } from "@/components/internal/internal-nav";
import { Panel } from "@/components/ui/panel";
import { requireAuthenticatedInternalUser } from "@/lib/admin/auth";
import { listBuyerPersonas } from "@/lib/personas/store";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export default async function InternalPersonasPage() {
  await ensureAtlasPersistence();
  await requireAuthenticatedInternalUser("/internal/personas");
  const personas = listBuyerPersonas();

  return (
    <div className="space-y-6">
      <InternalNav currentHref="/internal/personas" />

      <Panel className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Internal personas
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold">
            Buyer persona library
          </h1>
          <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
            Structured buyer profiles generated from Atlas chain context, roadmap
            sources, and public role signals. These records feed proposal generation
            and internal GPT strategic analysis.
          </p>
        </div>
      </Panel>

      <Panel className="space-y-4">
        {personas.length > 0 ? (
          <ul className="divide-border/60 divide-y">
            {personas.map((persona) => (
              <li key={persona.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-foreground font-semibold">
                      {persona.personName} · {persona.personTitle}
                    </p>
                    <p className="text-muted text-sm">
                      {persona.organization} · {persona.chainSlug}
                    </p>
                    <p className="text-muted text-sm">
                      {persona.structuredData.successMetrics.topKpis.join(" · ")}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-muted">{persona.updatedAt}</p>
                    <Link
                      href={`/internal/personas/${persona.id}`}
                      className="text-accent mt-2 inline-block font-medium hover:underline"
                    >
                      Open persona
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-sm leading-6">
            No buyer personas have been generated yet. Build them from a chain page
            appendix or via the internal analysis flow.
          </p>
        )}
      </Panel>
    </div>
  );
}
