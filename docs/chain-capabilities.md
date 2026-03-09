# Chain Capabilities

Atlas now uses `ChainCapabilityProfile` as the deterministic technical baseline for wedge applicability.

Primary seed file:

- [`data/seed/chain-capability-profiles.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-capability-profiles.ts)

## What it captures

Each chain profile includes:

- EVM compatibility
- smart contract support
- token-standard support
- oracle support
- indexing infrastructure
- event-driven architecture
- cross-chain support
- validator and staking model
- liquid staking feasibility
- lending and liquidity feasibility
- payment rail support
- gas model
- execution environment
- ecosystem maturity
- notes, source references, and last-updated timestamp

## Why it exists

Readiness alone answers how mature a wedge is on a chain.

Capability profiles answer whether the wedge is technically feasible in the first place.

Atlas uses this layer to power:

- deterministic wedge applicability
- internal chain analysis context
- buyer/proposal matching context

## Editing workflow

Preferred runtime path:

- `/internal/admin/data-sources`

Committed default:

- [`data/seed/chain-capability-profiles.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-capability-profiles.ts)

Rules:

- every capability should have a source reference
- use `unknown` sparingly; prefer an explicit capability level when Atlas has evidence
- do not encode readiness or ecosystem maturity into hard technical capability fields
