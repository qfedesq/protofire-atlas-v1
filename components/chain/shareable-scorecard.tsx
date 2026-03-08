import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Panel } from "@/components/ui/panel";
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
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Public scorecard snapshot
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            {profile.chain.name} • {profile.economy.shortLabel}
          </h2>
          <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
            Share-ready summary of the current Atlas dataset, active scoring
            assumptions, visible gaps, and the corresponding Protofire stack.
          </p>
        </div>
        <ButtonLink href="#assessment">Request Infrastructure Assessment</ButtonLink>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="bg-surface-muted rounded-2xl p-4">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">Rank</p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            #{profile.rank}
          </p>
        </div>
        <div className="bg-surface-muted rounded-2xl p-4">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">Score</p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {formatScore(profile.readinessScore.totalScore)}
          </p>
        </div>
        <div className="bg-surface-muted rounded-2xl p-4">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Missing modules
          </p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {profile.gapAnalysis.filter((gap) => gap.status === "missing").length}
          </p>
        </div>
        <div className="bg-surface-muted rounded-2xl p-4">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Suggested activations
          </p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {profile.recommendedStack.recommendedModules.length}
          </p>
          <Link
            href="#suggested-activations"
            className="text-accent mt-3 inline-flex text-sm font-medium hover:underline"
          >
            Open suggested activations
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Module status summary
          </p>
          {profile.readinessScore.moduleBreakdown.map((module) => (
            <div
              key={module.module.id}
              className="bg-surface-muted flex items-center justify-between gap-3 rounded-2xl p-4"
            >
              <span className="text-foreground text-sm font-medium">
                {module.module.name}
              </span>
              <StatusBadge status={module.status} />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Missing infrastructure
          </p>
          {blockingModules.length === 0 ? (
            <Panel className="border-rose-200 bg-rose-50/70 shadow-none">
              <p className="text-muted text-sm leading-6">
                No missing infrastructure modules remain in the current Atlas
                model.
              </p>
            </Panel>
          ) : (
            blockingModules.map((gap) => (
              <div
                key={gap.module.id}
                className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4"
              >
                <p className="text-rose-700 text-[11px] font-semibold tracking-[0.14em] uppercase">
                  Diagnostic gap
                </p>
                <p className="text-foreground text-sm font-medium">
                  {gap.module.name}
                </p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {gap.impact}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Protofire recommended stack
          </p>
          {topRecommendations.length === 0 ? (
            <Panel className="border-accent/25 bg-accent/8 shadow-none">
              <p className="text-muted text-sm leading-6">
                Current posture is strong enough that Protofire can focus on
                optimization and packaging instead of foundational rollout.
              </p>
            </Panel>
          ) : (
            topRecommendations.map((recommendation) => (
              <div
                key={recommendation.title}
                className="rounded-2xl border border-accent/25 bg-accent/8 p-4"
              >
                <p className="text-accent text-[11px] font-semibold tracking-[0.14em] uppercase">
                  Activation plan
                </p>
                <p className="text-foreground text-sm font-medium">
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
    </Panel>
  );
}
