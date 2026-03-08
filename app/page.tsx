import { submitChainAdditionRequestAction } from "@/app/actions/chain-addition-request";
import { EconomySwitcher } from "@/components/economy/economy-switcher";
import { IntentBeacon } from "@/components/intent/intent-beacon";
import { AddChainRequestForm } from "@/components/requests/add-chain-request-form";
import { RankingsTable } from "@/components/tables/rankings-table";
import { Panel } from "@/components/ui/panel";
import { parseRankingsQuery } from "@/lib/domain/schemas";
import type {
  RankingsQuery,
  RankingsSortDirection,
  RankingsSortKey,
} from "@/lib/domain/types";
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
  const economies = repository.listEconomies();
  const economy = rows[0]?.economy ?? economies.find((item) => item.slug === query.economy);
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
                    <div className="bg-surface-muted mt-4 rounded-2xl p-4">
                      <p className="text-muted text-xs tracking-[0.16em] uppercase">
                        7-module LST weights
                      </p>
                      <div className="mt-3 space-y-2">
                        {liquidStakingDimensions.map((dimension) => (
                          <div
                            key={dimension.id}
                            className="text-muted flex items-center justify-between gap-3 text-sm"
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
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Top 30 EVM chains by TVL
        </p>
        <RankingsTable
          economy={economy}
          rows={rows}
          sort={query.sort}
          direction={query.direction}
          buildSortHref={(sortKey, sortDirection) =>
            buildSortHref(query, sortKey, sortDirection)
          }
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
