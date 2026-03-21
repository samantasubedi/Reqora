"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
type formData = {
  name: string;
  address: string;
  email: string;
  size: number;
};
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = () => {
  const { register, setError, formState, handleSubmit } = useForm<formData>();
  const handleFormSubmit: SubmitHandler<formData> = (data: formData) => {
    console.log("this is form data", data);
  };
  return (
    <div className="flex justify-center p-5">
      <Card className="w-[40%] p-5">
        <CardHeader>
          <CardTitle className="font-bold text-3xl text-center">
            Create Your Company
          </CardTitle>
          <CardDescription className="text-center">
            Fill your company details
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            {" "}
            <label className="font-semibold text-md">Company Name</label>
            <Input
              placeholder="Enter your company name"
              {...register("name")}
            />
          </div>
          <div className="flex flex-col gap-2">
            {" "}
            <label className="font-semibold text-md">Address</label>
            <Input
              placeholder="Enter your company address"
              {...register("address")}
            />
          </div>
          <div className="flex flex-col gap-2">
            {" "}
            <label className="font-semibold text-md">Email</label>
            <Input
              placeholder="Enter your company email"
              {...register("email")}
            />
          </div>

          <div className="flex flex-col gap-2">
            {" "}
            <label className="font-semibold text-md">Company Size</label>
            <Input
              type="number"
              placeholder="Enter your company size (eg: 50)"
              {...register("size")}
            />
          </div>
          <Button type="submit" className="bg-purple-900 hover:bg-purple-800 cursor-pointer transition-all duration-300">Submit</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default page;
