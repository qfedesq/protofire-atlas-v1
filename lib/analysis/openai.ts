import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import type {
  AnalysisSettings,
  ChainAnalysisInputSnapshot,
} from "@/lib/domain/types";

import { resolveAnalysisPromptTemplate } from "./prompt-templates";
import { chainTechnicalAnalysisStructuredOutputSchema } from "./schema";
import { buildChainTechnicalAnalysisOutput } from "./utils";

let openAiClient: OpenAI | null | undefined;

export function isOpenAIAnalysisConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function getOpenAIClient() {
  if (openAiClient === undefined) {
    openAiClient = process.env.OPENAI_API_KEY?.trim()
      ? new OpenAI({
          apiKey: process.env.OPENAI_API_KEY.trim(),
        })
      : null;
  }

  return openAiClient;
}

export async function runLiveChainTechnicalAnalysis(
  snapshot: ChainAnalysisInputSnapshot,
  settings: AnalysisSettings,
) {
  const client = getOpenAIClient();

  if (!client) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const promptTemplate = resolveAnalysisPromptTemplate(settings.promptTemplateKey);
  const response = await client.responses.parse({
    model: settings.modelName,
    instructions: promptTemplate.instructions(snapshot, settings),
    input: JSON.stringify(snapshot, null, 2),
    text: {
      format: zodTextFormat(
        chainTechnicalAnalysisStructuredOutputSchema,
        "chain_technical_analysis",
      ),
    },
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI did not return a parsed technical analysis payload.");
  }

  return buildChainTechnicalAnalysisOutput(
    snapshot,
    response.output_parsed,
    `OpenAI Responses API using model ${settings.modelName}.`,
  );
}
