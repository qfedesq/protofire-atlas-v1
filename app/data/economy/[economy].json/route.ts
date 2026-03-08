import { listEconomyTypes } from "@/lib/config/economies";
import { getPublicEconomyRankingPayload } from "@/lib/public-data/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

function getEconomySlug(pathname: string) {
  return pathname.split("/").pop()?.replace(/\.json$/, "") ?? "";
}

export async function GET(request: Request) {
  await ensureAtlasPersistence();
  const economy = getEconomySlug(new URL(request.url).pathname);
  const resolvedEconomy = listEconomyTypes().find((item) => item.slug === economy);

  if (!resolvedEconomy) {
    return Response.json({ error: "Unknown economy." }, { status: 404 });
  }

  return Response.json(getPublicEconomyRankingPayload(resolvedEconomy.slug));
}
