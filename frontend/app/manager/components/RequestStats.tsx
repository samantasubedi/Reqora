import { CheckCircle2, CircleX, ClipboardList, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import StatCard, { type StatCardTone } from "@/app/admin/components/StatCard";
import type { RequestCounts } from "./dashboardUtils";

type StatConfig = {
  title: string;
  number: number;
  subtext: string;
  IconName: LucideIcon;
  tone: StatCardTone;
};

const percentageOfTotal = (count: number, total: number) =>
  total > 0
    ? `${((count / total) * 100).toFixed(1)}% of total`
    : "0.0% of total";

const RequestStats = ({ counts }: { counts: RequestCounts }) => {
  const statConfig: StatConfig[] = [
    {
      title: "Total Requests",
      number: counts.total,
      subtext: "Requests in your department",
      IconName: ClipboardList,
      tone: "info",
    },
    {
      title: "Pending",
      number: counts.pending,
      subtext: percentageOfTotal(counts.pending, counts.total),
      IconName: Clock,
      tone: "warning",
    },
    {
      title: "Approved",
      number: counts.approved,
      subtext: percentageOfTotal(counts.approved, counts.total),
      IconName: CheckCircle2,
      tone: "success",
    },
    {
      title: "Rejected",
      number: counts.rejected,
      subtext: percentageOfTotal(counts.rejected, counts.total),
      IconName: CircleX,
      tone: "danger",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statConfig.map((config) => (
        <StatCard key={config.title} {...config} />
      ))}
    </div>
  );
};

export default RequestStats;
