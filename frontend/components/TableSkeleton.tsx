import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-blue-200/40">
        <thead>
          <tr className="bg-slate-200">
            {["ID", "Resource Name", "Type", "Status", "Department", "Location", "Availability", "Actions"].map((header) => (
              <th key={header} className="border border-slate-200/50 px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-slate-200/50">
              <td className="border border-slate-200/50 px-4 py-3">
                <Skeleton className="h-4 w-10" />
              </td>
              <td className="border border-slate-200/50 px-4 py-3">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="border border-slate-200/50 px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </td>
              <td className="border border-slate-200/50 px-4 py-3">
                <Skeleton className="h-4 w-14" />
              </td>
              <td className="border border-slate-200/50 px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="border border-slate-200/50 px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </td>
              <td className="border border-slate-200/50 px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="border border-slate-200/50 px-4 py-3">
                <Skeleton className="h-4 w-14" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}