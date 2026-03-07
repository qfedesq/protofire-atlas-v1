#!/usr/bin/env bash
set -euo pipefail

SNAPSHOT_DATE="${1:-$(date +%F)}"
TMP_FILE="$(mktemp -t defillama-chains.XXXXXX.json)"
trap 'rm -f "$TMP_FILE"' EXIT

curl -sS https://api.llama.fi/chains > "$TMP_FILE"
node scripts/refresh-top-30-evm-chains.mjs "$SNAPSHOT_DATE" --input "$TMP_FILE"
