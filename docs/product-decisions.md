# Product Decisions

## Current product shape

Protofire Atlas remains a readiness intelligence product for blockchain chains, L1s, and L2s.

The app still does four things:

- rank chains
- expose infrastructure gaps
- map those gaps to Protofire stacks
- show phased deployment plans

The current phase is a data-and-intelligence pass, not a product expansion.

## Why the benchmark is now top 30 EVM chains by TVL

Atlas needed a reproducible chain universe for GTM-facing outputs.

The repo now uses:

- `DeFiLlama` as the chain-selection source of truth
- `TVL` as the inclusion metric
- `EVM only` as the dataset boundary
- `top 30` as the fixed benchmark size

This gives Atlas a clear selection rule that future developers can refresh without guessing.

## Why the app still uses seeded readiness data

The chain universe is snapshot-based, but readiness still uses curated seeded statuses.

That tradeoff is intentional:

- it avoids fake live claims
- it keeps scoring deterministic
- it keeps recommendation outputs inspectable
- it keeps GTM materials reproducible

## What is in scope

- economy-specific rankings
- economy-specific chain profiles
- deterministic scoring per economy
- deterministic recommendation rules per economy
- fixed top-30 EVM benchmark selection
- generated markdown and JSON outputs for internal GTM use

## What is intentionally out of scope

- auth
- wallets
- billing
- live analytics
- live sync claims
- runtime AI
- marketplace features
- provider directories
- other customer segments
- generalized analytics dashboards

## Tradeoffs

- Curated snapshot over brittle live ingestion
  - more reproducible
  - easier to hand off
- Curated readiness statuses over opaque automation
  - clearer assumptions
  - easier to calibrate and defend
- Shared multi-economy engine over economy-specific code paths
  - less duplication
  - easier to maintain
- Generated internal reports over ad hoc spreadsheet work
  - GTM outputs stay tied to the same scoring and recommendation logic the app uses
