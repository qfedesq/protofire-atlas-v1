import { submitChainAdditionRequestAction } from "@/app/actions/chain-addition-request";
import { EconomySwitcher } from "@/components/economy/economy-switcher";
import { IntentBeacon } from "@/components/intent/intent-beacon";
import { AddChainRequestForm } from "@/components/requests/add-chain-request-form";
import {
  createEconomyRankingColumns,
  createGlobalRankingColumns,
} from "@/components/tables/ranking-column-definitions";
import { GlobalRankingsTable } from "@/components/tables/global-rankings-table";
import { RankingsTable } from "@/components/tables/rankings-table";
import { Panel } from "@/components/ui/panel";
import {
  parseGlobalRankingsQuery,
  parseRankingsQuery,
} from "@/lib/domain/schemas";
import type {
  GlobalRankingsQuery,
  RankingsQuery,
  RankingsSortDirection,
  RankingsSortKey,
} from "@/lib/domain/types";
import {
  parseVisibleColumnIds,
  resolveVisibleColumnIds,
  serializeVisibleColumnIds,
} from "@/lib/rankings/table";
import { createArithmeticCaptcha } from "@/lib/requests/captcha";
import {
  getActiveLiquidStakingDiagnosticWeights,
  listLiquidStakingDiagnosticDimensions,
} from "@/lib/liquid-staking/diagnosis";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

const repository = createSeedChainsRepository();

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildEconomyHref(
  economy: RankingsQuery["economy"],
  query: RankingsQuery,
  globalQuery: GlobalRankingsQuery,
  globalVisibleColumnIds: string[],
  globalColumns: ReturnType<typeof createGlobalRankingColumns>,
) {
  const searchParams = new URLSearchParams();

  searchParams.set("economy", economy);

  if (query.q) {
    searchParams.set("q", query.q);
  }

  if (query.category !== "All") {
    searchParams.set("category", query.category);
  }

  if (query.sort !== "totalScore") {
    searchParams.set("sort", query.sort);
  }

  if (query.direction !== "desc") {
    searchParams.set("direction", query.direction);
  }

  const serializedGlobalColumns = serializeVisibleColumnIds(
    globalVisibleColumnIds,
    globalColumns,
  );

  if (globalQuery.sort !== "totalScore") {
    searchParams.set("globalSort", globalQuery.sort);
  }

  if (globalQuery.direction !== "desc") {
    searchParams.set("globalDirection", globalQuery.direction);
  }

  if (serializedGlobalColumns) {
    searchParams.set("globalColumns", serializedGlobalColumns);
  }

  return `/?${searchParams.toString()}`;
}

function buildSortHref(
  query: RankingsQuery,
  globalQuery: GlobalRankingsQuery,
  globalVisibleColumnIds: string[],
  globalColumns: ReturnType<typeof createGlobalRankingColumns>,
  visibleColumnIds: string[],
  columns: ReturnType<typeof createEconomyRankingColumns>,
  sort: RankingsSortKey,
  direction: RankingsSortDirection,
) {
  const searchParams = new URLSearchParams();

  searchParams.set("economy", query.economy);
  searchParams.set("sort", sort);
  searchParams.set("direction", direction);

  if (query.q) {
    searchParams.set("q", query.q);
  }

  if (query.category !== "All") {
    searchParams.set("category", query.category);
  }

  if (globalQuery.sort !== "totalScore") {
    searchParams.set("globalSort", globalQuery.sort);
  }

  if (globalQuery.direction !== "desc") {
    searchParams.set("globalDirection", globalQuery.direction);
  }

  const serializedGlobalColumns = serializeVisibleColumnIds(
    globalVisibleColumnIds,
    globalColumns,
  );

  if (serializedGlobalColumns) {
    searchParams.set("globalColumns", serializedGlobalColumns);
  }

  const serializedColumns = serializeVisibleColumnIds(visibleColumnIds, columns);

  if (serializedColumns) {
    searchParams.set("columns", serializedColumns);
  }

  return `/?${searchParams.toString()}`;
}

