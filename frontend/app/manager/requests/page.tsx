"use client";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReviewQueue, { type ReviewAction } from "../components/ReviewQueue";
import RequestHistoryTable from "../components/RequestHistoryTable";
import {
  useForwardManagerRequest,
  useManagerRequests,
  useReviewManagerRequest,
} from "../hooks/requestHooks";

const Page = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useManagerRequests();
  const [activeAction, setActiveAction] = useState<ReviewAction | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["managerRequests"] });
  };

  const reviewMutation = useReviewManagerRequest({
    onSuccess: (_res, variables) => {
      toast.success(
        variables.status === "approved"
          ? "Request approved"
          : "Request rejected",
      );
      invalidate();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ?? "Failed to review request",
      );
    },
    onSettled: () => setActiveAction(null),
  });

  const forwardMutation = useForwardManagerRequest({
    onSuccess: () => {
      toast.success("Request forwarded to admin");
      invalidate();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ?? "Failed to forward request",
      );
    },
    onSettled: () => setActiveAction(null),
  });

  const requests = useMemo(() => data?.data ?? [], [data]);

  const pendingRequests = useMemo(
    () =>
      requests
        .filter((req) => req.status === "pending")
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    [requests],
  );

  const historyRequests = useMemo(
    () =>
      requests
        .filter((req) => req.status !== "pending")
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
    [requests],
  );

  const handleApprove = (id: string) => {
    setActiveAction({ id, type: "approve" });
    reviewMutation.mutate({ requestId: id, status: "approved" });
  };

  const handleReject = (id: string, reason: string) => {
    setActiveAction({ id, type: "reject" });
    reviewMutation.mutate({
      requestId: id,
      status: "rejected",
      note: reason || undefined,
    });
  };

  const handleForward = (id: string) => {
    setActiveAction({ id, type: "forward" });
    forwardMutation.mutate(id);
  };

  return (
    <div className="w-full space-y-10 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-primary">Requests</h1>
        <p className="mt-1 text-muted-foreground">
          Review requests from your team and keep the queue moving.
        </p>
      </div>

      {isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Failed to load your department&apos;s requests.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <ReviewQueue
            requests={pendingRequests}
            isLoading={isLoading}
            activeAction={activeAction}
            onApprove={handleApprove}
            onReject={handleReject}
            onForward={handleForward}
          />

          <RequestHistoryTable
            requests={historyRequests}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default Page;
