"use client";
import React, { ReactNode, useMemo } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClientProviderWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default queryClientProviderWrapper;
