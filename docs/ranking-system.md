# Ranking System

Atlas now uses one shared ranking-table architecture for all comparative views.

Supported modes:

- economy ranking at `/`
- global chain ranking at `/rankings/global`
- internal opportunity ranking at `/internal/targets`

## Shared architecture

Core pieces:

- shared renderer: [`components/tables/ranking-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-table.tsx)
- mode-specific column definitions: [`components/tables/ranking-column-definitions.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/ranking-column-definitions.tsx)
- thin wrappers:
  - [`components/tables/rankings-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/rankings-table.tsx)
  - [`components/tables/global-rankings-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/global-rankings-table.tsx)
  - [`components/tables/targets-table.tsx`](/Users/qfedesq/Desktop/Atlas/components/tables/targets-table.tsx)
- shared visibility utilities: [`lib/rankings/table.ts`](/Users/qfedesq/Desktop/Atlas/lib/rankings/table.ts)

The wrappers only choose:

- row type
- ranking mode
- column definitions
- row key
- page-specific sort hrefs
- page-specific column-toggle hrefs

They do not implement separate table markup.

## Column configuration system

Each mode defines columns with:

- `id`
- `label`
- `description`
- `defaultVisible`
- `canHide`
- `sortKey`
- `align`
- `widthClassName`
- `renderCell`

This keeps ranking composition declarative and avoids page-level table branching.

## Sticky behavior

Atlas uses one sticky leading column.

The sticky column always includes:

- rank
- chain name
- chain context lines

This keeps the anchor context visible during horizontal scroll without forcing two independent sticky columns.

## Column visibility

Column visibility is URL-driven, not client-only state.

Behavior:

- each ranking page reads a `columns` query param
- missing `columns` falls back to the mode default
- non-hideable columns are always restored
- invalid column ids are dropped
- `Reset to default` removes custom visibility back to the mode baseline

Why this choice:

- preserves shareable URLs
- avoids hidden client state
- keeps ranking pages server-rendered

## Mode defaults

Global ranking default:

- Chain
- Global Score
- Economy Composite
- Ecosystem Score

Opportunity ranking default:

- Chain
- Opportunity Score
- Economy Focus
- Priority
- Readiness Gap
- Recommended Stack

Economy ranking default:

- Chain
- Readiness
- all wedge modules for the selected economy

Economy ranking keeps module columns visible by default because module posture is the core comparative signal for that view.

## Sorting

Sorting remains URL-driven.

Each sortable column exposes ascending and descending links. The shared table does not own ranking logic; it only renders sort controls against the page-provided href builder.

## Responsive behavior

Rules:

- table container scrolls horizontally on smaller widths
- sticky chain column remains visible
- default columns stay minimal for global and internal ranking modes
- advanced columns stay available through the column menu

## Extending the ranking system

To add a new ranking mode safely:

1. define the row type
2. add mode-specific column definitions
3. wire a thin wrapper to the shared `RankingTable`
4. parse and serialize `columns` in the page route
5. add tests for default visibility and sorting behavior

Do not create a new standalone table implementation unless the data shape is fundamentally different from Atlas rankings.
