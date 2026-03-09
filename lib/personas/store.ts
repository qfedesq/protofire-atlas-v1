import { parseBuyerPersonaRecord } from "@/lib/domain/schemas";
import type { BuyerPersonaRecord } from "@/lib/domain/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";
import { getRuntimeManagedFilePath } from "@/lib/storage/runtime-path";

function getBuyerPersonasFilePath() {
  return getRuntimeManagedFilePath(
    "ATLAS_BUYER_PERSONAS_FILE",
    "data/runtime/buyer-personas.json",
  );
}

function validateBuyerPersonas(input: unknown) {
  if (!Array.isArray(input)) {
    return [] as BuyerPersonaRecord[];
  }

  return input.map((item) => parseBuyerPersonaRecord(item));
}

const buyerPersonasStore = createPersistentJsonStore<BuyerPersonaRecord[]>({
  key: "buyer-personas",
  getFilePath: getBuyerPersonasFilePath,
  fallback: [],
  validate: validateBuyerPersonas,
});

export async function initializeBuyerPersonaStore() {
  return buyerPersonasStore.initialize();
}

export function listBuyerPersonas() {
  return buyerPersonasStore.getSnapshot();
}

export function listBuyerPersonasByChainSlug(chainSlug: string) {
  return listBuyerPersonas()
    .filter((persona) => persona.chainSlug === chainSlug)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function getBuyerPersonaById(id: string) {
  return listBuyerPersonas().find((persona) => persona.id === id) ?? null;
}

export async function upsertBuyerPersona(record: BuyerPersonaRecord) {
  const next = [
    record,
    ...listBuyerPersonas().filter((persona) => persona.id !== record.id),
  ].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  await buyerPersonasStore.save(next);

  return record;
}
