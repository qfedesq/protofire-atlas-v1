# Opportunity Radar

Opportunity Radar is the internal ranking layer for current Protofire opportunities.

It is not public and it does not change Atlas public scores.

## Purpose

It answers:

- which active wedges create the best current pitch opportunity
- which offer should lead
- which chains have the strongest current conversion potential

## Core files

- [`lib/opportunities/computeOpportunityRadar.ts`](/Users/qfedesq/Desktop/Atlas/lib/opportunities/computeOpportunityRadar.ts)
- [`lib/opportunities/rankOpportunityTargets.ts`](/Users/qfedesq/Desktop/Atlas/lib/opportunities/rankOpportunityTargets.ts)
- [`lib/opportunities/explainOpportunity.ts`](/Users/qfedesq/Desktop/Atlas/lib/opportunities/explainOpportunity.ts)
- [`app/internal/opportunities/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/internal/opportunities/page.tsx)

## Inputs

Opportunity Radar combines:

- target-account ranking outputs from the repository
- active wedge applicability
- current readiness gap
- active offer matching
- stored personas and proposal context when available

## Output fields

- `chain_id`
- `chain_slug`
- `chain_name`
- `wedge`
- `opportunity_score`
- `key_gap`
- `recommended_offer`
- `recommended_offer_id`
- `persona_name`
- `estimated_roi_band`
- `confidence`
- `rationale`
- `current_rank`

## Scoring behavior

The score is deterministic.

It does not use GPT output directly.

AI-assisted outputs may enrich context, but they do not overwrite the radar score.

## Operational use

Use `/internal/opportunities` to:

- review current pitch priorities
- open internal account views
- trace the current rationale behind the recommended offer
