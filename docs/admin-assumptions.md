# Admin Assumptions

## Scope

Atlas exposes a deliberately narrow internal admin area at `/internal/admin`.

Editable:

- per-economy module weights
- global status score mapping
- per-economy recommendation threshold
- partial/missing recommendation toggles
- global ranking component weights
- economy composite weights inside the global ranking
- opportunity-score weights for Target Account Mode

Not editable:

- supported economies
- module catalog
- recommendation copy
- seeded readiness statuses
- source chain snapshot

## Where values are stored

Active assumptions are stored in:

- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

Runtime load path:

- [`lib/assumptions/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/store.ts)
- [`lib/assumptions/resolve.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/resolve.ts)

## Weights

Each economy stores weights per configured module.

Rules:

- each weight must be non-negative
- the module set must match the economy module catalog exactly
- total weight must remain `100`

Changing weights changes the public ranking immediately on subsequent requests.

## Global ranking weights

Atlas exposes two additional weight groups for the public holistic leaderboard.

Component weights:

- `economyScore`
- `ecosystem`
- `adoption`
- `performance`

Economy composite weights:

- `ai-agents`
- `defi-infrastructure`
- `rwa-infrastructure`
- `prediction-markets`

Rules:

- each weight must be non-negative
- each weight set must sum to `100`

These values drive `/rankings/global` and the `Global position` section inside chain profiles.

## Opportunity score weights

Target Account Mode exposes one internal-only weight group:

- `tvlTier`
- `readinessGap`
- `stackFit`
- `ecosystemSignal`

Rules:

- each weight must be non-negative
- total weight must remain `100`

These values drive `/internal/targets` and `/internal/account/[chain]`.

## Status mappings

Atlas maps statuses to numeric score factors.

Default:

- `missing = 0`
- `partial = 0.5`
- `available = 1`

Rules:

- values must remain between `0` and `1`
- ordering must remain `missing <= partial <= available`

These values affect every supported economy.

## Recommendation thresholds

Each economy has a small recommendation config:

- `thresholdScore`
- `includePartialRecommendations`
- `includeMissingRecommendations`

Interpretation:

- if a module’s status score is at or below `thresholdScore`, it is eligible for recommendation
- partial recommendations only appear when `includePartialRecommendations` is enabled
- missing recommendations only appear when `includeMissingRecommendations` is enabled

## What management should not change casually

- source benchmark selection
- module names or slugs
- recommendation copy
- status rationale or evidence notes
- base economy definitions in code

Use the admin route for live operating assumptions only. Use code changes when the model itself needs to evolve.
