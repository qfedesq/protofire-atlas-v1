# Scoring Model

Protofire Atlas uses a deterministic weighted readiness score on a 0 to 10 scale.

## Shared status mapping

All supported economies use the same status-to-score mapping:

- `missing = 0`
- `partial = 0.5`
- `available = 1`

This mapping lives in [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts).

The live public app now reads the active mapping from:

- [`data/admin/active-assumptions.json`](/Users/qfedesq/Desktop/Atlas/data/admin/active-assumptions.json)

## Formula

For each module:

`weighted contribution = module weight * status factor * (maximum score / 100)`

Current maximum score:

- `10`

Total score:

`total score = sum(weighted contributions)`

The displayed score is rounded to one decimal place. Benchmark rank is derived from the raw total score before formatting, with chain name as the tie-breaker.

## Final calibrated weights

AI Agent Economy:

- Registry `25`
- Payments `25`
- Indexing `25`
- Security `25`

Reason:

- the current AI dataset already produced a credible top/bottom split
- equal weights kept the wedge simple while preserving transparency

DeFi Infrastructure Economy:

- Lending Infrastructure `20`
- Liquidity Layer `25`
- Oracle Infrastructure `20`
- Indexing Layer `10`
- Liquid Staking Infrastructure `25`

Reason:

- liquidity and liquid staking are stronger strategic differentiators for DeFi competitiveness
- indexing remains important but is less of a gating primitive than liquidity, lending, or liquid staking

RWA Infrastructure Economy:

- Asset Registry `30`
- Compliance Layer `30`
- Oracle Feeds `20`
- Settlement Infrastructure `20`

Reason:

- issuance and compliance are the clearest gating rails for RWA activation
- oracle and settlement remain critical but usually come after those first two foundations

Prediction Market Economy:

- Oracle Layer `35`
- Market Contracts `30`
- Indexing Infrastructure `15`
- Liquidity Integration `20`

Reason:

- outcome resolution and reusable market contracts are the core primitives
- liquidity matters materially
- indexing is important operationally but less foundational than resolution and market creation

Global Chain Ranking:

- Economy composite `55`
- Ecosystem activity `20`
- Adoption `15`
- Technical performance `10`

Economy composite split:

- AI Agent Economy `20`
- DeFi Infrastructure `40`
- RWA Infrastructure `20`
- Prediction Market Economy `20`

Reason:

- the holistic leaderboard should stay readiness-led
- DeFi gets extra weight because it is the strongest broad-market infrastructure signal across the current top-30 EVM benchmark
- adoption and performance still matter, but they are secondary to current infrastructure posture

Target Account Mode:

- TVL tier `35`
- Readiness gap `20`
- Stack fit `25`
- Ecosystem signal `20`

Reason:

- commercial prioritization should not over-reward low-scale chains just because they have large gaps
- TVL and ecosystem signal now push the shortlist toward chains with real market relevance
- readiness gap and stack fit still keep the score anchored to what Protofire can materially improve

## Calibration workflow

The current weights were calibrated by:

1. generating rankings for each economy against the top-30 EVM snapshot
2. reviewing top 10 and bottom 10 outputs
3. checking for obviously weak qualitative behavior
4. increasing weight only where a wedge needed clearer gating signals

Calibration stayed deliberately narrow. Atlas does not use opaque or statistical weighting.

## Safe change workflow

1. Use `/internal/admin` for live changes to:
   - module weights
   - global status scores
2. Keep total module weight at `100`.
3. Keep global ranking component weights, economy-composite weights, and opportunity weights at `100`.
4. Run:

```bash
npm run validate:data
npm run test
npm run reports:generate
```

5. Inspect the resulting top and bottom rankings before shipping the change.

## Where scoring lives

- economy definitions and weights: [`lib/config/economies.ts`](/Users/qfedesq/Desktop/Atlas/lib/config/economies.ts)
- active assumptions: [`lib/assumptions/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/store.ts)
- runtime overlay: [`lib/assumptions/resolve.ts`](/Users/qfedesq/Desktop/Atlas/lib/assumptions/resolve.ts)
- score calculation: [`lib/scoring/readiness-score.ts`](/Users/qfedesq/Desktop/Atlas/lib/scoring/readiness-score.ts)
- validation: [`lib/domain/schemas.ts`](/Users/qfedesq/Desktop/Atlas/lib/domain/schemas.ts)
