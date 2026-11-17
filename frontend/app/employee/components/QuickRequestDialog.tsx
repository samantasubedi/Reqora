"use client";
import { MapPin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resourceType } from "@/app/admin/resources/(with-sidebar)/page";
import {
  AvailabilityBar,
  ResourceStatusPill,
} from "./EmployeeResourceBits";
import RequestResourceSection from "./RequestResourceSection";

type QuickRequestDialogProps = {
  resource: resourceType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const QuickRequestDialog = ({
  resource,
  open,
  onOpenChange,
}: QuickRequestDialogProps) => {
  if (!resource) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request {resource.name}</DialogTitle>
          <DialogDescription>
            {resource.type} · {resource.department}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <ResourceStatusPill
              available={resource.availableQuantity}
              total={resource.totalQuantity}
            />
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {resource.location}
            </p>
          </div>

          <AvailabilityBar
            available={resource.availableQuantity}
            total={resource.totalQuantity}
          />

          <RequestResourceSection
            resourceId={resource.id}
            resourceName={resource.name}
            availableQuantity={resource.availableQuantity}
            onSuccess={() => onOpenChange(false)}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickRequestDialog;