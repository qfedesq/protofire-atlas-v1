import { buildRoadmapFitInsight } from "@/lib/roadmaps/roadmap-analysis";

import { GapAnalysis } from "@/components/chain/gap-analysis";
import { ScoreDriversSection } from "@/components/chain/score-drivers";
import { DeploymentPlanSection } from "@/components/stack/deployment-plan";
import { RecommendedStackSection } from "@/components/stack/recommended-stack";
import { Panel } from "@/components/ui/panel";
import type { ChainProfile } from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function ImprovementPathSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  const roadmapFit = buildRoadmapFitInsight(profile);
  const totalPotentialLift = profile.recommendedStack.recommendedModules.reduce(
    (sum, recommendation) => sum + recommendation.potentialScoreLift,
    0,
  );
  const missingModuleCount = profile.gapAnalysis.filter(
    (gap) => gap.status === "missing",
  ).length;
  const partialModuleCount = profile.gapAnalysis.filter(
    (gap) => gap.status === "partial",
  ).length;

  return (
    <section className="space-y-6" id="suggested-activations">
      <div>
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Improvement path
        </p>
        <h2 className="text-foreground mt-2 text-2xl font-semibold">
          What improves the score next
        </h2>
        <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
          Atlas turns open gaps into a deterministic Protofire activation path.
          Read this section in order: blockers first, the recommended
          Protofire stack second, then the rollout sequence.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="space-y-3">
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Roadmap fit
          </p>
          <p className="text-foreground text-xl font-semibold">
            {roadmapFit.offerFitLabel}
          </p>
          <p className="text-muted text-sm leading-6">{roadmapFit.summary}</p>
        </Panel>
        <Panel className="space-y-3">
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Potential Atlas lift
          </p>
          <p className="text-foreground text-4xl font-semibold">
            +{formatScore(totalPotentialLift)}
          </p>
          <p className="text-muted text-sm leading-6">
            Direct score upside available from the currently recommended
            Protofire modules under the active assumptions.
          </p>
        </Panel>
        <Panel className="space-y-3">
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Score blockers
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div>
              <p className="text-muted text-sm">Missing modules</p>
              <p className="text-foreground mt-2 text-4xl font-semibold tracking-tight">
                {missingModuleCount}
              </p>
            </div>
            <div>
              <p className="text-muted text-sm">Partial modules</p>
              <p className="text-foreground mt-2 text-4xl font-semibold tracking-tight">
                {partialModuleCount}
              </p>
            </div>
          </div>
          <p className="text-muted text-sm leading-6">
            These are the remaining blockers keeping the current score below its
            reachable ceiling in this wedge.
          </p>
        </Panel>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <p className="text-accent text-xs tracking-[0.16em] uppercase">
                Missing and weak modules
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                Diagnosis and score blockers
              </h3>
            </div>
            <GapAnalysis
              gaps={profile.gapAnalysis}
              economyLabel={profile.economy.name}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <p className="text-accent text-xs tracking-[0.16em] uppercase">
                Protofire recommended stack
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                Activation plan
              </h3>
            </div>
            <RecommendedStackSection stack={profile.recommendedStack} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Score drivers
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            Highest-upside improvements
          </h3>
        </div>
        <ScoreDriversSection drivers={profile.scoreDrivers} />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Deployment plan
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            Sequenced rollout
          </h3>
        </div>
        <DeploymentPlanSection plan={profile.deploymentPlan} />
      </div>
    </section>
  );
}
