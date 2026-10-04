"use client";

import { useUser } from "../../hooks/userHooks";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Package, Send, X } from "lucide-react";
import UserDetailsCard from "../../components/UserDetailsCard";
import UserDetailsTabs from "../../components/UserDetailsTabs";
import StatCard, { StatCardTone } from "../../components/StatCard";

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
            <Skeleton className="h-[118px] w-full rounded-xl" />
            <Skeleton className="h-[118px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const user = data.data ?? data;
  const isManager = user.role === "manager";
  const isAdmin = user.role === "admin";
  const statConfig: {
    title: string;
    subtext: string;
    number: number;
    Icon: typeof Package;
    tone: StatCardTone;
  }[] = isAdmin
    ? [
        {
          title: "Added",
          subtext: "Resources added",
          number: user.addedResources?.length ?? 0,
          Icon: Package,
          tone: "info",
        },
        {
          title: "Reviewed",
          subtext: "Requests reviewed",
          number: user.reviewedRequests?.length ?? 0,
          Icon: Check,
          tone: "success",
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
            tone: "success",
          },
          {
            title: "Rejected",
            subtext: "Requests you rejected",
            number: user.reviewedRequests?.filter(
              (r: { status: string }) => r.status === "rejected",
            ).length,
            Icon: X,
            tone: "danger",
          },
        ]
      : [
          {
            title: "Resources",
            subtext: "Assigned resources",
            number: user.resourceItems?.length ?? 0,
            Icon: Package,
            tone: "info",
          },
          {
            title: "Requests",
            subtext: "Requests created",
            number: user.createdRequests?.length ?? 0,
            Icon: Send,
            tone: "warning",
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
              tone={stat.tone}
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
