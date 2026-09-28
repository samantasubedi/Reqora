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
        "group flex h-full w-full cursor-pointer flex-col rounded-2xl border bg-card p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:p-8",
        isPrimary ? "hover:border-primary/50" : "hover:border-primary/40"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            isPrimary
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-teal-500/10 text-teal-600 dark:text-teal-300"
          )}
        >
          <Icon className="size-6" />
        </span>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold",
            recommended
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-muted text-muted-foreground"
          )}
        >
          {badge}
        </span>
      </div>

      <span className="mt-4 block text-xl font-bold text-card-foreground">
        {title}
      </span>
      <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
        {description}
      </span>

      <ul className="mt-5 space-y-2.5">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
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
            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 group-hover:from-emerald-600 group-hover:to-teal-700 group-hover:shadow-xl group-hover:shadow-emerald-500/30"
            : "border border-border bg-background text-foreground group-hover:border-primary/40 group-hover:text-primary"
        )}
      >
        {cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}
