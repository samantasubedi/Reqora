import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  FilePlus2,
  PackagePlus,
  ScrollText,
  UserPlus,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logCategory, logEntryType } from "../apis/logApi";
import TableEmpty from "./emptyStates/TableEmpty";

const categoryIcon: Record<
  string,
  { IconName: LucideIcon; color: string; badge: string }
> = {
  resource: {
    IconName: PackagePlus,
    color: "text-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  request: {
    IconName: ClipboardList,
    color: "text-amber-500",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  onboarding: {
    IconName: UserPlus,
    color: "text-green-500",
    badge: "bg-green-100 text-green-700 border-green-200",
  },
};

const actionIcon: Record<string, LucideIcon> = {
  "Resource Added": PackagePlus,
  "Resource Assigned": ClipboardList,
  "Resource Under Maintenance": Wrench,
  "Request Created": FilePlus2,
  "Request Approved": ClipboardList,
  "Request Rejected": ClipboardList,
  "Request Cancelled": ScrollText,
  "Request Forwarded": ScrollText,
  "User Joined": UserPlus,
  "Invitation Sent": UserPlus,
  "Invitation Used": UserPlus,
};

const tabConfig: { value: "all" | logCategory; label: string }[] = [
  { value: "all", label: "All Activity" },
  { value: "resource", label: "Resource Activity" },
  { value: "request", label: "Request History" },
  { value: "onboarding", label: "Onboarding" },
];

const LogsTable = ({
  logs,
  isLoading,
}: {
  logs?: logEntryType[];
  isLoading: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<"all" | logCategory>("all");

  const filteredLogs =
    activeTab === "all" ? logs : logs?.filter((log) => log.category === activeTab);

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | logCategory)}
      >
        <TabsList>
          {tabConfig.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl border bg-card"
            />
          ))}
        </div>
      ) : filteredLogs && filteredLogs.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-1">
              {filteredLogs.map((log) => {
                const ActionIcon = actionIcon[log.action] ?? ScrollText;
                const cat = categoryIcon[log.category];
                return (
                  <li
                    key={log.id}
                    className="flex items-start gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted ${cat.color}`}
                    >
                      <ActionIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">
                          {log.action}
                        </span>
                        <Badge
                          variant="outline"
                          className={`font-medium capitalize ${cat.badge}`}
                        >
                          {log.category}
                        </Badge>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {log.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium">
                        {log.actor ?? "System"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <table className="w-full">
              <tbody>
                <TableEmpty
                  colSpan={1}
                  header="No activity here yet"
                  headerIcon={ScrollText}
                />
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LogsTable;