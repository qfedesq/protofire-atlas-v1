# Data Model

Protofire Atlas uses a small explicit domain model. Some entities are stored as curated seeds. Others are derived inside the repository.

## Source snapshot

### Top30EvmChainSnapshot

Stored in [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json).

Top-level fields:

- `sourceProvider`
- `sourceMetric`
- `sourceCategory`
- `sourceUrl`
- `snapshotDate`
- `generatedAt`
- `methodology`
- `chains`

Per-chain fields:

- `id`
- `slug`
- `name`
- `sourceName`
- `sourceRank`
- `sourceGlobalRank`
- `sourceCategory`
- `sourceMetric`
- `sourceProvider`
- `sourceSnapshotDate`
- `sourceTvlUsd`

## Seeded entities

### ChainCatalogSeed

- `id`
- `slug`
- `name`
- `sourceName`
- `sourceRank`
- `sourceGlobalRank`
- `sourceCategory`
- `sourceMetric`
- `sourceProvider`
- `sourceSnapshotDate`
- `sourceTvlUsd`
- `category`
- `website`
- `shortDescription`
- `status`

Atlas builds this catalog from the DeFiLlama snapshot plus editable metadata in [`data/seed/chain-metadata.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-metadata.ts).

### ChainSeed

Used only as the AI-agent seed source in [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts).

- all `ChainCatalogSeed` fields
- `modules`

### ChainRoadmapSeed

Stored in [`data/seed/chain-roadmaps.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-roadmaps.ts).

- `chainSlug`
- `sourceKind`
- `sourceLabel`
- `sourceUrl`
- `snapshotDate`
- `stageLabel`
- `stageSummary`
- `atlasFitSummary`

### EconomyType

- `id`
- `slug`
- `name`
- `shortLabel`
- `description`
- `modules`
- `scoringConfig`
- `recommendationConfig`
- `deploymentTemplates`
- `recommendationRules`

Configured in [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts).

### EconomyModule

- `id`
- `slug`
- `name`
- `description`
- `weight`

### ChainEconomySeedRecord

- `chainSlug`
- `economyType`
- `moduleStatuses`

These records live under [`data/seed/economies`](/Users/qfedesq/Desktop/Atlas/data/seed/economies) and give each chain one readiness record per economy.

## Runtime configuration entities

### ActiveAssumptions

Stored in [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json).

- `updatedAt`
- `updatedBy`
- `statusScores`
- `economies`

### EconomyAssumptionSet

- `moduleWeights`
- `recommendationConfig`

### Runtime stores

Created on first write under `data/runtime/`:

- `assessment-requests.json`
- `intent-events.json`

### ModuleStatusSeed

- `status`
- `evidenceNote`
- `rationale`

## Derived entities

### ChainModuleStatus

- `chainId`
- `economyType`
- `moduleId`
- `moduleSlug`
- `status`
- `score`
- `evidenceNote`
- `rationale`

### ChainEconomyReadiness

- `chainId`
- `economyType`
- `totalScore`
- `moduleBreakdown`

### RankedChain

- `chain`
- `economy`
- `readinessScore`
- `benchmarkRank`
- `leaderGap`

`chain` now includes `roadmap`, which is used to render official roadmap coverage, current stage, and the current Atlas offer fit.

### GapAnalysisItem

- `module`
- `status`
- `problem`
- `impact`

### RecommendationItem

- `module`
- `title`
- `whyItMatters`
- `expectedResult`
- `directChainImpact`
- `deploymentPhaseKey`
- `narrativeSummary`

### RecommendedStack

- `chainId`
- `economyType`
- `recommendedModules`
- `deploymentPhases`
- `narrativeSummary`

### DeploymentPlan

- `chainId`
- `economyType`
- `phases`
- `ctaText`

### ChainProfile

- `chain`
- `economy`
- `readinessScore`
- `gapAnalysis`
- `rank`
- `leader`
- `leaderGap`
- `chainsOutranked`
- `scoreDrivers`
- `peers`
- `liquidStakingDiagnosis`
- `liquidStakingMarketSnapshot`
- `recommendedStack`
- `deploymentPlan`

## Generated outputs

The repo also generates deterministic GTM artifacts from the derived model:

- markdown reports under [`reports`](/Users/qfedesq/Desktop/Atlas/reports)
- JSON and CSV ranking exports under [`reports/exports`](/Users/qfedesq/Desktop/Atlas/reports/exports)
