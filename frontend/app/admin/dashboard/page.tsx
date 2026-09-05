import { AdminDashboard } from "@/app/admin/components/AdminDashboard";
import SidebarMenu from "@/app/admin/components/Sidebarmenu";
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
