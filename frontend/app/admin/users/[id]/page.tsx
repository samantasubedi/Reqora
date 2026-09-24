"use client";

import { useUser } from "../../hooks/userHooks";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Package, Send, X } from "lucide-react";
import UserDetailsCard from "../../components/UserDetailsCard";
import UserDetailsTabs from "../../components/UserDetailsTabs";
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
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
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[180px] w-full rounded-xl" />
            <Skeleton className="h-[180px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const user = data.data ?? data;
  const isManager = user.role === "manager";
  const isAdmin = user.role === "admin";
  const statConfig = isAdmin
    ? [
        {
          title: "Added",
          subtext: "Resources added",
          number: user.addedResources?.length ?? 0,
          Icon: Package,
          colors: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-500",
          },
        },
        {
          title: "Reviewed",
          subtext: "Requests reviewed",
          number: user.reviewedRequests?.length ?? 0,
          Icon: Check,
          colors: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-500",
          },
        },
      ]
    : isManager
      ? [
          {
            title: "Approved",
            subtext: "Requests you approved",
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
            subtext: "Requests you rejected",
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
            subtext: "Assigned resources",
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
            subtext: "Requests created",
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
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
        <UserDetailsCard user={user} />

        <div className="flex flex-col gap-4">
          {statConfig.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              subtext={stat.subtext}
              number={stat.number}
              IconName={stat.Icon}
              bgColor={stat.colors.bg}
              textColor={stat.colors.text}
              borderColor={stat.colors.border}
            />
          ))}
        </div>
      </div>

      <UserDetailsTabs
        role={user.role ?? null}
        resourceItems={user.resourceItems ?? []}
        createdRequests={user.createdRequests ?? []}
        reviewedRequests={user.reviewedRequests ?? []}
        addedResources={user.addedResources ?? []}
      />
    </div>
  );
};

export default Page;
