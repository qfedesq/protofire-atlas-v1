import { Panel } from "@/components/ui/panel";
import { getAdminAccessState, isAdminAuthenticated } from "@/lib/admin/auth";
import { getActiveAssumptions } from "@/lib/assumptions/store";
import { formatScore } from "@/lib/utils/format";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

import {
  loginAdminAction,
  logoutAdminAction,
  updateEconomyAssumptionsAction,
  updateStatusScoresAction,
} from "./actions";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getMessage(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
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
            className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition"
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
          </div>
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="border-border text-foreground hover:border-accent hover:text-accent inline-flex rounded-full border px-5 py-3 text-sm font-semibold transition"
            >
              Log out
            </button>
          </form>
        </div>

        {authMessage === "success" ? (
          <p className="text-accent text-sm">Admin session opened.</p>
        ) : null}
        {savedMessage ? (
          <p className="text-accent text-sm">Saved assumption set: {savedMessage}.</p>
        ) : null}
        {errorMessage ? (
          <p className="text-rose-600 text-sm">
            Could not save assumption set: {errorMessage}.
          </p>
        ) : null}
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
              className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition"
            >
              Save status mapping
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
                    className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition"
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
