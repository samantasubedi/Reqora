"use client";
import { ResourceTable } from "@/app/admin/components/ResourceTable";
import ResourceStats from "@/app/admin/components/ResourceStats";
import { useResources } from "@/app/admin/hooks/resourceHooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
export enum ResourceStatus {
  available = "available",
  inUse = "inUse",
  underMaintainence = "underMaintainence",
}
export type resourceType = {
  id: string;
  name: string;
  location: string;
  department: string;
  type: string;
  availability: boolean;
  status: ResourceStatus;
  totalQuantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
};
export type tableResourceType = {
  id: string;
  name: string;
  status: ResourceStatus;
  type: string;
  department: string;
  location: string;
  availability: boolean;
  availabilityPercentage?: number;
};
const Page = () => {
  const router = useRouter();
  const { data, isLoading, isError, error } = useResources();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">
            Manage company resources and track availability.
          </p>
        </div>

        <Button
          onClick={() => router.push("/admin/resources/add")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Resource
        </Button>
      </div>

      <ResourceStats
        countsByStatus={data?.countsByStatus}
        isLoading={isLoading}
      />

      <ResourceTable />
    </div>
  );
};

export default Page;
