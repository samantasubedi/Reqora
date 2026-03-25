import AdminDashboard from "@/components/admin/AdminDashboard";
import SidebarMenu from "@/components/admin/SidebarMenu";

export default function AdminDashboardPage() {
  return (
    <div className="flex">
      <SidebarMenu />
      <div className="w-full">
        <AdminDashboard />
      </div>
    </div>
  );
}
