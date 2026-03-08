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
          This section shows what is missing, what moves the score fastest, and
          how the rollout should sequence.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
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
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
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
        </div>

        <div className="space-y-6">
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
        </div>
      </div>
    </section>
  );
}
