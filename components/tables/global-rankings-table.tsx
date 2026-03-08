import type {
  GlobalRankedChain,
  GlobalRankingsQuery,
  RankingsSortDirection,
} from "@/lib/domain/types";

import { createGlobalRankingColumns } from "@/components/tables/ranking-column-definitions";
import { RankingTable } from "@/components/tables/ranking-table";

type GlobalRankingsTableProps = {
  rows: GlobalRankedChain[];
  sort: GlobalRankingsQuery["sort"];
  direction: RankingsSortDirection;
  visibleColumnIds: string[];
  buildSortHref: (
    sort: GlobalRankingsQuery["sort"],
    direction: RankingsSortDirection,
  ) => string;
  buildColumnsHref: (columnIds: string[]) => string;
};

export function GlobalRankingsTable({
  rows,
  sort,
  direction,
  visibleColumnIds,
  buildSortHref,
  buildColumnsHref,
}: GlobalRankingsTableProps) {
  return (
    <RankingTable
      mode="global"
      rows={rows}
      columns={createGlobalRankingColumns()}
      visibleColumnIds={visibleColumnIds}
      getRowKey={(row) => row.chain.slug}
      sort={sort}
      direction={direction}
      buildSortHref={buildSortHref}
      buildColumnsHref={buildColumnsHref}
      emptyState="No chains are available in the current global Atlas benchmark."
    />
  );
}
