"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  MoreHorizontal,
  FileText,
  Info,
  Plus,
  Inbox,
  X,
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
  Ban,
  Forward,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
import StatCard from "@/app/admin/components/StatCard";
import PaginationControls from "@/app/admin/components/PaginationControls";
import type { statCardInterface } from "@/app/admin/components/ResourceStats";
import InitialsAvatar from "@/app/manager/components/InitialsAvatar";
import { toast } from "react-toastify";
import {
  useCancelRequest,
  useCreateRequest,
  useMyRequests,
} from "@/app/employee/hooks/requestHooks";
import type {
  EmployeePriority,
  EmployeeRequestStatus,
  MyRequestItem,
} from "@/app/employee/apis/types";

type RequestStatus = EmployeeRequestStatus;
type Priority = EmployeePriority;

const STATUS_BADGE_STYLES: Record<RequestStatus, string> = {
  pending:
    "bg-status-pending-bg text-status-pending-text border-status-pending-border",
  approved:
    "bg-status-success-bg text-status-success-text border-status-success-border",
  rejected:
    "bg-status-danger-bg text-status-danger-text border-status-danger-border",
  cancelled:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  forwarded:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
};

const PRIORITY_BADGE_STYLES: Record<Priority, string> = {
  low: "bg-status-success-bg text-status-success-text border-status-success-border",
  medium:
    "bg-status-pending-bg text-status-pending-text border-status-pending-border",
  high: "bg-status-danger-bg text-status-danger-text border-status-danger-border",
};

const TAB_FILTERS = [
  "all",
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "forwarded",
] as const;
type TabFilter = (typeof TAB_FILTERS)[number];

const PRIORITIES = ["low", "medium", "high"] as const;
const PAGE_SIZE = 8;

type SortKey = "name" | "priority" | "status" | "date";
type SortState = { key: SortKey; direction: "asc" | "desc" };

const TABLE_COLUMNS = [
  "ID",
  "Resource",
  "Reviewer",
  "Priority",
  "Date",
  "Status",
  "Action",
];

const SORTABLE_COLUMN_MAP: Partial<Record<string, SortKey>> = {
  Resource: "name",
  Priority: "priority",
  Date: "date",
  Status: "status",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const shortId = (id: string) => id.slice(0, 8);

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

const StatusBadge = ({
  status,
  note,
}: {
  status: RequestStatus;
  note?: string | null;
}) => (
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
  reviewer: string | null | undefined;
  size?: string;
}) =>
  reviewer ? (
    <div className="flex items-center gap-2">
      <InitialsAvatar name={reviewer} className={size} />
      <span className="text-muted-foreground whitespace-nowrap">
        {reviewer}
      </span>
    </div>
  ) : (
    <span className="text-muted-foreground">—</span>
  );

