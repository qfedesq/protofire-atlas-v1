import { parseProposalDocument } from "@/lib/domain/schemas";
import type { ProposalDocument } from "@/lib/domain/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";
import { getRuntimeManagedFilePath } from "@/lib/storage/runtime-path";

function getProposalDocumentsFilePath() {
  return getRuntimeManagedFilePath(
    "ATLAS_PROPOSALS_FILE",
    "data/runtime/proposals.json",
  );
}

function validateProposalDocuments(input: unknown) {
  if (!Array.isArray(input)) {
    return [] as ProposalDocument[];
  }

  return input.map((item) => parseProposalDocument(item));
}

const proposalDocumentsStore = createPersistentJsonStore<ProposalDocument[]>({
  key: "proposal-documents",
  getFilePath: getProposalDocumentsFilePath,
  fallback: [],
  validate: validateProposalDocuments,
});

export async function initializeProposalDocumentsStore() {
  return proposalDocumentsStore.initialize();
}

export function listProposalDocuments() {
  return proposalDocumentsStore.getSnapshot();
}

export function listProposalDocumentsByChainSlug(chainSlug: string) {
  return listProposalDocuments()
    .filter((proposal) => proposal.chainSlug === chainSlug)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function saveProposalDocuments(proposals: ProposalDocument[]) {
  const existing = listProposalDocuments().filter(
    (proposal) =>
      !proposals.some((nextProposal) => nextProposal.proposalId === proposal.proposalId),
  );

  return proposalDocumentsStore.save(
    [...proposals, ...existing].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    ),
  );
}
