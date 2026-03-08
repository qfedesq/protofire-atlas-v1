# Public API

Protofire Atlas exposes a narrow read-only API for public rankings, public chain profiles, research summaries, and gap summaries.

## Endpoints

- `/api/public/rankings/global`
- `/api/public/rankings/[economy]`
- `/api/public/chains/[slug]`
- `/api/public/research/[economy]`
- `/api/public/gaps/[economy]`

## Response guarantees

Public payloads are deterministic and include:

- `atlas_version`
- `updated_at`
- `source_note`

Ranking and chain payloads also include public chain/ranking fields such as:

- chain identity
- rank
- score
- economy context
- modules or economy breakdowns
- missing modules when relevant

## Implementation

- routes: [`app/api/public`](/Users/qfedesq/Desktop/Atlas/app/api/public)
- serializer: [`lib/public-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/public-data/service.ts)

## Guardrails

- public API routes must never expose opportunity scores
- public API routes must never expose internal target-account logic
- public API routes must never expose admin assumptions
- if an external source is unavailable, Atlas returns the latest valid snapshot or fallback-backed data instead of fabricating missing fields
