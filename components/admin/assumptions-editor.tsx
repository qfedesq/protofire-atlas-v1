import {
  updateEconomyAssumptionsAction,
  updateGlobalRankingAssumptionsAction,
  updateGlobalRankingSubweightsAction,
  updateAnalysisSettingsAction,
  updateOpportunityScoringAssumptionsAction,
  updateOpportunityScoringAdvancedAssumptionsAction,
  updateProposalGeneratorSettingsAction,
  updateStatusScoresAction,
  updateWedgeApplicabilityAssumptionsAction,
} from "@/app/internal/admin/actions";
import { listAnalysisPromptTemplateKeys } from "@/lib/analysis/prompt-templates";
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
  const promptTemplateKeys = listAnalysisPromptTemplateKeys();

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

      <Panel className="space-y-5">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Global ranking subweights
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Ecosystem, adoption, and performance internals
          </h2>
        </div>
        <form action={updateGlobalRankingSubweightsAction} className="space-y-5">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="space-y-4">
            <h3 className="text-foreground text-lg font-semibold">Ecosystem</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                  Protocols
                </label>
                <input
                  name="ecosystem:protocols"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={assumptions.globalRanking.ecosystemSubweights.protocols}
                  className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                  Ecosystem projects
                </label>
                <input
                  name="ecosystem:ecosystemProjects"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={
                    assumptions.globalRanking.ecosystemSubweights.ecosystemProjects
                  }
                  className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground text-lg font-semibold">Adoption</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                  Wallets
                </label>
                <input
                  name="adoption:wallets"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={assumptions.globalRanking.adoptionSubweights.wallets}
                  className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                  Active users
                </label>
                <input
                  name="adoption:activeUsers"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={assumptions.globalRanking.adoptionSubweights.activeUsers}
                  className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground text-lg font-semibold">Performance</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                  Avg tx speed
                </label>
                <input
                  name="performance:averageTransactionSpeed"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={
                    assumptions.globalRanking.performanceSubweights
                      .averageTransactionSpeed
                  }
                  className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                  Block time
                </label>
                <input
                  name="performance:blockTime"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={assumptions.globalRanking.performanceSubweights.blockTime}
                  className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                  Throughput
                </label>
                <input
                  name="performance:throughputIndicator"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={
                    assumptions.globalRanking.performanceSubweights
                      .throughputIndicator
                  }
                  className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
          >
            Save subweights
          </button>
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

      <Panel className="space-y-4">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Opportunity scoring internals
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Stack-fit and priority thresholds
          </h2>
        </div>

        <form
          action={updateOpportunityScoringAdvancedAssumptionsAction}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              Stack-fit lift ratio
            </label>
            <input
              name="stackFit:liftRatio"
              type="number"
              min="0"
              max="100"
              step="1"
              defaultValue={assumptions.opportunityScoring.stackFitComponents.liftRatio}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              Stack-fit coverage ratio
            </label>
            <input
              name="stackFit:coverageRatio"
              type="number"
              min="0"
              max="100"
              step="1"
              defaultValue={
                assumptions.opportunityScoring.stackFitComponents.coverageRatio
              }
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              High priority
            </label>
            <input
              name="priority:high"
              type="number"
              min="0"
              max="10"
              step="0.1"
              defaultValue={assumptions.opportunityScoring.priorityThresholds.high}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              Medium priority
            </label>
            <input
              name="priority:medium"
              type="number"
              min="0"
              max="10"
              step="0.1"
              defaultValue={assumptions.opportunityScoring.priorityThresholds.medium}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Save opportunity internals
            </button>
          </div>
        </form>
      </Panel>

      <Panel className="space-y-5">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Wedge applicability
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Deterministic applicability rules
          </h2>
          <p className="text-muted mt-3 text-sm leading-6">
            These values drive the technical applicability baseline. Keep the
            JSON blocks coherent with the chain capability keys already used by
            Atlas.
          </p>
        </div>

        <form action={updateWedgeApplicabilityAssumptionsAction} className="space-y-5">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input
            type="hidden"
            name="wedgeApplicability"
            value={JSON.stringify(assumptions.wedgeApplicability)}
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(assumptions.wedgeApplicability.signalScores).map(
              ([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                    Signal {key}
                  </label>
                  <input
                    name={`signal:${key}`}
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    defaultValue={value}
                    className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                    required
                  />
                </div>
              ),
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                Applicable minimum
              </label>
              <input
                name="threshold:applicableMinimum"
                type="number"
                min="0"
                max="100"
                step="1"
                defaultValue={
                  assumptions.wedgeApplicability.thresholds.applicableMinimum
                }
                className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                Partial minimum
              </label>
              <input
                name="threshold:partialMinimum"
                type="number"
                min="0"
                max="100"
                step="1"
                defaultValue={assumptions.wedgeApplicability.thresholds.partialMinimum}
                className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                Minimum confidence
              </label>
              <select
                name="confidence:minimumConfidenceForDefinitiveStatus"
                defaultValue={
                  assumptions.wedgeApplicability.confidence
                    .minimumConfidenceForDefinitiveStatus
                }
                className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                Manual review below
              </label>
              <input
                name="confidence:manualReviewBelowScore"
                type="number"
                min="0"
                max="100"
                step="1"
                defaultValue={
                  assumptions.wedgeApplicability.confidence.manualReviewBelowScore
                }
                className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              name="confidence:unknownWhenRequiredCapabilityIsUnknown"
              defaultChecked={
                assumptions.wedgeApplicability.confidence
                  .unknownWhenRequiredCapabilityIsUnknown
              }
            />
            Force unknown when a required capability is unknown
          </label>

          <div className="space-y-4">
            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Capability weights by wedge
              </h3>
              <p className="text-muted mt-2 text-sm leading-6">
                JSON object keyed by economy slug, then capability key.
              </p>
            </div>
            <textarea
              name="wedgeCapabilityWeights"
              defaultValue={JSON.stringify(
                assumptions.wedgeApplicability.wedgeCapabilityWeights,
                null,
                2,
              )}
              rows={18}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 font-mono text-xs outline-none"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Prerequisites by wedge
              </h3>
              <p className="text-muted mt-2 text-sm leading-6">
                JSON object keyed by economy slug, then capability key, using
                values like required, optional, or unsupported.
              </p>
            </div>
            <textarea
              name="wedgePrerequisites"
              defaultValue={JSON.stringify(
                assumptions.wedgeApplicability.wedgePrerequisites,
                null,
                2,
              )}
              rows={18}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 font-mono text-xs outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
          >
            Save applicability rules
          </button>
        </form>
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Analysis settings
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            GPT-assisted workflow settings
          </h2>
        </div>

        <form action={updateAnalysisSettingsAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              Model name
            </label>
            <input
              name="modelName"
              type="text"
              defaultValue={assumptions.analysisSettings.modelName}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              Prompt template
            </label>
            <select
              name="promptTemplateKey"
              defaultValue={assumptions.analysisSettings.promptTemplateKey}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
            >
              {promptTemplateKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              Sensitivity
            </label>
            <input
              name="sensitivity"
              type="number"
              min="0"
              max="1"
              step="0.1"
              defaultValue={assumptions.analysisSettings.sensitivity}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              Opportunity threshold
            </label>
            <input
              name="opportunityThreshold"
              type="number"
              min="0"
              max="10"
              step="0.1"
              defaultValue={assumptions.analysisSettings.opportunityThreshold}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              Manual review threshold
            </label>
            <input
              name="manualReviewThreshold"
              type="number"
              min="0"
              max="10"
              step="0.1"
              defaultValue={assumptions.analysisSettings.manualReviewThreshold}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-foreground xl:col-span-3">
            <input
              type="checkbox"
              name="useMockWhenUnavailable"
              defaultChecked={assumptions.analysisSettings.useMockWhenUnavailable}
            />
            Use deterministic mock output when live OpenAI execution is unavailable
          </label>
          <div className="xl:col-span-3">
            <button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Save analysis settings
            </button>
          </div>
        </form>
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Proposal engine
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Proposal scoring weights
          </h2>
        </div>

        <form action={updateProposalGeneratorSettingsAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          {(
            [
              ["applicability", "Applicability"],
              ["gapSeverity", "Gap severity"],
              ["personaFit", "Persona fit"],
              ["expectedImpact", "Expected impact"],
              ["roiPotential", "ROI potential"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
                {label}
              </label>
              <input
                name={`proposal:${key}`}
                type="number"
                min="0"
                max="100"
                step="1"
                defaultValue={assumptions.proposalGenerator.weights[key]}
                className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              High threshold
            </label>
            <input
              name="proposal:high"
              type="number"
              min="0"
              max="100"
              step="1"
              defaultValue={assumptions.proposalGenerator.priorityThresholds.high}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted text-xs font-medium tracking-[0.16em] uppercase">
              Medium threshold
            </label>
            <input
              name="proposal:medium"
              type="number"
              min="0"
              max="100"
              step="1"
              defaultValue={assumptions.proposalGenerator.priorityThresholds.medium}
              className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </div>
          <div className="xl:col-span-5">
            <button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Save proposal settings
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
                  <div className="space-y-2">
                    <label
                      htmlFor={`${economy.slug}-maximum-score`}
                      className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
                    >
                      Maximum score
                    </label>
                    <input
                      id={`${economy.slug}-maximum-score`}
                      name="maximumScore"
                      type="number"
                      min="1"
                      max="100"
                      step="0.1"
                      defaultValue={current.maximumScore}
                      className="border-border text-foreground focus:border-accent w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                      required
                    />
                  </div>
                </div>

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
