"use client";
import { CheckCircle2, CircleAlert, Loader, MapPin, Wrench } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resourceType } from "@/app/admin/resources/(with-sidebar)/page";
import { ResourceItemDetail } from "@/components/others/ResourceTabs";
import { useResource } from "@/app/admin/hooks/resourceHooks";
import {
  AvailabilityBar,
  itemStatusBadgeClass,
  ResourceStatusPill,
} from "./EmployeeResourceBits";
import RequestResourceSection from "./RequestResourceSection";

type ResourceDetailDialogProps = {
  resource: resourceType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const itemGroups: {
  key: string;
  label: string;
  Icon: typeof CheckCircle2;
  iconClass: string;
}[] = [
  {
    key: "available",
    label: "Available",
    Icon: CheckCircle2,
    iconClass: "text-green-600",
  },
  {
    key: "inUse",
    label: "In Use",
    Icon: Loader,
    iconClass: "text-sky-600",
  },
  {
    key: "underMaintenance",
    label: "Under Maintenance",
    Icon: Wrench,
    iconClass: "text-amber-600",
  },
];

const ResourceDetailBody = ({
  detail,
  onRequestSuccess,
}: {
  detail: resourceType;
  onRequestSuccess: () => void;
}) => {
  const { data, isLoading, isError, error } = useResource(detail.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.resourceDetail) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-semibold text-foreground">
          Unable to load resource details
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {error?.response?.data?.message ?? error?.message}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => onRequestSuccess()}
        >
          Close
        </Button>
      </div>
    );
  }

  const resourceDetail = data.resourceDetail;
  const availableQuantity = resourceDetail.availableQuantity;

  return (
    <>
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="min-w-0">
              <DialogTitle className="truncate text-xl">
                {resourceDetail.name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {resourceDetail.type} · {resourceDetail.department}
              </DialogDescription>
            </div>
            <ResourceStatusPill
              available={availableQuantity}
              total={resourceDetail.totalQuantity}
            />
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            {resourceDetail.location}
          </p>
        </DialogHeader>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Overview
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-foreground">
                {resourceDetail.totalQuantity}
              </p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-center">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {availableQuantity}
              </p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-center">
              <p className="text-2xl font-bold text-sky-700 dark:text-sky-400">
                {resourceDetail.inUseQuantity}
              </p>
              <p className="text-xs text-muted-foreground">In use</p>
            </div>
          </div>
          <AvailabilityBar
            available={availableQuantity}
            total={resourceDetail.totalQuantity}
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Resource Items
          </h3>

          {itemGroups
            .filter((group) =>
              resourceDetail.resourceItems.some(
                (item) => item.status === group.key,
              ),
            )
            .map((group) => {
              const items = resourceDetail.resourceItems.filter(
                (item) => item.status === group.key,
              );
              return (
                <div key={group.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <group.Icon className={`size-4 ${group.iconClass}`} />
                      {group.label}
                    </p>
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {items.map((item: ResourceItemDetail) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {item.location}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {item.id}
                          </p>
                        </div>
                        <Badge
                          className={`capitalize ${
                            itemStatusBadgeClass[item.status] ?? ""
                          }`}
                        >
                          {item.status === "underMaintenance"
                            ? "maintenance"
                            : item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          {resourceDetail.underMaintenanceQuantity > 0 && (
            <p className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-sm text-amber-700 dark:text-amber-400">
              <CircleAlert className="size-4 shrink-0" />
              {resourceDetail.underMaintenanceQuantity} item
              {resourceDetail.underMaintenanceQuantity === 1 ? "" : "s"} under
              maintenance.
            </p>
          )}
        </section>
      </div>

      <div className="shrink-0 border-t bg-background px-6 py-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Request this resource
        </h3>
        <div className="mt-3">
          <RequestResourceSection
            resourceId={resourceDetail.id}
            resourceName={resourceDetail.name}
            availableQuantity={availableQuantity}
            onSuccess={onRequestSuccess}
          />
        </div>
      </div>
    </>
  );
};

const ResourceDetailDialog = ({
  resource,
  open,
  onOpenChange,
}: ResourceDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {resource && (
        <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <ResourceDetailBody
            detail={resource}
            onRequestSuccess={() => onOpenChange(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ResourceDetailDialog;