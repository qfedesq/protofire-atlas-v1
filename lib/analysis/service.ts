import { randomUUID } from "node:crypto";

import { getActiveAnalysisSettings } from "@/lib/assumptions/resolve";
import type { ChainTechnicalAnalysis } from "@/lib/domain/types";

import { buildChainAnalysisInputSnapshot } from "./input";
import { runMockChainTechnicalAnalysis } from "./mock";
import { runLiveChainTechnicalAnalysis, isOpenAIAnalysisConfigured } from "./openai";
import {
  getChainTechnicalAnalysisById,
  getLatestChainTechnicalAnalysis,
  initializeChainTechnicalAnalysisStore,
  listChainTechnicalAnalyses,
  listChainTechnicalAnalysesByChainSlug,
  upsertChainTechnicalAnalysis,
} from "./store";
import { buildChainTechnicalAnalysisSummary } from "./utils";

type RunChainTechnicalAnalysisInput = {
  chainSlug: string;
  triggeredBy: string;
};

async function createQueuedAnalysis(
  input: RunChainTechnicalAnalysisInput,
): Promise<ChainTechnicalAnalysis> {
  const settings = getActiveAnalysisSettings();
  const inputSnapshot = buildChainAnalysisInputSnapshot(input.chainSlug);

  const queuedAnalysis: ChainTechnicalAnalysis = {
    id: randomUUID(),
    chainId: inputSnapshot.chain.id,
    chainSlug: input.chainSlug,
    triggeredBy: input.triggeredBy,
    modelName: settings.modelName,
    executionMode: "mock",
    analysisType: "gpt-5.4-strategic-analysis",
    status: "queued",
    inputSnapshot,
    outputSummary: null,
    outputStructuredData: null,
    createdAt: new Date().toISOString(),
    completedAt: null,
    errorMessage: null,
  };

  await upsertChainTechnicalAnalysis(queuedAnalysis);

  return queuedAnalysis;
}

export async function runChainTechnicalAnalysis({
  chainSlug,
  triggeredBy,
}: RunChainTechnicalAnalysisInput) {
  await initializeChainTechnicalAnalysisStore();
  const settings = getActiveAnalysisSettings();
  const queuedAnalysis = await createQueuedAnalysis({ chainSlug, triggeredBy });
  const runningAnalysis: ChainTechnicalAnalysis = {
    ...queuedAnalysis,
    status: "running",
  };

  await upsertChainTechnicalAnalysis(runningAnalysis);

  try {
    const liveEnabled = isOpenAIAnalysisConfigured();
    let executionMode: ChainTechnicalAnalysis["executionMode"] = "mock";
    let outputStructuredData;

    if (liveEnabled) {
      try {
        outputStructuredData = await runLiveChainTechnicalAnalysis(
          runningAnalysis.inputSnapshot,
          settings,
        );
        executionMode = "live";
      } catch (error) {
        if (!settings.useMockWhenUnavailable) {
          throw error;
        }

        outputStructuredData = runMockChainTechnicalAnalysis(
          runningAnalysis.inputSnapshot,
          settings,
        );
        outputStructuredData.confidenceNotes = [
          ...outputStructuredData.confidenceNotes,
          `OpenAI execution failed and Atlas fell back to deterministic mock mode: ${
            error instanceof Error ? error.message : "Unknown OpenAI failure."
          }`,
        ];
      }
    } else if (settings.useMockWhenUnavailable) {
      outputStructuredData = runMockChainTechnicalAnalysis(
        runningAnalysis.inputSnapshot,
        settings,
      );
    } else {
      throw new Error(
        "OpenAI analysis is unavailable because OPENAI_API_KEY is not configured and mock mode is disabled.",
      );
    }

    const completedAnalysis: ChainTechnicalAnalysis = {
      ...runningAnalysis,
      status: "completed",
      executionMode,
      outputStructuredData,
      outputSummary: buildChainTechnicalAnalysisSummary(
        runningAnalysis.inputSnapshot,
        outputStructuredData,
      ),
      completedAt: new Date().toISOString(),
      errorMessage: null,
    };

    await upsertChainTechnicalAnalysis(completedAnalysis);

    return completedAnalysis;
  } catch (error) {
    const failedAnalysis: ChainTechnicalAnalysis = {
      ...runningAnalysis,
      status: "failed",
      completedAt: new Date().toISOString(),
      errorMessage:
        error instanceof Error ? error.message : "Unknown analysis failure.",
    };

    await upsertChainTechnicalAnalysis(failedAnalysis);

    return failedAnalysis;
  }
}

export async function initializeChainAnalysisSystem() {
  await initializeChainTechnicalAnalysisStore();
}

export {
  getChainTechnicalAnalysisById,
  getLatestChainTechnicalAnalysis,
  listChainTechnicalAnalyses,
  listChainTechnicalAnalysesByChainSlug,
};
