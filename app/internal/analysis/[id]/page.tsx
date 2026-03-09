import Link from "next/link";
import { notFound } from "next/navigation";

import { runChainTechnicalAnalysisAction } from "@/app/internal/analysis/actions";
import { requireAuthenticatedInternalUser } from "@/lib/admin/auth";
import {
  getChainTechnicalAnalysisById,
  listChainTechnicalAnalysesByChainSlug,
} from "@/lib/analysis/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";
import { WedgeApplicabilityTable } from "@/components/internal/wedge-applicability-table";

type AnalysisPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChainTechnicalAnalysisPage({
  params,
}: AnalysisPageProps) {
  await ensureAtlasPersistence();
  await requireAuthenticatedInternalUser(`/internal/analysis/${(await params).id}`);

  const { id } = await params;
  const analysis = getChainTechnicalAnalysisById(id);

  if (!analysis) {
    notFound();
  }

  const history = listChainTechnicalAnalysesByChainSlug(analysis.chainSlug).filter(
    (item) => item.id !== analysis.id,
  );

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Internal technical analysis
        </p>
        <h1 className="text-foreground text-3xl font-semibold">
          {analysis.inputSnapshot.chain.name}
        </h1>
        <p className="text-muted max-w-4xl text-sm leading-6">
          This internal analysis layer is distinct from Atlas deterministic
          scoring and readiness rankings. It records a deeper technical review
          triggered for one chain at a point in time.
        </p>
      </section>

      <section className="border-border/70 space-y-3 border-t pt-6">
        <h2 className="text-foreground text-2xl font-semibold">Run summary</h2>
        <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="text-muted text-xs tracking-[0.14em] uppercase">
              Status
            </dt>
            <dd className="text-foreground mt-2 text-lg font-semibold">
              {analysis.status}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs tracking-[0.14em] uppercase">
              Model
            </dt>
            <dd className="text-foreground mt-2 text-lg font-semibold">
              {analysis.modelName}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs tracking-[0.14em] uppercase">
              Mode
            </dt>
            <dd className="text-foreground mt-2 text-lg font-semibold">
              {analysis.executionMode}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs tracking-[0.14em] uppercase">
              Triggered by
            </dt>
            <dd className="text-foreground mt-2 text-lg font-semibold">
              {analysis.triggeredBy}
            </dd>
          </div>
        </dl>
        <p className="text-muted text-sm leading-6">
          Created {analysis.createdAt}
          {analysis.completedAt ? ` · Completed ${analysis.completedAt}` : ""} ·
          Assumptions snapshot {analysis.inputSnapshot.assumptionsVersion}
        </p>
        {analysis.outputSummary ? (
          <p className="text-foreground text-base leading-7">
            {analysis.outputSummary}
          </p>
        ) : null}
        {analysis.errorMessage ? (
          <p className="text-rose-600 text-sm leading-6">{analysis.errorMessage}</p>
        ) : null}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href={`/chains/${analysis.chainSlug}`}
            className="text-accent font-medium hover:underline"
          >
            Back to chain page
          </Link>
          <form action={runChainTechnicalAnalysisAction}>
            <input type="hidden" name="chainSlug" value={analysis.chainSlug} />
            <input type="hidden" name="returnTo" value={`/internal/analysis/${analysis.id}`} />
            <button
              type="submit"
              className="border-border text-foreground hover:border-accent hover:text-accent inline-flex border px-4 py-2 font-medium transition"
            >
              Rerun analysis
            </button>
          </form>
        </div>
      </section>

      <section className="border-border/70 space-y-4 border-t pt-6">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Deterministic baseline
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Wedge applicability snapshot
          </h2>
        </div>
        <WedgeApplicabilityTable
          rows={analysis.outputStructuredData?.wedgeAssessments ?? []}
          showSourceBasis
        />
      </section>

      <section className="border-border/70 space-y-4 border-t pt-6">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Structured findings
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Infrastructure, buyer, and proposal findings
          </h2>
        </div>

        {analysis.outputStructuredData ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Infrastructure analysis
              </h3>
              <p className="text-muted mt-3 text-sm leading-6">
                {analysis.outputStructuredData.infrastructureAnalysis}
              </p>
            </div>

            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Buyer persona analysis
              </h3>
              <p className="text-muted mt-3 text-sm leading-6">
                {analysis.outputStructuredData.buyerPersonaAnalysis}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <h3 className="text-foreground text-lg font-semibold">
                  Confidence score
                </h3>
                <p className="text-foreground mt-3 text-3xl font-semibold">
                  {analysis.outputStructuredData.confidenceScore}
                </p>
              </div>
              <div>
                <h3 className="text-foreground text-lg font-semibold">
                  Recommended offer
                </h3>
                {analysis.outputStructuredData.recommendedOffer ? (
                  <div className="mt-3 space-y-2 text-sm leading-6">
                    <p className="text-foreground font-medium">
                      {analysis.outputStructuredData.recommendedOffer.offerName}
                    </p>
                    <p className="text-muted">
                      {analysis.outputStructuredData.recommendedOffer.rationale}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted mt-3 text-sm leading-6">
                    No single offer was selected in this run.
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-foreground text-lg font-semibold">
                  Proposal draft
                </h3>
                {analysis.outputStructuredData.proposalDraft ? (
                  <div className="mt-3 space-y-2 text-sm leading-6">
                    <p className="text-foreground font-medium">
                      {analysis.outputStructuredData.proposalDraft.headline}
                    </p>
                    <p className="text-muted">
                      {analysis.outputStructuredData.proposalDraft.summary}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted mt-3 text-sm leading-6">
                    No proposal draft was generated in this run.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Technical blockers
              </h3>
              <ul className="text-muted mt-3 space-y-2 text-sm leading-6">
                {analysis.outputStructuredData.technicalBlockers.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Strongest Protofire opportunities
              </h3>
              <ul className="text-muted mt-3 space-y-2 text-sm leading-6">
                {analysis.outputStructuredData.strongestOpportunities.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Prerequisite summary
              </h3>
              <ul className="text-muted mt-3 space-y-2 text-sm leading-6">
                {analysis.outputStructuredData.prerequisiteSummary.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Confidence notes
              </h3>
              <ul className="text-muted mt-3 space-y-2 text-sm leading-6">
                {analysis.outputStructuredData.confidenceNotes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Manual follow-up
              </h3>
              <ul className="text-muted mt-3 space-y-2 text-sm leading-6">
                {analysis.outputStructuredData.manualFollowUp.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            {analysis.outputStructuredData.proposalDraft ? (
              <div>
                <h3 className="text-foreground text-lg font-semibold">
                  Draft proposal details
                </h3>
                <dl className="mt-3 space-y-4 text-sm leading-6">
                  <div>
                    <dt className="text-foreground font-medium">
                      Why it solves persona fears
                    </dt>
                    <dd className="text-muted mt-1">
                      {
                        analysis.outputStructuredData.proposalDraft
                          .whyItSolvesPersonaFears
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-foreground font-medium">KPI improvement case</dt>
                    <dd className="text-muted mt-1">
                      {
                        analysis.outputStructuredData.proposalDraft
                          .kpiImprovementCase
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-foreground font-medium">Expected ROI</dt>
                    <dd className="text-muted mt-1">
                      {analysis.outputStructuredData.proposalDraft.expectedRoi}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-foreground font-medium">
                      Strategic advantage
                    </dt>
                    <dd className="text-muted mt-1">
                      {analysis.outputStructuredData.proposalDraft.strategicAdvantage}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-muted text-sm leading-6">
            No structured output is available for this analysis yet.
          </p>
        )}
      </section>

      <section className="border-border/70 space-y-4 border-t pt-6">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            History
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Previous runs
          </h2>
        </div>
        {history.length > 0 ? (
          <ul className="space-y-3 text-sm">
            {history.map((item) => (
              <li key={item.id} className="border-border/60 border-b pb-3 last:border-b-0">
                <Link
                  href={`/internal/analysis/${item.id}`}
                  className="text-accent font-medium hover:underline"
                >
                  {item.createdAt} · {item.status} · {item.executionMode}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-sm leading-6">
            No previous analyses exist for this chain.
          </p>
        )}
      </section>
    </div>
  );
}
