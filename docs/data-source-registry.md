# Data Source Registry

Atlas now exposes an internal provenance registry at:

- `/internal/admin/data-sources`

Purpose:

- make every blockchain-related metric traceable
- separate external metrics from internal model assumptions
- show refresh behavior and timestamps clearly

## What the registry includes

- benchmark selection source
- external ecosystem and adoption metrics
- technical performance metrics
- readiness model inputs
- admin-managed scoring assumptions
- roadmap coverage
- liquid-staking snapshot fields

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
