import Link from "next/link";

import { runChainTechnicalAnalysisAction } from "@/app/internal/analysis/actions";
import { getCurrentAnalysisModelName } from "@/lib/analysis/input";
import type {
  AuthenticatedInternalUser,
} from "@/lib/admin/auth";
import type { ChainTechnicalAnalysis, WedgeApplicability } from "@/lib/domain/types";

import { WedgeApplicabilityTable } from "./wedge-applicability-table";

export function ChainAnalysisPanel({
  chainSlug,
  chainName,
  applicabilityRows,
  latestAnalysis,
  internalUser,
  returnTo,
}: {
  chainSlug: string;
  chainName: string;
  applicabilityRows: WedgeApplicability[];
  latestAnalysis: ChainTechnicalAnalysis | null;
  internalUser: AuthenticatedInternalUser;
  returnTo?: string;
}) {
  const modelName = getCurrentAnalysisModelName();

  return (
    <section className="border-border/70 border-t pt-6" id="internal-analysis">
      <div className="space-y-3">
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Internal analysis
        </p>
        <h2 className="text-foreground text-2xl font-semibold">
          Deterministic applicability and GPT strategic analysis
        </h2>
        <p className="text-muted max-w-4xl text-sm leading-6">
          This internal section keeps Atlas&apos; deterministic applicability baseline
          separate from the deeper AI-assisted strategic review. Nothing here
          changes public readiness scores unless the underlying assumptions or
          source datasets are updated.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Deterministic layer
              </p>
              <h3 className="text-foreground mt-2 text-lg font-semibold">
                Wedge applicability baseline
              </h3>
            </div>
            <form action={runChainTechnicalAnalysisAction}>
              <input type="hidden" name="chainSlug" value={chainSlug} />
              <input
                type="hidden"
                name="returnTo"
                value={returnTo ?? `/chains/${chainSlug}`}
              />
              <button
                type="submit"
                className="border-border text-foreground hover:border-accent hover:text-accent inline-flex border px-4 py-2 text-sm font-medium transition"
              >
                Run {modelName} Strategic Analysis
              </button>
            </form>
          </div>
          <WedgeApplicabilityTable rows={applicabilityRows} />
        </div>

        <div className="space-y-3 border-border/60 border-t pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                AI-assisted layer
              </p>
              <h3 className="text-foreground mt-2 text-lg font-semibold">
                Latest strategic analysis
              </h3>
            </div>
            {latestAnalysis ? (
              <Link
                href={`/internal/analysis/${latestAnalysis.id}`}
                className="text-accent text-sm font-medium hover:underline"
              >
                Open full analysis
              </Link>
            ) : null}
          </div>

          {latestAnalysis ? (
            <div className="space-y-2 text-sm leading-6">
              <p className="text-foreground">
                {chainName} analysis status:{" "}
                <strong>{latestAnalysis.status}</strong>. Model:{" "}
                <strong>{latestAnalysis.modelName}</strong>. Execution mode:{" "}
                <strong>{latestAnalysis.executionMode}</strong>.
              </p>
              <p className="text-muted">
                Triggered by {latestAnalysis.triggeredBy} on {latestAnalysis.createdAt}.
              </p>
              {latestAnalysis.outputSummary ? (
                <p className="text-foreground">{latestAnalysis.outputSummary}</p>
              ) : null}
              {latestAnalysis.errorMessage ? (
                <p className="text-rose-600">{latestAnalysis.errorMessage}</p>
              ) : null}
            </div>
          ) : (
            <div className="text-muted space-y-2 text-sm leading-6">
              <p>No GPT-assisted analysis has been stored for this chain yet.</p>
              <p>
                Signed in as {internalUser.displayName}. Launching the workflow
                stores a traceable input snapshot, personas, offers, model label,
                timestamps, and structured findings.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
