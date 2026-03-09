import { afterEach, describe, expect, it, vi } from "vitest";

import { syncWithCoinGecko } from "@/lib/connectors/coingecko";

describe("CoinGecko connector", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns a skipped result when the chain-token map is not configured", async () => {
    vi.stubEnv("COINGECKO_CHAIN_TOKEN_MAP", "");

    const result = await syncWithCoinGecko();

    expect(result.result.status).toBe("skipped");
    expect(result.records).toEqual([]);
  });

  it("normalizes configured market-cap rows into Atlas records", async () => {
    vi.stubEnv(
      "COINGECKO_CHAIN_TOKEN_MAP",
      JSON.stringify({
        ethereum: "ethereum",
        arbitrum: "ethereum",
      }),
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: "ethereum",
            market_cap: 123456789,
          },
        ],
      }),
    );

    const result = await syncWithCoinGecko();

    expect(result.result.status).toBe("healthy");
    expect(result.records).toEqual([
      expect.objectContaining({
        chainSlug: "ethereum",
        metricKey: "marketCapUsd",
        value: 123456789,
      }),
      expect.objectContaining({
        chainSlug: "arbitrum",
        metricKey: "marketCapUsd",
        value: 123456789,
      }),
    ]);
  });
});
