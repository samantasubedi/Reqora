import React, { ReactNode } from "react";
import EmployeeNavbar from "./components/EmployeeNavbar";

const EmployeeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-svh w-full">
      <EmployeeNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default EmployeeLayout;