"use client";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

type RejectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  resourceName: string;
  onConfirm: (reason: string) => void;
};

const RejectDialog = ({
  open,
  onOpenChange,
  employeeName,
  resourceName,
  onConfirm,
}: RejectDialogProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason("");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject this request?</AlertDialogTitle>
          <AlertDialogDescription>
            {employeeName} requested{" "}
            <span className="font-semibold text-foreground">{resourceName}</span>.
            Add an optional reason so they understand why it was declined.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <label
            htmlFor="reject-reason"
            className="text-sm font-medium text-foreground"
          >
            Reason <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Stock unavailable, please retry next week"
            rows={3}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
          >
            Reject request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectDialog;