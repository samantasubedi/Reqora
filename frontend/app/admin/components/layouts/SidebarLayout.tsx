import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import Sidebarmenu from "../Sidebarmenu";

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-svh w-full">
      <Sidebarmenu />
      <SidebarTrigger className="sticky top-3" />
      <SidebarInset>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </div>
  );
};

export default SidebarLayout;
