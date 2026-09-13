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
type ResourceDetail = {
  id: string;
  name: string;
  location: string;
  department: string;
  type: string;
  availability: boolean;
  status: string;
  totalQuantity: number;
  inUseQuantity: number;
  underMaintenanceQuantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  description?: string;
};
const ResourceDetails = () => {
  const router = useRouter();

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
  if (isLoading) {
    return <ResourceDetailsSkeleton />;
  }

  if (!isSuccess) {
    return null;
  }

  const resourceDetail: ResourceDetail = data.resourceDetail;
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
      label: "Under Maintainence",
      value: resourceDetail?.underMaintenanceQuantity,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
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

          <div className="grid grid-cols-4 gap-4">
            {cardData.map((curr: { label: string; value: number }) => {
              return (
                <Card key={curr.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground text-sm">
                      {curr.label}
                    </p>

                    <h3 className="text-2xl font-bold">{curr.value}</h3>
                  </CardContent>
                </Card>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
