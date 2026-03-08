import { createGlobalRankingColumns } from "@/components/tables/ranking-column-definitions";
import { CitationBlock } from "@/components/public/citation-block";
import { GlobalRankingsTable } from "@/components/tables/global-rankings-table";
import { Panel } from "@/components/ui/panel";
import { parseGlobalRankingsQuery } from "@/lib/domain/schemas";
import type {
  GlobalRankingsQuery,
  RankingsSortDirection,
} from "@/lib/domain/types";
import {
  parseVisibleColumnIds,
  resolveVisibleColumnIds,
  serializeVisibleColumnIds,
} from "@/lib/rankings/table";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

const repository = createSeedChainsRepository();

type GlobalRankingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildSortHref(
  query: GlobalRankingsQuery,
  visibleColumnIds: string[],
  columns: ReturnType<typeof createGlobalRankingColumns>,
  sort: GlobalRankingsQuery["sort"],
  direction: RankingsSortDirection,
) {
  const searchParams = new URLSearchParams();

  if (sort !== "totalScore") {
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

  return search.length > 0 ? `/rankings/global?${search}` : "/rankings/global";
}

export default async function GlobalRankingsPage({
  searchParams,
}: GlobalRankingsPageProps) {
  await ensureAtlasPersistence();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = parseGlobalRankingsQuery(resolvedSearchParams);
  const rows = repository.listGlobalRankedChains(query);
  const columns = createGlobalRankingColumns(repository.listEconomies());
  const visibleColumnIds = resolveVisibleColumnIds(
    parseVisibleColumnIds(resolvedSearchParams?.columns),
    columns,
  );

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <Panel>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Global chain ranking
          </p>
          <h1 className="text-foreground mt-2 text-4xl font-semibold tracking-tight">
            Holistic chain leaderboard
          </h1>
          <p className="text-muted mt-3 max-w-4xl text-sm leading-7">
            This ranking combines infrastructure readiness across four economies
            with ecosystem adoption and technical performance indicators.
          </p>
        </Panel>
      </section>

      <GlobalRankingsTable
        rows={rows}
        sort={query.sort}
        direction={query.direction}
        visibleColumnIds={visibleColumnIds}
        buildSortHref={(sort, direction) =>
          buildSortHref(query, visibleColumnIds, columns, sort, direction)
        }
        buildColumnsHref={(columnIds) => {
          const searchParams = new URLSearchParams();

          if (query.sort !== "totalScore") {
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

          return search.length > 0
            ? `/rankings/global?${search}`
            : "/rankings/global";
        }}
      />

      <CitationBlock />
    </div>
  );
}
