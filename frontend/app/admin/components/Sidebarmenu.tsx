"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation";
import LogoutDialog from "./LogoutDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Sidebarmenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();
  const isActive = (path: string) => pathname === path;
  const isResourcesSection = pathname.startsWith("/admin/resources");
  const isUsersSection = pathname.startsWith("/admin/users");
  const [openResources, setOpenResources] = useState(isResourcesSection);
  const [openUsers, setOpenUsers] = useState(isUsersSection);
  useEffect(() => {
    setOpenResources(pathname.startsWith("/admin/resources"));
    setOpenUsers(pathname.startsWith("/admin/users"));
  }, [pathname]);
  const handleSidebarNavigation = (pathName: string) => {
    if (pathName == "none") {
      setOpen(true);
    } else {
      router.push(pathName);
      setOpen(true);
    }
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-sidebar">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer"
        >
          {state == "expanded" ? (
            <Image
              src="/reqoraLogo.png"
              width={500}
              height={500}
              alt="logo"
              className="w-50 h-25"
            ></Image>
          ) : (
            ""
          )}
        </button>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar text-text-primary">
        <SidebarGroup>
          <SidebarGroupLabel className=" font-bold">Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Dashboard"
                isActive={isActive("/admin/dashboard")}
                suppressHydrationWarning
                className="flex justify-start font-bold"
                onClick={() => handleSidebarNavigation("/admin/dashboard")}
              >
                <Icon
                  icon="material-symbols-light:home-rounded"
                  className="size-6!"
                />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="  font-bold">
            Management
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Collapsible open={openResources} onOpenChange={setOpenResources}>
                <CollapsibleTrigger asChild className="w-full">
                  <SidebarMenuButton
                    tooltip="Resources"
                    suppressHydrationWarning
                    isActive={!openResources && isResourcesSection}
                    className="flex justify-between font-bold w-full"
                    onClick={() => handleSidebarNavigation("none")}
                  >
                    <div className="flex justify-start gap-2 ">
                      <Icon
                        icon="grommet-icons:resources"
                        className="size-5!"
                      />
                      <span>Resources</span>
                    </div>
                    <div className="flex justify-end">
                      <Icon icon="akar-icons:chevron-down"></Icon>
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => {
                          handleSidebarNavigation("/admin/resources");
                        }}
                        isActive={isActive("/admin/resources")}
                      >
                        <Icon icon="material-symbols:grid-view-outline-rounded" />
                        View Resources
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => {
                          handleSidebarNavigation("/admin/resources/add");
                        }}
                        isActive={isActive("/admin/resources/add")}
                      >
                        <Icon icon="hugeicons:resources-add" />
                        Add Resources
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Collapsible open={openUsers} onOpenChange={setOpenUsers}>
                <CollapsibleTrigger asChild className="w-full">
                  <SidebarMenuButton
                    tooltip="Users"
                    suppressHydrationWarning
                    isActive={!openUsers && isUsersSection}
                    className="flex justify-between font-bold w-full"
                    onClick={() => handleSidebarNavigation("none")}
                  >
                    <div className="flex justify-start gap-2 ">
                      <Icon icon="ic:baseline-people" className="size-5! " />
                      <span>Users</span>
                    </div>
                    <div className="flex justify-end">
                      <Icon icon="akar-icons:chevron-down"></Icon>
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => {
                          handleSidebarNavigation("/admin/users");
                        }}
                        isActive={isActive("/admin/users")}
                      >
                        <Icon icon="material-symbols:view-day-rounded" />
                        View Users
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => {
                          handleSidebarNavigation("/admin/users/invite");
                        }}
                        isActive={isActive("/admin/users/invite")}
                      >
                        <Icon icon="mdi:invite" />
                        Invite Users
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Requests"
                isActive={isActive("/admin/requests")}
                suppressHydrationWarning
                className="flex justify-start font-bold"
                onClick={() => handleSidebarNavigation("/admin/requests")}
              >
                <Icon icon="fluent:clipboard-task-list-ltr-24-filled" className="size-5!" />
                Requests
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="  font-bold">System</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Settings"
                suppressHydrationWarning
                className="cursor-pointer font-bold"
              >
                <Icon icon="material-symbols:settings" className="size-5!" />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Logs"
                isActive={isActive("/admin/logs")}
                suppressHydrationWarning
                className="cursor-pointer font-bold"
                onClick={() => handleSidebarNavigation("/admin/logs")}
              >
                <Icon icon="tabler:logs" className="size-5!" />
                <span>Logs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className=" bg-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild suppressHydrationWarning>
                <SidebarMenuButton
                  tooltip="Account"
                  suppressHydrationWarning
                  className="flex cursor-pointer gap-2"
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
                  className="min-w-full flex gap-2 justify-start cursor-pointer"
                >
                  <Icon icon="tabler:edit-filled" className="size-6" />
                  <span>My profile</span>
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
