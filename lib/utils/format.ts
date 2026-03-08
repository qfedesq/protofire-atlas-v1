export function formatScore(score: number) {
  return score.toFixed(1);
}

export function formatDelta(score: number) {
  return score <= 0 ? "0.0" : score.toFixed(1);
}

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrencyCompact(value: number) {
  return compactCurrencyFormatter.format(value);
}

export function formatCountCompact(value: number) {
  return compactNumberFormatter.format(value);
}
