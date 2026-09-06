import ChartSkeleton from "./chartSkeleton";
import { StatCardsSkeleton } from "./statCardSkeleton";
import { TableSkeleton } from "./TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen w-full space-y-6 p-3">
      <StatCardsSkeleton />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <TableSkeleton />
    </div>
  );
};
