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
import axios from "axios";
import { toast } from "react-toastify";
import { access } from "fs";

type formDataType = {
  username: string;
  password: string;
};
const page = () => {
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<formDataType>();
  const formSubmitHandler: SubmitHandler<formDataType> = async (data) => {
    try {
      const response = await axios.post(`${backendUrl}/login`, data, {
        withCredentials: true,
      });
      if (
        response.status == 200 &&
        response.data.code === "LOGIN_SUCCESSFULL"
      ) {
        // const token: string = response.data.accessToken;
        // console.log(token);
        // const tokenData = jwtDecode<tokenType["decodedToken"]>(token);
        // console.log(`this is decoded token`, tokenData);
        // setAccessToken({ accessToken: token, decodedToken: tokenData });
        toast.success(response.data.message);
        router.push(`/${response.data.role}/dashboard`);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
        console.log(err.response.data);
        if (
          err.response.status == 401 &&
          err.response.data.code === "INVALID_CREDIENTIALS"
        ) {
          setError("username", { message: err.response.data.message });
          setError("password", { message: err.response.data.message });
        }
      } else {
        console.log("unexpected error", err);
      }
    }
  };

  return (
    <div className="flex justify-center mt-[10%]">
      <Card className="w-[30%]">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Login to your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(formSubmitHandler)}>
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Username</label>
              <Input
                placeholder="Enter your username"
                {...register("username", {
                  required: "username is required !",
                  minLength: {
                    value: 3,
                    message: "username must be at least 3 characters !",
                  },
                })}
              />
              <p className="text-red-600">{errors.username?.message}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-semibold">Password</label>
              <Input
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
              <p className="text-red-600">{errors.password?.message}</p>
            </div>
            <Button
              type="submit"
              className="w-full mt-5 cursor-pointer bg-purple-800 hover:bg-purple-700 "
            >
              Submit
            </Button>
          </form>
          <CardAction className="flex gap-2 mt-4">
            <p className="font-sans">Don't have an account ?</p>{" "}
            <a className="text-blue-700 cursor-pointer" href="/register">
              register
            </a>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
