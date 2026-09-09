import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <tbody>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-slate-200/50">
          {Array.from({ length: columnCount }).map((_, columnIndex) => (
            <td key={columnIndex} className="px-4 py-3">
              <Skeleton className="h-4 w-full max-w-28" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
