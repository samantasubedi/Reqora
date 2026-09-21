"use client";
import React from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
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

const REQUESTS = [
  {
    id: "REQ-8291",
    name: "Dell UltraSharp 32''",
    type: "Hardware",
    date: "Feb 20, 2024",
    status: "pending",
  },
  {
    id: "REQ-8285",
    name: "IntelliJ IDEA License",
    type: "Software",
    date: "Feb 15, 2024",
    status: "approved",
  },
  {
    id: "REQ-8277",
    name: "Mechanical Keyboard",
    type: "Hardware",
    date: "Feb 11, 2024",
    status: "approved",
  },
  {
    id: "REQ-8264",
    name: "Dual Monitor Stand",
    type: "Furniture",
    date: "Feb 3, 2024",
    status: "rejected",
  },
  {
    id: "REQ-8219",
    name: "Jabra Headset",
    type: "Hardware",
    date: "Jan 28, 2024",
    status: "pending",
  },
];

const ASSIGNED_ITEMS = [
  {
    id: "ITM-1156",
    name: "MacBook Pro 16",
    location: "Office - Floor 3",
    status: "inUse",
  },
  {
    id: "ITM-1182",
    name: "Dell UltraSharp 32''",
    location: "Office - Floor 3",
    status: "inUse",
  },
  {
    id: "ITM-0991",
    name: "Office Chair",
    location: "Home Office",
    status: "underMaintenance",
  },
];

const STATUS_BADGE_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  inUse: "bg-emerald-50 text-emerald-700 border-emerald-200",
  underMaintenance: "bg-rose-50 text-rose-700 border-rose-200",
};

const RequestStatusBadge = ({ status }: { status: string }) => (
  <Badge
    className={cn(
      "shadow-none px-2.5 py-0.5 font-semibold capitalize border",
      STATUS_BADGE_STYLES[status],
    )}
  >
    {status}
  </Badge>
);

const EmployeeDashboard = () => {
  const router = useRouter();

  const statCards: Partial<statCardInterface>[] = [
    {
      title: "Total Requests",
      number: 24,
      subtext: "All time",
      IconName: Package,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
    },
    {
      title: "Pending",
      number: 5,
      subtext: "Awaiting review",
      IconName: Clock,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      borderColor: "border-amber-500",
    },
    {
      title: "Approved",
      number: 15,
      subtext: "Approved requests",
      IconName: CheckCircle2,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-500",
    },
    {
      title: "Rejected",
      number: 4,
      subtext: "Rejected requests",
      IconName: XCircle,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-500",
    },
  ];

  const statusChartData = [
    { label: "Approved", value: 15, fill: "var(--chart-2)" },
    { label: "Pending", value: 5, fill: "var(--chart-3)" },
    { label: "Rejected", value: 4, fill: "var(--chart-1)" },
  ];

  const recentRequests = REQUESTS.slice(0, 5);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your assigned resources and track request progress.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className=" text-bold!  duration-300 bg-primary transition-all cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title!}
            number={card.number!}
            IconName={card.IconName}
            subtext={card.subtext}
            bgColor={card.bgColor!}
            textColor={card.textColor!}
            borderColor={card.borderColor!}
          />
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
            <ul className="divide-y">
              {recentRequests.map((req) => (
                <li
                  key={req.id}
                  className="flex items-center justify-between gap-4 px-6 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{req.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">{req.id}</span> · {req.date}
                    </p>
                  </div>
                  <RequestStatusBadge status={req.status} />
                </li>
              ))}
            </ul>
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
              {ASSIGNED_ITEMS.length} assigned
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-transparent">
                  <TableHead className="w-30 pl-6 font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Item</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="pr-6 font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ASSIGNED_ITEMS.map((item) => (
                  <TableRow
                    key={item.id}
                    className="group transition-colors hover:bg-slate-50/50"
                  >
                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground font-medium">
                      {item.id}
                    </TableCell>
                    <TableCell className="font-semibold">{item.name}</TableCell>
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
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
