import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ChainEconomyReadiness } from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function ModuleStatusGrid({
  readinessScore,
}: {
  readinessScore: ChainEconomyReadiness;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {readinessScore.moduleBreakdown.map((module) => (
        <Panel key={module.module.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                {module.module.name}
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                {formatScore(module.weightedContribution)} /{" "}
                {formatScore((module.module.weight * 10) / 100)}
              </h3>
            </div>
            <StatusBadge status={module.status} />
          </div>
          <p className="text-muted mt-4 text-sm leading-6">
            {module.module.description}
          </p>
          <div className="bg-surface-muted text-muted mt-5 grid gap-3 rounded-2xl p-4 text-sm">
            <div>
              <p className="text-foreground font-medium">Why this status</p>
              <p className="mt-1 leading-6">{module.rationale}</p>
            </div>
            <div>
              <p className="text-foreground font-medium">Evidence note</p>
              <p className="mt-1 leading-6">{module.evidenceNote}</p>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}
