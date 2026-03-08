import Link from "next/link";

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
    <div className="border-border/70 divide-y border-t">
      {readinessScore.moduleBreakdown.map((module) => (
        <div key={module.module.id} className="grid gap-4 py-4 lg:grid-cols-[0.35fr_0.65fr]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-foreground font-semibold">{module.module.name}</p>
                <p className="text-muted mt-1 text-sm">
                  {formatScore(module.weightedContribution)} /{" "}
                  {formatScore((module.module.weight * 10) / 100)}
                </p>
              </div>
              <StatusBadge status={module.status} />
            </div>
            <p className="text-muted text-sm leading-6">
              {module.module.description}
            </p>
            {module.module.slug === "liquid-staking" && liquidStakingDiagnosis ? (
              <div className="border-border/60 border-l pl-4">
                <p className="text-muted text-xs tracking-[0.16em] uppercase">
                  7-module diagnosis
                </p>
                <p className="text-foreground mt-2 text-lg font-semibold">
                  {Math.round(liquidStakingDiagnosis.weightedScore)} / 100
                </p>
                <Link
                  href="#liquid-staking-diagnosis"
                  className="text-accent mt-2 inline-flex text-sm font-medium hover:underline"
                >
                  Open diagnosis
                </Link>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Why this status
              </p>
              <p className="text-foreground mt-2 text-sm leading-6">
                {module.rationale}
              </p>
            </div>
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Evidence note
              </p>
              <p className="text-foreground mt-2 text-sm leading-6">
                {module.evidenceNote}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
