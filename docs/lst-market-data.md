# LST Market Data Snapshot

Snapshot date: `2026-03-07`

Atlas now keeps a dedicated LST market snapshot layer for every seeded chain.
This layer is intentionally narrow:

- it prepares the exact fields needed for liquid staking market coverage
- it keeps captured values explicit
- it leaves unavailable values as pending rather than inventing them

## Fields

- `nativeTokenSymbol`
- `marketCapUsd`
- `percentStaked`
- `stakingApyPercent`
- `stakersCount`
- `globalLstHealthScore`
- `lstProtocolCount`
- `lstToStakedPercent`
- `defiTvlUsd`

## Current source plan

- `marketCapUsd`
  - Source basis: CoinGecko coin market snapshots for the native asset
  - Example references:
    - `https://api.coingecko.com/api/v3/coins/ethereum`
    - `https://api.coingecko.com/api/v3/coins/binancecoin`
    - `https://api.coingecko.com/api/v3/coins/avalanche-2`
    - `https://api.coingecko.com/api/v3/coins/polygon-ecosystem-token`
- `percentStaked`
  - Source basis: Staking Rewards public asset snapshots when coverage is available
  - Example references:
    - `https://r.jina.ai/http://stakingrewards.com/asset/ethereum-2-0`
    - `https://r.jina.ai/http://stakingrewards.com/asset/avalanche`
    - `https://r.jina.ai/http://stakingrewards.com/asset/matic-network`
- `stakingApyPercent`
  - Source basis: Staking Rewards public asset snapshots when coverage is available
- `stakersCount`
  - Source basis: public validator participation counts when clean staker counts are unavailable
  - Current note: Atlas is using validator counts as the closest public participation proxy on the first captured networks
- `lstProtocolCount`
  - Source basis: DeFiLlama liquid staking protocol category snapshot
  - Reference: `https://api.llama.fi/protocols`
- `lstToStakedPercent`
  - Atlas derived metric from current liquid staking TVL divided by current staking market cap
- `defiTvlUsd`
  - Already seeded from the Top 30 EVM chain snapshot
- `globalLstHealthScore`
  - Atlas derived metric from the current 7-module liquid staking diagnosis

## Current captured coverage

Atlas now includes captured market-snapshot values for:

- Ethereum
- Base
- Arbitrum
- Optimism
- Scroll
- Linea
- Avalanche
- Polygon
- BNB Chain (partial coverage: market cap and `# of LSTs`)

## Storage

- per-chain snapshot seeds:
  - `data/seed/liquid-staking-market-snapshots.ts`
- builder:
  - `lib/liquid-staking/market-snapshot.ts`
- UI rendering:
  - `components/chain/liquid-staking-diagnosis.tsx`

## Intentional limitation

Atlas does not claim that these fields are live.
This layer is a dated snapshot structure with explicit source references.
Only captured fields are rendered as values today; the rest remain marked as `Pending source`.
