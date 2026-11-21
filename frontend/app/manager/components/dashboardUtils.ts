import { camelToSentence } from "@/lib/HelperFunctions";
import type { ManagerRequest, ManagerRequestStatus } from "../apis/types";

export type RequestCounts = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  forwarded: number;
};

const STATUS_CHART_ORDER: ManagerRequestStatus[] = [
  "approved",
  "pending",
  "rejected",
  "cancelled",
  "forwarded",
];

const STATUS_COLORS: Record<ManagerRequestStatus, string> = {
  approved: "var(--chart-1)",
  pending: "var(--chart-2)",
  rejected: "var(--chart-3)",
  cancelled: "var(--chart-4)",
  forwarded: "var(--chart-5)",
};

export const getRequestCounts = (
  requests: ManagerRequest[],
): RequestCounts => {
  const counts: RequestCounts = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    forwarded: 0,
  };

  for (const request of requests) {
    counts.total += 1;
    counts[request.status] += 1;
  }

  return counts;
};

export const getRequestsByType = (requests: ManagerRequest[]) => {
  const counts = new Map<string, number>();

  for (const request of requests) {
    const type = request.resourceType || "Unknown";
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  return Array.from(counts, ([type, value]) => ({
    label: camelToSentence(type),
    value,
  })).sort((a, b) => b.value - a.value);
};

export const getStatusChartData = (counts: RequestCounts) =>
  STATUS_CHART_ORDER.map((status) => ({
    label: camelToSentence(status),
    value: counts[status],
    fill: STATUS_COLORS[status],
  }));

export const getRequestsByMonth = (
  requests: ManagerRequest[],
  months = 6,
) => {
  const now = new Date();
  const buckets = Array.from({ length: months }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (months - 1 - index),
      1,
    );

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-US", { month: "short" }),
      value: 0,
    };
  });
  const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const request of requests) {
    const createdAt = new Date(request.createdAt);
    if (Number.isNaN(createdAt.getTime())) continue;

    const bucket = bucketByKey.get(
      `${createdAt.getFullYear()}-${createdAt.getMonth()}`,
    );
    if (bucket) bucket.value += 1;
  }

  return buckets.map(({ label, value }) => ({ label, value }));
};
