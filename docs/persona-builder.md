# Persona Builder

Atlas now supports internal buyer persona generation as a separate AI-assisted layer.

## Purpose

Buyer personas help Protofire connect:

- technical gaps
- likely decision-maker incentives
- the offer with the highest conversion probability

## Inputs

The persona builder accepts:

- chain URL
- protocol URL
- person name
- person title
- LinkedIn profile
- Twitter handle

## Output

Every generated persona creates two artifacts:

1. a markdown file under the runtime personas directory
2. a structured persona record stored in Atlas persistence

The markdown file contains:

- empathy map
- success metrics
- lean canvas

## Core files

- [`lib/personas/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/service.ts)
- [`lib/personas/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/store.ts)
- [`lib/personas/markdown.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/markdown.ts)

## Important boundary

Buyer personas are internal-only.

They are inputs to proposal generation and GPT-assisted strategy analysis.

They do not alter deterministic rankings or readiness scores.
