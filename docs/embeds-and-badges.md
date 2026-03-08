# Embeds And Badges

Atlas exposes lightweight public embeds and shareable badges for public ranking data.

## Embeds

Routes:

- `/embed/rankings/global`
- `/embed/rankings/[economy]`
- `/embed/chains/[slug]/scorecard`
- `/embed/gaps/[module]`

Rules:

- public-only
- iframe-compatible
- lightweight
- no authentication
- no internal GTM data

Implementation:

- routes: [`app/embed`](/Users/qfedesq/Desktop/Atlas/app/embed)
- shell suppression: [`components/layout/site-shell.tsx`](/Users/qfedesq/Desktop/Atlas/components/layout/site-shell.tsx)

## Badges

Routes:

- `/badge/chains/[slug]/global`
- `/badge/chains/[slug]/[economy]`

Examples:

- `Global Score 8.2`
- `AI Agents Rank #3`

Implementation:

- SVG builder: [`lib/badges/svg.ts`](/Users/qfedesq/Desktop/Atlas/lib/badges/svg.ts)
- routes: [`app/badge`](/Users/qfedesq/Desktop/Atlas/app/badge)

## Guardrails

- embeds and badges must remain deterministic
- they must reuse public data serializers or public repository outputs
- they must not expose admin or target-account data
