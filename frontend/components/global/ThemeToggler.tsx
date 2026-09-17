import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const handleThemeChange = () => {
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div className="h-7 w-14" />;
  }
  const isDark = theme === "dark";
  return (
    <button
      role="switch"
      aria-checked={isDark}
      onClick={handleThemeChange}
      className={cn(
        "relative inline-flex h-7 w-14 items-center rounded-full bg-muted transition-colors duration-300",

        isDark && "bg-foreground/15",
      )}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5">
        <Icon
          icon="akar-icons:sun-fill"
          className={cn(
            "size-3 transition-opacity duration-300",
            isDark ? "opacity-0" : "opacity-40 text-primary",
          )}
        />
        <Icon
          icon="ant-design:moon-filled"
          className={cn(
            "size-3 transition-opacity duration-300",
            isDark ? "opacity-60 text-primary" : "opacity-0",
          )}
        />
      </span>
      <span
        className={cn(
          "inline-flex size-6 transform items-center justify-center rounded-full bg-background shadow-md transition-transform duration-300",
          isDark ? "translate-x-9" : "translate-x-1",
        )}
      >
        {isDark ? (
          <Icon icon="ant-design:moon-filled" className="size-3.5 text-primary" />
        ) : (
          <Icon
            icon="akar-icons:sun-fill"
            className="size-3.5 text-primary"
          />
        )}
      </span>
    </button>
  );
};

export default ThemeToggler;