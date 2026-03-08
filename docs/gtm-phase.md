# GTM Phase

## Purpose

The Launch + Reaction Phase turns Atlas into a public GTM asset instead of a purely internal intelligence tool.

The product goal is to create productive tension:

- public rank visibility
- public holistic chain context
- nearby-peer pressure
- gap clarity
- a clear Protofire activation path
- a direct request capture flow
- an internal target-prioritization layer

## What “reaction” means

Reaction in Atlas means a chain can see:

- where it ranks in a chosen economy
- which nearby chains are ahead or behind
- which modules are responsible for that gap
- what Protofire would deploy to improve the posture
- how to request a concrete infrastructure assessment

## GTM-supporting outputs

Atlas now produces:

- public scorecards on chain profile pages
- public Global Chain Ranking at `/rankings/global`
- peer comparison on chain profiles
- request capture for assessment intent
- internal Target Account Mode at `/internal/targets`
- generated outreach reports under [`reports`](/Users/qfedesq/Desktop/Atlas/reports)
- JSON and CSV ranking exports under [`reports/exports`](/Users/qfedesq/Desktop/Atlas/reports/exports)
- top-level GTM CSV exports under [`exports`](/Users/qfedesq/Desktop/Atlas/exports)

Primary GTM artifacts:

- [`reports/target-chains-by-economy.md`](/Users/qfedesq/Desktop/Atlas/reports/target-chains-by-economy.md)
- [`reports/high-tvl-lagging-chains.md`](/Users/qfedesq/Desktop/Atlas/reports/high-tvl-lagging-chains.md)
- [`reports/ai-agent-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/ai-agent-readiness-report.md)
- [`reports/defi-infrastructure-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/defi-infrastructure-readiness-report.md)
- [`reports/liquid-staking-landscape-report.md`](/Users/qfedesq/Desktop/Atlas/reports/liquid-staking-landscape-report.md)
- [`reports/top-ecosystem-opportunities.md`](/Users/qfedesq/Desktop/Atlas/reports/top-ecosystem-opportunities.md)
- [`exports/global-chain-ranking.csv`](/Users/qfedesq/Desktop/Atlas/exports/global-chain-ranking.csv)
- [`exports/top-target-accounts.csv`](/Users/qfedesq/Desktop/Atlas/exports/top-target-accounts.csv)

## Metrics Protofire should monitor

Atlas intentionally uses lightweight instrumentation.

The most useful early signals are:

- economy selections on `/`
- chain profile views
- peer-comparison driven navigation
- assessment requests submitted

These events are stored in:

- `data/runtime/intent-events.json`

Assessment request records are stored in:

- `data/runtime/assessment-requests.json`

## What this phase does not do

- no CRM
- no outbound email automation
- no live analytics stack
- no proposal generation via runtime AI
- no broad marketing-site expansion

Atlas remains an infrastructure-readiness product with GTM utility, not a generalized go-to-market platform.
