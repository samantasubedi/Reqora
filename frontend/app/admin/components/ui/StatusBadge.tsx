import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type StatusTone = "pending" | "success" | "danger" | "info" | "neutral";

const statusToTone: Record<string, StatusTone> = {
  pending: "pending",
  undermaintenance: "pending",
  manager: "pending",
  // success / emerald
  approved: "success",
  available: "success",
  employee: "success",
  success: "success",
  onboarding: "success",
  active: "success",
  // danger / red
  rejected: "danger",
  danger: "danger",
  admin: "danger",
  failed: "danger",
  // info / violet
  forwarded: "info",
  inuse: "info",
  info: "info",
  resource: "info",
  request: "pending",
  // neutral / gray
  cancelled: "neutral",
  neutral: "neutral",
  all: "neutral",
  total: "neutral",
};

const toneClass: Record<StatusTone, string> = {
  pending:
    "bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] border-[var(--status-pending-border)]",
  success:
    "bg-[var(--status-success-bg)] text-[var(--status-success-text)] border-[var(--status-success-border)]",
  danger:
    "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)] border-[var(--status-danger-border)]",
  info: "bg-[var(--status-info-bg)] text-[var(--status-info-text)] border-[var(--status-info-border)]",
  neutral:
    "bg-[var(--status-neutral-bg)] text-[var(--status-neutral-text)] border-[var(--status-neutral-border)]",
};

export default function StatusBadge({
  status,
  className,
  children,
}: {
  status: string | null | undefined;
  className?: string;
  children?: ReactNode;
}) {
  const key = (status ?? "N/A").toLowerCase().replace(/[\s_-]/g, "");
  const tone = statusToTone[key] ?? "neutral";
  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", toneClass[tone], className)}
    >
      {children ?? status ?? "N/A"}
    </Badge>
  );
}
