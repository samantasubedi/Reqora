import { ResourceTable } from "@/components/admin/ResourceTable";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

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
  

  return (
    <div>
      <div>
        {" "}
        <Input placeholder="Search for resources"></Input>
      </div>
      <ResourceTable />
    </div>
  );
};

export default page;
