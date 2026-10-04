import { Undo2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { MyResourceItem } from "../apis/types";
import { ItemStatusPill } from "./EmployeeResourceBits";

type MyResourcesTableProps = {
  resources: MyResourceItem[];
  onSelect: (resource: MyResourceItem) => void;
  onRelease: (resource: MyResourceItem) => void;
};

export const formatAssignedDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const MyResourcesTable = ({
  resources,
  onSelect,
  onRelease,
}: MyResourcesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead>Resource</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Assigned on</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.map((resource) => (
          <TableRow
            key={resource.id}
            className="cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => onSelect(resource)}
          >
            <TableCell>
              <p className="font-medium text-foreground">{resource.name}</p>
              <p className="text-xs text-muted-foreground">{resource.type}</p>
              {resource.description && (
                <p className="max-w-64 truncate text-xs text-muted-foreground">
                  {resource.description}
                </p>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {resource.department ?? "—"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {resource.location}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatAssignedDate(resource.assignedAt)}
            </TableCell>
            <TableCell>
              <ItemStatusPill status={resource.status} />
            </TableCell>
            <TableCell className="text-right">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MyResourcesTable;