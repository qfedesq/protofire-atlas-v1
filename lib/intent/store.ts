import { randomUUID } from "node:crypto";
import { join } from "node:path";

import { parseIntentEvent } from "@/lib/intent/schemas";
import type { IntentEvent, IntentEventType } from "@/lib/intent/types";
import { readJsonFile, writeJsonFile } from "@/lib/storage/json-file";

function getIntentEventsFilePath() {
  return (
    process.env.ATLAS_INTENT_FILE ??
    join(process.cwd(), "data", "runtime", "intent-events.json")
  );
}

export function listIntentEvents() {
  return readJsonFile<IntentEvent[]>(getIntentEventsFilePath(), []);
}

export function appendIntentEvent(
  input: Omit<IntentEvent, "id" | "createdAt"> & { type: IntentEventType },
) {
  const event = parseIntentEvent({
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  });
  const events = listIntentEvents();
  const next = [event, ...events];

  writeJsonFile(getIntentEventsFilePath(), next);

  return event;
}
