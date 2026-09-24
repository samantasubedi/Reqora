"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { EllipsisVertical, Shield, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import RoleSelector from "./RoleSelector";
import SelectBox from "@/components/others/SelectBox";
import { useDepartments } from "../hooks/companyHooks";
import { useDeleteUser, useUpdateUserByAdmin } from "../hooks/userHooks";
import type { userType } from "./UserTable";
import type { T_MutationError } from "@/types/global";

type PendingAction =
  | { type: "role"; title: string; description: string }
  | { type: "department"; title: string; description: string }
  | { type: "delete"; title: string; description: string };

const UserActionsMenu = ({ user }: { user: userType }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [dialog, setDialog] = useState<"role" | "department" | null>(null);
  const [confirmAction, setConfirmAction] = useState<PendingAction | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const { data: departmentsData, isLoading: departmentsLoading } =
    useDepartments();
  const departmentOptions =
    departmentsData?.departments?.map((dept) => ({
      label: dept.name,
      value: dept.id,
    })) ?? [];

  const openRoleDialog = () => {
    setSelectedRole(user.role ?? "");
    setDialog("role");
  };

  const openDepartmentDialog = () => {
    setSelectedDepartmentId(user.department?.id ?? "");
    setDialog("department");
  };

  const invalidateUserData = () => {
    queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    queryClient.invalidateQueries({ queryKey: ["userData"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const updateMutation = useUpdateUserByAdmin({
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
        invalidateUserData();
        setConfirmAction(null);
      }
    },
    onError: (error: T_MutationError) => {
      toast.error(error.response?.data?.message ?? error.message);
    },
  });

  const deleteMutation = useDeleteUser({
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
        invalidateUserData();
        router.back();
      }
    },
    onError: (error: T_MutationError) => {
      toast.error(error.response?.data?.message ?? error.message);
    },
  });

  const requestRoleChange = () => {
    if (!selectedRole || selectedRole === user.role) {
      setDialog(null);
      return;
    }
    const heldItems = user.resourceItems?.length ?? 0;
    const promotingToAdmin =
      selectedRole === "admin" && user.role !== "admin";
    setDialog(null);
    setConfirmAction({
      type: "role",
      title: "Change user role?",
      description:
        promotingToAdmin && heldItems > 0
          ? `${user.username}'s role will change from "${user.role ?? "N/A"}" to "admin". This will release all ${heldItems} currently-held resource item(s) back to the company.`
          : `${user.username}'s role will change from "${user.role ?? "N/A"}" to "${selectedRole}".`,
    });
  };

  const requestDepartmentChange = () => {
    if (!selectedDepartmentId || selectedDepartmentId === user.department?.id) {
      setDialog(null);
      return;
    }
    const newDepartment =
      departmentOptions.find((d) => d.value === selectedDepartmentId)?.label ??
      selectedDepartmentId;
    setDialog(null);
    setConfirmAction({
      type: "department",
      title: "Change user department?",
      description: `${user.username} will be moved from "${user.department?.name ?? "N/A"}" to "${newDepartment}".`,
    });
  };

  const requestDelete = () => {
    setConfirmAction({
      type: "delete",
      title: "Remove this user?",
      description: `${user.username} will be permanently removed along with their requests and resource assignments. This action cannot be undone.`,
    });
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "role") {
      updateMutation.mutate({ id: user.id, role: selectedRole });
    } else if (confirmAction.type === "department") {
      updateMutation.mutate({ id: user.id, departmentId: selectedDepartmentId });
    } else {
      deleteMutation.mutate({ id: user.id });
    }
  };

  const isConfirming =
    updateMutation.isPending || deleteMutation.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 cursor-pointer rounded-full hover:bg-muted/60"
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 p-1.5">
          <DropdownMenuLabel className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            User Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="mb-1" />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={openRoleDialog}
          >
            <Shield className="text-amber-500" />
            Change Role
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={openDepartmentDialog}
          >
            <Users className="text-blue-500" />
            Change Department
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={requestDelete}
          >
            <Trash2 className="text-red-500" />
            Remove User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={dialog === "role"}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Select the new role for{" "}
              <span className="font-medium text-foreground">
                {user.username}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <RoleSelector value={selectedRole} onChange={setSelectedRole} />
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setDialog(null)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={requestRoleChange}
              disabled={!selectedRole || selectedRole === user.role}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog === "department"}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Department</DialogTitle>
            <DialogDescription>
              Move{" "}
              <span className="font-medium text-foreground">
                {user.username}
              </span>{" "}
              to a different department.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Department
            </label>
            {departmentsLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading departments...
              </p>
            ) : (
              <SelectBox
                label="department"
                options={departmentOptions}
                value={selectedDepartmentId}
                onChange={setSelectedDepartmentId}
                className="h-11 rounded-lg border-border bg-background"
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setDialog(null)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={requestDepartmentChange}
              disabled={
                !selectedDepartmentId ||
                selectedDepartmentId === user.department?.id
              }
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open && !isConfirming) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              disabled={isConfirming}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant={confirmAction?.type === "delete" ? "destructive" : "default"}
              className="cursor-pointer"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming
                ? "Processing..."
                : confirmAction?.type === "delete"
                  ? "Remove User"
                  : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActionsMenu;