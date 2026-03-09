import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

import type { BuyerPersonaInput, BuyerPersonaRecord } from "@/lib/domain/types";
import { getRuntimeManagedDirectoryPath } from "@/lib/storage/runtime-path";

import { buildPersonaProfile } from "./buildPersonaProfile";
import { buildPersonaMarkdown, buildPersonaMarkdownPath } from "./markdown";
import {
  initializeBuyerPersonaStore,
  listBuyerPersonasByChainSlug,
  upsertBuyerPersona,
} from "./store";

const personasDirectory = getRuntimeManagedDirectoryPath(
  "ATLAS_PERSONAS_DIR",
  "personas",
);

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
  const { profile, organization, structuredData, sourceNotes } =
    buildPersonaProfile(input);
  const { relativePath } = buildPersonaMarkdownPath(input);
  const baseRecord: BuyerPersonaRecord = {
    id: randomUUID(),
    organization: organization || profile.chain.name,
    chainId: profile.chain.id,
    chainSlug: profile.chain.slug,
    chainUrl: input.chainUrl,
    protocolUrl: input.protocolUrl,
    personName: input.personName,
    personTitle: input.personTitle,
    linkedinProfile: input.linkedinProfile,
    twitterHandle: input.twitterHandle,
    githubProfile: input.githubProfile,
    notes: input.notes,
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
