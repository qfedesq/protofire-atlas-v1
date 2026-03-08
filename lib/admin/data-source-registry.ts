import activeAssumptions from "@/data/admin/active-assumptions.json";
import { chainEcosystemMetricsSeeds } from "@/data/seed/chain-ecosystem-metrics";
import { chainRoadmapSeeds } from "@/data/seed/chain-roadmaps";
import { liquidStakingMarketSnapshotSeeds } from "@/data/seed/liquid-staking-market-snapshots";
import externalMetricsSnapshot from "@/data/source/external-chain-metrics.snapshot.json";
import { atlasDatasetSnapshot } from "@/lib/config/dataset";
import { externalMetricsSourceNote } from "@/lib/external-data/config";

export type DataSourceOriginType =
  | "external API"
  | "external query source"
  | "internal Atlas-derived metric"
  | "internal manual/admin-managed assumption"
  | "seed/fallback dataset";

export type DataSourceRegistryEntry = {
  metricName: string;
  description: string;
  sourceCategory: string;
  sourceName: string;
  sourceReference: string;
  originType: DataSourceOriginType;
  refreshBehavior: string;
  lastUpdated: string;
  notes?: string;
};

export type DataSourceRegistryGroup = {
  title: string;
  description: string;
  entries: DataSourceRegistryEntry[];
};

const externalUpdatedAt = externalMetricsSnapshot.updatedAt;
const assumptionsUpdatedAt = activeAssumptions.updatedAt;
const chainSeedUpdatedAt = `${atlasDatasetSnapshot.snapshotDate}T00:00:00.000Z`;
const ecosystemSeedUpdatedAt = `${chainEcosystemMetricsSeeds[0]?.snapshotDate ?? atlasDatasetSnapshot.snapshotDate}T00:00:00.000Z`;
const roadmapUpdatedAt = `${chainRoadmapSeeds[0]?.snapshotDate ?? atlasDatasetSnapshot.snapshotDate}T00:00:00.000Z`;
const liquidStakingUpdatedAt =
  liquidStakingMarketSnapshotSeeds[0]?.sources[0]?.snapshotDate != null
    ? `${liquidStakingMarketSnapshotSeeds[0].sources[0].snapshotDate}T00:00:00.000Z`
    : chainSeedUpdatedAt;

