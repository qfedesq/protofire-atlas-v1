# Global Ranking

## Purpose

`/rankings/global` is the holistic public leaderboard in Atlas.

It is separate from the per-economy rankings on `/`.

Use it to answer:

- which chains look strongest overall
- which chains pair readiness with real ecosystem traction
- how one chain compares when the model extends beyond a single economy wedge

## Inputs

Global ranking combines four signal groups:

1. Economy composite score
   - AI Agent Economy readiness
   - DeFi Infrastructure readiness
   - RWA Infrastructure readiness
   - Prediction Market readiness
2. Ecosystem activity
   - protocols
   - ecosystem projects
3. Adoption
   - wallets
   - active users
4. Technical performance
   - average transaction speed
   - block time
   - throughput indicator

The raw ecosystem, adoption, and performance inputs are stored in:

- [`data/seed/chain-ecosystem-metrics.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-ecosystem-metrics.ts)

## Model

Atlas computes:

`GlobalChainScore = economyScoreWeight * EconomyCompositeScore + ecosystemWeight * EcosystemScore + adoptionWeight * AdoptionScore + performanceWeight * PerformanceScore`

All component scores are normalized to the same `0-10` scale.

Normalization rules:

- higher is better for wallets, active users, protocols, ecosystem projects, and throughput
- lower is better for average transaction speed and block time
- min-max normalization is applied across the fixed 30-chain benchmark set

## Default weights

Global ranking component weights:

- economy score: `50`
- ecosystem: `20`
- adoption: `20`
- performance: `10`

Economy composite weights:

- AI Agents: `25`
- DeFi Infrastructure: `25`
- RWA Infrastructure: `25`
- Prediction Markets: `25`

## Editable assumptions

Management can edit these values at:

- `/internal/admin`

Stored in:

- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

## Implementation

- engine: [`lib/global-ranking/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/global-ranking/engine.ts)
- repository integration: [`lib/repositories/seed-chains-repository.ts`](/Users/qfedesq/Desktop/Atlas/lib/repositories/seed-chains-repository.ts)
- public page: [`app/rankings/global/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/rankings/global/page.tsx)
