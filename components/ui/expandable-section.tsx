import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type ExpandableSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function ExpandableSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: ExpandableSectionProps) {
  return (
    <section id={id}>
      <details className="group border-border bg-surface rounded-3xl border shadow-[var(--shadow-soft)]">
        <summary className="list-none cursor-pointer px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-accent text-xs tracking-[0.16em] uppercase">
                {eyebrow}
              </p>
              <h2 className="text-foreground mt-2 text-2xl font-semibold">
                {title}
              </h2>
            </div>
            <ChevronDown className="text-muted mt-1 h-5 w-5 shrink-0 transition group-open:rotate-180" />
          </div>
        </summary>
        <div className="border-border/60 px-6 pt-4 pb-6">
          {description ? (
            <p className="text-muted max-w-3xl text-sm leading-6">
              {description}
            </p>
          ) : null}
          <div className={description ? "mt-4" : ""}>{children}</div>
        </div>
      </details>
    </section>
  );
}
