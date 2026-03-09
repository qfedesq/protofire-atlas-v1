import type { RecommendedStack } from "@/lib/domain/types";

export function RecommendedStackSection({
  stack,
  layout,
}: {
  stack: RecommendedStack;
  layout?: "stacked" | "grid";
}) {
  void layout;

  const phaseByKey = new Map(
    stack.deploymentPhases.map((phase) => [phase.key, phase] as const),
  );

  return (
    <div className="space-y-4">
      <div className="border-border/70 border-t pt-4">
        <p className="text-muted text-sm leading-6">{stack.narrativeSummary}</p>
      </div>

      {stack.recommendedModules.length === 0 ? (
        <div className="border-border/70 border-t pt-4">
          <p className="text-muted text-sm leading-6">
            No activation modules are required in the current dataset. Protofire can
            treat this chain as a refinement and positioning exercise instead of a
            foundational rollout.
          </p>
        </div>
      ) : (
        <div className="border-border/70 divide-y border-t">
          {stack.recommendedModules.map((recommendation) => (
            <div key={recommendation.title} className="space-y-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-accent text-xs tracking-[0.16em] uppercase">
                    {phaseByKey.get(recommendation.deploymentPhaseKey)?.title ??
                      recommendation.deploymentPhaseKey}
                  </p>
                  <h3 className="text-foreground mt-2 text-2xl font-semibold">
                    {recommendation.title}
                  </h3>
                </div>
                <p className="text-muted text-sm">
                  Module:{" "}
                  <span className="text-foreground font-medium">
                    {recommendation.module.name}
                  </span>
                </p>
              </div>

              <dl className="border-border/70 grid gap-4 border-t pt-4 md:grid-cols-3">
                {recommendation.kpis.map((kpi) => (
                  <div key={`${recommendation.title}-${kpi.label}`}>
                    <dt className="text-muted text-xs tracking-[0.16em] uppercase">
                      {kpi.label}
                    </dt>
                    <dd className="text-foreground mt-2 text-2xl font-semibold">
                      {kpi.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    What Protofire deploys
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {recommendation.title} closes the current{" "}
                    {recommendation.module.name.toLowerCase()} gap with a targeted
                    deployment path under the active Atlas assumptions.
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Why it matters
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {recommendation.whyItMatters}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Stack summary
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {recommendation.narrativeSummary}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Current gap
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {recommendation.module.name} is currently{" "}
                    {recommendation.currentStatus}. Protofire treats that blocker as
                    directly actionable in the current model.
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Why it matters
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {recommendation.whyItMatters}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Delivery window
                  </p>
                  <p className="text-foreground mt-2 leading-6">
                    {phaseByKey.get(recommendation.deploymentPhaseKey)?.label ??
                      recommendation.deploymentPhaseKey}
                    {" · "}
                    {phaseByKey.get(recommendation.deploymentPhaseKey)?.timelineLabel ??
                      "Atlas sequencing"}
                  </p>
                </div>

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
