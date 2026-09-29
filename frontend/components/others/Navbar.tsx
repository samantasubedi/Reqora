"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import Image from "next/image";
import ThemeToggler from "../global/ThemeToggler";
import { Button } from "../ui/button";

import {
  ArrowRight,
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
        const response = await api.post(`/isloggedin`, null);
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
  }, []);
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
      const response = await api.post(`/logout`, null);
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
    <header className="sticky top-0 z-50 border-b border-[var(--ledger-line)] bg-[var(--paper)]/85 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
          <div className="hidden shrink-0 items-center gap-7 text-sm font-semibold md:flex">
            <button
              onClick={scrollToSection("features")}
              className="cursor-pointer text-foreground/60 transition-colors hover:text-[var(--stamp)]"
            >
              Ledger
            </button>
            <button
              onClick={scrollToSection("how")}
              className="cursor-pointer text-foreground/60 transition-colors hover:text-[var(--stamp)]"
            >
              Workflow
            </button>
            <button
              onClick={scrollToSection("roles")}
              className="cursor-pointer text-foreground/60 transition-colors hover:text-[var(--stamp)]"
            >
              Workspaces
            </button>
            <button
              onClick={scrollToSection("faq")}
              className="cursor-pointer text-foreground/60 transition-colors hover:text-[var(--stamp)]"
            >
              FAQ
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

        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggler />

          {isLanding && !isChecking && !isLoggedIn && (
            <button
              type="button"
              onClick={() => router.push("/getstarted")}
              className="relative hidden cursor-pointer items-center gap-0 overflow-hidden rounded-lg bg-[var(--ink)] text-sm font-bold text-[var(--paper)] shadow-md transition-all hover:brightness-125 md:inline-flex"
            >
              {/* ticket-stub perforation */}
              <span
                aria-hidden
                className="absolute top-1 bottom-1 left-9 border-l border-dashed border-[var(--paper)]/50"
              />
              <span aria-hidden className="absolute -top-1.5 left-[27px] size-3 rounded-full bg-background" />
              <span aria-hidden className="absolute -bottom-1.5 left-[27px] size-3 rounded-full bg-background" />
              <span className="font-ledger px-2.5 text-[11px] font-bold tracking-widest">
                REQ
              </span>
              <span className="flex items-center gap-1.5 py-2 pr-3.5 pl-1">
                Get Started
                <ArrowRight className="size-4" />
              </span>
            </button>
          )}

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
                variant="outline"
                onClick={() => router.push("/login")}
                className="hidden cursor-pointer font-semibold md:inline-flex"
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
              <button
                onClick={(e) => {
                  scrollToSection("roles")(e);
                  setMenuOpen(false);
                }}
                className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
              >
                Roles
              </button>
              <button
                onClick={(e) => {
                  scrollToSection("faq")(e);
                  setMenuOpen(false);
                }}
                className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
              >
                FAQ
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
              <>
                <Button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/getstarted");
                  }}
                  className="cursor-pointer bg-[var(--ink)] font-semibold text-[var(--paper)] shadow-md hover:brightness-125"
                >
                  Get Started
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/login");
                  }}
                  className="cursor-pointer"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;