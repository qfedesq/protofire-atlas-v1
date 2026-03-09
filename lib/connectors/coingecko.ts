import type { DataSourceSyncResult, ExternalMetricRecord } from "./types";

const coingeckoSourceUrl = "https://api.coingecko.com/api/v3/coins/markets";

type CoinGeckoChainTokenMap = Record<string, string>;

function getConfiguredChainTokenMap() {
  const raw = process.env.COINGECKO_CHAIN_TOKEN_MAP?.trim();

  if (!raw) {
    return {} as CoinGeckoChainTokenMap;
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[0] === "string" && typeof entry[1] === "string",
      ),
    );
  } catch {
    return {} as CoinGeckoChainTokenMap;
  }
}

export async function syncWithCoinGecko() {
  const chainTokenMap = getConfiguredChainTokenMap();
  const tokenIds = Object.values(chainTokenMap);

  if (tokenIds.length === 0) {
    return {
      result: {
        sourceId: "coingecko",
        sourceName: "CoinGecko",
        sourceUrl: coingeckoSourceUrl,
        status: "skipped",
        fetchedAt: new Date().toISOString(),
        recordCount: 0,
        metrics: ["marketCapUsd"],
        message:
          "Skipped because COINGECKO_CHAIN_TOKEN_MAP is not configured. Atlas needs a chain-to-token mapping to normalize native token market caps.",
        confidence: "low",
      } satisfies DataSourceSyncResult,
      records: [] as ExternalMetricRecord[],
    };
  }

  try {
    const url = new URL(coingeckoSourceUrl);
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("ids", [...new Set(tokenIds)].join(","));
    url.searchParams.set("price_change_percentage", "24h");
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`CoinGecko request failed (${response.status}).`);
    }

    const payload = (await response.json()) as Array<Record<string, unknown>>;
    const fetchedAt = new Date().toISOString();
    const tokenById = new Map(
      payload.flatMap((row) =>
        typeof row.id === "string" && typeof row.market_cap === "number"
          ? [[row.id, row.market_cap] as const]
          : [],
      ),
    );
    const records: ExternalMetricRecord[] = Object.entries(chainTokenMap).flatMap(
      ([chainSlug, tokenId]) => {
        const marketCap = tokenById.get(tokenId);

        return typeof marketCap === "number"
          ? [
              {
                chainSlug,
                metricKey: "marketCapUsd",
                value: marketCap,
                sourceName: "CoinGecko",
                sourceUrl: url.toString(),
                fetchedAt,
                normalizationNote:
                  "Mapped native-token market cap snapshots onto Atlas chains using the configured chain-to-token mapping.",
              } satisfies ExternalMetricRecord,
            ]
          : [];
      },
    );

    return {
      result: {
        sourceId: "coingecko",
        sourceName: "CoinGecko",
        sourceUrl: url.toString(),
        status: records.length > 0 ? "healthy" : "degraded",
        fetchedAt,
        recordCount: records.length,
        metrics: ["marketCapUsd"],
        message:
          records.length > 0
            ? `Captured ${records.length} market-cap snapshot rows from CoinGecko.`
            : "CoinGecko responded, but Atlas could not map any rows onto the configured chain-token map.",
        confidence: records.length > 0 ? "medium" : "low",
      } satisfies DataSourceSyncResult,
      records,
    };
  } catch (error) {
    return {
      result: {
        sourceId: "coingecko",
        sourceName: "CoinGecko",
        sourceUrl: coingeckoSourceUrl,
        status: "failed",
        fetchedAt: new Date().toISOString(),
        recordCount: 0,
        metrics: ["marketCapUsd"],
        message:
          error instanceof Error ? error.message : "Unknown CoinGecko failure.",
        confidence: "low",
      } satisfies DataSourceSyncResult,
      records: [] as ExternalMetricRecord[],
    };
  }
}
