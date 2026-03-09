# Developer Guide

## Product guardrails

Keep Atlas focused on:

- chain intelligence
- deterministic rankings
- readiness gaps
- Protofire activation paths
- internal target prioritization

Do not widen the app into a generalized analytics platform or CRM.

## Refresh the benchmark

Run:

```bash
npm run data:refresh-top30
```

This updates:

- [`data/source/defillama-top-30-evm-chains.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/defillama-top-30-evm-chains.snapshot.json)

If the benchmark changes, review:

- [`data/seed/chain-metadata.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-metadata.ts)
- [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts)
- [`data/seed/economies`](/Users/qfedesq/Desktop/Atlas/data/seed/economies)
- [`data/seed/chain-roadmaps.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-roadmaps.ts)

## Refresh external metrics

Run:

```bash
npm run data:sync-external
```

This updates:

- [`data/source/external-chain-metrics.snapshot.json`](/Users/qfedesq/Desktop/Atlas/data/source/external-chain-metrics.snapshot.json)

Key files:

- current production snapshot layer: [`lib/external-data/connectors`](/Users/qfedesq/Desktop/Atlas/lib/external-data/connectors)
- connector wrappers and source-health contracts: [`lib/connectors`](/Users/qfedesq/Desktop/Atlas/lib/connectors)
- sync orchestration: [`lib/data-sync`](/Users/qfedesq/Desktop/Atlas/lib/data-sync)
- normalization: [`lib/external-data/utils.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/utils.ts)
- service: [`lib/external-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/external-data/service.ts)

Rules:

- do not fabricate missing metrics
- preserve the last valid snapshot if a source fails
- use fallback values only when no valid source-backed metric exists
- keep all source credentials server-side

## Full refresh workflow

Run:

```bash
npm run data:sync
```

This currently:

- refreshes the top-30 benchmark
- refreshes external metrics
- regenerates reports and exports

## Update readiness seeds

AI Agents:

- [`data/seed/chains.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chains.ts)

Other economies:

- [`data/seed/economies`](/Users/qfedesq/Desktop/Atlas/data/seed/economies)

Keep `status`, `rationale`, and `evidenceNote` explicit and deterministic.

## Change scoring assumptions

Preferred path:

- use `/internal/admin/data-sources`

Stored in:

- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

Runtime-managed path:

- [`lib/assumptions/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/store.ts)
- Vercel persistence backend: [`lib/storage/persistent-json-store.ts`](/Users/qfedesq/Desktop/Atlas/lib/storage/persistent-json-store.ts)

This controls:

- readiness module weights
- status mappings
- recommendation thresholds
- global ranking weights
- economy composite weights
- opportunity score weights
- global ranking subweights
- wedge applicability rules
- GPT-assisted analysis settings

Only change base definitions in code when the product model itself changes:

- [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts)
- [`lib/assumptions/defaults.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/defaults.ts)

## Update manual Atlas datasets

Preferred path:

- use `/internal/admin/data-sources`

Backing store:

- [`lib/admin/manual-data.ts`](/Users/qfedesq/Desktop/Atlas/lib/admin/manual-data.ts)

Datasets editable there:

- readiness records
- chain capability profiles
- roadmap stage dataset
- fallback ecosystem metrics
- liquid staking market snapshots

Rules:

- only edit datasets Atlas cannot fully sync automatically
- keep JSON valid against the existing seed schema
- prefer official/public sources for roadmap and liquid staking notes
- use manual overrides instead of editing seed files directly when the goal is runtime admin control

## Update wedge applicability

Primary files:

- [`data/seed/chain-capability-profiles.ts`](/Users/qfedesq/Desktop/Atlas/data/seed/chain-capability-profiles.ts)
- [`lib/applicability/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/applicability/engine.ts)
- [`lib/applicability/insights.ts`](/Users/qfedesq/Desktop/Atlas/lib/applicability/insights.ts)

Admin path:

- `/internal/admin/data-sources`

Rules:

- applicability is about technical feasibility, not maturity
- do not encode “has not launched yet” as `not_applicable`
- prefer `unknown` when the technical profile is incomplete
- keep public-facing wedges limited to active economies unless the product scope changes intentionally

## Build buyer personas

Primary files:

- [`lib/personas/buildPersonaProfile.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/buildPersonaProfile.ts)
- [`lib/personas/personaSources.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/personaSources.ts)
- [`lib/personas/personaTemplates.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/personaTemplates.ts)
- [`lib/personas/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/service.ts)
- [`lib/personas/personaStorage.ts`](/Users/qfedesq/Desktop/Atlas/lib/personas/personaStorage.ts)

Rules:

- buyer personas are internal-only
- the markdown file is the durable artifact
- structured persona records must stay in sync with the markdown artifact
- prefer deterministic template enrichment before adding more AI dependence

## Update the offer library

Versioned offer files live in:

- [`offers`](/Users/qfedesq/Desktop/Atlas/offers)

Loader:

- [`lib/offers/library.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/library.ts)
- [`lib/offers/loadOffers.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/loadOffers.ts)
- [`lib/offers/parseOfferMarkdown.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/parseOfferMarkdown.ts)
- [`lib/offers/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/store.ts)

Rules:

- keep offer files concise and template-aligned
- do not store credentials or private customer data in offers
- use runtime offer overrides for activation and tag changes instead of mutating markdown in production

## Update proposal matching

Primary files:

- [`lib/proposals/generateProposal.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/generateProposal.ts)
- [`lib/proposals/scoreProposalFit.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/scoreProposalFit.ts)
- [`lib/proposals/estimateProposalROI.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/estimateProposalROI.ts)
- [`lib/proposals/proposalStorage.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/proposalStorage.ts)

Rules:

- proposal scoring is deterministic
- proposal outputs stay internal
- AI may draft strategy, but deterministic proposal scores must remain separate

## Update opportunity radar

Primary files:

- [`lib/opportunities/computeOpportunityRadar.ts`](/Users/qfedesq/Desktop/Atlas/lib/opportunities/computeOpportunityRadar.ts)
- [`lib/opportunities/rankOpportunityTargets.ts`](/Users/qfedesq/Desktop/Atlas/lib/opportunities/rankOpportunityTargets.ts)
- [`lib/opportunities/explainOpportunity.ts`](/Users/qfedesq/Desktop/Atlas/lib/opportunities/explainOpportunity.ts)

Rules:

- opportunity radar is internal-only
- it must stay deterministic
- it may use persona/proposal presence as context, but not as an opaque AI score

## Update internal GPT-assisted analysis

Workflow files:

- [`lib/analysis/input.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/input.ts)
- [`lib/analysis/prompt-templates.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/prompt-templates.ts)
- [`lib/analysis/openai.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/openai.ts)
- [`lib/analysis/mock.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/mock.ts)
- [`lib/analysis/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/service.ts)

