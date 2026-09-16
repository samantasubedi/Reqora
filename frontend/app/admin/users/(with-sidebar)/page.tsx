"use client";

import { UserTable } from "../../components/UserTable";
import UserStats from "../../components/UserStats";
import { useAnalytics } from "../../hooks/companyHooks";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const Page = () => {
  const router=useRouter()
  const { data, isLoading, isSuccess } = useAnalytics();
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage company users and permissions.
          </p>
        </div>

        <Button className="cursor-pointer flex " onClick={()=>router.push("/admin/users/invite")}>
          Invite Users <Plus />
        </Button>
      </div>

      <UserStats
        countsByRole={data?.userStats?.countsByRole}
        isLoading={isLoading}
      />

      <UserTable />
    </div>
  );
};

export default Page;
