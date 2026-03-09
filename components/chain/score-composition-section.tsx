import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import type { ChainProfile } from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function ScoreCompositionSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  const visibleModules = profile.readinessScore.moduleBreakdown.filter(
    (module) => module.status !== "available",
  );

  if (visibleModules.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-muted max-w-4xl text-sm leading-6">
          Atlas converts module status into weighted contribution. No missing or
          partial modules remain in the current model for this economy.
        </p>
        <div className="border-border/70 border-t py-4">
          <p className="text-foreground text-sm leading-6">
            Current total score:{" "}
            <span className="font-semibold">
              {formatScore(profile.readinessScore.totalScore)} / 10
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted max-w-4xl text-sm leading-6">
        Atlas converts module status into weighted contribution. Only missing
        and partial modules are shown here so the remaining blockers are visible
        at a glance.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-border/70 border-b">
              <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                Module
              </th>
              <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                Status
              </th>
              <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                Weight
              </th>
              <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                Contribution
              </th>
              <th className="py-3 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                Why it lands here
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleModules.map((module) => {
              const maxContribution =
                (module.module.weight * profile.economy.scoringConfig.maximumScore) /
                100;
              const progress =
                maxContribution === 0
                  ? 0
                  : Math.max(
                      0,
                      Math.min(
                        100,
                        (module.weightedContribution / maxContribution) * 100,
                      ),
                    );

              return (
                <tr
                  key={module.module.id}
                  className="border-border/60 border-b align-top last:border-b-0"
                >
                  <td className="py-4 pr-4">
                    <p className="text-foreground font-semibold">
                      {module.module.name}
                    </p>
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={module.status} />
                  </td>
                  <td className="py-4 pr-4 text-foreground">
                    {module.module.weight}%
                  </td>
                  <td className="py-4 pr-4">
                    <p className="text-foreground font-semibold">
                      {formatScore(module.weightedContribution)}
                    </p>
                    <p className="text-muted mt-1 text-xs">
                      Max {formatScore(maxContribution)}
                    </p>
                    <div className="bg-surface-muted mt-3 h-1.5 overflow-hidden">
                      <div
                        className="bg-accent h-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-muted max-w-2xl leading-6">{module.rationale}</p>
                    {module.module.slug === "liquid-staking" &&
                    profile.liquidStakingDiagnosis ? (
                      <Link
                        href="#liquid-staking-diagnosis"
                        className="text-accent mt-2 inline-flex font-medium hover:underline"
                      >
                        Open liquid staking diagnosis
                      </Link>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-border/70 border-t">
              <td colSpan={3} className="py-4 text-foreground font-semibold">
                Total
              </td>
              <td className="py-4 text-foreground font-semibold">
                {formatScore(profile.readinessScore.totalScore)} / 10
              </td>
              <td className="py-4 text-muted">
                Sum of weighted module contributions under the active Atlas assumptions.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
