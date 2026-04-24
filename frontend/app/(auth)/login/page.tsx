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
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useGlobalStore } from "@/app/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { T_MutaionError } from "@/types/global";

type formDataType = {
  username: string;
  password: string;
};
const page = () => {
  const router = useRouter();
  const setUserData = useGlobalStore((state) => state.setUserData);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<formDataType>();
  const postApi = async (data: formDataType) => {
    const response = await axios.post(`${backendUrl}/login`, data, {
      withCredentials: true,
    });

    return response.data;
  };
  const postMutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      if (data.success && data.code == "LOGIN_SUCCESSFULL")
        toast.success(data.message);
      const username = data.username;
      const role = data.role;
      setUserData({ username, role });
      if (!role) {
        router.push("/getstarted");
      } else if (role) {
        router.push(`/${data.role}/dashboard`);
      }
    },
    onError: (error: T_MutaionError) => {
      if (error.response?.data.code == "INVALID_CREDIENTIALS") {
        setError("username", { message: error.response.data.message });
        setError("password", { message: error.response.data.message });
      }
      toast.error(error.response?.data.message);
    },
  });

  const formSubmitHandler: SubmitHandler<formDataType> = async (data) => {
    postMutation.mutate(data);
  };

  return (
    <div className="flex justify-center  bg-linear-to-l from-blue-950 to-teal-800  min-h-screen">
      <Card className="w-[30%] h-fit mt-[10%] bg-transparent/70 border-teal-950 shadow-md shadow-black">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-cyan-400">
            Login to your account
          </CardTitle>
          <CardDescription className="text-center text-white">
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(formSubmitHandler)}>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-white">Username</label>
              <Input
                className="bg-slate-400 border-none font-semibold "
                placeholder="Enter your username"
                {...register("username", {
                  required: "username is required !",
                  minLength: {
                    value: 3,
                    message: "username must be at least 3 characters !",
                  },
                })}
              />
              <p className="text-red-400">{errors.username?.message}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-semibold text-white">Password</label>
              <Input
                className="bg-slate-400 border-none font-semibold"
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
              <p className="text-red-400">{errors.password?.message}</p>
            </div>
            <Button
              disabled={postMutation.isPending}
              type="submit"
              className="w-full mt-5 cursor-pointer bg-teal-600 hover:bg-teal-700 "
            >
              {postMutation.isPending ? "Logging in" : "Login "}
            </Button>
          </form>
          <CardAction className="flex gap-2 mt-4">
            <p className="font-sans text-white">Don't have an account ?</p>{" "}
            <a
              className="text-blue-400 cursor-pointer font-bold"
              href="/register"
            >
              Register
            </a>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
