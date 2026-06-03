"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

type propType = {
  params: Promise<{
    id: string;
  }>;
};
const ResourceDetails = () => {
  const params = useParams();
  const id = params.id;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fetchApi = async () => {
    const response = await axios.post(`${backendUrl}/resource/${id}`, {
      withCredentials: true,
    });
    return response.data;
  };
  const query = useQuery({
    queryKey: ["resourceDetail"],
    queryFn: fetchApi,
  });
  if (query.isSuccess) {
    return <div>{query.data.resourceDetail}</div>;
  }
  useEffect(() => {
    if (query.error) {
      if (isAxiosError(query.error)) {
        toast.error(query.error.response?.data.message);
      } else {
        toast.error(query.error.message);
      }
    }
  }, [query.error]);
  if (query.isLoading) {
    return <div>Loading....</div>;
  }
  return <div>this is resource details page</div>;
};

export default ResourceDetails;
