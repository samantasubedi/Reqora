import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import Sidebarmenu from "./components/Sidebarmenu";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-svh w-full">
      <Sidebarmenu />
      <SidebarTrigger />
      <SidebarInset>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </div>
  );
};

export default AdminLayout;
