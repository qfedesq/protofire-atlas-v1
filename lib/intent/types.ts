import type { EconomyTypeSlug } from "@/lib/domain/types";

export type IntentEventType =
  | "economy_selected"
  | "chain_profile_viewed"
  | "peer_comparison_navigation"
  | "assessment_request_submitted";

export type IntentEvent = {
  id: string;
  type: IntentEventType;
  createdAt: string;
  economy?: EconomyTypeSlug;
  chainSlug?: string;
  context?: string;
};
