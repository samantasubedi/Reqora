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
import { Icon } from "@iconify/react";
import axios from "axios";
import React from "react";

const page = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const postApi = async (data: any) => {
    const response = await axios.post(`${backendUrl}/joinCode`, data, {
      withCredentials: true,
    });
    return response;
  };
  return (
    <div className="flex justify-center">
      <Card className="md:w-[30%] md:mt-[10%] bg-white">
        <CardHeader className="p-4 bg-teal-100 rounded-b-2xl">
          <CardTitle className="flex gap-5 text-2xl justify-center items-center">
            {" "}
            <Icon
              icon="mdi:people"
              className="text-5xl! bg-white rounded-full p-2 text-teal-800"
            />{" "}
            <span className="text-teal-800">Join a Company</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-semibold text-center">
            Enter the company code shared by your administrator.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <label className="text-xl font-semibold text-teal-700">
            {" "}
            Join Code
          </label>
          <Input
            placeholder="eg: H3E0klMT3f"
            className="bg-white mt-2 h-14! text-2xl! font-semibold text-teal-800 border-teal-500"
          ></Input>
        </CardContent>
        <CardFooter>
          <Button className="bg-teal-700 w-full! font-extrabold text-lg mt-5 hover:bg-teal-600 cursor-pointer">
            Join
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
