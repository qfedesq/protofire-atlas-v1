import { z } from "zod";

import { economyTypeSlugs } from "@/lib/domain/types";
import type { IntentEvent } from "@/lib/intent/types";

const intentEventSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "economy_selected",
    "chain_profile_viewed",
    "peer_comparison_navigation",
    "assessment_request_submitted",
    "chain_addition_request_submitted",
  ]),
  createdAt: z.string().min(1),
  economy: z.enum(economyTypeSlugs).optional(),
  chainSlug: z.string().min(1).optional(),
  context: z.string().min(1).optional(),
});

export function parseIntentEvent(input: unknown): IntentEvent {
  return intentEventSchema.parse(input);
}
