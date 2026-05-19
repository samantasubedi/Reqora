import { AlertCircle, RotateCcw } from "lucide-react";

interface TableErrorProps {
  onRetry: () => void;
}

export function TableError({ onRetry }: TableErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg bg-red-50 px-8 py-12 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />

      <div>
        <h2 className="mb-2 text-lg font-medium text-slate-900">
          Unable to load table
        </h2>
        <p className="text-sm text-slate-600">
          Check your connection and try again
        </p>
      </div>

      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-md bg-white px-5 py-2 text-sm font-medium text-slate-900 border border-slate-300 hover:bg-slate-50 transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}
