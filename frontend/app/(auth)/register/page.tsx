"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type formDataType = {
  username: string;
  password: string;
};
const page = () => {
  const backendUrl = process.env.BACKEND_API_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formDataType>();
  const handleFormSubmit: SubmitHandler<formDataType> = async (data) => {
    console.log("form data", data);
    try {
      const response = await axios.post("backendUrl/register", data);
      console.log(response);
    } catch (err) {
      console.log("couldnt post data", err);
    }
  };
  return (
    <div className="flex justify-center mt-[10%]">
      <Card className="w-[30%]">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Fill the details below to register your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Username</label>
              <Input
                {...register("username", {
                  required: "username is required !",
                  minLength: {
                    value: 3,
                    message: "username must be atleast 3 characters",
                  },
                })}
                placeholder="Enter your username"
              />
              <p className="text-red-600 text-sm">{errors.username?.message}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-semibold">Password</label>
              <Input
                {...register("password", {
                  required: "password is required !",
                  minLength: {
                    value: 8,
                    message: "password must be at least 8 characters !",
                  },
                })}
                placeholder="Enter your password"
                type="password"
              />
              <p className="text-red-600 text-sm">{errors.password?.message}</p>
            </div>
            <Button
              type="submit"
              className="mt-5 w-full cursor-pointer bg-purple-800 hover:bg-purple-700"
            >
              Register
            </Button>
          </form>
          <CardAction className="flex gap-2 mt-4">
            <p className="font-sans">Already have an account?</p>
            <a href="/login" className="text-blue-700 cursor-pointer">
              Login
            </a>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
