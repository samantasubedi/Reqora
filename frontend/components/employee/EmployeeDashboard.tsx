"use client";
import React from "react";
import {
  Plus,
  Package,
  Clock,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleLogout } from "../admin/AdminDashboard";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { ActiveGear } from "./ActiveGear";

export default function EmployeeDashboard() {
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const handleLeave = async () => {
    try {
      const response = await axios.post(`${backendUrl}/leave`, null, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (err: any) {
      console.log(err);
      if (err.response.data) {
        const { message, code, success } = err.response.data;
        if (!success) {
          toast.error(message);
        }
      }
    }
  };
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your assigned resources and track request progress.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="bg-red-700 hover:bg-red-600"
            onClick={() => handleLogout(router)}
          >
            Logout
          </Button>

          <Button
            onClick={() => {
              handleLeave();
            }}
          >
            Leave this Company
          </Button>
          <Button className="text-white! text-bold! bg-purple-900 hover:bg-purple-700 duration-300 transition-all cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:bg-purple-100 bg-purple-50 hover:translate-1 cursor-pointer transition-all duration-400 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">My Resources</CardTitle>
            <Package className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">04</div>
            <p className="text-sm text-muted-foreground">
              Items currently assigned
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-orange-100 bg-orange-50 hover:translate-1 cursor-pointer transition-all duration-400 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="h-8 w-8 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">02</div>
            <p className="text-sm text-muted-foreground">
              Awaiting manager review
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-green-100 bg-green-50 hover:translate-1 cursor-pointer transition-all duration-400 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Approved Requests
            </CardTitle>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">
              Total successful fulfillments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Recent Requests</CardTitle>
                <CardDescription>
                  You have made 3 requests this month.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8 w-50" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">MacBook Pro 14"</TableCell>
                  <TableCell>Oct 12, 2023</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-600">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-blue-500 bg-zinc-100 hover:bg-zinc-200 cursor-pointer transition-all duration-300 ease-in-out"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Noise Cancelling Headphones
                  </TableCell>
                  <TableCell>Oct 15, 2023</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700"
                    >
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-blue-500 bg-zinc-100 hover:bg-zinc-200 cursor-pointer transition-all duration-300 ease-in-out"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-end w-full mt-10">
              <Button className="cursor-pointer text-blue-600 bg-blue-100 hover:bg-blue-200 transition-all duration-300 ease-in-out font-bold">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

      <ActiveGear/>
      </div>
    </div>
  )
}
