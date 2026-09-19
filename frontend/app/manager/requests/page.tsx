"use client";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import ReviewQueue from "../components/ReviewQueue";
import RequestHistoryTable from "../components/RequestHistoryTable";
import {
  DUMMY_REQUESTS,
  ResourceRequest,
} from "../components/requestsDummyData";

const Page = () => {
  const [requests, setRequests] = useState<ResourceRequest[]>(DUMMY_REQUESTS);

  const reviewAction = (
    id: string,
    status: "approved" | "rejected",
    reason?: string,
  ) => {
    const request = requests.find((req) => req.id === id);
    if (!request) return;

    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status, reviewedAt: new Date().toISOString() }
          : req,
      ),
    );

    if (status === "approved") {
      toast.success(
        `Approved ${request.employee.name}'s request for ${request.resource.name}`,
      );
    } else {
      toast.info(
        reason
          ? `Rejected ${request.employee.name}'s request: "${reason}"`
          : `Rejected ${request.employee.name}'s request`,
      );
    }
  };

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
            new Date(b.reviewedAt ?? b.createdAt).getTime() -
            new Date(a.reviewedAt ?? a.createdAt).getTime(),
        ),
    [requests],
  );

  return (
    <div className="w-full space-y-10 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-primary">Requests</h1>
        <p className="mt-1 text-muted-foreground">
          Review requests from your team and keep the queue moving.
        </p>
      </div>

      <ReviewQueue
        requests={pendingRequests}
        onApprove={(id) => reviewAction(id, "approved")}
        onReject={(id, reason) => reviewAction(id, "rejected", reason)}
      />

      <RequestHistoryTable requests={historyRequests} />
    </div>
  );
};

export default Page;