import type {
  RankingsSortDirection,
  TargetAccountRow,
  TargetAccountsQuery,
} from "@/lib/domain/types";

import { createOpportunityRankingColumns } from "@/components/tables/ranking-column-definitions";
import { RankingTable } from "@/components/tables/ranking-table";

type TargetsTableProps = {
  rows: TargetAccountRow[];
  sort: TargetAccountsQuery["sort"];
  direction: RankingsSortDirection;
  visibleColumnIds: string[];
  buildSortHref: (
    sort: TargetAccountsQuery["sort"],
    direction: RankingsSortDirection,
  ) => string;
  buildColumnsHref: (columnIds: string[]) => string;
};

export function TargetsTable({
  rows,
  sort,
  direction,
  visibleColumnIds,
  buildSortHref,
  buildColumnsHref,
}: TargetsTableProps) {
  return (
    <RankingTable
      mode="opportunity"
      rows={rows}
      columns={createOpportunityRankingColumns()}
      visibleColumnIds={visibleColumnIds}
      getRowKey={(row) => `${row.chain.slug}:${row.economy.slug}`}
      sort={sort}
      direction={direction}
      buildSortHref={buildSortHref}
      buildColumnsHref={buildColumnsHref}
      emptyState="No target accounts are available under the current Atlas opportunity model."
    />
  );
}
