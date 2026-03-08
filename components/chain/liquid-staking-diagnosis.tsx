import { ChevronDown } from "lucide-react";

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
    <div className="space-y-5">
      <div className="border-border/70 border-t pt-4">
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Weighted LST score
        </p>
        <p className="text-foreground mt-2 text-4xl font-semibold">
          {formatDiagnosisScore(diagnosis.weightedScore)}
          <span className="text-muted ml-2 text-base font-medium">/ 100</span>
        </p>
      </div>

      <div className="border-border/70 divide-y border-t">
        {diagnosis.dimensions.map((dimension) => (
          <div key={dimension.dimension.id} className="grid gap-4 py-4 lg:grid-cols-[0.32fr_0.68fr]">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-foreground text-lg font-semibold">
                  {dimension.dimension.name}
                </p>
                <p className="text-foreground text-lg font-semibold">
                  {dimension.score}
                </p>
              </div>
              <p className="text-muted mt-2 text-sm leading-6">
                {dimension.dimension.description}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-muted text-xs tracking-[0.16em] uppercase">
                  Weight
                </p>
                <p className="text-foreground mt-2 text-sm font-semibold">
                  {dimension.weight}%
                </p>
              </div>
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
          </div>
        ))}
      </div>

      {marketSnapshot ? (
        <details className="group border-border/70 border-t pt-4">
          <summary className="list-none cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-accent text-xs tracking-[0.16em] uppercase">
                  LST market snapshot
                </p>
                <h3 className="text-foreground mt-2 text-xl font-semibold">
                  Current source-backed fields
                </h3>
              </div>
              <ChevronDown className="text-muted mt-1 h-5 w-5 shrink-0 transition group-open:rotate-180" />
            </div>
          </summary>
          <div className="mt-4 space-y-4">
            <p className="text-muted max-w-3xl text-sm leading-6">
              Snapshot date {marketSnapshot.snapshotDate}. Captured fields are
              shown directly; pending and non-applicable fields stay explicit
              until a verified source snapshot is added.
            </p>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <MetricRow
                label="Native Token"
                value={
                  marketSnapshot.nativeTokenSymbol ??
                  getMetricPlaceholder("nativeTokenSymbol", marketSnapshot.sources)
                }
              />
              <MetricRow
                label="Market Cap"
                value={
                  marketSnapshot.marketCapUsd == null
                    ? getMetricPlaceholder("marketCapUsd", marketSnapshot.sources)
                    : formatCurrencyCompact(marketSnapshot.marketCapUsd)
                }
              />
              <MetricRow
                label="% Staked"
                value={
                  marketSnapshot.percentStaked == null
                    ? getMetricPlaceholder("percentStaked", marketSnapshot.sources)
                    : `${marketSnapshot.percentStaked}%`
                }
              />
              <MetricRow
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
              <MetricRow
                label="# Stakers"
                value={
                  marketSnapshot.stakersCount == null
                    ? getMetricPlaceholder("stakersCount", marketSnapshot.sources)
                    : Intl.NumberFormat("en-US").format(
                        marketSnapshot.stakersCount,
                      )
                }
              />
              <MetricRow
                label="Global LST Health"
                value={`${marketSnapshot.globalLstHealthScore}`}
              />
              <MetricRow
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
              <MetricRow
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
              <MetricRow
                label="DeFi TVL"
                value={formatCurrencyCompact(marketSnapshot.defiTvlUsd)}
              />
            </div>

            <div className="border-border/70 divide-y border-t">
              {marketSnapshot.sources.map((source) => (
                <div key={`${source.metric}:${source.provider}`} className="py-4 text-sm">
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
                    className="text-accent mt-2 inline-flex hover:underline"
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

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-[var(--border)] pl-4">
      <p className="text-muted text-xs tracking-[0.16em] uppercase">{label}</p>
      <p className="text-foreground mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
