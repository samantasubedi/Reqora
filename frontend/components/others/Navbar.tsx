"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import ThemeToggler from "../global/ThemeToggler";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Building2, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          setRole(response.data.role ?? "");
        }
      } catch {
        // Not logged in - show Sign In.
      }
      setIsChecking(false);
    };
    checkLoginStatus();
  }, [backendUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = username
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/logout`, null, {
        withCredentials: true,
      });
    } catch {
      // Ignore logout errors - clear local state anyway.
    }
    setIsLoggedIn(false);
    setUsername("");
    setRole("");
    setDropdownOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  const goToDashboard = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    router.push(`/${role}/dashboard`);
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

        {isLanding && (
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
        )}

        <div className="flex items-center gap-3 md:gap-10">
          <ThemeToggler />

          {!isChecking &&
            (isLoggedIn ? (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-label="Account menu"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {initials || "U"}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-11 w-52 overflow-hidden rounded-xl border bg-card shadow-lg">
                    <div className="border-b px-4 py-3">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {username}
                      </p>
                      {role && (
                        <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                          {role}
                        </p>
                      )}
                    </div>
                    <div className="p-1.5">
                      {role && (
                        <button
                          onClick={goToDashboard}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <LayoutDashboard className="size-4 text-muted-foreground" />
                          Dashboard
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut className="size-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

          <div className="flex flex-col gap-2 border-t p-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-1 pb-1">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {initials || "U"}
                  </span>
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
                  className="cursor-pointer border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
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