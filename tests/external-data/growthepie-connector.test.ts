import { afterEach, describe, expect, it, vi } from "vitest";

import { chainCatalogSeeds } from "@/data/seed/catalog";
import { growThePieConnector } from "@/lib/external-data/connectors/growthepie";

describe("growthepie connector", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("maps latest public growthepie rows onto Atlas chains", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { origin_key: "base", date: "2026-03-01", value: 120 },
          { origin_key: "base", date: "2026-03-03", value: 180 },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { origin_key: "base", date: "2026-03-02", value: 1000 },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { origin_key: "base", date: "2026-03-02", value: 2.5 },
        ],
      });

    vi.stubGlobal("fetch", fetchMock);

    const result = await growThePieConnector.run(chainCatalogSeeds);

    expect(result.status.connector).toBe("growthepie");
    expect(result.status.status).toBe("success");
    expect(result.rows).toEqual([
      expect.objectContaining({
        chainSlug: "base",
        metrics: expect.objectContaining({
          activeUsers: expect.objectContaining({ value: 180 }),
          transactions: expect.objectContaining({ value: 1000 }),
          throughputIndicator: expect.objectContaining({ value: 2.5 }),
        }),
      }),
    ]);
  });
});
