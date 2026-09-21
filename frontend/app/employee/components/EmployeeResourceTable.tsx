import { Building2, MapPin, PackageX, Plus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { resourceType } from "@/app/admin/resources/(with-sidebar)/page";
import {
  AvailabilityBar,
  ResourceStatusPill,
} from "./EmployeeResourceBits";

type EmployeeResourceTableProps = {
  resources: resourceType[];
  onSelect: (resource: resourceType) => void;
  onQuickRequest: (resource: resourceType) => void;
};

const EmployeeResourceTable = ({
  resources,
  onSelect,
  onQuickRequest,
}: EmployeeResourceTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Resource</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="min-w-44">Availability</TableHead>
          <TableHead className="text-center">In Use</TableHead>
          <TableHead className="text-center">Maintenance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8}>
              <div className="flex min-h-56 w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
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
            </TableCell>
          </TableRow>
        ) : (
          resources.map((resource) => (
            <TableRow
              key={resource.id}
              className="cursor-pointer"
              onClick={() => onSelect(resource)}
            >
              <TableCell>
                <p className="font-medium text-foreground">{resource.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="size-3" />
                  {resource.department}
                </p>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {resource.type}
              </TableCell>
              <TableCell>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  {resource.location}
                </p>
              </TableCell>
              <TableCell>
                <AvailabilityBar
                  available={resource.availableQuantity}
                  total={resource.totalQuantity}
                />
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {resource.inUseQuantity}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {resource.underMaintenanceQuantity}
              </TableCell>
              <TableCell>
                <ResourceStatusPill
                  available={resource.availableQuantity}
                  total={resource.totalQuantity}
                />
              </TableCell>
              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default EmployeeResourceTable;