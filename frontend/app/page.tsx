"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import Navbar from "@/components/others/Navbar";

import { GradientBackground } from "@/components/animate-ui/components/backgrounds/gradient";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

export default function Home() {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await axios.post(`${backendUrl}/isloggedin`, null, {
          withCredentials: true,
        });

        if (response.data.code == "LOGGEDIN") {
          const { role, username } = response.data;

          if (role) {
            router.push(`/${role}/dashboard`);
            return;
          } else if (!role) {
            router.push(`/getstarted`);
          }
        } else if (response.data.code == "NOT_LOGGEDIN") {
          console.log(response.data.message);
          return;
        } else if (response.data.code == "TOKEN_REFRESHED") {
          router.push("/");
          console.log(response.data.message);
          return;
        }
      } catch (err) {
        console.log("request failed", err);
      }
    };
    isLoggedIn();
  }, []);
  return (
    <>
      <GradientBackground className="w-full min-h-screen">
        <Navbar></Navbar>
        <div className="flex justify-center mt-20 flex-col items-center">
          <p className="font-bold text-6xl text-blue-900">
            Streamline Resource Requests.
          </p>
          <AnimatedGradientText
            speed={1.7}
            colorFrom="#00a870"
            colorTo="#0600a8"
            className="font-bold text-6xl"
          >
            Eliminate Chaos.
          </AnimatedGradientText>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 mt-[2%] text-purple-800 font-semibold">
          <p className=" ">
            Reqora brings clarity to every resource request — from laptops to
            software access.
          </p>
          <p className="">One platform for employees, managers, and admins.</p>
        </div>
        <div className="flex justify-center mt-10">
          <LiquidButton className="cursor-pointer [--liquid-button-background-color:theme(colors.blue.400)] [--liquid-button-color:theme(colors.green.400)] text-white font-bold text-xl h-15 w-40">
            Get Started
          </LiquidButton>
        </div>
      </GradientBackground>
    </>
  );
}
