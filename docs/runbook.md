# Runbook

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Default local URL: `http://localhost:3000`

## Access internal admin

Production-style access:

```bash
ATLAS_ADMIN_PASSWORD=your-password npm run dev
```

Local development fallback:

- if `ATLAS_ADMIN_PASSWORD` is not set and `NODE_ENV` is not production, `/internal/admin` accepts `atlas-admin`

## Refresh the top 30 EVM dataset

```bash
npm run data:refresh-top30
```

This command:

- fetches DeFiLlama `/chains`
- filters the result through the curated EVM map
- rewrites the top-30 snapshot used by Atlas

After refresh:

1. review [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json)
2. update [`data/seed/chain-metadata.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-metadata.ts) if a new chain entered the benchmark
3. update any affected readiness seeds

## Validate seed data

```bash
npm run validate:data
```

Use this after any edit to:

- [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json)
- [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts)
- [`data/seed/chain-metadata.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-metadata.ts)
- [`data/seed/chain-ecosystem-metrics.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-ecosystem-metrics.ts)
- any file under [`data/seed/economies`](/Users/qfedesq/Desktop/Atlas/data/seed/economies)
- [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts)

## Generate reports

```bash
npm run reports:generate
```

Outputs:

- [`reports/ai-agent-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/ai-agent-readiness-report.md)
- [`reports/defi-infrastructure-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/defi-infrastructure-readiness-report.md)
- [`reports/liquid-staking-landscape-report.md`](/Users/qfedesq/Desktop/Atlas/reports/liquid-staking-landscape-report.md)
- [`reports/top-ecosystem-opportunities.md`](/Users/qfedesq/Desktop/Atlas/reports/top-ecosystem-opportunities.md)
- JSON exports under [`reports/exports`](/Users/qfedesq/Desktop/Atlas/reports/exports)
- [`exports/global-chain-ranking.csv`](/Users/qfedesq/Desktop/Atlas/exports/global-chain-ranking.csv)
- [`exports/top-target-accounts.csv`](/Users/qfedesq/Desktop/Atlas/exports/top-target-accounts.csv)

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

## Recommended release workflow

```bash
npm run data:refresh-top30
npm run validate:data
npm run reports:generate
npm run version:bump
npm run check
npm run build
```

## Manual verification before shipping

1. Open `/` and confirm the home page states the DeFiLlama top-30 EVM snapshot basis.
2. Switch across AI Agents, DeFi, RWA, and Prediction Markets on the home page.
3. Confirm the selected economy updates:
   - economy description
   - required modules
   - deployment sequencing
   - active sort arrows in the leaderboard headers
   - column menu state and reset-to-default behavior
   - leaderboard rows
4. Sort the leaderboard from the `Chain`, `Readiness`, and module headers and confirm URL params update cleanly.
5. Open the leaderboard column menu and confirm:
   - sticky chain column stays visible
   - hidden columns disappear from the table
   - `Reset to default` restores the standard view
6. Open one chain profile from the home leaderboard.
7. Confirm each chain profile updates in this order:
   - primary score
   - score composition
   - improvement path
   - competitive context
   - global position
   - request assessment CTA
8. Submit a test request from a chain profile and confirm:
   - the success state appears
   - a new record is written to `data/runtime/assessment-requests.json`
   - a new event is written to `data/runtime/intent-events.json`
9. Open `/internal/admin`.
10. Confirm admin access works:
   - with `ATLAS_ADMIN_PASSWORD` in production-like environments
   - with the documented local fallback password in development
11. Change one economy weight set in admin, save it, and confirm rankings or recommendation behavior change on a hard refresh.
12. Open `/rankings/global` and confirm:
   - the leaderboard renders
   - sorting works for `Global Score`, `Ecosystem`, and `Adoption`
   - default columns stay minimal
   - optional columns can be toggled on
   - chain links land on the public chain profile
13. Open `/internal/targets` and confirm:
   - sorting works for `Opportunity Score`, `Readiness gap`, and `Ecosystem size`
   - default columns stay minimal
   - optional columns can be toggled on
   - chain links open `/internal/account/[chain]`
14. On one internal account page confirm:
   - global rank
   - opportunity score
   - gap analysis
   - recommended stack
   - outreach brief
15. Verify the current public version badge in the upper-right shell matches [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json).
16. Regenerate reports and confirm the markdown and export files update cleanly.
17. Confirm wording does not imply live or continuously synced data.
