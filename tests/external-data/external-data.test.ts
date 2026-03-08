import { describe, expect, it } from "vitest";

import { chainCatalogSeeds } from "@/data/seed/catalog";
import { buildFallbackExternalMetricsSnapshot } from "@/lib/external-data/baseline";
import {
  mergeSnapshotRows,
  normalizeConnectorRows,
} from "@/lib/external-data/utils";

describe("external data layer", () => {
  it("builds a fallback snapshot for the full Atlas chain universe", () => {
    const snapshot = buildFallbackExternalMetricsSnapshot();

    expect(snapshot.chains).toHaveLength(chainCatalogSeeds.length);
    expect(snapshot.connectors[0]?.connector).toBe("atlas-fallback");
    expect(snapshot.chains[0]?.metrics.wallets?.freshness).toBe("fallback");
  });

  it("normalizes connector rows onto Atlas chain slugs", () => {
    const rows = normalizeConnectorRows({
      rows: [
        {
          chain: "Ethereum",
          wallets: 123,
          active_users: 45,
        },
      ],
      chains: chainCatalogSeeds,
      sourceName: "Test Source",
      sourceEndpoint: "https://example.com/source",
      fetchedAt: "2026-03-08T00:00:00.000Z",
      normalizationNote: "Test normalization",
      metricAliases: {
        wallets: ["wallets"],
        activeUsers: ["active_users"],
      },
    });

    expect(rows).toEqual([
      {
        chainSlug: "ethereum",
        metrics: {
          wallets: expect.objectContaining({ value: 123 }),
          activeUsers: expect.objectContaining({ value: 45 }),
        },
      },
    ]);
  });

  it("preserves existing fallback metrics when a connector overlays only one field", () => {
    const baseline = buildFallbackExternalMetricsSnapshot();
    const ethereumFallbackWallets =
      baseline.chains.find((chain) => chain.chainSlug === "ethereum")?.metrics.wallets
        ?.value ?? 0;

    const merged = mergeSnapshotRows(
      baseline,
      [
        {
          chainSlug: "ethereum",
          metrics: {
            protocols: {
              value: 999,
              sourceName: "Connector",
              sourceEndpoint: "https://example.com",
              fetchedAt: "2026-03-08T00:00:00.000Z",
              normalizationNote: "Connector overlay",
              freshness: "source-backed",
            },
          },
        },
      ],
      baseline.connectors,
      "2026-03-08T00:00:00.000Z",
    );

    const mergedEthereum = merged.chains.find((chain) => chain.chainSlug === "ethereum");

    expect(mergedEthereum?.metrics.protocols?.value).toBe(999);
    expect(mergedEthereum?.metrics.wallets?.value).toBe(ethereumFallbackWallets);
  });
});
