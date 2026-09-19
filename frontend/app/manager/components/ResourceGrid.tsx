import { Building2, MapPin, PackageX, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  AvailabilityBar,
  ResourceStatusPill,
} from "./ResourceBits";
import { getResourceCounts, Resource } from "./resourcesDummyData";

type ResourceGridProps = {
  resources: Resource[];
  onSelect: (resource: Resource) => void;
};

const ResourceGrid = ({ resources, onSelect }: ResourceGridProps) => {
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
      {resources.map((resource) => {
        const counts = getResourceCounts(resource.items);
        return (
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
                available={counts.available}
                total={counts.total}
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
              available={counts.available}
              total={counts.total}
              className="mt-auto"
            />

            <div className="flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-sky-500" />
                {counts.inUse} in use
              </span>
              <span className="flex items-center gap-1.5">
                <Wrench className="size-3.5" />
                {counts.underMaintenance} maintenance
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ResourceGrid;