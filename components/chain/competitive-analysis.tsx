import { GapAnalysis } from "@/components/chain/gap-analysis";
import { PeerComparisonSection } from "@/components/chain/peer-comparison";
import { ScoreDriversSection } from "@/components/chain/score-drivers";
import { RecommendedStackSection } from "@/components/stack/recommended-stack";
import { buildRoadmapFitInsight } from "@/lib/roadmaps/roadmap-analysis";
import type { ChainProfile } from "@/lib/domain/types";

export function CompetitiveAnalysisSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  const roadmapFit = buildRoadmapFitInsight(profile);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Roadmap fit
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            Current stage and best score lever
          </h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1.3fr]">
          <div className="bg-surface-muted rounded-3xl p-5">
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              Official source
            </p>
            <p className="text-foreground mt-2 text-lg font-semibold">
              {profile.chain.roadmap.stageLabel}
            </p>
            <p className="text-muted mt-3 text-sm leading-6">
              {profile.chain.roadmap.stageSummary}
            </p>
            {profile.chain.roadmap.sourceUrl ? (
              <a
                href={profile.chain.roadmap.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-accent mt-4 inline-flex text-sm font-medium hover:underline"
              >
                {profile.chain.roadmap.sourceLabel}
              </a>
            ) : (
              <p className="text-muted mt-4 text-sm">
                {profile.chain.roadmap.sourceLabel}
              </p>
            )}
          </div>
          <div className="bg-surface-muted rounded-3xl p-5">
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              Atlas fit
            </p>
            <p className="text-foreground mt-2 text-lg font-semibold">
              {roadmapFit.offerFitLabel}
            </p>
            <p className="text-muted mt-3 text-sm leading-6">
              {roadmapFit.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="border-border/70 border-t pt-8">
        <div className="space-y-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Gap analysis
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              What is still blocking readiness
            </h3>
          </div>
          <GapAnalysis
            gaps={profile.gapAnalysis}
            economyLabel={profile.economy.name}
          />
        </div>
      </div>

      <div className="border-border/70 border-t pt-8">
        <div className="space-y-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              What moves your score
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              Highest-upside module improvements
            </h3>
          </div>
          <ScoreDriversSection drivers={profile.scoreDrivers} />
        </div>
      </div>

      <div className="border-border/70 border-t pt-8">
        <div className="space-y-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Peer comparison
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              Nearby chains in the same economy wedge
            </h3>
            <p className="text-muted mt-3 text-sm leading-6">
              Atlas compares the closest ranks above and below this chain to
              show where module gaps are still costing position.
            </p>
          </div>
          <PeerComparisonSection profile={profile} />
        </div>
      </div>

      <div className="border-border/70 border-t pt-8">
        <div className="space-y-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Stack recommendation
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              Deterministic Protofire activation stack
            </h3>
          </div>
          <RecommendedStackSection stack={profile.recommendedStack} />
        </div>
      </div>
    </div>
  );
}
