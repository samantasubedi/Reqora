"use client";
import {
  Building2,
  CalendarDays,
  Hash,
  MapPin,
  Undo2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MyResource } from "./myResourcesDummyData";
import { ItemStatusPill } from "./EmployeeResourceBits";
import { formatAssignedDate } from "./MyResourcesTable";

type MyResourceDetailModalProps = {
  resource: MyResource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRelease: (resource: MyResource) => void;
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) => (
  <div className="flex gap-3">
    <Icon className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  </div>
);

const MyResourceDetailModal = ({
  resource,
  open,
  onOpenChange,
  onRelease,
}: MyResourceDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {resource && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3 pr-6">
              <div className="min-w-0">
                <DialogTitle className="truncate text-xl">
                  {resource.name}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {resource.type} · {resource.department}
                </DialogDescription>
              </div>
              <ItemStatusPill status={resource.status} />
            </div>
          </DialogHeader>

          <div className="space-y-4 rounded-xl border bg-card p-4">
            <InfoRow icon={Hash} label="Item ID" value={resource.id} />
            <InfoRow
              icon={Building2}
              label="Department"
              value={resource.department}
            />
            <InfoRow icon={MapPin} label="Location" value={resource.location} />
            <InfoRow
              icon={CalendarDays}
              label="Assigned on"
              value={formatAssignedDate(resource.assignedAt)}
            />
          </div>

          {resource.note && (
            <div className="space-y-1.5 rounded-xl border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">Note</p>
              <p className="text-sm text-muted-foreground">{resource.note}</p>
            </div>
          )}

          <div className="flex justify-end border-t pt-4">
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              onClick={() => onRelease(resource)}
            >
              <Undo2 className="size-4" />
              Return Resource
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default MyResourceDetailModal;