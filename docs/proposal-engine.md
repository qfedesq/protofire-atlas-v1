# Proposal Engine

Atlas now includes an internal proposal generation engine.

## Purpose

The engine matches:

- chain infrastructure and readiness
- active wedge applicability
- buyer persona context
- Protofire offers

to produce conversion-oriented proposal candidates.

## Deterministic layer

Proposal scoring is deterministic.

Inputs:

- chain capability profile
- wedge applicability
- stored persona record
- offer library
- proposal scoring assumptions from admin

Core files:

- [`lib/proposals/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/engine.ts)
- [`lib/proposals/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/store.ts)

## Output

Stored proposal documents include:

- chain
- persona
- offer
- conversion probability
- ROI estimation
- risk reduction
- expected chain outcome
- proposal summary
- markdown content

## AI-assisted layer

GPT-assisted strategic analysis can reference proposal candidates and generate a draft narrative.

That AI-assisted proposal draft is distinct from the deterministic proposal score and does not feed back into public rankings.
