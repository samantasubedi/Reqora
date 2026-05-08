"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X, Building2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const params = useSearchParams();
  const token = params.get("token");
  const handleAccept = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/isloggedin`,
        { token },
        {
          withCredentials: true,
        },
      );

      if (response.data.code === "LOGGEDIN") {
        try {
          const response = await axios.post(
            `${backendUrl}/join/byEmail`,
            { code: token },
            {
              withCredentials: true,
            },
          );
          const { code, message, success ,role} = response.data;
          console.log("this his the response", code, message, success);
          if (success && code == "JOIN_SUCCESSFULL") {
            toast.success(message);
            router.push(`/${role}/dashboard`);
          }
        } catch (err: any) {
          if (err.response) {
            const { code, message } = err.response.data;
            console.log("this is the error message", message);
            toast.error(message);
          } else {
            toast.error("server error");
          }
        }
      } else if (response.data.code === "NOT_LOGGEDIN") {
        router.push("/register");
        toast.error(
          "please register and login in reqora before joining the company!",
        );
      }
    } catch (err) {
      console.log(err);
      toast.error("server error");
    }
  };
  const handleDecline = () => {
    console.log("decline clikcked");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-zinc-950 ">
      <Card className="w-full max-w-md border-none  shadow-xl ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800 bg-teal-50">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/30 ring-8 ring-teal-50/50 dark:ring-teal-900/20">
            <Building2 className="h-10 w-10 text-teal-600 dark:text-teal-400" />
          </div>

          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            You've been invited!
          </CardTitle>

          <CardDescription className="text-base">
            You've received an invitation to join{" "}
            <span className="font-bold text-teal-600 dark:text-teal-400">
              Our Company
            </span>{" "}
            on{" "}
            <span className="font-medium text-slate-900 dark:text-zinc-200">
              Reqora
            </span>
            .
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center px-8">
          <p className="text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
            By accepting this invitation, you will get access to your team's
            workspace, shared resources, and active requests.
          </p>
        </CardContent>

        <CardFooter className="flex gap-3 pt-6 px-8 pb-8">
          <Button
            variant="outline"
            className="flex-1 bg-red-600 text-bold text-white! hover:bg-red-500 transition-all duration-200 cursor-pointer"
            onClick={() => handleDecline()}
          >
            <X className="mr-2 h-4 w-4  text-bold" /> Decline
          </Button>

          <Button
            className="flex-1 bg-linear-to-br cursor-pointer from-teal-600 to-blue-700 hover:from-teal-500 hover:to-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none transition-transform active:scale-[0.98]"
            onClick={() => handleAccept()}
          >
            <Check className="mr-2 h-4 w-4" /> Accept Invite
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
