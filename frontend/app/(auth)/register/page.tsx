"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios, { isAxiosError } from "axios";
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
import { useRegister } from "@/app/admin/hooks/authHooks";
import { T_MutationError } from "@/types/global";
import Navbar from "@/components/others/Navbar";
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

const Page = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const registerMuation = useRegister();
  const handleFormSubmit: SubmitHandler<formDataType> = async (data) => {
    registerMuation.mutate(data, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(`${data.message},please login to continue`);
          router.push("/login");
        }
      },
      onError: (err: T_MutationError) => {
        if (err.response) {
          toast.error(err.response.data.message);
          if (err.response.data.code === "DUPLICATE_USERNAME") {
            setError("username", { message: err.response.data.message });
            console.log("this is error message", err.response.data.message);
          }
        } else {
          toast.error(err.message);
        }
      },
    });
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex justify-center bg-auth-bg flex-1 ">
        <Card className="w-[30%] h-fit mt-[10%] bg-auth-card-bg backdrop-blur-xl border-auth-card-border shadow-md shadow-black">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-primary">
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-card-foreground">
              Fill the details below to register your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-card-foreground">
                  Email
                </label>
                <Input
                  className="bg-background/50 border-border font-semibold "
                  {...register("email")}
                  placeholder="Enter your email"
                />
                <p className="text-destructive text-sm">
                  {errors.email?.message}
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="font-semibold text-card-foreground">
                  Username
                </label>
                <Input
                  className="bg-background/50 border-border font-semibold "
                  {...register("username")}
                  placeholder="Enter your username"
                />
                <p className="text-destructive text-sm">
                  {errors.username?.message}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <label className="font-semibold text-card-foreground">
                  Password
                </label>
                <Input
                  className="bg-background/50 border-border font-semibold "
                  {...register("password")}
                  placeholder="Enter your password"
                  type="password"
                />
                <p className="text-destructive text-sm">
                  {errors.password?.message}
                </p>
              </div>
              <Button
                type="submit"
                className="mt-5 w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Register
              </Button>
            </form>
            <CardAction className="flex gap-2 mt-4">
              <p className="font-sans text-card-foreground">
                Already have an account?
              </p>
              <a
                href="/login"
                className="text-primary cursor-pointer font-bold"
              >
                Login
              </a>
            </CardAction>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
