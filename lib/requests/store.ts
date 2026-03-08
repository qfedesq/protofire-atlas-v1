import { join } from "node:path";

import type {
  AssessmentRequest,
  ChainAdditionRequest,
} from "@/lib/requests/types";
import { readJsonFile, writeJsonFile } from "@/lib/storage/json-file";

function getAssessmentRequestsFilePath() {
  return (
    process.env.ATLAS_REQUESTS_FILE ??
    join(process.cwd(), "data", "runtime", "assessment-requests.json")
  );
}

function getChainAdditionRequestsFilePath() {
  return (
    process.env.ATLAS_CHAIN_ADDITION_REQUESTS_FILE ??
    join(process.cwd(), "data", "runtime", "chain-addition-requests.json")
  );
}

export function listAssessmentRequests() {
  return readJsonFile<AssessmentRequest[]>(getAssessmentRequestsFilePath(), []);
}

export function appendAssessmentRequest(request: AssessmentRequest) {
  const requests = listAssessmentRequests();
  const next = [request, ...requests];

  writeJsonFile(getAssessmentRequestsFilePath(), next);

  return request;
}

export function listChainAdditionRequests() {
  return readJsonFile<ChainAdditionRequest[]>(
    getChainAdditionRequestsFilePath(),
    [],
  );
}

export function appendChainAdditionRequest(request: ChainAdditionRequest) {
  const requests = listChainAdditionRequests();
  const next = [request, ...requests];

  writeJsonFile(getChainAdditionRequestsFilePath(), next);

  return request;
}
