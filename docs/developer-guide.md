# Developer Guide

## Read before editing

Protofire Atlas is intentionally narrow.

Keep the product focused on:

- chains
- readiness rankings
- infrastructure gaps
- Protofire stack recommendations
- deployment plans
- supported economy wedges only

Do not casually widen the app into a broader analytics suite, marketplace, or multi-segment platform.

## Refresh the top 30 chain list

The chain-selection source of truth is the DeFiLlama TVL snapshot, not a hand-edited chain list.

Run:

```bash
npm run data:refresh-top30
```

That workflow:

- fetches `https://api.llama.fi/chains`
- filters against [`data/source/defillama-evm-chain-map.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-evm-chain-map.json)
- keeps the top 30 EVM chains by TVL
- rewrites [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json)

If a new chain enters the top 30, add or update its human-authored metadata in [`data/seed/chain-metadata.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-metadata.ts).

## Update roadmap coverage

Atlas keeps roadmap coverage separate from readiness statuses.

- official roadmap and update coverage: [`data/seed/chain-roadmaps.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-roadmaps.ts)
- roadmap fit logic used in the UI: [`lib/roadmaps/roadmap-analysis.ts`](/Users/qfedesq/Desktop/Atlas/lib/roadmaps/roadmap-analysis.ts)
- source review reference: [`docs/onchain-data-sources.md`](/Users/qfedesq/Desktop/Atlas/docs/onchain-data-sources.md)

Rules:

- prefer official roadmap pages
- if no roadmap page is verifiable, use an official updates or docs source only when it still helps stage the chain honestly
- otherwise keep `No public roadmap verified`
- do not add runtime AI analysis; Atlas uses curated stage notes plus deterministic score-driver logic

## Edit module statuses

AI Agents:

- edit [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts)

Other economies:

- edit the relevant file under [`data/seed/economies`](/Users/qfedesq/Desktop/Atlas/data/seed/economies)

Keep `status`, `evidenceNote`, and `rationale` explicit and honest that the dataset is curated.

After any change:

```bash
npm run validate:data
npm run test
```

## Change weights

Preferred path:

- use `/internal/admin` for live assumption changes
- only edit [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts) when changing the base economy model itself

Admin-managed values are stored in [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json).

If you need to update the base defaults in code:

1. Edit the target economy in [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts).
2. Keep total module weight at `100`.
3. Re-run:

```bash
npm run validate:data
npm run test
npm run reports:generate
```

4. Inspect the resulting rankings before shipping.

## Update recommendation mappings

1. Edit [`lib/recommendations/rules.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/rules.ts).
2. Keep the mapping deterministic.
3. Every rule should still explain:
   - what Protofire deploys
   - why it matters
   - expected result
   - direct chain impact
   - deployment phase placement
4. Do not move recommendation copy into components.

Recommendation thresholds and partial/missing toggles now live in the active assumption layer, not in the static rule copy.

## Change CTA behavior

Public request capture currently lives on chain profiles.

