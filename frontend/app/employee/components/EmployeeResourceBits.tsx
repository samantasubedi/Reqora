import { cn } from "@/lib/utils";

export type AvailabilityLevel = "available" | "low" | "out";

export const getAvailabilityLevel = (
  available: number,
  total: number,
): AvailabilityLevel => {
  if (available === 0) return "out";
  if (total > 0 && available / total <= 0.3) return "low";
  return "available";
};

const levelStyles: Record<
  AvailabilityLevel,
  { dot: string; bar: string; pill: string }
> = {
  available: {
    dot: "bg-green-500",
    bar: "bg-green-500",
    pill: "bg-green-500/10 text-green-700 dark:text-green-400",
  },
  low: {
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  out: {
    dot: "bg-red-500",
    bar: "bg-red-500",
    pill: "bg-red-500/10 text-red-700 dark:text-red-400",
  },
};

const levelLabel: Record<AvailabilityLevel, string> = {
  available: "Available",
  low: "Low stock",
  out: "Out of stock",
};

export const ResourceStatusPill = ({
  available,
  total,
  className,
}: {
  available: number;
  total: number;
  className?: string;
}) => {
  const level = getAvailabilityLevel(available, total);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold",
        levelStyles[level].pill,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", levelStyles[level].dot)} />
      {levelLabel[level]}
    </span>
  );
};

export const AvailabilityBar = ({
  available,
  total,
  showLabel = true,
  className,
}: {
  available: number;
  total: number;
  showLabel?: boolean;
  className?: string;
}) => {
  const level = getAvailabilityLevel(available, total);
  const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

  return (
    <div className={className}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            levelStyles[level].bar,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{available}</span> of{" "}
          {total} available
        </p>
      )}
    </div>
  );
};

export const itemStatusBadgeClass: Record<string, string> = {
  available: "bg-green-500/10 text-green-700 dark:text-green-400",
  inUse: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  underMaintenance: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};