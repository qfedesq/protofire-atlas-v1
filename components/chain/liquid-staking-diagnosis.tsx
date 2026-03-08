import { ChevronDown } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import type {
  LiquidStakingDiagnosis,
  LiquidStakingMarketSnapshot,
} from "@/lib/domain/types";
import { formatCurrencyCompact } from "@/lib/utils/format";

function formatDiagnosisScore(score: number) {
  return Math.round(score);
}

function getMetricPlaceholder(
  metric: string,
  sources: LiquidStakingMarketSnapshot["sources"],
) {
  return sources.find((source) => source.metric === metric)?.status ===
    "not-applicable"
    ? "Not applicable"
    : "Pending source";
}

export function LiquidStakingDiagnosisSection({
  diagnosis,
  marketSnapshot,
}: {
  diagnosis: LiquidStakingDiagnosis;
  marketSnapshot?: LiquidStakingMarketSnapshot;
}) {
  return (
    <div className="space-y-4">
      <Panel className="min-w-44 px-5 py-4 shadow-none">
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Weighted LST score
        </p>
        <p className="text-foreground mt-2 text-3xl font-semibold">
          {formatDiagnosisScore(diagnosis.weightedScore)}
        </p>
        <p className="text-muted mt-1 text-sm">/ 100</p>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {diagnosis.dimensions.map((dimension) => (
          <Panel key={dimension.dimension.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-foreground text-lg font-semibold">
                  {dimension.dimension.name}
                </p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {dimension.dimension.description}
                </p>
              </div>
              <div className="border-border/70 min-w-20 border-l pl-4 text-right">
                <p className="text-foreground text-xl font-semibold">
                  {dimension.score}
                </p>
                <p className="text-muted mt-1 text-xs uppercase">
                  {dimension.weight}% weight
                </p>
              </div>
            </div>

            <div className="border-border/70 mt-5 grid gap-4 border-t pt-4 lg:grid-cols-2">
              <div>
                <p className="text-muted text-xs tracking-[0.16em] uppercase">
                  Rationale
                </p>
                <p className="text-foreground mt-2 text-sm leading-6">
                  {dimension.rationale}
                </p>
              </div>
              <div>
                <p className="text-muted text-xs tracking-[0.16em] uppercase">
                  Risk
                </p>
                <p className="mt-2 text-sm leading-6 text-rose-600">
                  {dimension.risk}
                </p>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {marketSnapshot ? (
        <details className="group border-border bg-surface rounded-3xl border shadow-[var(--shadow-soft)]">
          <summary className="list-none cursor-pointer px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-accent text-xs tracking-[0.16em] uppercase">
                  LST market snapshot
                </p>
                <h3 className="text-foreground mt-2 text-xl font-semibold">
                  Current data fields prepared for onchain capture
                </h3>
              </div>
              <ChevronDown className="text-muted mt-1 h-5 w-5 shrink-0 transition group-open:rotate-180" />
            </div>
          </summary>
          <div className="border-border/60 px-6 pt-4 pb-6">
            <p className="text-muted max-w-3xl text-sm leading-6">
              Snapshot date {marketSnapshot.snapshotDate}. Captured fields are
              shown directly; pending and non-applicable fields stay explicit
              until a verified source snapshot is added.
            </p>

            <div className="border-border/70 mt-4 grid gap-4 border-t pt-4 md:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                label="Native Token"
                value={
                  marketSnapshot.nativeTokenSymbol ??
                  getMetricPlaceholder("nativeTokenSymbol", marketSnapshot.sources)
                }
              />
              <MetricCard
                label="Market Cap"
                value={
                  marketSnapshot.marketCapUsd == null
                    ? getMetricPlaceholder("marketCapUsd", marketSnapshot.sources)
                    : formatCurrencyCompact(marketSnapshot.marketCapUsd)
                }
              />
              <MetricCard
                label="% Staked"
                value={
                  marketSnapshot.percentStaked == null
                    ? getMetricPlaceholder("percentStaked", marketSnapshot.sources)
                    : `${marketSnapshot.percentStaked}%`
                }
              />
              <MetricCard
                label="Staking APY"
                value={
                  marketSnapshot.stakingApyPercent == null
                    ? getMetricPlaceholder(
                        "stakingApyPercent",
                        marketSnapshot.sources,
                      )
                    : `${marketSnapshot.stakingApyPercent}%`
                }
              />
              <MetricCard
                label="# Stakers"
                value={
                  marketSnapshot.stakersCount == null
                    ? getMetricPlaceholder("stakersCount", marketSnapshot.sources)
                    : Intl.NumberFormat("en-US").format(
                        marketSnapshot.stakersCount,
                      )
                }
              />
              <MetricCard
                label="Global LST Health"
                value={`${marketSnapshot.globalLstHealthScore}`}
              />
              <MetricCard
                label="# of LSTs"
                value={
                  marketSnapshot.lstProtocolCount == null
                    ? getMetricPlaceholder(
                        "lstProtocolCount",
                        marketSnapshot.sources,
                      )
                    : `${marketSnapshot.lstProtocolCount}`
                }
              />
              <MetricCard
                label="LST / Staked %"
                value={
                  marketSnapshot.lstToStakedPercent == null
                    ? getMetricPlaceholder(
                        "lstToStakedPercent",
                        marketSnapshot.sources,
                      )
                    : `${marketSnapshot.lstToStakedPercent}%`
                }
              />
              <MetricCard
                label="DeFi TVL"
                value={formatCurrencyCompact(marketSnapshot.defiTvlUsd)}
              />
            </div>

            <div className="border-border/70 mt-4 grid gap-4 border-t pt-4 lg:grid-cols-2">
              {marketSnapshot.sources.map((source) => (
                <div
                  key={`${source.metric}:${source.provider}`}
                  className="border-border/70 border-l pl-4 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-foreground font-medium">{source.metric}</p>
                    <p className="text-muted text-xs uppercase">
                      {source.provider} · {source.status}
                    </p>
                  </div>
                  <p className="text-muted mt-2 leading-6">{source.note}</p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent mt-3 inline-flex hover:underline"
                  >
                    Open source
                  </a>
                </div>
              ))}
            </div>
          </div>
        </details>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/70 border-l pl-4">
      <p className="text-muted text-xs tracking-[0.16em] uppercase">{label}</p>
      <p className="text-foreground mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
