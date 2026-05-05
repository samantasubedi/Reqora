"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { T_MutaionError } from "@/types/global";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const postApi = async (data: { code: string }) => {
    const response = await axios.post(`${backendUrl}/joinByCode`, data, {
      withCredentials: true,
    });
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
      }
    },
    onError: (error: T_MutaionError) => {
      if (error.response) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });
  const [joinCode, setJoinCode] = useState("");
  return (
    <div className="flex justify-center">
      <Card className="md:w-[30%] md:mt-[10%] bg-white">
        <CardHeader className="p-4 bg-teal-100 rounded-b-2xl">
          <CardTitle className="flex gap-5 text-2xl justify-center items-center">
            <Icon
              icon="mdi:people"
              className="text-5xl! bg-white rounded-full p-2 text-teal-800"
            />
            <span className="text-teal-800">Join a Company</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-semibold text-center">
            Enter the company code shared by your administrator.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <label className="text-xl font-semibold text-teal-700">
            Join Code
          </label>
          <Input
            onChange={(e) => {
              setJoinCode(e.target.value);
            }}
            placeholder="eg: H3E0klMT3f"
            className="bg-white mt-2 h-14! text-2xl! font-semibold text-teal-800 border-teal-500"
          ></Input>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              console.log(joinCode);
            }}
            className="bg-teal-700 w-full! font-extrabold text-lg mt-5 hover:bg-teal-600 cursor-pointer"
          >
            Join
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
