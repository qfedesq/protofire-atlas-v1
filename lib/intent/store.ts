import { randomUUID } from "node:crypto";

import { parseIntentEvent } from "@/lib/intent/schemas";
import type { IntentEvent, IntentEventType } from "@/lib/intent/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";
import { getRuntimeManagedFilePath } from "@/lib/storage/runtime-path";

function getIntentEventsFilePath() {
  return getRuntimeManagedFilePath(
    "ATLAS_INTENT_FILE",
    "data/runtime/intent-events.json",
  );
}

const intentEventsStore = createPersistentJsonStore<IntentEvent[]>({
  key: "intent-events",
  getFilePath: getIntentEventsFilePath,
  fallback: [],
  validate: (input) =>
    Array.isArray(input)
      ? input.map((event) => parseIntentEvent(event))
      : [],
});

export async function initializeIntentEventsStore() {
  return intentEventsStore.initialize();
}

export function listIntentEvents() {
  return intentEventsStore.getSnapshot();
}

export async function appendIntentEvent(
  input: Omit<IntentEvent, "id" | "createdAt"> & { type: IntentEventType },
) {
  const event = parseIntentEvent({
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  });
  const events = listIntentEvents();
  const next = [event, ...events];

  await intentEventsStore.save(next);

  return event;
}
