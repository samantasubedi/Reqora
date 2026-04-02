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
import { useRouter } from "next/navigation";
import { handleLogout } from "@/components/admin/AdminDashboard";
const page = () => {
  const router = useRouter();
  const cardClass =
    "w-full p-5 shadow-lg hover:shadow-orange-400 transition-all duration-300 ease-in-out hover:translate-x-1";
  const buttonClass =
    "bg-orange-400 w-full h-15 text-3xl cursor-pointer hover:bg-orange-500 transition-all duration-300 ease-in-out p-3 ";
  return (
    <div className="bg-linear-to-r from-orange-50 to-orange-100 h-screen p-2">
      <Button
        className="bg-red-600 hover:bg-red-500"
        onClick={() => handleLogout(router)}
      >
        Logout
      </Button>
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
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className="text-center text-4xl text-amber-900">
                Join a Company
              </CardTitle>
              <CardDescription className="text-center text-md">
                Use your invite code to connect with your team and access shared
                resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {" "}
                <Image
                  className="w-80 h-80 "
                  width={1000}
                  height={1000}
                  alt="join image"
                  src="/joinCompany.jpg"
                ></Image>
              </div>
              <p className="text-gray-500 font-semibold">Have a code ?</p>
              <CardAction className="w-full">
                <Button size="lg" className={buttonClass}>
                  Join
                  <Icon icon="line-md:login" className="h-10! w-10!" />
                </Button>
              </CardAction>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className="text-center text-4xl text-amber-900">
                Create a Company
              </CardTitle>
              <CardDescription className="text-center text-md">
                Create a new workspace for your company and set up your team,
                roles, and workflow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {" "}
                <Image
                  className="w-80 h-80 "
                  width={1000}
                  height={1000}
                  alt="join image"
                  src="/createCompany.webp"
                ></Image>
              </div>
              <p className="text-gray-500 font-semibold">
                Want to start fresh?
              </p>
              <CardAction className="w-full">
                <Button
                  onClick={() => {
                    router.push("/getstarted/createcompany");
                  }}
                  size="lg"
                  className={buttonClass}
                >
                  Create
                  <Icon icon="wordpress:create" className="w-15! h-15!" />
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
