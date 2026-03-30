"use client";
import { useSearchParams } from "next/navigation";
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

const page = () => {
  const params = useSearchParams();
  const token = params.get("token");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-zinc-950">
      <Card className="w-full  shadow-lg border-2 border-red-500">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            You've been invited!
          </CardTitle>
          <CardDescription className="pt-2">
            You've received an invitation to join{" "}
            <span className="font-semibold text-foreground">Our Company</span> on
            Reqora.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pt-4 pb-6">
          <p className="text-sm text-balance text-muted-foreground">
            By accepting this invitation, you will get access to your team's
            workspace, resources, and requests.
          </p>
        </CardContent>
        <CardFooter className="flex w-full justify-between">
          <Button className="w-[45%] bg-blue-700">
            <Check className="mr-2 h-4 w-4" /> Accept Invite
          </Button>
          <Button className="w-[45%] bg-red-700">
            <X className="mr-2 h-4 w-4" /> Decline
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
