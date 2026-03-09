import Link from "next/link";

import { AssumptionsEditor } from "@/components/admin/assumptions-editor";
import { SyncPanel } from "@/components/admin/sync-panel";
import { ChainAnalysisPanel } from "@/components/internal/chain-analysis-panel";
import { Panel } from "@/components/ui/panel";
import {
  buildInternalLoginHref,
  getAuthenticatedInternalUser,
  getAdminAccessState,
  isAdminAuthenticated,
} from "@/lib/admin/auth";
import { formatErrorMessage, formatSavedMessage, getMessage } from "@/lib/admin/messages";
import { getLatestChainTechnicalAnalysis } from "@/lib/analysis/service";
import { getActiveAssumptions } from "@/lib/assumptions/store";
import { readExternalMetricsSnapshot } from "@/lib/external-data/service";
import { listLiquidStakingDiagnosticDimensions } from "@/lib/liquid-staking/diagnosis";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

import { loginAdminAction, logoutAdminAction } from "./actions";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await ensureAtlasPersistence();
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
            Open admin
          </button>
        </form>

        {access.auth0Enabled ? (
          <p className="text-muted text-sm leading-6">
            Auth0 is configured for internal access. You can also{" "}
            <a
              href={buildInternalLoginHref("/internal/admin")}
              className="text-accent font-medium hover:underline"
            >
              sign in with Auth0
            </a>
            .
          </p>
        ) : null}
      </Panel>
    );
  }

  const assumptions = getActiveAssumptions();
  const repository = createSeedChainsRepository();
  const economies = repository.listEconomies();
  const liquidStakingDimensions = listLiquidStakingDiagnosticDimensions();
  const globalPreview = repository.listGlobalRankedChains().slice(0, 5);
  const externalSnapshot = readExternalMetricsSnapshot();
  const chains = repository.listChains();
  const selectedChainSlug = getSingleSearchParam(params?.chain) ?? chains[0]?.slug;
  const selectedProfile = selectedChainSlug
    ? repository.getChainProfileBySlug(selectedChainSlug)
    : null;
  const internalUser = await getAuthenticatedInternalUser();
  const latestAnalysis =
    selectedProfile && internalUser
      ? getLatestChainTechnicalAnalysis(selectedProfile.chain.slug)
      : null;

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
              Use the data source registry for provenance, manual Atlas datasets,
              and the full assumptions surface in one place.
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
              <Link
                href="/internal/applicability"
                className="text-accent font-medium hover:underline"
              >
                Open applicability matrix
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

      <SyncPanel
        redirectTo="/internal/admin"
        snapshotUpdatedAt={externalSnapshot.updatedAt}
        connectorStatuses={externalSnapshot.connectors}
      />

      {selectedProfile && internalUser ? (
        <Panel className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Chain analysis
              </p>
              <h2 className="text-foreground mt-2 text-2xl font-semibold">
                Run GPT technical analysis from admin
              </h2>
              <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
                The GPT-assisted technical analysis workflow now runs only from
                admin. Select a chain, review its deterministic applicability
                baseline, and launch the stored analysis from here.
              </p>
            </div>

            <form className="flex flex-wrap items-end gap-3" method="get">
              <div className="space-y-2">
                <label
                  htmlFor="chain"
                  className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
                >
                  Chain
                </label>
                <select
                  id="chain"
                  name="chain"
                  defaultValue={selectedProfile.chain.slug}
                  className="border-border text-foreground focus:border-accent min-w-[15rem] border bg-white px-3 py-2 text-sm outline-none"
                >
                  {chains.map((chain) => (
                    <option key={chain.id} value={chain.slug}>
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="border-border text-foreground hover:border-accent hover:text-accent inline-flex border px-4 py-2 text-sm font-medium transition"
              >
                Load chain
              </button>
            </form>
          </div>

          <ChainAnalysisPanel
            chainSlug={selectedProfile.chain.slug}
            chainName={selectedProfile.chain.name}
            applicabilityRows={selectedProfile.wedgeApplicabilityMatrix}
            latestAnalysis={latestAnalysis}
            internalUser={internalUser}
            returnTo={`/internal/admin?chain=${selectedProfile.chain.slug}`}
          />
        </Panel>
      ) : null}

      <AssumptionsEditor
        assumptions={assumptions}
        economies={economies}
        liquidStakingDimensions={liquidStakingDimensions}
        globalPreview={globalPreview}
        redirectTo="/internal/admin"
      />
    </div>
  );
}
