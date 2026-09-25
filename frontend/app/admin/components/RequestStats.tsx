import React from "react";
import StatCard from "./StatCard";
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
    bgColor: string;
    textColor: string;
    borderColor: string;
  }[] = [
    {
      title: "Total Requests",
      statusKey: "all",
      IconName: FileQuestion,
      subtext: "all requests",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
    },
    {
      title: "Pending",
      statusKey: "pending",
      IconName: Clock,
      subtext: "awaiting review",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      borderColor: "border-amber-500",
    },
    {
      title: "Approved",
      statusKey: "approved",
      IconName: CircleCheck,
      subtext: "fulfilled requests",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-500",
    },
    {
      title: "Rejected",
      statusKey: "rejected",
      IconName: XCircle,
      subtext: "declined requests",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-500",
    },
    {
      title: "Forwarded",
      statusKey: "forwarded",
      IconName: Send,
      subtext: "needs admin action",
      bgColor: "bg-violet-100",
      textColor: "text-violet-800",
      borderColor: "border-violet-500",
    },
    {
      title: "Cancelled",
      statusKey: "cancelled",
      IconName: ListChecks,
      subtext: "withdrawn requests",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      borderColor: "border-gray-500",
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
            className="h-[180px] animate-pulse rounded-xl border bg-card"
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
          bgColor={config.bgColor}
          textColor={config.textColor}
          borderColor={config.borderColor}
        />
      ))}
    </div>
  );
};

export default RequestStats;