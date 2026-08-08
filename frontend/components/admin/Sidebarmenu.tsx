"use client";
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

import { useRouter } from "next/navigation";
import LogoutDialog from "./LogoutDialog";

const Sidebarmenu = () => {
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader className="bg-teal-600 text-white">
        <button
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src="/reqoraLogo.png"
            width={500}
            height={500}
            alt="logo"
            className="w-50 h-25"
          ></Image>
        </button>
      </SidebarHeader>
      <SidebarContent className="bg-teal-600 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className=" text-white font-bold">
            Main
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                suppressHydrationWarning
                className="flex justify-start"
              >
                <Button
                  className="bg-transparent text-white font-bold"
                  variant={"secondary"}
                >
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
          <SidebarGroupLabel className=" text-white font-bold">
            Management
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild suppressHydrationWarning>
                  <SidebarMenuButton
                    suppressHydrationWarning
                    className="flex justify-start  text-white font-bold"
                  >
                    <Icon icon="grommet-icons:resources" className="size-5!" />
                    Resources
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/resources");
                    }}
                  >
                    <Icon icon="material-symbols:grid-view-outline-rounded" />{" "}
                    View Resources
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/admin/resources/add");
                    }}
                  >
                    <Icon icon="hugeicons:resources-add" />
                    Add Resources
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild suppressHydrationWarning>
                  <SidebarMenuButton
                    suppressHydrationWarning
                    className=" text-white font-bold"
                  >
                    <Icon icon="ic:baseline-people" className="size-5! " />
                    Employees
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/admin/employees");
                    }}
                  >
                    <Icon icon="material-symbols:view-day-rounded" /> View
                    Employees
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/admin/invite");
                    }}
                  >
                    <Icon icon="mdi:invite" />
                    Invite Employees
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
          <SidebarGroupLabel className=" text-white font-bold">
            System
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                suppressHydrationWarning
                className=" text-white font-bold"
              >
                <Icon icon="material-symbols:settings" className="size-5!" />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                suppressHydrationWarning
                className=" text-white font-bold"
              >
                <Icon icon="tabler:logs" className="size-5!" />
                <span>Logs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className=" bg-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild suppressHydrationWarning>
                <SidebarMenuButton
                  suppressHydrationWarning
                  className="flex gap-2 "
                >
                  <Icon icon="codicon:account" className="size-6" />
                  <span className="font-semibold">Your account</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <LogoutDialog />
                <Button
                  onClick={() => {
                    router.push("/profile");
                  }}
                  variant={"secondary"}
                  className="min-w-full flex gap-2 justify-start cursor-pointer hover:bg-gray-200"
                >
                  <Icon icon="tabler:edit-filled" className="size-6" />
                  <span>My profile</span>{" "}
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Sidebarmenu;
