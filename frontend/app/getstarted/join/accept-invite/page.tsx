"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building2, Check, Loader2, X } from "lucide-react";
import { api } from "@/lib/apiClient";
import { toast } from "react-toastify";
import { T_MutationError } from "@/types/global";
import { GetStartedShell } from "../../components/GetStartedShell";
import { Reveal } from "@/components/landing/Reveal";

const AcceptInviteContent = () => {
  const router = useRouter();
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
      const loginResponse = await api.post(`/isloggedin`, { token });

      if (loginResponse.data.code === "NOT_LOGGEDIN") {
        toast.error("Please sign in to Reqora before accepting the invite.");
        const returnTo = `/getstarted/join/accept-invite?token=${encodeURIComponent(token)}`;
        router.push(`/login?next=${encodeURIComponent(returnTo)}`);
        return;
      }

      const response = await api.post(`/join/byEmail`, {
        joinToken: token,
      });
      const { code, message, success, role } = response.data;
      if (success && code === "JOIN_SUCCESSFULL") {
        toast.success(message);
        router.push(`/${role}/dashboard`);
      }
    } catch (err) {
      const error = err as T_MutationError;
      toast.error(
        error.response?.data?.message || error.message || "Server error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = () => {
    router.push("/");
  };

  return (
    <GetStartedShell
      badge="Step 2 of 3 — Accept your invite"
      title={
        <>
          You&apos;ve been{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            invited to Reqora
          </span>
        </>
      }
      subtitle="Accept to join your team's workspace with the role your admin chose for you."
      step={2}
      backHref="/getstarted"
      backLabel="Back to options"
      maxWidth="max-w-3xl"
    >
      <Reveal>
        <div className="mx-auto w-full max-w-xl rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
            <Building2 className="size-8" />
          </div>
          <p className="mt-4 text-xl font-bold text-card-foreground">
            Join your team&apos;s workspace
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            By accepting, you get access to shared resources, active requests,
            and your role&apos;s dashboard — all scoped to your company and
            department.
          </p>
          {!token && (
            <p className="mx-auto mt-4 max-w-md rounded-xl border border-destructive/30 bg-[var(--status-danger-bg)] px-4 py-3 text-sm font-semibold text-[var(--status-danger-text)]">
              This link looks incomplete — no invite token was found. Ask your
              admin to resend the invitation.
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={isProcessing}
              className="h-11 flex-1 cursor-pointer rounded-xl font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="size-4" />
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isProcessing || !token}
              className="h-11 flex-1 cursor-pointer rounded-xl border-0 bg-gradient-to-r from-emerald-500 to-teal-600 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Accept invite
                </>
              )}
            </Button>
          </div>
        </div>
      </Reveal>
    </GetStartedShell>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
};

export default Page;
