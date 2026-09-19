import { Building2, MapPin, PackageX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AvailabilityBar,
  ResourceStatusPill,
} from "./ResourceBits";
import { getResourceCounts, Resource } from "./resourcesDummyData";

type ResourceTableViewProps = {
  resources: Resource[];
  onSelect: (resource: Resource) => void;
};

const ResourceTableView = ({
  resources,
  onSelect,
}: ResourceTableViewProps) => {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7}>
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
          resources.map((resource) => {
            const counts = getResourceCounts(resource.items);
            return (
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
                    available={counts.available}
                    total={counts.total}
                  />
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {counts.inUse}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {counts.underMaintenance}
                </TableCell>
                <TableCell>
                  <ResourceStatusPill
                    available={counts.available}
                    total={counts.total}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default ResourceTableView;