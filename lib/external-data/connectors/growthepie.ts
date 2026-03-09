import { request } from "node:https";

import { growThePieMetricsBaseUrl } from "@/lib/external-data/config";
import type {
  ChainCatalogSeed,
  ExternalMetricKey,
  ExternalMetricSnapshotValue,
} from "@/lib/domain/types";

import type { ExternalMetricsConnector, ExternalMetricsConnectorResult } from "./types";

type GrowThePieMetricConfig = {
  metricKey: ExternalMetricKey;
  endpoint: string;
  normalizationNote: string;
};

type GrowThePieRow = {
  origin_key?: string;
  date?: string;
  value?: number | string;
};

const metricConfigs: GrowThePieMetricConfig[] = [
  {
    metricKey: "activeUsers",
    endpoint: "daa.json",
    normalizationNote:
      "Mapped growthepie daily active address exports onto the Atlas chain universe using chain slug, name, and source-name aliases. Atlas treats this as an activity-based active-user proxy.",
  },
  {
    metricKey: "transactions",
    endpoint: "txcount.json",
    normalizationNote:
      "Mapped growthepie transaction-count exports onto the Atlas chain universe using chain slug, name, and source-name aliases.",
  },
  {
    metricKey: "throughputIndicator",
    endpoint: "gas_per_second.json",
    normalizationNote:
      "Mapped growthepie gas-per-second exports onto the Atlas chain universe as a public throughput proxy when no better source-backed throughput row is available.",
  },
];

function normalizeChainSlug(rawValue: string, chains: ChainCatalogSeed[]) {
  const normalizedValue = rawValue.trim().toLowerCase();
  const matchedChain = chains.find(
    (chain) =>
      chain.slug === normalizedValue ||
      chain.name.trim().toLowerCase() === normalizedValue ||
      chain.sourceName.trim().toLowerCase() === normalizedValue,
  );

  return matchedChain?.slug;
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replaceAll(",", ""));

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function getLatestRowsByChain(rows: GrowThePieRow[], chains: ChainCatalogSeed[]) {
  const latestByChain = new Map<
    string,
    {
      value: number;
      fetchedDate: string;
    }
  >();

  rows.forEach((row) => {
    if (typeof row.origin_key !== "string" || typeof row.date !== "string") {
      return;
    }

    const chainSlug = normalizeChainSlug(row.origin_key, chains);
    const value = toNumber(row.value);

    if (!chainSlug || typeof value !== "number") {
      return;
    }

    const existing = latestByChain.get(chainSlug);

    if (!existing || row.date > existing.fetchedDate) {
      latestByChain.set(chainSlug, {
        value,
        fetchedDate: row.date,
      });
    }
  });

  return latestByChain;
}

async function fetchMetricRows(endpoint: string) {
  const url = new URL(`${growThePieMetricsBaseUrl}/${endpoint}`);
  let payload: unknown;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`growthepie request failed (${response.status}) for ${endpoint}.`);
    }

    payload = await response.json();
  } catch {
    payload = await new Promise<unknown>((resolve, reject) => {
      const req = request(
        url,
        {
          method: "GET",
          family: 4,
          headers: {
            Accept: "application/json",
          },
        },
        (response) => {
          const chunks: Buffer[] = [];

          response.on("data", (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          });

          response.on("end", () => {
            const body = Buffer.concat(chunks).toString("utf8");

            if ((response.statusCode ?? 500) >= 400) {
              reject(
                new Error(
                  `growthepie request failed (${response.statusCode ?? 500}) for ${endpoint}.`,
                ),
              );
              return;
            }

            try {
              resolve(JSON.parse(body));
            } catch (error) {
              reject(error);
            }
          });
        },
      );

      req.on("error", reject);
      req.end();
    });
  }

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter(
    (item): item is GrowThePieRow =>
      typeof item === "object" && item !== null && !Array.isArray(item),
  );
}

export const growThePieConnector: ExternalMetricsConnector = {
  id: "growthepie",
  async run(chains): Promise<ExternalMetricsConnectorResult> {
    try {
      const rowsByChain = new Map<
        string,
        Partial<Record<ExternalMetricKey, ExternalMetricSnapshotValue>>
      >();
      const fetchedAt = new Date().toISOString();

      for (const metricConfig of metricConfigs) {
        const rows = await fetchMetricRows(metricConfig.endpoint);
        const latestRows = getLatestRowsByChain(rows, chains);

        latestRows.forEach((snapshot, chainSlug) => {
          const chainMetrics = rowsByChain.get(chainSlug) ?? {};

          chainMetrics[metricConfig.metricKey] = {
            value: snapshot.value,
            sourceName: "growthepie",
            sourceEndpoint: `${growThePieMetricsBaseUrl}/${metricConfig.endpoint}`,
            fetchedAt,
            normalizationNote: metricConfig.normalizationNote,
            freshness: "source-backed",
          };

          rowsByChain.set(chainSlug, chainMetrics);
        });
      }

      return {
        rows: [...rowsByChain.entries()].map(([chainSlug, metrics]) => ({
          chainSlug,
          metrics,
        })),
        status: {
          connector: "growthepie",
          status: "success",
          message: `Updated ${rowsByChain.size} chain snapshots from growthepie.`,
        },
      };
    } catch (error) {
      return {
        rows: [],
        status: {
          connector: "growthepie",
          status: "failed",
          message:
            error instanceof Error ? error.message : "Unknown growthepie failure.",
        },
      };
    }
  },
};
