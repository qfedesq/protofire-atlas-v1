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
    <div className="space-y-5">
      <dl className="border-border/70 grid gap-4 border-t pt-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <dt className="text-muted text-xs tracking-[0.14em] uppercase">
            Global rank
          </dt>
          <dd className="text-foreground mt-2 text-xl font-semibold">
            #{position.benchmarkRank}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.14em] uppercase">
            Global score
          </dt>
          <dd className="text-foreground mt-2 text-xl font-semibold">
            {formatScore(position.score.totalScore)}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.14em] uppercase">
            Economy composite
          </dt>
          <dd className="text-foreground mt-2 text-xl font-semibold">
            {formatScore(position.score.economyCompositeScore)}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs tracking-[0.14em] uppercase">
            Source TVL
          </dt>
          <dd className="text-foreground mt-2 text-xl font-semibold">
            {formatCurrencyCompact(position.chain.sourceTvlUsd)}
          </dd>
        </div>
      </dl>

      <div className="grid gap-6 lg:grid-cols-3">
        <MetricGroup
          title="Adoption metrics"
          rows={[
            ["Wallets", formatCountCompact(position.score.metrics.wallets)],
            ["Active users", formatCountCompact(position.score.metrics.activeUsers)],
            [
              "Transactions",
              position.score.metrics.transactions == null
                ? "Not captured"
                : formatCountCompact(position.score.metrics.transactions),
            ],
          ]}
        />
        <MetricGroup
          title="Ecosystem activity"
          rows={[
            ["Protocols", formatCountCompact(position.score.metrics.protocols)],
            [
              "Ecosystem projects",
              formatCountCompact(position.score.metrics.ecosystemProjects),
            ],
          ]}
        />
        <MetricGroup
          title="Performance"
          rows={[
            [
              "Avg transaction speed",
              `${position.score.metrics.averageTransactionSpeed}s`,
            ],
            ["Block time", `${position.score.metrics.blockTime}s`],
            [
              "Throughput indicator",
              formatCountCompact(position.score.metrics.throughputIndicator),
            ],
          ]}
        />
      </div>
    </div>
  );
}

function MetricGroup({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) {
  return (
    <div>
      <p className="text-muted text-xs tracking-[0.14em] uppercase">{title}</p>
      <div className="border-border/70 divide-y border-t pt-1">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 py-3 text-sm">
            <span className="text-muted">{label}</span>
            <span className="text-foreground font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
