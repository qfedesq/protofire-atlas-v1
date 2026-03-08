import type { ChainCatalogSeed, ExternalMetricKey } from "@/lib/domain/types";

import type { ExternalMetricsConnector } from "./types";

type DefiLlamaChainRow = {
  name?: string;
  gecko_id?: string;
  tvl?: number;
};

type DefiLlamaProtocolRow = {
  chains?: string[];
  chainTvls?: Record<string, unknown>;
};

const chainsEndpoint = "https://api.llama.fi/v2/chains";
const protocolsEndpoint = "https://api.llama.fi/protocols";

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function buildChainAliases(chain: ChainCatalogSeed) {
  return new Set([
    chain.slug,
    normalizeName(chain.name),
    normalizeName(chain.sourceName),
    normalizeName(chain.sourceName.replaceAll("-", " ")),
    normalizeName(chain.name.replaceAll("-", " ")),
  ]);
}

function matchChainSlug(
  rawName: string,
  chains: ChainCatalogSeed[],
): string | undefined {
  const normalizedName = normalizeName(rawName);

  return chains.find((chain) => buildChainAliases(chain).has(normalizedName))
    ?.slug;
}

function buildMetricValue(
  value: number,
  fetchedAt: string,
  sourceEndpoint: string,
  normalizationNote: string,
) {
  return {
    value,
    sourceName: "DeFiLlama",
    sourceEndpoint,
    fetchedAt,
    normalizationNote,
    freshness: "source-backed" as const,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`DeFiLlama request failed (${response.status}) for ${url}`);
  }

  return (await response.json()) as T;
}

export const defiLlamaConnector: ExternalMetricsConnector = {
  id: "defillama",
  async run(chains) {
    try {
      const fetchedAt = new Date().toISOString();
      const [chainRows, protocolRows] = await Promise.all([
        fetchJson<DefiLlamaChainRow[]>(chainsEndpoint),
        fetchJson<DefiLlamaProtocolRow[]>(protocolsEndpoint),
      ]);

      const tvlByChain = new Map<string, number>();
      const protocolCountByChain = new Map<string, number>();

      chainRows.forEach((row) => {
        if (!row.name || typeof row.tvl !== "number" || !Number.isFinite(row.tvl)) {
          return;
        }

        const chainSlug = matchChainSlug(row.name, chains);

        if (!chainSlug) {
          return;
        }

        tvlByChain.set(chainSlug, row.tvl);
      });

      protocolRows.forEach((row) => {
        const rawChains = Array.isArray(row.chains)
          ? row.chains
          : Object.keys(row.chainTvls ?? {});

        rawChains.forEach((rawChain) => {
          if (typeof rawChain !== "string" || rawChain.length === 0) {
            return;
          }

          const chainSlug = matchChainSlug(rawChain, chains);

          if (!chainSlug) {
            return;
          }

          protocolCountByChain.set(
            chainSlug,
            (protocolCountByChain.get(chainSlug) ?? 0) + 1,
          );
        });
      });

      const rows = chains
        .map((chain) => {
          const metrics: Partial<
            Record<ExternalMetricKey, ReturnType<typeof buildMetricValue>>
          > = {};

          const tvlUsd = tvlByChain.get(chain.slug);
          const protocols = protocolCountByChain.get(chain.slug);

          if (typeof tvlUsd === "number") {
            metrics.tvlUsd = buildMetricValue(
              tvlUsd,
              fetchedAt,
              chainsEndpoint,
              "Mapped DeFiLlama chain TVL rows onto the Atlas top-30 EVM chain universe.",
            );
          }

          if (typeof protocols === "number") {
            metrics.protocols = buildMetricValue(
              protocols,
              fetchedAt,
              protocolsEndpoint,
              "Counted DeFiLlama protocols with chain support on the Atlas top-30 EVM chain universe.",
            );
          }

          return {
            chainSlug: chain.slug,
            metrics,
          };
        })
        .filter((row) => Object.keys(row.metrics).length > 0);

      return {
        rows,
        status: {
          connector: "DeFiLlama",
          status: "success",
          message: `Updated ${rows.length} chain snapshots from DeFiLlama.`,
        },
      };
    } catch (error) {
      return {
        rows: [],
        status: {
          connector: "DeFiLlama",
          status: "failed",
          message:
            error instanceof Error ? error.message : "Unknown DeFiLlama failure.",
        },
      };
    }
  },
};