export function getDataSourceRegistry(): DataSourceRegistryGroup[] {
  return [
    {
      title: "Benchmark and external ecosystem metrics",
      description:
        "Public chain selection and ecosystem context used in Atlas rankings and chain pages.",
      entries: [
        {
          metricName: "Benchmark chain universe",
          description:
            "Top-30 EVM chain inclusion list and ordering used as the public Atlas benchmark.",
          sourceCategory: "Dataset scope",
          sourceName: atlasDatasetSnapshot.sourceProvider,
          sourceReference:
            "data/source/defillama-top-30-evm-chains.snapshot.json",
          originType: "seed/fallback dataset",
          refreshBehavior:
            "Refreshed through the Atlas snapshot workflow and then versioned in the repository.",
          lastUpdated: chainSeedUpdatedAt,
          notes: `Source metric: ${atlasDatasetSnapshot.sourceMetric}. Source category: ${atlasDatasetSnapshot.sourceCategory}.`,
        },
        {
          metricName: "TVL",
          description: "Chain TVL used in global context and source-backed ecosystem summaries.",
          sourceCategory: "Chain ecosystem context",
          sourceName: "DeFiLlama connector with Atlas fallback snapshot",
          sourceReference: "lib/external-data/connectors/defillama.ts -> https://api.llama.fi/v2/chains",
          originType: "external API",
          refreshBehavior:
            "Refreshed via SYNC NOW into the external metrics snapshot. Atlas preserves the last valid snapshot when the connector fails.",
          lastUpdated: externalUpdatedAt,
          notes: externalMetricsSourceNote,
        },
        {
          metricName: "Number of protocols",
          description:
            "Protocol breadth used in ecosystem activity scoring and global context.",
          sourceCategory: "Chain ecosystem context",
          sourceName: "DeFiLlama protocols connector with Atlas fallback snapshot",
          sourceReference: "lib/external-data/connectors/defillama.ts -> https://api.llama.fi/protocols",
          originType: "external API",
          refreshBehavior:
            "Refreshed via SYNC NOW into the external metrics snapshot. Falls back to the current Atlas ecosystem seed when unavailable.",
          lastUpdated: externalUpdatedAt,
          notes: "Counts tracked protocols mapped back onto the Atlas chain universe.",
        },
        {
          metricName: "Ecosystem projects",
          description:
            "Project breadth used in global context and ecosystem activity scoring.",
          sourceCategory: "Chain ecosystem context",
          sourceName: "Dune / Token Terminal preferred connectors with Atlas fallback snapshot",
          sourceReference:
            "lib/external-data/connectors/dune.ts, lib/external-data/connectors/token-terminal.ts",
          originType: "external query source",
          refreshBehavior:
            "Refreshed via SYNC NOW when connector credentials are available; otherwise Atlas keeps the curated fallback seed.",
          lastUpdated: externalUpdatedAt,
          notes: "Current environment falls back to the curated Atlas ecosystem snapshot when external rows are missing.",
        },
        {
          metricName: "Wallets",
          description:
            "Wallet footprint used in adoption scoring and public global context.",
          sourceCategory: "Adoption",
          sourceName: "Artemis / Dune preferred connectors with Atlas fallback snapshot",
          sourceReference:
            "lib/external-data/connectors/artemis.ts, lib/external-data/connectors/dune.ts",
          originType: "external query source",
          refreshBehavior:
            "Refreshed via SYNC NOW when source configuration is available; otherwise Atlas keeps the last valid external snapshot or curated fallback.",
          lastUpdated: externalUpdatedAt,
          notes: "Atlas normalizes source aliases like active_wallets and monthly_active_wallets into a common wallets field.",
        },
        {
          metricName: "Active users",
          description:
            "Active user signal used in adoption scoring and public global context.",
          sourceCategory: "Adoption",
          sourceName: "Artemis / Dune preferred connectors with Atlas fallback snapshot",
          sourceReference:
            "lib/external-data/connectors/artemis.ts, lib/external-data/connectors/dune.ts",
          originType: "external query source",
          refreshBehavior:
            "Refreshed via SYNC NOW when source configuration is available; otherwise Atlas preserves the current snapshot or seed fallback.",
          lastUpdated: externalUpdatedAt,
          notes: "Atlas normalizes daily_active_users and similar aliases into a common activeUsers field.",
        },
        {
          metricName: "Transactions",
          description:
            "Optional usage signal shown in global context when captured by the external metrics snapshot.",
          sourceCategory: "Technical signals",
          sourceName: "Artemis / Dune / Token Terminal preferred connectors",
          sourceReference:
            "lib/external-data/connectors/artemis.ts, lib/external-data/connectors/dune.ts, lib/external-data/connectors/token-terminal.ts",
          originType: "external query source",
          refreshBehavior:
            "Refreshed via SYNC NOW; Atlas leaves the field unset when no verified source row is available.",
          lastUpdated: externalUpdatedAt,
          notes: "This metric is intentionally optional and never fabricated when no source row is available.",
        },
        {
          metricName: "Average transaction speed",
          description:
            "Performance signal used in global scoring and public chain context.",
          sourceCategory: "Technical signals",
          sourceName: "Dune preferred connector with Atlas curated fallback snapshot",
          sourceReference: "lib/external-data/connectors/dune.ts",
          originType: "external query source",
          refreshBehavior:
            "Refreshed via SYNC NOW when a Dune query is configured; otherwise Atlas uses the curated seed snapshot.",
          lastUpdated: externalUpdatedAt,
          notes: "Normalized from average_transaction_speed and avg_transaction_speed aliases.",
        },
        {
          metricName: "Block time",
          description:
            "Technical performance input used in global ranking and global context.",
          sourceCategory: "Technical signals",
          sourceName: "Artemis / Dune preferred connectors with Atlas curated fallback snapshot",
          sourceReference:
            "lib/external-data/connectors/artemis.ts, lib/external-data/connectors/dune.ts",
          originType: "external query source",
          refreshBehavior:
            "Refreshed via SYNC NOW when a source returns valid rows; otherwise Atlas uses the curated seed snapshot.",
          lastUpdated: externalUpdatedAt,
        },
        {
          metricName: "Throughput indicator",
          description:
            "TPS-like performance proxy used in global ranking and global context.",
          sourceCategory: "Technical signals",
          sourceName: "Artemis / Dune preferred connectors with Atlas curated fallback snapshot",
          sourceReference:
            "lib/external-data/connectors/artemis.ts, lib/external-data/connectors/dune.ts",
          originType: "external query source",
          refreshBehavior:
            "Refreshed via SYNC NOW when valid source rows are available; otherwise Atlas uses the curated seed snapshot.",
          lastUpdated: externalUpdatedAt,
        },
      ],
    },
    {
      title: "Readiness model and scoring inputs",
      description:
        "Internal Atlas model inputs that drive readiness, global ranking, and recommendation outputs.",
      entries: [
        {
          metricName: "Readiness module statuses",
          description:
            "Per-chain module availability values used to compute each economy readiness score.",
          sourceCategory: "Readiness score inputs",
          sourceName: "Atlas seed economy records",
          sourceReference: "data/seed/economies/*.ts",
          originType: "seed/fallback dataset",
          refreshBehavior:
            "Edited manually in the seed dataset and recomputed on read across profiles, rankings, and public APIs.",
          lastUpdated: chainSeedUpdatedAt,
          notes: "These are the core deterministic readiness inputs per chain, economy, and module.",
        },
        {
          metricName: "Readiness module weights",
          description:
            "Economy-level module weights used to transform statuses into weighted contributions.",
          sourceCategory: "Readiness score inputs",
          sourceName: "Atlas admin assumptions",
          sourceReference: "data/admin/active-assumptions.json -> economies[*].moduleWeights",
          originType: "internal manual/admin-managed assumption",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately after save.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Status score mapping",
          description:
            "Numeric mapping for missing, partial, and available statuses used across readiness scoring.",
          sourceCategory: "Readiness score inputs",
          sourceName: "Atlas admin assumptions",
          sourceReference: "data/admin/active-assumptions.json -> statusScores",
          originType: "internal manual/admin-managed assumption",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately after save.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Recommendation thresholds",
          description:
            "Thresholds and toggles that decide when a module becomes a Protofire recommendation.",
          sourceCategory: "Recommendation engine",
          sourceName: "Atlas admin assumptions",
          sourceReference:
            "data/admin/active-assumptions.json -> economies[*].recommendationConfig",
          originType: "internal manual/admin-managed assumption",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately after save.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Economy composite weights",
          description:
            "Weights used to combine the four economy scores into the global economy composite.",
          sourceCategory: "Global score inputs",
          sourceName: "Atlas admin assumptions",
          sourceReference:
            "data/admin/active-assumptions.json -> globalRanking.economyCompositeWeights",
          originType: "internal manual/admin-managed assumption",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately after save.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Global ranking component weights",
          description:
            "Top-level weights for economy, ecosystem, adoption, and performance inside Global Score.",
          sourceCategory: "Global score inputs",
          sourceName: "Atlas admin assumptions",
          sourceReference:
            "data/admin/active-assumptions.json -> globalRanking.componentWeights",
          originType: "internal manual/admin-managed assumption",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately after save.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Global score components",
          description:
            "Derived global ranking values built from economy composite, ecosystem, adoption, and performance scores.",
          sourceCategory: "Global score inputs",
          sourceName: "Atlas derived global ranking model",
          sourceReference: "lib/global-ranking/engine.ts",
          originType: "internal Atlas-derived metric",
          refreshBehavior:
            "Recomputed on read from the active assumptions and the latest available external metrics snapshot.",
          lastUpdated: assumptionsUpdatedAt,
          notes: "Global score itself is derived; Atlas never treats it as a direct external metric.",
        },
      ],
    },
    {
      title: "Supplemental chain intelligence",
      description:
        "Additional source-backed or seeded datasets used to contextualize chain pages and specific wedges.",
      entries: [
        {
          metricName: "Roadmap stage",
          description:
            "Current roadmap stage and official-source fit summary used in rankings and chain pages.",
          sourceCategory: "Roadmap context",
          sourceName: "Official roadmap, updates, docs, or Atlas fallback review",
          sourceReference: "data/seed/chain-roadmaps.ts",
          originType: "seed/fallback dataset",
          refreshBehavior:
            "Updated manually when Atlas refreshes official roadmap coverage or when no public roadmap can be verified.",
          lastUpdated: roadmapUpdatedAt,
          notes: "Rows preserve whether the source is an official roadmap, official updates feed, official docs, or a not-public fallback.",
        },
        {
          metricName: "Liquid staking market cap",
          description:
            "Market-cap snapshot used in the LST market snapshot view.",
          sourceCategory: "Liquid staking diagnostics",
          sourceName: "CoinGecko or chain-specific source by network",
          sourceReference: "data/seed/liquid-staking-market-snapshots.ts",
          originType: "seed/fallback dataset",
          refreshBehavior:
            "Updated manually from verified source snapshots and versioned in the repository.",
          lastUpdated: liquidStakingUpdatedAt,
        },
        {
          metricName: "Liquid staking participation metrics",
          description:
            "Percent staked, staking APY, and stakers count used in the LST market snapshot.",
          sourceCategory: "Liquid staking diagnostics",
          sourceName: "Staking Rewards, chain validator docs, or official staking dashboards",
          sourceReference: "data/seed/liquid-staking-market-snapshots.ts",
          originType: "seed/fallback dataset",
          refreshBehavior:
            "Updated manually from verified source snapshots. Fields remain explicit when a source is pending or not applicable.",
          lastUpdated: liquidStakingUpdatedAt,
        },
        {
          metricName: "LST protocol count and LST / staked ratio",
          description:
            "Chain-level liquid staking breadth and penetration used in the LST market snapshot.",
          sourceCategory: "Liquid staking diagnostics",
          sourceName: "DeFiLlama plus Atlas derived metric",
          sourceReference: "data/seed/liquid-staking-market-snapshots.ts",
          originType: "internal Atlas-derived metric",
          refreshBehavior:
            "Updated when verified liquid staking source snapshots are refreshed for a chain.",
          lastUpdated: liquidStakingUpdatedAt,
          notes: "The ratio is derived from captured liquid staking balances over the current staking base.",
        },
        {
          metricName: "Global LST health score",
          description:
            "Weighted seven-dimension liquid staking diagnostic score for DeFi chain pages.",
          sourceCategory: "Liquid staking diagnostics",
          sourceName: "Atlas liquid staking diagnosis model",
          sourceReference:
            "lib/liquid-staking/diagnosis.ts and data/admin/active-assumptions.json -> moduleDiagnosticWeights",
          originType: "internal Atlas-derived metric",
          refreshBehavior:
            "Recomputed from the seeded seven-dimension scores and active diagnostic weights.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Curated ecosystem/performance fallback snapshot",
          description:
            "Seeded backup for ecosystem activity, adoption, and performance values when external sources are unavailable.",
          sourceCategory: "Fallback dataset",
          sourceName: chainEcosystemMetricsSeeds[0]?.sourceLabel ?? "Atlas curated snapshot",
          sourceReference: "data/seed/chain-ecosystem-metrics.ts",
          originType: "seed/fallback dataset",
          refreshBehavior:
            "Updated manually and used automatically whenever external connectors cannot provide a valid row.",
          lastUpdated: ecosystemSeedUpdatedAt,
          notes: "This fallback keeps rankings deterministic even when external APIs fail or credentials are unavailable.",
        },
      ],
    },
  ];
}
