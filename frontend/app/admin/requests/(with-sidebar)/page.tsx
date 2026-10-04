"use client";

import RequestStats from "../../components/RequestStats";
import RequestTable from "../../components/RequestTable";
import PageHeader from "../../components/ui/PageHeader";
import { useRequests } from "../../hooks/requestHooks";

const Page = () => {
  const { data, isLoading, isError, refetch } = useRequests();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Requests"
        subtitle="Monitor and review resource requests."
      />

      <RequestStats
        requests={data?.data}
        isLoading={isLoading}
      />

      <RequestTable
        requests={data?.data}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />
    </div>
  );
};

export default Page;