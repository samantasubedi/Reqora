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
import { EllipsisVertical } from "lucide-react";
import { tableResourceType } from "./AdminDashboard";

export const ResourceTable = ({
  resourceData,
}: {
  resourceData: tableResourceType[];
}) => {
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
          {resourceData.map((curr: tableResourceType) => {
            return (
              <TableRow key={curr.id}>
                <TableCell>{curr.id}</TableCell>
                <TableCell>{curr.name}</TableCell>
                <TableCell>{curr.type}</TableCell>
                <TableCell>
                  <span
                    className={`rounded-xl p-1 ${curr.status == "Available" ? "bg-green-200" : curr.status == "Under Maintenance" ? "bg-red-200" : curr.status == "In Use" ? "bg-yellow-200" : ""}`}
                  >
                    {curr.status}
                  </span>
                </TableCell>
                <TableCell>{curr.department}</TableCell>
                <TableCell>{curr.location}</TableCell>
                <TableCell>{curr.availability}%</TableCell>
                <TableCell>{<EllipsisVertical />}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
