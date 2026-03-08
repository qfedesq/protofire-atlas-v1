# Public Data

Atlas publishes public datasets as both routes and generated export files.

## Public dataset pages

- `/data`
- `/data/rankings`
- `/data/research`
- `/data/gaps`

## Download routes

- `/data/global-ranking.json`
- `/data/global-ranking.csv`
- `/data/economy/[economy].json`
- `/data/economy/[economy].csv`
- `/data/gaps/[economy].json`

## Generated files

The same public payloads are written to:

- [`exports/public-data`](/Users/qfedesq/Desktop/Atlas/exports/public-data)

## Metadata

Every public export includes:

- Atlas version
- update timestamp
- source note

## Generation flow

Run:

```bash
npm run reports:generate
```

Implementation:

- serializer: [`lib/public-data/service.ts`](/Users/qfedesq/Desktop/Atlas/lib/public-data/service.ts)
- writer: [`scripts/generate-reports.ts`](/Users/qfedesq/Desktop/Atlas/scripts/generate-reports.ts)
