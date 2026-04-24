"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
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
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
type formDataType = z.infer<typeof schema>;
const schema = z.object({
  email: z
    .email("please enter an valid email")
    .trim()
    .min(1, "Please enter an email"),
  username: z
    .string("Please enter an username")
    .trim()
    .min(1, "Please enter an username")
    .min(3, "Please enter an valid username"),
  password: z
    .string("please enter a password")
    .trim()
    .min(1, "Please enter a password")
    .min(8, "Password must be atleast 8 characters"),
});

const page = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const handleFormSubmit: SubmitHandler<formDataType> = async (data) => {
    console.log("form data", data);
    try {
      const response = await axios.post(`${backendUrl}/register`, data);
      console.log(response);
      if (response.status == 201) {
        toast.success(`${response.data.message},Please login in to continue`);
        router.push("/login");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data);
        toast.error(err.response.data.message);
        if (err.response.data.code === "DUPLICATE_USERNAME") {
          setError("username", { message: err.response.data.message });
        }
      } else {
        console.log("something went wrong", err);
      }
    }
  };
  return (
    <div className="flex justify-center  bg-linear-to-l from-blue-950 to-teal-800  min-h-screen">
      <Card className="w-[30%] h-fit mt-[10%] bg-transparent/70 border-teal-950 shadow-md shadow-black">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-cyan-400">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-white">
            Fill the details below to register your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-white">Email</label>
              <Input
                className="bg-slate-400 border-none font-semibold "
                {...register("email")}
                placeholder="Enter your email"
              />
              <p className="text-red-400 text-sm">{errors.email?.message}</p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="font-semibold text-white">Username</label>
              <Input
                className="bg-slate-400 border-none font-semibold "
                {...register("username")}
                placeholder="Enter your username"
              />
              <p className="text-red-400 text-sm">{errors.username?.message}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-semibold text-white">Password</label>
              <Input
                className="bg-slate-400 border-none font-semibold "
                {...register("password")}
                placeholder="Enter your password"
                type="password"
              />
              <p className="text-red-400 text-sm">{errors.password?.message}</p>
            </div>
            <Button
              type="submit"
              className="mt-5 w-full cursor-pointer bg-teal-600 hover:bg-teal-700"
            >
              Register
            </Button>
          </form>
          <CardAction className="flex gap-2 mt-4">
            <p className="font-sans text-white">Already have an account?</p>
            <a href="/login" className="text-blue-400 cursor-pointer font-bold">
              Login
            </a>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
