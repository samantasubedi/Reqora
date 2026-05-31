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
import { RecentRequests } from "./RecentRequests";

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
    
      </div>
      <div className="flex  gap-5">
        <RecentRequests />
        <ActiveGear />
      </div>
    </div>
  );
}
