"use client";
import { useState } from "react";
import {
  Boxes,
  CheckCircle2,
  CircleX,
  Clock3,
  Forward,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import InitialsAvatar from "./InitialsAvatar";
import RejectDialog from "@/components/global/RejectDialog";
import { timeAgo } from "./requestUtils";
import type { ManagerRequest } from "../apis/types";

export type ReviewAction = {
  id: string;
  type: "approve" | "reject" | "forward";
};

type ReviewQueueProps = {
  requests: ManagerRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onForward: (id: string) => void;
  isLoading?: boolean;
  activeAction?: ReviewAction | null;
};

const ReviewQueue = ({
  requests,
  onApprove,
  onReject,
  onForward,
  isLoading = false,
  activeAction = null,
}: ReviewQueueProps) => {
  const [rejecting, setRejecting] = useState<ManagerRequest | null>(null);
  const [forwarding, setForwarding] = useState<ManagerRequest | null>(null);
  const busy = activeAction !== null;

  const isLoadingAction = (id: string, type: ReviewAction["type"]) =>
    activeAction?.id === id && activeAction.type === type;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold text-foreground">
          Needs Your Review
        </h2>
        <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
          <Clock3 className="size-3" />
          {requests.length} pending
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card
              key={index}
              className="h-56 animate-pulse rounded-2xl bg-muted/40"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <Card className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-dashed p-8 text-center">
          <PartyPopper className="size-10 text-primary" />
          <div>
            <p className="text-lg font-semibold text-foreground">
              All caught up!
            </p>
            <p className="text-sm text-muted-foreground">
              There are no pending requests waiting for you right now.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {requests.map((request) => (
            <Card
              key={request.requestId}
              className="flex flex-col gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <InitialsAvatar
                    name={request.requestedBy}
                    className="size-11"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {request.requestedBy}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {request.requestedByDepartment ?? "No department"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {timeAgo(request.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Boxes className="size-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {request.resourceName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {request.resourceType}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  x{request.requestedQuantity}
                </Badge>
              </div>

              {request.reason && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  “{request.reason}”
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  onClick={() => onApprove(request.requestId)}
                  disabled={busy}
                  className="flex-1 cursor-pointer"
                >
                  {isLoadingAction(request.requestId, "approve") ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRejecting(request)}
                  disabled={busy}
                  className="flex-1 cursor-pointer border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  {isLoadingAction(request.requestId, "reject") ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CircleX className="size-4" />
                  )}
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setForwarding(request)}
                  disabled={busy}
                  className="flex-1 cursor-pointer"
                >
                  {isLoadingAction(request.requestId, "forward") ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Forward className="size-4" />
                  )}
                  Forward
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {rejecting && (
        <RejectDialog
          open={!!rejecting}
          onOpenChange={(open) => {
            if (!open) setRejecting(null);
          }}
          employeeName={rejecting.requestedBy}
          resourceName={rejecting.resourceName}
          onConfirm={(reason) => {
            onReject(rejecting.requestId, reason);
            setRejecting(null);
          }}
        />
      )}

      <AlertDialog
        open={!!forwarding}
        onOpenChange={(open) => {
          if (!open) setForwarding(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Forward this request to an admin?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {forwarding?.requestedBy} requested{" "}
              <span className="font-semibold text-foreground">
                {forwarding?.resourceName}
              </span>
              . The request will leave your queue and an admin will make the
              final decision.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (forwarding) onForward(forwarding.requestId);
                setForwarding(null);
              }}
            >
              Forward request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default ReviewQueue;
