# Architecture

Protofire Atlas is a seed-first Next.js App Router application with explicit boundaries between source snapshots, editable readiness data, scoring, recommendations, reports, and UI rendering.

## Directory map

- `app/`
  - route entrypoints only
  - `/` and `/chains/[slug]`
- `components/`
  - presentational UI and page composition
  - no scoring or recommendation rules
- `data/source/`
  - documented DeFiLlama source snapshot and curated EVM chain mapping
- `data/seed/`
  - editable chain metadata and economy readiness seeds
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
- `lib/recommendations/`
  - deterministic recommendation rules and deployment sequencing
- `lib/requests/`
  - request validation and storage
- `lib/intent/`
  - lightweight intent event logging
- `lib/reports/`
  - deterministic markdown and JSON report generation
- `lib/repositories/`
  - seed-backed read model used by the UI and reports
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
4. [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts) derives the AI-agent seed set from the snapshot plus AI readiness statuses.
5. [`data/seed/economies/index.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/economies/index.ts) assembles per-economy readiness records for AI, DeFi, RWA, and Prediction Markets.
6. [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json) stores the live module weights, status mappings, and recommendation thresholds used by the public app.
7. [`validateAtlasSeedDataset`](/Users/qfedesq/Desktop/Atlas/lib/domain/schemas.ts) validates:
   - unique chains
   - sequential source ranks
   - unique economy definitions
   - complete chain-by-economy coverage
   - module completeness per economy
   - weight totals per economy
8. [`SeedChainsRepository`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts) combines seed data with the active assumption layer and exposes ranked rows plus chain profiles.

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

## Comparison flow

1. [`lib/comparison/peer-comparison.ts`](/Users/qfedesq/Desktop/Atlas/lib/comparison/peer-comparison.ts) computes:
   - nearby peers in benchmark rank order
   - decisive module deltas versus those peers
   - score-driver upside for the selected chain
2. [`SeedChainsRepository`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts) attaches those derived outputs to the chain profile read model.
3. [`components/chain/peer-comparison.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/peer-comparison.tsx) and [`components/chain/score-drivers.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/score-drivers.tsx) render the public comparative pressure on the chain page.

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

## Report flow

1. [`lib/reports/report-generator.ts`](/Users/qfedesq/Desktop/Atlas/lib/reports/report-generator.ts) reads the repository outputs.
2. It generates markdown reports for:
   - AI Agent Economy
   - DeFi Infrastructure
   - Liquid staking landscape
   - target chains by economy
   - high-TVL lagging chains
3. It also generates JSON and CSV ranking exports per economy.
4. [`scripts/generate-reports.ts`](/Users/qfedesq/Desktop/Atlas/scripts/generate-reports.ts) writes those outputs into [`reports`](/Users/qfedesq/Desktop/Atlas/reports).

## Rendering flow

Home page:

- parses ranking search params at `/`
- resolves the selected economy
- renders the economy switcher, module overview, deployment sequencing, and full leaderboard in one page
- drives leaderboard sorting directly from table header links instead of a separate filter panel
- emits a lightweight intent beacon for the active economy selection

Chain profile page:

- parses `economy` from search params
- resolves one chain profile for the selected economy
- renders source rank and TVL snapshot metadata alongside readiness, gaps, peers, score drivers, stack recommendations, assessment CTA, and the phased plan
- emits intent beacons for profile views and peer-comparison driven navigation

Layout:

- reads the canonical version from [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json) through [`lib/config/version.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/version.ts)
- surfaces the current version badge in the upper-right shell across public pages

## Why this structure

- It keeps the public product surface narrow: one page for comparison, one route for chain detail.
- It preserves the multi-economy model without duplicating routes for each wedge.
- It keeps chain selection reproducible without pretending the product is live.
- It keeps data population inside explicit seed files instead of hidden services.
- It keeps scoring and recommendations reusable across wedges without duplicating page logic.
