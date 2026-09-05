"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect } from "react";
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
import { handleLogout } from "@/app/admin/components/AdminDashboard";
import axios from "axios";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BorderBeam } from "@/components/ui/border-beam";
const page = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  useEffect(() => {
    const getUserStatus = async () => {
      try {
        const userInfo = await axios.post(`${backendUrl}/isloggedIn`, null, {
          withCredentials: true,
        });
        const role = userInfo.data.role;
        if (role) {
          router.push(`/${role}/dashboard`);
        }
        console.log("this is the data", role);
      } catch (err) {}
    };
    getUserStatus();
  }, []);

  const cardClass =
    "relative group  w-[30%] h-full p-5 shadow-white hover:shadow-xl transition-all duration-300 ease-in-out hover:translate-x-1";
  const buttonClass =
    " w-full h-15 transition-all duration-400! text-3xl cursor-pointer  transition-all duration-300 ease-in-out p-3 ";
  return (
    <div
      className="bg-linear-to-r from-[#c9f4ff]
 to-[#6cd3a8] h-screen p-2 border-none overflow-hidden"
    >
      <div className="flex justify-between ">
        <button
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src="/reqoraLogo.png"
            width={500}
            height={500}
            alt="logo"
            className="w-50 h-25"
          ></Image>
        </button>
        <Button
          className="bg-red-600 hover:bg-red-400 font-bold px-4!"
          onClick={() => handleLogout(router)}
        >
          Logout
        </Button>
      </div>
      <div className="flex justify-center">
        <AnimatedGradientText
          speed={1.7}
          colorFrom="#5304c9"
          colorTo="#03a19e"
          className="font-bold text-6xl text-center"
        >
          Get Started
        </AnimatedGradientText>
      </div>
      <div className="flex justify-center font-semibold text-lg mt-5">
        <h2 className="text-center w-[50%] text-teal-800">
          Start by Joining an existing company space with an invite code, or
          create a new company to set up your workspace, roles, and approval
          flow.
        </h2>
      </div>
      <div className="w-full flex justify-center mt-10">
        <div className="flex justify-evenly  w-full">
          <Card className={`${cardClass} bg-cyan-800/20`}>
            <BorderBeam
              size={300}
              borderWidth={3}
              className="opacity-0 group-hover:opacity-100"
            />
            <CardHeader>
              <CardTitle className="text-center text-4xl font-bold text-white py-5 rounded-2xl">
                Join a Company
              </CardTitle>
              <CardDescription className="text-center text-md text-blue-800 font-semibold">
                Use your invite code to connect with your team and access shared
                resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {" "}
                <Icon
                  icon="fluent:people-add-20-filled"
                  className="text-cyan-800 size-80"
                />
              </div>
              <p className="text-black font-semibold">Have a code ?</p>
              <CardAction className="w-full">
                <Button
                  onClick={() => {
                    router.push("/getstarted/join/join-code");
                  }}
                  size="lg"
                  className={`${buttonClass} text-white bg-blue-800/70 hover:bg-blue-900/70`}
                >
                  Join
                  <Icon icon="line-md:login" className="h-10! w-10!" />
                </Button>
              </CardAction>
            </CardContent>
          </Card>

          <Card className={`${cardClass} bg-green-500/30`}>
            <BorderBeam
              size={300}
              borderWidth={3}
              className="opacity-0 group-hover:opacity-100"
            />
            <CardHeader>
              <CardTitle className="text-center text-4xl font-bold text-white py-5 rounded-2xl">
                Create a Company
              </CardTitle>
              <CardDescription className="text-center text-md  text-green-800 font-semibold">
                Create a new workspace for your company and set up your team,
                roles, and workflow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {" "}
                <Icon icon="mdi:company" className="text-teal-800 size-80" />
              </div>
              <p className="text-black font-semibold">Want to start fresh?</p>
              <CardAction className="w-full">
                <Button
                  onClick={() => {
                    router.push("/getstarted/createcompany");
                  }}
                  size="lg"
                  className={`${buttonClass}bg-green-500 hover:bg-green-600`}
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
