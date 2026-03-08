import { Panel } from "@/components/ui/panel";
import type { GlobalRankedChain } from "@/lib/domain/types";
import {
  formatCountCompact,
  formatCurrencyCompact,
  formatScore,
} from "@/lib/utils/format";

export function GlobalPositionSection({
  position,
}: {
  position: GlobalRankedChain;
}) {
  return (
    <Panel className="space-y-6">
      <div>
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Global position
        </p>
        <h2 className="text-foreground mt-2 text-2xl font-semibold">
          Ecosystem context across readiness, adoption, and performance
        </h2>
        <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
          Atlas combines the four economy scores with curated ecosystem
          activity, adoption, and performance indicators to position the chain
          in the broader EVM landscape.
        </p>
      </div>

      <div className="border-border/70 grid gap-4 border-t pt-4 lg:grid-cols-5">
        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Global rank
          </p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            #{position.benchmarkRank}
          </p>
        </div>
        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Global score
          </p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {formatScore(position.score.totalScore)}
          </p>
        </div>
        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Economy composite
          </p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {formatScore(position.score.economyCompositeScore)}
          </p>
        </div>
        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Ecosystem activity
          </p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {formatScore(position.score.ecosystemScore)}
          </p>
        </div>
        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Adoption + performance
          </p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {formatScore(
              (position.score.adoptionScore + position.score.performanceScore) / 2,
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Adoption metrics
          </p>
          <div className="border-border/70 divide-y border-t text-sm">
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Wallets</span>
              <span className="text-foreground font-medium">
                {formatCountCompact(position.score.metrics.wallets)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Active users</span>
              <span className="text-foreground font-medium">
                {formatCountCompact(position.score.metrics.activeUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Source TVL</span>
              <span className="text-foreground font-medium">
                {formatCurrencyCompact(position.chain.sourceTvlUsd)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Ecosystem activity
          </p>
          <div className="border-border/70 divide-y border-t text-sm">
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Protocols</span>
              <span className="text-foreground font-medium">
                {formatCountCompact(position.score.metrics.protocols)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Ecosystem projects</span>
              <span className="text-foreground font-medium">
                {formatCountCompact(position.score.metrics.ecosystemProjects)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Technical performance
          </p>
          <div className="border-border/70 divide-y border-t text-sm">
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Avg transaction speed</span>
              <span className="text-foreground font-medium">
                {position.score.metrics.averageTransactionSpeed}s
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Block time</span>
              <span className="text-foreground font-medium">
                {position.score.metrics.blockTime}s
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Throughput indicator</span>
              <span className="text-foreground font-medium">
                {formatCountCompact(position.score.metrics.throughputIndicator)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
