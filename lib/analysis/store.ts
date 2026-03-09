import { parseChainTechnicalAnalysis } from "@/lib/domain/schemas";
import type { ChainTechnicalAnalysis } from "@/lib/domain/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";
import { getRuntimeManagedFilePath } from "@/lib/storage/runtime-path";

function getChainTechnicalAnalysesFilePath() {
  return getRuntimeManagedFilePath(
    "ATLAS_CHAIN_ANALYSES_FILE",
    "data/runtime/chain-technical-analyses.json",
  );
}

function validateChainTechnicalAnalyses(input: unknown) {
  if (!Array.isArray(input)) {
    return [] as ChainTechnicalAnalysis[];
  }

  return input.map((item) => parseChainTechnicalAnalysis(item));
}

const chainTechnicalAnalysesStore = createPersistentJsonStore<
  ChainTechnicalAnalysis[]
>({
  key: "chain-technical-analyses",
  getFilePath: getChainTechnicalAnalysesFilePath,
  fallback: [],
  validate: validateChainTechnicalAnalyses,
});

export async function initializeChainTechnicalAnalysisStore() {
  return chainTechnicalAnalysesStore.initialize();
}

export function listChainTechnicalAnalyses() {
  return chainTechnicalAnalysesStore.getSnapshot();
}

export function getChainTechnicalAnalysisById(id: string) {
  return listChainTechnicalAnalyses().find((analysis) => analysis.id === id) ?? null;
}

export function listChainTechnicalAnalysesByChainSlug(chainSlug: string) {
  return listChainTechnicalAnalyses()
    .filter((analysis) => analysis.chainSlug === chainSlug)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function getLatestChainTechnicalAnalysis(chainSlug: string) {
  return listChainTechnicalAnalysesByChainSlug(chainSlug)[0] ?? null;
}

export async function upsertChainTechnicalAnalysis(
  analysis: ChainTechnicalAnalysis,
) {
  const current = listChainTechnicalAnalyses().filter(
    (item) => item.id !== analysis.id,
  );
  const next = [analysis, ...current].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );

  await chainTechnicalAnalysesStore.save(next);

  return analysis;
}
