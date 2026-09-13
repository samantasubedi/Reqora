"use client";

import { UserTable } from "../components/UserTable";
import UserStats from "../components/UserStats";
import { useAnalytics } from "../hooks/companyHooks";

const Page = () => {
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

        <button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
          Invite Users
        </button>
      </div>

      <UserStats
        countsByRole={data?.userStats.countsByRole}
        isLoading={isLoading}
      />

      <UserTable />
    </div>
  );
};

export default Page;
