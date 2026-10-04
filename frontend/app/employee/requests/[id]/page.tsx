"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  ClipboardList,
  Forward,
  Hourglass,
  XCircle,
  FileText,
  FileX,
  CalendarDays,
  UserRound,
  Boxes,
  Hash,
  MessageSquareText,
  Pencil,
  X,
  Flag,
  PackageCheck,
  Send,
  History,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import {
  useCancelRequest,
  useCreateRequest,
  useEditRequest,
  useRequestDetail,
} from "@/app/employee/hooks/requestHooks";
import type {
  EmployeePriority,
  EmployeeRequestStatus,
  RequestDetail,
} from "@/app/employee/apis/types";

type RequestStatus = EmployeeRequestStatus;
type Priority = EmployeePriority;

type ActivityEvent = {
  time: string;
  title: string;
  detail?: string;
};

const STATUS_BADGE_STYLES: Record<RequestStatus, string> = {
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
};

const PRIORITY_BADGE_STYLES: Record<Priority, string> = {
  low: "bg-status-success-bg text-status-success-text border-status-success-border",
  medium:
    "bg-status-pending-bg text-status-pending-text border-status-pending-border",
  high: "bg-status-danger-bg text-status-danger-text border-status-danger-border",
};

const STATUS_BANNER_STYLES: Record<RequestStatus, string> = {
  pending:
    "from-amber-500/15 via-transparent to-transparent text-status-pending-text",
  approved:
    "from-emerald-500/15 via-transparent to-transparent text-status-success-text",
  rejected:
    "from-rose-500/15 via-transparent to-transparent text-status-danger-text",
  cancelled:
    "from-gray-500/15 via-transparent to-transparent text-status-neutral-text",
  forwarded:
    "from-violet-500/15 via-transparent to-transparent text-status-info-text",
};

const STATUS_BANNER_ICON: Record<RequestStatus, typeof Hourglass> = {
  pending: Hourglass,
  approved: CheckCircle2,
  rejected: XCircle,
  cancelled: Ban,
  forwarded: Forward,
};

type StepState = "done" | "current" | "upcoming";

const TIMELINE_STEPS: {
  icon: typeof ClipboardList;
  title: string;
  description: string;
}[] = [
  {
    icon: ClipboardList,
    title: "Submitted",
    description: "Your request was submitted successfully.",
  },
  {
    icon: Hourglass,
    title: "Under Review",
    description: "A reviewer is processing your request.",
  },
  {
    icon: CheckCircle2,
    title: "Decision",
    description: "Your request has been approved or rejected.",
  },
];

const stepForStatus = (status: RequestStatus): StepState[] => {
  if (status === "pending") return ["done", "current", "upcoming"];
  if (status === "forwarded") return ["done", "done", "current"];
  return ["done", "done", "done"];
};

const ACTIVITY_ICONS: Record<string, typeof Send> = {
  submitted: Send,
  approved: CheckCircle2,
  rejected: XCircle,
  cancelled: Ban,
  forwarded: Forward,
  allocated: PackageCheck,
  awaiting: Hourglass,
};

const activityIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("submitted")) return ACTIVITY_ICONS.submitted;
  if (t.includes("approved")) return ACTIVITY_ICONS.approved;
  if (t.includes("rejected")) return ACTIVITY_ICONS.rejected;
  if (t.includes("cancelled")) return ACTIVITY_ICONS.cancelled;
  if (t.includes("forwarded")) return ACTIVITY_ICONS.forwarded;
  if (t.includes("allocated")) return ACTIVITY_ICONS.allocated;
  return ACTIVITY_ICONS.awaiting;
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
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

const buildActivity = (detail: RequestDetail): ActivityEvent[] => {
  const events: ActivityEvent[] = [
    {
      time: formatDateTime(detail.createdAt),
      title: "Request submitted",
      detail: `You requested ${detail.requestedQuantity} × ${detail.resourceName}.`,
    },
  ];
  if (detail.status === "pending") {
    events.push({
      time: formatDateTime(detail.createdAt),
      title: "Awaiting review",
      detail: "No reviewer assigned yet.",
    });
  }
  if (detail.reviewedBy) {
    const verb =
      detail.status === "approved"
        ? "Approved"
        : detail.status === "rejected"
          ? "Rejected"
          : detail.status === "forwarded"
            ? "Forwarded"
            : "Reviewed";
    events.push({
      time: formatDateTime(detail.updatedAt),
      title: `${verb} by ${detail.reviewedBy}`,
      detail:
        detail.note ??
        (detail.status === "forwarded"
          ? "Escalated to admin for final decision."
          : `Request ${detail.status} during review.`),
    });
  }
  if (detail.status === "forwarded" && !detail.reviewedBy) {
    events.push({
      time: formatDateTime(detail.updatedAt),
      title: "Forwarded to admin",
      detail: "Escalated to admin for final decision.",
    });
  }
  if (detail.status === "cancelled") {
    events.push({
      time: formatDateTime(detail.updatedAt),
      title: "Request cancelled",
      detail: "You cancelled this request.",
    });
  }
  if (
    detail.status === "approved" &&
    detail.allocatedItems.length > 0
  ) {
    events.push({
      time: formatDateTime(detail.updatedAt),
      title: "Items allocated",
      detail: `${detail.allocatedItems.length} item(s) assigned to you (${detail.allocatedItems
        .map((i) => i.id.slice(0, 8))
        .join(", ")}).`,
    });
  }
  return events;
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
      <Icon className="size-4 text-muted-foreground" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold break-all">{value}</p>
    </div>
  </div>
);

