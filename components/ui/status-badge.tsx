import type { ModuleAvailabilityStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";

const statusToneMap: Record<ModuleAvailabilityStatus, string> = {
  available: "border-emerald-500 text-emerald-700",
  partial: "border-amber-500 text-amber-700",
  missing: "border-rose-500 text-rose-700",
};

export function StatusBadge({ status }: { status: ModuleAvailabilityStatus }) {
  return (
    <span
      className={cn(
        "inline-flex border-l-2 pl-2 text-xs font-semibold tracking-[0.14em] uppercase",
        statusToneMap[status],
      )}
    >
      {status}
    </span>
  );
}
