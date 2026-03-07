import { describe, expect, it } from "vitest";

import { chainCatalogSeeds } from "@/data/seed/catalog";
import { chainEconomySeedRecords } from "@/data/seed/economies";
import { economyTypes } from "@/lib/config/economies";
import { validateAtlasSeedDataset } from "@/lib/domain/schemas";

describe("seed data validation", () => {
  it("accepts the current multi-economy seeded benchmark dataset", () => {
    const parsedDataset = validateAtlasSeedDataset({
      chains: chainCatalogSeeds,
      economies: economyTypes,
      records: chainEconomySeedRecords,
    });

    expect(parsedDataset.chains).toHaveLength(30);
    expect(parsedDataset.economies).toHaveLength(4);
    expect(parsedDataset.records).toHaveLength(120);
  });

  it("rejects duplicate chain economy records", () => {
    const duplicateRecords = [
      chainEconomySeedRecords[0],
      {
        ...chainEconomySeedRecords[0],
      },
    ];

    expect(() =>
      validateAtlasSeedDataset({
        chains: chainCatalogSeeds,
        economies: economyTypes,
        records: duplicateRecords,
      }),
    ).toThrow(/Duplicate chain economy record/);
  });

  it("rejects mismatched module sets for an economy record", () => {
    const invalidRecords = chainEconomySeedRecords.map((record, index) =>
      index === 0
        ? {
            ...record,
            moduleStatuses: {
              ...record.moduleStatuses,
              extra: record.moduleStatuses[Object.keys(record.moduleStatuses)[0]!],
            },
          }
        : record,
    );

    expect(() =>
      validateAtlasSeedDataset({
        chains: chainCatalogSeeds,
        economies: economyTypes,
        records: invalidRecords,
      }),
    ).toThrow(/do not match the configured module catalog/i);
  });
});
