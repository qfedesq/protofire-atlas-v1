import { Panel } from "@/components/ui/panel";
import type { LiquidStakingDiagnosis } from "@/lib/domain/types";

function formatDiagnosisScore(score: number) {
  return Math.round(score);
}

export function LiquidStakingDiagnosisSection({
  diagnosis,
}: {
  diagnosis: LiquidStakingDiagnosis;
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
    </section>
  );
}
