"use client";
import { toast } from "react-toastify";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { ChartBarLabel, chartPropsType } from "@/components/others/BarChart";
import { ChartPieLabel } from "@/components/others/PieChart";
import ThemeToggler from "@/components/global/ThemeToggler";

import { api } from "@/lib/apiClient";
import ChartSkeleton from "./skeletonLoaders/chartSkeleton";
import { EmptyChart } from "./emptyStates/emptyChart";
import { AreaChartDefault } from "@/components/ui/areaChart";
import { ChartPieDonut } from "@/components/others/donoutChart";
import ResourceStats from "./ResourceStats";
import UserStats from "./UserStats";
import PageHeader from "./ui/PageHeader";
import { TableError } from "./TableError";
import { useAnalytics } from "../hooks/companyHooks";
import { camelToSentence } from "@/lib/HelperFunctions";

export const handleLogout = async (router: AppRouterInstance) => {
  try {
    const logoutResponse = await api.post(`/logout`, null);
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
export type countsByRoleType={ role: string; _count: number }
export type countsByStatusType={ status: string; _count: number }
export type countsByTypeType={ type: string; _count: number }

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
      <div className="w-full space-y-6 p-6 pb-8">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Track resources, users and requests at a glance."
          actions={<ThemeToggler />}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
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
          ) : isError ? (
            <TableError onRetry={() => refetch()} />
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
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
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
          ) : isError ? (
            <TableError onRetry={() => refetch()} />
          ) : null}
        </section>
      </div>
    </>
  );
};
