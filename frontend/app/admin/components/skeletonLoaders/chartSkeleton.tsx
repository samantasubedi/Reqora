import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="flex h-56 items-end justify-around gap-3 px-4">
          <Skeleton className="h-20 w-8" />
          <Skeleton className="h-36 w-8" />
          <Skeleton className="h-28 w-8" />
          <Skeleton className="h-44 w-8" />
          <Skeleton className="h-24 w-8" />
          <Skeleton className="h-32 w-8" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-48" />
      </CardFooter>
    </Card>
  );
}

export default ChartSkeleton;
