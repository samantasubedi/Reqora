"use client";

import { UserTable } from "../../components/UserTable";
import UserStats from "../../components/UserStats";
import PageHeader from "../../components/ui/PageHeader";
import { useAnalytics } from "../../hooks/companyHooks";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const Page = () => {
  const router=useRouter()
  const { data, isLoading, isSuccess } = useAnalytics();
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Users"
        subtitle="Manage company users and permissions."
        actions={
          <Button onClick={() => router.push("/admin/users/invite")}>
            Invite Users <Plus className="h-4 w-4" />
          </Button>
        }
      />

      <UserStats
        countsByRole={data?.userStats?.countsByRole}
        isLoading={isLoading}
      />

      <UserTable />
    </div>
  );
};

export default Page;
