# Architecture

Protofire Atlas is a seed-first Next.js App Router application with explicit boundaries between source snapshots, editable readiness data, scoring, recommendations, reports, and UI rendering.

## Directory map

- `app/`
  - route entrypoints only
  - `/`, `/rankings/global`, `/chains/[slug]`, `/internal/admin`, `/internal/targets`, `/internal/account/[chain]`
- `components/`
  - presentational UI and page composition
  - no scoring or recommendation rules
- `data/source/`
  - documented DeFiLlama source snapshot and curated EVM chain mapping
- `data/seed/`
  - editable chain metadata, roadmap seeds, economy readiness seeds, and ecosystem/performance metrics
- `data/admin/`
  - persisted active calculation assumptions owned by Protofire management
- `data/runtime/`
  - request and intent files created by runtime flows
- `lib/domain/`
  - shared types and Zod validation
- `lib/config/`
  - supported economies, calibrated weights, dataset metadata, and site config
- `lib/assumptions/`
  - active assumption loading, validation, and persistence
- `lib/comparison/`
  - nearby-peer selection and score-driver derivation
- `lib/scoring/`
  - deterministic readiness calculations
- `lib/global-ranking/`
  - deterministic holistic chain ranking
- `lib/recommendations/`
  - deterministic recommendation rules and deployment sequencing
- `lib/targets/`
  - deterministic opportunity scoring and outreach brief generation
- `lib/requests/`
  - request validation and storage
- `lib/intent/`
  - lightweight intent event logging
- `lib/reports/`
  - deterministic markdown and JSON report generation
- `lib/repositories/`
  - seed-backed read model used by the UI and reports
- `lib/rankings/`
  - shared ranking-table visibility and column-selection helpers
- `scripts/`
  - refresh and generation utilities
- `reports/`
  - generated GTM-ready markdown reports and ranking exports
- `tests/`
  - business logic, data validation, reports, and rendering tests

## Data flow

1. [`scripts/refresh-top-30-evm-chains.sh`](/Users/qfedesq/Desktop/Atlas/scripts/refresh-top-30-evm-chains.sh) fetches DeFiLlama `/chains`.
2. [`scripts/refresh-top-30-evm-chains.mjs`](/Users/qfedesq/Desktop/Atlas/scripts/refresh-top-30-evm-chains.mjs) filters that result through [`data/source/defillama-evm-chain-map.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-evm-chain-map.json), sorts by TVL, and writes [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json).
3. [`data/seed/chain-metadata.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-metadata.ts) adds human-authored chain descriptions and websites.
4. [`data/seed/chain-roadmaps.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-roadmaps.ts) stores official roadmap or official-source coverage plus the current curated stage analysis per chain.
5. [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts) derives the AI-agent seed set from the snapshot plus AI readiness statuses.
6. [`data/seed/economies/index.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/economies/index.ts) assembles per-economy readiness records for AI, DeFi, RWA, and Prediction Markets.
7. [`data/seed/chain-ecosystem-metrics.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-ecosystem-metrics.ts) stores curated ecosystem, adoption, and performance inputs for the global ranking.
8. [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json) stores the live module weights, status mappings, global ranking weights, and opportunity-scoring weights used by the app.
9. [`validateAtlasSeedDataset`](/Users/qfedesq/Desktop/Atlas/lib/domain/schemas.ts) validates:
   - unique chains
   - sequential source ranks
   - unique economy definitions
   - complete chain-by-economy coverage
   - module completeness per economy
   - weight totals per economy
10. [`validateChainEcosystemMetricsSeeds`](/Users/qfedesq/Desktop/Atlas/lib/domain/schemas.ts) validates one ecosystem metrics record per seeded chain.
11. [`SeedChainsRepository`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts) combines seed data with the active assumption layer and exposes economy rankings, the global ranking, target accounts, and chain profiles.

## Scoring flow

1. [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts) defines the base module catalog and base recommendation templates.
2. [`lib/assumptions/resolve.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/resolve.ts) overlays active admin-managed weights, status mappings, and recommendation thresholds onto those base economy definitions.
3. [`buildChainModuleStatuses`](/Users/qfedesq/Desktop/Atlas/lib/scoring/readiness-score.ts) normalizes seeded module input into typed status records.
4. [`buildReadinessScore`](/Users/qfedesq/Desktop/Atlas/lib/scoring/readiness-score.ts) computes weighted contributions and the total readiness score for the selected economy.
5. Benchmark rank is derived per economy from raw total score, with chain name as the tie-breaker.

