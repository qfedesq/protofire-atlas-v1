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

Inside `/internal/admin/data-sources`, `SYNC NOW` only refreshes the source-backed external metrics snapshot. It does not shell out to the full CLI workflow.

Persistence behavior:

- local development uses file-backed mutable stores by default
- Vercel persists mutable admin/runtime Atlas documents into Postgres through `DATABASE_URL`
- the current runtime file path still acts as the fallback cache location

## Auth0 configuration

Set:

```bash
AUTH0_DOMAIN=...
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_SECRET=...
APP_BASE_URL=http://localhost:3000
```

With Auth0 configured, internal users can authenticate through `/auth/login`.

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
9. Open `/internal/admin/data-sources` and confirm the provenance registry renders:
    - benchmark source rows
    - external metric rows
    - readiness and assumption rows
    - roadmap and liquid-staking rows
10. Trigger `SYNC NOW` and confirm the action completes in a writable environment.
11. Confirm the same page now exposes:
    - current provenance per metric
    - admin edit path per metric
    - manual dataset editors
    - full assumptions editor
12. Save one manual dataset override and confirm the relevant public page changes.
13. Open `/api/public/rankings/global` and one `/api/public/chains/[slug]` route and confirm:
    - `atlas_version`
    - `updated_at`
    - `source_note`
14. Open `/data`, `/data/rankings`, `/data/research`, and `/data/gaps`.
15. Open one embed and one badge route:
    - `/embed/rankings/global`
    - `/badge/chains/ethereum/global`
16. Open `/internal/targets` and `/internal/account/[chain]` and confirm internal-only GTM surfaces still work.
17. Verify the public version label matches [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json).
18. Confirm no public wording implies always-live synchronization.
19. On one chain page, confirm these sections can expand/collapse cleanly:
    - score composition
    - module evidence
    - diagnosis and blockers
    - activation plan
    - competitive context
    - global context
20. Open `/internal/applicability` and confirm:
    - per-wedge counts render
    - per-chain applicability matrix renders
    - review queues populate
21. From an authenticated internal chain page, confirm the internal appendix exposes:
    - stored buyer personas
    - proposal generation actions
    - latest AI strategic analysis
22. Trigger `Run GPT-5.4 Strategic Analysis` and confirm:
    - a new analysis record is stored
    - `/internal/analysis/[id]` renders
    - execution mode is explicit (`live` or `mock`)
    - deterministic applicability and AI-assisted findings are clearly separated
23. Create one buyer persona and confirm:
    - the markdown file is stored under the runtime personas directory
    - the persona record becomes available from the internal chain appendix
24. Generate proposals for that persona and confirm:
    - proposal documents persist
    - the internal chain appendix lists the generated proposals
