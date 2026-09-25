"use client";

import RequestStats from "../../components/RequestStats";
import RequestTable from "../../components/RequestTable";
import { useRequests } from "../../hooks/requestHooks";

const Page = () => {
  const { data, isLoading } = useRequests();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
        <p className="text-muted-foreground">
          Monitor and review resource requests.
        </p>
      </div>

      <RequestStats
        requests={data?.data}
        isLoading={isLoading}
      />

      <RequestTable requests={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default Page;