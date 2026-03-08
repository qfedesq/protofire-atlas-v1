import { buildRoadmapFitInsight } from "@/lib/roadmaps/roadmap-analysis";

import { GapAnalysis } from "@/components/chain/gap-analysis";
import { ScoreDriversSection } from "@/components/chain/score-drivers";
import { DeploymentPlanSection } from "@/components/stack/deployment-plan";
import { RecommendedStackSection } from "@/components/stack/recommended-stack";
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
    <section className="space-y-6 border-t border-[var(--border)] pt-6" id="suggested-activations">
      <div>
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Improvement path
        </p>
        <h2 className="text-foreground mt-2 text-2xl font-semibold">
          What to activate next
        </h2>
        <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
          Atlas translates the current score blockers into a deterministic Protofire
          activation path. First understand the blockers, then the stack, then the
          rollout sequence.
        </p>
      </div>

      <dl className="border-border/70 grid gap-4 border-t pt-4 md:grid-cols-3">
        <div>
          <dt className="text-muted text-xs tracking-[0.16em] uppercase">
            Roadmap fit
          </dt>
          <dd className="text-foreground mt-2 text-2xl font-semibold">
            {roadmapFit.offerFitLabel}
          </dd>
          <p className="text-muted mt-2 text-sm leading-6">{roadmapFit.summary}</p>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.16em] uppercase">
            Potential Atlas lift
          </dt>
          <dd className="text-foreground mt-2 text-4xl font-semibold tracking-tight">
            +{formatScore(totalPotentialLift)}
          </dd>
          <p className="text-muted mt-2 text-sm leading-6">
            Score upside available from the currently recommended Protofire modules.
          </p>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.16em] uppercase">
            Score blockers
          </dt>
          <dd className="text-foreground mt-2 text-lg font-semibold">
            {missingModuleCount} missing · {partialModuleCount} partial
          </dd>
          <p className="text-muted mt-2 text-sm leading-6">
            These are the blockers keeping the current score below its reachable
            ceiling in this wedge.
          </p>
        </div>
      </dl>

      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
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
              Protofire recommended stack
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              Activation plan
            </h3>
          </div>
          <RecommendedStackSection stack={profile.recommendedStack} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Highest-upside improvements
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            Score drivers
          </h3>
        </div>
        <ScoreDriversSection drivers={profile.scoreDrivers} />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Sequenced rollout
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            Deployment plan
          </h3>
        </div>
        <DeploymentPlanSection plan={profile.deploymentPlan} />
      </div>
    </section>
  );
}
