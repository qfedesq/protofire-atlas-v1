const manualDatasetLabels = {
  readinessRecords: "readiness records",
  roadmaps: "roadmaps",
  ecosystemMetricSeeds: "fallback ecosystem metrics",
  liquidStakingMarketSnapshots: "liquid staking market snapshots",
} as const;

function formatManualDatasetLabel(key: string) {
  return manualDatasetLabels[key as keyof typeof manualDatasetLabels] ?? key;
}

export function getMessage(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function formatSavedMessage(savedMessage: string) {
  if (savedMessage === "sync-now") {
    return "Atlas external data sync completed for the currently supported source-backed workflow.";
  }

  if (savedMessage.startsWith("manual-dataset:")) {
    return `Saved manual dataset override: ${formatManualDatasetLabel(
      savedMessage.split(":")[1] ?? "",
    )}.`;
  }

  if (savedMessage.startsWith("manual-reset:")) {
    return `Reset manual dataset override: ${formatManualDatasetLabel(
      savedMessage.split(":")[1] ?? "",
    )}.`;
  }

  return `Saved assumption set: ${savedMessage}.`;
}

export function formatErrorMessage(errorMessage: string) {
  if (errorMessage === "sync-now") {
    return "Atlas external data sync could not complete in the current environment.";
  }

  if (errorMessage.startsWith("manual-dataset:")) {
    return `Could not save manual dataset override: ${formatManualDatasetLabel(
      errorMessage.split(":")[1] ?? "",
    )}.`;
  }

  if (errorMessage.startsWith("manual-reset:")) {
    return `Could not reset manual dataset override: ${formatManualDatasetLabel(
      errorMessage.split(":")[1] ?? "",
    )}.`;
  }

  return `Could not save assumption set: ${errorMessage}.`;
}
