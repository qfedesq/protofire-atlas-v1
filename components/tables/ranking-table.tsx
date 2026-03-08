import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronDown, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { RankingsSortDirection } from "@/lib/domain/types";
import {
  getGroupDetailColumnIds,
  getDefaultVisibleColumnIds,
  resolveVisibleColumnIds,
  toggleVisibleColumnId,
  type RankingColumnDefinition,
  type RankingMode,
} from "@/lib/rankings/table";

type RankingTableProps<Row, SortKey extends string> = {
  mode: RankingMode;
  rows: Row[];
  columns: RankingColumnDefinition<Row, SortKey>[];
  visibleColumnIds: string[];
  getRowKey: (row: Row, rowIndex: number) => string;
  sort: SortKey;
  direction: RankingsSortDirection;
  buildSortHref: (sort: SortKey, direction: RankingsSortDirection) => string;
  buildColumnsHref: (columnIds: string[]) => string;
  emptyState: string;
};

function SortHeader<SortKey extends string>({
  column,
  sort,
  direction,
  buildSortHref,
}: {
  column: RankingColumnDefinition<unknown, SortKey>;
  sort: SortKey;
  direction: RankingsSortDirection;
  buildSortHref: (sort: SortKey, direction: RankingsSortDirection) => string;
}) {
  if (!column.sortKey) {
    return <span>{column.label}</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <span>{column.label}</span>
      <div className="text-muted inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase">
        <Link
          href={buildSortHref(column.sortKey, "asc")}
          scroll={false}
          aria-label={`Sort ${column.label} ascending`}
          className={cn(
            "transition hover:text-foreground",
            sort === column.sortKey && direction === "asc"
              ? "text-accent"
              : undefined,
          )}
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Link>
        <Link
          href={buildSortHref(column.sortKey, "desc")}
          scroll={false}
          aria-label={`Sort ${column.label} descending`}
          className={cn(
            "transition hover:text-foreground",
            sort === column.sortKey && direction === "desc"
              ? "text-accent"
              : undefined,
          )}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function ColumnVisibilityControls<Row, SortKey extends string>({
  columns,
  visibleColumnIds,
  buildColumnsHref,
}: {
  columns: RankingColumnDefinition<Row, SortKey>[];
  visibleColumnIds: string[];
  buildColumnsHref: (columnIds: string[]) => string;
}) {
  const defaultVisibleColumnIds = getDefaultVisibleColumnIds(columns);
  const hideableColumns = columns.filter((column) => column.canHide !== false);
  const groupedColumns = Array.from(
    hideableColumns.reduce((groups, column) => {
      const groupId = column.groupId ?? "general";
      const current = groups.get(groupId) ?? {
        id: groupId,
        label: column.groupLabel ?? "General",
        description: column.groupDescription,
        order: column.groupOrder ?? Number.MAX_SAFE_INTEGER,
        columns: [] as RankingColumnDefinition<Row, SortKey>[],
      };

      current.columns.push(column);
      groups.set(groupId, current);

      return groups;
    }, new Map<string, {
      id: string;
      label: string;
      description?: string;
      order: number;
      columns: RankingColumnDefinition<Row, SortKey>[];
    }>()),
  ).sort((left, right) => left[1].order - right[1].order);

  if (hideableColumns.length === 0) {
    return null;
  }

  return (
    <details className="group relative">
      <summary className="text-foreground marker:hidden flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
        Columns
        <span className="text-muted text-xs">
          {visibleColumnIds.length}/{columns.length}
        </span>
        <ChevronDown className="text-muted h-4 w-4 transition group-open:rotate-180" />
      </summary>
      <div className="border-border bg-surface absolute right-0 z-40 mt-3 w-80 rounded-2xl border p-4 shadow-[var(--shadow-soft)]">
        <div className="space-y-3">
          {groupedColumns.map(([, group]) => (
            <details
              key={group.id}
              className="group border-border/60 border-t pt-3 first:border-t-0 first:pt-0"
              open
            >
              {(() => {
                const detailColumnIds = getGroupDetailColumnIds(group.id, columns);
                const visibleDetailColumnIds = detailColumnIds.filter((columnId) =>
                  visibleColumnIds.includes(columnId),
                );
                const showDetailsHref =
                  detailColumnIds.length > 0
                    ? buildColumnsHref(
                        resolveVisibleColumnIds(
                          [...visibleColumnIds, ...detailColumnIds],
                          columns,
                        ),
                      )
                    : null;
                const hideDetailsHref =
                  visibleDetailColumnIds.length > 0
                    ? buildColumnsHref(
                        resolveVisibleColumnIds(
                          visibleColumnIds.filter(
                            (columnId) => !detailColumnIds.includes(columnId),
                          ),
                          columns,
                        ),
                      )
                    : null;

                return (
                  <>
              <summary className="text-foreground marker:hidden flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-medium">
                <div>
                  <p>{group.label}</p>
                  {group.description ? (
                    <p className="text-muted mt-1 text-xs leading-5 font-normal">
                      {group.description}
                    </p>
                  ) : null}
                </div>
                <ChevronDown className="text-muted mt-0.5 h-4 w-4 transition group-open:rotate-180" />
              </summary>
              {detailColumnIds.length > 0 ? (
                <div className="mt-3 flex items-center gap-4 text-xs font-medium">
                  <Link
                    href={showDetailsHref ?? "#"}
                    scroll={false}
                    className={cn(
                      "text-accent hover:underline",
                      showDetailsHref ? undefined : "pointer-events-none opacity-50",
                    )}
                  >
                    Show details
                  </Link>
                  <Link
                    href={hideDetailsHref ?? "#"}
                    scroll={false}
                    className={cn(
                      "text-muted hover:text-foreground hover:underline",
                      hideDetailsHref ? undefined : "pointer-events-none opacity-50",
                    )}
                  >
                    Hide details
                  </Link>
                </div>
              ) : null}
              <div className="mt-3 space-y-3">
                {group.columns.map((column) => {
                  const nextColumnIds = toggleVisibleColumnId(
                    visibleColumnIds,
                    column.id,
                    columns,
                  );
                  const isVisible = visibleColumnIds.includes(column.id);

                  return (
                    <Link
                      key={column.id}
                      href={buildColumnsHref(nextColumnIds)}
                      scroll={false}
                      className="border-border/50 hover:bg-surface-muted block border-t pt-3 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-foreground text-sm font-medium">
                            {column.label}
                          </p>
                          {column.description ? (
                            <p className="text-muted mt-1 text-xs leading-5">
                              {column.description}
                            </p>
                          ) : null}
                        </div>
                        <span className="text-muted text-xs font-medium">
                          {isVisible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
                  </>
                );
              })()}
            </details>
          ))}
        </div>
        <div className="border-border/60 mt-4 border-t pt-4">
          <Link
            href={buildColumnsHref(defaultVisibleColumnIds)}
            scroll={false}
            className="text-accent inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to default
          </Link>
        </div>
      </div>
    </details>
  );
}

export function RankingTable<Row, SortKey extends string>({
  mode,
  rows,
  columns,
  visibleColumnIds,
  getRowKey,
  sort,
  direction,
  buildSortHref,
  buildColumnsHref,
  emptyState,
}: RankingTableProps<Row, SortKey>) {
  const visibleColumns = resolveVisibleColumnIds(visibleColumnIds, columns)
    .map((columnId) => columns.find((column) => column.id === columnId))
    .filter((column): column is RankingColumnDefinition<Row, SortKey> => Boolean(column));

  if (rows.length === 0) {
    return (
      <div className="border-border bg-surface rounded-3xl border px-6 py-12 text-center">
        <p className="text-muted text-sm">{emptyState}</p>
      </div>
    );
  }

  return (
    <div
      className="border-border bg-surface rounded-3xl border shadow-[var(--shadow-soft)]"
      data-ranking-mode={mode}
    >
      <div className="border-border/70 flex items-center justify-end border-b px-5 py-4">
        <ColumnVisibilityControls
          columns={columns}
          visibleColumnIds={visibleColumns.map((column) => column.id)}
          buildColumnsHref={buildColumnsHref}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-muted">
              {visibleColumns.map((column, columnIndex) => {
                const isSticky = columnIndex === 0;

                return (
                  <th
                    key={column.id}
                    className={cn(
                      "border-border bg-surface-muted sticky top-0 border-b px-5 py-4 text-xs font-semibold tracking-[0.16em] uppercase",
                      column.align === "right" ? "text-right" : "text-left",
                      column.widthClassName,
                      isSticky ? "left-0 z-40 shadow-[1px_0_0_0_var(--border)]" : "z-30",
                    )}
                  >
                    <SortHeader
                      column={column as RankingColumnDefinition<unknown, SortKey>}
                      sort={sort}
                      direction={direction}
                      buildSortHref={buildSortHref}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className="group border-border/60 hover:bg-surface-muted/50 align-top transition"
              >
                {visibleColumns.map((column, columnIndex) => {
                  const isSticky = columnIndex === 0;

                  return (
                    <td
                      key={column.id}
                      className={cn(
                        "border-border/60 border-t px-5 py-4 align-top",
                        column.align === "right" ? "text-right" : "text-left",
                        column.widthClassName,
                        isSticky
                          ? "bg-surface sticky left-0 z-20 shadow-[1px_0_0_0_var(--border)] group-hover:bg-surface-muted/50"
                          : undefined,
                      )}
                    >
                      {column.renderCell(row, rowIndex)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
