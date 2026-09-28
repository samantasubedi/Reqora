import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-expect-error
import "./globals.css";
import { ToastContainer } from "react-toastify";
import QueryClientProviderWrapper from "@/components/providers/QueryClientProviderWrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProviderWrapper } from "@/components/providers/ThemeProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reqora — Resource Request Platform for Modern Teams",
  description:
    "Request, approve, and track every company resource in one place. Role-based approvals, item-level tracking, and department workspaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {" "}
        <ThemeProviderWrapper>
          <QueryClientProviderWrapper>
            <ToastContainer />
            <SidebarProvider className="block">{children}</SidebarProvider>
          </QueryClientProviderWrapper>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
