# Data Connectors

Atlas now has a real connector layer for source-backed metrics, but it still preserves the snapshot-first safety model.

## Purpose

Connectors give Atlas fresher chain context without making page rendering depend on live third-party calls.

Atlas uses them for:

- TVL
- protocol breadth
- market-cap inputs when configured
- ecosystem activity
- adoption and throughput proxies

## Connector modules

- [`lib/connectors/defillama.ts`](/Users/qfedesq/Desktop/Atlas/lib/connectors/defillama.ts)
- [`lib/connectors/coingecko.ts`](/Users/qfedesq/Desktop/Atlas/lib/connectors/coingecko.ts)
- [`lib/connectors/l2beat.ts`](/Users/qfedesq/Desktop/Atlas/lib/connectors/l2beat.ts)
- [`lib/connectors/tokenterminal.ts`](/Users/qfedesq/Desktop/Atlas/lib/connectors/tokenterminal.ts)

Shared connector types live in:

- [`lib/connectors/types.ts`](/Users/qfedesq/Desktop/Atlas/lib/connectors/types.ts)

## Sync layer

The connector wrappers feed the higher-level sync services:

- [`lib/data-sync/syncChains.ts`](/Users/qfedesq/Desktop/Atlas/lib/data-sync/syncChains.ts)
- [`lib/data-sync/syncTVL.ts`](/Users/qfedesq/Desktop/Atlas/lib/data-sync/syncTVL.ts)
- [`lib/data-sync/syncProtocols.ts`](/Users/qfedesq/Desktop/Atlas/lib/data-sync/syncProtocols.ts)
- [`lib/data-sync/syncTokenMetrics.ts`](/Users/qfedesq/Desktop/Atlas/lib/data-sync/syncTokenMetrics.ts)
- [`lib/data-sync/syncDeveloperSignals.ts`](/Users/qfedesq/Desktop/Atlas/lib/data-sync/syncDeveloperSignals.ts)
- [`lib/data-sync/syncAll.ts`](/Users/qfedesq/Desktop/Atlas/lib/data-sync/syncAll.ts)

`syncAllDataSources()` is what internal admin `SYNC NOW` uses.

## Fallback strategy

Atlas never blocks rendering on a failed source.

Order of precedence:

1. latest valid external snapshot
2. previous persisted runtime snapshot
3. curated fallback seed snapshot

Rules:

- do not fabricate missing source rows
- preserve `fetched_at`, `source_name`, and normalization notes
- if a connector is not configured, return `skipped` instead of failing the app

## Configuration

Examples of environment-dependent connectors:

- `COINGECKO_CHAIN_TOKEN_MAP`
- `L2BEAT_CHAIN_METRICS_URL`
- `DUNE_API_KEY`
- `DUNE_CHAIN_METRICS_QUERY_ID`
- Token Terminal credentials if used

If these are missing, Atlas falls back to snapshot behavior and records that state in the source registry.
