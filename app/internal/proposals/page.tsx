import Link from "next/link";

import { InternalNav } from "@/components/internal/internal-nav";
import { Panel } from "@/components/ui/panel";
import { requireAuthenticatedInternalUser } from "@/lib/admin/auth";
import { listProposalDocuments } from "@/lib/proposals/store";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

export default async function InternalProposalsPage() {
  await ensureAtlasPersistence();
  await requireAuthenticatedInternalUser("/internal/proposals");
  const proposals = listProposalDocuments();

  return (
    <div className="space-y-6">
      <InternalNav currentHref="/internal/proposals" />

      <Panel className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Proposal generator
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold">
            Stored proposals
          </h1>
          <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
            Generated proposal documents that connect chain gaps, buyer personas, and
            active Protofire offers into conversion-oriented recommendations.
          </p>
        </div>
      </Panel>

      <Panel className="space-y-4">
        {proposals.length > 0 ? (
          <ul className="divide-border/60 divide-y">
            {proposals.map((proposal) => (
              <li key={proposal.proposalId} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-foreground font-semibold">
                      {proposal.offerName} · {proposal.personaName}
                    </p>
                    <p className="text-muted text-sm">
                      {proposal.chainSlug} · {proposal.wedgeId} · conversion{" "}
                      {proposal.conversionProbability}% · fit {proposal.strategicFit}%
                    </p>
                    <p className="text-muted text-sm">{proposal.proposalSummary}</p>
                  </div>
                  <Link
                    href={`/internal/proposals/${proposal.proposalId}`}
                    className="text-accent text-sm font-medium hover:underline"
                  >
                    Open proposal
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-sm leading-6">
            No proposal documents have been generated yet.
          </p>
        )}
      </Panel>
    </div>
  );
}
