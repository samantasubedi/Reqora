"use client";
import { toast } from "react-toastify";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { ChartBarLabel } from "@/components/others/BarChart";
import { ChartPieLabel } from "@/components/others/PieChart";
import ThemeToggler from "@/components/global/ThemeToggler";

import { useResources } from "../hooks/resourceHooks";

import axios from "axios";
import { StatCardsSkeleton } from "./skeletonLoaders/statCardSkeleton";
import ChartSkeleton from "./skeletonLoaders/chartSkeleton";
import { EmptyChart } from "./emptyStates/emptyChart";
import { AreaChartDefault } from "@/components/ui/areaChart";
import { ChartPieDonut } from "@/components/ui/donoutChart";
import ResourceStats from "./ResourceStats";
import UserStats from "./UserStats";
import { useAnalytics } from "../hooks/companyHooks";

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



  const userChartData = [
    { _count: 42, type: "Employees" },
    { _count: 18, type: "Managers" },
    { _count: 6, type: "Admins" },
  ];
  const pieChartData = isSuccess
    ? (data?.resourceStats.countsByStatus ?? [])
        .filter(
          (item: { _count: number; status: string }) => item.status !== "all",
        )
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

        <section className="space-y-4">
          <h2 className="border-b pb-2 text-2xl font-semibold text-foreground">
            Resource Overview
          </h2>

          <ResourceStats countsByStatus={data?.resourceStats.countsByStatus} isLoading={isLoading} />

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
                  <ChartBarLabel chartData={data.resourceStats.countsByType} />
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
