import { Panel } from "@/components/ui/panel";
import type { RecommendedStack } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";

export function RecommendedStackSection({
  stack,
  layout = "stacked",
}: {
  stack: RecommendedStack;
  layout?: "stacked" | "grid";
}) {
  const phaseTitleByKey = new Map(
    stack.deploymentPhases.map((phase) => [phase.key, phase.title] as const),
  );

  return (
    <div className="space-y-4">
      <Panel className="shadow-none">
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Recommended Protofire stack
        </p>
        <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
          {stack.narrativeSummary}
        </p>
      </Panel>
      {stack.recommendedModules.length === 0 ? (
        <Panel>
          <p className="text-muted text-sm leading-6">
            No activation modules are required in the current seeded dataset.
            Protofire can treat this chain as a refinement and positioning
            exercise instead of a foundational rollout.
          </p>
        </Panel>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            layout === "grid" && stack.recommendedModules.length > 1
              ? "2xl:grid-cols-2"
              : "grid-cols-1",
          )}
        >
          {stack.recommendedModules.map((recommendation) => (
            <Panel key={recommendation.title}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-accent text-xs tracking-[0.16em] uppercase">
                    {phaseTitleByKey.get(recommendation.deploymentPhaseKey) ??
                      recommendation.deploymentPhaseKey}
                  </p>
                  <h3 className="text-foreground mt-2 text-xl font-semibold">
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
              <div className="border-border/70 mt-5 grid gap-4 border-t pt-4 sm:grid-cols-3">
                {recommendation.kpis.map((kpi) => (
                  <div
                    key={`${recommendation.title}-${kpi.label}`}
                    className="border-border/70 border-l pl-4 first:border-l-0 first:pl-0"
                  >
                    <p className="text-muted text-[11px] font-semibold tracking-[0.14em] uppercase">
                      {kpi.label}
                    </p>
                    <p className="text-foreground mt-3 text-xl font-semibold tracking-tight">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-muted mt-5 space-y-4 text-sm leading-6">
                <div>
                  <p className="text-foreground font-medium">Why it matters</p>
                  <p className="mt-1">{recommendation.whyItMatters}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium">Expected result</p>
                  <p className="mt-1">{recommendation.expectedResult}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium">
                    Direct chain impact
                  </p>
                  <p className="mt-1">{recommendation.directChainImpact}</p>
                </div>
                <div>
                  <p className="text-foreground font-medium">Stack summary</p>
                  <p className="mt-1">{recommendation.narrativeSummary}</p>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
