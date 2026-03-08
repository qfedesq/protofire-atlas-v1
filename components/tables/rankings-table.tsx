import type {
  EconomyType,
  RankedChain,
  RankingsSortDirection,
  RankingsSortKey,
} from "@/lib/domain/types";
import type { RankingColumnDefinition } from "@/lib/rankings/table";

import { createEconomyRankingColumns } from "@/components/tables/ranking-column-definitions";
import { RankingTable } from "@/components/tables/ranking-table";

type RankingsTableProps = {
  economy: EconomyType;
  rows: RankedChain[];
  sort: RankingsSortKey;
  direction: RankingsSortDirection;
  visibleColumnIds: string[];
  buildSortHref: (
    sort: RankingsSortKey,
    direction: RankingsSortDirection,
  ) => string;
  buildColumnsHref: (columnIds: string[]) => string;
};

export function RankingsTable({
  economy,
  rows,
  sort,
  direction,
  visibleColumnIds,
  buildSortHref,
  buildColumnsHref,
}: RankingsTableProps) {
  const columns = createEconomyRankingColumns(
    economy,
  ) as RankingColumnDefinition<RankedChain, RankingsSortKey>[];

  return (
    <RankingTable
      mode="economy"
      rows={rows}
      columns={columns}
      visibleColumnIds={visibleColumnIds}
      getRowKey={(row) => `${row.economy.slug}:${row.chain.slug}`}
      sort={sort}
      direction={direction}
      buildSortHref={buildSortHref}
      buildColumnsHref={buildColumnsHref}
      emptyState={`No chains are available for ${economy.shortLabel} in the current Atlas dataset.`}
    />
  );
}