function buildGlobalSortHref(
  query: RankingsQuery,
  globalQuery: GlobalRankingsQuery,
  visibleColumnIds: string[],
  columns: ReturnType<typeof createEconomyRankingColumns>,
  globalVisibleColumnIds: string[],
  globalColumns: ReturnType<typeof createGlobalRankingColumns>,
  sort: GlobalRankingsQuery["sort"],
  direction: RankingsSortDirection,
) {
  const searchParams = new URLSearchParams();

  searchParams.set("economy", query.economy);

  if (query.q) {
    searchParams.set("q", query.q);
  }

  if (query.category !== "All") {
    searchParams.set("category", query.category);
  }

  if (query.sort !== "totalScore") {
    searchParams.set("sort", query.sort);
  }

  if (query.direction !== "desc") {
    searchParams.set("direction", query.direction);
  }

  const serializedColumns = serializeVisibleColumnIds(visibleColumnIds, columns);

  if (serializedColumns) {
    searchParams.set("columns", serializedColumns);
  }

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

  return `/?${searchParams.toString()}#global-ranking`;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = parseRankingsQuery(resolvedSearchParams);
  const globalQuery = parseGlobalRankingsQuery({
    sort: resolvedSearchParams?.globalSort,
    direction: resolvedSearchParams?.globalDirection,
  });
  const rows = repository.listRankedChains(query);
  const globalRows = repository.listGlobalRankedChains(globalQuery);
  const economies = repository.listEconomies();
  const economy = rows[0]?.economy ?? economies.find((item) => item.slug === query.economy);
  const rankingColumns = createEconomyRankingColumns(economy ?? economies[0]!);
  const globalRankingColumns = createGlobalRankingColumns();
  const visibleColumnIds = resolveVisibleColumnIds(
    parseVisibleColumnIds(resolvedSearchParams?.columns),
    rankingColumns,
  );
  const globalVisibleColumnIds = resolveVisibleColumnIds(
    parseVisibleColumnIds(resolvedSearchParams?.globalColumns),
    globalRankingColumns,
  );
  const liquidStakingDimensions = listLiquidStakingDiagnosticDimensions();
  const activeLiquidStakingWeights = getActiveLiquidStakingDiagnosticWeights();
  const chainAdditionCaptcha = createArithmeticCaptcha();

  if (!economy) {
    throw new Error(`Unknown economy: ${query.economy}`);
  }

  return (
    <div className="space-y-10">
      <IntentBeacon
        type="economy_selected"
        economy={economy.slug}
        context="home"
      />

      <section className="space-y-4">
        <Panel>
          <p className="text-foreground inline-flex text-xs font-medium tracking-[0.2em] uppercase">
            Public Atlas MVP
          </p>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight md:text-5xl">
            Rank chains by readiness for specific onchain economies.
          </h1>
          <p className="text-muted mt-4 max-w-6xl text-base leading-7 lg:max-w-none lg:whitespace-nowrap">
            Compare infrastructure readiness, expose missing modules, and map each gap to a deterministic Protofire deployment stack.
          </p>
        </Panel>

        <EconomySwitcher
          economies={economies}
          selectedEconomy={economy.slug}
          buildHref={(economySlug) =>
            buildEconomyHref(
              economySlug,
              query,
              globalQuery,
              globalVisibleColumnIds,
              globalRankingColumns,
            )
          }
        />
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
            This ranking combines infrastructure readiness across four economies
            with ecosystem adoption and technical performance indicators.
          </p>
        </div>
        <GlobalRankingsTable
          rows={globalRows}
          sort={globalQuery.sort}
          direction={globalQuery.direction}
          visibleColumnIds={globalVisibleColumnIds}
          buildSortHref={(sortKey, sortDirection) =>
            buildGlobalSortHref(
              query,
              globalQuery,
              visibleColumnIds,
              rankingColumns,
              globalVisibleColumnIds,
              globalRankingColumns,
              sortKey,
              sortDirection,
            )
          }
          buildColumnsHref={(columnIds) => {
            const searchParams = new URLSearchParams();

            searchParams.set("economy", query.economy);

            if (query.q) {
              searchParams.set("q", query.q);
            }

            if (query.category !== "All") {
              searchParams.set("category", query.category);
            }

            if (query.sort !== "totalScore") {
              searchParams.set("sort", query.sort);
            }

            if (query.direction !== "desc") {
              searchParams.set("direction", query.direction);
            }

            const serializedColumns = serializeVisibleColumnIds(
              visibleColumnIds,
              rankingColumns,
            );

            if (serializedColumns) {
              searchParams.set("columns", serializedColumns);
            }

            if (globalQuery.sort !== "totalScore") {
              searchParams.set("globalSort", globalQuery.sort);
            }

            if (globalQuery.direction !== "desc") {
              searchParams.set("globalDirection", globalQuery.direction);
            }

            const serializedGlobalColumns = serializeVisibleColumnIds(
              columnIds,
              globalRankingColumns,
            );

            if (serializedGlobalColumns) {
              searchParams.set("globalColumns", serializedGlobalColumns);
            }

            return `/?${searchParams.toString()}#global-ranking`;
          }}
        />
      </section>

      <section className="space-y-4" id="economy">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Selected economy
          </p>
          <h2 className="text-foreground mt-2 text-3xl font-semibold tracking-tight">
            {economy.name}
          </h2>
          <p className="text-muted mt-3 max-w-3xl text-base leading-7">
            {economy.description}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel>
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              Required modules
            </p>
            <div className="mt-4 space-y-4">
              {economy.modules.map((module) => (
                <div
                  key={module.id}
                  className="border-border/70 border-t pt-4 first:border-t-0 first:pt-0"
                >
                  <h3 className="text-foreground text-lg font-semibold">
                    {module.name}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {module.description}
                  </p>
                  {economy.slug === "defi-infrastructure" &&
                  module.slug === "liquid-staking" ? (
                    <div className="border-border/70 mt-4 border-t pt-4">
                      <p className="text-muted text-xs tracking-[0.16em] uppercase">
                        7-module LST weights
                      </p>
                      <div className="border-border/60 mt-3 divide-y">
                        {liquidStakingDimensions.map((dimension) => (
                          <div
                            key={dimension.id}
                            className="text-muted flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0"
                          >
                            <span>{dimension.name}</span>
                            <span className="text-foreground font-medium">
                              {activeLiquidStakingWeights[dimension.slug]}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-4">
            <Panel>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Deployment sequencing
              </p>
              <div className="mt-4 space-y-4">
                {economy.deploymentTemplates.map((template, index) => (
                  <div
                    key={template.key}
                    className="border-border/70 border-t pt-4 first:border-t-0 first:pt-0"
                  >
                    <p className="text-accent text-xs tracking-[0.16em] uppercase">
                      Phase {index + 1}
                    </p>
                    <h3 className="text-foreground mt-2 text-lg font-semibold">
                      {template.name}
                    </h3>
                    <p className="text-muted mt-2 text-sm leading-6">
                      {template.objective}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </section>

      <section className="space-y-4" id="ranking">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Economy ranking
          </p>
          <h2 className="text-foreground mt-2 text-3xl font-semibold tracking-tight">
            {economy.name}
          </h2>
        </div>
        <RankingsTable
          economy={economy}
          rows={rows}
          sort={query.sort}
          direction={query.direction}
          visibleColumnIds={visibleColumnIds}
          buildSortHref={(sortKey, sortDirection) =>
            buildSortHref(
              query,
              globalQuery,
              globalVisibleColumnIds,
              globalRankingColumns,
              visibleColumnIds,
              rankingColumns,
              sortKey,
              sortDirection,
            )
          }
          buildColumnsHref={(columnIds) => {
            const searchParams = new URLSearchParams();

            searchParams.set("economy", query.economy);

            if (query.q) {
              searchParams.set("q", query.q);
            }

            if (query.category !== "All") {
              searchParams.set("category", query.category);
            }

            if (query.sort !== "totalScore") {
              searchParams.set("sort", query.sort);
            }

            if (query.direction !== "desc") {
              searchParams.set("direction", query.direction);
            }

            const serializedColumns = serializeVisibleColumnIds(
              columnIds,
              rankingColumns,
            );

            if (serializedColumns) {
              searchParams.set("columns", serializedColumns);
            }

            if (globalQuery.sort !== "totalScore") {
              searchParams.set("globalSort", globalQuery.sort);
            }

            if (globalQuery.direction !== "desc") {
              searchParams.set("globalDirection", globalQuery.direction);
            }

            const serializedGlobalColumns = serializeVisibleColumnIds(
              globalVisibleColumnIds,
              globalRankingColumns,
            );

            if (serializedGlobalColumns) {
              searchParams.set("globalColumns", serializedGlobalColumns);
            }

            return `/?${searchParams.toString()}`;
          }}
        />
        <AddChainRequestForm
          selectedEconomy={economy.slug}
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
