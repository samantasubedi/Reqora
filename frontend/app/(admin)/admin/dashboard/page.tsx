import { AdminDashboard } from "@/components/admin/AdminDashboard";
import SidebarMenu from "@/components/admin/Sidebarmenu";

export default function AdminDashboardPage() {
  return (
    <div className="flex w-screen">
      <SidebarMenu />
      <div className="w-full">
        <AdminDashboard />
      </div>
    </div>
  );
}
