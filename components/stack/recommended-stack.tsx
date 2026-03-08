import type { RecommendedStack } from "@/lib/domain/types";

export function RecommendedStackSection({
  stack,
}: {
  stack: RecommendedStack;
  layout?: "stacked" | "grid";
}) {
  const phaseTitleByKey = new Map(
    stack.deploymentPhases.map((phase) => [phase.key, phase.title] as const),
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
            <div key={recommendation.title} className="space-y-4 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-accent text-xs tracking-[0.16em] uppercase">
                    {phaseTitleByKey.get(recommendation.deploymentPhaseKey) ??
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

              <dl className="grid gap-4 border-l border-[var(--border)] pl-4 md:grid-cols-3 md:border-l-0 md:pl-0">
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

              <div className="grid gap-5 lg:grid-cols-3">
                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Why it matters
                  </p>
                  <p className="text-foreground mt-2 text-sm leading-6">
                    {recommendation.whyItMatters}
                  </p>
                </div>
                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Expected result
                  </p>
                  <p className="text-foreground mt-2 text-sm leading-6">
                    {recommendation.expectedResult}
                  </p>
                </div>
                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    Direct chain impact
                  </p>
                  <p className="text-foreground mt-2 text-sm leading-6">
                    {recommendation.directChainImpact}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted text-xs tracking-[0.16em] uppercase">
                  Stack summary
                </p>
                <p className="text-foreground mt-2 text-sm leading-6">
                  {recommendation.narrativeSummary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
