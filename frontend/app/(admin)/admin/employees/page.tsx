import EmployeeCount from "@/components/employee/EmployeeCount";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import React from "react";

const page = () => {
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
