import type {
  AssessmentRequest,
  ChainAdditionRequest,
} from "@/lib/requests/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";
import { getRuntimeManagedFilePath } from "@/lib/storage/runtime-path";

function getAssessmentRequestsFilePath() {
  return getRuntimeManagedFilePath(
    "ATLAS_REQUESTS_FILE",
    "data/runtime/assessment-requests.json",
  );
}

function getChainAdditionRequestsFilePath() {
  return getRuntimeManagedFilePath(
    "ATLAS_CHAIN_ADDITION_REQUESTS_FILE",
    "data/runtime/chain-addition-requests.json",
  );
}

const assessmentRequestsStore = createPersistentJsonStore<AssessmentRequest[]>({
  key: "assessment-requests",
  getFilePath: getAssessmentRequestsFilePath,
  fallback: [],
  validate: (input) => (Array.isArray(input) ? (input as AssessmentRequest[]) : []),
});

const chainAdditionRequestsStore = createPersistentJsonStore<ChainAdditionRequest[]>({
  key: "chain-addition-requests",
  getFilePath: getChainAdditionRequestsFilePath,
  fallback: [],
  validate: (input) =>
    Array.isArray(input) ? (input as ChainAdditionRequest[]) : [],
});

export async function initializeRequestsStores() {
  return Promise.all([
    assessmentRequestsStore.initialize(),
    chainAdditionRequestsStore.initialize(),
  ]);
}

export function listAssessmentRequests() {
  return assessmentRequestsStore.getSnapshot();
}

export async function appendAssessmentRequest(request: AssessmentRequest) {
  const requests = listAssessmentRequests();
  const next = [request, ...requests];

  await assessmentRequestsStore.save(next);

  return request;
}

export function listChainAdditionRequests() {
  return chainAdditionRequestsStore.getSnapshot();
}

export async function appendChainAdditionRequest(request: ChainAdditionRequest) {
  const requests = listChainAdditionRequests();
  const next = [request, ...requests];

  await chainAdditionRequestsStore.save(next);

  return request;
}
