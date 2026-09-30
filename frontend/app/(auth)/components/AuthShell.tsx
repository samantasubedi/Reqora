"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "@/components/others/Navbar";
import { Reveal } from "@/components/landing/Reveal";
import { LedgerCard, TicketDivider } from "@/components/landing/LedgerCard";

const brandPoints = [
  {
    title: "One queue for every request",
    text: "Employees request, managers approve, admins allocate — nothing lost in inboxes.",
  },
  {
    title: "Item-level truth",
    text: "Each unit tracked as available, in use, or under maintenance, with location.",
  },
  {
    title: "Join in minutes",
    text: "Create a workspace as admin or join your team with a code or email invite.",
  },
];

type AuthShellProps = {
  badge: string;
  title: ReactNode;
  subtitle: string;
  switchPrompt: string;
  switchLabel: string;
  switchHref: string;
  children: ReactNode;
};

export function AuthShell({
  badge,
  title,
  subtitle,
  switchPrompt,
  switchLabel,
  switchHref,
  children,
}: AuthShellProps) {
  return (
    <div className="ledger-paper relative flex min-h-screen flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[var(--stamp)]/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />
      </div>

      <main className="relative z-10 flex flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            {/* Brand panel */}
            <Reveal className="hidden lg:block">
              <LedgerCard className="relative flex h-full flex-col overflow-hidden p-8">
                <div className="relative">
                  <span className="inline-flex items-center rounded-xl border border-[var(--ledger-line)] bg-[var(--stamp)]/10 px-3 py-2">
                    <Image
                      src="/reqoraLogo.png"
                      width={140}
                      height={40}
                      alt="Reqora"
                      className="h-8 w-auto"
                    />
                  </span>
                  <p className="font-display mt-6 text-2xl font-semibold tracking-tight text-balance text-foreground">
                    Resource requests, tracked to delivery.
                  </p>
                  <p className="mt-2 font-medium text-muted-foreground">
                    The request platform for modern teams.
                  </p>
                  <ul className="mt-8 space-y-5">
                    {brandPoints.map((point) => (
                      <li key={point.title} className="flex gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--stamp)]/12 text-[var(--stamp)]">
                          <Check className="size-3.5" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-foreground">
                            {point.title}
                          </span>
                          <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                            {point.text}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </LedgerCard>
            </Reveal>

            {/* Form card */}
            <Reveal delay={0.08}>
              <LedgerCard className="flex h-full flex-col p-6 sm:p-8">
                <p>
                  <span className="font-ledger inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--stamp)]/60 px-3 py-1 text-xs font-semibold text-[var(--stamp)]">
                    <span aria-hidden className="size-1.5 rounded-full bg-[var(--stamp)]" />
                    {badge}
                  </span>
                </p>
                <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 font-medium text-muted-foreground">{subtitle}</p>

                <div className="mt-6 flex-1">{children}</div>

                <TicketDivider className="mt-6 px-0" />
                <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
                  {switchPrompt}{" "}
                  <Link
                    href={switchHref}
                    className="font-bold text-[var(--stamp)] hover:underline"
                  >
                    {switchLabel}
                  </Link>
                </p>
              </LedgerCard>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}