const MyRequests = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [view, setView] = useState<"table" | "grid">("table");
  const [sort, setSort] = useState<SortState>({
    key: "date",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<MyRequestItem | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const typeFilter = (filters.type as string[] | undefined) ?? [];
  const priorityFilter = (filters.priority as string[] | undefined) ?? [];
  const reviewerFilter = filters.reviewer as string | undefined;

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: activeTab === "all" ? undefined : (activeTab as RequestStatus),
      type: typeFilter.length > 0 ? typeFilter.join(",") : undefined,
      reviewer: reviewerFilter || undefined,
      priority:
        priorityFilter.length > 0
          ? (priorityFilter.join(",") as Priority)
          : undefined,
      sortBy: sort.key,
      order: sort.direction,
      page,
      limit: PAGE_SIZE,
    }),
    [
      debouncedSearch,
      activeTab,
      typeFilter,
      reviewerFilter,
      priorityFilter,
      sort,
      page,
    ],
  );

  const { data, isLoading, isError, refetch, isFetching } =
    useMyRequests(queryParams);

  const requests = useMemo(() => data?.data ?? [], [data]);
  const counts = data?.countsByStatus ?? {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    forwarded: 0,
  };
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? 1;
  const liveReviewers = useMemo(() => data?.reviewers ?? [], [data]);
  const liveTypes = useMemo(() => data?.types ?? [], [data]);

  const requestFilterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "type",
        title: "Type",
        type: "select",
        multiple: true,
        options: liveTypes.map((type) => ({ label: type, value: type })),
      },
      {
        key: "priority",
        title: "Priority",
        type: "select",
        multiple: true,
        options: PRIORITIES.map((priority) => ({
          label: priority,
          value: priority,
        })),
      },
      {
        key: "reviewer",
        title: "Reviewer",
        type: "dropdown",
        placeholder: "Any reviewer",
        options: liveReviewers.map((reviewer) => ({
          label: reviewer,
          value: reviewer,
        })),
      },
    ],
    [liveTypes, liveReviewers],
  );

  const cancelMutation = useCancelRequest();
  const createMutation = useCreateRequest();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["myRequests"] });

  const changeTab = (value: string) => {
    setActiveTab(value as TabFilter);
    setPage(1);
  };

  const handleFilters = (values: FilterValues) => {
    setFilters(values);
    setPage(1);
  };

  const pct = (n: number) =>
    counts.total ? ((n / counts.total) * 100).toFixed(1) : "0.0";

  const statCards: Partial<statCardInterface>[] = [
    {
      title: "Total Requests",
      number: counts.total,
      subtext: `${counts.pending} awaiting review`,
      IconName: Package,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800 dark:text-blue-200",
      borderColor: "border-blue-500",
    },
    {
      title: "Pending",
      number: counts.pending,
      subtext: `${pct(counts.pending)}% of your requests`,
      IconName: Clock,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800 dark:text-amber-200",
      borderColor: "border-amber-500",
    },
    {
      title: "Approved",
      number: counts.approved,
      subtext: `${pct(counts.approved)}% of your requests`,
      IconName: CheckCircle2,
      bgColor: "bg-green-100",
      textColor: "text-green-800 dark:text-green-200",
      borderColor: "border-green-500",
    },
    {
      title: "Rejected",
      number: counts.rejected,
      subtext: `${pct(counts.rejected)}% of your requests`,
      IconName: XCircle,
      bgColor: "bg-red-100",
      textColor: "text-red-800 dark:text-red-200",
      borderColor: "border-red-500",
    },
    {
      title: "Cancelled",
      number: counts.cancelled,
      subtext: `${pct(counts.cancelled)}% of your requests`,
      IconName: Ban,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800 dark:text-gray-200",
      borderColor: "border-gray-500",
    },
    {
      title: "Forwarded",
      number: counts.forwarded,
      subtext: `${pct(counts.forwarded)}% of your requests`,
      IconName: Forward,
      bgColor: "bg-violet-100",
      textColor: "text-violet-800 dark:text-violet-200",
      borderColor: "border-violet-500",
    },
  ];

  const pendingDays = data?.oldestPendingAt
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - +new Date(data.oldestPendingAt)) / 86400000,
        ),
      )
    : 0;

  const countByStatus = (status: RequestStatus) => counts[status] ?? 0;

  const handleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "date" ? "desc" : "asc" },
    );
    setPage(1);
  };

  const handleReRequest = (req: MyRequestItem) => {
    createMutation.mutate(
      {
        resourceId: req.resourceId,
        requestedQuantity: req.requestedQuantity,
        priority: req.priority,
        reason: req.reason ?? undefined,
      },
      {
        onSuccess: () => {
          toast.success("Request re-submitted successfully");
          setActiveTab("all");
          setPage(1);
          invalidate();
        },
        onError: (err) => {
          toast.error(err.response?.data?.message ?? "Failed to re-submit");
        },
      },
    );
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    cancelMutation.mutate(cancelTarget.requestId, {
      onSuccess: (res) => {
        toast.success(res.message ?? "Request cancelled");
        setCancelTarget(null);
        invalidate();
      },
      onError: (err) => {
        toast.error(err.response?.data?.message ?? "Failed to cancel");
      },
    });
  };

  const renderRowActions = (req: MyRequestItem) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted/60"
          aria-label={`Actions for ${req.requestId}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Manage</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/employee/requests/${req.requestId}`)}
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
        {(req.status === "rejected" || req.status === "cancelled") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={createMutation.isPending}
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
  );

  const loadingRows = (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          <TableCell colSpan={TABLE_COLUMNS.length}>
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const renderTableBody = () => {
    if (isLoading) return loadingRows;
    if (isError) {
      return (
        <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={TABLE_COLUMNS.length}
            className="p-0"
          >
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm text-muted-foreground">
                Failed to load requests.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    }
    if (requests.length === 0) {
      return (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={TABLE_COLUMNS.length} className="p-0">
            {emptyState}
          </TableCell>
        </TableRow>
      );
    }

    return requests.map((req) => (
      <TableRow
        key={req.requestId}
        className="group transition-colors cursor-pointer"
        onClick={() => router.push(`/employee/requests/${req.requestId}`)}
      >
        <TableCell className="pl-6 font-mono text-xs text-muted-foreground font-medium whitespace-nowrap">
          {shortId(req.requestId)}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {req.resourceName}
            </span>
            {req.resourceType && (
              <Badge
                variant="outline"
                className="font-medium bg-card capitalize shadow-none"
              >
                {req.resourceType}
              </Badge>
            )}
            {req.requestedQuantity > 1 && (
              <Badge variant="secondary" className="font-medium shadow-none">
                {req.requestedQuantity} ×
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quantity: {req.requestedQuantity}
          </p>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <ReviewerCell reviewer={req.reviewedBy} />
        </TableCell>
        <TableCell>
          <PriorityBadge priority={req.priority} />
        </TableCell>
        <TableCell className="text-muted-foreground whitespace-nowrap">
          {formatDate(req.createdAt)}
        </TableCell>
        <TableCell>
          <StatusBadge status={req.status} note={req.note} />
        </TableCell>
        <TableCell className="text-right pr-6">
          <div className="flex items-center justify-end gap-1">
            {renderRowActions(req)}
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const renderCardGrid = () => {
    if (isLoading) {
      return (
        <CardContent className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </CardContent>
      );
    }
    if (isError) {
      return (
        <CardContent className="p-0">
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Failed to load requests.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </CardContent>
      );
    }
    if (requests.length === 0) {
      return (
        <CardContent className="p-0">
          <div className="p-5">{emptyState}</div>
        </CardContent>
      );
    }

    return (
      <CardContent className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <Card
              key={req.requestId}
              className="group cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => router.push(`/employee/requests/${req.requestId}`)}
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground font-medium">
                      {shortId(req.requestId)}
                    </p>
                    <p className="truncate font-semibold text-foreground">
                      {req.resourceName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {req.resourceType && (
                    <Badge
                      variant="outline"
                      className="font-medium bg-card capitalize shadow-none"
                    >
                      {req.resourceType}
                    </Badge>
                  )}
                  <PriorityBadge priority={req.priority} />
                  <StatusBadge status={req.status} note={req.note} />
                </div>
                {req.reason && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {req.reason}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2 border-t pt-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <ReviewerCell reviewer={req.reviewedBy} size="h-6 w-6" />
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(req.createdAt)}
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

      <section className="flex gap-4 overflow-x-auto pb-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[180px] min-w-[240px] flex-1 animate-pulse rounded-xl bg-muted"
              />
            ))
          : statCards.map((card) => (
              <div key={card.title} className="min-w-[240px] flex-1">
                <StatCard
                  title={card.title!}
                  number={card.number!}
                  IconName={card.IconName}
                  subtext={card.subtext}
                  bgColor={card.bgColor!}
                  textColor={card.textColor!}
                  borderColor={card.borderColor!}
                />
              </div>
            ))}
      </section>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={changeTab}
        className="w-full"
      >
        {counts.pending > 0 && (
          <div
            className="mb-3 flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-status-pending-border bg-status-pending-bg p-4 transition-shadow hover:shadow-md sm:p-5"
            onClick={() => changeTab("pending")}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background/80 text-status-pending-text">
              <Hourglass className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-status-pending-text">
                {counts.pending}{" "}
                {counts.pending === 1 ? "request" : "requests"} awaiting
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
          <TabsList className="w-fit max-w-full overflow-x-auto">
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
                    {countByStatus(tab as RequestStatus)}
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Filter
                filters={requestFilterConfig}
                setFilters={handleFilters}
              />
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
              <div className={cn(isFetching && !isLoading && "opacity-70")}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
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
              </div>
            ) : (
              renderCardGrid()
            )}

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
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
              <span className="font-mono font-semibold">
                {cancelTarget && shortId(cancelTarget.requestId)}
              </span>{" "}
              for{" "}
              <span className="font-semibold">
                {cancelTarget?.resourceName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Request</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80 cursor-pointer"
              disabled={cancelMutation.isPending}
              onClick={handleCancel}
            >
              {cancelMutation.isPending ? "Cancelling…" : "Cancel Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyRequests;
