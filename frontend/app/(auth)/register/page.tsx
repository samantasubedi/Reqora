"use client";

import { Suspense } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { Loader2, LockKeyhole, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRegister } from "@/app/admin/hooks/authHooks";
import { T_MutationError } from "@/types/global";
import { AuthShell } from "../components/AuthShell";
import { PasswordInput } from "../components/PasswordInput";
import { getSafeNext, withNext } from "../components/nextPath";

const schema = z.object({
  email: z
    .email("Please enter a valid email")
    .trim()
    .min(1, "Please enter your email"),
  username: z
    .string("Please enter a username")
    .trim()
    .min(1, "Please enter a username")
    .min(3, "Please enter a valid username"),
  password: z
    .string("Please enter a password")
    .trim()
    .min(1, "Please enter a password")
    .min(8, "Password must be at least 8 characters"),
});
type formDataType = z.infer<typeof schema>;

const labelClass =
  "text-xs font-bold uppercase tracking-widest text-muted-foreground";
const inputClass = "h-11 rounded-xl pl-10 font-medium";
const errorClass = "text-xs font-medium text-destructive";

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeNext(searchParams);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<formDataType>({ resolver: zodResolver(schema) });
  const registerMutation = useRegister();

  const handleFormSubmit: SubmitHandler<formDataType> = async (data) => {
    registerMutation.mutate(data, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(`${data.message}, please sign in to continue`);
          router.push(withNext("/login", next));
        }
      },
      onError: (err: T_MutationError) => {
        if (err.response) {
          toast.error(err.response.data.message);
          if (err.response.data.code === "DUPLICATE_USERNAME") {
            setError("username", { message: err.response.data.message });
          }
        } else {
          toast.error(err.message);
        }
      },
    });
  };

  return (
    <AuthShell
      badge="Get started"
      title="Create your account"
      subtitle="Sign up to create or join a company workspace."
      switchPrompt="Already have an account?"
      switchLabel="Sign in"
      switchHref={withNext("/login", next)}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <span className="relative block">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              className={inputClass}
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email")}
            />
          </span>
          {errors.email?.message && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <span className="relative block">
            <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              className={inputClass}
              placeholder="Choose a username"
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
              autoComplete="new-password"
              placeholder="Create a password (min. 8 characters)"
              {...register("password")}
            />
          </span>
          {errors.password?.message && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="h-12 w-full cursor-pointer rounded-xl border-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
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
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
};

export default Page;
