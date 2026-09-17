"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Navbar from "@/components/others/Navbar";

import { GradientBackground } from "@/components/animate-ui/components/backgrounds/gradient";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import Footer from "@/components/others/Footer";

export default function Home() {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await axios.post(`${backendUrl}/isloggedin`, null, {
          withCredentials: true,
        });

        if (response.data.code == "LOGGEDIN") {
          const { role, username } = response.data;
          setLoggedIn(true);

          if (role) {
            router.push(`/${role}/dashboard`);
            setRole(role);
            return;
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
        <Navbar />
        <div className="flex justify-center mt-20 flex-col items-center">
          <p className="font-bold text-6xl text-primary">
            Streamline Resource Requests.
          </p>
          <AnimatedGradientText
            speed={1.7}
            colorFrom="#10b981"
            colorTo="#0d9488"
            className="font-bold text-6xl"
          >
            Eliminate Chaos.
          </AnimatedGradientText>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 mt-[2%] text-secondary-foreground font-semibold">
          <p className=" ">
            Reqora brings clarity to every resource request — from laptops to
            software access.
          </p>
          <p className="">One platform for employees, managers, and admins.</p>
        </div>
        <div className="flex justify-center mt-10">
          <LiquidButton
            onClick={() => {
              if (loggedIn && !role) {
                router.push("/getstarted");
              } else if (!loggedIn) {
                router.push("/login");
              }
            }}
            className="cursor-pointer [--liquid-button-background-color:theme(colors.emerald.500)] [--liquid-button-color:theme(colors.teal.600)] text-white font-bold text-xl h-15 w-40"
          >
            Get Started
          </LiquidButton>
        </div>
      </GradientBackground>

      <section
        id="features"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20"
      >
        <h2 className="text-center text-4xl font-bold text-primary">
          Features
        </h2>
        <p className="mt-2 text-center text-secondary-foreground font-semibold">
          Everything your team needs to keep resource requests moving.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-2xl font-bold text-primary">Streamlined requests</p>
            <p className="mt-2 text-secondary-foreground font-medium">
              Request resources with a few clicks — no more lost emails or
              spreadsheets.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-2xl font-bold text-primary">Clear approvals</p>
            <p className="mt-2 text-secondary-foreground font-medium">
              Managers and admins see every request, approve with one click, and
              know what is pending and why.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-2xl font-bold text-primary">Full visibility</p>
            <p className="mt-2 text-secondary-foreground font-medium">
              Track which resources your company owns, who uses them, and how
              your team is doing.
            </p>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24">
        <h2 className="text-center text-4xl font-bold text-primary">
          How it works
        </h2>
        <p className="mt-2 text-center text-secondary-foreground font-semibold">
          From request to delivery in three simple steps.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm">
            <p className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              1
            </p>
            <p className="mt-4 text-xl font-bold">Request</p>
            <p className="mt-2 text-secondary-foreground font-medium">
              Employees request the resources they need and where they need
              them.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm">
            <p className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              2
            </p>
            <p className="mt-4 text-xl font-bold">Approve</p>
            <p className="mt-2 text-secondary-foreground font-medium">
              Managers review and approve, keeping everyone in the loop.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm">
            <p className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              3
            </p>
            <p className="mt-4 text-xl font-bold">Deliver</p>
            <p className="mt-2 text-secondary-foreground font-medium">
              The resource is assigned and tracked, so nothing falls through
              the cracks.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
