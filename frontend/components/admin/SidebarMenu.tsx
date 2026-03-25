import React from "react";
import {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

const SidebarMenu = () => {
  return (
    <Sidebar>
      <SidebarHeader>Reqora</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>Resources</SidebarGroup>
        <SidebarGroup>Settings</SidebarGroup>
        <SidebarGroup>Employees</SidebarGroup>
      </SidebarContent>
      <SidebarFooter>Your account</SidebarFooter>
    </Sidebar>
  );
};

export default SidebarMenu;
