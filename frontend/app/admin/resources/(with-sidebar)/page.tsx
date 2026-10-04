"use client";
import { ResourceTable } from "@/app/admin/components/ResourceTable";
import ResourceStats from "@/app/admin/components/ResourceStats";
import PageHeader from "@/app/admin/components/ui/PageHeader";
import { useResources } from "@/app/admin/hooks/resourceHooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
export enum ResourceStatus {
  available = "available",
  inUse = "inUse",
  underMaintenance = "underMaintenance",
}
export type resourceType = {
  id: string;
  name: string;
  location: string;
  department: string | null;
  type: string;
  description?: string | null;
  availability: boolean;
  totalQuantity: number;
  availableQuantity: number;
  inUseQuantity: number;
  underMaintenanceQuantity: number;
  createdAt: string;
  updatedAt: string;
};
export type tableResourceType = {
  id: string;
  name: string;
  type: string;
  department: string | null;
  location: string;
  availability: boolean;
  totalQuantity: number;
  availableQuantity: number;
  inUseQuantity: number;
  underMaintenanceQuantity: number;
};
const Page = () => {
  const router = useRouter();
  const { data, isLoading, isError, error } = useResources();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Resources"
        subtitle="Manage company resources and track availability."
        actions={
          <Button onClick={() => router.push("/admin/resources/add")}>
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        }
      />

      <ResourceStats
        countsByStatus={data?.countsByStatus}
        isLoading={isLoading}
      />

      <ResourceTable />
    </div>
  );
};

export default Page;
