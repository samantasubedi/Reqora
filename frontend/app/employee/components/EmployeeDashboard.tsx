"use client";
import React, { useMemo } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Forward,
  Plus,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatCard from "@/app/admin/components/StatCard";
import type { statCardInterface } from "@/app/admin/components/ResourceStats";
import { ChartPieDonut } from "@/components/others/donoutChart";
import { useMyItems, useMyRequests } from "@/app/employee/hooks/requestHooks";

const STATUS_BADGE_STYLES: Record<string, string> = {
  pending:
    "bg-status-pending-bg text-status-pending-text border-status-pending-border",
  approved:
    "bg-status-success-bg text-status-success-text border-status-success-border",
  rejected:
    "bg-status-danger-bg text-status-danger-text border-status-danger-border",
  cancelled:
    "bg-status-neutral-bg text-status-neutral-text border-status-neutral-border",
  forwarded:
    "bg-status-info-bg text-status-info-text border-status-info-border",
  inUse:
    "bg-status-info-bg text-status-info-text border-status-info-border",
  underMaintenance:
    "bg-status-pending-bg text-status-pending-text border-status-pending-border",
  available:
    "bg-status-success-bg text-status-success-text border-status-success-border",
};

const RequestStatusBadge = ({ status }: { status: string }) => (
  <Badge
    className={cn(
      "shadow-none px-2.5 py-0.5 font-semibold capitalize border",
      STATUS_BADGE_STYLES[status] ?? STATUS_BADGE_STYLES.cancelled,
    )}
  >
    {status}
  </Badge>
);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const EmployeeDashboard = () => {
  const router = useRouter();
  const {
    data: allRequestsRes,
    isLoading: requestsLoading,
    isError: requestsError,
    refetch: refetchRequests,
  } = useMyRequests();
  const {
    data: recentRes,
    isLoading: recentLoading,
    isError: recentError,
    refetch: refetchRecent,
  } = useMyRequests({ limit: 5 });
  const {
    data: itemsRes,
    isLoading: itemsLoading,
    isError: itemsError,
    refetch: refetchItems,
  } = useMyItems();

  const allRequests = useMemo(
    () => allRequestsRes?.data ?? [],
    [allRequestsRes],
  );
  const recentRequests = useMemo(() => recentRes?.data ?? [], [recentRes]);
  const assignedItems = useMemo(() => itemsRes?.data ?? [], [itemsRes]);

  const counts = useMemo(() => {
    const c = {
      total: allRequests.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      forwarded: 0,
    };
    for (const r of allRequests) {
      if (r.status in c) c[r.status as keyof typeof c] += 1;
    }
    return c;
  }, [allRequests]);

  const statCards: Partial<statCardInterface>[] = [
    {
      title: "Total Requests",
      number: counts.total,
      subtext: "All time",
      IconName: Package,
      tone: "default",
    },
    {
      title: "Pending",
      number: counts.pending,
      subtext: "Awaiting review",
      IconName: Clock,
      tone: "warning",
    },
    {
      title: "Approved",
      number: counts.approved,
      subtext: "Approved requests",
      IconName: CheckCircle2,
      tone: "success",
    },
    {
      title: "Rejected",
      number: counts.rejected,
      subtext: "Rejected requests",
      IconName: XCircle,
      tone: "danger",
    },
    {
      title: "Cancelled",
      number: counts.cancelled,
      subtext: "Cancelled by you",
      IconName: Ban,
      tone: "neutral",
    },
    {
      title: "Forwarded",
      number: counts.forwarded,
      subtext: "Escalated to admin",
      IconName: Forward,
      tone: "info",
    },
  ];

  const statusChartData = [
    { label: "Approved", value: counts.approved, fill: "var(--chart-2)" },
    { label: "Pending", value: counts.pending, fill: "var(--chart-3)" },
    { label: "Rejected", value: counts.rejected, fill: "var(--chart-1)" },
    { label: "Cancelled", value: counts.cancelled, fill: "var(--chart-4)" },
    { label: "Forwarded", value: counts.forwarded, fill: "var(--chart-5)" },
  ];

  const showRequestsSkeleton = requestsLoading || recentLoading;

  return (
    <div className="w-full space-y-6 p-6 pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your assigned resources and track request progress.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            className="cursor-pointer gap-2 shadow-sm"
            onClick={() => router.push("/employee/resources")}
          >
            <Plus className="h-4 w-4" /> New Request
          </Button>
        </div>
      </div>

      <section className="flex gap-4 overflow-x-auto pb-2">
        {showRequestsSkeleton
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[118px] min-w-[240px] flex-1 animate-pulse rounded-xl border bg-card"
              />
            ))
          : statCards.map((card) => (
              <div key={card.title} className="min-w-[240px] flex-1 snap-start">
                <StatCard
                  title={card.title!}
                  number={card.number!}
                  IconName={card.IconName}
                  subtext={card.subtext}
                  tone={card.tone}
                />
              </div>
            ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="flex h-full flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-xl">Recent Requests</CardTitle>
              <CardDescription>Your latest resource requests.</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              onClick={() => router.push("/employee/requests")}
            >
              View all <ExternalLink className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {showRequestsSkeleton ? (
              <ul className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-4 px-6 py-3"
                  >
                    <div className="w-full space-y-2">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : requestsError || recentError ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Failed to load your requests.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    refetchRequests();
                    refetchRecent();
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <p className="text-sm font-semibold">No requests yet</p>
                <p className="text-sm text-muted-foreground">
                  Browse resources to create your first request.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/employee/resources")}
                >
                  Browse Resources
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentRequests.map((req) => (
                  <li
                    key={req.requestId}
                    className="flex cursor-pointer items-center justify-between gap-4 px-6 py-3 transition-colors hover:bg-muted/50"
                    onClick={() =>
                      router.push(`/employee/requests/${req.requestId}`)
                    }
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {req.resourceName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono">
                          {req.requestId.slice(0, 8)}
                        </span>{" "}
                        · {formatDate(req.createdAt)}
                      </p>
                    </div>
                    <RequestStatusBadge status={req.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <ChartPieDonut
          title="Request Status"
          description="Breakdown of your requests"
          footer="Showing your requests by status"
          data={statusChartData}
        />
      </section>

      <section className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-xl">My Assigned Items</CardTitle>
              <CardDescription>
                Resources currently assigned to you.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="px-3 py-1 font-semibold">
              {itemsLoading ? "…" : `${assignedItems.length} assigned`}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {itemsLoading ? (
              <div className="space-y-2 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-full animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
            ) : itemsError ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Failed to load assigned items.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchItems()}
                >
                  Retry
                </Button>
              </div>
            ) : assignedItems.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <p className="text-sm font-semibold">No items assigned</p>
                <p className="text-sm text-muted-foreground">
                  Approved requests will show up here.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/employee/resources")}
                >
                  Browse Resources
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-30 pl-6 font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="pr-6 font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedItems.slice(0, 5).map((item) => (
                    <TableRow
                      key={item.id}
                      className="group cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => router.push("/employee/my-resources")}
                    >
                      <TableCell className="pl-6 font-mono text-xs text-muted-foreground font-medium">
                        {item.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.location}
                      </TableCell>
                      <TableCell className="pr-6">
                        <RequestStatusBadge status={item.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
