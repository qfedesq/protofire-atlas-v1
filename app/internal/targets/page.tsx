import Link from "next/link";

import { createOpportunityRankingColumns } from "@/components/tables/ranking-column-definitions";
import { TargetsTable } from "@/components/tables/targets-table";
import { Panel } from "@/components/ui/panel";
import { requireAuthenticatedInternalUser } from "@/lib/admin/auth";
import { parseTargetAccountsQuery } from "@/lib/domain/schemas";
import type {
  RankingsSortDirection,
  TargetAccountsQuery,
} from "@/lib/domain/types";
import {
  parseVisibleColumnIds,
  resolveVisibleColumnIds,
  serializeVisibleColumnIds,
} from "@/lib/rankings/table";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

const repository = createSeedChainsRepository();

type TargetsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildSortHref(
  query: TargetAccountsQuery,
  visibleColumnIds: string[],
  columns: ReturnType<typeof createOpportunityRankingColumns>,
  sort: TargetAccountsQuery["sort"],
  direction: RankingsSortDirection,
) {
  const searchParams = new URLSearchParams();

  if (sort !== "opportunityScore") {
    searchParams.set("sort", sort);
  }

  if (direction !== "desc") {
    searchParams.set("direction", direction);
  }

  const serializedColumns = serializeVisibleColumnIds(visibleColumnIds, columns);

  if (serializedColumns) {
    searchParams.set("columns", serializedColumns);
  }

  const search = searchParams.toString();

  return search.length > 0 ? `/internal/targets?${search}` : "/internal/targets";
}

export default async function TargetsPage({ searchParams }: TargetsPageProps) {
  await ensureAtlasPersistence();
  await requireAuthenticatedInternalUser("/internal/targets");

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = parseTargetAccountsQuery(resolvedSearchParams);
  const rows = repository.listTargetAccounts(query);
  const columns = createOpportunityRankingColumns();
  const visibleColumnIds = resolveVisibleColumnIds(
    parseVisibleColumnIds(resolvedSearchParams?.columns),
    columns,
  );

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Target account mode
            </p>
            <h1 className="text-foreground mt-2 text-3xl font-semibold">
              Top commercial opportunities
            </h1>
            <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
              Internal GTM view that combines TVL, readiness gap, stack fit, and
              ecosystem signal to prioritize the strongest Protofire accounts.
            </p>
          </div>
          <Link
            href="/internal/admin"
            className="text-accent text-sm font-medium hover:underline"
          >
            Edit assumptions
          </Link>
        </div>
      </Panel>

      <TargetsTable
        rows={rows}
        sort={query.sort}
        direction={query.direction}
        visibleColumnIds={visibleColumnIds}
        buildSortHref={(sort, direction) =>
          buildSortHref(query, visibleColumnIds, columns, sort, direction)
        }
        buildColumnsHref={(columnIds) => {
          const searchParams = new URLSearchParams();

          if (query.sort !== "opportunityScore") {
            searchParams.set("sort", query.sort);
          }

          if (query.direction !== "desc") {
            searchParams.set("direction", query.direction);
          }

          const serializedColumns = serializeVisibleColumnIds(columnIds, columns);

          if (serializedColumns) {
            searchParams.set("columns", serializedColumns);
          }

          const search = searchParams.toString();

          return search.length > 0 ? `/internal/targets?${search}` : "/internal/targets";
        }}
      />
    </div>
  );
}
