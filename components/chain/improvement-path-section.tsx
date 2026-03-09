import { buildRoadmapFitInsight } from "@/lib/roadmaps/roadmap-analysis";

import { ScoreDriversSection } from "@/components/chain/score-drivers";
import { DeploymentPlanSection } from "@/components/stack/deployment-plan";
import { RecommendedStackSection } from "@/components/stack/recommended-stack";
import type { ChainProfile } from "@/lib/domain/types";
import { formatDelta, formatScore } from "@/lib/utils/format";

function getLikelyRankEffect(profile: ChainProfile, totalPotentialLift: number) {
  if (totalPotentialLift <= 0) {
    return "No direct rank movement is available from gap closure alone in the current Atlas model.";
  }

  const overtakenPeers = profile.peers.filter(
    (peer) => peer.relativePosition === "above" && totalPotentialLift >= peer.scoreGap,
  );

  if (overtakenPeers.length > 0) {
    return `Could overtake up to ${overtakenPeers.length} nearby ${
      overtakenPeers.length === 1 ? "peer" : "peers"
    } if the current activation path lands as modeled.`;
  }

  if (profile.leaderGap > 0) {
    return `Could close ${formatDelta(
      Math.min(totalPotentialLift, profile.leaderGap),
    )} points of the current leader gap.`;
  }

  return "Would reinforce the current lead rather than create a new rank jump.";
}

function getCommercialOutcome(profile: ChainProfile, title: string) {
  return `Improves ${profile.chain.name}'s commercial posture in ${
    profile.economy.shortLabel
  } by giving ecosystem teams a clearer reason to ship, launch, or support the chain around ${title.toLowerCase()}.`;
}

export function ImprovementPathSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  const roadmapFit = buildRoadmapFitInsight(profile);
  const recommendationCount = profile.recommendedStack.recommendedModules.length;
  const firstRecommendation = profile.recommendedStack.recommendedModules[0];
  const totalPotentialLift = profile.recommendedStack.recommendedModules.reduce(
    (sum, recommendation) => sum + recommendation.potentialScoreLift,
    0,
  );
  const primaryBlocker = profile.gapAnalysis[0];

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
            Potential Atlas lift
          </dt>
          <dd className="text-foreground mt-2 text-2xl font-semibold">
            +{formatScore(totalPotentialLift)}
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

      <div className="border-border/70 divide-y border-t">
        {profile.recommendedStack.recommendedModules.length === 0 ? (
          <div className="py-5">
            <p className="text-muted text-sm leading-6">
              No direct activation impact remains in the current Atlas dataset.
              Protofire can shift the conversation to positioning, refinement, and
              launch packaging rather than foundational execution.
            </p>
          </div>
        ) : (
          profile.recommendedStack.recommendedModules.map((recommendation) => (
            <div key={recommendation.title} className="space-y-4 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-foreground text-lg font-semibold">
                    {recommendation.title}
                  </p>
                  <p className="text-muted mt-2 text-sm">
                    Atlas score lift: +{formatScore(recommendation.potentialScoreLift)}
                  </p>
                </div>
                <p className="text-muted text-sm">
                  Delivery window:{" "}
                  <span className="text-foreground font-medium">
                    {recommendation.kpis.find((kpi) => kpi.label === "Delivery window")
                      ?.value ?? "Atlas sequencing"}
                  </span>
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Expected result
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {recommendation.expectedResult}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Direct chain impact
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {recommendation.directChainImpact}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Likely rank effect
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {getLikelyRankEffect(profile, totalPotentialLift)}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Commercial outcome framing
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {getCommercialOutcome(profile, recommendation.title)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Highest-upside improvements
        </p>
        <h3 className="text-foreground mt-2 text-xl font-semibold">
          What moves the score next
        </h3>
        <div className="mt-4">
          <ScoreDriversSection drivers={profile.scoreDrivers} />
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

      <div className="border-border/70 grid gap-4 border-t pt-4 md:grid-cols-3">
        <div>
          <dt className="text-muted text-xs tracking-[0.16em] uppercase">
            Primary blocker closed
          </dt>
          <dd className="text-foreground mt-2 text-2xl font-semibold">
            {primaryBlocker?.module.name ?? "No blocker remaining"}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.16em] uppercase">
            Target state
          </dt>
          <dd className="text-foreground mt-2 text-2xl font-semibold">
            {firstRecommendation
              ? `${firstRecommendation.currentStatus} -> available`
              : "Maintain current lead"}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.16em] uppercase">
            Rank effect
          </dt>
          <dd className="text-foreground mt-2 text-base font-semibold leading-7">
            {getLikelyRankEffect(profile, totalPotentialLift)}
          </dd>
        </div>
      </div>
    </section>
  );
}
