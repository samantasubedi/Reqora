"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import React from "react";

const page = () => {
  const { setTheme } = useTheme();
  return (
    <>
      <div className="text-mycolor">hello this is admin resource page</div>
      <Button onClick={() => setTheme("dark")}>Dark</Button>
      <Button onClick={() => setTheme("light")}>Light</Button>
    </>
  );
};

export default page;
