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
  const visibleModules = readinessScore.moduleBreakdown.filter(
    (module) => module.status !== "available",
  );

  if (visibleModules.length === 0) {
    return (
      <div className="border-border/70 border-t py-5">
        <p className="text-muted text-sm leading-6">
          No missing or partial modules remain in the current Atlas model.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/70 divide-y border-t">
      {visibleModules.map((module) => (
        <div key={module.module.id} className="space-y-4 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-foreground text-lg font-semibold">
                {module.module.name}
              </p>
              <p className="text-muted text-sm">
                {formatScore(module.weightedContribution)} /{" "}
                {formatScore((module.module.weight * 10) / 100)}
              </p>
            </div>
            <StatusBadge status={module.status} />
          </div>

          <p className="text-muted text-sm leading-6">{module.module.description}</p>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Why this status
              </p>
              <p className="text-foreground mt-2 leading-6">{module.rationale}</p>
            </div>

            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Evidence note
              </p>
              <p className="text-foreground mt-2 leading-6">
                {module.evidenceNote}
              </p>
            </div>

            {module.module.slug === "liquid-staking" && liquidStakingDiagnosis ? (
              <div>
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
        </div>
      ))}
    </div>
  );
}
