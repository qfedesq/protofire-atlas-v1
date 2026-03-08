function escapeCell(value: string | number | null | undefined) {
  const normalizedValue =
    value == null ? "" : typeof value === "number" ? String(value) : value;

  if (
    normalizedValue.includes(",") ||
    normalizedValue.includes("\"") ||
    normalizedValue.includes("\n")
  ) {
    return `"${normalizedValue.replaceAll("\"", "\"\"")}"`;
  }

  return normalizedValue;
}

export function buildCsv(
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>,
) {
  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCell(cell)).join(","))
    .join("\n");
}
