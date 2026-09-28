"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Loader2, MailCheck } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { T_MutationError } from "@/types/global";

type JoinCodeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JoinCodeModal({ open, onOpenChange }: JoinCodeModalProps) {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");

  const mutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await api.post(`/join/byCode`, { joinCode: code });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        onOpenChange(false);
        setJoinCode("");
        router.push(`/${data.role}/dashboard`);
      }
    },
    onError: (error: T_MutationError) => {
      toast.error(error.response?.data.message || error.message);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (joinCode.trim() && !mutation.isPending) {
      mutation.mutate(joinCode.trim());
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setJoinCode("");
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-300">
            <KeyRound className="size-6" />
          </span>
          <DialogTitle className="text-xl font-bold">Join with a code</DialogTitle>
          <DialogDescription className="font-medium">
            Enter the join code shared by your administrator. Your company,
            department, and role are applied automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="join-code"
              className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
            >
              Join code
            </label>
            <Input
              id="join-code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="e.g. H3E0klMT3f"
              autoFocus
              autoComplete="off"
              className="h-12 rounded-xl text-center font-mono text-lg font-semibold tracking-widest"
            />
          </div>
          <Button
            type="submit"
            disabled={!joinCode.trim() || mutation.isPending}
            className="h-11 w-full cursor-pointer border-0 bg-gradient-to-r from-emerald-500 to-teal-600 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join workspace"
            )}
          </Button>
          <p className="flex items-start justify-center gap-1.5 text-center text-xs font-medium text-muted-foreground">
            <MailCheck className="mt-0.5 size-3.5 shrink-0" />
            Got an email invite instead? Open the link in your inbox — it joins
            you directly.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
