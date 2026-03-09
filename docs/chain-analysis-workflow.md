# Chain Analysis Workflow

Atlas now supports an internal GPT-assisted technical analysis workflow per chain.

This workflow is separate from public readiness scoring.

## Goal

For one selected chain, Atlas can assemble a structured technical snapshot and run a deeper review across the currently active wedges:

- AI Agents
- DeFi Infrastructure

The analysis focuses on:

- applicability by wedge
- technical blockers
- prerequisite gaps
- buyer persona incentives
- strongest Protofire opportunities
- proposal draft output
- manual follow-up areas

## Deterministic vs AI-assisted

Atlas keeps two layers separate:

### Deterministic baseline

- readiness scoring
- public rankings
- wedge applicability baseline
- recommendation engine

### AI-assisted layer

- deeper chain technical analysis
- structured reasoning output
- internal-only findings and follow-up notes

The AI-assisted result does not directly change public scores.

## Trigger flow

1. An authenticated internal user opens a chain page.
2. The internal section shows the deterministic wedge applicability baseline.
3. The user clicks `Run GPT-5.4 Technical Analysis`.
4. Atlas builds an input snapshot for that chain.
5. Atlas stores a queued analysis record.
6. Atlas runs either:
   - live OpenAI execution when configured
   - deterministic mock execution when live execution is unavailable and mock fallback is enabled
7. Atlas stores the completed result and exposes it on `/internal/analysis/[id]`.

## Core files

Input assembly:

- [`lib/analysis/input.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/input.ts)

Prompt templates:

- [`lib/analysis/prompt-templates.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/prompt-templates.ts)

Structured schema:

- [`lib/analysis/schema.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/schema.ts)

Live execution:

- [`lib/analysis/openai.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/openai.ts)

Mock execution:

- [`lib/analysis/mock.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/mock.ts)

Store:

- [`lib/analysis/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/store.ts)

Orchestration:

- [`lib/analysis/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/analysis/service.ts)

## Structured result model

Primary type:

- [`ChainTechnicalAnalysis`](/Users/qfedesq/Desktop/Atlas/lib/domain/types.ts)

Key fields:

- `id`
- `chain_id`
- `chain_slug`
- `triggered_by`
- `model_name`
- `analysis_type`
- `status`
- `execution_mode`
- `input_snapshot`
- `output_summary`
- `output_structured_data`
- `created_at`
- `completed_at`
- `error_message`

Structured output includes:

- per-wedge applicability assessment
- technical blockers
- prerequisite summary
- buyer persona analysis
- strongest opportunities
- recommended offer
- proposal draft
- confidence notes
- manual follow-up

## Live connection requirements

Live execution requires:

- `OPENAI_API_KEY`
- a model name that is available to the connected OpenAI account

The current admin-configurable default label is `gpt-5.4`.

If the environment does not have valid credentials or the configured model is unavailable:

- Atlas can fall back to deterministic mock mode when `useMockWhenUnavailable` is enabled
- the stored result explicitly records that fallback in the output

## Internal surfaces

Trigger button:

- chain page internal analysis section

Latest analysis summary:

- chain page internal analysis section

Full result page:

- `/internal/analysis/[id]`

## Persistence

The analysis store uses the same runtime persistence model as other mutable Atlas documents:

- local JSON/runtime-managed file fallback
- Vercel Postgres persistence when configured

## What remains environment-dependent

The only environment-dependent step is live model execution:

- valid OpenAI credentials
- actual model access for the configured model name

Everything else is already implemented:

- trigger flow
- structured input
- structured output schema
- persistence
- internal UI
- deterministic fallback mode
