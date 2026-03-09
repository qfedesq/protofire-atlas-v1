import { existsSync, readFileSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createBuyerPersona, listChainBuyerPersonas } from "@/lib/personas/service";

const originalBuyerPersonasFile = process.env.ATLAS_BUYER_PERSONAS_FILE;
const originalPersonasDir = process.env.ATLAS_PERSONAS_DIR;

describe("buyer persona service", () => {
  beforeEach(() => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "atlas-personas-"));
    process.env.ATLAS_BUYER_PERSONAS_FILE = join(
      tempDirectory,
      "buyer-personas.json",
    );
    process.env.ATLAS_PERSONAS_DIR = join(tempDirectory, "personas");
  });

  afterEach(() => {
    if (originalBuyerPersonasFile) {
      process.env.ATLAS_BUYER_PERSONAS_FILE = originalBuyerPersonasFile;
    } else {
      delete process.env.ATLAS_BUYER_PERSONAS_FILE;
    }

    if (originalPersonasDir) {
      process.env.ATLAS_PERSONAS_DIR = originalPersonasDir;
    } else {
      delete process.env.ATLAS_PERSONAS_DIR;
    }
  });

  it("builds and persists a markdown-backed buyer persona", async () => {
    const persona = await createBuyerPersona(
      {
        chainSlug: "ethereum",
        chainUrl: "https://ethereum.org",
        personName: "Taylor",
        personTitle: "Ecosystem Lead",
        linkedinProfile: "https://linkedin.com/in/taylor",
      },
      "vitest@example.com",
    );

    expect(persona.executionMode).toBe("mock");
    expect(persona.modelName).toBe("atlas-mock-persona-v1");
    expect(persona.markdownPath.endsWith(".md")).toBe(true);
    expect(existsSync(persona.markdownPath)).toBe(true);
    expect(readFileSync(persona.markdownPath, "utf8")).toContain("# Taylor");
    expect(listChainBuyerPersonas("ethereum")).toHaveLength(1);
  });
});
