import { submitAssessmentRequestAction } from "@/app/actions/assessment-request";
import { ArrowUpRight } from "lucide-react";

import { CompetitiveAnalysisSection } from "@/components/chain/competitive-analysis";
import { GlobalPositionSection } from "@/components/chain/global-position-section";
import { ImprovementPathSection } from "@/components/chain/improvement-path-section";
import { LiquidStakingDiagnosisSection } from "@/components/chain/liquid-staking-diagnosis";
import { ModuleStatusGrid } from "@/components/chain/module-status-grid";
import { ScoreCompositionSection } from "@/components/chain/score-composition-section";
import { ShareableScorecard } from "@/components/chain/shareable-scorecard";
import { EconomySwitcher } from "@/components/economy/economy-switcher";
import { AssessmentRequestForm } from "@/components/requests/assessment-request-form";
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
  const totalPotentialLift = profile.recommendedStack.recommendedModules.reduce(
    (sum, recommendation) => sum + recommendation.potentialScoreLift,
    0,
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Economy wedge
            </p>
            <h2 className="text-foreground mt-2 text-3xl font-semibold tracking-tight">
              {profile.economy.name}
            </h2>
            <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
              Switch the same chain across economy wedges to compare how
              readiness, gaps, and deployment sequencing change by market.
            </p>
          </div>
          <div className="lg:min-w-[32rem]">
            <EconomySwitcher
              economies={economies}
              selectedEconomy={profile.economy.slug}
              buildHref={(economySlug) =>
                `/chains/${profile.chain.slug}?economy=${economySlug}`
              }
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.75fr)]">
        <Panel className="space-y-6">
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
                className="border-border text-foreground hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition"
              >
                Chain website
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>

          <div className="border-border/70 grid gap-4 border-t pt-4 sm:grid-cols-3">
            <div>
              <p className="text-muted text-xs tracking-[0.14em] uppercase">
                Current rank
              </p>
              <p className="text-foreground mt-2 text-2xl font-semibold">
                #{profile.rank}
              </p>
            </div>
            <div>
              <p className="text-muted text-xs tracking-[0.14em] uppercase">
                Missing modules
              </p>
              <p className="text-foreground mt-2 text-2xl font-semibold">
                {missingModuleCount}
              </p>
            </div>
            <div>
              <p className="text-muted text-xs tracking-[0.14em] uppercase">
                Immediate score upside
              </p>
              <p className="text-foreground mt-2 text-2xl font-semibold">
                +{formatScore(totalPotentialLift)}
              </p>
            </div>
          </div>
        </Panel>
        <Panel className="space-y-5">
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Primary score
          </p>
          <div className="space-y-2">
            <h2 className="text-foreground text-xl font-semibold">
              {profile.economy.shortLabel} score
            </h2>
            <p className="text-foreground text-6xl font-semibold tracking-tight">
              {formatScore(profile.readinessScore.totalScore)}
              <span className="text-muted ml-2 text-2xl font-medium">/ 10</span>
            </p>
            <p className="text-foreground text-lg font-medium">
              Rank #{profile.rank} in the current {profile.economy.shortLabel} benchmark
            </p>
          </div>
          <p className="text-muted text-sm leading-6">
            This is the main score to watch. It measures how ready{" "}
            {profile.chain.name} is to support the selected economy under the
            active Atlas model, and it is the benchmark Protofire can improve
            directly through infrastructure activation.
          </p>
          <div className="border-border/70 grid gap-4 border-t pt-4 sm:grid-cols-2">
            <div>
              <p className="text-muted text-xs tracking-[0.14em] uppercase">
                Partial modules
              </p>
              <p className="text-foreground mt-2 text-2xl font-semibold">
                {partialModuleCount}
              </p>
            </div>
            <div>
              <p className="text-muted text-xs tracking-[0.14em] uppercase">
                Next activation focus
              </p>
              <p className="text-foreground mt-2 text-2xl font-semibold">
                {profile.recommendedStack.recommendedModules[0]?.module.name ??
                  "No immediate gap"}
              </p>
            </div>
          </div>
        </Panel>
      </section>

      <ScoreCompositionSection profile={profile} />

      <ExpandableSection
        id="module-status"
        eyebrow="Module evidence"
        title={`${profile.economy.shortLabel} module notes`}
      >
        <ModuleStatusGrid
          readinessScore={profile.readinessScore}
          liquidStakingDiagnosis={profile.liquidStakingDiagnosis}
        />
      </ExpandableSection>

      {profile.liquidStakingDiagnosis ? (
        <ExpandableSection
          id="liquid-staking-diagnosis"
          eyebrow="Liquid staking"
          title="7-module diagnosis"
          description="Atlas uses a dedicated seven-part lens for liquid staking to make exit quality, peg behavior, DeFi utility, validator risk, and stress handling visible chain by chain."
        >
          <LiquidStakingDiagnosisSection
            diagnosis={profile.liquidStakingDiagnosis}
            marketSnapshot={profile.liquidStakingMarketSnapshot}
          />
        </ExpandableSection>
      ) : null}

      <ImprovementPathSection profile={profile} />

      <CompetitiveAnalysisSection profile={profile} />

      <GlobalPositionSection position={profile.globalPosition} />

      <ExpandableSection
        id="public-scorecard"
        eyebrow="Shareable scorecard"
        title="Public summary snapshot"
      >
        <ShareableScorecard profile={profile} />
      </ExpandableSection>

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
