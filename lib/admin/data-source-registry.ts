import {
  getManualDataOverrides,
  getResolvedChainCapabilityProfileSeeds,
  getResolvedChainEcosystemMetricsSeeds,
  getResolvedChainRoadmapSeeds,
  getResolvedLiquidStakingMarketSnapshotSeeds,
} from "@/lib/admin/manual-data";
import { getActiveAssumptions } from "@/lib/assumptions/store";
import { atlasDatasetSnapshot } from "@/lib/config/dataset";
import { readExternalMetricsSnapshot } from "@/lib/external-data/service";
import { externalMetricsSourceNote } from "@/lib/external-data/config";
import { listOfferLibrary } from "@/lib/offers/library";
import { listBuyerPersonas } from "@/lib/personas/store";
import { listProposalDocuments } from "@/lib/proposals/store";
import { listChainTechnicalAnalyses } from "@/lib/analysis/store";

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
  currentProvenance?: string;
  adminEditScope?: string;
  refreshBehavior: string;
  lastUpdated: string;
  notes?: string;
};

export type DataSourceRegistryGroup = {
  title: string;
  description: string;
  entries: DataSourceRegistryEntry[];
};

export function getDataSourceRegistry(): DataSourceRegistryGroup[] {
  const externalMetricsSnapshot = readExternalMetricsSnapshot();
  const activeAssumptions = getActiveAssumptions();
  const manualOverrides = getManualDataOverrides();
  const chainEcosystemMetricsSeeds = getResolvedChainEcosystemMetricsSeeds();
  const chainRoadmapSeeds = getResolvedChainRoadmapSeeds();
  const chainCapabilityProfiles = getResolvedChainCapabilityProfileSeeds();
  const liquidStakingMarketSnapshotSeeds =
    getResolvedLiquidStakingMarketSnapshotSeeds();
  const personas = listBuyerPersonas();
  const offers = listOfferLibrary();
  const proposals = listProposalDocuments();
  const analyses = listChainTechnicalAnalyses();
  const externalUpdatedAt = externalMetricsSnapshot.updatedAt;
  const assumptionsUpdatedAt = activeAssumptions.updatedAt;
  const chainSeedUpdatedAt = `${atlasDatasetSnapshot.snapshotDate}T00:00:00.000Z`;
  const ecosystemSeedUpdatedAt =
    manualOverrides.ecosystemMetricSeeds?.updatedAt ??
    `${chainEcosystemMetricsSeeds[0]?.snapshotDate ?? atlasDatasetSnapshot.snapshotDate}T00:00:00.000Z`;
  const roadmapUpdatedAt =
    manualOverrides.roadmaps?.updatedAt ??
    `${chainRoadmapSeeds[0]?.snapshotDate ?? atlasDatasetSnapshot.snapshotDate}T00:00:00.000Z`;
  const capabilityProfilesUpdatedAt =
    manualOverrides.capabilityProfiles?.updatedAt ?? chainSeedUpdatedAt;
  const liquidStakingUpdatedAt =
    manualOverrides.liquidStakingMarketSnapshots?.updatedAt ??
    (liquidStakingMarketSnapshotSeeds[0]?.sources[0]?.snapshotDate != null
      ? `${liquidStakingMarketSnapshotSeeds[0].sources[0].snapshotDate}T00:00:00.000Z`
      : chainSeedUpdatedAt);
  const readinessUpdatedAt =
    manualOverrides.readinessRecords?.updatedAt ?? chainSeedUpdatedAt;

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
          currentProvenance:
            "Synced DeFiLlama snapshot committed into the Atlas benchmark dataset.",
          adminEditScope: "No direct edit",
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
          currentProvenance:
            "Current Atlas value comes from the source-backed external snapshot when available, otherwise from the curated fallback ecosystem seed.",
          adminEditScope: "Fallback only via ecosystem seed override",
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
          currentProvenance:
            "Current Atlas value comes from the synced external snapshot with fallback to the Atlas ecosystem seed.",
          adminEditScope: "Fallback only via ecosystem seed override",
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
          currentProvenance:
            "Current Atlas value comes from source-backed snapshot rows when a connector returns valid data; otherwise from the Atlas fallback ecosystem seed.",
          adminEditScope: "Fallback only via ecosystem seed override",
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
          currentProvenance:
            "Current Atlas value comes from synced external query rows when available, otherwise from the Atlas fallback ecosystem seed.",
          adminEditScope: "Fallback only via ecosystem seed override",
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
          sourceName: "growthepie / Artemis / Dune preferred connectors with Atlas fallback snapshot",
          sourceReference:
            "lib/external-data/connectors/growthepie.ts, lib/external-data/connectors/artemis.ts, lib/external-data/connectors/dune.ts",
          originType: "external query source",
          currentProvenance:
            "Current Atlas value comes from synced external query rows when available, otherwise from the Atlas fallback ecosystem seed.",
          adminEditScope: "Fallback only via ecosystem seed override",
          refreshBehavior:
            "Refreshed via SYNC NOW when source configuration is available; otherwise Atlas preserves the current snapshot or seed fallback.",
          lastUpdated: externalUpdatedAt,
          notes: "Atlas normalizes daily_active_users and growthepie DAA exports into a common activeUsers field.",
        },
        {
          metricName: "Transactions",
          description:
            "Optional usage signal shown in global context when captured by the external metrics snapshot.",
          sourceCategory: "Technical signals",
          sourceName: "growthepie / Artemis / Dune / Token Terminal preferred connectors",
          sourceReference:
            "lib/external-data/connectors/growthepie.ts, lib/external-data/connectors/artemis.ts, lib/external-data/connectors/dune.ts, lib/external-data/connectors/token-terminal.ts",
          originType: "external query source",
          currentProvenance:
            "Current Atlas value comes from synced external query rows when available. Atlas leaves it unset instead of fabricating a fallback value.",
          adminEditScope: "No direct edit",
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
          currentProvenance:
            "Current Atlas value comes from the synced external snapshot when a Dune row exists, otherwise from the Atlas fallback ecosystem seed.",
          adminEditScope: "Fallback only via ecosystem seed override",
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
          currentProvenance:
            "Current Atlas value comes from synced external rows when available, otherwise from the Atlas fallback ecosystem seed.",
          adminEditScope: "Fallback only via ecosystem seed override",
          refreshBehavior:
            "Refreshed via SYNC NOW when a source returns valid rows; otherwise Atlas uses the curated seed snapshot.",
          lastUpdated: externalUpdatedAt,
        },
        {
          metricName: "Throughput indicator",
          description:
            "TPS-like performance proxy used in global ranking and global context.",
          sourceCategory: "Technical signals",
          sourceName: "growthepie / Artemis / Dune preferred connectors with Atlas curated fallback snapshot",
          sourceReference:
            "lib/external-data/connectors/growthepie.ts, lib/external-data/connectors/artemis.ts, lib/external-data/connectors/dune.ts",
          originType: "external query source",
          currentProvenance:
            "Current Atlas value comes from synced external rows when available, otherwise from the Atlas fallback ecosystem seed.",
          adminEditScope: "Fallback only via ecosystem seed override",
          refreshBehavior:
            "Refreshed via SYNC NOW when valid source rows are available; otherwise Atlas uses the curated seed snapshot.",
          lastUpdated: externalUpdatedAt,
          notes:
            "growthepie contributes a public gas-per-second throughput proxy for supported L2 networks.",
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
          currentProvenance:
            "Current Atlas value comes from the manual readiness dataset used to compute every public readiness score.",
          adminEditScope: "Editable from this page",
          refreshBehavior:
            "Edited manually in the seed dataset and recomputed on read across profiles, rankings, and public APIs.",
          lastUpdated: readinessUpdatedAt,
          notes: "These are the core deterministic readiness inputs per chain, economy, and module.",
        },
        {
          metricName: "Chain technical capability profiles",
          description:
            "Per-chain architecture, primitive support, and deployment-feasibility baselines used before wedge readiness is interpreted.",
          sourceCategory: "Applicability inputs",
          sourceName: "Atlas chain capability dataset",
          sourceReference: "data/seed/chain-capability-profiles.ts",
          originType: "seed/fallback dataset",
          currentProvenance:
            "Current Atlas value comes from the manual chain capability dataset, which Atlas then maps onto the deterministic applicability engine.",
          adminEditScope: "Editable from this page",
          refreshBehavior:
            "Updated manually and applied immediately to the deterministic applicability engine and analysis snapshot builder.",
          lastUpdated: capabilityProfilesUpdatedAt,
          notes: `Current dataset covers ${chainCapabilityProfiles.length} chain capability profiles.`,
        },
        {
          metricName: "Readiness module weights",
          description:
            "Economy-level module weights used to transform statuses into weighted contributions.",
          sourceCategory: "Readiness score inputs",
          sourceName: "Atlas admin assumptions",
          sourceReference: "data/admin/active-assumptions.json -> economies[*].moduleWeights",
          originType: "internal manual/admin-managed assumption",
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
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
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
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
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately after save.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Wedge applicability rules",
          description:
            "Capability weights, prerequisite requirements, thresholds, and confidence rules that determine whether a wedge is technically applicable.",
          sourceCategory: "Applicability formula inputs",
          sourceName: "Atlas admin assumptions",
          sourceReference:
            "data/admin/active-assumptions.json -> wedgeApplicability",
          originType: "internal manual/admin-managed assumption",
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
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
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
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
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately after save.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Global ranking subweights",
          description:
            "Subweights inside ecosystem, adoption, and performance so Atlas can rebalance the internals of Global Score.",
          sourceCategory: "Global score inputs",
          sourceName: "Atlas admin assumptions",
          sourceReference:
            "data/admin/active-assumptions.json -> globalRanking.*Subweights",
          originType: "internal manual/admin-managed assumption",
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
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
          currentProvenance:
            "Computed inside Atlas from readiness, ecosystem, adoption, and performance inputs under the active assumptions.",
          adminEditScope: "Indirect only via inputs and assumptions",
          refreshBehavior:
            "Recomputed on read from the active assumptions and the latest available external metrics snapshot.",
          lastUpdated: assumptionsUpdatedAt,
          notes: "Global score itself is derived; Atlas never treats it as a direct external metric.",
        },
        {
          metricName: "Opportunity score weights",
          description:
            "Internal GTM weights used to calculate opportunity score across TVL tier, readiness gap, stack fit, and ecosystem signal.",
          sourceCategory: "Internal target scoring",
          sourceName: "Atlas admin assumptions",
          sourceReference:
            "data/admin/active-assumptions.json -> opportunityScoring.weights",
          originType: "internal manual/admin-managed assumption",
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately after save.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Opportunity stack-fit and priority rules",
          description:
            "Advanced opportunity settings used to weight lift versus coverage and to map total score into priority bands.",
          sourceCategory: "Internal target scoring",
          sourceName: "Atlas admin assumptions",
          sourceReference:
            "data/admin/active-assumptions.json -> opportunityScoring.stackFitComponents + priorityThresholds",
          originType: "internal manual/admin-managed assumption",
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately after save.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "GPT analysis settings",
          description:
            "Model label, prompt template reference, sensitivity, and mock fallback settings for internal chain technical analysis.",
          sourceCategory: "AI-assisted analysis",
          sourceName: "Atlas admin assumptions",
          sourceReference:
            "data/admin/active-assumptions.json -> analysisSettings",
          originType: "internal manual/admin-managed assumption",
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and used only by internal AI-assisted analysis workflows.",
          lastUpdated: assumptionsUpdatedAt,
        },
        {
          metricName: "Proposal generator settings",
          description:
            "Weights and priority thresholds used by the deterministic proposal matching engine.",
          sourceCategory: "Proposal scoring inputs",
          sourceName: "Atlas admin assumptions",
          sourceReference:
            "data/admin/active-assumptions.json -> proposalGenerator",
          originType: "internal manual/admin-managed assumption",
          currentProvenance:
            "Current Atlas value comes from the active admin-managed assumptions set.",
          adminEditScope: "Editable from this page",
          refreshBehavior:
            "Updated from the internal admin assumptions editor and applied immediately to proposal scoring.",
          lastUpdated: assumptionsUpdatedAt,
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
          currentProvenance:
            "Current Atlas value comes from a manual roadmap dataset curated from official sources or Atlas fallback review.",
          adminEditScope: "Editable from this page",
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
          currentProvenance:
            "Current Atlas value comes from manual chain-level LST source snapshots captured into the Atlas dataset.",
          adminEditScope: "Editable from this page",
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
          currentProvenance:
            "Current Atlas value comes from manual chain-level LST source snapshots captured into the Atlas dataset.",
          adminEditScope: "Editable from this page",
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
          currentProvenance:
            "Derived inside Atlas from captured LST source snapshots and current staking base inputs.",
          adminEditScope: "Indirect only via LST market snapshot editor",
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
          currentProvenance:
            "Computed inside Atlas from the 7-module LST diagnosis scores and the active diagnostic weights.",
          adminEditScope: "Indirect via assumptions editor",
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
          currentProvenance:
            "Current Atlas value comes from the manual fallback ecosystem dataset whenever an external source row is missing.",
          adminEditScope: "Editable from this page",
          refreshBehavior:
            "Updated manually and used automatically whenever external connectors cannot provide a valid row.",
          lastUpdated: ecosystemSeedUpdatedAt,
          notes: "This fallback keeps rankings deterministic even when external APIs fail or credentials are unavailable.",
        },
        {
          metricName: "Buyer persona records",
          description:
            "Structured persona records used as internal buyer-intelligence inputs for proposal generation and AI strategic analysis.",
          sourceCategory: "AI-assisted buyer intelligence",
          sourceName: "Atlas persona builder",
          sourceReference: "lib/personas/service.ts -> personas/",
          originType: "internal Atlas-derived metric",
          currentProvenance:
            "Current Atlas value comes from stored persona builder runs and their persisted markdown artifacts.",
          adminEditScope: "Indirect only via internal persona builder flow",
          refreshBehavior:
            "Updated when an internal authenticated user creates a new buyer persona for a chain.",
          lastUpdated: personas[0]?.updatedAt ?? assumptionsUpdatedAt,
          notes: `${personas.length} stored persona record(s).`,
        },
        {
          metricName: "Offer library",
          description:
            "Protofire offer definitions used to match personas and chain gaps into proposal candidates.",
          sourceCategory: "Proposal engine inputs",
          sourceName: "Atlas offer markdown library",
          sourceReference: "offers/*.md",
          originType: "seed/fallback dataset",
          currentProvenance:
            "Current Atlas value comes from the versioned markdown offer library in the repository.",
          adminEditScope: "Repo-managed only",
          refreshBehavior:
            "Updated when offer markdown files are revised and redeployed.",
          lastUpdated: assumptionsUpdatedAt,
          notes: `${offers.length} offer file(s) currently available to the proposal engine.`,
        },
        {
          metricName: "Proposal documents",
          description:
            "Stored proposal matches that connect chain gaps, buyer personas, and offers into conversion-oriented proposals.",
          sourceCategory: "Proposal engine outputs",
          sourceName: "Atlas proposal generator",
          sourceReference: "lib/proposals/engine.ts",
          originType: "internal Atlas-derived metric",
          currentProvenance:
            "Current Atlas value comes from persisted proposal generator runs triggered by internal users.",
          adminEditScope: "Indirect only via internal proposal generation flow",
          refreshBehavior:
            "Updated whenever Atlas generates a new proposal set for a stored buyer persona.",
          lastUpdated: proposals[0]?.createdAt ?? assumptionsUpdatedAt,
          notes: `${proposals.length} stored proposal document(s).`,
        },
        {
          metricName: "GPT-5.4 strategic analyses",
          description:
            "Stored internal strategic analyses combining deterministic infrastructure baselines with AI-assisted proposal reasoning.",
          sourceCategory: "AI-assisted analysis outputs",
          sourceName: "Atlas chain analysis workflow",
          sourceReference: "lib/analysis/service.ts",
          originType: "internal Atlas-derived metric",
          currentProvenance:
            "Current Atlas value comes from stored internal analysis runs using the configured model or deterministic mock fallback.",
          adminEditScope: "Indirect only via internal analysis workflow",
          refreshBehavior:
            "Updated whenever an authenticated internal user runs strategic analysis for a chain.",
          lastUpdated: analyses[0]?.createdAt ?? assumptionsUpdatedAt,
          notes: `${analyses.length} stored analysis run(s).`,
        },
      ],
    },
  ];
}
