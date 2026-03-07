import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

export function Panel({ children, className }: PanelProps) {
  return (
    <section
      className={cn(
        "border-border/80 bg-surface rounded-3xl border px-6 py-6 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
