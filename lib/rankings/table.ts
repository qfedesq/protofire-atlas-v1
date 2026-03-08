import type { ReactNode } from "react";

import type { RankingsSortDirection } from "@/lib/domain/types";

export type RankingMode = "economy" | "global" | "opportunity";

export type RankingColumnDefinition<Row, SortKey extends string> = {
  id: string;
  label: string;
  description?: string;
  groupId?: string;
  groupLabel?: string;
  groupDescription?: string;
  groupOrder?: number;
  groupRole?: "summary" | "detail";
  defaultVisible: boolean;
  canHide?: boolean;
  align?: "left" | "right";
  widthClassName?: string;
  sortKey?: SortKey;
  renderCell: (row: Row, rowIndex: number) => ReactNode;
};

export type RankingTableSortProps<SortKey extends string> = {
  sort: SortKey;
  direction: RankingsSortDirection;
  buildSortHref: (sort: SortKey, direction: RankingsSortDirection) => string;
};

export function parseVisibleColumnIds(
  value: string | string[] | undefined,
): string[] {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((columnId) => columnId.trim())
    .filter(Boolean);
}

export function getDefaultVisibleColumnIds<Row, SortKey extends string>(
  columns: RankingColumnDefinition<Row, SortKey>[],
) {
  return columns
    .filter((column) => column.defaultVisible || column.canHide === false)
    .map((column) => column.id);
}

export function resolveVisibleColumnIds<Row, SortKey extends string>(
  requestedIds: string[],
  columns: RankingColumnDefinition<Row, SortKey>[],
) {
  const allIds = new Set(columns.map((column) => column.id));
  const requiredIds = columns
    .filter((column) => column.canHide === false)
    .map((column) => column.id);

  if (requestedIds.length === 0) {
    return getDefaultVisibleColumnIds(columns);
  }

  const requested = requestedIds.filter((columnId) => allIds.has(columnId));
  const merged = [...requiredIds, ...requested.filter((id) => !requiredIds.includes(id))];
  const ordered = columns
    .map((column) => column.id)
    .filter((columnId) => merged.includes(columnId));

  return ordered.length > 0 ? ordered : getDefaultVisibleColumnIds(columns);
}

export function toggleVisibleColumnId<Row, SortKey extends string>(
  visibleIds: string[],
  columnId: string,
  columns: RankingColumnDefinition<Row, SortKey>[],
) {
  const column = columns.find((item) => item.id === columnId);

  if (!column || column.canHide === false) {
    return visibleIds;
  }

  if (visibleIds.includes(columnId)) {
    const nextIds = visibleIds.filter((id) => id !== columnId);

    return resolveVisibleColumnIds(nextIds, columns);
  }

  return resolveVisibleColumnIds([...visibleIds, columnId], columns);
}

export function serializeVisibleColumnIds<Row, SortKey extends string>(
  visibleIds: string[],
  columns: RankingColumnDefinition<Row, SortKey>[],
) {
  const defaults = getDefaultVisibleColumnIds(columns);
  const resolved = resolveVisibleColumnIds(visibleIds, columns);

  if (
    resolved.length === defaults.length &&
    resolved.every((columnId, index) => columnId === defaults[index])
  ) {
    return undefined;
  }

  return resolved.join(",");
}

export function getGroupDetailColumnIds<Row, SortKey extends string>(
  groupId: string,
  columns: RankingColumnDefinition<Row, SortKey>[],
) {
  return columns
    .filter(
      (column) => column.groupId === groupId && column.groupRole === "detail",
    )
    .map((column) => column.id);
}
