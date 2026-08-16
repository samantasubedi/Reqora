import React from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const handleThemeChange = () => {
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div>
      <Button onClick={handleThemeChange}>{theme == "dark" ? "change to light" : "change to dark"}</Button>
    </div>
  );
};

export default ThemeToggler;
