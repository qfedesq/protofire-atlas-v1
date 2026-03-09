import { notFound } from "next/navigation";

import { InternalNav } from "@/components/internal/internal-nav";
import { Panel } from "@/components/ui/panel";
import { requireAuthenticatedInternalUser } from "@/lib/admin/auth";
import { listProposalDocuments } from "@/lib/proposals/store";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

type ProposalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProposalDetailPage({
  params,
}: ProposalDetailPageProps) {
  await ensureAtlasPersistence();
  await requireAuthenticatedInternalUser(`/internal/proposals/${(await params).id}`);
  const { id } = await params;
  const proposal =
    listProposalDocuments().find((record) => record.proposalId === id) ?? null;

  if (!proposal) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <InternalNav currentHref="/internal/proposals" />

      <Panel className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Proposal
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold">
            {proposal.offerName}
          </h1>
          <p className="text-muted mt-2 text-sm">
            {proposal.chainSlug} · {proposal.personaName} · {proposal.wedgeId}
          </p>
        </div>
      </Panel>

      <Panel className="space-y-5">
        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-muted text-xs tracking-[0.16em] uppercase">
              Opportunity fit score
            </dt>
            <dd className="text-foreground mt-2 text-3xl font-semibold">
              {proposal.opportunityFitScore}%
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs tracking-[0.16em] uppercase">
              Strategic fit
            </dt>
            <dd className="text-foreground mt-2 text-3xl font-semibold">
              {proposal.strategicFit}%
            </dd>
          </div>
        </dl>

        <div className="space-y-4 border-t pt-5">
          <div>
            <p className="text-muted text-xs tracking-[0.16em] uppercase">Summary</p>
            <p className="text-foreground mt-2 text-sm leading-6">
              {proposal.proposalSummary}
            </p>
          </div>
          <div>
            <p className="text-muted text-xs tracking-[0.16em] uppercase">Expected outcome</p>
            <p className="text-foreground mt-2 text-sm leading-6">
              {proposal.expectedChainOutcome}
            </p>
          </div>
          <div>
            <p className="text-muted text-xs tracking-[0.16em] uppercase">Risk reduction</p>
            <p className="text-foreground mt-2 text-sm leading-6">
              {proposal.riskReduction}
            </p>
          </div>
          <div>
            <p className="text-muted text-xs tracking-[0.16em] uppercase">ROI estimate</p>
            <p className="text-foreground mt-2 text-sm leading-6">
              {proposal.roiEstimation}
            </p>
          </div>
        </div>

        <div className="border-t pt-5">
          <p className="text-muted text-xs tracking-[0.16em] uppercase">Markdown artifact</p>
          <pre className="text-foreground mt-3 overflow-x-auto whitespace-pre-wrap text-sm leading-6">
            {proposal.markdownContent}
          </pre>
        </div>
      </Panel>
    </div>
  );
}
