import Link from "next/link";

import { createBuyerPersonaAction, generateChainProposalsAction } from "@/app/internal/analysis/actions";
import type { AuthenticatedInternalUser } from "@/lib/admin/auth";
import type {
  BuyerPersonaRecord,
  ChainProfile,
  ChainTechnicalAnalysis,
  ProposalDocument,
} from "@/lib/domain/types";
import { computeOpportunityRadar } from "@/lib/opportunities/computeOpportunityRadar";
import { rankOpportunityTargets } from "@/lib/opportunities/rankOpportunityTargets";

import { ChainAnalysisPanel } from "./chain-analysis-panel";

export function StrategicAppendix({
  profile,
  internalUser,
  latestAnalysis,
  personas,
  proposals,
}: {
  profile: ChainProfile;
  internalUser: AuthenticatedInternalUser;
  latestAnalysis: ChainTechnicalAnalysis | null;
  personas: BuyerPersonaRecord[];
  proposals: ProposalDocument[];
}) {
  const returnTo = `/chains/${profile.chain.slug}?economy=${profile.economy.slug}`;
  const opportunityContext = rankOpportunityTargets(computeOpportunityRadar()).find(
    (row) =>
      row.chainSlug === profile.chain.slug && row.wedge === profile.economy.name,
  );

  return (
    <section
      className="border-border/70 space-y-8 border-t pt-8"
      id="internal-appendix"
    >
      <div className="space-y-2">
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Internal appendix
        </p>
        <h2 className="text-foreground text-2xl font-semibold">
          Buyer and proposal intelligence
        </h2>
        <p className="text-muted max-w-4xl text-sm leading-6">
          Signed in as {internalUser.displayName}. This appendix stays separate
          from the public Atlas score and only supports internal strategic
          analysis, persona development, and proposal matching.
        </p>
      </div>

      <ChainAnalysisPanel
        chainSlug={profile.chain.slug}
        chainName={profile.chain.name}
        applicabilityRows={profile.wedgeApplicabilityMatrix}
        latestAnalysis={latestAnalysis}
        internalUser={internalUser}
        returnTo={returnTo}
      />

      <section className="border-border/60 space-y-4 border-t pt-6">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Opportunity context
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            Current commercial read
          </h3>
        </div>
        {opportunityContext ? (
          <div className="space-y-2 text-sm leading-6">
            <p className="text-foreground font-medium">
              Opportunity {opportunityContext.opportunityScore} · {opportunityContext.recommendedOffer}
              {opportunityContext.personaName
                ? ` · persona ${opportunityContext.personaName}`
                : ""}
            </p>
            <p className="text-muted">{opportunityContext.rationale}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/internal/opportunities"
                className="text-accent font-medium hover:underline"
              >
                View opportunity radar
              </Link>
              <Link
                href={`/internal/account/${profile.chain.slug}?economy=${profile.economy.slug}`}
                className="text-accent font-medium hover:underline"
              >
                Open account context
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-muted text-sm leading-6">
            No opportunity radar row is available for this chain yet.
          </p>
        )}
      </section>

      <section className="border-border/60 space-y-5 border-t pt-6">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Persona builder
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            Build buyer personas
          </h3>
        </div>

        <form action={createBuyerPersonaAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="chainSlug" value={profile.chain.slug} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <input
            type="hidden"
            name="chainUrl"
            value={profile.chain.website ?? `https://${profile.chain.slug}`}
          />
          <div className="space-y-2">
            <label className="text-muted text-xs tracking-[0.16em] uppercase">
              Person name
            </label>
            <input
              name="personName"
              className="border-border text-foreground focus:border-accent w-full border bg-white px-3 py-2 text-sm outline-none"
              placeholder="Name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs tracking-[0.16em] uppercase">
              Person title
            </label>
            <input
              name="personTitle"
              className="border-border text-foreground focus:border-accent w-full border bg-white px-3 py-2 text-sm outline-none"
              placeholder="Ecosystem Lead"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs tracking-[0.16em] uppercase">
              Organization
            </label>
            <input
              name="organizationName"
              className="border-border text-foreground focus:border-accent w-full border bg-white px-3 py-2 text-sm outline-none"
              placeholder={profile.chain.name}
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs tracking-[0.16em] uppercase">
              Protocol URL
            </label>
            <input
              name="protocolUrl"
              className="border-border text-foreground focus:border-accent w-full border bg-white px-3 py-2 text-sm outline-none"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs tracking-[0.16em] uppercase">
              LinkedIn
            </label>
            <input
              name="linkedinProfile"
              className="border-border text-foreground focus:border-accent w-full border bg-white px-3 py-2 text-sm outline-none"
              placeholder="https://linkedin.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs tracking-[0.16em] uppercase">
              Twitter
            </label>
            <input
              name="twitterHandle"
              className="border-border text-foreground focus:border-accent w-full border bg-white px-3 py-2 text-sm outline-none"
              placeholder="@handle"
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs tracking-[0.16em] uppercase">
              GitHub
            </label>
            <input
              name="githubProfile"
              className="border-border text-foreground focus:border-accent w-full border bg-white px-3 py-2 text-sm outline-none"
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-muted text-xs tracking-[0.16em] uppercase">
              Notes
            </label>
            <textarea
              name="notes"
              className="border-border text-foreground focus:border-accent min-h-24 w-full border bg-white px-3 py-2 text-sm outline-none"
              placeholder="Internal notes, context from calls, or additional hypotheses to preserve in the persona artifact."
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="border-border text-foreground hover:border-accent hover:text-accent inline-flex border px-4 py-2 text-sm font-medium transition"
            >
              Build persona
            </button>
          </div>
        </form>

        <div className="border-border/60 border-t pt-4">
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Stored personas
          </p>
          {personas.length > 0 ? (
            <ul className="mt-3 space-y-3 text-sm">
              {personas.map((persona) => (
                <li key={persona.id} className="border-border/60 border-b pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-foreground font-medium">
                        {persona.personName} · {persona.personTitle}
                      </p>
                      <p className="text-muted mt-1">
                        {persona.structuredData.successMetrics.topKpis.join(" · ")}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={`/internal/personas/${persona.id}`}
                        className="text-accent text-sm font-medium hover:underline"
                      >
                        Open persona
                      </Link>
                      <form action={generateChainProposalsAction}>
                        <input type="hidden" name="chainSlug" value={profile.chain.slug} />
                        <input type="hidden" name="personaId" value={persona.id} />
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <button
                          type="submit"
                          className="text-accent text-sm font-medium hover:underline"
                        >
                          Generate proposals
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted mt-3 text-sm leading-6">
              No personas stored for this chain yet.
            </p>
          )}
        </div>
      </section>

      <section className="border-border/60 space-y-4 border-t pt-6">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Proposal engine
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            Stored proposal matches
          </h3>
        </div>
        {proposals.length > 0 ? (
          <ul className="space-y-4">
            {proposals.slice(0, 6).map((proposal) => (
              <li key={proposal.proposalId} className="border-border/60 border-b pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-foreground font-medium">
                      {proposal.offerName} · {proposal.personaName}
                    </p>
                    <p className="text-muted mt-1 text-sm">
                      {proposal.wedgeId} · fit {proposal.opportunityFitScore}% ·
                      strategic {proposal.strategicFit}%
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <p className="text-muted">{proposal.createdAt}</p>
                    <Link
                      href={`/internal/proposals/${proposal.proposalId}`}
                      className="text-accent font-medium hover:underline"
                    >
                      Open proposal
                    </Link>
                  </div>
                </div>
                <p className="text-foreground mt-3 text-sm leading-6">
                  {proposal.proposalSummary}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-sm leading-6">
            No proposal documents have been generated for this chain yet.
          </p>
        )}
      </section>
    </section>
  );
}
