import React from "react";
import StatCard, { StatCardTone } from "./StatCard";
import {
  CircleCheck,
  Clock,
  FileQuestion,
  ListChecks,
  Send,
  XCircle,
  LucideIcon,
} from "lucide-react";
import { requestType } from "../apis/requestApi";

interface RequestStatsProps {
  requests?: requestType[];
  isLoading: boolean;
}

const RequestStats = ({ requests = [], isLoading }: RequestStatsProps) => {
  const statConfig: {
    title: string;
    statusKey: "all" | "pending" | "approved" | "rejected" | "cancelled" | "forwarded";
    IconName: LucideIcon;
    subtext: string;
    tone: StatCardTone;
  }[] = [
    {
      title: "Total Requests",
      statusKey: "all",
      IconName: FileQuestion,
      subtext: "all requests",
      tone: "info",
    },
    {
      title: "Pending",
      statusKey: "pending",
      IconName: Clock,
      subtext: "awaiting review",
      tone: "warning",
    },
    {
      title: "Approved",
      statusKey: "approved",
      IconName: CircleCheck,
      subtext: "fulfilled requests",
      tone: "success",
    },
    {
      title: "Rejected",
      statusKey: "rejected",
      IconName: XCircle,
      subtext: "declined requests",
      tone: "danger",
    },
    {
      title: "Forwarded",
      statusKey: "forwarded",
      IconName: Send,
      subtext: "needs admin action",
      tone: "info",
    },
    {
      title: "Cancelled",
      statusKey: "cancelled",
      IconName: ListChecks,
      subtext: "withdrawn requests",
      tone: "neutral",
    },
  ];

  const getCountByStatus = (
    statusKey: "all" | "pending" | "approved" | "rejected" | "cancelled" | "forwarded",
  ) =>
    statusKey === "all"
      ? requests.length
      : requests.filter((request) => request.status === statusKey).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-[118px] animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statConfig.map((config) => (
        <StatCard
          key={config.title}
          title={config.title}
          number={getCountByStatus(config.statusKey)}
          subtext={config.subtext}
          IconName={config.IconName}
          tone={config.tone}
        />
      ))}
    </div>
  );
};

export default RequestStats;