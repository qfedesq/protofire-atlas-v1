import { submitAssessmentRequestAction } from "@/app/actions/assessment-request";
import { ArrowUpRight } from "lucide-react";

import { CompetitiveAnalysisSection } from "@/components/chain/competitive-analysis";
import { ExpectedImpactSection } from "@/components/chain/expected-impact-section";
import { GapAnalysis } from "@/components/chain/gap-analysis";
import { GlobalPositionSection } from "@/components/chain/global-position-section";
import { ImprovementPathSection } from "@/components/chain/improvement-path-section";
import { LiquidStakingDiagnosisSection } from "@/components/chain/liquid-staking-diagnosis";
import { ModuleStatusGrid } from "@/components/chain/module-status-grid";
import { ScoreCompositionSection } from "@/components/chain/score-composition-section";
import { ShareableScorecard } from "@/components/chain/shareable-scorecard";
import { EconomySwitcher } from "@/components/economy/economy-switcher";
import { ChainAnalysisPanel } from "@/components/internal/chain-analysis-panel";
import { AssessmentRequestForm } from "@/components/requests/assessment-request-form";
import { ExpandableSection } from "@/components/ui/expandable-section";
import { atlasDatasetLabel } from "@/lib/config/dataset";
import type { AuthenticatedInternalUser } from "@/lib/admin/auth";
import type {
  ChainProfile,
  ChainTechnicalAnalysis,
  EconomyType,
} from "@/lib/domain/types";
import { buildEconomyReadinessSummary } from "@/lib/utils/economy-summary";
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
  internalUser = null,
  latestAnalysis = null,
  requestState,
}: {
  profile: ChainProfile;
  economies: EconomyType[];
  internalUser?: AuthenticatedInternalUser | null;
  latestAnalysis?: ChainTechnicalAnalysis | null;
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

      <ExpandableSection id="ranking" title="Ranking" defaultOpen>
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              {profile.economy.name}
            </p>
            <h1 className="text-foreground text-5xl font-semibold tracking-tight">
              {profile.chain.name}
            </h1>
            <p className="text-muted max-w-4xl text-base leading-7">
              {profile.chain.shortDescription}
            </p>
            <p className="text-foreground text-sm leading-6">
              {buildEconomyReadinessSummary(profile.economy)}
            </p>
          </div>

          <div className="border-border/70 space-y-4 border-t pt-4">
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              Primary score
            </p>
            <p className="text-foreground text-7xl font-semibold tracking-tight">
              {formatScore(profile.readinessScore.totalScore)}
              <span className="text-muted ml-2 text-2xl font-medium">/ 10</span>
            </p>
            <p className="text-foreground text-lg font-semibold">
              Rank #{profile.rank} for {profile.economy.shortLabel}
            </p>
            <p className="text-muted max-w-3xl text-sm leading-6">
              {getPrimaryInterpretation(profile)}
            </p>
          </div>

          <div className="border-border/70 divide-y border-t text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-2 py-3">
              <span className="text-muted">
                Global rank{" "}
                <span className="text-foreground font-medium">
                  #{profile.globalPosition.benchmarkRank}
                </span>
              </span>
              <span className="text-muted">
                Source TVL rank{" "}
                <span className="text-foreground font-medium">
                  #{profile.chain.sourceRank}
                </span>
              </span>
              <span className="text-muted">
                Leader gap{" "}
                <span className="text-foreground font-medium">
                  {profile.leaderGap.toFixed(1)}
                </span>
              </span>
              <span className="text-muted">
                Chains outranked{" "}
                <span className="text-foreground font-medium">
                  {profile.chainsOutranked}
                </span>
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 py-3">
              <span className="text-muted">Dataset scope: {atlasDatasetLabel}</span>
              <span className="text-muted">
                Snapshot TVL: {formatCurrencyCompact(profile.chain.sourceTvlUsd)}
              </span>
              <span className="text-muted">
                Snapshot date: {profile.chain.sourceSnapshotDate}
              </span>
              <span className="text-muted">
                Missing modules{" "}
                <span className="text-foreground font-medium">{missingModuleCount}</span>
              </span>
              <span className="text-muted">
                Partial modules{" "}
                <span className="text-foreground font-medium">{partialModuleCount}</span>
              </span>
              <span className="text-muted">
                Immediate upside{" "}
                <span className="text-foreground font-medium">
                  +{formatScore(totalPotentialLift)}
                </span>
              </span>
            </div>
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

          <div className="space-y-6 border-border/70 border-t pt-4">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Competitive context
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                How this chain compares
              </h3>
              <div className="mt-4">
                <CompetitiveAnalysisSection profile={profile} />
              </div>
            </div>

            <div className="border-border/70 border-t pt-4">
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Global context
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                Broader ecosystem position
              </h3>
              <div className="mt-4">
                <GlobalPositionSection position={profile.globalPosition} />
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        id="what-is-missing"
        title="What’s missing"
        defaultOpen
      >
        <div className="space-y-8">
          <div>
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              Score composition
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              How the score is built
            </h3>
            <div className="mt-4">
              <ScoreCompositionSection profile={profile} />
            </div>
          </div>

          <div className="border-border/70 border-t pt-4">
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              Module evidence
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              Current module notes
            </h3>
            <div className="mt-4">
              <ModuleStatusGrid
                readinessScore={profile.readinessScore}
                liquidStakingDiagnosis={profile.liquidStakingDiagnosis}
              />
            </div>
          </div>

          {profile.liquidStakingDiagnosis ? (
            <div className="border-border/70 border-t pt-4" id="liquid-staking-diagnosis">
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Liquid staking diagnosis
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                DeFi liquid staking blockers
              </h3>
              <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
                Atlas uses a dedicated seven-part liquid staking lens to make exit
                quality, peg behavior, DeFi utility, validator risk, and stress
                handling visible chain by chain.
              </p>
              <div className="mt-4">
                <LiquidStakingDiagnosisSection
                  diagnosis={profile.liquidStakingDiagnosis}
                  marketSnapshot={profile.liquidStakingMarketSnapshot}
                />
              </div>
            </div>
          ) : null}

          <div className="border-border/70 border-t pt-4">
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              Diagnosis and blockers
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              What is still limiting the score
            </h3>
            <div className="mt-4">
              <GapAnalysis
                gaps={profile.gapAnalysis}
                economyLabel={profile.economy.name}
              />
            </div>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        id="what-protofire-can-deploy"
        title="What Protofire can deploy"
        defaultOpen
      >
        <ImprovementPathSection profile={profile} />
      </ExpandableSection>

      <ExpandableSection
        id="expected-impact"
        title="Expected impact"
        defaultOpen
      >
        <div className="space-y-8">
          <ExpectedImpactSection profile={profile} />

          <div className="border-border/70 border-t pt-4">
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              Public summary snapshot
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              Shareable scorecard
            </h3>
            <div className="mt-4">
              <ShareableScorecard profile={profile} />
            </div>
          </div>

          <div className="border-border/70 space-y-4 border-t pt-4" id="assessment">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Request assessment
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                Request infrastructure assessment
              </h3>
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
          </div>
        </div>
      </ExpandableSection>

      {internalUser ? (
        <ExpandableSection
          id="internal-appendix"
          title="Internal appendix"
        >
          <ChainAnalysisPanel
            chainSlug={profile.chain.slug}
            chainName={profile.chain.name}
            applicabilityRows={profile.wedgeApplicabilityMatrix}
            latestAnalysis={latestAnalysis}
            internalUser={internalUser}
          />
        </ExpandableSection>
      ) : null}
    </div>
  );
}
