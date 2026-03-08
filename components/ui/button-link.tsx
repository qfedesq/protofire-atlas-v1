import type { ReactNode } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
        variant === "primary"
          ? "bg-accent text-accent-foreground hover:bg-accent/90"
          : "border-border text-foreground hover:border-accent hover:text-accent border bg-white",
        className,
      )}
    >
      {children}
    </Link>
  );
}
