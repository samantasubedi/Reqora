"use client";
import { toast } from "react-toastify";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { ChartBarLabel, chartPropsType } from "@/components/others/BarChart";
import { ChartPieLabel } from "@/components/others/PieChart";
import ThemeToggler from "@/components/global/ThemeToggler";

import { useResources } from "../hooks/resourceHooks";

import axios from "axios";
import { StatCardsSkeleton } from "./skeletonLoaders/statCardSkeleton";
import ChartSkeleton from "./skeletonLoaders/chartSkeleton";
import { EmptyChart } from "./emptyStates/emptyChart";
import { AreaChartDefault } from "@/components/ui/areaChart";
import { ChartPieDonut } from "@/components/others/donoutChart";
import ResourceStats from "./ResourceStats";
import UserStats from "./UserStats";
import { useAnalytics } from "../hooks/companyHooks";
import { Currency } from "lucide-react";
import { Role } from "@/types/global";
import { camelToSentence } from "@/lib/HelperFunctions";

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
    useAnalytics();
  const userBarChartData: chartPropsType = {
    chartTitle: "User Distribution",
    chartData:
      data?.userStats.countsByRole.map(
        (item: { role: string; _count: number }) => ({
          label: item.role,
          value: item._count,
        }),
      ) ?? [],
    chartFooter: "Showing user distribution by Role ",
  };

  const resourceBarChartData: chartPropsType = {
    chartTitle: "Resource Distribution",
    chartData:
      data?.resourceStats.countsByType.map(
        (item: { type: string; _count: number }) => ({
          label: item.type,
          value: item._count,
        }),
      ) ?? [],
    chartFooter: "Showing resource distribution by Type ",
  };

  const pieChartData = isSuccess
    ? (data?.resourceStats.countsByStatus ?? [])
        .filter(
          (item: { _count: number; status: string }) => item.status !== "all",
        )
        .map((item: { _count: number; status: string }) => ({
          label: camelToSentence(item.status),
          value: item._count,
          fill:
            item.status === "available"
              ? "var(--chart-1)"
              : item.status === "inUse"
                ? "var(--chart-2)"
                : "var(--chart-3)",
        }))
    : [];
  const donoutChartData = isSuccess
    ? data.userStats.countsByRole.map(
        (curr: { _count: string; role: string }) => {
          return {
            label: camelToSentence(curr.role),
            value: curr._count,
            fill:
              curr.role == "admin"
                ? "var(--chart-1)"
                : curr.role == "manager"
                  ? "var(--chart-2)"
                  : "var(--chart-3)",
          };
        },
      )
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

        <section className="space-y-4">
          <h2 className="border-b pb-2 text-2xl font-semibold text-foreground">
            Resource Overview
          </h2>

          <ResourceStats
            countsByStatus={data?.resourceStats.countsByStatus}
            isLoading={isLoading}
          />

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
                {data?.resourceStats.countsByType && (
                  <ChartBarLabel {...resourceBarChartData} />
                )}
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
          <h2 className="border-b pb-2 text-2xl font-semibold text-foreground">
            Users Overview
          </h2>
          <UserStats
            countsByRole={data?.userStats.countsByRole}
            isLoading={isLoading}
          />

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
                <ChartPieDonut
                  data={donoutChartData}
                  title="User Distribution"
                  footer="Showing Users distribution by role"
                />
                <ChartBarLabel {...userBarChartData} />
              </div>
              <AreaChartDefault />
            </div>
          ) : (
            ""
          )}
        </section>
      </div>
    </>
  );
};
