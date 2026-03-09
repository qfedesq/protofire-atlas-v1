import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  getLatestChainTechnicalAnalysis,
  listChainTechnicalAnalysesByChainSlug,
  runChainTechnicalAnalysis,
} from "@/lib/analysis/service";

const originalAnalysesFile = process.env.ATLAS_CHAIN_ANALYSES_FILE;
const originalOpenAiKey = process.env.OPENAI_API_KEY;

describe("chain technical analysis service", () => {
  beforeEach(() => {
    process.env.ATLAS_CHAIN_ANALYSES_FILE = join(
      mkdtempSync(join(tmpdir(), "atlas-analyses-")),
      "chain-analyses.json",
    );
    delete process.env.OPENAI_API_KEY;
  });

  afterEach(() => {
    if (originalAnalysesFile) {
      process.env.ATLAS_CHAIN_ANALYSES_FILE = originalAnalysesFile;
    } else {
      delete process.env.ATLAS_CHAIN_ANALYSES_FILE;
    }

    if (originalOpenAiKey) {
      process.env.OPENAI_API_KEY = originalOpenAiKey;
    } else {
      delete process.env.OPENAI_API_KEY;
    }
  });

  it("stores a completed mock analysis when live OpenAI execution is unavailable", async () => {
    const analysis = await runChainTechnicalAnalysis({
      chainSlug: "ethereum",
      triggeredBy: "vitest@example.com",
    });

    expect(analysis.status).toBe("completed");
    expect(analysis.executionMode).toBe("mock");
    expect(analysis.modelName).toBe("gpt-5.4");
    expect(analysis.outputStructuredData?.wedgeAssessments).toHaveLength(2);
    expect(analysis.outputStructuredData?.buyerPersonaAnalysis).toBeTruthy();
    expect(analysis.outputStructuredData?.confidenceScore).toBeGreaterThan(0);
    expect(analysis.outputSummary).toMatch(/Ethereum/i);

    const latest = getLatestChainTechnicalAnalysis("ethereum");
    expect(latest?.id).toBe(analysis.id);
    expect(listChainTechnicalAnalysesByChainSlug("ethereum")).toHaveLength(1);
  });
});
