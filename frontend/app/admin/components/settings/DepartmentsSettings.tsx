"use client";
import { useState, type FormEvent } from "react";
import {
  Boxes,
  Building2,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useAddDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
} from "../../hooks/companyHooks";
import type { Department } from "../../apis/companyApi";
import type { T_MutationError } from "@/types/global";

const getErrorMessage = (error: T_MutationError) =>
  error.response?.data?.message ?? error.message;

const DepartmentsSettings = () => {
  const { data, isLoading, isError, refetch } = useDepartments();
  const addDepartment = useAddDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [name, setName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setDialogOpen(true);
  };

  const openRename = (department: Department) => {
    setEditing(department);
    setName(department.name);
    setDialogOpen(true);
  };

  const isSaving = addDepartment.isPending || updateDepartment.isPending;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      toast.error("Department name must be at least 3 characters");
      return;
    }

    if (editing) {
      updateDepartment.mutate(
        { id: editing.id, name: trimmedName },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            setDialogOpen(false);
          },
          onError: (error) => toast.error(getErrorMessage(error)),
        },
      );
      return;
    }

    addDepartment.mutate(trimmedName, {
      onSuccess: (response) => {
        toast.success(response.message);
        setDialogOpen(false);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteDepartment.mutate(deleteTarget.id, {
      onSuccess: (response) => {
        toast.success(response.message);
        setDeleteTarget(null);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-xl border bg-card" />;
  }

  if (isError || !data) {
    return (
      <TableError
        title="Unable to load departments"
        message="We couldn't load your departments. Check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  const departments = data.departments;
  const isOnlyDepartment = departments.length <= 1;
  const deleteBlocked =
    !!deleteTarget &&
    (isOnlyDepartment ||
      deleteTarget._count.users > 0 ||
      deleteTarget._count.resources > 0);

  const deleteDescription = (() => {
    if (!deleteTarget) return "";
    if (isOnlyDepartment) {
      return "You cannot delete the only department in your company. Add another department first.";
    }
    const { users, resources } = deleteTarget._count;
    if (users > 0 || resources > 0) {
      return `This department still has ${users} user(s) and ${resources} resource(s). Move them to another department before deleting it.`;
    }
    return "This action cannot be undone. Unused invite codes for this department will also be removed.";
  })();

  return (
    <Card className="max-w-4xl shadow-sm">
      <CardHeader>
        <CardTitle>Departments</CardTitle>
        <CardDescription>
          Organize users and resources into teams.
        </CardDescription>
        <CardAction>
          <Button type="button" onClick={openAdd} className="gap-2">
            <Plus className="size-4" />
            Add department
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {departments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
            <div className="rounded-full bg-muted p-3">
              <Building2 className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No departments yet</p>
              <p className="text-sm text-muted-foreground">
                Add a department to start organizing your team.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={openAdd}>
              Add department
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {departments.map((department) => (
              <div
                key={department.id}
                className="rounded-xl border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Building2 className="size-4" />
                    </div>
                    <p className="truncate font-medium text-foreground">
                      {department.name}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Rename ${department.name}`}
                      onClick={() => openRename(department)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${department.name}`}
                      onClick={() => setDeleteTarget(department)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1.5">
                    <Users className="size-3" />
                    {department._count.users}{" "}
                    {department._count.users === 1 ? "user" : "users"}
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5">
                    <Boxes className="size-3" />
                    {department._count.resources}{" "}
                    {department._count.resources === 1
                      ? "resource"
                      : "resources"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Rename department" : "Add department"}
              </DialogTitle>
              <DialogDescription>
                {editing
                  ? "Update the department name. Users and resources stay assigned to it."
                  : "Create a new department for your users and resources."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2 py-4">
              <label className="text-sm font-medium" htmlFor="departmentName">
                Department name
              </label>
              <Input
                id="departmentName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Engineering"
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Add department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{deleteTarget?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteBlocked || deleteDepartment.isPending}
              onClick={handleDelete}
            >
              {deleteDepartment.isPending
                ? "Deleting..."
                : "Delete department"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default DepartmentsSettings;
