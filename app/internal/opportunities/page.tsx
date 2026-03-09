import Link from "next/link";

import { InternalNav } from "@/components/internal/internal-nav";
import { Panel } from "@/components/ui/panel";
import { requireAuthenticatedInternalUser } from "@/lib/admin/auth";
import { computeOpportunityRadar } from "@/lib/opportunities/computeOpportunityRadar";
import { explainOpportunity } from "@/lib/opportunities/explainOpportunity";
import { rankOpportunityTargets } from "@/lib/opportunities/rankOpportunityTargets";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export default async function InternalOpportunitiesPage() {
  await ensureAtlasPersistence();
  await requireAuthenticatedInternalUser("/internal/opportunities");
  const opportunities = rankOpportunityTargets(computeOpportunityRadar());

  return (
    <div className="space-y-6">
      <InternalNav currentHref="/internal/opportunities" />

      <Panel className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Opportunity radar
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold">
            Best current Protofire opportunities
          </h1>
          <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
            Deterministic ranking across wedge applicability, readiness gaps,
            ecosystem strength, active offer fit, and persona relevance when available.
          </p>
        </div>
      </Panel>

      <Panel className="space-y-4">
        <ul className="divide-border/60 divide-y">
          {opportunities.map((opportunity) => (
            <li key={`${opportunity.chainSlug}-${opportunity.wedge}`} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-foreground font-semibold">
                    {opportunity.chainName} · {opportunity.wedge}
                  </p>
                  <p className="text-muted text-sm">
                    Opportunity {opportunity.opportunityScore} · gap {opportunity.keyGap} ·
                    offer {opportunity.recommendedOffer}
                    {opportunity.personaName ? ` · persona ${opportunity.personaName}` : ""}
                  </p>
                  <p className="text-muted text-sm">{explainOpportunity(opportunity)}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted">
                    ROI {opportunity.estimatedRoiBand} · confidence {opportunity.confidence}
                  </p>
                  <Link
                    href={`/internal/account/${opportunity.chainSlug}`}
                    className="text-accent mt-2 inline-block font-medium hover:underline"
                  >
                    Open account view
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
