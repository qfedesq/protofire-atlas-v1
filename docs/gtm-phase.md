# GTM Phase

## Purpose

The Launch + Reaction Phase turns Atlas into a public GTM asset instead of a purely internal intelligence tool.

The product goal is to create productive tension:

- public rank visibility
- nearby-peer pressure
- gap clarity
- a clear Protofire activation path
- a direct request capture flow

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
- peer comparison on chain profiles
- request capture for assessment intent
- generated outreach reports under [`reports`](/Users/qfedesq/Desktop/Atlas/reports)
- JSON and CSV ranking exports under [`reports/exports`](/Users/qfedesq/Desktop/Atlas/reports/exports)

Primary GTM artifacts:

- [`reports/target-chains-by-economy.md`](/Users/qfedesq/Desktop/Atlas/reports/target-chains-by-economy.md)
- [`reports/high-tvl-lagging-chains.md`](/Users/qfedesq/Desktop/Atlas/reports/high-tvl-lagging-chains.md)
- [`reports/ai-agent-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/ai-agent-readiness-report.md)
- [`reports/defi-infrastructure-readiness-report.md`](/Users/qfedesq/Desktop/Atlas/reports/defi-infrastructure-readiness-report.md)
- [`reports/liquid-staking-landscape-report.md`](/Users/qfedesq/Desktop/Atlas/reports/liquid-staking-landscape-report.md)

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
