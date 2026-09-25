"use client";

import LogsTable from "../../components/LogsTable";
import { useLogs } from "../../hooks/logHooks";

const Page = () => {
  const { data, isLoading } = useLogs();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
        <p className="text-muted-foreground">
          Recent activity across resources, requests and onboarding.
        </p>
      </div>

      <LogsTable logs={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default Page;