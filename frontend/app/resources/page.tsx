"use client";
import { ResourceTable } from "@/components/admin/ResourceTable";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const page = () => {
  const fetchApi = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const response = await axios.get(`${backendUrl}/resources`, {
      withCredentials: true,
    });
    return response.data;
  };
  const query = useQuery({
    queryFn: fetchApi,
    queryKey: ["resourceData"],
  });
  useEffect(() => {
    if (query.isError) {
      if (isAxiosError(query.error)) {
        toast.error(query.error.response?.data.message);
      } else {
        toast.error(query.error.message);
      }
    }
  }, [query.isError]);

  return (
    <div>
      <div>
        {" "}
        <Input placeholder="Search for resources"></Input>
      </div>
      {query.isLoading ? (
        <TableSkeleton />
      ) : (
        <ResourceTable resourceData={query.data.allResources} />
      )}
    </div>
  );
};

export default page;
