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
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const postApi = async (code: string) => {
    const response = await axios.post(
      `${backendUrl}/join/byCode`,
      { code },
      {
        withCredentials: true,
      },
    );
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        router.push(`/${data.role}/dashboard`);
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
    <div className="flex justify-center min-h-screen bg-background">
      <Card className="md:w-[30%] md:mt-[10%] bg-card h-fit">
        <CardHeader className="p-4 bg-primary rounded-b-2xl">
          <CardTitle className="flex gap-5 text-2xl justify-center items-center">
            <Icon
              icon="mdi:people"
              className="text-5xl! bg-card rounded-full p-2 text-primary"
            />
            <span className="text-primary-foreground">Join a Company</span>
          </CardTitle>
          <CardDescription className="text-foreground font-semibold text-center">
            Enter the company code shared by your administrator.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <label className="text-xl font-semibold text-secondary-foreground">
            Join Code
          </label>
          <Input
            onChange={(e) => {
              setJoinCode(e.target.value);
            }}
            placeholder="eg: H3E0klMT3f"
            className="bg-card mt-2 h-14! text-2xl! font-semibold text-foreground border-border"
          ></Input>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              console.log(joinCode);
              mutation.mutate(joinCode);
            }}
            className="bg-primary w-full! font-extrabold text-lg mt-5 hover:bg-primary/90 cursor-pointer text-primary-foreground"
          >
            Join
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
