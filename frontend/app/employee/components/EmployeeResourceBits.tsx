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
    dot: "bg-status-success-text",
    bar: "bg-status-success-text",
    pill: "bg-status-success-bg text-status-success-text border-status-success-border border",
  },
  low: {
    dot: "bg-status-pending-text",
    bar: "bg-status-pending-text",
    pill: "bg-status-pending-bg text-status-pending-text border-status-pending-border border",
  },
  out: {
    dot: "bg-status-danger-text",
    bar: "bg-status-danger-text",
    pill: "bg-status-danger-bg text-status-danger-text border-status-danger-border border",
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
  available:
    "bg-status-success-bg text-status-success-text border-status-success-border border",
  inUse: "bg-status-info-bg text-status-info-text border-status-info-border border",
  underMaintenance:
    "bg-status-pending-bg text-status-pending-text border-status-pending-border border",
};

export const ItemStatusPill = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const label =
    status === "underMaintenance"
      ? "Under maintenance"
      : status === "inUse"
        ? "In use"
        : "Available";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
        itemStatusBadgeClass[status] ?? "",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};