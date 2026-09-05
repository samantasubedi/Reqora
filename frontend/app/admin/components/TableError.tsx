import { AlertCircle, RotateCcw } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface TableErrorProps {
  onRetry: () => void;
}

export function TableError({ onRetry }: TableErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg bg-red-50 px-8 py-12 text-center">
      <Icon icon="cuida:alert-outline" className="text-7xl text-red-500" />

      <div>
        <h2 className="mb-2 text-lg font-medium text-slate-900">
          Unable to load table
        </h2>
        <p className="text-sm text-slate-600">
          Check your connection and try again
        </p>
      </div>

      <Button
        onClick={onRetry}
        className="bg-white text-blue-500 hover:bg-blue-100 cursor-pointer font-bold text-md"
      >
        <Icon
          icon="stash:arrow-retry"
          className="text-blue size-6!  font-extrabold!"
        />
        Retry
      </Button>
    </div>
  );
}
