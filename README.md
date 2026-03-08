# Protofire Atlas

Protofire Atlas is a public infrastructure readiness intelligence app for blockchain chains, L1s, and L2s.

It ranks chains by readiness for specific onchain economies, exposes infrastructure gaps, and maps those gaps to deterministic Protofire deployment stacks and phased rollout plans.

## Current MVP scope

Audience:

- blockchain chains, L1s, and L2s

Supported economy wedges:

- AI Agent Economy
- DeFi Infrastructure Economy
- RWA Infrastructure Economy
- Prediction Market Economy

Core product surface:

- one-page public Atlas overview at `/`
- one-page public Global Chain Ranking section at `/#global-ranking`
- compatibility Global Chain Ranking route at `/rankings/global`
- economy switching inside the home page
- full ranking and direct header sorting inside the home page
- chain profile pages at `/chains/[slug]`
- internal assumptions editor at `/internal/admin`
- internal target dashboard at `/internal/targets`
- internal account intelligence pages at `/internal/account/[chain]`
- deterministic scoring
- gap analysis
- peer comparison
- shareable scorecard sections on chain profiles
- rule-based stack recommendations
- phased deployment plans
- request capture for infrastructure assessments

Out of scope:

- auth
- wallet connection
- billing
- live analytics
- runtime AI
- marketplaces
- provider networks
- other customer segments

## Top 30 EVM dataset

Atlas uses a documented top-30 EVM chain benchmark derived from a DeFiLlama TVL snapshot.

Source of truth:

