"use client";
import { ResourceTable } from "@/app/admin/components/ResourceTable";
import { TableSkeleton } from "@/app/admin/components/skeletonLoaders/TableSkeleton";
import ResourceDetailsSkeleton from "@/components/others/ResourceDetailsLoader";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const Page = () => {
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
  if (query.isLoading) {
    return <ResourceDetailsSkeleton />;
  }

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

export default Page;
