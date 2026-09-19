"use client";
import { useState } from "react";
import { Boxes, CheckCircle2, CircleX, Clock3, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InitialsAvatar from "./InitialsAvatar";
import RejectDialog from "./RejectDialog";
import { ResourceRequest, timeAgo } from "./requestsDummyData";

type ReviewQueueProps = {
  requests: ResourceRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
};

const ReviewQueue = ({ requests, onApprove, onReject }: ReviewQueueProps) => {
  const [rejecting, setRejecting] = useState<ResourceRequest | null>(null);

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

      {requests.length === 0 ? (
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
              key={request.id}
              className="flex flex-col gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <InitialsAvatar name={request.employee.name} className="size-11" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {request.employee.name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {request.employee.department}
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
                      {request.resource.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {request.resource.type}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  x{request.requestedQuantity}
                </Badge>
              </div>

              {request.note && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  “{request.note}”
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  onClick={() => onApprove(request.id)}
                  className="flex-1 cursor-pointer"
                >
                  <CheckCircle2 className="size-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRejecting(request)}
                  className="flex-1 cursor-pointer border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <CircleX className="size-4" />
                  Reject
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
          employeeName={rejecting.employee.name}
          resourceName={rejecting.resource.name}
          onConfirm={(reason) => {
            onReject(rejecting.id, reason);
            setRejecting(null);
          }}
        />
      )}
    </section>
  );
};

export default ReviewQueue;