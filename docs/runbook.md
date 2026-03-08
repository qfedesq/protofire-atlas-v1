# Runbook

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Default URL: `http://localhost:3000`

## Admin access

Production-style:

```bash
ATLAS_ADMIN_PASSWORD=your-password npm run dev
```

Local fallback:

- `/internal/admin` accepts `atlas-admin` when `ATLAS_ADMIN_PASSWORD` is not set and the app is not running as production

## Refresh the benchmark

```bash
npm run data:refresh-top30
```

## Refresh external source-backed metrics

```bash
npm run data:sync-external
```

## Run the supported Atlas sync workflow

```bash
npm run data:sync
```

This currently:

- refreshes the top-30 benchmark snapshot
- refreshes the external metrics snapshot
- regenerates reports and exports

The same workflow is available from `/internal/admin` through `SYNC NOW`.

## Validate seed data

```bash
npm run validate:data
```

## Generate reports and exports

```bash
npm run reports:generate
```

This updates:

- internal markdown reports under [`reports`](/Users/qfedesq/Desktop/Atlas/reports)
- GTM exports under [`exports`](/Users/qfedesq/Desktop/Atlas/exports)
- public dataset exports under [`exports/public-data`](/Users/qfedesq/Desktop/Atlas/exports/public-data)

## Typecheck

```bash
npm run typecheck
```

## Lint

```bash
npm run lint
```

## Test

```bash
npm run test
```

## Production build

```bash
npm run build
```

## Full repo health check

```bash
npm run check
```

## Suggested release workflow

```bash
npm run data:sync
npm run reports:generate
npm run version:bump
npm run check
npm run build
```

## Manual verification

1. Open `/` and confirm the one-page global ranking loads.
2. Sort the global ranking and confirm the URL updates cleanly.
3. Expand and collapse the global score tree from the header and confirm child columns appear immediately and push sibling columns right.
4. Open one chain profile from the ranking.
5. Confirm the public chain page reads in this order:
   - chain header
   - primary readiness score
   - score composition
   - improvement path
   - competitive context
   - global context
   - CTA
6. Confirm the chain page is flat and analytical rather than card-heavy.
7. Submit a test infrastructure request and confirm:
   - success state appears
   - `data/runtime/assessment-requests.json` updates
   - `data/runtime/intent-events.json` updates
8. Open `/internal/admin` and confirm authentication works.
9. Trigger `SYNC NOW` and confirm the action completes in a writable environment.
10. Open `/api/public/rankings/global` and one `/api/public/chains/[slug]` route and confirm:
   - `atlas_version`
   - `updated_at`
   - `source_note`
11. Open `/data`, `/data/rankings`, `/data/research`, and `/data/gaps`.
12. Open one embed and one badge route:
   - `/embed/rankings/global`
   - `/badge/chains/ethereum/global`
13. Open `/internal/targets` and `/internal/account/[chain]` and confirm internal-only GTM surfaces still work.
14. Verify the public version label matches [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json).
15. Confirm no public wording implies always-live synchronization.
