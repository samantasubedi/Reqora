"use client";
import { Check, CircleAlert, LucideIcon, Plus, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import { Book, Package } from "lucide-react";
import { Button } from "../ui/button";
import { ResourceTable } from "./ResourceTable";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { TableSkeleton } from "./TableSkeleton";
import { TableError } from "./TableError";
import TableEmpty from "./TableEmpty";
import { ChartPieLabel } from "../others/PieChart";
import { ChartBarLabel } from "../others/BarChart";
enum ResourceStatus {
  available,
  inUse,
  underMaintainence,
}
export interface statCardInterface {
  title: string;
  statusKey: "all" | "available" | "inUse" | "underMaintainence";
  number: number;
  IconName?: LucideIcon;
  subtext?: string;
  bgColor: string;
  textColor: string;
}
type resourceType = {
  id: string;
  name: string;
  location: string;
  department: string;
  type: string;
  availability: string;
  status: ResourceStatus;
  totalQuantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
};
export type tableResourceType = {
  id: string;
  name: string;
  status: string;
  type: string;
  department: string;
  location: string;
  availability: number;
};

export const handleLogout = async (router: AppRouterInstance) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const logoutResponse = await axios.post(`${backendUrl}/logout`, null, {
      withCredentials: true,
    });
    if (
      logoutResponse.data.success === true &&
      logoutResponse.data.code === "LOGOUT_SUCCESSFULL"
    ) {
      toast.success(logoutResponse.data.message);
      router.push("/");
    }
    console.log(logoutResponse.data);
  } catch (err) {
    console.log("request failed", err);
  }
};

export const AdminDashboard = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fetchApi = async () => {
    const response = await axios.get(`${backendUrl}/resources`, {
      withCredentials: true,
    });
    return response.data;
  };
  const query = useQuery({
    queryFn: fetchApi,
    queryKey: ["resourceData"],
  });

  useEffect(() => {
    if (query.isError) {
      if (isAxiosError(query.error)) {
        toast.error(query.error.response?.data.message);
      } else {
        toast.error(query.error.message);
      }
    }
  }, [query.isError]);

  const AdminStat: statCardInterface[] = [
    {
      title: "Total Resources",
      statusKey: "all",
      number: 0,
      IconName: Package,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      title: "Available",
      statusKey: "available",
      number: 0,
      IconName: Check,
      subtext: ``,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      title: "In Use",
      statusKey: "inUse",
      number: 0,
      IconName: TrendingUp,
      subtext: ``,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
    },
    {
      title: "Under Maintenance",
      statusKey: "underMaintainence",
      number: 0,
      IconName: CircleAlert,
      subtext: ``,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
    },
  ];

  return (
    <>
      <div className="w-full  min-h-screen">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold text-teal-900 m-2">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex justify-between px-3">
          <p className="text-green-800 font-semibold m-2">
            Monitor and manage all organization resource
          </p>
        </div>
        <div className="flex justify-between m-3">
          {query.isSuccess &&
            AdminStat.map((curr, index) => {
              const currentStatus = query.data.counts.find((i: any) => {
                return i.status === curr.statusKey;
              });
              const allCount = query.data.counts.find((i: any) => {
                return i.status === "all";
              })?._count;

              const subText = `${(currentStatus?._count / allCount) * 100}% of total`;

              return (
                <StatCard
                  key={index}
                  statusKey={curr.statusKey}
                  title={curr.title}
                  number={currentStatus._count}
                  IconName={curr.IconName}
                  subtext={subText}
                  bgColor={curr.bgColor}
                  textColor={curr.textColor}
                ></StatCard>
              );
            })}
        </div>
        <div className="flex justify-evenly items-center">
          {query.isSuccess && (
            <div className="w-[40%]">
              <ChartPieLabel
                data={query.data.counts
                  .filter((curr: any) => {
                    return curr.status != "all";
                  })
                  .map((i: any) => {
                    return {
                      status: i.status,
                      Resources: i._count,
                      fill:
                        i.status == "available"
                          ? "var(--color-Available)"
                          : i.status == "inUse"
                            ? "var(--color-InUse)"
                            : "var(--color-UnderMaintenance)",
                    };
                  })}
              />
            </div>
          )}
          <div className="w-[40%]">
            <ChartBarLabel />
          </div>
        </div>

        {query.isLoading ? (
          <TableSkeleton />
        ) : query.isError ? (
          <TableError
            onRetry={() => {
              query.refetch();
            }}
          />
        ) : query.data.allResources.length ? (
          <ResourceTable resourceData={query.data.allResources} />
        ) : (
          <TableEmpty />
        )}
      </div>
    </>
  );
};
