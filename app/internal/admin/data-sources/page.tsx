import Link from "next/link";
import { redirect } from "next/navigation";

import { AssumptionsEditor } from "@/components/admin/assumptions-editor";
import { DataSourceRegistryTable } from "@/components/admin/data-source-registry-table";
import { ManualDatasetEditors } from "@/components/admin/manual-dataset-editors";
import { SyncPanel } from "@/components/admin/sync-panel";
import { Panel } from "@/components/ui/panel";
import { getDataSourceRegistry } from "@/lib/admin/data-source-registry";
import { getManualDataOverrides } from "@/lib/admin/manual-data";
import { formatErrorMessage, formatSavedMessage, getMessage } from "@/lib/admin/messages";
import {
  getAdminAccessState,
  requireAuthenticatedInternalUser,
} from "@/lib/admin/auth";
import { getActiveAssumptions } from "@/lib/assumptions/store";
import { readExternalMetricsSnapshot } from "@/lib/external-data/service";
import { listLiquidStakingDiagnosticDimensions } from "@/lib/liquid-staking/diagnosis";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";
import { chainEconomySeedRecords } from "@/data/seed/economies";
import { chainRoadmapSeeds } from "@/data/seed/chain-roadmaps";
import { chainEcosystemMetricsSeeds } from "@/data/seed/chain-ecosystem-metrics";
import { chainCapabilityProfileSeeds } from "@/data/seed/chain-capability-profiles";
import { liquidStakingMarketSnapshotSeeds } from "@/data/seed/liquid-staking-market-snapshots";

type AdminDataSourcesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDataSourcesPage({
  searchParams,
}: AdminDataSourcesPageProps) {
  await ensureAtlasPersistence();
  const access = getAdminAccessState();

  if (!access.enabled) {
    redirect("/internal/admin");
  }

  await requireAuthenticatedInternalUser("/internal/admin/data-sources");

  const params = searchParams ? await searchParams : undefined;
  const savedMessage = getMessage(params?.saved);
  const errorMessage = getMessage(params?.error);
  const groups = getDataSourceRegistry();
  const manualOverrides = getManualDataOverrides();
  const assumptions = getActiveAssumptions();
  const repository = createSeedChainsRepository();
  const economies = repository.listEconomies();
  const liquidStakingDimensions = listLiquidStakingDiagnosticDimensions();
  const globalPreview = repository.listGlobalRankedChains().slice(0, 5);
  const externalSnapshot = readExternalMetricsSnapshot();

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Internal admin
            </p>
            <h1 className="text-foreground mt-2 text-3xl font-semibold">
              Data source registry and score controls
            </h1>
            <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
              Atlas provenance registry for every blockchain-related metric,
              plus the manual datasets and scoring math that still need explicit
              Atlas control.
            </p>
          </div>
          <Link
            href="/internal/admin"
            className="text-accent text-sm font-medium hover:underline"
          >
            Back to admin
          </Link>
        </div>

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
        redirectTo="/internal/admin/data-sources"
        snapshotUpdatedAt={externalSnapshot.updatedAt}
        connectorStatuses={externalSnapshot.connectors}
      />

      <Panel className="space-y-4">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Provenance
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Atlas data source registry
          </h2>
          <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
            For every metric Atlas shows, this table identifies whether the
            current value comes from a synced external source, an internal
            derived calculation, an admin-managed assumption, or an Atlas manual
            dataset.
          </p>
        </div>
        <DataSourceRegistryTable groups={groups} />
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Manual Atlas datasets
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Edit the non-automatic source layers
          </h2>
          <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
            These editors are for datasets Atlas cannot fully refresh from an
            automatic onchain or external source today. Saving here changes the
            values the repository uses on read.
          </p>
        </div>
      </Panel>

      <ManualDatasetEditors
        overrides={manualOverrides}
        redirectTo="/internal/admin/data-sources"
        datasets={[
          {
            key: "readinessRecords",
            title: "Readiness module statuses",
            description:
              "Per-chain, per-economy module statuses. This dataset directly drives the readiness scores used across public rankings and chain pages.",
            sourceNote:
              "Use this when Atlas does not have an automatic source for module readiness and the value is intentionally curated by Protofire.",
            payload:
              manualOverrides.readinessRecords?.value ?? chainEconomySeedRecords,
          },
          {
            key: "capabilityProfiles",
            title: "Chain capability profiles",
            description:
              "Per-chain capability baselines used by the deterministic wedge applicability engine before readiness is considered.",
            sourceNote:
              "Use this when Atlas needs a manual capability judgment because there is no stable automatic source for architecture, primitive support, or deployment feasibility.",
            payload:
              manualOverrides.capabilityProfiles?.value ?? chainCapabilityProfileSeeds,
          },
          {
            key: "roadmaps",
            title: "Roadmap stage dataset",
            description:
              "Official roadmap stages, source references, and Atlas fit summaries shown on ranking rows and chain pages.",
            sourceNote:
              "Use this when roadmap stage and fit are maintained manually from official docs, updates, or fallback review.",
            payload: manualOverrides.roadmaps?.value ?? chainRoadmapSeeds,
          },
          {
            key: "ecosystemMetricSeeds",
            title: "Fallback ecosystem metrics",
            description:
              "Fallback ecosystem, adoption, and performance values used when an external connector does not return a valid row for a chain metric.",
            sourceNote:
              "Use this to control the manual baseline Atlas falls back to when no valid external source row is available.",
            payload:
              manualOverrides.ecosystemMetricSeeds?.value ??
              chainEcosystemMetricsSeeds,
          },
          {
            key: "liquidStakingMarketSnapshots",
            title: "Liquid staking market snapshots",
            description:
              "Manual chain-level LST source snapshots shown in DeFi chain pages when Atlas does not have a complete automated source path for those values.",
            sourceNote:
              "Use this for any LST metric that is still captured manually from verified external sources or chain-specific docs.",
            payload:
              manualOverrides.liquidStakingMarketSnapshots?.value ??
              liquidStakingMarketSnapshotSeeds,
          },
        ]}
      />

      <Panel className="space-y-4">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Scoring math
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Active assumptions that drive Atlas scores
          </h2>
          <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
            Every weight, threshold, and status mapping that affects readiness,
            global ranking, and opportunity math is editable here. Saving these
            values changes Atlas scoring immediately.
          </p>
        </div>
      </Panel>

      <AssumptionsEditor
        assumptions={assumptions}
        economies={economies}
        liquidStakingDimensions={liquidStakingDimensions}
        globalPreview={globalPreview}
        redirectTo="/internal/admin/data-sources"
      />
    </div>
  );
}
