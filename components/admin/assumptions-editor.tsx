import {
  updateEconomyAssumptionsAction,
  updateGlobalRankingAssumptionsAction,
  updateOpportunityScoringAssumptionsAction,
  updateStatusScoresAction,
} from "@/app/internal/admin/actions";
import type { ActiveAssumptions } from "@/lib/assumptions/types";
import type {
  EconomyType,
  GlobalRankedChain,
  LiquidStakingDiagnosticDimension,
} from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";
import { Panel } from "@/components/ui/panel";

type AssumptionsEditorProps = {
  assumptions: ActiveAssumptions;
  economies: EconomyType[];
  liquidStakingDimensions: LiquidStakingDiagnosticDimension[];
  globalPreview: GlobalRankedChain[];
  redirectTo: string;
};

export function AssumptionsEditor({
  assumptions,
  economies,
  liquidStakingDimensions,
  globalPreview,
  redirectTo,
}: AssumptionsEditorProps) {
  return (
    <>
      <Panel className="space-y-4">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Status mapping
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Global score assumptions
          </h2>
        </div>
        <form action={updateStatusScoresAction} className="grid gap-4 md:grid-cols-3">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          {Object.entries(assumptions.statusScores).map(([status, score]) => (
            <div key={status} className="space-y-2">
              <label
                htmlFor={status}
                className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
              >
                {status}
              </label>
              <input
                id={status}
                name={status}
                type="number"
                min="0"
                max="1"
                step="0.1"
                defaultValue={score}
                className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </div>
          ))}
          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Save status mapping
            </button>
          </div>
        </form>
      </Panel>

      <Panel className="space-y-5">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Global ranking
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Global Chain Ranking weights
          </h2>
          <p className="text-muted mt-3 text-sm leading-6">
            These weights control how Atlas blends economy readiness,
            ecosystem vitality, adoption, and technical performance on
            <code> /rankings/global</code>.
          </p>
        </div>

        <form action={updateGlobalRankingAssumptionsAction} className="space-y-5">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                Economy score
              </label>
              <input
                name="economyScoreWeight"
                type="number"
                min="0"
                max="100"
                step="1"
                defaultValue={assumptions.globalRanking.componentWeights.economyScore}
                className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                Ecosystem
              </label>
              <input
                name="ecosystemWeight"
                type="number"
                min="0"
                max="100"
                step="1"
                defaultValue={assumptions.globalRanking.componentWeights.ecosystem}
                className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                Adoption
              </label>
              <input
                name="adoptionWeight"
                type="number"
                min="0"
                max="100"
                step="1"
                defaultValue={assumptions.globalRanking.componentWeights.adoption}
                className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                Performance
              </label>
              <input
                name="performanceWeight"
                type="number"
                min="0"
                max="100"
                step="1"
                defaultValue={assumptions.globalRanking.componentWeights.performance}
                className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Economy composite
              </p>
              <h3 className="text-foreground mt-2 text-lg font-semibold">
                Composite economy weights
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {economies.map((economy) => (
                <div key={economy.slug} className="space-y-2">
                  <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                    {economy.shortLabel}
                  </label>
                  <input
                    name={economy.slug}
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    defaultValue={
                      assumptions.globalRanking.economyCompositeWeights[economy.slug]
                    }
                    className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="bg-surface-muted rounded-2xl p-4">
              <p className="text-muted text-xs tracking-[0.14em] uppercase">
                Current global preview
              </p>
              <div className="mt-3 space-y-2 text-sm">
                {globalPreview.map((row) => (
                  <div
                    key={row.chain.slug}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-foreground">
                      #{row.benchmarkRank} {row.chain.name}
                    </span>
                    <span className="text-muted">
                      {formatScore(row.score.totalScore)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Save global ranking weights
            </button>
          </div>
        </form>
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Target account mode
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Opportunity score weights
          </h2>
          <p className="text-muted mt-3 text-sm leading-6">
            These weights drive the internal commercial-priority model on
            <code> /internal/targets</code>.
          </p>
        </div>

        <form
          action={updateOpportunityScoringAssumptionsAction}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <input type="hidden" name="redirectTo" value={redirectTo} />
          {Object.entries(assumptions.opportunityScoring.weights).map(
            ([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                  {key}
                </label>
                <input
                  name={key}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={value}
                  className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
            ),
          )}
          <div className="md:col-span-2 xl:col-span-4">
            <button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Save opportunity weights
            </button>
          </div>
        </form>
      </Panel>

      <div className="grid gap-4">
        {economies.map((economy) => {
          const current = assumptions.economies[economy.slug];

          return (
            <Panel key={economy.slug} className="space-y-5">
              <div>
                <p className="text-accent text-xs tracking-[0.16em] uppercase">
                  {economy.shortLabel}
                </p>
                <h2 className="text-foreground mt-2 text-2xl font-semibold">
                  {economy.name}
                </h2>
                <p className="text-muted mt-3 text-sm leading-6">
                  Edit module weights and recommendation sensitivity for this
                  economy only. Total module weight must stay at 100.
                </p>
              </div>

              <form action={updateEconomyAssumptionsAction} className="space-y-5">
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <input type="hidden" name="economy" value={economy.slug} />
                <input
                  type="hidden"
                  name="moduleWeights"
                  value={JSON.stringify(current.moduleWeights)}
                />
                <input
                  type="hidden"
                  name="moduleDiagnosticWeights"
                  value={JSON.stringify(current.moduleDiagnosticWeights ?? {})}
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {economy.modules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <label
                        htmlFor={`${economy.slug}-${module.slug}`}
                        className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
                      >
                        {module.name}
                      </label>
                      <input
                        id={`${economy.slug}-${module.slug}`}
                        name={`weight:${module.slug}`}
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        defaultValue={current.moduleWeights[module.slug]}
                        className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>

                {economy.slug === "defi-infrastructure" ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted text-xs tracking-[0.16em] uppercase">
                        Liquid staking diagnosis
                      </p>
                      <h3 className="text-foreground mt-2 text-lg font-semibold">
                        7-module LST weight model
                      </h3>
                      <p className="text-muted mt-2 text-sm leading-6">
                        These weights drive the visible 7-module liquid staking
                        diagnosis shown inside DeFi chain profiles.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {liquidStakingDimensions.map((dimension) => (
                        <div key={dimension.id} className="space-y-2">
                          <label
                            htmlFor={`${economy.slug}-${dimension.slug}`}
                            className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
                          >
                            {dimension.name}
                          </label>
                          <input
                            id={`${economy.slug}-${dimension.slug}`}
                            name={`diagnostic-weight:liquid-staking:${dimension.slug}`}
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            defaultValue={
                              current.moduleDiagnosticWeights?.["liquid-staking"]?.[
                                dimension.slug
                              ] ?? dimension.defaultWeight
                            }
                            className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                            required
                          />
                          <p className="text-muted text-xs leading-5">
                            {dimension.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label
                      htmlFor={`${economy.slug}-threshold`}
                      className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
                    >
                      Recommendation threshold
                    </label>
                    <input
                      id={`${economy.slug}-threshold`}
                      name="thresholdScore"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue={current.recommendationConfig.thresholdScore}
                      className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                      required
                    />
                  </div>

                  <label className="bg-surface-muted flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                    <input
                      type="checkbox"
                      name="includePartialRecommendations"
                      defaultChecked={
                        current.recommendationConfig.includePartialRecommendations
                      }
                    />
                    <span className="text-foreground">
                      Partial modules trigger recommendations
                    </span>
                  </label>

                  <label className="bg-surface-muted flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                    <input
                      type="checkbox"
                      name="includeMissingRecommendations"
                      defaultChecked={
                        current.recommendationConfig.includeMissingRecommendations
                      }
                    />
                    <span className="text-foreground">
                      Missing modules trigger recommendations
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2 xl:col-span-4">
                  <button
                    type="submit"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
                  >
                    Save {economy.shortLabel} assumptions
                  </button>
                </div>
              </form>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
