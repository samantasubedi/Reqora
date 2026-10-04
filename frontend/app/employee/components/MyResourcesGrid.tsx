import { Building2, MapPin, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MyResourceItem } from "../apis/types";
import { ItemStatusPill } from "./EmployeeResourceBits";
import { formatAssignedDate } from "./MyResourcesTable";

type MyResourcesGridProps = {
  resources: MyResourceItem[];
  onSelect: (resource: MyResourceItem) => void;
  onRelease: (resource: MyResourceItem) => void;
};

const MyResourcesGrid = ({
  resources,
  onSelect,
  onRelease,
}: MyResourcesGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <Card
          key={resource.id}
          onClick={() => onSelect(resource)}
          className="flex cursor-pointer flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
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
            <ItemStatusPill status={resource.status} />
          </div>

          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Building2 className="size-4 shrink-0 text-muted-foreground" />
              {resource.department ?? "—"}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-muted-foreground" />
              {resource.location}
            </p>
            {resource.description && (
              <p className="line-clamp-2 pt-1 text-sm text-muted-foreground">
                {resource.description}
              </p>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t pt-3">
            <p className="text-xs text-muted-foreground">
              Assigned{" "}
              <span className="font-semibold text-foreground">
                {formatAssignedDate(resource.assignedAt)}
              </span>
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 gap-1.5 px-3"
              onClick={(e) => {
                e.stopPropagation();
                onRelease(resource);
              }}
            >
              <Undo2 className="size-3.5" />
              Return
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MyResourcesGrid;