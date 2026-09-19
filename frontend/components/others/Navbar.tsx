"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import ThemeToggler from "../global/ThemeToggler";
import { Button } from "../ui/button";

import {
  Boxes,
  Building2,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type ProfileAvatarProps = {
  initials?: string;
  className?: string;
};

const ProfileAvatar = ({ initials = "", className = "" }: ProfileAvatarProps) => {
  // TODO: swap the initials placeholder for the user's profile image once
  // a profile-picture field is available.
  const profileImage = "";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-primary to-primary/70 text-primary-foreground ${className}`}
    >
      {profileImage ? (
        <Image
          src={profileImage}
          alt="Profile avatar"
          width={80}
          height={80}
          className="size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center text-xs font-bold tracking-wide">
          {initials || "U"}
        </span>
      )}
    </span>
  );
};

type NavLink = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

const getRoleLinks = (role: string): NavLink[] => {
  switch (role) {
    case "manager":
      return [
        { label: "Dashboard", href: "/manager/dashboard", Icon: LayoutDashboard },
        { label: "Requests", href: "/manager/requests", Icon: ClipboardList },
        { label: "Resources", href: "/manager/resources", Icon: Boxes },
      ];
    case "employee":
      return [
        { label: "Dashboard", href: "/employee/dashboard", Icon: LayoutDashboard },
        { label: "My Requests", href: "/employee/myrequests", Icon: ClipboardList },
        { label: "Request Resource", href: "/employee/request", Icon: PlusCircle },
      ];
    default:
      return [];
  }
};

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const isLanding = pathname === "/";

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.post(`${backendUrl}/isloggedin`, null, {
          withCredentials: true,
        });
        if (response.data.code === "LOGGEDIN") {
          setIsLoggedIn(true);
          setUsername(response.data.username ?? "");
          setEmail(response.data.email ?? "");
          setRole(response.data.role ?? "");
        }
      } catch {
        // Not logged in - show Sign In.
      }
      setIsChecking(false);
    };
    checkLoginStatus();
  }, [backendUrl]);

  const initials = username
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const roleLinks = getRoleLinks(role);

  const isActiveLink = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendUrl}/logout`, null, {
        withCredentials: true,
      });
      toast.success(response.data.message);
    } catch {
      // Logout endpoint needs a valid access token; clear local state anyway.
    } finally {
      setIsLoggedIn(false);
      setUsername("");
      setEmail("");
      setRole("");
      setMenuOpen(false);
      router.push("/");
    }
  };

  const goToDashboard = () => {
    setMenuOpen(false);
    if (role) router.push(`/${role}/dashboard`);
  };

  const scrollToSection = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Go to home"
          className="shrink-0 cursor-pointer"
        >
          <Image
            src="/reqoraLogo.png"
            width={500}
            height={500}
            alt="Reqora logo"
            className="h-18 w-auto"
          />
        </button>

        {isLanding ? (
          <div className="hidden shrink-0 items-center gap-8 md:flex">
            <button
              onClick={scrollToSection("features")}
              className="cursor-pointer text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
            >
              Features
            </button>
            <button
              onClick={scrollToSection("how")}
              className="cursor-pointer text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
            >
              How it works
            </button>
          </div>
        ) : (
          !isChecking &&
          isLoggedIn &&
          roleLinks.length > 0 && (
            <div className="hidden shrink-0 items-center gap-1 md:flex">
              {roleLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => router.push(link.href)}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-primary"
                    }`}
                  >
                    <link.Icon className="size-4" />
                    {link.label}
                  </button>
                );
              })}
            </div>
          )
        )}

        <div className="flex items-center gap-3 md:gap-10">
          <ThemeToggler />

          {!isChecking &&
            (isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Account menu"
                    className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted sm:pr-3"
                  >
                    <ProfileAvatar initials={initials} className="size-9" />
                    <span className="hidden max-w-28 truncate text-sm font-semibold text-foreground sm:inline">
                      {username || "Account"}
                    </span>
                    <ChevronDown className="hidden size-4 text-muted-foreground sm:inline" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5">
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-3 rounded-lg px-2 py-2.5">
                      <ProfileAvatar initials={initials} className="size-11" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {username}
                        </p>
                        {email && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {email}
                          </p>
                        )}
                        {role && (
                          <span className="mt-1.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold capitalize text-primary">
                            {role}
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {role && (
                    <DropdownMenuItem
                      onClick={goToDashboard}
                      className="cursor-pointer"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}

                  {role && <DropdownMenuSeparator />}

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="hidden cursor-pointer md:inline-flex"
              >
                Sign In
              </Button>
            ))}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="cursor-pointer md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t md:hidden">
          {isLanding && (
            <div className="flex flex-col gap-1 p-4">
              <button
                onClick={(e) => {
                  scrollToSection("features")(e);
                  setMenuOpen(false);
                }}
                className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
              >
                Features
              </button>
              <button
                onClick={(e) => {
                  scrollToSection("how")(e);
                  setMenuOpen(false);
                }}
                className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
              >
                How it works
              </button>
            </div>
          )}

          {!isLanding && roleLinks.length > 0 && (
            <div className="flex flex-col gap-1 border-t p-4">
              {roleLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <button
                    key={link.href}
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(link.href);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-primary"
                    }`}
                  >
                    <link.Icon className="size-4" />
                    {link.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-2 border-t p-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-1 pb-1">
                  <ProfileAvatar initials={initials} className="size-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {username}
                    </p>
                    {role && (
                      <p className="text-xs capitalize text-muted-foreground">
                        {role}
                      </p>
                    )}
                  </div>
                </div>

                {role && (
                  <Button onClick={goToDashboard} className="cursor-pointer">
                    <Building2 className="size-4" />
                    Go to Dashboard
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="cursor-pointer! border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/login");
                }}
                className="cursor-pointer"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;