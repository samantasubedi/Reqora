"use client";
import React, { useState } from "react";
import {
  MoreHorizontal,
  FileText,
  Info,
  Plus,
  Inbox,
  X,
  Star,
  LayoutGrid,
  List,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Hourglass,
  RotateCcw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { calculatePages } from "@/lib/HelperFunctions";
import StatCard from "@/app/admin/components/StatCard";
import type { statCardInterface } from "@/app/admin/components/ResourceStats";
import InitialsAvatar from "@/app/manager/components/InitialsAvatar";
import { toast } from "react-toastify";

type RequestStatus = "pending" | "approved" | "rejected";
type Priority = "low" | "medium" | "high";

type RequestRecord = {
  id: string;
  name: string;
  type: string;
  quantity: number;
  date: string;
  createdAt: string;
  status: RequestStatus;
  priority: Priority;
  reviewedBy: string | null;
  reason: string;
  note: string | null;
  favorite: boolean;
};

const REQUESTS: RequestRecord[] = [
  {
    id: "REQ-8291",
    name: "Dell UltraSharp 32''",
    type: "Hardware",
    quantity: 1,
    date: "Feb 20, 2024",
    createdAt: "2024-02-20T10:24:00",
    status: "pending",
    priority: "medium",
    reviewedBy: null,
    reason: "Upgrading current monitor for better color accuracy on design work.",
    note: null,
    favorite: false,
  },
  {
    id: "REQ-8285",
    name: "IntelliJ IDEA License",
    type: "Software",
    quantity: 1,
    date: "Feb 15, 2024",
    createdAt: "2024-02-15T10:05:00",
    status: "approved",
    priority: "high",
    reviewedBy: "Sarah Chen",
    reason: "Needed for Java backend development of the Reqora platform.",
    note: null,
    favorite: true,
  },
  {
    id: "REQ-8277",
    name: "Mechanical Keyboard",
    type: "Hardware",
    quantity: 1,
    date: "Feb 11, 2024",
    createdAt: "2024-02-11T09:00:00",
    status: "approved",
    priority: "low",
    reviewedBy: "Sarah Chen",
    reason: "Current keyboard has sticky keys affecting typing speed.",
    note: null,
    favorite: false,
  },
  {
    id: "REQ-8264",
    name: "Dual Monitor Stand",
    type: "Furniture",
    quantity: 2,
    date: "Feb 3, 2024",
    createdAt: "2024-02-03T09:12:00",
    status: "rejected",
    priority: "low",
    reviewedBy: "Mike Ross",
    reason: "Dual monitor setup for improved home office productivity.",
    note: "Budget limit exceeded for Q1",
    favorite: false,
  },
  {
    id: "REQ-8219",
    name: "Jabra Headset",
    type: "Hardware",
    quantity: 1,
    date: "Jan 28, 2024",
    createdAt: "2024-01-28T14:20:00",
    status: "pending",
    priority: "high",
    reviewedBy: null,
    reason: "Replacing faulty headset used for daily client calls.",
    note: null,
    favorite: false,
  },
  {
    id: "REQ-8204",
    name: "4K Webcam",
    type: "Hardware",
    quantity: 1,
    date: "Jan 18, 2024",
    createdAt: "2024-01-18T11:45:00",
    status: "approved",
    priority: "medium",
    reviewedBy: "Sarah Chen",
    reason: "Higher video quality required for product demos.",
    note: null,
    favorite: false,
  },
  {
    id: "REQ-8188",
    name: "Standing Desk",
    type: "Furniture",
    quantity: 1,
    date: "Jan 9, 2024",
    createdAt: "2024-01-09T08:30:00",
    status: "approved",
    priority: "medium",
    reviewedBy: "Sarah Chen",
    reason: "Ergonomic requirement recommended by physiotherapist.",
    note: null,
    favorite: true,
  },
  {
    id: "REQ-8062",
    name: "Photoshop License",
    type: "Software",
    quantity: 1,
    date: "Dec 20, 2023",
    createdAt: "2023-12-20T15:00:00",
    status: "rejected",
    priority: "low",
    reviewedBy: "Mike Ross",
    reason: "Occasional image editing for marketing material.",
    note: "License pool already allocated",
    favorite: false,
  },
  {
    id: "REQ-8041",
    name: "External SSD 1TB",
    type: "Hardware",
    quantity: 1,
    date: "Dec 12, 2023",
    createdAt: "2023-12-12T10:15:00",
    status: "pending",
    priority: "medium",
    reviewedBy: null,
    reason: "Backup drive for large media project files.",
    note: null,
    favorite: false,
  },
  {
    id: "REQ-8017",
    name: "Herman Miller Aeron",
    type: "Furniture",
    quantity: 1,
    date: "Dec 5, 2023",
    createdAt: "2023-12-05T16:40:00",
    status: "approved",
    priority: "high",
    reviewedBy: "Sarah Chen",
    reason: "Office chair replacement for chronic back pain.",
    note: null,
    favorite: true,
  },
];

const STATUS_BADGE_STYLES: Record<RequestStatus, string> = {
  pending: "bg-status-pending-bg text-status-pending-text border-status-pending-border",
  approved: "bg-status-success-bg text-status-success-text border-status-success-border",
  rejected: "bg-status-danger-bg text-status-danger-text border-status-danger-border",
};

const PRIORITY_BADGE_STYLES: Record<Priority, string> = {
  low: "bg-status-success-bg text-status-success-text border-status-success-border",
  medium: "bg-status-pending-bg text-status-pending-text border-status-pending-border",
  high: "bg-status-danger-bg text-status-danger-text border-status-danger-border",
};

const PRIORITY_ORDER: Record<Priority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const TAB_FILTERS = ["all", "pending", "approved", "rejected"] as const;
type TabFilter = (typeof TAB_FILTERS)[number];

const REQUEST_TYPES = ["Hardware", "Software", "Furniture"] as const;
const PRIORITIES = ["low", "medium", "high"] as const;
const PAGE_SIZE = 8;

const DEMO_NOW = Date.now();

const REVIEWERS = [...new Set(REQUESTS.map((r) => r.reviewedBy).filter(Boolean) as string[])];

const requestFilterConfig: FilterConfig[] = [
  {
    key: "type",
    title: "Type",
    type: "select",
    multiple: true,
    options: REQUEST_TYPES.map((type) => ({ label: type, value: type })),
  },
  {
    key: "priority",
    title: "Priority",
    type: "select",
    multiple: true,
    options: PRIORITIES.map((priority) => ({ label: priority, value: priority })),
  },
  {
    key: "reviewer",
    title: "Reviewer",
    type: "dropdown",
    placeholder: "Any reviewer",
    options: REVIEWERS.map((reviewer) => ({ label: reviewer, value: reviewer })),
  },
];

type SortKey = "name" | "priority" | "status" | "date";
type SortState = { key: SortKey; direction: "asc" | "desc" };

const TABLE_COLUMNS = ["ID", "Resource", "Reviewer", "Priority", "Date", "Status", "Action"];

const SORTABLE_COLUMN_MAP: Partial<Record<string, SortKey>> = {
  Resource: "name",
  Priority: "priority",
  Date: "date",
  Status: "status",
};

const nextRequestId = (list: RequestRecord[]) => {
  const max = list.reduce((maxId, r) => {
    const n = parseInt(r.id.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? Math.max(maxId, n) : maxId;
  }, 8000);
  return `REQ-${max + 1}`;
};

const SortableHead = ({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  className?: string;
}) => {
  const { key, direction } = sort;
  return (
    <TableHead className={cn("font-semibold select-none", className)}>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1 focus:outline-none"
        onClick={() => onSort(sortKey)}
      >
        {label}
        {key === sortKey ? (
          direction === "asc" ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
    </TableHead>
  );
};

const StatusBadge = ({ status, note }: { status: RequestStatus; note?: string | null }) => (
  <div className="flex items-center gap-1.5">
    <Badge
      className={cn(
        "shadow-none px-2.5 py-0.5 font-semibold capitalize border",
        STATUS_BADGE_STYLES[status],
      )}
    >
      {status}
    </Badge>
    {note && (
      <div title={note} className="cursor-help flex items-center">
        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      </div>
    )}
  </div>
);

const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <Badge
    className={cn(
      "shadow-none px-2.5 py-0.5 font-semibold capitalize border",
      PRIORITY_BADGE_STYLES[priority],
    )}
  >
    {priority}
  </Badge>
);

const ReviewerCell = ({
  reviewer,
  size = "h-7 w-7",
}: {
  reviewer: string | null;
  size?: string;
}) =>
  reviewer ? (
    <div className="flex items-center gap-2">
      <InitialsAvatar name={reviewer} className={size} />
      <span className="text-muted-foreground whitespace-nowrap">{reviewer}</span>
    </div>
  ) : (
    <span className="text-muted-foreground">—</span>
  );

const MyRequests = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestRecord[]>(REQUESTS);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [view, setView] = useState<"table" | "grid">("table");
  const [sort, setSort] = useState<SortState>({ key: "date", direction: "desc" });
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<RequestRecord | null>(null);

  const changeTab = (value: string) => {
    setActiveTab(value as TabFilter);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleFilters = (values: FilterValues) => {
    setFilters(values);
    setPage(1);
  };

  const handleFavoritesOnly = () => {
    setFavoritesOnly((f) => !f);
    setPage(1);
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const pct = (n: number) => (stats.total ? ((n / stats.total) * 100).toFixed(1) : "0.0");

  const statCards: Partial<statCardInterface>[] = [
    {
      title: "Total Requests",
      number: stats.total,
      subtext: `${stats.pending} awaiting review`,
      IconName: Package,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
    },
    {
      title: "Pending",
      number: stats.pending,
      subtext: `${pct(stats.pending)}% of your requests`,
      IconName: Clock,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      borderColor: "border-amber-500",
    },
    {
      title: "Approved",
      number: stats.approved,
      subtext: `${pct(stats.approved)}% of your requests`,
      IconName: CheckCircle2,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-500",
    },
    {
      title: "Rejected",
      number: stats.rejected,
      subtext: `${pct(stats.rejected)}% of your requests`,
      IconName: XCircle,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-500",
    },
  ];

  const pendingList = requests.filter((r) => r.status === "pending");
  const oldestPending = pendingList.reduce<RequestRecord | null>(
    (oldest, r) =>
      !oldest || +new Date(r.createdAt) < +new Date(oldest.createdAt) ? r : oldest,
    null,
  );
  const pendingDays = oldestPending
    ? Math.max(1, Math.floor((DEMO_NOW - +new Date(oldestPending.createdAt)) / 86400000))
    : 0;

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
    const priorityFilter = filters.priority as string[] | undefined;
    const matchesPriority =
      !priorityFilter || priorityFilter.length === 0 || priorityFilter.includes(req.priority);
    const reviewerFilter = filters.reviewer as string | undefined;
    const matchesReviewer = !reviewerFilter || req.reviewedBy === reviewerFilter;
    const matchesFavorite = !favoritesOnly || req.favorite;
    return (
      matchesTab &&
      matchesSearch &&
      matchesType &&
      matchesPriority &&
      matchesReviewer &&
      matchesFavorite
    );
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let cmp = 0;
    if (sort.key === "date") cmp = +new Date(a.createdAt) - +new Date(b.createdAt);
    else if (sort.key === "name") cmp = a.name.localeCompare(b.name);
    else if (sort.key === "status") cmp = a.status.localeCompare(b.status);
    else if (sort.key === "priority") cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    return sort.direction === "asc" ? cmp : -cmp;
  });

  const total = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRequests = sortedRequests.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const mappingPages = calculatePages({ currentPage: safePage, totalPages });

  const handleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "date" ? "desc" : "asc" },
    );
  };

  const toggleFavorite = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)),
    );
  };

  const handleReRequest = (req: RequestRecord) => {
    const now = new Date();
    const nextId = nextRequestId(requests);
    const resubmitted: RequestRecord = {
      ...req,
      id: nextId,
      date: now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      createdAt: now.toISOString(),
      status: "pending",
      reviewedBy: null,
      note: null,
    };
    setRequests((prev) => [resubmitted, ...prev]);
    setActiveTab("all");
    setPage(1);
    toast.success(`Request ${req.id} re-submitted as ${nextId}`);
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    setRequests((prev) => prev.filter((req) => req.id !== cancelTarget.id));
    toast.success(`Request ${cancelTarget.id} cancelled`);
    setCancelTarget(null);
  };

  const renderFavorite = (req: RequestRecord, className?: string) => (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 hover:bg-status-pending-bg", className)}
      aria-label={req.favorite ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(req.id);
      }}
    >
      <Star className={cn("h-4 w-4", req.favorite && "fill-chart-3 text-chart-3")} />
    </Button>
  );

  const renderRowActions = (req: RequestRecord) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted/60"
          aria-label={`Actions for ${req.id}`}
          onClick={(e) => e.stopPropagation()}
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
              className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
              onClick={() => setCancelTarget(req)}
            >
              <X className="mr-2 h-4 w-4" /> Cancel Request
            </DropdownMenuItem>
          </>
        )}
        {req.status === "rejected" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleReRequest(req)}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Request Again
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const emptyState = (
    <div className="flex min-h-[280px] w-full flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-6 p-4 bg-background rounded-full shadow-sm">
        <Inbox className="size-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold text-primary mb-3">No requests found</h2>
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
  );

  const renderTableBody = () => {
    if (pagedRequests.length === 0) {
      return (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={TABLE_COLUMNS.length} className="p-0">
            {emptyState}
          </TableCell>
        </TableRow>
      );
    }

    return pagedRequests.map((req) => (
      <TableRow
        key={req.id}
        className="group transition-colors cursor-pointer"
        onClick={() => router.push(`/employee/requests/${req.id}`)}
      >
        <TableCell className="pl-6 font-mono text-xs text-muted-foreground font-medium whitespace-nowrap">
          {req.id}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{req.name}</span>
            <Badge
              variant="outline"
              className="font-medium bg-card capitalize shadow-none"
            >
              {req.type}
            </Badge>
            {req.quantity > 1 && (
              <Badge variant="secondary" className="font-medium shadow-none">
                {req.quantity} ×
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Quantity: {req.quantity}</p>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <ReviewerCell reviewer={req.reviewedBy} />
        </TableCell>
        <TableCell>
          <PriorityBadge priority={req.priority} />
        </TableCell>
        <TableCell className="text-muted-foreground whitespace-nowrap">{req.date}</TableCell>
        <TableCell>
          <StatusBadge status={req.status} note={req.note} />
        </TableCell>
        <TableCell className="text-right pr-6">
          <div className="flex items-center justify-end gap-1">
            {renderFavorite(req)}
            {renderRowActions(req)}
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const renderCardGrid = () => {
    if (pagedRequests.length === 0) {
      return (
        <CardContent className="p-0">
          <div className="p-5">{emptyState}</div>
        </CardContent>
      );
    }

    return (
      <CardContent className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pagedRequests.map((req) => (
            <Card
              key={req.id}
              className="group cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => router.push(`/employee/requests/${req.id}`)}
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground font-medium">
                      {req.id}
                    </p>
                    <p className="truncate font-semibold text-foreground">{req.name}</p>
                  </div>
                  {renderFavorite(req)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="font-medium bg-card capitalize shadow-none"
                  >
                    {req.type}
                  </Badge>
                  <PriorityBadge priority={req.priority} />
                  <StatusBadge status={req.status} note={req.note} />
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{req.reason}</p>
                <div className="flex items-center justify-between gap-2 border-t pt-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <ReviewerCell reviewer={req.reviewedBy} size="h-6 w-6" />
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {req.date}
                    </span>
                    {renderRowActions(req)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    );
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

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={changeTab}
        className="w-full"
      >
        {pendingList.length > 0 && (
          <div
            className="mb-3 flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-status-pending-border bg-status-pending-bg p-4 transition-shadow hover:shadow-md sm:p-5"
            onClick={() => changeTab("pending")}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background/80 text-status-pending-text">
              <Hourglass className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-status-pending-text">
                {pendingList.length}{" "}
                {pendingList.length === 1 ? "request" : "requests"} awaiting
                review
              </p>
              <p className="text-sm text-status-pending-text/80">
                Oldest pending request submitted {pendingDays}{" "}
                {pendingDays === 1 ? "day" : "days"} ago.
              </p>
            </div>
            <Button
              size="sm"
              className="shrink-0 cursor-pointer border border-status-pending-border bg-background text-status-pending-text hover:bg-status-pending-bg"
              onClick={(e) => {
                e.stopPropagation();
                changeTab("pending");
              }}
            >
              View pending
            </Button>
          </div>
        )}
        <div className="flex w-full justify-end">
          <TabsList className="w-fit">
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
                  <span className="rounded-full bg-foreground/10 px-1.5 text-xs font-semibold text-muted-foreground data-[state=active]:bg-foreground/20 data-[state=active]:text-primary-foreground">
                    {countByStatus(tab)}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-1">
          <Card className="border-border shadow-sm">
            <div className="flex flex-wrap items-center justify-end gap-3 border-b border-border p-3">
              <Input
                placeholder="Search requests..."
                className="w-[50%] bg-secondary!"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Filter
                filters={requestFilterConfig}
                setFilters={handleFilters}
              />
              <Button
                variant={favoritesOnly ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-2 cursor-pointer",
                  !favoritesOnly && "bg-secondary!",
                )}
                onClick={handleFavoritesOnly}
              >
                <Star
                  className={cn("h-4 w-4", favoritesOnly && "fill-current")}
                />
                Favorites
              </Button>
              <div className="flex items-center rounded-lg border border-border bg-muted p-0.5">
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 cursor-pointer",
                    view === "table" && "bg-background shadow-sm",
                  )}
                  onClick={() => setView("table")}
                  aria-label="Table view"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 cursor-pointer",
                    view === "grid" && "bg-background shadow-sm",
                  )}
                  onClick={() => setView("grid")}
                  aria-label="Card view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {view === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {TABLE_COLUMNS.map((label, index) => {
                      const first = index === 0;
                      const last = index === TABLE_COLUMNS.length - 1;
                      const base = cn(
                        "font-semibold",
                        first && "pl-6",
                        last && "text-right pr-6",
                      );
                      const sortKey = SORTABLE_COLUMN_MAP[label];
                      return sortKey ? (
                        <SortableHead
                          key={label}
                          label={label}
                          sortKey={sortKey}
                          sort={sort}
                          onSort={handleSort}
                          className={base}
                        />
                      ) : (
                        <TableHead key={label} className={base}>
                          {label}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableBody()}</TableBody>
              </Table>
            ) : (
              renderCardGrid()
            )}

            {totalPages > 1 && (
              <div className="flex w-full justify-center gap-5 border-t border-border p-3">
                {mappingPages.map((pageNumber, index) => (
                  <Button
                    key={index}
                    className={cn(
                      pageNumber === safePage && "border-2! border-foreground!",
                    )}
                    onClick={() => {
                      if (typeof pageNumber === "number") {
                        setPage(pageNumber);
                      }
                    }}
                  >
                    {pageNumber}
                  </Button>
                ))}
              </div>
            )}
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80 cursor-pointer"
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