"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, Minus, PackageX, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateRequest } from "../hooks/requestHooks";

type RequestResourceSectionProps = {
  resourceId: string;
  resourceName: string;
  availableQuantity: number;
  onSuccess?: () => void;
};

const RequestResourceSection = ({
  resourceId,
  resourceName,
  availableQuantity,
  onSuccess,
}: RequestResourceSectionProps) => {
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateRequest({
    onSuccess: (res) => {
      toast.success(res?.message ?? "Request submitted successfully");
      queryClient.invalidateQueries();
      setQuantity(1);
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? err.message);
    },
  });

  if (availableQuantity <= 0) {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
        <PackageX className="size-4 shrink-0" />
        No items of this resource are currently available to request.
      </p>
    );
  }

  const clampedQuantity = Math.min(Math.max(quantity, 1), availableQuantity);

  const handleSubmit = () => {
    mutate({ resourceId, requestedQuantity: clampedQuantity });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          {availableQuantity}
        </span>{" "}
        of {resourceName} available to request
      </p>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border bg-card">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-none text-muted-foreground hover:text-foreground"
            aria-label="Decrease quantity"
            disabled={clampedQuantity <= 1 || isPending}
            onClick={() => setQuantity(Math.max(clampedQuantity - 1, 1))}
          >
            <Minus className="size-4" />
          </Button>
          <Input
            type="number"
            min={1}
            max={availableQuantity}
            value={clampedQuantity}
            aria-label="Requested quantity"
            className="h-9 w-16 border-0 bg-transparent text-center text-sm font-semibold shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            onChange={(e) => {
              const next = Number(e.target.value);
              setQuantity(Number.isNaN(next) ? 1 : next);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-none text-muted-foreground hover:text-foreground"
            aria-label="Increase quantity"
            disabled={clampedQuantity >= availableQuantity || isPending}
            onClick={() =>
              setQuantity(Math.min(clampedQuantity + 1, availableQuantity))
            }
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="gap-2"
        >
          {isPending && <Loader className="size-4 animate-spin" />}
          Submit Request
        </Button>
      </div>
    </div>
  );
};

export default RequestResourceSection;