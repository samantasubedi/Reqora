"use client";
import {
  CheckCircle2,
  CircleAlert,
  Loader,
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
import { AvailabilityBar, itemStatusBadgeClass, ResourceStatusPill } from "./ResourceBits";
import {
  getResourceCounts,
  Resource,
  ResourceItemStatus,
} from "./resourcesDummyData";

type ResourceDetailModalProps = {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const itemGroups: {
  key: ResourceItemStatus;
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
  const counts = resource ? getResourceCounts(resource.items) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {resource && counts && (
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
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
              <ResourceStatusPill
                available={counts.available}
                total={counts.total}
              />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {resource.location}
            </p>
          </DialogHeader>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Overview
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border bg-card p-3 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {counts.total}
                </p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {counts.available}
                </p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-sky-700 dark:text-sky-400">
                  {counts.inUse}
                </p>
                <p className="text-xs text-muted-foreground">In use</p>
              </div>
            </div>
            <AvailabilityBar available={counts.available} total={counts.total} />
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Resource Items
            </h3>

            {itemGroups
              .filter((group) =>
                resource.items.some((item) => item.status === group.key),
              )
              .map((group) => {
                const items = resource.items.filter(
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
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3.5 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {item.tag}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.serialNumber}
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

            {counts.underMaintenance > 0 && (
              <p className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-sm text-amber-700 dark:text-amber-400">
                <CircleAlert className="size-4 shrink-0" />
                {counts.underMaintenance} item
                {counts.underMaintenance === 1 ? "" : "s"} under maintenance.
              </p>
            )}
          </section>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ResourceDetailModal;