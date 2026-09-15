"use client";

import { useUser } from "../../hooks/userHooks";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import UserDetailsCard from "../../components/UserDetailsCard";
import EmployeeTabs from "../../components/EmployeeTabs";
import ManagerRequests from "../../components/ManagerRequests";

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

      {user.role === "employee" && <EmployeeTabs />}
      {user.role === "manager" && <ManagerRequests />}
    </div>
  );
};

export default Page;
