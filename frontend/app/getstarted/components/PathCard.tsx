"use client";

import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PathCardProps = {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  points: string[];
  cta: string;
  variant: "primary" | "outline";
  recommended?: boolean;
  onSelect: () => void;
};

export function PathCard({
  icon: Icon,
  badge,
  title,
  description,
  points,
  cta,
  variant,
  recommended,
  onSelect,
}: PathCardProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "ledger-card-flat group flex h-full w-full cursor-pointer flex-col rounded-xl border border-[var(--ledger-line)] p-6 text-left shadow-[0_1px_0_var(--ledger-line),0_12px_32px_-16px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[var(--stamp)] focus-visible:outline-none sm:p-8",
        isPrimary
          ? "hover:border-[var(--stamp)]/50"
          : "hover:border-[var(--stamp)]/40"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            isPrimary
              ? "bg-[var(--stamp)] text-white shadow-lg"
              : "border border-[var(--ledger-line)] bg-[var(--stamp)]/10 text-[var(--stamp)]"
          )}
        >
          <Icon className="size-6" />
        </span>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold",
            recommended
              ? "border-[var(--stamp)]/40 bg-[var(--stamp)]/10 text-[var(--stamp)]"
              : "border-[var(--ledger-line)] bg-[var(--paper)] text-muted-foreground"
          )}
        >
          {badge}
        </span>
      </div>

      <span className="font-display mt-4 block text-xl font-semibold text-foreground">
        {title}
      </span>
      <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
        {description}
      </span>

      <ul className="mt-5 space-y-2.5">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--stamp)]/12 text-[var(--stamp)]">
              <Check className="size-3" />
            </span>
            <span className="text-sm font-medium text-foreground/90">{point}</span>
          </li>
        ))}
      </ul>

      <span
        className={cn(
          "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold transition-all",
          isPrimary
            ? "bg-[var(--stamp)] text-white shadow-lg group-hover:brightness-110"
            : "border border-[var(--ledger-line)] bg-[var(--paper)] text-foreground group-hover:border-[var(--stamp)]/40 group-hover:text-[var(--stamp)]"
        )}
      >
        {cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}
