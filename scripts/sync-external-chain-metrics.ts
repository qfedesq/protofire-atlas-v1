import { syncExternalMetricsSnapshot } from "@/lib/external-data/service";

async function main() {
  const snapshot = await syncExternalMetricsSnapshot();

  console.log(
    `External chain metrics snapshot updated at ${snapshot.updatedAt} using ${snapshot.connectors.length} connectors.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
