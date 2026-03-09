# Proposal Generator

Atlas now includes a deterministic proposal generator that combines chain context, active wedges, buyer personas, and the Protofire offer library.

## Purpose

The proposal generator answers:

- which offer should be pitched to this chain
- why it fits the current wedge and persona
- what ROI band and conversion probability Atlas expects

## Core files

- [`lib/proposals/generateProposal.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/generateProposal.ts)
- [`lib/proposals/scoreProposalFit.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/scoreProposalFit.ts)
- [`lib/proposals/estimateProposalROI.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/estimateProposalROI.ts)
- [`lib/proposals/proposalTemplates.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/proposalTemplates.ts)
- [`lib/proposals/proposalStorage.ts`](/Users/qfedesq/Desktop/Atlas/lib/proposals/proposalStorage.ts)
- [`app/internal/proposals/page.tsx`](/Users/qfedesq/Desktop/Atlas/app/internal/proposals/page.tsx)

## Inputs

- chain profile
- selected active wedge
- wedge applicability
- buyer persona record
- active offers
- proposal scoring assumptions

## Outputs

Each stored proposal includes:

- chain
- persona
- offer
- conversion probability
- strategic fit
- ROI estimation
- risk reduction
- expected chain outcome
- proposal summary
- markdown content

## Boundary

Proposal fit stays deterministic.

AI-assisted analysis may reference proposal outputs, but it does not rewrite proposal scores or public ranking formulas.
