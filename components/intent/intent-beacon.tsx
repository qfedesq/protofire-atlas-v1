"use client";

import { useEffect } from "react";

import type { EconomyTypeSlug } from "@/lib/domain/types";
import type { IntentEventType } from "@/lib/intent/types";

type IntentBeaconProps = {
  type: IntentEventType;
  economy?: EconomyTypeSlug;
  chainSlug?: string;
  context?: string;
};

export function IntentBeacon({
  type,
  economy,
  chainSlug,
  context,
}: IntentBeaconProps) {
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        economy,
        chainSlug,
        context,
      }),
      signal: controller.signal,
    }).catch(() => {
      return undefined;
    });

    return () => {
      controller.abort();
    };
  }, [type, economy, chainSlug, context]);

  return null;
}
