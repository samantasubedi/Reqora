"use client";

import { useUser } from "../../hooks/userHooks";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Check,
  Package,
  Pencil,
  Send,
  Trash2,
  X,
} from "lucide-react";
import UserDetailsCard from "../../components/UserDetailsCard";
import EmployeeTabs from "../../components/EmployeeTabs";
import ManagerRequests from "../../components/ManagerRequests";
import StatCard from "../../components/StatCard";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useUser({ id: params.id });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const user = data.data ?? data;
  const isManager = user.role === "manager";
  const statConfig = isManager
    ? [
        {
          title: "Approved",
          number: user.reviewedRequests?.filter(
            (r: { status: string }) => r.status === "approved",
          ).length,
          Icon: Check,
          colors: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-500",
          },
        },
        {
          title: "Rejected",
          number: user.reviewedRequests?.filter(
            (r: { status: string }) => r.status === "rejected",
          ).length,
          Icon: X,
          colors: {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-500",
          },
        },
      ]
    : [
        {
          title: "Resources",
          number: user.resourceItems?.length ?? 0,
          Icon: Package,
          colors: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-500",
          },
        },
        {
          title: "Requests",
          number: user.createdRequests?.length ?? 0,
          Icon: Send,
          colors: {
            bg: "bg-amber-100",
            text: "text-amber-800",
            border: "border-amber-500",
          },
        },
      ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
            <Pencil className="size-4" />
            Change Role
          </Button>
          <Button variant="destructive" size="sm" className="gap-1.5 cursor-pointer">
            <Trash2 className="size-4" />
            Remove User
          </Button>
        </div>
      </div>

      <UserDetailsCard user={user} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {statConfig.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            number={stat.number}
            IconName={stat.Icon}
            bgColor={stat.colors.bg}
            textColor={stat.colors.text}
            borderColor={stat.colors.border}
          />
        ))}
      </div>

      {isManager ? (
        <ManagerRequests requests={user.reviewedRequests ?? []} />
      ) : (
        <EmployeeTabs
          resourceItems={user.resourceItems ?? []}
          requests={user.createdRequests ?? []}
        />
      )}
    </div>
  );
};

export default Page;
