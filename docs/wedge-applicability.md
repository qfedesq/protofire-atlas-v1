# Wedge Applicability

Atlas now evaluates each chain against each economy wedge twice:

- applicability: can this wedge realistically be deployed on the chain at all?
- readiness: how mature is the chain today for that wedge?

Applicability is a deterministic technical-fit layer that runs before readiness is interpreted.

## Statuses

- `applicable`: the chain clears the current technical prerequisites for the wedge
- `partially_applicable`: the wedge is feasible, but technical constraints still limit full applicability
- `not_applicable`: the chain currently lacks key prerequisites for the wedge
- `unknown`: Atlas does not have enough confidence to make a definitive call

## What applicability considers

The baseline engine checks:

- smart contract execution
- token standard compatibility
- payment rail support
- oracle support
- indexing support
- settlement primitives
- liquidity rails
- native validator staking support

Each wedge maps those capabilities differently. The active assumptions define:

- capability weights per wedge
- prerequisite levels per wedge
- score thresholds for `applicable` and `partially_applicable`
- confidence rules for when Atlas must fall back to `unknown`

## Data model

Primary type:

- [`WedgeApplicability`](/Users/qfedesq/Desktop/Atlas/lib/domain/types.ts)

Stored fields include:

- `chain_id`
- `wedge_id`
- `applicability_status`
- `applicability_score`
- `rationale`
- `technical_constraints`
- `required_prerequisites`
- `assessed_at`
- `source_basis`
- `confidence_level`
- `manual_review_recommended`

## How it is computed

Engine:

- [`lib/applicability/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/applicability/engine.ts)

Inputs:

- technical capability profiles from [`data/seed/chain-technical-profiles.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-technical-profiles.ts) or admin overrides
- active applicability assumptions from [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

The engine:

1. loads the chain technical profile
2. applies wedge-specific capability weights
3. checks required prerequisites
4. applies confidence rules
5. emits the deterministic applicability status

## Internal surfaces

Atlas exposes applicability only on internal surfaces:

- chain page internal analysis section
- `/internal/applicability`
- internal GPT-assisted analysis snapshots

Applicability is not mixed silently into public readiness scores.

## Admin control

The following applicability rules are editable from:

- `/internal/admin/data-sources`

Admin section:

- `Wedge applicability`

Editable groups:

- signal scores
- capability weights by wedge
- prerequisite requirements by wedge
- applicability thresholds
- confidence thresholds

## What not to change casually

Do not use applicability to mean:

- “the chain has not launched this product yet”
- “the ecosystem is immature”
- “Protofire has not sold the stack yet”

Applicability should only answer:

- is the wedge technically feasible on this chain?
- if not fully, what hard prerequisites are still missing?
