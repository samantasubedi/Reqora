"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Loader2, LockKeyhole, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useGlobalStore } from "@/app/store/authStore";
import { Role, T_MutationError } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useLogin } from "@/app/admin/hooks/authHooks";
import { AuthShell } from "../components/AuthShell";
import { PasswordInput } from "../components/PasswordInput";
import { getSafeNext, withNext } from "../components/nextPath";

const schema = z.object({
  username: z
    .string("Please enter your username")
    .trim()
    .min(1, "Please enter your username")
    .min(3, "Please enter a valid username"),
  password: z
    .string("Please enter your password")
    .trim()
    .min(1, "Please enter your password")
    .min(8, "Password must be at least 8 characters"),
});
type formDataType = z.infer<typeof schema>;

const labelClass =
  "font-ledger text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground";
const inputClass =
  "h-11 rounded-xl pl-10 font-medium focus-visible:ring-[var(--stamp)]";
const errorClass = "text-xs font-medium text-destructive";

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeNext(searchParams);
  const setUserData = useGlobalStore((state) => state.setUserData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<formDataType>({ resolver: zodResolver(schema) });
  const loginMutation = useLogin();

  const formSubmitHandler: SubmitHandler<formDataType> = async (data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        if (data.success && data.code == "LOGIN_SUCCESSFULL")
          toast.success(data.message);
        const username = data.username;
        const role: Role = data.role;
        setUserData({ username, role });
        if (role) {
          router.push(`/${data.role}/dashboard`);
        } else if (next) {
          router.push(next);
        } else {
          router.push("/getstarted");
        }
      },
      onError: (error: T_MutationError) => {
        if (error.response) {
          if (error.response?.data.code == "INVALID_CREDIENTIALS") {
            setError("username", { message: error.response.data.message });
            setError("password", { message: error.response.data.message });
          }
          toast.error(error.response?.data.message);
        } else {
          toast.error(error.message);
        }
      },
    });
  };

  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to Reqora"
      subtitle="Enter your credentials to access your workspace."
      switchPrompt="Don't have an account?"
      switchLabel="Create one"
      switchHref={withNext("/register", next)}
    >
      <form onSubmit={handleSubmit(formSubmitHandler)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <span className="relative block">
            <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              className={inputClass}
              placeholder="Enter your username"
              autoComplete="username"
              {...register("username")}
            />
          </span>
          {errors.username?.message && (
            <p className={errorClass}>{errors.username.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <span className="relative block">
            <LockKeyhole className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <PasswordInput
              id="password"
              className="pl-10"
              placeholder="Enter your password"
              {...register("password")}
            />
          </span>
          {errors.password?.message && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>
        <Button
          disabled={loginMutation.isPending}
          type="submit"
          className="h-12 w-full cursor-pointer rounded-xl bg-[var(--stamp)] text-base font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthShell>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="ledger-paper flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[var(--stamp)]" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
};

export default Page;
