"use client";

import { useState } from "react";
import LogsTable from "../../components/LogsTable";
import PageHeader from "../../components/ui/PageHeader";
import { useLogs } from "../../hooks/logHooks";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const { data, isLoading, isError, refetch } = useLogs({
    page: currentPage,
    pageSize,
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Logs"
        subtitle="Recent activity across resources, requests and onboarding."
      />

      <LogsTable
        logs={data?.data?.logs}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        totalPages={data?.data?.pagination?.totalPages ?? 1}
        currentPage={data?.data?.pagination?.currentPage ?? 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Page;