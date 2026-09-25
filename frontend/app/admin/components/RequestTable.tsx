import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ClipboardList, Loader2, X } from "lucide-react";
import { requestType } from "../apis/requestApi";
import { useReviewRequest } from "../hooks/requestHooks";
import { useQueryClient } from "@tanstack/react-query";
import TableEmpty, { tableEmptyType } from "./emptyStates/TableEmpty";
import { TableSkeleton } from "./skeletonLoaders/TableSkeleton";
import { toast } from "react-toastify";

const statusBadge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
  forwarded: "bg-violet-100 text-violet-700 border-violet-200",
};

const RequestTable = ({
  requests,
  isLoading,
}: {
  requests?: requestType[];
  isLoading: boolean;
}) => {
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const reviewRequest = useReviewRequest({
    onSuccess: () => {
      setActionLoading(null);
      toast.success("Request reviewed successfully");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (err) => {
      setActionLoading(null);
      toast.error(err.response?.data?.message ?? "Failed to review request");
    },
  });

  const handleReview = (requestId: string, status: "approved" | "rejected") => {
    setActionLoading(`${requestId}-${status}`);
    reviewRequest.mutate({ requestId, status });
  };

  const tableEmptyProps: tableEmptyType = {
    colSpan: 8,
    header: "No requests found !",
    headerIcon: ClipboardList,
  };

  return (
    <div className="mt-5 mb-5 px-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requester</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested On</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableSkeleton columnCount={8} />
        ) : (
          <TableBody>
            {requests?.length ? (
              requests.map((request) => (
                <TableRow key={request.requestId}>
                  <TableCell className="font-medium">
                    {request.requestedBy}
                  </TableCell>
                  <TableCell>
                    {request.requestedByDepartment ?? "N/A"}
                  </TableCell>
                  <TableCell>{request.resourceName}</TableCell>
                  <TableCell className="capitalize">
                    {request.resourceType}
                  </TableCell>
                  <TableCell>{request.requestedQuantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-semibold capitalize ${statusBadge[request.status] ?? ""}`}
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {request.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
                          disabled={actionLoading !== null}
                          onClick={() =>
                            handleReview(request.requestId, "approved")
                          }
                        >
                          {actionLoading ===
                          `${request.requestId}-approved` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
                          disabled={actionLoading !== null}
                          onClick={() =>
                            handleReview(request.requestId, "rejected")
                          }
                        >
                          {actionLoading === `${request.requestId}-rejected` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {request.reviewedBy ? `by ${request.reviewedBy}` : "—"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableEmpty {...tableEmptyProps} />
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default RequestTable;