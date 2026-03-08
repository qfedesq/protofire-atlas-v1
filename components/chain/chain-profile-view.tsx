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
import type { ChainProfile, EconomyType } from "@/lib/domain/types";
import { formatCurrencyCompact, formatScore } from "@/lib/utils/format";

function getPrimaryInterpretation(profile: ChainProfile) {
  const firstGap = profile.gapAnalysis[0];

  if (!firstGap) {
    return "Strong readiness. No foundational module gaps remain in the current Atlas model.";
  }

  return `Main gap: ${firstGap.module.name.toLowerCase()}. Closing it is the clearest path to a higher ${profile.economy.shortLabel.toLowerCase()} score.`;
}

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
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Economy wedge
            </p>
            <h2 className="text-foreground mt-2 text-2xl font-semibold tracking-tight">
              {profile.economy.name}
            </h2>
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

      <section className="border-border/70 grid gap-8 border-t pt-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Chain header
            </p>
            <h1 className="text-foreground text-5xl font-semibold tracking-tight">
              {profile.chain.name}
            </h1>
            <p className="text-muted max-w-4xl text-base leading-7">
              {profile.chain.shortDescription}
            </p>
          </div>

          <div className="text-muted flex flex-wrap gap-x-5 gap-y-2 text-xs tracking-[0.16em] uppercase">
            <span>{profile.economy.name}</span>
            <span>Dataset scope: Top 30 EVM chains by TVL</span>
            <span>Source TVL rank: #{profile.chain.sourceRank}</span>
            <span>Snapshot TVL: {formatCurrencyCompact(profile.chain.sourceTvlUsd)}</span>
            <span>Snapshot date: {profile.chain.sourceSnapshotDate}</span>
          </div>

          {profile.chain.website ? (
            <a
              href={profile.chain.website}
              target="_blank"
              rel="noreferrer"
              className="text-accent inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              Chain website
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        <div className="border-border/70 space-y-5 border-l pl-6 xl:pl-8">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Primary score
            </p>
            <h2 className="text-foreground mt-2 text-2xl font-semibold">
              {profile.economy.shortLabel} score
            </h2>
            <p className="text-foreground mt-3 text-7xl font-semibold tracking-tight">
              {formatScore(profile.readinessScore.totalScore)}
              <span className="text-muted ml-2 text-2xl font-medium">/ 10</span>
            </p>
            <p className="text-foreground mt-3 text-lg font-semibold">
              Rank #{profile.rank} for {profile.economy.shortLabel}
            </p>
            <p className="text-muted mt-3 max-w-xl text-sm leading-6">
              {getPrimaryInterpretation(profile)}
            </p>
          </div>

          <dl className="border-border/70 grid gap-4 border-t pt-4 sm:grid-cols-3">
            <div>
              <dt className="text-muted text-xs tracking-[0.14em] uppercase">
                Missing modules
              </dt>
              <dd className="text-foreground mt-2 text-2xl font-semibold">
                {missingModuleCount}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.14em] uppercase">
                Partial modules
              </dt>
              <dd className="text-foreground mt-2 text-2xl font-semibold">
                {partialModuleCount}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.14em] uppercase">
                Immediate upside
              </dt>
              <dd className="text-foreground mt-2 text-2xl font-semibold">
                +{formatScore(totalPotentialLift)}
              </dd>
            </div>
          </dl>
        </div>
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
          description="Atlas uses a dedicated seven-part liquid staking lens to make exit quality, peg behavior, DeFi utility, validator risk, and stress handling visible chain by chain."
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

      <section className="border-border/70 space-y-4 border-t pt-6" id="assessment">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Request assessment
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Request infrastructure assessment
          </h2>
          <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
            Protofire can review the current Atlas result, validate the missing
            infrastructure, and scope the activation path required to move this
            chain higher in the selected economy.
          </p>
        </div>

        <AssessmentRequestForm
          chainName={profile.chain.name}
          chainSlug={profile.chain.slug}
          economyLabel={profile.economy.name}
          economySlug={profile.economy.slug}
          requestState={requestState}
          action={submitAssessmentRequestAction}
        />
      </section>
    </div>
  );
}