- request form component: [`components/requests/assessment-request-form.tsx`](/Users/qfedesq/Desktop/Atlas/components/requests/assessment-request-form.tsx)
- submit action: [`app/actions/assessment-request.ts`](/Users/qfedesq/Desktop/Atlas/app/actions/assessment-request.ts)
- persistence service: [`lib/requests/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/requests/service.ts)

Keep CTA behavior narrow:

- capture the request
- preserve chain/economy context
- do not turn it into CRM, auth, or outbound automation

## Update comparison rules

Nearby-peer logic and score-driver derivation live in:

- [`lib/comparison/peer-comparison.ts`](/Users/qfedesq/Desktop/Atlas/lib/comparison/peer-comparison.ts)

Do not move comparison heuristics into components. Keep them deterministic and testable.

## Retrieve stored requests and intent signals

By default, Atlas writes runtime files under `data/runtime/`:

- assessment requests: `data/runtime/assessment-requests.json`
- intent events: `data/runtime/intent-events.json`

These file paths can be overridden with:

- `ATLAS_REQUESTS_FILE`
- `ATLAS_INTENT_FILE`

## Regenerate GTM exports

Run:

```bash
npm run reports:generate
```

Outputs now include:

- markdown reports in [`reports`](/Users/qfedesq/Desktop/Atlas/reports)
- JSON ranking exports in [`reports/exports`](/Users/qfedesq/Desktop/Atlas/reports/exports)
- CSV ranking exports in [`reports/exports`](/Users/qfedesq/Desktop/Atlas/reports/exports)

## Regenerate internal reports

Run:

```bash
npm run reports:generate
```

Outputs:

- [`reports/ai-agent-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/ai-agent-readiness-report.md)
- [`reports/defi-infrastructure-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/defi-infrastructure-readiness-report.md)
- [`reports/liquid-staking-landscape-report.md`](/Users/qfedesq/Desktop/Atlas/reports/liquid-staking-landscape-report.md)
- [`reports/target-chains-by-economy.md`](/Users/qfedesq/Desktop/Atlas/reports/target-chains-by-economy.md)
- [`reports/high-tvl-lagging-chains.md`](/Users/qfedesq/Desktop/Atlas/reports/high-tvl-lagging-chains.md)
- JSON and CSV exports under [`reports/exports`](/Users/qfedesq/Desktop/Atlas/reports/exports)

## Add a new economy or module

1. Add or update the economy definition in [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts).
2. Add recommendation rules in [`lib/recommendations/rules.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/rules.ts).
3. Add or update the seed file under [`data/seed/economies`](/Users/qfedesq/Desktop/Atlas/data/seed/economies).
4. Export it from [`data/seed/economies/index.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/economies/index.ts).
5. Run `npm run validate:data` before touching UI.

The home page, chain page, scoring engine, and recommendation engine are already economy-aware. In most cases you should not need a new page implementation.

## Admin-managed assumptions

The live assumption layer is intentionally narrow.

Editable:

- module weights by economy
- global status scores
- recommendation threshold
- partial/missing recommendation toggles

Not editable through admin:

- economy/module catalog
- recommendation copy
- seed readiness statuses
- source benchmark dataset

Storage and load path:

- persisted values: [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)
- load/validation: [`lib/assumptions/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/store.ts)
- runtime overlay: [`lib/assumptions/resolve.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/resolve.ts)

## Versioning and git workflow

Canonical version source:

- [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json)

Public label source:

- [`lib/config/version.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/version.ts)

Bump rule:

- every completed update increments by `+0.1`
- package version form: `1.0.0`, `1.1.0`, `1.2.0`, `1.3.0`, `1.4.0`, `1.5.0`, `1.6.0`, `1.7.0`, `1.8.0`

Helper:

```bash
npm run version:bump
```

Expected workflow:

1. Create a branch with prefix `codex/` or another approved project prefix.
2. Implement the change.
3. If the update is complete, bump the version by `+0.1`.
4. Run `npm run check` and `npm run build`.
5. Commit with a clear conventional message.
6. Push the branch.
7. Merge after review or explicit approval.

## What not to change casually

- [`data/source/defillama-evm-chain-map.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-evm-chain-map.json)
  - it defines what Atlas considers EVM for the source snapshot workflow
- [`lib/domain/types.ts`](/Users/qfedesq/Desktop/Atlas/lib/domain/types.ts)
  - shared types ripple across the whole app
- [`lib/domain/schemas.ts`](/Users/qfedesq/Desktop/Atlas/lib/domain/schemas.ts)
  - validation keeps the seed workflow safe
- [`lib/scoring/readiness-score.ts`](/Users/qfedesq/Desktop/Atlas/lib/scoring/readiness-score.ts)
  - benchmark math must stay centralized and explicit
- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)
  - this is the live public scoring assumption layer
- [`lib/repositories/seed-chains-repository.ts`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts)
  - pages and reports rely on this as the single read-model boundary

## What not to do

- do not add chains manually outside the top-30 source workflow unless you are deliberately changing the benchmark methodology
- do not claim the dataset is live
- do not move scoring or recommendation logic into UI components
- do not add speculative wedges or customer segments
