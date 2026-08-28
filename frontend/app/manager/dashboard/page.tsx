"use client";
import { handleLogout } from "@/components/admin/AdminDashboard";
import ManagerDashboard from "@/components/manager/ManagerDashboard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  return (
    <>
      <Button
        onClick={() => {
          handleLogout(router);
        }}
      >
        Logout
      </Button>
      <ManagerDashboard />
    </>
  );
};

export default page;
