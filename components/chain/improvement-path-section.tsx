import { buildRoadmapFitInsight } from "@/lib/roadmaps/roadmap-analysis";

import { DeploymentPlanSection } from "@/components/stack/deployment-plan";
import { RecommendedStackSection } from "@/components/stack/recommended-stack";
import type { ChainProfile } from "@/lib/domain/types";

export function ImprovementPathSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  const roadmapFit = buildRoadmapFitInsight(profile);
  const recommendationCount = profile.recommendedStack.recommendedModules.length;
  const firstRecommendation = profile.recommendedStack.recommendedModules[0];

  return (
    <section className="space-y-8" id="suggested-activations">
      <div>
        <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
          Protofire should lead with the deployable wedge that can move this chain
          fastest. This section turns the current blocker set into an execution
          sequence instead of another diagnostic readout.
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
            Recommended modules
          </dt>
          <dd className="text-foreground mt-2 text-2xl font-semibold">
            {recommendationCount}
          </dd>
          <p className="text-muted mt-2 text-sm leading-6">
            Protofire activations currently prioritized under the Atlas model.
          </p>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.16em] uppercase">
            First delivery window
          </dt>
          <dd className="text-foreground mt-2 text-2xl font-semibold">
            {profile.deploymentPlan.phases[0]?.timelineLabel ?? "No rollout required"}
          </dd>
          <p className="text-muted mt-2 text-sm leading-6">
            {firstRecommendation
              ? `${firstRecommendation.title} is the first execution move under the current sequence.`
              : "Protofire can focus on positioning and optimization instead of a foundational rollout."}
          </p>
        </div>
      </dl>

      <div>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          What Protofire can deploy
        </p>
        <h3 className="text-foreground mt-2 text-xl font-semibold">
          Recommended stack
        </h3>
        <div className="mt-4">
          <RecommendedStackSection stack={profile.recommendedStack} />
        </div>
      </div>

      <div>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Sequenced rollout
        </p>
        <h3 className="text-foreground mt-2 text-xl font-semibold">
          Deployment plan
        </h3>
        <div className="mt-4">
          <DeploymentPlanSection plan={profile.deploymentPlan} />
        </div>
      </div>
    </section>
  );
}
