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
 <div className="flex justify-center p-6">
  <Card className="w-full max-w-4xl overflow-hidden shadow-lg">



    <CardContent className="relative p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
  
        <div className="flex items-center gap-5">
       
          <div className="-mt-16 border-4 border-white rounded-full bg-gray-100 shadow-md">
            <Icon
              icon="material-symbols:person-rounded"
              className="text-8xl p-3 text-gray-600"
            />
          </div>


          <div>
            <h2 className="text-3xl font-bold">
              {query.data?.username}
            </h2>

            <p className="text-gray-500 mt-1">
              {query.data?.email}
            </p>

            <div className="mt-3">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                {query.data?.role}
              </span>
            </div>
          </div>
        </div>

        <Button>
          Edit Profile
        </Button>
      </div>

    
      <div className="my-6 border-t" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-500">Username</p>
          <p className="font-medium">{query.data?.username}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{query.data?.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-medium capitalize">
            {query.data?.role}
          </p>
        </div>
      </div>

    
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold">24</p>
          <p className="text-sm text-gray-500">Resources</p>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">Requests</p>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm text-gray-500">Approvals</p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
  );
};

export default page;
