import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/external-data/service", () => ({
  syncExternalMetricsSnapshot: vi.fn().mockResolvedValue({
    updatedAt: "2026-03-08T12:00:00.000Z",
    connectors: [
      {
        connector: "DeFiLlama",
        status: "success",
        message: "Updated 30 chain snapshots from DeFiLlama.",
      },
    ],
  }),
}));

import { runAtlasSyncNow } from "@/lib/admin/sync";

describe("runAtlasSyncNow", () => {
  it("runs the in-process external metrics refresh instead of shelling out", async () => {
    const result = await runAtlasSyncNow();

    expect(result.completedAt).toBe("2026-03-08T12:00:00.000Z");
    expect(result.connectors).toEqual([
      {
        connector: "DeFiLlama",
        status: "success",
        message: "Updated 30 chain snapshots from DeFiLlama.",
      },
    ]);
  });
});