Rules:

- keep structured output schema-first
- keep the deterministic baseline visible next to AI-assisted analysis
- do not feed AI-generated output back into public ranking formulas automatically
- if changing model or prompt behavior, update admin defaults and docs together

Live execution requires a valid OpenAI key and actual access to the configured model name.

## Internal route protection

Internal route protection lives in:

- [`lib/admin/auth.ts`](/Users/qfedesq/Desktop/Atlas/lib/admin/auth.ts)
- [`lib/auth0.ts`](/Users/qfedesq/Desktop/Atlas/lib/auth0.ts)
- [`proxy.ts`](/Users/qfedesq/Desktop/Atlas/proxy.ts)

Use:

- `requireAuthenticatedInternalUser(returnTo)`

Do not create new internal-only pages without going through that helper.

## Update recommendation logic

Files:

- [`lib/recommendations/rules.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/rules.ts)
- [`lib/recommendations/engine.ts`](/Users/qfedesq/Desktop/Atlas/lib/recommendations/engine.ts)

Keep this layer deterministic and component-free.

## Update public API or export payloads

Use the shared serializer:

- [`lib/public-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/public-data/service.ts)

Public routes:

- [`app/api/public`](/Users/qfedesq/Desktop/Atlas/app/api/public)
- [`app/data`](/Users/qfedesq/Desktop/Atlas/app/data)

Rules:

- expose public Atlas data only
- always include `atlas_version`, `updated_at`, and `source_note`
- never expose opportunity scores or admin assumptions

## Update embeds and badges

Embeds:

- [`app/embed`](/Users/qfedesq/Desktop/Atlas/app/embed)

Badges:

- [`app/badge`](/Users/qfedesq/Desktop/Atlas/app/badge)

Badge rendering:

- [`lib/badges/svg.ts`](/Users/qfedesq/Desktop/Atlas/lib/badges/svg.ts)

Keep these routes lightweight and public-safe.

## Update ranking tables

Shared ranking system:

- renderer: [`components/tables/ranking-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-table.tsx)
- columns: [`components/tables/ranking-column-definitions.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-column-definitions.tsx)
- helpers: [`lib/rankings/table.ts`](/Users/qfedesq/Desktop/Atlas/lib/rankings/table.ts)

Rules:

- keep the chain column sticky
- preserve mode separation between public and internal rankings
- keep global ranking child-column behavior inside the header tree
- do not reintroduce a separate column menu for the public global ranking

## Update the chain page

Primary files:

- [`components/chain/chain-profile-view.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/chain-profile-view.tsx)
- [`components/chain/score-composition-section.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/score-composition-section.tsx)
- [`components/chain/improvement-path-section.tsx`](/Users/qfedesq/Desktop/Atlas/components/chain/improvement-path-section.tsx)

Rules:

- one dominant readiness score
- flat analytical layout
- no rounded metric-chip grids
- competitive and global context come after score explanation and improvement path
- preserve the memo-style top-to-bottom reading flow
- use section toggles instead of adding more page chrome
- normalize economy module summaries through [`lib/utils/economy-summary.ts`](/Users/qfedesq/Desktop/Atlas/lib/utils/economy-summary.ts)

## Update the admin data source registry

Registry files:

- [`lib/admin/data-source-registry.ts`](/Users/qfedesq/Desktop/Atlas/lib/admin/data-source-registry.ts)
- [`components/admin/data-source-registry-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/admin/data-source-registry-table.tsx)
- [`app/internal/admin/data-sources/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/internal/admin/data-sources/page.tsx)

When adding a new blockchain-related metric:

1. add or update the actual source/connector/seed
2. update the provenance row in the registry
3. document refresh behavior and last-updated source
4. add or update the relevant tests

Do not add hidden metrics to the model without registering their provenance.

Also decide one of these explicitly:

- source-backed via connector
- manual Atlas dataset
- admin-managed assumption
- Atlas-derived metric

## Regenerate outputs

Run:

```bash
npm run reports:generate
```

This writes:

- internal reports under [`reports`](/Users/qfedesq/Desktop/Atlas/reports)
- GTM exports under [`exports`](/Users/qfedesq/Desktop/Atlas/exports)
- public dataset exports under [`exports/public-data`](/Users/qfedesq/Desktop/Atlas/exports/public-data)

## Bump version

Run:

```bash
npm run version:bump
```

Canonical source:

- [`package.json`](/Users/qfedesq/Desktop/Atlas/package.json)

Version helper:

- [`lib/config/version.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/version.ts)
