import { NextResponse } from "next/server";

import { appendIntentEvent } from "@/lib/intent/store";

export async function POST(request: Request) {
  const payload = await request.json();

  await appendIntentEvent({
    type: payload.type,
    economy: payload.economy,
    chainSlug: payload.chainSlug,
    context: payload.context,
  });

  return NextResponse.json({ ok: true });
}
