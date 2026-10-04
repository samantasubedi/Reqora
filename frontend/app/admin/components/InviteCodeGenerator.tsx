"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleAndExpiryTime from "./RoleAndExpiryTime";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { T_MutationError } from "@/types/global";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import { useCodeInvite } from "../hooks/userHooks";

const fieldLabel = "text-sm font-medium";

const schema = z.object({
  role: z.string().min(1, "please select a role"),
  expiryTime: z.coerce.number().min(1, "please select an expiry time"),
  departmentId: z.string().min(1, "please select a department"),
});
export type codeInviteFormType = z.infer<typeof schema>;

const InviteCodeGenerator = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "", expiryTime: 0, departmentId: "" },
  });
  const {
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = form;
  const [joinCode, setJoinCode] = useState<string>("");

  const inviteMutation = useCodeInvite({
    onSuccess: (data) => {
      if (data.success) {
        setJoinCode(data.joinCode);
        toast.success(data.message);
      }
    },
    onError: (error: T_MutationError) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleFormSubmit = (data: codeInviteFormType) => {
    inviteMutation.mutate(data);
  };

  return (
    <Card className="mx-auto mt-6 w-full max-w-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Generate Invite Code
        </CardTitle>
        <CardDescription>
          Create a one-time code a teammate can use to join your workspace.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="flex flex-col gap-6">
          <RoleAndExpiryTime
            onChange={(values) => {
              setValue("expiryTime", values.expiryTime);
              if (values.expiryTime) {
                form.clearErrors("expiryTime");
              }
              setValue("role", values.role);
              if (values.role) {
                form.clearErrors("role");
              }
              setValue("departmentId", values.departmentId);
              if (values.departmentId) {
                form.clearErrors("departmentId");
              }
            }}
            values={{
              expiryTime: Number(watch("expiryTime")),
              role: watch("role"),
              departmentId: watch("departmentId"),
            }}
            errors={{
              roleError: errors.role?.message,
              expiryTimeError: errors.expiryTime?.message,
              departmentIdError: errors.departmentId?.message,
            }}
          />

          <div className="flex flex-col gap-2">
            <label className={fieldLabel}>Your Invite Code</label>
            <div className="flex min-h-16 items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/50 px-4 py-3">
              {joinCode ? (
                <>
                  <span className="truncate font-mono text-2xl font-bold tracking-[0.25em] text-card-foreground">
                    {joinCode}
                  </span>
                  <CopyButton
                    className="size-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                    content={joinCode}
                  />
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Your code will appear here
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-5">
          <Button
            type="submit"
            size="lg"
            disabled={inviteMutation.isPending}
            className="mt-6 w-full"
          >
            {inviteMutation.isPending ? "Generating..." : "Generate Code"}
          </Button>

          <div className="w-full rounded-lg bg-accent p-3">
            <span className="font-semibold text-foreground">Note:</span>
            <ol className="list-disc pl-5 mt-1 space-y-1">
              <li className="text-muted-foreground">
                This code can be used only <strong>once</strong> and will{" "}
                <strong>expire</strong> after the specified time.
              </li>
              <li className="text-destructive">
                Do not share this code with anyone except the intended
                recipient.
              </li>
            </ol>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InviteCodeGenerator;
