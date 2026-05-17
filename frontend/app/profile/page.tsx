"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const page = () => {
  // const username = "samanta";
  // const email = "samantasubedi01@gmail.com";
  // const role = "admin";
  // const companyName = "comapny1";
  // const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fetchProfileInfo = async () => {
    const response = await axios.get(`${backendUrl}/profile`, {
      withCredentials: true,
    });

    return response.data;
  };
  const query = useQuery({
    queryFn: fetchProfileInfo,
    queryKey: ["retrivedProfileInfo"],
  });
  useEffect(() => {
    if (query.isError) {
      if (isAxiosError(query.error))
        toast.error(query.error.response?.data.message);
      else {
        toast.error(query.error?.message);
      }
    }
  }, [query.isError]);
  if (query.isLoading) {
    return (
      <div className="flex justify-center p-5">
        <Skeleton className="w-[60%] p-10 bg-gray-300">
          <div className="flex gap-10 ">
            <Skeleton className="w-13 h-13 rounded-full bg-gray-100"></Skeleton>
            <div className="flex flex-col gap-3">
              <Skeleton className="w-40 h-5  bg-gray-100"></Skeleton>
              <Skeleton className="w-10 h-5  bg-gray-100"></Skeleton>
            </div>
          </div>
        </Skeleton>
      </div>
    );
  }
  if (query.isError) {
    return (
      <div className="text-red text-4xl">
        Something went wrong please try again later
      </div>
    );
  }
  return (
    <div className="flex justify-center p-5">
      <Card className="w-[60%] p-10">
        <CardContent className="flex justify-between">
          <div className="flex gap-4">
            <div>
              <Icon
                icon="material-symbols:person-rounded"
                className="text-7xl p-2 rounded-full bg-gray-200"
              />
            </div>
            <div>
              <p className="font-bold text-2xl">{query.data?.username}</p>
              <p className="text-gray-600">{query.data?.email}</p>
              <p className="text-blue-600 px-2 rounded-2xl bg-blue-200 w-fit font-semibold">
                {query.data?.role}
              </p>
            </div>
          </div>
          <Button>Edit profile</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
