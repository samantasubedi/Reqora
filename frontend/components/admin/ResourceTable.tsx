import React from "react";
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
export const ResourceTable = () => {
  const TableData = [
    {
      ID: "RES001",
      Name: "Monitor",
      Type: "Hardware",
      Status: "In Use",
      Department: "IT",
      Location: "Building B, Floor 6",
      Availability: "60%",
    },
    {
      ID: "RES002",
      Name: "Laptop",
      Type: "Hardware",
      Status: "Available",
      Department: "Finance",
      Location: "Building A, Floor 3",
      Availability: "85%",
    },
    {
      ID: "RES003",
      Name: "Printer",
      Type: "Hardware",
      Status: "Under Maintenance",
      Department: "HR",
      Location: "Building C, Floor 2",
      Availability: "20%",
    },
    {
      ID: "RES004",
      Name: "Projector",
      Type: "Hardware",
      Status: "In Use",
      Department: "Marketing",
      Location: "Building B, Floor 1",
      Availability: "50%",
    },
    {
      ID: "RES005",
      Name: "Office 365 License",
      Type: "Software",
      Status: "Available",
      Department: "IT",
      Location: "Cloud",
      Availability: "95%",
    },
    {
      ID: "RES006",
      Name: "Conference Room 1",
      Type: "Facility",
      Status: "Booked",
      Department: "Admin",
      Location: "Building A, Floor 5",
      Availability: "30%",
    },
    {
      ID: "RES007",
      Name: "Tablet",
      Type: "Hardware",
      Status: "Available",
      Department: "Sales",
      Location: "Building D, Floor 4",
      Availability: "75%",
    },
    {
      ID: "RES008",
      Name: "Scanner",
      Type: "Hardware",
      Status: "In Use",
      Department: "Operations",
      Location: "Building C, Floor 1",
      Availability: "40%",
    },
    {
      ID: "RES009",
      Name: "Adobe Creative Cloud",
      Type: "Software",
      Status: "In Use",
      Department: "Design",
      Location: "Cloud",
      Availability: "70%",
    },
    {
      ID: "RES010",
      Name: "Server Rack",
      Type: "Hardware",
      Status: "Under Maintenance",
      Department: "IT",
      Location: "Data Center - Building B",
      Availability: "10%",
    },
  ];
  return (
    <div className="mt-5 px-3">
      <Table>
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
        <TableBody className="bg-slate-50">
          {TableData.map((curr) => {
            return (
              <TableRow key={curr.ID}>
                <TableCell>{curr.ID}</TableCell>
                <TableCell>{curr.Name}</TableCell>
                <TableCell>{curr.Type}</TableCell>
                <TableCell><span className={`rounded-xl p-1 ${curr.Status=="Available"?"bg-green-200":curr.Status=="Under Maintenance"?"bg-red-200":curr.Status=="In Use"?"bg-yellow-200":""}`}>{curr.Status}</span></TableCell>
                <TableCell>{curr.Department}</TableCell>
                <TableCell>{curr.Location}</TableCell>
                <TableCell>{curr.Availability}</TableCell>
                <TableCell>{<EllipsisVertical />}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
