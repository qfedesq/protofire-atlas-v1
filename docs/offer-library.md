# Offer Library

Atlas uses a markdown-backed offer library for Protofire proposal matching.

## Storage

Offer files live in:

- [`offers`](/Users/qfedesq/Desktop/Atlas/offers)

Loader/indexing layer:

- [`lib/offers/library.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/library.ts)
- [`lib/offers/loadOffers.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/loadOffers.ts)
- [`lib/offers/parseOfferMarkdown.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/parseOfferMarkdown.ts)
- [`lib/offers/offerIndex.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/offerIndex.ts)
- [`lib/offers/offerMatching.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/offerMatching.ts)
- [`lib/offers/store.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/store.ts)

## Required fields

Each offer markdown file must include:

- offer name
- problem solved
- target customer
- infrastructure required
- deployment scope
- expected impact
- ROI potential
- typical price range
- target personas
- case study references

## Usage

Atlas uses these offers in:

- deterministic proposal matching
- GPT-assisted strategic analysis context
- internal chain strategic appendix
- internal offers page at `/internal/offers`

## Runtime metadata

Offer content stays in git under `/offers`.

Runtime metadata such as:

- active / inactive state
- wedge tags
- persona tags

is stored separately so internal teams can tune matching behavior without editing markdown content in production.

## Rules

- keep offer files versioned in git
- do not store secrets or customer-private notes
- update both the markdown content and the parser if the schema changes
