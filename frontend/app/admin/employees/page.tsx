"use client";
import EmployeeCount from "@/components/employee/EmployeeCount";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const page = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fetchApi = async () => {
    const response = await axios.get(`${backendUrl}/users`);
    return response.data;
  };
  const query = useQuery({
    queryKey: ["companyUsers"],
    queryFn: fetchApi,
  });
  useEffect(() => {
    if (query.isError) {
      if (isAxiosError(query.error)) {
        toast.error("server error");
      } else {
        toast.error(query.error.message);
      }
    }
  }, []);
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage company employees and permissions.
          </p>
        </div>

        <button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
          Invite Employee
        </button>
      </div>

      <EmployeeCount />

      <EmployeeTable />
    </div>
  );
};

export default page;
