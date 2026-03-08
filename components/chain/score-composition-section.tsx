import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ChainProfile } from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function ScoreCompositionSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  return (
    <Panel className="space-y-6">
      <div>
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Score composition
        </p>
        <h2 className="text-foreground mt-2 text-2xl font-semibold">
          Why the current score lands at {formatScore(profile.readinessScore.totalScore)}
        </h2>
        <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
          Atlas turns module status into weighted contribution. This shows which
          modules are already carrying the score and which ones are still
          suppressing it.
        </p>
      </div>

      <div className="space-y-4">
        {profile.readinessScore.moduleBreakdown.map((module) => {
          const maxContribution =
            (module.module.weight * profile.economy.scoringConfig.maximumScore) / 100;
          const progress =
            maxContribution === 0
              ? 0
              : Math.max(
                  0,
                  Math.min(100, (module.weightedContribution / maxContribution) * 100),
                );

          return (
            <div
              key={module.module.id}
              className="border-border/70 border-t pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-foreground text-lg font-semibold">
                    {module.module.name}
                  </p>
                  <StatusBadge status={module.status} />
                </div>
                <div className="text-right">
                  <p className="text-foreground text-2xl font-semibold">
                    {formatScore(module.weightedContribution)}
                  </p>
                  <p className="text-muted text-xs tracking-[0.14em] uppercase">
                    of {formatScore(maxContribution)} • {module.module.weight}% weight
                  </p>
                </div>
              </div>
              <div className="bg-surface-muted mt-4 h-2 overflow-hidden rounded-sm">
                <div
                  className="bg-accent h-full rounded-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-muted mt-4 text-sm leading-6">{module.rationale}</p>
              {module.module.slug === "liquid-staking" &&
              profile.liquidStakingDiagnosis ? (
                <Link
                  href="#liquid-staking-diagnosis"
                  className="text-accent mt-3 inline-flex text-sm font-medium hover:underline"
                >
                  Open liquid staking diagnosis
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
