import { Building2, MapPin, PackageX, Plus, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { resourceType } from "@/app/admin/resources/(with-sidebar)/page";
import {
  AvailabilityBar,
  ResourceStatusPill,
} from "./EmployeeResourceBits";

type EmployeeResourceGridProps = {
  resources: resourceType[];
  onSelect: (resource: resourceType) => void;
  onQuickRequest: (resource: resourceType) => void;
};

const EmployeeResourceGrid = ({
  resources,
  onSelect,
  onQuickRequest,
}: EmployeeResourceGridProps) => {
  if (resources.length === 0) {
    return (
      <div className="flex min-h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-10 text-center">
        <div className="rounded-full bg-muted p-4">
          <PackageX className="size-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          No resources found
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <Card
          key={resource.id}
          onClick={() => onSelect(resource)}
          className="flex cursor-pointer flex-col gap-4 rounded-2xl border-border/60 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-foreground">
                {resource.name}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {resource.type}
              </p>
            </div>
            <ResourceStatusPill
              available={resource.availableQuantity}
              total={resource.totalQuantity}
            />
          </div>

          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Building2 className="size-4 shrink-0 text-muted-foreground" />
              {resource.department}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-muted-foreground" />
              {resource.location}
            </p>
          </div>

          <AvailabilityBar
            available={resource.availableQuantity}
            total={resource.totalQuantity}
            className="mt-auto"
          />

          <div className="flex items-center justify-between gap-3 border-t pt-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-sky-500" />
                {resource.inUseQuantity} in use
              </span>
              <span className="flex items-center gap-1.5">
                <Wrench className="size-3.5" />
                {resource.underMaintenanceQuantity} maintenance
              </span>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 gap-1.5 px-3"
              disabled={resource.availableQuantity === 0}
              onClick={(e) => {
                e.stopPropagation();
                onQuickRequest(resource);
              }}
            >
              <Plus className="size-3.5" />
              Request
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EmployeeResourceGrid;