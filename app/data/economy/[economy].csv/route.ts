import { listEconomyTypes } from "@/lib/config/economies";
import { buildPublicEconomyRankingCsv } from "@/lib/public-data/service";

function getEconomySlug(pathname: string) {
  return pathname.split("/").pop()?.replace(/\.csv$/, "") ?? "";
}

export async function GET(request: Request) {
  const economy = getEconomySlug(new URL(request.url).pathname);
  const resolvedEconomy = listEconomyTypes().find((item) => item.slug === economy);

  if (!resolvedEconomy) {
    return Response.json({ error: "Unknown economy." }, { status: 404 });
  }

  return new Response(buildPublicEconomyRankingCsv(resolvedEconomy.slug), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `inline; filename="${resolvedEconomy.slug}.csv"`,
    },
  });
}
