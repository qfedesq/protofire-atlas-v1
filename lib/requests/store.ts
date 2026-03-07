import { join } from "node:path";

import type { AssessmentRequest } from "@/lib/requests/types";
import { readJsonFile, writeJsonFile } from "@/lib/storage/json-file";

function getAssessmentRequestsFilePath() {
  return (
    process.env.ATLAS_REQUESTS_FILE ??
    join(process.cwd(), "data", "runtime", "assessment-requests.json")
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
