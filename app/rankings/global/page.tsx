import { GlobalRankingsTable } from "@/components/tables/global-rankings-table";
import { Panel } from "@/components/ui/panel";
import { parseGlobalRankingsQuery } from "@/lib/domain/schemas";
import type {
  GlobalRankingsQuery,
  RankingsSortDirection,
} from "@/lib/domain/types";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

const repository = createSeedChainsRepository();

type GlobalRankingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildSortHref(
  query: GlobalRankingsQuery,
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

  const search = searchParams.toString();

  return search.length > 0 ? `/rankings/global?${search}` : "/rankings/global";
}

export default async function GlobalRankingsPage({
  searchParams,
}: GlobalRankingsPageProps) {
  const query = parseGlobalRankingsQuery(
    searchParams ? await searchParams : undefined,
  );
  const rows = repository.listGlobalRankedChains(query);

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
          <p className="text-muted mt-3 text-sm leading-6">
            Top 30 EVM chains by TVL. Atlas uses a curated snapshot and active
            scoring assumptions, not live synchronization.
          </p>
        </Panel>
      </section>

      <GlobalRankingsTable
        rows={rows}
        sort={query.sort}
        direction={query.direction}
        buildSortHref={(sort, direction) => buildSortHref(query, sort, direction)}
      />
    </div>
  );
}
