import { submitChainAdditionRequestAction } from "@/app/actions/chain-addition-request";
import { CitationBlock } from "@/components/public/citation-block";
import { AddChainRequestForm } from "@/components/requests/add-chain-request-form";
import { createGlobalRankingColumns } from "@/components/tables/ranking-column-definitions";
import { GlobalRankingsTable } from "@/components/tables/global-rankings-table";
import { Panel } from "@/components/ui/panel";
import { defaultEconomySlug } from "@/lib/config/economies";
import { parseGlobalRankingsQuery } from "@/lib/domain/schemas";
import type { GlobalRankingsQuery, RankingsSortDirection } from "@/lib/domain/types";
import {
  parseVisibleColumnIds,
  resolveVisibleColumnIds,
  serializeVisibleColumnIds,
} from "@/lib/rankings/table";
import { createArithmeticCaptcha } from "@/lib/requests/captcha";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

const repository = createSeedChainsRepository();

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildGlobalSortHref(
  globalVisibleColumnIds: string[],
  globalColumns: ReturnType<typeof createGlobalRankingColumns>,
  sort: GlobalRankingsQuery["sort"],
  direction: RankingsSortDirection,
) {
  const searchParams = new URLSearchParams();

  if (sort !== "totalScore") {
    searchParams.set("globalSort", sort);
  }

  if (direction !== "desc") {
    searchParams.set("globalDirection", direction);
  }

  const serializedGlobalColumns = serializeVisibleColumnIds(
    globalVisibleColumnIds,
    globalColumns,
  );

  if (serializedGlobalColumns) {
    searchParams.set("globalColumns", serializedGlobalColumns);
  }

  const search = searchParams.toString();

  return search.length > 0 ? `/?${search}#global-ranking` : "/#global-ranking";
}

function buildGlobalColumnsHref(
  globalQuery: GlobalRankingsQuery,
  columnIds: string[],
  globalColumns: ReturnType<typeof createGlobalRankingColumns>,
) {
  const searchParams = new URLSearchParams();

  if (globalQuery.sort !== "totalScore") {
    searchParams.set("globalSort", globalQuery.sort);
  }

  if (globalQuery.direction !== "desc") {
    searchParams.set("globalDirection", globalQuery.direction);
  }

  const serializedGlobalColumns = serializeVisibleColumnIds(
    columnIds,
    globalColumns,
  );

  if (serializedGlobalColumns) {
    searchParams.set("globalColumns", serializedGlobalColumns);
  }

  const search = searchParams.toString();

  return search.length > 0 ? `/?${search}#global-ranking` : "/#global-ranking";
}

export default async function Home({ searchParams }: HomePageProps) {
  await ensureAtlasPersistence();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const globalQuery = parseGlobalRankingsQuery({
    sort: resolvedSearchParams?.globalSort,
    direction: resolvedSearchParams?.globalDirection,
  });
  const economies = repository.listEconomies();
  const globalRows = repository.listGlobalRankedChains(globalQuery);
  const globalRankingColumns = createGlobalRankingColumns(economies);
  const globalVisibleColumnIds = resolveVisibleColumnIds(
    parseVisibleColumnIds(resolvedSearchParams?.globalColumns),
    globalRankingColumns,
  );
  const chainAdditionCaptcha = createArithmeticCaptcha();

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <Panel>
          <p className="text-foreground inline-flex text-xs font-medium tracking-[0.2em] uppercase">
            Public Atlas MVP
          </p>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight md:text-5xl">
            Rank chains by overall ecosystem strength and readiness.
          </h1>
          <p className="text-muted mt-4 max-w-6xl text-base leading-7 lg:max-w-none">
            See the full global ranking, compare the four economy readiness
            models side by side, and open each economy to inspect the module
            variables driving the result.
          </p>
        </Panel>
      </section>

      <section className="space-y-4" id="global-ranking">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Global chain ranking
          </p>
          <h2 className="text-foreground mt-2 text-3xl font-semibold tracking-tight">
            Holistic chain leaderboard
          </h2>
          <p className="text-muted mt-3 max-w-4xl text-base leading-7">
            One global ranking, with the active economy readiness models and
            their underlying modules available in the same table.
          </p>
        </div>

        <GlobalRankingsTable
          rows={globalRows}
          sort={globalQuery.sort}
          direction={globalQuery.direction}
          visibleColumnIds={globalVisibleColumnIds}
          columns={globalRankingColumns}
          buildSortHref={(sortKey, sortDirection) =>
            buildGlobalSortHref(
              globalVisibleColumnIds,
              globalRankingColumns,
              sortKey,
              sortDirection,
            )
          }
          buildColumnsHref={(columnIds) =>
            buildGlobalColumnsHref(
              globalQuery,
              columnIds,
              globalRankingColumns,
            )
          }
        />

        <CitationBlock />

        <AddChainRequestForm
          selectedEconomy={defaultEconomySlug}
          initialState={{
            status: "idle",
            message: "",
            chainWebsite: "",
            captchaPrompt: chainAdditionCaptcha.prompt,
            captchaToken: chainAdditionCaptcha.token,
          }}
          action={submitChainAdditionRequestAction}
        />
      </section>
    </div>
  );
}
