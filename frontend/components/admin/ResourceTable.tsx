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
import axios, { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { TableSkeleton } from "./TableSkeleton";
import { TableError } from "./TableError";
import TableEmpty from "./TableEmpty";
type resourceType = {
  id: string;
  name: string;
  location: string;
  department: string;
  type: string;
  availability: string;
  status: string;
  totalQuantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
};
type tableResourceType = {
  id: string;
  name: string;
  status: string;
  type: string;
  department: string;
  location: string;
  availability: number;
};

export const ResourceTable = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fetchApi = async () => {
    const response = await axios.get(`${backendUrl}/resources`, {
      withCredentials: true,
    });
    return response.data;
  };
  const query = useQuery({
    queryFn: fetchApi,
    queryKey: ["resourceData"],
  });
  let resourceData;
  if (query.data) {
    resourceData = query.data.allResources.map((curr: resourceType) => ({
      id: curr.id,
      name: curr.name,
      type: curr.type,
      status: curr.status,
      department: curr.department,
      location: curr.location,
      availability: (curr.availableQuantity / curr.totalQuantity) * 100,
    }));
  }
  console.log("this is data", resourceData);
  useEffect(() => {
    if (query.isError) {
      if (isAxiosError(query.error)) {
        toast.error(query.error.response?.data.message);
      } else {
        toast.error(query.error.message);
      }
    }
  }, [query.isError]);
  if (query.isLoading) {
    return <TableSkeleton />;
  }
  if (query.isError) {
    return (
      <TableError
        onRetry={() => {
          query.refetch();
        }}
      />
    );
  }

  return (
    <div className="mt-5 px-3">
      {resourceData.length ? (
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
      ) : (
        <TableEmpty />
      )}
    </div>
  );
};