## Recommendation flow

1. [`lib/recommendations/rules.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/rules.ts) stores the deterministic stack mapping per economy.
2. [`buildGapAnalysis`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/engine.ts) converts missing and partial modules into user-facing gap items.
3. [`buildRecommendedStack`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/engine.ts) filters recommendations through the active recommendation threshold and partial/missing toggles, then derives:
   - recommended Protofire modules
   - why each module matters
   - expected result
   - direct chain impact
4. [`buildDeploymentPlan`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/engine.ts) groups recommendations into economy-specific phases with deterministic timeline labels.

## Global ranking flow

1. [`data/seed/chain-ecosystem-metrics.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-ecosystem-metrics.ts) stores the curated chain-level ecosystem metrics used for the holistic leaderboard.
2. [`lib/global-ranking/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/global-ranking/engine.ts) combines:
   - weighted economy composite score
   - ecosystem activity score
   - adoption score
   - technical performance score
3. Global ranking weights and the economy-composite blend are read from the active assumptions layer.
4. [`app/rankings/global/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/rankings/global/page.tsx) renders the public holistic leaderboard.
5. [`scripts/sync-atlas-data.mjs`](/Users/qfedesq/Desktop/Atlas/scripts/sync-atlas-data.mjs) runs the currently supported refresh workflow for the Atlas benchmark snapshot plus generated outputs.

## Target account flow

1. [`lib/targets/opportunity.ts`](/Users/qfedesq/Desktop/Atlas/lib/targets/opportunity.ts) converts each chain-economy pair into an opportunity score using TVL, readiness gap, stack fit, and ecosystem signal.
2. [`SeedChainsRepository`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts) exposes the sorted internal opportunity list and account-level profile lookup.
3. [`lib/targets/outreach-brief.ts`](/Users/qfedesq/Desktop/Atlas/lib/targets/outreach-brief.ts) generates a deterministic outreach brief from the selected opportunity and current peer context.
4. [`app/internal/targets/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/internal/targets/page.tsx) renders the internal commercial-priority table.
5. [`app/internal/account/[chain]/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/internal/account/[chain]/page.tsx) renders the account-intelligence view for one chain.

## Comparison flow

1. [`lib/comparison/peer-comparison.ts`](/Users/qfedesq/Desktop/Atlas/lib/comparison/peer-comparison.ts) computes:
   - nearby peers in benchmark rank order
   - decisive module deltas versus those peers
   - score-driver upside for the selected chain
2. [`SeedChainsRepository`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts) attaches those derived outputs to the chain profile read model.
3. [`components/chain/peer-comparison.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/peer-comparison.tsx) and [`components/chain/score-drivers.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/score-drivers.tsx) render the public comparative pressure on the chain page.

## Roadmap fit flow

1. [`data/seed/chain-roadmaps.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-roadmaps.ts) stores the current official roadmap or official-source coverage plus the chain stage summary.
2. [`lib/roadmaps/roadmap-analysis.ts`](/Users/qfedesq/Desktop/Atlas/lib/roadmaps/roadmap-analysis.ts) combines that stage summary with the current economy score drivers.
3. The rankings table uses that output to show the current roadmap stage and the best score lever for the selected economy.
4. The chain profile renders the same logic inside the `Competitive analysis` section so roadmap context and stack recommendation stay in one place.

## Ranking system flow

1. [`components/tables/ranking-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-table.tsx) owns the shared markup, sticky-chain-column behavior, column toggles, and sort-control rendering.
2. [`components/tables/ranking-column-definitions.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-column-definitions.tsx) defines per-mode columns for:
   - economy ranking
   - global ranking
   - opportunity ranking
3. [`lib/rankings/table.ts`](/Users/qfedesq/Desktop/Atlas/lib/rankings/table.ts) parses, resolves, toggles, and serializes visible-column sets.
4. Each page keeps its own URL builder, but all ranking pages now render through the same shared table layer.
5. The current mode wrappers are:
   - [`components/tables/rankings-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/rankings-table.tsx)
   - [`components/tables/global-rankings-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/global-rankings-table.tsx)
   - [`components/tables/targets-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/targets-table.tsx)

## Request capture flow

