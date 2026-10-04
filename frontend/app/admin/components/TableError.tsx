import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableErrorProps {
  onRetry: () => void;
  title?: string;
  message?: string;
}

export function TableError({
  onRetry,
  title = "Unable to load data",
  message = "Check your connection and try again.",
}: TableErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card px-8 py-12 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="size-8 text-destructive" />
      </div>

      <div>
        <h2 className="mb-1 text-base font-semibold text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      <Button variant="outline" onClick={onRetry} className="gap-2">
        <RotateCcw className="size-4" />
        Retry
      </Button>
    </div>
  );
}
