"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "@/components/others/Navbar";
import { Reveal } from "@/components/landing/Reveal";
import { StepsIndicator } from "./StepsIndicator";
import { cn } from "@/lib/utils";

type GetStartedShellProps = {
  badge: string;
  title: ReactNode;
  subtitle: string;
  step: 1 | 2 | 3;
  backHref?: string;
  backLabel?: string;
  aside?: ReactNode;
  maxWidth?: "max-w-3xl" | "max-w-4xl" | "max-w-5xl" | "max-w-6xl";
  children: ReactNode;
};

export function GetStartedShell({
  badge,
  title,
  subtitle,
  step,
  backHref = "/",
  backLabel = "Back to home",
  aside,
  maxWidth = "max-w-5xl",
  children,
}: GetStartedShellProps) {
  return (
    <div className="ledger-paper relative flex min-h-screen flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[var(--stamp)]/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />
      </div>

      <main className="relative z-10 flex flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className={cn("mx-auto w-full space-y-8", maxWidth)}>
          {/* Only step-back links render here — the Navbar logo already goes home. */}
          {backHref !== "/" && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-[var(--stamp)]"
            >
              <ArrowLeft className="size-4" />
              {backLabel}
            </Link>
          )}

          <Reveal className="space-y-5 text-center">
            <p>
              <span className="font-ledger inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--stamp)]/60 px-3 py-1 text-xs font-semibold text-[var(--stamp)]">
                <span aria-hidden className="size-1.5 rounded-full bg-[var(--stamp)]" />
                {badge}
              </span>
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mx-auto max-w-xl font-medium text-muted-foreground">
              {subtitle}
            </p>
            <StepsIndicator current={step} />
          </Reveal>

          {aside ? (
            <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Reveal className="lg:sticky lg:top-24">{aside}</Reveal>
              <Reveal delay={0.08}>{children}</Reveal>
            </div>
          ) : (
            <Reveal delay={0.08}>{children}</Reveal>
          )}
        </div>
      </main>
    </div>
  );
}
