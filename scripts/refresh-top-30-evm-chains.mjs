#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = dirname(__dirname);
const chainMapPath = join(
  workspaceRoot,
  "data/source/defillama-evm-chain-map.json",
);
const outputPath = join(
  workspaceRoot,
  "data/source/defillama-top-30-evm-chains.snapshot.json",
);
const sourceUrl = "https://api.llama.fi/chains";
const args = process.argv.slice(2);
const inputFlagIndex = args.indexOf("--input");
const inputPath =
  inputFlagIndex >= 0 && args[inputFlagIndex + 1]
    ? args[inputFlagIndex + 1]
    : null;
const snapshotDate =
  args.find((arg) => /^\d{4}-\d{2}-\d{2}$/.test(arg)) ??
  new Date().toISOString().slice(0, 10);

const chainMap = JSON.parse(readFileSync(chainMapPath, "utf8"));
const chainMapBySourceName = new Map(
  chainMap.map((entry) => [entry.sourceName, entry]),
);

const rawChains = inputPath
  ? readFileSync(inputPath, "utf8")
  : (() => {
      throw new Error(
        "Missing input data. Fetch https://api.llama.fi/chains with curl and pass it using --input <path>.",
      );
    })();
const chains = JSON.parse(rawChains)
  .sort((left, right) => Number(right.tvl) - Number(left.tvl))
  .map((chain, index) => ({
    ...chain,
    globalRank: index + 1,
  }))
  .filter((chain) => chainMapBySourceName.has(chain.name))
  .slice(0, 30)
  .map((chain, index) => {
    const mapped = chainMapBySourceName.get(chain.name);

    if (!mapped) {
      throw new Error(`Missing chain mapping for ${chain.name}`);
    }

    return {
      id: `chain-${mapped.slug}`,
      slug: mapped.slug,
      name: mapped.name,
      sourceName: chain.name,
      sourceRank: index + 1,
      sourceGlobalRank: chain.globalRank,
      sourceCategory: "EVM",
      sourceMetric: "TVL",
      sourceProvider: "DeFiLlama",
      sourceSnapshotDate: snapshotDate,
      sourceTvlUsd: Number(chain.tvl),
      chainId: chain.chainId ?? null,
      geckoId: chain.gecko_id ?? null,
      cmcId: chain.cmcId ?? null,
    };
  });

if (chains.length !== 30) {
  throw new Error(`Expected 30 EVM chains. Received ${chains.length}.`);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      sourceProvider: "DeFiLlama",
      sourceMetric: "TVL",
      sourceCategory: "EVM",
      sourceUrl,
      snapshotDate,
      generatedAt: new Date().toISOString(),
      methodology:
        "Fetched DeFiLlama /chains, filtered against the curated EVM chain map stored in data/source/defillama-evm-chain-map.json, sorted by TVL descending, and kept the top 30 chains.",
      chains,
    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote ${chains.length} chains to ${outputPath}`);
