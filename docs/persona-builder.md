# Persona Builder

Atlas now supports internal buyer persona generation as a structured internal layer with deterministic templates first and optional AI enrichment later.

## Purpose

Buyer personas help Protofire connect:

- technical gaps
- likely decision-maker incentives
- the offer with the highest conversion probability

## Inputs

The persona builder accepts:

- chain URL
- protocol URL
- organization name
- person name
- person title
- LinkedIn profile
- Twitter handle
- GitHub profile
- internal notes

## Output

Every generated persona creates two artifacts:

1. a markdown file under the runtime personas directory
2. a structured persona record stored in Atlas persistence

The markdown file contains:

- empathy map
- success metrics
- lean canvas
- source basis
- generated timestamp

## Core files

- [`lib/personas/buildPersonaProfile.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/buildPersonaProfile.ts)
- [`lib/personas/personaSources.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/personaSources.ts)
- [`lib/personas/personaTemplates.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/personaTemplates.ts)
- [`lib/personas/personaStorage.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/personaStorage.ts)
- [`lib/personas/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/service.ts)

## Important boundary

Buyer personas are internal-only.

They are inputs to proposal generation and GPT-assisted strategy analysis.

They do not alter deterministic rankings or readiness scores.
