"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BorderBeam } from "@/components/ui/border-beam";
import Navbar from "@/components/others/Navbar";
const Page = () => {
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
    "relative group flex-1 h-full p-5 shadow-white hover:shadow-xl transition-all duration-300 ease-in-out hover:translate-x-1 backdrop-blur-xl";
  const buttonClass =
    " w-full h-15 transition-all duration-400! text-3xl cursor-pointer  transition-all duration-300 ease-in-out p-3 ";
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 overflow-hidden p-4">
        <div className="w-full h-full flex justify-center">
          <div className="flex justify-evenly w-full gap-8">
            <Card className={`${cardClass} bg-teal-500/15 border-teal-500/40`}>
              <BorderBeam
                size={250}
                borderWidth={3}
                colorFrom="#14b8a6"
                colorTo="#10b981"
                className="opacity-0 group-hover:opacity-100"
              />
              <CardHeader>
                <CardTitle className="text-center text-4xl font-bold text-teal-700">
                  Join a Company
                </CardTitle>
                <CardDescription className="text-center text-md text-foreground/70 font-semibold">
                  Use your invite code to connect with your team and pick up
                  where they left off.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-5">
                <div className="flex justify-center">
                  <Icon
                    icon="fluent:people-add-20-filled"
                    className="text-teal-600 size-24"
                  />
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Icon
                      icon="mdi:shield-account"
                      className="text-teal-600 size-6 shrink-0 mt-0.5"
                    />
                    <p className="text-foreground">
                      Assigns the role designated by your administrator
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon
                      icon="mdi:account-check"
                      className="text-teal-600 size-6 shrink-0 mt-0.5"
                    />
                    <p className="text-foreground">
                      Employees submit requests; managers review and approve
                      them
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon
                      icon="mdi:login"
                      className="text-teal-600 size-6 shrink-0 mt-0.5"
                    />
                    <p className="text-foreground">
                      Grants immediate access, no additional registration
                      required
                    </p>
                  </li>
                </ul>
                <p className="text-foreground font-semibold">Have a code ?</p>
                <CardAction className="w-full mt-auto">
                  <Button
                    onClick={() => {
                      router.push("/getstarted/join/join-code");
                    }}
                    size="lg"
                    className={`${buttonClass} text-primary-foreground bg-primary hover:bg-primary/90`}
                  >
                    Join
                    <Icon icon="line-md:login" className="h-10! w-10!" />
                  </Button>
                </CardAction>
              </CardContent>
            </Card>

            <Card
              className={`${cardClass} bg-emerald-500/15 border-emerald-500/40`}
            >
              <BorderBeam
                size={250}
                borderWidth={3}
                colorFrom="#10b981"
                colorTo="#14b8a6"
                className="opacity-0 group-hover:opacity-100"
              />
              <CardHeader>
                <CardTitle className="text-center text-4xl font-bold text-emerald-700">
                  Create a Company
                </CardTitle>
                <CardDescription className="text-center text-md text-foreground/70 font-semibold">
                  Create a new workspace for your company and set up your team,
                  roles, and workflow.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-5">
                <div className="flex justify-center">
                  <Icon
                    icon="mdi:company"
                    className="text-emerald-600 size-24"
                  />
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Icon
                      icon="mdi:office-building"
                      className="text-emerald-600 size-6 shrink-0 mt-0.5"
                    />
                    <p className="text-foreground">
                      Set up your company workspace from scratch
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon
                      icon="mdi:account-multiple-outline"
                      className="text-emerald-600 size-6 shrink-0 mt-0.5"
                    />
                    <p className="text-foreground">
                      Define roles and permissions for your team
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon
                      icon="mdi:clipboard-flow-outline"
                      className="text-emerald-600 size-6 shrink-0 mt-0.5"
                    />
                    <p className="text-foreground">
                      Configure your resource approval workflow
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon
                      icon="mdi:email-arrow-right-outline"
                      className="text-emerald-600 size-6 shrink-0 mt-0.5"
                    />
                    <p className="text-foreground">
                      Invite your employees to join and collaborate
                    </p>
                  </li>
                </ul>
                <p className="text-foreground font-semibold">
                  Want to start fresh?
                </p>
                <CardAction className="w-full mt-auto">
                  <Button
                    onClick={() => {
                      router.push("/getstarted/createcompany");
                    }}
                    size="lg"
                    className={`${buttonClass}bg-primary hover:bg-primary/90 text-primary-foreground`}
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
    </div>
  );
};

export default Page;
