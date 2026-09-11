"use client";
import {
  Briefcase,
  ChartCandlestickIcon,
  Check,
  CircleAlert,
  LucideIcon,
  Package,
  ShieldCheck,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import StatCard from "./StatCard";

import { ResourceTable } from "./ResourceTable";

import { toast } from "react-toastify";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { useEffect, useState } from "react";

import { TableError } from "./TableError";
import TableEmpty from "./emptyStates/TableEmpty";
import { ChartBarLabel } from "@/components/others/BarChart";
import { ChartPieLabel } from "@/components/others/PieChart";
import ThemeToggler from "@/components/global/ThemeToggler";

import { useResources } from "../hooks/resourceHooks";
import { DashboardSkeleton } from "./skeletonLoaders/DahsboardSkeleton";
import axios from "axios";
import { StatCardsSkeleton } from "./skeletonLoaders/statCardSkeleton";
import ChartSkeleton from "./skeletonLoaders/chartSkeleton";
import { EmptyChart } from "./emptyStates/emptyChart";
import { AreaChartDefault } from "@/components/ui/areaChart";
import { ChartPieDonut } from "@/components/ui/donoutChart";
export enum ResourceStatus {
  available = "available",
  inUse = "inUse",
  underMaintainence = "underMaintainence",
}

export interface statCardInterface {
  title: string;
  statusKey?: "all" | "available" | "inUse" | "underMaintainence";
  number: number;
  IconName?: LucideIcon;
  subtext?: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}
export type resourceType = {
  id: string;
  name: string;
  location: string;
  department: string;
  type: string;
  availability: boolean;
  status: ResourceStatus;
  totalQuantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
};
export type tableResourceType = {
  id: string;
  name: string;
  status: ResourceStatus;
  type: string;
  department: string;
  location: string;
  availability: boolean;
  availabilityPercentage?: number;
};

export const handleLogout = async (router: AppRouterInstance) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const logoutResponse = await axios.post(`${backendUrl}/logout`, null, {
      withCredentials: true,
    });
    if (
      logoutResponse.data.success === true &&
      logoutResponse.data.code === "LOGOUT_SUCCESSFULL"
    ) {
      toast.success(logoutResponse.data.message);
      router.push("/");
    }
    console.log(logoutResponse.data);
  } catch (err) {
    console.log("request failed", err);
  }
};

export const AdminDashboard = () => {
  const { isError, error, data, isSuccess, isLoading, refetch } =
    useResources();

  if (isSuccess) {
    console.log(data, "this is resource");
  }

  const resourceStat: statCardInterface[] = [
    {
      title: "Total Resources",
      statusKey: "all",
      number: 0,
      IconName: Package,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
    },
    {
      title: "Available",
      statusKey: "available",
      number: 0,
      IconName: Check,
      subtext: ``,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-500",
    },
    {
      title: "In Use",
      statusKey: "inUse",
      number: 0,
      IconName: TrendingUp,
      subtext: ``,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      borderColor: "border-amber-500",
    },
    {
      title: "Under Maintenance",
      statusKey: "underMaintainence",
      number: 0,
      IconName: CircleAlert,
      subtext: ``,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-500",
    },
  ];
  const userStat: statCardInterface[] = [
    {
      title: "Total Users",
      number: 0,
      IconName: Users,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
    },
    {
      title: "Employees",
      number: 0,
      IconName: Briefcase,
      subtext: ``,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-500",
    },
    {
      title: "Managers",
      number: 0,
      IconName: UserCog,
      subtext: ``,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      borderColor: "border-amber-500",
    },
    {
      title: "Admins",
      number: 0,
      IconName: ShieldCheck,
      subtext: ``,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-500",
    },
  ];
  const userChartData = [
    { _count: 42, type: "Employees" },
    { _count: 18, type: "Managers" },
    { _count: 6, type: "Admins" },
  ];
  const pieChartData = isSuccess
    ? (data?.countsByStatus ?? [])
        .filter((item: { _count: number; status: string }) => item.status !== "all")
        .map((item: { _count: number; status: string }) => ({
          status: item.status,
          Resources: item._count,
          fill:
            item.status === "available"
              ? "var(--color-Available)"
              : item.status === "inUse"
                ? "var(--color-InUse)"
                : "var(--color-UnderMaintenance)",
        }))
    : [];
  return (
    <>
      <div className="w-full min-h-screen space-y-6 px-3 pb-8">
        <div className="flex justify-between">
          <h1 className="m-2 text-4xl font-bold text-primary">
            Admin Dashboard
          </h1>
          <ThemeToggler />
        </div>
        <div className="flex justify-between px-2">
          <p className="m-2 font-semibold text-text-primary">
            Monitor and manage all organization resource
          </p>
        </div>
        <section className="space-y-4">
          <h2 className="border-b pb-2 text-2xl font-semibold text-primary">
            Resource Overview
          </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <StatCardsSkeleton />
          ) : (
            resourceStat.map((curr) => {
              const countsByStatus = data?.countsByStatus ?? [];
              const currentCount =
                countsByStatus.find(
                  (i: { _count: number; status: string }) =>
                    i.status === curr.statusKey,
                )?._count ?? curr.number;
              const allCount =
                countsByStatus.find(
                  (i: { _count: number; status: string }) => i.status === "all",
                )?._count ?? 0;
              const subText =
                allCount > 0
                  ? `${((currentCount / allCount) * 100).toFixed(2)}% of total`
                  : "0.00% of total";

              return (
                <StatCard
                  key={curr.statusKey}
                
                  title={curr.title}
                  number={currentCount}
                  IconName={curr.IconName}
                  subtext={subText}
                  bgColor={curr.bgColor}
                  textColor={curr.textColor}
                  borderColor={curr.borderColor}
                ></StatCard>
              );
            })
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
            <ChartSkeleton />
          </div>
        ) : isSuccess ? (
          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <ChartPieLabel data={pieChartData} />
              {data?.countsByType && <ChartBarLabel chartData={data.countsByType} />}
            </div>
            <AreaChartDefault />
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <EmptyChart />
              <EmptyChart />
            </div>
            <EmptyChart />
          </div>
        )}
        </section>

        <section className="space-y-4 border-t pt-6">
          <h2 className="border-b pb-2 text-2xl font-semibold text-primary">
            Users Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {userStat.map((curr) => (
              <StatCard
                key={curr.title}
                title={curr.title}
                number={curr.number}
                IconName={curr.IconName}
                subtext={curr.subtext}
                bgColor={curr.bgColor}
                textColor={curr.textColor}
                borderColor={curr.borderColor}
              />
            ))}
          </div>
          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <ChartPieDonut />
              <ChartBarLabel chartData={userChartData} />
            </div>
            <AreaChartDefault />
          </div>
        </section>
      </div>
    </>
  );
};
