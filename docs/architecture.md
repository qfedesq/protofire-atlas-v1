# Architecture

Protofire Atlas is a deterministic Next.js App Router application built around three layers:

- public readiness intelligence
- internal GTM intelligence
- source-backed data snapshots

The repository stays seed-first, but now supports connector overlays with provenance and fallback behavior.

## Directory map

- `app/`
  - route entrypoints only
  - public routes, internal routes, API routes, embeds, badges, and dataset pages
- `components/`
  - presentational UI and page composition
- `data/source/`
  - benchmark snapshot and external metrics snapshot
- `data/seed/`
  - curated chain metadata, readiness seeds, roadmap coverage, and fallback ecosystem metrics
- `data/admin/`
  - active assumptions editable through `/internal/admin`
- `data/runtime/`
  - request and intent files created at runtime
- `lib/domain/`
  - shared types and Zod validation
- `lib/config/`
  - supported economies, dataset metadata, site config, and version helpers
- `lib/assumptions/`
  - assumption loading, validation, persistence, and resolution
- `lib/scoring/`
  - deterministic readiness calculations
- `lib/recommendations/`
  - deterministic stack rules and deployment sequencing
- `lib/comparison/`
  - nearby-peer selection and score-driver logic
- `lib/global-ranking/`
  - global chain score calculation
- `lib/external-data/`
  - connectors, normalization, persistence, and fallback snapshot logic
- `lib/public-data/`
  - public API/export serialization
- `lib/badges/`
  - SVG badge rendering
- `lib/targets/`
  - internal opportunity scoring and outreach briefs
- `lib/repositories/`
  - seed-backed read model for all public and internal pages
- `scripts/`
  - refresh and generation utilities
- `reports/`
  - generated internal reports
- `exports/`
  - generated CSV/JSON exports

## Core data flow

1. Benchmark selection comes from [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json).
2. Curated seed data under [`data/seed`](/Users/qfedesq/Desktop/Atlas/data/seed) defines readiness statuses, chain metadata, roadmaps, and fallback ecosystem metrics.
3. [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json) overlays editable scoring and recommendation assumptions.
4. [`data/source/external-chain-metrics.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/external-chain-metrics.snapshot.json) stores the latest valid source-backed external metrics snapshot.
5. [`lib/repositories/seed-chains-repository.ts`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts) resolves all of that into public and internal read models.

## External data flow

1. Connectors live in [`lib/external-data/connectors`](/Users/qfedesq/Desktop/Atlas/lib/external-data/connectors).
2. [`lib/external-data/utils.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/utils.ts) maps source payloads onto Atlas chain slugs and metric names.
3. [`lib/external-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/service.ts) merges connector outputs onto:
   - the deterministic Atlas fallback baseline
   - the previous valid external snapshot
4. The persisted snapshot includes per-metric:
   - source name
   - source endpoint
   - fetched timestamp
   - normalization note
   - freshness

## Scoring flow

1. Base economy definitions live in [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts).
2. Active assumptions are applied by [`lib/assumptions/resolve.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/resolve.ts).
3. [`lib/scoring/readiness-score.ts`](/Users/qfedesq/Desktop/Atlas/lib/scoring/readiness-score.ts) computes weighted readiness scores.
4. [`lib/global-ranking/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/global-ranking/engine.ts) combines:
   - economy composite
   - ecosystem score
   - adoption score
   - performance score
5. [`lib/targets/opportunity.ts`](/Users/qfedesq/Desktop/Atlas/lib/targets/opportunity.ts) derives internal opportunity scores separately from public rankings.

## Recommendation and deployment flow

1. Recommendation rules live in [`lib/recommendations/rules.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/rules.ts).
2. [`lib/recommendations/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/engine.ts) derives:
   - gap analysis
   - recommended stack
   - score drivers
   - deployment plan
3. Chain pages and exports consume those outputs through the repository layer.

## Ranking system flow

All ranking modes share one table architecture:

- renderer: [`components/tables/ranking-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-table.tsx)
- column definitions: [`components/tables/ranking-column-definitions.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-column-definitions.tsx)
- helpers: [`lib/rankings/table.ts`](/Users/qfedesq/Desktop/Atlas/lib/rankings/table.ts)

Current ranking modes:

- public global ranking
- public economy ranking compatibility surfaces
- internal opportunity ranking

The public global ranking uses a header-tree model where master columns expand or collapse child columns directly from the table header.

## Public data flow

[`lib/public-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/public-data/service.ts) is the single serializer for:

