import React from "react";
import StatCard from "./StatCard";
import { Package, Check, TrendingUp, CircleAlert } from "lucide-react";
import { statCardInterface } from "./AdminDashboard";

interface ResourceStatsProps {
  countsByStatus?: Array<{
    _count: number;
    status: string;
  }>;
  isLoading: boolean;
}

const ResourceStats = ({ countsByStatus = [], isLoading }: ResourceStatsProps) => {
  const resourceStatConfig: Omit<statCardInterface, "number">[] = [
    {
      title: "Total Resources",
      statusKey: "all",
      IconName: Package,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
    },
    {
      title: "Available",
      statusKey: "available",
      IconName: Check,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-500",
    },
    {
      title: "In Use",
      statusKey: "inUse",
      IconName: TrendingUp,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      borderColor: "border-amber-500",
    },
    {
      title: "Under Maintenance",
      statusKey: "underMaintainence",
      IconName: CircleAlert,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-500",
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
          <div key={i} className="h-[180px] rounded-xl border bg-card animate-pulse" />
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
            bgColor={config.bgColor}
            textColor={config.textColor}
            borderColor={config.borderColor}
          />
        );
      })}
    </div>
  );
};

export default ResourceStats;
