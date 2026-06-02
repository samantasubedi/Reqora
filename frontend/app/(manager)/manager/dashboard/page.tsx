"use client";
import { handleLogout } from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  return (
    <>
      <div>this is manager dashboard</div>

      <Button
        onClick={() => {
          handleLogout(router);
        }}
      >
        Logout
      </Button>

    </>
  );
};

export default page;
