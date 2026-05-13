"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import {
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

const page = () => {
  // const username = "samanta";
  // const email = "samantasubedi01@gmail.com";
  // const role = "admin";
  // const companyName = "comapny1";
  // const queryClient = useQueryClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fetchProfileInfo = async () => {
    const response = await axios.get(`${backendUrl}/profile`);
    console.log(response.data);
    return response.data;
  };
  const query = useQuery({
    queryFn: fetchProfileInfo,
    queryKey: ["retrivedProfileInfo"],
  });
  if (query.isError) {
    toast.error(query.error.message);
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
              {/* <p className="font-bold text-2xl">{query.data.username}</p>
              <p className="text-gray-600">{query.data.email}</p>
              <p className="text-blue-600 px-2 rounded-2xl bg-blue-200 w-fit font-semibold">
                {query.data.role}
              </p> */}
            </div>
          </div>
          <Button>Edit profile</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