- provider: `DeFiLlama`
- metric: `TVL`
- selection universe: `EVM chains only`
- snapshot file: [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json)
- curated EVM mapping: [`data/source/defillama-evm-chain-map.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-evm-chain-map.json)

Atlas does not claim live synchronization. The dataset is a curated reproducible snapshot.

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev
npm run data:sync
npm run data:refresh-top30
npm run reports:generate
npm run version:bump
npm run validate:data
npm run typecheck
npm run lint
npm run test
npm run build
npm run check
```

`npm run check` is the main repo health command. It runs data validation, typecheck, lint, and tests.

## Data update workflow

1. Refresh the top-30 EVM snapshot if needed:

```bash
npm run data:refresh-top30
```

Or run the currently supported full refresh workflow:

```bash
npm run data:sync
```

2. Review the generated snapshot in [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json).
3. Update human-authored chain metadata in [`data/seed/chain-metadata.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-metadata.ts) if a new chain entered the top 30.
4. Update readiness statuses:
   - AI Agents: [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts)
   - DeFi: [`data/seed/economies/defi-infrastructure.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/economies/defi-infrastructure.ts)
   - RWA: [`data/seed/economies/rwa-infrastructure.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/economies/rwa-infrastructure.ts)
   - Prediction Markets: [`data/seed/economies/prediction-markets.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/economies/prediction-markets.ts)
5. Update official roadmap coverage and stage analysis in [`data/seed/chain-roadmaps.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-roadmaps.ts).
6. Review source guidance in [`docs/onchain-data-sources.md`](/Users/qfedesq/Desktop/Atlas/docs/onchain-data-sources.md).
7. Update LST market snapshot inputs when verified sources are available in [`data/seed/liquid-staking-market-snapshots.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/liquid-staking-market-snapshots.ts).
8. Update curated ecosystem and performance inputs in [`data/seed/chain-ecosystem-metrics.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-ecosystem-metrics.ts) when the benchmark snapshot changes.
9. Validate and regenerate outputs:

```bash
npm run validate:data
npm run reports:generate
npm run check
```

## Reports and GTM outputs

Generated internal outputs live in [`reports`](/Users/qfedesq/Desktop/Atlas/reports):

- [`reports/ai-agent-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/ai-agent-readiness-report.md)
- [`reports/defi-infrastructure-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/defi-infrastructure-readiness-report.md)
- [`reports/liquid-staking-landscape-report.md`](/Users/qfedesq/Desktop/Atlas/reports/liquid-staking-landscape-report.md)
- [`reports/target-chains-by-economy.md`](/Users/qfedesq/Desktop/Atlas/reports/target-chains-by-economy.md)
- [`reports/high-tvl-lagging-chains.md`](/Users/qfedesq/Desktop/Atlas/reports/high-tvl-lagging-chains.md)
- [`reports/top-ecosystem-opportunities.md`](/Users/qfedesq/Desktop/Atlas/reports/top-ecosystem-opportunities.md)
- ranking exports under [`reports/exports`](/Users/qfedesq/Desktop/Atlas/reports/exports)
- top-level GTM exports under [`exports`](/Users/qfedesq/Desktop/Atlas/exports)

Report generation is deterministic and reuses the current dataset and scoring logic.

## Launch + Reaction additions

This phase added:

- peer comparison on chain profiles
- score-driver visibility for “what moves your score”
- shareable scorecard snapshot panels on chain pages
- inline request capture for “Request Infrastructure Assessment”
- lightweight intent logging for economy selections, chain views, comparison-driven navigation, and request submits
- a narrow internal admin route for calculation assumptions only
- visible application versioning in the public shell
- local repository/version discipline for the `-v1` release line

## Global Ranking + Target Account additions

This phase added:

- a public holistic chain leaderboard at `/rankings/global`
- curated ecosystem, adoption, and performance inputs for the fixed top-30 chain set
- a deterministic `GlobalChainScore`
- an internal `OpportunityScore` per chain and economy
- an internal target dashboard at `/internal/targets`
- internal account intelligence pages at `/internal/account/[chain]`
- deterministic outreach brief generation
- new GTM exports for global ranking and top target accounts

## Request capture and intent data

Assessment requests are captured from chain profile pages and stored in structured JSON.

- request store: `data/runtime/assessment-requests.json`
- intent store: `data/runtime/intent-events.json`
- request validation + persistence: [`lib/requests/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/requests/service.ts)
- intent logging route: [`app/api/intent/route.ts`](/Users/qfedesq/Desktop/Atlas/app/api/intent/route.ts)

These files are created on first write if they do not already exist.

## Admin assumptions

Atlas now reads live calculation assumptions from:

- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

This layer controls:

- per-economy module weights
- global status score mapping
- per-economy recommendation thresholds and partial/missing toggles
- global ranking component weights
- economy composite weights
- target-account opportunity weights

The internal route is:

- `/internal/admin`

The admin route also exposes `SYNC NOW`, which runs the currently supported
Atlas refresh workflow:

- refresh top-30 EVM benchmark snapshot
- regenerate reports and exports

It does not imply live synchronization and only persists in writable
environments.

Protection model:

- `ATLAS_ADMIN_PASSWORD` in production
- local development fallback password `atlas-admin` when `ATLAS_ADMIN_PASSWORD` is not set

See [`docs/admin-assumptions.md`](/Users/qfedesq/Desktop/Atlas/docs/admin-assumptions.md) for operating guidance.

## Versioning

Canonical version source:

- [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json)
- public label helper: [`lib/config/version.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/version.ts)

Increment rule:

- every completed update bumps the minor version by `+0.1`
- example: `1.0.0` → `1.1.0`

Helper:

```bash
npm run version:bump
```

## Where core logic lives

- dataset metadata: [`lib/config/dataset.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/dataset.ts)
- economy config and module weights: [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts)
- active assumptions store: [`lib/assumptions/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/store.ts)
- active assumptions resolver: [`lib/assumptions/resolve.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/resolve.ts)
- scoring logic: [`lib/scoring/readiness-score.ts`](/Users/qfedesq/Desktop/Atlas/lib/scoring/readiness-score.ts)
- recommendation rules: [`lib/recommendations/rules.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/rules.ts)
- recommendation engine: [`lib/recommendations/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/engine.ts)
- comparison logic: [`lib/comparison/peer-comparison.ts`](/Users/qfedesq/Desktop/Atlas/lib/comparison/peer-comparison.ts)
- request capture service: [`lib/requests/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/requests/service.ts)
- intent event store: [`lib/intent/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/intent/store.ts)
- report generation: [`lib/reports/report-generator.ts`](/Users/qfedesq/Desktop/Atlas/lib/reports/report-generator.ts)
- roadmap fit analysis: [`lib/roadmaps/roadmap-analysis.ts`](/Users/qfedesq/Desktop/Atlas/lib/roadmaps/roadmap-analysis.ts)
- global ranking engine: [`lib/global-ranking/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/global-ranking/engine.ts)
- target account engine: [`lib/targets/opportunity.ts`](/Users/qfedesq/Desktop/Atlas/lib/targets/opportunity.ts)
- outreach brief builder: [`lib/targets/outreach-brief.ts`](/Users/qfedesq/Desktop/Atlas/lib/targets/outreach-brief.ts)
- seed-backed repository: [`lib/repositories/seed-chains-repository.ts`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts)

## Repository discipline

- working release line naming convention: repository name must end with `-v1`
- current local package/release line: `protofire-atlas-v1`
- workflow guidance: [`docs/repository-setup.md`](/Users/qfedesq/Desktop/Atlas/docs/repository-setup.md)
- branch used for this phase: `codex/global-ranking-target-accounts-v1-12`

## Read this first

1. [`README.md`](/Users/qfedesq/Desktop/Atlas/README.md)
2. [`docs/architecture.md`](/Users/qfedesq/Desktop/Atlas/docs/architecture.md)
3. [`docs/global-ranking.md`](/Users/qfedesq/Desktop/Atlas/docs/global-ranking.md)
4. [`docs/target-account-mode.md`](/Users/qfedesq/Desktop/Atlas/docs/target-account-mode.md)
5. [`docs/gtm-phase.md`](/Users/qfedesq/Desktop/Atlas/docs/gtm-phase.md)
6. [`docs/admin-assumptions.md`](/Users/qfedesq/Desktop/Atlas/docs/admin-assumptions.md)
7. [`docs/developer-guide.md`](/Users/qfedesq/Desktop/Atlas/docs/developer-guide.md)
8. [`docs/repository-setup.md`](/Users/qfedesq/Desktop/Atlas/docs/repository-setup.md)
9. [`docs/runbook.md`](/Users/qfedesq/Desktop/Atlas/docs/runbook.md)
