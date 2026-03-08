import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  ChainEconomyReadiness,
  LiquidStakingDiagnosis,
} from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function ModuleStatusGrid({
  readinessScore,
  liquidStakingDiagnosis,
}: {
  readinessScore: ChainEconomyReadiness;
  liquidStakingDiagnosis?: LiquidStakingDiagnosis;
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
          <div className="border-border/70 text-muted mt-5 grid gap-3 border-t pt-4 text-sm">
            <div>
              <p className="text-foreground font-medium">Why this status</p>
              <p className="mt-1 leading-6">{module.rationale}</p>
            </div>
            <div>
              <p className="text-foreground font-medium">Evidence note</p>
              <p className="mt-1 leading-6">{module.evidenceNote}</p>
            </div>
          </div>
          {module.module.slug === "liquid-staking" && liquidStakingDiagnosis ? (
            <div className="border-border/70 mt-5 border-t pt-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-muted text-xs tracking-[0.16em] uppercase">
                    7-module diagnosis
                  </p>
                  <p className="text-foreground mt-2 text-xl font-semibold">
                    {Math.round(liquidStakingDiagnosis.weightedScore)} / 100
                  </p>
                </div>
                <Link
                  href="#liquid-staking-diagnosis"
                  className="text-accent text-sm font-medium hover:underline"
                >
                  Open diagnosis
                </Link>
              </div>
              <div className="border-border/60 mt-4 divide-y">
                {liquidStakingDiagnosis.dimensions.map((dimension) => (
                  <div
                    key={dimension.dimension.id}
                    className="text-muted flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0"
                  >
                    <span>{dimension.dimension.name}</span>
                    <span className="text-foreground font-medium">
                      {dimension.weight}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Panel>
      ))}
    </div>
  );
}
