"use client";
import { toast } from "react-toastify";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { ChartBarLabel, chartPropsType } from "@/components/others/BarChart";
import { ChartPieLabel } from "@/components/others/PieChart";
import ThemeToggler from "@/components/global/ThemeToggler";

import { api } from "@/lib/apiClient";
import ChartSkeleton from "./skeletonLoaders/chartSkeleton";
import { EmptyChart } from "./emptyStates/emptyChart";
import { AreaChartLabel } from "@/components/others/AreaChartLabel";
import { ChartPieDonut } from "@/components/others/donoutChart";
import ResourceStats from "./ResourceStats";
import UserStats from "./UserStats";
import PageHeader from "./ui/PageHeader";
import { TableError } from "./TableError";
import { useResourceAnalytics, useUserAnalytics } from "../hooks/companyHooks";
import { camelToSentence } from "@/lib/HelperFunctions";
import { DashboardRangeFilter } from "./dashboard/DashboardRangeFilter";
import { useDashboardRange } from "./dashboard/useDashboardRange";
import { formatRangeSummary } from "./dashboard/dateRange";
import { formatTrendSeries } from "./dashboard/trendLabels";

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
export type countsByRoleType = { role: string; _count: number };
export type countsByStatusType = { status: string; _count: number };
export type countsByTypeType = { type: string; _count: number };

export const AdminDashboard = () => {
  const resourceRange = useDashboardRange();
  const userRange = useDashboardRange();

  const {
    data: resourceData,
    isError: isResourceError,
    isLoading: isResourceLoading,
    isSuccess: isResourceSuccess,
    refetch: refetchResourceAnalytics,
  } = useResourceAnalytics(resourceRange.params);

  const {
    data: userData,
    isError: isUserError,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    refetch: refetchUserAnalytics,
  } = useUserAnalytics(userRange.params);

  const resourceStats = resourceData?.resourceStats;
  const userStats = userData?.userStats;

  const resourceTrendData = formatTrendSeries(
    resourceStats?.resourcesTrend,
    resourceRange.preset,
  );
  const userTrendData = formatTrendSeries(
    userStats?.usersTrend,
    userRange.preset,
  );
  const resourceTickGap = resourceTrendData.length > 12 ? 56 : 20;
  const userTickGap = userTrendData.length > 12 ? 56 : 20;

  const resourceRangeSummary = formatRangeSummary(
    resourceRange.preset,
    resourceRange.customRange,
  );
  const userRangeSummary = formatRangeSummary(
    userRange.preset,
    userRange.customRange,
  );

  const resourceBarChartData: chartPropsType = {
    chartTitle: "Resource Distribution",
    chartData:
      resourceStats?.countsByType.map((item) => ({
        label: item.type,
        value: item._count,
      })) ?? [],
    chartFooter: `Resource items by type · ${resourceRangeSummary}`,
  };

  const userBarChartData: chartPropsType = {
    chartTitle: "User Distribution",
    chartData:
      userStats?.countsByRole.map((item) => ({
        label: item.role,
        value: item._count,
      })) ?? [],
    chartFooter: `Users by role · ${userRangeSummary}`,
  };

  const pieChartData = isResourceSuccess
    ? (resourceStats?.countsByStatus ?? [])
        .filter((item) => item.status !== "all")
        .map((item) => ({
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

  const donoutChartData = isUserSuccess
    ? (userStats?.countsByRole ?? []).map((current) => ({
        label: camelToSentence(current.role),
        value: current._count,
        fill:
          current.role === "admin"
            ? "var(--chart-1)"
            : current.role === "manager"
              ? "var(--chart-2)"
              : "var(--chart-3)",
      }))
    : [];

  const resourcesAddedTotal =
    resourceStats?.countsByStatus.find((item) => item.status === "all")
      ?._count ?? 0;
  const usersJoinedTotal =
    userStats?.countsByRole.reduce((total, item) => total + item._count, 0) ??
    0;

  const resourceTotalLabel =
    resourceRange.preset === "all" ? "Total Resources" : "Resources Added";
  const userTotalLabel =
    userRange.preset === "all" ? "Total Users" : "Users Joined";

  return (
    <>
      <div className="w-full space-y-6 p-6 pb-8">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Track resources, users and requests at a glance."
          actions={<ThemeToggler />}
        />

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Resource Overview
            </h2>
            <DashboardRangeFilter
              preset={resourceRange.preset}
              customRange={resourceRange.customRange}
              isCustomOpen={resourceRange.isCustomOpen}
              onCustomOpenChange={resourceRange.setIsCustomOpen}
              onSelectPreset={resourceRange.selectPreset}
              onSelectCustomRange={resourceRange.selectCustomRange}
              onClearCustomRange={resourceRange.clearCustomRange}
            />
          </div>

          <ResourceStats
            countsByStatus={resourceStats?.countsByStatus}
            isLoading={isResourceLoading}
            totalLabel={resourceTotalLabel}
          />

          {isResourceLoading ? (
            <div className="grid gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
              <ChartSkeleton />
            </div>
          ) : isResourceSuccess ? (
            <div className="grid gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartPieLabel
                  data={pieChartData}
                  footer={`Resource items by status · ${resourceRangeSummary}`}
                />
                {resourceStats?.countsByType && (
                  <ChartBarLabel {...resourceBarChartData} />
                )}
              </div>
              <AreaChartLabel
                chartTitle="Resources Added Over Time"
                chartDescription={`Resource items added · ${resourceRangeSummary}`}
                chartFooter={`${resourcesAddedTotal} resource item${
                  resourcesAddedTotal === 1 ? "" : "s"
                } added`}
                chartData={resourceTrendData}
                valueLabel="Resources"
                minTickGap={resourceTickGap}
              />
            </div>
          ) : isResourceError ? (
            <TableError onRetry={() => refetchResourceAnalytics()} />
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Users Overview
            </h2>
            <DashboardRangeFilter
              preset={userRange.preset}
              customRange={userRange.customRange}
              isCustomOpen={userRange.isCustomOpen}
              onCustomOpenChange={userRange.setIsCustomOpen}
              onSelectPreset={userRange.selectPreset}
              onSelectCustomRange={userRange.selectCustomRange}
              onClearCustomRange={userRange.clearCustomRange}
            />
          </div>

          <UserStats
            countsByRole={userStats?.countsByRole}
            isLoading={isUserLoading}
            totalLabel={userTotalLabel}
          />

          {isUserLoading ? (
            <div className="grid gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
              <ChartSkeleton />
            </div>
          ) : isUserSuccess ? (
            <div className="grid gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartPieDonut
                  data={donoutChartData}
                  title="User Distribution"
                  footer={`Users by role · ${userRangeSummary}`}
                />
                <ChartBarLabel {...userBarChartData} />
              </div>
              <AreaChartLabel
                chartTitle="Users Joined Over Time"
                chartDescription={`Users who joined · ${userRangeSummary}`}
                chartFooter={`${usersJoinedTotal} user${
                  usersJoinedTotal === 1 ? "" : "s"
                } joined`}
                chartData={userTrendData}
                valueLabel="Users"
                minTickGap={userTickGap}
              />
            </div>
          ) : isUserError ? (
            <TableError onRetry={() => refetchUserAnalytics()} />
          ) : null}
        </section>
      </div>
    </>
  );
};
