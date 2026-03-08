import { submitAssessmentRequestAction } from "@/app/actions/assessment-request";
import { ArrowUpRight } from "lucide-react";

import { BenchmarkStrip } from "@/components/chain/benchmark-strip";
import { CompetitiveAnalysisSection } from "@/components/chain/competitive-analysis";
import { LiquidStakingDiagnosisSection } from "@/components/chain/liquid-staking-diagnosis";
import { ModuleStatusGrid } from "@/components/chain/module-status-grid";
import { ShareableScorecard } from "@/components/chain/shareable-scorecard";
import { EconomySwitcher } from "@/components/economy/economy-switcher";
import { AssessmentRequestForm } from "@/components/requests/assessment-request-form";
import { DeploymentPlanSection } from "@/components/stack/deployment-plan";
import { RecommendedStackSection } from "@/components/stack/recommended-stack";
import { ExpandableSection } from "@/components/ui/expandable-section";
import { Panel } from "@/components/ui/panel";
import type { ChainProfile, EconomyType } from "@/lib/domain/types";
import { formatCurrencyCompact, formatScore } from "@/lib/utils/format";

export function ChainProfileView({
  profile,
  economies,
  requestState,
}: {
  profile: ChainProfile;
  economies: EconomyType[];
  requestState: "idle" | "success" | "error";
}) {
  const missingModuleCount = profile.gapAnalysis.filter(
    (gap) => gap.status === "missing",
  ).length;
  const partialModuleCount = profile.gapAnalysis.filter(
    (gap) => gap.status === "partial",
  ).length;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Economy wedge
          </p>
          <h2 className="text-foreground mt-2 text-3xl font-semibold tracking-tight">
            {profile.economy.name}
          </h2>
          <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
            Switch the same chain across economy wedges to compare how readiness,
            gaps, and deployment sequencing change by market.
          </p>
        </div>
        <EconomySwitcher
          economies={economies}
          selectedEconomy={profile.economy.slug}
          buildHref={(economySlug) =>
            `/chains/${profile.chain.slug}?economy=${economySlug}`
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-muted text-xs tracking-[0.18em] uppercase">
                {profile.chain.category} chain profile
              </p>
              <h1 className="text-foreground mt-3 text-4xl font-semibold tracking-tight">
                {profile.chain.name}
              </h1>
              <p className="text-muted mt-4 max-w-3xl text-sm leading-7">
                {profile.chain.shortDescription}
              </p>
              <div className="text-muted mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs tracking-[0.16em] uppercase">
                <span>Selected wedge: {profile.economy.shortLabel}</span>
                <span>Source TVL rank: #{profile.chain.sourceRank}</span>
                <span>TVL snapshot: {formatCurrencyCompact(profile.chain.sourceTvlUsd)}</span>
                <span>Snapshot date: {profile.chain.sourceSnapshotDate}</span>
              </div>
            </div>
            {profile.chain.website ? (
              <a
                href={profile.chain.website}
                target="_blank"
                rel="noreferrer"
                className="border-border text-foreground hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition"
              >
                Chain website
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </Panel>
        <Panel>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Overall readiness score
          </p>
          <p className="text-foreground mt-3 text-5xl font-semibold">
            {formatScore(profile.readinessScore.totalScore)}
          </p>
          <p className="text-muted mt-2 text-sm">
            Weighted score for {profile.economy.shortLabel} on a 0-10 scale
          </p>
          <div className="text-muted mt-6 grid gap-3 text-sm">
            <div className="bg-surface-muted rounded-2xl p-4">
              <p className="text-foreground font-medium">Missing modules</p>
              <p className="mt-1">{missingModuleCount}</p>
            </div>
            <div className="bg-surface-muted rounded-2xl p-4">
              <p className="text-foreground font-medium">Partial modules</p>
              <p className="mt-1">{partialModuleCount}</p>
            </div>
          </div>
        </Panel>
      </section>

      <BenchmarkStrip
        rank={profile.rank}
        leader={profile.leader}
        leaderGap={profile.leaderGap}
        chainsOutranked={profile.chainsOutranked}
      />

      <ShareableScorecard profile={profile} />

      <section className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Module-by-module status
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            {profile.economy.shortLabel} modules
          </h2>
        </div>
        <ModuleStatusGrid
          readinessScore={profile.readinessScore}
          liquidStakingDiagnosis={profile.liquidStakingDiagnosis}
        />
      </section>

      {profile.liquidStakingDiagnosis ? (
        <LiquidStakingDiagnosisSection
          diagnosis={profile.liquidStakingDiagnosis}
        />
      ) : null}

      <ExpandableSection
        eyebrow="Competitive analysis"
        title="Gap analysis, score drivers, and peer comparison"
      >
        <CompetitiveAnalysisSection profile={profile} />
      </ExpandableSection>

      <section className="space-y-4" id="suggested-activations">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Stack recommendation
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Deterministic Protofire activation stack
          </h2>
        </div>
        <RecommendedStackSection stack={profile.recommendedStack} />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Deployment plan
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Phased rollout
          </h2>
        </div>
        <DeploymentPlanSection plan={profile.deploymentPlan} />
      </section>

      <section className="space-y-4" id="assessment">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Improve my score
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Request infrastructure assessment
          </h2>
        </div>
        <Panel>
          <AssessmentRequestForm
            chainName={profile.chain.name}
            chainSlug={profile.chain.slug}
            economyLabel={profile.economy.name}
            economySlug={profile.economy.slug}
            requestState={requestState}
            action={submitAssessmentRequestAction}
          />
        </Panel>
      </section>
    </div>
  );
}
