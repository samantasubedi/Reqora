"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, Minus, PackageX, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateRequest } from "../hooks/requestHooks";
import type { EmployeePriority } from "../apis/types";

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
  const [priority, setPriority] = useState<EmployeePriority>("medium");
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateRequest({
    onSuccess: (res) => {
      toast.success(res?.message ?? "Request submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["tableResourceData"] });
      queryClient.invalidateQueries({ queryKey: ["resourceDetails"] });
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myItems"] });
      queryClient.invalidateQueries({ queryKey: ["employeeStats"] });
      setQuantity(1);
      setPriority("medium");
      setReason("");
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
    mutate({
      resourceId,
      requestedQuantity: clampedQuantity,
      priority,
      reason: reason.trim() === "" ? undefined : reason.trim(),
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          {availableQuantity}
        </span>{" "}
        of {resourceName} available to request
      </p>

      <div className="flex flex-wrap items-center gap-3">
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Priority</p>
          <Select
            value={priority}
            onValueChange={(v) => setPriority(v as EmployeePriority)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:col-span-1">
          <p className="text-xs font-medium text-muted-foreground">
            Reason <span className="font-normal">(optional)</span>
          </p>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why do you need this?"
            rows={2}
            maxLength={2000}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestResourceSection;