"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { ResourceTabs } from "@/components/others/ResourceTabs";
import { useRouter } from "next/navigation";

import { useResource } from "../../hooks/resourceHooks";
import ResourceDetailsSkeleton from "../../components/skeletonLoaders/resourceDetailsSkeleton";


const ResourceDetails = () => {
  const router = useRouter();

  let percentage;
  const params = useParams();
  const id = params.id;

  const { isError, error, isSuccess, isLoading, data } = useResource(id);

  useEffect(() => {
    if (isError) {
      if (error.response) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }, [error, isError]);
  let resourceDetail;
  if (isSuccess) {
    resourceDetail = data.resourceDetail;
    percentage =
      (resourceDetail.availableQuantity / resourceDetail.totalQuantity) * 100;
    console.log("this is resourceDetail", resourceDetail);
  }
  if (isLoading) {
    return <ResourceDetailsSkeleton/>
  }
  if (isSuccess) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center justify-between">
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
            <Button variant="outline">
              <Edit className="h-4 w-4" />
              Edit
            </Button>

            <Button variant="destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="rounded-xl border p-4">
                  <Package className="h-8 w-8" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold">{resourceDetail.name}</h1>

                  <p className="text-muted-foreground">{resourceDetail.type}</p>
                </div>
              </div>

              <Badge>{resourceDetail.status}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">Total</p>

                  <h3 className="text-2xl font-bold">
                    {resourceDetail.totalQuantity}
                  </h3>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">Available</p>

                  <h3 className="text-2xl font-bold">
                    {resourceDetail.availableQuantity}
                  </h3>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">In Use</p>

                  <h3 className="text-2xl font-bold">
                    {resourceDetail.inUseQuantity}
                  </h3>
                </CardContent>
              </Card>
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
              </CardContent>
            </Card>

            <ResourceTabs />

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="leading-7 text-muted-foreground">
                  {resourceDetail.description
                    ? resourceDetail.description
                    : "No description available "}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
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

                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-muted-foreground">Available</p>

                      <p className="text-xl font-bold">
                        {resourceDetail.availableQuantity}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-muted-foreground">In Use</p>

                      <p className="text-xl font-bold">
                        {resourceDetail.inUseQuantity}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
};

export default ResourceDetails;
