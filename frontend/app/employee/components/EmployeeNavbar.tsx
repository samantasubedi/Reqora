"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Boxes,
  PackageCheck,
  UserRound,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import ThemeToggler from "@/components/global/ThemeToggler";
import LogoutDialog from "@/app/admin/components/LogoutDialog";
import axios from "axios";
import { toast } from "react-toastify";

const NAV_ITEMS: {
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Dashboard",
    href: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Requests",
    href: "/employee/requests",
    icon: ClipboardList,
  },
  {
    label: "Resources",
    href: "/employee/resources",
    icon: Boxes,
  },
  {
    label: "My Resources",
    href: "/employee/my-resources",
    icon: PackageCheck,
  },
];

const EmployeeNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/employee/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLeave = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      const response = await axios.post(`${backendUrl}/leave`, null, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (err: any) {
      console.log(err);
      if (err.response.data) {
        const { message, success } = err.response.data;
        if (!success) {
          toast.error(message);
        }
      }
    }
  };

  const renderNavLinks = () =>
    NAV_ITEMS.map((item) => {
      const active = isActive(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
        <Link
          href="/employee/dashboard"
          className="flex items-center gap-2"
        >
          <Image
            src="/reqoraLogo.png"
            width={500}
            height={500}
            alt="logo"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggler />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Account menu"
              >
                <Icon icon="codicon:account" className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 space-y-1 p-2">
              <DropdownMenuLabel className="font-semibold">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Button
                variant={"secondary"}
                className="min-w-full flex gap-2 justify-start cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <UserRound className="size-4" />
                <span className="font-semibold">My Profile</span>
              </Button>
              <Button
                variant={"secondary"}
                className="min-w-full flex gap-2 justify-start cursor-pointer hover:bg-muted"
                onClick={handleLeave}
              >
                <Building2 className="size-4" />
                <span className="font-semibold">Leave Company</span>
              </Button>
              <LogoutDialog />
            </DropdownMenuContent>
          </DropdownMenu>

          </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
        {renderNavLinks()}
      </nav>
    </header>
  );
};

export default EmployeeNavbar;