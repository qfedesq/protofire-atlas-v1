import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import type { ChainProfile } from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function ShareableScorecard({
  profile,
}: {
  profile: ChainProfile;
}) {
  const topRecommendations = profile.recommendedStack.recommendedModules.slice(0, 3);
  const blockingModules = profile.gapAnalysis.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-foreground text-2xl font-semibold">
            {profile.chain.name} · {profile.economy.shortLabel}
          </h3>
          <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
            Share-ready summary of the current Atlas score, visible blockers, and
            the corresponding Protofire activation path.
          </p>
        </div>
        <Link
          href="#assessment"
          className="text-accent inline-flex text-sm font-semibold hover:underline"
        >
          Request Infrastructure Assessment
        </Link>
      </div>

      <dl className="border-border/70 grid gap-4 border-t pt-4 lg:grid-cols-4">
        <div>
          <dt className="text-muted text-xs tracking-[0.14em] uppercase">Rank</dt>
          <dd className="text-foreground mt-2 text-3xl font-semibold">
            #{profile.rank}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.14em] uppercase">Score</dt>
          <dd className="text-foreground mt-2 text-3xl font-semibold">
            {formatScore(profile.readinessScore.totalScore)}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.14em] uppercase">
            Missing modules
          </dt>
          <dd className="text-foreground mt-2 text-3xl font-semibold">
            {profile.gapAnalysis.filter((gap) => gap.status === "missing").length}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.14em] uppercase">
            Suggested activations
          </dt>
          <dd className="text-foreground mt-2 text-3xl font-semibold">
            {profile.recommendedStack.recommendedModules.length}
          </dd>
          <Link
            href="#suggested-activations"
            className="text-accent mt-2 inline-flex text-sm font-medium hover:underline"
          >
            Open suggested activations
          </Link>
        </div>
      </dl>

      <div className="space-y-6">
        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Module status summary
          </p>
          <div className="border-border/70 divide-y border-t">
            {profile.readinessScore.moduleBreakdown.map((module) => (
              <div
                key={module.module.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <span className="text-foreground text-sm font-medium">
                  {module.module.name}
                </span>
                <StatusBadge status={module.status} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Missing infrastructure
          </p>
          <div className="border-border/70 divide-y border-t">
            {blockingModules.length === 0 ? (
              <div className="py-3">
                <p className="text-muted text-sm leading-6">
                  No missing infrastructure modules remain in the current Atlas
                  model.
                </p>
              </div>
            ) : (
              blockingModules.map((gap) => (
                <div key={gap.module.id} className="py-3">
                  <p className="text-rose-700 text-[11px] font-semibold tracking-[0.14em] uppercase">
                    Diagnostic gap
                  </p>
                  <p className="text-foreground mt-1 text-sm font-medium">
                    {gap.module.name}
                  </p>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {gap.impact}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Protofire recommended stack
          </p>
          <div className="border-border/70 divide-y border-t">
            {topRecommendations.length === 0 ? (
              <div className="py-3">
                <p className="text-muted text-sm leading-6">
                  Current posture is strong enough that Protofire can focus on
                  optimization and packaging instead of foundational rollout.
                </p>
              </div>
            ) : (
              topRecommendations.map((recommendation) => (
                <div key={recommendation.title} className="py-3">
                  <p className="text-accent text-[11px] font-semibold tracking-[0.14em] uppercase">
                    Activation plan
                  </p>
                  <p className="text-foreground mt-1 text-sm font-medium">
                    {recommendation.title}
                  </p>
                  {recommendation.kpis[0] ? (
                    <p className="text-foreground mt-2 text-sm font-semibold">
                      {recommendation.kpis[0].label}: {recommendation.kpis[0].value}
                    </p>
                  ) : null}
                  <p className="text-muted mt-2 text-sm leading-6">
                    {recommendation.directChainImpact}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
