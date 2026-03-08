# Target Account Mode

## Purpose

Target Account Mode is the internal GTM layer in Atlas.

Routes:

- `/internal/targets`
- `/internal/account/[chain]`

It is intentionally separate from the public ranking surfaces.

Use it to answer:

- which chains Protofire should prioritize commercially
- which economy wedge should lead the outreach
- what infrastructure gaps are still commercially actionable

## Score model

Atlas computes an `OpportunityScore` per `chain + economy` pair.

Inputs:

- TVL tier signal
- readiness gap
- stack fit with Protofire’s existing infrastructure offers
- ecosystem signal

Formula:

`OpportunityScore = tvlTierWeight * TVLTierScore + readinessGapWeight * ReadinessGapScore + stackFitWeight * StackFitScore + ecosystemSignalWeight * EcosystemSignalScore`

All sub-scores are normalized to `0-10`.

## Defaults

- TVL tier: `30`
- readiness gap: `30`
- stack fit: `25`
- ecosystem signal: `15`

## Priority labels

Atlas assigns a deterministic priority label:

- `High` for `>= 7.5`
- `Medium` for `>= 5.5`
- `Monitor` for lower scores

## Outreach brief

The account page generates a deterministic brief from:

- current global rank
- current economy rank
- top missing modules
- nearby peer comparison
- recommended Protofire stack

This is template-based, not AI-generated at runtime.

Implementation:

- score engine: [`lib/targets/opportunity.ts`](/Users/qfedesq/Desktop/Atlas/lib/targets/opportunity.ts)
- outreach brief: [`lib/targets/outreach-brief.ts`](/Users/qfedesq/Desktop/Atlas/lib/targets/outreach-brief.ts)
- internal list page: [`app/internal/targets/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/internal/targets/page.tsx)
- internal account page: [`app/internal/account/[chain]/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/internal/account/[chain]/page.tsx)
