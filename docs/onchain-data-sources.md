# Onchain Data Sources

Atlas stays seed-first, but the source plan for future snapshots should stay explicit and reproducible.

## Chain universe and TVL benchmark

- chain selection source: [DeFiLlama chains API](https://api-docs.defillama.com/)
- current snapshot file: [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json)
- rule: top 30 EVM chains by TVL, curated snapshot only

## LST market snapshot fields

Use the most stable source available per metric and store the result as a dated snapshot.

- `DeFi TVL`
  - source: [DeFiLlama chains API](https://api-docs.defillama.com/)
  - status in Atlas: already captured from the benchmark snapshot
- `Global LST Health`
  - source: Atlas 7-module liquid staking diagnosis
  - status in Atlas: derived internally from the seeded diagnosis model
- `Market Cap`
  - preferred source: chain token market data surface from DeFiLlama when coverage is clean
  - fallback: curated external market snapshot documented at snapshot time
- `% Staked`
  - preferred source: [Staking Rewards API docs](https://api-docs.stakingrewards.com/)
- `Staking APY`
  - preferred source: [Staking Rewards API docs](https://api-docs.stakingrewards.com/)
- `# Stakers`
  - preferred source: chain-native staking explorer or validator API
  - Ethereum reference: [Beaconcha docs](https://docs.beaconcha.in/)
- `# of LSTs`
  - preferred source: [DeFiLlama liquid staking category](https://defillama.com/protocols/Liquid%20Staking)
- `LST / Staked %`
  - source: Atlas derived metric after `LST TVL` and `% staked` inputs are both captured

Editable seed file:

- [`data/seed/liquid-staking-market-snapshots.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/liquid-staking-market-snapshots.ts)

Current captured coverage:

- Ethereum
- Base
- Arbitrum
- Optimism
- Scroll
- Linea
- Avalanche
- Polygon
- BNB Chain
- Mantle (market-cap capture only)
- Berachain (market-cap + validator-set proxy)
- Sonic (market-cap + bootstrap APR)
- Rootstock (PoS staking metrics marked not applicable)

Network-specific primary references currently used for the LST snapshot:

- BNB Chain
  - [BNB Chain staking dashboard](https://www.bnbchain.org/en/staking)
  - [BNB Chain staking docs](https://docs.bnbchain.org/bnb-smart-chain/staking/overview/)
  - [BNB Chain liquid staking page](https://www.bnbchain.org/en/bnb-liquid-staking)
- Mantle
  - [CoinGecko Mantle market snapshot](https://api.coingecko.com/api/v3/coins/mantle)
  - Mantle official `mETH` surfaces for liquid staking context
- Berachain
  - [Berachain validator architecture docs](https://docs.berachain.com/validators/overview/node-architecture)
- Sonic
  - [Sonic staking tokenomics docs](https://docs.soniclabs.com/sonic/tokenomics/staking)
  - [Sonic validator deployment docs](https://docs.soniclabs.com/sonic/node-deployment/validator-node)
- Rootstock
  - [Rootstock official docs](https://rootstock.io)
  - Atlas marks PoS staking metrics as `not applicable` because Rootstock is secured by merge mining, not a validator-staking set

## Official roadmap sources

Atlas now keeps a separate roadmap seed for every chain:

- [`data/seed/chain-roadmaps.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-roadmaps.ts)

Rules:

- prefer official roadmap pages first
- if no roadmap page is publicly verifiable, fall back to an official updates or docs surface
- if no clean official roadmap signal exists, store `No public roadmap verified`
- do not imply live synchronization or automated crawling

Examples of verified official roadmap or update sources already used:

- [Ethereum roadmap](https://ethereum.org/en/roadmap/)
- [BNB Chain roadmap](https://www.bnbchain.org/en/roadmap)
- [Polygon roadmap](https://polygon.technology/roadmap)
- [Scroll roadmap](https://scroll.io/blog/scroll-2024-roadmap)
- [Hedera roadmap](https://hedera.com/roadmap)

## Roadmap analysis policy

Atlas does not run roadmap analysis at runtime.

The “roadmap fit” shown in the UI is a curated Atlas interpretation of:

- the official roadmap or official source status for that chain
- the selected economy
- the current seeded readiness score
- the highest-upside missing or partial module in the current Atlas model

This keeps the output transparent, deterministic, and versionable.
