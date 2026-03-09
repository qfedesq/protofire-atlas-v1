# Protofire Atlas

Protofire Atlas is a public infrastructure readiness intelligence product for chains, L1s, and L2s.

It ranks chains, explains how each score is built, shows which infrastructure is missing, and maps those gaps to deterministic Protofire deployment paths.

## Product scope

Atlas stays focused on:

- public chain rankings
- multi-economy readiness scoring
- chain profile diagnostics
- Protofire stack recommendations
- deployment planning
- internal target-account prioritization

Supported readiness wedges:

- AI Agent Economy
- DeFi Infrastructure Economy
- RWA Infrastructure Economy
- Prediction Market Economy

Out of scope:

- wallets
- billing
- AI-generated public scoring
- generalized analytics SaaS
- marketplaces
- provider networks

## Current product surfaces

Public:

- one-page global ranking at `/`
- compatibility global ranking route at `/rankings/global`
- chain profiles at `/chains/[slug]`
- public data pages at `/data`, `/data/rankings`, `/data/research`, `/data/gaps`
- public read API at `/api/public/*`
- embeds at `/embed/*`
- badges at `/badge/*`

Internal:

- admin assumptions editor at `/internal/admin`
- data source registry and manual dataset editor at `/internal/admin/data-sources`
- wedge applicability matrix at `/internal/applicability`
- GPT-assisted technical analysis results at `/internal/analysis/[id]`
- target account ranking at `/internal/targets`
- account intelligence pages at `/internal/account/[chain]`

## Dataset and source model

Benchmark selection remains:

- top 30 EVM chains by TVL
- selection source: DeFiLlama snapshot
- source file: [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json)

Atlas now also supports source-backed external metrics with provenance:

