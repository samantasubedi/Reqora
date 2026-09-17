"use client";
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
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { T_MutationError } from "@/types/global";
import RoleAndExpiryTime from "./RoleAndExpiryTime";

const fieldLabel =
  "text-sm font-semibold uppercase tracking-wide text-card-foreground";
const inputClass =
  "h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition";
const textareaClass =
  "rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition";

const schema = z.object({
  email: z.email("Please enter an email").min(1, "Please enter an email"),
  role: z.string("Please select a role").min(1, "Please select a role"),
  message: z.string().optional(),
  expiryTime: z.coerce
    .number()
    .min(1, "please provide an invitation expiry time"),
  departmentId: z
    .string("Please select a department")
    .min(1, "Please select a department"),
});
export type emailInviteFormType = z.infer<typeof schema>;

const EmailInviteForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      expiryTime: 0,
    },
  });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
    reset,
  } = form;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const postApi = async (data: emailInviteFormType) => {
    const response = await axios.post(
      `${backendUrl}/invite/emailInvite`,
      data,
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
        reset();
      }
    },
    onError: (error: T_MutationError) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const handleFormSubmit: SubmitHandler<emailInviteFormType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6 shadow-sm border border-border bg-card rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary font-bold">
          Send an Invitation Email
        </CardTitle>
        <CardDescription className="text-center">
          Invite a teammate by email and assign their role and access.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className={fieldLabel}>Email Address</label>
            <Input
              {...register("email")}
              placeholder="Enter email"
              className={inputClass}
            />
            {errors.email?.message && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <RoleAndExpiryTime
            errors={{
              roleError: errors.role?.message,
              expiryTimeError: errors.expiryTime?.message,
              departmentIdError: errors.departmentId?.message,
            }}
            values={{
              expiryTime: Number(watch("expiryTime")),
              role: watch("role"),
              departmentId: watch("departmentId"),
            }}
            onChange={(values) => {
              setValue("role", values.role);
              if (values.role) form.clearErrors("role");
              setValue("expiryTime", values.expiryTime);
              if (values.expiryTime) form.clearErrors("expiryTime");
              setValue("departmentId", values.departmentId);
              if (values.departmentId) form.clearErrors("departmentId");
            }}
          />

          <div className="flex flex-col gap-2">
            <label className={fieldLabel}>Message</label>
            <Textarea
              {...register("message")}
              rows={4}
              placeholder="Write a message (optional)"
              className={textareaClass}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-11 cursor-pointer mt-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Sending..." : "Send Invitation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
export default EmailInviteForm;
