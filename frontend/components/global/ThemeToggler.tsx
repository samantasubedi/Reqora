import React from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const handleThemeChange = () => {
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  const isDark = theme === "dark";

  return (
    <div className="m-5">
      <button
        role="switch"
        onClick={handleThemeChange}
        className={cn(
          "relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ease-in-out",

          isDark ? "bg-slate-900 " : "bg-green-100 ",
        )}
      >
        <Icon
          icon="ant-design:moon-filled"
          className={cn(
            "absolute right-1.5 transition-opacity duration-300",
            isDark ? "opacity-40 text-[#2DD4A7]" : "opacity-0",
          )}
        ></Icon>
        <Icon
          icon="akar-icons:sun-fill"
          className={cn(
            "absolute left-1.5 transition-opacity duration-300",
            isDark ? "opacity-0" : "opacity-40 text-[#0F766E]",
          )}
        ></Icon>
        <span
          className={cn(
            "inline-flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-in-out",
            isDark ? "translate-x-9 bg-[#0F241F]" : "translate-x-1 bg-white",
          )}
        >
          {isDark ? (
            <Icon icon="ant-design:moon-filled" className="text-[#0F766E]" />
          ) : (
            <Icon icon="akar-icons:sun-fill" className="text-[#2DD4A7]" />
          )}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggler;
