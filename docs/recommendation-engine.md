# Recommendation Engine

Protofire Atlas uses a deterministic recommendation engine. There is no runtime AI and no hidden proposal logic.

## Inputs

The engine reads the scored module breakdown for one chain and one selected economy.

Only modules that fall at or below the active recommendation threshold generate recommendations.

## Rule source

The mapping lives in [`lib/recommendations/rules.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/rules.ts).

Each rule defines:

- title for missing state
- title for partial state
- why it matters
- expected result
- direct chain impact
- narrative summary
- deployment phase key
- gap impact text

## Engine flow

[`lib/recommendations/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/engine.ts):

1. builds gap analysis items from missing and partial modules
2. filters module states through the active recommendation threshold and the partial/missing toggles from the assumption layer
3. selects recommendation copy from the selected economy
4. sorts recommendations by deployment template order and module order
5. groups active recommendations into phased rollout steps
6. generates one narrative summary and one CTA string

## Deterministic mappings by wedge

AI Agent Economy:

- `registry` -> Agent Registry
- `payments` -> Payment Rails
- `indexing` -> Agent Indexing Layer
- `security` -> Security Monitoring and Trust Layer

DeFi Infrastructure Economy:

- `lending` -> Lending Infrastructure Stack
- `liquidity` -> Liquidity Infrastructure Stack
- `oracles` -> Oracle Layer
- `indexing` -> DeFi Indexing Layer
- `liquid-staking` -> Liquid Staking Stack

RWA Infrastructure Economy:

- `asset-registry` -> Asset Registry Stack
- `compliance` -> Compliance Infrastructure
- `oracles` -> Oracle Verification Layer
- `settlement` -> Settlement Layer

Prediction Market Economy:

- `oracles` -> Oracle Infrastructure
- `market-contracts` -> Prediction Market Stack
- `indexing` -> Prediction Market Indexing Layer
- `liquidity` -> Liquidity Rails

## Output shape

Each recommendation item exposes:

- what Protofire deploys
- why it matters
- expected result
- direct chain impact
- where it belongs in the deployment sequence

That output powers both the chain-profile UI and the generated internal reports.

## Assumption-controlled behavior

Live threshold values now come from:

- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

Per economy:

- `thresholdScore`
- `includePartialRecommendations`
- `includeMissingRecommendations`

## Deployment sequencing

Each economy declares its own deployment templates in [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts).

Only active phases are rendered. When present, they are renumbered sequentially as `Phase 1`, `Phase 2`, and so on, with two-week timeline labels.

## Change rule

If recommendation behavior changes later, update the rule table or engine only. Do not embed module-specific recommendation logic in page components.
