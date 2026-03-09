import { notFound } from "next/navigation";

import { InternalNav } from "@/components/internal/internal-nav";
import { Panel } from "@/components/ui/panel";
import { requireAuthenticatedInternalUser } from "@/lib/admin/auth";
import { getBuyerPersonaById } from "@/lib/personas/store";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

type PersonaDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PersonaDetailPage({
  params,
}: PersonaDetailPageProps) {
  await ensureAtlasPersistence();
  await requireAuthenticatedInternalUser(`/internal/personas/${(await params).id}`);
  const { id } = await params;
  const persona = getBuyerPersonaById(id);

  if (!persona) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <InternalNav currentHref="/internal/personas" />

      <Panel className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Persona
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold">
            {persona.personName}
          </h1>
          <p className="text-muted mt-2 text-sm">
            {persona.personTitle} · {persona.organization} · {persona.chainSlug}
          </p>
        </div>
      </Panel>

      <Panel className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">Empathy map</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">Hear</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {persona.structuredData.empathyMap.hear.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">Fears</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {persona.structuredData.empathyMap.fearTop3.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">Wants</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {persona.structuredData.empathyMap.wantTop3.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">Needs</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {persona.structuredData.empathyMap.needTop3.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-3 border-t pt-6">
          <h2 className="text-foreground text-xl font-semibold">Success metrics</h2>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">Top KPIs</p>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
            {persona.structuredData.successMetrics.topKpis.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-muted pt-2 text-xs tracking-[0.16em] uppercase">Organization OKRs</p>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
            {persona.structuredData.successMetrics.organizationOkrs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 border-t pt-6">
          <h2 className="text-foreground text-xl font-semibold">Lean canvas</h2>
          <dl className="grid gap-3 text-sm leading-6">
            <div>
              <dt className="text-muted text-xs tracking-[0.16em] uppercase">Problem</dt>
              <dd>{persona.structuredData.leanCanvas.problem}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.16em] uppercase">Solution</dt>
              <dd>{persona.structuredData.leanCanvas.solution}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.16em] uppercase">Value proposition</dt>
              <dd>{persona.structuredData.leanCanvas.valueProposition}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.16em] uppercase">Competitors</dt>
              <dd>{persona.structuredData.leanCanvas.competitors}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.16em] uppercase">Strategy</dt>
              <dd>{persona.structuredData.leanCanvas.strategy}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.16em] uppercase">Growth drivers</dt>
              <dd>{persona.structuredData.leanCanvas.growthDrivers}</dd>
            </div>
          </dl>
        </section>

        <section className="space-y-3 border-t pt-6">
          <h2 className="text-foreground text-xl font-semibold">Source basis</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
            {persona.sourceNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-muted text-sm">Last generated {persona.updatedAt}</p>
        </section>
      </Panel>
    </div>
  );
}
