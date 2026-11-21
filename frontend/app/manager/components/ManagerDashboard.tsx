"use client";

import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChartBarLabel } from "@/components/others/BarChart";
import { ChartPieDonut } from "@/components/others/donoutChart";
import { AreaChartLabel } from "@/components/others/AreaChartLabel";
import { TableError } from "@/app/admin/components/TableError";
import { StatCardsSkeleton } from "@/app/admin/components/skeletonLoaders/statCardSkeleton";
import ChartSkeleton from "@/app/admin/components/skeletonLoaders/chartSkeleton";
import RequestStats from "./RequestStats";
import { useManagerRequests } from "../hooks/requestHooks";
import {
  getRequestCounts,
  getRequestsByMonth,
  getRequestsByType,
  getStatusChartData,
} from "./dashboardUtils";

export default function ManagerDashboard() {
  const { data, isLoading, isError, refetch } = useManagerRequests();
  const requests = useMemo(() => data?.data ?? [], [data]);

  const counts = useMemo(() => getRequestCounts(requests), [requests]);
  const requestsByType = useMemo(() => getRequestsByType(requests), [requests]);
  const statusChartData = useMemo(() => getStatusChartData(counts), [counts]);
  const requestsByMonth = useMemo(
    () => getRequestsByMonth(requests),
    [requests],
  );

  const hasRequests = requests.length > 0;

  return (
    <div className="w-full space-y-6 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-primary">Manager Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Review and manage resource requests from your team.
        </p>
      </div>

      {isLoading ? (
        <>
          <StatCardsSkeleton />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          <ChartSkeleton />
        </>
      ) : isError ? (
        <TableError
          title="Unable to load dashboard"
          message="We couldn't load your department's requests. Check your connection and try again."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <RequestStats counts={counts} />

          {hasRequests ? (
            <>
              <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ChartBarLabel
                  chartTitle="Requests by Resource Type"
                  chartData={requestsByType}
                  chartFooter="Showing requests grouped by resource type"
                />
                <ChartPieDonut
                  title="Request Status Distribution"
                  data={statusChartData}
                  footer="Showing requests grouped by status"
                />
              </section>

              <AreaChartLabel
                chartTitle="Requests Over Time"
                chartDescription="Showing requests for the last 6 months"
                chartData={requestsByMonth}
                chartFooter="Requests in your department over the last 6 months"
              />
            </>
          ) : (
            <Card className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-dashed p-8 text-center">
              <BarChart3 className="size-10 text-primary" />
              <div>
                <p className="text-lg font-semibold text-foreground">
                  No requests yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Charts will populate once your team starts submitting
                  requests.
                </p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
