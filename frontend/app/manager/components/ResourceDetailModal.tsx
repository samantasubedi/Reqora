"use client";
import {
  CheckCircle2,
  CircleAlert,
  Loader,
  Loader2,
  MapPin,
  Wrench,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AvailabilityBar,
  itemStatusBadgeClass,
  ResourceStatusPill,
} from "./ResourceBits";
import { useManagerResource } from "../hooks/resourceHooks";
import type {
  ManagerResource,
  ManagerResourceStatus,
} from "../apis/types";

type ResourceDetailModalProps = {
  resource: ManagerResource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const itemGroups: {
  key: ManagerResourceStatus;
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

const ResourceDetailModal = ({
  resource,
  open,
  onOpenChange,
}: ResourceDetailModalProps) => {
  const { data, isLoading, isError, refetch } = useManagerResource(
    open && resource ? resource.id : undefined,
  );
  const detail = data?.resourceDetail;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {resource && (
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {isLoading ? (
            <>
              <DialogTitle className="sr-only">Resource details</DialogTitle>
              <div className="flex items-center justify-center p-10">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            </>
          ) : isError || !detail ? (
            <>
              <DialogTitle className="sr-only">Resource details</DialogTitle>
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <p className="text-sm font-semibold text-foreground">
                  Unable to load resource details
                </p>
                <p className="text-sm text-muted-foreground">
                  Something went wrong while fetching this resource.
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3 pr-6">
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-xl">
                      {detail.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {detail.type} · {detail.department ?? "No department"}
                    </DialogDescription>
                  </div>
                  <ResourceStatusPill
                    available={detail.availableQuantity}
                    total={detail.totalQuantity}
                  />
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  {detail.location || "No location"}
                </p>
              </DialogHeader>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Overview
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border bg-card p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {detail.totalQuantity}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-center">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {detail.availableQuantity}
                    </p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                  <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-center">
                    <p className="text-2xl font-bold text-sky-700 dark:text-sky-400">
                      {detail.inUseQuantity}
                    </p>
                    <p className="text-xs text-muted-foreground">In use</p>
                  </div>
                </div>
                <AvailabilityBar
                  available={detail.availableQuantity}
                  total={detail.totalQuantity}
                />
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Resource Items
                </h3>

                {detail.resourceItems.length === 0 ? (
                  <p className="rounded-lg border border-dashed px-3.5 py-4 text-sm text-muted-foreground">
                    No items have been recorded for this resource yet.
                  </p>
                ) : (
                  itemGroups
                    .filter((group) =>
                      detail.resourceItems.some(
                        (item) => item.status === group.key,
                      ),
                    )
                    .map((group) => {
                      const items = detail.resourceItems.filter(
                        (item) => item.status === group.key,
                      );
                      return (
                        <div key={group.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <group.Icon
                                className={`size-4 ${group.iconClass}`}
                              />
                              {group.label}
                            </p>
                            <Badge variant="secondary">{items.length}</Badge>
                          </div>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3.5 py-2.5"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground">
                                    {item.location || "No location"}
                                  </p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {item.id.slice(0, 8)}
                                    {item.acquiredBy
                                      ? ` · Assigned to ${item.acquiredBy.username}`
                                      : ""}
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
                    })
                )}

                {detail.underMaintenanceQuantity > 0 && (
                  <p className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-sm text-amber-700 dark:text-amber-400">
                    <CircleAlert className="size-4 shrink-0" />
                    {detail.underMaintenanceQuantity} item
                    {detail.underMaintenanceQuantity === 1 ? "" : "s"} under
                    maintenance.
                  </p>
                )}
              </section>
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ResourceDetailModal;
