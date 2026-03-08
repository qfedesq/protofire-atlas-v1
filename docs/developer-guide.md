# Developer Guide

## Product guardrails

Keep Atlas focused on:

- chain intelligence
- deterministic rankings
- readiness gaps
- Protofire activation paths
- internal target prioritization

Do not widen the app into a generalized analytics platform or CRM.

## Refresh the benchmark

Run:

```bash
npm run data:refresh-top30
```

This updates:

- [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json)

If the benchmark changes, review:

- [`data/seed/chain-metadata.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-metadata.ts)
- [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts)
- [`data/seed/economies`](/Users/qfedesq/Desktop/Atlas/data/seed/economies)
- [`data/seed/chain-roadmaps.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-roadmaps.ts)

## Refresh external metrics

Run:

```bash
npm run data:sync-external
```

This updates:

- [`data/source/external-chain-metrics.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/external-chain-metrics.snapshot.json)

Key files:

- connectors: [`lib/external-data/connectors`](/Users/qfedesq/Desktop/Atlas/lib/external-data/connectors)
- normalization: [`lib/external-data/utils.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/utils.ts)
- service: [`lib/external-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/service.ts)

Rules:

- do not fabricate missing metrics
- preserve the last valid snapshot if a source fails
- use fallback values only when no valid source-backed metric exists
- keep all source credentials server-side

## Full refresh workflow

Run:

```bash
npm run data:sync
```

This currently:

- refreshes the top-30 benchmark
- refreshes external metrics
- regenerates reports and exports

## Update readiness seeds

AI Agents:

- [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts)

Other economies:

- [`data/seed/economies`](/Users/qfedesq/Desktop/Atlas/data/seed/economies)

Keep `status`, `rationale`, and `evidenceNote` explicit and deterministic.

## Change scoring assumptions

Preferred path:

- use `/internal/admin`

Stored in:

- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

This controls:

- readiness module weights
- status mappings
- recommendation thresholds
- global ranking weights
- economy composite weights
- opportunity score weights

Only change base definitions in code when the product model itself changes:

- [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts)
- [`lib/assumptions/defaults.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/defaults.ts)

## Update recommendation logic

Files:

- [`lib/recommendations/rules.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/rules.ts)
- [`lib/recommendations/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/engine.ts)

Keep this layer deterministic and component-free.

## Update public API or export payloads

Use the shared serializer:

- [`lib/public-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/public-data/service.ts)

Public routes:

- [`app/api/public`](/Users/qfedesq/Desktop/Atlas/app/api/public)
- [`app/data`](/Users/qfedesq/Desktop/Atlas/app/data)

Rules:

- expose public Atlas data only
- always include `atlas_version`, `updated_at`, and `source_note`
- never expose opportunity scores or admin assumptions

## Update embeds and badges

Embeds:

- [`app/embed`](/Users/qfedesq/Desktop/Atlas/app/embed)

Badges:

- [`app/badge`](/Users/qfedesq/Desktop/Atlas/app/badge)

Badge rendering:

- [`lib/badges/svg.ts`](/Users/qfedesq/Desktop/Atlas/lib/badges/svg.ts)

Keep these routes lightweight and public-safe.

## Update ranking tables

Shared ranking system:

- renderer: [`components/tables/ranking-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-table.tsx)
- columns: [`components/tables/ranking-column-definitions.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-column-definitions.tsx)
- helpers: [`lib/rankings/table.ts`](/Users/qfedesq/Desktop/Atlas/lib/rankings/table.ts)

Rules:

- keep the chain column sticky
- preserve mode separation between public and internal rankings
- keep global ranking child-column behavior inside the header tree
- do not reintroduce a separate column menu for the public global ranking

## Update the chain page

Primary files:

- [`components/chain/chain-profile-view.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/chain-profile-view.tsx)
- [`components/chain/score-composition-section.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/score-composition-section.tsx)
- [`components/chain/improvement-path-section.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/improvement-path-section.tsx)

Rules:

- one dominant readiness score
- flat analytical layout
- no rounded metric-chip grids
- competitive and global context come after score explanation and improvement path

## Regenerate outputs

Run:

```bash
npm run reports:generate
```

This writes:

- internal reports under [`reports`](/Users/qfedesq/Desktop/Atlas/reports)
- GTM exports under [`exports`](/Users/qfedesq/Desktop/Atlas/exports)
- public dataset exports under [`exports/public-data`](/Users/qfedesq/Desktop/Atlas/exports/public-data)

## Bump version

Run:

```bash
npm run version:bump
```

Canonical source:

- [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json)

Version helper:

- [`lib/config/version.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/version.ts)
