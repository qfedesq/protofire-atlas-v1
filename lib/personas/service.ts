import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

import type { BuyerPersonaInput, BuyerPersonaRecord } from "@/lib/domain/types";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { getRuntimeManagedDirectoryPath } from "@/lib/storage/runtime-path";

import { buildPersonaMarkdown, buildPersonaMarkdownPath } from "./markdown";
import { buildMockBuyerPersona } from "./mock";
import {
  initializeBuyerPersonaStore,
  listBuyerPersonasByChainSlug,
  upsertBuyerPersona,
} from "./store";

const personasDirectory = getRuntimeManagedDirectoryPath(
  "ATLAS_PERSONAS_DIR",
  "personas",
);

const repository = createSeedChainsRepository();

function writePersonaMarkdown(relativePath: string, content: string) {
  const fullPath = join(personasDirectory, relativePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, `${content.trim()}\n`);

  return fullPath;
}

export async function createBuyerPersona(
  input: BuyerPersonaInput,
  generatedBy: string,
) {
  await initializeBuyerPersonaStore();
  const profile = repository.getChainProfileBySlug(input.chainSlug);

  if (!profile) {
    throw new Error(`Unknown chain "${input.chainSlug}" for persona builder.`);
  }

  const { organization, relativePath } = buildPersonaMarkdownPath(input);
  const structuredData = buildMockBuyerPersona(input, profile);
  const sourceNotes = [
    input.chainUrl,
    profile.chain.roadmap.sourceUrl ?? profile.chain.roadmap.sourceLabel,
    input.linkedinProfile ?? "Manual persona input",
    input.twitterHandle ? `https://x.com/${input.twitterHandle.replace(/^@/, "")}` : "No Twitter handle provided",
    input.githubProfile ?? "No GitHub profile provided",
  ];
  const baseRecord: BuyerPersonaRecord = {
    id: randomUUID(),
    organization,
    chainId: profile.chain.id,
    chainSlug: profile.chain.slug,
    chainUrl: input.chainUrl,
    protocolUrl: input.protocolUrl,
    personName: input.personName,
    personTitle: input.personTitle,
    linkedinProfile: input.linkedinProfile,
    twitterHandle: input.twitterHandle,
    githubProfile: input.githubProfile,
    markdownPath: "",
    markdownContent: "",
    structuredData,
    modelName: "atlas-mock-persona-v1",
    executionMode: "mock",
    sourceNotes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    generatedBy,
  };
  const markdownContent = buildPersonaMarkdown(baseRecord);
  const markdownPath = writePersonaMarkdown(relativePath, markdownContent);
  const record = {
    ...baseRecord,
    markdownPath,
    markdownContent,
  };

  await upsertBuyerPersona(record);

  return record;
}

export function listChainBuyerPersonas(chainSlug: string) {
  return listBuyerPersonasByChainSlug(chainSlug);
}
