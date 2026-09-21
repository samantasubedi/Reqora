"use client";
import React, { useState } from "react";
import { MoreHorizontal, FileText, Info, Plus, Inbox, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Filter, { FilterConfig, FilterValues } from "@/components/global/Filter";
import { toast } from "react-toastify";

type RequestStatus = "pending" | "approved" | "rejected";

type RequestRecord = {
  id: string;
  name: string;
  type: string;
  quantity: number;
  date: string;
  status: RequestStatus;
  reviewedBy: string | null;
  reason: string;
  note: string | null;
};

const REQUESTS: RequestRecord[] = [
  {
    id: "REQ-8291",
    name: "Dell UltraSharp 32''",
    type: "Hardware",
    quantity: 1,
    date: "Feb 20, 2024",
    status: "pending",
    reviewedBy: null,
    reason: "Upgrading current monitor for better color accuracy on design work.",
    note: null,
  },
  {
    id: "REQ-8285",
    name: "IntelliJ IDEA License",
    type: "Software",
    quantity: 1,
    date: "Feb 15, 2024",
    status: "approved",
    reviewedBy: "Sarah Chen",
    reason: "Needed for Java backend development of the Reqora platform.",
    note: null,
  },
  {
    id: "REQ-8277",
    name: "Mechanical Keyboard",
    type: "Hardware",
    quantity: 1,
    date: "Feb 11, 2024",
    status: "approved",
    reviewedBy: "Sarah Chen",
    reason: "Current keyboard has sticky keys affecting typing speed.",
    note: null,
  },
  {
    id: "REQ-8264",
    name: "Dual Monitor Stand",
    type: "Furniture",
    quantity: 2,
    date: "Feb 3, 2024",
    status: "rejected",
    reviewedBy: "Mike Ross",
    reason: "Dual monitor setup for improved home office productivity.",
    note: "Budget limit exceeded for Q1",
  },
  {
    id: "REQ-8219",
    name: "Jabra Headset",
    type: "Hardware",
    quantity: 1,
    date: "Jan 28, 2024",
    status: "pending",
    reviewedBy: null,
    reason: "Replacing faulty headset used for daily client calls.",
    note: null,
  },
  {
    id: "REQ-8204",
    name: "4K Webcam",
    type: "Hardware",
    quantity: 1,
    date: "Jan 18, 2024",
    status: "approved",
    reviewedBy: "Sarah Chen",
    reason: "Higher video quality required for product demos.",
    note: null,
  },
  {
    id: "REQ-8188",
    name: "Standing Desk",
    type: "Furniture",
    quantity: 1,
    date: "Jan 9, 2024",
    status: "approved",
    reviewedBy: "Sarah Chen",
    reason: "Ergonomic requirement recommended by physiotherapist.",
    note: null,
  },
  {
    id: "REQ-8062",
    name: "Photoshop License",
    type: "Software",
    quantity: 1,
    date: "Dec 20, 2023",
    status: "rejected",
    reviewedBy: "Mike Ross",
    reason: "Occasional image editing for marketing material.",
    note: "License pool already allocated",
  },
  {
    id: "REQ-8041",
    name: "External SSD 1TB",
    type: "Hardware",
    quantity: 1,
    date: "Dec 12, 2023",
    status: "pending",
    reviewedBy: null,
    reason: "Backup drive for large media project files.",
    note: null,
  },
  {
    id: "REQ-8017",
    name: "Herman Miller Aeron",
    type: "Furniture",
    quantity: 1,
    date: "Dec 5, 2023",
    status: "approved",
    reviewedBy: "Sarah Chen",
    reason: "Office chair replacement for chronic back pain.",
    note: null,
  },
];

const STATUS_BADGE_STYLES: Record<RequestStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const TAB_FILTERS = ["all", "pending", "approved", "rejected"] as const;
type TabFilter = (typeof TAB_FILTERS)[number];

const REQUEST_TYPES = ["Hardware", "Software", "Furniture"] as const;

const requestFilterConfig: FilterConfig[] = [
  {
    key: "type",
    title: "Type",
    type: "select",
    multiple: true,
    options: REQUEST_TYPES.map((type) => ({ label: type, value: type })),
  },
];

const TABLE_COLUMNS = ["ID", "Resource", "Reviewer", "Date", "Status", "Action"];

const MyRequests = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestRecord[]>(REQUESTS);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [cancelTarget, setCancelTarget] = useState<RequestRecord | null>(null);

  const countByStatus = (status: RequestStatus) =>
    requests.filter((r) => r.status === status).length;

  const filteredRequests = requests.filter((req) => {
    const matchesTab = activeTab === "all" || req.status === activeTab;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      req.name.toLowerCase().includes(query) ||
      req.id.toLowerCase().includes(query);
    const typeFilter = filters.type as string[] | undefined;
    const matchesType =
      !typeFilter || typeFilter.length === 0 || typeFilter.includes(req.type);
    return matchesTab && matchesSearch && matchesType;
  });

  const handleCancel = () => {
    if (!cancelTarget) return;
    setRequests((prev) => prev.filter((req) => req.id !== cancelTarget.id));
    toast.success(`Request ${cancelTarget.id} cancelled`);
    setCancelTarget(null);
  };

  const renderFilteredBody = () => {
    if (filteredRequests.length === 0) {
      return (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={TABLE_COLUMNS.length} className="p-0">
            <div className="flex min-h-[280px] w-full flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-6 p-4 bg-background rounded-full shadow-sm">
                <Inbox className="size-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-primary mb-3">
                No requests found
              </h2>
              <p className="m-4 font-semibold text-muted-foreground">
                {activeTab === "all"
                  ? "You haven't submitted any requests yet. Request a new resource to get started."
                  : `You have no ${activeTab} requests.`}
              </p>
              <button
                onClick={() => router.push("/employee/resources")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm bg-secondary cursor-pointer"
              >
                <Plus className="size-5" />
                Request New Resource
              </button>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return filteredRequests.map((req) => (
      <TableRow
        key={req.id}
        className="group transition-colors cursor-pointer hover:bg-slate-50/50"
        onClick={() => router.push(`/employee/requests/${req.id}`)}
      >
        <TableCell className="pl-6 font-mono text-xs text-slate-500 font-medium whitespace-nowrap">
          {req.id}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{req.name}</span>
            <Badge
              variant="outline"
              className="font-medium bg-white capitalize shadow-none"
            >
              {req.type}
            </Badge>
            {req.quantity > 1 && (
              <Badge variant="secondary" className="font-medium shadow-none">
                {req.quantity} ×
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Quantity: {req.quantity}</p>
        </TableCell>
        <TableCell className="text-slate-600 whitespace-nowrap">
          {req.reviewedBy ?? "—"}
        </TableCell>
        <TableCell className="text-slate-600 whitespace-nowrap">{req.date}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "shadow-none px-2.5 py-0.5 font-semibold capitalize border",
                STATUS_BADGE_STYLES[req.status],
              )}
            >
              {req.status}
            </Badge>
            {req.note && (
              <div title={req.note} className="cursor-help flex items-center">
                <Info className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right pr-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-slate-200/50"
                aria-label={`Actions for ${req.id}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Manage</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/employee/requests/${req.id}`)}
              >
                <FileText className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              {req.status === "pending" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-rose-600 cursor-pointer focus:text-rose-600 focus:bg-rose-50"
                    onClick={() => setCancelTarget(req)}
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel Request
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground">
            Monitor and manage your resource acquisition history.
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 shadow-sm cursor-pointer"
          onClick={() => router.push("/employee/resources")}
        >
          <Plus className="h-4 w-4" /> Request New Resource
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabFilter)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          {TAB_FILTERS.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                "gap-2 capitalize",
                "data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground!",
              )}
            >
              {tab}
              {tab !== "all" && (
                <span className="rounded-full bg-muted px-1.5 text-xs font-semibold data-[state=active]:bg-primary-foreground/20">
                  {countByStatus(tab)}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="p-2"
                      colSpan={TABLE_COLUMNS.length}
                    >
                      <div className="flex justify-end gap-5">
                        <Input
                          placeholder="Search requests..."
                          className="w-[50%] bg-secondary!"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Filter
                          filters={requestFilterConfig}
                          setFilters={setFilters}
                        />
                      </div>
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-slate-50/50 hover:bg-transparent">
                    {TABLE_COLUMNS.map((label, index) => (
                      <TableHead
                        key={label}
                        className={cn(
                          "font-semibold",
                          index === 0 && "pl-6",
                          index === TABLE_COLUMNS.length - 1 &&
                            "text-right pr-6",
                        )}
                      >
                        {label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>{renderFilteredBody()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel request{" "}
              <span className="font-mono font-semibold">{cancelTarget?.id}</span>{" "}
              for <span className="font-semibold">{cancelTarget?.name}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Request</AlertDialogCancel>
            <AlertDialogAction
              className="text-white bg-red-600 hover:bg-red-500 cursor-pointer"
              onClick={handleCancel}
            >
              Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyRequests;