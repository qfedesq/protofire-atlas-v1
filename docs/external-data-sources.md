# External Data Sources

Atlas now supports source-backed external metrics with provenance, timestamps, and fallback behavior.

## Supported connectors

- DeFiLlama
  - TVL
  - protocol distribution/counts
- growthepie
  - public, no-auth connector
  - daily active address proxy
  - transaction count
  - gas-per-second throughput proxy for supported L2s
- Dune
  - optional, env-driven connector
  - requires both `DUNE_API_KEY` and `DUNE_CHAIN_METRICS_QUERY_ID`
- Artemis
  - optional, env-driven connector
- Token Terminal
  - optional, env-driven connector

## Practical access status

- DeFiLlama
  - public and currently usable without credentials
- growthepie
  - public export endpoints currently usable without credentials
- Dune
  - API key support is implemented, but Atlas still needs a query id configured to read chain metrics
- Artemis
  - connector remains optional and env-driven; Atlas does not assume free access
- Token Terminal
  - connector remains optional and env-driven; Atlas does not assume free access

## Architecture

The external data layer is split into:

- source connectors
- normalization
- validation
- persistence
- fallback

Files:

- connectors: [`lib/external-data/connectors`](/Users/qfedesq/Desktop/Atlas/lib/external-data/connectors)
- normalization helpers: [`lib/external-data/utils.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/utils.ts)
- fallback baseline: [`lib/external-data/baseline.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/baseline.ts)
- service/store: [`lib/external-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/service.ts), [`lib/external-data/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/store.ts)
- snapshot: [`data/source/external-chain-metrics.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/external-chain-metrics.snapshot.json)

## Provenance model

Each source-backed metric stores:

- `sourceName`
- `sourceEndpoint`
- `fetchedAt`
- `normalizationNote`
- `freshness`

## Refresh strategy

Refresh external metrics only:

```bash
npm run data:sync-external
```

Run the full supported workflow:

```bash
npm run data:sync
```

## Fallback rules

- if a connector succeeds, Atlas writes source-backed values
- if a connector fails, Atlas keeps the last valid snapshot
- if there is no valid snapshot, Atlas uses the deterministic Atlas fallback baseline
- Atlas never fabricates values to hide a source failure

## Redundancy strategy

Atlas now prefers this practical redundancy pattern:

- TVL and protocol breadth
  - primary: DeFiLlama
- Active users
  - primary public fallback: growthepie
  - optional source-backed overlays: Artemis, Dune
- Transactions
  - primary public fallback: growthepie
  - optional source-backed overlays: Artemis, Dune, Token Terminal
- Throughput proxy
  - primary public fallback: growthepie gas-per-second export
  - optional source-backed overlays: Artemis, Dune

This keeps the benchmark usable even when paid connectors are unavailable.
