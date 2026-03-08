import { Panel } from "@/components/ui/panel";
import type {
  LiquidStakingDiagnosis,
  LiquidStakingMarketSnapshot,
} from "@/lib/domain/types";
import { formatCurrencyCompact } from "@/lib/utils/format";

function formatDiagnosisScore(score: number) {
  return Math.round(score);
}

export function LiquidStakingDiagnosisSection({
  diagnosis,
  marketSnapshot,
}: {
  diagnosis: LiquidStakingDiagnosis;
  marketSnapshot?: LiquidStakingMarketSnapshot;
}) {
  return (
    <section className="space-y-4" id="liquid-staking-diagnosis">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Liquid staking
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            7-module diagnosis
          </h2>
          <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
            Atlas uses a dedicated seven-part lens for liquid staking to make
            exit quality, peg behavior, DeFi utility, validator risk, and
            stress handling visible chain by chain.
          </p>
        </div>
        <Panel className="bg-surface-muted min-w-44 px-5 py-4 shadow-none">
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Weighted LST score
          </p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {formatDiagnosisScore(diagnosis.weightedScore)}
          </p>
          <p className="text-muted mt-1 text-sm">/ 100</p>
        </Panel>
      </div>

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
              <div className="bg-surface-muted min-w-20 rounded-2xl px-4 py-3 text-right">
                <p className="text-foreground text-xl font-semibold">
                  {dimension.score}
                </p>
                <p className="text-muted mt-1 text-xs uppercase">
                  {dimension.weight}% weight
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="bg-surface-muted rounded-2xl p-4">
                <p className="text-muted text-xs tracking-[0.16em] uppercase">
                  Rationale
                </p>
                <p className="text-foreground mt-2 text-sm leading-6">
                  {dimension.rationale}
                </p>
              </div>
              <div className="bg-surface-muted rounded-2xl p-4">
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
        <Panel className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-accent text-xs tracking-[0.16em] uppercase">
                LST market snapshot
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                Current data fields prepared for onchain capture
              </h3>
              <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
                Snapshot date {marketSnapshot.snapshotDate}. Captured fields are
                shown directly; pending fields stay explicit until a verified
                source snapshot is added.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Native Token"
              value={marketSnapshot.nativeTokenSymbol ?? "Pending source"}
            />
            <MetricCard
              label="Market Cap"
              value={
                marketSnapshot.marketCapUsd == null
                  ? "Pending source"
                  : formatCurrencyCompact(marketSnapshot.marketCapUsd)
              }
            />
            <MetricCard
              label="% Staked"
              value={
                marketSnapshot.percentStaked == null
                  ? "Pending source"
                  : `${marketSnapshot.percentStaked}%`
              }
            />
            <MetricCard
              label="Staking APY"
              value={
                marketSnapshot.stakingApyPercent == null
                  ? "Pending source"
                  : `${marketSnapshot.stakingApyPercent}%`
              }
            />
            <MetricCard
              label="# Stakers"
              value={
                marketSnapshot.stakersCount == null
                  ? "Pending source"
                  : Intl.NumberFormat("en-US").format(marketSnapshot.stakersCount)
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
                  ? "Pending source"
                  : `${marketSnapshot.lstProtocolCount}`
              }
            />
            <MetricCard
              label="LST / Staked %"
              value={
                marketSnapshot.lstToStakedPercent == null
                  ? "Pending source"
                  : `${marketSnapshot.lstToStakedPercent}%`
              }
            />
            <MetricCard
              label="DeFi TVL"
              value={formatCurrencyCompact(marketSnapshot.defiTvlUsd)}
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {marketSnapshot.sources.map((source) => (
              <div
                key={`${source.metric}:${source.provider}`}
                className="bg-surface-muted rounded-2xl p-4 text-sm"
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
        </Panel>
      ) : null}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-muted rounded-2xl p-4">
      <p className="text-muted text-xs tracking-[0.16em] uppercase">{label}</p>
      <p className="text-foreground mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
