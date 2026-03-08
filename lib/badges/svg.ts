function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildBadgeSvg({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const safeLabel = escapeXml(label);
  const safeValue = escapeXml(value);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="64" viewBox="0 0 420 64" role="img" aria-label="${safeLabel}: ${safeValue}">
  <rect width="420" height="64" fill="#F1F6FF" />
  <rect x="0" y="0" width="420" height="2" fill="#FF8D00" />
  <text x="20" y="26" fill="#64748B" font-family="Onest, Arial, sans-serif" font-size="12" font-weight="600" letter-spacing="1.2">${safeLabel}</text>
  <text x="20" y="48" fill="#172554" font-family="Onest, Arial, sans-serif" font-size="24" font-weight="700">${safeValue}</text>
</svg>`;
}
