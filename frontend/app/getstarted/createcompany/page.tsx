"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
type formData = {
  companyName: string;
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
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const page = () => {
  const schema = z.object({
    companyName: z
      .string({ message: "Name is required" })
      .trim()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: z
      .email({ message: "Email is required" })
      .trim()
      .min(1, "Email is required"),
    address: z
      .string({ message: "Address is required" })
      .trim()
      .min(1, "Address is required")
      .min(3, "Address must be at least 3 characters"),
    size: z.coerce
      .number({ message: "Size is required" })
      .min(1, "Size is required"),
  });

  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const handleFormSubmit: SubmitHandler<formData> = async (data: formData) => {
    mutation.mutate(data);
  };

  const postApi = async (data: formData) => {
    try {
      const response = await axios.post(`${backendUrl}/createcompany`, data, {
        withCredentials: true,
      });
      if (response) {
        return response.data;
      }
    } catch (err: any) {
      if (err.response) {
        return err.response.data;
      }
    }
  };

  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (data) => {
      toast.error(data.message);
    },
  });

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
                {...register("companyName")}
              />
              <p className="text-red-600 text-sm">
                {errors.companyName?.message}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {" "}
              <label className="font-semibold text-md">Address</label>
              <Input
                placeholder="Enter your company address"
                {...register("address")}
              />
              <p className="text-red-600 text-sm">{errors.address?.message}</p>
            </div>
            <div className="flex flex-col gap-2">
              {" "}
              <label className="font-semibold text-md">Email</label>
              <Input
                placeholder="Enter your company email"
                {...register("email")}
              />
              <p className="text-red-600 text-sm">{errors.email?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
              {" "}
              <label className="font-semibold text-md">Company Size</label>
              <Input
                type="number"
                placeholder="Enter your company size (eg: 50)"
                {...register("size")}
              />
              <p className="text-red-600 text-sm">{errors.size?.message}</p>
            </div>
            <Button
              type="submit"
              className="bg-purple-900 hover:bg-purple-800 cursor-pointer transition-all duration-300"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating.." : "Create"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default page;
