"use client";
import { Card } from "@/components/ui/card";
import React from "react";
import { Icon } from "@iconify/react";
import {
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
const page = () => {
  return (
    <div className="bg-linear-to-r from-orange-50 to-orange-100 h-screen p-2">
      <h1 className="font-bold text-7xl font-sans text-center mt-[8%]">
        Get started
      </h1>
      <div className="flex justify-center font-semibold text-lg">
        <h2 className="text-center w-[50%]">
          Start by Joining an existing company space with an invite code, or
          create a new company to set up your workspace, roles, and approval
          flow.
        </h2>
      </div>
      <div className="w-full flex justify-center mt-10">
        {" "}
        <div className="flex gap-10  w-[60%] ">
          <Card className="w-full p-5">
            <CardHeader>
              <CardTitle className="text-center">Join a Company</CardTitle>
              <CardDescription className="text-center">
            Use your invite code to connect with your team and access shared resources..
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {" "}
                <Image
                  className="w-100 h-100 "
                  width={1000}
                  height={1000}
                  alt="join image"
                  src="/joinCompany.jpg"
                ></Image>
              </div>
              <CardAction className="w-full">
                <Button
                  size="lg"
                  className="bg-orange-400 w-full text-2xl cursor-pointer hover:bg-blue-700 transition-all duration-300 ease-in-out"
                >
                  Join
                  <Icon icon="line-md:login" width="24" height="50" />
                </Button>
              </CardAction>
            </CardContent>
          </Card>
          <Card className=" p-5 w-full">
            <CardHeader>
              <CardTitle className="text-center">Create a Company</CardTitle>
              <CardDescription className="text-center">
             
                Create a new workspace for your company and set up your team, roles, and workflow.
              </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex justify-center">
                {" "}
                <Image
                  className="w-100 h-100 "
                  width={1000}
                  height={1000}
                  alt="join image"
                  src="/createCompany.webp"
                ></Image>
              </div>
              <CardAction className="w-full">
                <Button
                  size="lg"
                  className="bg-orange-400 w-full text-2xl cursor-pointer hover:bg-blue-700 transition-all duration-300 ease-in-out"
                >
                  Create
          <Icon icon="wordpress:create" width="24" height="24" />
                </Button>
              </CardAction>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
