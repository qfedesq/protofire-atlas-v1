# Data Source Registry

Atlas now exposes an internal provenance registry at:

- `/internal/admin/data-sources`

Purpose:

- make every blockchain-related metric traceable
- separate external metrics from internal model assumptions
- show refresh behavior and timestamps clearly
- show whether the current Atlas value is source-backed, derived, or manually maintained
- expose the editable non-automatic datasets and scoring math from the same admin surface

## What the registry includes

- benchmark selection source
- external ecosystem and adoption metrics
- technical performance metrics
- readiness model inputs
- admin-managed scoring assumptions
- roadmap coverage
- liquid-staking snapshot fields
- current provenance for each metric
- admin edit path for each metric

## What can be edited there

From the same page, Atlas management can now edit:

- status score mappings
- economy module weights
- recommendation thresholds
- global ranking weights
- opportunity score weights
- manual readiness records
- roadmap stage dataset
- fallback ecosystem metrics
- liquid staking market snapshots

These edits are intentionally narrow and deterministic. Atlas still does not expose a general admin CMS.

## Runtime behavior

The page uses runtime-managed Atlas document stores for:

- active assumptions
- external metrics snapshot
- manual dataset overrides

Local development defaults to files inside the repository. Vercel persists these mutable Atlas documents into Postgres when `DATABASE_URL` is available, while still mirroring the current runtime copy to the managed file path for fallback caching.

## Source types

Every row is classified as one of:

- `external API`
- `external query source`
- `internal Atlas-derived metric`
- `internal manual/admin-managed assumption`
- `seed/fallback dataset`

## How to update it

When Atlas starts using a new blockchain-related metric:

1. add or update the real source, seed, or connector
2. add a provenance row in [`lib/admin/data-source-registry.ts`](/Users/qfedesq/Desktop/Atlas/lib/admin/data-source-registry.ts)
3. make the refresh behavior explicit
4. surface the last-updated timestamp if available
5. add or update tests

Do not add a metric to rankings or chain pages without adding provenance here.