- public ranking APIs
- public chain payloads
- research payloads
- gap payloads
- JSON/CSV export generation

That service feeds:

- `/api/public/*`
- `/data/*` download routes
- `exports/public-data/*`

## Embeds and badges

Embeds are public, minimal, and iframe-safe:

- `/embed/rankings/global`
- `/embed/rankings/[economy]`
- `/embed/chains/[slug]/scorecard`
- `/embed/gaps/[module]`

Badges are public SVG routes:

- `/badge/chains/[slug]/global`
- `/badge/chains/[slug]/[economy]`

Chrome suppression for embed routes is handled by [`components/layout/site-shell.tsx`](/Users/qfedesq/Desktop/Atlas/components/layout/site-shell.tsx).

## Chain page rendering order

Public chain pages intentionally follow one flat analytical document structure:

1. Chain header
2. Primary readiness score
3. Score composition
4. Improvement path
5. Competitive context
6. Global context
7. CTA

Primary implementation files:

- [`components/chain/chain-profile-view.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/chain-profile-view.tsx)
- [`components/chain/score-composition-section.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/score-composition-section.tsx)
- [`components/chain/improvement-path-section.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/improvement-path-section.tsx)

Supporting memo-style bodies:

- [`components/chain/gap-analysis.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/gap-analysis.tsx)
- [`components/stack/recommended-stack.tsx`](/Users/qfedesq/Desktop/Atlas/components/stack/recommended-stack.tsx)
- [`components/stack/deployment-plan.tsx`](/Users/qfedesq/Desktop/Atlas/components/stack/deployment-plan.tsx)

Future changes to chain pages should preserve these rules:

- no explanatory three-column layouts for long-form content
- no chip or stat-tile treatment inside analytical sections
- section titles stay visible even when bodies are collapsed
- score explanation comes before competitive or global context

## Section toggle behavior

Major analytical sections on chain pages use [`components/ui/expandable-section.tsx`](/Users/qfedesq/Desktop/Atlas/components/ui/expandable-section.tsx).

Rules:

- title row is always visible
- body is expandable/collapsible through native `<details>`
- primary analytical sections can default open
- secondary context sections default closed
- toggles should feel like document disclosure, not FAQ accordions

## Admin provenance registry

The internal provenance registry lives at:

- `/internal/admin/data-sources`

Backing files:

- [`lib/admin/data-source-registry.ts`](/Users/qfedesq/Desktop/Atlas/lib/admin/data-source-registry.ts)
- [`components/admin/data-source-registry-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/admin/data-source-registry-table.tsx)
- [`app/internal/admin/data-sources/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/internal/admin/data-sources/page.tsx)

This registry is the operational map of:

- blockchain-related external metrics
- readiness model inputs
- admin-managed assumptions
- seeded fallback datasets
- supplemental roadmap and liquid-staking inputs

## Internal-only flows

Internal GTM surfaces remain separate and protected:

- `/internal/admin`
- `/internal/targets`
- `/internal/account/[chain]`

These routes can use internal assumptions and opportunity scoring, but none of that data is exposed through the public API, public exports, embeds, or badges.

## Why this structure

- deterministic public outputs remain easy to reason about
- source-backed metrics add provenance without turning Atlas into a live-ingestion system
- public and internal concerns stay separated
- one repository-backed read model prevents duplicated ranking logic
- chain pages stay commercial and analytical without introducing a second presentation architecture
