"use client";
import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};
