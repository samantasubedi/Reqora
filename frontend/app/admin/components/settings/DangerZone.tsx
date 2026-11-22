"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AlertTriangle, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TableError } from "../TableError";
import { useCompany, useLeaveCompany } from "../../hooks/companyHooks";
import type { T_MutationError } from "@/types/global";

const DangerZone = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useCompany();
  const leaveCompany = useLeaveCompany();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (isLoading) {
    return <div className="h-52 animate-pulse rounded-xl border bg-card" />;
  }

  if (isError || !data?.data) {
    return (
      <TableError
        title="Unable to load workspace details"
        message="We couldn't load your workspace. Check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  const companyName = data.data.companyName;
  const canLeave = confirmText.trim() === companyName;

  const handleLeave = () => {
    leaveCompany.mutate(undefined, {
      onSuccess: (response) => {
        toast.success(response.message);
        router.push("/getstarted");
      },
      onError: (error: T_MutationError) =>
        toast.error(error.response?.data?.message ?? error.message),
    });
  };

  return (
    <Card className="max-w-4xl border-destructive/30 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-destructive/10 p-2 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>
              Irreversible actions that affect your workspace access.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-foreground">Leave workspace</p>
            <p className="text-sm text-muted-foreground">
              You will lose access to this company, its resources, and its
              requests. You cannot leave if you are the only admin.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            className="gap-2 sm:shrink-0"
            onClick={() => {
              setConfirmText("");
              setDialogOpen(true);
            }}
          >
            <LogOut className="size-4" />
            Leave workspace
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave {companyName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes your access to the workspace. Type{" "}
              <span className="font-semibold text-foreground">
                {companyName}
              </span>{" "}
              to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder={companyName}
            autoFocus
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!canLeave || leaveCompany.isPending}
              onClick={handleLeave}
            >
              {leaveCompany.isPending ? "Leaving..." : "Leave workspace"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default DangerZone;
