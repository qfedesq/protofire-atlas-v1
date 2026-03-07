import { EconomySwitcher } from "@/components/economy/economy-switcher";
import { IntentBeacon } from "@/components/intent/intent-beacon";
import { RankingsTable } from "@/components/tables/rankings-table";
import { Panel } from "@/components/ui/panel";
import { atlasDatasetLabel, atlasDatasetSummary } from "@/lib/config/dataset";
import { parseRankingsQuery } from "@/lib/domain/schemas";
import type {
  RankingsQuery,
  RankingsSortDirection,
  RankingsSortKey,
} from "@/lib/domain/types";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

const repository = createSeedChainsRepository();

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildEconomyHref(
  economy: RankingsQuery["economy"],
  query: RankingsQuery,
) {
  return buildHomeHref(query, { economy });
}

function buildSortHref(
  query: RankingsQuery,
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

  return `/?${searchParams.toString()}`;
}

function buildHomeHref(
  query: RankingsQuery,
  overrides: Partial<
    Pick<RankingsQuery, "economy" | "q" | "category" | "sort" | "direction">
  >,
) {
  const searchParams = new URLSearchParams();
  const nextQuery = {
    ...query,
    ...overrides,
  };

  searchParams.set("economy", nextQuery.economy);

  if (nextQuery.q) {
    searchParams.set("q", nextQuery.q);
  }

  if (nextQuery.category !== "All") {
    searchParams.set("category", nextQuery.category);
  }

  if (nextQuery.sort !== "totalScore") {
    searchParams.set("sort", nextQuery.sort);
  }

  if (nextQuery.direction !== "desc") {
    searchParams.set("direction", nextQuery.direction);
  }

  const search = searchParams.toString();

  return search.length > 0 ? `/?${search}` : "/";
}

export default async function Home({ searchParams }: HomePageProps) {
  const query = parseRankingsQuery(
    searchParams ? await searchParams : undefined,
  );
  const rows = repository.listRankedChains(query);
  const chains = repository.listChains();
  const economies = repository.listEconomies();
  const economy = rows[0]?.economy ?? economies.find((item) => item.slug === query.economy);

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
        <Panel className="protofire-dark-panel text-white">
          <p className="text-xs tracking-[0.2em] text-slate-300 uppercase">
            Public Atlas MVP
          </p>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight md:text-5xl">
            Rank chains by readiness for specific onchain economies.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200">
            Compare infrastructure readiness, expose missing modules, and map
            each gap to a deterministic Protofire deployment stack.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Dataset basis: {atlasDatasetSummary}. Atlas uses a curated snapshot,
            not live synchronization.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="protofire-hero-metric rounded-2xl border p-4">
              <p className="text-sm font-medium text-white">
                {chains.length} seeded chains
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Top 30 EVM selection documented from DeFiLlama TVL.
              </p>
            </div>
            <div className="protofire-hero-metric rounded-2xl border p-4">
              <p className="text-sm font-medium text-white">
                {economies.length} economy wedges
              </p>
              <p className="mt-2 text-sm text-slate-300">
                AI Agents, DeFi, RWA, and Prediction Markets.
              </p>
            </div>
            <div className="protofire-hero-metric rounded-2xl border p-4">
              <p className="text-sm font-medium text-white">0 runtime AI</p>
              <p className="mt-2 text-sm text-slate-300">
                Rule-based scoring and recommendations only.
              </p>
            </div>
          </div>
        </Panel>

        <EconomySwitcher
          economies={economies}
          selectedEconomy={economy.slug}
          buildHref={(economySlug) => buildEconomyHref(economySlug, query)}
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

        <div className="grid gap-4 lg:grid-cols-[1.1fr_1.3fr]">
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
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-foreground text-lg font-semibold">
                      {module.name}
                    </h3>
                    <p className="text-muted text-sm">{module.weight}% weight</p>
                  </div>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {module.description}
                  </p>
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

            <Panel>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Scoring baseline
              </p>
              <p className="text-muted mt-3 text-sm leading-6">
                {atlasDatasetLabel}. Rankings are derived from curated readiness
                statuses on top of that fixed chain universe.
              </p>
              <p className="text-muted mt-3 text-sm leading-6">
                Status mapping is fixed across all wedges: missing = 0, partial =
                0.5, available = 1.
              </p>
            </Panel>
          </div>
        </div>
      </section>

      <section className="space-y-4" id="ranking">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Top 30 EVM chains by TVL
            </p>
            <p className="text-muted mt-2 max-w-3xl text-sm leading-6">
              Current ranking for {economy.name}. Scores reflect the current
              Atlas dataset and active assumptions, not live synchronization.
            </p>
          </div>
        </div>
        <RankingsTable
          economy={economy}
          rows={rows}
          sort={query.sort}
          direction={query.direction}
          buildSortHref={(sortKey, sortDirection) =>
            buildSortHref(query, sortKey, sortDirection)
          }
        />
      </section>
    </div>
  );
}
