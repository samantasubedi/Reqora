import React from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import InviteForm from "./InviteForm";

const Sidebarmenu = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Image
          src="/ReqoraLogo.png"
          height={1000}
          width={1000}
          alt="company logo"
          className="h-25 w-40"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="flex justify-start">
                <Button className="bg-transparent" variant={"secondary"}>
                  <Icon
                    icon="material-symbols-light:home-rounded"
                    className="size-6!"
                  />
                  Dashboard
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="flex justify-start">
                    <Icon icon="grommet-icons:resources" className="size-5!" />
                    Resources
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Icon icon="material-symbols:grid-view-outline-rounded" />{" "}
                    View Resources
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <Icon icon="hugeicons:resources-add" />
                    Add Resources
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <Icon icon="hugeicons:resources-remove" />
                    Remove Resources
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Icon icon="ic:baseline-people" className="size-5!" />
                    Employees
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Icon icon="material-symbols:view-day-rounded" /> View
                    Employees
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild >
                    <InviteForm />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon icon="carbon:user-role" /> Manage Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon icon="mingcute:user-remove-fill" />
                    Remove Employees
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Icon icon="material-symbols:settings" className="size-5!" />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Icon icon="tabler:logs" className="size-5!" />
                <span>Logs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>Your account</SidebarMenuItem>\
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Sidebarmenu;
