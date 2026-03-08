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
  - Source basis: DeFiLlama chain and market data surfaces
  - Reference: `https://api-docs.defillama.com/`
- `percentStaked`
  - Source basis: Staking Rewards API coverage where available
  - Reference: `https://api-docs.stakingrewards.com/`
- `stakingApyPercent`
  - Source basis: Staking Rewards API coverage where available
  - Reference: `https://api-docs.stakingrewards.com/`
- `stakersCount`
  - Source basis: chain-specific validator/staking explorers
  - Ethereum reference: `https://docs.beaconcha.in/`
- `lstProtocolCount`
  - Source basis: DeFiLlama liquid staking protocol category snapshot
  - Reference: `https://defillama.com/protocols/Liquid%20Staking`
- `lstToStakedPercent`
  - Atlas derived metric once LST market value and staked market value are both captured
- `defiTvlUsd`
  - Already seeded from the Top 30 EVM chain snapshot
- `globalLstHealthScore`
  - Atlas derived metric from the current 7-module liquid staking diagnosis

## Storage

- per-chain snapshot seeds:
  - `data/seed/liquid-staking-market-snapshots.ts`
- builder:
  - `lib/liquid-staking/market-snapshot.ts`
- UI rendering:
  - `components/chain/liquid-staking-diagnosis.tsx`

## Intentional limitation

Atlas does not claim that these fields are live.
This layer is a prepared snapshot structure with explicit source references.
Only captured fields are rendered as values today; the rest remain marked as `Pending source`.
