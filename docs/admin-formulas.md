# Admin Formulas

Atlas now exposes all important formula groups through admin.

Primary route:

- `/internal/admin/data-sources`

This page is the operational control surface for score math and manual non-automatic inputs.

## Formula groups

### 1. Economy scoring

Editable:

- per-economy module weights
- maximum score
- status score mapping
- recommendation thresholds
- liquid staking diagnosis weights for DeFi

Used by:

- readiness scores
- module contributions
- recommendation engine
- deployment plans

### 2. Global ranking

Editable:

- top-level global score weights
- economy composite weights
- ecosystem subweights
- adoption subweights
- performance subweights

Used by:

- public global ranking
- chain global context
- public exports and APIs

### 3. Opportunity scoring

Editable:

- TVL factor weight
- readiness gap weight
- stack fit weight
- ecosystem signal weight
- stack-fit lift ratio
- stack-fit coverage ratio
- priority thresholds

Used by:

- `/internal/targets`
- `/internal/account/[chain]`
- outreach prioritization exports

### 4. Wedge applicability

Editable:

- capability signal scores
- wedge capability weights
- prerequisite requirements by wedge
- applicability thresholds
- confidence rules

Used by:

- deterministic applicability baseline
- internal applicability matrix
- chain page internal applicability section
- GPT-assisted analysis input

### 5. Analysis settings

Editable:

- model name
- prompt template key
- sensitivity
- opportunity threshold
- manual review threshold
- mock fallback toggle

Used by:

- internal GPT-assisted chain analysis workflow only

### 6. Proposal engine

Editable:

- applicability contribution
- gap-severity contribution
- persona-fit contribution
- expected-impact contribution
- ROI-potential contribution
- high / medium priority thresholds

Used by:

- internal proposal matching
- internal chain strategic appendix
- stored proposal documents

## Validation rules

Atlas blocks invalid saves for:

- status ordering
- weight groups that must sum to 100
- invalid threshold ordering
- invalid priority ordering
- invalid liquid staking diagnostic weight coverage
- invalid module catalogs

Validation lives in:

- [`lib/assumptions/schemas.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/schemas.ts)

## Storage

Default committed assumptions:

- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

Runtime persistence:

- [`lib/assumptions/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/store.ts)

In Vercel, mutable values persist through the configured runtime storage backend.

## What should not be changed casually

Avoid casual edits to:

- applicability signal ordering
- wedge prerequisite models
- global top-level component weights
- opportunity priority thresholds
- model label and prompt template pairing

These can materially change:

- public rankings
- internal target prioritization
- internal AI-assisted findings

## Safe workflow

1. review the current value
2. change one formula group at a time
3. save
4. inspect the affected ranking or internal page
5. document the reason for the change in your release notes or internal handoff
