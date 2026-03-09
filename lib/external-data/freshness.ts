import type {
  ExternalMetricsSnapshot,
  ExternalMetricSnapshotValue,
} from "@/lib/domain/types";

export type FreshnessLevel = "fresh" | "stale" | "expired";

export type MetricFreshnessReport = {
  chainSlug: string;
  metricKey: string;
  sourceName: string;
  freshness: ExternalMetricSnapshotValue["freshness"];
  fetchedAt: string;
  ageInDays: number;
  level: FreshnessLevel;
};

export type ChainFreshnessSummary = {
  chainSlug: string;
  totalMetrics: number;
  freshCount: number;
  staleCount: number;
  expiredCount: number;
  fallbackCount: number;
  oldestMetricDays: number;
  overallLevel: FreshnessLevel;
};

export type SnapshotFreshnessReport = {
  snapshotUpdatedAt: string;
  snapshotAgeDays: number;
  chains: ChainFreshnessSummary[];
  globalLevel: FreshnessLevel;
  warnings: string[];
};

const STALE_THRESHOLD_DAYS = 7;
const EXPIRED_THRESHOLD_DAYS = 30;

function computeAgeDays(dateString: string, now: Date): number {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return Infinity;
  }

  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function classifyAge(ageDays: number): FreshnessLevel {
  if (ageDays <= STALE_THRESHOLD_DAYS) {
    return "fresh";
  }

  if (ageDays <= EXPIRED_THRESHOLD_DAYS) {
    return "stale";
  }

  return "expired";
}

function worstLevel(levels: FreshnessLevel[]): FreshnessLevel {
  if (levels.includes("expired")) {
    return "expired";
  }

  if (levels.includes("stale")) {
    return "stale";
  }

  return "fresh";
}

export function buildSnapshotFreshnessReport(
  snapshot: ExternalMetricsSnapshot,
  now: Date = new Date(),
): SnapshotFreshnessReport {
  const snapshotAgeDays = computeAgeDays(snapshot.updatedAt, now);
  const warnings: string[] = [];
  const chainSummaries: ChainFreshnessSummary[] = [];

  if (snapshotAgeDays > EXPIRED_THRESHOLD_DAYS) {
    warnings.push(
      `External metrics snapshot is ${snapshotAgeDays} days old (last updated: ${snapshot.updatedAt}). Data may not reflect current ecosystem state.`,
    );
  } else if (snapshotAgeDays > STALE_THRESHOLD_DAYS) {
    warnings.push(
      `External metrics snapshot is ${snapshotAgeDays} days old. Consider refreshing data sources.`,
    );
  }

  for (const chainSnapshot of snapshot.chains) {
    const metricEntries = Object.entries(chainSnapshot.metrics) as Array<
      [string, ExternalMetricSnapshotValue]
    >;
    let freshCount = 0;
    let staleCount = 0;
    let expiredCount = 0;
    let fallbackCount = 0;
    let oldestDays = 0;

    for (const [, metric] of metricEntries) {
      const ageDays = computeAgeDays(metric.fetchedAt, now);
      const level = classifyAge(ageDays);

      if (metric.freshness === "fallback") {
        fallbackCount++;
      }

      if (level === "fresh") {
        freshCount++;
      } else if (level === "stale") {
        staleCount++;
      } else {
        expiredCount++;
      }

      if (ageDays > oldestDays && Number.isFinite(ageDays)) {
        oldestDays = ageDays;
      }
    }

    const chainLevel = worstLevel(
      metricEntries.map(([, m]) => classifyAge(computeAgeDays(m.fetchedAt, now))),
    );

    if (fallbackCount > metricEntries.length / 2) {
      warnings.push(
        `${chainSnapshot.chainSlug}: ${fallbackCount}/${metricEntries.length} metrics are running on fallback data, not live sources.`,
      );
    }

    if (chainLevel === "expired") {
      warnings.push(
        `${chainSnapshot.chainSlug}: metrics are expired (oldest is ${oldestDays} days old). Scores may be unreliable.`,
      );
    }

    chainSummaries.push({
      chainSlug: chainSnapshot.chainSlug,
      totalMetrics: metricEntries.length,
      freshCount,
      staleCount,
      expiredCount,
      fallbackCount,
      oldestMetricDays: oldestDays,
      overallLevel: chainLevel,
    });
  }

  const globalLevel = worstLevel(
    chainSummaries.map((summary) => summary.overallLevel),
  );

  return {
    snapshotUpdatedAt: snapshot.updatedAt,
    snapshotAgeDays,
    chains: chainSummaries,
    globalLevel,
    warnings,
  };
}
