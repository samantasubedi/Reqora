"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useGlobalStore } from "@/app/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { Role, T_MutationError } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { LoginApi } from "@/app/admin/apis/authApi";
import { useLogin } from "@/app/admin/hooks/authHooks";
import Navbar from "@/components/others/Navbar";

const schema = z.object({
  username: z
    .string("Please enter the username")
    .min(1, "Please enter the username")
    .min(3, "Please enter a valid username"),
  password: z
    .string("Please enter the password")
    .trim()
    .min(1, "Please enter the password")
    .min(8, "Password must be at least 8 characters"),
});
type formDataType = z.infer<typeof schema>;

const Page = () => {
  const router = useRouter();
  const setUserData = useGlobalStore((state) => state.setUserData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(schema) });
  const loginMutation = useLogin();

  const formSubmitHandler: SubmitHandler<formDataType> = async (data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        if (data.success && data.code == "LOGIN_SUCCESSFULL")
          toast.success(data.message);
        const username = data.username;
        const role: Role = data.role;
        setUserData({ username, role });
        if (!role) {
          router.push("/getstarted");
        } else if (role) {
          router.push(`/${data.role}/dashboard`);
        }
      },
      onError: (error: T_MutationError) => {
        if (error.response) {
          if (error.response?.data.code == "INVALID_CREDIENTIALS") {
            setError("username", { message: error.response.data.message });
            setError("password", { message: error.response.data.message });
          }
          toast.error(error.response?.data.message);
        } else {
          toast.error(error.message);
        }
      },
    });
  };

  return (
    <div className=" min-h-screen flex flex-col">
    <Navbar/>
    <div className="flex justify-center bg-auth-bg flex-1 ">
      <Card className="w-[30%] h-fit mt-[10%] bg-auth-card-bg backdrop-blur-xl border-auth-card-border shadow-md shadow-black">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-primary">
            Login to your account
          </CardTitle>
          <CardDescription className="text-center text-card-foreground">
            Enter your username and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(formSubmitHandler)}>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-card-foreground">Username</label>
              <Input
                className="bg-background/50 border-border font-semibold "
                placeholder="Enter your username"
                {...register("username", {
                  required: "username is required !",
                  minLength: {
                    value: 3,
                    message: "username must be at least 3 characters !",
                  },
                })}
              />
              <p className="text-destructive">{errors.username?.message}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-semibold text-card-foreground">Password</label>
              <Input
                className="bg-background/50 border-border font-semibold"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "password is required !",
                  minLength: {
                    value: 8,
                    message: "passowrd must me atleast 8 characters !",
                  },
                })}
              />
              <p className="text-destructive">{errors.password?.message}</p>
            </div>
            <Button
              disabled={loginMutation.isPending}
              type="submit"
              className="w-full mt-5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground "
            >
              {loginMutation.isPending ? "Logging in" : "Login "}
            </Button>
          </form>
          <CardAction className="flex gap-2 mt-4">
            <p className="font-sans text-card-foreground">Dont have an account ?</p>
            <a
              className="text-primary cursor-pointer font-bold"
              href="/register"
            >
              Register
            </a>
          </CardAction>
        </CardContent>
      </Card>
    </div></div>
  );
};

export default Page;
