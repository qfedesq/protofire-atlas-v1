import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { getAdminAccessState, isAdminAuthenticated } from "@/lib/admin/auth";
import { getActiveAssumptions } from "@/lib/assumptions/store";
import { listLiquidStakingDiagnosticDimensions } from "@/lib/liquid-staking/diagnosis";
import { formatScore } from "@/lib/utils/format";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

import {
  loginAdminAction,
  logoutAdminAction,
  syncAtlasDataNowAction,
  updateEconomyAssumptionsAction,
  updateGlobalRankingAssumptionsAction,
  updateOpportunityScoringAssumptionsAction,
  updateStatusScoresAction,
} from "./actions";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getMessage(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatSavedMessage(savedMessage: string) {
  if (savedMessage === "sync-now") {
    return "Atlas sync completed for the currently supported refresh workflow.";
  }

  return `Saved assumption set: ${savedMessage}.`;
}

function formatErrorMessage(errorMessage: string) {
  if (errorMessage === "sync-now") {
    return "Atlas sync could not complete in the current environment.";
  }

  return `Could not save assumption set: ${errorMessage}.`;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const authMessage = getMessage(params?.auth);
  const savedMessage = getMessage(params?.saved);
  const errorMessage = getMessage(params?.error);
  const access = getAdminAccessState();

  if (!access.enabled) {
    return (
      <Panel className="mx-auto max-w-3xl space-y-4">
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Internal admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold">
          Admin access is disabled
        </h1>
        <p className="text-muted text-sm leading-6">
          Set <code>ATLAS_ADMIN_PASSWORD</code> to enable the narrow assumptions
          editor for Protofire management.
        </p>
      </Panel>
    );
  }

  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <Panel className="mx-auto max-w-3xl space-y-5">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Internal admin
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold">
            Calculation assumptions
          </h1>
          <p className="text-muted mt-3 text-sm leading-6">
            This route only manages scoring weights, status mappings, and
            recommendation thresholds. It is intentionally not a general admin
            system.
          </p>
        </div>

        {authMessage === "error" ? (
          <p className="text-rose-600 text-sm">
            Invalid admin password. Please try again.
          </p>
        ) : null}

        {access.defaultPassword ? (
          <p className="text-muted text-sm leading-6">
            Local development default password:{" "}
            <code>{access.defaultPassword}</code>
          </p>
        ) : null}

        <form action={loginAdminAction} className="space-y-3">
          <label
            htmlFor="password"
            className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
          >
            Admin password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
            required
          />
          <button
            type="submit"
            className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
          >
            Open assumptions
          </button>
        </form>
      </Panel>
    );
  }

  const assumptions = getActiveAssumptions();
  const repository = createSeedChainsRepository();
  const economies = repository.listEconomies();
  const liquidStakingDimensions = listLiquidStakingDiagnosticDimensions();
  const globalPreview = repository.listGlobalRankedChains().slice(0, 5);

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Internal admin
            </p>
            <h1 className="text-foreground mt-2 text-3xl font-semibold">
              Active Atlas assumptions
            </h1>
            <p className="text-muted mt-3 text-sm leading-6">
              Last updated {assumptions.updatedAt} by {assumptions.updatedBy}.
              Saving these values changes the public readiness model, rankings,
              and recommendation behavior.
            </p>
            <p className="text-muted mt-2 text-sm leading-6">
              This page is the narrow management surface for weights, status
              mappings, and recommendation thresholds only.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link
                href="/internal/targets"
                className="text-accent font-medium hover:underline"
              >
                Open target accounts
              </Link>
              <Link
                href="/internal/admin/data-sources"
                className="text-accent font-medium hover:underline"
              >
                Open data source registry
              </Link>
            </div>
          </div>
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="border-border text-foreground hover:border-accent hover:text-accent inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition"
            >
              Log out
            </button>
          </form>
        </div>

        {authMessage === "success" ? (
          <p className="text-accent text-sm">Admin session opened.</p>
        ) : null}
        {savedMessage ? (
          <p className="text-accent text-sm">
            {formatSavedMessage(savedMessage)}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="text-rose-600 text-sm">
            {formatErrorMessage(errorMessage)}
          </p>
        ) : null}
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Snapshot refresh
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Sync supported Atlas sources
          </h2>
          <p className="text-muted mt-3 text-sm leading-6">
            Runs the current Atlas refresh workflow for the top-30 benchmark,
            the source-backed external chain metrics snapshot, and the public
            reports/exports. This is not live synchronization and only persists
            in writable environments.
          </p>
        </div>
        <form action={syncAtlasDataNowAction}>
          <button
            type="submit"
            className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
          >
            SYNC NOW
          </button>
        </form>
      </Panel>

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
          const currentPreview = repository.listRankedChains({
            economy: economy.slug,
            limit: 3,
          });

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

                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div className="bg-surface-muted rounded-2xl p-4">
                    <p className="text-muted text-xs tracking-[0.14em] uppercase">
                      Current ranking preview
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      {currentPreview.map((row) => (
                        <div
                          key={`${economy.slug}:${row.chain.slug}`}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-foreground">
                            #{row.benchmarkRank} {row.chain.name}
                          </span>
                          <span className="text-muted">
                            {formatScore(row.readinessScore.totalScore)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

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
    </div>
  );
}
