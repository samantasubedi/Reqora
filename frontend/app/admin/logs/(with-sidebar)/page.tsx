"use client";

import { useState } from "react";
import LogsTable from "../../components/LogsTable";
import { useLogs } from "../../hooks/logHooks";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const { data, isLoading } = useLogs({ page: currentPage, pageSize });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
        <p className="text-muted-foreground">
          Recent activity across resources, requests and onboarding.
        </p>
      </div>

      <LogsTable
        logs={data?.data?.logs}
        isLoading={isLoading}
        totalPages={data?.data?.pagination?.totalPages ?? 1}
        currentPage={data?.data?.pagination?.currentPage ?? 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Page;