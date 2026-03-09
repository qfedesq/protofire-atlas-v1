import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type ExpandableSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  tone?: "default" | "light" | "dark";
  className?: string;
};

export function ExpandableSection({
  id,
  eyebrow,
  title,
  description,
  children,
  defaultOpen = false,
  tone = "default",
  className = "",
}: ExpandableSectionProps) {
  const toneClass =
    tone === "light"
      ? "atlas-memo-block-light"
      : tone === "dark"
        ? "atlas-memo-block-dark"
        : "";

  return (
    <section
      id={id}
      className={`border-border/70 border-t pt-6 ${toneClass} ${className}`.trim()}
    >
      <details className="group" open={defaultOpen}>
        <summary className="list-none cursor-pointer">
          <div className="flex items-start justify-between gap-4 px-4 pt-5 md:px-6">
            <div>
              {eyebrow ? (
                <p className="text-accent text-xs tracking-[0.16em] uppercase">
                  {eyebrow}
                </p>
              ) : null}
              <h2 className="text-foreground mt-2 text-2xl font-semibold">
                {title}
              </h2>
            </div>
            <ChevronDown className="text-muted mt-1 h-5 w-5 shrink-0 transition group-open:rotate-180" />
          </div>
        </summary>
        <div className="mt-4 px-4 pb-6 md:px-6 md:pb-7">
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
