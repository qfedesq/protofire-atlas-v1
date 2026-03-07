# Economy Types

Protofire Atlas currently supports four economy wedges for the same core audience: blockchain chains, L1s, and L2s.

All wedges run against the same documented benchmark universe: the top 30 EVM chains by TVL from a DeFiLlama snapshot.

## AI Agent Economy

Focus:

- agent identity
- settlement
- observability
- trust

Modules:

- Registry
- Payments
- Indexing
- Security

## DeFi Infrastructure Economy

Focus:

- lending markets
- liquidity formation
- price and reference data
- composability
- liquid staking

Modules:

- Lending Infrastructure
- Liquidity Layer
- Oracle Infrastructure
- Indexing Layer
- Liquid Staking Infrastructure

Liquid staking is a first-class primitive in Atlas, not an accessory module.

Why it matters:

- keeps staked assets productive inside DeFi
- improves capital efficiency
- improves TVL retention
- creates a clearer Protofire proposal wedge for staking derivatives and integration rails

## RWA Infrastructure Economy

Focus:

- issuance
- compliance
- verification
- settlement

Modules:

- Asset Registry
- Compliance Layer
- Oracle Feeds
- Settlement Infrastructure

## Prediction Market Economy

Focus:

- market creation
- outcome resolution
- liquidity
- indexing

Modules:

- Oracle Layer
- Market Contracts
- Indexing Infrastructure
- Liquidity Integration

## Extension rule

If Protofire adds another economy later, start in:

- [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts)
- [`lib/recommendations/rules.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/rules.ts)
- [`data/seed/economies`](/Users/qfedesq/Desktop/Atlas/data/seed/economies)

Do not fork the page architecture first. The existing rankings and chain-profile routes are already economy-aware.