1. [`components/requests/assessment-request-form.tsx`](/Users/qfedesq/Desktop/Atlas/components/requests/assessment-request-form.tsx) renders the inline assessment CTA on chain pages.
2. [`app/actions/assessment-request.ts`](/Users/qfedesq/Desktop/Atlas/app/actions/assessment-request.ts) validates submitted form data and redirects to a success or error state.
3. [`lib/requests/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/requests/service.ts) persists the request to `data/runtime/assessment-requests.json`.
4. The same service emits an `assessment_request_submitted` intent event into `data/runtime/intent-events.json`.

## Intent flow

1. [`components/intent/intent-beacon.tsx`](/Users/qfedesq/Desktop/Atlas/components/intent/intent-beacon.tsx) emits lightweight client-side beacons for economy selections, chain views, and peer-comparison navigation.
2. [`app/api/intent/route.ts`](/Users/qfedesq/Desktop/Atlas/app/api/intent/route.ts) records those events through [`lib/intent/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/intent/store.ts).

## Admin assumption flow

1. [`app/internal/admin/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/internal/admin/page.tsx) is the narrow internal assumptions editor.
2. [`lib/admin/auth.ts`](/Users/qfedesq/Desktop/Atlas/lib/admin/auth.ts) protects that route with an environment-variable password and an HttpOnly cookie.
3. [`app/internal/admin/actions.ts`](/Users/qfedesq/Desktop/Atlas/app/internal/admin/actions.ts) writes validated updates through [`lib/assumptions/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/service.ts).
4. Public scoring and recommendations consume the updated assumption set automatically on subsequent requests.
5. The same active assumptions file now controls:
   - global ranking component weights
   - economy composite weights inside the global ranking
   - opportunity-score weights for Target Account Mode
6. The same admin route also exposes `SYNC NOW`, which triggers the currently supported Atlas refresh workflow through [`lib/admin/sync.ts`](/Users/qfedesq/Desktop/Atlas/lib/admin/sync.ts).

## Report flow

1. [`lib/reports/report-generator.ts`](/Users/qfedesq/Desktop/Atlas/lib/reports/report-generator.ts) reads the repository outputs.
2. It generates markdown reports for:
   - AI Agent Economy
   - DeFi Infrastructure
   - Liquid staking landscape
   - target chains by economy
   - high-TVL lagging chains
   - top ecosystem opportunities
3. It also generates JSON and CSV ranking exports per economy.
4. It generates additional top-level CSV exports for:
   - global chain ranking
   - top target accounts
5. [`scripts/generate-reports.ts`](/Users/qfedesq/Desktop/Atlas/scripts/generate-reports.ts) writes those outputs into [`reports`](/Users/qfedesq/Desktop/Atlas/reports) and [`exports`](/Users/qfedesq/Desktop/Atlas/exports).

## Rendering flow

Home page:

- parses ranking search params at `/`
- parses global-ranking sorting and column params at `/#global-ranking`
- resolves the selected economy
- renders the global leaderboard plus the selected-economy leaderboard in one page
- drives leaderboard sorting directly from table header links instead of a separate filter panel
- emits a lightweight intent beacon for the active economy selection

Global ranking page:

- parses global sorting params at `/rankings/global`
- resolves the holistic leaderboard from the repository
- renders the chain-level composite of readiness, ecosystem activity, adoption, and performance

Chain profile page:

- parses `economy` from search params
- resolves one chain profile for the selected economy
- renders the score hierarchy in this order:
  - primary score
  - score composition
  - improvement path
  - competitive context
  - global context
- keeps module evidence, public scorecard, and liquid-staking diagnosis available through expandable secondary sections
- emits intent beacons for profile views and peer-comparison driven navigation

Internal target pages:

- use the same admin password guard as `/internal/admin`
- `/internal/targets` renders the internal GTM priority table
- `/internal/account/[chain]` renders the account-intelligence view and deterministic outreach brief

Layout:

- reads the canonical version from [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json) through [`lib/config/version.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/version.ts)
- surfaces the current version badge in the upper-right shell across public pages

## Why this structure

- It keeps the public product surface narrow: one page for public rankings, one route for chain detail, and one focused compatibility route for the global leaderboard.
- It preserves the multi-economy model without duplicating routes for each wedge.
- It keeps chain selection reproducible without pretending the product is live.
- It keeps data population inside explicit seed files instead of hidden services.
- It keeps scoring, global ranking, and GTM intelligence reusable without duplicating page logic.
