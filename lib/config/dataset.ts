import top30EvmChainsSnapshot from "@/data/source/defillama-top-30-evm-chains.snapshot.json";

export const atlasDatasetSnapshot = top30EvmChainsSnapshot;

export const atlasDatasetLabel = `Top ${atlasDatasetSnapshot.chains.length} ${atlasDatasetSnapshot.sourceCategory} chains by ${atlasDatasetSnapshot.sourceMetric}`;

export const atlasDatasetSummary = `${atlasDatasetLabel} from ${atlasDatasetSnapshot.sourceProvider} snapshot ${atlasDatasetSnapshot.snapshotDate}`;