const RequestDetails = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";

  const { data, isLoading, isError, refetch } = useRequestDetail(id);
  const detail = data?.data;

  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editPriority, setEditPriority] = useState<Priority>("medium");
  const [editReason, setEditReason] = useState("");

  useEffect(() => {
    if (detail) {
      setEditQuantity(detail.requestedQuantity);
      setEditPriority(detail.priority);
      setEditReason(detail.reason ?? "");
    }
  }, [detail]);

  const cancelMutation = useCancelRequest();
  const editMutation = useEditRequest();
  const createMutation = useCreateRequest();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["myRequest", id] });
    queryClient.invalidateQueries({ queryKey: ["myRequests"] });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="p-6">
        <Card className="mx-auto max-w-lg">
          <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <FileX className="size-12 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Request not found</h2>
            <p className="text-sm text-muted-foreground">
              This request doesn&apos;t exist or you don&apos;t have access
              to it.
            </p>
            <Button
              className="mt-2 cursor-pointer"
              onClick={() => router.push("/employee/requests")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to requests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    resourceName,
    resourceType,
    requestedQuantity,
    status,
    priority,
    reviewedBy,
    reason,
    note,
    allocatedItems,
  } = detail;

  const StatusIcon = STATUS_BANNER_ICON[status];
  const steps: StepState[] = stepForStatus(status);
  const activity = buildActivity(detail);
  const isPending = status === "pending";
  const canReRequest = status === "rejected" || status === "cancelled";

  const handleCancel = () => {
    cancelMutation.mutate(id, {
      onSuccess: (res) => {
        toast.success(res.message ?? `Request ${id.slice(0, 8)} cancelled`);
        setCancelOpen(false);
        invalidate();
        router.push("/employee/requests");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message ?? "Failed to cancel");
      },
    });
  };

  const handleEdit = () => {
    editMutation.mutate(
      {
        requestId: id,
        requestedQuantity: editQuantity,
        priority: editPriority,
        reason: editReason.trim() === "" ? null : editReason.trim(),
      },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? "Request updated");
          setEditOpen(false);
          invalidate();
          refetch();
        },
        onError: (err) => {
          toast.error(err.response?.data?.message ?? "Failed to update");
        },
      },
    );
  };

  const handleReRequest = () => {
    createMutation.mutate(
      {
        resourceId: detail.resourceId,
        requestedQuantity: detail.requestedQuantity,
        priority: detail.priority,
        reason: detail.reason ?? undefined,
      },
      {
        onSuccess: (res) => {
          toast.success("Request re-submitted successfully");
          const newId = (res as unknown as { data?: { id?: string } })?.data
            ?.id;
          invalidate();
          router.push(
            newId ? `/employee/requests/${newId}` : "/employee/requests",
          );
        },
        onError: (err) => {
          toast.error(err.response?.data?.message ?? "Failed to re-submit");
        },
      },
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.push("/employee/requests")}
            aria-label="Back to requests"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Request Details
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              {id.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isPending && (
            <>
              <Button
                className="gap-2 cursor-pointer"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-4 w-4" /> Edit Request
              </Button>
              <Button
                variant="destructive"
                className="gap-2 cursor-pointer"
                onClick={() => setCancelOpen(true)}
              >
                <X className="h-4 w-4" /> Cancel Request
              </Button>
            </>
          )}
          {canReRequest && (
            <Button
              className="gap-2 cursor-pointer"
              disabled={createMutation.isPending}
              onClick={handleReRequest}
            >
              <RotateCcw className="h-4 w-4" />
              {createMutation.isPending ? "Submitting…" : "Request Again"}
            </Button>
          )}
          <Badge
            className={cn(
              "shadow-none px-3 py-1 text-sm font-semibold capitalize border",
              STATUS_BADGE_STYLES[status],
            )}
          >
            {status}
          </Badge>
        </div>
      </div>

      <Card className="relative overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-radial via-transparent to-transparent pointer-events-none",
            STATUS_BANNER_STYLES[status],
          )}
        />
        <CardContent className="relative z-10 flex items-center gap-4 py-6">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted",
              status === "pending"
                ? "text-status-pending-text"
                : status === "approved"
                  ? "text-status-success-text"
                  : status === "rejected"
                    ? "text-status-danger-text"
                    : status === "forwarded"
                      ? "text-status-info-text"
                      : "text-status-neutral-text",
            )}
          >
            <StatusIcon className="size-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {resourceType} · Quantity {requestedQuantity}
              </p>
              <Badge
                className={cn(
                  "shadow-none capitalize border",
                  PRIORITY_BADGE_STYLES[priority],
                )}
              >
                <Flag className="h-3 w-3 mr-1" /> {priority} priority
              </Badge>
            </div>
            <h2 className="text-2xl font-bold">{resourceName}</h2>
            {note && (
              <p className="mt-1 text-sm font-medium text-status-danger-text">
                Review note: {note}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Request Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailItem icon={Hash} label="Request ID" value={id.slice(0, 8)} />
            <DetailItem icon={Boxes} label="Resource" value={resourceName} />
            <DetailItem icon={FileText} label="Type" value={resourceType} />
            <DetailItem
              icon={Hash}
              label="Quantity"
              value={String(requestedQuantity)}
            />
            <DetailItem
              icon={CalendarDays}
              label="Requested On"
              value={formatDate(detail.createdAt)}
            />
            <DetailItem
              icon={UserRound}
              label="Reviewed By"
              value={reviewedBy ?? "Pending review"}
            />

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Flag className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Priority
                </p>
                <Badge
                  className={cn(
                    "mt-1 capitalize shadow-none border",
                    PRIORITY_BADGE_STYLES[priority],
                  )}
                >
                  {priority}
                </Badge>
              </div>
            </div>

            <div className="sm:col-span-2">
              <DetailItem
                icon={MessageSquareText}
                label="Reason for Request"
                value={reason ?? "No reason provided"}
              />
            </div>

            {status === "approved" && allocatedItems.length > 0 ? (
              <div className="sm:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <PackageCheck className="size-4 text-status-success-text" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Allocated Items
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {allocatedItems.map((item) => (
                        <Badge
                          key={item.id}
                          variant="outline"
                          className="font-mono text-xs"
                          title={`${item.location} · ${item.status}`}
                        >
                          {item.id.slice(0, 8)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="sm:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Boxes className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Requested Items
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">
                        {requestedQuantity} × {resourceName}
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-background font-medium capitalize shadow-none"
                      >
                        {resourceType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Hourglass className="h-5 w-5 text-muted-foreground" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-0">
              {TIMELINE_STEPS.map((step, index) => {
                const state = steps[index];
                const StepIcon = step.icon;
                return (
                  <li
                    key={step.title}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    {index < TIMELINE_STEPS.length - 1 && (
                      <span
                        className={cn(
                          "absolute left-[15px] top-9 h-[calc(100%-28px)] w-0.5",
                          state === "done" ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                        state === "done"
                          ? "border-primary bg-primary text-primary-foreground"
                          : state === "current"
                            ? "border-status-pending-border bg-status-pending-bg text-status-pending-text"
                            : "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      <StepIcon className="size-4" />
                    </div>
                    <div className="pt-1">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          state === "upcoming" && "text-muted-foreground",
                        )}
                      >
                        {step.title}
                        {index === 2 &&
                          (status === "cancelled" ||
                            status === "forwarded") &&
                          ` (${status})`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-0">
            {activity.map((event, index) => {
              const Icon = activityIcon(event.title);
              return (
                <li key={index} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < activity.length - 1 && (
                    <span className="absolute left-[15px] top-9 h-[calc(100%-28px)] w-0.5 bg-border" />
                  )}
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 pt-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div>
                      <p className="text-sm font-semibold">{event.title}</p>
                      {event.detail && (
                        <p className="text-xs text-muted-foreground">
                          {event.detail}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {event.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel request{" "}
              <span className="font-mono font-semibold">
                {id.slice(0, 8)}
              </span>{" "}
              for <span className="font-semibold">{resourceName}</span>? This
              action cannot be undone.
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Request</DialogTitle>
            <DialogDescription>
              Update quantity, priority or reason while the request is still
              pending.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Quantity</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setEditQuantity((q) => Math.max(1, q - 1))
                  }
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={editQuantity}
                  onChange={(e) =>
                    setEditQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Priority</p>
              <Select
                value={editPriority}
                onValueChange={(v) => setEditPriority(v as Priority)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Reason</p>
              <Textarea
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="Why do you need this resource?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Discard
            </Button>
            <Button
              disabled={editMutation.isPending}
              onClick={handleEdit}
              className="cursor-pointer"
            >
              {editMutation.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestDetails;
