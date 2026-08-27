import { AdminDashboard } from "@/components/admin/AdminDashboard";
import SidebarMenu from "@/components/admin/Sidebarmenu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";

export default function AdminDashboardPage() {
  return (
    <div className="flex max-w-screen">
      <SidebarMenu />
       <SidebarTrigger>
                <Icon icon="charm:menu-hamburger"></Icon>
              </SidebarTrigger>
      <div className="w-screen">
        <AdminDashboard />
      </div>
    </div>
  );
}
