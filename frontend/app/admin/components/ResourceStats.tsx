import React from "react";
import StatCard, { StatCardTone } from "./StatCard";
import {
  Package,
  Check,
  TrendingUp,
  CircleAlert,
  LucideIcon,
} from "lucide-react";
export interface statCardInterface {
  title: string;
  number: number;
  statusKey?: "all" | "available" | "inUse" | "underMaintenance";
  IconName?: LucideIcon;
  subtext?: string;
  tone?: StatCardTone;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

interface ResourceStatsProps {
  countsByStatus?: Array<{
    _count: number;
    status: string;
  }>;
  isLoading: boolean;
}

const ResourceStats = ({
  countsByStatus = [],
  isLoading,
}: ResourceStatsProps) => {
  const resourceStatConfig: Omit<statCardInterface, "number">[] = [
    {
      title: "Total Resources",
      statusKey: "all",
      IconName: Package,
      tone: "info",
    },
    {
      title: "Available",
      statusKey: "available",
      IconName: Check,
      tone: "success",
    },
    {
      title: "In Use",
      statusKey: "inUse",
      IconName: TrendingUp,
      tone: "warning",
    },
    {
      title: "Under Maintenance",
      statusKey: "underMaintenance",
      IconName: CircleAlert,
      tone: "danger",
    },
  ];

  const getAllCount = () => {
    return countsByStatus.find((i) => i.status === "all")?._count ?? 0;
  };

  const getCountByStatus = (status: string) => {
    return countsByStatus.find((i) => i.status === status)?._count ?? 0;
  };

  const getSubText = (currentCount: number) => {
    const allCount = getAllCount();
    return allCount > 0
      ? `${((currentCount / allCount) * 100).toFixed(2)}% of total`
      : "0.00% of total";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[118px] rounded-xl border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {resourceStatConfig.map((config) => {
        const currentCount = getCountByStatus(config.statusKey ?? "all");
        const subtext = getSubText(currentCount);

        return (
          <StatCard
            key={config.statusKey}
            title={config.title}
            number={currentCount}
            IconName={config.IconName}
            subtext={subtext}
            tone={config.tone}
          />
        );
      })}
    </div>
  );
};

export default ResourceStats;
