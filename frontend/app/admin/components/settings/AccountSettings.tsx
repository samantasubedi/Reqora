"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-toastify";
import { KeyRound, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TableError } from "../TableError";
import {
  useAdminProfile,
  useChangePassword,
  useUpdateAdminProfile,
} from "../../hooks/profileHooks";
import type { AdminProfile } from "../../apis/profileApi";
import type { T_MutationError } from "@/types/global";

const labelClass = "text-sm font-medium";
const errorClass = "text-xs font-medium text-destructive";
const inputClass = "h-11";

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email"),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

const getErrorMessage = (error: T_MutationError) =>
  error.response?.data?.message ?? error.message;

const ProfileCard = ({ profile }: { profile: AdminProfile }) => {
  const router = useRouter();
  const updateProfile = useUpdateAdminProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username,
      email: profile.email,
      description: profile.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      username: profile.username,
      email: profile.email,
      description: profile.description ?? "",
    });
  }, [profile, reset]);

  const onSubmit = (values: ProfileValues) => {
    updateProfile.mutate(values, {
      onSuccess: (response) => {
        toast.success(response.message);
        if (response.requiresRelogin) {
          router.push("/login");
        }
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <UserRound className="size-5" />
            </div>
            <div>
              <CardTitle>Your profile</CardTitle>
              <CardDescription>
                Update the details tied to your account.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {profile.role ?? "No role"}
            </Badge>
            {profile.departmentName && (
              <Badge variant="outline">{profile.departmentName}</Badge>
            )}
            {profile.companyName && (
              <Badge variant="outline">{profile.companyName}</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              {...register("username")}
              className={inputClass}
            />
            {errors.username?.message && (
              <p className={errorClass}>{errors.username.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="profileEmail">
              Email
            </label>
            <Input
              id="profileEmail"
              type="email"
              {...register("email")}
              className={inputClass}
            />
            {errors.email?.message && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className={labelClass} htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              {...register("description")}
              rows={4}
              placeholder="Tell your team a little about yourself (optional)"
            />
            {errors.description?.message && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Changing your username or email will sign you out.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-6">
          <Button type="submit" disabled={updateProfile.isPending || !isDirty}>
            {updateProfile.isPending ? "Saving..." : "Save profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const PasswordCard = () => {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: PasswordValues) => {
    changePassword.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          reset();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <KeyRound className="size-5" />
          </div>
          <div>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Use a strong password you don&apos;t use anywhere else.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className={labelClass} htmlFor="currentPassword">
              Current password
            </label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              className={inputClass}
              autoComplete="current-password"
            />
            {errors.currentPassword?.message && (
              <p className={errorClass}>{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="newPassword">
              New password
            </label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              className={inputClass}
              autoComplete="new-password"
            />
            {errors.newPassword?.message && (
              <p className={errorClass}>{errors.newPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="confirmPassword">
              Confirm new password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className={inputClass}
              autoComplete="new-password"
            />
            {errors.confirmPassword?.message && (
              <p className={errorClass}>{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-6">
          <Button type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending ? "Updating..." : "Change password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const AccountSettings = () => {
  const { data, isLoading, isError, refetch } = useAdminProfile();

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="h-72 animate-pulse rounded-xl border bg-card" />
        <div className="h-64 animate-pulse rounded-xl border bg-card" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <TableError
        title="Unable to load your profile"
        message="We couldn't load your account details. Check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <ProfileCard profile={data} />
      <PasswordCard />
    </div>
  );
};

export default AccountSettings;
