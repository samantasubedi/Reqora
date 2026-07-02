import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Edit, EllipsisVertical, View } from "lucide-react";
import {
  ResourceStatus,
  resourceType,
  tableResourceType,
} from "./AdminDashboard";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const ResourceTable = ({
  resourceData,
}: {
  resourceData: resourceType[];
}) => {
  const router = useRouter();
  return (
    <div className="mt-5 px-3">
      <Table className="bg-blue-200/40">
        <TableHeader>
          <TableRow className="bg-slate-200">
            <TableHead>ID</TableHead>
            <TableHead>Resource Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead> Availability</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resourceData.map((curr) => {
            const statusDetails = getStatusDisaplay(curr.status);
            return (
              <TableRow key={curr.id}>
                <TableCell>{curr.id}</TableCell>
                <TableCell>{curr.name}</TableCell>
                <TableCell>{curr.type}</TableCell>
                <TableCell>
                  <Badge
                    variant={"outline"}
                    className={`px-2 p-1 ${statusDetails.color}`}
                  >
                    {statusDetails.display}
                  </Badge>
                </TableCell>
                <TableCell>{curr.department}</TableCell>
                <TableCell>{curr.location}</TableCell>
                <TableCell>
                  {(curr.availableQuantity / curr.totalQuantity) * 100}%
                </TableCell>
                <TableCell>
            
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent >
                      <DropdownMenuItem className="cursor-pointer"
                        onClick={() => {
                          router.push(`/resources/${curr.id}`);
                        }}
                      >
                       <View className="text-blue-500"/> view Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><Edit className="text-yellow-500"/>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><Delete className="text-red-500"/>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export const getStatusDisaplay = (status: ResourceStatus) => {
  switch (status) {
    case ResourceStatus.available:
      return { display: "Available", color: "bg-green-200" };
    case ResourceStatus.inUse:
      return { display: "In Use", color: "bg-yellow-200" };
    case ResourceStatus.underMaintainence:
      return { display: "Under Maintainence", color: "bg-red-200" };
    default:
      return { display: status, color: "bg-red-200" };
  }
};
