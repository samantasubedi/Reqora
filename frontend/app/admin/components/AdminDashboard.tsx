"use client";
import { Check, CircleAlert, LucideIcon, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import { Book, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceTable } from "./ResourceTable";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TableSkeleton } from "./TableSkeleton";
import { TableError } from "./TableError";
import TableEmpty from "./TableEmpty";
import { ChartPieLabel } from "@/components/others/PieChart";
import {
  ChartBarLabel,
  countByStatusType,
  countByTypeType,
} from "@/components/others/BarChart";
import ThemeToggler from "@/components/global/ThemeToggler";

import { useResources } from "../hooks/resourceHooks";
export enum ResourceStatus {
  available = "available",
  inUse = "inUse",
  underMaintainence = "underMaintainence",
}

export interface statCardInterface {
  title: string;
  statusKey: "all" | "available" | "inUse" | "underMaintainence";
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

  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }, [isError, error]);

  if (isSuccess) {
    console.log(data, "this is resource");
  }

  const AdminStat: statCardInterface[] = [
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

  const pieChartData = isSuccess
    ? data.countsByStatus
        .filter((curr: { _count: number; status: string }) => {
          return curr.status != "all";
        })
        .map((i: { _count: number; status: string }) => {
          return {
            status: i.status,
            Resources: i._count,
            fill:
              i.status == "available"
                ? "var(--color-Available)"
                : i.status == "inUse"
                  ? "var(--color-InUse)"
                  : "var(--color-UnderMaintenance)",
          };
        })
    : [];

  return (
    <>
      <div className="w-full  min-h-screen">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold text-primary m-2">
            Admin Dashboard
          </h1>
          <ThemeToggler />
        </div>
        <div className="flex justify-between px-3">
          <p className="text-text-primary font-semibold m-2">
            Monitor and manage all organization resource
          </p>
        </div>
        <div className="flex justify-between m-3">
          {isSuccess &&
            AdminStat.map((curr, index) => {
              const currentStatus = data.countsByStatus.find(
                (i: { _count: number; status: string }) => {
                  return i.status === curr.statusKey;
                },
              );

              if (!currentStatus) return;

              const allCount = data.countsByStatus.find(
                (i: { _count: number; status: string }) => {
                  return i.status === "all";
                },
              )?._count;

              if (!allCount) return;

              const subText = `${((currentStatus?._count / allCount) * 100).toFixed(2)}% of total`;

              return (
                <StatCard
                  key={index}
                  statusKey={curr.statusKey}
                  title={curr.title}
                  number={currentStatus._count}
                  IconName={curr.IconName}
                  subtext={subText}
                  bgColor={curr.bgColor}
                  textColor={curr.textColor}
                  borderColor={curr.borderColor}
                ></StatCard>
              );
            })}
        </div>
        <div className="flex justify-evenly items-center">
          {isSuccess && (
            <div className="w-[40%]">
              <ChartPieLabel data={pieChartData} />
            </div>
          )}
          {data?.countsByType && (
            <div className="w-[40%]">
              <ChartBarLabel chartData={data.countsByType} />
            </div>
          )}
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <TableError
            onRetry={() => {
              refetch();
            }}
          />
        ) : data?.allResources.length ? (
          <ResourceTable resourceData={data.allResources} />
        ) : (
          <TableEmpty />
        )}
      </div>
    </>
  );
};
