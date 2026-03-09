# Offer Library

Atlas uses a markdown-backed offer library for Protofire proposal matching.

## Storage

Offer files live in:

- [`offers`](/Users/qfedesq/Desktop/Atlas/offers)

Loader:

- [`lib/offers/library.ts`](/Users/qfedesq/Desktop/Atlas/lib/offers/library.ts)

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

## Rules

- keep offer files versioned in git
- do not store secrets or customer-private notes
- update both the markdown content and the parser if the schema changes
