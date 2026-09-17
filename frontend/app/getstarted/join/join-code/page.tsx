"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { T_MutationError } from "@/types/global";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const [joinCode, setJoinCode] = useState("");

  const postApi = async (code: string) => {
    const response = await axios.post(
      `${backendUrl}/join/byCode`,
      { joinCode: code },
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
    onError: (error: T_MutationError) => {
      toast.error(error.response?.data.message || error.message);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (joinCode.trim()) {
      mutation.mutate(joinCode.trim());
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-2xl border-border shadow-xl">
        <CardHeader className="rounded-b-2xl bg-primary p-4 text-center">
          <CardTitle className="flex items-center justify-center gap-4 text-2xl">
            <Icon
              icon="mdi:people"
              className="size-12 rounded-full bg-card p-2 text-primary"
            />
            <span className="text-primary-foreground">Join a Company</span>
          </CardTitle>
          <CardDescription className="font-semibold text-primary-foreground/80">
            Enter the company code shared by your administrator.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-sm font-semibold uppercase tracking-wide text-card-foreground">
              Join Code
            </label>
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="e.g. H3E0klMT3f"
              autoFocus
              className="h-12 rounded-lg border-border bg-background text-center font-mono text-lg font-semibold tracking-widest transition focus:border-transparent focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={!joinCode.trim() || mutation.isPending}
              className="h-11 w-full cursor-pointer rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? "Joining..." : "Join"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Link
        href="/getstarted"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back
      </Link>
    </div>
  );
};

export default Page;
