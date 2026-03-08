import { listEconomyTypes } from "@/lib/config/economies";
import { getPublicEconomyRankingPayload } from "@/lib/public-data/service";

function getEconomySlug(pathname: string) {
  return pathname.split("/").pop()?.replace(/\.json$/, "") ?? "";
}

export async function GET(request: Request) {
  const economy = getEconomySlug(new URL(request.url).pathname);
  const resolvedEconomy = listEconomyTypes().find((item) => item.slug === economy);

  if (!resolvedEconomy) {
    return Response.json({ error: "Unknown economy." }, { status: 404 });
  }

  return Response.json(getPublicEconomyRankingPayload(resolvedEconomy.slug));
}
