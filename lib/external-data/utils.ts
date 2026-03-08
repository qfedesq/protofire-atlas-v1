import type {
  Chain,
  ChainCatalogSeed,
  ExternalChainMetricsSnapshot,
  ExternalMetricKey,
  ExternalMetricSnapshotValue,
  ExternalMetricsSnapshot,
} from "@/lib/domain/types";

export type NormalizedConnectorMetricRow = {
  chainSlug: string;
  metrics: Partial<Record<ExternalMetricKey, ExternalMetricSnapshotValue>>;
};

type RowCandidate = Record<string, unknown>;
type ChainMatcher = Pick<Chain | ChainCatalogSeed, "slug" | "name" | "sourceName">;

const chainNameAliases = [
  "chainSlug",
  "slug",
  "chain",
  "chain_name",
  "chainName",
  "network",
  "name",
];

function getFirstNumber(row: RowCandidate, aliases: readonly string[]) {
  for (const alias of aliases) {
    const value = row[alias];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value.replaceAll(",", ""));

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function getNormalizedChainSlug(
  row: RowCandidate,
  chains: ChainMatcher[],
): string | undefined {
  for (const alias of chainNameAliases) {
    const rawValue = row[alias];

    if (typeof rawValue !== "string") {
      continue;
    }

    const normalizedValue = rawValue.trim().toLowerCase();
    const matchedChain = chains.find(
      (chain) =>
        chain.slug === normalizedValue ||
        chain.name.trim().toLowerCase() === normalizedValue ||
        chain.sourceName.trim().toLowerCase() === normalizedValue,
    );

    if (matchedChain) {
      return matchedChain.slug;
    }
  }

  return undefined;
}

export function extractRowsFromPayload(payload: unknown): RowCandidate[] {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is RowCandidate =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return [];
  }

  const record = payload as Record<string, unknown>;

  if (Array.isArray(record.data)) {
    return extractRowsFromPayload(record.data);
  }

  if (Array.isArray(record.rows)) {
    return extractRowsFromPayload(record.rows);
  }

  if (
    typeof record.result === "object" &&
    record.result !== null &&
    !Array.isArray(record.result)
  ) {
    return extractRowsFromPayload(
      (record.result as Record<string, unknown>).rows ?? [],
    );
  }

  return [];
}

export function normalizeConnectorRows(params: {
  rows: RowCandidate[];
  chains: ChainMatcher[];
  sourceName: string;
  sourceEndpoint: string;
  fetchedAt: string;
  normalizationNote: string;
  metricAliases: Partial<Record<ExternalMetricKey, readonly string[]>>;
}): NormalizedConnectorMetricRow[] {
  const { rows, chains, sourceName, sourceEndpoint, fetchedAt, normalizationNote, metricAliases } =
    params;

  const normalizedRows: NormalizedConnectorMetricRow[] = [];

  rows.forEach((row) => {
    const chainSlug = getNormalizedChainSlug(row, chains);

    if (!chainSlug) {
      return;
    }

    const metrics = Object.entries(metricAliases).reduce<
      Partial<Record<ExternalMetricKey, ExternalMetricSnapshotValue>>
    >((acc, [metricKey, aliases]) => {
      const value = getFirstNumber(row, aliases ?? []);

      if (typeof value !== "number") {
        return acc;
      }

      acc[metricKey as ExternalMetricKey] = {
        value,
        sourceName,
        sourceEndpoint,
        fetchedAt,
        normalizationNote,
        freshness: "source-backed",
      };

      return acc;
    }, {});

    if (Object.keys(metrics).length === 0) {
      return;
    }

    normalizedRows.push({
      chainSlug,
      metrics,
    });
  });

  return normalizedRows;
}

export function mergeSnapshotRows(
  baseline: ExternalMetricsSnapshot,
  patches: NormalizedConnectorMetricRow[],
  connectorStates: ExternalMetricsSnapshot["connectors"],
  updatedAt: string,
): ExternalMetricsSnapshot {
  const rowsBySlug = new Map(
    baseline.chains.map((chainSnapshot) => [chainSnapshot.chainSlug, chainSnapshot]),
  );

  patches.forEach((patch) => {
    const existingRow =
      rowsBySlug.get(patch.chainSlug) ??
      ({
        chainSlug: patch.chainSlug,
        metrics: {},
      } satisfies ExternalChainMetricsSnapshot);

    rowsBySlug.set(patch.chainSlug, {
      chainSlug: patch.chainSlug,
      metrics: {
        ...existingRow.metrics,
        ...patch.metrics,
      },
    });
  });

  return {
    updatedAt,
    sourceNote: baseline.sourceNote,
    connectors: connectorStates,
    chains: [...rowsBySlug.values()].sort((left, right) =>
      left.chainSlug.localeCompare(right.chainSlug),
    ),
  };
}
