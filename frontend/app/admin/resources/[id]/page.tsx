"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  MapPin,
  Package,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "../../components/ui/StatusBadge";
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

import { Progress } from "@/components/ui/progress";
import {
  ResourceTabs,
} from "@/components/others/ResourceTabs";
import { useRouter } from "next/navigation";

import { useResource, useDeleteResource } from "../../hooks/resourceHooks";
import ResourceDetailsSkeleton from "../../components/skeletonLoaders/resourceDetailsSkeleton";
import { resourceDetailType } from "../../apis/resourceApi";

const ResourceDetails = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const params = useParams();
  const id = params.id;

  const { isSuccess, isLoading, data } = useResource(id);

  const deleteMutation = useDeleteResource({
    onSuccess: (res) => {
      toast.success(res.message || "Resource deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["resourceData"] });
      router.replace("/admin/resources");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message);
    },
  });
  if (isLoading) {
    return <ResourceDetailsSkeleton />;
  }

  if (!isSuccess) {
    return null;
  }

  const resourceDetail: resourceDetailType = data.resourceDetail;
  const requests = resourceDetail.requests;
  const percentage =
    (resourceDetail.availableQuantity / resourceDetail.totalQuantity) * 100;
  const cardData = [
    {
      label: "Total",
      value: resourceDetail?.totalQuantity,
    },
    {
      label: "Available",
      value: resourceDetail?.availableQuantity,
    },
    {
      label: "In Use",
      value: resourceDetail?.inUseQuantity,
    },
    {
      label: "Under Maintenance",
      value: resourceDetail?.underMaintenanceQuantity,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between sticky top-3 ">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/resources/edit/${id}`)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resource?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold text-foreground">
                {resourceDetail.name}
              </span>{" "}
              and all its items will be permanently removed. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                deleteMutation.mutate(id);
              }}
            >
              Delete resource
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border p-4">
                <Package className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {resourceDetail.name}
                </h1>

                <p className="text-sm text-muted-foreground">
                  {resourceDetail.type}
                </p>
              </div>
            </div>

            <StatusBadge
              status={resourceDetail.availability ? "available" : "rejected"}
            >
              {resourceDetail.availability ? "Available" : "Not Available"}
            </StatusBadge>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cardData.map((curr: { label: string; value: number }) => {
              return (
                <div
                  key={curr.label}
                  className="rounded-lg border bg-muted/40 p-4 text-center"
                >
                  <p className="text-sm text-muted-foreground">{curr.label}</p>

                  <p className="text-2xl font-bold">{curr.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resource Information</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-3">
                <Package className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Resource ID</p>
                  <p>{resourceDetail.id}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Building2 className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p>{resourceDetail.department}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{resourceDetail.location}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p>{resourceDetail.createdAt}</p>
                </div>
              </div>

              {resourceDetail.description && (
                <div className="flex gap-3 md:col-span-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="whitespace-pre-line">
                      {resourceDetail.description}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <ResourceTabs
            resourceItems={resourceDetail.resourceItems}
            requests={requests}
          />
        </div>
        <div className="space-y-6 ">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Available</span>
                  <span>
                    {resourceDetail.availableQuantity}/
                    {resourceDetail.totalQuantity}
                  </span>
                </div>

                <Progress value={percentage} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
