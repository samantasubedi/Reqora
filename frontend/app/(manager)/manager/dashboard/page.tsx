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
      <Table>

  <TableHeader>

    <TableRow>
      <TableHead>Employee</TableHead>
      <TableHead>Resource</TableHead>
      <TableHead>Quantity</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>

  </TableHeader>

  <TableBody>

    <TableRow>

      <TableCell>John</TableCell>

      <TableCell>Laptop</TableCell>

      <TableCell>2</TableCell>

      <TableCell>2 Jun 2026</TableCell>

      <TableCell>
        <Badge>
          Pending
        </Badge>
      </TableCell>

      <TableCell>

        <div className="flex gap-2">

          <Button size="sm">
            Approve
          </Button>

          <Button
            size="sm"
            variant="destructive"
          >
            Reject
          </Button>

        </div>

      </TableCell>

    </TableRow>

  </TableBody>

</Table>
    </>
  );
};

export default page;
