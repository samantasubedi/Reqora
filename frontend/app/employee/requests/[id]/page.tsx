"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Hourglass,
  XCircle,
  FileText,
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
import { toast } from "react-toastify";

type RequestStatus = "pending" | "approved" | "rejected";
type Priority = "low" | "medium" | "high";

type ActivityEvent = {
  time: string;
  title: string;
  detail?: string;
};

type DummyRequest = {
  name: string;
  type: string;
  quantity: number;
  date: string;
  status: RequestStatus;
  priority: Priority;
  reviewedBy: string | null;
  reason: string;
  note: string | null;
  allocatedItems: string[] | null;
  activity: ActivityEvent[];
};

const DUMMY_REQUESTS: Record<string, DummyRequest> = {
  "REQ-8291": {
    name: "Dell UltraSharp 32''",
    type: "Hardware",
    quantity: 1,
    date: "Feb 20, 2024",
    status: "pending",
    priority: "medium",
    reviewedBy: null,
    reason: "Upgrading current monitor for better color accuracy on design work.",
    note: null,
    allocatedItems: null,
    activity: [
      {
        time: "Feb 20, 2024 · 10:24 AM",
        title: "Request submitted",
        detail: "You requested 1 × Dell UltraSharp 32''.",
      },
      {
        time: "Feb 20, 2024 · 10:47 AM",
        title: "Awaiting review",
        detail: "No reviewer assigned yet.",
      },
    ],
  },
  "REQ-8285": {
    name: "IntelliJ IDEA License",
    type: "Software",
    quantity: 1,
    date: "Feb 15, 2024",
    status: "approved",
    priority: "high",
    reviewedBy: "Sarah Chen",
    reason: "Needed for Java backend development of the Reqora platform.",
    note: null,
    allocatedItems: ["ITM-2210"],
    activity: [
      {
        time: "Feb 15, 2024 · 10:05 AM",
        title: "Request submitted",
        detail: "You requested 1 × IntelliJ IDEA License.",
      },
      {
        time: "Feb 16, 2024 · 2:30 PM",
        title: "Approved by Sarah Chen",
        detail: "Request approved during review.",
      },
      {
        time: "Feb 16, 2024 · 2:31 PM",
        title: "Items allocated",
        detail: "1 item assigned to you (ITM-2210).",
      },
    ],
  },
  "REQ-8264": {
    name: "Dual Monitor Stand",
    type: "Furniture",
    quantity: 2,
    date: "Feb 3, 2024",
    status: "rejected",
    priority: "low",
    reviewedBy: "Mike Ross",
    reason: "Dual monitor setup for improved home office productivity.",
    note: "Budget limit exceeded for Q1",
    allocatedItems: null,
    activity: [
      {
        time: "Feb 3, 2024 · 9:12 AM",
        title: "Request submitted",
        detail: "You requested 2 × Dual Monitor Stand.",
      },
      {
        time: "Feb 5, 2024 · 4:05 PM",
        title: "Rejected by Mike Ross",
        detail: "Budget limit exceeded for Q1.",
      },
    ],
  },
};

const STATUS_BADGE_STYLES: Record<RequestStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const PRIORITY_BADGE_STYLES: Record<Priority, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_BANNER_STYLES: Record<RequestStatus, string> = {
  pending: "from-amber-500/15 via-transparent to-transparent text-amber-700",
  approved:
    "from-emerald-500/15 via-transparent to-transparent text-emerald-700",
  rejected: "from-rose-500/15 via-transparent to-transparent text-rose-700",
};

const STATUS_BANNER_ICON: Record<RequestStatus, typeof Hourglass> = {
  pending: Hourglass,
  approved: CheckCircle2,
  rejected: XCircle,
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
  return ["done", "done", "done"];
};

const ACTIVITY_ICONS: Record<string, typeof Send> = {
  submitted: Send,
  approved: CheckCircle2,
  rejected: XCircle,
  allocated: PackageCheck,
  awaiting: Hourglass,
};

const activityIcon = (title: string) => {
  if (title.toLowerCase().includes("submitted")) return ACTIVITY_ICONS.submitted;
  if (title.toLowerCase().includes("approved")) return ACTIVITY_ICONS.approved;
  if (title.toLowerCase().includes("rejected")) return ACTIVITY_ICONS.rejected;
  if (title.toLowerCase().includes("allocated")) return ACTIVITY_ICONS.allocated;
  return ACTIVITY_ICONS.awaiting;
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
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";

  const dummy = DUMMY_REQUESTS[id] ?? DUMMY_REQUESTS["REQ-8291"];
  const {
    name,
    type,
    quantity,
    date,
    status,
    priority,
    reviewedBy,
    reason,
    note,
    allocatedItems,
    activity,
  } = dummy;

  const [cancelOpen, setCancelOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const StatusIcon = STATUS_BANNER_ICON[status];
  const steps: StepState[] = stepForStatus(status);
  const isPending = status === "pending" && !isCancelled;

  const handleCancel = () => {
    setIsCancelled(true);
    setCancelOpen(false);
    toast.success(`Request ${id} cancelled`);
    router.push("/employee/requests");
  };

  const handleEdit = () => {
    toast.info("Request editing form is coming soon.");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Request Details
            </h1>
            <p className="text-muted-foreground font-mono text-sm">{id}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isPending && (
            <>
              <Button
                className="gap-2 cursor-pointer"
                onClick={handleEdit}
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

      <Card className="relative overflow-hidden border-none">
        <div
          className={cn(
            "absolute inset-0 bg-radial via-transparent to-transparent pointer-events-none",
            STATUS_BANNER_STYLES[status],
          )}
        />
        <CardContent className="relative z-10 flex items-center gap-4 py-6">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted",
              status === "pending"
                ? "text-amber-600"
                : status === "approved"
                  ? "text-emerald-600"
                  : "text-rose-600",
            )}
          >
            <StatusIcon className="size-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {type} · Quantity {quantity}
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
            <h2 className="text-2xl font-bold">{name}</h2>
            {note && (
              <p className="mt-1 text-sm text-rose-600 font-medium">
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
            <DetailItem icon={Hash} label="Request ID" value={id} />
            <DetailItem icon={Boxes} label="Resource" value={name} />
            <DetailItem icon={FileText} label="Type" value={type} />
            <DetailItem icon={Hash} label="Quantity" value={String(quantity)} />
            <DetailItem icon={CalendarDays} label="Requested On" value={date} />
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
                value={reason}
              />
            </div>

            {status === "approved" && allocatedItems ? (
              <div className="sm:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <PackageCheck className="size-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Allocated Items
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {allocatedItems.map((itemId) => (
                        <Badge
                          key={itemId}
                          variant="outline"
                          className="font-mono text-xs"
                        >
                          {itemId}
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
                        {quantity} × {name}
                      </span>
                      <Badge
                        variant="outline"
                        className="font-medium bg-white capitalize shadow-none"
                      >
                        {type}
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
                            ? "border-amber-400 bg-amber-50 text-amber-600"
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
              <span className="font-mono font-semibold">{id}</span> for{" "}
              <span className="font-semibold">{name}</span>? This action cannot
              be undone.
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

export default RequestDetails;