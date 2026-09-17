"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Check, Loader2, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { T_MutationError } from "@/types/global";

const Page = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const params = useSearchParams();
  const token = params.get("token");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    if (!token) {
      toast.error("This invitation link is invalid or missing its token.");
      return;
    }
    setIsProcessing(true);
    try {
      const loginResponse = await axios.post(
        `${backendUrl}/isloggedin`,
        { token },
        { withCredentials: true },
      );

      if (loginResponse.data.code === "NOT_LOGGEDIN") {
        toast.error(
          "Please register and log in to Reqora before joining the company!",
        );
        router.push("/register");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/join/byEmail`,
        { joinToken: token },
        { withCredentials: true },
      );
      const { code, message, success, role } = response.data;
      if (success && code === "JOIN_SUCCESSFULL") {
        toast.success(message);
        router.push(`/${role}/dashboard`);
      }
    } catch (err) {
      const error = err as T_MutationError;
      toast.error(
        error.response?.data?.message || error.message || "Server error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md rounded-2xl border-border shadow-xl">
        <CardHeader className="space-y-1 pb-4 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-primary/10 ring-8 ring-primary/5">
            <Building2 className="size-10 text-primary" />
          </div>

          <CardTitle className="text-3xl font-extrabold tracking-tight text-card-foreground">
            You&apos;ve been invited!
          </CardTitle>

          <CardDescription className="text-base">
            You&apos;ve received an invitation to join a company workspace on{" "}
            <span className="font-semibold text-primary">Reqora</span>.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            By accepting this invitation, you will get access to your
            team&apos;s workspace, shared resources, and active requests.
          </p>
        </CardContent>

        <CardFooter className="flex gap-3 px-8 pb-8 pt-6">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={isProcessing}
            className="h-11 flex-1 cursor-pointer rounded-lg border-border font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="mr-2 size-4" /> Decline
          </Button>

          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="h-11 flex-1 cursor-pointer rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Check className="mr-2 size-4" />
            )}
            {isProcessing ? "Joining..." : "Accept Invite"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
