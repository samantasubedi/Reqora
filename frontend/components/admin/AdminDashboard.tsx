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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import LogoutDialog from "./LogoutDialog";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { TableSkeleton } from "./TableSkeleton";
import { TableError } from "./TableError";
import TableEmpty from "./TableEmpty";
export interface statCardInterface {
  title: string;
  number: number;
  IconName?: LucideIcon;
  subtext?: string;
  bgColor: string;
  textColor: string;
}

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
type resourceType = {
  id: string;
  name: string;
  location: string;
  department: string;
  type: string;
  availability: string;
  status: string;
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
  let resourceData;
  if (query.data) {
    resourceData = query.data.allResources.map((curr: resourceType) => ({
      id: curr.id,
      name: curr.name,
      type: curr.type,
      status: curr.status,
      department: curr.department,
      location: curr.location,
      availability: (curr.availableQuantity / curr.totalQuantity) * 100,
    }));
  }

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
      number: 50,
      IconName: Package,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      title: "Available",
      number: 39,
      IconName: Check,
      subtext: "70% of total",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      title: "In Use",
      number: 20,
      IconName: TrendingUp,
      subtext: "40% of total",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
    },
    {
      title: "Under Maintenance",
      number: 5,
      IconName: CircleAlert,
      subtext: "10% of total",
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
          {AdminStat.map((curr) => {
            return (
              <StatCard
                key={curr.title}
                title={curr.title}
                number={curr.number}
                IconName={curr.IconName}
                subtext={curr.subtext}
                bgColor={curr.bgColor}
                textColor={curr.textColor}
              ></StatCard>
            );
          })}
        </div>
        {query.isLoading ? (
          <TableSkeleton />
        ) : query.isError ? (
          <TableError
            onRetry={() => {
              query.refetch();
            }}
          />
        ) : resourceData.length ? (
          <ResourceTable resourceData={resourceData} />
        ) : (
          <TableEmpty />
        )}
      </div>
    </>
  );
};
