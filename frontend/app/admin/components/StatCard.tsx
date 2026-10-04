import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardTone =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type StatCardProps = {
  title: string;
  number: number | string;
  IconName?: LucideIcon;
  subtext?: string;
  tone?: StatCardTone;
  highlighted?: boolean;
  // Deprecated rainbow props — ignored, kept for incremental migration
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
};

const toneBar: Record<StatCardTone, string> = {
  default: "bg-primary",
  success: "bg-[var(--status-success-text)]",
  warning: "bg-[var(--status-pending-text)]",
  danger: "bg-[var(--status-danger-text)]",
  info: "bg-[var(--status-info-text)]",
  neutral: "bg-[var(--status-neutral-text)]",
};

const toneChip: Record<StatCardTone, string> = {
  default: "bg-muted text-muted-foreground",
  success:
    "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
  warning:
    "bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]",
  danger: "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
  info: "bg-[var(--status-info-bg)] text-[var(--status-info-text)]",
  neutral:
    "bg-[var(--status-neutral-bg)] text-[var(--status-neutral-text)]",
};

const StatCard = ({
  title,
  number,
  IconName,
  subtext,
  tone = "default",
  highlighted = false,
}: StatCardProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        highlighted && "border-primary/40"
      )}
    >
      <div
        aria-hidden
        className={cn("absolute inset-y-0 left-0 w-1", toneBar[tone])}
      />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-5">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        {IconName && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              toneChip[tone]
            )}
          >
            <IconName className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent className="pl-5">
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {number}
        </div>
        {subtext && (
          <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