- persisted snapshot: [`data/source/external-chain-metrics.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/external-chain-metrics.snapshot.json)
- connectors: [`lib/external-data/connectors`](/Users/qfedesq/Desktop/Atlas/lib/external-data/connectors)

Atlas does not claim fully real-time synchronization. It uses:

- deterministic seed data
- source-backed connector overlays where available
- last-valid snapshot preservation
- deterministic fallback values when a source is unavailable
- runtime-managed admin overrides for manual datasets and assumptions

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev
npm run data:refresh-top30
npm run data:sync-external
npm run data:sync
npm run reports:generate
npm run version:bump
npm run validate:data
npm run typecheck
npm run lint
npm run test
npm run build
npm run check
```

`npm run check` is the main repo health command.

## Data refresh workflow

Refresh the benchmark only:

```bash
npm run data:refresh-top30
```

Refresh source-backed external metrics only:

```bash
npm run data:sync-external
```

Run the supported Atlas refresh workflow:

```bash
npm run data:sync
```

This currently:

- refreshes the top-30 benchmark snapshot
- refreshes the external metrics snapshot
- regenerates reports and exports

After refresh:

1. review [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json)
2. review [`data/source/external-chain-metrics.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/external-chain-metrics.snapshot.json)
3. update seed metadata or readiness statuses if the benchmark changed
4. run:

```bash
npm run reports:generate
npm run check
```

## Public data interfaces

Public API:

- `/api/public/rankings/global`
- `/api/public/rankings/[economy]`
- `/api/public/chains/[slug]`
- `/api/public/research/[economy]`
- `/api/public/gaps/[economy]`

Public downloads:

- `/data/global-ranking.json`
- `/data/global-ranking.csv`
- `/data/economy/[economy].json`
- `/data/economy/[economy].csv`
- `/data/gaps/[economy].json`

Generated public exports:

- [`exports/public-data`](/Users/qfedesq/Desktop/Atlas/exports/public-data)

Public embeds:

- `/embed/rankings/global`
- `/embed/rankings/[economy]`
- `/embed/chains/[slug]/scorecard`
- `/embed/gaps/[module]`

Public badges:

- `/badge/chains/[slug]/global`
- `/badge/chains/[slug]/[economy]`

## Request capture and intent logging

Assessment requests:

- store: `data/runtime/assessment-requests.json`
- service: [`lib/requests/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/requests/service.ts)

Intent events:

- store: `data/runtime/intent-events.json`
- route: [`app/api/intent/route.ts`](/Users/qfedesq/Desktop/Atlas/app/api/intent/route.ts)

## Admin assumptions

Live calculation assumptions are stored in:

- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

The admin route controls:

- economy module weights
- status score mapping
- recommendation thresholds
- global ranking weights
- economy composite weights
- opportunity score weights
- global subweights
- wedge applicability rules
- GPT-assisted analysis settings

`/internal/admin/data-sources` now also exposes:

- metric provenance registry
- sync controls for external source-backed metrics
- manual dataset editors for non-automatic Atlas data
- the full scoring math editor
- technical applicability profile overrides

`SYNC NOW` on the admin pages refreshes the external metrics snapshot in-process. The CLI `npm run data:sync` remains the broader local workflow for refresh plus output generation.

Persistence:

- local development defaults to JSON files in the repo or runtime-managed paths
- Vercel runtime automatically uses the connected Postgres database when `DATABASE_URL` is available
- mutable Atlas documents are stored in the `atlas_documents` table and mirrored to the current runtime file path as a fallback cache

Protection:

- production: `ATLAS_ADMIN_PASSWORD`
- local fallback: `atlas-admin`
- optional Auth0 session-based internal access for protected analysis/internal routes

## Wedge applicability and chain analysis

Atlas now distinguishes:

- readiness: how mature the chain is for a wedge
- applicability: whether the wedge is technically feasible on the chain at all

Applicability is deterministic and internal. It is visible on:

- `/internal/applicability`
- internal chain-page analysis section

Atlas also supports an internal GPT-assisted technical review per chain. The workflow:

- assembles a structured chain snapshot
- analyzes all four wedges
- stores a traceable result with timestamps, model label, and structured findings
- falls back to deterministic mock mode if live OpenAI execution is unavailable and mock fallback is enabled

Live execution still depends on:

- `OPENAI_API_KEY`
- actual access to the configured model name in the connected OpenAI account

## Versioning

Canonical version source:

- [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json)

Public label helper:

- [`lib/config/version.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/version.ts)

Rule:

- every completed update bumps the version by `+0.1`

Helper:

```bash
npm run version:bump
```

## Where core logic lives

- site + dataset config: [`lib/config`](/Users/qfedesq/Desktop/Atlas/lib/config)
- domain types and validation: [`lib/domain`](/Users/qfedesq/Desktop/Atlas/lib/domain)
- assumptions: [`lib/assumptions`](/Users/qfedesq/Desktop/Atlas/lib/assumptions)
- scoring: [`lib/scoring/readiness-score.ts`](/Users/qfedesq/Desktop/Atlas/lib/scoring/readiness-score.ts)
- recommendations: [`lib/recommendations`](/Users/qfedesq/Desktop/Atlas/lib/recommendations)
- comparison logic: [`lib/comparison/peer-comparison.ts`](/Users/qfedesq/Desktop/Atlas/lib/comparison/peer-comparison.ts)
- global ranking: [`lib/global-ranking/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/global-ranking/engine.ts)
- external data: [`lib/external-data`](/Users/qfedesq/Desktop/Atlas/lib/external-data)
- public data serialization: [`lib/public-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/public-data/service.ts)
- target accounts: [`lib/targets`](/Users/qfedesq/Desktop/Atlas/lib/targets)
- repository read model: [`lib/repositories/seed-chains-repository.ts`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts)

## Read this first

1. [`README.md`](/Users/qfedesq/Desktop/Atlas/README.md)
2. [`docs/architecture.md`](/Users/qfedesq/Desktop/Atlas/docs/architecture.md)
3. [`docs/public-api.md`](/Users/qfedesq/Desktop/Atlas/docs/public-api.md)
4. [`docs/public-data.md`](/Users/qfedesq/Desktop/Atlas/docs/public-data.md)
5. [`docs/external-data-sources.md`](/Users/qfedesq/Desktop/Atlas/docs/external-data-sources.md)
6. [`docs/ranking-system.md`](/Users/qfedesq/Desktop/Atlas/docs/ranking-system.md)
